"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Plus, Search, Filter, MoreVertical, Eye, Edit, Copy, Archive, Trash2,
  ArrowUp, TrendingUp, Users, Clock, MessageSquare, Download, Bookmark, Star,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle,
  FileText, X, Grid3X3, List, BarChart3, PieChart as PieIcon, SlidersHorizontal,
  Check, RefreshCw, Settings, TrendingDown, DollarSign, ShoppingCart, BookMarked,
  Loader2, ArrowRight, ArrowUpDown, SortAsc, SortDesc, LayoutGrid, Table, Calendar, Tag,
  Folder, Award, Zap, Activity, Eye as EyeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
const statusConfig = {
  published: { label: "Published", bg: "bg-emerald-100", color: "text-emerald-700" },
  draft: { label: "Draft", bg: "bg-amber-100", color: "text-amber-700" },
  pending: { label: "Pending", bg: "bg-blue-100", color: "text-blue-700" },
  rejected: { label: "Rejected", bg: "bg-red-100", color: "text-red-700" },
} as const;

const performanceConfig = {
  excellent: { label: "Excellent", bg: "bg-emerald-100", color: "text-emerald-700" },
  good: { label: "Good", bg: "bg-blue-100", color: "text-blue-700" },
  average: { label: "Average", bg: "bg-amber-100", color: "text-amber-700" },
  new: { label: "New", bg: "bg-purple-100", color: "text-purple-700" },
} as const;

const coverColors = [
  "bg-gradient-to-br from-[#8A6A4A] to-[#6B5538]",
  "bg-gradient-to-br from-[#D8B27A] to-[#b8966a]",
  "bg-gradient-to-br from-[#1D1D1D] to-[#3a3a3a]",
  "bg-gradient-to-br from-[#5C4033] to-[#4a3228]",
  "bg-gradient-to-br from-[#8B7355] to-[#6d5a43]",
  "bg-gradient-to-br from-[#2C5F2D] to-[#234b24]",
];

const emptyStateConfig: Record<string, { icon: any; title: string; desc: string }> = {
  published: { icon: CheckCircle2, title: "No Published Books", desc: "Publish your first book to start earning." },
  draft: { icon: FileText, title: "No Drafts", desc: "All caught up! No drafts in progress." },
  pending: { icon: Clock, title: "No Pending Books", desc: "No books awaiting approval." },
  rejected: { icon: AlertTriangle, title: "No Rejected Books", desc: "No books have been rejected." },
};

const categoryTabs = [
  { key: "all", label: "All Books", icon: BookOpen, count: 18 },
  { key: "published", label: "Published", icon: CheckCircle2, count: 12 },
  { key: "draft", label: "Drafts", icon: FileText, count: 3 },
  { key: "pending", label: "Pending", icon: Clock, count: 2 },
  { key: "rejected", label: "Rejected", icon: AlertTriangle, count: 1 },
];

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const monthlyPerformance = [
  { month: "Jan", revenue: 580, sales: 95, views: 2400 },
  { month: "Feb", revenue: 720, sales: 112, views: 2800 },
  { month: "Mar", revenue: 890, sales: 134, views: 3200 },
  { month: "Apr", revenue: 1050, sales: 156, views: 3600 },
  { month: "May", revenue: 1280, sales: 178, views: 4100 },
  { month: "Jun", revenue: 1560, sales: 204, views: 4800 },
];

const categoryPieData = [
  { name: "Personal Finance", value: 45, color: "#8A6A4A" },
  { name: "Business", value: 25, color: "#D8B27A" },
  { name: "Self Help", value: 18, color: "#1D1D1D" },
  { name: "Technology", value: 12, color: "#5C4033" },
];

const readerEngagementData = [
  { month: "Jan", engagement: 320 },
  { month: "Feb", engagement: 380 },
  { month: "Mar", engagement: 450 },
  { month: "Apr", engagement: 520 },
  { month: "May", engagement: 610 },
  { month: "Jun", engagement: 720 },
];

const topBooksTableData = [
  { title: "Wealth Is A Decision", views: 1840, revenue: 2640, conversion: 8.2 },
  { title: "The Art of Negotiation", views: 1520, revenue: 1980, conversion: 7.8 },
  { title: "Building Your Empire", views: 1280, revenue: 1640, conversion: 7.5 },
  { title: "Money Mindset Mastery", views: 980, revenue: 1120, conversion: 7.1 },
  { title: "Financial Freedom Blueprint", views: 840, revenue: 920, conversion: 6.8 },
];

const publishHistory = [
  { step: "Draft Created", date: "Jan 15, 2025", done: true },
  { step: "First Review", date: "Jan 22, 2025", done: true },
  { step: "Edits Complete", date: "Feb 3, 2025", done: true },
  { step: "Final Review", date: "Feb 10, 2025", done: true },
  { step: "Published", date: "Feb 15, 2025", done: true },
];

const initialBooks = [
  { id: "1", title: "Wealth Is A Decision", isbn: "978-1-234567-00-1", category: "Personal Finance", status: "published" as const, views: 1840, sales: 220, revenue: 2640, rating: 4.8, createdDate: "Jan 15, 2025", updatedDate: "Jun 10, 2026", description: "A comprehensive guide to making smart financial decisions.", performance: "excellent" as const },
  { id: "2", title: "The Art of Negotiation", isbn: "978-1-234567-00-2", category: "Business", status: "published" as const, views: 1520, sales: 180, revenue: 1980, rating: 4.6, createdDate: "Feb 8, 2025", updatedDate: "Jun 5, 2026", description: "Master the art of negotiation in business and life.", performance: "excellent" as const },
  { id: "3", title: "Building Your Empire", isbn: "978-1-234567-00-3", category: "Business", status: "published" as const, views: 1280, sales: 150, revenue: 1640, rating: 4.5, createdDate: "Mar 1, 2025", updatedDate: "May 28, 2026", description: "Build a lasting business empire from the ground up.", performance: "excellent" as const },
  { id: "4", title: "Money Mindset Mastery", isbn: "978-1-234567-00-4", category: "Self Help", status: "published" as const, views: 980, sales: 120, revenue: 1120, rating: 4.4, createdDate: "Mar 20, 2025", updatedDate: "May 22, 2026", description: "Transform your relationship with money.", performance: "good" as const },
  { id: "5", title: "Financial Freedom Blueprint", isbn: "978-1-234567-00-5", category: "Personal Finance", status: "published" as const, views: 840, sales: 95, revenue: 920, rating: 4.3, createdDate: "Apr 5, 2025", updatedDate: "May 18, 2026", description: "Your step-by-step guide to financial independence.", performance: "good" as const },
  { id: "6", title: "Leadership in the Digital Age", isbn: "978-1-234567-00-6", category: "Business", status: "published" as const, views: 720, sales: 82, revenue: 780, rating: 4.2, createdDate: "Apr 18, 2025", updatedDate: "May 12, 2026", description: "Leading teams and organizations in a digital world.", performance: "good" as const },
  { id: "7", title: "The Entrepreneur's Playbook", isbn: "978-1-234567-00-7", category: "Business", status: "published" as const, views: 680, sales: 76, revenue: 680, rating: 4.1, createdDate: "May 2, 2025", updatedDate: "May 8, 2026", description: "Essential strategies for startup founders.", performance: "good" as const },
  { id: "8", title: "Investing for Beginners", isbn: "978-1-234567-00-8", category: "Personal Finance", status: "published" as const, views: 620, sales: 68, revenue: 580, rating: 4.0, createdDate: "May 15, 2025", updatedDate: "May 5, 2026", description: "Start your investing journey with confidence.", performance: "good" as const },
  { id: "9", title: "The Productivity System", isbn: "978-1-234567-00-9", category: "Self Help", status: "published" as const, views: 540, sales: 58, revenue: 480, rating: 3.9, createdDate: "Jun 1, 2025", updatedDate: "May 1, 2026", description: "A proven system for 10x your productivity.", performance: "average" as const },
  { id: "10", title: "Digital Marketing Mastery", isbn: "978-1-234567-01-0", category: "Technology", status: "published" as const, views: 480, sales: 52, revenue: 420, rating: 3.8, createdDate: "Jun 15, 2025", updatedDate: "Apr 28, 2026", description: "Master digital marketing channels and strategies.", performance: "average" as const },
  { id: "11", title: "Real Estate Investing 101", isbn: "978-1-234567-01-1", category: "Personal Finance", status: "published" as const, views: 420, sales: 45, revenue: 360, rating: 3.7, createdDate: "Jul 1, 2025", updatedDate: "Apr 22, 2026", description: "Get started in real estate investing.", performance: "average" as const },
  { id: "12", title: "The Side Hustle Bible", isbn: "978-1-234567-01-2", category: "Business", status: "published" as const, views: 380, sales: 40, revenue: 300, rating: 3.6, createdDate: "Jul 15, 2025", updatedDate: "Apr 18, 2026", description: "50+ side hustle ideas to boost your income.", performance: "average" as const },
  { id: "13", title: "Tax Strategies for Authors", isbn: "978-1-234567-01-3", category: "Personal Finance", status: "draft" as const, views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Aug 1, 2025", updatedDate: "Apr 15, 2026", description: "Minimize your tax burden as a published author.", performance: "new" as const },
  { id: "14", title: "The Writing Habit", isbn: "978-1-234567-01-4", category: "Self Help", status: "draft" as const, views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Aug 15, 2025", updatedDate: "Apr 10, 2026", description: "Build a consistent writing habit that sticks.", performance: "new" as const },
  { id: "15", title: "Passive Income Streams", isbn: "978-1-234567-01-5", category: "Personal Finance", status: "draft" as const, views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Sep 1, 2025", updatedDate: "Apr 5, 2026", description: "Create multiple streams of passive income.", performance: "new" as const },
  { id: "16", title: "AI for Entrepreneurs", isbn: "978-1-234567-01-6", category: "Technology", status: "pending" as const, views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Sep 15, 2025", updatedDate: "Mar 28, 2026", description: "Leverage AI to grow your business.", performance: "new" as const },
  { id: "17", title: "The Remote Work Revolution", isbn: "978-1-234567-01-7", category: "Business", status: "pending" as const, views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Oct 1, 2025", updatedDate: "Mar 22, 2026", description: "Thriving in the new world of remote work.", performance: "new" as const },
  { id: "18", title: "Crypto & Blockchain Explained", isbn: "978-1-234567-01-8", category: "Technology", status: "rejected" as const, views: 0, sales: 0, revenue: 0, rating: 0, createdDate: "Oct 15, 2025", updatedDate: "Mar 15, 2026", description: "A beginner's guide to cryptocurrency.", performance: "new" as const },
];

const recentActivity = [
  { id: 1, icon: Eye, bg: "bg-blue-100", color: "text-blue-600", text: "\"Wealth Is A Decision\" reached 1,840 views", time: "2 hours ago" },
  { id: 2, icon: ShoppingCart, bg: "bg-emerald-100", color: "text-emerald-600", text: "12 new sales on \"The Art of Negotiation\"", time: "5 hours ago" },
  { id: 3, icon: Star, bg: "bg-amber-100", color: "text-amber-600", text: "New 5-star review on \"Building Your Empire\"", time: "1 day ago" },
];

export default function AuthorAllBooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [drawerBook, setDrawerBook] = useState<any>(null);
  const [deleteBook, setDeleteBook] = useState<any>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [books, setBooks] = useState(initialBooks);
  const [showFilters, setShowFilters] = useState(true);
  const [pageCounter, setPageCounter] = useState(20);
  const [showPageCounter, setShowPageCounter] = useState(false);

  const publishedCount = useMemo(() => books.filter(b => b.status === "published").length, [books]);
  const draftsCount = useMemo(() => books.filter(b => b.status === "draft").length, [books]);
  const pendingCount = useMemo(() => books.filter(b => b.status === "pending").length, [books]);
  const rejectedCount = useMemo(() => books.filter(b => b.status === "rejected").length, [books]);
  const totalViews = useMemo(() => books.reduce((s, b) => s + b.views, 0), [books]);
  const totalRevenue = useMemo(() => books.reduce((s, b) => s + b.revenue, 0), [books]);
  const totalSales = useMemo(() => books.reduce((s, b) => s + b.sales, 0), [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];
    if (activeCategory !== "all") result = result.filter(b => b.status === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => b.title.toLowerCase().includes(q) || b.isbn.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "title": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "revenue": result.sort((a, b) => b.revenue - a.revenue); break;
      case "views": result.sort((a, b) => b.views - a.views); break;
      case "created": result.sort((a, b) => b.createdDate.localeCompare(a.createdDate)); break;
      case "updated": default: result.sort((a, b) => b.updatedDate.localeCompare(a.updatedDate)); break;
    }
    return result;
  }, [books, activeCategory, searchQuery, sortBy]);

  const displayedBooks = useMemo(() => {
    if (pageCounter === 999) return filteredBooks;
    return filteredBooks.slice(0, pageCounter);
  }, [filteredBooks, pageCounter]);

  const toggleSelectAll = useCallback(() => {
    if (selectedBooks.size === displayedBooks.length) setSelectedBooks(new Set());
    else setSelectedBooks(new Set(displayedBooks.map(b => b.id)));
  }, [selectedBooks, displayedBooks]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedBooks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleArchive = useCallback((book: any) => {
    setBooks(prev => prev.filter(b => b.id !== book.id));
    setUndoStack(prev => [...prev, { type: "archive", book }]);
    setToastMessage(`"${book.title}" archived`);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const handleDelete = useCallback((book: any) => {
    setBooks(prev => prev.filter(b => b.id !== book.id));
    setDeleteBook(null);
    setUndoStack(prev => [...prev, { type: "delete", book }]);
    setToastMessage(`"${book.title}" deleted`);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setBooks(prev => [...prev, last.book]);
    setUndoStack(prev => prev.slice(0, -1));
    setToastMessage("Action undone");
    setTimeout(() => setToastMessage(null), 3000);
  }, [undoStack]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* 1. Header with Action Buttons */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D1D1D]">All Books</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your complete book collection</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="refresh-btn-border rounded-lg border-[#E8DDD0]" onClick={() => {}}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg" asChild>
            <Link href="/author/books/new"><Plus className="h-4 w-4 mr-2" /> Create New Book</Link>
          </Button>
        </div>
      </motion.div>

      {/* 2. Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "TOTAL BOOKS", value: books.length, icon: BookOpen, bg: "bg-[#F5EDE3]", color: "text-[#8A6A4A]" },
          { label: "PUBLISHED", value: publishedCount, icon: CheckCircle2, bg: "bg-emerald-100", color: "text-emerald-600" },
          { label: "DRAFTS", value: draftsCount, icon: FileText, bg: "bg-amber-100", color: "text-amber-600" },
          { label: "TOTAL VIEWS", value: totalViews.toLocaleString(), icon: Eye, bg: "bg-blue-100", color: "text-blue-600" },
          { label: "TOTAL SALES", value: totalSales.toLocaleString(), icon: ShoppingCart, bg: "bg-violet-100", color: "text-violet-600" },
          { label: "TOTAL REVENUE", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, bg: "bg-emerald-100", color: "text-emerald-600" },
        ].map((s) => (
          <motion.div key={s.label} whileHover={{ y: -2 }} className="bg-white rounded-xl border border-[#E8DDD0] p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-[#1D1D1D] mt-1">{s.value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 3. Analytics Center */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-[#E8DDD0]">
          <h3 className="font-semibold text-[#1D1D1D]">Analytics Center</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(!showAnalytics)} className="text-muted-foreground hover:text-[#1D1D1D]">
            {showAnalytics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Monthly Performance Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Monthly Performance</h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={monthlyPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8DDD0", background: "white" }} />
                        <Area type="monotone" dataKey="revenue" stroke="#8A6A4A" fill="#D8B27A" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Revenue Trend</h4>
                    <div className="space-y-2">
                      {monthlyPerformance.map((m) => (
                        <div key={m.month} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-muted-foreground w-8">{m.month}</span>
                          <div className="flex-1 h-2 bg-[#E8DDD0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#8A6A4A] rounded-full" style={{ width: `${(m.revenue / 1600) * 100}%` }} />
                          </div>
                          <span className="text-xs font-medium text-[#1D1D1D] w-16 text-right">${m.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Revenue Insights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                    <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">THIS MONTH</p>
                    <p className="text-xl font-bold text-[#1D1D1D] mt-1">$1,560</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">+30%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                    <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">LAST MONTH</p>
                    <p className="text-xl font-bold text-[#1D1D1D] mt-1">$1,200</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">+18%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                    <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">BEST SELLER</p>
                    <p className="text-sm font-bold text-[#1D1D1D] mt-1">Wealth Is A Decision</p>
                    <p className="text-xs text-muted-foreground mt-0.5">$2,640 total</p>
                  </div>
                  <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                    <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">TOP CATEGORY</p>
                    <p className="text-sm font-bold text-[#1D1D1D] mt-1">Personal Finance</p>
                    <p className="text-xs text-muted-foreground mt-0.5">71% of revenue</p>
                  </div>
                </div>
                {/* Reader Engagement */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
                        <p className="text-[10px] text-muted-foreground">{m.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Category Performance & Top Books */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Category Performance</h4>
                    <div className="flex items-center gap-6">
                      <ResponsiveContainer width={140} height={140}>
                        <PieChart>
                          <Pie data={categoryPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                            {categoryPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 flex-1">
                        {categoryPieData.map((c) => (
                          <div key={c.name} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                            <span className="text-xs text-muted-foreground flex-1">{c.name}</span>
                            <span className="text-xs font-medium text-[#1D1D1D]">{c.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Top Books by Revenue</h4>
                    <div className="space-y-2">
                      {topBooksTableData.map((b, i) => (
                        <div key={b.title} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-[#E8DDD0]/50">
                          <span className="text-xs font-bold text-[#8A6A4A] w-5">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#1D1D1D] truncate">{b.title}</p>
                            <p className="text-[10px] text-muted-foreground">{b.views.toLocaleString()} views</p>
                          </div>
                          <span className="text-xs font-bold text-[#1D1D1D]">${b.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 4. Search & Filter Module */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, ISBN, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 search-bar-border rounded-lg border-[#E8DDD0] text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="refresh-btn-border rounded-lg border-[#E8DDD0]" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-1.5" /> Filters
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="refresh-btn-border rounded-lg border-[#E8DDD0]">
                  <ArrowUpDown className="h-4 w-4 mr-1.5" /> Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg">
                <DropdownMenuItem onClick={() => setSortBy("updated")} className="text-sm">{sortBy === "updated" && <Check className="h-4 w-4 mr-2" />} Last Updated</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("created")} className="text-sm">{sortBy === "created" && <Check className="h-4 w-4 mr-2" />} Date Created</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")} className="text-sm">{sortBy === "title" && <Check className="h-4 w-4 mr-2" />} Title A-Z</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("revenue")} className="text-sm">{sortBy === "revenue" && <Check className="h-4 w-4 mr-2" />} Revenue</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("views")} className="text-sm">{sortBy === "views" && <Check className="h-4 w-4 mr-2" />} Views</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              <Button variant="outline" size="sm" className="refresh-btn-border rounded-lg border-[#E8DDD0]" onClick={() => setShowPageCounter(!showPageCounter)}>
                Show: {pageCounter === 999 ? "All" : pageCounter}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <AnimatePresence>
                {showPageCounter && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-full mt-1 bg-white border border-[#E8DDD0] rounded-xl shadow-lg z-30 py-1 min-w-[100px]"
                  >
                    {[10, 20, 50, 100, 999].map((n) => (
                      <button
                        key={n}
                        onClick={() => { setPageCounter(n); setShowPageCounter(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5EDE3] transition-colors ${pageCounter === n ? "font-medium text-[#8A6A4A] bg-[#F5EDE3]/50" : "text-[#1D1D1D]"}`}
                      >
                        {n === 999 ? "All" : n}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === tab.key
                    ? "bg-[#D8B27A] text-[#1D1D1D]"
                    : "bg-[#F5EDE3] text-muted-foreground hover:bg-[#E8DDD0]"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                <span className="ml-0.5 opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* 5. Book Status Categories (Compact Pills) */}
      <motion.div variants={item} className="flex items-center gap-2 overflow-x-auto pb-1">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === tab.key
                ? "bg-[#D8B27A] text-[#1D1D1D] shadow-sm"
                : "bg-white border border-[#E8DDD0] text-muted-foreground hover:bg-[#F5EDE3]"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeCategory === tab.key ? "bg-[#1D1D1D] text-white" : "bg-[#F5EDE3] text-muted-foreground"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* 6. Book Table */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm overflow-hidden">
        {displayedBooks.length === 0 ? (
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
                      checked={selectedBooks.size === displayedBooks.length && displayedBooks.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-[#E8DDD0]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">COVER</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">TITLE</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">ISBN</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">CATEGORY</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">STATUS</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">VIEWS</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">SALES</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">REVENUE</th>
                  <th className="px-4 py-3 text-center text-[10px] font-semibold text-muted-foreground tracking-wider">RATING</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">CREATED</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">UPDATED</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {displayedBooks.map((book, idx) => {
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

      {/* 7. Pagination Summary */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Showing {displayedBooks.length} of {filteredBooks.length} books</span>
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

      {/* 8. Recent Activity (Compact) */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-[#E8DDD0]">
          <h3 className="font-semibold text-[#1D1D1D]">Recent Activity</h3>
          <Button variant="ghost" size="sm" className="text-[#8A6A4A] hover:text-[#6B5538] text-xs">
            View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
        <div className="divide-y divide-[#E8DDD0]/50">
          {recentActivity.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-4 hover:bg-[#F5EDE3]/30 transition-colors">
              <div className={`p-2 rounded-lg ${a.bg} shrink-0`}>
                <a.icon className={`h-4 w-4 ${a.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1D1D1D] truncate">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Book Details Drawer */}
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
                    <span className={`text-sm font-medium ${statusConfig[drawerBook.status as keyof typeof statusConfig].color}`}>{statusConfig[drawerBook.status as keyof typeof statusConfig].label}</span>
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
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${performanceConfig[drawerBook.performance as keyof typeof performanceConfig]?.bg} ${performanceConfig[drawerBook.performance as keyof typeof performanceConfig]?.color}`}>
                      {performanceConfig[drawerBook.performance as keyof typeof performanceConfig]?.label}
                    </span>
                  </div>
                </div>
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

      {/* Bulk Action Bar */}
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
                <Button size="sm" className="rounded-lg bg-red-500 text-white hover:bg-red-600">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Undo Toast */}
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

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
