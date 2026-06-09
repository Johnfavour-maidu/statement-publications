import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { books: true } },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
