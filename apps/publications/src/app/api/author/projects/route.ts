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

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    let items: unknown[] = [];
    let total = 0;

    try {
      const authorBooks = await prisma.book.findMany({
        where: { author: { userId } },
        select: { id: true },
      });
      const bookIds = authorBooks.map((b) => b.id);

      if (bookIds.length > 0) {
        const orderWhere = {
          ...where,
          items: { some: { bookId: { in: bookIds } } },
        };

        [items, total] = await Promise.all([
          prisma.order.findMany({
            where: orderWhere,
            include: {
              items: {
                include: {
                  book: { select: { id: true, title: true, authorId: true } },
                },
              },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
          prisma.order.count({ where: orderWhere }),
        ]);
      }
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
    console.error("GET /api/author/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
