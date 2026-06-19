"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SyncedTableScroll, type SyncedTableScrollHandle } from "@/components/ui/synced-table-scroll";
import {
  Search, ShoppingCart, RefreshCw, Package, DollarSign, CheckCircle2, Clock,
  XCircle, RotateCcw, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Eye, Download, FileText, CheckSquare, Square, History, X, Send,
  SlidersHorizontal, AlertTriangle, Users, TrendingUp, Activity, Globe,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Minus, Truck,
  Shield, Mail, Calendar, Ban,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import { actionHistory } from "@/lib/action-history";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type OrderFilter = "all" | "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "REFUNDED" | "high_value" | "recent" | "old" | "new_orders";

interface OrderRecord {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string | null;
  createdAt: string;
  user: { name: string | null; email: string; country?: string };
  serviceName: string;
  package: string;
  paymentStatus: string;
}

interface OrderStats {
  totalOrders: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  refunded: number;
  totalRevenue: number;
  avgOrderValue: number;
}

interface SortFilterState {
  service: string;
  dateFilter: string;
  status: string;
}

const AVATAR_COLORS = [
  "bg-[#8A6A4A]", "bg-[#D8B27A]", "bg-rose-500", "bg-emerald-600",
  "bg-violet-500", "bg-cyan-600", "bg-amber-600", "bg-indigo-500",
];

const SERVICES = [
  "Editing", "Cover Design", "Interior Formatting", "Publishing Assistance",
  "Marketing Package", "ISBN Registration", "Author Website", "Book Trailer",
];

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200", icon: Clock },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-50 text-blue-700 border border-blue-200", icon: Truck },
  COMPLETED: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700 border border-red-200", icon: XCircle },
  REFUNDED: { label: "Refunded", className: "bg-purple-50 text-purple-700 border border-purple-200", icon: RotateCcw },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const STAT_CARD_MAP: Record<string, OrderFilter> = {
  "Total Service Orders": "all",
  "Pending Orders": "PENDING",
  "In Progress": "IN_PROGRESS",
  "Completed Orders": "COMPLETED",
};

const EMPTY_MESSAGES: Record<OrderFilter, { title: string; description: string }> = {
  all: { title: "No orders found", description: "Try adjusting your search or filters." },
  PENDING: { title: "No pending orders", description: "All orders have been processed." },
  IN_PROGRESS: { title: "No in-progress orders", description: "No orders are currently being worked on." },
  COMPLETED: { title: "No completed orders", description: "No orders have been completed yet." },
  CANCELLED: { title: "No cancelled orders", description: "No orders have been cancelled." },
  REFUNDED: { title: "No refunded orders", description: "No orders have been refunded." },
  high_value: { title: "No high-value orders", description: "No orders exceed $1,000." },
  recent: { title: "No recent orders", description: "No orders in the last 30 days." },
  old: { title: "No old orders", description: "No orders older than 6 months." },
  new_orders: { title: "No new orders", description: "No orders in the last 30 days." },
};

const STATUS_OVERRIDE_KEY = "statement_order_status_overrides";

function loadOrderOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STATUS_OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOrderOverride(orderId: string, status: string) {
  try {
    const overrides = loadOrderOverrides();
    overrides[orderId] = status;
    localStorage.setItem(STATUS_OVERRIDE_KEY, JSON.stringify(overrides));
  } catch {
    console.error("Failed to save override to localStorage");
  }
}

function recomputeStats(orders: OrderRecord[]): OrderStats {
  let totalOrders = 0;
  let pending = 0;
  let inProgress = 0;
  let completed = 0;
  let cancelled = 0;
  let refunded = 0;
  let totalRevenue = 0;
  for (const o of orders) {
    totalOrders++;
    if (o.status === "PENDING") pending++;
    else if (o.status === "IN_PROGRESS") inProgress++;
    else if (o.status === "COMPLETED") {
      completed++;
      totalRevenue += o.total;
    }
    else if (o.status === "CANCELLED") cancelled++;
    else if (o.status === "REFUNDED") refunded++;
  }
  return {
    totalOrders,
    pending,
    inProgress,
    completed,
    cancelled,
    refunded,
    totalRevenue,
    avgOrderValue: totalOrders > 0 ? totalRevenue / completed || 0 : 0,
  };
}

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allOrders, setAllOrders] = useState<OrderRecord[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0, refunded: 0, totalRevenue: 0, avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [sortFilter, setSortFilter] = useState<SortFilterState>({ service: "", dateFilter: "", status: "" });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [previewOrder, setPreviewOrder] = useState<OrderRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<string | null>(null);
  const [statusTargetName, setStatusTargetName] = useState("");
  const [statusNewValue, setStatusNewValue] = useState("");

  const tableScroll = useRef<SyncedTableScrollHandle>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSortFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=1&pageSize=all`);
      const data = await res.json();
      if (data.success) {
        const overrides = loadOrderOverrides();
        let items: OrderRecord[] = data.data.items;
        if (Object.keys(overrides).length > 0) {
          items = items.map((o: OrderRecord) => {
            if (overrides[o.id]) {
              return { ...o, status: overrides[o.id] };
            }
            return o;
          });
        }
        setAllOrders(items);
        setOrderStats(recomputeStats(items));
      }
    } catch {
      console.error("Failed to fetch orders");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPage(1); setSelectedIds(new Set()); }, [activeTab, debouncedSearch, pageSize, sortFilter]);

  const hasActiveFilter = Object.values(sortFilter).some(Boolean);

  const activeFilterLabel = useMemo(() => {
    const labels: string[] = [];
    if (sortFilter.service) labels.push(sortFilter.service);
    if (sortFilter.dateFilter) labels.push(sortFilter.dateFilter.replace("_", " "));
    if (sortFilter.status) labels.push(sortFilter.status.replace("_", " "));
    return labels.length > 0 ? labels.join(", ") : "Sort & Filter";
  }, [sortFilter]);

  const clearSortFilter = () => {
    setSortFilter({ service: "", dateFilter: "", status: "" });
    setActiveTab("all");
  };

  const filteredOrders = useMemo(() => {
    let result = [...allOrders];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        (o.user.name || "").toLowerCase().includes(q) ||
        o.user.email.toLowerCase().includes(q) ||
        o.serviceName.toLowerCase().includes(q)
      );
    }

    if (sortFilter.service) {
      result = result.filter((o) => o.serviceName === sortFilter.service);
    }

    if (sortFilter.status) {
      result = result.filter((o) => o.status === sortFilter.status);
    }

    if (sortFilter.dateFilter) {
      const now = new Date();
      const cutoff = new Date();
      switch (sortFilter.dateFilter) {
        case "today": cutoff.setDate(now.getDate() - 1); break;
        case "week": cutoff.setDate(now.getDate() - 7); break;
        case "month": cutoff.setMonth(now.getMonth() - 1); break;
        case "year": cutoff.setFullYear(now.getFullYear() - 1); break;
      }
      result = result.filter((o) => new Date(o.createdAt) >= cutoff);
    }

    if (!sortFilter.status) {
      switch (activeTab) {
        case "PENDING": result = result.filter((o) => o.status === "PENDING"); break;
        case "IN_PROGRESS": result = result.filter((o) => o.status === "IN_PROGRESS"); break;
        case "COMPLETED": result = result.filter((o) => o.status === "COMPLETED"); break;
        case "CANCELLED": result = result.filter((o) => o.status === "CANCELLED"); break;
        case "REFUNDED": result = result.filter((o) => o.status === "REFUNDED"); break;
        case "high_value": result = result.filter((o) => o.total > 1000).sort((a, b) => b.total - a.total); break;
        case "recent": {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          result = result.filter((o) => new Date(o.createdAt) >= thirtyDaysAgo);
          break;
        }
        case "old": {
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          result = result.filter((o) => new Date(o.createdAt) < sixMonthsAgo);
          break;
        }
        case "new_orders": {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          result = result.filter((o) => new Date(o.createdAt) >= thirtyDaysAgo);
          break;
        }
      }
    }

    return result;
  }, [allOrders, debouncedSearch, sortFilter, activeTab]);

  const filteredTotalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const displayedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  const allSelected = displayedOrders.length > 0 && displayedOrders.every((o) => selectedIds.has(o.id));
  const someSelected = displayedOrders.some((o) => selectedIds.has(o.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(displayedOrders.map((o) => o.id)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateOrderLocal = (orderId: string, newStatus: string) => {
    setAllOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, paymentStatus: newStatus === "COMPLETED" ? "PAID" : newStatus === "REFUNDED" ? "REFUNDED" : newStatus === "CANCELLED" ? "CANCELLED" : o.paymentStatus }
          : o
      );
      setOrderStats(recomputeStats(next));
      return next;
    });
    setPreviewOrder((prev) => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
    saveOrderOverride(orderId, newStatus);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const order = allOrders.find((o) => o.id === orderId);
    const oldStatus = order?.status;

    actionHistory.pushAction({
      action: "status_change",
      entity: "order",
      entityName: order?.orderNumber || orderId,
      description: `Changed order "${order?.orderNumber}" from ${oldStatus} to ${newStatus}`,
      previousState: null,
      newState: null,
    });

    updateOrderLocal(orderId, newStatus);
    setStatusDialogOpen(false);
    setStatusTarget(null);
    setStatusTargetName("");
    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
    } catch {
      console.error("Status update failed");
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    let newStatus = "";
    switch (action) {
      case "bulkComplete": newStatus = "COMPLETED"; break;
      case "bulkInProgress": newStatus = "IN_PROGRESS"; break;
      case "bulkCancel": newStatus = "CANCELLED"; break;
      case "bulkRefund": newStatus = "REFUNDED"; break;
    }
    if (newStatus) {
      actionHistory.pushAction({
        action: "status_change",
        entity: "order",
        entityName: `${ids.length} orders`,
        description: `Bulk changed ${ids.length} order${ids.length === 1 ? "" : "s"} to ${newStatus}`,
        previousState: null,
        newState: null,
      });

      setAllOrders((prev) => {
        const next = prev.map((o) =>
          ids.includes(o.id)
            ? { ...o, status: newStatus, paymentStatus: newStatus === "COMPLETED" ? "PAID" : newStatus === "REFUNDED" ? "REFUNDED" : newStatus === "CANCELLED" ? "CANCELLED" : o.paymentStatus }
            : o
        );
        setOrderStats(recomputeStats(next));
        return next;
      });
      ids.forEach((id) => saveOrderOverride(id, newStatus));
      try {
        await fetch("/api/admin/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "bulkUpdate", orderIds: ids, status: newStatus }),
        });
      } catch {
        console.error("Bulk update failed");
      }
    }
    setSelectedIds(new Set());
  };

  const exportCSV = (data: OrderRecord[], filename: string) => {
    const headers = ["Order #", "Author", "Email", "Country", "Service", "Package", "Amount", "Status", "Payment", "Date"];
    const rows = data.map((o) => [o.orderNumber, o.user.name || "", o.user.email, o.user.country || "", o.serviceName, o.package, String(o.total), o.status, o.paymentStatus, o.createdAt.split("T")[0]]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; link.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = (data: OrderRecord[], filename: string) => {
    const headers = ["Order #", "Author", "Email", "Country", "Service", "Package", "Amount", "Status", "Payment", "Date"];
    const rows = data.map((o) => [o.orderNumber, o.user.name || "", o.user.email, o.user.country || "", o.serviceName, o.package, String(o.total), o.status, o.paymentStatus, o.createdAt.split("T")[0]]);
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1">${headers.map((h) => `<th>${h}</th>`).join("")}${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></body></html>`;
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; link.click();
    URL.revokeObjectURL(url);
  };

  const emptyMsg = EMPTY_MESSAGES[activeTab] || EMPTY_MESSAGES.all;

  const serviceBreakdown = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    allOrders.forEach((o) => {
      if (!map[o.serviceName]) map[o.serviceName] = { count: 0, revenue: 0 };
      map[o.serviceName].count++;
      if (o.status === "COMPLETED") map[o.serviceName].revenue += o.total;
    });
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count);
  }, [allOrders]);

  const topAuthors = useMemo(() => {
    const map: Record<string, { name: string; spent: number; orders: number }> = {};
    allOrders.forEach((o) => {
      const key = o.user.email;
      if (!map[key]) map[key] = { name: o.user.name || o.user.email, spent: 0, orders: 0 };
      map[key].orders++;
      if (o.status === "COMPLETED") map[key].spent += o.total;
    });
    return Object.values(map).sort((a, b) => b.spent - a.spent).slice(0, 10);
  }, [allOrders]);

  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = allOrders.filter((o) => o.createdAt.startsWith(today));
    return {
      newOrders: todayOrders.length,
      completed: todayOrders.filter((o) => o.status === "COMPLETED").length,
      revenue: todayOrders.filter((o) => o.status === "COMPLETED").reduce((s, o) => s + o.total, 0),
      refunds: todayOrders.filter((o) => o.status === "REFUNDED").length,
    };
  }, [allOrders]);

  const summaryCards = [
    { label: "Total Service Orders", value: orderStats.totalOrders, icon: ShoppingCart, color: "text-[#8A6A4A]", bg: "bg-[#8A6A4A]/10", sub: "All time" },
    { label: "Pending Orders", value: orderStats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", sub: "Awaiting processing" },
    { label: "In Progress", value: orderStats.inProgress, icon: Truck, color: "text-blue-600", bg: "bg-blue-50", sub: "Currently active" },
    { label: "Completed Orders", value: orderStats.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", sub: "Successfully delivered" },
    { label: "Total Revenue", value: formatCurrency(orderStats.totalRevenue), icon: DollarSign, color: "text-[#8A6A4A]", bg: "bg-[#8A6A4A]/10", sub: "From completed" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Service Orders Management</h1>
          <p className="text-sm text-muted-foreground">Manage publishing service orders, payments, and fulfillment across the platform.</p>
        </div>
        <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
          <Button variant="outline" size="sm" onClick={() => fetchOrders()} disabled={loading} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards — 5 cards only */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {summaryCards.map((stat) => {
          const tabTarget = STAT_CARD_MAP[stat.label];
          const isActiveCard = activeTab === tabTarget;
          return (
            <Card key={stat.label} onClick={() => tabTarget && setActiveTab(tabTarget)} className={`shadow-sm transition-all duration-200 border-[#D8B27A]/20 cursor-pointer hover:shadow-md hover:scale-[1.02] ${isActiveCard ? "ring-2 ring-[#D8B27A] shadow-md" : ""}`}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg ${stat.bg} p-1.5 ${stat.color}`}><stat.icon className="h-3.5 w-3.5" /></div>
                  <div className="min-w-0">
                    <motion.p key={String(stat.value)} initial={{ scale: 1.15, color: "#D8B27A" }} animate={{ scale: 1, color: "#1D1D1D" }} transition={{ duration: 0.3 }} className="text-lg font-bold truncate">{stat.value}</motion.p>
                    <p className="text-[10px] text-muted-foreground truncate">{stat.sub}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Analytics Center — below summary cards, above sticky filter bar */}
      <motion.div variants={item}>
        <div className="analytics-dropdown-border">
          <Card className="shadow-sm bg-white">
            <button onClick={() => setAnalyticsOpen(!analyticsOpen)} className="w-full flex items-center justify-between p-4 hover:bg-[#F2D8BE]/10 transition-colors rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#8A6A4A]" />
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Service Popularity */}
                    <div className="rounded-xl border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><Package className="h-3.5 w-3.5" />Service Popularity</h4>
                      <div className="space-y-2">
                        {serviceBreakdown.slice(0, 6).map(([name, data]) => (
                          <div key={name} className="flex items-center gap-3">
                            <span className="text-xs text-[#6A4E37] w-28 truncate">{name}</span>
                            <div className="flex-1 h-2 bg-[#E8DDD0] rounded-full overflow-hidden">
                              <div className="h-full bg-[#8A6A4A] rounded-full transition-all" style={{ width: `${Math.min(100, (data.count / Math.max(...serviceBreakdown.map(([, d]) => d.count))) * 100)}%` }} />
                            </div>
                            <span className="text-xs font-medium text-[#1D1D1D] w-12 text-right">{data.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Revenue by Service */}
                    <div className="rounded-xl border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />Revenue by Service</h4>
                      <div className="space-y-2">
                        {serviceBreakdown.filter(([, d]) => d.revenue > 0).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 6).map(([name, data]) => (
                          <div key={name} className="flex items-center gap-3">
                            <span className="text-xs text-[#6A4E37] w-28 truncate">{name}</span>
                            <div className="flex-1 h-2 bg-[#E8DDD0] rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, (data.revenue / Math.max(...serviceBreakdown.filter(([, d]) => d.revenue > 0).map(([, d]) => d.revenue))) * 100)}%` }} />
                            </div>
                            <span className="text-xs font-medium text-[#1D1D1D] w-20 text-right">{formatCurrency(data.revenue)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Authors by Spending */}
                    <div className="rounded-xl border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5 md:col-span-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />Top Authors by Spending</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {topAuthors.slice(0, 10).map((author, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white border border-[#E8DDD0]/50">
                            <div className="w-6 h-6 rounded-full bg-[#8A6A4A]/10 flex items-center justify-center text-[10px] font-bold text-[#8A6A4A]">{i + 1}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#1D1D1D] truncate">{author.name}</p>
                              <p className="text-[10px] text-muted-foreground">{author.orders} orders</p>
                            </div>
                            <span className="text-xs font-semibold text-[#8A6A4A]">{formatCurrency(author.spent)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </motion.div>

      {/* Sticky Filter Bar */}
      <motion.div variants={item} ref={stickyRef} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-md search-bar-border">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input placeholder="Search by order #, author, email, service..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9" />
          </div>
          <div className="flex items-center gap-2" ref={dropdownRef}>
            <div className="relative">
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button variant="outline" size="sm" onClick={() => setSortFilterOpen(!sortFilterOpen)} className={`h-9 px-3 border-0 bg-white text-sm font-medium gap-2 ${hasActiveFilter ? "text-[#D8B27A]" : "text-[#8A6A4A] hover:bg-[#F2D8BE]"}`}>
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[120px] truncate">{activeFilterLabel}</span>
                  <span className="sm:hidden">Filter</span>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${sortFilterOpen ? "rotate-90" : ""}`} />
                </Button>
              </div>
              <AnimatePresence>
                {sortFilterOpen && (
                  <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 mt-1 w-[300px] bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#E8DDD0] bg-[#F2D8BE]/10">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#8A6A4A]" />Sort & Filter</h4>
                        {hasActiveFilter && (
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={clearSortFilter}>
                            <X className="h-3 w-3 mr-1" />Clear All
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                      <div className="p-3 border-b border-[#E8DDD0]/50">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><Package className="h-3 w-3" />Service Type</p>
                        <div className="space-y-0.5">
                          {[{ value: "", label: "All Services" }, ...SERVICES.map((s) => ({ value: s, label: s }))].map((s) => (
                            <button key={s.value} onClick={() => setSortFilter((p) => ({ ...p, service: s.value }))} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortFilter.service === s.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#6A4E37] hover:bg-[#F2D8BE]/40"}`}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 border-b border-[#E8DDD0]/50">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><Calendar className="h-3 w-3" />Date Filter</p>
                        <div className="space-y-0.5">
                          {[{ value: "", label: "All Time" }, { value: "today", label: "Today" }, { value: "week", label: "This Week" }, { value: "month", label: "This Month" }, { value: "year", label: "This Year" }].map((d) => (
                            <button key={d.value} onClick={() => setSortFilter((p) => ({ ...p, dateFilter: d.value }))} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortFilter.dateFilter === d.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#6A4E37] hover:bg-[#F2D8BE]/40"}`}>
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><Shield className="h-3 w-3" />Order Status</p>
                        <div className="space-y-0.5">
                          {[{ value: "", label: "All Statuses" }, { value: "PENDING", label: "Pending" }, { value: "IN_PROGRESS", label: "In Progress" }, { value: "COMPLETED", label: "Completed" }, { value: "CANCELLED", label: "Cancelled" }, { value: "REFUNDED", label: "Refunded" }].map((s) => (
                            <button key={s.value} onClick={() => setSortFilter((p) => ({ ...p, status: s.value }))} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortFilter.status === s.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#6A4E37] hover:bg-[#F2D8BE]/40"}`}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Show</span>
            <Select value={pageSize >= 999 ? "all" : String(pageSize)} onValueChange={(v) => { setPageSize(v === "all" ? 999 : parseInt(v)); setPage(1); }}>
              <SelectTrigger className="w-[70px] h-9 border-[#8A6A4A]/20"><SelectValue /></SelectTrigger>
              <SelectContent side="bottom" sideOffset={4}>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderFilter)}>
          <TabsList className="bg-[#F2D8BE]/40 h-auto flex-wrap gap-1 p-1">
            {([
              { value: "all", label: "All Orders", icon: ShoppingCart },
              { value: "PENDING", label: "Pending", icon: Clock },
              { value: "IN_PROGRESS", label: "In Progress", icon: Truck },
              { value: "COMPLETED", label: "Completed", icon: CheckCircle2 },
              { value: "new_orders", label: "New Orders", icon: Calendar },
              { value: "CANCELLED", label: "Cancelled", icon: XCircle },
              { value: "REFUNDED", label: "Refunded", icon: RotateCcw },
              { value: "high_value", label: "High Value", icon: DollarSign },
              { value: "recent", label: "Recent", icon: TrendingUp },
              { value: "old", label: "Old Orders", icon: History },
            ] as const).map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-[#8A6A4A] data-[state=active]:text-white text-xs sm:text-sm">
                <tab.icon className="mr-1 h-3 w-3" />{tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Summary Strip */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground bg-[#F2D8BE]/15 rounded-lg px-4 py-2 border border-[#D8B27A]/10">
        <span>Showing <span className="font-semibold text-[#1D1D1D]">{displayedOrders.length}</span> of <span className="font-semibold text-[#1D1D1D]">{filteredOrders.length}</span> orders{hasActiveFilter ? " (filtered)" : ""}</span>
        <span className="hidden sm:inline text-[#E8DDD0]">|</span>
        <span><span className="text-amber-600 font-medium">{orderStats.pending}</span> Pending</span>
        <span><span className="text-blue-600 font-medium">{orderStats.inProgress}</span> In Progress</span>
        <span><span className="text-emerald-600 font-medium">{orderStats.completed}</span> Completed</span>
        <span className="hidden sm:inline"><span className="text-red-600 font-medium">{orderStats.cancelled}</span> Cancelled</span>
        <span className="hidden sm:inline"><span className="text-purple-600 font-medium">{orderStats.refunded}</span> Refunded</span>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex flex-wrap items-center gap-3 p-3 bg-[#F2D8BE]/20 rounded-lg border border-[#D8B27A]/30">
            <span className="text-sm font-semibold text-[#1D1D1D]">{selectedIds.size} Order{selectedIds.size > 1 ? "s" : ""} Selected</span>
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => handleBulkAction("bulkComplete")} disabled={actionLoading}>
                <CheckCircle2 className="h-3 w-3 mr-1" />Mark Completed
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => handleBulkAction("bulkInProgress")} disabled={actionLoading}>
                <Truck className="h-3 w-3 mr-1" />Mark In Progress
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50" onClick={() => handleBulkAction("bulkCancel")} disabled={actionLoading}>
                <XCircle className="h-3 w-3 mr-1" />Cancel
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-purple-200 text-purple-700 hover:bg-purple-50" onClick={() => handleBulkAction("bulkRefund")} disabled={actionLoading}>
                <RotateCcw className="h-3 w-3 mr-1" />Refund
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-[#8A6A4A]/30 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => {
                const selected = filteredOrders.filter((o) => selectedIds.has(o.id));
                exportCSV(selected, `selected-orders-${Date.now()}.csv`);
              }}>
                <Download className="h-3 w-3 mr-1" />Export
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground" onClick={() => setSelectedIds(new Set())}>Clear</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orders Table */}
      <SyncedTableScroll ref={tableScroll} loading={loading}>
        <Table>
              <TableHeader>
                <TableRow className="bg-[#F2D8BE]/20 hover:bg-[#F2D8BE]/30">
                  <TableHead className="w-10">
                    <button onClick={toggleSelectAll} className="flex items-center justify-center">
                      {allSelected ? <CheckSquare className="h-4 w-4 text-[#8A6A4A]" /> : someSelected ? <div className="h-4 w-4 border-2 border-[#8A6A4A] rounded flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#8A6A4A] rounded-sm" /></div> : <Square className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold">Order #</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold">Author</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden md:table-cell">Service</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell">Package</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold text-right">Amount</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold">Status</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden md:table-cell">Payment</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-16"><RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#8A6A4A]" /><p className="mt-3 text-sm text-muted-foreground">Loading orders...</p></TableCell></TableRow>
                ) : displayedOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-16">
                    <ShoppingCart className="mx-auto h-10 w-10 text-[#D8B27A]/50 mb-3" />
                    <p className="text-sm font-medium text-[#1D1D1D]">{emptyMsg.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{emptyMsg.description}</p>
                  </TableCell></TableRow>
                ) : (
                  displayedOrders.map((order, idx) => {
                    const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                    const StatusIcon = config.icon;
                    return (
                      <TableRow key={order.id} className={`hover:bg-[#8A6A4A]/[0.04] transition-colors duration-150 cursor-default ${selectedIds.has(order.id) ? "bg-[#F2D8BE]/15" : ""}`}>
                        <TableCell onClick={(e) => e.stopPropagation()} className="py-2">
                          <button onClick={() => toggleSelect(order.id)} className="flex items-center justify-center">
                            {selectedIds.has(order.id) ? <CheckSquare className="h-4 w-4 text-[#8A6A4A]" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                          </button>
                        </TableCell>
                        <TableCell className="cursor-pointer py-2" onClick={() => { setPreviewOrder(order); setDrawerOpen(true); }}>
                          <span className="font-mono text-sm font-semibold text-[#8A6A4A]">{order.orderNumber}</span>
                        </TableCell>
                        <TableCell className="cursor-pointer py-2" onClick={() => { setPreviewOrder(order); setDrawerOpen(true); }}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 ring-2 ring-[#D8B27A]/20">
                              <AvatarFallback className={`${AVATAR_COLORS[idx % AVATAR_COLORS.length]} text-white text-[10px] font-semibold`}>{getInitials(order.user.name || order.user.email)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium text-[#1D1D1D] text-sm truncate">{order.user.name || "No name"}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{order.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell cursor-pointer py-2" onClick={() => { setPreviewOrder(order); setDrawerOpen(true); }}>
                          <div className="flex items-center gap-1.5 text-sm text-[#6A4E37]"><Package className="h-3.5 w-3.5" />{order.serviceName}</div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell cursor-pointer py-2" onClick={() => { setPreviewOrder(order); setDrawerOpen(true); }}>
                          <span className="text-sm text-muted-foreground">{order.package}</span>
                        </TableCell>
                        <TableCell className="text-right cursor-pointer py-2" onClick={() => { setPreviewOrder(order); setDrawerOpen(true); }}>
                          <span className="font-semibold text-sm text-[#1D1D1D]">{formatCurrency(order.total)}</span>
                        </TableCell>
                        <TableCell className="cursor-pointer py-2" onClick={() => { setPreviewOrder(order); setDrawerOpen(true); }}>
                          <Badge variant="secondary" className={`${config.className} text-[11px] font-medium gap-1`}>
                            <StatusIcon className="h-3 w-3" />{config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell cursor-pointer py-2" onClick={() => { setPreviewOrder(order); setDrawerOpen(true); }}>
                          <Badge variant="secondary" className={`text-[11px] font-medium ${order.paymentStatus === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : order.paymentStatus === "REFUNDED" ? "bg-purple-50 text-purple-700 border border-purple-200" : order.paymentStatus === "CANCELLED" ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell cursor-pointer py-2" onClick={() => { setPreviewOrder(order); setDrawerOpen(true); }}>
                          <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
                        </TableCell>
                        <TableCell className="text-right py-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-0.5">
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => { setPreviewOrder(order); setDrawerOpen(true); }} title="View details">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            {order.status === "PENDING" && (
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50" onClick={() => { setStatusTarget(order.id); setStatusTargetName(order.orderNumber); setStatusNewValue("IN_PROGRESS"); setStatusDialogOpen(true); }}>
                                <Truck className="h-3.5 w-3.5 mr-1" />Start
                              </Button>
                            )}
                            {order.status === "IN_PROGRESS" && (
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-emerald-600 hover:bg-emerald-50" onClick={() => { setStatusTarget(order.id); setStatusTargetName(order.orderNumber); setStatusNewValue("COMPLETED"); setStatusDialogOpen(true); }}>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
      </SyncedTableScroll>

      {/* Pagination */}
      <motion.div variants={item} className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-[#1D1D1D]">{filteredOrders.length === 0 ? 0 : (page - 1) * pageSize + 1}</span>
          {" "}&ndash;{" "}
          <span className="font-medium text-[#1D1D1D]">{Math.min(page * pageSize, filteredOrders.length)}</span>
          {" "}of <span className="font-medium text-[#1D1D1D]">{filteredOrders.length}</span>
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-[#8A6A4A]/20 text-[#8A6A4A] hover:bg-[#F2D8BE]/50"><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
          <span className="text-sm font-medium text-[#1D1D1D] px-2">{page} / {filteredTotalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= filteredTotalPages} onClick={() => setPage((p) => p + 1)} className="border-[#8A6A4A]/20 text-[#8A6A4A] hover:bg-[#F2D8BE]/50">Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
      </motion.div>

      {/* Bottom Row: Today's Snapshot + Service Health (both with animated gradient borders) */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Today's Snapshot */}
        <div className="analytics-dropdown-border rounded-xl">
          <div className="bg-white rounded-[11px] p-3 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-[#8A6A4A]" />Today&apos;s Snapshot
            </h3>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {[
                { label: "New Orders", value: `+${todayStats.newOrders}`, icon: ShoppingCart, color: "text-[#8A6A4A]" },
                { label: "Completed Today", value: `+${todayStats.completed}`, icon: CheckCircle2, color: "text-emerald-600" },
                { label: "Revenue Today", value: formatCurrency(todayStats.revenue), icon: DollarSign, color: "text-[#8A6A4A]" },
                { label: "Refund Requests", value: `+${todayStats.refunds}`, icon: RotateCcw, color: "text-purple-600" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 p-1.5 rounded-lg bg-[#F2D8BE]/10">
                  <s.icon className={`h-4 w-4 ${s.color} shrink-0`} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1D1D1D] leading-tight">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Health */}
        <div className="analytics-dropdown-border rounded-xl">
          <div className="bg-white rounded-[11px] p-3 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-emerald-600" />Service Health
            </h3>
            <div className="space-y-1.5 flex-1">
              {[
                { name: "Payment Gateway", status: "Operational", color: "bg-emerald-500" },
                { name: "Email Notifications", status: "Healthy", color: "bg-emerald-500" },
                { name: "Order Processing", status: "Healthy", color: "bg-emerald-500" },
                { name: "Publishing Team", status: "Active", color: "bg-blue-500" },
                { name: "Design Team", status: "Active", color: "bg-blue-500" },
                { name: "Marketing Team", status: "Active", color: "bg-blue-500" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-[#F2D8BE]/10">
                  <span className="text-xs text-[#6A4E37]">{s.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${s.color}`} />
                    <span className="text-[10px] font-medium text-[#1D1D1D]">{s.status}</span>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground text-right pt-0.5">Last updated: 2 minutes ago</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status Change Dialog */}
      {statusDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setStatusDialogOpen(false); setStatusTarget(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              {statusNewValue === "IN_PROGRESS" && <Truck className="h-5 w-5 text-blue-600" />}
              {statusNewValue === "COMPLETED" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              {statusNewValue === "CANCELLED" && <XCircle className="h-5 w-5 text-red-600" />}
              {statusNewValue === "REFUNDED" && <RotateCcw className="h-5 w-5 text-purple-600" />}
              <h3 className="text-lg font-semibold text-[#1D1D1D]">Update Order Status?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Order <span className="font-medium text-[#1D1D1D]">{statusTargetName}</span> will be moved to <span className="font-medium text-[#1D1D1D]">{statusNewValue.replace("_", " ").toLowerCase()}</span>.</p>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" size="sm" onClick={() => { setStatusDialogOpen(false); setStatusTarget(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" onClick={() => statusTarget && handleStatusChange(statusTarget, statusNewValue)} className={`${statusNewValue === "COMPLETED" ? "bg-emerald-600 hover:bg-emerald-700" : statusNewValue === "IN_PROGRESS" ? "bg-blue-600 hover:bg-blue-700" : statusNewValue === "CANCELLED" ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"} text-white`}>
                Confirm
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Order Details Drawer */}
      <AnimatePresence>
        {drawerOpen && previewOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawerOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-[#E8DDD0]"
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#1D1D1D]">Order Details</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
                </div>

                {/* Order Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-3 ring-[#D8B27A]/30">
                    <AvatarFallback className="bg-[#8A6A4A] text-white text-lg font-bold">{getInitials(previewOrder.user.name || previewOrder.user.email)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D]">{previewOrder.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{previewOrder.user.name || "No name"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={`${STATUS_CONFIG[previewOrder.status]?.className || ""} text-[11px] font-medium gap-1`}>
                        {(() => { const Icon = STATUS_CONFIG[previewOrder.status]?.icon || Clock; return <Icon className="h-3 w-3" />; })()}
                        {STATUS_CONFIG[previewOrder.status]?.label || previewOrder.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Author Information */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Author Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Name", value: previewOrder.user.name || "No name", icon: Users },
                      { label: "Email", value: previewOrder.user.email, icon: Mail },
                      { label: "Country", value: previewOrder.user.country || "N/A", icon: Globe },
                      { label: "Order Date", value: formatDate(previewOrder.createdAt, "long"), icon: Calendar },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-0.5"><f.icon className="h-3 w-3" />{f.label}</div>
                        <p className="text-xs font-medium text-[#1D1D1D] truncate">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Information */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Order Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Service", value: previewOrder.serviceName, icon: Package },
                      { label: "Package", value: previewOrder.package, icon: FileText },
                      { label: "Amount", value: formatCurrency(previewOrder.total), icon: DollarSign },
                      { label: "Payment", value: previewOrder.paymentStatus, icon: Shield },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-0.5"><f.icon className="h-3 w-3" />{f.label}</div>
                        <p className="text-xs font-medium text-[#1D1D1D]">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Progress</h4>
                  <div className="flex items-center gap-2">
                    {["Submitted", "Assigned", "In Progress", "Delivered"].map((step, i) => {
                      const isCompleted = previewOrder.status === "COMPLETED" || (previewOrder.status === "IN_PROGRESS" && i < 2) || (previewOrder.status === "PENDING" && i === 0);
                      const isCurrent = (previewOrder.status === "PENDING" && i === 0) || (previewOrder.status === "IN_PROGRESS" && i === 2) || (previewOrder.status === "COMPLETED" && i === 3);
                      return (
                        <div key={step} className="flex-1 text-center">
                          <div className={`h-2 rounded-full mb-1 ${isCompleted ? "bg-emerald-500" : isCurrent ? "bg-blue-500" : "bg-[#E8DDD0]"}`} />
                          <p className={`text-[10px] ${isCurrent ? "font-semibold text-[#1D1D1D]" : "text-muted-foreground"}`}>{step}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-[#D8B27A]/15 flex-wrap">
                  {previewOrder.status === "PENDING" && (
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setDrawerOpen(false); setStatusTarget(previewOrder.id); setStatusTargetName(previewOrder.orderNumber); setStatusNewValue("IN_PROGRESS"); setStatusDialogOpen(true); }}>
                      <Truck className="h-3.5 w-3.5 mr-1" />Start
                    </Button>
                  )}
                  {previewOrder.status === "IN_PROGRESS" && (
                    <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setDrawerOpen(false); setStatusTarget(previewOrder.id); setStatusTargetName(previewOrder.orderNumber); setStatusNewValue("COMPLETED"); setStatusDialogOpen(true); }}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />Complete
                    </Button>
                  )}
                  {(previewOrder.status === "PENDING" || previewOrder.status === "IN_PROGRESS") && (
                    <Button size="sm" variant="outline" className="flex-1 border-red-200 text-red-700 hover:bg-red-50" onClick={() => { setDrawerOpen(false); setStatusTarget(previewOrder.id); setStatusTargetName(previewOrder.orderNumber); setStatusNewValue("CANCELLED"); setStatusDialogOpen(true); }}>
                      <XCircle className="h-3.5 w-3.5 mr-1" />Cancel
                    </Button>
                  )}
                  {previewOrder.status === "COMPLETED" && (
                    <Button size="sm" variant="outline" className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50" onClick={() => { setDrawerOpen(false); setStatusTarget(previewOrder.id); setStatusTargetName(previewOrder.orderNumber); setStatusNewValue("REFUNDED"); setStatusDialogOpen(true); }}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />Refund
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1 border-[#8A6A4A]/20 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => setDrawerOpen(false)}>Close</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
