import { NextRequest, NextResponse } from "next/server";

const DEMO_CATEGORIES = [
  // Book Categories
  { id: "cat-1", name: "Business & Entrepreneurship", slug: "business-entrepreneurship", description: "Books about starting and growing businesses", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 84, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-2", name: "Personal Finance", slug: "personal-finance", description: "Managing money, investing, and financial planning", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 52, createdAt: "2026-01-08T10:00:00Z" },
  { id: "cat-3", name: "Leadership", slug: "leadership", description: "Leadership skills, management, and team building", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 41, createdAt: "2026-01-10T10:00:00Z" },
  { id: "cat-4", name: "Self Development", slug: "self-development", description: "Personal growth, habits, and mindset", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 37, createdAt: "2026-01-12T10:00:00Z" },
  { id: "cat-5", name: "Productivity", slug: "productivity", description: "Time management and efficiency strategies", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 29, createdAt: "2026-01-15T10:00:00Z" },
  { id: "cat-6", name: "Technology", slug: "technology", description: "Tech trends, digital transformation, and innovation", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 22, createdAt: "2026-01-18T10:00:00Z" },
  { id: "cat-7", name: "Marketing", slug: "marketing", description: "Marketing strategies and brand building", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 18, createdAt: "2026-01-20T10:00:00Z" },
  { id: "cat-8", name: "Health & Wellness", slug: "health-wellness", description: "Physical and mental health guides", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 15, createdAt: "2026-02-01T10:00:00Z" },
  { id: "cat-9", name: "Religion & Inspiration", slug: "religion-inspiration", description: "Faith-based and inspirational literature", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 32, createdAt: "2026-02-05T10:00:00Z" },
  { id: "cat-10", name: "Biography", slug: "biography", description: "Life stories and memoirs", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 11, createdAt: "2026-02-10T10:00:00Z" },
  { id: "cat-11", name: "African Literature", slug: "african-literature", description: "Literature from and about Africa", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 17, createdAt: "2026-02-15T10:00:00Z" },
  { id: "cat-12", name: "Fiction", slug: "fiction", description: "Novels, short stories, and creative fiction", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 29, createdAt: "2026-02-20T10:00:00Z" },
  { id: "cat-13", name: "Poetry", slug: "poetry", description: "Poetry collections and verse", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 14, createdAt: "2026-03-01T10:00:00Z" },
  { id: "cat-14", name: "Education", slug: "education", description: "Educational resources and academic works", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 21, createdAt: "2026-03-05T10:00:00Z" },
  { id: "cat-15", name: "Parenting & Family", slug: "parenting-family", description: "Guides for parents and family life", type: "BOOK", status: "INACTIVE", featured: false, bookCount: 9, createdAt: "2026-03-10T10:00:00Z" },
  // Service Categories
  { id: "cat-16", name: "Book Publishing", slug: "book-publishing", description: "Full publishing services", type: "SERVICE", status: "ACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-17", name: "ISBN Registration", slug: "isbn-registration", description: "ISBN assignment and registration", type: "SERVICE", status: "ACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-18", name: "Formatting", slug: "formatting", description: "Interior book formatting services", type: "SERVICE", status: "ACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-19", name: "Editing", slug: "editing", description: "Professional editing services", type: "SERVICE", status: "ACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-20", name: "Proofreading", slug: "proofreading", description: "Final proofreading and quality check", type: "SERVICE", status: "ACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-21", name: "Manuscript Assessment", slug: "manuscript-assessment", description: "Manuscript evaluation and feedback", type: "SERVICE", status: "ACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-22", name: "Cover Design", slug: "cover-design", description: "Professional book cover design", type: "SERVICE", status: "ACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-23", name: "Book Promotion", slug: "book-promotion", description: "Marketing and promotion campaigns", type: "SERVICE", status: "ACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-24", name: "Author Branding", slug: "author-branding", description: "Personal brand development for authors", type: "SERVICE", status: "ACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-25", name: "Author Website", slug: "author-website", description: "Custom website development for authors", type: "SERVICE", status: "INACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
  // Formats
  { id: "cat-26", name: "eBook", slug: "ebook", description: "Digital book format", type: "FORMAT", status: "ACTIVE", featured: true, bookCount: 156, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-27", name: "Paperback", slug: "paperback", description: "Softcover print format", type: "FORMAT", status: "ACTIVE", featured: false, bookCount: 142, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-28", name: "Hardcover", slug: "hardcover", description: "Premium hardcover print format", type: "FORMAT", status: "ACTIVE", featured: false, bookCount: 58, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-29", name: "Audiobook", slug: "audiobook", description: "Audio narration format", type: "FORMAT", status: "ACTIVE", featured: true, bookCount: 31, createdAt: "2026-01-05T10:00:00Z" },
  { id: "cat-30", name: "Large Print", slug: "large-print", description: "Enlarged text format for accessibility", type: "FORMAT", status: "INACTIVE", featured: false, bookCount: 0, createdAt: "2026-01-05T10:00:00Z" },
];

export async function GET() {
  return NextResponse.json({ success: true, data: DEMO_CATEGORIES });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, description, featured, status } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

    const newCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description: description || "",
      type: type || "BOOK",
      status: status || "ACTIVE",
      featured: featured || false,
      bookCount: 0,
      createdAt: new Date().toISOString(),
    };

    DEMO_CATEGORIES.push(newCategory);

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}
