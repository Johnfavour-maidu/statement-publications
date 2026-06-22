"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Eye,
  BarChart3,
  DollarSign,
  Search,
  Plus,
  Upload,
  ShoppingCart,
  Hash,
  Download,
  Edit,
  Trash2,
  Archive,
  Copy,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Users,
  MessageSquare,
  Bookmark,
  RefreshCw,
  XCircle,
  AlertTriangle,
  ArrowUp,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Layers,
  Target,
  Award,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookStatus = "PUBLISHED" | "DRAFT" | "PENDING_REVIEW" | "REJECTED";

interface Book {
  id: string;
  title: string;
  isbn: string;
  category: string;
  status: BookStatus;
  views: number;
  sales: number;
  revenue: number;
  rating: number;
  createdDate: string;
  updatedDate: string;
  performance: string;
  description: string;
}

const demoBooks: Book[] = [
  { id: "1", title: "Wealth Is A Decision", isbn: "978-1-234567-01-1", category: "Personal Finance", status: "PUBLISHED", views: 12450, sales: 342, revenue: 2640, rating: 4.8, createdDate: "Jan 15", updatedDate: "Jun 18", performance: "Excellent", description: "A comprehensive guide to making smart financial decisions that build lasting wealth." },
  { id: "2", title: "Income Is A Skill", isbn: "978-1-234567-02-8", category: "Personal Finance", status: "PUBLISHED", views: 9820, sales: 268, revenue: 2180, rating: 4.7, createdDate: "Feb 3", updatedDate: "Jun 15", performance: "Excellent", description: "Learn the essential skills to increase your income and achieve financial freedom." },
  { id: "3", title: "Money Is A Behaviour", isbn: "978-1-234567-03-5", category: "Personal Finance", status: "PUBLISHED", views: 8340, sales: 195, revenue: 1420, rating: 4.6, createdDate: "Feb 20", updatedDate: "Jun 12", performance: "Excellent", description: "Understanding the psychology behind money habits and how to change them." },
  { id: "4", title: "Master Your Spending", isbn: "978-1-234567-04-2", category: "Budgeting", status: "PUBLISHED", views: 6890, sales: 148, revenue: 980, rating: 4.5, createdDate: "Mar 8", updatedDate: "Jun 10", performance: "Excellent", description: "Practical strategies to take control of your spending and save more money." },
  { id: "5", title: "Build Strong Savings", isbn: "978-1-234567-05-9", category: "Savings", status: "PUBLISHED", views: 5420, sales: 112, revenue: 640, rating: 4.4, createdDate: "Mar 22", updatedDate: "Jun 8", performance: "Good", description: "A step-by-step approach to building a robust savings plan for any income level." },
  { id: "6", title: "Beginner Investing Made Simple", isbn: "978-1-234567-06-6", category: "Investing", status: "PUBLISHED", views: 4870, sales: 96, revenue: 480, rating: 4.3, createdDate: "Apr 5", updatedDate: "Jun 5", performance: "Good", description: "Breaking down complex investment concepts into simple, actionable steps for beginners." },
  { id: "7", title: "Financial Clarity Blueprint", isbn: "978-1-234567-07-3", category: "Finance", status: "PUBLISHED", views: 4210, sales: 78, revenue: 320, rating: 4.2, createdDate: "Apr 18", updatedDate: "Jun 2", performance: "Good", description: "Your complete blueprint for achieving financial clarity and long-term stability." },
  { id: "8", title: "The Entrepreneur Mindset", isbn: "978-1-234567-08-0", category: "Business", status: "PUBLISHED", views: 3680, sales: 64, revenue: 240, rating: 4.1, createdDate: "May 2", updatedDate: "May 28", performance: "Good", description: "Cultivating the mindset needed to succeed as an entrepreneur in today's market." },
  { id: "9", title: "Digital Nomad Guide", isbn: "978-1-234567-09-7", category: "Travel", status: "PUBLISHED", views: 3240, sales: 52, revenue: 180, rating: 4.0, createdDate: "May 15", updatedDate: "May 25", performance: "Good", description: "Everything you need to know about living and working as a digital nomad." },
  { id: "10", title: "Self-Publishing Mastery", isbn: "978-1-234567-10-3", category: "Publishing", status: "PUBLISHED", views: 2890, sales: 45, revenue: 120, rating: 3.9, createdDate: "Jun 1", updatedDate: "Jun 18", performance: "Average", description: "Master the art of self-publishing and bring your book to market successfully." },
  { id: "11", title: "Creative Writing 101", isbn: "978-1-234567-11-0", category: "Writing", status: "PUBLISHED", views: 2540, sales: 38, revenue: 80, rating: 3.8, createdDate: "Jun 10", updatedDate: "Jun 18", performance: "Average", description: "A foundational guide to creative writing for aspiring authors." },
  { id: "12", title: "The Writer's Journey", isbn: "978-1-234567-12-7", category: "Writing", status: "PUBLISHED", views: 2100, sales: 28, revenue: 60, rating: 3.7, createdDate: "Jun 18", updatedDate: "Jun 18", performance: "Average", description: "Follow the transformative journey of becoming a published writer." },
  { id: "13", title: "Future Trends 2025", isbn: "978-1-234567-13-4", category: "Business", status: "DRAFT", views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Jun 1", updatedDate: "Jun 16", performance: "Needs Attention", description: "An exploration of emerging business and technology trends for 2025." },
  { id: "14", title: "Health & Wellness Guide", isbn: "978-1-234567-14-1", category: "Health", status: "DRAFT", views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Jun 5", updatedDate: "Jun 14", performance: "Needs Attention", description: "A comprehensive guide to holistic health and wellness practices." },
  { id: "15", title: "Travel Memoirs", isbn: "978-1-234567-15-8", category: "Travel", status: "DRAFT", views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Jun 10", updatedDate: "Jun 17", performance: "Needs Attention", description: "Personal travel stories and insights from journeys around the world." },
  { id: "16", title: "Poetry Collection", isbn: "978-1-234567-16-5", category: "Poetry", status: "PENDING_REVIEW", views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Jun 12", updatedDate: "Jun 18", performance: "Needs Attention", description: "A curated collection of contemporary poetry exploring love, nature, and life." },
  { id: "17", title: "The Art of Public Speaking", isbn: "978-1-234567-17-2", category: "Self-Help", status: "PENDING_REVIEW", views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Jun 15", updatedDate: "Jun 18", performance: "Needs Attention", description: "Develop confidence and master the skills of effective public speaking." },
  { id: "18", title: "Rejected Manuscript", isbn: "978-1-234567-18-9", category: "Fiction", status: "REJECTED", views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Jun 8", updatedDate: "Jun 17", performance: "Needs Attention", description: "A fictional manuscript that did not meet publishing guidelines." },
];

const statusConfig: Record<BookStatus, { label: string; color: string; bg: string }> = {
  PUBLISHED: { label: "Published", color: "text-emerald-700", bg: "bg-emerald-100" },
  DRAFT: { label: "Draft", color: "text-gray-700", bg: "bg-gray-100" },
  PENDING_REVIEW: { label: "Pending Review", color: "text-amber-700", bg: "bg-amber-100" },
  REJECTED: { label: "Rejected", color: "text-red-700", bg: "bg-red-100" },
};

const performanceConfig: Record<string, { color: string; bg: string; label: string }> = {
  Excellent: { color: "text-emerald-700", bg: "bg-emerald-100", label: "Excellent" },
  Good: { color: "text-blue-700", bg: "bg-blue-100", label: "Good" },
  Average: { color: "text-amber-700", bg: "bg-amber-100", label: "Average" },
  "Needs Attention": { color: "text-red-700", bg: "bg-red-100", label: "Needs Attention" },
};

const coverColors = [
  "bg-[#8A6A4A]",
  "bg-[#D8B27A]",
  "bg-[#F2D8BE]",
  "bg-emerald-200",
  "bg-blue-200",
  "bg-violet-200",
  "bg-amber-200",
  "bg-pink-200",
  "bg-cyan-200",
];

const monthlyEarnings = [
  { month: "Jan", amount: 420 },
  { month: "Feb", amount: 560 },
  { month: "Mar", amount: 780 },
  { month: "Apr", amount: 940 },
  { month: "May", amount: 1200 },
  { month: "Jun", amount: 1560 },
];

const bookViewsTrend = [
  { month: "Jan", views: 8200 },
  { month: "Feb", views: 9400 },
  { month: "Mar", views: 12100 },
  { month: "Apr", views: 14800 },
  { month: "May", views: 18200 },
  { month: "Jun", views: 21500 },
];

const topPerformingBooks = [
  { title: "Wealth Is A Decision", sales: 342, max: 400 },
  { title: "Income Is A Skill", sales: 268, max: 400 },
  { title: "Money Is A Behaviour", sales: 195, max: 400 },
  { title: "Master Your Spending", sales: 148, max: 400 },
  { title: "Build Strong Savings", sales: 112, max: 400 },
];

const revenueBreakdown = [
  { name: "Personal Finance", value: 6240 },
  { name: "Budgeting", value: 980 },
  { name: "Savings", value: 640 },
  { name: "Investing", value: 480 },
  { name: "Finance", value: 320 },
  { name: "Other", value: 900 },
];

const recentActivity = [
  { id: "1", text: "\"Wealth Is A Decision\" approved and published", time: "2 hours ago", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100" },
  { id: "2", text: "\"Future Trends 2025\" draft updated", time: "5 hours ago", icon: Edit, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "3", text: "New 5-star review on \"Income Is A Skill\"", time: "1 day ago", icon: Star, color: "text-amber-500", bg: "bg-amber-100" },
  { id: "4", text: "\"Money Is A Behaviour\" published", time: "2 days ago", icon: BookOpen, color: "text-green-500", bg: "bg-green-100" },
  { id: "5", text: "Metadata updated for \"Master Your Spending\"", time: "3 days ago", icon: RefreshCw, color: "text-gray-500", bg: "bg-gray-100" },
];

const publishHistory = [
  { step: "Created", date: "Jan 15, 2025", done: true },
  { step: "Submitted for Review", date: "Feb 1, 2025", done: true },
  { step: "Approved", date: "Feb 10, 2025", done: true },
  { step: "Published", date: "Feb 15, 2025", done: true },
  { step: "Updated", date: "Jun 18, 2025", done: true },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: [0.25, 0.46, 0.45, 0.94] as const } },
} as const;

export default function AuthorBooksPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [drawerBook, setDrawerBook] = useState<Book | null>(null);
  const [deleteBook, setDeleteBook] = useState<Book | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [undoStack, setUndoStack] = useState<Array<{ action: string; book: Book }>>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalBooks = demoBooks.length;
  const publishedCount = demoBooks.filter((b) => b.status === "PUBLISHED").length;
  const draftsCount = demoBooks.filter((b) => b.status === "DRAFT").length;
  const pendingCount = demoBooks.filter((b) => b.status === "PENDING_REVIEW").length;
  const rejectedCount = demoBooks.filter((b) => b.status === "REJECTED").length;
  const totalViews = demoBooks.reduce((s, b) => s + b.views, 0);
  const totalRevenue = demoBooks.reduce((s, b) => s + b.revenue, 0);
  const bestSellersCount = demoBooks.filter((b) => b.sales >= 100).length;

  const filteredBooks = useMemo(() => {
    let books = [...demoBooks];

    if (statusFilter !== "all") {
      const statusMap: Record<string, BookStatus> = {
        published: "PUBLISHED",
        drafts: "DRAFT",
        pending: "PENDING_REVIEW",
        rejected: "REJECTED",
      };
      if (statusMap[statusFilter]) {
        books = books.filter((b) => b.status === statusMap[statusFilter]);
      }
    }

    if (activeCategory !== "all") {
      const catMap: Record<string, (b: Book) => boolean> = {
        published: (b) => b.status === "PUBLISHED",
        drafts: (b) => b.status === "DRAFT",
        pending: (b) => b.status === "PENDING_REVIEW",
        rejected: (b) => b.status === "REJECTED",
        bestsellers: (b) => b.sales >= 100,
      };
      const filter = catMap[activeCategory];
      if (filter) books = books.filter(filter);
    }

    if (search) {
      const q = search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    const sortFns: Record<string, (a: Book, b: Book) => number> = {
      newest: (a, b) => b.id.localeCompare(a.id),
      oldest: (a, b) => a.id.localeCompare(b.id),
      revenue: (a, b) => b.revenue - a.revenue,
      views: (a, b) => b.views - a.views,
      rating: (a, b) => b.rating - a.rating,
      title: (a, b) => a.title.localeCompare(b.title),
    };
    books.sort(sortFns[sortBy] || sortFns.newest);
    return books;
  }, [search, sortBy, activeCategory, statusFilter]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedBooks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedBooks.size === filteredBooks.length) {
      setSelectedBooks(new Set());
    } else {
      setSelectedBooks(new Set(filteredBooks.map((b) => b.id)));
    }
  }, [selectedBooks, filteredBooks]);

  const handleDelete = useCallback((book: Book) => {
    setUndoStack((prev) => [...prev, { action: "delete", book }]);
    setDeleteBook(null);
    setToastMessage(`"${book.title}" deleted. Undo?`);
    setTimeout(() => setToastMessage(null), 5000);
  }, []);

  const handleArchive = useCallback((book: Book) => {
    setUndoStack((prev) => [...prev, { action: "archive", book }]);
    setToastMessage(`"${book.title}" archived. Undo?`);
    setTimeout(() => setToastMessage(null), 5000);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setToastMessage(`Undone: ${last.action} of "${last.book.title}"`);
    setTimeout(() => setToastMessage(null), 3000);
  }, [undoStack]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo]);

  const summaryCards = [
    { key: "total", label: "Total Books", value: totalBooks.toString(), icon: BookOpen, iconBg: "bg-blue-100", iconColor: "text-blue-600", change: "+3 this month", positive: true, href: "/author/books" },
    { key: "published", label: "Published", value: publishedCount.toString(), icon: CheckCircle2, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", change: "+2 this month", positive: true, href: "/author/books?status=published" },
    { key: "drafts", label: "Drafts", value: draftsCount.toString(), icon: FileText, iconBg: "bg-gray-100", iconColor: "text-gray-600", change: "1 new", positive: true, href: "/author/books?status=drafts" },
    { key: "pending", label: "Pending Review", value: pendingCount.toString(), icon: Eye, iconBg: "bg-amber-100", iconColor: "text-amber-600", change: "Awaiting review", positive: false, href: "/author/books?status=pending" },
    { key: "views", label: "Total Views", value: totalViews.toLocaleString(), icon: BarChart3, iconBg: "bg-violet-100", iconColor: "text-violet-600", change: "+12% from last month", positive: true, href: "/author/analytics" },
    { key: "revenue", label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, iconBg: "bg-green-100", iconColor: "text-green-600", change: "+30% from last month", positive: true, href: "/author/analytics" },
  ];

  const categoryTabs = [
    { key: "all", label: "All Books", count: totalBooks },
    { key: "published", label: "Published", count: publishedCount },
    { key: "drafts", label: "Drafts", count: draftsCount },
    { key: "pending", label: "Pending Review", count: pendingCount },
    { key: "rejected", label: "Rejected", count: rejectedCount },
    { key: "bestsellers", label: "Best Sellers", count: bestSellersCount },
  ];

  const emptyStateConfig: Record<string, { icon: any; title: string; desc: string }> = {
    published: { icon: CheckCircle2, title: "No Published Books", desc: "Publish your first book to see it here." },
    drafts: { icon: FileText, title: "No Draft Books", desc: "Create your first draft to get started." },
    pending: { icon: Clock, title: "No Pending Reviews", desc: "All your books have been reviewed." },
    rejected: { icon: XCircle, title: "No Rejected Books", desc: "All submissions are looking great!" },
    bestsellers: { icon: Award, title: "No Best Sellers Yet", desc: "Keep publishing to hit the best seller mark." },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-24">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">My Books</h1>
          <p className="text-sm text-muted-foreground">Manage and track all your published books</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-lg border-[#E8DDD0] hover:shadow-md transition-all">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg">
              <DropdownMenuItem onClick={() => alert("Exporting PDF...")}>
                <FileText className="h-4 w-4 mr-2" /> Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Exporting Excel...")}>
                <BarChart3 className="h-4 w-4 mr-2" /> Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Exporting CSV...")}>
                <Download className="h-4 w-4 mr-2" /> Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Quick Actions Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg hover:shadow-md transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Quick Actions
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg w-56">
              <DropdownMenuItem asChild>
                <Link href="/author/books/new"><Plus className="h-4 w-4 mr-2" /> Create New Book</Link>
              </DropdownMenuItem>
              <DropdownMenuItem><Upload className="h-4 w-4 mr-2" /> Upload Manuscript</DropdownMenuItem>
              <DropdownMenuItem><FileText className="h-4 w-4 mr-2" /> Create Draft</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/services"><ShoppingCart className="h-4 w-4 mr-2" /> Order Publishing Service</Link>
              </DropdownMenuItem>
              <DropdownMenuItem><Hash className="h-4 w-4 mr-2" /> Request ISBN</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/author/analytics"><BarChart3 className="h-4 w-4 mr-2" /> View Analytics</Link>
              </DropdownMenuItem>
              <DropdownMenuItem><Download className="h-4 w-4 mr-2" /> Export Book List</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* 1. Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card) => (
          <Link key={card.key} href={card.href}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl border border-[#E8DDD0] p-4 cursor-pointer transition-all duration-300 hover:border-[#D8B27A]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1D1D1D]">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
              <p className={`text-xs mt-2 font-medium ${card.positive ? "text-emerald-600" : "text-amber-600"}`}>{card.change}</p>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* 2. Advanced Filter Bar */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, ISBN, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-lg border-[#E8DDD0] focus:border-[#D8B27A] focus:ring-[#D8B27A]/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] rounded-lg border-[#E8DDD0]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="drafts">Drafts</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] rounded-lg border-[#E8DDD0]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="revenue">Highest Revenue</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
              <SelectItem value="rating">Best Rated</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground ml-auto">
          Showing {filteredBooks.length} of {totalBooks} books
        </p>
      </motion.div>

      {/* 5. Book Status Categories */}
      <motion.div variants={item} className="flex flex-wrap gap-2">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeCategory === tab.key
                ? "bg-[#8A6A4A] text-white shadow-md"
                : "bg-white border border-[#E8DDD0] text-[#1D1D1D] hover:bg-[#F5EDE3]"
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeCategory === tab.key ? "bg-white/20" : "bg-[#F5EDE3]"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* 4. Analytics Center (Collapsible) */}
      <motion.div variants={item}>
        <button
          onClick={() => setAnalyticsOpen(!analyticsOpen)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-[#E8DDD0] hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F2D8BE] rounded-lg">
              <BarChart3 className="h-5 w-5 text-[#8A6A4A]" />
            </div>
            <span className="font-semibold text-[#1D1D1D]">Author Book Analytics Center</span>
          </div>
          {analyticsOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </button>
        <AnimatePresence>
          {analyticsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                {/* Monthly Earnings AreaChart */}
                <div className="bg-white rounded-xl border border-[#E8DDD0] p-4">
                  <h3 className="font-semibold text-[#1D1D1D] mb-4">Monthly Earnings</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={monthlyEarnings}>
                      <defs>
                        <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D8B27A" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#D8B27A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid #E8DDD0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        formatter={(value) => [`$${value}`, "Revenue"]}
                      />
                      <Area type="monotone" dataKey="amount" stroke="#D8B27A" fill="url(#earningsGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Book Views Trend BarChart */}
                <div className="bg-white rounded-xl border border-[#E8DDD0] p-4">
                  <h3 className="font-semibold text-[#1D1D1D] mb-4">Book Views Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={bookViewsTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid #E8DDD0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        formatter={(value) => [Number(value).toLocaleString(), "Views"]}
                      />
                      <Bar dataKey="views" fill="#8A6A4A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Top Performing Books */}
                <div className="bg-white rounded-xl border border-[#E8DDD0] p-4">
                  <h3 className="font-semibold text-[#1D1D1D] mb-4">Top Performing Books</h3>
                  <div className="space-y-4">
                    {topPerformingBooks.map((book, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-[#1D1D1D]">{book.title}</span>
                          <span className="text-muted-foreground">{book.sales} sales</span>
                        </div>
                        <div className="h-2 bg-[#F5EDE3] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#D8B27A] to-[#8A6A4A] rounded-full transition-all duration-500"
                            style={{ width: `${(book.sales / book.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Revenue Breakdown PieChart */}
                <div className="bg-white rounded-xl border border-[#E8DDD0] p-4">
                  <h3 className="font-semibold text-[#1D1D1D] mb-4">Revenue by Category</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={revenueBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {revenueBreakdown.map((_, i) => (
                          <Cell key={i} fill={["#8A6A4A", "#D8B27A", "#F2D8BE", "#6B9E76", "#7B8EC2", "#C49A6C"][i]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid #E8DDD0" }}
                        formatter={(value) => [`$${value}`, "Revenue"]}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 9 & 11. Revenue Insights + Reader Engagement */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 9. Revenue Insights Panel */}
        <div className="bg-white rounded-xl border border-[#E8DDD0] p-5">
          <h3 className="font-semibold text-[#1D1D1D] mb-4">Revenue Insights</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
              <p className="text-xs text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-[#1D1D1D]">$1,560</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">+30%</span>
              </div>
            </div>
            <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Last Month</p>
              <p className="text-2xl font-bold text-[#1D1D1D]">$1,200</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">+18%</span>
              </div>
            </div>
            <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Best Seller</p>
              <p className="text-sm font-semibold text-[#1D1D1D]">Wealth Is A Decision</p>
              <p className="text-xs text-muted-foreground mt-0.5">$2,640 total</p>
            </div>
            <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Top Category</p>
              <p className="text-sm font-semibold text-[#1D1D1D]">Personal Finance</p>
              <p className="text-xs text-muted-foreground mt-0.5">71% of revenue</p>
            </div>
          </div>
        </div>
        {/* 11. Reader Engagement */}
        <div className="bg-white rounded-xl border border-[#E8DDD0] p-5">
          <h3 className="font-semibold text-[#1D1D1D] mb-4">Reader Engagement</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Readers", value: "4,820", icon: Users, bg: "bg-blue-100", color: "text-blue-600" },
              { label: "Avg Reading Time", value: "12.4 min", icon: Clock, bg: "bg-emerald-100", color: "text-emerald-600" },
              { label: "Comments", value: "486", icon: MessageSquare, bg: "bg-amber-100", color: "text-amber-600" },
              { label: "Downloads", value: "2,340", icon: Download, bg: "bg-violet-100", color: "text-violet-600" },
              { label: "Bookmarks", value: "1,890", icon: Bookmark, bg: "bg-pink-100", color: "text-pink-600" },
            ].map((m) => (
              <div key={m.label} className="p-3 border border-[#E8DDD0] rounded-xl flex items-center gap-3">
                <div className={`p-2 rounded-lg ${m.bg}`}>
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1D1D1D]">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 10. Recent Book Activity */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] p-5">
        <h3 className="font-semibold text-[#1D1D1D] mb-4">Recent Book Activity</h3>
        <div className="space-y-0">
          {recentActivity.map((a, i) => (
            <div key={a.id} className="flex gap-4 relative">
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${a.bg} z-10`}>
                  <a.icon className={`h-4 w-4 ${a.color}`} />
                </div>
                {i < recentActivity.length - 1 && <div className="w-px flex-1 bg-[#E8DDD0] my-1" />}
              </div>
              <div className="pb-6 pt-1">
                <p className="text-sm font-medium text-[#1D1D1D]">{a.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 6. Premium Book Table */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm overflow-hidden">
        {filteredBooks.length === 0 ? (
          /* 15. Empty States */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            {activeCategory !== "all" && emptyStateConfig[activeCategory] ? (
              (() => {
                const cfg = emptyStateConfig[activeCategory];
                const Icon = cfg.icon;
                return (
                  <>
                    <div className="p-4 bg-[#F5EDE3] rounded-full mb-4">
                      <Icon className="h-10 w-10 text-[#8A6A4A]" />
                    </div>
                    <p className="text-lg font-semibold text-[#1D1D1D]">{cfg.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">{cfg.desc}</p>
                    <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg" asChild>
                      <Link href="/author/books/new"><Plus className="h-4 w-4 mr-2" /> Create New Book</Link>
                    </Button>
                  </>
                );
              })()
            ) : (
              <>
                <div className="p-4 bg-[#F5EDE3] rounded-full mb-4">
                  <BookOpen className="h-10 w-10 text-[#8A6A4A]" />
                </div>
                <p className="text-lg font-semibold text-[#1D1D1D]">No books found</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Try adjusting your search or filters.</p>
                <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg" asChild>
                  <Link href="/author/books/new"><Plus className="h-4 w-4 mr-2" /> Create New Book</Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8DDD0] bg-[#F5EDE3]/30">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBooks.size === filteredBooks.length && filteredBooks.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-[#E8DDD0]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Cover</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Book Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ISBN</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Views</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Sales</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Revenue</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Updated</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, idx) => {
                  const status = statusConfig[book.status];
                  return (
                    <tr
                      key={book.id}
                      className="border-b border-[#E8DDD0]/50 hover:bg-[#F5EDE3]/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedBooks.has(book.id)}
                          onChange={() => toggleSelect(book.id)}
                          className="rounded border-[#E8DDD0]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className={`h-12 w-9 rounded-md ${coverColors[idx % coverColors.length]} flex items-center justify-center`}>
                          <BookOpen className="h-5 w-5 text-white/70" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#1D1D1D]">{book.title}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{book.isbn}</td>
                      <td className="px-4 py-3 text-sm">{book.category}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">{book.views.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right">{book.sales.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">${book.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        {book.rating > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm">{book.rating}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{book.createdDate}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{book.updatedDate}</td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg">
                            <DropdownMenuItem onClick={() => setDrawerBook(book)}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchive(book)}>
                              <Archive className="h-4 w-4 mr-2" /> Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteBook(book)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* 16. Pagination Summary */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Showing 1–{filteredBooks.length} of {filteredBooks.length} books</span>
          <span className="hidden sm:inline">|</span>
          <span>Published: {publishedCount}</span>
          <span>|</span>
          <span>Drafts: {draftsCount}</span>
          <span>|</span>
          <span>Pending: {pendingCount}</span>
          <span>|</span>
          <span>Rejected: {rejectedCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-lg border-[#E8DDD0]" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-[#8A6A4A] bg-[#F5EDE3] px-3 py-1 rounded-lg">1</span>
          <Button variant="outline" size="icon" className="rounded-lg border-[#E8DDD0]" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* 8. Book Details Drawer */}
      <AnimatePresence>
        {drawerBook && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setDrawerBook(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl rounded-l-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1D1D1D]">Book Details</h2>
                  <button onClick={() => setDrawerBook(null)} className="p-2 hover:bg-[#F5EDE3] rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className={`h-48 rounded-xl ${coverColors[parseInt(drawerBook.id) % coverColors.length]} flex items-center justify-center mb-6`}>
                  <BookOpen className="h-16 w-16 text-white/50" />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">{drawerBook.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{drawerBook.description}</p>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">ISBN</span>
                    <span className="text-sm font-mono text-[#1D1D1D]">{drawerBook.isbn}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`text-sm font-medium ${statusConfig[drawerBook.status].color}`}>{statusConfig[drawerBook.status].label}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-medium text-[#1D1D1D]">{drawerBook.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="text-sm font-bold text-[#1D1D1D]">${drawerBook.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Views</span>
                    <span className="text-sm font-medium text-[#1D1D1D]">{drawerBook.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Sales</span>
                    <span className="text-sm font-medium text-[#1D1D1D]">{drawerBook.sales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <span className="text-sm font-medium flex items-center gap-1 text-[#1D1D1D]">
                      {drawerBook.rating > 0 ? (
                        <><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {drawerBook.rating}</>
                      ) : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-muted-foreground">Performance</span>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${performanceConfig[drawerBook.performance]?.bg} ${performanceConfig[drawerBook.performance]?.color}`}>
                      {performanceConfig[drawerBook.performance]?.label}
                    </span>
                  </div>
                </div>
                {/* Publishing History Timeline */}
                <h4 className="font-semibold text-[#1D1D1D] mb-3">Publishing History</h4>
                <div className="space-y-0">
                  {publishHistory.map((step, i) => (
                    <div key={i} className="flex gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${step.done ? "bg-[#8A6A4A]" : "bg-[#E8DDD0]"} z-10 mt-1`} />
                        {i < publishHistory.length - 1 && <div className="w-px flex-1 bg-[#E8DDD0]" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-[#1D1D1D]">{step.step}</p>
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteBook && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setDeleteBook(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-red-100 rounded-full mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1D] mb-2">Delete Book</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Are you sure you want to delete &quot;{deleteBook.title}&quot;? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <Button variant="outline" className="flex-1 rounded-lg border-[#E8DDD0]" onClick={() => setDeleteBook(null)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 rounded-lg bg-red-500 text-white hover:bg-red-600" onClick={() => handleDelete(deleteBook)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 13. Bulk Action Bar */}
      <AnimatePresence>
        {selectedBooks.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DDD0] shadow-2xl z-40 px-6 py-4"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#1D1D1D]">{selectedBooks.size} book{selectedBooks.size > 1 ? "s" : ""} selected</span>
                <Button variant="outline" size="sm" className="rounded-lg border-[#E8DDD0]" onClick={() => setSelectedBooks(new Set())}>
                  Clear Selection
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Publish
                </Button>
                <Button size="sm" className="rounded-lg bg-gray-500 text-white hover:bg-gray-600">
                  <Archive className="h-4 w-4 mr-1" /> Archive
                </Button>
                <Button size="sm" className="rounded-lg bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
                <Button size="sm" className="rounded-lg bg-red-500 text-white hover:bg-red-600">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 17. Undo Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1D1D1D] text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-4"
          >
            <span className="text-sm">{toastMessage}</span>
            {undoStack.length > 0 && (
              <Button size="sm" variant="ghost" className="text-[#D8B27A] hover:text-[#D8B27A] hover:bg-white/10" onClick={handleUndo}>
                Undo
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
