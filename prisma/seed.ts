import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
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
  { title: "The Silent Echo", slug: "the-silent-echo", description: "A haunting tale of memory and loss that transcends time and space.", categoryId: "fiction", price: 12.99, pages: 320, rating: 4.5 },
  { title: "Echoes of Tomorrow", slug: "echoes-of-tomorrow", description: "A visionary novel about the threads that connect our past to our future.", categoryId: "fiction", price: 14.99, pages: 280, rating: 4.3 },
  { title: "The Silent Garden", slug: "the-silent-garden", description: "A lyrical exploration of solitude and the secrets gardens keep.", categoryId: "fiction", price: 11.99, pages: 256, rating: 4.7 },
  { title: "Midnight Bridges", slug: "midnight-bridges", description: "Stories that span cultures, generations, and the bridges between us.", categoryId: "fiction", price: 13.99, pages: 340, rating: 4.2 },
  { title: "Thinking in Systems", slug: "thinking-in-systems", description: "A primer on systems thinking for a complex world.", categoryId: "non-fiction", price: 16.99, pages: 240, rating: 4.6 },
  { title: "The Power of Habit", slug: "the-power-of-habit", description: "Why we do what we do in life and business.", categoryId: "non-fiction", price: 15.99, pages: 371, rating: 4.4 },
  { title: "Atomic Focus", slug: "atomic-focus", description: "Small changes, remarkable results. Master the art of concentration.", categoryId: "non-fiction", price: 14.99, pages: 320, rating: 4.8 },
  { title: "The Art of Innovation", slug: "the-art-of-innovation", description: "Lessons in creativity from IDEO, America's leading design firm.", categoryId: "business", price: 18.99, pages: 304, rating: 4.3 },
  { title: "Zero to One", slug: "zero-to-one", description: "Notes on startups, or how to build the future.", categoryId: "business", price: 17.99, pages: 224, rating: 4.5 },
  { title: "Good to Great", slug: "good-to-great", description: "Why some companies make the leap and others don't.", categoryId: "business", price: 16.99, pages: 320, rating: 4.4 },
  { title: "Clean Code", slug: "clean-code", description: "A handbook of agile software craftsmanship.", categoryId: "technology", price: 34.99, pages: 464, rating: 4.7 },
  { title: "The Pragmatic Programmer", slug: "the-pragmatic-programmer", description: "Your journey to mastery in software development.", categoryId: "technology", price: 39.99, pages: 352, rating: 4.8 },
  { title: "AI Revolution", slug: "ai-revolution", description: "How artificial intelligence is transforming our world.", categoryId: "technology", price: 22.99, pages: 380, rating: 4.2 },
  { title: "Mindset", slug: "mindset", description: "The new psychology of success that changes how we think about learning.", categoryId: "education", price: 14.99, pages: 276, rating: 4.5 },
  { title: "The First 20 Hours", slug: "the-first-20-hours", description: "How to learn anything fast.", categoryId: "education", price: 13.99, pages: 256, rating: 4.1 },
  { title: "Ultralearning", slug: "ultralearning", description: "Master hard skills, outsmart the competition, and accelerate your career.", categoryId: "education", price: 15.99, pages: 304, rating: 4.6 },
  { title: "The Purpose Driven Life", slug: "the-purpose-driven-life", description: "What on Earth am I here for?", categoryId: "religion", price: 12.99, pages: 368, rating: 4.3 },
  { title: "Mere Christianity", slug: "mere-christianity", description: "A theological classic by C.S. Lewis.", categoryId: "religion", price: 11.99, pages: 227, rating: 4.7 },
  { title: "Steve Jobs", slug: "steve-jobs", description: "The exclusive biography of Apple's visionary co-founder.", categoryId: "biography", price: 16.99, pages: 656, rating: 4.5 },
  { title: "Educated", slug: "educated", description: "A memoir about a young girl who leaves her survivalist family.", categoryId: "biography", price: 14.99, pages: 352, rating: 4.8 },
  { title: "Becoming", slug: "becoming", description: "Michelle Obama's inspiring journey from childhood to the White House.", categoryId: "biography", price: 18.99, pages: 448, rating: 4.6 },
  { title: "The Notebook", slug: "the-notebook", description: "A love story that spans decades and defies all odds.", categoryId: "romance", price: 11.99, pages: 214, rating: 4.4 },
  { title: "Pride and Prejudice", slug: "pride-and-prejudice", description: "Jane Austen's timeless tale of love and misunderstanding.", categoryId: "romance", price: 9.99, pages: 432, rating: 4.9 },
  { title: "Gone Girl", slug: "gone-girl", description: "A thriller about a marriage gone terribly wrong.", categoryId: "mystery", price: 13.99, pages: 432, rating: 4.2 },
  { title: "The Girl on the Train", slug: "the-girl-on-the-train", description: "A gripping psychological thriller that will keep you guessing.", categoryId: "mystery", price: 12.99, pages: 336, rating: 4.1 },
  { title: "The Silent Patient", slug: "the-silent-patient", description: "A woman shoots her husband and then stops speaking entirely.", categoryId: "mystery", price: 14.99, pages: 352, rating: 4.6 },
  { title: "Milk and Honey", slug: "milk-and-honey", description: "A collection of poetry about survival, loss, love, and femininity.", categoryId: "poetry", price: 12.99, pages: 208, rating: 4.3 },
  { title: "The Sun and Her Flowers", slug: "the-sun-and-her-flowers", description: "A vibrant poetry collection about growth and healing.", categoryId: "poetry", price: 14.99, pages: 256, rating: 4.4 },
  { title: "Leaves of Grass", slug: "leaves-of-grass", description: "Walt Whitman's masterpiece of American poetry.", categoryId: "poetry", price: 10.99, pages: 544, rating: 4.7 },
  { title: "The Giving Tree", slug: "the-giving-tree", description: "A timeless parable about giving and receiving.", categoryId: "children", price: 8.99, pages: 64, rating: 4.8 },
  { title: "Where the Wild Things Are", slug: "where-the-wild-things-are", description: "Maurice Sendak's beloved classic of childhood imagination.", categoryId: "children", price: 9.99, pages: 48, rating: 4.9 },
  { title: "Charlotte's Web", slug: "charlottes-web", description: "The classic tale of a pig named Wilbur and his friendship with a spider.", categoryId: "children", price: 7.99, pages: 184, rating: 4.9 },
  { title: "Rich Dad Poor Dad", slug: "rich-dad-poor-dad", description: "What the rich teach their kids about money.", categoryId: "finance", price: 15.99, pages: 336, rating: 4.5 },
  { title: "The Millionaire Next Door", slug: "the-millionaire-next-door", description: "The surprising secrets of America's wealthy.", categoryId: "finance", price: 14.99, pages: 272, rating: 4.3 },
  { title: "I Will Teach You to Be Rich", slug: "i-will-teach-you-to-be-rich", description: "A 6-week personal finance program for ages 20 to 35.", categoryId: "finance", price: 16.99, pages: 336, rating: 4.6 },
  { title: "Sapiens", slug: "sapiens", description: "A brief history of humankind that changed how we see the world.", categoryId: "history", price: 17.99, pages: 464, rating: 4.7 },
  { title: "Guns, Germs, and Steel", slug: "guns-germs-and-steel", description: "The fates of human societies explained through geography.", categoryId: "history", price: 15.99, pages: 498, rating: 4.4 },
];

const BLOG_POSTS = [
  { title: "How to Write Your First Book in 30 Days", slug: "write-first-book-30-days", content: "Writing a book doesn't have to take years. Here's a proven framework to draft your manuscript in just one month...", excerpt: "A proven framework to draft your manuscript in just one month.", category: "Writing Tips" },
  { title: "The Complete Guide to Self-Publishing in 2026", slug: "complete-guide-self-publishing-2026", content: "Self-publishing has never been more accessible. From manuscript to market, here's everything you need to know...", excerpt: "Everything you need to know about self-publishing in the modern era.", category: "Publishing" },
  { title: "10 Book Cover Design Trends That Sell", slug: "book-cover-design-trends", content: "Your book cover is your first impression. These design trends are dominating bestseller lists right now...", excerpt: "Design trends dominating bestseller lists right now.", category: "Design" },
  { title: "Building Your Author Platform from Scratch", slug: "building-author-platform", content: "Every successful author needs a platform. Here's how to build one from zero with no audience...", excerpt: "Build an author platform from zero with no existing audience.", category: "Marketing" },
  { title: "Understanding Royalties: How Authors Actually Make Money", slug: "understanding-royalties", content: "Royalties can be confusing. Let's break down exactly how authors earn from their books...", excerpt: "A clear breakdown of how authors earn from their books.", category: "Business" },
];

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  try {
    await prisma.$executeRaw`TRUNCATE TABLE "AuditLog", "AnalyticsEvent", "Note", "Highlight", "Bookmark", "ReadingProgress", "AffiliateReferral", "Affiliate", "Coupon", "BlogComment", "BlogPost", "Notification", "Follower", "Wishlist", "Purchase", "Review", "OrderItem", "Payment", "Order", "Royalty", "Withdrawal", "WalletTransaction", "Wallet", "Book", "AuthorProfile", "ReaderProfile", "Category", "SiteContent", "Announcement", "Session", "Account", "VerificationToken", "User" CASCADE`;
    console.log("Cleaned existing data");
  } catch (e) {
    console.log("Tables may not exist yet, continuing...");
  }

  // Create users
  const adminPassword = await hash("admin123", 12);
  const authorPassword = await hash("author123", 12);
  const readerPassword = await hash("reader123", 12);

  const admin = await prisma.user.create({
    data: { email: "admin@statementpublications.com", name: "Admin User", password: adminPassword, role: "ADMIN", isVerified: true, emailVerified: new Date() },
  });

  const author1 = await prisma.user.create({
    data: { email: "sarah.chen@statementpub.com", name: "Sarah Chen", password: authorPassword, role: "AUTHOR", isVerified: true, emailVerified: new Date() },
  });

  const author2 = await prisma.user.create({
    data: { email: "james.mitchell@statementpub.com", name: "James Mitchell", password: authorPassword, role: "AUTHOR", isVerified: true, emailVerified: new Date() },
  });

  const author3 = await prisma.user.create({
    data: { email: "ama.okafor@statementpub.com", name: "Ama Okafor", password: authorPassword, role: "AUTHOR", isVerified: true, emailVerified: new Date() },
  });

  const reader = await prisma.user.create({
    data: { email: "reader@example.com", name: "Demo Reader", password: readerPassword, role: "READER", isVerified: true, emailVerified: new Date() },
  });

  console.log("Created users");

  // Create author profiles
  const ap1 = await prisma.authorProfile.create({
    data: { userId: author1.id, penName: "Sarah Chen", bio: "Award-winning author of contemporary fiction and literary novels.", genre: ["Fiction", "Literary Fiction"], totalBooks: 5, isFeatured: true },
  });

  const ap2 = await prisma.authorProfile.create({
    data: { userId: author2.id, penName: "James Mitchell", bio: "Business strategist and bestselling non-fiction author.", genre: ["Business", "Non-Fiction"], totalBooks: 4, isFeatured: true },
  });

  const ap3 = await prisma.authorProfile.create({
    data: { userId: author3.id, penName: "Ama Okafor", bio: "Poet, essayist, and storyteller from Lagos, Nigeria.", genre: ["Poetry", "Fiction"], totalBooks: 3, isFeatured: true },
  });

  // Create reader profile
  await prisma.readerProfile.create({
    data: { userId: reader.id, favoriteGenres: ["Fiction", "Business", "Poetry"], totalPurchases: 0 },
  });

  // Create wallets
  await prisma.wallet.create({ data: { userId: author1.id, balance: 1250.00, totalEarned: 3500.00, totalWithdrawn: 2250.00 } });
  await prisma.wallet.create({ data: { userId: author2.id, balance: 890.00, totalEarned: 2100.00, totalWithdrawn: 1210.00 } });
  await prisma.wallet.create({ data: { userId: author3.id, balance: 450.00, totalEarned: 900.00, totalWithdrawn: 450.00 } });

  console.log("Created profiles and wallets");

  // Create categories
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug, description: cat.description, sortOrder: cat.sortOrder },
    });
    categoryMap[cat.slug] = created.id;
  }

  console.log("Created categories");

  // Create books
  const authorProfiles = [ap1, ap2, ap3];
  for (let i = 0; i < BOOKS.length; i++) {
    const book = BOOKS[i];
    const authorProfile = authorProfiles[i % 3];
    const catId = categoryMap[book.categoryId];
    await prisma.book.create({
      data: {
        title: book.title,
        slug: book.slug,
        description: book.description,
        authorId: authorProfile.id,
        categoryId: catId,
        pageCount: book.pages,
        price: book.price,
        royaltyRate: 70,
        status: "PUBLISHED",
        isPublic: true,
        averageRating: book.rating,
        totalSales: Math.floor(Math.random() * 500) + 50,
        totalReviews: Math.floor(Math.random() * 50) + 5,
        totalRevenue: Math.floor(Math.random() * 5000) + 500,
        format: "EBOOK",
        language: "English",
        publicationDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        tags: [book.categoryId],
      },
    });
  }

  console.log("Created books");

  // Create blog posts
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        authorId: author1.id,
        category: post.category,
        tags: [post.category.toLowerCase()],
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log("Created blog posts");

  // Create some reviews
  const books = await prisma.book.findMany({ take: 10 });
  for (const book of books) {
    await prisma.review.create({
      data: {
        userId: reader.id,
        bookId: book.id,
        rating: Math.floor(Math.random() * 2) + 4,
        title: `Great read!`,
        content: `Really enjoyed "${book.title}". Highly recommend it!`,
        isVerified: true,
      },
    });
  }

  console.log("Created reviews");

  // Site content
  await prisma.siteContent.create({ data: { key: "hero_title", value: "Publish Your Story To The World", type: "text" } });
  await prisma.siteContent.create({ data: { key: "hero_subtitle", value: "Become a Published Author Today", type: "text" } });
  await prisma.siteContent.create({ data: { key: "about", value: "Statement Publications empowers writers, authors, researchers, educators, and storytellers to publish, distribute, and monetize their works globally.", type: "text" } });

  console.log("Created site content");
  console.log("Seeding complete!");
  console.log("");
  console.log("Demo Login Credentials:");
  console.log("Admin:  admin@statementpublications.com / admin123");
  console.log("Author: sarah.chen@statementpub.com / author123");
  console.log("Reader: reader@example.com / reader123");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Seed failed:", e);
  prisma.$disconnect();
  process.exit(1);
});
