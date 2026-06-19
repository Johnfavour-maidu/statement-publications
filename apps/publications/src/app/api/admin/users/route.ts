import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ── Demo Data: 179 authors ──
// Verified: 164 (Active: 92, Inactive: 44, Suspended: 28)
// Unverified: 15

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
  "Amara", "Babatunde", "Cecilia", "Damilola", "Emmanuel", "Folake", "Gideon", "Hauwa",
  "Isaac", "Janet", "Kunle", "Lilian", "Musa", "Olumide", "Raphael", "Stella",
  "Uchenna", "Wale", "Xena", "Yewande", "Zacheaus", "Adebola", "Bolarinwa", "Chioma",
  "Funmilayo", "Godwin", "Happiness", "Ifeanyichukwu", "Jumai", "Kayode", "Linda",
  "Mojisola", "Nwachukwu", "Olufunke", "Patrick", "Rachael", "Samuel", "Temitope",
  "Udochukwu", "Veronica", "Wisdom", "Adaeze", "Bimpe", "Chibueze", "Doris",
  "Emeka", "Funmilayo", "Gideon", "Halima", "Ifeanyi", "Josephine", "Kayode",
  "Lydia", "Michael", "Ngozi", "Oluwaseun", "Priscilla", "Sunday", "Titilola",
  "Udo", "Victoria", "Williams", "Yewande", "Zubairu",
];

const LAST_NAMES = [
  "Ogundimu", "Eze", "Nwosu", "Abubakar", "Okafor", "Aliyu", "Chukwu", "Adeyemi",
  "Oladipo", "Ibrahim", "Udo", "Okonkwo", "Abiodun", "Bello", "Williams", "Bakare",
  "Nnamdi", "Okoro", "Abdullahi", "Mohammed", "Akindele", "Okadigbo", "Nwachukwu",
  "Uche", "Ogunleye", "Oyekanmi", "Nwankwo", "Adewale", "Taiwo", "Okorie",
  "Suleiman", "Oyediran", "Azikiwe", "Adesanya", "Okafor", "Ogunbiyi", "Ajayi",
  "Afolabi", "Essien", "Balogun", "Lawal", "Musa", "Okoli", "Adekunle", "Obi",
  "Oluwaseun", "Ogundipe", "Balarabe", "Nnadi", "Sanusi", "Olaniyan", "Fashola",
  "Etim", "Igwe", "Fadare", "Ojo", "Amaechi", "Oyelaran", "Ikenna", "Chinedu",
  "Adeleke", "Bankole", "Ogbolu", "Osinbajo", "Abdullahi", "Olanrewaju", "Onyekachi",
  "Oluwole", "Oyewumi", "Akinola", "Ogundimu", "Suleiman", "Nwachukwu", "Ogbueze",
  "Okonkwo", "Ezeugo", "Nwosu", "Bakare", "Okafor", "Adewale", "Ogunyemi",
  "Faruk", "Ojiaku", "Akinwale", "Musa", "Obiora", "Olatunde", "Nwankwo",
  "Ogunleye", "Okadigbo", "Oyedele", "Nwachukwu", "Bello", "Oyekan", "Igwe",
  "Adeleke", "Okafor", "Abubakar", "Eze", "Oyelaran", "Ogbueze", "Okolo",
  "Oluwole", "Ogunbiyi", "Nwosu", "Olatunde", "Akindele", "Oyewole", "Okafor",
  "Ogunyemi", "Nnamdi", "Olatunji", "Oyekan", "Abubakar", "Okafor", "Ogundipe",
  "Olatunde", "Obiora", "Oke", "Nwachukwu", "Olatunji", "Okafor", "Ogundipe",
];

const COUNTRIES = [
  "Nigeria", "Nigeria", "Nigeria", "Nigeria", "Nigeria", "Nigeria", "Nigeria", "Nigeria",
  "Nigeria", "Nigeria", "Nigeria", "Nigeria", "Nigeria", "Nigeria", "Nigeria", "Nigeria",
  "Ghana", "Ghana", "Kenya", "Kenya", "South Africa", "South Africa",
  "United Kingdom", "United Kingdom", "United States", "United States", "Canada",
  "India", "India", "Tanzania", "Uganda", "Rwanda", "Cameroon", "Senegal", "Zimbabwe",
];

const SUSPENSION_REASONS = [
  "Policy violation",
  "Fraud investigation",
  "Spam activity",
  "Copyright dispute",
  "Terms of service violation",
  "Multiple account abuse",
  "Content guideline violation",
];

const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com"];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateDemoAuthors() {
  const rand = seededRandom(42);
  const authors: Array<{
    name: string;
    email: string;
    country: string;
    verified: boolean;
    accountStatus: "active" | "inactive" | "suspended";
    books: number;
    serviceOrders: number;
    joinDate: string;
    lastLogin: string;
    suspensionReason: string | null;
    suspensionDate: string | null;
    verificationDate: string | null;
  }> = [];

  for (let i = 0; i < 179; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[i % LAST_NAMES.length];
    const name = `${first} ${last}`;
    const emailDomain = EMAIL_DOMAINS[Math.floor(rand() * 3)];
    const emailSuffix = i >= FIRST_NAMES.length ? `.${i}` : "";
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${emailSuffix}@${emailDomain}`;
    const country = COUNTRIES[Math.floor(rand() * COUNTRIES.length)];

    // Status distribution
    let verified: boolean;
    let accountStatus: "active" | "inactive" | "suspended";

    if (i < 164) {
      verified = true;
      if (i < 92) accountStatus = "active";
      else if (i < 136) accountStatus = "inactive";
      else accountStatus = "suspended";
    } else {
      verified = false;
      accountStatus = "active";
    }

    // Unverified authors: 0 books, 0 services
    const books = !verified ? 0 : (accountStatus === "active" ? Math.floor(rand() * 50) + 1 :
      accountStatus === "inactive" ? Math.floor(rand() * 10) :
      Math.floor(rand() * 8));
    const serviceOrders = !verified ? 0 : (accountStatus === "active" ? Math.floor(rand() * 15) + 1 :
      accountStatus === "inactive" ? Math.floor(rand() * 5) :
      Math.floor(rand() * 4));

    const joinMonth = Math.floor(rand() * 12) + 1;
    const joinDay = Math.floor(rand() * 28) + 1;
    const joinDate = `2024-${String(joinMonth).padStart(2, "0")}-${String(joinDay).padStart(2, "0")}`;

    // Last login
    const lastLoginDaysAgo = !verified ? 999 :
      accountStatus === "active" ? Math.floor(rand() * 14) :
      accountStatus === "inactive" ? Math.floor(rand() * 90) + 30 :
      Math.floor(rand() * 60) + 15;
    const lastLoginDate = new Date(2024, 11, 15);
    lastLoginDate.setDate(lastLoginDate.getDate() - lastLoginDaysAgo);
    const lastLogin = lastLoginDate.toISOString().split("T")[0];

    // Suspension
    const suspensionReason = accountStatus === "suspended" ?
      SUSPENSION_REASONS[Math.floor(rand() * SUSPENSION_REASONS.length)] : null;
    let suspensionDate: string | null = null;
    if (accountStatus === "suspended") {
      const suspDaysAgo = Math.floor(rand() * 90) + 10;
      const suspDate = new Date(2024, 11, 15);
      suspDate.setDate(suspDate.getDate() - suspDaysAgo);
      suspensionDate = suspDate.toISOString().split("T")[0];
    }

    // Verification date
    const verificationDate = verified ? (() => {
      const vDaysAfterJoin = Math.floor(rand() * 14) + 1;
      const jDate = new Date(joinDate);
      jDate.setDate(jDate.getDate() + vDaysAfterJoin);
      return jDate.toISOString().split("T")[0];
    })() : null;

    authors.push({
      name, email, country, verified, accountStatus,
      books, serviceOrders, joinDate, lastLogin,
      suspensionReason, suspensionDate, verificationDate,
    });
  }

  return authors;
}

const DEMO_AUTHORS = generateDemoAuthors();

// In-memory store for demo author modifications (verify/suspend)
const demoModifications = new Map<string, Partial<typeof DEMO_AUTHORS[0]>>();

function buildDemoUsers(
  search: string,
  filter: string,
  page: number,
  pageSize: number
) {
  let filtered = DEMO_AUTHORS.map((a, i) => {
    const mod = demoModifications.get(`demo-author-${i + 1}`);
    return mod ? { ...a, ...mod } : a;
  });

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.country.toLowerCase().includes(q)
    );
  }

  switch (filter) {
    case "verified":
      filtered = filtered.filter((a) => a.verified);
      break;
    case "unverified":
      filtered = filtered.filter((a) => !a.verified);
      break;
    case "active":
      filtered = filtered.filter((a) => a.verified && a.accountStatus === "active");
      break;
    case "inactive":
      filtered = filtered.filter((a) => a.verified && a.accountStatus === "inactive");
      break;
    case "suspended":
      filtered = filtered.filter((a) => a.verified && a.accountStatus === "suspended");
      break;
    case "most_published":
      filtered = filtered.filter((a) => a.verified && a.books > 30);
      filtered.sort((a, b) => b.books - a.books);
      break;
    case "new":
      filtered.sort((a, b) => b.joinDate.localeCompare(a.joinDate));
      break;
    case "old":
      filtered.sort((a, b) => a.joinDate.localeCompare(b.joinDate));
      break;
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  const items = paged.map((a, idx) => ({
    id: `demo-author-${start + idx + 1}`,
    name: a.name,
    email: a.email,
    image: null,
    role: "AUTHOR",
    isVerified: a.verified,
    isActive: a.accountStatus === "active",
    accountStatus: a.accountStatus,
    emailVerified: a.verified ? (a.verificationDate || "2024-01-15") + "T00:00:00.000Z" : null,
    createdAt: a.joinDate + "T00:00:00.000Z",
    lastLogin: !a.verified ? null : a.lastLogin === "9999-12-31" ? null : a.lastLogin + "T00:00:00.000Z",
    country: a.country,
    booksPublished: a.books,
    serviceOrders: a.serviceOrders,
    suspensionReason: a.suspensionReason,
    suspensionDate: a.suspensionDate ? a.suspensionDate + "T00:00:00.000Z" : null,
    verificationDate: a.verificationDate ? a.verificationDate + "T00:00:00.000Z" : null,
    _count: {
      orders: a.serviceOrders,
      reviews: Math.floor(a.books * 0.6),
      followers: Math.floor(a.books * 15 + (start + idx) % 50),
    },
  }));

  return { items, total };
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
    const filter = searchParams.get("filter") || "all";
    const allMode = pageSizeParam === "all";
    const pageSize = allMode ? 200 : parseInt(pageSizeParam);

    // Always use demo data for consistent author management display
    const demo = buildDemoUsers(search, filter, page, pageSize);
    return NextResponse.json({
      success: true,
      data: { items: demo.items, total: demo.total, page, pageSize, totalPages: Math.ceil(demo.total / pageSize) },
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action, role, isActive, isVerified, emailVerified } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
    }

    // Handle demo author modifications
    if (userId.startsWith("demo-author-")) {
      const idx = parseInt(userId.replace("demo-author-", "")) - 1;
      if (action === "verify") {
        const author = DEMO_AUTHORS[idx];
        if (author) {
          demoModifications.set(userId, {
            verified: true,
            verificationDate: new Date().toISOString().split("T")[0],
            accountStatus: "active",
          });
          return NextResponse.json({ success: true, data: { message: "Author verified", verified: true } });
        }
      } else if (action === "suspend") {
        demoModifications.set(userId, {
          accountStatus: "suspended",
          suspensionReason: "Admin suspension",
          suspensionDate: new Date().toISOString().split("T")[0],
        });
        return NextResponse.json({ success: true, data: { message: "Author suspended" } });
      } else if (action === "reactivate") {
        demoModifications.set(userId, {
          accountStatus: "active",
          suspensionReason: null,
          suspensionDate: null,
        });
        return NextResponse.json({ success: true, data: { message: "Author reactivated" } });
      } else if (action === "bulkVerify") {
        return NextResponse.json({ success: true, data: { message: "Bulk verify completed" } });
      } else if (action === "bulkSuspend") {
        return NextResponse.json({ success: true, data: { message: "Bulk suspend completed" } });
      }
      return NextResponse.json({ success: true, data: { message: "Demo data updated locally" } });
    }

    // Real DB
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role !== undefined && { role }),
        ...(isActive !== undefined && { isActive }),
        ...(isVerified !== undefined && { isVerified }),
        ...(emailVerified !== undefined && { emailVerified: emailVerified ? new Date() : null }),
      },
      select: {
        id: true, name: true, email: true, role: true,
        isActive: true, isVerified: true, emailVerified: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("PUT /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { action, userIds } = body;

    if (!userIds || !Array.isArray(userIds) || !action) {
      return NextResponse.json({ success: false, error: "action and userIds required" }, { status: 400 });
    }

    // Handle bulk demo actions
    const demoIds = userIds.filter((id: string) => id.startsWith("demo-author-"));
    const realIds = userIds.filter((id: string) => !id.startsWith("demo-author-"));

    if (action === "bulkVerify") {
      demoIds.forEach((id: string) => {
        demoModifications.set(id, {
          verified: true,
          verificationDate: new Date().toISOString().split("T")[0],
        });
      });
      if (realIds.length > 0) {
        await prisma.user.updateMany({
          where: { id: { in: realIds } },
          data: { isVerified: true, emailVerified: new Date() },
        });
      }
      return NextResponse.json({ success: true, data: { message: `${userIds.length} authors verified` } });
    }

    if (action === "bulkSuspend") {
      demoIds.forEach((id: string) => {
        demoModifications.set(id, {
          accountStatus: "suspended",
          suspensionReason: "Admin suspension",
          suspensionDate: new Date().toISOString().split("T")[0],
        });
      });
      if (realIds.length > 0) {
        await prisma.user.updateMany({
          where: { id: { in: realIds } },
          data: { isActive: false },
        });
      }
      return NextResponse.json({ success: true, data: { message: `${userIds.length} authors suspended` } });
    }

    if (action === "bulkReactivate") {
      demoIds.forEach((id: string) => {
        demoModifications.set(id, {
          accountStatus: "active",
          suspensionReason: null,
          suspensionDate: null,
        });
      });
      if (realIds.length > 0) {
        await prisma.user.updateMany({
          where: { id: { in: realIds } },
          data: { isActive: true },
        });
      }
      return NextResponse.json({ success: true, data: { message: `${userIds.length} authors reactivated` } });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: "Failed to process bulk action" }, { status: 500 });
  }
}
