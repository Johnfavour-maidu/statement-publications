"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SyncedTableScroll, type SyncedTableScrollHandle } from "@/components/ui/synced-table-scroll";
import {
  Search, Users, UserCheck, Shield, BookOpen, CheckCircle2, Ban, Eye,
  Mail, Calendar, MailCheck, MailX, ShoppingCart, Star, UserX, RefreshCw,
  ChevronLeft, ChevronRight, Globe, TrendingUp, Clock, AlertTriangle,
  DollarSign, FileText, Activity, Download, Trash2, CheckSquare, Square,
  History, X, Send, SlidersHorizontal, ArrowUpDown, ArrowDownUp,
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
import { formatDate, getInitials, formatCurrency } from "@/lib/utils";
import { actionHistory } from "@/lib/action-history";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type FilterTab = "all" | "verified" | "unverified" | "active" | "inactive" | "suspended" | "most_published" | "new" | "old";

interface SortFilterState {
  country: string;
  status: string;
  publishing: string;
  lastLogin: string;
  registration: string;
  alphabetical: string;
}

interface AuthorRecord {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  accountStatus?: string;
  emailVerified: string | null;
  createdAt: string;
  lastLogin?: string | null;
  country?: string;
  booksPublished?: number;
  serviceOrders?: number;
  suspensionReason?: string | null;
  suspensionDate?: string | null;
  verificationDate?: string | null;
  _count: { orders: number; reviews: number; followers: number };
}

interface PlatformStats {
  totalAuthors: number;
  verifiedAuthors: number;
  unverifiedAuthors: number;
  activeAuthors: number;
  inactiveAuthors: number;
  suspendedAuthors: number;
}

interface ActivityEntry {
  id: string;
  action: "verified" | "suspended" | "reinstated" | "bulk_verified" | "bulk_suspended" | "bulk_reinstated";
  authorName: string;
  count?: number;
  timestamp: string;
}

const AVATAR_COLORS = [
  "bg-[#8A6A4A]", "bg-[#D8B27A]", "bg-rose-500", "bg-emerald-600",
  "bg-violet-500", "bg-cyan-600", "bg-amber-600", "bg-indigo-500",
  "bg-teal-500", "bg-pink-500",
];

const INITIAL_STATS: PlatformStats = {
  totalAuthors: 179,
  verifiedAuthors: 164,
  unverifiedAuthors: 15,
  activeAuthors: 92,
  inactiveAuthors: 44,
  suspendedAuthors: 28,
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const STAT_CARD_MAP: Record<string, FilterTab> = {
  "Total Authors": "all",
  "Verified": "verified",
  "Unverified": "unverified",
  "Active": "active",
  "Inactive": "inactive",
  "Suspended": "suspended",
};

const EMPTY_STATE_MESSAGES: Record<FilterTab, { icon: React.ComponentType<{ className?: string }>; title: string; description: string }> = {
  all: { icon: Users, title: "No authors found", description: "Try adjusting your search or filters." },
  verified: { icon: CheckCircle2, title: "No verified authors found", description: "All authors are currently unverified." },
  unverified: { icon: MailX, title: "No authors awaiting verification", description: "All authors have been verified." },
  active: { icon: UserCheck, title: "No active authors found", description: "No authors are currently active on the platform." },
  inactive: { icon: Clock, title: "No inactive authors found", description: "All authors have recent activity." },
  suspended: { icon: Ban, title: "No suspended authors found", description: "No authors have been suspended." },
  most_published: { icon: TrendingUp, title: "No authors meet the publication threshold", description: "No authors currently have more than 30 published books." },
  new: { icon: Calendar, title: "No recent authors found", description: "No new authors have registered recently." },
  old: { icon: Clock, title: "No authors found", description: "No authors match this filter." },
};

export default function AdminAuthorsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [authors, setAuthors] = useState<AuthorRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);

  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState<string | null>(null);
  const [verifyTargetName, setVerifyTargetName] = useState("");

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const [suspendTargetName, setSuspendTargetName] = useState("");

  const [reinstateDialogOpen, setReinstateDialogOpen] = useState(false);
  const [reinstateTarget, setReinstateTarget] = useState<string | null>(null);
  const [reinstateTargetName, setReinstateTargetName] = useState("");

  const [previewAuthor, setPreviewAuthor] = useState<AuthorRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [sortFilter, setSortFilter] = useState<SortFilterState>({ country: "", status: "", publishing: "", lastLogin: "", registration: "", alphabetical: "" });
  const [allAuthors, setAllAuthors] = useState<AuthorRecord[]>([]);
  const [allTotal, setAllTotal] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSortFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasActiveFilter = Object.values(sortFilter).some(Boolean);

  const activeFilterLabel = useMemo(() => {
    const labels: string[] = [];
    if (sortFilter.country) labels.push(sortFilter.country);
    if (sortFilter.status) labels.push(sortFilter.status.replace("_", " "));
    if (sortFilter.publishing) labels.push(sortFilter.publishing.replace(/_/g, " "));
    if (sortFilter.lastLogin) labels.push(sortFilter.lastLogin.replace(/_/g, " "));
    if (sortFilter.registration) labels.push(sortFilter.registration.replace("_", " "));
    if (sortFilter.alphabetical) labels.push(sortFilter.alphabetical === "az" ? "Name A-Z" : "Name Z-A");
    return labels.length > 0 ? labels.join(", ") : "Sort & Filter";
  }, [sortFilter]);

  const clearSortFilter = () => {
    setSortFilter({ country: "", status: "", publishing: "", lastLogin: "", registration: "", alphabetical: "" });
    setActiveTab("all");
  };

  const getAccountStatus = (a: AuthorRecord): string => {
    if (!a.isVerified) return "unverified";
    if (a.accountStatus === "suspended") return "suspended";
    if (a.accountStatus === "inactive") return "inactive";
    return "active";
  };

  const computedStats = useMemo(() => {
    const total = allAuthors.length;
    const verified = allAuthors.filter((a) => a.isVerified).length;
    const unverified = total - verified;
    const active = allAuthors.filter((a) => getAccountStatus(a) === "active").length;
    const inactive = allAuthors.filter((a) => getAccountStatus(a) === "inactive").length;
    const suspended = allAuthors.filter((a) => getAccountStatus(a) === "suspended").length;
    return { totalAuthors: total, verifiedAuthors: verified, unverifiedAuthors: unverified, activeAuthors: active, inactiveAuthors: inactive, suspendedAuthors: suspended };
  }, [allAuthors]);

  const platformStats = computedStats;

  const stickyRef = useRef<HTMLDivElement>(null);
  const tableScroll = useRef<SyncedTableScrollHandle>(null);

  const addActivity = useCallback((action: ActivityEntry["action"], authorName: string, count?: number) => {
    const entry: ActivityEntry = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      action,
      authorName,
      count,
      timestamp: new Date().toISOString(),
    };
    setActivityLog((prev) => [entry, ...prev].slice(0, 20));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchAuthors = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=1&pageSize=all&filter=all`);
      const data = await res.json();
      if (data.success) {
        setAllAuthors(data.data.items);
        setAllTotal(data.data.total);
        setAuthors(data.data.items);
        setTotal(data.data.total);
      }
    } catch {
      console.error("Failed to fetch authors");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAuthors(); }, [fetchAuthors]);
  useEffect(() => { setPage(1); setSelectedIds(new Set()); }, [activeTab, debouncedSearch, pageSize, sortFilter]);

  const filteredAuthors = useMemo(() => {
    let result = [...allAuthors];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((a) =>
        (a.name || "").toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.country || "").toLowerCase().includes(q)
      );
    }

    if (sortFilter.country) {
      result = result.filter((a) => (a.country || "Nigeria") === sortFilter.country);
    }

    if (sortFilter.status) {
      switch (sortFilter.status) {
        case "verified": result = result.filter((a) => a.isVerified); break;
        case "unverified": result = result.filter((a) => !a.isVerified); break;
        case "active": result = result.filter((a) => getAccountStatus(a) === "active"); break;
        case "inactive": result = result.filter((a) => getAccountStatus(a) === "inactive"); break;
        case "suspended": result = result.filter((a) => getAccountStatus(a) === "suspended"); break;
      }
    }

    if (sortFilter.publishing) {
      switch (sortFilter.publishing) {
        case "most_published": result = result.filter((a) => (a.booksPublished || 0) > 0).sort((a, b) => (b.booksPublished || 0) - (a.booksPublished || 0)); break;
        case "least_published": result = result.filter((a) => (a.booksPublished || 0) > 0).sort((a, b) => (a.booksPublished || 0) - (b.booksPublished || 0)); break;
        case "most_services": result = result.filter((a) => (a.serviceOrders || 0) > 0).sort((a, b) => (b.serviceOrders || 0) - (a.serviceOrders || 0)); break;
        case "least_services": result = result.filter((a) => (a.serviceOrders || 0) > 0).sort((a, b) => (a.serviceOrders || 0) - (b.serviceOrders || 0)); break;
        case "no_books": result = result.filter((a) => (a.booksPublished || 0) === 0); break;
        case "no_services": result = result.filter((a) => (a.serviceOrders || 0) === 0); break;
      }
    }

    if (sortFilter.lastLogin) {
      const now = new Date();
      switch (sortFilter.lastLogin) {
        case "recently_active": result = result.filter((a) => a.lastLogin && (now.getTime() - new Date(a.lastLogin).getTime()) < 7 * 24 * 60 * 60 * 1000); break;
        case "active_this_week": result = result.filter((a) => a.lastLogin && (now.getTime() - new Date(a.lastLogin).getTime()) < 7 * 24 * 60 * 60 * 1000); break;
        case "active_this_month": result = result.filter((a) => a.lastLogin && (now.getTime() - new Date(a.lastLogin).getTime()) < 30 * 24 * 60 * 60 * 1000); break;
        case "never_logged_in": result = result.filter((a) => !a.lastLogin); break;
      }
    }

    if (sortFilter.registration) {
      const now = new Date();
      switch (sortFilter.registration) {
        case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
        case "oldest": result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
        case "this_month": result = result.filter((a) => { const d = new Date(a.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }); break;
        case "this_year": result = result.filter((a) => new Date(a.createdAt).getFullYear() === now.getFullYear()); break;
      }
    }

    if (sortFilter.alphabetical) {
      switch (sortFilter.alphabetical) {
        case "az": result.sort((a, b) => (a.name || "").localeCompare(b.name || "")); break;
        case "za": result.sort((a, b) => (b.name || "").localeCompare(a.name || "")); break;
      }
    }

    if (!sortFilter.registration && !sortFilter.alphabetical && !sortFilter.publishing) {
      switch (activeTab) {
        case "most_published": result = result.filter((a) => (a.booksPublished || 0) > 30).sort((a, b) => (b.booksPublished || 0) - (a.booksPublished || 0)); break;
        case "new": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
        case "old": result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      }
    }

    return result;
  }, [allAuthors, debouncedSearch, sortFilter, activeTab]);

  const filteredTotalPages = Math.max(1, Math.ceil(filteredAuthors.length / pageSize));

  const displayedAuthors = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAuthors.slice(start, start + pageSize);
  }, [filteredAuthors, page, pageSize]);

  useEffect(() => {
    setTotal(filteredAuthors.length);
  }, [filteredAuthors]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="default" className="bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1"><CheckCircle2 className="h-3 w-3" />Active</Badge>;
      case "inactive": return <Badge variant="secondary" className="bg-gray-100 text-gray-600 border border-gray-200 gap-1"><Clock className="h-3 w-3" />Inactive</Badge>;
      case "suspended": return <Badge variant="destructive" className="gap-1"><Ban className="h-3 w-3" />Suspended</Badge>;
      case "unverified": return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200 gap-1"><MailX className="h-3 w-3" />Pending Verification</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const showVerification = activeTab !== "verified" && activeTab !== "unverified";
  const showStatus = activeTab !== "active" && activeTab !== "inactive" && activeTab !== "suspended";
  const showSuspension = activeTab === "suspended";
  const tableColSpan = 2 + 1 + (showVerification ? 1 : 0) + 2 + 1 + 1 + (showStatus ? 1 : 0) + (showSuspension ? 1 : 0) + 1;

  const allSelected = displayedAuthors.length > 0 && displayedAuthors.every((a) => selectedIds.has(a.id));
  const someSelected = displayedAuthors.some((a) => selectedIds.has(a.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(displayedAuthors.map((a) => a.id)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getAuthorName = (id: string): string => {
    const a = allAuthors.find((x) => x.id === id);
    return a?.name || a?.email || "Unknown";
  };

  const getAuthorNames = (ids: string[]): string => {
    if (ids.length === 1) return getAuthorName(ids[0]);
    return `${ids.length} authors`;
  };

  const updateAuthorLocal = (authorId: string, updates: Partial<AuthorRecord>) => {
    setAllAuthors((prev) => prev.map((a) => a.id === authorId ? { ...a, ...updates } : a));
    setAuthors((prev) => prev.map((a) => a.id === authorId ? { ...a, ...updates } : a));
    setPreviewAuthor((prev) => prev && prev.id === authorId ? { ...prev, ...updates } : prev);
  };

  const openDrawer = (author: AuthorRecord) => {
    setPreviewAuthor(author);
    setDrawerOpen(true);
  };

  const handleVerify = async (authorId: string) => {
    const name = getAuthorName(authorId);
    const now = new Date().toISOString();

    actionHistory.pushAction({
      action: "status_change",
      entity: "author",
      entityName: name,
      description: `Verified author "${name}"`,
      previousState: null,
      newState: null,
    });

    updateAuthorLocal(authorId, { isVerified: true, emailVerified: now, verificationDate: now, accountStatus: "active", isActive: true });
    addActivity("verified", name);
    setVerifyDialogOpen(false); setVerifyTarget(null); setVerifyTargetName("");
    try { await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: authorId, action: "verify" }) }); } catch { console.error("Verify failed"); }
  };

  const handleSuspend = async (authorId: string) => {
    const name = getAuthorName(authorId);
    const author = allAuthors.find((a) => a.id === authorId);
    const wasActive = author && getAccountStatus(author) === "active";

    actionHistory.pushAction({
      action: "status_change",
      entity: "author",
      entityName: name,
      description: `Suspended author "${name}"`,
      previousState: null,
      newState: null,
    });

    updateAuthorLocal(authorId, { accountStatus: "suspended", isActive: false, suspensionReason: "Admin action", suspensionDate: new Date().toISOString() });
    addActivity("suspended", name);
    setSuspendDialogOpen(false); setSuspendTarget(null); setSuspendTargetName("");
    try { await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "bulkSuspend", userIds: [authorId] }) }); } catch { console.error("Suspend failed"); }
  };

  const handleReinstate = async (authorId: string) => {
    const name = getAuthorName(authorId);

    actionHistory.pushAction({
      action: "status_change",
      entity: "author",
      entityName: name,
      description: `Reinstated author "${name}"`,
      previousState: null,
      newState: null,
    });

    updateAuthorLocal(authorId, { accountStatus: "active", isActive: true, suspensionReason: null, suspensionDate: null });
    addActivity("reinstated", name);
    setReinstateDialogOpen(false); setReinstateTarget(null); setReinstateTargetName("");
    try { await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "bulkReactivate", userIds: [authorId] }) }); } catch { console.error("Reinstate failed"); }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const names = getAuthorNames(ids);

    actionHistory.pushAction({
      action: "status_change",
      entity: "author",
      entityName: `${ids.length} authors`,
      description: `Bulk ${action === "bulkVerify" ? "verified" : action === "bulkSuspend" ? "suspended" : "reinstated"} ${ids.length} author${ids.length === 1 ? "" : "s"}`,
      previousState: null,
      newState: null,
    });

    if (action === "bulkVerify") {
      ids.forEach((id) => { const a = allAuthors.find((x) => x.id === id); if (a && !a.isVerified) updateAuthorLocal(id, { isVerified: true, emailVerified: new Date().toISOString(), verificationDate: new Date().toISOString(), accountStatus: "active", isActive: true }); });
      addActivity("bulk_verified", names, ids.length);
    } else if (action === "bulkSuspend") {
      ids.forEach((id) => { const a = allAuthors.find((x) => x.id === id); if (a && getAccountStatus(a) !== "suspended") updateAuthorLocal(id, { accountStatus: "suspended", isActive: false, suspensionReason: "Admin action", suspensionDate: new Date().toISOString() }); });
      addActivity("bulk_suspended", names, ids.length);
    } else if (action === "bulkReactivate") {
      ids.forEach((id) => { const a = allAuthors.find((x) => x.id === id); if (a && getAccountStatus(a) === "suspended") updateAuthorLocal(id, { accountStatus: "active", isActive: true, suspensionReason: null, suspensionDate: null }); });
      addActivity("bulk_reinstated", names, ids.length);
    }
    setSelectedIds(new Set());
    try { await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, userIds: ids }) }); } catch { console.error("Bulk action failed"); }
  };

  const exportCSV = (data: AuthorRecord[], filename: string) => {
    const headers = ["Name", "Email", "Country", "Status", "Books", "Services", "Joined"];
    const rows = data.map((a) => [a.name || "", a.email, a.country || "Nigeria", getAccountStatus(a), String(a.booksPublished || 0), String(a.serviceOrders || 0), a.createdAt.split("T")[0]]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; link.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = (data: AuthorRecord[], filename: string) => {
    const headers = ["Name", "Email", "Country", "Status", "Books", "Services", "Joined"];
    const rows = data.map((a) => [a.name || "", a.email, a.country || "Nigeria", getAccountStatus(a), String(a.booksPublished || 0), String(a.serviceOrders || 0), a.createdAt.split("T")[0]]);
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1">${headers.map((h) => `<th>${h}</th>`).join("")}${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></body></html>`;
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; link.click();
    URL.revokeObjectURL(url);
  };

  const activityLabel = (a: ActivityEntry) => {
    switch (a.action) {
      case "verified": return `Verified ${a.authorName}`;
      case "suspended": return `Suspended ${a.authorName}`;
      case "reinstated": return `Reinstated ${a.authorName}`;
      case "bulk_verified": return `Verified ${a.count} authors`;
      case "bulk_suspended": return `Suspended ${a.count} authors`;
      case "bulk_reinstated": return `Reinstated ${a.count} authors`;
    }
  };

  const activityIcon = (action: ActivityEntry["action"]) => {
    if (action === "verified" || action === "bulk_verified") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />;
    if (action === "suspended" || action === "bulk_suspended") return <Ban className="h-3.5 w-3.5 text-rose-600" />;
    return <RefreshCw className="h-3.5 w-3.5 text-blue-600" />;
  };

  const emptyMsg = EMPTY_STATE_MESSAGES[activeTab] || EMPTY_STATE_MESSAGES.all;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Author Management</h1>
          <p className="text-sm text-muted-foreground">Manage authors, verification, and publishing activity across the platform.</p>
        </div>
        <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
          <Button variant="outline" size="sm" onClick={() => fetchAuthors()} disabled={loading} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
          </Button>
        </div>
      </motion.div>

      {/* Clickable Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Total Authors", value: platformStats.totalAuthors, icon: Users, color: "text-[#8A6A4A]", bg: "bg-[#8A6A4A]/10" },
          { label: "Verified", value: platformStats.verifiedAuthors, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Unverified", value: platformStats.unverifiedAuthors, icon: MailX, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Active", value: platformStats.activeAuthors, icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Inactive", value: platformStats.inactiveAuthors, icon: Clock, color: "text-gray-500", bg: "bg-gray-50" },
          { label: "Suspended", value: platformStats.suspendedAuthors, icon: Ban, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat) => {
          const tabTarget = STAT_CARD_MAP[stat.label];
          const isActiveCard = activeTab === tabTarget;
          return (
            <Card
              key={stat.label}
              onClick={() => tabTarget && setActiveTab(tabTarget)}
              className={`shadow-sm transition-all duration-200 border-[#D8B27A]/20 cursor-pointer hover:shadow-md hover:scale-[1.02] ${isActiveCard ? "ring-2 ring-[#D8B27A] shadow-md" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg ${stat.bg} p-2 ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
                  <div>
                    <motion.p
                      key={stat.value}
                      initial={{ scale: 1.15, color: "#D8B27A" }}
                      animate={{ scale: 1, color: "#1D1D1D" }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Sticky Search & Filter Bar */}
      <motion.div variants={item} ref={stickyRef} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-md search-bar-border">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input placeholder="Search by name, email, or country..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9" />
          </div>
          <div className="flex items-center gap-2" ref={dropdownRef}>
            <div className="relative">
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortFilterOpen(!sortFilterOpen)}
                  className={`h-9 px-3 border-0 bg-white text-sm font-medium gap-2 ${hasActiveFilter ? "text-[#D8B27A]" : "text-[#8A6A4A] hover:bg-[#F2D8BE]"}`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[120px] truncate">{activeFilterLabel}</span>
                  <span className="sm:hidden">Filter</span>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${sortFilterOpen ? "rotate-90" : ""}`} />
                </Button>
              </div>

              <AnimatePresence>
                {sortFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-[320px] bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-[#E8DDD0] bg-[#F2D8BE]/10">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2">
                          <SlidersHorizontal className="h-4 w-4 text-[#8A6A4A]" />Sort & Filter
                        </h4>
                        {hasActiveFilter && (
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={clearSortFilter}>
                            <X className="h-3 w-3 mr-1" />Clear All
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                      {/* Country */}
                      <div className="p-3 border-b border-[#E8DDD0]/50">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><Globe className="h-3 w-3" />Country</p>
                        <div className="space-y-0.5">
                          {["", "Nigeria", "Ghana", "Kenya", "South Africa", "United Kingdom", "United States", "Canada", "India"].map((c) => (
                            <button key={c} onClick={() => setSortFilter((p) => ({ ...p, country: c }))} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortFilter.country === c ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#6A4E37] hover:bg-[#F2D8BE]/40"}`}>
                              {c || "All Countries"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="p-3 border-b border-[#E8DDD0]/50">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><Shield className="h-3 w-3" />Author Status</p>
                        <div className="space-y-0.5">
                          {[
                            { value: "", label: "All Authors" },
                            { value: "verified", label: "Verified Authors" },
                            { value: "unverified", label: "Unverified Authors" },
                            { value: "active", label: "Active Authors" },
                            { value: "inactive", label: "Inactive Authors" },
                            { value: "suspended", label: "Suspended Authors" },
                          ].map((s) => (
                            <button key={s.value} onClick={() => setSortFilter((p) => ({ ...p, status: s.value }))} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortFilter.status === s.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#6A4E37] hover:bg-[#F2D8BE]/40"}`}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Publishing Activity */}
                      <div className="p-3 border-b border-[#E8DDD0]/50">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><BookOpen className="h-3 w-3" />Publishing Activity</p>
                        <div className="space-y-0.5">
                          {[
                            { value: "", label: "All Authors" },
                            { value: "most_published", label: "Most Published" },
                            { value: "least_published", label: "Least Published" },
                            { value: "most_services", label: "Most Service Orders" },
                            { value: "least_services", label: "Least Service Orders" },
                            { value: "no_books", label: "No Books Published" },
                            { value: "no_services", label: "No Service Orders" },
                          ].map((p) => (
                            <button key={p.value} onClick={() => setSortFilter((prev) => ({ ...prev, publishing: p.value }))} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortFilter.publishing === p.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#6A4E37] hover:bg-[#F2D8BE]/40"}`}>
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Last Login */}
                      <div className="p-3 border-b border-[#E8DDD0]/50">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><Clock className="h-3 w-3" />Last Login Activity</p>
                        <div className="space-y-0.5">
                          {[
                            { value: "", label: "Any Time" },
                            { value: "recently_active", label: "Recently Active" },
                            { value: "active_this_week", label: "Active This Week" },
                            { value: "active_this_month", label: "Active This Month" },
                            { value: "never_logged_in", label: "Never Logged In" },
                          ].map((l) => (
                            <button key={l.value} onClick={() => setSortFilter((p) => ({ ...p, lastLogin: l.value }))} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortFilter.lastLogin === l.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#6A4E37] hover:bg-[#F2D8BE]/40"}`}>
                              {l.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Registration Date */}
                      <div className="p-3 border-b border-[#E8DDD0]/50">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><Calendar className="h-3 w-3" />Date Joined</p>
                        <div className="space-y-0.5">
                          {[
                            { value: "", label: "Any Date" },
                            { value: "newest", label: "Newest First" },
                            { value: "oldest", label: "Oldest First" },
                            { value: "this_month", label: "Joined This Month" },
                            { value: "this_year", label: "Joined This Year" },
                          ].map((r) => (
                            <button key={r.value} onClick={() => setSortFilter((p) => ({ ...p, registration: r.value }))} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortFilter.registration === r.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#6A4E37] hover:bg-[#F2D8BE]/40"}`}>
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Alphabetical */}
                      <div className="p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><ArrowDownUp className="h-3 w-3" />Alphabetical</p>
                        <div className="space-y-0.5">
                          {[
                            { value: "", label: "Default Order" },
                            { value: "az", label: "Name A-Z" },
                            { value: "za", label: "Name Z-A" },
                          ].map((a) => (
                            <button key={a.value} onClick={() => setSortFilter((p) => ({ ...p, alphabetical: a.value }))} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortFilter.alphabetical === a.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#6A4E37] hover:bg-[#F2D8BE]/40"}`}>
                              {a.label}
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
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList className="bg-[#F2D8BE]/40 h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#8A6A4A] data-[state=active]:text-white text-xs sm:text-sm">All Authors<Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px] bg-[#D8B27A]/30">{platformStats.totalAuthors}</Badge></TabsTrigger>
            <TabsTrigger value="verified" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs sm:text-sm"><CheckCircle2 className="mr-1 h-3 w-3" />Verified</TabsTrigger>
            <TabsTrigger value="unverified" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-xs sm:text-sm"><MailX className="mr-1 h-3 w-3" />Unverified</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm"><UserCheck className="mr-1 h-3 w-3" />Active</TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white text-xs sm:text-sm"><Clock className="mr-1 h-3 w-3" />Inactive</TabsTrigger>
            <TabsTrigger value="suspended" className="data-[state=active]:bg-rose-700 data-[state=active]:text-white text-xs sm:text-sm"><Ban className="mr-1 h-3 w-3" />Suspended</TabsTrigger>
            <TabsTrigger value="most_published" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-xs sm:text-sm"><TrendingUp className="mr-1 h-3 w-3" />Most Published</TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs sm:text-sm"><Calendar className="mr-1 h-3 w-3" />New</TabsTrigger>
            <TabsTrigger value="old" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-xs sm:text-sm"><Clock className="mr-1 h-3 w-3" />Old Authors</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Summary Strip */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground bg-[#F2D8BE]/15 rounded-lg px-4 py-2 border border-[#D8B27A]/10">
        <span>Showing <span className="font-semibold text-[#1D1D1D]">{displayedAuthors.length}</span> of <span className="font-semibold text-[#1D1D1D]">{filteredAuthors.length}</span> authors{hasActiveFilter ? " (filtered)" : ""}</span>
        <span className="hidden sm:inline text-[#E8DDD0]">|</span>
        <span><span className="text-emerald-600 font-medium">{platformStats.verifiedAuthors}</span> Verified</span>
        <span><span className="text-amber-600 font-medium">{platformStats.unverifiedAuthors}</span> Awaiting Verification</span>
        <span><span className="text-blue-600 font-medium">{platformStats.activeAuthors}</span> Active</span>
        <span><span className="text-gray-500 font-medium">{platformStats.inactiveAuthors}</span> Inactive</span>
        <span><span className="text-rose-600 font-medium">{platformStats.suspendedAuthors}</span> Suspended</span>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center gap-3 p-3 bg-[#F2D8BE]/20 rounded-lg border border-[#D8B27A]/30"
          >
            <span className="text-sm font-semibold text-[#1D1D1D]">{selectedIds.size} Author{selectedIds.size > 1 ? "s" : ""} Selected</span>
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => handleBulkAction("bulkVerify")} disabled={actionLoading}>
                <CheckCircle2 className="h-3 w-3 mr-1" />Verify Selected
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => handleBulkAction("bulkSuspend")} disabled={actionLoading}>
                <Ban className="h-3 w-3 mr-1" />Suspend Selected
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => handleBulkAction("bulkReactivate")} disabled={actionLoading}>
                <RefreshCw className="h-3 w-3 mr-1" />Reinstate Selected
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-[#8A6A4A]/30 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => {
                const selected = displayedAuthors.filter((a) => selectedIds.has(a.id));
                exportCSV(selected, `selected-authors-${Date.now()}.csv`);
              }}>
                <Download className="h-3 w-3 mr-1" />Export
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-violet-200 text-violet-700 hover:bg-violet-50" disabled>
                <Send className="h-3 w-3 mr-1" />Send Email
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground" onClick={() => setSelectedIds(new Set())}>Clear</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authors Table */}
      <SyncedTableScroll ref={tableScroll} loading={loading}>
        <Table>
              <TableHeader>
                <TableRow className="bg-[#F2D8BE]/20 hover:bg-[#F2D8BE]/30">
                  <TableHead className="w-10">
                    <button onClick={toggleSelectAll} className="flex items-center justify-center">
                      {allSelected ? <CheckSquare className="h-4 w-4 text-[#8A6A4A]" /> : someSelected ? <div className="h-4 w-4 border-2 border-[#8A6A4A] rounded flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#8A6A4A] rounded-sm" /></div> : <Square className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold">Author</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden md:table-cell">Country</TableHead>
                  {showVerification && <TableHead className="text-[#1D1D1D] font-semibold hidden sm:table-cell">Verification</TableHead>}
                  <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell">Books</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell">Services</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden md:table-cell">Joined</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden xl:table-cell">Last Login</TableHead>
                  {showStatus && <TableHead className="text-[#1D1D1D] font-semibold hidden sm:table-cell">Status</TableHead>}
                  {showSuspension && <TableHead className="text-[#1D1D1D] font-semibold hidden md:table-cell">Suspension</TableHead>}
                  <TableHead className="text-[#1D1D1D] font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={tableColSpan} className="text-center py-16"><RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#8A6A4A]" /><p className="mt-3 text-sm text-muted-foreground">Loading authors...</p></TableCell></TableRow>
                ) : displayedAuthors.length === 0 ? (
                  <TableRow><TableCell colSpan={tableColSpan} className="text-center py-16">
                    <emptyMsg.icon className="mx-auto h-10 w-10 text-[#D8B27A]/50 mb-3" />
                    <p className="text-sm font-medium text-[#1D1D1D]">{emptyMsg.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{emptyMsg.description}</p>
                  </TableCell></TableRow>
                ) : (
                  displayedAuthors.map((author, idx) => {
                    const status = getAccountStatus(author);
                    const isUnverified = status === "unverified";
                    const isSuspended = status === "suspended";
                    const isActive = status === "active";
                    return (
                      <TableRow key={author.id} className={`hover:bg-[#8A6A4A]/[0.04] transition-colors duration-150 cursor-default ${selectedIds.has(author.id) ? "bg-[#F2D8BE]/15" : ""}`}>
                        <TableCell onClick={(e) => e.stopPropagation()} className="py-2">
                          <button onClick={() => toggleSelect(author.id)} className="flex items-center justify-center">
                            {selectedIds.has(author.id) ? <CheckSquare className="h-4 w-4 text-[#8A6A4A]" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                          </button>
                        </TableCell>
                        <TableCell className="cursor-pointer py-2" onClick={() => openDrawer(author)}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 ring-2 ring-[#D8B27A]/20">
                              {author.image ? <img src={author.image} alt={author.name || ""} className="h-full w-full rounded-full object-cover" /> : null}
                              <AvatarFallback className={`${AVATAR_COLORS[idx % AVATAR_COLORS.length]} text-white text-[10px] font-semibold`}>{getInitials(author.name || author.email)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium text-[#1D1D1D] text-sm truncate">{author.name || "No name"}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{author.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell cursor-pointer py-2" onClick={() => openDrawer(author)}>
                          <div className="flex items-center gap-1.5 text-sm text-[#6A4E37]"><Globe className="h-3.5 w-3.5" />{author.country || "Nigeria"}</div>
                        </TableCell>
                        {showVerification && (
                          <TableCell className="hidden sm:table-cell cursor-pointer py-2" onClick={() => openDrawer(author)}>
                            {author.emailVerified || author.isVerified ? (
                              <Badge variant="default" className="bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1 text-[11px]"><MailCheck className="h-3 w-3" />Verified</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200 gap-1 text-[11px]"><MailX className="h-3 w-3" />Pending</Badge>
                            )}
                          </TableCell>
                        )}
                        <TableCell className="hidden lg:table-cell cursor-pointer py-2" onClick={() => openDrawer(author)}>
                          <div className="flex items-center gap-1.5 text-sm text-[#1D1D1D]"><BookOpen className="h-3.5 w-3.5 text-[#8A6A4A]" /><span className="font-medium">{author.booksPublished ?? 0}</span></div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell cursor-pointer py-2" onClick={() => openDrawer(author)}>
                          <div className="flex items-center gap-1.5 text-sm text-[#1D1D1D]"><ShoppingCart className="h-3.5 w-3.5 text-[#D8B27A]" /><span className="font-medium">{author.serviceOrders ?? 0}</span></div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell cursor-pointer py-2" onClick={() => openDrawer(author)}>
                          <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3" />{formatDate(author.createdAt)}</span>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell cursor-pointer py-2" onClick={() => openDrawer(author)}>
                          <span className="text-sm text-muted-foreground">{author.lastLogin ? formatDate(author.lastLogin) : "—"}</span>
                        </TableCell>
                        {showStatus && (
                          <TableCell className="hidden sm:table-cell cursor-pointer py-2" onClick={() => openDrawer(author)}>
                            {getStatusBadge(status)}
                          </TableCell>
                        )}
                        {showSuspension && (
                          <TableCell className="hidden md:table-cell cursor-pointer py-2" onClick={() => openDrawer(author)}>
                            <div className="space-y-0.5">
                              {author.suspensionReason && <p className="text-xs font-medium text-rose-700">{author.suspensionReason}</p>}
                              {author.suspensionDate && <p className="text-[11px] text-muted-foreground">{formatDate(author.suspensionDate)}</p>}
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="text-right py-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-0.5">
                            {isUnverified && (
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-emerald-600 hover:bg-emerald-50" onClick={() => { setVerifyTarget(author.id); setVerifyTargetName(author.name || author.email); setVerifyDialogOpen(true); }} title="Verify author">
                                <Shield className="h-3.5 w-3.5 mr-1" />Verify
                              </Button>
                            )}
                            {!isUnverified && isActive && (
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={() => { setSuspendTarget(author.id); setSuspendTargetName(author.name || author.email); setSuspendDialogOpen(true); }} title="Suspend author">
                                <Ban className="h-3.5 w-3.5 mr-1" />Suspend
                              </Button>
                            )}
                            {isSuspended && (
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50" onClick={() => { setReinstateTarget(author.id); setReinstateTargetName(author.name || author.email); setReinstateDialogOpen(true); }} title="Reinstate author">
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />Reinstate
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => openDrawer(author)} title="Quick preview">
                              <Eye className="h-4 w-4" />
                            </Button>
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
          Showing <span className="font-medium text-[#1D1D1D]">{filteredAuthors.length === 0 ? 0 : (page - 1) * pageSize + 1}</span>
          {" "}&ndash;{" "}
          <span className="font-medium text-[#1D1D1D]">{Math.min(page * pageSize, filteredAuthors.length)}</span>
          {" "}of <span className="font-medium text-[#1D1D1D]">{filteredAuthors.length}</span>
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-[#8A6A4A]/20 text-[#8A6A4A] hover:bg-[#F2D8BE]/50"><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
          <span className="text-sm font-medium text-[#1D1D1D] px-2">{page} / {filteredTotalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= filteredTotalPages} onClick={() => setPage((p) => p + 1)} className="border-[#8A6A4A]/20 text-[#8A6A4A] hover:bg-[#F2D8BE]/50">Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
      </motion.div>

      {/* Activity Log */}
      {activityLog.length > 0 && (
        <motion.div variants={item}>
          <Card className="shadow-sm border-[#D8B27A]/15">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2 mb-3">
                <History className="h-4 w-4 text-[#8A6A4A]" />Recent Activity
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <AnimatePresence initial={false}>
                  {activityLog.map((entry) => (
                    <motion.div key={entry.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-3 text-sm py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                      {activityIcon(entry.action)}
                      <span className="text-[#1D1D1D] font-medium">{activityLabel(entry)}</span>
                      <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Verify Confirmation Dialog */}
      {verifyDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setVerifyDialogOpen(false); setVerifyTarget(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><Shield className="h-5 w-5 text-emerald-600" /><h3 className="text-lg font-semibold text-[#1D1D1D]">Verify Author?</h3></div>
            <p className="text-sm text-muted-foreground mb-1">This author will gain access to publishing services and platform features.</p>
            <p className="text-sm font-medium text-[#1D1D1D] mb-4">{verifyTargetName}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setVerifyDialogOpen(false); setVerifyTarget(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" onClick={() => verifyTarget && handleVerify(verifyTarget)} className="bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Verify Author</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Suspend Confirmation Dialog */}
      {suspendDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setSuspendDialogOpen(false); setSuspendTarget(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><Ban className="h-5 w-5 text-rose-600" /><h3 className="text-lg font-semibold text-[#1D1D1D]">Suspend Author?</h3></div>
            <p className="text-sm text-muted-foreground mb-1">This author will lose access to the platform until reinstated.</p>
            <p className="text-sm font-medium text-[#1D1D1D] mb-4">{suspendTargetName}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setSuspendDialogOpen(false); setSuspendTarget(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" onClick={() => suspendTarget && handleSuspend(suspendTarget)} className="bg-rose-600 hover:bg-rose-700 text-white"><Ban className="h-3.5 w-3.5 mr-1" />Suspend Author</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reinstate Confirmation Dialog */}
      {reinstateDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setReinstateDialogOpen(false); setReinstateTarget(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><RefreshCw className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-semibold text-[#1D1D1D]">Reinstate Author?</h3></div>
            <p className="text-sm text-muted-foreground mb-1">This author will regain access to platform services.</p>
            <p className="text-sm font-medium text-[#1D1D1D] mb-4">{reinstateTargetName}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setReinstateDialogOpen(false); setReinstateTarget(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" onClick={() => reinstateTarget && handleReinstate(reinstateTarget)} className="bg-blue-600 hover:bg-blue-700 text-white"><RefreshCw className="h-3.5 w-3.5 mr-1" />Reinstate Author</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Author Quick Preview Drawer */}
      <AnimatePresence>
        {drawerOpen && previewAuthor && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawerOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-[#E8DDD0]"
            >
              {(() => {
                const status = getAccountStatus(previewAuthor);
                const isUnverified = status === "unverified";
                const isActive = status === "active";
                const isSuspended = status === "suspended";
                return (
                  <div className="p-6 space-y-5">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-[#1D1D1D]">Author Profile</h2>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
                    </div>

                    {/* Profile Header */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 ring-3 ring-[#D8B27A]/30">
                        {previewAuthor.image ? <img src={previewAuthor.image} alt={previewAuthor.name || ""} className="h-full w-full rounded-full object-cover" /> : null}
                        <AvatarFallback className="bg-[#8A6A4A] text-white text-xl font-bold">{getInitials(previewAuthor.name || previewAuthor.email)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold text-[#1D1D1D]">{previewAuthor.name || "No name"}</h3>
                        <p className="text-sm text-muted-foreground">{previewAuthor.email}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <Badge variant="secondary" className="bg-[#F2D8BE] text-[#8A6A4A] border border-[#D8B27A]/40 text-[11px]">Author</Badge>
                          {getStatusBadge(status)}
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Personal Information</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Country", value: previewAuthor.country || "Nigeria", icon: Globe },
                          { label: "Registration", value: formatDate(previewAuthor.createdAt, "long"), icon: Calendar },
                          { label: "Last Login", value: previewAuthor.lastLogin ? formatDate(previewAuthor.lastLogin, "long") : "Never", icon: Clock },
                          { label: "Email Verified", value: previewAuthor.emailVerified ? "Yes" : "No", icon: MailCheck },
                        ].map((f) => (
                          <div key={f.label} className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5">
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-0.5"><f.icon className="h-3 w-3" />{f.label}</div>
                            <p className="text-xs font-medium text-[#1D1D1D]">{f.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Publishing Stats */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Publishing Activity</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "Books", value: previewAuthor.booksPublished ?? 0, icon: BookOpen, color: "text-[#8A6A4A]" },
                          { label: "Services", value: previewAuthor.serviceOrders ?? 0, icon: ShoppingCart, color: "text-[#D8B27A]" },
                          { label: "Reviews", value: previewAuthor._count.reviews, icon: Star, color: "text-amber-500" },
                          { label: "Followers", value: previewAuthor._count.followers, icon: Users, color: "text-blue-500" },
                          { label: "Revenue", value: formatCurrency((previewAuthor.booksPublished ?? 0) * 8500 + (previewAuthor.serviceOrders ?? 0) * 15000), icon: DollarSign, color: "text-emerald-600" },
                          { label: "Royalties", value: formatCurrency((previewAuthor.booksPublished ?? 0) * 3200), icon: TrendingUp, color: "text-violet-600" },
                        ].map((f) => (
                          <div key={f.label} className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5 text-center">
                            <f.icon className={`h-3.5 w-3.5 mx-auto mb-0.5 ${f.color}`} />
                            <p className="text-sm font-bold text-[#1D1D1D]">{f.value}</p>
                            <p className="text-[10px] text-muted-foreground">{f.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suspension Details */}
                    {status === "suspended" && previewAuthor.suspensionReason && (
                      <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 space-y-1">
                        <p className="text-xs font-semibold text-rose-700">Suspended — {previewAuthor.suspensionReason}</p>
                        {previewAuthor.suspensionDate && <p className="text-[11px] text-rose-600">Since: {formatDate(previewAuthor.suspensionDate, "long")}</p>}
                      </div>
                    )}

                    {/* Verification Required */}
                    {status === "unverified" && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs font-semibold text-amber-700 mb-1">Restricted Access</p>
                        <p className="text-[11px] text-amber-600">Cannot publish books, submit for review, or purchase services.</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-[#D8B27A]/15">
                      {isUnverified && <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setDrawerOpen(false); setVerifyTarget(previewAuthor.id); setVerifyTargetName(previewAuthor.name || previewAuthor.email); setVerifyDialogOpen(true); }}><Shield className="h-3.5 w-3.5 mr-1" />Verify</Button>}
                      {isActive && <Button size="sm" variant="outline" className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => { setDrawerOpen(false); setSuspendTarget(previewAuthor.id); setSuspendTargetName(previewAuthor.name || previewAuthor.email); setSuspendDialogOpen(true); }}><Ban className="h-3.5 w-3.5 mr-1" />Suspend</Button>}
                      {isSuspended && <Button size="sm" variant="outline" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => { setDrawerOpen(false); setReinstateTarget(previewAuthor.id); setReinstateTargetName(previewAuthor.name || previewAuthor.email); setReinstateDialogOpen(true); }}><RefreshCw className="h-3.5 w-3.5 mr-1" />Reinstate</Button>}
                      <Button size="sm" variant="outline" className="flex-1 border-[#8A6A4A]/20 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => setDrawerOpen(false)}>Close</Button>
                    </div>

                    {/* Activity Timeline */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Activity Timeline</h4>
                      <div className="space-y-2.5 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-[#E8DDD0]">
                        {[
                          { date: previewAuthor.createdAt, event: "Account registered", icon: Users, color: "bg-blue-100 text-blue-600" },
                          ...(previewAuthor.verificationDate ? [{ date: previewAuthor.verificationDate, event: "Email verified", icon: MailCheck, color: "bg-emerald-100 text-emerald-600" }] : []),
                          ...(previewAuthor.lastLogin ? [{ date: previewAuthor.lastLogin, event: "Last platform login", icon: Globe, color: "bg-gray-100 text-gray-600" }] : []),
                          ...(previewAuthor.suspensionDate ? [{ date: previewAuthor.suspensionDate, event: `Suspended — ${previewAuthor.suspensionReason}`, icon: Ban, color: "bg-rose-100 text-rose-600" }] : []),
                        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((ev, i) => (
                          <div key={i} className="flex items-start gap-3 relative">
                            <div className={`absolute -left-4 top-0.5 rounded-full p-0.5 ${ev.color}`}><ev.icon className="h-2.5 w-2.5" /></div>
                            <div className="ml-1">
                              <p className="text-xs font-medium text-[#1D1D1D]">{ev.event}</p>
                              <p className="text-[10px] text-muted-foreground">{formatDate(ev.date, "long")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
