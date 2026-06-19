"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  ShoppingCart,
  DollarSign,
  Clock,
  Upload,
  Eye,
  User,
  ArrowUpRight,
  MoreHorizontal,
  Star,
  CheckCircle2,
  Trophy,
  File,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface StatsData {
  overview: {
    totalBooks: number;
    publishedBooks: number;
    draftBooks: number;
    underReviewBooks: number;
    rejectedBooks: number;
    totalSales: number;
    totalRevenue: number;
    revenueThisMonth: number;
    pendingPayouts: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number; sales: number }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    amount?: number;
    createdAt: string;
  }>;
}

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
  const { data: session } = useSession();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/author/stats")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setStats(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const userName = session?.user?.name?.split(" ")[0] || "Author";

  const statCards = stats
    ? [
        {
          label: "Total Books",
          value: stats.overview.totalBooks.toString(),
          change: `${stats.overview.publishedBooks} published`,
          trend: "up" as const,
          icon: BookOpen,
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-100 dark:bg-blue-900/30",
        },
        {
          label: "Published",
          value: stats.overview.publishedBooks.toString(),
          change: `${stats.overview.draftBooks} drafts`,
          trend: "up" as const,
          icon: CheckCircle2,
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
        },
        {
          label: "Drafts",
          value: stats.overview.draftBooks.toString(),
          change: `${stats.overview.underReviewBooks} under review`,
          trend: "neutral" as const,
          icon: File,
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-100 dark:bg-gray-900/30",
        },
        {
          label: "Pending Reviews",
          value: stats.overview.underReviewBooks.toString(),
          change: `${stats.overview.rejectedBooks} rejected`,
          trend: "neutral" as const,
          icon: Eye,
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-100 dark:bg-amber-900/30",
        },
        {
          label: "Total Earnings",
          value: formatCurrency(stats.overview.totalRevenue),
          change: `${formatCurrency(stats.overview.revenueThisMonth)} this month`,
          trend: "up" as const,
          icon: DollarSign,
          color: "text-violet-600 dark:text-violet-400",
          bg: "bg-violet-100 dark:bg-violet-900/30",
        },
        {
          label: "Active Orders",
          value: stats.overview.totalSales.toString(),
          change: `${formatCurrency(stats.overview.pendingPayouts)} pending`,
          trend: "neutral" as const,
          icon: ShoppingCart,
          color: "text-pink-600 dark:text-pink-400",
          bg: "bg-pink-100 dark:bg-pink-900/30",
        },
      ]
    : [];

  const quickActions = [
    {
      label: "Create New Book",
      href: "/author/books/new",
      icon: Upload,
      color: "bg-[#D8B27A] text-[#1D1D1D]",
    },
    {
      label: "Order Service",
      href: "/services",
      icon: ShoppingCart,
      color: "bg-emerald-600 text-white",
    },
    {
      label: "Request Withdrawal",
      href: "/author/earnings",
      icon: DollarSign,
      color: "bg-violet-600 text-white",
    },
  ];

  const onboardingSteps = [
    { label: "Verify Email", completed: true },
    { label: "Complete Profile", completed: true },
    { label: "Upload Photo", completed: false },
    { label: "First Book", completed: (stats?.overview.totalBooks ?? 0) > 0 },
    { label: "First Service", completed: false },
  ];

  const achievements = [
    { label: "First Book", icon: BookOpen, unlocked: (stats?.overview.totalBooks ?? 0) > 0 },
    { label: "Bestseller", icon: Trophy, unlocked: false },
    { label: "100 Downloads", icon: Download, unlocked: (stats?.overview.totalSales ?? 0) >= 100 },
    { label: "Verified Author", icon: CheckCircle2, unlocked: false },
  ];

  if (loading) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={item}>
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded mt-2" />
        </motion.div>
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your books today.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
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
            <CardTitle>Monthly Earnings</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyRevenue || []}>
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
                    formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D8B27A"
                    fill="#D8B27A"
                    fillOpacity={0.2}
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
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/author/earnings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats?.recentActivity || []).slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D8B27A]/10">
                    <DollarSign className="h-5 w-5 text-[#D8B27A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.createdAt, "relative")}
                    </p>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(activity.amount)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {onboardingSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    step.completed
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    step.completed ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
                {step.completed && (
                  <Badge variant="success" className="ml-auto">
                    Done
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Achievement Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.label}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${
                    achievement.unlocked
                      ? "border-[#D8B27A] bg-[#D8B27A]/5"
                      : "border-muted opacity-50"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      achievement.unlocked
                        ? "bg-[#D8B27A]/20 text-[#D8B27A]"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <achievement.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-center">
                    {achievement.label}
                  </span>
                  {achievement.unlocked && (
                    <Badge variant="success" className="text-[10px]">
                      Unlocked
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}


