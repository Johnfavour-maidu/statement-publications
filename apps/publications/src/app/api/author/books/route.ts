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

    const authorProfile = await prisma.authorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!authorProfile) {
      return NextResponse.json(
        { success: false, error: "Author profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: Record<string, unknown> = {
      authorId: authorProfile.id,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const orderBy: Record<string, string> = {};
    if (sortBy === "title") orderBy.title = sortOrder;
    else if (sortBy === "price") orderBy.price = sortOrder;
    else if (sortBy === "rating") orderBy.averageRating = sortOrder;
    else if (sortBy === "sales") orderBy.totalSales = sortOrder;
    else if (sortBy === "revenue") orderBy.totalRevenue = sortOrder;
    else orderBy.createdAt = sortOrder;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.book.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: books,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("GET /api/author/books error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
