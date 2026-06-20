"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SyncedTableScroll, type SyncedTableScrollHandle } from "@/components/ui/synced-table-scroll";
import {
  Search, DollarSign, Clock, Wallet, TrendingUp, Users, Award, BarChart3,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, RefreshCw, Eye,
  Check, Download, Zap, SlidersHorizontal, FileText, Calculator, X,
  ShieldCheck, ArrowUpRight, Banknote, Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatCurrency, cn } from "@/lib/utils";

interface RoyaltyAuthor {
  name: string;
  email: string;
  booksPublished: number;
  unitsSold: number;
  grossRevenue: number;
  platformShare: number;
  authorRoyalty: number;
  pending: number;
  paid: number;
  lastPayment: string;
  status: string;
  paymentMethod: string;
}

interface RoyaltyTransaction {
  id: string;
  authorName: string;
  authorEmail: string;
  bookTitle: string;
  unitsSold: number;
  grossRevenue: number;
  royaltyRate: number;
  netRoyalty: number;
  period: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface ActivityEntry {
  id: string;
  action: string;
  time: string;
  type: string;
}

const TOP_AUTHORS: RoyaltyAuthor[] = [
  { name: "Sarah Mitchell", email: "sarah.mitchell@email.com", booksPublished: 4, unitsSold: 1820, grossRevenue: 18200, platformShare: 5460, authorRoyalty: 12740, pending: 1840, paid: 10900, lastPayment: "2026-05-28", status: "Paid", paymentMethod: "Bank Transfer" },
  { name: "James Cooper", email: "james.cooper@email.com", booksPublished: 3, unitsSold: 1450, grossRevenue: 14500, platformShare: 4350, authorRoyalty: 10150, pending: 2180, paid: 7970, lastPayment: "2026-05-25", status: "Paid", paymentMethod: "PayPal" },
  { name: "Emily Watson", email: "emily.watson@email.com", booksPublished: 3, unitsSold: 1280, grossRevenue: 12800, platformShare: 3840, authorRoyalty: 8960, pending: 1260, paid: 7700, lastPayment: "2026-05-20", status: "Paid", paymentMethod: "Bank Transfer" },
  { name: "Michael Brown", email: "michael.brown@email.com", booksPublished: 2, unitsSold: 980, grossRevenue: 9800, platformShare: 2940, authorRoyalty: 6860, pending: 980, paid: 5880, lastPayment: "2026-05-15", status: "Paid", paymentMethod: "Paystack" },
  { name: "Lisa Park", email: "lisa.park@email.com", booksPublished: 2, unitsSold: 860, grossRevenue: 8600, platformShare: 2580, authorRoyalty: 6020, pending: 720, paid: 5300, lastPayment: "2026-05-10", status: "Paid", paymentMethod: "Bank Transfer" },
  { name: "David Johnson", email: "david.johnson@email.com", booksPublished: 2, unitsSold: 720, grossRevenue: 7200, platformShare: 2160, authorRoyalty: 5040, pending: 1440, paid: 3600, lastPayment: "2026-04-30", status: "Pending", paymentMethod: "Wise" },
  { name: "Grace Okafor", email: "grace.okafor@email.com", booksPublished: 2, unitsSold: 640, grossRevenue: 6400, platformShare: 1920, authorRoyalty: 4480, pending: 960, paid: 3520, lastPayment: "2026-04-28", status: "Pending", paymentMethod: "Bank Transfer" },
  { name: "Fatima Abubakar", email: "fatima.abubakar@email.com", booksPublished: 2, unitsSold: 580, grossRevenue: 5800, platformShare: 1740, authorRoyalty: 4060, pending: 580, paid: 3480, lastPayment: "2026-04-20", status: "Paid", paymentMethod: "Paystack" },
  { name: "Chinwe Eze", email: "chinwe.eze@email.com", booksPublished: 1, unitsSold: 420, grossRevenue: 4200, platformShare: 1260, authorRoyalty: 2940, pending: 840, paid: 2100, lastPayment: "2026-04-15", status: "Processing", paymentMethod: "Bank Transfer" },
  { name: "Emeka Nwosu", email: "emeka.nwosu@email.com", booksPublished: 1, unitsSold: 380, grossRevenue: 3800, platformShare: 1140, authorRoyalty: 2660, pending: 380, paid: 2280, lastPayment: "2026-04-10", status: "Paid", paymentMethod: "PayPal" },
];

const EXTRA_AUTHORS: string[] = [
  "Adebayo Ogundimu", "Olivia Carter", "Benjamin Osei", "Ngozi Adichie", "Tunde Bakare",
  "Amina Yusuf", "Chidi Okoro", "Funke Adeyemi", "Kemi Adekunle", "Yusuf Aliyu",
  "Chiamaka Obi", "Ibrahim Musa", "Aisha Bello", "Emmanuel Chukwu", "Zainab Mohammed",
  "Oluwaseun Akinola", "Nneka Ekwueme", "Ifeanyi Nwankwo", "Halima Bello", "Tolu Adegoke",
  "Chioma Nwosu", "Abubakar Danjuma", "Blessing Okoro", "Damilola Oyewole", "Folake Williams",
  "Gideon Okafor", "Hauwa Ibrahim", "Ifeoluwa Adesanya", "Joy Amadi", "Kelechi Uche",
  "Lara Fashola", "Musa Abdullahi", "Nneka Obiora", "Olayinka Balogun", "Priscilla Ojo",
  "Rasheed Lawal", "Samuel Etim", "Titilayo Ogundipe", "Ucheoma Nnamdi", "Victoria Nkem",
  "Wale Adeniyi", "Xavier Ogbuefe", "Yetunde Salami", "Zubairu Hamza", "Adaeze Chukwu",
  "Babatunde Olatunji", "Cynthia Obi", "Daniel Essien", "Esther Oluwatosin", "Femi Akinwale",
  "Grace Onwueme", "Henry Nkpa", "Ifeanyichukwu Okolo", "Janet Adekoya", "Kunle Ajayi",
  "Lilian Ogbonna", "Mohammed Suleiman", "Ngozika Okoye", "Obinna Achusi", "Patience Eze",
  "Quadri Olanrewaju", "Rita Iheanacho", "Sunday Agbaje", "Theresa Bassey", "Udoette Moses",
  "Vivian Nweze", "Wunmi Adebayo", "Xenapa Obioma", "Yakubu Aliyu", "Zara Abdallah",
  "Akinyemi Oluwole", "Bimpe Coker", "Chinedu Eze", "Doris Amos", "Emeka Okechukwu",
  "Fatimah Balarabe", "George Omoniyi", "Hilda Njoku", "Ismail Abdulrahman", "Juliet Chima",
];

const BOOKS = [
  "Income Is A Skill", "Money Is A Behaviour", "Wealth Is A Decision",
  "Financial Clarity", "Master Your Spending", "The Time Keeper",
  "Shadows and Light", "Financial Freedom Blueprint", "The Rich Mindset",
  "Money Lessons",
];

const PAYMENT_METHODS = ["Bank Transfer", "PayPal", "Paystack", "Wise"];

const MONTHLY_DATA = [
  { month: "Jan", amount: 3200 }, { month: "Feb", amount: 4100 },
  { month: "Mar", amount: 5600 }, { month: "Apr", amount: 4800 },
  { month: "May", amount: 5180 }, { month: "Jun", amount: 4580 },
];

const AUTHOR_EARNINGS = [
  { name: "Sarah Mitchell", earned: 12740 }, { name: "James Cooper", earned: 10150 },
  { name: "Emily Watson", earned: 8960 }, { name: "Michael Brown", earned: 6860 },
  { name: "Lisa Park", earned: 6020 }, { name: "David Johnson", earned: 5040 },
  { name: "Grace Okafor", earned: 4480 }, { name: "Fatima Abubakar", earned: 4060 },
];

const REVENUE_SOURCES = [
  { label: "Direct Sales", value: 68, color: "bg-[#8A6A4A]" },
  { label: "Amazon", value: 52, color: "bg-[#D8B27A]" },
  { label: "Kobo", value: 34, color: "bg-amber-600" },
  { label: "Google Play", value: 24, color: "bg-blue-500" },
  { label: "Apple Books", value: 18, color: "bg-emerald-500" },
];

const TOP_BOOKS = [
  { rank: 1, title: "Income Is A Skill", author: "Sarah Mitchell", sales: 680, revenue: 6800, royalties: 4760 },
  { rank: 2, title: "Money Is A Behaviour", author: "James Cooper", sales: 540, revenue: 5400, royalties: 3780 },
  { rank: 3, title: "Wealth Is A Decision", author: "Emily Watson", sales: 480, revenue: 4800, royalties: 3360 },
  { rank: 4, title: "Financial Clarity", author: "Michael Brown", sales: 420, revenue: 4200, royalties: 2940 },
  { rank: 5, title: "Master Your Spending", author: "Lisa Park", sales: 380, revenue: 3800, royalties: 2660 },
];

const CATEGORIES = [
  { key: "all", label: "All Royalties", activeColor: "bg-gray-600" },
  { key: "pending", label: "Pending", activeColor: "bg-amber-500" },
  { key: "paid", label: "Paid", activeColor: "bg-emerald-500" },
  { key: "overdue", label: "Overdue", activeColor: "bg-red-500" },
  { key: "processing", label: "Processing", activeColor: "bg-blue-500" },
  { key: "high-earners", label: "High Earners", activeColor: "bg-purple-500" },
];

const SORT_OPTIONS = [
  { value: "highest-royalty", label: "Highest Royalty" },
  { value: "lowest-royalty", label: "Lowest Royalty" },
  { value: "most-recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "author-az", label: "Author A–Z" },
  { value: "author-za", label: "Author Z–A" },
];

const SUMMARY_CARDS = [
  { key: "total", label: "TOTAL ROYALTIES", value: "$48,760", icon: DollarSign, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40" },
  { key: "pending", label: "PENDING", value: "$7,420", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  { key: "paid", label: "PAID", value: "$41,340", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-50" },
  { key: "authors", label: "AUTHORS EARNING", value: "86", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { key: "this-month", label: "THIS MONTH", value: "$5,180", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
  { key: "top-author", label: "TOP AUTHOR", value: "S. Mitchell", icon: Award, color: "text-orange-500", bg: "bg-orange-50" },
];

const activityLog: ActivityEntry[] = [
  { id: "a1", action: "Paid $320 royalty to Sarah Mitchell", time: "2 hours ago", type: "payment" },
  { id: "a2", action: "Generated payout batch #2026-05", time: "4 hours ago", type: "batch" },
  { id: "a3", action: "Processed $480 royalty for James Cooper", time: "6 hours ago", type: "processing" },
  { id: "a4", action: "Emily Watson requested royalty withdrawal", time: "8 hours ago", type: "request" },
  { id: "a5", action: "Paid $275 royalty to Michael Brown", time: "Yesterday", type: "payment" },
  { id: "a6", action: "Exported monthly royalty report", time: "Yesterday", type: "export" },
  { id: "a7", action: "Lisa Park payment of $190 confirmed", time: "2 days ago", type: "payment" },
  { id: "a8", action: "David Johnson payout overdue alert", time: "2 days ago", type: "alert" },
  { id: "a9", action: "Grace Okafor payment processing", time: "3 days ago", type: "processing" },
  { id: "a10", action: "Fatima Abubakar royalty credited $420", time: "3 days ago", type: "payment" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

function generateTransactions(): RoyaltyTransaction[] {
  const allAuthors = TOP_AUTHORS.map((a) => ({ name: a.name, email: a.email }));
  EXTRA_AUTHORS.forEach((name) => allAuthors.push({ name, email: `${name.toLowerCase().replace(/ /g, ".")}@email.com` }));

  const statusPool: string[] = [];
  for (let i = 0; i < 50; i++) statusPool.push("Paid");
  for (let i = 0; i < 25; i++) statusPool.push("Pending");
  for (let i = 0; i < 10; i++) statusPool.push("Overdue");
  for (let i = 0; i < 20; i++) statusPool.push("Processing");
  for (let i = 0; i < 15; i++) statusPool.push("Paid");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const txns: RoyaltyTransaction[] = [];
  for (let i = 0; i < 120; i++) {
    const author = allAuthors[i % allAuthors.length];
    const book = BOOKS[i % BOOKS.length];
    const status = statusPool[i % statusPool.length];
    const daysAgo = Math.floor(Math.random() * 180) + 1;
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    const unitsSold = Math.floor(Math.random() * 180) + 20;
    const grossRevenue = unitsSold * (8 + Math.floor(Math.random() * 12));
    const royaltyRate = 0.65 + Math.random() * 0.1;
    const netRoyalty = Math.round(grossRevenue * royaltyRate);
    const period = `${months[i % 6]} 2026`;

    txns.push({
      id: `ROY-2026-${String(i + 1).padStart(4, "0")}`,
      authorName: author.name,
      authorEmail: author.email,
      bookTitle: book,
      unitsSold,
      grossRevenue,
      royaltyRate: Math.round(royaltyRate * 100),
      netRoyalty,
      period,
      status,
      paymentMethod: PAYMENT_METHODS[i % 4],
      createdAt,
    });
  }
  return txns;
}

export default function AdminRoyaltiesPage() {
  const [allTxns] = useState<RoyaltyTransaction[]>(() => generateTransactions());
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOption, setSortOption] = useState("highest-royalty");
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [activeSummaryCard, setActiveSummaryCard] = useState<string | null>(null);
  const [authorDrawerOpen, setAuthorDrawerOpen] = useState(false);
  const [authorDrawerData, setAuthorDrawerData] = useState<RoyaltyAuthor | null>(null);
  const [batchConfirmOpen, setBatchConfirmOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [calcPrice, setCalcPrice] = useState(19.99);
  const [calcUnits, setCalcUnits] = useState(100);
  const [calcRate, setCalcRate] = useState(70);

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

  useEffect(() => { setPage(1); }, [search, activeCategory, sortOption, pageSize]);

  const stats = useMemo(() => {
    const pending = allTxns.filter((t) => t.status === "Pending").length;
    const paid = allTxns.filter((t) => t.status === "Paid").length;
    const overdue = allTxns.filter((t) => t.status === "Overdue").length;
    const processing = allTxns.filter((t) => t.status === "Processing").length;
    const totalPaid = allTxns.filter((t) => t.status === "Paid").reduce((s, t) => s + t.netRoyalty, 0);
    const highEarners = allTxns.filter((t) => t.netRoyalty > 1000).length;
    return { pending, paid, overdue, processing, totalPaid, highEarners, total: allTxns.length };
  }, [allTxns]);

  const filteredTxns = useMemo(() => {
    let result = [...allTxns];
    if (activeCategory === "pending") result = result.filter((t) => t.status === "Pending");
    else if (activeCategory === "paid") result = result.filter((t) => t.status === "Paid");
    else if (activeCategory === "overdue") result = result.filter((t) => t.status === "Overdue");
    else if (activeCategory === "processing") result = result.filter((t) => t.status === "Processing");
    else if (activeCategory === "high-earners") result = result.filter((t) => t.netRoyalty > 1000);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) =>
        t.authorName.toLowerCase().includes(q) ||
        t.bookTitle.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    }

    switch (sortOption) {
      case "highest-royalty": result.sort((a, b) => b.netRoyalty - a.netRoyalty); break;
      case "lowest-royalty": result.sort((a, b) => a.netRoyalty - b.netRoyalty); break;
      case "most-recent": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "oldest": result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "author-az": result.sort((a, b) => a.authorName.localeCompare(b.authorName)); break;
      case "author-za": result.sort((a, b) => b.authorName.localeCompare(a.authorName)); break;
    }
    return result;
  }, [allTxns, activeCategory, search, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredTxns.length / pageSize));
  const displayedTxns = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTxns.slice(start, start + pageSize);
  }, [filteredTxns, page, pageSize]);

  const openAuthorDrawer = (author: RoyaltyAuthor) => {
    setAuthorDrawerData(author);
    setAuthorDrawerOpen(true);
  };

  const exportCSV = (data: RoyaltyTransaction[]) => {
    const headers = ["ID", "Author", "Email", "Book", "Units Sold", "Gross Revenue", "Royalty Rate", "Net Royalty", "Period", "Status", "Method"];
    const rows = data.map((t) => [t.id, t.authorName, t.authorEmail, t.bookTitle, String(t.unitsSold), String(t.grossRevenue), `${t.royaltyRate}%`, String(t.netRoyalty), t.period, t.status, t.paymentMethod]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `royalties-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    showNotification("success", "CSV exported successfully");
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Overdue": return "bg-red-50 text-red-700 border-red-200";
      case "Processing": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const maxEarning = Math.max(...AUTHOR_EARNINGS.map((a) => a.earned));
  const maxRevenueSource = Math.max(...REVENUE_SOURCES.map((r) => r.value));

  const calcGross = calcPrice * calcUnits;
  const calcPlatformFee = calcGross * 0.3;
  const calcNet = calcGross * (calcRate / 100);

  const paymentMethods = [
    { name: "Bank Transfer", icon: Banknote, preferred: true, lastPayment: "2026-05-28", verified: true },
    { name: "PayPal", icon: Globe, preferred: false, lastPayment: "2026-05-25", verified: true },
    { name: "Paystack", icon: ShieldCheck, preferred: false, lastPayment: "2026-05-20", verified: true },
    { name: "Wise", icon: ArrowUpRight, preferred: false, lastPayment: "2026-04-30", verified: false },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {notification && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${notification.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {notification.message}
        </motion.div>
      )}

      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Royalty Management</h1>
          <p className="text-sm text-muted-foreground">Track and manage author royalties, earnings, and payments.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" onClick={() => { showNotification("success", "Royalties refreshed"); }} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
              <RefreshCw className="h-4 w-4 mr-1" />Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SUMMARY_CARDS.map((card) => {
          const isActive = activeSummaryCard === card.key;
          const cardFilter = card.key === "pending" ? "pending" : card.key === "paid" ? "paid" : card.key === "authors" ? null : null;
          return (
            <motion.div key={card.key} variants={item} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Card onClick={() => { if (cardFilter) { setActiveCategory(isActive && activeCategory === cardFilter ? "all" : cardFilter); setActiveSummaryCard(isActive ? null : card.key); } }} className={cn("shadow-sm transition-all duration-200 bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] border-[#D8B27A]/20", isActive && "ring-2 ring-[#D8B27A] shadow-md border-[#D8B27A]/40")}>
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
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Royalty Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Monthly Royalty Trend</h4>
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
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Revenue Sources</h4>
                      <div className="space-y-3">
                        {REVENUE_SOURCES.map((r) => (
                          <div key={r.label}>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-[#5C4A3D]">{r.label}</span>
                              <span className="font-bold text-[#1D1D1D]">{r.value}%</span>
                            </div>
                            <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                              <div className={cn("h-full rounded-full", r.color)} style={{ width: `${(r.value / maxRevenueSource) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Book Sales Breakdown</h4>
                      <div className="space-y-2.5">
                        {TOP_BOOKS.map((b, i) => {
                          const maxSales = TOP_BOOKS[0].sales;
                          return (
                            <div key={b.title} className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-[#8A6A4A] w-4 text-center">{i + 1}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between text-[10px] mb-0.5">
                                  <span className="text-[#5C4A3D] truncate">{b.title}</span>
                                  <span className="font-semibold text-[#1D1D1D] flex-shrink-0">{b.sales} sales</span>
                                </div>
                                <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${(b.sales / maxSales) * 100}%` }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5 lg:col-span-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Pending vs Paid</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                          <p className="text-[10px] text-[#5C4A3D] mb-1">Pending Royalties</p>
                          <p className="text-xl font-bold text-amber-600">$7,420</p>
                          <p className="text-[9px] text-[#5C4A3D] mt-0.5">25 transactions</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                          <p className="text-[10px] text-[#5C4A3D] mb-1">Paid Royalties</p>
                          <p className="text-xl font-bold text-emerald-600">$41,340</p>
                          <p className="text-[9px] text-[#5C4A3D] mt-0.5">65 transactions</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#D8B27A]/15 grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-[10px] text-[#5C4A3D]">Payment Success Rate</p>
                          <p className="text-sm font-bold text-[#1D1D1D]">94.2%</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5C4A3D]">Avg Processing Time</p>
                          <p className="text-sm font-bold text-[#8A6A4A]">3.2 days</p>
                        </div>
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
            <Input placeholder="Search by author, book title, or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9 relative z-[1]" />
          </div>

          <div className="flex items-center gap-2" ref={sortFilterRef}>
            <div className="relative">
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button variant="outline" size="sm" onClick={() => setSortFilterOpen(!sortFilterOpen)} className={cn("h-9 px-3 border-0 bg-white text-sm font-medium gap-2", sortOption !== "highest-royalty" ? "text-[#D8B27A]" : "text-[#8A6A4A] hover:bg-[#F2D8BE]")}>
                  <SlidersHorizontal className="h-4 w-4" /><span className="hidden sm:inline">Sort & Filter</span><ChevronRight className={cn("h-3.5 w-3.5 transition-transform", sortFilterOpen && "rotate-90")} />
                </Button>
              </div>
              <AnimatePresence>
                {sortFilterOpen && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 w-[240px] bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#E8DDD0] bg-[#F5EDE3]/30 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#8A6A4A]" />Sort By</h4>
                      {sortOption !== "highest-royalty" && <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={() => setSortOption("highest-royalty")}><X className="h-3 w-3 mr-1" />Clear</Button>}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      {SORT_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => { setSortOption(opt.value); setSortFilterOpen(false); }} className={cn("w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors", sortOption === opt.value ? "bg-[#D8B27A]/20 text-[#1D1D1D] font-medium" : "text-[#5C4A3D] hover:bg-[#F5EDE3]")}>
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

          <div className="flex items-center gap-2">
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <Button variant="outline" size="sm" onClick={() => setCalculatorOpen(!calculatorOpen)} className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
                <Calculator className="h-4 w-4" /><span className="hidden sm:inline">Calculator</span>
              </Button>
            </div>
            <div className="relative" ref={quickActionsRef}>
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button variant="outline" size="sm" onClick={() => setQuickActionsOpen(!quickActionsOpen)} className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
                  <Zap className="h-4 w-4" /><span className="hidden sm:inline">Quick Actions</span><ChevronRight className={cn("h-3.5 w-3.5 transition-transform", quickActionsOpen && "rotate-90")} />
                </Button>
              </div>
              {quickActionsOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 p-2">
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportCSV(allTxns); setQuickActionsOpen(false); }}><Download className="h-3.5 w-3.5 mr-1.5" />Export CSV</Button>
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportCSV(allTxns); setQuickActionsOpen(false); }}><Download className="h-3.5 w-3.5 mr-1.5" />Export Excel</Button>
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "PDF export started"); setQuickActionsOpen(false); }}><Download className="h-3.5 w-3.5 mr-1.5" />Export PDF</Button>
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Monthly report downloading"); setQuickActionsOpen(false); }}><FileText className="h-3.5 w-3.5 mr-1.5" />Monthly Report</Button>
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Annual report downloading"); setQuickActionsOpen(false); }}><FileText className="h-3.5 w-3.5 mr-1.5" />Annual Report</Button>
                  <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Tax summary downloading"); setQuickActionsOpen(false); }}><FileText className="h-3.5 w-3.5 mr-1.5" />Tax Summary</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button key={cat.key} onClick={() => { setActiveCategory(activeCategory === cat.key && cat.key !== "all" ? "all" : cat.key); setActiveSummaryCard(null); }} className={cn("shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all", activeCategory === cat.key && cat.key !== "all" ? "text-white shadow-sm" : cat.key === "all" && activeCategory === "all" ? "bg-gray-600 text-white border-gray-600 shadow-sm" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]")} style={activeCategory === cat.key && cat.key !== "all" ? { backgroundColor: cat.activeColor.replace("bg-", ""), borderColor: cat.activeColor.replace("bg-", "") } : undefined}>
              {cat.label}
              <span className="ml-1 text-[9px] opacity-70">
                {cat.key === "all" ? stats.total : cat.key === "pending" ? stats.pending : cat.key === "paid" ? stats.paid : cat.key === "overdue" ? stats.overdue : cat.key === "processing" ? stats.processing : stats.highEarners}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground bg-[#F2D8BE]/15 rounded-lg px-4 py-2 border border-[#D8B27A]/10">
        <span>Showing <span className="font-semibold text-[#1D1D1D]">{displayedTxns.length}</span> of <span className="font-semibold text-[#1D1D1D]">{filteredTxns.length}</span> royalty records</span>
        <span className="hidden sm:inline text-[#E8DDD0]">|</span>
        <span><span className="text-[#8A6A4A] font-medium">$48,760</span> Total</span>
        <span><span className="text-amber-600 font-medium">$7,420</span> Pending</span>
        <span><span className="text-emerald-600 font-medium">$41,340</span> Paid</span>
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap items-center gap-2 p-3 bg-[#F2D8BE]/20 rounded-lg border border-[#D8B27A]/30">
        <Button size="sm" variant="outline" className="h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => showNotification("success", "All authors selected")}>
          <Check className="h-3 w-3 mr-1" />Select All
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs border-[#8A6A4A]/30 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => setBatchConfirmOpen(true)}>
          <Wallet className="h-3 w-3 mr-1" />Generate Payment Batch
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs border-[#8A6A4A]/30 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => exportCSV(allTxns)}>
          <Download className="h-3 w-3 mr-1" />Export Report
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => showNotification("success", "All pending marked as paid")}>
          <Check className="h-3 w-3 mr-1" />Mark Paid
        </Button>
      </motion.div>

      <SyncedTableScroll ref={tableScroll} loading={false}>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F2D8BE]/20 hover:bg-[#F2D8BE]/30 sticky top-0 z-10">
              <TableHead className="text-[#1D1D1D] font-semibold">Author</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden md:table-cell">Books Published</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell">Units Sold</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold text-right hidden lg:table-cell">Gross Revenue</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold text-right hidden xl:table-cell">Platform Share</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold text-right">Author Royalty</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold text-right hidden sm:table-cell">Pending</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold text-right hidden sm:table-cell">Paid</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden xl:table-cell">Last Payment</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTxns.length === 0 ? (
              <TableRow><TableCell colSpan={11} className="text-center py-16">
                <DollarSign className="mx-auto h-10 w-10 text-[#D8B27A]/50 mb-3" />
                <p className="text-sm font-medium text-[#1D1D1D]">No royalty records found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
              </TableCell></TableRow>
            ) : (
              displayedTxns.map((txn) => {
                const authorData = TOP_AUTHORS.find((a) => a.name === txn.authorName) || {
                  name: txn.authorName, email: txn.authorEmail, booksPublished: 1,
                  unitsSold: txn.unitsSold, grossRevenue: txn.grossRevenue,
                  platformShare: Math.round(txn.grossRevenue * 0.3), authorRoyalty: txn.netRoyalty,
                  pending: txn.status === "Pending" || txn.status === "Overdue" ? txn.netRoyalty : 0,
                  paid: txn.status === "Paid" ? txn.netRoyalty : 0,
                  lastPayment: txn.status === "Paid" ? txn.createdAt.slice(0, 10) : "",
                  status: txn.status, paymentMethod: txn.paymentMethod,
                };
                return (
                  <TableRow key={txn.id} className="hover:bg-[#8A6A4A]/[0.04] hover:shadow-sm transition-all duration-150 cursor-default border-b border-[#E8DDD0]/50">
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] bg-[#8A6A4A]/10 text-[#8A6A4A]">{getInitials(txn.authorName)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1D1D1D] truncate max-w-[140px]">{txn.authorName}</p>
                          <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">{txn.authorEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-2">
                      <p className="text-sm text-[#5C4A3D]">{authorData.booksPublished}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell py-2">
                      <p className="text-sm text-[#5C4A3D]">{authorData.unitsSold.toLocaleString()}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell py-2 text-right">
                      <span className="text-sm text-[#5C4A3D]">{formatCurrency(authorData.grossRevenue)}</span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell py-2 text-right">
                      <span className="text-sm text-red-600">{formatCurrency(authorData.platformShare)}</span>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <span className="text-sm font-bold text-[#8A6A4A]">{formatCurrency(authorData.authorRoyalty)}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-2 text-right">
                      <span className="text-sm text-amber-600">{formatCurrency(authorData.pending)}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-2 text-right">
                      <span className="text-sm text-emerald-600">{formatCurrency(authorData.paid)}</span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell py-2">
                      <p className="text-xs text-muted-foreground">{authorData.lastPayment || "—"}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-2">
                      <Badge variant="secondary" className={cn("text-[10px] border", statusBadgeColor(txn.status))}>{txn.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => openAuthorDrawer(authorData)} title="View Author Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </SyncedTableScroll>

      <motion.div variants={item} className="flex items-center justify-between">
        <p className="text-sm text-[#5C4A3D]">
          Showing <span className="font-medium text-[#1D1D1D]">{filteredTxns.length === 0 ? 0 : (page - 1) * pageSize + 1}</span> &ndash; <span className="font-medium text-[#1D1D1D]">{Math.min(page * pageSize, filteredTxns.length)}</span> of <span className="font-medium text-[#1D1D1D]">{filteredTxns.length}</span> records
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

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Top Earning Books</h4>
            <div className="space-y-2">
              {TOP_BOOKS.map((book) => (
                <div key={book.rank} className="flex items-center gap-3 py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                  <span className="text-xs font-bold text-[#8A6A4A] w-5 text-center">{book.rank}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1D1D1D] truncate">{book.title}</p>
                    <p className="text-[10px] text-muted-foreground">{book.author} · {book.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#8A6A4A]">{formatCurrency(book.royalties)}</p>
                    <p className="text-[9px] text-muted-foreground">{formatCurrency(book.revenue)} revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {activityLog.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                  <div className={cn("h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0", entry.type === "payment" ? "bg-emerald-50" : entry.type === "batch" ? "bg-blue-50" : entry.type === "processing" ? "bg-amber-50" : entry.type === "request" ? "bg-purple-50" : entry.type === "export" ? "bg-gray-50" : "bg-red-50")}>
                    {entry.type === "payment" ? <Wallet className="h-3.5 w-3.5 text-emerald-600" /> : entry.type === "batch" ? <FileText className="h-3.5 w-3.5 text-blue-600" /> : entry.type === "processing" ? <Clock className="h-3.5 w-3.5 text-amber-600" /> : entry.type === "request" ? <TrendingUp className="h-3.5 w-3.5 text-purple-600" /> : entry.type === "export" ? <Download className="h-3.5 w-3.5 text-gray-600" /> : <DollarSign className="h-3.5 w-3.5 text-red-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1D1D1D]">{entry.action}</p>
                    <p className="text-[10px] text-muted-foreground">{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <div className="analytics-dropdown-border">
          <Card className="shadow-sm bg-white">
            <button onClick={() => setCalculatorOpen(!calculatorOpen)} className="w-full flex items-center justify-between p-4 hover:bg-[#F2D8BE]/10 transition-colors rounded-lg">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-[#8A6A4A]" />
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Royalty Calculator</h3>
              </div>
              {calculatorOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {calculatorOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-[#5C4A3D]">Book Price ($)</Label>
                      <Input type="number" value={calcPrice} onChange={(e) => setCalcPrice(parseFloat(e.target.value) || 0)} className="border-[#E8DDD0] focus-visible:ring-[#D8B27A]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-[#5C4A3D]">Units Sold</Label>
                      <Input type="number" value={calcUnits} onChange={(e) => setCalcUnits(parseInt(e.target.value) || 0)} className="border-[#E8DDD0] focus-visible:ring-[#D8B27A]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-[#5C4A3D]">Royalty Percentage (%)</Label>
                      <Input type="number" value={calcRate} onChange={(e) => setCalcRate(parseInt(e.target.value) || 0)} className="border-[#E8DDD0] focus-visible:ring-[#D8B27A]" />
                    </div>
                    <div className="sm:col-span-3 grid grid-cols-3 gap-4 mt-2">
                      <div className="text-center p-3 rounded-lg bg-[#F2D8BE]/10 border border-[#D8B27A]/15">
                        <p className="text-[10px] text-[#5C4A3D] mb-1">Gross Revenue</p>
                        <p className="text-lg font-bold text-[#1D1D1D]">{formatCurrency(calcGross)}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-[10px] text-[#5C4A3D] mb-1">Platform Fee (30%)</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(calcPlatformFee)}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                        <p className="text-[10px] text-[#5C4A3D] mb-1">Net Royalty</p>
                        <p className="text-lg font-bold text-emerald-600">{formatCurrency(calcNet)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {paymentMethods.map((pm) => (
          <Card key={pm.name} className="shadow-sm bg-white border-[#D8B27A]/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <pm.icon className="h-5 w-5 text-[#8A6A4A]" />
                {pm.preferred && <Badge className="bg-[#D8B27A]/20 text-[#8A6A4A] border-[#D8B27A]/30 text-[9px]">Preferred</Badge>}
              </div>
              <p className="text-sm font-semibold text-[#1D1D1D]">{pm.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Last: {pm.lastPayment}</p>
              <div className="flex items-center gap-1 mt-1">
                {pm.verified ? <ShieldCheck className="h-3 w-3 text-emerald-500" /> : <Clock className="h-3 w-3 text-amber-500" />}
                <span className="text-[9px] text-muted-foreground">{pm.verified ? "Verified" : "Pending"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Financial Health</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Pending Payouts", value: "$7,420", color: "text-amber-600" },
                { label: "Payment Success Rate", value: "94.2%", color: "text-emerald-600" },
                { label: "Avg Royalty/Author", value: "$567", color: "text-[#8A6A4A]" },
                { label: "Avg Payment Time", value: "3.2 days", color: "text-blue-600" },
                { label: "Revenue Growth", value: "+12.4%", color: "text-emerald-600" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-lg bg-[#F2D8BE]/10 border border-[#D8B27A]/15">
                  <p className="text-[10px] text-[#5C4A3D] mb-1">{stat.label}</p>
                  <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-700">System Healthy — All payment channels operational</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={authorDrawerOpen} onOpenChange={setAuthorDrawerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1D1D1D]">Royalty Details</DialogTitle>
            <DialogDescription>Author royalty breakdown and payment history</DialogDescription>
          </DialogHeader>
          {authorDrawerData && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#F2D8BE]/10 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-[#8A6A4A]/10 text-[#8A6A4A] font-semibold">{getInitials(authorDrawerData.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-[#1D1D1D]">{authorDrawerData.name}</p>
                  <p className="text-xs text-muted-foreground">{authorDrawerData.email}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Payment: {authorDrawerData.paymentMethod}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#E8DDD0]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Books</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px]">Book Name</TableHead>
                      <TableHead className="text-[10px] text-right">Copies Sold</TableHead>
                      <TableHead className="text-[10px] text-right">Revenue</TableHead>
                      <TableHead className="text-[10px] text-right">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BOOKS.slice(0, authorDrawerData.booksPublished).map((book) => {
                      const copies = Math.floor(authorDrawerData.unitsSold / authorDrawerData.booksPublished);
                      const rev = Math.floor(authorDrawerData.grossRevenue / authorDrawerData.booksPublished);
                      return (
                        <TableRow key={book}>
                          <TableCell className="text-xs py-1.5">{book}</TableCell>
                          <TableCell className="text-xs text-right py-1.5">{copies.toLocaleString()}</TableCell>
                          <TableCell className="text-xs text-right py-1.5">{formatCurrency(rev)}</TableCell>
                          <TableCell className="text-xs text-right py-1.5">70%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Royalty", value: formatCurrency(authorDrawerData.authorRoyalty) },
                  { label: "Pending", value: formatCurrency(authorDrawerData.pending) },
                  { label: "Paid", value: formatCurrency(authorDrawerData.paid) },
                  { label: "Platform Share", value: formatCurrency(authorDrawerData.platformShare) },
                ].map((stat) => (
                  <div key={stat.label} className="p-2.5 rounded-lg bg-white border border-[#E8DDD0]">
                    <p className="text-[10px] text-muted-foreground mb-0.5">{stat.label}</p>
                    <p className="text-sm font-bold text-[#1D1D1D]">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#E8DDD0]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Payment History</h4>
                <div className="space-y-2">
                  {[
                    { step: "Royalty Earned", done: true },
                    { step: "Review", done: true },
                    { step: "Approved", done: authorDrawerData.status !== "Pending" },
                    { step: "Paid", done: authorDrawerData.status === "Paid" },
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
                        <p className="text-[10px] text-muted-foreground">{step.done ? authorDrawerData.lastPayment : "Pending..."}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={batchConfirmOpen} onOpenChange={setBatchConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#1D1D1D]">Generate Payment Batch</DialogTitle>
            <DialogDescription>
              This will generate a payment batch for all pending royalties. Do you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setBatchConfirmOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
            <Button onClick={() => { setBatchConfirmOpen(false); showNotification("success", "Payment batch generated successfully"); }} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
              <Wallet className="h-4 w-4 mr-1" />Generate Batch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}