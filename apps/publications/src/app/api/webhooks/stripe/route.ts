import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-05-27.dahlia",
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: "Stripe not configured" },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { success: false, error: "Missing signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const payment = await prisma.payment.findFirst({
          where: { reference: paymentIntent.id },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "COMPLETED",
              paidAt: new Date(),
              gatewayRef: paymentIntent.id,
            },
          });

          if (payment.orderId) {
            await prisma.order.update({
              where: { id: payment.orderId },
              data: { status: "COMPLETED", paymentStatus: "COMPLETED" },
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        const failedPayment = await prisma.payment.findFirst({
          where: { reference: failedIntent.id },
        });

        if (failedPayment) {
          await prisma.payment.update({
            where: { id: failedPayment.id },
            data: { status: "FAILED" },
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const refundedPayment = await prisma.payment.findFirst({
          where: { gatewayRef: charge.id },
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
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
