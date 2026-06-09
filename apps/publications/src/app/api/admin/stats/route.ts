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

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalBooks,
      totalOrders,
      totalRevenue,
      pendingBooks,
      publishedBooks,
      newUsersThisMonth,
      revenueThisMonth,
      recentOrders,
      topBooks,
      usersByRole,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.book.count(),
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.book.count({ where: { status: "SUBMITTED" } }),
      prisma.book.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.order.findMany({
        where: { status: "COMPLETED" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { book: { select: { title: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.book.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { totalSales: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          totalSales: true,
          totalRevenue: true,
          averageRating: true,
        },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: true,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalBooks,
          totalOrders,
          totalRevenue: totalRevenue._sum.amount || 0,
          pendingBooks,
          publishedBooks,
          newUsersThisMonth,
          revenueThisMonth: revenueThisMonth._sum.amount || 0,
        },
        recentOrders,
        topBooks,
        usersByRole: usersByRole.map((item) => ({
          role: item.role,
          count: item._count,
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
