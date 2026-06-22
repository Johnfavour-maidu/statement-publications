"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  ShoppingCart,
  DollarSign,
  Clock,
  Upload,
  Eye,
  User,
  ArrowUpRight,
  Star,
  CheckCircle2,
  Trophy,
  FileText,
  Download,
  TrendingUp,
  BarChart3,
  Users,
  MessageSquare,
  Bookmark,
  Share2,
  Target,
  Shield,
  Lock,
  Bell,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Palette,
  File,
  Send,
  Headphones,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const summaryCards = [
  {
    label: "Total Books",
    value: "12",
    change: "8 published",
    trend: "up" as const,
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
    href: "/author/books",
  },
  {
    label: "Published",
    value: "8",
    change: "3 drafts",
    trend: "up" as const,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    href: "/author/books?status=published",
  },
  {
    label: "Drafts",
    value: "3",
    change: "1 pending review",
    trend: "neutral" as const,
    icon: FileText,
    color: "text-gray-600",
    bg: "bg-gray-50",
    href: "/author/books?status=draft",
  },
  {
    label: "Pending Reviews",
    value: "1",
    change: "Awaiting approval",
    trend: "neutral" as const,
    icon: Eye,
    color: "text-amber-600",
    bg: "bg-amber-50",
    href: "/author/books?status=pending",
  },
  {
    label: "Total Earnings",
    value: "$8,420",
    change: "$1,280 this month",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-violet-600",
    bg: "bg-violet-50",
    href: "/author/earnings",
  },
  {
    label: "Active Orders",
    value: "4",
    change: "2 in progress",
    trend: "neutral" as const,
    icon: ShoppingCart,
    color: "text-pink-600",
    bg: "bg-pink-50",
    href: "/author/orders",
  },
];

const performanceStrip = [
  { label: "Books Sold", value: "248", icon: BookOpen },
  { label: "New Readers", value: "1,427", icon: Users },
  { label: "Page Reads", value: "8,912", icon: Eye },
  { label: "Royalties", value: "$1,280", icon: DollarSign },
  { label: "Conversion Rate", value: "12.8%", icon: TrendingUp },
];

const earningsData = [
  { month: "Jan", revenue: 450 },
  { month: "Feb", revenue: 620 },
  { month: "Mar", revenue: 710 },
  { month: "Apr", revenue: 940 },
  { month: "May", revenue: 1120 },
  { month: "Jun", revenue: 1340 },
];

const quickActions = [
  { label: "Upload New Book", action: "upload", icon: Upload, color: "bg-[#D8B27A]" },
  { label: "Browse Services", href: "/author/services", icon: ShoppingCart, color: "bg-blue-600" },
  { label: "Contact Support", href: "/author/support", icon: Headphones, color: "bg-emerald-600" },
  { label: "View Earnings", href: "/author/earnings", icon: DollarSign, color: "bg-violet-600" },
  { label: "Edit Profile", href: "/author/profile", icon: User, color: "bg-amber-600" },
];

const analyticsPanels = [
  { label: "Top Performing Book", value: "Financial Freedom", detail: "185 sales · $2,640 revenue", progress: 85, icon: Trophy, color: "text-[#8A6A4A]" },
  { label: "Most Viewed Book", value: "Financial Freedom", detail: "3,820 views", progress: 76, icon: Eye, color: "text-blue-600" },
  { label: "Most Purchased", value: "Financial Freedom", detail: "185 purchases", progress: 85, icon: ShoppingCart, color: "text-emerald-600" },
  { label: "Highest Rated", value: "Financial Freedom", detail: "4.8 / 5.0 stars", progress: 96, icon: Star, color: "text-amber-600" },
  { label: "Reader Growth", value: "+1,427", detail: "85% growth rate", progress: 85, icon: Users, color: "text-violet-600" },
  { label: "Publishing Trend", value: "3 books", detail: "Up from 2 last quarter", progress: 75, icon: TrendingUp, color: "text-pink-600" },
];

const activityTimeline = [
  { title: 'Book "Financial Freedom" published', time: "2 hours ago", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" },
  { title: 'Cover design ordered for "Money Mindset"', time: "5 hours ago", icon: Palette, color: "bg-blue-100 text-blue-600" },
  { title: "Withdrawal request approved ($1,280)", time: "1 day ago", icon: DollarSign, color: "bg-green-100 text-green-600" },
  { title: 'Manuscript "The Wealth Blueprint" submitted', time: "2 days ago", icon: FileText, color: "bg-amber-100 text-amber-600" },
  { title: "Profile updated with new photo", time: "3 days ago", icon: User, color: "bg-gray-100 text-gray-600" },
  { title: 'New review received on "Financial Freedom"', time: "4 days ago", icon: Star, color: "bg-yellow-100 text-yellow-600" },
];

const goals = [
  { label: "Publish 12 Books", current: 8, total: 12, color: "bg-emerald-500" },
  { label: "Reach $10,000 Earnings", current: 8420, total: 10000, color: "bg-[#D8B27A]", prefix: "$", format: "currency" as const },
  { label: "Get 100 Reviews", current: 68, total: 100, color: "bg-blue-500" },
  { label: "Gain 5,000 Readers", current: 3600, total: 5000, color: "bg-violet-500" },
];

const bookPerformance = [
  { title: "Financial Freedom", status: "Published", views: "3,820", sales: 185, rating: 4.8, revenue: "$2,640" },
  { title: "The Wealth Blueprint", status: "Published", views: "2,950", sales: 144, rating: 4.7, revenue: "$2,180" },
  { title: "Money Mindset", status: "Published", views: "2,100", sales: 98, rating: 4.6, revenue: "$1,420" },
  { title: "The Art of Investing", status: "Published", views: "1,840", sales: 76, rating: 4.5, revenue: "$980" },
  { title: "Digital Nomad Guide", status: "Published", views: "1,520", sales: 62, rating: 4.4, revenue: "$640" },
  { title: "Self-Publishing Mastery", status: "Published", views: "1,200", sales: 48, rating: 4.3, revenue: "$320" },
  { title: "Creative Writing 101", status: "Published", views: "980", sales: 35, rating: 4.2, revenue: "$180" },
  { title: "The Writer's Journey", status: "Published", views: "750", sales: 22, rating: 4.1, revenue: "$60" },
  { title: "Future Trends", status: "Draft", views: "—", sales: 0, rating: 0, revenue: "—" },
  { title: "Health & Wellness Guide", status: "Draft", views: "—", sales: 0, rating: 0, revenue: "—" },
  { title: "Travel Memoirs", status: "Draft", views: "—", sales: 0, rating: 0, revenue: "—" },
  { title: "Poetry Collection", status: "Pending Review", views: "—", sales: 0, rating: 0, revenue: "—" },
];

const notifications = [
  { title: 'Book "Financial Freedom" approved and published', time: "2 hours ago", unread: true },
  { title: "Service completed: Cover design for \"Money Mindset\"", time: "5 hours ago", unread: true },
  { title: 'New review received on "Financial Freedom"', time: "1 day ago", unread: true },
  { title: "Royalty payment of $1,280 sent to your account", time: "2 days ago", unread: false },
  { title: "Profile verification completed", time: "5 days ago", unread: false },
];

const readerEngagement = [
  { label: "Followers", value: "2,184", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Reviews", value: "342", icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Average Rating", value: "4.8", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Bookmarks", value: "1,290", icon: Bookmark, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Shares", value: "860", icon: Share2, color: "text-pink-600", bg: "bg-pink-50" },
];

const upcomingTasks = [
  { label: 'Complete draft chapter for "Future Trends"', due: "Due in 3 days", completed: false },
  { label: 'Review proof copy of "Money Mindset"', due: "Completed", completed: true },
  { label: 'Approve cover design for "Health & Wellness Guide"', due: "Due in 5 days", completed: false },
  { label: 'Respond to reader feedback on "Financial Freedom"', due: "Due in 1 week", completed: false },
  { label: "Submit next manuscript draft", due: "Due in 2 weeks", completed: false },
];

const achievements = [
  { label: "First Published Book", icon: BookOpen, unlocked: true, bg: "bg-[#D8B27A]/20", color: "text-[#D8B27A]" },
  { label: "Top Selling Author", icon: Trophy, unlocked: true, bg: "bg-amber-100", color: "text-amber-600" },
  { label: "100 Sales Club", icon: Target, unlocked: true, bg: "bg-emerald-100", color: "text-emerald-600" },
  { label: "Verified Author", icon: Shield, unlocked: true, bg: "bg-blue-100", color: "text-blue-600" },
  { label: "5-Star Rating", icon: Star, unlocked: false, bg: "bg-gray-100", color: "text-gray-400" },
];

const earningsBreakdown = [
  { name: "Book Sales", value: 6200, color: "#8A6A4A" },
  { name: "Publishing Services", value: 1320, color: "#D8B27A" },
  { name: "Affiliate Earnings", value: 500, color: "#F2D8BE" },
  { name: "Bonuses", value: 400, color: "#E8DDD0" },
];

export default function AuthorDashboardPage() {
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({ 1: true });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", category: "", description: "", file: "" });

  const toggleTask = (index: number) => {
    setCompletedTasks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Welcome Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">
          Welcome back, Author
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your books today.
        </p>
      </motion.div>

      {/* 2. Summary Cards */}
      <motion.div variants={item} className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl border border-[#E8DDD0] p-5 cursor-pointer transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1D1D1D]">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                {stat.trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
                <span className={stat.trend === "up" ? "text-emerald-500" : "text-muted-foreground"}>
                  {stat.change}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* 3. Monthly Performance Strip */}
      <motion.div variants={item}>
        <div className="flex flex-wrap gap-3">
          {performanceStrip.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 bg-[#F2D8BE]/10 rounded-lg px-4 py-2.5 border border-[#E8DDD0]/50">
              <stat.icon className="h-4 w-4 text-[#8A6A4A]" />
              <span className="text-sm font-bold text-[#1D1D1D]">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4. Earnings Chart + Quick Actions */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DDD0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1D1D1D]">Monthly Earnings</h3>
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span>+19.6% vs last month</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D8B27A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D8B27A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-[#E8DDD0]" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "#888" }} />
                <YAxis className="text-xs" tick={{ fill: "#888" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E8DDD0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8A6A4A"
                  fill="url(#earningsGradient)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm p-6">
          <h3 className="font-semibold text-[#1D1D1D] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              action.href ? (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="bg-white rounded-xl border border-[#E8DDD0] p-4 cursor-pointer transition-all duration-300 hover:shadow-md"
                  >
                    <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-medium text-[#1D1D1D]">{action.label}</p>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground mt-1" />
                  </motion.div>
                </Link>
              ) : (
                <motion.div
                  key={action.label}
                  whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                  className="bg-white rounded-xl border border-[#E8DDD0] p-4 cursor-pointer transition-all duration-300 hover:shadow-md"
                  onClick={() => setUploadModalOpen(true)}
                >
                  <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-[#1D1D1D]">{action.label}</p>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground mt-1" />
                </motion.div>
              )
            ))}
          </div>
        </div>
      </motion.div>

      {/* 5. Author Analytics Center (Collapsible) */}
      <motion.div variants={item}>
        <div
          className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm overflow-hidden cursor-pointer"
          onClick={() => setAnalyticsOpen(!analyticsOpen)}
        >
          <div className="flex items-center justify-between p-6 pb-4">
            <h3 className="font-semibold text-[#1D1D1D]">Author Analytics Center</h3>
            {analyticsOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <AnimatePresence>
            {analyticsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyticsPanels.map((panel) => (
                    <div key={panel.label} className="bg-white rounded-xl border border-[#E8DDD0] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <panel.icon className={`h-4 w-4 ${panel.color}`} />
                        <span className="text-xs font-medium text-muted-foreground">{panel.label}</span>
                      </div>
                      <p className="text-lg font-bold text-[#1D1D1D]">{panel.value}</p>
                      <p className="text-xs text-muted-foreground mb-3">{panel.detail}</p>
                      <div className="h-1.5 bg-[#F5EDE3] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${panel.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-[#D8B27A] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 6. Author Goals */}
      <motion.div variants={item}>
        <div className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm p-6">
          <h3 className="font-semibold text-[#1D1D1D] mb-4">Author Goals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {goals.map((goal) => {
              const pct = Math.round((goal.current / goal.total) * 100);
              return (
                <div key={goal.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1D1D1D]">{goal.label}</span>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="text-sm font-bold text-[#1D1D1D]">
                    {goal.prefix || ""}{goal.current.toLocaleString()} / {goal.prefix || ""}{goal.total.toLocaleString()}
                  </div>
                  <div className="h-2 bg-[#F5EDE3] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className={`h-full ${goal.color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 7. Book Performance Table */}
      <motion.div variants={item}>
        <div className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="font-semibold text-[#1D1D1D]">Book Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-[#E8DDD0] bg-[#F5EDE3]/30">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Book Title</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Views</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Sales</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Rating</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {bookPerformance.map((book) => (
                  <tr key={book.title} className="border-t border-[#E8DDD0]/50 hover:bg-[#F5EDE3]/50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-[#1D1D1D]">{book.title}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          book.status === "Published"
                            ? "bg-emerald-50 text-emerald-700"
                            : book.status === "Draft"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">{book.views}</td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">{book.sales || "—"}</td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">
                      {book.rating ? (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {book.rating}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-[#1D1D1D]">{book.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* 8. Notifications Panel */}
      <motion.div variants={item}>
        <div className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#8A6A4A]" />
              <h3 className="font-semibold text-[#1D1D1D]">Notifications</h3>
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Mark all read
            </Button>
          </div>
          <div className="space-y-3">
            {notifications.map((notif, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F5EDE3]/50 transition-colors">
                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${notif.unread ? "bg-blue-500" : "bg-transparent"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1D1D1D]">{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 9. Reader Engagement */}
      <motion.div variants={item}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {readerEngagement.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-[#E8DDD0] p-4 text-center">
              <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold text-[#1D1D1D]">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 10. Upcoming Tasks */}
      <motion.div variants={item}>
        <div className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm p-6">
          <h3 className="font-semibold text-[#1D1D1D] mb-4">Upcoming Tasks</h3>
          <div className="space-y-3">
            {upcomingTasks.map((task, i) => {
              const done = completedTasks[i] || task.completed;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    done ? "bg-[#F5EDE3]/30" : "hover:bg-[#F5EDE3]/50"
                  }`}
                >
                  <button
                    onClick={() => toggleTask(i)}
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      done
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-[#E8DDD0] hover:border-[#D8B27A]"
                    }`}
                  >
                    {done && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${done ? "line-through text-muted-foreground" : "text-[#1D1D1D]"}`}>
                      {task.label}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{task.due}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 11. Achievements */}
      <motion.div variants={item}>
        <div className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm p-6">
          <h3 className="font-semibold text-[#1D1D1D] mb-4">Achievements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.label}
                className={`rounded-xl border p-4 text-center transition-all duration-300 ${
                  ach.unlocked
                    ? "border-[#E8DDD0] bg-white hover:shadow-md"
                    : "border-[#E8DDD0]/50 bg-[#F5EDE3]/30 opacity-50"
                }`}
              >
                <div className={`h-12 w-12 rounded-full ${ach.bg} flex items-center justify-center mx-auto mb-2`}>
                  {ach.unlocked ? (
                    <ach.icon className={`h-6 w-6 ${ach.color}`} />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <p className="text-xs font-medium text-[#1D1D1D]">{ach.label}</p>
                {ach.unlocked && (
                  <span className="inline-flex items-center mt-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    Unlocked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 12. Earnings Breakdown + Recent Activity Timeline (2-col) */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm p-6">
          <h3 className="font-semibold text-[#1D1D1D] mb-4">Earnings Breakdown</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={earningsBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {earningsBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E8DDD0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [`$${value}`, "Amount"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-8 mb-4">
            <p className="text-2xl font-bold text-[#1D1D1D]">$8,420</p>
            <p className="text-xs text-muted-foreground">Total Earnings</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {earningsBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <span className="text-xs font-medium text-[#1D1D1D] ml-auto">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm p-6">
          <h3 className="font-semibold text-[#1D1D1D] mb-4">Recent Activity</h3>
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-[#E8DDD0]" />
            <div className="space-y-5">
              {activityTimeline.map((act, i) => (
                <div key={i} className="flex gap-3 relative">
                  <div className={`h-8 w-8 rounded-full ${act.color} flex items-center justify-center flex-shrink-0 z-10`}>
                    <act.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-[#1D1D1D]">{act.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upload New Book Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New Book</DialogTitle>
            <DialogDescription>
              Start your publishing journey by adding a new book.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="book-title">Book Title</Label>
              <Input
                id="book-title"
                placeholder="Enter your book title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="book-category">Category</Label>
              <Select value={uploadForm.category} onValueChange={(v) => setUploadForm({ ...uploadForm, category: v })}>
                <SelectTrigger id="book-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                  <SelectItem value="self-help">Self-Help</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="poetry">Poetry</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="book-desc">Description</Label>
              <Textarea
                id="book-desc"
                placeholder="Brief description of your book..."
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Manuscript File</Label>
              <div className="rounded-lg border-2 border-dashed border-[#E8DDD0] p-6 text-center hover:border-[#D8B27A] transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-[#8A6A4A] mx-auto mb-2" />
                <p className="text-sm text-[#6A4E37]">Drop your manuscript here or click to browse</p>
                <p className="text-xs text-[#8A6A4A] mt-1">PDF, DOCX, or EPUB up to 50MB</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => setUploadModalOpen(false)}
              className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
              disabled={!uploadForm.title}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
