import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: {
          include: { user: { select: { id: true, name: true, image: true, bio: true } } },
        },
        category: true,
        reviews: {
          where: { isVisible: true },
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    console.error("GET /api/books/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      );
    }

    if (book.author.userId !== session.user.id && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title, subtitle, description, categoryId, isbn, language,
      pageCount, publicationDate, publisher, edition, coverImage,
      manuscriptFile, epubFile, audiobookFile, format, price,
      discountPrice, currency, royaltyRate, tags, isPublic, isFeatured,
    } = body;

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(categoryId !== undefined && { categoryId }),
        ...(isbn !== undefined && { isbn }),
        ...(language && { language }),
        ...(pageCount !== undefined && { pageCount }),
        ...(publicationDate && { publicationDate: new Date(publicationDate) }),
        ...(publisher !== undefined && { publisher }),
        ...(edition !== undefined && { edition }),
        ...(coverImage !== undefined && { coverImage }),
        ...(manuscriptFile !== undefined && { manuscriptFile }),
        ...(epubFile !== undefined && { epubFile }),
        ...(audiobookFile !== undefined && { audiobookFile }),
        ...(format && { format }),
        ...(price !== undefined && { price }),
        ...(discountPrice !== undefined && { discountPrice }),
        ...(currency && { currency }),
        ...(royaltyRate !== undefined && { royaltyRate }),
        ...(tags && { tags }),
        ...(isPublic !== undefined && { isPublic }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
      include: {
        author: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedBook });
  } catch (error) {
    console.error("PUT /api/books/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      );
    }

    if (book.author.userId !== session.user.id && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.book.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Book deleted" });
  } catch (error) {
    console.error("DELETE /api/books/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
