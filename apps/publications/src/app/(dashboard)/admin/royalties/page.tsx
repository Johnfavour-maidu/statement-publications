"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Users,
  RefreshCw,
  Wallet,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

interface RoyaltyAuthor {
  name: string | null;
  email: string | null;
}

interface RoyaltyBook {
  title: string | null;
}

interface RoyaltyItem {
  id: string;
  amount: number;
  commission: number;
  netAmount: number;
  period: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  author: RoyaltyAuthor | null;
  book: RoyaltyBook | null;
}

interface RoyaltySummary {
  totalPaid: number;
  totalPending: number;
  totalCommissions: number;
  authorCount: number;
}

interface RoyaltyData {
  items: RoyaltyItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: RoyaltySummary;
}

const statusConfig: Record<
  string,
  { label: string; color: string }
> = {
  PAID: {
    label: "Paid",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  PENDING: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
};

const tabs = [
  { key: "all", label: "All" },
  { key: "PAID", label: "Paid" },
  { key: "PENDING", label: "Pending" },
  { key: "PROCESSING", label: "Processing" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

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

export default function AdminRoyaltiesPage() {
  const [data, setData] = useState<RoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const fetchRoyalties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "10" });
      if (activeTab !== "all") params.set("status", activeTab);
      const res = await fetch(`/api/admin/royalties?${params}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [page, activeTab]);

  useEffect(() => {
    fetchRoyalties();
  }, [fetchRoyalties]);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setPage(1);
  };

  const summary = data?.summary;
  const stats = [
    {
      label: "Total Paid",
      value: summary?.totalPaid ?? 0,
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Total Pending",
      value: summary?.totalPending ?? 0,
      icon: Wallet,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Total Commissions",
      value: summary?.totalCommissions ?? 0,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Unique Authors",
      value: summary?.authorCount ?? 0,
      icon: Users,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-100 dark:bg-violet-900/30",
    },
  ];

  const chartData = (() => {
    if (!data?.items?.length) return [];
    const map = new Map<string, { royalties: number; commission: number }>();
    for (const r of data.items) {
      const key = r.period || r.createdAt?.slice(0, 7) || "Unknown";
      const existing = map.get(key) || { royalties: 0, commission: 0 };
      existing.royalties += r.netAmount;
      existing.commission += r.commission;
      map.set(key, existing);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({ month, ...values }));
  })();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div
        variants={item}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Royalty Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage author royalties and commissions.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRoyalties}
          disabled={loading}
          className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a568]"
        >
          <RefreshCw
            className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.label === "Unique Authors"
                      ? stat.value.toLocaleString()
                      : formatCurrency(stat.value)}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Royalty Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        "",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="royalties"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="commission"
                      stroke="#D8B27A"
                      fill="#D8B27A"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Author Royalties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#D8B27A]" />
                <span className="text-muted-foreground">
                  Platform Commission
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Royalty Reports</CardTitle>
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTabChange(tab.key)}
                  className={
                    activeTab === tab.key
                      ? "bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a568]"
                      : ""
                  }
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !data?.items?.length ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                No royalties found
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Paid At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((royalty) => {
                      const statusInfo =
                        statusConfig[royalty.status] || statusConfig.PENDING;
                      return (
                        <TableRow key={royalty.id}>
                          <TableCell>
                            {royalty.author?.name ?? "—"}
                          </TableCell>
                          <TableCell>
                            {royalty.book?.title ?? "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(royalty.amount)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(royalty.commission)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(royalty.netAmount)}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{royalty.period}</TableCell>
                          <TableCell>
                            {royalty.paidAt
                              ? formatDate(royalty.paidAt)
                              : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {data.totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Page {data.page} of {data.totalPages} ({data.total}{" "}
                      total)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) => Math.min(data.totalPages, p + 1))
                        }
                        disabled={page >= data.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
