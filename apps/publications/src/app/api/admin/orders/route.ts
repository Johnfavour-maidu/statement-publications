import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const FIRST_NAMES = [
  "Adebayo", "Chinwe", "Emeka", "Fatima", "Grace", "Hassan", "Ifeanyi", "Jumoke",
  "Kemi", "Lukman", "Mfoniso", "Ngozi", "Obinna", "Precious", "Rashidat", "Sade",
  "Tunde", "Uche", "Vivian", "Yusuf", "Zainab", "Abiodun", "Blessing", "Chidi",
  "Doris", "Eunice", "Felix", "Gloria", "Henry", "Ibukunoluwa", "James", "Kubra",
  "Lekan", "Maryam", "Nnamdi", "Omolara", "Peter", "Remi", "Sola", "Titi",
  "Udo", "Victoria", "Wale", "Yetunde", "Zubairu", "Adaeze", "Bolaji", "Chiamaka",
  "David", "Esther", "Franklin", "Halima", "Ifeoma", "Jide", "Kehinde", "Lara",
  "Moses", "Nneka", "Olaoluwa", "Priscilla", "Rotimi", "Shade", "Tochukwu", "Ucheoma",
  "Victor", "Wunmi", "Xavier", "Yemi", "Zara", "Afolabi", "Bukola", "Chika",
  "Daniel", "Elizabeth", "Femi", "Ibrahim", "Joy", "Kenneth", "Lydia", "Michael",
  "Nkiru", "Oluwatosin", "Patience", "Sunday", "Titilayo", "Umar", "Williams", "Yakubu",
];

const LAST_NAMES = [
  "Ogundimu", "Eze", "Nwosu", "Abubakar", "Okafor", "Aliyu", "Chukwu", "Adeyemi",
  "Oladipo", "Ibrahim", "Udo", "Okonkwo", "Abiodun", "Bello", "Williams", "Bakare",
  "Nnamdi", "Okoro", "Abdullahi", "Mohammed", "Akindele", "Okadigbo", "Nwachukwu",
  "Uche", "Ogunleye", "Oyekanmi", "Nwankwo", "Adewale", "Taiwo", "Okorie",
  "Suleiman", "Oyediran", "Azikiwe", "Adesanya", "Okafor", "Ogunbiyi", "Ajayi",
  "Afolabi", "Essien", "Balogun", "Lawal", "Musa", "Okoli", "Adekunle", "Obi",
];

const COUNTRIES = [
  "Nigeria", "Nigeria", "Nigeria", "Nigeria", "Nigeria", "Nigeria",
  "Ghana", "Ghana", "Kenya", "South Africa", "United Kingdom", "United States",
];

const SERVICES = [
  { name: "Editing", count: 52, priceRange: [150, 450] },
  { name: "Cover Design", count: 38, priceRange: [200, 350] },
  { name: "Interior Formatting", count: 31, priceRange: [100, 250] },
  { name: "Publishing Assistance", count: 28, priceRange: [500, 1250] },
  { name: "Marketing Package", count: 26, priceRange: [800, 1750] },
  { name: "ISBN Registration", count: 21, priceRange: [75, 150] },
  { name: "Author Website", count: 12, priceRange: [1000, 1850] },
  { name: "Book Trailer", count: 9, priceRange: [400, 950] },
];

const PACKAGES: Record<string, string[]> = {
  "Editing": ["Basic Editing", "Premium Editing", "Developmental Editing", "Line Editing"],
  "Cover Design": ["Standard Cover", "Premium Cover", "Illustrated Cover", "Photography Cover"],
  "Interior Formatting": ["Ebook Formatting", "Print Formatting", "Full Package Formatting"],
  "Publishing Assistance": ["Self-Publishing Guide", "Full Publishing Support", "Hybrid Publishing"],
  "Marketing Package": ["Starter Marketing", "Growth Marketing", "Premium Marketing", "Enterprise Marketing"],
  "ISBN Registration": ["Single ISBN", "ISBN Bundle (5)", "ISBN Bundle (10)"],
  "Author Website": ["Landing Page", "Full Website", "E-Commerce Website"],
  "Book Trailer": ["Basic Trailer", "Cinematic Trailer", "Animated Trailer"],
};

const STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "REFUNDED"] as const;
type OrderStatus = typeof STATUSES[number];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateDemoOrders() {
  const rand = seededRandom(123);
  const orders: Array<{
    orderNumber: string;
    authorName: string;
    authorEmail: string;
    country: string;
    serviceName: string;
    package: string;
    amount: number;
    status: OrderStatus;
    createdAt: string;
    paymentStatus: string;
  }> = [];

  const statusDistribution: OrderStatus[] = [
    ...Array(34).fill("PENDING"),
    ...Array(58).fill("IN_PROGRESS"),
    ...Array(109).fill("COMPLETED"),
    ...Array(11).fill("CANCELLED"),
    ...Array(5).fill("REFUNDED"),
  ];

  for (let i = 0; i < 217; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[i % LAST_NAMES.length];
    const authorName = `${first} ${last}`;
    const authorEmail = `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`;
    const country = COUNTRIES[Math.floor(rand() * COUNTRIES.length)];

    const serviceIdx = (() => {
      let cumulative = 0;
      for (let j = 0; j < SERVICES.length; j++) {
        cumulative += SERVICES[j].count;
        if (i < cumulative) return j;
      }
      return SERVICES.length - 1;
    })();
    const service = SERVICES[serviceIdx];
    const pkgList = PACKAGES[service.name];
    const pkg = pkgList[Math.floor(rand() * pkgList.length)];
    const amount = service.priceRange[0] + Math.floor(rand() * (service.priceRange[1] - service.priceRange[0]));

    const status = statusDistribution[i];

    const dayOffset = i >= 197 ? Math.floor(rand() * 60) : Math.floor(rand() * 365);
    const date = new Date(2026, 5, 17);
    date.setDate(date.getDate() - dayOffset);
    const createdAt = date.toISOString().split("T")[0];

    const paymentStatus = status === "COMPLETED" ? "PAID" :
      status === "REFUNDED" ? "REFUNDED" :
      status === "CANCELLED" ? "CANCELLED" : "PENDING";

    const orderNum = `SP-${String(2024 + Math.floor(dayOffset / 365))}-${String(i + 1).padStart(4, "0")}`;

    orders.push({
      orderNumber: orderNum,
      authorName, authorEmail, country,
      serviceName: service.name,
      package: pkg,
      amount,
      status,
      createdAt,
      paymentStatus,
    });
  }

  return orders;
}

const DEMO_ORDERS = generateDemoOrders();

const demoModifications = new Map<string, Partial<typeof DEMO_ORDERS[0]>>();

function buildDemoOrders(
  search: string,
  status: string,
  service: string,
  dateFilter: string,
  page: number,
  pageSize: number,
) {
  let filtered = DEMO_ORDERS.map((o, i) => {
    const mod = demoModifications.get(`demo-order-${i + 1}`);
    return mod ? { ...o, ...mod } : o;
  });

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((o) =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.authorName.toLowerCase().includes(q) ||
      o.authorEmail.toLowerCase().includes(q) ||
      o.serviceName.toLowerCase().includes(q)
    );
  }

  if (status && status !== "all") {
    filtered = filtered.filter((o) => o.status === status);
  }

  if (service && service !== "all") {
    filtered = filtered.filter((o) => o.serviceName === service);
  }

  if (dateFilter && dateFilter !== "all") {
    const now = new Date();
    const cutoff = new Date();
    switch (dateFilter) {
      case "today": cutoff.setDate(now.getDate() - 1); break;
      case "week": cutoff.setDate(now.getDate() - 7); break;
      case "month": cutoff.setMonth(now.getMonth() - 1); break;
      case "year": cutoff.setFullYear(now.getFullYear() - 1); break;
    }
    if (dateFilter !== "all") {
      filtered = filtered.filter((o) => new Date(o.createdAt) >= cutoff);
    }
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  const items = paged.map((o, idx) => ({
    id: `demo-order-${start + idx + 1}`,
    orderNumber: o.orderNumber,
    status: o.status,
    subtotal: o.amount,
    discount: 0,
    tax: 0,
    total: o.amount,
    currency: "USD",
    paymentMethod: "paystack",
    createdAt: o.createdAt + "T10:00:00.000Z",
    user: { name: o.authorName, email: o.authorEmail, country: o.country },
    serviceName: o.serviceName,
    package: o.package,
    paymentStatus: o.paymentStatus,
  }));

  const allStats = DEMO_ORDERS.map((o, i) => {
    const mod = demoModifications.get(`demo-order-${i + 1}`);
    return mod ? { ...o, ...mod } : o;
  });

  const stats = {
    totalOrders: allStats.length,
    pending: allStats.filter((o) => o.status === "PENDING").length,
    inProgress: allStats.filter((o) => o.status === "IN_PROGRESS").length,
    completed: allStats.filter((o) => o.status === "COMPLETED").length,
    cancelled: allStats.filter((o) => o.status === "CANCELLED").length,
    refunded: allStats.filter((o) => o.status === "REFUNDED").length,
    totalRevenue: allStats.filter((o) => o.status === "COMPLETED").reduce((sum, o) => sum + o.amount, 0),
    avgOrderValue: Math.round(allStats.filter((o) => o.status === "COMPLETED").reduce((sum, o) => sum + o.amount, 0) / Math.max(1, allStats.filter((o) => o.status === "COMPLETED").length)),
  };

  return { items, total, stats };
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSizeParam = searchParams.get("pageSize") || "20";
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const service = searchParams.get("service") || "";
    const dateFilter = searchParams.get("dateFilter") || "";
    const allMode = pageSizeParam === "all";
    const pageSize = allMode ? 500 : parseInt(pageSizeParam);

    const demo = buildDemoOrders(search, status, service, dateFilter, page, pageSize);

    return NextResponse.json({
      success: true,
      data: {
        items: demo.items,
        total: demo.total,
        stats: demo.stats,
        page,
        pageSize,
        totalPages: Math.ceil(demo.total / pageSize),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, status: newStatus } = body;

    if (orderId && orderId.startsWith("demo-order-")) {
      const idx = parseInt(orderId.replace("demo-order-", "")) - 1;
      if (idx >= 0 && idx < DEMO_ORDERS.length) {
        const current = demoModifications.get(orderId) || {};
        demoModifications.set(orderId, { ...current, status: newStatus });
        return NextResponse.json({ success: true, message: "Order updated" });
      }
    }

    if (orderId && newStatus) {
      await prisma.order.update({ where: { id: orderId }, data: { status: newStatus } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/admin/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, orderIds, status: newStatus } = body;

    if (action === "bulkUpdate" && Array.isArray(orderIds)) {
      for (const orderId of orderIds) {
        if (orderId.startsWith("demo-order-")) {
          const idx = parseInt(orderId.replace("demo-order-", "")) - 1;
          if (idx >= 0 && idx < DEMO_ORDERS.length) {
            const current = demoModifications.get(orderId) || {};
            demoModifications.set(orderId, { ...current, status: newStatus });
          }
        } else {
          await prisma.order.update({ where: { id: orderId }, data: { status: newStatus } });
        }
      }
      return NextResponse.json({ success: true, message: `${orderIds.length} orders updated` });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to process orders" }, { status: 500 });
  }
}
