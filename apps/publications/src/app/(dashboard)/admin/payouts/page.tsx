"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SyncedTableScroll, type SyncedTableScrollHandle } from "@/components/ui/synced-table-scroll";
import {
  Search, DollarSign, Clock, CheckCircle2, Wallet, TrendingUp, Calendar,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, BarChart3,
  RefreshCw, Eye, Check, X, Download, Zap, SlidersHorizontal,
  FileText, AlertCircle, RotateCcw, ArrowUpDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatCurrency, cn } from "@/lib/utils";

interface PayoutRecord {
  id: string;
  authorName: string;
  authorEmail: string;
  bookTitle: string;
  royaltyPeriod: string;
  amount: number;
  status: "Pending" | "Approved" | "Paid" | "Rejected";
  requestedDate: string;
  processedDate: string | null;
  paymentMethod: string;
  salesCount: number;
  commissionRate: number;
}

interface ActivityEntry {
  id: string;
  action: string;
  payout: string;
  author: string;
  amount: number;
  time: string;
}

interface UndoEntry {
  action: string;
  data: { id: string; oldStatus: string; newStatus: string }[];
}

const AUTHORS = [
  { name: "Sarah Mitchell", email: "sarah.mitchell@email.com" },
  { name: "James Cooper", email: "james.cooper@email.com" },
  { name: "Emily Watson", email: "emily.watson@email.com" },
  { name: "Lisa Park", email: "lisa.park@email.com" },
  { name: "Michael Brown", email: "michael.brown@email.com" },
  { name: "David Johnson", email: "david.johnson@email.com" },
  { name: "Grace Okafor", email: "grace.okafor@email.com" },
  { name: "Adebayo Ogundimu", email: "adebayo.ogundimu@email.com" },
  { name: "Chinwe Eze", email: "chinwe.eze@email.com" },
  { name: "Fatima Abubakar", email: "fatima.abubakar@email.com" },
];

const BOOKS = [
  "Income Is A Skill",
  "Money Is A Behaviour",
  "Wealth Is A Decision",
  "The Time Keeper",
  "Shadows and Light",
  "Financial Freedom Blueprint",
];

const PAYMENT_METHODS = ["Bank Transfer", "PayPal", "Paystack"];

const MONTHLY_DATA = [
  { month: "Jan", amount: 3200 }, { month: "Feb", amount: 4100 },
  { month: "Mar", amount: 5600 }, { month: "Apr", amount: 4800 },
  { month: "May", amount: 6200 }, { month: "Jun", amount: 6850 },
  { month: "Jul", amount: 5400 }, { month: "Aug", amount: 4900 },
  { month: "Sep", amount: 5800 }, { month: "Oct", amount: 6100 },
  { month: "Nov", amount: 5200 }, { month: "Dec", amount: 4370 },
];

const AUTHOR_EARNINGS = [
  { name: "Sarah Mitchell", earned: 8420 }, { name: "James Cooper", earned: 7150 },
  { name: "Emily Watson", earned: 6380 }, { name: "Lisa Park", earned: 5940 },
  { name: "Michael Brown", earned: 5210 }, { name: "David Johnson", earned: 4780 },
  { name: "Grace Okafor", earned: 4120 }, { name: "Adebayo Ogundimu", earned: 3640 },
];

const CATEGORIES = [
  { key: "all", label: "All Payouts", activeColor: "bg-gray-600" },
  { key: "pending", label: "Pending", activeColor: "bg-amber-500" },
  { key: "approved", label: "Approved", activeColor: "bg-blue-500" },
  { key: "paid", label: "Paid", activeColor: "bg-emerald-500" },
  { key: "rejected", label: "Rejected", activeColor: "bg-red-500" },
  { key: "high-value", label: "High Value", activeColor: "bg-purple-500" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Amount" },
  { value: "lowest", label: "Lowest Amount" },
  { value: "author-az", label: "Author A-Z" },
  { value: "author-za", label: "Author Z-A" },
];

const SUMMARY_CARDS = [
  { key: "total", label: "TOTAL PAYOUTS", value: "124", icon: DollarSign, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40" },
  { key: "pending", label: "PENDING", value: "18", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  { key: "approved", label: "APPROVED", value: "27", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50" },
  { key: "paid", label: "PAID", value: "79", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-50" },
  { key: "total-paid", label: "TOTAL PAID", value: "$48,620", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
  { key: "this-month", label: "THIS MONTH", value: "$6,850", icon: Calendar, color: "text-orange-500", bg: "bg-orange-50" },
];

const activityLog: ActivityEntry[] = [
  { id: "a1", action: "approved", payout: "PAYOUT-2026-003", author: "Emily Watson", amount: 1240, time: "2 hours ago" },
  { id: "a2", action: "paid", payout: "PAYOUT-2026-007", author: "James Cooper", amount: 890, time: "4 hours ago" },
  { id: "a3", action: "approved", payout: "PAYOUT-2026-012", author: "Sarah Mitchell", amount: 2100, time: "6 hours ago" },
  { id: "a4", action: "requested", payout: "PAYOUT-2026-015", author: "Lisa Park", amount: 560, time: "8 hours ago" },
  { id: "a5", action: "paid", payout: "PAYOUT-2026-019", author: "Michael Brown", amount: 1750, time: "Yesterday" },
  { id: "a6", action: "approved", payout: "PAYOUT-2026-023", author: "David Johnson", amount: 340, time: "Yesterday" },
  { id: "a7", action: "rejected", payout: "PAYOUT-2026-028", author: "Grace Okafor", amount: 120, time: "2 days ago" },
  { id: "a8", action: "paid", payout: "PAYOUT-2026-031", author: "Adebayo Ogundimu", amount: 1980, time: "2 days ago" },
  { id: "a9", action: "approved", payout: "PAYOUT-2026-035", author: "Chinwe Eze", amount: 670, time: "3 days ago" },
  { id: "a10", action: "paid", payout: "PAYOUT-2026-042", author: "Fatima Abubakar", amount: 1430, time: "3 days ago" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function generateDemoPayouts(): PayoutRecord[] {
  const payouts: PayoutRecord[] = [];
  const statusDistribution: ("Paid" | "Approved" | "Pending" | "Rejected")[] = [];
  for (let i = 0; i < 79; i++) statusDistribution.push("Paid");
  for (let i = 0; i < 27; i++) statusDistribution.push("Approved");
  for (let i = 0; i < 18; i++) statusDistribution.push("Pending");
  for (let i = 0; i < 0; i++) statusDistribution.push("Rejected");

  let runningPaidTotal = 0;
  for (let i = 0; i < 124; i++) {
    const author = AUTHORS[i % AUTHORS.length];
    const book = BOOKS[i % BOOKS.length];
    const status = statusDistribution[i];
    const daysAgo = Math.floor(Math.random() * 180) + 1;
    const requestedDate = new Date(Date.now() - daysAgo * 86400000);
    let amount: number;
    if (i < 10) {
      amount = Math.floor(Math.random() * 1450) + 1000;
    } else if (i < 40) {
      amount = Math.floor(Math.random() * 700) + 300;
    } else {
      amount = Math.floor(Math.random() * 255) + 45;
    }
    if (status === "Paid" && runningPaidTotal < 48620) {
      if (i === 78) {
        amount = 48620 - runningPaidTotal;
        if (amount < 45) amount = Math.floor(Math.random() * 150) + 100;
      }
      runningPaidTotal += amount;
    }
    const processedDate = status === "Paid" || status === "Approved"
      ? new Date(requestedDate.getTime() + Math.floor(Math.random() * 5 + 1) * 86400000).toISOString()
      : null;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const royaltyPeriod = `${months[i % 6]} 2026`;
    const salesCount = Math.floor(amount / (8 + Math.random() * 12));
    const commissionRate = Math.round((0.08 + Math.random() * 0.07) * 100) / 100;

    payouts.push({
      id: `PAYOUT-2026-${String(i + 1).padStart(3, "0")}`,
      authorName: author.name,
      authorEmail: author.email,
      bookTitle: book,
      royaltyPeriod,
      amount,
      status,
      requestedDate: requestedDate.toISOString(),
      processedDate,
      paymentMethod: PAYMENT_METHODS[i % 3],
      salesCount,
      commissionRate,
    });
  }
  return payouts;
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

export default function AdminPayoutsPage() {
  const [allPayouts, setAllPayouts] = useState<PayoutRecord[]>(() => generateDemoPayouts());
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeSummaryCard, setActiveSummaryCard] = useState<string | null>(null);
  const [authorDrawerOpen, setAuthorDrawerOpen] = useState(false);
  const [authorDrawerData, setAuthorDrawerData] = useState<any>(null);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [detailsDrawerData, setDetailsDrawerData] = useState<PayoutRecord | null>(null);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoEntry[]>([]);
  const [undoConfirmOpen, setUndoConfirmOpen] = useState(false);
  const [undoConfirmAction, setUndoConfirmAction] = useState<"undo" | "redo" | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const sortFilterRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const tableScroll = useRef<SyncedTableScrollHandle>(null);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortFilterRef.current && !sortFilterRef.current.contains(e.target as Node)) setSortFilterOpen(false);
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) setQuickActionsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (undoStack.length > 0) {
          setUndoConfirmAction("undo");
          setUndoConfirmOpen(true);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        if (redoStack.length > 0) {
          setUndoConfirmAction("redo");
          setUndoConfirmOpen(true);
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [undoStack, redoStack]);

  useEffect(() => { setPage(1); }, [search, activeCategory, sortOption, pageSize]);

  const stats = useMemo(() => {
    const pending = allPayouts.filter((p) => p.status === "Pending").length;
    const approved = allPayouts.filter((p) => p.status === "Approved").length;
    const paid = allPayouts.filter((p) => p.status === "Paid").length;
    const rejected = allPayouts.filter((p) => p.status === "Rejected").length;
    const totalPaid = allPayouts.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
    const highValue = allPayouts.filter((p) => p.amount > 1000).length;
    return { pending, approved, paid, rejected, totalPaid, highValue, total: allPayouts.length };
  }, [allPayouts]);

  const filteredPayouts = useMemo(() => {
    let result = [...allPayouts];
    if (activeCategory === "pending") result = result.filter((p) => p.status === "Pending");
    else if (activeCategory === "approved") result = result.filter((p) => p.status === "Approved");
    else if (activeCategory === "paid") result = result.filter((p) => p.status === "Paid");
    else if (activeCategory === "rejected") result = result.filter((p) => p.status === "Rejected");
    else if (activeCategory === "high-value") result = result.filter((p) => p.amount > 1000);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.authorName.toLowerCase().includes(q) ||
        p.authorEmail.toLowerCase().includes(q) ||
        p.bookTitle.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }

    switch (sortOption) {
      case "newest": result.sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime()); break;
      case "oldest": result.sort((a, b) => new Date(a.requestedDate).getTime() - new Date(b.requestedDate).getTime()); break;
      case "highest": result.sort((a, b) => b.amount - a.amount); break;
      case "lowest": result.sort((a, b) => a.amount - b.amount); break;
      case "author-az": result.sort((a, b) => a.authorName.localeCompare(b.authorName)); break;
      case "author-za": result.sort((a, b) => b.authorName.localeCompare(a.authorName)); break;
    }
    return result;
  }, [allPayouts, activeCategory, search, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredPayouts.length / pageSize));
  const displayedPayouts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPayouts.slice(start, start + pageSize);
  }, [filteredPayouts, page, pageSize]);

  const allSelected = displayedPayouts.length > 0 && displayedPayouts.every((p) => selectedIds.has(p.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(displayedPayouts.map((p) => p.id)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pushUndo = (action: string, changes: { id: string; oldStatus: string; newStatus: string }[]) => {
    setUndoStack((prev) => [...prev, { action, data: changes }]);
    setRedoStack([]);
  };

  const handleApprove = (ids: string[]) => {
    const changes = ids.map((id) => {
      const p = allPayouts.find((x) => x.id === id);
      return { id, oldStatus: p?.status || "", newStatus: "Approved" };
    });
    pushUndo("approve", changes);
    setAllPayouts((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, status: "Approved" as const, processedDate: new Date().toISOString() } : p));
    setSelectedIds(new Set());
    showNotification("success", `${ids.length} payout${ids.length > 1 ? "s" : ""} approved`);
  };

  const handleMarkPaid = (ids: string[]) => {
    const changes = ids.map((id) => {
      const p = allPayouts.find((x) => x.id === id);
      return { id, oldStatus: p?.status || "", newStatus: "Paid" };
    });
    pushUndo("mark-paid", changes);
    setAllPayouts((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, status: "Paid" as const, processedDate: new Date().toISOString() } : p));
    setSelectedIds(new Set());
    showNotification("success", `${ids.length} payout${ids.length > 1 ? "s" : ""} marked as paid`);
  };

  const handleReject = (ids: string[]) => {
    const changes = ids.map((id) => {
      const p = allPayouts.find((x) => x.id === id);
      return { id, oldStatus: p?.status || "", newStatus: "Rejected" };
    });
    pushUndo("reject", changes);
    setAllPayouts((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, status: "Rejected" as const } : p));
    setSelectedIds(new Set());
    showNotification("success", `${ids.length} payout${ids.length > 1 ? "s" : ""} rejected`);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setAllPayouts((prev) => prev.map((p) => {
      const change = last.data.find((c) => c.id === p.id);
      if (change) return { ...p, status: change.oldStatus as PayoutRecord["status"] };
      return p;
    }));
    setRedoStack((prev) => [...prev, last]);
    setUndoStack((prev) => prev.slice(0, -1));
    showNotification("success", "Action undone");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setAllPayouts((prev) => prev.map((p) => {
      const change = last.data.find((c) => c.id === p.id);
      if (change) return { ...p, status: change.newStatus as PayoutRecord["status"] };
      return p;
    }));
    setUndoStack((prev) => [...prev, last]);
    setRedoStack((prev) => prev.slice(0, -1));
    showNotification("success", "Action redone");
  };

  const openAuthorDrawer = (payout: PayoutRecord) => {
    const authorPayouts = allPayouts.filter((p) => p.authorEmail === payout.authorEmail);
    const totalEarned = authorPayouts.reduce((s, p) => s + p.amount, 0);
    const pendingAmount = authorPayouts.filter((p) => p.status === "Pending" || p.status === "Approved").reduce((s, p) => s + p.amount, 0);
    const paidAmount = authorPayouts.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
    const lastPaid = authorPayouts.filter((p) => p.status === "Paid").sort((a, b) => new Date(b.processedDate || b.requestedDate).getTime() - new Date(a.processedDate || a.requestedDate).getTime())[0];
    setAuthorDrawerData({
      ...payout,
      totalPayouts: authorPayouts.length,
      totalEarned,
      pendingAmount,
      paidAmount,
      lastPayoutDate: lastPaid?.processedDate || null,
      booksPublished: new Set(authorPayouts.map((p) => p.bookTitle)).size,
      totalSales: authorPayouts.reduce((s, p) => s + p.salesCount, 0),
    });
    setAuthorDrawerOpen(true);
  };

  const openDetailsDrawer = (payout: PayoutRecord) => {
    setDetailsDrawerData(payout);
    setDetailsDrawerOpen(true);
  };

  const exportCSV = (data: PayoutRecord[]) => {
    const headers = ["Payout ID", "Author", "Email", "Book", "Period", "Amount", "Status", "Requested", "Processed", "Method"];
    const rows = data.map((p) => [p.id, p.authorName, p.authorEmail, p.bookTitle, p.royaltyPeriod, String(p.amount), p.status, p.requestedDate, p.processedDate || "", p.paymentMethod]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `payouts-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    showNotification("success", "CSV exported successfully");
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Approved": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Paid": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const maxEarning = Math.max(...AUTHOR_EARNINGS.map((a) => a.earned));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {notification && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${notification.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {notification.message}
        </motion.div>
      )}

      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Payout Management</h1>
          <p className="text-sm text-muted-foreground">Process withdrawals and manage author royalty payments.</p>
        </div>
        <div className="flex items-center gap-2">
          {(undoStack.length > 0 || redoStack.length > 0) && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => { setUndoConfirmAction("undo"); setUndoConfirmOpen(true); }} disabled={undoStack.length === 0} className="h-8 w-8 p-0 text-[#8A6A4A] hover:bg-[#F2D8BE]">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setUndoConfirmAction("redo"); setUndoConfirmOpen(true); }} disabled={redoStack.length === 0} className="h-8 w-8 p-0 text-[#8A6A4A] hover:bg-[#F2D8BE]">
                <RotateCcw className="h-4 w-4 scale-x-[-1]" />
              </Button>
            </div>
          )}
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" onClick={() => { setAllPayouts(generateDemoPayouts()); showNotification("success", "Payouts refreshed"); }} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
              <RefreshCw className="h-4 w-4 mr-1" />Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SUMMARY_CARDS.map((card) => {
          const isActive = activeSummaryCard === card.key;
          const cardFilter = card.key === "pending" ? "pending" : card.key === "approved" ? "approved" : card.key === "paid" ? "paid" : null;
          return (
            <motion.div key={card.key} variants={item} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Card onClick={() => { if (cardFilter) { setActiveCategory(isActive && activeCategory === cardFilter ? "all" : cardFilter); setActiveSummaryCard(isActive ? null : card.key); } }} className={`shadow-sm transition-all duration-200 bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] border-[#D8B27A]/20 ${isActive ? "ring-2 ring-[#D8B27A] shadow-md border-[#D8B27A]/40" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg p-2", card.bg, card.color)}><card.icon className="h-4 w-4" /></div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D] mb-0.5">{card.label}</p>
                      <motion.p key={card.value} initial={{ scale: 1.15, color: "#D8B27A" }} animate={{ scale: 1, color: "#1D1D1D" }} transition={{ duration: 0.3 }} className="text-2xl font-bold">{card.value}</motion.p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div variants={item}>
        <div className="analytics-dropdown-border">
          <Card className="shadow-sm bg-white">
            <button onClick={() => setAnalyticsOpen(!analyticsOpen)} className="w-full flex items-center justify-between p-4 hover:bg-[#F2D8BE]/10 transition-colors rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#8A6A4A]" />
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Payout Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Monthly Payout Trend</h4>
                      <div className="flex items-end gap-1.5 h-32">
                        {MONTHLY_DATA.map((m, i) => {
                          const maxVal = Math.max(...MONTHLY_DATA.map((x) => x.amount));
                          const height = (m.amount / maxVal) * 100;
                          return (
                            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[8px] text-[#5C4A3D] font-medium">${(m.amount / 1000).toFixed(1)}k</span>
                              <div className="w-full rounded-t" style={{ height: `${height}%`, backgroundColor: i === MONTHLY_DATA.length - 1 ? "#8A6A4A" : "#D8B27A", opacity: i === MONTHLY_DATA.length - 1 ? 1 : 0.6 + (i / MONTHLY_DATA.length) * 0.4 }} />
                              <span className="text-[8px] text-[#5C4A3D]">{m.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Top Earning Authors</h4>
                      <div className="space-y-2.5">
                        {AUTHOR_EARNINGS.map((a, i) => (
                          <div key={a.name} className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-[#8A6A4A] w-4 text-center">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between text-[10px] mb-0.5">
                                <span className="text-[#5C4A3D] truncate">{a.name}</span>
                                <span className="font-semibold text-[#1D1D1D] flex-shrink-0">${a.earned.toLocaleString()}</span>
                              </div>
                              <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                                <div className="h-full bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A] rounded-full" style={{ width: `${(a.earned / maxEarning) * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Payout Status Breakdown</h4>
                      <div className="space-y-3">
                        {[
                          { label: "Paid", count: stats.paid, total: stats.total, color: "bg-emerald-500" },
                          { label: "Approved", count: stats.approved, total: stats.total, color: "bg-blue-500" },
                          { label: "Pending", count: stats.pending, total: stats.total, color: "bg-amber-500" },
                          { label: "Rejected", count: stats.rejected, total: stats.total, color: "bg-red-500" },
                        ].map((s) => (
                          <div key={s.label}>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-[#5C4A3D]">{s.label}</span>
                              <span className="font-bold text-[#1D1D1D]">{s.count} ({Math.round((s.count / s.total) * 100)}%)</span>
                            </div>
                            <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                              <div className={cn("h-full rounded-full", s.color)} style={{ width: `${(s.count / s.total) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Revenue vs Royalties</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                          <p className="text-[10px] text-[#5C4A3D] mb-1">Platform Revenue</p>
                          <p className="text-xl font-bold text-[#1D1D1D]">$89,400</p>
                          <p className="text-[9px] text-emerald-600 font-medium mt-0.5">+12.3% this month</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                          <p className="text-[10px] text-[#5C4A3D] mb-1">Author Royalties</p>
                          <p className="text-xl font-bold text-[#8A6A4A]">$48,620</p>
                          <p className="text-[9px] text-emerald-600 font-medium mt-0.5">+8.7% this month</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#D8B27A]/15 grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-[10px] text-[#5C4A3D]">Commission Rate</p>
                          <p className="text-sm font-bold text-[#1D1D1D]">12.5%</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5C4A3D]">Avg Author Earnings</p>
                          <p className="text-sm font-bold text-[#8A6A4A]">$4,862</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5 lg:col-span-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Average Author Earnings</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: "Avg Monthly", value: "$4,862", sub: "Per author" },
                          { label: "Median Monthly", value: "$3,940", sub: "Per author" },
                          { label: "Top Earner", value: "$8,420", sub: "Sarah Mitchell" },
                          { label: "Avg Processing", value: "2.3 days", sub: "Request to pay" },
                        ].map((stat) => (
                          <div key={stat.label} className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                            <p className="text-[10px] text-[#5C4A3D] mb-1">{stat.label}</p>
                            <p className="text-lg font-bold text-[#1D1D1D]">{stat.value}</p>
                            <p className="text-[9px] text-[#5C4A3D] mt-0.5">{stat.sub}</p>
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

      <motion.div variants={item} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="search-bar-border relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input placeholder="Search by author, email, book title, or payout ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9 relative z-[1]" />
          </div>

          <div className="flex items-center gap-2" ref={sortFilterRef}>
            <div className="relative">
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button variant="outline" size="sm" onClick={() => setSortFilterOpen(!sortFilterOpen)} className={`h-9 px-3 border-0 bg-white text-sm font-medium gap-2 ${sortOption !== "newest" ? "text-[#D8B27A]" : "text-[#8A6A4A] hover:bg-[#F2D8BE]"}`}>
                  <SlidersHorizontal className="h-4 w-4" /><span className="hidden sm:inline">Sort & Filter</span><ChevronRight className={`h-3.5 w-3.5 transition-transform ${sortFilterOpen ? "rotate-90" : ""}`} />
                </Button>
              </div>
              <AnimatePresence>
                {sortFilterOpen && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 w-[240px] bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#E8DDD0] bg-[#F5EDE3]/30 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#8A6A4A]" />Sort By</h4>
                      {sortOption !== "newest" && <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={() => setSortOption("newest")}><X className="h-3 w-3 mr-1" />Clear</Button>}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      {SORT_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => { setSortOption(opt.value); setSortFilterOpen(false); }} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortOption === opt.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}>
                          {opt.label}
                        </button>
                      ))}
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
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative" ref={quickActionsRef}>
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <Button variant="outline" size="sm" onClick={() => setQuickActionsOpen(!quickActionsOpen)} className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
                <Zap className="h-4 w-4" /><span className="hidden sm:inline">Quick Actions</span><ChevronRight className={`h-3.5 w-3.5 transition-transform ${quickActionsOpen ? "rotate-90" : ""}`} />
              </Button>
            </div>
            {quickActionsOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 p-2">
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportCSV(allPayouts); setQuickActionsOpen(false); }}><Download className="h-3.5 w-3.5 mr-1.5" />Export CSV</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportCSV(allPayouts); setQuickActionsOpen(false); }}><Download className="h-3.5 w-3.5 mr-1.5" />Export Excel</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "PDF export started"); setQuickActionsOpen(false); }}><Download className="h-3.5 w-3.5 mr-1.5" />Export PDF</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Royalty report downloading"); setQuickActionsOpen(false); }}><FileText className="h-3.5 w-3.5 mr-1.5" />Download Royalty Report</Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button key={cat.key} onClick={() => { setActiveCategory(activeCategory === cat.key && cat.key !== "all" ? "all" : cat.key); setActiveSummaryCard(null); }} className={cn("shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all", activeCategory === cat.key && cat.key !== "all" ? "text-white shadow-sm" : cat.key === "all" && activeCategory === "all" ? "bg-gray-600 text-white border-gray-600 shadow-sm" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]")} style={activeCategory === cat.key && cat.key !== "all" ? { backgroundColor: cat.activeColor.replace("bg-", ""), borderColor: cat.activeColor.replace("bg-", "") } : undefined}>
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 p-3 bg-[#F2D8BE]/20 rounded-lg border border-[#D8B27A]/30">
              <span className="text-sm font-semibold text-[#1D1D1D]">{selectedIds.size} Payout{selectedIds.size > 1 ? "s" : ""} Selected</span>
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => handleApprove(Array.from(selectedIds))}>
                  <CheckCircle2 className="h-3 w-3 mr-1" />Approve
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => handleMarkPaid(Array.from(selectedIds))}>
                  <Wallet className="h-3 w-3 mr-1" />Mark Paid
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-[#8A6A4A]/30 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => { const selected = allPayouts.filter((p) => selectedIds.has(p.id)); exportCSV(selected); }}>
                  <Download className="h-3 w-3 mr-1" />Export
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-[#8A6A4A]/30 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => showNotification("success", "Statement downloaded")}>
                  <FileText className="h-3 w-3 mr-1" />Download Statement
                </Button>
                <div className="h-4 w-px bg-[#D8B27A]/30" />
                <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground" onClick={() => setSelectedIds(new Set())}>Clear</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground bg-[#F2D8BE]/15 rounded-lg px-4 py-2 border border-[#D8B27A]/10">
        <span>Showing <span className="font-semibold text-[#1D1D1D]">{displayedPayouts.length}</span> of <span className="font-semibold text-[#1D1D1D]">{filteredPayouts.length}</span> payouts</span>
        <span className="hidden sm:inline text-[#E8DDD0]">|</span>
        <span><span className="text-amber-600 font-medium">{stats.pending}</span> Pending</span>
        <span><span className="text-blue-600 font-medium">{stats.approved}</span> Approved</span>
        <span><span className="text-emerald-600 font-medium">{stats.paid}</span> Paid</span>
        <span><span className="text-[#8A6A4A] font-medium">$48,620</span> Total Paid</span>
      </motion.div>

      <SyncedTableScroll ref={tableScroll} loading={false}>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F2D8BE]/20 hover:bg-[#F2D8BE]/30 sticky top-0 z-10">
              <TableHead className="w-10">
                <button onClick={toggleSelectAll} className="flex items-center justify-center">
                  {allSelected ? <Check className="h-4 w-4 text-[#8A6A4A]" /> : <div className="h-4 w-4 border-2 border-[#E8DDD0] rounded" />}
                </button>
              </TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold">Payout ID</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden md:table-cell">Author</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell">Book Title</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell">Period</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold text-right">Amount</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden xl:table-cell">Requested</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden xl:table-cell">Processed</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedPayouts.length === 0 ? (
              <TableRow><TableCell colSpan={10} className="text-center py-16">
                <DollarSign className="mx-auto h-10 w-10 text-[#D8B27A]/50 mb-3" />
                <p className="text-sm font-medium text-[#1D1D1D]">No payouts found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
              </TableCell></TableRow>
            ) : (
              displayedPayouts.map((payout) => (
                <TableRow key={payout.id} className={cn("hover:bg-[#8A6A4A]/[0.04] hover:shadow-sm transition-all duration-150 cursor-default border-b border-[#E8DDD0]/50", selectedIds.has(payout.id) && "bg-[#F2D8BE]/15")}>
                  <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(payout.id)} className="flex items-center justify-center">
                      {selectedIds.has(payout.id) ? <Check className="h-4 w-4 text-[#8A6A4A]" /> : <div className="h-4 w-4 border-2 border-[#E8DDD0] rounded" />}
                    </button>
                  </TableCell>
                  <TableCell className="py-2">
                    <p className="text-xs font-mono font-medium text-[#1D1D1D]">{payout.id}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-2 cursor-pointer" onClick={() => openAuthorDrawer(payout)}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px] bg-[#8A6A4A]/10 text-[#8A6A4A]">{getInitials(payout.authorName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1D1D1D] truncate max-w-[140px]">{payout.authorName}</p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">{payout.authorEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-2">
                    <p className="text-sm text-[#5C4A3D] truncate max-w-[160px]">{payout.bookTitle}</p>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-2">
                    <p className="text-sm text-[#5C4A3D]">{payout.royaltyPeriod}</p>
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <span className={cn("text-sm font-bold", payout.amount > 1000 ? "text-[#8A6A4A]" : "text-[#1D1D1D]")}>{formatCurrency(payout.amount)}</span>
                    {payout.amount > 1000 && <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700 border-amber-200 text-[8px] h-3.5 px-1">High Value</Badge>}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-2">
                    <Badge variant="secondary" className={cn("text-[10px] border", statusBadgeColor(payout.status))}>{payout.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell py-2">
                    <p className="text-xs text-muted-foreground">{new Date(payout.requestedDate).toLocaleDateString()}</p>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell py-2">
                    <p className="text-xs text-muted-foreground">{payout.processedDate ? new Date(payout.processedDate).toLocaleDateString() : "—"}</p>
                  </TableCell>
                  <TableCell className="text-right py-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-0.5">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => openDetailsDrawer(payout)} title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(payout.status === "Pending") && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50" onClick={() => handleApprove([payout.id])} title="Approve">
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      {(payout.status === "Approved") && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50" onClick={() => handleMarkPaid([payout.id])} title="Mark Paid">
                          <Wallet className="h-4 w-4" />
                        </Button>
                      )}
                      {(payout.status === "Pending" || payout.status === "Approved") && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600 hover:bg-red-50" onClick={() => handleReject([payout.id])} title="Reject">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </SyncedTableScroll>

      <motion.div variants={item} className="flex items-center justify-between">
        <p className="text-sm text-[#5C4A3D]">
          Showing <span className="font-medium text-[#1D1D1D]">{filteredPayouts.length === 0 ? 0 : (page - 1) * pageSize + 1}</span> &ndash; <span className="font-medium text-[#1D1D1D]">{Math.min(page * pageSize, filteredPayouts.length)}</span> of <span className="font-medium text-[#1D1D1D]">{filteredPayouts.length}</span> payouts
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]">
            <ChevronLeft className="h-4 w-4 mr-1" />Previous
          </Button>
          <span className="text-sm font-medium text-[#1D1D1D] px-2">Page {page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]">
            Next<ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {activityLog.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                  <div className={cn("h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0", entry.action === "approved" ? "bg-blue-50" : entry.action === "paid" ? "bg-emerald-50" : entry.action === "rejected" ? "bg-red-50" : "bg-amber-50")}>
                    {entry.action === "approved" ? <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> : entry.action === "paid" ? <Wallet className="h-3.5 w-3.5 text-emerald-600" /> : entry.action === "rejected" ? <X className="h-3.5 w-3.5 text-red-600" /> : <Clock className="h-3.5 w-3.5 text-amber-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1D1D1D]">
                      <span className="capitalize">{entry.action}</span> payout <span className="font-mono text-[#8A6A4A]">{entry.payout}</span> for <span className="font-medium">{entry.author}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">{entry.time}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#1D1D1D] flex-shrink-0">{formatCurrency(entry.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={authorDrawerOpen} onOpenChange={setAuthorDrawerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1D1D1D]">Author Profile</DialogTitle>
            <DialogDescription>Author payout details and history</DialogDescription>
          </DialogHeader>
          {authorDrawerData && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#F2D8BE]/10 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-[#8A6A4A]/10 text-[#8A6A4A] font-semibold">{getInitials(authorDrawerData.authorName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-[#1D1D1D]">{authorDrawerData.authorName}</p>
                  <p className="text-xs text-muted-foreground">{authorDrawerData.authorEmail}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Books Published", value: authorDrawerData.booksPublished },
                  { label: "Total Payouts", value: authorDrawerData.totalPayouts },
                  { label: "Lifetime Royalties", value: formatCurrency(authorDrawerData.totalEarned) },
                  { label: "Pending Royalties", value: formatCurrency(authorDrawerData.pendingAmount) },
                  { label: "Total Sales", value: authorDrawerData.totalSales.toLocaleString() },
                  { label: "Payment Method", value: authorDrawerData.paymentMethod },
                ].map((stat) => (
                  <div key={stat.label} className="p-2.5 rounded-lg bg-white border border-[#E8DDD0]">
                    <p className="text-[10px] text-muted-foreground mb-0.5">{stat.label}</p>
                    <p className="text-sm font-bold text-[#1D1D1D]">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-2.5 rounded-lg bg-[#F2D8BE]/10 border border-[#D8B27A]/15">
                <p className="text-[10px] text-muted-foreground mb-0.5">Last Payout</p>
                <p className="text-sm font-semibold text-[#1D1D1D]">{authorDrawerData.lastPayoutDate ? new Date(authorDrawerData.lastPayoutDate).toLocaleDateString() : "No payouts yet"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDrawerOpen} onOpenChange={setDetailsDrawerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1D1D1D]">Payout Details</DialogTitle>
            <DialogDescription>Detailed breakdown of this payout</DialogDescription>
          </DialogHeader>
          {detailsDrawerData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#F2D8BE]/10 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Payout ID</p>
                  <p className="text-sm font-mono font-bold text-[#1D1D1D]">{detailsDrawerData.id}</p>
                </div>
                <Badge variant="secondary" className={cn("text-[10px] border", statusBadgeColor(detailsDrawerData.status))}>{detailsDrawerData.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-white border border-[#E8DDD0]">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Author</p>
                  <p className="text-sm font-semibold text-[#1D1D1D]">{detailsDrawerData.authorName}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E8DDD0]">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Book Title</p>
                  <p className="text-sm font-semibold text-[#1D1D1D]">{detailsDrawerData.bookTitle}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E8DDD0]">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Royalty Period</p>
                  <p className="text-sm font-semibold text-[#1D1D1D]">{detailsDrawerData.royaltyPeriod}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E8DDD0]">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Sales Count</p>
                  <p className="text-sm font-semibold text-[#1D1D1D]">{detailsDrawerData.salesCount.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#E8DDD0]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Royalty Breakdown</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span className="text-[#5C4A3D]">Gross Revenue</span><span className="font-medium text-[#1D1D1D]">{formatCurrency(detailsDrawerData.amount * 1.15)}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[#5C4A3D]">Commission ({Math.round(detailsDrawerData.commissionRate * 100)}%)</span><span className="font-medium text-red-600">-{formatCurrency(detailsDrawerData.amount * detailsDrawerData.commissionRate)}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[#5C4A3D]">Platform Fee</span><span className="font-medium text-red-600">-{formatCurrency(detailsDrawerData.amount * 0.02)}</span></div>
                  <div className="border-t border-[#E8DDD0] pt-1.5 flex justify-between text-xs"><span className="font-semibold text-[#1D1D1D]">Net Payout</span><span className="font-bold text-[#8A6A4A]">{formatCurrency(detailsDrawerData.amount)}</span></div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#E8DDD0]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Payment History</h4>
                <div className="space-y-2">
                  {[
                    { step: "Requested", date: detailsDrawerData.requestedDate, done: true },
                    { step: "Approved", date: detailsDrawerData.processedDate, done: detailsDrawerData.status === "Approved" || detailsDrawerData.status === "Paid" },
                    { step: "Processed", date: detailsDrawerData.status === "Paid" ? detailsDrawerData.processedDate : null, done: detailsDrawerData.status === "Paid" },
                    { step: "Paid", date: detailsDrawerData.status === "Paid" ? detailsDrawerData.processedDate : null, done: detailsDrawerData.status === "Paid" },
                  ].map((step, i) => (
                    <div key={step.step} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn("h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0", step.done ? "bg-emerald-100" : "bg-gray-100")}>
                          {step.done ? <Check className="h-3 w-3 text-emerald-600" /> : <div className="h-2 w-2 rounded-full bg-gray-300" />}
                        </div>
                        {i < 3 && <div className={cn("w-px h-4", step.done ? "bg-emerald-200" : "bg-gray-200")} />}
                      </div>
                      <div className="min-w-0">
                        <p className={cn("text-xs font-medium", step.done ? "text-[#1D1D1D]" : "text-muted-foreground")}>{step.step}</p>
                        <p className="text-[10px] text-muted-foreground">{step.date ? new Date(step.date).toLocaleString() : "Pending..."}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={undoConfirmOpen} onOpenChange={setUndoConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#1D1D1D]">{undoConfirmAction === "undo" ? "Undo Action" : "Redo Action"}</DialogTitle>
            <DialogDescription>
              {undoConfirmAction === "undo" ? "Are you sure you want to undo the last action?" : "Are you sure you want to redo this action?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUndoConfirmOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
            <Button onClick={() => { if (undoConfirmAction === "undo") handleUndo(); else handleRedo(); setUndoConfirmOpen(false); }} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
              {undoConfirmAction === "undo" ? <RotateCcw className="h-4 w-4 mr-1" /> : <RotateCcw className="h-4 w-4 mr-1 scale-x-[-1]" />}
              {undoConfirmAction === "undo" ? "Undo" : "Redo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}