import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { name: "Fiction", slug: "fiction", description: "Novels, short stories, and fictional works", sortOrder: 1 },
  { name: "Non-Fiction", slug: "non-fiction", description: "Factual and informational works", sortOrder: 2 },
  { name: "Mystery & Thriller", slug: "mystery-thriller", description: "Suspenseful and crime-solving stories", sortOrder: 3 },
  { name: "Romance", slug: "romance", description: "Love stories and romantic fiction", sortOrder: 4 },
  { name: "Science Fiction", slug: "science-fiction", description: "Speculative fiction set in futuristic worlds", sortOrder: 5 },
  { name: "Fantasy", slug: "fantasy", description: "Stories with magical and supernatural elements", sortOrder: 6 },
  { name: "Biography & Memoir", slug: "biography-memoir", description: "True life stories and personal accounts", sortOrder: 7 },
  { name: "Self-Help", slug: "self-help", description: "Personal development and growth", sortOrder: 8 },
  { name: "Business & Finance", slug: "business-finance", description: "Entrepreneurship, investing, and management", sortOrder: 9 },
  { name: "History", slug: "history", description: "Historical accounts and analysis", sortOrder: 10 },
  { name: "Poetry", slug: "poetry", description: "Verses, poems, and poetic collections", sortOrder: 11 },
  { name: "Children & Young Adult", slug: "children-ya", description: "Books for young readers", sortOrder: 12 },
  { name: "Religion & Spirituality", slug: "religion-spirituality", description: "Faith-based and spiritual works", sortOrder: 13 },
];

const BOOKS = [
  {
    title: "The Silent Echo",
    slug: "the-silent-echo",
    subtitle: "A Mystery Novel",
    description: "When detective Maya Chen receives a cryptic message from a missing journalist, she's drawn into a web of corruption that reaches the highest levels of power.",
    isbn: "978-1-234567-00-1",
    pageCount: 342,
    format: "EBOOK" as const,
    price: 12.99,
    isFeatured: true,
    isBestseller: true,
    tags: ["mystery", "thriller", "detective"],
    category: "mystery-thriller",
  },
  {
    title: "Whispers in the Wind",
    slug: "whispers-in-the-wind",
    subtitle: "A Love Story",
    description: "Two strangers meet on a train crossing the American heartland. What begins as a chance encounter becomes a journey of love, loss, and second chances.",
    isbn: "978-1-234567-00-2",
    pageCount: 287,
    format: "PAPERBACK" as const,
    price: 14.99,
    discountPrice: 11.99,
    isFeatured: true,
    tags: ["romance", "contemporary", "love"],
    category: "romance",
  },
  {
    title: "Beyond the Stars",
    slug: "beyond-the-stars",
    subtitle: "Chronicles of the Void",
    description: "In a galaxy torn apart by war, a young pilot discovers an ancient power that could either save humanity or destroy it forever.",
    isbn: "978-1-234567-00-3",
    pageCount: 456,
    format: "EBOOK" as const,
    price: 15.99,
    isBestseller: true,
    tags: ["science fiction", "space opera", "adventure"],
    category: "science-fiction",
  },
  {
    title: "The Art of Mindful Living",
    slug: "the-art-of-mindful-living",
    subtitle: "A Guide to Inner Peace",
    description: "Discover the transformative power of mindfulness through practical exercises, meditations, and real-world applications for modern life.",
    isbn: "978-1-234567-00-4",
    pageCount: 234,
    format: "HARDCOVER" as const,
    price: 24.99,
    isFeatured: true,
    tags: ["self-help", "mindfulness", "meditation"],
    category: "self-help",
  },
  {
    title: "Kingdom of Shadows",
    slug: "kingdom-of-shadows",
    subtitle: "The Dark Realm Saga",
    description: "A young sorceress must navigate political intrigue and dark magic to claim her rightful place on the throne of a kingdom in turmoil.",
    isbn: "978-1-234567-00-5",
    pageCount: 523,
    format: "EBOOK" as const,
    price: 16.99,
    tags: ["fantasy", "magic", "adventure"],
    category: "fantasy",
  },
  {
    title: "My Father's Legacy",
    slug: "my-fathers-legacy",
    subtitle: "A Memoir",
    description: "A deeply personal account of growing up in the shadow of a legendary civil rights leader, and the journey to understanding his true legacy.",
    isbn: "978-1-234567-00-6",
    pageCount: 312,
    format: "PAPERBACK" as const,
    price: 18.99,
    tags: ["memoir", "family", "civil rights"],
    category: "biography-memoir",
  },
  {
    title: "Digital Empire",
    slug: "digital-empire",
    subtitle: "Building a Tech Startup from Scratch",
    description: "From garage to global: the inside story of building a billion-dollar tech company, including the failures, pivots, and breakthroughs along the way.",
    isbn: "978-1-234567-00-7",
    pageCount: 298,
    format: "EBOOK" as const,
    price: 19.99,
    tags: ["business", "startup", "technology"],
    category: "business-finance",
  },
  {
    title: "Verses of the Soul",
    slug: "verses-of-the-soul",
    subtitle: "Collected Poems",
    description: "A collection of poems exploring love, loss, nature, and the human condition with vivid imagery and emotional depth.",
    isbn: "978-1-234567-00-8",
    pageCount: 156,
    format: "EBOOK" as const,
    price: 9.99,
    tags: ["poetry", "collection", "literary"],
    category: "poetry",
  },
  {
    title: "The Forgotten Kingdom",
    slug: "the-forgotten-kingdom",
    subtitle: "Chronicles of the Lost Realm",
    description: "A young archaeologist uncovers a hidden civilization that challenges everything we know about human history.",
    isbn: "978-1-234567-00-9",
    pageCount: 445,
    format: "HARDCOVER" as const,
    price: 22.99,
    isBestseller: true,
    tags: ["historical fiction", "adventure", "mystery"],
    category: "fiction",
  },
  {
    title: "Eternal Night",
    slug: "eternal-night",
    subtitle: "A Vampire Chronicle",
    description: "For centuries, she has walked alone. Now, a forbidden love threatens to destroy the delicate balance between the living and the undead.",
    isbn: "978-1-234567-01-0",
    pageCount: 389,
    format: "EBOOK" as const,
    price: 13.99,
    tags: ["paranormal", "vampire", "romance"],
    category: "fiction",
  },
  {
    title: "Quantum Horizons",
    slug: "quantum-horizons",
    subtitle: "The Future of Physics",
    description: "A groundbreaking exploration of quantum computing, dark matter, and the fundamental nature of reality itself.",
    isbn: "978-1-234567-01-1",
    pageCount: 267,
    format: "EBOOK" as const,
    price: 21.99,
    tags: ["science", "physics", "technology"],
    category: "non-fiction",
  },
  {
    title: "Little Dreamers",
    slug: "little-dreamers",
    subtitle: "Bedtime Stories for Children",
    description: "A collection of enchanting bedtime stories that inspire imagination and teach valuable life lessons to children ages 3-8.",
    isbn: "978-1-234567-01-2",
    pageCount: 128,
    format: "PAPERBACK" as const,
    price: 11.99,
    tags: ["children", "bedtime stories", "illustrated"],
    category: "children-ya",
  },
  {
    title: "The Warrior's Path",
    slug: "the-warriors-path",
    subtitle: "A Tale of Honor",
    description: "In ancient Japan, a young samurai must choose between duty and honor when his lord orders him to commit an act that violates his principles.",
    isbn: "978-1-234567-01-3",
    pageCount: 378,
    format: "EBOOK" as const,
    price: 14.99,
    tags: ["historical fiction", "samurai", "honor"],
    category: "fiction",
  },
  {
    title: "Sacred Journeys",
    slug: "sacred-journeys",
    subtitle: "A Spiritual Guide",
    description: "Explore the world's great spiritual traditions and find your own path to inner peace and divine connection.",
    isbn: "978-1-234567-01-4",
    pageCount: 312,
    format: "HARDCOVER" as const,
    price: 26.99,
    tags: ["spirituality", "religion", "philosophy"],
    category: "religion-spirituality",
  },
  {
    title: "Code Breakers",
    slug: "code-breakers",
    subtitle: "The Secret History of Cryptography",
    description: "From ancient ciphers to modern encryption, the fascinating story of how code breakers shaped the course of history.",
    isbn: "978-1-234567-01-5",
    pageCount: 356,
    format: "EBOOK" as const,
    price: 17.99,
    tags: ["history", "cryptography", "technology"],
    category: "history",
  },
];

const BLOG_POSTS = [
  {
    title: "The Future of Self-Publishing in 2025",
    slug: "future-of-self-publishing-2025",
    content: `<h2>The Rise of Independent Authors</h2><p>The self-publishing industry continues to evolve at a rapid pace. With platforms like Statement Publications empowering authors to take control of their publishing journey, the landscape is shifting dramatically.</p><h3>Key Trends to Watch</h3><ul><li>AI-assisted writing tools</li><li>Direct-to-reader sales models</li><li>Audio-first content creation</li><li>NFT-based book ownership</li></ul><p>Authors who embrace these trends while maintaining authentic storytelling will thrive in the new publishing ecosystem.</p>`,
    excerpt: "Explore the emerging trends shaping self-publishing and how independent authors can leverage new technologies.",
    category: "Publishing",
    tags: ["self-publishing", "trends", "2025", "authors"],
    isPublished: true,
    isFeatured: true,
  },
  {
    title: "How to Write a Compelling Book Blurb",
    slug: "how-to-write-compelling-book-blurb",
    content: `<h2>The Art of the Book Blurb</h2><p>Your book blurb is your first impression on potential readers. It's the sales pitch that can make or break a book sale.</p><h3>The Perfect Formula</h3><ol><li>Hook: Start with a compelling question or statement</li><li>Conflict: Introduce the central tension</li><li>Stakes: Show what's at risk</li><li>Closing: Leave them wanting more</li></ol><p>Remember: you have about 150 words to convince a reader to buy your book. Make every word count.</p>`,
    excerpt: "Master the art of writing book blurbs that sell. Learn the proven formula that converts browsers into buyers.",
    category: "Writing Tips",
    tags: ["writing", "marketing", "book blurbs"],
    isPublished: true,
  },
  {
    title: "Understanding Royalties: A Complete Guide for Authors",
    slug: "understanding-royalties-complete-guide",
    content: `<h2>How Royalties Work</h2><p>As an author, understanding how royalties work is crucial to managing your writing career as a business.</p><h3>Standard Royalty Rates</h3><ul><li>Ebooks: 35-70% (depending on pricing)</li><li>Paperbacks: 40-60%</li><li>Audiobooks: 25-50%</li></ul><p>At Statement Publications, we offer industry-leading royalty rates to ensure authors are fairly compensated for their work.</p>`,
    excerpt: "Everything authors need to know about royalty rates, payments, and maximizing their earnings.",
    category: "Author Resources",
    tags: ["royalties", "income", "author business"],
    isPublished: true,
    isFeatured: true,
  },
  {
    title: "5 Common Mistakes New Authors Make",
    slug: "5-common-mistakes-new-authors",
    content: `<h2>Avoid These Pitfalls</h2><p>Every first-time author faces challenges. Here are the five most common mistakes and how to avoid them.</p><h3>1. Skipping Professional Editing</h3><p>Even the best writers need editors. A fresh set of eyes can catch errors you've read past a hundred times.</p><h3>2. Poor Cover Design</h3><p>Readers DO judge books by their covers. Invest in professional cover design.</p><h3>3. Ignoring Marketing</h3><p>Writing the book is only half the battle. You need a marketing strategy.</p><h3>4. Underpricing</h3><p>Don't undervalue your work. Research comparable titles and price accordingly.</p><h3>5. Giving Up Too Soon</h3><p>Success takes time. Keep writing, keep learning, keep growing.</p>`,
    excerpt: "Learn from the mistakes of others. These five common pitfalls can derail your publishing journey.",
    category: "Writing Tips",
    tags: ["writing", "tips", "beginners"],
    isPublished: true,
  },
  {
    title: "Building Your Author Platform from Scratch",
    slug: "building-author-platform-from-scratch",
    content: `<h2>Why Author Platform Matters</h2><p>In today's crowded publishing landscape, having a strong author platform is essential for success.</p><h3>Key Components</h3><ul><li>Professional website</li><li>Email list</li><li>Social media presence</li><li>Content marketing</li><li>Community engagement</li></ul><p>Start small and be consistent. Your platform will grow over time if you show up regularly and provide value to your readers.</p>`,
    excerpt: "A step-by-step guide to building an author platform that attracts readers and sells books.",
    category: "Marketing",
    tags: ["platform", "marketing", "social media"],
    isPublished: true,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.analyticsEvent.deleteMany(),
    prisma.note.deleteMany(),
    prisma.highlight.deleteMany(),
    prisma.bookmark.deleteMany(),
    prisma.readingProgress.deleteMany(),
    prisma.affiliateReferral.deleteMany(),
    prisma.affiliate.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.blogComment.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.follower.deleteMany(),
    prisma.wishlist.deleteMany(),
    prisma.purchase.deleteMany(),
    prisma.review.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.order.deleteMany(),
    prisma.royalty.deleteMany(),
    prisma.withdrawal.deleteMany(),
    prisma.walletTransaction.deleteMany(),
    prisma.wallet.deleteMany(),
    prisma.book.deleteMany(),
    prisma.authorProfile.deleteMany(),
    prisma.readerProfile.deleteMany(),
    prisma.category.deleteMany(),
    prisma.siteContent.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("✅ Cleaned existing data");

  // Create roles and users
  const hashedPassword = await hash("admin123", 12);
  const readerPassword = await hash("reader123", 12);
  const authorPassword = await hash("author123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@statementpublications.com",
      name: "Admin User",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isVerified: true,
      isActive: true,
      bio: "Platform administrator for Statement Publications.",
    },
  });

  const author1 = await prisma.user.create({
    data: {
      email: "sarah.chen@statementpub.com",
      name: "Sarah Chen",
      password: authorPassword,
      role: "AUTHOR",
      isVerified: true,
      isActive: true,
      bio: "Award-winning author of mystery and thriller novels.",
      authorProfile: {
        create: {
          penName: "Sarah Chen",
          website: "https://sarahchen.com",
          genre: ["Mystery", "Thriller", "Crime"],
          bio: "Sarah Chen is an award-winning author known for her gripping mystery novels. With over a decade of writing experience, she has captivated readers worldwide.",
          totalBooks: 3,
          isFeatured: true,
        },
      },
    },
  });

  const author2 = await prisma.user.create({
    data: {
      email: "james.rivera@statementpub.com",
      name: "James Rivera",
      password: authorPassword,
      role: "AUTHOR",
      isVerified: true,
      isActive: true,
      bio: "Bestselling author of science fiction and fantasy.",
      authorProfile: {
        create: {
          penName: "J.R. Rivera",
          website: "https://jamesrivera.com",
          genre: ["Science Fiction", "Fantasy", "Adventure"],
          bio: "J.R. Rivera is a bestselling author who crafts epic tales of adventure across multiple genres.",
          totalBooks: 4,
          totalSales: 15000,
          totalEarnings: 12000.50,
          isFeatured: true,
        },
      },
    },
  });

  const author3 = await prisma.user.create({
    data: {
      email: "emily.park@statementpub.com",
      name: "Emily Park",
      password: authorPassword,
      role: "AUTHOR",
      isVerified: true,
      isActive: true,
      bio: "Author of self-help and personal development books.",
      authorProfile: {
        create: {
          penName: "Emily Park",
          website: "https://emilypark.com",
          genre: ["Self-Help", "Mindfulness", "Personal Development"],
          bio: "Emily Park is a mindfulness coach and author helping people find inner peace in a chaotic world.",
          totalBooks: 2,
          totalSales: 8000,
          totalEarnings: 6500.00,
        },
      },
    },
  });

  const reader1 = await prisma.user.create({
    data: {
      email: "reader@example.com",
      name: "Alex Reader",
      password: readerPassword,
      role: "READER",
      isVerified: true,
      isActive: true,
      bio: "Avid reader and book lover.",
      readerProfile: {
        create: {
          favoriteGenres: ["Mystery", "Science Fiction", "Fantasy"],
          totalPurchases: 5,
          totalSpent: 64.95,
        },
      },
    },
  });

  const reader2 = await prisma.user.create({
    data: {
      email: "bookworm@example.com",
      name: "Jordan Bookworm",
      password: readerPassword,
      role: "READER",
      isVerified: true,
      isActive: true,
      bio: "Can't stop reading!",
      readerProfile: {
        create: {
          favoriteGenres: ["Romance", "Poetry", "Children"],
          totalPurchases: 3,
          totalSpent: 38.97,
        },
      },
    },
  });

  console.log("✅ Created users");

  // Create categories
  const categoryMap: Record<string, string> = {};

  for (const cat of CATEGORIES) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryMap[cat.slug] = created.id;
  }

  console.log("✅ Created categories");

  // Get author profile IDs
  const authorProfile1 = await prisma.authorProfile.findUnique({ where: { userId: author1.id } });
  const authorProfile2 = await prisma.authorProfile.findUnique({ where: { userId: author2.id } });
  const authorProfile3 = await prisma.authorProfile.findUnique({ where: { userId: author3.id } });

  // Create books
  const bookIds: string[] = [];

  for (let i = 0; i < BOOKS.length; i++) {
    const bookData = BOOKS[i];
    const authorProfiles = [authorProfile1, authorProfile2, authorProfile3];
    const authorProfile = authorProfiles[i % 3];

    const book = await prisma.book.create({
      data: {
        title: bookData.title,
        slug: bookData.slug,
        subtitle: bookData.subtitle,
        description: bookData.description,
        authorId: authorProfile!.id,
        categoryId: categoryMap[bookData.category],
        isbn: bookData.isbn,
        pageCount: bookData.pageCount,
        format: bookData.format,
        status: "PUBLISHED",
        isPublic: true,
        isFeatured: bookData.isFeatured ?? false,
        isBestseller: bookData.isBestseller ?? false,
        isNew: i > 10,
        price: bookData.price,
        discountPrice: bookData.discountPrice ?? null,
        royaltyRate: 70,
        totalSales: Math.floor(Math.random() * 500) + 50,
        totalRevenue: Math.floor(Math.random() * 5000) + 500,
        totalReviews: Math.floor(Math.random() * 50) + 5,
        averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        tags: bookData.tags,
        publicationDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      },
    });

    bookIds.push(book.id);
  }

  console.log("✅ Created books");

  // Create reviews
  const reviewData = [
    { userId: reader1.id, bookSlug: "the-silent-echo", rating: 5, title: "Absolutely gripping!", content: "Couldn't put it down. The plot twists were incredible." },
    { userId: reader2.id, bookSlug: "the-silent-echo", rating: 4, title: "Great mystery", content: "Well-written with compelling characters." },
    { userId: reader1.id, bookSlug: "whispers-in-the-wind", rating: 5, title: "Beautiful love story", content: "Touched my heart. A must-read for romance fans." },
    { userId: reader2.id, bookSlug: "beyond-the-stars", rating: 5, title: "Epic space opera", content: "Amazing world-building and characters." },
    { userId: reader1.id, bookSlug: "the-art-of-mindful-living", rating: 4, title: "Life-changing", content: "Practical advice that actually works." },
    { userId: reader2.id, bookSlug: "kingdom-of-shadows", rating: 4, title: "Fantasy at its best", content: "Couldn't stop reading. Waiting for the sequel!" },
    { userId: reader1.id, bookSlug: "digital-empire", rating: 5, title: "Inspiring", content: "Must-read for any aspiring entrepreneur." },
    { userId: reader2.id, bookSlug: "verses-of-the-soul", rating: 5, title: "Poetry that moves", content: "Every poem is a masterpiece." },
  ];

  for (const review of reviewData) {
    const book = await prisma.book.findUnique({ where: { slug: review.bookSlug } });
    if (book) {
      await prisma.review.create({
        data: {
          userId: review.userId,
          bookId: book.id,
          rating: review.rating,
          title: review.title,
          content: review.content,
          isVerified: true,
        },
      });
    }
  }

  console.log("✅ Created reviews");

  // Create blog posts
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        authorId: admin.id,
        category: post.category,
        tags: post.tags,
        isPublished: post.isPublished,
        isFeatured: post.isFeatured ?? false,
        publishedAt: new Date(),
      },
    });
  }

  console.log("✅ Created blog posts");

  // Create wallets for authors
  for (const profile of [authorProfile1, authorProfile2, authorProfile3]) {
    if (profile) {
      const user = await prisma.user.findUnique({ where: { id: profile.userId } });
      if (user) {
        await prisma.wallet.create({
          data: {
            userId: user.id,
            balance: Math.floor(Math.random() * 1000) + 100,
            totalEarned: Math.floor(Math.random() * 5000) + 500,
            totalWithdrawn: Math.floor(Math.random() * 500),
          },
        });
      }
    }
  }

  console.log("✅ Created wallets");

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        type: "SYSTEM",
        title: "Welcome to Statement Publications",
        message: "Your admin account has been set up successfully.",
        isRead: true,
      },
      {
        userId: author1.id,
        type: "BOOK_APPROVED",
        title: "Book Published",
        message: "Your book 'The Silent Echo' has been approved and is now live.",
      },
      {
        userId: reader1.id,
        type: "ANNOUNCEMENT",
        title: "New Releases",
        message: "Check out the latest books from your favorite authors!",
      },
    ],
  });

  console.log("✅ Created notifications");

  // Create site content
  const siteContents = [
    { key: "hero_title", value: "Every Story Makes A Statement" },
    { key: "hero_subtitle", value: "Publish your story to the world with Statement Publications." },
    { key: "about_title", value: "About Statement Publications" },
    { key: "about_content", value: "Statement Publications is a modern self-publishing platform empowering authors worldwide." },
    { key: "contact_email", value: "hello@statementpub.com" },
    { key: "footer_text", value: "© 2025 Statement Publications. All rights reserved." },
  ];

  for (const content of siteContents) {
    await prisma.siteContent.create({ data: content });
  }

  console.log("✅ Created site content");

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📧 Login credentials:");
  console.log("  Admin: admin@statementpublications.com / admin123");
  console.log("  Author: sarah.chen@statementpub.com / author123");
  console.log("  Reader: reader@example.com / reader123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
