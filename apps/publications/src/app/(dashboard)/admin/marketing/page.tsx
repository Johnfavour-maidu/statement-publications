"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SyncedTableScroll, type SyncedTableScrollHandle } from "@/components/ui/synced-table-scroll";
import {
  Megaphone, Zap, CheckCircle2, Users, Target, DollarSign,
  Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, BarChart3,
  RefreshCw, Eye, Download, FileText, Calendar, TrendingUp,
  ArrowUpRight, ArrowDownRight, Send,
  SlidersHorizontal, X, Activity,
  MousePointerClick, Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { formatCurrency, cn } from "@/lib/utils";

interface CampaignRecord {
  id: string;
  name: string;
  type: string;
  audienceSize: number;
  opens: number;
  clicks: number;
  conversionRate: number;
  revenue: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed";
}

interface ActivityEntry {
  id: string;
  action: string;
  time: string;
  type: "launch" | "subscriber" | "complete" | "edit" | "delete" | "export" | "send" | "update";
}

const CAMPAIGNS: CampaignRecord[] = [
  { id: "c1", name: "Summer Reading Campaign", type: "seasonal", audienceSize: 12458, opens: 4892, clicks: 1867, conversionRate: 12.4, revenue: 8420, startDate: "2026-05-01", endDate: "2026-06-15", status: "Active" },
  { id: "c2", name: "Author Spotlight Series", type: "email", audienceSize: 11200, opens: 4120, clicks: 1540, conversionRate: 9.8, revenue: 6340, startDate: "2026-04-15", endDate: "2026-05-30", status: "Active" },
  { id: "c3", name: "Financial Clarity Launch", type: "launches", audienceSize: 10800, opens: 5200, clicks: 2340, conversionRate: 15.2, revenue: 9800, startDate: "2026-03-01", endDate: "2026-04-15", status: "Completed" },
  { id: "c4", name: "Book of the Month", type: "email", audienceSize: 12000, opens: 4560, clicks: 1680, conversionRate: 8.6, revenue: 4200, startDate: "2026-05-10", endDate: "2026-06-10", status: "Active" },
  { id: "c5", name: "Publishing Masterclass", type: "promotions", audienceSize: 9800, opens: 3890, clicks: 1420, conversionRate: 11.2, revenue: 5600, startDate: "2026-04-01", endDate: "2026-05-15", status: "Completed" },
  { id: "c6", name: "Self Development Week", type: "social", audienceSize: 8500, opens: 3200, clicks: 1180, conversionRate: 7.4, revenue: 3100, startDate: "2026-03-15", endDate: "2026-03-22", status: "Completed" },
  { id: "c7", name: "Leadership Collection", type: "email", audienceSize: 11500, opens: 4340, clicks: 1620, conversionRate: 10.1, revenue: 4800, startDate: "2026-02-01", endDate: "2026-03-01", status: "Completed" },
  { id: "c8", name: "Writing Challenge Campaign", type: "social", audienceSize: 7800, opens: 2980, clicks: 1060, conversionRate: 6.8, revenue: 2400, startDate: "2026-05-20", endDate: "2026-06-20", status: "Active" },
  { id: "c9", name: "Business Growth Bundle", type: "promotions", audienceSize: 10200, opens: 4100, clicks: 1580, conversionRate: 11.8, revenue: 5200, startDate: "2026-01-15", endDate: "2026-02-28", status: "Completed" },
  { id: "c10", name: "African Authors Showcase", type: "launches", audienceSize: 9200, opens: 3680, clicks: 1340, conversionRate: 9.2, revenue: 3800, startDate: "2026-04-10", endDate: "2026-05-10", status: "Completed" },
  { id: "c11", name: "New Year Reading List", type: "seasonal", audienceSize: 12458, opens: 5100, clicks: 2100, conversionRate: 13.6, revenue: 7200, startDate: "2026-01-01", endDate: "2026-01-31", status: "Completed" },
  { id: "c12", name: "Valentine's Day Special", type: "seasonal", audienceSize: 11800, opens: 4680, clicks: 1920, conversionRate: 11.4, revenue: 4600, startDate: "2026-02-10", endDate: "2026-02-14", status: "Completed" },
  { id: "c13", name: "Author Q&A Live", type: "social", audienceSize: 8200, opens: 3400, clicks: 1280, conversionRate: 8.2, revenue: 2100, startDate: "2026-05-05", endDate: "2026-05-12", status: "Completed" },
  { id: "c14", name: "Financial Freedom Series", type: "email", audienceSize: 11000, opens: 4200, clicks: 1560, conversionRate: 10.4, revenue: 5400, startDate: "2026-03-10", endDate: "2026-04-10", status: "Completed" },
  { id: "c15", name: "Book Launch Party", type: "launches", audienceSize: 9500, opens: 4800, clicks: 2200, conversionRate: 14.8, revenue: 6800, startDate: "2026-06-01", endDate: "2026-06-30", status: "Active" },
  { id: "c16", name: "Summer Flash Sale", type: "promotions", audienceSize: 12458, opens: 5400, clicks: 2400, conversionRate: 16.2, revenue: 8200, startDate: "2026-06-15", endDate: "2026-06-22", status: "Active" },
  { id: "c17", name: "Social Media Takeover", type: "social", audienceSize: 7500, opens: 2800, clicks: 980, conversionRate: 5.6, revenue: 1800, startDate: "2026-04-20", endDate: "2026-04-27", status: "Completed" },
  { id: "c18", name: "Newsletter Welcome Series", type: "email", audienceSize: 12458, opens: 5600, clicks: 2100, conversionRate: 11.8, revenue: 3200, startDate: "2026-01-01", endDate: "2026-06-30", status: "Active" },
  { id: "c19", name: "Back to School Promo", type: "promotions", audienceSize: 10500, opens: 3900, clicks: 1440, conversionRate: 9.6, revenue: 4100, startDate: "2026-03-01", endDate: "2026-03-15", status: "Completed" },
  { id: "c20", name: "Podcast Cross-Promo", type: "social", audienceSize: 6800, opens: 2400, clicks: 860, conversionRate: 6.2, revenue: 1600, startDate: "2026-05-15", endDate: "2026-06-15", status: "Active" },
  { id: "c21", name: "Author Anniversary Sale", type: "promotions", audienceSize: 11200, opens: 4400, clicks: 1700, conversionRate: 10.8, revenue: 5800, startDate: "2026-02-15", endDate: "2026-02-28", status: "Completed" },
  { id: "c22", name: "Holiday Gift Guide", type: "email", audienceSize: 12000, opens: 4800, clicks: 1900, conversionRate: 12.2, revenue: 6400, startDate: "2026-06-01", endDate: "2026-06-30", status: "Active" },
  { id: "c23", name: "Instagram Stories Push", type: "social", audienceSize: 8800, opens: 3100, clicks: 1100, conversionRate: 7.8, revenue: 2200, startDate: "2026-04-05", endDate: "2026-04-12", status: "Completed" },
  { id: "c24", name: "Kindle Unlimited Promo", type: "promotions", audienceSize: 10800, opens: 4200, clicks: 1640, conversionRate: 11.6, revenue: 5400, startDate: "2026-05-01", endDate: "2026-05-31", status: "Completed" },
];

const CATEGORIES = [
  { key: "all", label: "All Campaigns", count: 24, activeColor: "bg-gray-600" },
  { key: "email", label: "Email", count: 8, activeColor: "bg-blue-500" },
  { key: "social", label: "Social Media", count: 6, activeColor: "bg-purple-500" },
  { key: "promotions", label: "Promotions", count: 5, activeColor: "bg-emerald-500" },
  { key: "launches", label: "Launches", count: 3, activeColor: "bg-orange-500" },
  { key: "seasonal", label: "Seasonal", count: 2, activeColor: "bg-amber-500" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest-revenue", label: "Highest Revenue" },
  { value: "lowest-revenue", label: "Lowest Revenue" },
  { value: "highest-conversion", label: "Highest Conversion" },
  { value: "lowest-conversion", label: "Lowest Conversion" },
  { value: "largest-audience", label: "Largest Audience" },
  { value: "smallest-audience", label: "Smallest Audience" },
  { value: "name-az", label: "Name A-Z" },
  { value: "name-za", label: "Name Z-A" },
];

const SUMMARY_CARDS = [
  { key: "total", label: "TOTAL CAMPAIGNS", value: "24", icon: Megaphone, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40" },
  { key: "active", label: "ACTIVE", value: "8", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-50" },
  { key: "completed", label: "COMPLETED", value: "16", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50" },
  { key: "subscribers", label: "SUBSCRIBERS", value: "12,458", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  { key: "conversion", label: "CONVERSION", value: "8.7%", icon: Target, color: "text-orange-500", bg: "bg-orange-50" },
  { key: "revenue", label: "REVENUE", value: "$48,620", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-50" },
];

const WEEKLY_PERFORMANCE = [
  { week: "Week 1", opens: 3200, clicks: 1200 },
  { week: "Week 2", opens: 4100, clicks: 1650 },
  { week: "Week 3", opens: 3800, clicks: 1480 },
  { week: "Week 4", opens: 5200, clicks: 2100 },
  { week: "Week 5", opens: 4600, clicks: 1820 },
  { week: "Week 6", opens: 5800, clicks: 2340 },
];

const SUBSCRIBER_GROWTH = [
  { month: "Jan", value: 8200 },
  { month: "Feb", value: 9100 },
  { month: "Mar", value: 9850 },
  { month: "Apr", value: 10600 },
  { month: "May", value: 11584 },
  { month: "Jun", value: 12458 },
];

const CONVERSION_TREND = [
  { month: "Jan", value: 6.2 },
  { month: "Feb", value: 7.1 },
  { month: "Mar", value: 7.8 },
  { month: "Apr", value: 8.3 },
  { month: "May", value: 8.5 },
  { month: "Jun", value: 8.7 },
];

const REVENUE_TREND = [
  { month: "Jan", value: 4800 },
  { month: "Feb", value: 6200 },
  { month: "Mar", value: 8400 },
  { month: "Apr", value: 7600 },
  { month: "May", value: 9800 },
  { month: "Jun", value: 11820 },
];

const TRAFFIC_SOURCES = [
  { label: "Email Marketing", percentage: 38, color: "bg-[#8A6A4A]" },
  { label: "Social Media", percentage: 26, color: "bg-purple-500" },
  { label: "Organic Search", percentage: 18, color: "bg-emerald-500" },
  { label: "Direct Traffic", percentage: 12, color: "bg-blue-500" },
  { label: "Referrals", percentage: 6, color: "bg-amber-500" },
];

const ENGAGEMENT_STATS = [
  { label: "Avg Open Rate", value: "34.2%", change: "+2.1%", up: true },
  { label: "Avg Click Rate", value: "12.8%", change: "+0.8%", up: true },
  { label: "Unsubscribe Rate", value: "0.9%", change: "-0.2%", up: false },
  { label: "Bounce Rate", value: "1.4%", change: "-0.3%", up: false },
  { label: "Avg Read Time", value: "2m 18s", change: "+12s", up: true },
  { label: "Spam Complaints", value: "0.1%", change: "-0.05%", up: false },
];

const activityLog: ActivityEntry[] = [
  { id: "a1", action: "Campaign launched: Summer Flash Sale", time: "2 hours ago", type: "launch" },
  { id: "a2", action: "874 new subscribers added this month", time: "4 hours ago", type: "subscriber" },
  { id: "a3", action: "Newsletter Welcome Series completed", time: "6 hours ago", type: "complete" },
  { id: "a4", action: "Campaign updated: Summer Reading Campaign", time: "8 hours ago", type: "edit" },
  { id: "a5", action: "Exported campaign report: Financial Clarity Launch", time: "Yesterday", type: "export" },
  { id: "a6", action: "New campaign created: Holiday Gift Guide", time: "Yesterday", type: "launch" },
  { id: "a7", action: "5600 opens on Newsletter Welcome Series", time: "Yesterday", type: "send" },
  { id: "a8", action: "Campaign completed: Publishing Masterclass", time: "2 days ago", type: "complete" },
  { id: "a9", action: "128 new subscribers from Author Q&A Live", time: "2 days ago", type: "subscriber" },
  { id: "a10", action: "Campaign launched: Podcast Cross-Promo", time: "2 days ago", type: "launch" },
  { id: "a11", action: "Summer Flash Sale reached 16.2% conversion", time: "3 days ago", type: "update" },
  { id: "a12", action: "Deleted draft campaign: Draft Test", time: "3 days ago", type: "delete" },
  { id: "a13", action: "15,200 total emails sent this week", time: "3 days ago", type: "send" },
  { id: "a14", action: "Campaign updated: Writing Challenge Campaign", time: "4 days ago", type: "edit" },
  { id: "a15", action: "Book Launch Party hit 4800 opens", time: "4 days ago", type: "update" },
  { id: "a16", action: "Exported subscriber list (12,458 contacts)", time: "4 days ago", type: "export" },
  { id: "a17", action: "New campaign created: Summer Flash Sale", time: "5 days ago", type: "launch" },
  { id: "a18", action: "Author Spotlight Series reached 4120 opens", time: "5 days ago", type: "update" },
  { id: "a19", action: "214 new subscribers from Book of the Month", time: "5 days ago", type: "subscriber" },
  { id: "a20", action: "Campaign completed: Social Media Takeover", time: "6 days ago", type: "complete" },
  { id: "a21", action: "Valentine's Day Special campaign finalized", time: "6 days ago", type: "edit" },
  { id: "a22", action: "Financial Freedom Series sent to 11,000", time: "1 week ago", type: "send" },
  { id: "a23", action: "Campaign launched: Book Launch Party", time: "1 week ago", type: "launch" },
  { id: "a24", action: "96 new subscribers from Leadership Collection", time: "1 week ago", type: "subscriber" },
  { id: "a25", action: "New Year Reading List generated $7,200 revenue", time: "1 week ago", type: "update" },
  { id: "a26", action: "Exported revenue report Q1 2026", time: "1 week ago", type: "export" },
  { id: "a27", action: "Campaign updated: African Authors Showcase", time: "2 weeks ago", type: "edit" },
  { id: "a28", action: "Business Growth Bundle completed with 11.8% conversion", time: "2 weeks ago", type: "complete" },
  { id: "a29", action: "312 new subscribers from New Year Reading List", time: "2 weeks ago", type: "subscriber" },
  { id: "a30", action: "Kindle Unlimited Promo launched to 10,800", time: "2 weeks ago", type: "launch" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function getActivityIcon(type: ActivityEntry["type"]) {
  switch (type) {
    case "launch": return <Zap className="h-3.5 w-3.5 text-emerald-600" />;
    case "subscriber": return <Users className="h-3.5 w-3.5 text-purple-600" />;
    case "complete": return <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />;
    case "edit": return <FileText className="h-3.5 w-3.5 text-amber-600" />;
    case "delete": return <X className="h-3.5 w-3.5 text-red-600" />;
    case "export": return <Download className="h-3.5 w-3.5 text-indigo-600" />;
    case "send": return <Send className="h-3.5 w-3.5 text-[#8A6A4A]" />;
    case "update": return <Activity className="h-3.5 w-3.5 text-orange-600" />;
  }
}

function getActivityBg(type: ActivityEntry["type"]) {
  switch (type) {
    case "launch": return "bg-emerald-50";
    case "subscriber": return "bg-purple-50";
    case "complete": return "bg-blue-50";
    case "edit": return "bg-amber-50";
    case "delete": return "bg-red-50";
    case "export": return "bg-indigo-50";
    case "send": return "bg-[#F2D8BE]/40";
    case "update": return "bg-orange-50";
  }
}

function getStatusBadge(status: string) {
  if (status === "Active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
}

function getTypeBadge(type: string) {
  switch (type) {
    case "email": return "bg-blue-50 text-blue-700 border-blue-200";
    case "social": return "bg-purple-50 text-purple-700 border-purple-200";
    case "promotions": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "launches": return "bg-orange-50 text-orange-700 border-orange-200";
    case "seasonal": return "bg-amber-50 text-amber-700 border-amber-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function AdminMarketingPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [activeSummaryCard, setActiveSummaryCard] = useState<string | null>(null);
  const [campaignDrawerOpen, setCampaignDrawerOpen] = useState(false);
  const [campaignDrawerData, setCampaignDrawerData] = useState<CampaignRecord | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const sortFilterRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const tableScroll = useRef<SyncedTableScrollHandle>(null);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortFilterRef.current && !sortFilterRef.current.contains(e.target as Node)) setSortFilterOpen(false);
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) setQuickActionsOpen(false);
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setPage(1); }, [search, activeCategory, sortOption, pageSize]);

  const stats = useMemo(() => {
    const active = CAMPAIGNS.filter((c) => c.status === "Active").length;
    const completed = CAMPAIGNS.filter((c) => c.status === "Completed").length;
    const totalRevenue = CAMPAIGNS.reduce((s, c) => s + c.revenue, 0);
    const avgConversion = CAMPAIGNS.reduce((s, c) => s + c.conversionRate, 0) / CAMPAIGNS.length;
    return { active, completed, totalRevenue, avgConversion, total: CAMPAIGNS.length };
  }, []);

  const filteredCampaigns = useMemo(() => {
    let result = [...CAMPAIGNS];
    if (activeCategory !== "all") {
      result = result.filter((c) => c.type === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
    }
    switch (sortOption) {
      case "newest": result.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); break;
      case "oldest": result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()); break;
      case "highest-revenue": result.sort((a, b) => b.revenue - a.revenue); break;
      case "lowest-revenue": result.sort((a, b) => a.revenue - b.revenue); break;
      case "highest-conversion": result.sort((a, b) => b.conversionRate - a.conversionRate); break;
      case "lowest-conversion": result.sort((a, b) => a.conversionRate - b.conversionRate); break;
      case "largest-audience": result.sort((a, b) => b.audienceSize - a.audienceSize); break;
      case "smallest-audience": result.sort((a, b) => a.audienceSize - b.audienceSize); break;
      case "name-az": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-za": result.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return result;
  }, [CAMPAIGNS, activeCategory, search, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / pageSize));
  const displayedCampaigns = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCampaigns.slice(start, start + pageSize);
  }, [filteredCampaigns, page, pageSize]);

  const openCampaignDrawer = (campaign: CampaignRecord) => {
    setCampaignDrawerData(campaign);
    setCampaignDrawerOpen(true);
  };

  const topOpened = useMemo(() => [...CAMPAIGNS].sort((a, b) => b.opens - a.opens).slice(0, 3), []);
  const topClicked = useMemo(() => [...CAMPAIGNS].sort((a, b) => b.clicks - a.clicks).slice(0, 3), []);
  const topRevenue = useMemo(() => [...CAMPAIGNS].sort((a, b) => b.revenue - a.revenue).slice(0, 3), []);

  const maxSubscriberValue = Math.max(...SUBSCRIBER_GROWTH.map((s) => s.value));
  const maxPerformanceValue = Math.max(...WEEKLY_PERFORMANCE.map((w) => w.opens));
  const maxConversionValue = Math.max(...CONVERSION_TREND.map((c) => c.value));
  const maxRevenueTrendValue = Math.max(...REVENUE_TREND.map((r) => r.value));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {notification && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${notification.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {notification.message}
        </motion.div>
      )}

      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Marketing Command Center</h1>
          <p className="text-sm text-muted-foreground">Manage campaigns, track performance, and grow your audience.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" onClick={() => showNotification("success", "Marketing data refreshed")} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
              <RefreshCw className="h-4 w-4 mr-1" />Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SUMMARY_CARDS.map((card) => {
          const isActive = activeSummaryCard === card.key;
          const cardFilter = card.key === "active" ? "active" : card.key === "completed" ? "completed" : null;
          return (
            <motion.div key={card.key} variants={item} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Card onClick={() => {
                if (cardFilter) {
                  if (cardFilter === "active") {
                    setActiveCategory(activeCategory === "all" && isActive ? "all" : "all");
                    setSearch(isActive ? "" : "");
                  }
                }
                setActiveSummaryCard(isActive ? null : card.key);
              }} className={`shadow-sm transition-all duration-200 bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] border-[#D8B27A]/20 ${isActive ? "ring-2 ring-[#D8B27A] shadow-md border-[#D8B27A]/40" : ""}`}>
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
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Marketing Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Campaign Performance (Weekly)</h4>
                      <div className="flex items-end gap-1.5 h-32">
                        {WEEKLY_PERFORMANCE.map((w, i) => {
                          const height = (w.opens / maxPerformanceValue) * 100;
                          return (
                            <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[8px] text-[#5C4A3D] font-medium">{(w.opens / 1000).toFixed(1)}k</span>
                              <div className="w-full rounded-t" style={{ height: `${height}%`, backgroundColor: i === WEEKLY_PERFORMANCE.length - 1 ? "#8A6A4A" : "#D8B27A", opacity: i === WEEKLY_PERFORMANCE.length - 1 ? 1 : 0.6 + (i / WEEKLY_PERFORMANCE.length) * 0.4 }} />
                              <span className="text-[8px] text-[#5C4A3D]">W{i + 1}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Subscriber Growth</h4>
                      <div className="flex items-end gap-1.5 h-32">
                        {SUBSCRIBER_GROWTH.map((s, i) => {
                          const height = (s.value / maxSubscriberValue) * 100;
                          return (
                            <div key={s.month} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[8px] text-[#5C4A3D] font-medium">{(s.value / 1000).toFixed(1)}k</span>
                              <div className="w-full rounded-t" style={{ height: `${height}%`, backgroundColor: i === SUBSCRIBER_GROWTH.length - 1 ? "#8A6A4A" : "#D8B27A", opacity: i === SUBSCRIBER_GROWTH.length - 1 ? 1 : 0.6 + (i / SUBSCRIBER_GROWTH.length) * 0.4 }} />
                              <span className="text-[8px] text-[#5C4A3D]">{s.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Conversion Trend</h4>
                      <div className="flex items-end gap-1.5 h-32">
                        {CONVERSION_TREND.map((c, i) => {
                          const height = (c.value / maxConversionValue) * 100;
                          return (
                            <div key={c.month} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[8px] text-[#5C4A3D] font-medium">{c.value}%</span>
                              <div className="w-full rounded-t" style={{ height: `${height}%`, backgroundColor: i === CONVERSION_TREND.length - 1 ? "#8A6A4A" : "#D8B27A", opacity: i === CONVERSION_TREND.length - 1 ? 1 : 0.6 + (i / CONVERSION_TREND.length) * 0.4 }} />
                              <span className="text-[8px] text-[#5C4A3D]">{c.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Revenue Trend</h4>
                      <div className="flex items-end gap-1.5 h-32">
                        {REVENUE_TREND.map((r, i) => {
                          const height = (r.value / maxRevenueTrendValue) * 100;
                          return (
                            <div key={r.month} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[8px] text-[#5C4A3D] font-medium">${(r.value / 1000).toFixed(1)}k</span>
                              <div className="w-full rounded-t" style={{ height: `${height}%`, backgroundColor: i === REVENUE_TREND.length - 1 ? "#8A6A4A" : "#D8B27A", opacity: i === REVENUE_TREND.length - 1 ? 1 : 0.6 + (i / REVENUE_TREND.length) * 0.4 }} />
                              <span className="text-[8px] text-[#5C4A3D]">{r.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Traffic Sources</h4>
                      <div className="space-y-2.5">
                        {TRAFFIC_SOURCES.map((source) => (
                          <div key={source.label} className="flex items-center gap-2">
                            <span className="text-[10px] text-[#5C4A3D] w-24 truncate">{source.label}</span>
                            <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                              <div className={cn("h-full rounded-full", source.color)} style={{ width: `${source.percentage}%` }} />
                            </div>
                            <span className="text-[10px] font-semibold text-[#1D1D1D] w-8 text-right">{source.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Engagement Overview</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {ENGAGEMENT_STATS.map((stat) => (
                          <div key={stat.label} className="p-2.5 rounded-lg bg-white border border-[#E8DDD0] text-center">
                            <p className="text-[10px] text-[#5C4A3D] mb-0.5">{stat.label}</p>
                            <p className="text-lg font-bold text-[#1D1D1D]">{stat.value}</p>
                            <div className="flex items-center justify-center gap-0.5 mt-0.5">
                              {stat.up ? <ArrowUpRight className="h-3 w-3 text-emerald-600" /> : <ArrowDownRight className="h-3 w-3 text-emerald-600" />}
                              <span className="text-[9px] text-emerald-600 font-medium">{stat.change}</span>
                            </div>
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

      <motion.div variants={item} className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button key={cat.key} onClick={() => { setActiveCategory(activeCategory === cat.key && cat.key !== "all" ? "all" : cat.key); setActiveSummaryCard(null); }} className={cn("shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all", activeCategory === cat.key && cat.key !== "all" ? "text-white shadow-sm" : cat.key === "all" && activeCategory === "all" ? "bg-gray-600 text-white border-gray-600 shadow-sm" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]")} style={activeCategory === cat.key && cat.key !== "all" ? { backgroundColor: cat.activeColor.replace("bg-", ""), borderColor: cat.activeColor.replace("bg-", "") } : undefined}>
              {cat.label}
              <span className="ml-1 text-[9px] opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Most Opened</h4>
            <div className="space-y-2">
              {topOpened.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                  <span className="text-xs font-bold text-[#8A6A4A] w-4 text-center">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1D1D1D] truncate">{c.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#E8DDD0] flex-1">
                        <div className="h-full bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A] rounded-full" style={{ width: `${(c.opens / topOpened[0].opens) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-[#1D1D1D] flex-shrink-0">{c.opens.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><MousePointerClick className="h-3.5 w-3.5" />Most Clicked</h4>
            <div className="space-y-2">
              {topClicked.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                  <span className="text-xs font-bold text-[#8A6A4A] w-4 text-center">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1D1D1D] truncate">{c.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#E8DDD0] flex-1">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style={{ width: `${(c.clicks / topClicked[0].clicks) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-[#1D1D1D] flex-shrink-0">{c.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />Highest Revenue</h4>
            <div className="space-y-2">
              {topRevenue.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                  <span className="text-xs font-bold text-[#8A6A4A] w-4 text-center">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1D1D1D] truncate">{c.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#E8DDD0] flex-1">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${(c.revenue / topRevenue[0].revenue) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-[#1D1D1D] flex-shrink-0">${c.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Traffic Source Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {TRAFFIC_SOURCES.map((source) => (
                <div key={source.label} className="text-center p-3 rounded-lg bg-[#F2D8BE]/10 border border-[#D8B27A]/10">
                  <div className="h-16 flex items-end justify-center mb-2">
                    <div className={cn("w-8 rounded-t", source.color)} style={{ height: `${source.percentage * 2}px` }} />
                  </div>
                  <p className="text-lg font-bold text-[#1D1D1D]">{source.percentage}%</p>
                  <p className="text-[10px] text-[#5C4A3D] mt-0.5">{source.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Subscribers", value: "12,458", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "New This Month", value: "874", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Unsubscribed", value: "112", icon: Users, color: "text-red-500", bg: "bg-red-50" },
          { label: "Growth Rate", value: "+7.8%", icon: TrendingUp, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40" },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("rounded-lg p-2", stat.bg, stat.color)}><stat.icon className="h-4 w-4" /></div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D] mb-0.5">{stat.label}</p>
                  <p className="text-xl font-bold text-[#1D1D1D]">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="search-bar-border relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input placeholder="Search campaigns by name or type..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9 relative z-[1]" />
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
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Campaign creation started"); setQuickActionsOpen(false); }}><Megaphone className="h-3.5 w-3.5 mr-1.5" />Create Campaign</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Campaign scheduled"); setQuickActionsOpen(false); }}><Calendar className="h-3.5 w-3.5 mr-1.5" />Schedule Campaign</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Subscriber import started"); setQuickActionsOpen(false); }}><Users className="h-3.5 w-3.5 mr-1.5" />Import Subscribers</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Campaign report exporting"); setQuickActionsOpen(false); }}><Download className="h-3.5 w-3.5 mr-1.5" />Export Campaign Report</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Promotion created"); setQuickActionsOpen(false); }}><Tag className="h-3.5 w-3.5 mr-1.5" />Create Promotion</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { showNotification("success", "Newsletter queued"); setQuickActionsOpen(false); }}><Send className="h-3.5 w-3.5 mr-1.5" />Send Newsletter</Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground bg-[#F2D8BE]/15 rounded-lg px-4 py-2 border border-[#D8B27A]/10">
        <span>Showing <span className="font-semibold text-[#1D1D1D]">{displayedCampaigns.length}</span> of <span className="font-semibold text-[#1D1D1D]">{filteredCampaigns.length}</span> campaigns</span>
        <span className="hidden sm:inline text-[#E8DDD0]">|</span>
        <span><span className="text-emerald-600 font-medium">{stats.active}</span> Active</span>
        <span><span className="text-blue-600 font-medium">{stats.completed}</span> Completed</span>
        <span><span className="text-purple-600 font-medium">12,458</span> Subscribers</span>
        <span><span className="text-[#8A6A4A] font-medium">$48,620</span> Revenue</span>
      </motion.div>

      <SyncedTableScroll ref={tableScroll} loading={false}>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F2D8BE]/20 hover:bg-[#F2D8BE]/30 sticky top-0 z-10">
              <TableHead className="text-[#1D1D1D] font-semibold">Campaign Name</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden md:table-cell">Type</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell text-right">Audience</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell text-right">Opens</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden lg:table-cell text-right">Clicks</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden xl:table-cell text-right">Conversion</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold text-right">Revenue</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden xl:table-cell">Start Date</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden xl:table-cell">End Date</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-[#1D1D1D] font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedCampaigns.length === 0 ? (
              <TableRow><TableCell colSpan={11} className="text-center py-16">
                <Megaphone className="mx-auto h-10 w-10 text-[#D8B27A]/50 mb-3" />
                <p className="text-sm font-medium text-[#1D1D1D]">No campaigns found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
              </TableCell></TableRow>
            ) : (
              displayedCampaigns.map((campaign) => (
                <TableRow key={campaign.id} className="hover:bg-[#8A6A4A]/[0.04] hover:shadow-sm transition-all duration-150 cursor-default border-b border-[#E8DDD0]/50">
                  <TableCell className="py-2">
                    <p className="text-sm font-medium text-[#1D1D1D] truncate max-w-[200px]">{campaign.name}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-2">
                    <Badge variant="secondary" className={cn("text-[10px] border capitalize", getTypeBadge(campaign.type))}>{campaign.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-2 text-right">
                    <span className="text-sm text-[#5C4A3D]">{campaign.audienceSize.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-2 text-right">
                    <span className="text-sm font-medium text-[#1D1D1D]">{campaign.opens.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-2 text-right">
                    <span className="text-sm font-medium text-[#1D1D1D]">{campaign.clicks.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell py-2 text-right">
                    <span className={cn("text-sm font-bold", campaign.conversionRate >= 12 ? "text-emerald-600" : campaign.conversionRate >= 8 ? "text-[#8A6A4A]" : "text-orange-500")}>{campaign.conversionRate}%</span>
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <span className="text-sm font-bold text-[#8A6A4A]">{formatCurrency(campaign.revenue)}</span>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell py-2">
                    <p className="text-xs text-muted-foreground">{new Date(campaign.startDate).toLocaleDateString()}</p>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell py-2">
                    <p className="text-xs text-muted-foreground">{new Date(campaign.endDate).toLocaleDateString()}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-2">
                    <Badge variant="secondary" className={cn("text-[10px] border", getStatusBadge(campaign.status))}>{campaign.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => openCampaignDrawer(campaign)} title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </SyncedTableScroll>

      <motion.div variants={item} className="flex items-center justify-between">
        <p className="text-sm text-[#5C4A3D]">
          Showing <span className="font-medium text-[#1D1D1D]">{filteredCampaigns.length === 0 ? 0 : (page - 1) * pageSize + 1}</span> &ndash; <span className="font-medium text-[#1D1D1D]">{Math.min(page * pageSize, filteredCampaigns.length)}</span> of <span className="font-medium text-[#1D1D1D]">{filteredCampaigns.length}</span> campaigns
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Recent Marketing Activity</h4>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {activityLog.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 py-1.5 border-b border-[#E8DDD0]/50 last:border-0">
                  <div className={cn("h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0", getActivityBg(entry.type))}>
                    {getActivityIcon(entry.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1D1D1D]">{entry.action}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">{entry.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={campaignDrawerOpen} onOpenChange={setCampaignDrawerOpen}>
        <DialogContent className="sm:max-w-lg bg-white border-[#E8DDD0]">
          <DialogHeader>
            <DialogTitle className="text-[#1D1D1D]">{campaignDrawerData?.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Campaign details and performance metrics.
            </DialogDescription>
          </DialogHeader>
          {campaignDrawerData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#F2D8BE]/10 border border-[#D8B27A]/15">
                  <p className="text-[10px] text-[#5C4A3D] mb-0.5">Type</p>
                  <Badge variant="secondary" className={cn("text-[10px] border capitalize", getTypeBadge(campaignDrawerData.type))}>{campaignDrawerData.type}</Badge>
                </div>
                <div className="p-3 rounded-lg bg-[#F2D8BE]/10 border border-[#D8B27A]/15">
                  <p className="text-[10px] text-[#5C4A3D] mb-0.5">Status</p>
                  <Badge variant="secondary" className={cn("text-[10px] border", getStatusBadge(campaignDrawerData.status))}>{campaignDrawerData.status}</Badge>
                </div>
                <div className="p-3 rounded-lg bg-[#F2D8BE]/10 border border-[#D8B27A]/15">
                  <p className="text-[10px] text-[#5C4A3D] mb-0.5">Start Date</p>
                  <p className="text-sm font-semibold text-[#1D1D1D]">{new Date(campaignDrawerData.startDate).toLocaleDateString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#F2D8BE]/10 border border-[#D8B27A]/15">
                  <p className="text-[10px] text-[#5C4A3D] mb-0.5">End Date</p>
                  <p className="text-sm font-semibold text-[#1D1D1D]">{new Date(campaignDrawerData.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                    <p className="text-[10px] text-[#5C4A3D] mb-0.5">Audience</p>
                    <p className="text-lg font-bold text-[#1D1D1D]">{campaignDrawerData.audienceSize.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                    <p className="text-[10px] text-[#5C4A3D] mb-0.5">Opens</p>
                    <p className="text-lg font-bold text-[#1D1D1D]">{campaignDrawerData.opens.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                    <p className="text-[10px] text-[#5C4A3D] mb-0.5">Clicks</p>
                    <p className="text-lg font-bold text-[#1D1D1D]">{campaignDrawerData.clicks.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                    <p className="text-[10px] text-[#5C4A3D] mb-0.5">Conversion</p>
                    <p className="text-lg font-bold text-emerald-600">{campaignDrawerData.conversionRate}%</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                    <p className="text-[10px] text-[#5C4A3D] mb-0.5">Revenue</p>
                    <p className="text-lg font-bold text-[#8A6A4A]">{formatCurrency(campaignDrawerData.revenue)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white border border-[#E8DDD0]">
                    <p className="text-[10px] text-[#5C4A3D] mb-0.5">Open Rate</p>
                    <p className="text-lg font-bold text-[#1D1D1D]">{((campaignDrawerData.opens / campaignDrawerData.audienceSize) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Performance Bar</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-[#5C4A3D]">Opens</span>
                      <span className="font-medium text-[#1D1D1D]">{((campaignDrawerData.opens / campaignDrawerData.audienceSize) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                      <div className="h-full bg-[#8A6A4A] rounded-full" style={{ width: `${(campaignDrawerData.opens / campaignDrawerData.audienceSize) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-[#5C4A3D]">Clicks</span>
                      <span className="font-medium text-[#1D1D1D]">{((campaignDrawerData.clicks / campaignDrawerData.audienceSize) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(campaignDrawerData.clicks / campaignDrawerData.audienceSize) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-[#5C4A3D]">Conversion</span>
                      <span className="font-medium text-[#1D1D1D]">{campaignDrawerData.conversionRate}%</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${campaignDrawerData.conversionRate}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCampaignDrawerOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
