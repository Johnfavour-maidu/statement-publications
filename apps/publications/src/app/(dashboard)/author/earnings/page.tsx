"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Download,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
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

const monthlyEarnings = [
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

const royaltyPayments = [
  { month: "May 2026", amount: 420, status: "paid", date: "Jun 1, 2026" },
  { month: "April 2026", amount: 385, status: "paid", date: "May 1, 2026" },
  { month: "March 2026", amount: 512, status: "paid", date: "Apr 1, 2026" },
  { month: "February 2026", amount: 301, status: "paid", date: "Mar 1, 2026" },
  { month: "January 2026", amount: 278, status: "paid", date: "Feb 1, 2026" },
  { month: "December 2025", amount: 342, status: "paid", date: "Jan 1, 2026" },
  { month: "June 2026", amount: 480, status: "processing", date: "Processing" },
  { month: "July 2026", amount: 0, status: "scheduled", date: "Scheduled" },
];

const transactions = [
  { id: "TXN-001", book: "Financial Freedom", type: "Sale", amount: 12.99, date: "2 hours ago", status: "completed" },
  { id: "TXN-002", book: "Income Is A Skill", type: "Sale", amount: 15.99, date: "5 hours ago", status: "completed" },
  { id: "TXN-003", book: "Financial Freedom", type: "Royalty", amount: 342.50, date: "1 day ago", status: "completed" },
  { id: "TXN-004", book: "Money Mindset", type: "Sale", amount: 9.99, date: "2 days ago", status: "completed" },
  { id: "TXN-005", book: "Income Is A Skill", type: "Royalty", amount: 189.75, date: "3 days ago", status: "completed" },
  { id: "TXN-006", book: "The Wealth Blueprint", type: "Sale", amount: 18.99, date: "4 days ago", status: "pending" },
  { id: "TXN-007", book: "Financial Freedom", type: "Sale", amount: 12.99, date: "5 days ago", status: "completed" },
  { id: "TXN-008", book: "Money Mindset", type: "Royalty", amount: 256.30, date: "1 week ago", status: "completed" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: "Paid", color: "text-emerald-700", bg: "bg-emerald-100" },
  processing: { label: "Processing", color: "text-amber-700", bg: "bg-amber-100" },
  scheduled: { label: "Scheduled", color: "text-blue-700", bg: "bg-blue-100" },
};

export default function AuthorEarningsPage() {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalEarned = 12459.82;
  const availableBalance = 3241.50;
  const pending = 1234.00;
  const thisMonthRoyalty = 420;

  const stats = [
    { label: "Total Earned", value: `$${totalEarned.toLocaleString()}`, change: "+18.2% this month", trend: "up" as const, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Available Balance", value: `$${availableBalance.toLocaleString()}`, change: "Royalties paid monthly", trend: "neutral" as const, icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending", value: `$${pending.toLocaleString()}`, change: "Processing 3 sales", trend: "neutral" as const, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "This Month Royalty", value: `$${thisMonthRoyalty}`, change: "Paid on Jun 1", trend: "up" as const, icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Earnings</h1>
          <p className="text-[#6A4E37]">
            Track your revenue, royalties, and financial performance.
          </p>
        </div>
        <Button variant="outline" className="border-[#E8DDD0]">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-[#E8DDD0]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#6A4E37]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1D1D1D]">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                {stat.trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
                <span className={stat.trend === "up" ? "text-emerald-500" : "text-[#6A4E37]"}>{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Monthly Earnings Chart */}
      <motion.div variants={item}>
        <Card className="border border-[#E8DDD0]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Monthly Earnings</CardTitle>
            <Badge variant="secondary" className="text-xs">Last 12 months</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#888" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#888" }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #E8DDD0", borderRadius: "8px" }}
                    formatter={(value) => [`$${value}`, "Earnings"]}
                  />
                  <Line type="monotone" dataKey="earnings" stroke="#D8B27A" strokeWidth={2} dot={{ fill: "#D8B27A", r: 4 }} activeDot={{ r: 6, fill: "#D8B27A" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Royalty Payment History */}
      <motion.div variants={item}>
        <Card className="border border-[#E8DDD0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#8A6A4A]" />
              Royalty Payments
            </CardTitle>
            <p className="text-sm text-[#6A4E37]">Statement Publications pays royalties monthly on the 1st.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {royaltyPayments.map((payment, i) => {
                const status = statusConfig[payment.status];
                return (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-[#E8DDD0]/50 p-4 hover:bg-[#F5EDE3]/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-lg p-2.5 ${status.bg}`}>
                        {payment.status === "paid" ? (
                          <CheckCircle2 className={`h-5 w-5 ${status.color}`} />
                        ) : payment.status === "processing" ? (
                          <Clock className={`h-5 w-5 ${status.color}`} />
                        ) : (
                          <Calendar className={`h-5 w-5 ${status.color}`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#1D1D1D]">{payment.month}</p>
                        <p className="text-xs text-[#6A4E37]">{payment.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[#1D1D1D]">
                        {payment.amount > 0 ? `$${payment.amount}` : "—"}
                      </span>
                      <Badge className={`${status.bg} ${status.color} border-0`}>{status.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction History */}
      <motion.div variants={item}>
        <Card className="border border-[#E8DDD0]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Transaction History</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              <Download className="mr-2 h-3.5 w-3.5" />
              Export
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-[#E8DDD0] bg-[#F5EDE3]/30">
                    <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Book</th>
                    <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Type</th>
                    <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-[#6A4E37] px-4 py-3">Status</th>
                    <th className="text-right text-xs font-semibold text-[#6A4E37] px-4 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((txn) => (
                    <tr key={txn.id} className="border-t border-[#E8DDD0]/50 hover:bg-[#F5EDE3]/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm text-[#1D1D1D]">{txn.book}</p>
                        <p className="text-xs text-[#6A4E37]">{txn.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={txn.type === "Royalty" ? "secondary" : "outline"} className="text-xs">{txn.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6A4E37]">{txn.date}</td>
                      <td className="px-4 py-3">
                        <Badge className={txn.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                          {txn.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-emerald-600">+${txn.amount.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#E8DDD0] px-4 py-3">
                <p className="text-sm text-[#6A4E37]">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, transactions.length)} of {transactions.length}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="border-[#E8DDD0]">Previous</Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="border-[#E8DDD0]">Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
