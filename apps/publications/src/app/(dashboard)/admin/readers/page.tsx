"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Users, Plus, Trash2, Eye, RefreshCw, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Download, Mail, UserCheck, UserX, Shield,
  BarChart3, Heart, ShoppingCart, BookOpen, Star, Clock, Globe, Smartphone,
  Laptop, Tablet, Activity, SlidersHorizontal, Zap, X, Send, Ban, CheckCircle2,
  MoreVertical, Library, MessageSquare, FileText, Target,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDate, cn } from "@/lib/utils";

type ReaderStatus = "active" | "inactive" | "verified" | "suspended" | "new" | "returning";

interface ReaderRecord {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  country: string;
  language: string;
  status: ReaderStatus;
  booksOwned: number;
  purchases: number;
  amountSpent: number;
  memberSince: string;
  lastActive: string;
  favoriteCategories: string[];
  wishlistItems: string[];
  recentPurchases: { title: string; date: string; price: number }[];
  readingProgress: { title: string; progress: number }[];
  supportRequests: number;
  device: string;
}

interface ActivityRecord {
  id: string;
  readerName: string;
  type: "purchase" | "review" | "wishlist" | "reading" | "signup" | "support";
  message: string;
  time: string;
}

const STATUS_CONFIG: Record<ReaderStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Active", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  inactive: { label: "Inactive", color: "text-gray-700", bgColor: "bg-gray-50 border-gray-200" },
  verified: { label: "Verified", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  suspended: { label: "Suspended", color: "text-rose-700", bgColor: "bg-rose-50 border-rose-200" },
  new: { label: "New", color: "text-violet-700", bgColor: "bg-violet-50 border-violet-200" },
  returning: { label: "Returning", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
};

const COUNTRIES = ["Nigeria", "Kenya", "South Africa", "Ghana", "United Kingdom", "United States", "Canada", "Tanzania", "Uganda", "Ethiopia", "Egypt", "Morocco", "Senegal", "Cameroon", "Rwanda"];
const LANGUAGES = ["English", "French", "Swahili", "Yoruba", "Igbo", "Hausa", "Arabic", "Amharic"];
const DEVICES = ["Mobile", "Desktop", "Tablet"];
const CATEGORIES = ["Business", "Self Development", "Leadership", "Fiction", "Non-Fiction", "Romance", "Mystery", "Fantasy", "African Literature", "Technology", "Personal Finance", "Religion", "Science", "Biography", "Poetry"];

const FIRST_NAMES = ["Adebayo", "Chioma", "Kwame", "Fatima", "Olumide", "Aisha", "Tendai", "Ngozi", "Jabari", "Amara", "Emeka", "Zainab", "Kofi", "Lerato", "Tariq", "Sade", "Chidi", "Amina", "Mandla", "Yetunde", "Dumiso", "Obinna", "Halima", "Kweku", "Blessing", "Tolu", "Farai", "Adaeze", "Rashid", "Naledi", "Ifeoma", "Abel", "Chiamaka", "Segun", "Esther", "Thabo", "Nneka", "Kwesi", "Grace", "Bongani", "Uche", "Mariam", "Tawanda", "Folake", "Musa", "Zanele", "Chukwuemeka", "Safia", "Jelani", "Ayo", "Nkem", "Hassan", "Lindiwe", "Dayo", "Rania", "Tebogo", "Chidera", "Aliyu", "Precious", "Mpho", "Chinwe", "Abdi", "Ifeanyi", "Nolu", "Kudzai", "Toyin", "Samuel", "Esi", "Bright", "Anika", "Kabelo", "Oluwaseun", "Hauwa", "Mzwandile", "Busisiwe", "Tunde", "Ruth", "Zuberi", "Chidinma", "Thabiso", "Funke", "Imran", "Lungile", "Adunni", "Tshepo", "Nkosazana", "Babatunde", "Aminata", "Sipho", "Chizoba", "Yusuf", "Maserame", "Olayinka", "Jenna", "Hendrik", "Fatou", "Lamin", "Awa", "Ibrahim", "Nolwazi", "Sizwe", "Folashade"];
const LAST_NAMES = ["Okafor", "Mensah", "Nkosi", "Abubakar", "Adeyemi", "Hassan", "Moyo", "Eze", "Kamau", "Dlamini", "Osei", "Ibrahim", "Ndlovu", "Okonkwo", "Suleiman", "Achebe", "Mandela", "Banda", "Awolowo", "Diop", "Kenyatta", "Nyerere", "Lumumba", "Azikiwe", "Senghor", "Touré", "Nkrumah", "Machel", "Hifikepunye", "Dosumu", "Balogun", "Adeleke", "Fashola", "Obaseki", "Sanusi", "El-Rufai", "Obasanjo", "Buhari", "Atiku", "Tinubu", "Mugabe", "Kaunda", "Mutharika", "Bongo", "Biya", "Kagame", "Museveni", "Kenyatta", "Ghali", "Barre"];

const MONTHLY_GROWTH = [
  { month: "Jan", readers: 18200 }, { month: "Feb", readers: 19100 }, { month: "Mar", readers: 20400 },
  { month: "Apr", readers: 21800 }, { month: "May", readers: 23100 }, { month: "Jun", readers: 24580 },
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "name-az", label: "Name A–Z" },
  { value: "name-za", label: "Name Z–A" },
  { value: "most-spent", label: "Most Spent" },
  { value: "least-spent", label: "Least Spent" },
  { value: "most-books", label: "Most Books" },
  { value: "newest-member", label: "Newest Member" },
  { value: "oldest-member", label: "Oldest Member" },
  { value: "recently-active", label: "Recently Active" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function generateReaders(): ReaderRecord[] {
  const readers: ReaderRecord[] = [];
  const statuses: ReaderStatus[] = ["active", "active", "active", "active", "verified", "verified", "inactive", "new", "returning", "suspended"];
  for (let i = 0; i < 100; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
    const country = COUNTRIES[i % COUNTRIES.length];
    const language = LANGUAGES[i % LANGUAGES.length];
    const status = statuses[i % statuses.length];
    const booksOwned = Math.floor(Math.random() * 80) + 1;
    const purchases = Math.floor(Math.random() * 60) + 1;
    const amountSpent = Math.round((purchases * (Math.random() * 15 + 5)) * 100) / 100;
    const memberSince = new Date(2024, Math.floor(Math.random() * 30), Math.floor(Math.random() * 28) + 1).toISOString();
    const lastActive = new Date(2026, 5, Math.floor(Math.random() * 30) + 1).toISOString();
    const favCats = [CATEGORIES[i % CATEGORIES.length], CATEGORIES[(i + 3) % CATEGORIES.length]];
    const wishlist = [`Book ${i + 1}: The Journey`, `Book ${i + 2}: Discovery`];
    const recentPurchases = [
      { title: `The Wealth Blueprint ${i + 1}`, date: new Date(2026, 5, Math.floor(Math.random() * 28) + 1).toISOString(), price: Math.round((Math.random() * 20 + 5) * 100) / 100 },
      { title: `Atomic Habits ${i + 1}`, date: new Date(2026, 5, Math.floor(Math.random() * 28) + 1).toISOString(), price: Math.round((Math.random() * 20 + 5) * 100) / 100 },
    ];
    const readingProgress = [
      { title: `The Wealth Blueprint ${i + 1}`, progress: Math.floor(Math.random() * 100) },
      { title: `Atomic Habits ${i + 1}`, progress: Math.floor(Math.random() * 100) },
    ];
    const device = DEVICES[i % DEVICES.length];
    readers.push({
      id: `r-${i + 1}`, name, email, country, language, status, booksOwned, purchases, amountSpent,
      memberSince, lastActive, favoriteCategories: favCats, wishlistItems: wishlist,
      recentPurchases, readingProgress, supportRequests: Math.floor(Math.random() * 5), device,
    });
  }
  return readers;
}

const DEMO_READERS = generateReaders();

function generateActivities(): ActivityRecord[] {
  const types: ActivityRecord["type"][] = ["purchase", "review", "wishlist", "reading", "signup", "support"];
  const activities: ActivityRecord[] = [];
  for (let i = 0; i < 20; i++) {
    const reader = DEMO_READERS[i % DEMO_READERS.length];
    const type = types[i % types.length];
    let message = "";
    if (type === "purchase") message = `Purchased "${reader.recentPurchases[0]?.title || "New Book"}"`;
    else if (type === "review") message = `Submitted a review for "${reader.recentPurchases[0]?.title || "Book"}"`;
    else if (type === "wishlist") message = `Added "${reader.wishlistItems[0] || "Book"}" to Wishlist`;
    else if (type === "reading") message = `Completed "${reader.recentPurchases[1]?.title || "Book"}"`;
    else if (type === "signup") message = "Created a new account";
    else message = "Submitted a support request";
    activities.push({ id: `a-${i + 1}`, readerName: reader.name, type, message, time: `${Math.floor(Math.random() * 23) + 1}h ago` });
  }
  return activities;
}

const ACTIVITIES = generateActivities();

export default function AdminReadersPage() {
  const [readers] = useState<ReaderRecord[]>(DEMO_READERS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerReader, setDrawerReader] = useState<ReaderRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("overview");
  const [activeSummaryCard, setActiveSummaryCard] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReaderRecord | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activityExpanded, setActivityExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setSortFilterOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => { if (notification) { const t = setTimeout(() => setNotification(null), 3000); return () => clearTimeout(t); } }, [notification]);

  const showNotification = useCallback((type: "success" | "error", message: string) => setNotification({ type, message }), []);

  const stats = useMemo(() => ({
    total: readers.length,
    active: readers.filter((r) => r.status === "active").length,
    newThisMonth: readers.filter((r) => { const d = new Date(r.memberSince); return d.getMonth() === 5 && d.getFullYear() === 2026; }).length,
    totalPurchases: readers.reduce((s, r) => s + r.purchases, 0),
    totalBooks: readers.reduce((s, r) => s + r.booksOwned, 0),
    totalRevenue: readers.reduce((s, r) => s + r.amountSpent, 0),
    verified: readers.filter((r) => r.status === "verified").length,
    inactive: readers.filter((r) => r.status === "inactive").length,
    suspended: readers.filter((r) => r.status === "suspended").length,
    new: readers.filter((r) => r.status === "new").length,
    returning: readers.filter((r) => r.status === "returning").length,
  }), [readers]);

  const filteredReaders = useMemo(() => {
    let result = [...readers];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.country.toLowerCase().includes(q));
    }
    switch (activeTab) {
      case "active": result = result.filter((r) => r.status === "active"); break;
      case "inactive": result = result.filter((r) => r.status === "inactive"); break;
      case "verified": result = result.filter((r) => r.status === "verified"); break;
      case "suspended": result = result.filter((r) => r.status === "suspended"); break;
      case "new": result = result.filter((r) => r.status === "new"); break;
      case "returning": result = result.filter((r) => r.status === "returning"); break;
      case "top-buyers": result = result.filter((r) => r.amountSpent > 200).sort((a, b) => b.amountSpent - a.amountSpent); break;
      case "recently-joined": result = result.sort((a, b) => new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime()).slice(0, 20); break;
    }
    switch (sortOption) {
      case "name-az": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-za": result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "most-spent": result.sort((a, b) => b.amountSpent - a.amountSpent); break;
      case "least-spent": result.sort((a, b) => a.amountSpent - b.amountSpent); break;
      case "most-books": result.sort((a, b) => b.booksOwned - a.booksOwned); break;
      case "newest-member": result.sort((a, b) => new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime()); break;
      case "oldest-member": result.sort((a, b) => new Date(a.memberSince).getTime() - new Date(b.memberSince).getTime()); break;
      case "recently-active": result.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()); break;
    }
    return result;
  }, [readers, search, activeTab, sortOption]);

  const totalPages = Math.ceil(filteredReaders.length / pageSize);
  const displayedReaders = filteredReaders.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === displayedReaders.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(displayedReaders.map((r) => r.id)));
  }, [displayedReaders, selectedIds.size]);

  const openDrawer = useCallback((reader: ReaderRecord) => { setDrawerReader(reader); setDrawerOpen(true); setDrawerTab("overview"); }, []);

  const handleDelete = useCallback((reader: ReaderRecord) => { setDeleteTarget(reader); setDeleteConfirmOpen(true); }, []);

  const exportCSV = useCallback(() => {
    const headers = ["Name", "Email", "Country", "Status", "Books Owned", "Purchases", "Amount Spent", "Member Since"];
    const rows = filteredReaders.map((r) => [r.name, r.email, r.country, r.status, String(r.booksOwned), String(r.purchases), String(r.amountSpent), r.memberSince]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `readers-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
    showNotification("success", "Exported readers as CSV");
  }, [filteredReaders, showNotification]);

  const countryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    readers.forEach((r) => { counts[r.country] = (counts[r.country] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [readers]);

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    readers.forEach((r) => r.favoriteCategories.forEach((c) => { counts[c] = (counts[c] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [readers]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${notification.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1D]">Reader Management</h1>
          <p className="text-sm text-[#5C4A3D]">Manage readers, purchases, engagement and account activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white"><Plus className="h-4 w-4 mr-1" />Add Reader</Button>
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" onClick={exportCSV} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit"><Download className="h-4 w-4 mr-1" />Export</Button>
          </div>
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" onClick={() => showNotification("success", "Data refreshed")} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { id: "total", label: "TOTAL READERS", value: "24,580", icon: Users, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40", tab: "all" },
          { id: "active", label: "ACTIVE READERS", value: "18,930", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50", tab: "active" },
          { id: "new", label: "NEW THIS MONTH", value: "1,245", icon: Plus, color: "text-violet-600", bg: "bg-violet-50", tab: "new" },
          { id: "purchases", label: "TOTAL PURCHASES", value: "12,640", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50", tab: "all" },
          { id: "books", label: "BOOKS OWNED", value: "87,320", icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50", tab: "all" },
          { id: "revenue", label: "TOTAL REVENUE", value: "$248,965", icon: BarChart3, color: "text-rose-600", bg: "bg-rose-50", tab: "top-buyers" },
        ].map((stat) => {
          const isActive = activeSummaryCard === stat.id;
          return (
            <motion.div key={stat.id} variants={item} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Card onClick={() => { setActiveSummaryCard(isActive ? null : stat.id); setActiveTab(stat.tab); }} className={`shadow-sm transition-all duration-200 bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] ${isActive ? "ring-2 ring-[#D8B27A] shadow-md" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#111111] mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-[#111111]">{stat.value}</p>
                    </div>
                    <div className={`rounded-lg ${stat.bg} p-2 ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Reader Analytics Centre */}
      <motion.div variants={item}>
        <div className="analytics-dropdown-border">
          <Card className="shadow-sm bg-white">
            <button onClick={() => setAnalyticsOpen(!analyticsOpen)} className="w-full flex items-center justify-between p-4 hover:bg-[#F2D8BE]/10 transition-colors rounded-lg">
              <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#8A6A4A]" /><h3 className="text-sm font-semibold text-[#1D1D1D]">Reader Analytics Centre</h3></div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Reader Growth */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Reader Growth</h4>
                      <div className="relative h-32 pt-2">
                        <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                          <polyline points={MONTHLY_GROWTH.map((_, i) => `${(i / 5) * 300},${100 - ((MONTHLY_GROWTH[i].readers - 17000) / 8000) * 100}`).join(" ")} fill="none" stroke="#8A6A4A" strokeWidth="2" />
                          {MONTHLY_GROWTH.map((v, i) => <circle key={i} cx={(i / 5) * 300} cy={100 - ((v.readers - 17000) / 8000) * 100} r="3" fill="#8A6A4A" />)}
                        </svg>
                      </div>
                      <div className="flex justify-between text-[9px] text-[#5C4A3D] mt-1">{MONTHLY_GROWTH.map((v) => <span key={v.month}>{v.month}</span>)}</div>
                      <p className="text-center text-xs font-bold text-[#111111] mt-2">+35.1% Growth</p>
                    </div>

                    {/* Active Readers */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Active Readers</h4>
                      <div className="space-y-3">
                        <div><div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Active This Month</span><span className="font-bold text-[#111111]">18,930</span></div><div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "77%" }} /></div></div>
                        <div><div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">New Readers</span><span className="font-bold text-[#111111]">1,245</span></div><div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-violet-500 rounded-full" style={{ width: "51%" }} /></div></div>
                        <div><div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Returning Readers</span><span className="font-bold text-[#111111]">3,420</span></div><div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-amber-500 rounded-full" style={{ width: "60%" }} /></div></div>
                      </div>
                    </div>

                    {/* Monthly Purchases */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Monthly Purchases</h4>
                      <div className="space-y-2">
                        {[{ m: "Jun", v: 2140 }, { m: "May", v: 1980 }, { m: "Apr", v: 1820 }, { m: "Mar", v: 1650 }, { m: "Feb", v: 1520 }].map((d) => (
                          <div key={d.m} className="flex items-center gap-2"><span className="text-[11px] text-[#5C4A3D] w-8">{d.m}</span><div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-blue-500 rounded" style={{ width: `${(d.v / 2500) * 100}%` }} /></div><span className="text-[10px] font-medium text-[#111111] w-10 text-right">{d.v}</span></div>
                        ))}
                      </div>
                    </div>

                    {/* Reading Activity */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Reading Activity</h4>
                      <div className="space-y-3">
                        <div><div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Avg. Books per Reader</span><span className="font-bold text-[#111111]">3.56</span></div><div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-[#8A6A4A] rounded-full" style={{ width: "65%" }} /></div></div>
                        <div><div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Completion Rate</span><span className="font-bold text-[#111111]">68%</span></div><div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "68%" }} /></div></div>
                        <div><div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Review Rate</span><span className="font-bold text-[#111111]">24%</span></div><div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-rose-500 rounded-full" style={{ width: "24%" }} /></div></div>
                      </div>
                    </div>

                    {/* Revenue Trend */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Revenue Trend</h4>
                      <div className="space-y-2">
                        {[{ m: "Jun", v: 48965 }, { m: "May", v: 42300 }, { m: "Apr", v: 38700 }, { m: "Mar", v: 35200 }, { m: "Feb", v: 31800 }].map((d) => (
                          <div key={d.m} className="flex items-center gap-2"><span className="text-[11px] text-[#5C4A3D] w-8">{d.m}</span><div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-rose-500 rounded" style={{ width: `${(d.v / 50000) * 100}%` }} /></div><span className="text-[10px] font-medium text-[#111111] w-14 text-right">${d.v.toLocaleString()}</span></div>
                        ))}
                      </div>
                    </div>

                    {/* Top Countries */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />Top Countries</h4>
                      <div className="space-y-2">
                        {countryStats.map(([country, count]) => (
                          <div key={country} className="flex items-center gap-2">
                            <span className="text-[11px] text-[#5C4A3D] w-24 truncate">{country}</span>
                            <div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-[#8A6A4A] rounded" style={{ width: `${(count / readers.length) * 100}%` }} /></div>
                            <span className="text-[10px] font-medium text-[#111111] w-8 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Device Usage */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5" />Device Usage</h4>
                      <div className="space-y-2">
                        {[{ d: "Mobile", icon: Smartphone, count: readers.filter((r) => r.device === "Mobile").length, color: "#8A6A4A" }, { d: "Desktop", icon: Laptop, count: readers.filter((r) => r.device === "Desktop").length, color: "#D8B27A" }, { d: "Tablet", icon: Tablet, count: readers.filter((r) => r.device === "Tablet").length, color: "#EBC9A8" }].map((dev) => (
                          <div key={dev.d} className="flex items-center gap-2">
                            <dev.icon className="h-3.5 w-3.5 text-[#5C4A3D]" />
                            <span className="text-[11px] text-[#5C4A3D] w-16">{dev.d}</span>
                            <div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]"><div className="h-full rounded" style={{ width: `${(dev.count / readers.length) * 100}%`, backgroundColor: dev.color }} /></div>
                            <span className="text-[10px] font-medium text-[#111111] w-8 text-right">{dev.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Formats */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Preferred Formats</h4>
                      <div className="space-y-2">
                        {[{ f: "eBook", pct: 62 }, { f: "Audiobook", pct: 28 }, { f: "Paperback", pct: 10 }].map((fmt) => (
                          <div key={fmt.f} className="flex items-center gap-2"><span className="text-[11px] text-[#5C4A3D] w-20">{fmt.f}</span><div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-[#8A6A4A] rounded" style={{ width: `${fmt.pct}%` }} /></div><span className="text-[10px] font-medium text-[#111111] w-8 text-right">{fmt.pct}%</span></div>
                        ))}
                      </div>
                    </div>

                    {/* Top Genres */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />Top Genres</h4>
                      <div className="space-y-2">
                        {categoryStats.slice(0, 6).map(([cat, count]) => (
                          <div key={cat} className="flex items-center gap-2"><span className="text-[11px] text-[#5C4A3D] w-24 truncate">{cat}</span><div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-[#D8B27A] rounded" style={{ width: `${(count / readers.length) * 100}%` }} /></div><span className="text-[10px] font-medium text-[#111111] w-8 text-right">{count}</span></div>
                        ))}
                      </div>
                    </div>

                    {/* Returning Readers */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Returning Readers</h4>
                      <div className="space-y-3">
                        <div><div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Retention Rate</span><span className="font-bold text-[#111111]">78%</span></div><div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "78%" }} /></div></div>
                        <div><div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Repeat Buyers</span><span className="font-bold text-[#111111]">45%</span></div><div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-blue-500 rounded-full" style={{ width: "45%" }} /></div></div>
                        <div><div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Avg. Sessions/Week</span><span className="font-bold text-[#111111]">4.2</span></div><div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-amber-500 rounded-full" style={{ width: "56%" }} /></div></div>
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
      <motion.div variants={item} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-md search-bar-border">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input placeholder="Search readers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9" />
          </div>
          <div className="flex items-center gap-2" ref={dropdownRef}>
            <div className="relative">
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button variant="outline" size="sm" onClick={() => setSortFilterOpen(!sortFilterOpen)} className={cn("h-9 px-3 border-0 bg-white text-sm font-medium gap-2", sortOption !== "default" ? "text-[#D8B27A]" : "text-[#8A6A4A] hover:bg-[#F2D8BE]")}>
                  <SlidersHorizontal className="h-4 w-4" /><span className="hidden sm:inline">Sort</span><ChevronRight className={cn("h-3.5 w-3.5 transition-transform", sortFilterOpen && "rotate-90")} />
                </Button>
              </div>
              <AnimatePresence>
                {sortFilterOpen && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 w-[260px] bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#E8DDD0] bg-[#F5EDE3]/30 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#8A6A4A]" />Sort By</h4>
                      {sortOption !== "default" && <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={() => setSortOption("default")}><X className="h-3 w-3 mr-1" />Clear</Button>}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      {SORT_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => { setSortOption(opt.value); setSortFilterOpen(false); setPage(1); }} className={cn("w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors", sortOption === opt.value ? "bg-[#D8B27A]/20 text-[#111111] font-medium" : "text-[#5C4A3D] hover:bg-[#F5EDE3]")}>
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
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(parseInt(v)); setPage(1); }}>
              <SelectTrigger className="w-[70px] h-9 border-[#8A6A4A]/20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="refresh-btn-border rounded-lg p-[2px]">
            <Button variant="outline" size="sm" onClick={exportCSV} className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
              <Download className="h-4 w-4" /><span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setActiveSummaryCard(null); setPage(1); }}>
          <TabsList className="bg-[#F5EDE3] h-auto flex-wrap gap-1 p-1">
            {[
              { value: "all", label: "All Readers", count: "24,580", activeColor: "#8A6A4A" },
              { value: "active", label: "Active", count: "18,930", activeColor: "#22C55E" },
              { value: "inactive", label: "Inactive", count: "2,840", activeColor: "#6B7280" },
              { value: "verified", label: "Verified", count: "15,200", activeColor: "#3B82F6" },
              { value: "suspended", label: "Suspended", count: "42", activeColor: "#EF4444" },
              { value: "new", label: "New", count: "1,245", activeColor: "#8B5CF6" },
              { value: "returning", label: "Returning", count: "3,420", activeColor: "#F59E0B" },
              { value: "top-buyers", label: "Top Buyers", count: null, activeColor: "#EC4899" },
              { value: "recently-joined", label: "Recently Joined", count: null, activeColor: "#06B6D4" },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} style={activeTab === tab.value ? { backgroundColor: tab.activeColor, color: "white" } : undefined} className={cn("text-xs sm:text-sm", activeTab !== tab.value && "data-[state=active]:bg-[#8A6A4A] data-[state=active]:text-white")}>
                {tab.label}{tab.count && <Badge variant="secondary" className="ml-1 h-4 px-1 text-[9px] bg-white/20">{tab.count}</Badge>}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="flex items-center justify-between rounded-lg border border-[#D8B27A]/30 bg-[#F2D8BE]/20 px-4 py-2.5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#111111]">{selectedIds.size} reader{selectedIds.size !== 1 ? "s" : ""} selected</span>
                <div className="h-4 w-px bg-[#E8DDD0]" />
                <button onClick={toggleSelectAll} className="text-[11px] text-[#8A6A4A] hover:underline font-medium">Select All ({displayedReaders.length})</button>
                <button onClick={() => setSelectedIds(new Set())} className="text-[11px] text-[#5C4A3D] hover:underline">Deselect</button>
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => showNotification("success", `Emailed ${selectedIds.size} readers`)}><Mail className="h-3 w-3 mr-1" />Email</Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={exportCSV}><Download className="h-3 w-3 mr-1" />Export</Button>
                <div className="h-4 w-px bg-[#E8DDD0]" />
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => showNotification("success", `${selectedIds.size} readers deleted`)}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                <Button size="sm" variant="ghost" className="h-7 text-[11px] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => setSelectedIds(new Set())}><X className="h-3 w-3 mr-1" />Clear</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Counter — Above Table */}
      <motion.div variants={item} className="flex items-center justify-between">
        <p className="text-sm text-[#5C4A3D]">
          Showing <span className="font-medium text-[#111111]">{filteredReaders.length === 0 ? 0 : (page - 1) * pageSize + 1}</span> – <span className="font-medium text-[#111111]">{Math.min(page * pageSize, filteredReaders.length)}</span> of <span className="font-medium text-[#111111]">24,580</span> Readers
        </p>
        <div className="flex items-center gap-3 text-xs text-[#5C4A3D]">
          <span>Active <span className="font-medium text-emerald-600">18,930</span></span>
          <span>New <span className="font-medium text-violet-600">1,245</span></span>
          <span>Suspended <span className="font-medium text-rose-600">42</span></span>
        </div>
      </motion.div>

      {/* Main Table */}
      <motion.div variants={item}>
        <div className="bg-white rounded-lg border border-[#E8DDD0] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E8DDD0] bg-[#F5EDE3]/20">
                <TableHead className="w-10"><button onClick={toggleSelectAll} className="flex items-center justify-center">{selectedIds.size === displayedReaders.length && displayedReaders.length > 0 ? "☑" : "☐"}</button></TableHead>
                <TableHead className="text-[#111111] font-semibold">Reader</TableHead>
                <TableHead className="text-[#111111] font-semibold hidden md:table-cell">Country</TableHead>
                <TableHead className="text-[#111111] font-semibold hidden lg:table-cell">Books Owned</TableHead>
                <TableHead className="text-[#111111] font-semibold hidden lg:table-cell">Purchases</TableHead>
                <TableHead className="text-[#111111] font-semibold hidden xl:table-cell">Amount Spent</TableHead>
                <TableHead className="text-[#111111] font-semibold hidden md:table-cell">Status</TableHead>
                <TableHead className="text-[#111111] font-semibold hidden xl:table-cell">Member Since</TableHead>
                <TableHead className="text-[#111111] font-semibold hidden xl:table-cell">Last Active</TableHead>
                <TableHead className="text-[#111111] font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedReaders.map((reader) => (
                <TableRow key={reader.id} className="border-b border-[#E8DDD0]/60 hover:bg-[#F5EDE3]/20 transition-colors cursor-pointer" onClick={() => openDrawer(reader)}>
                  <TableCell onClick={(e) => e.stopPropagation()} className="py-2"><button onClick={() => setSelectedIds((prev) => { const n = new Set(prev); if (n.has(reader.id)) n.delete(reader.id); else n.add(reader.id); return n; })} className="flex items-center justify-center">{selectedIds.has(reader.id) ? "☑" : "☐"}</button></TableCell>
                  <TableCell className="py-2"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#8A6A4A] to-[#D8B27A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{reader.name.split(" ").map((n) => n[0]).join("")}</div><div className="min-w-0"><p className="font-medium text-[#111111] text-sm truncate">{reader.name}</p><p className="text-[11px] text-[#5C4A3D] truncate">{reader.email}</p><Badge variant="secondary" className={`${STATUS_CONFIG[reader.status].bgColor} text-[9px] border mt-0.5`}>{STATUS_CONFIG[reader.status].label}</Badge></div></div></TableCell>
                  <TableCell className="hidden md:table-cell py-2 text-sm text-[#5C4A3D]">{reader.country}</TableCell>
                  <TableCell className="hidden lg:table-cell py-2 text-sm text-[#111111] font-medium">{reader.booksOwned}</TableCell>
                  <TableCell className="hidden lg:table-cell py-2 text-sm text-[#111111]">{reader.purchases}</TableCell>
                  <TableCell className="hidden xl:table-cell py-2 text-sm text-[#111111] font-medium">${reader.amountSpent.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell py-2"><Badge variant="secondary" className={`${STATUS_CONFIG[reader.status].bgColor} text-[10px] border`}>{STATUS_CONFIG[reader.status].label}</Badge></TableCell>
                  <TableCell className="hidden xl:table-cell py-2 text-sm text-[#5C4A3D]">{formatDate(reader.memberSince)}</TableCell>
                  <TableCell className="hidden xl:table-cell py-2 text-sm text-[#5C4A3D]">{formatDate(reader.lastActive)}</TableCell>
                  <TableCell className="text-right py-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-0.5">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => openDrawer(reader)} title="View Profile"><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50" onClick={() => openDrawer(reader)} title="View Library"><Library className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50" onClick={() => showNotification("success", `Email sent to ${reader.name}`)} title="Send Email"><Send className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(reader)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {displayedReaders.length === 0 && (
                <TableRow><TableCell colSpan={10} className="text-center py-16"><Users className="mx-auto h-10 w-10 text-[#D8B27A]/50 mb-3" /><p className="text-sm font-medium text-[#111111]">No readers found</p><p className="text-xs text-[#5C4A3D] mt-1">Try adjusting your search or filters.</p><Button size="sm" className="mt-4 bg-[#8A6A4A] hover:bg-[#6A4E37] text-white"><Plus className="h-4 w-4 mr-1" />Add Reader</Button></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Pagination — Below Table */}
      <motion.div variants={item} className="flex items-center justify-between">
        <p className="text-sm text-[#5C4A3D]">
          Showing <span className="font-medium text-[#111111]">{filteredReaders.length === 0 ? 0 : (page - 1) * pageSize + 1}</span> – <span className="font-medium text-[#111111]">{Math.min(page * pageSize, filteredReaders.length)}</span> of <span className="font-medium text-[#111111]">24,580</span> Readers
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]"><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
          <span className="text-sm font-medium text-[#111111] px-2">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]">Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="flex items-center gap-2 flex-wrap">
        <Button size="sm" className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white"><Plus className="h-4 w-4 mr-1" />Add Reader</Button>
        <div className="refresh-btn-border rounded-lg p-[2px]"><Button variant="outline" size="sm" onClick={exportCSV} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE]"><Download className="h-4 w-4 mr-1" />Export</Button></div>
        <div className="refresh-btn-border rounded-lg p-[2px]"><Button variant="outline" size="sm" onClick={() => showNotification("success", "Announcement sent")} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE]"><Send className="h-4 w-4 mr-1" />Send Announcement</Button></div>
        {selectedIds.size > 0 && <div className="refresh-btn-border rounded-lg p-[2px]"><Button variant="outline" size="sm" onClick={() => showNotification("success", `Emailed ${selectedIds.size} readers`)} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE]"><Mail className="h-4 w-4 mr-1" />Email Selected ({selectedIds.size})</Button></div>}
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <div className="bg-white rounded-lg border border-[#E8DDD0] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2"><Activity className="h-4 w-4 text-[#8A6A4A]" />Recent Activity</h3>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#8A6A4A]" onClick={() => setActivityExpanded(!activityExpanded)}><Zap className="h-3 w-3 mr-1" />{activityExpanded ? "Show Less" : "View All"}</Button>
          </div>
          <div className="space-y-2.5">
            {ACTIVITIES.slice(0, activityExpanded ? ACTIVITIES.length : 3).map((act) => (
              <div key={act.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#F5EDE3]/30 transition-colors">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", act.type === "purchase" ? "bg-emerald-50 text-emerald-600" : act.type === "review" ? "bg-blue-50 text-blue-600" : act.type === "wishlist" ? "bg-rose-50 text-rose-600" : act.type === "reading" ? "bg-amber-50 text-amber-600" : act.type === "signup" ? "bg-violet-50 text-violet-600" : "bg-slate-50 text-slate-600")}>
                  {act.type === "purchase" ? <ShoppingCart className="h-4 w-4" /> : act.type === "review" ? <MessageSquare className="h-4 w-4" /> : act.type === "wishlist" ? <Heart className="h-4 w-4" /> : act.type === "reading" ? <BookOpen className="h-4 w-4" /> : act.type === "signup" ? <Plus className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#111111]"><span className="font-medium">{act.readerName}</span> {act.message}</p>
                  <p className="text-[10px] text-[#8A6A4A] mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* View Reader Panel — Slide-over with Reader 360 Profile */}
      <AnimatePresence>
        {drawerOpen && drawerReader && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawerOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-[#E8DDD0]">
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#111111]">Reader 360 Profile</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
                </div>

                {/* Profile Header */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#8A6A4A]/10 via-[#D8B27A]/10 to-[#EBC9A8]/10">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#8A6A4A] to-[#D8B27A] flex items-center justify-center text-white text-lg font-bold">{drawerReader.name.split(" ").map((n) => n[0]).join("")}</div>
                  <div>
                    <h3 className="text-base font-bold text-[#111111]">{drawerReader.name}</h3>
                    <p className="text-xs text-[#5C4A3D]">{drawerReader.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={`${STATUS_CONFIG[drawerReader.status].bgColor} text-[9px] border`}>{STATUS_CONFIG[drawerReader.status].label}</Badge>
                      <span className="text-[10px] text-[#5C4A3D]">{drawerReader.country}</span>
                      <span className="text-[10px] text-[#5C4A3D]">· {drawerReader.language}</span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {["overview", "library", "orders", "wishlist", "reviews", "support", "activity"].map((tab) => (
                    <button key={tab} onClick={() => setDrawerTab(tab)} className={cn("shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all capitalize", drawerTab === tab ? "bg-[#8A6A4A] text-white border-[#8A6A4A]" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]")}>
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {drawerTab === "overview" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Member Since", value: formatDate(drawerReader.memberSince), icon: Clock, color: "text-[#8A6A4A]" },
                        { label: "Books Owned", value: String(drawerReader.booksOwned), icon: BookOpen, color: "text-blue-600" },
                        { label: "Purchases", value: String(drawerReader.purchases), icon: ShoppingCart, color: "text-emerald-600" },
                        { label: "Amount Spent", value: `$${drawerReader.amountSpent.toFixed(2)}`, icon: BarChart3, color: "text-rose-600" },
                      ].map((f) => (
                        <div key={f.label} className="rounded-lg border border-[#E8DDD0] p-3">
                          <div className="flex items-center gap-1.5 mb-1"><f.icon className={`h-3 w-3 ${f.color}`} /><span className="text-[10px] text-[#5C4A3D] uppercase tracking-wider">{f.label}</span></div>
                          <p className="text-sm font-bold text-[#111111]">{f.value}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#111111] mb-2">Favourite Categories</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {drawerReader.favoriteCategories.map((cat) => <Badge key={cat} variant="secondary" className="bg-[#F2D8BE]/60 text-[#8A6A4A] border border-[#E8DDD0] text-[10px]">{cat}</Badge>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#111111] mb-2">Device</h4>
                      <p className="text-sm text-[#5C4A3D]">{drawerReader.device}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#111111] mb-2">Support Requests</h4>
                      <p className="text-sm text-[#5C4A3D]">{drawerReader.supportRequests} requests</p>
                    </div>
                  </div>
                )}

                {drawerTab === "library" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-[#111111]">Reading Progress</h4>
                    {drawerReader.readingProgress.map((rp) => (
                      <div key={rp.title} className="rounded-lg border border-[#E8DDD0] p-3">
                        <p className="text-sm font-medium text-[#111111] mb-1">{rp.title}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-[#F5EDE3] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A] rounded-full" style={{ width: `${rp.progress}%` }} /></div>
                          <span className="text-[10px] font-medium text-[#111111]">{rp.progress}%</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-[#5C4A3D]">Total books owned: {drawerReader.booksOwned}</p>
                  </div>
                )}

                {drawerTab === "orders" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-[#111111]">Recent Purchases</h4>
                    {drawerReader.recentPurchases.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[#E8DDD0]">
                        <div className="h-10 w-10 rounded-lg bg-[#F2D8BE]/40 flex items-center justify-center"><ShoppingCart className="h-4 w-4 text-[#8A6A4A]" /></div>
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#111111] truncate">{p.title}</p><p className="text-[10px] text-[#5C4A3D]">{formatDate(p.date)}</p></div>
                        <span className="text-sm font-bold text-[#111111]">${p.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {drawerTab === "wishlist" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-[#111111]">Wishlist Items</h4>
                    {drawerReader.wishlistItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[#E8DDD0]">
                        <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center"><Heart className="h-4 w-4 text-rose-500" /></div>
                        <p className="text-sm font-medium text-[#111111]">{item}</p>
                      </div>
                    ))}
                  </div>
                )}

                {drawerTab === "reviews" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-[#111111]">Reviews</h4>
                    <div className="rounded-lg border border-[#E8DDD0] p-4 text-center">
                      <MessageSquare className="mx-auto h-8 w-8 text-[#D8B27A]/50 mb-2" />
                      <p className="text-sm text-[#5C4A3D]">{Math.floor(Math.random() * 10)} reviews submitted</p>
                    </div>
                  </div>
                )}

                {drawerTab === "support" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-[#111111]">Support Requests</h4>
                    <div className="rounded-lg border border-[#E8DDD0] p-4 text-center">
                      <FileText className="mx-auto h-8 w-8 text-[#D8B27A]/50 mb-2" />
                      <p className="text-sm text-[#5C4A3D]">{drawerReader.supportRequests} support requests</p>
                    </div>
                  </div>
                )}

                {drawerTab === "activity" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-[#111111]">Recent Activity Timeline</h4>
                    <div className="space-y-3">
                      {[
                        { msg: `Purchased "${drawerReader.recentPurchases[0]?.title || "Book"}"`, time: "2 days ago", color: "bg-emerald-50 text-emerald-600" },
                        { msg: `Added "${drawerReader.wishlistItems[0] || "Book"}" to Wishlist`, time: "5 days ago", color: "bg-rose-50 text-rose-600" },
                        { msg: `Completed "${drawerReader.recentPurchases[1]?.title || "Book"}"`, time: "1 week ago", color: "bg-amber-50 text-amber-600" },
                        { msg: "Submitted a review", time: "2 weeks ago", color: "bg-blue-50 text-blue-600" },
                        { msg: "Account created", time: formatDate(drawerReader.memberSince), color: "bg-violet-50 text-violet-600" },
                      ].map((act, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", act.color)}><Activity className="h-4 w-4" /></div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-[#111111]">{act.msg}</p>
                            <p className="text-[10px] text-[#8A6A4A] mt-0.5">{act.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t border-[#E8DDD0]">
                  <Button size="sm" className="w-full bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => showNotification("success", `Email sent to ${drawerReader.name}`)}><Mail className="h-4 w-4 mr-1" />Send Email</Button>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", `${drawerReader.name} suspended`); setDrawerOpen(false); }}><Ban className="h-4 w-4 mr-1" />Suspend</Button>
                    <Button size="sm" variant="outline" className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50" onClick={() => { showNotification("success", `${drawerReader.name} activated`); setDrawerOpen(false); }}><CheckCircle2 className="h-4 w-4 mr-1" />Activate</Button>
                    <Button size="sm" variant="outline" className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => { setDrawerOpen(false); handleDelete(drawerReader); }}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmOpen && deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirmOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-[#111111] mb-2">Delete Reader</h3>
              <p className="text-sm text-[#5C4A3D] mb-4">Are you sure you want to delete <span className="font-medium text-[#111111]">{deleteTarget.name}</span>? This action cannot be undone.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setDeleteConfirmOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white" onClick={() => { setDeleteConfirmOpen(false); showNotification("success", `${deleteTarget.name} deleted`); }}>Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
