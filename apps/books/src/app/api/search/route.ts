import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    if (!q || q.length < 2) {
      return NextResponse.json(
        { success: false, error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const results: Record<string, unknown[]> = {};

    if (type === "all" || type === "books") {
      results.books = await prisma.book.findMany({
        where: {
          isPublic: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { tags: { has: q } },
          ],
        },
        include: {
          author: {
            include: { user: { select: { name: true, image: true } } },
          },
          category: { select: { name: true, slug: true } },
        },
        take: 10,
        orderBy: { totalSales: "desc" },
      });
    }

    if (type === "all" || type === "authors") {
      results.authors = await prisma.authorProfile.findMany({
        where: {
          OR: [
            { penName: { contains: q, mode: "insensitive" } },
            { bio: { contains: q, mode: "insensitive" } },
            { user: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        include: {
          user: { select: { id: true, name: true, image: true, bio: true } },
          _count: { select: { books: true } },
        },
        take: 10,
      });
    }

    if (type === "all" || type === "blog") {
      results.blog = await prisma.blogPost.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
            { tags: { has: q } },
          ],
        },
        include: {
          author: { select: { name: true, image: true } },
        },
        take: 10,
        orderBy: { viewCount: "desc" },
      });
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
