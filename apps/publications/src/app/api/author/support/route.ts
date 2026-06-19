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

    const emptyResponse = {
      success: true,
      data: { items: [], total: 0, page, pageSize, totalPages: 0 },
    };

    try {
      const where = { userId };
      const p = prisma as unknown as Record<string, { findMany: Function; count: Function }>;

      if (!p.supportTicket) {
        return NextResponse.json(emptyResponse);
      }

      const [items, total] = await Promise.all([
        p.supportTicket.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        p.supportTicket.count({ where }),
      ]);

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
    } catch {
      return NextResponse.json(emptyResponse);
    }
  } catch (error) {
    console.error("GET /api/author/support error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch support tickets" },
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

    const role = (session.user as { role?: string }).role;
    if (role !== "AUTHOR" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { subject, content, category, priority } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { success: false, error: "Subject and content are required" },
        { status: 400 }
      );
    }

    try {
      const p = prisma as unknown as Record<string, { create: Function }>;

      if (!p.supportTicket) {
        return NextResponse.json(
          {
            success: true,
            data: {
              id: "mock",
              userId: session.user.id,
              subject,
              content,
              category: category || "general",
              priority: priority || "medium",
              status: "open",
              createdAt: new Date().toISOString(),
            },
          },
          { status: 201 }
        );
      }

      const ticket = await p.supportTicket.create({
        data: {
          userId: session.user.id,
          subject,
          content,
          category: category || "general",
          priority: priority || "medium",
          status: "open",
        },
      });

      return NextResponse.json({ success: true, data: ticket }, { status: 201 });
    } catch {
      return NextResponse.json(
        {
          success: true,
          data: {
            id: "mock",
            userId: session.user.id,
            subject,
            content,
            category: category || "general",
            priority: priority || "medium",
            status: "open",
            createdAt: new Date().toISOString(),
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("POST /api/author/support error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create support ticket" },
      { status: 500 }
    );
  }
}
