"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SyncedTableScroll, type SyncedTableScrollHandle } from "@/components/ui/synced-table-scroll";
import {
  Search, BookOpen, Check, X, Eye, CheckCircle2, Clock, XCircle, FileText,
  RefreshCw, ChevronLeft, ChevronRight, TrendingUp,
  DollarSign, ArrowUpDown, Globe, Book, Download,
  CheckSquare, Square, History, Send, Archive, RotateCcw,
  ChevronDown, ChevronUp, BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getInitials, formatCurrency, cn } from "@/lib/utils";
import { actionHistory } from "@/lib/action-history";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

type BookStatusFilter = "all" | "PUBLISHED" | "SUBMITTED" | "DRAFT" | "REJECTED" | "ARCHIVED" | "most_popular" | "top_revenue" | "recently_published" | "oldest_books";

interface ApiBook {
  id: string;
  title: string;
  isbn: string | null;
  status: string;
  price: number;
  format: string;
  createdAt: string;
  coverImage: string | null;
  description: string | null;
  sales: number;
  rating: number | null;
  pages: number | null;
  language: string | null;
  subcategory: string | null;
  publicationDate: string | null;
  views?: number;
  downloads?: number;
  revenue?: number;
  isPublic?: boolean;
  rejectionReason?: string | null;
  category: string | { id: string; name: string } | null;
  author: {
    user: { id: string; name: string | null; email: string; image: string | null };
  } | null;
}

interface BookStats {
  totalBooks: number;
  publishedBooks: number;
  pendingReview: number;
  draftBooks: number;
  rejectedBooks: number;
  archivedBooks: number;
  topCategory: string;
  topAuthor: string;
  totalSales: number;
  totalViews: number;
  totalDownloads: number;
  categoryBreakdown: Record<string, number>;
  formatBreakdown: Record<string, number>;
}

interface ActivityEntry {
  id: string;
  action: "approve" | "reject" | "publish" | "archive" | "restore" | "export" | "bulk_action" | "category_change";
  bookTitle: string;
  count?: number;
  timestamp: string;
  detail?: string;
}

const CATEGORY_COVERS: Record<string, string> = {
  "Business & Entrepreneurship": "bg-[#2D5F8A]",
  "Personal Finance": "bg-[#2A7B4F]",
  "Leadership": "bg-[#8B4513]",
  "Self Development": "bg-[#6B3A8A]",
  "Productivity": "bg-[#3D7A5A]",
  "Technology": "bg-[#1A5276]",
  "Marketing": "bg-[#C0392B]",
  "Health & Wellness": "bg-[#27AE60]",
  "Religion & Inspiration": "bg-[#8E6B3D]",
  "Biography": "bg-[#5D4E37]",
  "Memoir": "bg-[#7B4B6A]",
  "Romance": "bg-[#C0506E]",
  "Mystery": "bg-[#2C3E50]",
  "Thriller": "bg-[#1A1A2E]",
  "Science Fiction": "bg-[#0D47A1]",
  "Fantasy": "bg-[#4A148C]",
  "Children's Books": "bg-[#FF6F00]",
  "Young Adult": "bg-[#AD1457]",
  "Education": "bg-[#00695C]",
  "Academic": "bg-[#37474F]",
  "Poetry": "bg-[#6A1B9A]",
  "Cookbooks": "bg-[#D84315]",
  "Travel": "bg-[#0277BD]",
  "History": "bg-[#5D4037]",
};

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  PUBLISHED: { label: "Published", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  SUBMITTED: { label: "Pending Review", icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-200" },
  DRAFT: { label: "Draft", icon: FileText, color: "bg-slate-100 text-slate-600 border-slate-200" },
  REJECTED: { label: "Rejected", icon: XCircle, color: "bg-red-50 text-red-700 border-red-200" },
  ARCHIVED: { label: "Archived", icon: Archive, color: "bg-gray-800 text-gray-200 border-gray-700" },
};

const formatConfig: Record<string, { label: string; color: string }> = {
  EBOOK: { label: "eBook", color: "bg-blue-100 text-blue-700" },
  PAPERBACK: { label: "Paperback", color: "bg-emerald-100 text-emerald-700" },
  HARDCOVER: { label: "Hardcover", color: "bg-violet-100 text-violet-700" },
  AUDIOBOOK: { label: "Audiobook", color: "bg-orange-100 text-orange-700" },
};

const CATEGORIES = [
  "Business & Entrepreneurship", "Personal Finance", "Leadership",
  "Self Development", "Productivity", "Technology", "Marketing",
  "Health & Wellness", "Religion & Inspiration", "Biography",
  "Memoir", "Romance", "Mystery", "Thriller", "Science Fiction",
  "Fantasy", "Children's Books", "Young Adult", "Education",
  "Academic", "Poetry", "Cookbooks", "Travel", "History",
];

const BULK_CATEGORIES = ["Memoir", "Leadership", "Business", "Biography", "Fiction", "Self-Help"];

const SORT_OPTIONS = [
  { value: "best_sellers", label: "Best Sellers" },
  { value: "most_viewed", label: "Most Viewed" },
  { value: "new_releases", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title_az", label: "Title A-Z" },
  { value: "title_za", label: "Title Z-A" },
  { value: "top_revenue", label: "Top Revenue" },
];

const STAT_CARD_MAP: Record<string, BookStatusFilter> = {
  "Total Books": "all",
  "Published": "PUBLISHED",
  "Pending Review": "SUBMITTED",
  "Rejected": "REJECTED",
};

const EMPTY_STATE_MESSAGES: Record<string, { icon: React.ComponentType<{ className?: string }>; title: string; description: string }> = {
  all: { icon: BookOpen, title: "No books found", description: "Try adjusting your search or filters." },
  PUBLISHED: { icon: CheckCircle2, title: "No published books", description: "No books are currently published." },
  SUBMITTED: { icon: Clock, title: "No pending reviews", description: "All submissions have been reviewed." },
  DRAFT: { icon: FileText, title: "No draft books", description: "No books are currently in draft." },
  REJECTED: { icon: XCircle, title: "No rejected books", description: "No books have been rejected." },
  ARCHIVED: { icon: Archive, title: "No archived books", description: "No books have been archived." },
  most_popular: { icon: TrendingUp, title: "No best sellers found", description: "No books meet the popularity threshold." },
  top_revenue: { icon: DollarSign, title: "No revenue data", description: "No books have generated revenue yet." },
  recently_published: { icon: Clock, title: "No recent publications", description: "No books published in the last 30 days." },
  oldest_books: { icon: History, title: "No oldest books", description: "No books found." },
};

const MONTHLY_PUBLISHING = [
  { month: "Jan", books: 42 }, { month: "Feb", books: 38 }, { month: "Mar", books: 51 },
  { month: "Apr", books: 35 }, { month: "May", books: 47 }, { month: "Jun", books: 55 },
  { month: "Jul", books: 30 }, { month: "Aug", books: 44 }, { month: "Sep", books: 39 },
  { month: "Oct", books: 52 }, { month: "Nov", books: 41 }, { month: "Dec", books: 48 },
];

const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 2450000 }, { month: "Feb", revenue: 2180000 }, { month: "Mar", revenue: 3120000 },
  { month: "Apr", revenue: 1950000 }, { month: "May", revenue: 2780000 }, { month: "Jun", revenue: 3340000 },
  { month: "Jul", revenue: 1670000 }, { month: "Aug", revenue: 2560000 }, { month: "Sep", revenue: 2290000 },
  { month: "Oct", revenue: 3180000 }, { month: "Nov", revenue: 2430000 }, { month: "Dec", revenue: 2910000 },
];

const PIE_COLORS = ["#8A6A4A", "#D8B27A", "#3D5A80", "#C0506E", "#27AE60", "#6B3A8A", "#E67E22", "#1ABC9C"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const STORAGE_KEY = "statement_book_status_overrides";

function loadOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveOverride(bookId: string, newStatus: string) {
  const overrides = loadOverrides();
  overrides[bookId] = newStatus;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("book-status-changed", { detail: { bookId, newStatus } }));
  }
}

function applyOverrides(items: ApiBook[]): ApiBook[] {
  const overrides = loadOverrides();
  return items.map((b) => {
    const overridden = overrides[b.id];
    if (overridden && overridden !== b.status) {
      return { ...b, status: overridden };
    }
    return b;
  });
}

function computeStatsFromBooks(books: ApiBook[]): BookStats {
  const publishedBooks = books.filter((b) => b.status === "PUBLISHED").length;
  const pendingReview = books.filter((b) => b.status === "SUBMITTED").length;
  const draftBooks = books.filter((b) => b.status === "DRAFT").length;
  const rejectedBooks = books.filter((b) => b.status === "REJECTED").length;
  const archivedBooks = books.filter((b) => b.status === "ARCHIVED").length;
  const totalSales = books.reduce((sum, b) => sum + (b.sales ?? 0), 0);
  const totalViews = books.reduce((sum, b) => sum + (b.views ?? 0), 0);
  const totalDownloads = books.reduce((sum, b) => sum + (b.downloads ?? 0), 0);

  const categoryCount: Record<string, number> = {};
  for (const b of books) {
    const name = typeof b.category === "object" && b.category !== null ? b.category.name : (b.category || "Uncategorized");
    categoryCount[name] = (categoryCount[name] || 0) + 1;
  }
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

  const authorCount: Record<string, number> = {};
  for (const b of books) {
    const name = b.author?.user?.name || "Unknown";
    authorCount[name] = (authorCount[name] || 0) + 1;
  }
  const topAuthor = Object.entries(authorCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

  const formatBreakdown: Record<string, number> = {};
  for (const b of books) {
    formatBreakdown[b.format] = (formatBreakdown[b.format] || 0) + 1;
  }

  return {
    totalBooks: books.length,
    publishedBooks,
    pendingReview,
    draftBooks,
    rejectedBooks,
    archivedBooks,
    topCategory,
    topAuthor,
    totalSales,
    totalViews,
    totalDownloads,
    categoryBreakdown: categoryCount,
    formatBreakdown,
  };
}

export default function AdminBooksPage() {
  const [activeTab, setActiveTab] = useState<BookStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [sortBy, setSortBy] = useState("best_sellers");
  const [bestSellersFilter, setBestSellersFilter] = useState("all");
  const [allBooks, setAllBooks] = useState<ApiBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  const [previewBook, setPreviewBook] = useState<ApiBook | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [moveToDraftDialogOpen, setMoveToDraftDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState("");

  const stickyRef = useRef<HTMLDivElement>(null);
  const tableScroll = useRef<SyncedTableScrollHandle>(null);

  const addActivity = useCallback((action: ActivityEntry["action"], bookTitle: string, count?: number, detail?: string) => {
    const entry: ActivityEntry = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      action, bookTitle, count, detail,
      timestamp: new Date().toISOString(),
    };
    setActivityLog((prev) => [entry, ...prev].slice(0, 20));
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/books?page=1&pageSize=9999&sort=best_sellers");
        const data = await res.json();
        if (data.success) {
          setAllBooks(applyOverrides(data.data.items));
        }
      } catch {
        console.error("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const updateBookStatus = useCallback((bookId: string, newStatus: string) => {
    saveOverride(bookId, newStatus);
    setAllBooks((prev) => prev.map((b) => b.id === bookId ? { ...b, status: newStatus } : b));
  }, []);

  const stats = useMemo(() => computeStatsFromBooks(allBooks), [allBooks]);

  const displayedBooks = useMemo(() => {
    let result = [...allBooks];

    // Tab filtering
    if (activeTab === "PUBLISHED" || activeTab === "SUBMITTED" || activeTab === "DRAFT" || activeTab === "REJECTED" || activeTab === "ARCHIVED") {
      result = result.filter((b) => b.status === activeTab);
    } else if (activeTab === "most_popular") {
      result = result.filter((b) => (b.sales ?? 0) > 500).sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0));
    } else if (activeTab === "top_revenue") {
      result = result.sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0)).slice(0, 20);
    } else if (activeTab === "recently_published") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter((b) => new Date(b.createdAt) >= thirtyDaysAgo).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeTab === "oldest_books") {
      result = result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    // Search filtering (client-side)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((b) => {
        const title = b.title?.toLowerCase() || "";
        const authorName = b.author?.user?.name?.toLowerCase() || "";
        const authorEmail = b.author?.user?.email?.toLowerCase() || "";
        const isbn = b.isbn?.toLowerCase() || "";
        const catName = (typeof b.category === "object" && b.category !== null) ? b.category.name?.toLowerCase() : (b.category?.toLowerCase() || "");
        const format = formatConfig[b.format]?.label?.toLowerCase() || b.format?.toLowerCase() || "";
        return title.includes(q) || authorName.includes(q) || authorEmail.includes(q) || isbn.includes(q) || catName.includes(q) || format.includes(q);
      });
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter((b) => {
        const catName = typeof b.category === "object" && b.category !== null ? b.category.name : b.category;
        return catName === categoryFilter;
      });
    }

    // Format filter
    if (formatFilter) {
      result = result.filter((b) => b.format === formatFilter);
    }

    // Best sellers filter
    if (bestSellersFilter === "top_10") {
      result = result.sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0)).slice(0, 10);
    } else if (bestSellersFilter === "top_25") {
      result = result.sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0)).slice(0, 25);
    } else if (bestSellersFilter === "top_50") {
      result = result.sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0)).slice(0, 50);
    } else if (bestSellersFilter === "top_100") {
      result = result.sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0)).slice(0, 100);
    }

    // Sorting
    if (sortBy === "best_sellers" && activeTab !== "most_popular") {
      result = result.sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0));
    } else if (sortBy === "most_viewed") {
      result = result.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    } else if (sortBy === "new_releases") {
      result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      result = result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "title_az") {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "title_za") {
      result = result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "top_revenue") {
      result = result.sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));
    }

    return result;
  }, [allBooks, activeTab, search, categoryFilter, formatFilter, bestSellersFilter, sortBy]);

  const allSelected = displayedBooks.length > 0 && displayedBooks.every((b) => selectedIds.has(b.id));
  const someSelected = displayedBooks.some((b) => selectedIds.has(b.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(displayedBooks.map((b) => b.id)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getBookTitle = (id: string): string => {
    const b = allBooks.find((x) => x.id === id);
    return b?.title || "Unknown";
  };

  const openDrawer = (book: ApiBook) => {
    setPreviewBook(book);
    setDrawerOpen(true);
  };

  const handleAction = async (bookId: string, action: string, reason?: string) => {
    setActionLoading(true);
    try {
      const title = getBookTitle(bookId);
      const previousStatus = allBooks.find((b) => b.id === bookId)?.status;

      await fetch("/api/admin/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, action, rejectionReason: reason }),
      });

      const newStatus = action === "approve" || action === "publish" ? "PUBLISHED"
        : action === "reject" ? "REJECTED"
        : action === "archive" ? "ARCHIVED"
        : action === "restore" ? "PUBLISHED"
        : action === "moveToDraft" ? "DRAFT"
        : action === "review" ? "SUBMITTED"
        : undefined;

      if (newStatus) {
        updateBookStatus(bookId, newStatus);

        actionHistory.pushAction({
          action: action === "approve" || action === "publish" ? "status_change" : action === "reject" ? "status_change" : action === "archive" ? "status_change" : action === "restore" ? "status_change" : "edit",
          entity: "book",
          entityName: title,
          description: `${action.charAt(0).toUpperCase() + action.slice(1)}ed "${title}" (${previousStatus} → ${newStatus})`,
          previousState: null,
          newState: null,
        });
      }

      if (action === "approve") addActivity("approve", title);
      else if (action === "reject") addActivity("reject", title);
      else if (action === "publish") addActivity("publish", title);
      else if (action === "archive") addActivity("archive", title);
      else if (action === "restore") addActivity("restore", title);
      else if (action === "moveToDraft") addActivity("publish", title);
      else if (action === "review") addActivity("approve", title);
      setApproveDialogOpen(false);
      setRejectDialogOpen(false);
      setPublishDialogOpen(false);
      setArchiveDialogOpen(false);
      setRestoreDialogOpen(false);
      setMoveToDraftDialogOpen(false);
      setReviewDialogOpen(false);
      setDrawerOpen(false);
      setRejectReason("");
      setPreviewBook(null);
    } catch {
      console.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const singleAction = action === "bulkApprove" ? "approve" : action === "bulkReject" ? "reject" : "archive";
    const newStatus = singleAction === "approve" ? "PUBLISHED" : singleAction === "reject" ? "REJECTED" : "ARCHIVED";

    actionHistory.pushAction({
      action: "status_change",
      entity: "book",
      entityName: `${ids.length} books`,
      description: `Bulk ${singleAction === "approve" ? "approved" : singleAction === "reject" ? "rejected" : "archived"} ${ids.length} book${ids.length === 1 ? "" : "s"}`,
      previousState: null,
      newState: null,
    });

    for (const id of ids) updateBookStatus(id, newStatus);
    addActivity("bulk_action", `${ids.length} books`, ids.length);
    setSelectedIds(new Set());
  };

  const handleBulkCategoryChange = () => {
    if (selectedIds.size === 0 || !bulkCategory) return;
    const count = selectedIds.size;

    actionHistory.pushAction({
      action: "edit",
      entity: "book",
      entityName: `${count} books`,
      description: `Moved ${count} book${count === 1 ? "" : "s"} to ${bulkCategory}`,
      previousState: null,
      newState: null,
    });

    setAllBooks((prev) => prev.map((b) => selectedIds.has(b.id) ? { ...b, category: bulkCategory } : b));
    addActivity("category_change", `${count} books`, count, `Moved to ${bulkCategory}`);
    setSelectedIds(new Set());
    setBulkCategory("");
  };

  const exportCSV = (data: ApiBook[], filename: string) => {
    const headers = ["Title", "Author", "ISBN", "Category", "Format", "Status", "Price", "Sales", "Revenue", "Views"];
    const rows = data.map((b) => [
      b.title,
      b.author?.user?.name || "",
      b.isbn || "",
      typeof b.category === "object" && b.category !== null ? b.category.name : (b.category || ""),
      b.format,
      b.status,
      String(b.price),
      String(b.sales ?? 0),
      String(b.revenue ?? 0),
      String(b.views ?? 0),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; link.click();
    URL.revokeObjectURL(url);
    addActivity("export", `${data.length} books`);
  };

  const activityLabel = (a: ActivityEntry) => {
    switch (a.action) {
      case "approve": return `Approved "${a.bookTitle}"`;
      case "reject": return `Rejected "${a.bookTitle}"`;
      case "publish": return `Published "${a.bookTitle}"`;
      case "archive": return `Archived "${a.bookTitle}"`;
      case "restore": return `Restored "${a.bookTitle}"`;
      case "export": return `Exported ${a.bookTitle}`;
      case "bulk_action": return `Bulk action on ${a.bookTitle}`;
      case "category_change": return `Changed category: ${a.detail}`;
    }
  };

  const activityIcon = (action: ActivityEntry["action"]) => {
    if (action === "approve" || action === "publish" || action === "restore") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />;
    if (action === "reject") return <XCircle className="h-3.5 w-3.5 text-rose-600" />;
    if (action === "archive") return <Archive className="h-3.5 w-3.5 text-gray-600" />;
    if (action === "category_change") return <ArrowUpDown className="h-3.5 w-3.5 text-blue-600" />;
    return <Download className="h-3.5 w-3.5 text-blue-600" />;
  };

  const showStatusColumn = activeTab === "all" || activeTab === "most_popular" || activeTab === "top_revenue" || activeTab === "recently_published" || activeTab === "oldest_books";

  const getCategoryName = (cat: ApiBook["category"]): string => {
    if (!cat) return "Uncategorized";
    if (typeof cat === "string") return cat;
    return cat.name || "Uncategorized";
  };

  const getCategoryCoverClass = (cat: ApiBook["category"]): string => {
    const name = getCategoryName(cat);
    return CATEGORY_COVERS[name] || "bg-[#8A6A4A]";
  };

  const emptyMsg = EMPTY_STATE_MESSAGES[activeTab] || EMPTY_STATE_MESSAGES.all;

  const topCategories = useMemo(() => {
    return Object.entries(stats.categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 12) + "…" : name, value }));
  }, [stats.categoryBreakdown]);

  const topBooksBySales = useMemo(() => {
    return [...allBooks].sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0)).slice(0, 10);
  }, [allBooks]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Book Management</h1>
          <p className="text-sm text-muted-foreground">Review and manage all book submissions across the platform.</p>
        </div>
        <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
          <Button variant="outline" size="sm" onClick={() => {
            setLoading(true);
            fetch("/api/admin/books?page=1&pageSize=9999&sort=best_sellers")
              .then((r) => r.json())
              .then((data) => { if (data.success) setAllBooks(applyOverrides(data.data.items)); })
              .finally(() => setLoading(false));
          }} disabled={loading} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
          </Button>
        </div>
      </motion.div>

      {/* Clickable Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Total Books", value: stats.totalBooks, icon: BookOpen, color: "text-[#8A6A4A]", bg: "bg-[#8A6A4A]/10" },
          { label: "Published", value: stats.publishedBooks, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Review", value: stats.pendingReview, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Rejected", value: stats.rejectedBooks, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Total Sales", value: stats.totalSales, icon: DollarSign, color: "text-violet-600", bg: "bg-violet-50", isCurrency: true },
        ].map((stat) => {
          const tabTarget = STAT_CARD_MAP[stat.label];
          const isActiveCard = activeTab === tabTarget;
          return (
            <Card
              key={stat.label}
              onClick={() => tabTarget && setActiveTab(tabTarget)}
              className={cn(
                "shadow-sm transition-all duration-200 border-[#D8B27A]/20",
                tabTarget && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
                isActiveCard && "ring-2 ring-[#D8B27A] shadow-md border-[#D8B27A]/40",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-lg p-2", stat.bg, stat.color)}><stat.icon className="h-4 w-4" /></div>
                  <div>
                    <motion.p
                      key={stat.value}
                      initial={{ scale: 1.15, color: "#D8B27A" }}
                      animate={{ scale: 1, color: "#1D1D1D" }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold"
                    >
                      {"isCurrency" in stat && stat.isCurrency ? formatCurrency(stat.value) : (stat.value as number).toLocaleString()}
                    </motion.p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Analytics Center */}
      <motion.div variants={item}>
        <div className="analytics-dropdown-border">
          <Card className="shadow-sm bg-white">
            <button onClick={() => setAnalyticsOpen(!analyticsOpen)} className="w-full flex items-center justify-between p-4 hover:bg-[#F2D8BE]/10 transition-colors rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#8A6A4A]" />
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Book Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Monthly Publishing Trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={MONTHLY_PUBLISHING}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#8A6A4A" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#8A6A4A" />
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Tooltip formatter={(value: any) => [value, "Books Published"]} contentStyle={{ borderRadius: 8, border: "1px solid #E8DDD0" }} />
                        <Line type="monotone" dataKey="books" stroke="#8A6A4A" strokeWidth={2} dot={{ fill: "#D8B27A", r: 3 }} activeDot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Category Distribution</h4>
                    <div className="flex items-center gap-4">
                      <ResponsiveContainer width="50%" height={200}>
                        <PieChart>
                          <Pie data={topCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
                            {topCategories.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          <Tooltip formatter={(value: any) => [value, "Books"]} contentStyle={{ borderRadius: 8, border: "1px solid #E8DDD0" }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex-1 space-y-1.5">
                        {topCategories.map((cat, i) => (
                          <div key={cat.name} className="flex items-center gap-2 text-xs">
                            <div className="h-2.5 w-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <span className="text-muted-foreground truncate flex-1">{cat.name}</span>
                            <span className="font-medium text-[#1D1D1D]">{cat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Revenue Trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={MONTHLY_REVENUE}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#8A6A4A" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#8A6A4A" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Tooltip formatter={(value: any) => [formatCurrency(value), "Revenue"]} contentStyle={{ borderRadius: 8, border: "1px solid #E8DDD0" }} />
                        <Line type="monotone" dataKey="revenue" stroke="#D8B27A" strokeWidth={2} dot={{ fill: "#8A6A4A", r: 3 }} activeDot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Top Performing Books</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {topBooksBySales.map((book, i) => (
                        <div key={book.id} className="flex items-center gap-3 py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                          <span className="text-xs font-bold text-[#8A6A4A] w-5 text-center">{i + 1}</span>
                          <div className={cn("h-8 w-6 rounded flex items-center justify-center flex-shrink-0", getCategoryCoverClass(book.category))}>
                            <BookOpen className="h-3 w-3 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-[#1D1D1D] truncate">{book.title}</p>
                            <p className="text-[10px] text-muted-foreground">{(book.sales ?? 0).toLocaleString()} sales</p>
                          </div>
                          <span className="text-xs font-semibold text-[#8A6A4A]">{formatCurrency(book.revenue ?? 0)}</span>
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

      {/* Sticky Search & Filter Bar */}
      <motion.div variants={item} ref={stickyRef} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="search-bar-border relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input placeholder="Search by title, author, ISBN, category, or format..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9 relative z-[1]" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={categoryFilter || "all"} onValueChange={(v) => setCategoryFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[150px] h-9 border-[#8A6A4A]/20"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={formatFilter || "all"} onValueChange={(v) => setFormatFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[130px] h-9 border-[#8A6A4A]/20"><SelectValue placeholder="All Formats" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="EBOOK">eBook</SelectItem>
                <SelectItem value="PAPERBACK">Paperback</SelectItem>
                <SelectItem value="HARDCOVER">Hardcover</SelectItem>
                <SelectItem value="AUDIOBOOK">Audiobook</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] h-9 border-[#8A6A4A]/20"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={bestSellersFilter} onValueChange={setBestSellersFilter}>
              <SelectTrigger className="w-[130px] h-9 border-[#8A6A4A]/20"><SelectValue placeholder="Best Sellers" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Books</SelectItem>
                <SelectItem value="top_10">Top 10</SelectItem>
                <SelectItem value="top_25">Top 25</SelectItem>
                <SelectItem value="top_50">Top 50</SelectItem>
                <SelectItem value="top_100">Top 100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BookStatusFilter)}>
          <TabsList className="bg-[#F2D8BE]/40 h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#8A6A4A] data-[state=active]:text-white text-xs sm:text-sm">All Books</TabsTrigger>
            <TabsTrigger value="PUBLISHED" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs sm:text-sm"><CheckCircle2 className="mr-1 h-3 w-3" />Published</TabsTrigger>
            <TabsTrigger value="SUBMITTED" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-xs sm:text-sm"><Clock className="mr-1 h-3 w-3" />Pending</TabsTrigger>
            <TabsTrigger value="REJECTED" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-xs sm:text-sm"><XCircle className="mr-1 h-3 w-3" />Rejected</TabsTrigger>
            <TabsTrigger value="DRAFT" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-xs sm:text-sm"><FileText className="mr-1 h-3 w-3" />Draft</TabsTrigger>
            <TabsTrigger value="ARCHIVED" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-xs sm:text-sm"><Archive className="mr-1 h-3 w-3" />Archived</TabsTrigger>
            <TabsTrigger value="most_popular" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-xs sm:text-sm"><TrendingUp className="mr-1 h-3 w-3" />Most Popular</TabsTrigger>
            <TabsTrigger value="top_revenue" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white text-xs sm:text-sm"><DollarSign className="mr-1 h-3 w-3" />Top Revenue</TabsTrigger>
            <TabsTrigger value="recently_published" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm"><Clock className="mr-1 h-3 w-3" />Recent</TabsTrigger>
            <TabsTrigger value="oldest_books" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white text-xs sm:text-sm"><History className="mr-1 h-3 w-3" />Oldest</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Summary Strip */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground bg-[#F2D8BE]/15 rounded-lg px-4 py-2 border border-[#D8B27A]/10">
        <span>Showing <span className="font-semibold text-[#1D1D1D]">{displayedBooks.length}</span> of <span className="font-semibold text-[#1D1D1D]">{allBooks.length}</span> books</span>
        <span className="hidden sm:inline text-[#E8DDD0]">|</span>
        <span><span className="text-emerald-600 font-medium">{stats.publishedBooks}</span> Published</span>
        <span><span className="text-amber-600 font-medium">{stats.pendingReview}</span> Pending</span>
        <span><span className="text-slate-500 font-medium">{stats.draftBooks}</span> Draft</span>
        <span><span className="text-rose-600 font-medium">{stats.rejectedBooks}</span> Rejected</span>
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
            <span className="text-sm font-semibold text-[#1D1D1D]">{selectedIds.size} Book{selectedIds.size > 1 ? "s" : ""} Selected</span>
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => handleBulkAction("bulkApprove")} disabled={actionLoading}>
                <CheckCircle2 className="h-3 w-3 mr-1" />Approve
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => handleBulkAction("bulkReject")} disabled={actionLoading}>
                <XCircle className="h-3 w-3 mr-1" />Reject
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-gray-200 text-gray-700 hover:bg-gray-50" onClick={() => handleBulkAction("bulkArchive")} disabled={actionLoading}>
                <Archive className="h-3 w-3 mr-1" />Archive
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-[#8A6A4A]/30 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => {
                const selected = displayedBooks.filter((b) => selectedIds.has(b.id));
                exportCSV(selected, `selected-books-${Date.now()}.csv`);
              }}>
                <Download className="h-3 w-3 mr-1" />Export
              </Button>
              <div className="h-4 w-px bg-[#D8B27A]/30" />
              <Select value={bulkCategory} onValueChange={setBulkCategory}>
                <SelectTrigger className="w-[140px] h-8 text-xs border-[#8A6A4A]/20"><SelectValue placeholder="Move to Category" /></SelectTrigger>
                <SelectContent>
                  {BULK_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {bulkCategory && (
                <Button size="sm" variant="outline" className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50" onClick={handleBulkCategoryChange}>
                  <ArrowUpDown className="h-3 w-3 mr-1" />Move
                </Button>
              )}
              <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground" onClick={() => { setSelectedIds(new Set()); setBulkCategory(""); }}>Clear</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Books Table */}
      <SyncedTableScroll ref={tableScroll} loading={loading}>
        <Table>
              <TableHeader>
                <TableRow className="bg-[#F2D8BE]/20 hover:bg-[#F2D8BE]/30 sticky top-0 z-10">
                  <TableHead className="w-10">
                    <button onClick={toggleSelectAll} className="flex items-center justify-center">
                      {allSelected ? <CheckSquare className="h-4 w-4 text-[#8A6A4A]" /> : someSelected ? <div className="h-4 w-4 border-2 border-[#8A6A4A] rounded flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#8A6A4A] rounded-sm" /></div> : <Square className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold">Book</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden md:table-cell">Author</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell">ISBN</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell">Category</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden xl:table-cell">Format</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold hidden xl:table-cell">Published</TableHead>
                  {showStatusColumn && <TableHead className="text-[#1D1D1D] font-semibold hidden sm:table-cell">Status</TableHead>}
                  <TableHead className="text-[#1D1D1D] font-semibold text-right hidden md:table-cell">Sales</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold text-right hidden lg:table-cell">Revenue</TableHead>
                  <TableHead className="text-[#1D1D1D] font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={11} className="text-center py-16"><RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#8A6A4A]" /><p className="mt-3 text-sm text-muted-foreground">Loading books...</p></TableCell></TableRow>
                ) : displayedBooks.length === 0 ? (
                  <TableRow><TableCell colSpan={11} className="text-center py-16">
                    <emptyMsg.icon className="mx-auto h-10 w-10 text-[#D8B27A]/50 mb-3" />
                    <p className="text-sm font-medium text-[#1D1D1D]">{search.trim() ? "No books found matching your search." : emptyMsg.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{search.trim() ? "Try a different search term." : emptyMsg.description}</p>
                  </TableCell></TableRow>
                ) : (
                  displayedBooks.map((book) => {
                    const si = statusConfig[book.status] || statusConfig.DRAFT;
                    const fi = formatConfig[book.format] || formatConfig.EBOOK;
                    const isSubmitted = book.status === "SUBMITTED";
                    const isDraft = book.status === "DRAFT";
                    const isRejected = book.status === "REJECTED";
                    const isArchived = book.status === "ARCHIVED";
                    const isPublished = book.status === "PUBLISHED";
                    return (
                      <TableRow key={book.id} className={cn(
                        "hover:bg-[#8A6A4A]/[0.04] hover:shadow-sm transition-all duration-150 cursor-default border-b border-[#E8DDD0]/50",
                        selectedIds.has(book.id) && "bg-[#F2D8BE]/15",
                      )}>
                        <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => toggleSelect(book.id)} className="flex items-center justify-center">
                            {selectedIds.has(book.id) ? <CheckSquare className="h-4 w-4 text-[#8A6A4A]" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                          </button>
                        </TableCell>
                        <TableCell className="cursor-pointer py-2" onClick={() => openDrawer(book)}>
                          <div className="flex items-center gap-3">
                            <div className={cn("h-12 w-9 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 border-l-4 border-l-black/20", getCategoryCoverClass(book.category))}>
                              <BookOpen className="h-4 w-4 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-[#1D1D1D] text-sm truncate max-w-[180px]">{book.title}</p>
                              <Badge variant="secondary" className={cn("mt-0.5 text-[10px] px-1.5 py-0", fi.color)}>{fi.label}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell cursor-pointer py-2" onClick={() => openDrawer(book)}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={book.author?.user?.image || undefined} alt={book.author?.user?.name || "Author"} />
                              <AvatarFallback className="text-[10px] bg-[#8A6A4A]/10 text-[#8A6A4A]">{getInitials(book.author?.user?.name || "A")}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#1D1D1D] truncate max-w-[140px]">{book.author?.user?.name || "Unknown"}</p>
                              <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">{book.author?.user?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell cursor-pointer py-2 text-xs text-muted-foreground font-mono" onClick={() => openDrawer(book)}>
                          {book.isbn || <span className="text-amber-500">—</span>}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell cursor-pointer py-2" onClick={() => openDrawer(book)}>
                          <Badge variant="secondary" className="bg-[#F2D8BE]/40 text-[#8A6A4A] hover:bg-[#F2D8BE]/60 border-none text-[11px]">{getCategoryName(book.category)}</Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell cursor-pointer py-2" onClick={() => openDrawer(book)}>
                          <Badge variant="secondary" className={cn("text-[11px]", fi.color)}>{fi.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell cursor-pointer py-2 text-sm text-muted-foreground" onClick={() => openDrawer(book)}>
                          {book.publicationDate ? formatDate(book.publicationDate) : formatDate(book.createdAt)}
                        </TableCell>
                        {showStatusColumn && (
                          <TableCell className="hidden sm:table-cell cursor-pointer py-2" onClick={() => openDrawer(book)}>
                            <Badge variant="outline" className={cn("gap-1 text-[11px]", si.color)}>
                              <si.icon className="h-3 w-3" />{si.label}
                            </Badge>
                          </TableCell>
                        )}
                        <TableCell className="text-right hidden md:table-cell cursor-pointer py-2" onClick={() => openDrawer(book)}>
                          <span className="text-sm font-medium text-[#1D1D1D]">{(book.sales ?? 0).toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="text-right hidden lg:table-cell cursor-pointer py-2" onClick={() => openDrawer(book)}>
                          <span className="text-sm font-semibold text-[#8A6A4A]">{formatCurrency(book.revenue ?? 0)}</span>
                        </TableCell>
                        <TableCell className="text-right py-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-0.5">
                            {isSubmitted && (
                              <>
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-emerald-600 hover:bg-emerald-50" onClick={() => { setPreviewBook(book); setApproveDialogOpen(true); }} title="Approve">
                                  <Check className="h-3.5 w-3.5 mr-1" />Approve
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={() => { setPreviewBook(book); setRejectReason(""); setRejectDialogOpen(true); }} title="Reject">
                                  <X className="h-3.5 w-3.5 mr-1" />Reject
                                </Button>
                              </>
                            )}
                            {isPublished && (
                              <>
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-50" onClick={() => { setPreviewBook(book); setMoveToDraftDialogOpen(true); }} title="Move to Draft">
                                  <FileText className="h-3.5 w-3.5 mr-1" />Draft
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-gray-600 hover:bg-gray-50" onClick={() => { setPreviewBook(book); setArchiveDialogOpen(true); }} title="Archive">
                                  <Archive className="h-3.5 w-3.5 mr-1" />Archive
                                </Button>
                              </>
                            )}
                            {isDraft && (
                              <>
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50" onClick={() => { setPreviewBook(book); setPublishDialogOpen(true); }} title="Publish">
                                  <Globe className="h-3.5 w-3.5 mr-1" />Publish
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={() => { setPreviewBook(book); setRejectReason(""); setRejectDialogOpen(true); }} title="Reject">
                                  <X className="h-3.5 w-3.5 mr-1" />Reject
                                </Button>
                              </>
                            )}
                            {isRejected && (
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-amber-600 hover:bg-amber-50" onClick={() => { setPreviewBook(book); setReviewDialogOpen(true); }} title="Send for Review">
                                <Clock className="h-3.5 w-3.5 mr-1" />Review
                              </Button>
                            )}
                            {isArchived && (
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50" onClick={() => { setPreviewBook(book); setRestoreDialogOpen(true); }} title="Restore">
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />Restore
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => openDrawer(book)} title="Quick preview">
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

      {/* Approve Confirmation Dialog */}
      {approveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setApproveDialogOpen(false); setPreviewBook(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><h3 className="text-lg font-semibold text-[#1D1D1D]">Approve Book?</h3></div>
            <p className="text-sm text-muted-foreground mb-1">This book will be published and become visible to readers.</p>
            <p className="text-sm font-medium text-[#1D1D1D] mb-4">{previewBook?.title}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setApproveDialogOpen(false); setPreviewBook(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" onClick={() => previewBook && handleAction(previewBook.id, "approve")} className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={actionLoading}>
                {actionLoading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}Approve Book
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {rejectDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setRejectDialogOpen(false); setPreviewBook(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><XCircle className="h-5 w-5 text-rose-600" /><h3 className="text-lg font-semibold text-[#1D1D1D]">Reject Book</h3></div>
            <p className="text-sm text-muted-foreground mb-1">Provide a reason for rejecting this book.</p>
            <p className="text-sm font-medium text-[#1D1D1D] mb-3">{previewBook?.title}</p>
            <textarea placeholder="Please provide a detailed reason for rejection..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full rounded-lg border border-[#8A6A4A]/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A6A4A]/30 resize-none" />
            <div className="flex gap-2 justify-end mt-3">
              <Button variant="outline" size="sm" onClick={() => { setRejectDialogOpen(false); setPreviewBook(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" variant="destructive" onClick={() => previewBook && handleAction(previewBook.id, "reject", rejectReason)} disabled={!rejectReason.trim() || actionLoading}>
                {actionLoading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <X className="h-3.5 w-3.5 mr-1" />}Reject Book
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Publish Confirmation Dialog */}
      {publishDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setPublishDialogOpen(false); setPreviewBook(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><Globe className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-semibold text-[#1D1D1D]">Publish Book?</h3></div>
            <p className="text-sm text-muted-foreground mb-1">This draft will be published and become visible to readers.</p>
            <p className="text-sm font-medium text-[#1D1D1D] mb-4">{previewBook?.title}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setPublishDialogOpen(false); setPreviewBook(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" onClick={() => previewBook && handleAction(previewBook.id, "publish")} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={actionLoading}>
                {actionLoading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Globe className="h-3.5 w-3.5 mr-1" />}Publish Book
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Archive Confirmation Dialog */}
      {archiveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setArchiveDialogOpen(false); setPreviewBook(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><Archive className="h-5 w-5 text-gray-600" /><h3 className="text-lg font-semibold text-[#1D1D1D]">Archive Book?</h3></div>
            <p className="text-sm text-muted-foreground mb-1">This book will be archived and hidden from readers.</p>
            <p className="text-sm font-medium text-[#1D1D1D] mb-4">{previewBook?.title}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setArchiveDialogOpen(false); setPreviewBook(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" variant="outline" onClick={() => previewBook && handleAction(previewBook.id, "archive")} className="border-gray-300 text-gray-700 hover:bg-gray-50" disabled={actionLoading}>
                {actionLoading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Archive className="h-3.5 w-3.5 mr-1" />}Archive Book
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Restore Confirmation Dialog */}
      {restoreDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setRestoreDialogOpen(false); setPreviewBook(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><RotateCcw className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-semibold text-[#1D1D1D]">Restore Book?</h3></div>
            <p className="text-sm text-muted-foreground mb-1">This book will be restored from archive and become published again.</p>
            <p className="text-sm font-medium text-[#1D1D1D] mb-4">{previewBook?.title}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setRestoreDialogOpen(false); setPreviewBook(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" onClick={() => previewBook && handleAction(previewBook.id, "restore")} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={actionLoading}>
                {actionLoading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5 mr-1" />}Restore Book
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Move to Draft Confirmation Dialog */}
      {moveToDraftDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setMoveToDraftDialogOpen(false); setPreviewBook(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><FileText className="h-5 w-5 text-slate-600" /><h3 className="text-lg font-semibold text-[#1D1D1D]">Move to Draft?</h3></div>
            <p className="text-sm text-muted-foreground mb-1">This published book will be moved back to draft status and hidden from readers.</p>
            <p className="text-sm font-medium text-[#1D1D1D] mb-4">{previewBook?.title}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setMoveToDraftDialogOpen(false); setPreviewBook(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" onClick={() => previewBook && handleAction(previewBook.id, "moveToDraft")} className="bg-slate-600 hover:bg-slate-700 text-white" disabled={actionLoading}>
                {actionLoading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <FileText className="h-3.5 w-3.5 mr-1" />}Move to Draft
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Review (Resubmit) Confirmation Dialog */}
      {reviewDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setReviewDialogOpen(false); setPreviewBook(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 border border-[#D8B27A]/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3"><Clock className="h-5 w-5 text-amber-600" /><h3 className="text-lg font-semibold text-[#1D1D1D]">Send for Review?</h3></div>
            <p className="text-sm text-muted-foreground mb-1">This rejected book will be sent back to Pending Review for re-evaluation.</p>
            <p className="text-sm font-medium text-[#1D1D1D] mb-4">{previewBook?.title}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setReviewDialogOpen(false); setPreviewBook(null); }} className="border-[#8A6A4A]/20">Cancel</Button>
              <Button size="sm" onClick={() => previewBook && handleAction(previewBook.id, "review")} className="bg-amber-600 hover:bg-amber-700 text-white" disabled={actionLoading}>
                {actionLoading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Clock className="h-3.5 w-3.5 mr-1" />}Send for Review
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Book Quick Preview Drawer */}
      <AnimatePresence>
        {drawerOpen && previewBook && (
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
                  <h2 className="text-lg font-bold text-[#1D1D1D]">Book Details</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
                </div>

                <div className="flex gap-4">
                  <div className={cn("h-36 w-24 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 border-l-4 border-l-black/20", getCategoryCoverClass(previewBook.category))}>
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-[#1D1D1D] leading-tight">{previewBook.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={previewBook.author?.user?.image || undefined} alt={previewBook.author?.user?.name || "Author"} />
                        <AvatarFallback className="text-[9px] bg-[#8A6A4A]/10 text-[#8A6A4A]">{getInitials(previewBook.author?.user?.name || "A")}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">by <span className="font-medium text-[#8A6A4A]">{previewBook.author?.user?.name || "Unknown"}</span></span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {(() => { const si = statusConfig[previewBook.status] || statusConfig.DRAFT; return <Badge variant="outline" className={cn("gap-1", si.color)}><si.icon className="h-3 w-3" />{si.label}</Badge>; })()}
                      {(() => { const fi = formatConfig[previewBook.format] || formatConfig.EBOOK; return <Badge variant="secondary" className={cn("gap-1", fi.color)}>{fi.label}</Badge>; })()}
                    </div>
                  </div>
                </div>

                {previewBook.description && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{previewBook.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Book Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "ISBN", value: previewBook.isbn || "N/A", icon: Book },
                      { label: "Category", value: getCategoryName(previewBook.category), icon: BookOpen },
                      { label: "Format", value: (formatConfig[previewBook.format] || formatConfig.EBOOK).label, icon: FileText },
                      { label: "Language", value: previewBook.language || "English", icon: Globe },
                      { label: "Pages", value: previewBook.pages ? previewBook.pages.toLocaleString() : "N/A", icon: FileText },
                      { label: "Publication Date", value: previewBook.publicationDate ? formatDate(previewBook.publicationDate, "long") : formatDate(previewBook.createdAt, "long"), icon: Clock },
                      { label: "Price", value: formatCurrency(previewBook.price), icon: DollarSign },
                      { label: "Status", value: previewBook.status === "PUBLISHED" ? "Live" : previewBook.status === "SUBMITTED" ? "Pending" : previewBook.status, icon: CheckCircle2 },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-0.5"><f.icon className="h-3 w-3" />{f.label}</div>
                        <p className="text-xs font-medium text-[#1D1D1D]">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Performance</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Sales", value: (previewBook.sales ?? 0).toLocaleString(), icon: TrendingUp, color: "text-blue-600" },
                      { label: "Revenue", value: formatCurrency(previewBook.revenue ?? 0), icon: DollarSign, color: "text-emerald-600" },
                      { label: "Views", value: (previewBook.views ?? 0).toLocaleString(), icon: Eye, color: "text-[#8A6A4A]" },
                      { label: "Downloads", value: (previewBook.downloads ?? 0).toLocaleString(), icon: Download, color: "text-violet-600" },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5 text-center">
                        <f.icon className={`h-3.5 w-3.5 mx-auto mb-0.5 ${f.color}`} />
                        <p className="text-sm font-bold text-[#1D1D1D]">{f.value}</p>
                        <p className="text-[10px] text-muted-foreground">{f.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {previewBook.status === "REJECTED" && previewBook.rejectionReason && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                    <p className="text-xs font-semibold text-rose-700 mb-1">Rejection Reason</p>
                    <p className="text-[11px] text-rose-600">{previewBook.rejectionReason}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-[#D8B27A]/15">
                  {previewBook.status === "SUBMITTED" && (
                    <>
                      <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setDrawerOpen(false); setApproveDialogOpen(true); }}>
                        <Check className="h-3.5 w-3.5 mr-1" />Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => { setDrawerOpen(false); setRejectReason(""); setRejectDialogOpen(true); }}>
                        <X className="h-3.5 w-3.5 mr-1" />Reject
                      </Button>
                    </>
                  )}
                  {previewBook.status === "DRAFT" && (
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setDrawerOpen(false); setPublishDialogOpen(true); }}>
                      <Globe className="h-3.5 w-3.5 mr-1" />Publish
                    </Button>
                  )}
                  {previewBook.status === "ARCHIVED" && (
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setDrawerOpen(false); setRestoreDialogOpen(true); }}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />Restore
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1 border-[#8A6A4A]/20 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => setDrawerOpen(false)}>Close</Button>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Activity Timeline</h4>
                  <div className="space-y-2.5 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-[#E8DDD0]">
                    {[
                      { date: previewBook.createdAt, event: "Book submitted", icon: Send, color: "bg-blue-100 text-blue-600" },
                      ...(previewBook.status === "PUBLISHED" ? [{ date: previewBook.createdAt, event: "Published", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" }] : []),
                      ...(previewBook.status === "REJECTED" ? [{ date: previewBook.createdAt, event: "Rejected by admin", icon: XCircle, color: "bg-rose-100 text-rose-600" }] : []),
                      ...(previewBook.status === "ARCHIVED" ? [{ date: previewBook.createdAt, event: "Archived", icon: Archive, color: "bg-gray-100 text-gray-600" }] : []),
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
