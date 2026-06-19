"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  ArrowDownToLine,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Landmark,
  CreditCard,
  Globe,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  status: "pending" | "approved" | "paid" | "rejected";
  createdAt: string;
  processedAt?: string;
  accountDetails: string;
}

interface WithdrawalFormData {
  amount: number;
  method: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  notes: string;
}

const mockWithdrawals: Withdrawal[] = [
  {
    id: "WD-001",
    amount: 500,
    method: "Bank Transfer",
    status: "paid",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    processedAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    accountDetails: "Chase Bank •••• 4829",
  },
  {
    id: "WD-002",
    amount: 750,
    method: "Bank Transfer",
    status: "paid",
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    processedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    accountDetails: "Chase Bank •••• 4829",
  },
  {
    id: "WD-003",
    amount: 300,
    method: "PayPal",
    status: "approved",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    processedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    accountDetails: "PayPal ••••@email.com",
  },
  {
    id: "WD-004",
    amount: 200,
    method: "Bank Transfer",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    accountDetails: "Chase Bank •••• 4829",
  },
  {
    id: "WD-005",
    amount: 450,
    method: "Stripe",
    status: "rejected",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    accountDetails: "Stripe Connected Account",
  },
  {
    id: "WD-006",
    amount: 600,
    method: "Wise",
    status: "paid",
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    processedAt: new Date(Date.now() - 86400000 * 43).toISOString(),
    accountDetails: "Wise •••• 7721",
  },
  {
    id: "WD-007",
    amount: 350,
    method: "Bank Transfer",
    status: "paid",
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    processedAt: new Date(Date.now() - 86400000 * 58).toISOString(),
    accountDetails: "Chase Bank •••• 4829",
  },
  {
    id: "WD-008",
    amount: 275,
    method: "PayPal",
    status: "approved",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    processedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    accountDetails: "PayPal ••••@email.com",
  },
];

const methodIcons: Record<string, React.ElementType> = {
  "Bank Transfer": Landmark,
  PayPal: CreditCard,
  Stripe: CreditCard,
  Wise: Globe,
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: {
    label: "Pending",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  paid: {
    label: "Paid",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    color:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
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

export default function AuthorWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [formData, setFormData] = useState<WithdrawalFormData>({
    amount: 0,
    method: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
    notes: "",
  });

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/author/withdrawals");
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setWithdrawals(json.data);
      } else {
        setWithdrawals(mockWithdrawals);
      }
    } catch {
      setWithdrawals(mockWithdrawals);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const filteredWithdrawals =
    activeTab === "all"
      ? withdrawals
      : withdrawals.filter((w) => w.status === activeTab);

  const totalPages = Math.ceil(filteredWithdrawals.length / ITEMS_PER_PAGE);
  const paginatedWithdrawals = filteredWithdrawals.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalWithdrawn = withdrawals
    .filter((w) => w.status === "paid")
    .reduce((sum, w) => sum + w.amount, 0);
  const pendingAmount = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);
  const approvedAmount = withdrawals
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + w.amount, 0);
  const paidCount = withdrawals.filter((w) => w.status === "paid").length;

  const chartData = withdrawals.reduce<Record<string, number>>((acc, w) => {
    const date = new Date(w.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    acc[date] = (acc[date] || 0) + w.amount;
    return acc;
  }, {});

  const chartDataArray = Object.entries(chartData)
    .map(([date, amount]) => ({ date, amount }))
    .slice(-10);

  const handleSubmitWithdrawal = () => {
    setNewDialogOpen(false);
    setFormData({
      amount: 0,
      method: "",
      accountName: "",
      accountNumber: "",
      bankName: "",
      notes: "",
    });
  };

  const statCards = [
    {
      label: "Total Withdrawn",
      value: formatCurrency(totalWithdrawn),
      icon: ArrowDownToLine,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Pending",
      value: formatCurrency(pendingAmount),
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Approved",
      value: formatCurrency(approvedAmount),
      icon: CheckCircle2,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Paid Requests",
      value: paidCount.toString(),
      icon: Wallet,
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
          <h1 className="text-2xl font-bold tracking-tight">
            Withdrawal Management
          </h1>
          <p className="text-muted-foreground">
            Manage your withdrawal requests and payment history.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchWithdrawals}
            variant="outline"
            className="border-[#D8B27A] text-[#1D1D1D] hover:bg-[#D8B27A]/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={() => setNewDialogOpen(true)}
            className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Withdrawal
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Withdrawal Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDataArray}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
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
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Amount",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#D8B27A"
                    fill="#D8B27A"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Withdrawal History</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : paginatedWithdrawals.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                No withdrawal requests found.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Processed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedWithdrawals.map((withdrawal) => {
                      const MethodIcon =
                        methodIcons[withdrawal.method] || DollarSign;
                      const status = statusConfig[withdrawal.status];
                      return (
                        <TableRow key={withdrawal.id}>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">
                                {formatDate(withdrawal.createdAt)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {withdrawal.id}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(withdrawal.amount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MethodIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {withdrawal.method}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {withdrawal.accountDetails}
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {withdrawal.processedAt
                              ? formatDate(withdrawal.processedAt)
                              : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                      {Math.min(
                        page * ITEMS_PER_PAGE,
                        filteredWithdrawals.length
                      )}{" "}
                      of {filteredWithdrawals.length} withdrawals
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
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Withdrawal Request</DialogTitle>
            <DialogDescription>
              Submit a new withdrawal request. Processing typically takes 2-5
              business days.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="w-amount">Amount (USD)</Label>
              <Input
                id="w-amount"
                type="number"
                placeholder="0.00"
                min={10}
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Minimum withdrawal: $10.00
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="w-method">Payment Method</Label>
              <Select
                value={formData.method}
                onValueChange={(value) =>
                  setFormData({ ...formData, method: value })
                }
              >
                <SelectTrigger id="w-method">
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
              <Label htmlFor="w-name">Account Holder Name</Label>
              <Input
                id="w-name"
                placeholder="John Doe"
                value={formData.accountName}
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="w-account">Account Number / Email</Label>
              <Input
                id="w-account"
                placeholder="Account number or PayPal email"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
              />
            </div>
            {formData.method === "bank_transfer" && (
              <div className="space-y-2">
                <Label htmlFor="w-bank">Bank Name</Label>
                <Input
                  id="w-bank"
                  placeholder="e.g. Chase, Wells Fargo"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="w-notes">Notes (optional)</Label>
              <Input
                id="w-notes"
                placeholder="Any additional notes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitWithdrawal}
              className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"
              disabled={
                !formData.amount ||
                formData.amount < 10 ||
                !formData.method ||
                !formData.accountName ||
                !formData.accountNumber
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
