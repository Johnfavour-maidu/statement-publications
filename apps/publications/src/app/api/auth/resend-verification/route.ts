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

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Account not found. Please check your email address or create a new account." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "This email is already verified. You can sign in." },
        { status: 400 }
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
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #8A6A4A; font-size: 24px; margin: 0;">Statement Publications</h1>
              </div>
              <div style="background-color: #FDF6EE; border-radius: 12px; padding: 32px;">
                <h2 style="color: #1D1D1D; font-size: 20px; margin: 0 0 16px;">Verify Your Email</h2>
                <p style="color: #5C4A3D; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                  Hi ${user.name || "there"},
                </p>
                <p style="color: #5C4A3D; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                  Please verify your email address by clicking the button below:
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a
                    href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${token}"
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
                    Verify My Email
                  </a>
                </div>
                <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0 0 8px;">
                  This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
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
      { message: "Verification email sent. Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
