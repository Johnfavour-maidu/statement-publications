"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Eye,
  ShoppingCart,
  Star,
  Users,
  Download,
  Calendar,
  BookOpen,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Clock,
  MessageSquare,
  FileText,
  Bookmark,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const monthlyRevenue = [
  { month: "Jan", revenue: 420, sales: 28 },
  { month: "Feb", revenue: 560, sales: 35 },
  { month: "Mar", revenue: 780, sales: 48 },
  { month: "Apr", revenue: 940, sales: 56 },
  { month: "May", revenue: 1200, sales: 72 },
  { month: "Jun", revenue: 1560, sales: 89 },
];

const readerGrowth = [
  { month: "Jan", readers: 1200 },
  { month: "Feb", readers: 1450 },
  { month: "Mar", readers: 1780 },
  { month: "Apr", readers: 2100 },
  { month: "May", readers: 2580 },
  { month: "Jun", readers: 3120 },
];

const viewsData = [
  { month: "Jan", views: 4200 },
  { month: "Feb", views: 5100 },
  { month: "Mar", views: 6800 },
  { month: "Apr", views: 8200 },
  { month: "May", views: 10400 },
  { month: "Jun", views: 12800 },
];

const categoryPerformance = [
  { name: "Personal Finance", value: 42, color: "#8A6A4A" },
  { name: "Self-Help", value: 28, color: "#D8B27A" },
  { name: "Business", value: 18, color: "#F2D8BE" },
  { name: "Writing", value: 12, color: "#E8DDD0" },
];

const allBooks = [
  { id: "1", title: "Financial Freedom", sales: 342, revenue: 2640, rating: 4.8, views: 12450, category: "Personal Finance", month: "Jun" },
  { id: "2", title: "Income Is A Skill", sales: 268, revenue: 2180, rating: 4.7, views: 9820, category: "Self-Help", month: "Jun" },
  { id: "3", title: "Money Mindset", sales: 195, revenue: 1420, rating: 4.6, views: 8340, category: "Personal Finance", month: "May" },
  { id: "4", title: "The Wealth Blueprint", sales: 148, revenue: 980, rating: 4.5, views: 6890, category: "Business", month: "May" },
  { id: "5", title: "Master Your Spending", sales: 112, revenue: 640, rating: 4.4, views: 5420, category: "Personal Finance", month: "Apr" },
  { id: "6", title: "Negotiation Mastery", sales: 98, revenue: 520, rating: 4.3, views: 4200, category: "Business", month: "Apr" },
  { id: "7", title: "Building Your Empire", sales: 85, revenue: 440, rating: 4.2, views: 3600, category: "Business", month: "Mar" },
  { id: "8", title: "The Productivity System", sales: 72, revenue: 380, rating: 4.1, views: 2900, category: "Self-Help", month: "Mar" },
  { id: "9", title: "Digital Marketing 101", sales: 64, revenue: 320, rating: 4.0, views: 2400, category: "Writing", month: "Feb" },
  { id: "10", title: "Real Estate Basics", sales: 56, revenue: 280, rating: 3.9, views: 2100, category: "Personal Finance", month: "Feb" },
  { id: "11", title: "Side Hustle Bible", sales: 48, revenue: 240, rating: 3.8, views: 1800, category: "Business", month: "Jan" },
  { id: "12", title: "Tax Strategies", sales: 42, revenue: 220, rating: 3.7, views: 1500, category: "Personal Finance", month: "Jan" },
];

const royaltyPayments = [
  { month: "Jun 2026", amount: 480, status: "processing" },
  { month: "May 2026", amount: 420, status: "paid" },
  { month: "Apr 2026", amount: 385, status: "paid" },
  { month: "Mar 2026", amount: 512, status: "paid" },
  { month: "Feb 2026", amount: 301, status: "paid" },
  { month: "Jan 2026", amount: 278, status: "paid" },
];

const timeRanges = [
  { key: "7d", label: "Last 7 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "90d", label: "Last 90 Days" },
  { key: "6m", label: "Last 6 Months" },
  { key: "1y", label: "Last 12 Months" },
  { key: "all", label: "All Time" },
];

export default function AuthorEarningsPage() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [timeRange, setTimeRange] = useState("6m");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const timeRangeLabel = useMemo(() => timeRanges.find((r) => r.key === timeRange)?.label || "All Time", [timeRange]);

  const filteredBooks = useMemo(() => {
    let result = [...allBooks];
    switch (timeRange) {
      case "7d": result = result.filter((b) => b.month === "Jun"); break;
      case "30d": result = result.filter((b) => ["Jun", "May"].includes(b.month)); break;
      case "90d": result = result.filter((b) => ["Jun", "May", "Apr"].includes(b.month)); break;
      case "6m": break;
      case "1y": break;
      case "all": break;
    }
    return result;
  }, [timeRange]);

  const totalRevenue = useMemo(() => filteredBooks.reduce((sum, b) => sum + b.revenue, 0), [filteredBooks]);
  const totalSales = useMemo(() => filteredBooks.reduce((sum, b) => sum + b.sales, 0), [filteredBooks]);
  const totalViews = useMemo(() => filteredBooks.reduce((sum, b) => sum + b.views, 0), [filteredBooks]);
  const avgRating = useMemo(() => filteredBooks.length > 0 ? (filteredBooks.reduce((sum, b) => sum + b.rating, 0) / filteredBooks.length).toFixed(1) : "0", [filteredBooks]);

  const totalPages = Math.ceil(filteredBooks.length / perPage);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredBooks.slice(start, start + perPage);
  }, [filteredBooks, currentPage]);

  const handleExport = () => {
    const headers = ["Title", "Category", "Sales", "Revenue", "Views", "Rating"];
    const rows = filteredBooks.map((b) => [b.title, b.category, b.sales, b.revenue, b.views, b.rating]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings-report-${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D1D1D]">Earnings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track your book performance, revenue, and reader engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="refresh-btn-border rounded-lg p-[2px]">
            <Button variant="outline" size="sm" className="rounded-[calc(0.5rem-2px)] bg-white hover:bg-[#F5EDE3] border-0 text-[#8A6A4A]" onClick={() => setShowAnalytics(!showAnalytics)}>
              <BarChart3 className="h-4 w-4 mr-1.5" />{showAnalytics ? "Hide Analytics" : "View Analytics"}
            </Button>
          </div>
          <div className="refresh-btn-border rounded-lg p-[2px]">
            <Button variant="outline" size="sm" className="rounded-[calc(0.5rem-2px)] bg-white hover:bg-[#F5EDE3] border-0 text-[#8A6A4A]" onClick={() => { setTimeRange("6m"); setCurrentPage(1); }}>
              <RefreshCw className="h-4 w-4 mr-1.5" />Refresh
            </Button>
          </div>
          <div className="refresh-btn-border rounded-lg p-[2px]">
            <Button variant="outline" size="sm" className="rounded-[calc(0.5rem-2px)] bg-white hover:bg-[#F5EDE3] border-0 text-[#8A6A4A]" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1.5" />Export Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 2. Summary Cards (Clickable) */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: "revenue", label: "TOTAL REVENUE", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, bg: "bg-[#F5EDE3]", color: "text-[#8A6A4A]" },
          { key: "sales", label: "TOTAL SALES", value: totalSales.toLocaleString(), icon: ShoppingCart, bg: "bg-blue-100", color: "text-blue-600" },
          { key: "views", label: "TOTAL VIEWS", value: totalViews.toLocaleString(), icon: Eye, bg: "bg-violet-100", color: "text-violet-600" },
          { key: "rating", label: "AVG RATING", value: avgRating, icon: Star, bg: "bg-amber-100", color: "text-amber-600" },
          { key: "readers", label: "READERS", value: "3,120", icon: Users, bg: "bg-pink-100", color: "text-pink-600" },
          { key: "royalties", label: "ROYALTIES", value: "$2,376", icon: TrendingUp, bg: "bg-emerald-100", color: "text-emerald-600" },
        ].map((s) => (
          <motion.div
            key={s.key}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 flex items-center justify-between border border-[#E8DDD0] hover:shadow-md transition-all"
          >
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

      {/* 3. Analytics (toggled by View Analytics button) */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm p-4 space-y-4">
              <h3 className="font-semibold text-[#1D1D1D]">Earnings Analytics Center</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Monthly Revenue</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={monthlyRevenue}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D8B27A" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#D8B27A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8DDD0", background: "white" }} formatter={(value) => [`$${value}`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#8A6A4A" fill="url(#revGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Sales Trend</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8DDD0", background: "white" }} />
                      <Bar dataKey="sales" fill="#D8B27A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
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
                    <ArrowUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600 font-medium">+28%</span>
                  </div>
                </div>
                <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                  <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">BEST SELLER</p>
                  <p className="text-sm font-bold text-[#1D1D1D] mt-1">Financial Freedom</p>
                  <p className="text-xs text-muted-foreground mt-0.5">$2,640 total</p>
                </div>
                <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                  <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">TOP CATEGORY</p>
                  <p className="text-sm font-bold text-[#1D1D1D] mt-1">Personal Finance</p>
                  <p className="text-xs text-muted-foreground mt-0.5">42% of revenue</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Total Readers", value: "3,120", icon: Users, bg: "bg-blue-100", color: "text-blue-600" },
                  { label: "Avg Rating", value: "4.7", icon: Star, bg: "bg-amber-100", color: "text-amber-600" },
                  { label: "Comments", value: "284", icon: MessageSquare, bg: "bg-emerald-100", color: "text-emerald-600" },
                  { label: "Downloads", value: "1,890", icon: Download, bg: "bg-violet-100", color: "text-violet-600" },
                  { label: "Bookmarks", value: "1,240", icon: Bookmark, bg: "bg-pink-100", color: "text-pink-600" },
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Views Analytics</h4>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8DDD0", background: "white" }} />
                      <Line type="monotone" dataKey="views" stroke="#8A6A4A" strokeWidth={2} dot={{ fill: "#D8B27A", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Reader Growth</h4>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={readerGrowth}>
                      <defs>
                        <linearGradient id="readerGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8A6A4A" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8A6A4A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8DDD0", background: "white" }} />
                      <Area type="monotone" dataKey="readers" stroke="#8A6A4A" fill="url(#readerGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Category Performance</h4>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie data={categoryPerformance} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                          {categoryPerformance.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 flex-1">
                      {categoryPerformance.map((c) => (
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
                  <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Royalty Payments</h4>
                  <div className="space-y-2">
                    {royaltyPayments.slice(0, 5).map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#E8DDD0]/50">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${p.status === "paid" ? "bg-emerald-100" : "bg-amber-100"}`}>
                            <DollarSign className={`h-3 w-3 ${p.status === "paid" ? "text-emerald-600" : "text-amber-600"}`} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-[#1D1D1D]">{p.month}</p>
                            <p className="text-[10px] text-muted-foreground">{p.status === "paid" ? "Paid" : "Processing"}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#1D1D1D]">${p.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Top Performing Books with Time Range */}
      <motion.div variants={item}>
        <div className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#E8DDD0]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#D8B27A]/10 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-[#8A6A4A]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1D1D1D]">Book Activity</h3>
                <p className="text-xs text-muted-foreground">Performance across your books</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-[calc(0.5rem-2px)] bg-white hover:bg-[#F5EDE3] border-0 text-sm">
                      <Calendar className="h-4 w-4 mr-1.5" /> {timeRangeLabel}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg">
                    {timeRanges.map((r) => (
                      <DropdownMenuItem key={r.key} onClick={() => { setTimeRange(r.key); setCurrentPage(1); }} className="text-sm">
                        {timeRange === r.key && <span className="h-4 w-4 mr-2 flex items-center"><span className="block w-1.5 h-1.5 rounded-full bg-[#8A6A4A]" /></span>}
                        {r.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8DDD0] bg-[#F5EDE3]/30">
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">BOOK</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">CATEGORY</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">SALES</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">REVENUE</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">VIEWS</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">RATING</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBooks.map((book, i) => (
                  <tr key={book.id} className="border-b border-[#E8DDD0]/50 hover:bg-[#F5EDE3]/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-[#8A6A4A]">{(currentPage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-9 rounded-md bg-gradient-to-br from-[#8A6A4A] to-[#D8B27A] flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white/70" />
                        </div>
                        <p className="font-medium text-sm text-[#1D1D1D]">{book.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{book.category}</td>
                    <td className="px-4 py-3 text-sm text-right text-muted-foreground">{book.sales.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-[#1D1D1D]">${book.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-muted-foreground">{book.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-[#1D1D1D]">{book.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[#E8DDD0]">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredBooks.length)} of {filteredBooks.length} books
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-lg border-[#E8DDD0]" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                    currentPage === page
                      ? "text-[#8A6A4A] bg-[#F5EDE3]"
                      : "text-muted-foreground hover:bg-[#F5EDE3]/50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <Button variant="outline" size="icon" className="rounded-lg border-[#E8DDD0]" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
