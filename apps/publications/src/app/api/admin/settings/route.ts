import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

let platformSettings = {
  name: "Statement Publications",
  tagline: "Discover African Literature at Its Finest",
  description: "A leading digital publishing platform connecting African authors with readers worldwide.",
  supportEmail: "support@statementpub.com",
};

let paymentSettings = {
  stripeEnabled: true,
  paypalEnabled: true,
  mobileMoneyEnabled: true,
  bankTransferEnabled: true,
  minimumPayout: 50,
  payoutSchedule: "monthly",
  autoPayout: true,
};

let emailSettings = {
  welcomeEmail: true,
  orderConfirmation: true,
  bookApproval: true,
  royaltyPaid: true,
  withdrawalUpdate: true,
  newsletter: true,
  marketingEmails: false,
  smtpHost: "smtp.statementpub.com",
  smtpPort: "587",
};

let commissionRates = {
  standardRate: 20,
  premiumAuthorRate: 15,
  audiobookRate: 25,
  printRate: 20,
  premiumThreshold: 50,
};

let featureToggles = {
  audiobooks: true,
  printOnDemand: false,
  affiliateProgram: true,
  authorVerification: true,
  bookRecommendations: true,
  socialFeatures: true,
  darkMode: true,
  betaFeatures: false,
};

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
        platform: platformSettings,
        payment: paymentSettings,
        email: emailSettings,
        commission: commissionRates,
        features: featureToggles,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    if (body.platform) platformSettings = { ...platformSettings, ...body.platform };
    if (body.payment) paymentSettings = { ...paymentSettings, ...body.payment };
    if (body.email) emailSettings = { ...emailSettings, ...body.email };
    if (body.commission) commissionRates = { ...commissionRates, ...body.commission };
    if (body.features) featureToggles = { ...featureToggles, ...body.features };

    return NextResponse.json({
      success: true,
      data: {
        platform: platformSettings,
        payment: paymentSettings,
        email: emailSettings,
        commission: commissionRates,
        features: featureToggles,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
