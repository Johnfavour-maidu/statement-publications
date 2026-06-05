"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Send,
  DollarSign,
  Ban,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";

const walletStats = [
  {
    label: "Pending Withdrawals",
    value: "$12,450",
    count: 8,
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    label: "Processed Today",
    value: "$8,230",
    count: 5,
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Total Paid (Month)",
    value: "$84,500",
    count: 45,
    icon: DollarSign,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    label: "Failed Payments",
    value: "$1,200",
    count: 2,
    icon: Ban,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
];

const payoutTrends = [
  { month: "Jan", pending: 8500, processed: 42000 },
  { month: "Feb", pending: 9200, processed: 48000 },
  { month: "Mar", pending: 7800, processed: 55000 },
  { month: "Apr", pending: 10500, processed: 51000 },
  { month: "May", pending: 8900, processed: 62000 },
  { month: "Jun", pending: 11200, processed: 68000 },
  { month: "Jul", pending: 9800, processed: 58000 },
  { month: "Aug", pending: 7500, processed: 72000 },
  { month: "Sep", pending: 12000, processed: 78000 },
  { month: "Oct", pending: 8800, processed: 85000 },
  { month: "Nov", pending: 10200, processed: 79000 },
  { month: "Dec", pending: 12450, processed: 84500 },
];

interface PendingWithdrawal {
  id: string;
  author: string;
  authorEmail: string;
  amount: number;
  method: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  requestedDate: string;
  avatarColor: string;
}

interface WithdrawalHistory {
  id: string;
  author: string;
  authorEmail: string;
  amount: number;
  method: string;
  status: "COMPLETED" | "FAILED" | "PROCESSING";
  processedDate: string;
  reference: string;
  avatarColor: string;
}

const pendingWithdrawals: PendingWithdrawal[] = [
  {
    id: "1",
    author: "Amara Okafor",
    authorEmail: "amara@example.com",
    amount: 2450.00,
    method: "Bank Transfer",
    bankName: "First Bank Nigeria",
    accountNumber: "3012345678",
    accountName: "Amara Okafor",
    requestedDate: new Date(Date.now() - 3600000).toISOString(),
    avatarColor: "bg-blue-500",
  },
  {
    id: "2",
    author: "David Mensah",
    authorEmail: "david@example.com",
    amount: 1890.50,
    method: "Bank Transfer",
    bankName: "Ecobank Ghana",
    accountNumber: "1098765432",
    accountName: "David Mensah",
    requestedDate: new Date(Date.now() - 7200000).toISOString(),
    avatarColor: "bg-emerald-500",
  },
  {
    id: "3",
    author: "Fatima Al-Rashid",
    authorEmail: "fatima@example.com",
    amount: 3200.00,
    method: "PayPal",
    bankName: "PayPal",
    accountNumber: "fatima@example.com",
    accountName: "Fatima Al-Rashid",
    requestedDate: new Date(Date.now() - 14400000).toISOString(),
    avatarColor: "bg-amber-500",
  },
  {
    id: "4",
    author: "Nadia El-Amin",
    authorEmail: "nadia@example.com",
    amount: 1560.75,
    method: "Bank Transfer",
    bankName: "Access Bank",
    accountNumber: "0123456789",
    accountName: "Nadia El-Amin",
    requestedDate: new Date(Date.now() - 21600000).toISOString(),
    avatarColor: "bg-pink-500",
  },
  {
    id: "5",
    author: "Kwame Asante",
    authorEmail: "kwame@example.com",
    amount: 980.25,
    method: "Mobile Money",
    bankName: "MTN Mobile Money",
    accountNumber: "+233241234567",
    accountName: "Kwame Asante",
    requestedDate: new Date(Date.now() - 28800000).toISOString(),
    avatarColor: "bg-violet-500",
  },
  {
    id: "6",
    author: "Emeka Nwachukwu",
    authorEmail: "emeka@example.com",
    amount: 2100.00,
    method: "Bank Transfer",
    bankName: "GTBank",
    accountNumber: "0234567891",
    accountName: "Emeka Nwachukwu",
    requestedDate: new Date(Date.now() - 36000000).toISOString(),
    avatarColor: "bg-teal-500",
  },
  {
    id: "7",
    author: "Tariq Hassan",
    authorEmail: "tariq@example.com",
    amount: 1750.50,
    method: "Bank Transfer",
    bankName: "Zenith Bank",
    accountNumber: "1234567890",
    accountName: "Tariq Hassan",
    requestedDate: new Date(Date.now() - 43200000).toISOString(),
    avatarColor: "bg-lime-500",
  },
  {
    id: "8",
    author: "Sofia Osei",
    authorEmail: "sofia@example.com",
    amount: 520.00,
    method: "Mobile Money",
    bankName: "Vodafone Cash",
    accountNumber: "+233501234567",
    accountName: "Sofia Osei",
    requestedDate: new Date(Date.now() - 50400000).toISOString(),
    avatarColor: "bg-orange-500",
  },
];

const withdrawalHistory: WithdrawalHistory[] = [
  {
    id: "1",
    author: "Amara Okafor",
    authorEmail: "amara@example.com",
    amount: 1850.00,
    method: "Bank Transfer",
    status: "COMPLETED",
    processedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    reference: "WTH-2025-001234",
    avatarColor: "bg-blue-500",
  },
  {
    id: "2",
    author: "David Mensah",
    authorEmail: "david@example.com",
    amount: 1200.00,
    method: "Bank Transfer",
    status: "COMPLETED",
    processedDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    reference: "WTH-2025-001235",
    avatarColor: "bg-emerald-500",
  },
  {
    id: "3",
    author: "Michael Chen",
    authorEmail: "michael@example.com",
    amount: 450.00,
    method: "PayPal",
    status: "FAILED",
    processedDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    reference: "WTH-2025-001236",
    avatarColor: "bg-rose-500",
  },
  {
    id: "4",
    author: "Fatima Al-Rashid",
    authorEmail: "fatima@example.com",
    amount: 2800.00,
    method: "Bank Transfer",
    status: "COMPLETED",
    processedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    reference: "WTH-2025-001237",
    avatarColor: "bg-amber-500",
  },
  {
    id: "5",
    author: "Kwame Asante",
    authorEmail: "kwame@example.com",
    amount: 750.00,
    method: "Mobile Money",
    status: "PROCESSING",
    processedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    reference: "WTH-2025-001238",
    avatarColor: "bg-violet-500",
  },
];

const paymentGatewayStats = [
  { name: "Stripe", transactions: 1245, volume: 89500, successRate: 99.2 },
  { name: "PayPal", transactions: 456, volume: 34200, successRate: 98.7 },
  { name: "Bank Transfer", transactions: 234, volume: 156000, successRate: 97.8 },
  { name: "Mobile Money", transactions: 567, volume: 23400, successRate: 96.5 },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
  COMPLETED: { label: "Completed", variant: "default", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  FAILED: { label: "Failed", variant: "destructive", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  PROCESSING: { label: "Processing", variant: "outline", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

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

export default function AdminPayoutsPage() {
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<PendingWithdrawal | null>(null);

  const handleProcess = (withdrawal: PendingWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setProcessDialogOpen(true);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Payout Management</h1>
        <p className="text-muted-foreground">
          Process withdrawals and manage author payments.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {walletStats.map((stat) => (
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
              <div className="mt-3 text-xs text-muted-foreground">
                {stat.count} {stat.count === 1 ? "transaction" : "transactions"}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payout Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={payoutTrends}>
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
                    dataKey="processed"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Processed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Gateways</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentGatewayStats.map((gateway) => (
              <div key={gateway.name} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{gateway.name}</p>
                  <Badge variant="secondary">{gateway.successRate}%</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{gateway.transactions.toLocaleString()} transactions</span>
                  <span>{formatCurrency(gateway.volume)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Withdrawals</CardTitle>
            <Badge variant="secondary">{pendingWithdrawals.length} pending</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`${withdrawal.avatarColor} text-white text-xs font-medium`}>
                            {getInitials(withdrawal.author)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{withdrawal.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {withdrawal.bankName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(withdrawal.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{withdrawal.method}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {withdrawal.accountNumber}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(withdrawal.requestedDate, "relative")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => handleProcess(withdrawal)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Withdrawal History</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Processed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalHistory.map((withdrawal) => {
                  const statusInfo = statusConfig[withdrawal.status];
                  return (
                    <TableRow key={withdrawal.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={`${withdrawal.avatarColor} text-white text-xs font-medium`}>
                              {getInitials(withdrawal.author)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{withdrawal.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {withdrawal.method}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(withdrawal.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{withdrawal.method}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusInfo.variant}
                          className={statusInfo.color}
                        >
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {withdrawal.reference}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(withdrawal.processedDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="h-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payout</DialogTitle>
            <DialogDescription>
              Are you sure you want to process the withdrawal of {selectedWithdrawal && formatCurrency(selectedWithdrawal.amount)} for {selectedWithdrawal?.author}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Author</span>
                <span className="font-medium">{selectedWithdrawal?.author}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-emerald-600">
                  {selectedWithdrawal && formatCurrency(selectedWithdrawal.amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span>{selectedWithdrawal?.method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account</span>
                <span className="font-mono">{selectedWithdrawal?.accountNumber}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProcessDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setProcessDialogOpen(false)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="mr-1 h-4 w-4" />
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
