import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { bookId: id, isVisible: true },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.review.count({ where: { bookId: id, isVisible: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: reviews,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("GET /api/books/[id]/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { rating, title, content } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      );
    }

    const existingReview = await prisma.review.findUnique({
      where: { userId_bookId: { userId: session.user.id, bookId: id } },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: "You have already reviewed this book" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        bookId: id,
        rating,
        title: title || null,
        content: content || null,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    const stats = await prisma.review.aggregate({
      where: { bookId: id, isVisible: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.book.update({
      where: { id },
      data: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating,
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error("POST /api/books/[id]/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    );
  }
}
