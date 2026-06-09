"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  Upload,
  Eye,
  User,
  ArrowUpRight,

  MoreHorizontal,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

const stats = [
  {
    label: "Total Books",
    value: "12",
    change: "+2 this month",
    trend: "up" as const,
    icon: BookOpen,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    label: "Total Sales",
    value: "1,847",
    change: "+124 this month",
    trend: "up" as const,
    icon: ShoppingCart,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Total Earnings",
    value: "$12,459",
    change: "+18.2% vs last month",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    label: "Pending Payouts",
    value: "$1,234",
    change: "Next payout in 5 days",
    trend: "neutral" as const,
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 820, sales: 98 },
  { month: "Feb", revenue: 932, sales: 112 },
  { month: "Mar", revenue: 1101, sales: 134 },
  { month: "Apr", revenue: 1034, sales: 121 },
  { month: "May", revenue: 1290, sales: 156 },
  { month: "Jun", revenue: 1438, sales: 178 },
  { month: "Jul", revenue: 1200, sales: 142 },
  { month: "Aug", revenue: 1380, sales: 165 },
  { month: "Sep", revenue: 1540, sales: 189 },
  { month: "Oct", revenue: 1620, sales: 198 },
  { month: "Nov", revenue: 1480, sales: 176 },
  { month: "Dec", revenue: 1658, sales: 204 },
];

const performanceData = [
  { week: "W1", views: 320, sales: 42, rating: 4.5 },
  { week: "W2", views: 380, sales: 51, rating: 4.6 },
  { week: "W3", views: 420, sales: 58, rating: 4.7 },
  { week: "W4", views: 510, sales: 67, rating: 4.8 },
  { week: "W5", views: 480, sales: 62, rating: 4.7 },
  { week: "W6", views: 560, sales: 74, rating: 4.9 },
];

const recentSales = [
  {
    id: "1",
    book: "The Last Horizon",
    buyer: "Sarah Johnson",
    amount: 12.99,
    format: "EBOOK",
    date: new Date(Date.now() - 1800000).toISOString(),
    rating: 5,
  },
  {
    id: "2",
    book: "Echoes of Tomorrow",
    buyer: "Michael Chen",
    amount: 15.99,
    format: "PAPERBACK",
    date: new Date(Date.now() - 5400000).toISOString(),
    rating: 4,
  },
  {
    id: "3",
    book: "Whispers in the Dark",
    buyer: "Emily Davis",
    amount: 9.99,
    format: "EBOOK",
    date: new Date(Date.now() - 14400000).toISOString(),
    rating: 5,
  },
  {
    id: "4",
    book: "Beyond the Stars",
    buyer: "James Wilson",
    amount: 18.99,
    format: "HARDCOVER",
    date: new Date(Date.now() - 28800000).toISOString(),
    rating: 4,
  },
  {
    id: "5",
    book: "The Last Horizon",
    buyer: "Lisa Anderson",
    amount: 12.99,
    format: "EBOOK",
    date: new Date(Date.now() - 43200000).toISOString(),
    rating: 5,
  },
];

const quickActions = [
  {
    label: "Upload New Book",
    href: "/author/books/new",
    icon: Upload,
    color: "bg-primary text-primary-foreground",
  },
  {
    label: "View Earnings",
    href: "/author/earnings",
    icon: DollarSign,
    color: "bg-emerald-600 text-white",
  },
  {
    label: "Update Profile",
    href: "/author/profile",
    icon: User,
    color: "bg-violet-600 text-white",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorDashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, Adaeze
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your books today.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : null}
                <span
                  className={
                    stat.trend === "up"
                      ? "text-emerald-500"
                      : "text-muted-foreground"
                  }
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Revenue</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                asChild
              >
                <Link href={action.href}>
                  <div className={`rounded-lg p-2 ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span>{action.label}</span>
                  <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Performance Overview</CardTitle>
            <Badge variant="secondary">Last 6 weeks</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="week"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Sales</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/author/earnings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{sale.book}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.buyer} &middot; {formatDate(sale.date, "relative")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatCurrency(sale.amount)}
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: sale.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
