"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, FileText, Plus, Trash2, Eye, RefreshCw, Calendar, Star, BarChart3,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Clock, Heart, Share2,
  MessageSquare, BookOpen, Zap, Download, Upload, Edit3, X,
  Eye as EyeIcon, LayoutGrid, List, Target, CalendarDays,
  Activity, SlidersHorizontal, Rss, BarChart2, Tag, FileUp,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { actionHistory } from "@/lib/action-history";
import { SyncedTableScroll, type SyncedTableScrollHandle } from "@/components/ui/synced-table-scroll";

type BlogStatus = "published" | "draft" | "scheduled" | "review" | "archived";
type ViewMode = "grid" | "table" | "calendar";

interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: { name: string; email: string; avatar?: string };
  status: BlogStatus;
  featured: boolean;
  views: number;
  comments: number;
  likes: number;
  shares: number;
  readingTime: number;
  seoScore: number;
  featuredImage: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ActivityRecord {
  id: string;
  type: "publish" | "create" | "edit" | "delete" | "feature" | "unfeature" | "status_change" | "category" | "import" | "delete_category" | "restore_category";
  message: string;
  time: string;
}

interface BlogCategoryRecord {
  id: string;
  name: string;
  postCount: number;
}

const BLOG_CATEGORIES = ["Publishing", "Marketing", "Leadership", "Business", "Technology", "Personal Finance", "Writing", "Productivity", "Book Design", "Self Development"];

const CATEGORY_COLORS: Record<string, string> = {
  Publishing: "bg-blue-50 text-blue-700 border-blue-200",
  Marketing: "bg-orange-50 text-orange-700 border-orange-200",
  Leadership: "bg-purple-50 text-purple-700 border-purple-200",
  Business: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Technology: "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Personal Finance": "bg-green-50 text-green-700 border-green-200",
  Writing: "bg-pink-50 text-pink-700 border-pink-200",
  Productivity: "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Book Design": "bg-red-50 text-red-700 border-red-200",
  "Self Development": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const CATEGORY_HEX: Record<string, string> = {
  Publishing: "#3B82F6",
  Marketing: "#F97316",
  Leadership: "#A855F7",
  Business: "#6366F1",
  Technology: "#06B6D4",
  "Personal Finance": "#22C55E",
  Writing: "#EC4899",
  Productivity: "#EAB308",
  "Book Design": "#EF4444",
  "Self Development": "#10B981",
};

const STATUS_CONFIG: Record<BlogStatus, { label: string; color: string; bgColor: string }> = {
  published: { label: "Published", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  draft: { label: "Draft", color: "text-slate-700", bgColor: "bg-slate-50 border-slate-200" },
  scheduled: { label: "Scheduled", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  review: { label: "In Review", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  archived: { label: "Archived", color: "text-gray-700", bgColor: "bg-gray-50 border-gray-200" },
};

const DEMO_POSTS: BlogPostRecord[] = [
  {
    id: "bp-1", title: "How to Publish Your First Book Successfully", slug: "publish-first-book",
    excerpt: "A comprehensive guide for first-time authors navigating the publishing landscape, from manuscript preparation to launch day.",
    content: "Publishing your first book is an exciting milestone. This guide covers everything from preparing your manuscript to choosing the right publishing path, understanding ISBN requirements, and planning your launch strategy. We'll walk you through self-publishing vs traditional publishing, formatting requirements, and marketing basics every new author needs to know.", category: "Publishing",
    tags: ["publishing", "first-time authors", "guide"], author: { name: "Sarah Mitchell", email: "sarah.mitchell@statement.com" },
    status: "published", featured: true, views: 12480, comments: 342, likes: 890, shares: 234, readingTime: 8, seoScore: 94,
    featuredImage: "", publishedAt: "2026-06-15T10:00:00Z", createdAt: "2026-06-10T08:00:00Z", updatedAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "bp-2", title: "10 Mistakes First-Time Authors Make", slug: "10-mistakes-first-time-authors",
    excerpt: "Learn from the most common pitfalls that new authors encounter and how to avoid them in your publishing journey.",
    content: "Every first-time author makes mistakes. From skipping professional editing to choosing the wrong cover design, these errors can cost you readers and credibility. We've compiled the top 10 mistakes we see most often and provide actionable solutions for each one.", category: "Writing",
    tags: ["writing tips", "common mistakes", "authors"], author: { name: "James Cooper", email: "james.cooper@statement.com" },
    status: "published", featured: true, views: 9840, comments: 267, likes: 756, shares: 189, readingTime: 6, seoScore: 91,
    featuredImage: "", publishedAt: "2026-06-12T14:00:00Z", createdAt: "2026-06-08T09:00:00Z", updatedAt: "2026-06-12T14:00:00Z",
  },
  {
    id: "bp-3", title: "Understanding ISBNs for Self Publishing", slug: "understanding-isbn-self-publishing",
    excerpt: "Everything you need to know about ISBNs, barcodes, and metadata for self-published books.",
    content: "ISBNs are crucial for book distribution. This article explains what ISBNs are, when you need them, how to obtain them, and the differences between free ISBNs from platforms like Amazon KDP versus purchasing your own from Bowker.", category: "Publishing",
    tags: ["ISBN", "self publishing", "metadata"], author: { name: "Emily Watson", email: "emily.watson@statement.com" },
    status: "published", featured: false, views: 6720, comments: 143, likes: 445, shares: 98, readingTime: 5, seoScore: 88,
    featuredImage: "", publishedAt: "2026-06-08T12:00:00Z", createdAt: "2026-06-05T10:00:00Z", updatedAt: "2026-06-08T12:00:00Z",
  },
  {
    id: "bp-4", title: "Building a Personal Author Brand", slug: "building-personal-author-brand",
    excerpt: "How to create a recognizable author brand that resonates with readers and builds lasting loyalty.",
    content: "Your author brand is more than a logo. It's the consistent experience readers have with you across every touchpoint. Learn how to define your brand voice, create visual consistency, and build an authentic connection with your audience.", category: "Marketing",
    tags: ["branding", "author brand", "marketing"], author: { name: "Lisa Park", email: "lisa.park@statement.com" },
    status: "published", featured: true, views: 8340, comments: 198, likes: 623, shares: 167, readingTime: 7, seoScore: 92,
    featuredImage: "", publishedAt: "2026-06-05T09:00:00Z", createdAt: "2026-06-01T11:00:00Z", updatedAt: "2026-06-05T09:00:00Z",
  },
  {
    id: "bp-5", title: "Marketing Your Book on Social Media", slug: "marketing-book-social-media",
    excerpt: "Proven strategies for promoting your book across Instagram, Twitter, TikTok, and Facebook.",
    content: "Social media is one of the most powerful tools for book marketing. This guide covers platform-specific strategies for Instagram, Twitter, TikTok, and Facebook, including content calendars, hashtag research, and engagement techniques.", category: "Marketing",
    tags: ["social media", "book marketing", "promotion"], author: { name: "Michael Brown", email: "michael.brown@statement.com" },
    status: "published", featured: false, views: 5640, comments: 112, likes: 389, shares: 145, readingTime: 6, seoScore: 87,
    featuredImage: "", publishedAt: "2026-06-02T11:00:00Z", createdAt: "2026-05-28T08:00:00Z", updatedAt: "2026-06-02T11:00:00Z",
  },
  {
    id: "bp-6", title: "How to Design a Best-Selling Book Cover", slug: "design-bestselling-book-cover",
    excerpt: "Design principles, color psychology, and typography tips for creating covers that sell.",
    content: "Your book cover is your first impression. Learn the principles of effective cover design, including color psychology, typography hierarchy, genre expectations, and how to work with designers to create a cover that converts browsers into buyers.", category: "Book Design",
    tags: ["book cover", "design", "typography"], author: { name: "Sarah Mitchell", email: "sarah.mitchell@statement.com" },
    status: "published", featured: true, views: 7890, comments: 234, likes: 567, shares: 134, readingTime: 9, seoScore: 90,
    featuredImage: "", publishedAt: "2026-05-28T15:00:00Z", createdAt: "2026-05-24T10:00:00Z", updatedAt: "2026-05-28T15:00:00Z",
  },
  {
    id: "bp-7", title: "Creating Passive Income Through Publishing", slug: "passive-income-publishing",
    excerpt: "How authors can build multiple revenue streams through strategic publishing and content creation.",
    content: "Publishing can create lasting passive income. This article explores how to build multiple revenue streams through audiobooks, Kindle Unlimited, print-on-demand, and licensing your content.", category: "Personal Finance",
    tags: ["passive income", "revenue", "business"], author: { name: "James Cooper", email: "james.cooper@statement.com" },
    status: "published", featured: false, views: 4560, comments: 89, likes: 312, shares: 78, readingTime: 7, seoScore: 85,
    featuredImage: "", publishedAt: "2026-05-25T10:00:00Z", createdAt: "2026-05-20T09:00:00Z", updatedAt: "2026-05-25T10:00:00Z",
  },
  {
    id: "bp-8", title: "The Future of Independent Publishing", slug: "future-independent-publishing",
    excerpt: "Trends shaping the indie publishing landscape, from AI tools to direct-to-reader platforms.",
    content: "The independent publishing industry is evolving rapidly. Explore the latest trends including AI-assisted writing, direct sales platforms, subscription models, and how technology is democratizing publishing.", category: "Business",
    tags: ["industry trends", "indie publishing", "future"], author: { name: "Emily Watson", email: "emily.watson@statement.com" },
    status: "scheduled", featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: 8, seoScore: 82,
    featuredImage: "", publishedAt: null, createdAt: "2026-06-18T14:00:00Z", updatedAt: "2026-06-18T14:00:00Z",
  },
  {
    id: "bp-9", title: "Writing Productivity Hacks for Authors", slug: "writing-productivity-hacks",
    excerpt: "Maximize your writing output with proven techniques used by bestselling authors worldwide.",
    content: "Productivity is the difference between authors who finish books and those who don't. Learn time-blocking, the Pomodoro technique adapted for writers, how to set up your writing environment, and daily word count strategies.", category: "Productivity",
    tags: ["productivity", "writing habits", "time management"], author: { name: "Lisa Park", email: "lisa.park@statement.com" },
    status: "draft", featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: 5, seoScore: 78,
    featuredImage: "", publishedAt: null, createdAt: "2026-06-16T11:00:00Z", updatedAt: "2026-06-16T11:00:00Z",
  },
  {
    id: "bp-10", title: "How to Build a Publishing Business", slug: "build-publishing-business",
    excerpt: "Turn your passion for books into a sustainable business with this step-by-step framework.",
    content: "Publishing isn't just writing — it's running a business. This framework covers business registration, financial planning, team building, and scaling your publishing operation for long-term success.", category: "Leadership",
    tags: ["business", "entrepreneurship", "publishing"], author: { name: "Michael Brown", email: "michael.brown@statement.com" },
    status: "draft", featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: 10, seoScore: 80,
    featuredImage: "", publishedAt: null, createdAt: "2026-06-14T09:00:00Z", updatedAt: "2026-06-14T09:00:00Z",
  },
  {
    id: "bp-11", title: "Advanced Book Launch Strategies", slug: "advanced-book-launch",
    excerpt: "Take your book launch to the next level with data-driven pre-launch campaigns and launch week tactics.",
    content: "A successful book launch requires careful planning. This guide covers pre-launch email campaigns, ARC distribution, launch week social media blitz, and post-launch momentum strategies.", category: "Marketing",
    tags: ["book launch", "strategy", "campaigns"], author: { name: "Olivia Carter", email: "olivia.carter@statement.com" },
    status: "review", featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: 7, seoScore: 86,
    featuredImage: "", publishedAt: null, createdAt: "2026-06-17T10:00:00Z", updatedAt: "2026-06-17T10:00:00Z",
  },
  {
    id: "bp-12", title: "SEO for Authors: Get Found Online", slug: "seo-for-authors",
    excerpt: "Search engine optimization strategies specifically designed for author websites and book pages.",
    content: "Learn how to optimize your author website, Amazon book pages, and blog content for search engines. This guide covers keyword research, on-page SEO, backlink building, and content strategy for authors.", category: "Technology",
    tags: ["SEO", "technology", "visibility"], author: { name: "Sarah Mitchell", email: "sarah.mitchell@statement.com" },
    status: "published", featured: false, views: 3420, comments: 78, likes: 234, shares: 56, readingTime: 6, seoScore: 93,
    featuredImage: "", publishedAt: "2026-05-20T12:00:00Z", createdAt: "2026-05-16T08:00:00Z", updatedAt: "2026-05-20T12:00:00Z",
  },
  {
    id: "bp-13", title: "The Author's Guide to Email Marketing", slug: "author-email-marketing",
    excerpt: "Build and nurture your reader list with effective email marketing strategies that convert.",
    content: "Email marketing remains the most effective way to reach readers directly. Learn how to build your list, create compelling newsletters, automate welcome sequences, and drive book sales through email.", category: "Marketing",
    tags: ["email marketing", "reader engagement", "list building"], author: { name: "James Cooper", email: "james.cooper@statement.com" },
    status: "scheduled", featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: 8, seoScore: 84,
    featuredImage: "", publishedAt: null, createdAt: "2026-06-19T09:00:00Z", updatedAt: "2026-06-19T09:00:00Z",
  },
  {
    id: "bp-14", title: "Book Formatting: Print vs Digital", slug: "book-formatting-print-digital",
    excerpt: "Understanding the different formatting requirements for print books, ebooks, and audiobooks.",
    content: "Each book format has unique requirements. This article covers print formatting with InDesign, ebook formatting with Vellum or Atticus, and audiobook production basics.", category: "Publishing",
    tags: ["formatting", "print", "digital"], author: { name: "Emily Watson", email: "emily.watson@statement.com" },
    status: "archived", featured: false, views: 2870, comments: 56, likes: 178, shares: 34, readingTime: 6, seoScore: 79,
    featuredImage: "", publishedAt: "2026-04-15T10:00:00Z", createdAt: "2026-04-10T08:00:00Z", updatedAt: "2026-05-01T12:00:00Z",
  },
  {
    id: "bp-15", title: "Writing Compelling Book Descriptions", slug: "compelling-book-descriptions",
    excerpt: "Craft descriptions that hook readers and drive sales on Amazon and other platforms.",
    content: "Your book description is sales copy. Learn the AIDA framework, how to write hooks that grab attention, format for Amazon's algorithm, and include keywords naturally for maximum discoverability.", category: "Writing",
    tags: ["copywriting", "book descriptions", "sales"], author: { name: "Lisa Park", email: "lisa.park@statement.com" },
    status: "published", featured: false, views: 4120, comments: 98, likes: 289, shares: 67, readingTime: 5, seoScore: 89,
    featuredImage: "", publishedAt: "2026-05-22T14:00:00Z", createdAt: "2026-05-18T10:00:00Z", updatedAt: "2026-05-22T14:00:00Z",
  },
  {
    id: "bp-16", title: "Mastering Financial Planning for Authors", slug: "financial-planning-authors",
    excerpt: "Smart money management strategies for freelance writers and independent authors.",
    content: "Authors face unique financial challenges — irregular income, self-employment taxes, and investment decisions. This guide covers budgeting, tax planning, retirement savings, and building financial stability as a creative professional.", category: "Personal Finance",
    tags: ["finance", "budgeting", "author income"], author: { name: "Michael Brown", email: "michael.brown@statement.com" },
    status: "published", featured: false, views: 3180, comments: 67, likes: 198, shares: 42, readingTime: 7, seoScore: 86,
    featuredImage: "", publishedAt: "2026-05-18T11:00:00Z", createdAt: "2026-05-14T09:00:00Z", updatedAt: "2026-05-18T11:00:00Z",
  },
  {
    id: "bp-17", title: "The Psychology of Productive Writing", slug: "psychology-productive-writing",
    excerpt: "How understanding your brain can transform your daily writing routine and output.",
    content: "Neuroscience reveals how our brains handle creative work. Learn about flow states, dopamine's role in motivation, how to overcome writer's block using cognitive techniques, and building sustainable writing habits.", category: "Productivity",
    tags: ["psychology", "writing habits", "flow state"], author: { name: "Olivia Carter", email: "olivia.carter@statement.com" },
    status: "published", featured: true, views: 6230, comments: 156, likes: 445, shares: 98, readingTime: 8, seoScore: 91,
    featuredImage: "", publishedAt: "2026-06-01T09:00:00Z", createdAt: "2026-05-27T10:00:00Z", updatedAt: "2026-06-01T09:00:00Z",
  },
  {
    id: "bp-18", title: "Typography Trends in Modern Book Design", slug: "typography-trends-book-design",
    excerpt: "Exploring the latest typography trends that are reshaping book cover and interior design.",
    content: "Typography is evolving in the book design world. From bold serif revivals to minimalist sans-serif trends, explore what's shaping modern book aesthetics and how to apply these trends effectively.", category: "Book Design",
    tags: ["typography", "design trends", "book covers"], author: { name: "Sarah Mitchell", email: "sarah.mitchell@statement.com" },
    status: "published", featured: false, views: 2890, comments: 72, likes: 210, shares: 45, readingTime: 6, seoScore: 84,
    featuredImage: "", publishedAt: "2026-05-15T14:00:00Z", createdAt: "2026-05-11T08:00:00Z", updatedAt: "2026-05-15T14:00:00Z",
  },
  {
    id: "bp-19", title: "Leadership Lessons from Top Publishers", slug: "leadership-top-publishers",
    excerpt: "What successful publishing leaders do differently and how you can apply their strategies.",
    content: "Successful publishers share common leadership traits. This article examines case studies from leading independent publishers and distills actionable leadership lessons for aspiring publishing entrepreneurs.", category: "Leadership",
    tags: ["leadership", "management", "strategy"], author: { name: "James Cooper", email: "james.cooper@statement.com" },
    status: "published", featured: false, views: 4780, comments: 94, likes: 312, shares: 78, readingTime: 9, seoScore: 87,
    featuredImage: "", publishedAt: "2026-05-12T10:00:00Z", createdAt: "2026-05-08T11:00:00Z", updatedAt: "2026-05-12T10:00:00Z",
  },
  {
    id: "bp-20", title: "Building Your Author Platform from Scratch", slug: "author-platform-scratch",
    excerpt: "A step-by-step guide to building an online presence that attracts readers and sells books.",
    content: "Every author needs a platform. This comprehensive guide covers website creation, social media setup, email list building, content strategy, and how to establish yourself as an authority in your genre.", category: "Business",
    tags: ["platform building", "online presence", "author website"], author: { name: "Emily Watson", email: "emily.watson@statement.com" },
    status: "review", featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: 10, seoScore: 83,
    featuredImage: "", publishedAt: null, createdAt: "2026-06-19T15:00:00Z", updatedAt: "2026-06-19T15:00:00Z",
  },
  {
    id: "bp-21", title: "AI Tools Every Author Should Know About", slug: "ai-tools-for-authors",
    excerpt: "A curated list of AI-powered tools that can streamline your writing, editing, and publishing process.",
    content: "Artificial intelligence is transforming the publishing landscape. This roundup covers AI writing assistants, editing tools, cover design generators, marketing automation, and how to use these tools ethically.", category: "Technology",
    tags: ["AI", "tools", "automation"], author: { name: "Lisa Park", email: "lisa.park@statement.com" },
    status: "draft", featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: 7, seoScore: 76,
    featuredImage: "", publishedAt: null, createdAt: "2026-06-18T10:00:00Z", updatedAt: "2026-06-18T10:00:00Z",
  },
  {
    id: "bp-22", title: "The Art of Self-Editing Your Manuscript", slug: "self-editing-manuscript",
    excerpt: "Professional editing techniques you can apply yourself before hiring a professional editor.",
    content: "Self-editing is a critical skill. Learn structural editing, line editing, copy editing, and proofreading techniques. Includes a downloadable self-editing checklist and common issues to look for.", category: "Writing",
    tags: ["editing", "self-editing", "manuscript"], author: { name: "Michael Brown", email: "michael.brown@statement.com" },
    status: "published", featured: false, views: 5120, comments: 134, likes: 367, shares: 89, readingTime: 8, seoScore: 88,
    featuredImage: "", publishedAt: "2026-06-03T08:00:00Z", createdAt: "2026-05-29T09:00:00Z", updatedAt: "2026-06-03T08:00:00Z",
  },
  {
    id: "bp-23", title: "Investing Your Royalty Income Wisely", slug: "investing-royalty-income",
    excerpt: "Smart investment strategies for authors who want to grow their wealth from book royalties.",
    content: "Book royalties can become a significant income stream. This guide covers how to invest royalty income wisely, from index funds to real estate, and building long-term wealth as an author.", category: "Personal Finance",
    tags: ["investing", "royalties", "wealth building"], author: { name: "Olivia Carter", email: "olivia.carter@statement.com" },
    status: "scheduled", featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: 9, seoScore: 81,
    featuredImage: "", publishedAt: null, createdAt: "2026-06-20T10:00:00Z", updatedAt: "2026-06-20T10:00:00Z",
  },
  {
    id: "bp-24", title: "Color Theory for Book Cover Design", slug: "color-theory-book-covers",
    excerpt: "How color psychology influences reader perception and buying decisions at the bookstore.",
    content: "Colors communicate before words are read. This article explores color psychology in book cover design, genre color conventions, and how to choose colors that attract your target audience.", category: "Book Design",
    tags: ["color theory", "book covers", "visual design"], author: { name: "Sarah Mitchell", email: "sarah.mitchell@statement.com" },
    status: "published", featured: false, views: 3560, comments: 82, likes: 256, shares: 67, readingTime: 7, seoScore: 85,
    featuredImage: "", publishedAt: "2026-05-10T12:00:00Z", createdAt: "2026-05-06T10:00:00Z", updatedAt: "2026-05-10T12:00:00Z",
  },
  {
    id: "bp-25", title: "7 Daily Habits That Improve Personal Growth", slug: "7-daily-habits-personal-growth",
    excerpt: "Discover the seven transformative daily habits that can accelerate your personal growth journey and create lasting positive change.",
    content: "Personal growth isn't about massive overnight changes — it's about the small, consistent habits you practice every day. In this article, we explore seven evidence-based daily habits that can transform your life. From morning journaling and mindful meditation to continuous learning and gratitude practice, each habit builds upon the last to create a powerful foundation for self-improvement. We'll also cover how to track your progress, overcome resistance, and maintain motivation when life gets challenging. Whether you're just starting your growth journey or looking to deepen your practice, these habits will help you become the best version of yourself.",
    category: "Self Development",
    tags: ["personal growth", "habits", "self improvement"], author: { name: "Emily Watson", email: "emily.watson@statement.com" },
    status: "published", featured: true, views: 4260, comments: 74, likes: 312, shares: 67, readingTime: 7, seoScore: 89,
    featuredImage: "", publishedAt: "2026-01-10T09:15:00Z", createdAt: "2026-01-08T08:00:00Z", updatedAt: "2026-01-14T15:42:00Z",
  },
];

const MONTHLY_VIEWS = [
  { month: "Jan", views: 12400 }, { month: "Feb", views: 14200 }, { month: "Mar", views: 18900 },
  { month: "Apr", views: 22100 }, { month: "May", views: 28400 }, { month: "Jun", views: 31200 },
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "title-az", label: "Name A–Z" },
  { value: "title-za", label: "Name Z–A" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "least-viewed", label: "Least Viewed" },
  { value: "most-comments", label: "Most Comments" },
  { value: "least-comments", label: "Least Comments" },
  { value: "newest-first", label: "Newest First" },
  { value: "oldest-first", label: "Oldest First" },
  { value: "recently-updated", label: "Recently Updated" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function AdminBlogPage() {
  const [allPosts, setAllPosts] = useState<BlogPostRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("blog_posts");
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return DEMO_POSTS;
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortOption, setSortOption] = useState("default");
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [drawerPost, setDrawerPost] = useState<BlogPostRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [editTarget, setEditTarget] = useState<BlogPostRecord | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editCategory, setEditCategory] = useState("Publishing");
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState<BlogStatus>("draft");
  const [editTags, setEditTags] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPostRecord | null>(null);

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("blog_activity");
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return [
      { id: "act-1", type: "publish", message: "Published article: How to Publish Your First Book Successfully", time: "2 hours ago" },
      { id: "act-2", type: "edit", message: "Edited blog post: Marketing Your Book on Social Media", time: "5 hours ago" },
      { id: "act-3", type: "create", message: "Created new blog post: Advanced Book Launch Strategies", time: "Yesterday" },
      { id: "act-4", type: "feature", message: "Marked article as Featured: Building a Personal Author Brand", time: "Yesterday" },
      { id: "act-5", type: "status_change", message: "Moved to Draft: Writing Productivity Hacks for Authors", time: "2 days ago" },
      { id: "act-6", type: "edit", message: "Edited blog post: 10 Mistakes First-Time Authors Make", time: "3 days ago" },
    ];
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [articleReaderOpen, setArticleReaderOpen] = useState(false);
  const [readerPost, setReaderPost] = useState<BlogPostRecord | null>(null);
  const [activeSummaryCard, setActiveSummaryCard] = useState<string | null>(null);
  const [blogCategories, setBlogCategories] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("blog_categories");
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return ["Publishing", "Marketing", "Leadership", "Business", "Technology", "Personal Finance", "Writing", "Productivity", "Book Design", "Self Development"];
  });
  const [importFiles, setImportFiles] = useState<File[]>([]);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [deleteCategorySearch, setDeleteCategorySearch] = useState("");
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<string | null>(null);
  const [deleteCategoryConfirmOpen, setDeleteCategoryConfirmOpen] = useState(false);
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [calendarDatePosts, setCalendarDatePosts] = useState<BlogPostRecord[]>([]);

  const avgRating = useMemo(() => {
    const ratings = allPosts.filter((p) => p.status === "published").map((p) => Math.min(5, Math.max(3, 3 + (p.views / 5000))));
    return ratings.length > 0 ? (ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1) : "4.7";
  }, [allPosts]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const tableScroll = useRef<SyncedTableScrollHandle>(null);

  const addActivity = useCallback((type: ActivityRecord["type"], message: string) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} today`;
    setActivityLog((prev) => [{ id: `act-${Date.now()}`, type, message, time: timeStr }, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setSortFilterOpen(false);
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) setQuickActionsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [activeTab, debouncedSearch, pageSize, sortOption, activeCategoryFilter]);

  // localStorage persistence
  useEffect(() => { localStorage.setItem("blog_posts", JSON.stringify(allPosts)); }, [allPosts]);
  useEffect(() => { localStorage.setItem("blog_activity", JSON.stringify(activityLog)); }, [activityLog]);
  useEffect(() => { localStorage.setItem("blog_categories", JSON.stringify(blogCategories)); }, [blogCategories]);

  useEffect(() => {
    const saved = localStorage.getItem("blog_view_mode");
    if (saved === "grid" || saved === "table" || saved === "calendar") setViewMode(saved);
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const stats = useMemo(() => {
    const published = allPosts.filter((p) => p.status === "published").length;
    const drafts = allPosts.filter((p) => p.status === "draft").length;
    const scheduled = allPosts.filter((p) => p.status === "scheduled").length;
    const totalViews = allPosts.reduce((s, p) => s + p.views, 0);
    const totalComments = allPosts.reduce((s, p) => s + p.comments, 0);
    const featured = allPosts.filter((p) => p.featured).length;
    const totalCategories = new Set(allPosts.map((p) => p.category)).size;
    return { published, drafts, scheduled, totalViews, totalComments, featured, totalCategories };
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    let result = [...allPosts];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (activeCategoryFilter) {
      result = result.filter((p) => p.category === activeCategoryFilter);
    }
    switch (activeTab) {
      case "published": result = result.filter((p) => p.status === "published"); break;
      case "drafts": result = result.filter((p) => p.status === "draft"); break;
      case "scheduled": result = result.filter((p) => p.status === "scheduled"); break;
      case "featured": result = result.filter((p) => p.featured); break;
      case "review": result = result.filter((p) => p.status === "review"); break;
      case "archived": result = result.filter((p) => p.status === "archived"); break;
      case "sort-most-viewed": result.sort((a, b) => b.views - a.views); break;
      case "sort-most-comments": result.sort((a, b) => b.comments - a.comments); break;
    }
    if (activeTab !== "sort-most-viewed" && activeTab !== "sort-most-comments") {
      switch (sortOption) {
        case "title-az": result.sort((a, b) => a.title.localeCompare(b.title)); break;
        case "title-za": result.sort((a, b) => b.title.localeCompare(a.title)); break;
        case "most-viewed": result.sort((a, b) => b.views - a.views); break;
        case "least-viewed": result.sort((a, b) => a.views - b.views); break;
        case "most-comments": result.sort((a, b) => b.comments - a.comments); break;
        case "least-comments": result.sort((a, b) => a.comments - b.comments); break;
        case "newest-first": result.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()); break;
        case "oldest-first": result.sort((a, b) => new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime()); break;
        case "recently-updated": result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()); break;
        case "most-liked": result.sort((a, b) => b.likes - a.likes); break;
        case "highest-seo": result.sort((a, b) => b.seoScore - a.seoScore); break;
      }
    }
    return result;
  }, [allPosts, debouncedSearch, activeTab, sortOption, activeCategoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const displayedPosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, page, pageSize]);

  const toggleSelectAll = () => {
    if (selectedIds.size === displayedPosts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(displayedPosts.map((p) => p.id)));
  };

  const handleCreatePost = () => {
    setEditMode("add");
    setEditTarget(null);
    setEditTitle("");
    setEditExcerpt("");
    setEditCategory("Publishing");
    setEditContent("");
    setEditStatus("draft");
    setEditTags("");
    setEditModalOpen(true);
  };

  const handleEditPost = (post: BlogPostRecord) => {
    setEditMode("edit");
    setEditTarget(post);
    setEditTitle(post.title);
    setEditExcerpt(post.excerpt);
    setEditCategory(post.category);
    setEditContent(post.content);
    setEditStatus(post.status);
    setEditTags(post.tags.join(", "));
    setEditModalOpen(true);
  };

  const handleSavePost = () => {
    if (!editTitle.trim()) return;
    const previousState = [...allPosts];
    const parsedTags = editTags.split(",").map((t) => t.trim()).filter(Boolean);
    if (editMode === "add") {
      const isPublishing = editStatus === "published";
      const newPost: BlogPostRecord = {
        id: `bp-${Date.now()}`, title: editTitle, slug: editTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: editExcerpt, content: editContent, category: editCategory, tags: parsedTags,
        author: { name: isPublishing ? "Statement Publications" : "Admin", email: "admin@statement.com" }, status: editStatus,
        featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: Math.ceil(editContent.split(" ").length / 200) || 5,
        seoScore: Math.floor(Math.random() * 20) + 75, featuredImage: "",
        publishedAt: isPublishing ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      setAllPosts((prev) => [newPost, ...prev]);
      actionHistory.pushAction({ action: "create", entity: "blog", entityName: editTitle, description: `Created "${editTitle}"`, previousState, newState: [newPost, ...allPosts] });
      addActivity("create", `Created new blog post: ${editTitle}`);
      showNotification("success", `Post "${editTitle}" created`);
    } else if (editTarget) {
      setAllPosts((prev) => prev.map((p) => p.id === editTarget.id ? { ...p, title: editTitle, excerpt: editExcerpt, category: editCategory, content: editContent, status: editStatus, tags: parsedTags, author: editStatus === "published" ? { name: "Statement Publications", email: "admin@statement.com" } : p.author, updatedAt: new Date().toISOString(), publishedAt: editStatus === "published" && !p.publishedAt ? new Date().toISOString() : p.publishedAt } : p));
      actionHistory.pushAction({ action: "edit", entity: "blog", entityName: editTitle, description: `Edited "${editTitle}"`, previousState, newState: allPosts.map((p) => p.id === editTarget.id ? { ...p, title: editTitle, excerpt: editExcerpt, category: editCategory, content: editContent, status: editStatus, tags: parsedTags } : p) });
      addActivity("edit", `Edited blog post: ${editTitle}`);
      showNotification("success", `Post "${editTitle}" updated`);
    }
    setEditModalOpen(false);
    setEditTarget(null);
  };

  const handleStatusChange = (post: BlogPostRecord, newStatus: BlogStatus) => {
    const previousState = [...allPosts];
    setAllPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: newStatus, author: newStatus === "published" ? { name: "Statement Publications", email: "admin@statement.com" } : p.author, publishedAt: newStatus === "published" && !p.publishedAt ? new Date().toISOString() : p.publishedAt, updatedAt: new Date().toISOString() } : p));
    actionHistory.pushAction({ action: "status_change", entity: "blog", entityName: post.title, description: `Changed "${post.title}" to ${STATUS_CONFIG[newStatus].label}`, previousState, newState: allPosts.map((p) => p.id === post.id ? { ...p, status: newStatus } : p) });
    if (newStatus === "published") addActivity("publish", `Published article: ${post.title}`);
    else addActivity("status_change", `Moved to ${STATUS_CONFIG[newStatus].label}: ${post.title}`);
    showNotification("success", `"${post.title}" moved to ${STATUS_CONFIG[newStatus].label}`);
  };

  const handleToggleFeatured = (post: BlogPostRecord) => {
    const previousState = [...allPosts];
    setAllPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, featured: !p.featured } : p));
    actionHistory.pushAction({ action: post.featured ? "unfeature" : "feature", entity: "blog", entityName: post.title, description: `${post.featured ? "Unfeatured" : "Featured"} "${post.title}"`, previousState, newState: allPosts.map((p) => p.id === post.id ? { ...p, featured: !p.featured } : p) });
    addActivity(post.featured ? "unfeature" : "feature", `${post.featured ? "Unmarked" : "Marked"} article as Featured: ${post.title}`);
    showNotification("success", `"${post.title}" ${post.featured ? "unfeatured" : "featured"}`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const previousState = [...allPosts];
    setAllPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    actionHistory.pushAction({ action: "delete", entity: "blog", entityName: deleteTarget.title, description: `Deleted "${deleteTarget.title}"`, previousState, newState: allPosts.filter((p) => p.id !== deleteTarget.id) });
    addActivity("delete", `Deleted blog post: ${deleteTarget.title}`);
    showNotification("success", `Post "${deleteTarget.title}" deleted`);
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
    setDrawerOpen(false);
  };

  const openDrawer = (post: BlogPostRecord) => { setDrawerPost(post); setDrawerOpen(true); };

  const openArticleReader = (post: BlogPostRecord) => { setReaderPost(post); setArticleReaderOpen(true); };

  const setViewModeAndSave = (mode: ViewMode) => { setViewMode(mode); localStorage.setItem("blog_view_mode", mode); };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    const name = newCategoryName.trim();
    if (blogCategories.includes(name)) {
      showNotification("error", `Category "${name}" already exists`);
      return;
    }
    const previousState = [...blogCategories];
    setBlogCategories((prev) => [...prev, name]);
    if (!CATEGORY_COLORS[name]) {
      CATEGORY_COLORS[name] = "bg-teal-50 text-teal-700 border-teal-200";
    }
    if (!CATEGORY_HEX[name]) {
      CATEGORY_HEX[name] = "#14B8A6";
    }
    actionHistory.pushAction({ action: "create", entity: "category", entityName: name, description: `Created category: ${name}`, previousState, newState: [...blogCategories, name] });
    addActivity("category", `Created category: ${name}`);
    showNotification("success", `Category "${name}" created`);
    setCategoryModalOpen(false);
    setNewCategoryName("");
  };

  const handleDeleteCategory = () => {
    if (!deleteCategoryTarget || blogCategories.length <= 1) return;
    const previousState = [...blogCategories];
    const fallbackCategory = blogCategories.find((c) => c !== deleteCategoryTarget) || blogCategories[0];
    setBlogCategories((prev) => prev.filter((c) => c !== deleteCategoryTarget));
    setAllPosts((prev) => prev.map((p) => p.category === deleteCategoryTarget ? { ...p, category: fallbackCategory } : p));
    actionHistory.pushAction({ action: "delete", entity: "category", entityName: deleteCategoryTarget, description: `Deleted category: ${deleteCategoryTarget}`, previousState, newState: previousState.filter((c) => c !== deleteCategoryTarget) });
    addActivity("delete_category", `Deleted category: ${deleteCategoryTarget}`);
    showNotification("success", `Category "${deleteCategoryTarget}" deleted`);
    setDeleteCategoryConfirmOpen(false);
    setDeleteCategoryTarget(null);
    setDeleteCategoryModalOpen(false);
  };

  const handleUndoCategoryDelete = (action: { previousState: unknown; entityName: string }) => {
    const prevCategories = action.previousState as string[];
    if (prevCategories && Array.isArray(prevCategories)) {
      setBlogCategories(prevCategories);
      addActivity("restore_category", `Restored category: ${action.entityName}`);
      showNotification("success", `Category "${action.entityName}" restored`);
    }
  };

  const handleImportPosts = () => {
    const demoImport: BlogPostRecord[] = [
      {
        id: `bp-imp-${Date.now()}`, title: "Imported: Guide to Book Marketing", slug: "imported-guide-book-marketing",
        excerpt: "A comprehensive guide to marketing your book effectively across multiple channels.",
        content: "This imported article covers essential book marketing strategies for modern authors.", category: "Marketing",
        tags: ["imported", "marketing", "guide"], author: { name: "Statement Publications", email: "admin@statement.com" },
        status: "draft", featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: 6, seoScore: 80,
        featuredImage: "", publishedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      },
      {
        id: `bp-imp2-${Date.now()}`, title: "Imported: Publishing Rights Explained", slug: "imported-publishing-rights",
        excerpt: "Understanding publishing rights, licensing, and intellectual property for authors.",
        content: "Publishing rights are complex. This article breaks down the key concepts every author should understand.", category: "Publishing",
        tags: ["imported", "rights", "licensing"], author: { name: "Statement Publications", email: "admin@statement.com" },
        status: "draft", featured: false, views: 0, comments: 0, likes: 0, shares: 0, readingTime: 7, seoScore: 78,
        featuredImage: "", publishedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      },
    ];
    setAllPosts((prev) => [...demoImport, ...prev]);
    addActivity("import", `Imported ${demoImport.length} blog posts from file`);
    showNotification("success", `Imported ${demoImport.length} posts successfully`);
    setImportModalOpen(false);
  };

  const exportCSV = () => {
    const headers = ["Title", "Author", "Category", "Status", "Views", "Comments", "Likes", "SEO Score", "Published"];
    const rows = filteredPosts.map((p) => [p.title, p.author.name, p.category, p.status, String(p.views), String(p.comments), String(p.likes), String(p.seoScore), p.publishedAt || ""]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `blog-posts-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
    addActivity("import", `Exported ${filteredPosts.length} posts as CSV`);
  };

  const downloadReportCSV = () => {
    const catCounts: Record<string, number> = {};
    allPosts.forEach((p) => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
    const topCategories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const authorCounts: Record<string, number> = {};
    allPosts.forEach((p) => { authorCounts[p.author.name] = (authorCounts[p.author.name] || 0) + 1; });
    const topAuthors = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const recentActivities = activityLog.slice(0, 5);
    const rows = [
      ["Editorial Report", ""],
      ["Generated", new Date().toLocaleDateString()],
      ["", ""],
      ["Metric", "Value"],
      ["Total Posts", String(allPosts.length)],
      ["Published Posts", String(stats.published)],
      ["Drafts", String(stats.drafts)],
      ["Scheduled Posts", String(stats.scheduled)],
      ["Featured Posts", String(stats.featured)],
      ["Total Categories", String(blogCategories.length)],
      ["Total Views", String(stats.totalViews)],
      ["Total Comments", String(stats.totalComments)],
      ["", ""],
      ["Top Authors", "Posts"],
      ...topAuthors.map(([name, count]) => [name, String(count)]),
      ["", ""],
      ["Top Categories", "Posts"],
      ...topCategories.map(([cat, count]) => [cat, String(count)]),
      ["", ""],
      ["Recent Activity", "Type"],
      ...recentActivities.map((a) => [a.message, a.type]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `editorial-report-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const downloadReportPDF = () => {
    const catCounts: Record<string, number> = {};
    allPosts.forEach((p) => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
    const topCategories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const authorCounts: Record<string, number> = {};
    allPosts.forEach((p) => { authorCounts[p.author.name] = (authorCounts[p.author.name] || 0) + 1; });
    const topAuthors = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const recentActivities = activityLog.slice(0, 5);
    const html = `<!DOCTYPE html><html><head><title>Editorial Report</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1D1D1D}h1{color:#8A6A4A;border-bottom:2px solid #D8B27A;padding-bottom:8px}h2{color:#8A6A4A;margin-top:24px}.stat{display:inline-block;width:30%;margin:8px;padding:12px;border:1px solid #E8DDD0;border-radius:8px;background:#F5EDE3}.stat .label{font-size:12px;color:#5C4A3D}.stat .value{font-size:24px;font-weight:bold}table{width:100%;border-collapse:collapse;margin-top:8px}td,th{padding:6px 12px;border:1px solid #E8DDD0;text-align:left}th{background:#F5EDE3;font-weight:600}</style></head><body><h1>Editorial Report</h1><p>Generated: ${new Date().toLocaleDateString()}</p><div><div class="stat"><div class="label">Total Posts</div><div class="value">${allPosts.length}</div></div><div class="stat"><div class="label">Published</div><div class="value">${stats.published}</div></div><div class="stat"><div class="label">Drafts</div><div class="value">${stats.drafts}</div></div><div class="stat"><div class="label">Featured</div><div class="value">${stats.featured}</div></div><div class="stat"><div class="label">Total Views</div><div class="value">${stats.totalViews.toLocaleString()}</div></div><div class="stat"><div class="label">Total Comments</div><div class="value">${stats.totalComments.toLocaleString()}</div></div></div><h2>Top Authors</h2><table><tr><th>Author</th><th>Posts</th></tr>${topAuthors.map(([n, c]) => `<tr><td>${n}</td><td>${c}</td></tr>`).join("")}</table><h2>Top Categories</h2><table><tr><th>Category</th><th>Posts</th></tr>${topCategories.map(([c, n]) => `<tr><td>${c}</td><td>${n}</td></tr>`).join("")}</table><h2>Recent Activity</h2><table><tr><th>Message</th><th>Type</th></tr>${recentActivities.map((a) => `<tr><td>${a.message}</td><td>${a.type}</td></tr>`).join("")}</table></body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1D]">Blog Management</h1>
          <p className="text-sm text-[#5C4A3D]">Premium editorial dashboard for managing your publishing content</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleCreatePost} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
            <Plus className="h-4 w-4 mr-1" />Create Post
          </Button>
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" onClick={() => setAllPosts([...DEMO_POSTS])} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
              <RefreshCw className="h-4 w-4 mr-1" />Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { id: "total-posts", label: "TOTAL POSTS", value: allPosts.length, icon: FileText, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40", tab: "all" },
          { id: "published", label: "PUBLISHED POSTS", value: stats.published, icon: CheckCircle2, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40", tab: "published" },
          { id: "total-categories", label: "TOTAL CATEGORIES", value: blogCategories.length, icon: Tag, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40", tab: "all" },
          { id: "featured", label: "FEATURED POSTS", value: stats.featured, icon: Star, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40", tab: "featured" },
          { id: "total-views", label: "TOTAL VIEWS", value: stats.totalViews.toLocaleString(), icon: EyeIcon, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40", tab: "sort-most-viewed" },
          { id: "total-comments", label: "TOTAL COMMENTS", value: stats.totalComments.toLocaleString(), icon: MessageSquare, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40", tab: "sort-most-comments" },
          { id: "avg-rating", label: "PLATFORM AVG RATING", value: `${avgRating}★`, icon: Star, color: "text-amber-500", bg: "bg-amber-50", tab: "all" },
        ].map((stat) => {
          const isActive = activeSummaryCard === stat.id;
          return (
            <motion.div key={stat.id} variants={item} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Card onClick={() => { setActiveSummaryCard(isActive ? null : stat.id); setActiveTab(stat.tab); setActiveCategoryFilter(null); }} className={`shadow-sm transition-all duration-200 bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] ${isActive ? "ring-2 ring-[#D8B27A] shadow-md" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#111111] mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-[#111111]">{typeof stat.value === "string" ? stat.value : stat.value.toLocaleString()}</p>
                    </div>
                    <div className={`rounded-lg ${stat.bg} p-2 ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Editorial Analytics Center */}
      <motion.div variants={item}>
        <div className="analytics-dropdown-border">
          <Card className="shadow-sm bg-white">
            <button onClick={() => setAnalyticsOpen(!analyticsOpen)} className="w-full flex items-center justify-between p-4 hover:bg-[#F2D8BE]/10 transition-colors rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#8A6A4A]" />
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Editorial Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Monthly Views Chart */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Monthly Views</h4>
                      <div className="relative h-32 pt-2">
                        <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                          <polyline points={MONTHLY_VIEWS.map((_, i) => `${(i / 5) * 300},${100 - (MONTHLY_VIEWS[i].views / 35000) * 100}`).join(" ")} fill="none" stroke="#8A6A4A" strokeWidth="2" />
                          {MONTHLY_VIEWS.map((v, i) => (
                            <circle key={i} cx={(i / 5) * 300} cy={100 - (v.views / 35000) * 100} r="3" fill="#8A6A4A" />
                          ))}
                        </svg>
                      </div>
                      <div className="flex justify-between text-[9px] text-[#5C4A3D] mt-1">
                        {MONTHLY_VIEWS.map((v) => <span key={v.month}>{v.month}</span>)}
                      </div>
                      <p className="text-center text-xs font-bold text-[#111111] mt-2">{stats.totalViews.toLocaleString()} Total Views</p>
                    </div>

                    {/* Top Categories */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Top Categories</h4>
                      <div className="space-y-2">
                        {(() => {
                          const catCounts: Record<string, { count: number; views: number }> = {};
                          allPosts.forEach((p) => { catCounts[p.category] = { count: (catCounts[p.category]?.count || 0) + 1, views: (catCounts[p.category]?.views || 0) + p.views }; });
                          return Object.entries(catCounts).sort((a, b) => b[1].views - a[1].views).slice(0, 5).map(([cat, data]) => (
                            <div key={cat} className="flex items-center gap-2">
                              <span className="text-[11px] text-[#5C4A3D] w-20 truncate">{cat}</span>
                              <div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]">
                                <div className="h-full rounded" style={{ width: `${Math.min((data.views / 15000) * 100, 100)}%`, backgroundColor: CATEGORY_HEX[cat] || "#8A6A4A" }} />
                              </div>
                              <span className="text-[10px] font-medium text-[#111111] w-8 text-right">{data.count}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Author Performance */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><BarChart2 className="h-3.5 w-3.5" />Top Authors</h4>
                      <div className="space-y-2.5">
                        {(() => {
                          const authorStats: Record<string, { posts: number; views: number; comments: number; featured: number }> = {};
                          allPosts.forEach((p) => {
                            if (!authorStats[p.author.name]) authorStats[p.author.name] = { posts: 0, views: 0, comments: 0, featured: 0 };
                            authorStats[p.author.name].posts++;
                            authorStats[p.author.name].views += p.views;
                            authorStats[p.author.name].comments += p.comments;
                            if (p.featured) authorStats[p.author.name].featured++;
                          });
                          return Object.entries(authorStats)
                            .sort(([, a], [, b]) => b.views - a.views)
                            .slice(0, 5)
                            .map(([name, data], i) => {
                              const engagement = Math.round(((data.views + data.comments * 10) / 20000) * 100);
                              return (
                                <div key={name} className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#8A6A4A] to-[#D8B27A] flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">{name.split(" ").map((n) => n[0]).join("")}</div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-medium text-[#111111] truncate">{name}</span>
                                      {i === 0 && <Badge className="bg-[#D8B27A] text-white text-[7px] h-3.5 px-1">Top</Badge>}
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] text-[#5C4A3D]">
                                      <span>{data.posts} posts</span>
                                      <span>{data.views.toLocaleString()} views</span>
                                      <span>{data.comments} comments</span>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-[#111111] flex-shrink-0">{engagement}%</span>
                                </div>
                              );
                            });
                        })()}
                      </div>
                    </div>

                    {/* Engagement Overview */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Engagement Overview</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Reader Growth</span><span className="font-bold text-[#111111]">+24.3%</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "74%" }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Engagement Rate</span><span className="font-bold text-[#111111]">8.7%</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-blue-500 rounded-full" style={{ width: "67%" }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Avg. Reading Time</span><span className="font-bold text-[#111111]">6.2 min</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-amber-500 rounded-full" style={{ width: "55%" }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Content Output</span><span className="font-bold text-[#111111]">{allPosts.length} posts</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.min((allPosts.length / 20) * 100, 100)}%` }} /></div>
                        </div>
                      </div>
                    </div>

                    {/* Trending Content */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" />Trending Content</h4>
                      <div className="space-y-2.5">
                        {(() => {
                          const TRENDING_DATA: Record<string, { viewsGrowth: number; commentsGrowth: number }> = {
                            "How to Publish Your First Book Successfully": { viewsGrowth: 18.4, commentsGrowth: 22.1 },
                            "10 Mistakes First-Time Authors Make": { viewsGrowth: 14.7, commentsGrowth: 11.3 },
                            "Building a Personal Author Brand": { viewsGrowth: 12.2, commentsGrowth: 16.8 },
                            "How to Design a Best-Selling Book Cover": { viewsGrowth: 9.8, commentsGrowth: 13.5 },
                            "The Psychology of Productive Writing": { viewsGrowth: 8.1, commentsGrowth: 10.2 },
                          };
                          return allPosts.filter((p) => p.status === "published").sort((a, b) => b.views - a.views).slice(0, 5).map((p) => {
                            const trend = TRENDING_DATA[p.title] || { viewsGrowth: Math.round(Math.random() * 15 + 3), commentsGrowth: Math.round(Math.random() * 12 + 2) };
                            return (
                              <div key={p.id} className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-[#8A6A4A]/10 flex items-center justify-center flex-shrink-0"><Zap className="h-3 w-3 text-[#8A6A4A]" /></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-medium text-[#111111] truncate">{p.title}</p>
                                  <div className="flex items-center gap-2 text-[9px] text-[#5C4A3D]">
                                    <span>{p.views.toLocaleString()} views</span>
                                    <span className="text-emerald-600 font-medium">+{trend.viewsGrowth}%</span>
                                    <span>&middot;</span>
                                    <span>{p.comments} comments</span>
                                    <span className="text-emerald-600 font-medium">+{trend.commentsGrowth}%</span>
                                  </div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Traffic Sources */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><BarChart2 className="h-3.5 w-3.5" />Traffic Sources</h4>
                      <div className="space-y-2.5">
                        {[
                          { source: "Google Search", percentage: 38.2, color: "#22C55E", visits: "35,018" },
                          { source: "Facebook", percentage: 22.5, color: "#3B82F6", visits: "20,620" },
                          { source: "Twitter/X", percentage: 15.8, color: "#1D1D1D", visits: "14,481" },
                          { source: "LinkedIn", percentage: 11.3, color: "#0A66C2", visits: "10,355" },
                          { source: "Direct Traffic", percentage: 8.1, color: "#8A6A4A", visits: "7,422" },
                          { source: "Email Campaigns", percentage: 4.1, color: "#A855F7", visits: "3,751" },
                        ].map((src) => (
                          <div key={src.source} className="flex items-center gap-2">
                            <span className="text-[11px] text-[#5C4A3D] w-24 truncate">{src.source}</span>
                            <div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]">
                              <div className="h-full rounded" style={{ width: `${src.percentage}%`, backgroundColor: src.color }} />
                            </div>
                            <span className="text-[10px] font-medium text-[#111111] w-12 text-right">{src.percentage}%</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#D8B27A]/15 flex items-center justify-between text-[9px] text-[#5C4A3D]">
                        <span>Total Visits</span>
                        <span className="font-bold text-[#111111]">91,647</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </motion.div>

      {/* Sticky Search & Filter Bar */}
      <motion.div variants={item} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-md search-bar-border">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input placeholder="Search posts, authors, tags..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9" />
          </div>

          {/* Sort & Filter */}
          <div className="flex items-center gap-2" ref={dropdownRef}>
            <div className="relative">
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button variant="outline" size="sm" onClick={() => setSortFilterOpen(!sortFilterOpen)} className={`h-9 px-3 border-0 bg-white text-sm font-medium gap-2 ${sortOption !== "default" ? "text-[#D8B27A]" : "text-[#8A6A4A] hover:bg-[#F2D8BE]"}`}>
                  <SlidersHorizontal className="h-4 w-4" /><span className="hidden sm:inline">Sort & Filter</span><ChevronRight className={`h-3.5 w-3.5 transition-transform ${sortFilterOpen ? "rotate-90" : ""}`} />
                </Button>
              </div>
              <AnimatePresence>
                {sortFilterOpen && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 w-[260px] bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#E8DDD0] bg-[#F5EDE3]/30 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#8A6A4A]" />Sort By</h4>
                      {sortOption !== "default" && <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={() => setSortOption("default")}><X className="h-3 w-3 mr-1" />Clear</Button>}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      {SORT_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => { setSortOption(opt.value); setSortFilterOpen(false); }} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortOption === opt.value ? "bg-[#D8B27A]/20 text-[#111111] font-medium" : "text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-[#E8DDD0] rounded-lg overflow-hidden">
            <button onClick={() => setViewModeAndSave("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#8A6A4A] text-white" : "bg-white text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setViewModeAndSave("table")} className={`p-2 transition-colors ${viewMode === "table" ? "bg-[#8A6A4A] text-white" : "bg-white text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}><List className="h-4 w-4" /></button>
            <button onClick={() => setViewModeAndSave(viewMode === "calendar" ? "grid" : "calendar")} className={`p-2 transition-colors ${viewMode === "calendar" ? "bg-[#8A6A4A] text-white" : "bg-white text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}><CalendarDays className="h-4 w-4" /></button>
          </div>

          {/* Page Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Show</span>
            <Select value={pageSize >= 999 ? "all" : String(pageSize)} onValueChange={(v) => { setPageSize(v === "all" ? 999 : parseInt(v)); setPage(1); }}>
              <SelectTrigger className="w-[70px] h-9 border-[#8A6A4A]/20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Actions */}
          <div className="relative" ref={quickActionsRef}>
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <Button variant="outline" size="sm" onClick={() => setQuickActionsOpen(!quickActionsOpen)} className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
                <Zap className="h-4 w-4" /><span className="hidden sm:inline">Quick Actions</span><ChevronRight className={`h-3.5 w-3.5 transition-transform ${quickActionsOpen ? "rotate-90" : ""}`} />
              </Button>
            </div>
            {quickActionsOpen && (
              <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 p-2">
                <Button size="sm" className="w-full justify-start h-8 text-xs bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => { handleCreatePost(); setQuickActionsOpen(false); }}><Plus className="h-3.5 w-3.5 mr-1.5" />Create Post</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { setCategoryModalOpen(true); setQuickActionsOpen(false); }}><Tag className="h-3.5 w-3.5 mr-1.5" />Create Category</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { setImportModalOpen(true); setQuickActionsOpen(false); }}><FileUp className="h-3.5 w-3.5 mr-1.5" />Import Posts</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportCSV(); setQuickActionsOpen(false); }}><Download className="h-3.5 w-3.5 mr-1.5" />Export Posts</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { setReportModalOpen(true); setQuickActionsOpen(false); }}><BarChart3 className="h-3.5 w-3.5 mr-1.5" />Editorial Report</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => { setDeleteCategoryModalOpen(true); setQuickActionsOpen(false); }}><Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete Category</Button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setActiveSummaryCard(null); }}>
          <TabsList className="bg-[#F5EDE3] h-auto flex-wrap gap-1 p-1">
            {[
              { value: "all", label: "All Posts", count: allPosts.length, activeColor: "#8A6A4A" },
              { value: "published", label: "Published", count: stats.published, activeColor: "#22C55E" },
              { value: "drafts", label: "Drafts", count: stats.drafts, activeColor: "#F97316" },
              { value: "scheduled", label: "Scheduled", count: stats.scheduled, activeColor: "#3B82F6" },
              { value: "featured", label: "Featured", count: stats.featured, activeColor: "#A855F7" },
              { value: "review", label: "In Review", count: allPosts.filter((p) => p.status === "review").length, activeColor: "#F59E0B" },
              { value: "archived", label: "Archived", count: allPosts.filter((p) => p.status === "archived").length, activeColor: "#6B7280" },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} style={activeTab === tab.value ? { backgroundColor: tab.activeColor, color: "white" } : undefined} className={`text-xs sm:text-sm ${activeTab !== tab.value ? "data-[state=active]:bg-[#8A6A4A] data-[state=active]:text-white" : ""}`}>
                {tab.label}{tab.count !== null && <Badge variant="secondary" className="ml-1 h-4 px-1 text-[9px] bg-white/20">{tab.count}</Badge>}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button onClick={() => setActiveCategoryFilter(null)} className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${!activeCategoryFilter ? "bg-[#8A6A4A] text-white border-[#8A6A4A] shadow-sm" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]"}`}>All Categories</button>
          {blogCategories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategoryFilter(activeCategoryFilter === cat ? null : cat)} className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${activeCategoryFilter === cat ? "text-white shadow-sm" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]"}`} style={activeCategoryFilter === cat ? { backgroundColor: CATEGORY_HEX[cat] || "#8A6A4A", borderColor: CATEGORY_HEX[cat] || "#8A6A4A" } : {}}>
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="flex items-center justify-between rounded-lg border border-[#D8B27A]/30 bg-[#F2D8BE]/20 px-4 py-2.5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#111111]">{selectedIds.size} post{selectedIds.size !== 1 ? "s" : ""} selected</span>
                <div className="h-4 w-px bg-[#E8DDD0]" />
                <button onClick={toggleSelectAll} className="text-[11px] text-[#8A6A4A] hover:underline font-medium">Select All ({displayedPosts.length})</button>
                <button onClick={() => setSelectedIds(new Set())} className="text-[11px] text-[#5C4A3D] hover:underline">Deselect All</button>
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { const prev = [...allPosts]; const sel = allPosts.filter((p) => selectedIds.has(p.id)); setAllPosts((prevPosts) => prevPosts.map((p) => selectedIds.has(p.id) ? { ...p, featured: true } : p)); actionHistory.pushAction({ action: "feature", entity: "blog", entityName: `${selectedIds.size} posts`, description: `Featured ${selectedIds.size} posts`, previousState: prev, newState: allPosts.map((p) => selectedIds.has(p.id) ? { ...p, featured: true } : p) }); addActivity("feature", `Featured ${sel.length} posts`); showNotification("success", `${sel.length} posts featured`); setSelectedIds(new Set()); }}>
                  <Star className="h-3 w-3 mr-1" />Feature
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { const prev = [...allPosts]; setAllPosts((prevPosts) => prevPosts.map((p) => selectedIds.has(p.id) ? { ...p, featured: false } : p)); actionHistory.pushAction({ action: "unfeature", entity: "blog", entityName: `${selectedIds.size} posts`, description: `Unfeatured ${selectedIds.size} posts`, previousState: prev, newState: allPosts.map((p) => selectedIds.has(p.id) ? { ...p, featured: false } : p) }); addActivity("unfeature", `Unfeatured ${selectedIds.size} posts`); showNotification("success", `${selectedIds.size} posts unfeatured`); setSelectedIds(new Set()); }}>
                  <Star className="h-3 w-3 mr-1" />Unfeature
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { const sel = allPosts.filter((p) => selectedIds.has(p.id)); const headers = ["Title", "Author", "Category", "Status", "Views", "Comments", "Likes", "SEO Score", "Published"]; const rows = sel.map((p) => [p.title, p.author.name, p.category, p.status, String(p.views), String(p.comments), String(p.likes), String(p.seoScore), p.publishedAt || ""]); const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n"); const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `blog-posts-selected-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url); addActivity("import", `Exported ${sel.length} selected posts as CSV`); showNotification("success", `Exported ${sel.length} posts`); }}>
                  <Download className="h-3 w-3 mr-1" />Export
                </Button>
                <div className="h-4 w-px bg-[#E8DDD0]" />
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => { const prev = [...allPosts]; const sel = allPosts.filter((p) => selectedIds.has(p.id)); setAllPosts((prevPosts) => prevPosts.filter((p) => !selectedIds.has(p.id))); actionHistory.pushAction({ action: "bulk_delete", entity: "blog", entityName: `${sel.length} posts`, description: `Deleted ${sel.length} posts`, previousState: prev, newState: allPosts.filter((p) => !selectedIds.has(p.id)) }); addActivity("delete", `Deleted ${sel.length} posts`); showNotification("success", `${sel.length} posts deleted`); setSelectedIds(new Set()); }}>
                  <Trash2 className="h-3 w-3 mr-1" />Delete
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-[11px] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => setSelectedIds(new Set())}>
                  <X className="h-3 w-3 mr-1" />Clear
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      {viewMode === "calendar" ? (
        <motion.div variants={item}>
          <div className="bg-white rounded-lg border border-[#E8DDD0] overflow-hidden p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear((y) => y - 1); } else { setCalendarMonth((m) => m - 1); } }} className="p-2 rounded-lg hover:bg-[#F5EDE3] transition-colors"><ChevronLeft className="h-4 w-4 text-[#5C4A3D]" /></button>
              <div className="flex items-center gap-2">
                <select value={calendarMonth} onChange={(e) => setCalendarMonth(Number(e.target.value))} className="text-sm font-semibold text-[#111111] bg-transparent border border-[#E8DDD0] rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:border-[#D8B27A]">
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => setCalendarYear((y) => y - 1)} className="p-1 rounded hover:bg-[#F5EDE3] transition-colors"><ChevronLeft className="h-3 w-3 text-[#5C4A3D]" /></button>
                  <span className="text-sm font-semibold text-[#111111] min-w-[48px] text-center">{calendarYear}</span>
                  <button onClick={() => setCalendarYear((y) => y + 1)} className="p-1 rounded hover:bg-[#F5EDE3] transition-colors"><ChevronRight className="h-3 w-3 text-[#5C4A3D]" /></button>
                </div>
              </div>
              <button onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear((y) => y + 1); } else { setCalendarMonth((m) => m + 1); } }} className="p-2 rounded-lg hover:bg-[#F5EDE3] transition-colors"><ChevronRight className="h-4 w-4 text-[#5C4A3D]" /></button>
            </div>
            {/* Calendar Legend */}
            <div className="flex items-center gap-4 mb-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Published</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />Scheduled</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" />Draft</span>
            </div>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-px mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-[#8A6A4A] py-1">{d}</div>
              ))}
            </div>
            {/* Calendar Grid */}
            {(() => {
              const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
              const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
              const today = new Date();
              const cells: React.ReactNode[] = [];
              for (let i = 0; i < firstDay; i++) {
                cells.push(<div key={`empty-${i}`} className="min-h-[80px] bg-[#F5EDE3]/10 rounded-lg" />);
              }
              for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(calendarYear, calendarMonth, day);
                const dateStr = date.toISOString().split("T")[0];
                const dayPosts = allPosts.filter((p) => {
                  const pDate = (p.publishedAt || p.createdAt || "").split("T")[0];
                  return pDate === dateStr;
                });
                const isToday = today.getDate() === day && today.getMonth() === calendarMonth && today.getFullYear() === calendarYear;
                cells.push(
                  <div key={day} onClick={() => { if (dayPosts.length > 0) { setSelectedCalendarDate(date); setCalendarDatePosts(dayPosts); } }} className={`min-h-[80px] rounded-lg border p-1.5 transition-all ${isToday ? "border-[#D8B27A] bg-[#D8B27A]/5" : "border-[#E8DDD0]/50 bg-white"} ${dayPosts.length > 0 ? "cursor-pointer hover:border-[#D8B27A] hover:shadow-sm" : ""}`}>
                    <p className={`text-[11px] font-medium mb-1 ${isToday ? "text-[#D8B27A]" : "text-[#5C4A3D]"}`}>{day}</p>
                    <div className="space-y-0.5">
                      {dayPosts.slice(0, 3).map((p) => (
                        <div key={p.id} className={`text-[8px] leading-tight truncate px-1 py-0.5 rounded ${p.status === "published" ? "bg-emerald-100 text-emerald-700" : p.status === "scheduled" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                          {p.title}
                        </div>
                      ))}
                      {dayPosts.length > 3 && <p className="text-[8px] text-[#5C4A3D] px-1">+{dayPosts.length - 3} more</p>}
                    </div>
                  </div>
                );
              }
              const totalCells = firstDay + daysInMonth;
              const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
              for (let i = 0; i < remaining; i++) {
                cells.push(<div key={`end-empty-${i}`} className="min-h-[80px] bg-[#F5EDE3]/10 rounded-lg" />);
              }
              return <div className="grid grid-cols-7 gap-px">{cells}</div>;
            })()}
            {/* Close Button */}
            <div className="mt-4 flex justify-center">
              <button onClick={() => setViewModeAndSave("grid")} className="px-4 py-2 text-xs font-medium text-[#5C4A3D] bg-[#F5EDE3] hover:bg-[#E8DDD0] rounded-lg transition-colors">Close Calendar</button>
            </div>
          </div>
        </motion.div>
      ) : viewMode === "grid" ? (
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedPosts.map((post) => {
            const totalEngagement = post.views + post.comments * 10 + post.likes * 5 + post.shares * 3;
            const engagementPct = Math.min((totalEngagement / 15000) * 100, 100);
            return (
              <motion.div key={post.id} variants={item} whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Card className="border border-[#E8DDD0] bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-all h-full flex flex-col" onClick={() => openDrawer(post)}>
                  <div className="h-36 bg-gradient-to-br from-[#8A6A4A]/5 via-[#D8B27A]/5 to-[#EBC9A8]/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                    <span className="text-4xl relative z-10">{post.category === "Publishing" ? "📚" : post.category === "Writing" ? "✍️" : post.category === "Marketing" ? "📢" : post.category === "Book Design" ? "🎨" : post.category === "Leadership" ? "👑" : post.category === "Business" ? "💼" : post.category === "Technology" ? "💻" : post.category === "Personal Finance" ? "💰" : post.category === "Productivity" ? "⚡" : "🌱"}</span>
                    <div className="absolute top-2 left-2 z-10"><Badge variant="secondary" className={`${STATUS_CONFIG[post.status].bgColor} text-[10px] border`}>{STATUS_CONFIG[post.status].label}</Badge></div>
                    {post.featured && <div className="absolute top-2 right-2 z-10"><Badge className="bg-[#8A6A4A] text-white text-[10px]"><Star className="h-3 w-3 mr-0.5 fill-current" />Featured</Badge></div>}
                    <div className="absolute bottom-2 right-2 z-10 text-[10px] text-[#5C4A3D] bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1"><Clock className="h-3 w-3" />{post.readingTime} min read</div>
                  </div>
                  <CardContent className="p-3.5 flex-1 flex flex-col">
                    <Badge variant="secondary" className={`${CATEGORY_COLORS[post.category] || "bg-gray-50 text-gray-700 border-gray-200"} text-[9px] border w-fit mb-2`}>{post.category}</Badge>
                    <h4 className="font-bold text-[#111111] text-sm leading-snug mb-1 line-clamp-2">{post.title}</h4>
                    <p className="text-[11px] text-[#5C4A3D] line-clamp-2 mb-3 flex-1">{post.excerpt}</p>
                    <div className="mb-2">
                      <div className="flex justify-between text-[9px] text-[#5C4A3D] mb-0.5">
                        <span>Engagement</span>
                        <span className="font-medium text-[#111111]">{Math.round(engagementPct)}%</span>
                      </div>
                      <div className="h-1.5 bg-[#F5EDE3] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A] rounded-full transition-all" style={{ width: `${engagementPct}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#5C4A3D] border-t border-[#E8DDD0] pt-2 mt-auto">
                      <span className="truncate">{post.author.name}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="flex items-center gap-0.5"><EyeIcon className="h-3 w-3" />{post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views}</span>
                        <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}</span>
                        <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{post.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 text-[#8A6A4A]" />
                        <span className="text-[10px] font-medium text-[#5C4A3D]">SEO {post.seoScore}/100</span>
                      </div>
                      <span className="text-[10px] text-[#5C4A3D]">{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div variants={item}>
          <div className="bg-white rounded-lg border border-[#E8DDD0] overflow-hidden">
            <SyncedTableScroll ref={tableScroll} loading={false}>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E8DDD0] bg-[#F5EDE3]/20">
                  <TableHead className="w-10"><button onClick={toggleSelectAll} className="flex items-center justify-center">{selectedIds.size === displayedPosts.length && displayedPosts.length > 0 ? "☑" : "☐"}</button></TableHead>
                  <TableHead className="text-[#111111] font-semibold">Post</TableHead>
                  <TableHead className="text-[#111111] font-semibold hidden md:table-cell">Author</TableHead>
                  <TableHead className="text-[#111111] font-semibold hidden lg:table-cell">Category</TableHead>
                  <TableHead className="text-[#111111] font-semibold hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-[#111111] font-semibold hidden lg:table-cell">Views</TableHead>
                  <TableHead className="text-[#111111] font-semibold hidden xl:table-cell">Comments</TableHead>
                  <TableHead className="text-[#111111] font-semibold hidden xl:table-cell">Date</TableHead>
                  <TableHead className="text-[#111111] font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPosts.map((post) => (
                  <TableRow key={post.id} className="border-b border-[#E8DDD0]/60 hover:bg-[#F5EDE3]/20 transition-colors cursor-pointer" onClick={() => openDrawer(post)}>
                    <TableCell onClick={(e) => e.stopPropagation()} className="py-2"><button onClick={() => setSelectedIds((prev) => { const n = new Set(prev); if (n.has(post.id)) n.delete(post.id); else n.add(post.id); return n; })} className="flex items-center justify-center">{selectedIds.has(post.id) ? "☑" : "☐"}</button></TableCell>
                    <TableCell className="py-2"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-[#F5EDE3] flex items-center justify-center flex-shrink-0 text-lg">{post.featured ? "⭐" : "📝"}</div><div className="min-w-0"><p className="font-medium text-[#111111] text-sm truncate">{post.title}</p><p className="text-[11px] text-[#5C4A3D] truncate max-w-[250px]">{post.excerpt}</p></div></div></TableCell>
                    <TableCell className="hidden md:table-cell py-2 text-sm text-[#5C4A3D]">{post.author.name}</TableCell>
                    <TableCell className="hidden lg:table-cell py-2"><Badge variant="secondary" className={`${CATEGORY_COLORS[post.category] || "bg-gray-50 text-gray-700 border-gray-200"} text-[10px] border`}>{post.category}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell py-2"><Badge variant="secondary" className={`${STATUS_CONFIG[post.status].bgColor} text-[10px] border`}>{STATUS_CONFIG[post.status].label}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell py-2 text-sm text-[#111111]">{post.views.toLocaleString()}</TableCell>
                    <TableCell className="hidden xl:table-cell py-2 text-sm text-[#5C4A3D]">{post.comments}</TableCell>
                    <TableCell className="hidden xl:table-cell py-2 text-sm text-[#5C4A3D]">{formatDate(post.publishedAt || post.createdAt)}</TableCell>
                    <TableCell className="text-right py-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-0.5">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => openDrawer(post)} title="Preview"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50" onClick={() => handleEditPost(post)} title="Edit"><Edit3 className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-amber-600 hover:bg-amber-50" onClick={() => handleToggleFeatured(post)} title={post.featured ? "Unfeature" : "Feature"}><Star className={`h-4 w-4 ${post.featured ? "fill-amber-500" : ""}`} /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50" onClick={() => { setDeleteTarget(post); setDeleteConfirmOpen(true); }} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {displayedPosts.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center py-16"><FileText className="mx-auto h-10 w-10 text-[#D8B27A]/50 mb-3" /><p className="text-sm font-medium text-[#111111]">No posts found</p><p className="text-xs text-[#5C4A3D] mt-1">Try adjusting your search or filters.</p></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
            </SyncedTableScroll>
          </div>
        </motion.div>
      )}

      {/* Pagination — immediately below table */}
      <motion.div variants={item} className="flex items-center justify-between">
        <p className="text-sm text-[#5C4A3D]">
          Showing <span className="font-medium text-[#111111]">{filteredPosts.length === 0 ? 0 : (page - 1) * pageSize + 1}</span> &ndash; <span className="font-medium text-[#111111]">{Math.min(page * pageSize, filteredPosts.length)}</span> of <span className="font-medium text-[#111111]">{filteredPosts.length}</span> posts
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]"><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
          <span className="text-sm font-medium text-[#111111] px-2">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]">Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
      </motion.div>

      {/* Recent Activity — after pagination */}
      <motion.div variants={item}>
        <div className="bg-white rounded-lg border border-[#E8DDD0] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2"><Activity className="h-4 w-4 text-[#8A6A4A]" />Recent Activity</h3>
            {activityLog.length > 3 && (
              <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#8A6A4A]" onClick={() => setActivityExpanded(!activityExpanded)}><Rss className="h-3 w-3 mr-1" />{activityExpanded ? "Show Less" : "View All"}</Button>
            )}
          </div>
          <div className="space-y-2.5">
            {activityLog.slice(0, activityExpanded ? activityLog.length : 3).map((act) => (
              <div key={act.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#F5EDE3]/30 transition-colors">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${act.type === "publish" ? "bg-emerald-50 text-emerald-600" : act.type === "create" ? "bg-blue-50 text-blue-600" : act.type === "edit" ? "bg-amber-50 text-amber-600" : act.type === "delete" ? "bg-rose-50 text-rose-600" : act.type === "feature" || act.type === "unfeature" ? "bg-purple-50 text-purple-600" : act.type === "category" ? "bg-cyan-50 text-cyan-600" : act.type === "import" ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-600"}`}>
                  {act.type === "publish" ? <Eye className="h-4 w-4" /> : act.type === "create" ? <Plus className="h-4 w-4" /> : act.type === "edit" ? <Edit3 className="h-4 w-4" /> : act.type === "delete" ? <Trash2 className="h-4 w-4" /> : act.type === "feature" || act.type === "unfeature" ? <Star className="h-4 w-4" /> : act.type === "category" ? <Tag className="h-4 w-4" /> : act.type === "import" ? <FileUp className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#111111]">{act.message}</p>
                  <p className="text-[10px] text-[#8A6A4A] mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content Performance Drawer */}
      <AnimatePresence>
        {drawerOpen && drawerPost && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawerOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-[#E8DDD0]">
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#111111]">Content Performance</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
                </div>

                <div className="h-32 bg-gradient-to-br from-[#8A6A4A]/10 via-[#D8B27A]/10 to-[#EBC9A8]/10 rounded-xl flex items-center justify-center">
                  <span className="text-5xl">{drawerPost.category === "Publishing" ? "📚" : drawerPost.category === "Writing" ? "✍️" : drawerPost.category === "Marketing" ? "📢" : drawerPost.category === "Book Design" ? "🎨" : drawerPost.category === "Leadership" ? "👑" : drawerPost.category === "Business" ? "💼" : drawerPost.category === "Technology" ? "💻" : drawerPost.category === "Personal Finance" ? "💰" : drawerPost.category === "Productivity" ? "⚡" : "🌱"}</span>
                </div>

                <div>
                  <Badge variant="secondary" className={`${STATUS_CONFIG[drawerPost.status].bgColor} text-[10px] border mb-2`}>{STATUS_CONFIG[drawerPost.status].label}</Badge>
                  <h3 className="text-base font-bold text-[#111111]">{drawerPost.title}</h3>
                  <p className="text-xs text-[#5C4A3D] mt-1">{drawerPost.excerpt}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-[#5C4A3D]">
                    <span>By {drawerPost.author.name}</span>
                    <span>&middot;</span>
                    <span>{formatDate(drawerPost.publishedAt || drawerPost.createdAt)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Views", value: drawerPost.views.toLocaleString(), icon: EyeIcon, color: "text-violet-600" },
                    { label: "Comments", value: drawerPost.comments.toLocaleString(), icon: MessageSquare, color: "text-blue-600" },
                    { label: "Likes", value: drawerPost.likes.toLocaleString(), icon: Heart, color: "text-rose-600" },
                    { label: "Shares", value: drawerPost.shares.toLocaleString(), icon: Share2, color: "text-emerald-600" },
                    { label: "Reading Time", value: `${drawerPost.readingTime} min`, icon: Clock, color: "text-amber-600" },
                    { label: "SEO Score", value: `${drawerPost.seoScore}/100`, icon: Target, color: "text-[#8A6A4A]" },
                  ].map((f) => (
                    <div key={f.label} className="rounded-lg border border-[#E8DDD0] p-2.5 bg-[#F5EDE3]/30">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#5C4A3D] mb-0.5"><f.icon className={`h-3 w-3 ${f.color}`} />{f.label}</div>
                      <p className="text-sm font-bold text-[#111111]">{f.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {drawerPost.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-[10px] bg-[#F5EDE3] text-[#5C4A3D] border border-[#E8DDD0]">{tag}</Badge>)}
                    {drawerPost.tags.length === 0 && <span className="text-xs text-[#5C4A3D]">No tags</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Status Workflow</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(["draft", "review", "scheduled", "published", "archived"] as BlogStatus[]).map((s) => (
                      <Button key={s} size="sm" variant={drawerPost.status === s ? "default" : "outline"} className={`h-7 text-[10px] ${drawerPost.status === s ? "bg-[#8A6A4A] text-white" : "border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]"}`} onClick={() => { handleStatusChange(drawerPost, s); setDrawerPost({ ...drawerPost, status: s }); }}>
                        {STATUS_CONFIG[s].label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#E8DDD0]">
                  <Button size="sm" className="flex-1 bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => { setDrawerOpen(false); handleEditPost(drawerPost); }}><Edit3 className="h-3.5 w-3.5 mr-1" />Edit</Button>
                  <Button size="sm" variant="outline" className="flex-1 border-[#D8B27A] text-[#8A6A4A] hover:bg-[#F2D8BE]/20" onClick={() => { setDrawerOpen(false); openArticleReader(drawerPost); }}><Eye className="h-3.5 w-3.5 mr-1" />Read Article</Button>
                  <Button size="sm" variant="outline" className="flex-1 border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => handleToggleFeatured(drawerPost)}><Star className={`h-3.5 w-3.5 mr-1 ${drawerPost.featured ? "fill-amber-500 text-amber-500" : ""}`} />{drawerPost.featured ? "Unfeature" : "Feature"}</Button>
                  <Button size="sm" variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => { setDeleteTarget(drawerPost); setDeleteConfirmOpen(true); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>

                <div className="border-t border-[#E8DDD0] pt-4 mt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Post Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#8A6A4A]/10 flex items-center justify-center flex-shrink-0"><Clock className="h-4 w-4 text-[#8A6A4A]" /></div>
                      <div>
                        <p className="text-[11px] font-medium text-[#5C4A3D] uppercase tracking-wider">Created</p>
                        <p className="text-sm font-semibold text-[#111111]">{formatDate(drawerPost.createdAt)} &bull; {new Date(drawerPost.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#D8B27A]/10 flex items-center justify-center flex-shrink-0"><Clock className="h-4 w-4 text-[#D8B27A]" /></div>
                      <div>
                        <p className="text-[11px] font-medium text-[#5C4A3D] uppercase tracking-wider">Last Updated</p>
                        <p className="text-sm font-semibold text-[#111111]">{formatDate(drawerPost.updatedAt)} &bull; {new Date(drawerPost.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {articleReaderOpen && readerPost && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50" onClick={() => setArticleReaderOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-[#E8DDD0] p-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-[#111111]">Article Reader</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setArticleReaderOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="p-6">
                <Badge variant="secondary" className={`${CATEGORY_COLORS[readerPost.category] || "bg-gray-50 text-gray-700 border-gray-200"} text-[10px] border mb-3`}>{readerPost.category}</Badge>
                <h1 className="text-2xl font-bold text-[#111111] mb-3 leading-tight">{readerPost.title}</h1>
                <div className="flex items-center gap-3 text-sm text-[#5C4A3D] mb-4 pb-4 border-b border-[#E8DDD0]">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#8A6A4A] to-[#D8B27A] flex items-center justify-center text-white text-[10px] font-bold">{readerPost.author.name.split(" ").map((n) => n[0]).join("")}</div>
                  <div>
                    <p className="font-medium text-[#111111]">{readerPost.author.name}</p>
                    <p className="text-xs">{formatDate(readerPost.publishedAt || readerPost.createdAt)} &middot; {readerPost.readingTime} min read</p>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none text-[#3D3D3D] leading-relaxed">
                  {readerPost.content ? readerPost.content.split("\n").map((para, i) => <p key={i} className="mb-4">{para}</p>) : (
                    <>
                      <p className="mb-4">{readerPost.excerpt}</p>
                      <p className="mb-4">This is a preview of the full article. The complete content is available to readers on the public blog.</p>
                      <p className="mb-4">The article covers key insights and practical advice for authors looking to improve their publishing journey. Each section is designed to provide actionable takeaways.</p>
                      <p className="mb-4">For the full reading experience, visit the published article page where you can also leave comments and share with other authors.</p>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#E8DDD0]">
                  {readerPost.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-[10px] bg-[#F5EDE3] text-[#5C4A3D] border border-[#E8DDD0]">{tag}</Badge>)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create/Edit Post Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 border border-[#E8DDD0] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {editMode === "add" ? <Plus className="h-5 w-5 text-[#8A6A4A]" /> : <Edit3 className="h-5 w-5 text-[#8A6A4A]" />}
                  <h3 className="text-lg font-semibold text-[#111111]">{editMode === "add" ? "Create New Post" : "Edit Post"}</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditModalOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#111111] mb-1.5 block">Title</label>
                  <Input placeholder="Enter post title..." value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#111111] mb-1.5 block">Excerpt</label>
                  <textarea placeholder="Brief description..." value={editExcerpt} onChange={(e) => setEditExcerpt(e.target.value)} rows={2} className="w-full rounded-md border border-[#E8DDD0] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A4A]/30 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#111111] mb-1.5 block">Category</label>
                    <Select value={editCategory} onValueChange={setEditCategory}>
                      <SelectTrigger className="border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {blogCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#111111] mb-1.5 block">Status</label>
                    <Select value={editStatus} onValueChange={(v) => setEditStatus(v as BlogStatus)}>
                      <SelectTrigger className="border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="review">In Review</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#111111] mb-1.5 block">Content</label>
                  <textarea placeholder="Write your post content..." value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={8} className="w-full rounded-md border border-[#E8DDD0] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A4A]/30 resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#111111] mb-1.5 block">Tags / Keywords</label>
                  <Input placeholder="e.g. publishing, marketing, author tips (comma separated)" value={editTags} onChange={(e) => setEditTags(e.target.value)} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                  <p className="text-[10px] text-[#5C4A3D] mt-1">Separate tags with commas</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-[#E8DDD0]">
                <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={handleSavePost} disabled={!editTitle.trim()} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
                  {editMode === "add" ? <><Plus className="h-3.5 w-3.5 mr-1" />Create Post</> : <><Edit3 className="h-3.5 w-3.5 mr-1" />Save Changes</>}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Category Modal */}
      <AnimatePresence>
        {categoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setCategoryModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#111111]">Create Category</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCategoryModalOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-[#111111] mb-1.5 block">Category Name</label>
                  <Input placeholder="Enter category name..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" onKeyDown={(e) => { if (e.key === "Enter") handleCreateCategory(); }} />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-5 pt-4 border-t border-[#E8DDD0]">
                <Button variant="outline" size="sm" onClick={() => setCategoryModalOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={handleCreateCategory} disabled={!newCategoryName.trim()} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white"><Plus className="h-3.5 w-3.5 mr-1" />Create</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Category Selector Modal */}
      <AnimatePresence>
        {deleteCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setDeleteCategoryModalOpen(false); setDeleteCategorySearch(""); setDeleteCategoryTarget(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 border border-[#E8DDD0] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#111111]">Delete Category</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setDeleteCategoryModalOpen(false); setDeleteCategorySearch(""); setDeleteCategoryTarget(null); }}><X className="h-4 w-4" /></Button>
              </div>
              <div className="mb-3">
                <Input placeholder="Search categories..." value={deleteCategorySearch} onChange={(e) => setDeleteCategorySearch(e.target.value)} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 mb-4">
                {blogCategories.filter((c) => c.toLowerCase().includes(deleteCategorySearch.toLowerCase())).map((cat) => {
                  const postCount = allPosts.filter((p) => p.category === cat).length;
                  return (
                    <button key={cat} disabled={blogCategories.length <= 1} onClick={() => { setDeleteCategoryTarget(cat); setDeleteCategoryConfirmOpen(true); setDeleteCategoryModalOpen(false); setDeleteCategorySearch(""); }} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${blogCategories.length <= 1 ? "border-[#E8DDD0] bg-[#F5EDE3]/30 opacity-50 cursor-not-allowed" : deleteCategoryTarget === cat ? "border-rose-300 bg-rose-50" : "border-[#E8DDD0] hover:bg-[#F5EDE3] cursor-pointer"}`}>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-[#8A6A4A]" />
                        <span className="text-sm font-medium text-[#111111]">{cat}</span>
                      </div>
                      <span className="text-xs text-[#5C4A3D]">{postCount} posts</span>
                    </button>
                  );
                })}
                {blogCategories.filter((c) => c.toLowerCase().includes(deleteCategorySearch.toLowerCase())).length === 0 && (
                  <p className="text-sm text-[#5C4A3D] text-center py-4">No categories found</p>
                )}
              </div>
              <div className="flex justify-end pt-3 border-t border-[#E8DDD0]">
                <Button variant="outline" size="sm" onClick={() => { setDeleteCategoryModalOpen(false); setDeleteCategorySearch(""); setDeleteCategoryTarget(null); }} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Category Confirmation Modal */}
      <AnimatePresence>
        {deleteCategoryConfirmOpen && deleteCategoryTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => { setDeleteCategoryConfirmOpen(false); setDeleteCategoryTarget(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center"><Trash2 className="h-5 w-5 text-rose-600" /></div>
                <h3 className="text-lg font-semibold text-[#111111]">Delete Category?</h3>
              </div>
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5C4A3D]">Category:</span>
                  <span className="font-medium text-[#111111]">{deleteCategoryTarget}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5C4A3D]">Posts inside:</span>
                  <span className="font-medium text-[#111111]">{allPosts.filter((p) => p.category === deleteCategoryTarget).length}</span>
                </div>
              </div>
              <p className="text-xs text-[#5C4A3D] mb-4 bg-[#F5EDE3]/50 p-3 rounded-lg border border-[#E8DDD0]">This action will remove the category assignment from all associated posts. Posts will be reassigned to the first available category.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => { setDeleteCategoryConfirmOpen(false); setDeleteCategoryTarget(null); }} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={handleDeleteCategory} className="bg-rose-600 hover:bg-rose-700 text-white"><Trash2 className="h-3.5 w-3.5 mr-1" />Delete Category</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Posts Modal */}
      <AnimatePresence>
        {importModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setImportFiles([]); setImportModalOpen(false); }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#111111]">Import Posts</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setImportFiles([]); setImportModalOpen(false); }}><X className="h-4 w-4" /></Button>
              </div>
              <div className="border-2 border-dashed border-[#E8DDD0] rounded-xl p-8 text-center mb-4 hover:border-[#D8B27A] transition-colors relative">
                <FileUp className="h-10 w-10 text-[#D8B27A] mx-auto mb-3" />
                <p className="text-sm font-medium text-[#111111] mb-1">{importFiles.length > 0 ? `${importFiles.length} file(s) selected` : "Drop CSV or JSON file here"}</p>
                <p className="text-xs text-[#5C4A3D]">{importFiles.length > 0 ? "Click Import to proceed" : "or click to browse"}</p>
                <input type="file" accept=".csv,.json" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setImportFiles(Array.from(e.target.files || []))} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => { setImportFiles([]); setImportModalOpen(false); }} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={() => { handleImportPosts(); setImportFiles([]); }} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white"><Upload className="h-3.5 w-3.5 mr-1" />Import Demo Data</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Editorial Report Modal */}
      <AnimatePresence>
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setReportModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 border border-[#E8DDD0] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-[#111111]">Editorial Report</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={downloadReportPDF} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]"><Download className="h-3.5 w-3.5 mr-1" />PDF</Button>
                  <Button variant="outline" size="sm" onClick={downloadReportCSV} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]"><Download className="h-3.5 w-3.5 mr-1" />CSV</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setReportModalOpen(false)}><X className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Posts", value: allPosts.length, icon: FileText },
                    { label: "Published", value: stats.published, icon: Eye },
                    { label: "Drafts", value: stats.drafts, icon: Edit3 },
                    { label: "Total Views", value: stats.totalViews.toLocaleString(), icon: EyeIcon },
                    { label: "Total Comments", value: stats.totalComments.toLocaleString(), icon: MessageSquare },
                    { label: "Featured", value: stats.featured, icon: Star },
                  ].map((r) => (
                    <div key={r.label} className="rounded-lg border border-[#E8DDD0] p-3 bg-[#F5EDE3]/20">
                      <div className="flex items-center gap-2 mb-1">
                        <r.icon className="h-3.5 w-3.5 text-[#8A6A4A]" />
                        <span className="text-[11px] text-[#5C4A3D]">{r.label}</span>
                      </div>
                      <p className="text-lg font-bold text-[#111111]">{r.value}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E8DDD0] pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Top Categories</h4>
                  <div className="space-y-1.5">
                    {(() => {
                      const catCounts: Record<string, number> = {};
                      allPosts.forEach((p) => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
                      return Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([cat, count]) => (
                        <div key={cat} className="flex items-center justify-between text-xs">
                          <span className="text-[#5C4A3D]">{cat}</span>
                          <span className="font-medium text-[#111111]">{count} posts</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
                <div className="border-t border-[#E8DDD0] pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Top Articles</h4>
                  <div className="space-y-1.5">
                    {allPosts.filter((p) => p.status === "published").sort((a, b) => b.views - a.views).slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-xs">
                        <span className="text-[#5C4A3D] truncate max-w-[250px]">{p.title}</span>
                        <span className="font-medium text-[#111111] flex-shrink-0 ml-2">{p.views.toLocaleString()} views</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-5 pt-4 border-t border-[#E8DDD0]">
                <Button size="sm" onClick={() => setReportModalOpen(false)} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">Done</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Calendar Date Posts Modal */}
      <AnimatePresence>
        {selectedCalendarDate && calendarDatePosts.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setSelectedCalendarDate(null); setCalendarDatePosts([]); }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 border border-[#E8DDD0] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#111111]">Posts on {selectedCalendarDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</h3>
                  <p className="text-xs text-[#5C4A3D]">{calendarDatePosts.length} post{calendarDatePosts.length !== 1 ? "s" : ""} found</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedCalendarDate(null); setCalendarDatePosts([]); }}><X className="h-4 w-4" /></Button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {calendarDatePosts.map((post) => (
                  <div key={post.id} onClick={() => { setSelectedCalendarDate(null); setCalendarDatePosts([]); openDrawer(post); }} className="flex items-center gap-3 p-3 rounded-lg border border-[#E8DDD0] hover:bg-[#F5EDE3]/30 cursor-pointer transition-colors">
                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${post.status === "published" ? "bg-emerald-500" : post.status === "scheduled" ? "bg-blue-500" : "bg-orange-500"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#111111] truncate">{post.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[#5C4A3D] mt-0.5">
                        <span className={`px-1.5 py-0.5 rounded ${post.status === "published" ? "bg-emerald-50 text-emerald-700" : post.status === "scheduled" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"}`}>{post.status}</span>
                        <span>{post.author.name}</span>
                        <span>&middot;</span>
                        <span>{post.category}</span>
                      </div>
                    </div>
                    <Eye className="h-4 w-4 text-[#5C4A3D] flex-shrink-0" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4 pt-3 border-t border-[#E8DDD0]">
                <Button variant="outline" size="sm" onClick={() => { setSelectedCalendarDate(null); setCalendarDatePosts([]); }} className="border-[#E8DDD0] text-[#5C4A3D]">Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirmOpen && deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirmOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center"><Trash2 className="h-5 w-5 text-rose-600" /></div>
                <h3 className="text-lg font-semibold text-[#111111]">Delete Post?</h3>
              </div>
              <p className="text-sm text-[#5C4A3D] mb-1">This will permanently remove this blog post.</p>
              <p className="text-sm font-medium text-[#111111] mb-4">{deleteTarget.title}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setDeleteConfirmOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 text-white"><Trash2 className="h-3.5 w-3.5 mr-1" />Delete Post</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }} className={`fixed bottom-6 left-1/2 z-[100] px-5 py-3 rounded-xl shadow-xl border ${notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
            <div className="flex items-center gap-2">
              {notification.type === "success" ? <span className="text-emerald-600">✓</span> : <span className="text-rose-600">✕</span>}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
