"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Download,
  ShoppingCart,
  DollarSign,
  Star,
  TrendingUp,
  ArrowUpRight,
  Globe,
  BookOpen,
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
import { formatCurrency, formatDate } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  color: string;
  bg: string;
}

const stats: StatCard[] = [
  {
    label: "Total Views",
    value: "24,589",
    change: "+12.3% this month",
    trend: "up",
    icon: Eye,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    label: "Downloads",
    value: "3,847",
    change: "+8.7% this month",
    trend: "up",
    icon: Download,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    label: "Purchases",
    value: "1,847",
    change: "+15.2% this month",
    trend: "up",
    icon: ShoppingCart,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Revenue",
    value: "$12,459",
    change: "+18.2% this month",
    trend: "up",
    icon: DollarSign,
    color: "text-[#D8B27A]",
    bg: "bg-[#D8B27A]/10",
  },
  {
    label: "Avg Rating",
    value: "4.7",
    change: "+0.2 this month",
    trend: "up",
    icon: Star,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
];

const generateDailyData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: Math.floor(Math.random() * 500) + 200,
      downloads: Math.floor(Math.random() * 80) + 30,
      purchases: Math.floor(Math.random() * 40) + 10,
    });
  }
  return data;
};

const monthlyData = [
  { month: "Jan", views: 4200, downloads: 620, purchases: 280, revenue: 1820 },
  { month: "Feb", views: 3800, downloads: 580, purchases: 260, revenue: 1650 },
  { month: "Mar", views: 5100, downloads: 740, purchases: 350, revenue: 2340 },
  { month: "Apr", views: 4600, downloads: 680, purchases: 310, revenue: 2010 },
  { month: "May", views: 5800, downloads: 820, purchases: 390, revenue: 2680 },
  { month: "Jun", views: 6200, downloads: 910, purchases: 420, revenue: 2980 },
  { month: "Jul", views: 5400, downloads: 780, purchases: 360, revenue: 2450 },
  { month: "Aug", views: 6100, downloads: 870, purchases: 400, revenue: 2820 },
  { month: "Sep", views: 6800, downloads: 950, purchases: 440, revenue: 3120 },
  { month: "Oct", views: 7200, downloads: 1020, purchases: 480, revenue: 3450 },
  { month: "Nov", views: 6500, downloads: 940, purchases: 430, revenue: 3080 },
  { month: "Dec", views: 7800, downloads: 1100, purchases: 510, revenue: 3780 },
];

const geographyData = [
  { name: "Nigeria", value: 35, fill: "#D8B27A" },
  { name: "Kenya", value: 20, fill: "#8A6A4A" },
  { name: "South Africa", value: 15, fill: "#EBC9A8" },
  { name: "Ghana", value: 10, fill: "#F2D8BE" },
  { name: "Other", value: 20, fill: "#1D1D1D" },
];

const bookComparison = [
  { title: "The Last Horizon", views: 8420, downloads: 1240, purchases: 487, revenue: 6327.13, rating: 4.8 },
  { title: "Echoes of Tomorrow", views: 6230, downloads: 980, purchases: 312, revenue: 4991.88, rating: 4.6 },
  { title: "Whispers in the Dark", views: 4890, downloads: 720, purchases: 198, revenue: 1977.02, rating: 4.9 },
  { title: "River of Shadows", views: 3540, downloads: 560, purchases: 234, revenue: 3038.66, rating: 4.7 },
  { title: "Autumn Whispers", views: 2180, downloads: 340, purchases: 89, revenue: 889.11, rating: 4.4 },
  { title: "The Silent Witness", views: 1520, downloads: 280, purchases: 56, revenue: 559.44, rating: 4.3 },
];

const topBooks = [
  { title: "The Last Horizon", revenue: 6327.13, sales: 487, rating: 4.8 },
  { title: "Echoes of Tomorrow", revenue: 4991.88, sales: 312, rating: 4.6 },
  { title: "River of Shadows", revenue: 3038.66, sales: 234, rating: 4.7 },
  { title: "Whispers in the Dark", revenue: 1977.02, sales: 198, rating: 4.9 },
  { title: "Autumn Whispers", revenue: 889.11, sales: 89, rating: 4.4 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorAnalyticsPage() {
  const [dailyData, setDailyData] = useState<ReturnType<typeof generateDailyData>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDailyData(generateDailyData());
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book Analytics</h1>
          <p className="text-muted-foreground">
            Deep insights into your book performance and reader engagement.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Last 30 days
        </Badge>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                {stat.trend === "up" && (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                )}
                <span className="text-emerald-500">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#D8B27A]" />
              Daily Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    interval={4}
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
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#D8B27A"
                    fill="#D8B27A"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke="#8A6A4A"
                    fill="#8A6A4A"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="purchases"
                    stroke="#1D1D1D"
                    fill="#1D1D1D"
                    fillOpacity={0.05}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-[#D8B27A]" />
              Monthly Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
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
                  <Bar dataKey="views" fill="#D8B27A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="purchases" fill="#8A6A4A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Book Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Title</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Views</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Downloads</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Purchases</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {bookComparison.map((book) => (
                    <tr
                      key={book.title}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D8B27A]/10">
                            <BookOpen className="h-4 w-4 text-[#D8B27A]" />
                          </div>
                          <span className="font-medium text-sm">{book.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">{book.views.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm">{book.downloads.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm">{book.purchases.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        {formatCurrency(book.revenue)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm">{book.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#D8B27A]" />
              Reader Geography
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geographyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {geographyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "Share"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Books</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topBooks.map((book, index) => (
              <div
                key={book.title}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D8B27A]/10 text-sm font-bold text-[#D8B27A]">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{book.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {book.sales} sales &middot; {book.rating} avg rating
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#D8B27A]">
                    {formatCurrency(book.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
