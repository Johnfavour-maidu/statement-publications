"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
  Download,
  FileText,
  ArrowUpRight,
  MoreHorizontal,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, getInitials } from "@/lib/utils";

const royaltyStats = [
  {
    label: "Total Royalties",
    value: "$523,410",
    change: 14.2,
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Pending Royalties",
    value: "$45,230",
    change: -5.3,
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    label: "Paid This Month",
    value: "$38,750",
    change: 8.7,
    icon: CheckCircle2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    label: "Platform Commission",
    value: "$104,682",
    change: 12.1,
    icon: TrendingUp,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
];

const royaltyTrends = [
  { month: "Jan", royalties: 25200, commission: 5040 },
  { month: "Feb", royalties: 28800, commission: 5760 },
  { month: "Mar", royalties: 33000, commission: 6600 },
  { month: "Apr", royalties: 30600, commission: 6120 },
  { month: "May", royalties: 37200, commission: 7440 },
  { month: "Jun", royalties: 40800, commission: 8160 },
  { month: "Jul", royalties: 34800, commission: 6960 },
  { month: "Aug", royalties: 43200, commission: 8640 },
  { month: "Sep", royalties: 46800, commission: 9360 },
  { month: "Oct", royalties: 51000, commission: 10200 },
  { month: "Nov", royalties: 47400, commission: 9480 },
  { month: "Dec", royalties: 55200, commission: 11040 },
];

const royaltyReports = [
  {
    id: "1",
    author: "Amara Okafor",
    authorEmail: "amara@example.com",
    period: "Dec 2025",
    books: 8,
    totalSales: 2847,
    grossAmount: 36982.53,
    commission: 7396.51,
    netAmount: 29586.02,
    status: "PAID",
    paidDate: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    author: "David Mensah",
    authorEmail: "david@example.com",
    period: "Dec 2025",
    books: 5,
    totalSales: 2134,
    grossAmount: 27714.66,
    commission: 5542.93,
    netAmount: 22171.73,
    status: "PAID",
    paidDate: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "3",
    author: "Fatima Al-Rashid",
    authorEmail: "fatima@example.com",
    period: "Dec 2025",
    books: 12,
    totalSales: 1892,
    grossAmount: 35917.08,
    commission: 7183.42,
    netAmount: 28733.66,
    status: "PENDING",
    paidDate: null,
  },
  {
    id: "4",
    author: "Nadia El-Amin",
    authorEmail: "nadia@example.com",
    period: "Dec 2025",
    books: 3,
    totalSales: 1654,
    grossAmount: 28084.46,
    commission: 5616.89,
    netAmount: 22467.57,
    status: "PENDING",
    paidDate: null,
  },
  {
    id: "5",
    author: "Kwame Asante",
    authorEmail: "kwame@example.com",
    period: "Dec 2025",
    books: 7,
    totalSales: 1423,
    grossAmount: 21334.77,
    commission: 4266.95,
    netAmount: 17067.82,
    status: "PAID",
    paidDate: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "6",
    author: "Emeka Nwachukwu",
    authorEmail: "emeka@example.com",
    period: "Dec 2025",
    books: 7,
    totalSales: 987,
    grossAmount: 15784.13,
    commission: 3156.83,
    netAmount: 12627.30,
    status: "PAID",
    paidDate: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "7",
    author: "Tariq Hassan",
    authorEmail: "tariq@example.com",
    period: "Dec 2025",
    books: 9,
    totalSales: 1245,
    grossAmount: 22397.55,
    commission: 4479.51,
    netAmount: 17918.04,
    status: "PROCESSING",
    paidDate: null,
  },
  {
    id: "8",
    author: "Sofia Osei",
    authorEmail: "sofia@example.com",
    period: "Dec 2025",
    books: 4,
    totalSales: 678,
    grossAmount: 9482.22,
    commission: 1896.44,
    netAmount: 7585.78,
    status: "PENDING",
    paidDate: null,
  },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
  PAID: { label: "Paid", variant: "default", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  PENDING: { label: "Pending", variant: "secondary", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
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

export default function AdminRoyaltiesPage() {
  const [period, setPeriod] = useState("monthly");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Royalty Management</h1>
          <p className="text-muted-foreground">
            Track and manage author royalties and commissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-1 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {royaltyStats.map((stat) => (
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
                {stat.change > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : null}
                <span
                  className={
                    stat.change > 0
                      ? "text-emerald-500"
                      : "text-red-500"
                  }
                >
                  {stat.change > 0 ? "+" : ""}
                  {stat.change}%
                </span>
                <span className="text-muted-foreground">from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Royalty Trends</CardTitle>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={royaltyTrends}>
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
                    dataKey="royalties"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="commission"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Author Royalties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Platform Commission</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Standard Rate</p>
              <p className="text-2xl font-bold">20%</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Premium Author Rate</p>
              <p className="text-2xl font-bold">15%</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Commission (YTD)</p>
              <p className="text-2xl font-bold">$104,682</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Average Payout</p>
              <p className="text-2xl font-bold">$4,230</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Royalty Reports</CardTitle>
            <Badge variant="secondary">December 2025</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Books</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {royaltyReports.map((report) => {
                  const statusInfo = statusConfig[report.status];
                  return (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                              {getInitials(report.author)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{report.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {report.period}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{report.books}</TableCell>
                      <TableCell className="text-right">
                        {report.totalSales.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(report.grossAmount)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(report.commission)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(report.netAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusInfo.variant}
                          className={statusInfo.color}
                        >
                          {statusInfo.label}
                        </Badge>
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
    </motion.div>
  );
}
