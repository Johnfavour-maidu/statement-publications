import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get("pageSize") || "20", 10)));
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (status && ["PENDING", "PROCESSING", "COMPLETED", "FAILED"].includes(status)) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.withdrawal.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/withdrawals error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { withdrawalId, status, gatewayRef } = body;

    if (!withdrawalId || !status) {
      return NextResponse.json(
        { success: false, error: "withdrawalId and status are required" },
        { status: 400 }
      );
    }

    if (!["COMPLETED", "FAILED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "status must be COMPLETED or FAILED" },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { success: false, error: "Withdrawal not found" },
        { status: 404 }
      );
    }

    if (withdrawal.status === "COMPLETED" || withdrawal.status === "FAILED") {
      return NextResponse.json(
        { success: false, error: "Withdrawal has already been processed" },
        { status: 400 }
      );
    }

    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status,
        gatewayRef: gatewayRef || withdrawal.gatewayRef,
        processedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedWithdrawal,
    });
  } catch (error) {
    console.error("PUT /api/admin/withdrawals error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
