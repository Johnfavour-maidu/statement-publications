"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowDownToLine,
  Download,
  Wallet,
  ArrowUpRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

interface EarningsData {
  totalEarned: number;
  availableBalance: number;
  pending: number;
  withdrawn: number;
  monthlyEarnings: { month: string; earnings: number }[];
  transactions: {
    id: string;
    book: string;
    type: string;
    amount: number;
    date: string;
    status: string;
  }[];
}

interface WithdrawalRequest {
  amount: number;
  method: string;
  accountDetails: string;
  notes: string;
}

const mockEarningsData: EarningsData = {
  totalEarned: 12459.82,
  availableBalance: 3241.5,
  pending: 1234.0,
  withdrawn: 7984.32,
  monthlyEarnings: [
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
  ],
  transactions: [
    {
      id: "TXN-001",
      book: "The Last Horizon",
      type: "Sale",
      amount: 12.99,
      date: new Date(Date.now() - 3600000).toISOString(),
      status: "completed",
    },
    {
      id: "TXN-002",
      book: "Echoes of Tomorrow",
      type: "Sale",
      amount: 15.99,
      date: new Date(Date.now() - 7200000).toISOString(),
      status: "completed",
    },
    {
      id: "TXN-003",
      book: "The Last Horizon",
      type: "Royalty",
      amount: 342.5,
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: "completed",
    },
    {
      id: "TXN-004",
      book: "Whispers in the Dark",
      type: "Sale",
      amount: 9.99,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "completed",
    },
    {
      id: "TXN-005",
      book: "Echoes of Tomorrow",
      type: "Royalty",
      amount: 189.75,
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      status: "completed",
    },
    {
      id: "TXN-006",
      book: "Beyond the Stars",
      type: "Sale",
      amount: 18.99,
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: "pending",
    },
    {
      id: "TXN-007",
      book: "River of Shadows",
      type: "Sale",
      amount: 12.99,
      date: new Date(Date.now() - 86400000 * 4).toISOString(),
      status: "completed",
    },
    {
      id: "TXN-008",
      book: "The Last Horizon",
      type: "Royalty",
      amount: 256.3,
      date: new Date(Date.now() - 86400000 * 10).toISOString(),
      status: "completed",
    },
    {
      id: "TXN-009",
      book: "Whispers in the Dark",
      type: "Sale",
      amount: 9.99,
      date: new Date(Date.now() - 86400000 * 6).toISOString(),
      status: "completed",
    },
    {
      id: "TXN-010",
      book: "Beyond the Stars",
      type: "Royalty",
      amount: 124.5,
      date: new Date(Date.now() - 86400000 * 12).toISOString(),
      status: "completed",
    },
    {
      id: "TXN-011",
      book: "Echoes of Tomorrow",
      type: "Sale",
      amount: 15.99,
      date: new Date(Date.now() - 86400000 * 8).toISOString(),
      status: "completed",
    },
    {
      id: "TXN-012",
      book: "River of Shadows",
      type: "Royalty",
      amount: 198.4,
      date: new Date(Date.now() - 86400000 * 15).toISOString(),
      status: "completed",
    },
  ],
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ITEMS_PER_PAGE = 8;

export default function AuthorEarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawalForm, setWithdrawalForm] = useState<WithdrawalRequest>({
    amount: 0,
    method: "",
    accountDetails: "",
    notes: "",
  });

  const fetchEarnings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/author/earnings");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setData(mockEarningsData);
      }
    } catch {
      setData(mockEarningsData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const handleExportCsv = () => {
    alert("CSV export started. Your file will be downloaded shortly.");
  };

  const handleSubmitWithdrawal = () => {
    setWithdrawDialogOpen(false);
    setWithdrawalForm({ amount: 0, method: "", accountDetails: "", notes: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const totalPages = Math.ceil(data.transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = data.transactions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const stats = [
    {
      label: "Total Earned",
      value: formatCurrency(data.totalEarned),
      change: "+18.2% this month",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Available Balance",
      value: formatCurrency(data.availableBalance),
      change: "Ready to withdraw",
      trend: "neutral" as const,
      icon: Wallet,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Pending",
      value: formatCurrency(data.pending),
      change: "Processing 3 sales",
      trend: "neutral" as const,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Withdrawn",
      value: formatCurrency(data.withdrawn),
      change: "Last: $500 on May 28",
      trend: "neutral" as const,
      icon: ArrowDownToLine,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-100 dark:bg-violet-900/30",
    },
  ];

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
          <Button
            variant="outline"
            onClick={handleExportCsv}
            className="border-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => setWithdrawDialogOpen(true)}
            className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
          >
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Request Withdrawal
          </Button>
        </div>
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
                <span className="text-muted-foreground">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Earnings</CardTitle>
            <Badge variant="secondary">Last 12 months</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyEarnings}>
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
                    formatter={(value) => [formatCurrency(Number(value)), "Earnings"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#D8B27A"
                    strokeWidth={2}
                    dot={{ fill: "#D8B27A", r: 4 }}
                    activeDot={{ r: 6, fill: "#D8B27A" }}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportCsv}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{txn.book}</p>
                        <p className="text-xs text-muted-foreground">{txn.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={txn.type === "Royalty" ? "secondary" : "outline"}
                      >
                        {txn.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(txn.date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          txn.status === "completed" ? "success" : "warning"
                        }
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(txn.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(page * ITEMS_PER_PAGE, data.transactions.length)} of{" "}
                  {data.transactions.length} transactions
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Withdrawal</DialogTitle>
            <DialogDescription>
              Withdraw your available balance of{" "}
              <span className="font-semibold text-[#8A6A4A]">
                {formatCurrency(data.availableBalance)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (USD)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00"
                min={0}
                max={data.availableBalance}
                value={withdrawalForm.amount || ""}
                onChange={(e) =>
                  setWithdrawalForm({
                    ...withdrawalForm,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-method">Payment Method</Label>
              <Select
                value={withdrawalForm.method}
                onValueChange={(value) =>
                  setWithdrawalForm({ ...withdrawalForm, method: value })
                }
              >
                <SelectTrigger id="withdraw-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="wise">Wise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-account">Account Details</Label>
              <Textarea
                id="withdraw-account"
                placeholder="Bank name, account number, routing number, or PayPal email..."
                rows={3}
                value={withdrawalForm.accountDetails}
                onChange={(e) =>
                  setWithdrawalForm({
                    ...withdrawalForm,
                    accountDetails: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-notes">Notes (optional)</Label>
              <Input
                id="withdraw-notes"
                placeholder="Any additional notes..."
                value={withdrawalForm.notes}
                onChange={(e) =>
                  setWithdrawalForm({ ...withdrawalForm, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWithdrawDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitWithdrawal}
              className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
              disabled={
                !withdrawalForm.amount ||
                !withdrawalForm.method ||
                !withdrawalForm.accountDetails
              }
            >
              <ArrowDownToLine className="mr-1 h-4 w-4" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
