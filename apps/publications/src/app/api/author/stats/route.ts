import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
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

    let authorProfile;
    try {
      authorProfile = await prisma.authorProfile.findUnique({
        where: { userId },
      });
    } catch {
      authorProfile = null;
    }

    if (!authorProfile) {
      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalBooks: 0,
            publishedBooks: 0,
            draftBooks: 0,
            underReviewBooks: 0,
            rejectedBooks: 0,
            totalSales: 0,
            totalRevenue: 0,
            revenueThisMonth: 0,
            pendingPayouts: 0,
          },
          monthlyRevenue: [],
          recentActivity: [],
        },
      });
    }

    const authorId = authorProfile.id;

    const [totalBooks, publishedBooks, draftBooks, underReviewBooks, rejectedBooks, royaltyAgg, pendingAgg, thisMonthAgg, totalSales] =
      await Promise.all([
        prisma.book.count({ where: { authorId } }),
        prisma.book.count({ where: { authorId, status: "PUBLISHED" } }),
        prisma.book.count({ where: { authorId, status: "DRAFT" } }),
        prisma.book.count({
          where: { authorId, status: { in: ["UNDER_REVIEW", "SUBMITTED"] } },
        }),
        prisma.book.count({ where: { authorId, status: "REJECTED" } }),
        prisma.royalty.aggregate({
          where: { authorId, status: "paid" },
          _sum: { amount: true },
        }).catch(() => ({ _sum: { amount: 0 } })),
        prisma.royalty.aggregate({
          where: { authorId, status: "pending" },
          _sum: { amount: true },
        }).catch(() => ({ _sum: { amount: 0 } })),
        prisma.royalty.aggregate({
          where: { authorId, period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}` },
          _sum: { amount: true },
        }).catch(() => ({ _sum: { amount: 0 } })),
        prisma.order.count({
          where: {
            items: { some: { book: { authorId } } },
          },
        }).catch(() => 0),
      ]);

    const totalRevenue = royaltyAgg._sum.amount || 0;
    const pendingPayouts = pendingAgg._sum.amount || 0;
    const revenueThisMonth = thisMonthAgg._sum.amount || 0;

    const monthlyRevenue = (() => {
      const months: Array<{ month: string; revenue: number; sales: number }> = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        months.push({ month: key, revenue: 0, sales: 0 });
      }
      return months;
    })();

    const recentActivity = [
      { id: "1", type: "info", title: "Welcome to Statement", description: "Your author dashboard is ready.", createdAt: new Date().toISOString() },
    ];

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalBooks,
          publishedBooks,
          draftBooks,
          underReviewBooks,
          rejectedBooks,
          totalSales,
          totalRevenue,
          revenueThisMonth,
          pendingPayouts,
        },
        monthlyRevenue,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("GET /api/author/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
