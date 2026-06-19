import { NextRequest, NextResponse } from "next/server";

type Period = "30d" | "90d" | "6m" | "12m" | "all";

const VALID_PERIODS: Period[] = ["30d", "90d", "6m", "12m", "all"];

function trimMonthly<T>(data: T[], period: Period): T[] {
  switch (period) {
    case "30d":
      return data.slice(-2);
    case "90d":
      return data.slice(-3);
    case "6m":
      return data.slice(-6);
    case "12m":
    case "all":
      return data;
    default:
      return data;
  }
}

function getRevenue(period: Period) {
  const monthlyData = [
    { month: "Jan", revenue: 48000000 },
    { month: "Feb", revenue: 52000000 },
    { month: "Mar", revenue: 55000000 },
    { month: "Apr", revenue: 58000000 },
    { month: "May", revenue: 61000000 },
    { month: "Jun", revenue: 59000000 },
    { month: "Jul", revenue: 63000000 },
    { month: "Aug", revenue: 65000000 },
    { month: "Sep", revenue: 67000000 },
    { month: "Oct", revenue: 70000000 },
    { month: "Nov", revenue: 72000000 },
    { month: "Dec", revenue: 68500000 },
  ];

  return {
    currentValue: 68500000,
    previousValue: 61200000,
    growth: 11.9,
    sparkline: [5200000, 5400000, 5800000, 6100000, 5900000, 6300000, 6500000, 6850000],
    monthlyData: trimMonthly(monthlyData, period),
  };
}

function getAuthorGrowth(period: Period) {
  const monthlyData = [
    { month: "Jan", authors: 120, verified: 98 },
    { month: "Feb", authors: 128, verified: 105 },
    { month: "Mar", authors: 135, verified: 112 },
    { month: "Apr", authors: 142, verified: 118 },
    { month: "May", authors: 148, verified: 125 },
    { month: "Jun", authors: 152, verified: 130 },
    { month: "Jul", authors: 156, verified: 135 },
    { month: "Aug", authors: 164, verified: 142 },
    { month: "Sep", authors: 170, verified: 148 },
    { month: "Oct", authors: 175, verified: 155 },
    { month: "Nov", authors: 179, verified: 160 },
    { month: "Dec", authors: 179, verified: 164 },
  ];

  return {
    currentValue: 179,
    previousValue: 156,
    growth: 14.7,
    sparkline: [120, 128, 135, 142, 148, 152, 156, 164, 170, 175, 179],
    monthlyData: trimMonthly(monthlyData, period),
  };
}

function getPublishedBooks(period: Period) {
  const monthlyData = [
    { month: "Jan", books: 280, pending: 12 },
    { month: "Feb", books: 295, pending: 10 },
    { month: "Mar", books: 310, pending: 11 },
    { month: "Apr", books: 325, pending: 8 },
    { month: "May", books: 338, pending: 9 },
    { month: "Jun", books: 345, pending: 10 },
    { month: "Jul", books: 355, pending: 7 },
    { month: "Aug", books: 365, pending: 9 },
    { month: "Sep", books: 372, pending: 8 },
    { month: "Oct", books: 380, pending: 10 },
    { month: "Nov", books: 384, pending: 9 },
    { month: "Dec", books: 387, pending: 9 },
  ];

  return {
    currentValue: 387,
    previousValue: 342,
    growth: 13.2,
    sparkline: [280, 295, 310, 325, 338, 345, 355, 365, 372, 380, 387],
    monthlyData: trimMonthly(monthlyData, period),
  };
}

function getServiceOrders(period: Period) {
  const monthlyData = [
    { month: "Jan", orders: 145, completed: 120, pending: 25 },
    { month: "Feb", orders: 152, completed: 130, pending: 22 },
    { month: "Mar", orders: 160, completed: 138, pending: 22 },
    { month: "Apr", orders: 168, completed: 145, pending: 23 },
    { month: "May", orders: 175, completed: 152, pending: 23 },
    { month: "Jun", orders: 180, completed: 158, pending: 22 },
    { month: "Jul", orders: 189, completed: 165, pending: 24 },
    { month: "Aug", orders: 195, completed: 170, pending: 25 },
    { month: "Sep", orders: 200, completed: 178, pending: 22 },
    { month: "Oct", orders: 208, completed: 185, pending: 23 },
    { month: "Nov", orders: 213, completed: 190, pending: 23 },
    { month: "Dec", orders: 217, completed: 195, pending: 22 },
  ];

  return {
    currentValue: 217,
    previousValue: 189,
    growth: 14.8,
    sparkline: [145, 152, 160, 168, 175, 180, 189, 195, 200, 208, 217],
    monthlyData: trimMonthly(monthlyData, period),
  };
}

function getSupportRequests() {
  return {
    currentValue: 25,
    previousValue: 32,
    growth: -21.9,
    sparkline: [38, 35, 32, 30, 28, 27, 26, 25],
    categoryBreakdown: [
      { category: "Publishing Support", count: 8, percentage: 32 },
      { category: "Service Orders", count: 6, percentage: 24 },
      { category: "Royalties & Payments", count: 4, percentage: 16 },
      { category: "Account Issues", count: 3, percentage: 12 },
      { category: "Technical Support", count: 2, percentage: 8 },
      { category: "General Enquiries", count: 2, percentage: 8 },
    ],
    statusBreakdown: [
      { status: "Open", count: 25 },
      { status: "In Progress", count: 12 },
      { status: "Resolved", count: 156 },
      { status: "Closed", count: 89 },
    ],
  };
}

function getVerification(period: Period) {
  const monthlyData = [
    { month: "Jan", verified: 98, unverified: 22 },
    { month: "Feb", verified: 105, unverified: 23 },
    { month: "Mar", verified: 112, unverified: 23 },
    { month: "Apr", verified: 118, unverified: 24 },
    { month: "May", verified: 125, unverified: 23 },
    { month: "Jun", verified: 130, unverified: 22 },
    { month: "Jul", verified: 135, unverified: 21 },
    { month: "Aug", verified: 142, unverified: 22 },
    { month: "Sep", verified: 148, unverified: 22 },
    { month: "Oct", verified: 155, unverified: 20 },
    { month: "Nov", verified: 160, unverified: 19 },
    { month: "Dec", verified: 164, unverified: 15 },
  ];

  return {
    currentValue: 164,
    previousValue: 148,
    growth: 10.8,
    sparkline: [98, 105, 112, 118, 125, 130, 135, 142, 148, 155, 160, 164],
    verified: 164,
    unverified: 15,
    verificationRate: 91.6,
    monthlyData: trimMonthly(monthlyData, period),
  };
}

function getRevenueByService() {
  return {
    services: [
      { name: "Editing", revenue: 18500000, percentage: 27, orders: 62 },
      { name: "Cover Design", revenue: 14200000, percentage: 20.7, orders: 48 },
      { name: "Formatting", revenue: 10800000, percentage: 15.8, orders: 38 },
      { name: "Marketing", revenue: 9500000, percentage: 13.9, orders: 28 },
      { name: "ISBN Registration", revenue: 7200000, percentage: 10.5, orders: 22 },
      { name: "Publishing Packages", revenue: 8300000, percentage: 12.1, orders: 19 },
    ],
  };
}

function getBooksByCategory() {
  return {
    categories: [
      { name: "Business & Entrepreneurship", count: 52, percentage: 13.4 },
      { name: "Self Development", count: 45, percentage: 11.6 },
      { name: "Personal Finance", count: 38, percentage: 9.8 },
      { name: "Leadership", count: 35, percentage: 9 },
      { name: "Technology", count: 30, percentage: 7.8 },
      { name: "Health & Wellness", count: 28, percentage: 7.2 },
      { name: "Religion & Inspiration", count: 26, percentage: 6.7 },
      { name: "Biography", count: 22, percentage: 5.7 },
      { name: "Romance", count: 20, percentage: 5.2 },
      { name: "Mystery & Thriller", count: 18, percentage: 4.7 },
      { name: "Education", count: 15, percentage: 3.9 },
      { name: "Other", count: 58, percentage: 15 },
    ],
  };
}

function getTopAuthors() {
  return {
    authors: [
      { name: "Adebayo Ogundimu", booksPublished: 18, revenue: 4200000, royalties: 840000, serviceOrders: 12 },
      { name: "Chinwe Eze", booksPublished: 15, revenue: 3800000, royalties: 760000, serviceOrders: 10 },
      { name: "Emeka Nwosu", booksPublished: 14, revenue: 3500000, royalties: 700000, serviceOrders: 9 },
      { name: "Maryam Bello", booksPublished: 13, revenue: 3200000, royalties: 640000, serviceOrders: 8 },
      { name: "Sade Williams", booksPublished: 12, revenue: 2900000, royalties: 580000, serviceOrders: 8 },
      { name: "Ifeanyi Chukwu", booksPublished: 11, revenue: 2700000, royalties: 540000, serviceOrders: 7 },
      { name: "Rotimi Amaechi", booksPublished: 11, revenue: 2600000, royalties: 520000, serviceOrders: 7 },
      { name: "Felix Oyekanmi", booksPublished: 10, revenue: 2400000, royalties: 480000, serviceOrders: 6 },
      { name: "Lukman Ibrahim", booksPublished: 10, revenue: 2300000, royalties: 460000, serviceOrders: 6 },
      { name: "Victoria Nwosu", booksPublished: 10, revenue: 2200000, royalties: 440000, serviceOrders: 6 },
    ],
  };
}

type ModuleName =
  | "revenue"
  | "authorGrowth"
  | "publishedBooks"
  | "serviceOrders"
  | "supportRequests"
  | "verification"
  | "revenueByService"
  | "booksByCategory"
  | "topAuthors";

const VALID_MODULES: ModuleName[] = [
  "revenue",
  "authorGrowth",
  "publishedBooks",
  "serviceOrders",
  "supportRequests",
  "verification",
  "revenueByService",
  "booksByCategory",
  "topAuthors",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const periodParam = (searchParams.get("period") || "12m") as Period;
  const moduleParam = searchParams.get("module") as ModuleName | null;

  const period: Period = VALID_PERIODS.includes(periodParam) ? periodParam : "12m";

  if (moduleParam && !VALID_MODULES.includes(moduleParam)) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid module. Must be one of: ${VALID_MODULES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const getModuleData = (name: ModuleName) => {
    switch (name) {
      case "revenue":
        return getRevenue(period);
      case "authorGrowth":
        return getAuthorGrowth(period);
      case "publishedBooks":
        return getPublishedBooks(period);
      case "serviceOrders":
        return getServiceOrders(period);
      case "supportRequests":
        return getSupportRequests();
      case "verification":
        return getVerification(period);
      case "revenueByService":
        return getRevenueByService();
      case "booksByCategory":
        return getBooksByCategory();
      case "topAuthors":
        return getTopAuthors();
      default:
        return null;
    }
  };

  if (moduleParam) {
    return NextResponse.json({
      success: true,
      data: {
        [moduleParam]: getModuleData(moduleParam),
      },
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      revenue: getRevenue(period),
      authorGrowth: getAuthorGrowth(period),
      publishedBooks: getPublishedBooks(period),
      serviceOrders: getServiceOrders(period),
      supportRequests: getSupportRequests(),
      verification: getVerification(period),
      revenueByService: getRevenueByService(),
      booksByCategory: getBooksByCategory(),
      topAuthors: getTopAuthors(),
    },
  });
}
