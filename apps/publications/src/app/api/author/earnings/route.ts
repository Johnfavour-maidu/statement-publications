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
    const period = searchParams.get("period");

    const where: Record<string, unknown> = { authorId: userId };

    if (period) {
      where.period = period;
    }

    let items: unknown[] = [];
    let total = 0;

    try {
      [items, total] = await Promise.all([
        prisma.royalty.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.royalty.count({ where }),
      ]);
    } catch {
      items = [];
      total = 0;
    }

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    let totalEarned = 0;
    let totalPending = 0;
    let totalPaid = 0;
    let thisMonth = 0;

    try {
      const [earned, pending, paid, monthData] = await Promise.all([
        prisma.royalty.aggregate({ where: { authorId: userId }, _sum: { amount: true } }),
        prisma.royalty.aggregate({ where: { authorId: userId, status: "pending" }, _sum: { amount: true } }),
        prisma.royalty.aggregate({ where: { authorId: userId, status: "paid" }, _sum: { amount: true } }),
        prisma.royalty.aggregate({ where: { authorId: userId, period: currentMonth }, _sum: { amount: true } }),
      ]);
      totalEarned = earned._sum.amount || 0;
      totalPending = pending._sum.amount || 0;
      totalPaid = paid._sum.amount || 0;
      thisMonth = monthData._sum.amount || 0;
    } catch {
      // summary stays at 0
    }

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        summary: {
          totalEarned,
          totalPending,
          totalPaid,
          thisMonth,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/author/earnings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch earnings" },
      { status: 500 }
    );
  }
}
