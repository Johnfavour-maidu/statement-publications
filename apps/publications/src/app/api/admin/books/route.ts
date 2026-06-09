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
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const authorId = searchParams.get("authorId") || "";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { isbn: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (authorId) where.authorId = authorId;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          author: {
            include: { user: { select: { id: true, name: true, email: true, image: true } } },
          },
          category: true,
        },
        orderBy: { createdAt: "desc" },
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
    console.error("GET /api/admin/books error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { bookId, action, rejectionReason } = body;

    if (!bookId || !action) {
      return NextResponse.json(
        { success: false, error: "bookId and action are required" },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    };

    if (action === "approve") {
      updateData.status = "APPROVED";
      updateData.isPublic = true;
    } else if (action === "reject") {
      updateData.status = "REJECTED";
      updateData.rejectionReason = rejectionReason || null;
    } else if (action === "publish") {
      updateData.status = "PUBLISHED";
      updateData.isPublic = true;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: updateData,
      include: {
        author: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: book.authorId,
        type: action === "reject" ? "BOOK_REJECTED" : "BOOK_APPROVED",
        title: action === "reject" ? "Book Rejected" : "Book Approved",
        message: action === "reject"
          ? `Your book "${book.title}" has been rejected. ${rejectionReason || ""}`
          : `Your book "${book.title}" has been ${action === "publish" ? "published" : "approved"}.`,
      },
    });

    return NextResponse.json({ success: true, data: updatedBook });
  } catch (error) {
    console.error("PUT /api/admin/books error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update book" },
      { status: 500 }
    );
  }
}
