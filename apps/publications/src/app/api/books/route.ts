import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const authorId = searchParams.get("authorId") || "";
    const status = searchParams.get("status") || "";
    const format = searchParams.get("format") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const isFeatured = searchParams.get("isFeatured");
    const isBestseller = searchParams.get("isBestseller");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: Record<string, unknown> = {
      isPublic: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;
    if (status) where.status = status;
    if (format) where.format = format;
    if (isFeatured === "true") where.isFeatured = true;
    if (isBestseller === "true") where.isBestseller = true;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }

    const orderBy: Record<string, string> = {};
    if (sortBy === "title") orderBy.title = sortOrder;
    else if (sortBy === "price") orderBy.price = sortOrder;
    else if (sortBy === "rating") orderBy.averageRating = sortOrder;
    else if (sortBy === "sales") orderBy.totalSales = sortOrder;
    else orderBy.createdAt = sortOrder;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          author: {
            include: { user: { select: { id: true, name: true, image: true } } },
          },
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
    console.error("GET /api/books error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch books" },
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

    const body = await request.json();
    const {
      title, subtitle, description, categoryId, isbn, language,
      pageCount, publicationDate, publisher, edition, coverImage,
      manuscriptFile, epubFile, audiobookFile, format, price,
      discountPrice, currency, royaltyRate, tags,
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
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

    let slug = slugify(title);
    const existingSlug = await prisma.book.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const book = await prisma.book.create({
      data: {
        title,
        slug,
        subtitle: subtitle || null,
        description: description || null,
        authorId: authorProfile.id,
        categoryId: categoryId || null,
        isbn: isbn || null,
        language: language || "English",
        pageCount: pageCount || null,
        publicationDate: publicationDate ? new Date(publicationDate) : null,
        publisher: publisher || null,
        edition: edition || null,
        coverImage: coverImage || null,
        manuscriptFile: manuscriptFile || null,
        epubFile: epubFile || null,
        audiobookFile: audiobookFile || null,
        format: format || "EBOOK",
        price: price || 0,
        discountPrice: discountPrice || null,
        currency: currency || "USD",
        royaltyRate: royaltyRate || 70,
        tags: tags || [],
      },
      include: {
        author: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: book }, { status: 201 });
  } catch (error) {
    console.error("POST /api/books error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create book" },
      { status: 500 }
    );
  }
}
