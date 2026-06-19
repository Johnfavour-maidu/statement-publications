"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users, UserCheck, BookOpen, ShoppingCart, DollarSign, Clock,
  TrendingUp, TrendingDown, ArrowUpRight, RefreshCw, FileText,
  CheckCircle2, XCircle, Eye, AlertCircle, Bell, PenTool, Upload,
  Send, Wallet, BadgeCheck, HeadphonesIcon, X, Download, ChevronDown, Zap,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DashboardData {
  kpi: {
    totalAuthors: number; verifiedAuthors: number; publishedBooks: number;
    pendingReview: number; activeServiceOrders: number; monthlyRevenue: number;
    pendingPayouts: number; supportRequests: number;
    kpiTrends: Record<string, { change: number; period: string }>;
  };
  charts: { revenueTrend: { month: string; amount: number }[]; userGrowth: { month: string; total: number }[] };
  recentActivity: { id: string; type: string; message: string; timestamp: string }[];
  pendingReviews: { id: string; title: string; author: { name: string; image: string | null }; submittedAt: string; category: string; format: string }[];
  recentOrders: { id: string; orderNumber: string; customer: { name: string; email: string }; package: string; amount: number; status: string; createdAt: string }[];
  contentOverview: { totalPosts: number; publishedPosts: number; drafts: number; scheduled: number; totalTestimonials: number };
  financialOverview: { todayRevenue: number; thisMonth: number; lastMonth: number; yearToDate: number; averageOrderValue: number; pendingPayouts: number; completedPayouts: number };
  notifications: { id: string; type: string; title: string; message: string; timestamp: string }[];
  todaySnapshot?: { newAuthors: number; booksPublished: number; booksApproved: number; serviceOrders: number; supportRequests: number; revenueToday: number };
}

const BRAND = { brown: "#8A6A4A", gold: "#D8B27A", beige: "#F2D8BE", charcoal: "#1D1D1D" };
const CC = { brown: "#8A6A4A", blue: "#3B82F6", emerald: "#10B981", rose: "#F43F5E", indigo: "#6366F1", teal: "#14B8A6", violet: "#8B5CF6", amber: "#F59E0B", gold: "#D8B27A" };
const PIE_COLORS = ["#8A6A4A", "#3B82F6", "#10B981", "#F43F5E", "#6366F1", "#14B8A6", "#8B5CF6", "#F59E0B", "#D8B27A", "#EC4899", "#06B6D4", "#84CC16"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

const quickActions = [
  { label: "Review Books", href: "/admin/books", icon: BookOpen, color: "bg-blue-50 text-blue-600" },
  { label: "Create Blog Post", href: "/admin/blog", icon: PenTool, color: "bg-purple-50 text-purple-600" },
  { label: "Manage Authors", href: "/admin/users", icon: Users, color: "bg-emerald-50 text-emerald-600" },
  { label: "Approve Authors", href: "/admin/users", icon: BadgeCheck, color: "bg-amber-50 text-amber-600" },
  { label: "Service Orders", href: "/admin/orders", icon: ShoppingCart, color: "bg-rose-50 text-rose-600" },
  { label: "Send Announcement", href: "/admin/content", icon: Send, color: "bg-indigo-50 text-indigo-600" },
  { label: "Manage Payouts", href: "/admin/payouts", icon: Wallet, color: "bg-violet-50 text-violet-600" },
  { label: "Upload Media", href: "/admin/media", icon: Upload, color: "bg-teal-50 text-teal-600" },
];

const activityIcons: Record<string, typeof BookOpen> = { book_published: BookOpen, new_author: UserCheck, order_completed: CheckCircle2, royalty_paid: DollarSign, book_submitted: FileText, ticket_opened: HeadphonesIcon, verification_completed: BadgeCheck };
const activityColors: Record<string, string> = { book_published: "bg-emerald-100 text-emerald-600", new_author: "bg-blue-100 text-blue-600", order_completed: "bg-amber-100 text-amber-600", royalty_paid: "bg-violet-100 text-violet-600", book_submitted: "bg-rose-100 text-rose-600", ticket_opened: "bg-indigo-100 text-indigo-600", verification_completed: "bg-teal-100 text-teal-600" };

const sparklines = {
  revenue: [52, 54, 58, 61, 59, 63, 65, 68.5],
  authorGrowth: [120, 128, 135, 142, 148, 152, 156, 164, 170, 175, 179],
  books: [280, 295, 310, 325, 338, 345, 355, 365, 372, 380, 387],
  serviceOrders: [145, 152, 160, 168, 175, 180, 189, 195, 200, 208, 217],
  support: [38, 35, 32, 30, 28, 27, 26, 25],
  verification: [98, 105, 112, 118, 125, 130, 135, 142, 148, 155, 160, 164],
};

const chartData = {
  revenue: [
    { month: "Jan", revenue: 48 }, { month: "Feb", revenue: 52 }, { month: "Mar", revenue: 55 },
    { month: "Apr", revenue: 58 }, { month: "May", revenue: 61 }, { month: "Jun", revenue: 59 },
    { month: "Jul", revenue: 63 }, { month: "Aug", revenue: 65 }, { month: "Sep", revenue: 67 },
    { month: "Oct", revenue: 70 }, { month: "Nov", revenue: 72 }, { month: "Dec", revenue: 68.5 },
  ],
  authorGrowth: [
    { month: "Jan", total: 120, verified: 98 }, { month: "Feb", total: 128, verified: 105 },
    { month: "Mar", total: 135, verified: 112 }, { month: "Apr", total: 142, verified: 118 },
    { month: "May", total: 148, verified: 125 }, { month: "Jun", total: 152, verified: 130 },
    { month: "Jul", total: 156, verified: 135 }, { month: "Aug", total: 164, verified: 142 },
    { month: "Sep", total: 170, verified: 148 }, { month: "Oct", total: 175, verified: 155 },
    { month: "Nov", total: 179, verified: 160 }, { month: "Dec", total: 179, verified: 164 },
  ],
  books: [
    { month: "Jan", published: 280, pending: 12 }, { month: "Feb", published: 295, pending: 10 },
    { month: "Mar", published: 310, pending: 11 }, { month: "Apr", published: 325, pending: 8 },
    { month: "May", published: 338, pending: 9 }, { month: "Jun", published: 345, pending: 10 },
    { month: "Jul", published: 355, pending: 7 }, { month: "Aug", published: 365, pending: 9 },
    { month: "Sep", published: 372, pending: 8 }, { month: "Oct", published: 380, pending: 10 },
    { month: "Nov", published: 384, pending: 9 }, { month: "Dec", published: 387, pending: 9 },
  ],
  serviceOrders: [
    { month: "Jan", completed: 120, pending: 25 }, { month: "Feb", completed: 130, pending: 22 },
    { month: "Mar", completed: 138, pending: 22 }, { month: "Apr", completed: 145, pending: 23 },
    { month: "May", completed: 152, pending: 23 }, { month: "Jun", completed: 158, pending: 22 },
    { month: "Jul", completed: 165, pending: 24 }, { month: "Aug", completed: 170, pending: 25 },
    { month: "Sep", completed: 178, pending: 22 }, { month: "Oct", completed: 185, pending: 23 },
    { month: "Nov", completed: 190, pending: 23 }, { month: "Dec", completed: 195, pending: 22 },
  ],
  supportCategories: [
    { name: "Publishing Support", count: 8 }, { name: "Service Orders", count: 6 },
    { name: "Royalties & Payments", count: 4 }, { name: "Account Issues", count: 3 },
    { name: "Technical Support", count: 2 }, { name: "General Enquiries", count: 2 },
  ],
  supportStatus: [
    { name: "Open", value: 25 }, { name: "In Progress", value: 12 },
    { name: "Resolved", value: 156 }, { name: "Closed", value: 89 },
  ],
  verification: [
    { month: "Jan", verified: 98, unverified: 22 }, { month: "Feb", verified: 105, unverified: 23 },
    { month: "Mar", verified: 112, unverified: 23 }, { month: "Apr", verified: 118, unverified: 24 },
    { month: "May", verified: 125, unverified: 23 }, { month: "Jun", verified: 130, unverified: 22 },
    { month: "Jul", verified: 135, unverified: 21 }, { month: "Aug", verified: 142, unverified: 22 },
    { month: "Sep", verified: 148, unverified: 22 }, { month: "Oct", verified: 155, unverified: 20 },
    { month: "Nov", verified: 160, unverified: 19 }, { month: "Dec", verified: 164, unverified: 15 },
  ],
  revenueByService: [
    { name: "Editing", revenue: 18.5, orders: 62 }, { name: "Cover Design", revenue: 14.2, orders: 48 },
    { name: "Formatting", revenue: 10.8, orders: 38 }, { name: "Marketing", revenue: 9.5, orders: 28 },
    { name: "ISBN Registration", revenue: 7.2, orders: 22 }, { name: "Publishing Packages", revenue: 8.3, orders: 19 },
  ],
  booksByCategory: [
    { name: "Business & Entrepreneurship", count: 52 }, { name: "Self Development", count: 45 },
    { name: "Personal Finance", count: 38 }, { name: "Leadership", count: 35 },
    { name: "Technology", count: 30 }, { name: "Health & Wellness", count: 28 },
    { name: "Religion & Inspiration", count: 26 }, { name: "Biography", count: 22 },
    { name: "Romance", count: 20 }, { name: "Mystery & Thriller", count: 18 },
    { name: "Education", count: 15 }, { name: "Other", count: 58 },
  ],
  topAuthors: [
    { name: "Adebayo O.", books: 18, revenue: 4.2 }, { name: "Chinwe E.", books: 15, revenue: 3.8 },
    { name: "Emeka N.", books: 14, revenue: 3.5 }, { name: "Maryam B.", books: 13, revenue: 3.2 },
    { name: "Sade W.", books: 12, revenue: 2.9 }, { name: "Ifeanyi C.", books: 11, revenue: 2.7 },
    { name: "Rotimi A.", books: 11, revenue: 2.6 }, { name: "Felix O.", books: 10, revenue: 2.4 },
    { name: "Lukman I.", books: 10, revenue: 2.3 }, { name: "Victoria N.", books: 10, revenue: 2.2 },
  ],
};

type ModuleKey = "revenue" | "authorGrowth" | "books" | "serviceOrders" | "support" | "verification" | "revenueByService" | "booksByCategory" | "topAuthors";

const analyticsModules: { key: ModuleKey; title: string; description: string; icon: typeof DollarSign; value: string; growth: number; growthLabel: string; color: string; sparklineKey: keyof typeof sparklines; chartTypes: string[] }[] = [
  { key: "revenue", title: "Revenue Analytics", description: "Monthly revenue trends and forecasts", icon: DollarSign, value: "₦685M", growth: 11.9, growthLabel: "vs last month", color: CC.brown, sparklineKey: "revenue", chartTypes: ["line", "area", "bar"] },
  { key: "authorGrowth", title: "Author Growth", description: "New author registrations and verification", icon: Users, value: "179", growth: 14.7, growthLabel: "vs last month", color: CC.blue, sparklineKey: "authorGrowth", chartTypes: ["line", "area", "bar"] },
  { key: "books", title: "Books Analytics", description: "Published books and pending reviews", icon: BookOpen, value: "387", growth: 13.2, growthLabel: "vs last month", color: CC.emerald, sparklineKey: "books", chartTypes: ["line", "area", "bar"] },
  { key: "serviceOrders", title: "Service Orders", description: "Publishing service order trends", icon: ShoppingCart, value: "217", growth: 14.8, growthLabel: "vs last month", color: CC.rose, sparklineKey: "serviceOrders", chartTypes: ["bar", "pie", "line"] },
  { key: "support", title: "Support Analytics", description: "Support request categories and status", icon: HeadphonesIcon, value: "25 open", growth: -21.9, growthLabel: "vs last month", color: CC.indigo, sparklineKey: "support", chartTypes: ["donut", "pie", "bar"] },
  { key: "verification", title: "Verification Analytics", description: "Author verification rates and trends", icon: BadgeCheck, value: "91.6%", growth: 10.8, growthLabel: "vs last month", color: CC.teal, sparklineKey: "verification", chartTypes: ["donut", "pie"] },
  { key: "revenueByService", title: "Revenue by Service", description: "Revenue breakdown by publishing service", icon: Wallet, value: "₦68.5M", growth: 11.9, growthLabel: "total", color: CC.violet, sparklineKey: "revenue", chartTypes: ["bar", "pie"] },
  { key: "booksByCategory", title: "Books by Category", description: "Book distribution across categories", icon: FileText, value: "24 categories", growth: 0, growthLabel: "", color: CC.amber, sparklineKey: "books", chartTypes: ["horizontalBar", "pie"] },
  { key: "topAuthors", title: "Top Authors", description: "Highest performing authors on the platform", icon: TrendingUp, value: "10 leaders", growth: 0, growthLabel: "", color: CC.gold, sparklineKey: "authorGrowth", chartTypes: ["horizontalBar"] },
];

const tooltipStyle = { backgroundColor: "#FDF6EE", border: "1px solid #E8DDD0", borderRadius: "8px" };

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#spark-${color.replace("#", "")})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SkeletonCard() {
  return (
    <Card className="border border-[#E8DDD0] rounded-xl">
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse bg-[#F2D8BE]/50 rounded" />
          <div className="h-8 w-20 animate-pulse bg-[#F2D8BE]/50 rounded" />
          <div className="h-3 w-32 animate-pulse bg-[#F2D8BE]/50 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse bg-[#F2D8BE]/30 rounded-lg" />
      ))}
    </div>
  );
}

function AnalyticsCard({ mod, onClick }: { mod: typeof analyticsModules[0]; onClick: () => void }) {
  const sparkData = sparklines[mod.sparklineKey];
  return (
    <motion.div variants={item} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
      <Card className="border border-[#E8DDD0] rounded-xl shadow-sm hover:shadow-md transition-all bg-white cursor-pointer group" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg p-2" style={{ backgroundColor: `${mod.color}15` }}>
                <mod.icon className="h-4 w-4" style={{ color: mod.color }} />
              </div>
              <p className="text-sm font-medium text-[#6A4E37]">{mod.title}</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xl font-bold text-[#1D1D1D]">{mod.value}</p>
              {mod.growth !== 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                  {mod.growth > 0 ? <TrendingUp className="h-3 w-3 text-emerald-600" /> : <TrendingDown className="h-3 w-3 text-emerald-600" />}
                  <span className="text-xs font-medium text-emerald-600">{mod.growth > 0 ? "+" : ""}{mod.growth}%</span>
                  <span className="text-xs text-[#6A4E37]">{mod.growthLabel}</span>
                </div>
              )}
            </div>
            <div className="w-20">
              <MiniSparkline data={sparkData} color={mod.color} />
            </div>
          </div>
          <Button size="sm" variant="ghost" className="w-full mt-3 text-xs group-hover:bg-[#F2D8BE]/30 transition-colors" style={{ color: mod.color }}>
            View Analytics <ArrowUpRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AnalyticsPanel({ moduleKey, onClose }: { moduleKey: ModuleKey; onClose: () => void }) {
  const [chartType, setChartType] = useState("line");
  const [period, setPeriod] = useState("12m");
  const mod = analyticsModules.find((m) => m.key === moduleKey)!;

  const trimData = useCallback((d: { month: string; [k: string]: unknown }[]) => {
    if (period === "30d") return d.slice(-1);
    if (period === "90d") return d.slice(-3);
    if (period === "6m") return d.slice(-6);
    return d;
  }, [period]);

  const exportCSV = useCallback(() => {
    const data = moduleKey === "revenue" ? chartData.revenue : moduleKey === "authorGrowth" ? chartData.authorGrowth : moduleKey === "books" ? chartData.books : moduleKey === "serviceOrders" ? chartData.serviceOrders : [];
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((r) => Object.values(r).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${moduleKey}-report.csv`; a.click();
    URL.revokeObjectURL(url);
  }, [moduleKey]);

  const renderChart = () => {
    const d = moduleKey === "revenue" ? trimData(chartData.revenue) : moduleKey === "authorGrowth" ? trimData(chartData.authorGrowth) : moduleKey === "books" ? trimData(chartData.books) : moduleKey === "serviceOrders" ? trimData(chartData.serviceOrders) : [];

    if (moduleKey === "revenue" || moduleKey === "authorGrowth" || moduleKey === "books" || moduleKey === "serviceOrders") {
      if (chartType === "line") {
        const keys = moduleKey === "authorGrowth" ? ["total", "verified"] : moduleKey === "books" ? ["published", "pending"] : moduleKey === "serviceOrders" ? ["completed", "pending"] : ["revenue"];
        const colors = moduleKey === "authorGrowth" ? [CC.blue, CC.teal] : moduleKey === "books" ? [CC.emerald, CC.amber] : moduleKey === "serviceOrders" ? [CC.emerald, CC.rose] : [CC.brown];
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={d}><CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" /><XAxis dataKey="month" tick={{ fill: "#6A4E37", fontSize: 12 }} /><YAxis tick={{ fill: "#6A4E37", fontSize: 12 }} /><Tooltip contentStyle={tooltipStyle} /><Legend />
              {keys.map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={colors[i]} strokeWidth={2} dot={{ r: 4 }} />)}
            </LineChart>
          </ResponsiveContainer>
        );
      }
      if (chartType === "bar") {
        const keys = moduleKey === "authorGrowth" ? ["total", "verified"] : moduleKey === "books" ? ["published", "pending"] : moduleKey === "serviceOrders" ? ["completed", "pending"] : ["revenue"];
        const colors = moduleKey === "authorGrowth" ? [CC.blue, CC.teal] : moduleKey === "books" ? [CC.emerald, CC.amber] : moduleKey === "serviceOrders" ? [CC.emerald, CC.rose] : [CC.brown];
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={d}><CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" /><XAxis dataKey="month" tick={{ fill: "#6A4E37", fontSize: 12 }} /><YAxis tick={{ fill: "#6A4E37", fontSize: 12 }} /><Tooltip contentStyle={tooltipStyle} /><Legend />
              {keys.map((k, i) => <Bar key={k} dataKey={k} fill={colors[i]} radius={[4, 4, 0, 0]} />)}
            </BarChart>
          </ResponsiveContainer>
        );
      }
      // area
      const keys = moduleKey === "authorGrowth" ? ["total", "verified"] : moduleKey === "books" ? ["published", "pending"] : moduleKey === "serviceOrders" ? ["completed", "pending"] : ["revenue"];
      const colors = moduleKey === "authorGrowth" ? [CC.blue, CC.teal] : moduleKey === "books" ? [CC.emerald, CC.amber] : moduleKey === "serviceOrders" ? [CC.emerald, CC.rose] : [CC.brown];
      return (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={d}><defs>{keys.map((k, i) => (<linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={colors[i]} stopOpacity={0.3} /><stop offset="95%" stopColor={colors[i]} stopOpacity={0} /></linearGradient>))}</defs><CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" /><XAxis dataKey="month" tick={{ fill: "#6A4E37", fontSize: 12 }} /><YAxis tick={{ fill: "#6A4E37", fontSize: 12 }} /><Tooltip contentStyle={tooltipStyle} /><Legend />
            {keys.map((k, i) => <Area key={k} type="monotone" dataKey={k} stroke={colors[i]} strokeWidth={2} fill={`url(#grad-${k})`} />)}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (moduleKey === "support" && (chartType === "pie" || chartType === "donut")) {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart><Pie data={chartData.supportCategories} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={chartType === "donut" ? 80 : 0} outerRadius={120} label>
            {chartData.supportCategories.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
          </Pie><Tooltip contentStyle={tooltipStyle} /><Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    if (moduleKey === "support") {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData.supportCategories} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" /><XAxis type="number" tick={{ fill: "#6A4E37" }} /><YAxis type="category" dataKey="name" tick={{ fill: "#6A4E37", fontSize: 11 }} width={140} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="count" fill={CC.indigo} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (moduleKey === "verification") {
      const vData = [{ name: "Verified", value: 164 }, { name: "Unverified", value: 15 }];
      return (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart><Pie data={vData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={chartType === "donut" ? 80 : 0} outerRadius={120} label>
            <Cell fill={CC.teal} /><Cell fill="#D1D5DB" />
          </Pie><Tooltip contentStyle={tooltipStyle} /><Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (moduleKey === "revenueByService") {
      if (chartType === "pie") {
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart><Pie data={chartData.revenueByService} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
              {chartData.revenueByService.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie><Tooltip contentStyle={tooltipStyle} /><Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      }
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData.revenueByService}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
            <XAxis dataKey="name" tick={{ fill: "#6A4E37", fontSize: 11 }} />
            <YAxis tick={{ fill: "#6A4E37" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="revenue" fill={CC.violet} radius={[4, 4, 0, 0]}>
              {chartData.revenueByService.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (moduleKey === "booksByCategory") {
      if (chartType === "pie") {
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart><Pie data={chartData.booksByCategory} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
              {chartData.booksByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie><Tooltip contentStyle={tooltipStyle} /><Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      }
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData.booksByCategory} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" /><XAxis type="number" tick={{ fill: "#6A4E37" }} /><YAxis type="category" dataKey="name" tick={{ fill: "#6A4E37", fontSize: 11 }} width={180} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="count" fill={CC.amber} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (moduleKey === "topAuthors") {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData.topAuthors} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" /><XAxis type="number" tick={{ fill: "#6A4E37" }} /><YAxis type="category" dataKey="name" tick={{ fill: "#6A4E37", fontSize: 11 }} width={100} /><Tooltip contentStyle={tooltipStyle} /><Legend />
            <Bar dataKey="books" name="Books Published" fill={CC.gold} radius={[0, 4, 4, 0]} />
            <Bar dataKey="revenue" name="Revenue (₦M)" fill={CC.brown} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return <div className="h-[350px] flex items-center justify-center text-muted-foreground">Select a chart type</div>;
  };

  const renderDataTable = () => {
    if (moduleKey === "revenue" || moduleKey === "authorGrowth" || moduleKey === "books" || moduleKey === "serviceOrders") {
      const d = moduleKey === "revenue" ? trimData(chartData.revenue) : moduleKey === "authorGrowth" ? trimData(chartData.authorGrowth) : moduleKey === "books" ? trimData(chartData.books) : trimData(chartData.serviceOrders);
      const keys = Object.keys(d[0] || {}).filter((k) => k !== "month");
      return (
        <Table>
          <TableHeader><TableRow className="border-[#E8DDD0]"><TableHead className="text-[#6A4E37]">Month</TableHead>{keys.map((k) => <TableHead key={k} className="text-[#6A4E37] capitalize">{k}</TableHead>)}<TableHead className="text-[#6A4E37] text-right">Total</TableHead></TableRow></TableHeader>
          <TableBody>{d.map((r, i) => <TableRow key={i} className="border-[#E8DDD0]"><TableCell className="font-medium text-[#1D1D1D]">{r.month}</TableCell>{keys.map((k) => <TableCell key={k} className="text-[#6A4E37]">{moduleKey === "revenue" ? `₦${r[k]}M` : String(r[k])}</TableCell>)}<TableCell className="text-right font-medium text-[#1D1D1D]">{moduleKey === "revenue" ? `₦${keys.reduce((s, k) => s + Number(r[k]), 0)}M` : keys.reduce((s, k) => s + Number(r[k]), 0)}</TableCell></TableRow>)}</TableBody>
        </Table>
      );
    }
    if (moduleKey === "support") {
      return (
        <Table>
          <TableHeader><TableRow className="border-[#E8DDD0]"><TableHead className="text-[#6A4E37]">Category</TableHead><TableHead className="text-[#6A4E37] text-right">Count</TableHead><TableHead className="text-[#6A4E37] text-right">%</TableHead></TableRow></TableHeader>
          <TableBody>{chartData.supportCategories.map((r, i) => <TableRow key={i} className="border-[#E8DDD0]"><TableCell className="font-medium text-[#1D1D1D]">{r.name}</TableCell><TableCell className="text-right text-[#6A4E37]">{r.count}</TableCell><TableCell className="text-right text-[#6A4E37]">{((r.count / 25) * 100).toFixed(0)}%</TableCell></TableRow>)}</TableBody>
        </Table>
      );
    }
    if (moduleKey === "verification") {
      return (
        <Table>
          <TableHeader><TableRow className="border-[#E8DDD0]"><TableHead className="text-[#6A4E37]">Status</TableHead><TableHead className="text-[#6A4E37] text-right">Count</TableHead><TableHead className="text-[#6A4E37] text-right">Rate</TableHead></TableRow></TableHeader>
          <TableBody><TableRow className="border-[#E8DDD0]"><TableCell className="font-medium text-[#1D1D1D]">Verified Authors</TableCell><TableCell className="text-right text-[#6A4E37]">164</TableCell><TableCell className="text-right text-[#6A4E37]">91.6%</TableCell></TableRow><TableRow className="border-[#E8DDD0]"><TableCell className="font-medium text-[#1D1D1D]">Unverified Authors</TableCell><TableCell className="text-right text-[#6A4E37]">15</TableCell><TableCell className="text-right text-[#6A4E37]">8.4%</TableCell></TableRow></TableBody>
        </Table>
      );
    }
    if (moduleKey === "revenueByService") {
      return (
        <Table>
          <TableHeader><TableRow className="border-[#E8DDD0]"><TableHead className="text-[#6A4E37]">Service</TableHead><TableHead className="text-[#6A4E37] text-right">Revenue</TableHead><TableHead className="text-[#6A4E37] text-right">Orders</TableHead><TableHead className="text-[#6A4E37] text-right">%</TableHead></TableRow></TableHeader>
          <TableBody>{chartData.revenueByService.map((r, i) => <TableRow key={i} className="border-[#E8DDD0]"><TableCell className="font-medium text-[#1D1D1D]">{r.name}</TableCell><TableCell className="text-right text-[#6A4E37]">₦{r.revenue}M</TableCell><TableCell className="text-right text-[#6A4E37]">{r.orders}</TableCell><TableCell className="text-right text-[#6A4E37]">{((r.revenue / 68.5) * 100).toFixed(1)}%</TableCell></TableRow>)}</TableBody>
        </Table>
      );
    }
    if (moduleKey === "booksByCategory") {
      return (
        <Table>
          <TableHeader><TableRow className="border-[#E8DDD0]"><TableHead className="text-[#6A4E37]">Category</TableHead><TableHead className="text-[#6A4E37] text-right">Books</TableHead><TableHead className="text-[#6A4E37] text-right">%</TableHead></TableRow></TableHeader>
          <TableBody>{chartData.booksByCategory.map((r, i) => <TableRow key={i} className="border-[#E8DDD0]"><TableCell className="font-medium text-[#1D1D1D]">{r.name}</TableCell><TableCell className="text-right text-[#6A4E37]">{r.count}</TableCell><TableCell className="text-right text-[#6A4E37]">{((r.count / 387) * 100).toFixed(1)}%</TableCell></TableRow>)}</TableBody>
        </Table>
      );
    }
    if (moduleKey === "topAuthors") {
      return (
        <Table>
          <TableHeader><TableRow className="border-[#E8DDD0]"><TableHead className="text-[#6A4E37]">Author</TableHead><TableHead className="text-[#6A4E37] text-right">Books</TableHead><TableHead className="text-[#6A4E37] text-right">Revenue</TableHead></TableRow></TableHeader>
          <TableBody>{chartData.topAuthors.map((r, i) => <TableRow key={i} className="border-[#E8DDD0]"><TableCell className="font-medium text-[#1D1D1D]">{r.name}</TableCell><TableCell className="text-right text-[#6A4E37]">{r.books}</TableCell><TableCell className="text-right text-[#6A4E37]">₦{r.revenue}M</TableCell></TableRow>)}</TableBody>
        </Table>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-full max-w-[800px] bg-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E8DDD0] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#1D1D1D]">{mod.title}</h2>
            <p className="text-sm text-[#6A4E37]">{mod.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={exportCSV} className="border-[#E8DDD0] text-[#8A6A4A]"><Download className="h-3.5 w-3.5 mr-1" />CSV</Button>
            <Button size="sm" variant="outline" className="border-[#E8DDD0] text-[#8A6A4A]"><Download className="h-3.5 w-3.5 mr-1" />PDF</Button>
            <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0"><X className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-[#E8DDD0] flex flex-wrap items-center gap-3">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="bg-[#F2D8BE]/30 h-8">
              {["30d", "90d", "6m", "12m", "all"].map((p) => (
                <TabsTrigger key={p} value={p} className="text-xs h-6 px-2 data-[state=active]:bg-[#8A6A4A] data-[state=active]:text-white">
                  {p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : p === "6m" ? "6 Months" : p === "12m" ? "12 Months" : "All Time"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Separator orientation="vertical" className="h-6 bg-[#E8DDD0]" />
          <Tabs value={chartType} onValueChange={setChartType}>
            <TabsList className="bg-[#F2D8BE]/30 h-8">
              {mod.chartTypes.map((t) => (
                <TabsTrigger key={t} value={t} className="text-xs h-6 px-2 capitalize data-[state=active]:bg-[#8A6A4A] data-[state=active]:text-white">
                  {t === "horizontalBar" ? "H-Bar" : t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {renderChart()}
          <Separator className="bg-[#E8DDD0]" />
          <div>
            <h3 className="text-sm font-semibold text-[#1D1D1D] mb-3">Data Table</h3>
            {renderDataTable()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleKey | null>(null);

  const [accordions, setAccordions] = useState({
    activity: false,
    pendingBooks: false,
    serviceOrders: false,
    content: false,
    financial: false,
    notifications: false,
  });
  const toggleAccordion = (key: keyof typeof accordions) => setAccordions((p) => ({ ...p, [key]: !p[key] }));

  const fetchDashboardData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const json = await res.json();
      if (json.success) setData(json.data); else throw new Error(json.error || "Unknown error");
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load dashboard"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-[#1D1D1D]">Failed to load dashboard</p>
        <p className="text-sm text-[#6A4E37]">{error}</p>
        <Button onClick={fetchDashboardData} variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Try Again</Button>
      </div>
    );
  }

  const kpi = data?.kpi; const trends = kpi?.kpiTrends;
  const kpiCards = kpi && trends ? [
    { label: "Total Authors", value: kpi.totalAuthors, trend: trends.totalAuthors.change, icon: Users, bg: "bg-blue-100", iconColor: "text-blue-600", description: "+12 this month" },
    { label: "Verified Authors", value: kpi.verifiedAuthors, trend: trends.verifiedAuthors.change, icon: BadgeCheck, bg: "bg-teal-100", iconColor: "text-teal-600", description: "91.6% verification rate" },
    { label: "Published Books", value: kpi.publishedBooks, trend: trends.publishedBooks.change, icon: BookOpen, bg: "bg-emerald-100", iconColor: "text-emerald-600", description: "Across all formats" },
    { label: "Pending Review", value: kpi.pendingReview, trend: trends.pendingReview.change, icon: Clock, bg: "bg-amber-100", iconColor: "text-amber-600", description: "Awaiting admin review" },
    { label: "Active Service Orders", value: kpi.activeServiceOrders, trend: trends.activeServiceOrders.change, icon: ShoppingCart, bg: "bg-rose-100", iconColor: "text-rose-600", description: "Across all services" },
    { label: "Monthly Revenue", value: formatCurrency(kpi.monthlyRevenue), trend: trends.monthlyRevenue.change, icon: DollarSign, bg: "bg-[#F2D8BE]", iconColor: "text-[#8A6A4A]", description: "This month's earnings" },
    { label: "Pending Payouts", value: formatCurrency(kpi.pendingPayouts), trend: trends.pendingPayouts.change, icon: Wallet, bg: "bg-violet-100", iconColor: "text-violet-600", description: "Awaiting processing" },
    { label: "Support Requests", value: kpi.supportRequests, trend: trends.supportRequests.change, icon: HeadphonesIcon, bg: "bg-indigo-100", iconColor: "text-indigo-600", description: "Open requests" },
  ] : [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ── 1. PAGE HEADER ── */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Dashboard Overview</h1>
          <p className="text-[#6A4E37] mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening with your platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={loading} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
            </Button>
          </div>
          <Button size="sm" asChild className="bg-[#8A6A4A] hover:bg-[#7A5A3A] text-white">
            <Link href="/admin/books"><BookOpen className="h-4 w-4 mr-1" />Review Books</Link>
          </Button>
          <Button size="sm" variant="outline" asChild className="border-[#E8DDD0]">
            <Link href="/admin/users"><Users className="h-4 w-4 mr-1" />Manage Authors</Link>
          </Button>
        </div>
      </motion.div>

      {/* ── 0. DASHBOARD SUMMARY PANEL ── */}
      <motion.div variants={item}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-[#E8DDD0] bg-white px-5 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-[#1D1D1D]">Platform Status: Healthy</span>
          </div>
          <div className="h-4 w-px bg-[#E8DDD0]" />
          {!loading && kpi && (
            <>
              <span className="text-sm text-[#6A4E37]"><span className="font-semibold text-[#1D1D1D]">Authors:</span> {kpi.totalAuthors}</span>
              <span className="text-sm text-[#6A4E37]"><span className="font-semibold text-[#1D1D1D]">Books Published:</span> {kpi.publishedBooks}</span>
              <span className="text-sm text-[#6A4E37]"><span className="font-semibold text-[#1D1D1D]">Pending Reviews:</span> {kpi.pendingReview}</span>
              <span className="text-sm text-[#6A4E37]"><span className="font-semibold text-[#1D1D1D]">Support Requests:</span> {kpi.supportRequests}</span>
              <span className="text-sm text-[#6A4E37]"><span className="font-semibold text-[#1D1D1D]">Monthly Revenue:</span> {formatCurrency(kpi.monthlyRevenue)}</span>
            </>
          )}
        </div>
      </motion.div>

      {/* ── 2. KPI CARDS ── */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />) : kpiCards.map((kpiItem) => {
          const TrendIcon = kpiItem.trend >= 0 ? TrendingUp : TrendingDown;
          const trendColor = kpiItem.trend >= 0 ? "text-emerald-600" : "text-red-500";
          return (
            <Card key={kpiItem.label} className="border border-[#E8DDD0] rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#6A4E37]">{kpiItem.label}</p>
                    <p className="text-2xl font-bold tracking-tight text-[#1D1D1D]">{kpiItem.value}</p>
                  </div>
                  <div className={`rounded-lg p-2.5 ${kpiItem.bg}`}><kpiItem.icon className={`h-5 w-5 ${kpiItem.iconColor}`} /></div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs">
                  <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
                  <span className={`font-medium ${trendColor}`}>{kpiItem.trend >= 0 ? "+" : ""}{kpiItem.trend}%</span>
                  <span className="text-[#6A4E37]">vs last month</span>
                </div>
                {kpiItem.description && <p className="text-xs text-[#6A4E37] mt-1.5">{kpiItem.description}</p>}
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* ── 3. ANALYTICS CENTER ── */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1D1D1D]">Analytics Center</h2>
            <p className="text-sm text-[#6A4E37]">Click any module to view detailed analytics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsModules.map((mod) => (
            <AnalyticsCard key={mod.key} mod={mod} onClick={() => { setActiveModule(mod.key); setAnalyticsOpen(true); }} />
          ))}
        </div>
      </motion.div>

      {/* ── 4. QUICK ACTIONS (always visible) + ACCORDION STACK ── */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        {/* ── Left: Accordion panels ── */}
        <div className="lg:col-span-2 space-y-3">
          {/* Activity Feed */}
          <div className="border border-[#E8DDD0] rounded-xl shadow-sm bg-white overflow-hidden">
            <button onClick={() => toggleAccordion("activity")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F2D8BE]/10 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#8A6A4A]" />
                <span className="text-sm font-semibold text-[#1D1D1D]">Recent Activity</span>
                {data?.recentActivity && <Badge variant="secondary" className="text-xs font-normal bg-[#F2D8BE]/40 text-[#8A6A4A]">{data.recentActivity.length} events</Badge>}
              </div>
              <ChevronDown className={`h-4 w-4 text-[#6A4E37] transition-transform duration-200 ${accordions.activity ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {accordions.activity && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
                  <div className="px-5 pb-4 border-t border-[#E8DDD0]">
                    {loading ? <SkeletonTable rows={6} /> : (
                      <div className="space-y-1 pt-3">
                        {(data?.recentActivity || []).slice(0, 10).map((a) => {
                          const Icon = activityIcons[a.type] || AlertCircle;
                          const colorClass = activityColors[a.type] || "bg-gray-100 text-gray-600";
                          return (
                            <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F2D8BE]/20 transition-colors">
                              <div className={`rounded-full p-2 shrink-0 ${colorClass}`}><Icon className="h-4 w-4" /></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-relaxed text-[#1D1D1D]">{a.message}</p>
                                <p className="text-xs text-[#6A4E37] mt-0.5">{formatDate(a.timestamp, "relative")}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pending Books Review */}
          <div className="border border-[#E8DDD0] rounded-xl shadow-sm bg-white overflow-hidden">
            <button onClick={() => toggleAccordion("pendingBooks")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F2D8BE]/10 transition-colors">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-[#8A6A4A]" />
                <span className="text-sm font-semibold text-[#1D1D1D]">Pending Books Review</span>
                {data?.pendingReviews && data.pendingReviews.length > 0 && <Badge variant="warning" className="text-xs font-normal">{data.pendingReviews.length} awaiting</Badge>}
              </div>
              <ChevronDown className={`h-4 w-4 text-[#6A4E37] transition-transform duration-200 ${accordions.pendingBooks ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {accordions.pendingBooks && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
                  <div className="px-5 pb-4 border-t border-[#E8DDD0]">
                    {loading ? <SkeletonTable rows={5} /> : (
                      <Table className="mt-3">
                        <TableHeader><TableRow className="border-[#E8DDD0]"><TableHead className="text-[#6A4E37]">Book Title</TableHead><TableHead className="text-[#6A4E37]">Author</TableHead><TableHead className="text-[#6A4E37]">Category</TableHead><TableHead className="text-[#6A4E37]">Submitted</TableHead><TableHead className="text-right text-[#6A4E37]">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {(data?.pendingReviews || []).slice(0, 8).map((b) => (
                            <TableRow key={b.id} className="hover:bg-[#F2D8BE]/10 border-[#E8DDD0]">
                              <TableCell className="font-medium text-[#1D1D1D]">{b.title}</TableCell>
                              <TableCell className="text-[#6A4E37]">{b.author.name}</TableCell>
                              <TableCell><Badge variant="outline" className="text-xs border-[#D8B27A]/30 text-[#8A6A4A]">{b.category}</Badge></TableCell>
                              <TableCell className="text-xs text-[#6A4E37]">{formatDate(b.submittedAt, "short")}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"><CheckCircle2 className="h-4 w-4" /></Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"><XCircle className="h-4 w-4" /></Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"><Eye className="h-4 w-4" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    <div className="mt-3 flex justify-end">
                      <Button variant="ghost" size="sm" asChild><Link href="/admin/books">View All <ArrowUpRight className="ml-1 h-4 w-4" /></Link></Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Service Orders */}
          <div className="border border-[#E8DDD0] rounded-xl shadow-sm bg-white overflow-hidden">
            <button onClick={() => toggleAccordion("serviceOrders")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F2D8BE]/10 transition-colors">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-[#8A6A4A]" />
                <span className="text-sm font-semibold text-[#1D1D1D]">Recent Service Orders</span>
                {data?.recentOrders && data.recentOrders.length > 0 && <Badge variant="secondary" className="text-xs font-normal bg-[#F2D8BE]/40 text-[#8A6A4A]">{data.recentOrders.length} orders</Badge>}
              </div>
              <ChevronDown className={`h-4 w-4 text-[#6A4E37] transition-transform duration-200 ${accordions.serviceOrders ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {accordions.serviceOrders && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
                  <div className="px-5 pb-4 border-t border-[#E8DDD0]">
                    {loading ? <SkeletonTable rows={5} /> : (
                      <Table className="mt-3">
                        <TableHeader><TableRow className="border-[#E8DDD0]"><TableHead className="text-[#6A4E37]">Order #</TableHead><TableHead className="text-[#6A4E37]">Author</TableHead><TableHead className="text-[#6A4E37]">Package</TableHead><TableHead className="text-right text-[#6A4E37]">Amount</TableHead><TableHead className="text-[#6A4E37]">Status</TableHead><TableHead className="text-[#6A4E37]">Date</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {(data?.recentOrders || []).slice(0, 8).map((o) => (
                            <TableRow key={o.id} className="hover:bg-[#F2D8BE]/10 border-[#E8DDD0]">
                              <TableCell className="font-mono text-xs font-medium text-[#8A6A4A]">{o.orderNumber}</TableCell>
                              <TableCell className="text-sm text-[#1D1D1D]">{o.customer.name}</TableCell>
                              <TableCell className="text-sm text-[#6A4E37]">{o.package}</TableCell>
                              <TableCell className="text-right font-medium text-sm text-[#1D1D1D]">{formatCurrency(o.amount)}</TableCell>
                              <TableCell><Badge variant={o.status === "COMPLETED" ? "success" : o.status === "PENDING" ? "warning" : o.status === "CANCELLED" ? "destructive" : "secondary"} className="text-xs">{o.status}</Badge></TableCell>
                              <TableCell className="text-xs text-[#6A4E37]">{formatDate(o.createdAt, "short")}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    <div className="mt-3 flex justify-end">
                      <Button variant="ghost" size="sm" asChild><Link href="/admin/orders">View All <ArrowUpRight className="ml-1 h-4 w-4" /></Link></Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content Overview */}
          <div className="border border-[#E8DDD0] rounded-xl shadow-sm bg-white overflow-hidden">
            <button onClick={() => toggleAccordion("content")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F2D8BE]/10 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#8A6A4A]" />
                <span className="text-sm font-semibold text-[#1D1D1D]">Content Overview</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-[#6A4E37] transition-transform duration-200 ${accordions.content ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {accordions.content && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
                  <div className="px-5 pb-4 border-t border-[#E8DDD0]">
                    {loading ? <SkeletonTable rows={4} /> : (
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium text-[#1D1D1D]">Blog Posts — Published</span><span className="text-[#6A4E37]">{data?.contentOverview.publishedPosts || 0}</span></div><Progress value={data?.contentOverview.publishedPosts || 0} max={100} className="h-2 bg-emerald-100 [&>div]:bg-emerald-500" /></div>
                        <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium text-[#1D1D1D]">Blog Posts — Draft</span><span className="text-[#6A4E37]">{data?.contentOverview.drafts || 0}</span></div><Progress value={data?.contentOverview.drafts || 0} max={100} className="h-2 bg-amber-100 [&>div]:bg-amber-500" /></div>
                        <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium text-[#1D1D1D]">Blog Posts — Scheduled</span><span className="text-[#6A4E37]">{data?.contentOverview.scheduled || 0}</span></div><Progress value={data?.contentOverview.scheduled || 0} max={100} className="h-2 bg-blue-100 [&>div]:bg-blue-500" /></div>
                        <Separator className="bg-[#E8DDD0]" />
                        <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-[#1D1D1D]">Total Testimonials</p><p className="text-xs text-[#6A4E37]">Collected from authors & readers</p></div><span className="text-2xl font-bold text-[#1D1D1D]">{data?.contentOverview.totalTestimonials || 0}</span></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Financial Overview */}
          <div className="border border-[#E8DDD0] rounded-xl shadow-sm bg-white overflow-hidden">
            <button onClick={() => toggleAccordion("financial")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F2D8BE]/10 transition-colors">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-[#8A6A4A]" />
                <span className="text-sm font-semibold text-[#1D1D1D]">Financial Overview</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-[#6A4E37] transition-transform duration-200 ${accordions.financial ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {accordions.financial && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
                  <div className="px-5 pb-4 border-t border-[#E8DDD0]">
                    {loading ? <SkeletonTable rows={6} /> : (
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-[#F2D8BE]/20 p-3 border border-[#E8DDD0]"><p className="text-xs text-[#6A4E37]">Today</p><p className="text-lg font-bold text-[#1D1D1D]">{formatCurrency(data?.financialOverview.todayRevenue || 0)}</p></div>
                          <div className="rounded-lg bg-[#F2D8BE]/20 p-3 border border-[#E8DDD0]"><p className="text-xs text-[#6A4E37]">This Month</p><p className="text-lg font-bold text-[#1D1D1D]">{formatCurrency(data?.financialOverview.thisMonth || 0)}</p></div>
                          <div className="rounded-lg bg-[#F2D8BE]/20 p-3 border border-[#E8DDD0]"><p className="text-xs text-[#6A4E37]">Last Month</p><p className="text-lg font-bold text-[#1D1D1D]">{formatCurrency(data?.financialOverview.lastMonth || 0)}</p></div>
                          <div className="rounded-lg bg-[#D8B27A]/20 p-3 border border-[#D8B27A]/30"><p className="text-xs text-[#8A6A4A]">Year To Date</p><p className="text-lg font-bold text-[#8A6A4A]">{formatCurrency(data?.financialOverview.yearToDate || 0)}</p></div>
                        </div>
                        <Separator className="bg-[#E8DDD0]" />
                        <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-[#1D1D1D]">Avg Order Value</p></div><span className="text-lg font-bold text-[#1D1D1D]">{formatCurrency(data?.financialOverview.averageOrderValue || 0)}</span></div>
                        <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-[#1D1D1D]">Pending Payouts</p></div><Badge variant="warning" className="text-sm font-semibold">{formatCurrency(data?.financialOverview.pendingPayouts || 0)}</Badge></div>
                        <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-[#1D1D1D]">Completed Payouts</p></div><Badge variant="success" className="text-sm font-semibold">{formatCurrency(data?.financialOverview.completedPayouts || 0)}</Badge></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="border border-[#E8DDD0] rounded-xl shadow-sm bg-white overflow-hidden">
            <button onClick={() => toggleAccordion("notifications")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F2D8BE]/10 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-[#8A6A4A]" />
                <span className="text-sm font-semibold text-[#1D1D1D]">Recent Notifications</span>
                {data?.notifications && data.notifications.length > 0 && <Badge variant="secondary" className="text-xs font-normal bg-[#F2D8BE]/40 text-[#8A6A4A]">{data.notifications.length} new</Badge>}
              </div>
              <ChevronDown className={`h-4 w-4 text-[#6A4E37] transition-transform duration-200 ${accordions.notifications ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {accordions.notifications && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
                  <div className="px-5 pb-4 border-t border-[#E8DDD0]">
                    {loading ? <SkeletonTable rows={4} /> : (
                      <div className="space-y-1 pt-3">
                        {(data?.notifications || []).slice(0, 6).map((n) => {
                          const tc: Record<string, { icon: typeof AlertCircle; color: string; bg: string }> = { info: { icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50" }, warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" }, success: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" }, error: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" } };
                          const c = tc[n.type] || tc.info;
                          return (
                            <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F2D8BE]/20 transition-colors">
                              <div className={`rounded-full p-2 shrink-0 ${c.bg}`}><c.icon className={`h-4 w-4 ${c.color}`} /></div>
                              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#1D1D1D]">{n.title}</p><p className="text-xs text-[#6A4E37] mt-0.5 line-clamp-1">{n.message}</p></div>
                              <span className="text-xs text-[#6A4E37] whitespace-nowrap shrink-0">{formatDate(n.timestamp, "relative")}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right: Widgets ── */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="border border-[#E8DDD0] rounded-xl shadow-sm bg-white p-5">
            <h3 className="text-sm font-semibold text-[#1D1D1D] mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#D8B27A]" />Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((a) => (
                <Button key={a.label} variant="outline" className="h-auto flex-col items-center gap-2 py-4 px-2 hover:shadow-sm transition-all border-[#E8DDD0]" asChild>
                  <Link href={a.href}><div className={`rounded-lg p-2 ${a.color}`}><a.icon className="h-4 w-4" /></div><span className="text-xs font-medium text-center leading-tight text-[#1D1D1D]">{a.label}</span></Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 5. TODAY'S SNAPSHOT + PLATFORM HEALTH ── */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        {/* Today's Snapshot — compact list */}
        <div className="border border-[#E8DDD0] rounded-xl shadow-sm bg-white p-5">
          <h3 className="text-sm font-semibold text-[#1D1D1D] mb-3">Today&apos;s Snapshot</h3>
          {loading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-5 rounded bg-[#F2D8BE]/20 animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {[
                { label: "New Authors", value: `+${data?.todaySnapshot?.newAuthors ?? 5}`, icon: Users, color: "text-blue-600" },
                { label: "Books Published", value: `+${data?.todaySnapshot?.booksPublished ?? 8}`, icon: BookOpen, color: "text-emerald-600" },
                { label: "Books Approved", value: `+${data?.todaySnapshot?.booksApproved ?? 4}`, icon: CheckCircle2, color: "text-teal-600" },
                { label: "Service Orders", value: `+${data?.todaySnapshot?.serviceOrders ?? 5}`, icon: ShoppingCart, color: "text-rose-600" },
                { label: "Support Requests", value: `+${data?.todaySnapshot?.supportRequests ?? 3}`, icon: HeadphonesIcon, color: "text-indigo-600" },
                { label: "Revenue Today", value: formatCurrency(data?.todaySnapshot?.revenueToday ?? 5641), icon: DollarSign, color: "text-[#8A6A4A]" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2.5">
                    <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                    <span className="text-sm text-[#1D1D1D]">{s.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#1D1D1D]">{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Health — reduced spacing */}
        <div className="border border-[#E8DDD0] rounded-xl shadow-sm bg-white p-5">
          <h3 className="text-sm font-semibold text-[#1D1D1D] mb-3">Platform Health</h3>
          <div className="space-y-1.5">
            {[
              { name: "Email Service", status: "healthy" as const, detail: "Operational" },
              { name: "Author Registrations", status: "healthy" as const, detail: "Healthy" },
              { name: "Publishing Reviews", status: "healthy" as const, detail: "Normal" },
              { name: "Payment Processing", status: "healthy" as const, detail: "Operational" },
              { name: "Media Storage", status: "healthy" as const, detail: "Healthy" },
              { name: "Notification System", status: "healthy" as const, detail: "Operational" },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${s.status === "healthy" ? "bg-emerald-500" : s.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} />
                  <span className="text-sm text-[#1D1D1D]">{s.name}</span>
                </div>
                <span className={`text-xs font-medium ${s.status === "healthy" ? "text-emerald-600" : s.status === "warning" ? "text-amber-600" : "text-red-500"}`}>{s.detail}</span>
              </div>
            ))}
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-[#E8DDD0]">
            <p className="text-xs text-[#6A4E37]">Last Updated: 2 minutes ago</p>
          </div>
        </div>
      </motion.div>

      {/* ── ANALYTICS SLIDE-OVER ── */}
      <AnimatePresence>
        {analyticsOpen && activeModule && <AnalyticsPanel moduleKey={activeModule} onClose={() => { setAnalyticsOpen(false); setActiveModule(null); }} />}
      </AnimatePresence>
    </motion.div>
  );
}
