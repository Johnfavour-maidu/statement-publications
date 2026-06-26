import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please fill in all fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser && (existingUser.role === "AUTHOR" || existingUser.role === "ADMIN" || existingUser.role === "SUPER_ADMIN")) {
      return NextResponse.json(
        { message: "An account already exists with this email address" },
        { status: 409 }
      );
    }

    if (existingUser && existingUser.role === "READER") {
      return NextResponse.json(
        { message: "This email is associated with a Reader account. Please use the Statement Books platform to sign in." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "AUTHOR",
        isVerified: false,
        emailVerified: null,
      },
    });

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token,
        expires,
      },
    });

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Statement Publications <noreply@statementpublications.com>",
          to: email,
          subject: "Verify Your Statement Publications Account",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #8B5E3C; text-align: center;">Welcome to Statement Publications!</h1>
              <p style="color: #4A3728; font-size: 16px; line-height: 1.6;">
                Hi ${name},
              </p>
              <p style="color: #4A3728; font-size: 16px; line-height: 1.6;">
                Thank you for creating an account. Please verify your email address by clicking the button below:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a
                  href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${token}"
                  style="
                    background-color: #C8A951;
                    color: #4A3728;
                    padding: 14px 32px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 16px;
                    display: inline-block;
                  "
                >
                  Verify Email
                </a>
              </div>
              <p style="color: #888; font-size: 14px; line-height: 1.6;">
                This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
              </p>
            </div>
          `,
        });
      }
    } catch (e) {
      console.log("Email sending skipped:", e);
    }

    return NextResponse.json(
      { message: "Account created. Please check your email to verify." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
