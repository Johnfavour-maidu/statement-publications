"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
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
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

const topBooks = [
  { title: "Financial Freedom", sales: 342, revenue: 2640, rating: 4.8, views: 12450 },
  { title: "Income Is A Skill", sales: 268, revenue: 2180, rating: 4.7, views: 9820 },
  { title: "Money Mindset", sales: 195, revenue: 1420, rating: 4.6, views: 8340 },
  { title: "The Wealth Blueprint", sales: 148, revenue: 980, rating: 4.5, views: 6890 },
  { title: "Master Your Spending", sales: 112, revenue: 640, rating: 4.4, views: 5420 },
];

const royaltyPayments = [
  { month: "Jun 2026", amount: 480, status: "processing" },
  { month: "May 2026", amount: 420, status: "paid" },
  { month: "Apr 2026", amount: 385, status: "paid" },
  { month: "Mar 2026", amount: 512, status: "paid" },
  { month: "Feb 2026", amount: 301, status: "paid" },
  { month: "Jan 2026", amount: 278, status: "paid" },
];

const summaryCards = [
  { label: "Total Revenue", value: "$5,460", change: "+30% vs last quarter", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Total Sales", value: "328", change: "+42 this month", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Views", value: "47,520", change: "+24% growth", icon: Eye, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Avg Rating", value: "4.7", change: "Across 12 books", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Readers", value: "3,120", change: "+540 this month", icon: Users, color: "text-pink-600", bg: "bg-pink-50" },
  { label: "Royalties", value: "$2,376", change: "6 months total", icon: TrendingUp, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]" },
];

export default function AuthorReportsPage() {
  const [revenueOpen, setRevenueOpen] = useState(true);
  const [booksOpen, setBooksOpen] = useState(true);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Reports</h1>
          <p className="text-[#6A4E37]">Track your book performance, revenue, and reader engagement.</p>
        </div>
        <Button variant="outline" className="border-[#E8DDD0]">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border border-[#E8DDD0]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2.5 ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#1D1D1D]">{card.value}</p>
                  <p className="text-xs text-[#6A4E37]">{card.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Revenue Analytics */}
      <motion.div variants={item}>
        <Card className="border border-[#E8DDD0]">
          <button onClick={() => setRevenueOpen(!revenueOpen)} className="flex w-full items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-[#8A6A4A]" />
              <h3 className="font-semibold text-[#1D1D1D]">Revenue Analytics</h3>
            </div>
            {revenueOpen ? <ChevronUp className="h-5 w-5 text-[#6A4E37]" /> : <ChevronDown className="h-5 w-5 text-[#6A4E37]" />}
          </button>
          {revenueOpen && (
            <div className="grid gap-4 p-4 pt-0 sm:grid-cols-2">
              <div className="bg-white rounded-xl border border-[#E8DDD0] p-4">
                <h4 className="font-medium text-[#1D1D1D] mb-3 text-sm">Monthly Revenue</h4>
                <ResponsiveContainer width="100%" height={250}>
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
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E8DDD0" }} formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#8A6A4A" fill="url(#revGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl border border-[#E8DDD0] p-4">
                <h4 className="font-medium text-[#1D1D1D] mb-3 text-sm">Sales Trend</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E8DDD0" }} />
                    <Bar dataKey="sales" fill="#D8B27A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Views & Reader Growth */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-[#E8DDD0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#8A6A4A]" />
              Views Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E8DDD0" }} />
                <Line type="monotone" dataKey="views" stroke="#8A6A4A" strokeWidth={2} dot={{ fill: "#D8B27A", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-[#E8DDD0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-[#8A6A4A]" />
              Reader Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
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
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E8DDD0" }} />
                <Area type="monotone" dataKey="readers" stroke="#8A6A4A" fill="url(#readerGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Performance + Royalty Payments */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-[#E8DDD0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#8A6A4A]" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryPerformance} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E8DDD0" }} formatter={(value) => [`${value}%`, "Share"]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-[#E8DDD0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#8A6A4A]" />
              Royalty Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {royaltyPayments.map((payment, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-[#E8DDD0]/50 p-3 hover:bg-[#F5EDE3]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${payment.status === "paid" ? "bg-emerald-100" : "bg-amber-100"}`}>
                    <DollarSign className={`h-4 w-4 ${payment.status === "paid" ? "text-emerald-600" : "text-amber-600"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1D]">{payment.month}</p>
                    <p className="text-xs text-[#6A4E37]">{payment.status === "paid" ? "Paid" : "Processing"}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-[#1D1D1D]">${payment.amount}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Performing Books */}
      <motion.div variants={item}>
        <Card className="border border-[#E8DDD0]">
          <button onClick={() => setBooksOpen(!booksOpen)} className="flex w-full items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#8A6A4A]" />
              <h3 className="font-semibold text-[#1D1D1D]">Top Performing Books</h3>
            </div>
            {booksOpen ? <ChevronUp className="h-5 w-5 text-[#6A4E37]" /> : <ChevronDown className="h-5 w-5 text-[#6A4E37]" />}
          </button>
          {booksOpen && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-[#E8DDD0] bg-[#F5EDE3]/30">
                    <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">#</th>
                    <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Book</th>
                    <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Sales</th>
                    <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Revenue</th>
                    <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Views</th>
                    <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topBooks.map((book, i) => (
                    <tr key={book.title} className="border-t border-[#E8DDD0]/50 hover:bg-[#F5EDE3]/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-[#8A6A4A]">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#1D1D1D]">{book.title}</td>
                      <td className="px-4 py-3 text-sm text-[#6A4E37]">{book.sales.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#1D1D1D]">${book.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-[#6A4E37]">{book.views.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm text-[#1D1D1D]">{book.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
