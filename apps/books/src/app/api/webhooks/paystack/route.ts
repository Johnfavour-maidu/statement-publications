import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "Paystack not configured" },
        { status: 503 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing signature" },
        { status: 400 }
      );
    }

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case "charge.success": {
        const data = event.data;
        const reference = data.reference;

        const payment = await prisma.payment.findFirst({
          where: { reference },
        });

        if (payment && payment.status !== "COMPLETED") {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "COMPLETED",
              paidAt: new Date(data.paid_at),
              gatewayRef: data.id?.toString(),
            },
          });

          if (payment.orderId) {
            await prisma.order.update({
              where: { id: payment.orderId },
              data: { status: "COMPLETED", paymentStatus: "COMPLETED" },
            });

            const order = await prisma.order.findUnique({
              where: { id: payment.orderId },
              include: { items: true },
            });

            if (order) {
              for (const item of order.items) {
                await prisma.book.update({
                  where: { id: item.bookId },
                  data: {
                    totalSales: { increment: item.quantity },
                    totalRevenue: { increment: item.price * item.quantity },
                  },
                });
              }
            }
          }
        }
        break;
      }

      case "charge.failed": {
        const failedData = event.data;
        const failedRef = failedData.reference;

        const failedPayment = await prisma.payment.findFirst({
          where: { reference: failedRef },
        });

        if (failedPayment) {
          await prisma.payment.update({
            where: { id: failedPayment.id },
            data: { status: "FAILED" },
          });
        }
        break;
      }

      case "refund.processed": {
        const refundData = event.data;
        const refundedPayment = await prisma.payment.findFirst({
          where: { gatewayRef: refundData.id?.toString() },
        });

        if (refundedPayment) {
          await prisma.payment.update({
            where: { id: refundedPayment.id },
            data: { status: "REFUNDED" },
          });

          if (refundedPayment.orderId) {
            await prisma.order.update({
              where: { id: refundedPayment.orderId },
              data: { status: "REFUNDED", paymentStatus: "REFUNDED" },
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
