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

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};

    if (status && ["PAID", "PENDING", "PROCESSING"].includes(status)) {
      where.status = status;
    }

    const [royalties, total] = await Promise.all([
      prisma.royalty.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.royalty.count({ where }),
    ]);

    const authorIds = [...new Set(royalties.map((r) => r.authorId))];
    const bookIds = [
      ...new Set(royalties.map((r) => r.bookId).filter(Boolean) as string[]),
    ];

    const [authorProfiles, books] = await Promise.all([
      prisma.authorProfile.findMany({
        where: { id: { in: authorIds } },
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      bookIds.length > 0
        ? prisma.book.findMany({
            where: { id: { in: bookIds } },
            select: {
              id: true,
              title: true,
            },
          })
        : [],
    ]);

    const authorMap = new Map(
      authorProfiles.map((ap) => [
        ap.id,
        { name: ap.user.name, email: ap.user.email },
      ])
    );
    const bookMap = new Map(books.map((b) => [b.id, { title: b.title }]));

    const enrichedRoyalties = royalties.map((royalty) => ({
      ...royalty,
      author: authorMap.get(royalty.authorId) || null,
      book: royalty.bookId ? bookMap.get(royalty.bookId) || null : null,
    }));

    const [totalPaid, totalPending, totalCommissions, authorsCount] =
      await Promise.all([
        prisma.royalty.aggregate({
          where: { status: "PAID" },
          _sum: { amount: true },
        }),
        prisma.royalty.aggregate({
          where: { status: "PENDING" },
          _sum: { amount: true },
        }),
        prisma.royalty.aggregate({
          _sum: { commission: true },
        }),
        prisma.royalty.findMany({
          select: { authorId: true },
          distinct: ["authorId"],
        }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        items: enrichedRoyalties,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        summary: {
          totalPaid: totalPaid._sum.amount || 0,
          totalPending: totalPending._sum.amount || 0,
          totalCommissions: totalCommissions._sum.commission || 0,
          authorsCount: authorsCount.length,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/admin/royalties error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch royalties" },
      { status: 500 }
    );
  }
}
