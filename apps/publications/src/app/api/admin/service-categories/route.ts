import { NextRequest, NextResponse } from "next/server";

const DEMO_SERVICE_CATEGORIES = [
  // Publishing
  { id: "sc-1", name: "Book Publishing", slug: "book-publishing", description: "Full publishing services for authors", department: "Publishing", status: "ACTIVE", featured: false, orderCount: 67, revenue: 28400, createdAt: "2026-01-05T10:00:00Z" },
  { id: "sc-2", name: "ISBN Registration", slug: "isbn-registration", description: "ISBN assignment and barcode registration", department: "Publishing", status: "ACTIVE", featured: false, orderCount: 45, revenue: 4500, createdAt: "2026-01-08T10:00:00Z" },
  { id: "sc-3", name: "Book Formatting", slug: "book-formatting", description: "Interior layout and formatting services", department: "Publishing", status: "ACTIVE", featured: true, orderCount: 52, revenue: 15600, createdAt: "2026-01-10T10:00:00Z" },
  // Editorial
  { id: "sc-4", name: "Editing", slug: "editing", description: "Comprehensive editing and revision services", department: "Editorial", status: "ACTIVE", featured: true, orderCount: 48, revenue: 17400, createdAt: "2026-01-12T10:00:00Z" },
  { id: "sc-5", name: "Proofreading", slug: "proofreading", description: "Final proofreading and error correction", department: "Editorial", status: "ACTIVE", featured: false, orderCount: 38, revenue: 7600, createdAt: "2026-01-15T10:00:00Z" },
  { id: "sc-6", name: "Manuscript Assessment", slug: "manuscript-assessment", description: "Detailed manuscript evaluation and feedback", department: "Editorial", status: "ACTIVE", featured: false, orderCount: 22, revenue: 8800, createdAt: "2026-01-18T10:00:00Z" },
  // Design
  { id: "sc-7", name: "Cover Design", slug: "cover-design", description: "Professional book cover design", department: "Design", status: "ACTIVE", featured: true, orderCount: 36, revenue: 12800, createdAt: "2026-01-20T10:00:00Z" },
  { id: "sc-8", name: "Interior Layout Design", slug: "interior-layout-design", description: "Interior page layout and typography design", department: "Design", status: "ACTIVE", featured: false, orderCount: 28, revenue: 9800, createdAt: "2026-02-01T10:00:00Z" },
  // Marketing
  { id: "sc-9", name: "Book Promotion", slug: "book-promotion", description: "Marketing and promotional campaigns", department: "Marketing", status: "ACTIVE", featured: true, orderCount: 29, revenue: 11600, createdAt: "2026-02-05T10:00:00Z" },
  { id: "sc-10", name: "Amazon Marketing", slug: "amazon-marketing", description: "Amazon listing optimization and ads", department: "Marketing", status: "ACTIVE", featured: false, orderCount: 18, revenue: 7200, createdAt: "2026-02-10T10:00:00Z" },
  { id: "sc-11", name: "Author Branding", slug: "author-branding", description: "Personal brand development for authors", department: "Marketing", status: "ACTIVE", featured: false, orderCount: 15, revenue: 6000, createdAt: "2026-02-15T10:00:00Z" },
  // Web Services
  { id: "sc-12", name: "Author Website Development", slug: "author-website-development", description: "Custom website development for authors", department: "Web Services", status: "INACTIVE", featured: false, orderCount: 12, revenue: 9600, createdAt: "2026-02-20T10:00:00Z" },
];

export async function GET() {
  return NextResponse.json({ success: true, data: DEMO_SERVICE_CATEGORIES });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, department, description, featured, status } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

    const newCategory = {
      id: `sc-${Date.now()}`,
      name,
      slug,
      description: description || "",
      department: department || "Publishing",
      status: status || "ACTIVE",
      featured: featured || false,
      orderCount: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
    };

    DEMO_SERVICE_CATEGORIES.push(newCategory);

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create service category" }, { status: 500 });
  }
}
