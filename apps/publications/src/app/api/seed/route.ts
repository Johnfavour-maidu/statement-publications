import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();
    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = [
      { email: "admin@statementpublications.com", name: "Admin User", password: "admin123", role: "ADMIN" },
      { email: "sarah.chen@statementpub.com", name: "Sarah Chen", password: "author123", role: "AUTHOR" },
      { email: "ame.okafor@statementpub.com", name: "Ame Okafor", password: "author123", role: "AUTHOR" },
    ];

    const results = [];

    for (const acct of accounts) {
      const existing = await prisma.user.findUnique({ where: { email: acct.email } });
      if (existing) {
        const hashed = await hash(acct.password, 12);
        await prisma.user.update({
          where: { email: acct.email },
          data: { password: hashed, emailVerified: new Date(), isActive: true },
        });
        results.push({ email: acct.email, action: "updated" });
      } else {
        const hashed = await hash(acct.password, 12);
        await prisma.user.create({
          data: {
            email: acct.email,
            name: acct.name,
            password: hashed,
            role: acct.role as "ADMIN" | "AUTHOR",
            emailVerified: new Date(),
            isActive: true,
          },
        });
        results.push({ email: acct.email, action: "created" });
      }
    }

    return NextResponse.json({ message: "Seed complete", results });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
