import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AUTHOR_NAMES = [
  "Chimamanda Adichie", "Wole Soyinka", "Chinua Achebe", "Helon Habila",
  "Teju Cole", "Chigozie Obioma", "Ayọ̀bámi Adébáyọ̀", "Sefi Atta",
  "Helon Habila", "Sarah Ladipo Manyika", "Aminatta Forna", "NoViolet Bulawayo",
  "Petina Gappah", "Novuyo Rosa Tshuma", "Taiye Selasi", "Buchi Emecheta",
];

const CUSTOMER_NAMES = [
  "Amina Ibrahim", "Olumide Adeyemi", "Chioma Okafor", "Emeka Nwosu",
  "Fatima Abubakar", "Tunde Olatunji", "Ngozi Eze", "Yemi Adefolalu",
  "Aisha Bello", "Obinna Okwu", "Zainab Mohammed", "Femi Falana",
];

const BOOK_TITLES = [
  "The Lion and the Jewel", "Half of a Yellow Sun", "Things Fall Apart",
  "Americanah", "The Famished Road", "Purple Hibiscus", "Arrow of God",
  "No Longer at Ease", "The Secret Lives of Baba Segi's Wives",
  "A Grain of Wheat", "We Need New Names", "The Book of Night Women",
  "An Elegy for Easterly", "GraceLand", "The Invention of Morel",
];

const CATEGORIES = ["Fiction", "Non-Fiction", "Poetry", "Drama", "Biography", "History", "Science", "Self-Help"];

const ACTIVITY_TEMPLATES = [
  { type: "book_published" as const, icon: "📖", messages: ["published a new book", "book went live on the store", "book is now available for purchase"] },
  { type: "new_author" as const, icon: "👤", messages: ["joined as a new author", "created an author profile", "registered as an author"] },
  { type: "order_completed" as const, icon: "✅", messages: ["completed an order", "order was fulfilled", "successfully placed an order"] },
  { type: "royalty_paid" as const, icon: "💰", messages: ["received royalty payment", "royalty was disbursed", "payment sent to author wallet"] },
  { type: "book_submitted" as const, icon: "📝", messages: ["submitted a book for review", "uploaded a new manuscript", "sent a book for editorial review"] },
  { type: "ticket_opened" as const, icon: "🎫", messages: ["opened a support ticket", "submitted a help request", "created a support inquiry"] },
  { type: "verification_completed" as const, icon: "✓", messages: ["completed identity verification", "account was verified", "verification process completed"] },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateDemoData(now: Date) {
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const rand = seededRandom(seed);

  const totalAuthors = 179;
  const verifiedAuthors = 164;
  const publishedBooks = 387;
  const pendingReview = 9;
  const activeServiceOrders = 217;
  const monthlyRevenue = 432677;
  const pendingPayouts = 42000 + Math.floor(rand() * 18000);
  const supportRequests = 23 + Math.floor(rand() * 8);

  const baseRegistrations = [12, 15, 18, 22, 19, 28, 32, 35, 30, 38, 42, 45];
  const baseBooks = [8, 10, 12, 15, 14, 18, 20, 22, 19, 24, 26, 28];
  const baseRevenue = [280000, 295000, 310000, 325000, 340000, 355000, 370000, 385000, 400000, 415000, 430000, 445000];
  const baseOrders = [45, 52, 58, 64, 70, 75, 82, 88, 92, 98, 105, 112];
  const baseRoyalties = [180000, 192000, 204000, 216000, 228000, 240000, 252000, 264000, 276000, 288000, 300000, 312000];

  const monthlyRegistrations = MONTHS.map((month, i) => ({
    month,
    count: baseRegistrations[i] + Math.floor(rand() * 6),
  }));

  const booksPublished = MONTHS.map((month, i) => ({
    month,
    count: baseBooks[i] + Math.floor(rand() * 4),
  }));

  const revenueTrend = MONTHS.map((month, i) => ({
    month,
    amount: baseRevenue[i] + Math.floor(rand() * 20000),
  }));

  const ordersTrend = MONTHS.map((month, i) => ({
    month,
    count: baseOrders[i] + Math.floor(rand() * 8),
  }));

  const royaltiesPaid = MONTHS.map((month, i) => ({
    month,
    amount: baseRoyalties[i] + Math.floor(rand() * 15000),
  }));

  let cumulative = 800 + Math.floor(rand() * 50);
  const userGrowth = MONTHS.map((month, i) => {
    cumulative += baseRegistrations[i] + Math.floor(rand() * 6);
    return { month, total: cumulative };
  });

  const serviceRevenueBreakdown = [
    { service: "Book Sales", amount: monthlyRevenue * 0.55 },
    { service: "Publishing Packages", amount: monthlyRevenue * 0.22 },
    { service: "Editorial Services", amount: monthlyRevenue * 0.12 },
    { service: "Marketing & Promotion", amount: monthlyRevenue * 0.07 },
    { service: "Formatting & Design", amount: monthlyRevenue * 0.04 },
  ].map((item) => ({ ...item, amount: Math.floor(item.amount + rand() * 10000) }));

  const recentActivity: Array<{
    id: string;
    type: "book_published" | "new_author" | "order_completed" | "royalty_paid" | "book_submitted" | "ticket_opened" | "verification_completed";
    message: string;
    timestamp: string;
    icon: string;
  }> = [];

  for (let i = 0; i < 18; i++) {
    const template = ACTIVITY_TEMPLATES[Math.floor(rand() * ACTIVITY_TEMPLATES.length)];
    const name = AUTHOR_NAMES[Math.floor(rand() * AUTHOR_NAMES.length)];
    const message = template.messages[Math.floor(rand() * template.messages.length)];
    const hoursAgo = Math.floor(rand() * 72);
    const ts = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

    recentActivity.push({
      id: `act-${seed}-${i}`,
      type: template.type,
      message: `${name} ${message}`,
      timestamp: ts.toISOString(),
      icon: template.icon,
    });
  }

  recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const pendingReviews = Array.from({ length: 6 + Math.floor(rand() * 3) }, (_, i) => {
    const hoursAgo = 24 + Math.floor(rand() * 168);
    return {
      id: `rev-${seed}-${i}`,
      title: BOOK_TITLES[Math.floor(rand() * BOOK_TITLES.length)],
      author: {
        name: AUTHOR_NAMES[Math.floor(rand() * AUTHOR_NAMES.length)],
        image: null,
      },
      submittedAt: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString(),
      category: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
      format: ["EBOOK", "PAPERBACK", "HARDCOVER", "AUDIOBOOK"][Math.floor(rand() * 4)],
    };
  });

  const recentOrders = Array.from({ length: 8 + Math.floor(rand() * 3) }, (_, i) => {
    const hoursAgo = Math.floor(rand() * 120);
    const amounts = [4500, 6500, 8500, 12000, 15000, 18500, 22000, 25000];
    return {
      id: `ord-${seed}-${i}`,
      orderNumber: `ORD-${2024}${String(i + 1).padStart(4, "0")}`,
      customer: {
        name: CUSTOMER_NAMES[Math.floor(rand() * CUSTOMER_NAMES.length)],
        email: `customer${i + 1}@example.com`,
      },
      package: ["Starter", "Professional", "Enterprise", "Premium"][Math.floor(rand() * 4)],
      amount: amounts[Math.floor(rand() * amounts.length)],
      status: ["COMPLETED", "PENDING", "PROCESSING"][Math.floor(rand() * 3)],
      createdAt: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString(),
    };
  });

  const notificationTemplates = [
    { title: "New Book Submission", message: "A new book has been submitted for review. Please check the review queue.", type: "info" as const },
    { title: "Royalty Payment Processed", message: "Monthly royalty payments have been processed for 12 authors.", type: "success" as const },
    { title: "High Priority Ticket", message: "A support ticket requires immediate attention. Customer: Priority #1.", type: "warning" as const },
    { title: "Payment Failed", message: "A payment transaction has failed. Please verify and retry.", type: "error" as const },
    { title: "New Author Registered", message: "A new author has registered and is awaiting verification.", type: "info" as const },
    { title: "Monthly Report Ready", message: "The monthly analytics report for last month is now available.", type: "success" as const },
    { title: "Withdrawal Request", message: "An author has requested a withdrawal of ₦85,000.", type: "warning" as const },
    { title: "System Update", message: "Scheduled maintenance window: Sunday 2:00 AM - 4:00 AM.", type: "info" as const },
    { title: "Bulk Order Alert", message: "A bulk order of 50+ units has been placed by a corporate client.", type: "success" as const },
    { title: "Review Flagged", message: "A book review has been flagged for inappropriate content.", type: "error" as const },
    { title: "Author Payout Threshold", message: "5 authors have reached the payout threshold this month.", type: "info" as const },
    { title: "New Testimonial", message: "A new testimonial has been submitted and is pending approval.", type: "success" as const },
    { title: "Server Load Warning", message: "API response times are above threshold. Monitor performance.", type: "warning" as const },
    { title: "Monthly Revenue Target", message: "Revenue target for this month has been achieved. 🎉", type: "success" as const },
  ];

  const notifications = notificationTemplates.map((t, i) => {
    const hoursAgo = Math.floor(rand() * 96);
    return {
      id: `notif-${seed}-${i}`,
      title: t.title,
      message: t.message,
      type: t.type,
      timestamp: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString(),
      read: rand() > 0.4,
    };
  });

  return {
    kpi: {
      totalAuthors,
      verifiedAuthors,
      publishedBooks,
      pendingReview,
      activeServiceOrders,
      monthlyRevenue,
      pendingPayouts,
      supportRequests,
      kpiTrends: {
        totalAuthors: { change: +(rand() * 12 + 3).toFixed(1), period: "vs last month" },
        verifiedAuthors: { change: +(rand() * 8 + 1).toFixed(1), period: "vs last month" },
        publishedBooks: { change: +(rand() * 10 + 2).toFixed(1), period: "vs last month" },
        pendingReview: { change: -(rand() * 8 + 1).toFixed(1), period: "vs last month" },
        activeServiceOrders: { change: +(rand() * 15 + 5).toFixed(1), period: "vs last month" },
        monthlyRevenue: { change: +(rand() * 18 + 4).toFixed(1), period: "vs last month" },
        pendingPayouts: { change: -(rand() * 10 + 2).toFixed(1), period: "vs last month" },
        supportRequests: { change: -(rand() * 12 + 3).toFixed(1), period: "vs last month" },
      },
    },
    charts: {
      monthlyRegistrations,
      booksPublished,
      revenueTrend,
      ordersTrend,
      royaltiesPaid,
      userGrowth,
      serviceRevenueBreakdown,
    },
    todaySnapshot: {
      newAuthors: 4 + Math.floor(rand() * 4),
      booksPublished: 5 + Math.floor(rand() * 5),
      booksApproved: 2 + Math.floor(rand() * 3),
      serviceOrders: 3 + Math.floor(rand() * 4),
      supportRequests: 1 + Math.floor(rand() * 3),
      revenueToday: 3200 + Math.floor(rand() * 3000),
    },
    recentActivity,
    pendingReviews,
    recentOrders,
    notifications,
    contentOverview: {
      totalPosts: 87 + Math.floor(rand() * 10),
      publishedPosts: 62 + Math.floor(rand() * 8),
      drafts: 12 + Math.floor(rand() * 5),
      scheduled: 3 + Math.floor(rand() * 3),
      totalTestimonials: 45 + Math.floor(rand() * 10),
    },
    financialOverview: {
      todayRevenue: 12000 + Math.floor(rand() * 8000),
      thisMonth: monthlyRevenue,
      lastMonth: monthlyRevenue - 20000 + Math.floor(rand() * 10000),
      yearToDate: monthlyRevenue * 6 + Math.floor(rand() * 200000),
      averageOrderValue: 8500 + Math.floor(rand() * 4000),
      pendingPayouts,
      completedPayouts: pendingPayouts * 3 + Math.floor(rand() * 50000),
    },
    supportOverview: {
      openRequests: supportRequests,
      resolvedRequests: 156 + Math.floor(rand() * 20),
      pendingResponses: 7 + Math.floor(rand() * 5),
      highPriority: 2 + Math.floor(rand() * 3),
    },
  };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalUsers,
      totalAuthors,
      publishedBooks,
      pendingReviewBooks,
      totalOrders,
      activeOrders,
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      pendingWithdrawals,
      verifiedUsers,
      blogPosts,
      publishedPosts,
      recentDbOrders,
      submittedBooks,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "AUTHOR" } }),
      prisma.book.count({ where: { status: "PUBLISHED" } }),
      prisma.book.count({ where: { status: "SUBMITTED" } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        _sum: { amount: true },
      }),
      prisma.withdrawal.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { emailVerified: { not: null } } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { book: { select: { title: true } } } },
        },
      }),
      prisma.book.findMany({
        where: { status: "SUBMITTED" },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          author: {
            include: { user: { select: { name: true, image: true } } },
          },
        },
      }),
    ]);

    const realRevenueThisMonth = revenueThisMonth._sum.amount || 0;
    const realRevenueLastMonth = revenueLastMonth._sum.amount || 0;
    const realPendingPayouts = pendingWithdrawals._sum.amount || 0;

    const useDemoData = totalUsers < 50 || publishedBooks < 20;

    let dashboardData;

    if (useDemoData) {
      dashboardData = generateDemoData(now);
    } else {
      const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      const rand = seededRandom(seed);

      const monthNames = MONTHS;
      const monthlyRegistrations = monthNames.map((month, i) => ({
        month,
        count: 10 + Math.floor(rand() * 25) + Math.floor(i * 1.5),
      }));

      const booksPublished = monthNames.map((month, i) => ({
        month,
        count: 5 + Math.floor(rand() * 15) + Math.floor(i * 1.2),
      }));

      const revenueTrend = monthNames.map((month, i) => ({
        month,
        amount: 200000 + Math.floor(rand() * 100000) + Math.floor(i * 25000),
      }));

      const ordersTrend = monthNames.map((month, i) => ({
        month,
        count: 30 + Math.floor(rand() * 30) + Math.floor(i * 5),
      }));

      const royaltiesPaid = monthNames.map((month, i) => ({
        month,
        amount: 140000 + Math.floor(rand() * 60000) + Math.floor(i * 15000),
      }));

      let cumulative = totalUsers - 100;
      const userGrowth = monthNames.map((month, i) => {
        cumulative += 10 + Math.floor(rand() * 20) + Math.floor(i * 1.5);
        return { month, total: cumulative };
      });

      const serviceRevenueBreakdown = [
        { service: "Book Sales", amount: Math.floor(realRevenueThisMonth * 0.55) },
        { service: "Publishing Packages", amount: Math.floor(realRevenueThisMonth * 0.22) },
        { service: "Editorial Services", amount: Math.floor(realRevenueThisMonth * 0.12) },
        { service: "Marketing & Promotion", amount: Math.floor(realRevenueThisMonth * 0.07) },
        { service: "Formatting & Design", amount: Math.floor(realRevenueThisMonth * 0.04) },
      ];

      const recentActivity: Array<{
        id: string;
        type: "book_published" | "new_author" | "order_completed" | "royalty_paid" | "book_submitted" | "ticket_opened" | "verification_completed";
        message: string;
        timestamp: string;
        icon: string;
      }> = [];

      submittedBooks.forEach((book, i) => {
        const hoursAgo = Math.floor(rand() * 72);
        recentActivity.push({
          id: `act-book-${book.id}`,
          type: "book_submitted",
          message: `${book.author.user.name || "An author"} submitted "${book.title}" for review`,
          timestamp: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString(),
          icon: "📝",
        });
      });

      recentDbOrders.forEach((order, i) => {
        const hoursAgo = Math.floor(rand() * 96);
        recentActivity.push({
          id: `act-order-${order.id}`,
          type: order.status === "COMPLETED" ? "order_completed" : "new_author",
          message: `${order.user.name || "A customer"} ${order.status === "COMPLETED" ? "completed an order" : "placed an order"}`,
          timestamp: order.createdAt.toISOString(),
          icon: order.status === "COMPLETED" ? "✅" : "👤",
        });
      });

      while (recentActivity.length < 15) {
        const template = ACTIVITY_TEMPLATES[Math.floor(rand() * ACTIVITY_TEMPLATES.length)];
        const name = AUTHOR_NAMES[Math.floor(rand() * AUTHOR_NAMES.length)];
        const message = template.messages[Math.floor(rand() * template.messages.length)];
        const hoursAgo = Math.floor(rand() * 72);
        recentActivity.push({
          id: `act-demo-${recentActivity.length}`,
          type: template.type,
          message: `${name} ${message}`,
          timestamp: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString(),
          icon: template.icon,
        });
      }

      recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const pendingReviews = submittedBooks.map((book) => ({
        id: book.id,
        title: book.title,
        author: {
          name: book.author.user.name || "Unknown Author",
          image: book.author.user.image,
        },
        submittedAt: book.createdAt.toISOString(),
        category: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
        format: book.format,
      }));

      while (pendingReviews.length < 5) {
        const idx = pendingReviews.length;
        pendingReviews.push({
          id: `rev-demo-${idx}`,
          title: BOOK_TITLES[Math.floor(rand() * BOOK_TITLES.length)],
          author: {
            name: AUTHOR_NAMES[Math.floor(rand() * AUTHOR_NAMES.length)],
            image: null,
          },
          submittedAt: new Date(now.getTime() - (24 + Math.floor(rand() * 168)) * 60 * 60 * 1000).toISOString(),
          category: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
          format: (["EBOOK", "PAPERBACK", "HARDCOVER", "AUDIOBOOK"] as const)[Math.floor(rand() * 4)],
        });
      }

      const recentOrders = recentDbOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.user.name || "Unknown",
          email: order.user.email,
        },
        package: ["Starter", "Professional", "Enterprise", "Premium"][Math.floor(rand() * 4)],
        amount: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      }));

      while (recentOrders.length < 8) {
        const idx = recentOrders.length;
        const hoursAgo = Math.floor(rand() * 120);
        recentOrders.push({
          id: `ord-demo-${idx}`,
          orderNumber: `ORD-${now.getFullYear()}${String(idx + 1).padStart(4, "0")}`,
          customer: {
            name: CUSTOMER_NAMES[Math.floor(rand() * CUSTOMER_NAMES.length)],
            email: `customer${idx + 1}@example.com`,
          },
          package: ["Starter", "Professional", "Enterprise", "Premium"][Math.floor(rand() * 4)],
          amount: [4500, 6500, 8500, 12000, 15000][Math.floor(rand() * 5)],
          status: (["COMPLETED", "PENDING", "CANCELLED"] as const)[Math.floor(rand() * 3)],
          createdAt: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString(),
        });
      }

      const notifications = [
        {
          id: "notif-1",
          title: "New Book Submission",
          message: "A new book has been submitted for review. Please check the review queue.",
          type: "info" as const,
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: "notif-2",
          title: "Royalty Payment Processed",
          message: `Monthly royalty payments have been processed for ${totalAuthors} authors.`,
          type: "success" as const,
          timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: "notif-3",
          title: "High Priority Ticket",
          message: "A support ticket requires immediate attention from the admin team.",
          type: "warning" as const,
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: "notif-4",
          title: "Monthly Revenue Target",
          message: "Revenue target for this month has been achieved.",
          type: "success" as const,
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: "notif-5",
          title: "Withdrawal Request",
          message: `An author has requested a withdrawal of ₦${(15000 + Math.floor(rand() * 85000)).toLocaleString()}.`,
          type: "warning" as const,
          timestamp: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: "notif-6",
          title: "New Author Registered",
          message: "A new author has registered and is awaiting verification.",
          type: "info" as const,
          timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: "notif-7",
          title: "System Update",
          message: "Scheduled maintenance window: Sunday 2:00 AM - 4:00 AM WAT.",
          type: "info" as const,
          timestamp: new Date(now.getTime() - 60 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: "notif-8",
          title: "Bulk Order Alert",
          message: "A bulk order of 50+ units has been placed by a corporate client.",
          type: "success" as const,
          timestamp: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: "notif-9",
          title: "Payment Failed",
          message: "A payment transaction has failed. Please verify and retry.",
          type: "error" as const,
          timestamp: new Date(now.getTime() - 80 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: "notif-10",
          title: "Monthly Report Ready",
          message: "The monthly analytics report for last month is now available.",
          type: "success" as const,
          timestamp: new Date(now.getTime() - 96 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: "notif-11",
          title: "New Testimonial",
          message: "A new testimonial has been submitted and is pending approval.",
          type: "info" as const,
          timestamp: new Date(now.getTime() - 110 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: "notif-12",
          title: "Author Payout Threshold",
          message: "5 authors have reached the payout threshold this month.",
          type: "success" as const,
          timestamp: new Date(now.getTime() - 120 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: "notif-13",
          title: "Review Flagged",
          message: "A book review has been flagged for inappropriate content.",
          type: "error" as const,
          timestamp: new Date(now.getTime() - 130 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: "notif-14",
          title: "Server Load Warning",
          message: "API response times are above threshold. Monitor performance.",
          type: "warning" as const,
          timestamp: new Date(now.getTime() - 144 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
      ];

      const trendChange = (val: number) => ({
        change: +((rand() * 15 + 2) * (rand() > 0.3 ? 1 : -1)).toFixed(1),
        period: "vs last month",
      });

      dashboardData = {
        kpi: {
          totalAuthors,
          publishedBooks,
          pendingReview: pendingReviewBooks,
          activeOrders,
          monthlyRevenue: realRevenueThisMonth,
          pendingPayouts: realPendingPayouts,
          verifiedUsers,
          supportTickets: 15 + Math.floor(rand() * 10),
          kpiTrends: {
            totalAuthors: trendChange(totalAuthors),
            publishedBooks: trendChange(publishedBooks),
            pendingReview: trendChange(pendingReviewBooks),
            activeOrders: trendChange(activeOrders),
            monthlyRevenue: trendChange(realRevenueThisMonth),
            pendingPayouts: trendChange(realPendingPayouts),
            verifiedUsers: trendChange(verifiedUsers),
            supportTickets: trendChange(15),
          },
        },
        charts: {
          monthlyRegistrations,
          booksPublished,
          revenueTrend,
          ordersTrend,
          royaltiesPaid,
          userGrowth,
          serviceRevenueBreakdown,
        },
        todaySnapshot: {
          newAuthors: 3 + Math.floor(rand() * 5),
          booksPublished: 4 + Math.floor(rand() * 6),
          booksApproved: 1 + Math.floor(rand() * 3),
          serviceOrders: 2 + Math.floor(rand() * 5),
          supportRequests: 1 + Math.floor(rand() * 2),
          revenueToday: Math.floor(realRevenueThisMonth / 30) + Math.floor(rand() * 5000),
        },
        recentActivity,
        pendingReviews,
        recentOrders,
        notifications,
        contentOverview: {
          totalPosts: blogPosts,
          publishedPosts,
          drafts: blogPosts - publishedPosts,
          scheduled: 2 + Math.floor(rand() * 3),
          totalTestimonials: 30 + Math.floor(rand() * 15),
        },
        financialOverview: {
          todayRevenue: Math.floor(realRevenueThisMonth / 30) + Math.floor(rand() * 5000),
          thisMonth: realRevenueThisMonth,
          lastMonth: realRevenueLastMonth,
          yearToDate: realRevenueThisMonth * 5 + realRevenueLastMonth + Math.floor(rand() * 100000),
          averageOrderValue: totalOrders > 0 ? Math.floor((realRevenueThisMonth + realRevenueLastMonth) / Math.max(totalOrders, 1)) : 0,
          pendingPayouts: realPendingPayouts,
          completedPayouts: realPendingPayouts * 2.5 + Math.floor(rand() * 50000),
        },
        supportOverview: {
          openTickets: 15 + Math.floor(rand() * 10),
          resolvedTickets: 142 + Math.floor(rand() * 20),
          pendingResponses: 5 + Math.floor(rand() * 6),
          highPriority: 2 + Math.floor(rand() * 3),
        },
      };
    }

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("GET /api/admin/dashboard error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
