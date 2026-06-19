import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Please enter your email address." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Account not found. Please check your email address or create a new account." },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "Your account has been temporarily suspended. Please contact support." },
        { status: 403 }
      );
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: email.toLowerCase() },
    });

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

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
          subject: "Reset Your Statement Publications Password",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #8A6A4A; font-size: 24px; margin: 0;">Statement Publications</h1>
              </div>
              <div style="background-color: #FDF6EE; border-radius: 12px; padding: 32px;">
                <h2 style="color: #1D1D1D; font-size: 20px; margin: 0 0 16px;">Reset Your Password</h2>
                <p style="color: #5C4A3D; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                  We received a request to reset the password for your account associated with <strong>${email}</strong>.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a
                    href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}"
                    style="
                      background-color: #D8B27A;
                      color: #1D1D1D;
                      padding: 14px 32px;
                      text-decoration: none;
                      border-radius: 8px;
                      font-weight: bold;
                      font-size: 16px;
                      display: inline-block;
                    "
                  >
                    Reset Password
                  </a>
                </div>
                <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0 0 8px;">
                  This link will expire in 1 hour for security purposes.
                </p>
                <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0;">
                  If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
              </div>
              <div style="text-align: center; margin-top: 24px; padding: 16px;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                  Need help? Contact us at <a href="mailto:support@statementpublications.com" style="color: #8A6A4A;">support@statementpublications.com</a>
                </p>
                <p style="color: #aaa; font-size: 11px; margin: 8px 0 0;">
                  Statement Publications — From Manuscript to Marketplace
                </p>
              </div>
            </div>
          `,
        });
      }
    } catch (e) {
      console.log("Email sending skipped:", e);
    }

    return NextResponse.json(
      { message: "If an account exists with that email, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
