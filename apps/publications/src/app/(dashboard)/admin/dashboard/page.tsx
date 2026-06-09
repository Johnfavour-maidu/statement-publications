"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  UserCheck,
  BookOpen,
  ShoppingCart,
  DollarSign,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  FileText,
  Settings,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

const stats = [
  {
    label: "Total Users",
    value: "12,847",
    change: 12.5,
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    label: "Total Authors",
    value: "1,234",
    change: 8.2,
    icon: UserCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Total Books",
    value: "3,456",
    change: 15.3,
    icon: BookOpen,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    label: "Total Sales",
    value: "48,291",
    change: 22.1,
    icon: ShoppingCart,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    label: "Revenue",
    value: "$847,230",
    change: 18.7,
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Royalties Paid",
    value: "$523,410",
    change: 14.2,
    icon: Wallet,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-900/30",
  },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 42000, royalties: 25200 },
  { month: "Feb", revenue: 48000, royalties: 28800 },
  { month: "Mar", revenue: 55000, royalties: 33000 },
  { month: "Apr", revenue: 51000, royalties: 30600 },
  { month: "May", revenue: 62000, royalties: 37200 },
  { month: "Jun", revenue: 68000, royalties: 40800 },
  { month: "Jul", revenue: 58000, royalties: 34800 },
  { month: "Aug", revenue: 72000, royalties: 43200 },
  { month: "Sep", revenue: 78000, royalties: 46800 },
  { month: "Oct", revenue: 85000, royalties: 51000 },
  { month: "Nov", revenue: 79000, royalties: 47400 },
  { month: "Dec", revenue: 92000, royalties: 55200 },
];

const publishingGrowth = [
  { month: "Jan", books: 120, authors: 45 },
  { month: "Feb", books: 135, authors: 52 },
  { month: "Mar", books: 158, authors: 61 },
  { month: "Apr", books: 142, authors: 48 },
  { month: "May", books: 175, authors: 72 },
  { month: "Jun", books: 190, authors: 78 },
  { month: "Jul", books: 168, authors: 65 },
  { month: "Aug", books: 205, authors: 85 },
  { month: "Sep", books: 220, authors: 92 },
  { month: "Oct", books: 245, authors: 105 },
  { month: "Nov", books: 230, authors: 98 },
  { month: "Dec", books: 260, authors: 112 },
];

const topSellingBooks = [
  {
    id: "1",
    title: "The Silent Echo",
    author: "Amara Okafor",
    sales: 2847,
    revenue: 36982.53,
    rating: 4.8,
    category: "Fiction",
  },
  {
    id: "2",
    title: "Whispers of the Forgotten",
    author: "David Mensah",
    sales: 2134,
    revenue: 27714.66,
    rating: 4.7,
    category: "Mystery",
  },
  {
    id: "3",
    title: "River of Stars",
    author: "Fatima Al-Rashid",
    sales: 1892,
    revenue: 35917.08,
    rating: 4.9,
    category: "Science Fiction",
  },
  {
    id: "4",
    title: "Crimson Horizons",
    author: "Nadia El-Amin",
    sales: 1654,
    revenue: 28084.46,
    rating: 4.6,
    category: "Romance",
  },
  {
    id: "5",
    title: "Midnight Echoes",
    author: "Kwame Asante",
    sales: 1423,
    revenue: 21334.77,
    rating: 4.5,
    category: "Thriller",
  },
];

const recentActivity = [
  {
    id: "1",
    type: "book_submitted",
    message: "Amara Okafor submitted 'Shadows of Yesterday' for review",
    time: new Date(Date.now() - 1800000).toISOString(),
    icon: FileText,
    color: "text-blue-500",
  },
  {
    id: "2",
    type: "withdrawal",
    message: "David Mensah requested withdrawal of $245.00",
    time: new Date(Date.now() - 3600000).toISOString(),
    icon: Wallet,
    color: "text-amber-500",
  },
  {
    id: "3",
    type: "author_joined",
    message: "Nadia El-Amin registered as a new author",
    time: new Date(Date.now() - 7200000).toISOString(),
    icon: Users,
    color: "text-emerald-500",
  },
  {
    id: "4",
    type: "book_approved",
    message: "Admin approved 'The Golden Path' by Tariq Hassan",
    time: new Date(Date.now() - 14400000).toISOString(),
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  {
    id: "5",
    type: "review_flagged",
    message: "A review on 'Beyond the Horizon' was flagged for moderation",
    time: new Date(Date.now() - 21600000).toISOString(),
    icon: AlertCircle,
    color: "text-red-500",
  },
  {
    id: "6",
    type: "payout",
    message: "Monthly royalties of $4,320.00 processed for 45 authors",
    time: new Date(Date.now() - 43200000).toISOString(),
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
];

const quickActions = [
  {
    label: "Review Books",
    href: "/admin/books",
    icon: BookOpen,
    color: "bg-blue-600 text-white",
    pending: 12,
  },
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: Users,
    color: "bg-emerald-600 text-white",
  },
  {
    label: "Process Payouts",
    href: "/admin/payouts",
    icon: Wallet,
    color: "bg-violet-600 text-white",
    pending: 8,
  },
  {
    label: "Content Manager",
    href: "/admin/content",
    icon: Settings,
    color: "bg-amber-600 text-white",
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

export default function AdminDashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of Statement Publications platform activity.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">
                  +{stat.change}%
                </span>
                <span className="text-muted-foreground">from last month</span>
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
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="royalties"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
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
                  {action.pending && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {action.pending} pending
                    </Badge>
                  )}
                  {!action.pending && (
                    <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  )}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Publishing Growth</CardTitle>
            <Badge variant="secondary">Last 12 months</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={publishingGrowth}>
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
                  <Line
                    type="monotone"
                    dataKey="books"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="authors"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Books Published</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">New Authors</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="mt-0.5">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.time, "relative")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Selling Books</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/books">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellingBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{book.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {book.sales.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(book.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <TrendingUp className="h-3 w-3 text-amber-500" />
                        {book.rating}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
