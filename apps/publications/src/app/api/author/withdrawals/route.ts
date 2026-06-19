import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "AUTHOR" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get("pageSize") || "10", 10)));
    const status = searchParams.get("status");

    const where: Record<string, unknown> = { userId };

    if (status && ["PENDING", "PROCESSING", "COMPLETED", "FAILED"].includes(status)) {
      where.status = status;
    }

    let items: unknown[] = [];
    let total = 0;

    try {
      [items, total] = await Promise.all([
        prisma.withdrawal.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.withdrawal.count({ where }),
      ]);
    } catch {
      items = [];
      total = 0;
    }

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
    console.error("GET /api/author/withdrawals error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "AUTHOR" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { amount, method, accountDetails } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "A valid amount is required" },
        { status: 400 }
      );
    }

    let wallet;
    try {
      wallet = await prisma.wallet.findUnique({ where: { userId } });
    } catch {
      wallet = null;
    }

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: "No wallet found. Please set up your wallet first." },
        { status: 400 }
      );
    }

    if (wallet.balance < amount) {
      return NextResponse.json(
        { success: false, error: "Insufficient balance" },
        { status: 400 }
      );
    }

    let withdrawal;
    try {
      withdrawal = await prisma.withdrawal.create({
        data: {
          walletId: wallet.id,
          userId,
          amount,
          method: method || "bank_transfer",
          bankName: accountDetails?.bankName || null,
          accountNumber: accountDetails?.accountNumber || null,
          accountName: accountDetails?.accountName || null,
          bankCode: accountDetails?.bankCode || null,
          status: "PENDING",
        },
      });
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to create withdrawal request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: withdrawal }, { status: 201 });
  } catch (error) {
    console.error("POST /api/author/withdrawals error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create withdrawal request" },
      { status: 500 }
    );
  }
}
