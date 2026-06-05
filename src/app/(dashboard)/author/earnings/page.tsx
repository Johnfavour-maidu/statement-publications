"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowDownToLine,
  Download,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
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
import { formatCurrency, formatDate } from "@/lib/utils";

const earningsStats = [
  {
    label: "Total Earnings",
    value: "$12,459.82",
    change: "+18.2% this month",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Available Balance",
    value: "$3,241.50",
    change: "Ready to withdraw",
    trend: "neutral" as const,
    icon: Wallet,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    label: "Pending",
    value: "$1,234.00",
    change: "Processing 3 sales",
    trend: "neutral" as const,
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    label: "Withdrawn",
    value: "$7,984.32",
    change: "Last: $500 on May 28",
    trend: "neutral" as const,
    icon: ArrowDownToLine,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
];

const earningsOverTime = [
  { month: "Jan", earnings: 820 },
  { month: "Feb", earnings: 932 },
  { month: "Mar", earnings: 1101 },
  { month: "Apr", earnings: 1034 },
  { month: "May", earnings: 1290 },
  { month: "Jun", earnings: 1438 },
  { month: "Jul", earnings: 1200 },
  { month: "Aug", earnings: 1380 },
  { month: "Sep", earnings: 1540 },
  { month: "Oct", earnings: 1620 },
  { month: "Nov", earnings: 1480 },
  { month: "Dec", earnings: 1658 },
];

const transactions = [
  {
    id: "TXN-001",
    type: "sale",
    description: "Sale: The Last Horizon (EBOOK)",
    amount: 12.99,
    date: new Date(Date.now() - 3600000).toISOString(),
    status: "completed" as const,
  },
  {
    id: "TXN-002",
    type: "sale",
    description: "Sale: Echoes of Tomorrow (PAPERBACK)",
    amount: 15.99,
    date: new Date(Date.now() - 7200000).toISOString(),
    status: "completed" as const,
  },
  {
    id: "TXN-003",
    type: "withdrawal",
    description: "Withdrawal to Bank Account",
    amount: -500.0,
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: "completed" as const,
  },
  {
    id: "TXN-004",
    type: "sale",
    description: "Sale: Whispers in the Dark (EBOOK)",
    amount: 9.99,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "completed" as const,
  },
  {
    id: "TXN-005",
    type: "royalty",
    description: "Monthly Royalty - May 2026",
    amount: 342.5,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "completed" as const,
  },
  {
    id: "TXN-006",
    type: "sale",
    description: "Sale: Beyond the Stars (HARDCOVER)",
    amount: 18.99,
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: "pending" as const,
  },
  {
    id: "TXN-007",
    type: "withdrawal",
    description: "Withdrawal to Bank Account",
    amount: -750.0,
    date: new Date(Date.now() - 86400000 * 14).toISOString(),
    status: "completed" as const,
  },
  {
    id: "TXN-008",
    type: "sale",
    description: "Sale: River of Shadows (PAPERBACK)",
    amount: 12.99,
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: "completed" as const,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorEarningsPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground">
            Track your revenue, payouts, and financial performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {earningsStats.map((stat) => (
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
                <span className="text-muted-foreground">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Earnings Over Time</CardTitle>
            <Badge variant="secondary">Last 12 months</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`$${value}`, "Earnings"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <Button variant="ghost" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Transaction
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              txn.type === "withdrawal"
                                ? "bg-amber-100 dark:bg-amber-900/30"
                                : "bg-emerald-100 dark:bg-emerald-900/30"
                            }`}
                          >
                            {txn.type === "withdrawal" ? (
                              <ArrowDownToLine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {txn.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {txn.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(txn.date)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            txn.status === "completed" ? "success" : "warning"
                          }
                        >
                          {txn.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`text-sm font-semibold ${
                            txn.amount >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-foreground"
                          }`}
                        >
                          {txn.amount >= 0 ? "+" : ""}
                          {formatCurrency(txn.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
