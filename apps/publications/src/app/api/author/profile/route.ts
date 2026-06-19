import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
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

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          phone: true,
          socialLinks: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          authorProfile: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: user });
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to fetch profile" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("GET /api/author/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
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

    const role = (session.user as { role?: string }).role;
    if (role !== "AUTHOR" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, bio, penName, website, socialLinks, genres } = body;

    try {
      const userUpdate: Record<string, unknown> = {};
      if (name !== undefined) userUpdate.name = name;
      if (bio !== undefined) userUpdate.bio = bio;
      if (socialLinks !== undefined) userUpdate.socialLinks = socialLinks;

      if (Object.keys(userUpdate).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: userUpdate,
        });
      }

      let authorProfile;
      try {
        authorProfile = await prisma.authorProfile.findUnique({ where: { userId } });
      } catch {
        authorProfile = null;
      }

      if (authorProfile) {
        const profileUpdate: Record<string, unknown> = {};
        if (penName !== undefined) profileUpdate.penName = penName;
        if (website !== undefined) profileUpdate.website = website;
        if (socialLinks !== undefined) profileUpdate.socialLinks = socialLinks;
        if (genres !== undefined) profileUpdate.genre = genres;

        if (Object.keys(profileUpdate).length > 0) {
          await prisma.authorProfile.update({
            where: { userId },
            data: profileUpdate,
          });
        }
      } else {
        await prisma.authorProfile.create({
          data: {
            userId,
            penName: penName || null,
            website: website || null,
            socialLinks: socialLinks || null,
            genre: genres || [],
          },
        });
      }

      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          phone: true,
          socialLinks: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          authorProfile: true,
        },
      });

      return NextResponse.json({ success: true, data: updatedUser });
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to update profile" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("PUT /api/author/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
