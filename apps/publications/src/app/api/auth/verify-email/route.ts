import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 }
      );
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { message: "Verification token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Statement Publications <noreply@statementpublications.com>",
          to: user.email,
          subject: "Welcome to Statement Publications",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #8A6A4A; font-size: 24px; margin: 0;">Statement Publications</h1>
              </div>
              <div style="background-color: #FDF6EE; border-radius: 12px; padding: 32px;">
                <h2 style="color: #1D1D1D; font-size: 20px; margin: 0 0 16px;">Welcome to Statement Publications!</h2>
                <p style="color: #5C4A3D; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                  Thank you for verifying your account, ${user.name || "there"}! Your account is now fully activated.
                </p>
                <p style="color: #5C4A3D; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                  Here&apos;s what you can do with Statement Publications:
                </p>
                <ul style="color: #5C4A3D; font-size: 16px; line-height: 1.8; margin: 0 0 24px; padding-left: 20px;">
                  <li><strong>Publishing Services</strong> — Professional editing, cover design, and formatting</li>
                  <li><strong>Author Dashboard</strong> — Track your books, earnings, and analytics</li>
                  <li><strong>Royalties</strong> — Earn up to 80% on book sales</li>
                  <li><strong>Distribution</strong> — Reach readers on Amazon, Apple Books, and more</li>
                  <li><strong>Support</strong> — Our team is here to help you succeed</li>
                </ul>
                <div style="text-align: center; margin: 32px 0;">
                  <a
                    href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/author/dashboard"
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
                    Go To Dashboard
                  </a>
                </div>
                <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0;">
                  If you have any questions, feel free to reach out to our support team at <a href="mailto:support@statementpublications.com" style="color: #8A6A4A;">support@statementpublications.com</a>.
                </p>
              </div>
              <div style="text-align: center; margin-top: 24px; padding: 16px;">
                <p style="color: #aaa; font-size: 11px; margin: 0;">
                  Statement Publications — From Manuscript to Marketplace
                </p>
              </div>
            </div>
          `,
        });
      }
    } catch (e) {
      console.log("Welcome email sending skipped:", e);
    }

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
