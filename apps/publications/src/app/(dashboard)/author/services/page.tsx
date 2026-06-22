"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Send,
  X,
  Trash2,
  RefreshCw,
  BarChart3,
  FolderOpen,
  ArrowUpDown,
  Check,
  Upload,
  Download,
  FileText,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

type ProjectStatus = "pending" | "in_progress" | "review" | "completed" | "cancelled";

interface Project {
  id: string;
  title: string;
  category: string;
  assignedTeam: string;
  status: ProjectStatus;
  progress: number;
  amount: number;
  started: string;
  dueDate: string;
  lastUpdate: string;
  description: string;
  milestones: { title: string; completed: boolean; date?: string }[];
  files: { name: string; date: string; type: string }[];
  messages: { from: string; text: string; time: string; unread: boolean }[];
}

const allProjects: Project[] = [
  {
    id: "p1",
    title: "Book Editing – Financial Freedom",
    category: "Editing",
    assignedTeam: "Editorial Team Alpha",
    status: "in_progress",
    progress: 65,
    amount: 580,
    started: "2025-05-10",
    dueDate: "2025-07-18",
    lastUpdate: "2 hours ago",
    description: "Full developmental and line editing for Financial Freedom manuscript.",
    milestones: [
      { title: "Requirements Submitted", completed: true, date: "May 10" },
      { title: "Developmental Edit", completed: true, date: "May 25" },
      { title: "Line Editing", completed: false },
      { title: "Author Review", completed: false },
      { title: "Final Delivery", completed: false },
    ],
    files: [
      { name: "manuscript_v2.docx", date: "May 10", type: "requirements" },
      { name: "style_guide.pdf", date: "May 12", type: "requirements" },
    ],
    messages: [
      { from: "Editor", text: "Developmental edit complete. Starting line editing.", time: "2 hours ago", unread: true },
      { from: "You", text: "Looks great, please proceed.", time: "1 day ago", unread: false },
    ],
  },
  {
    id: "p2",
    title: "Cover Design – Money Mindset",
    category: "Cover Design",
    assignedTeam: "Design Studio",
    status: "review",
    progress: 85,
    amount: 350,
    started: "2025-05-20",
    dueDate: "2025-07-15",
    lastUpdate: "5 hours ago",
    description: "Custom cover design with 3 concept revisions for Money Mindset.",
    milestones: [
      { title: "Concept Brief", completed: true, date: "May 20" },
      { title: "Initial Mockups", completed: true, date: "May 28" },
      { title: "Revision Round 1", completed: true, date: "Jun 5" },
      { title: "Final Approval", completed: false },
    ],
    files: [
      { name: "cover_brief.pdf", date: "May 20", type: "requirements" },
      { name: "mockup_v1.png", date: "May 28", type: "delivery" },
      { name: "mockup_v2.png", date: "Jun 5", type: "delivery" },
    ],
    messages: [
      { from: "Designer", text: "Uploaded revision round 1. Please review.", time: "5 hours ago", unread: true },
    ],
  },
  {
    id: "p3",
    title: "Book Formatting – Income Is A Skill",
    category: "Formatting",
    assignedTeam: "Production Team",
    status: "in_progress",
    progress: 40,
    amount: 280,
    started: "2025-06-01",
    dueDate: "2025-07-20",
    lastUpdate: "1 day ago",
    description: "Interior formatting for ebook and print editions.",
    milestones: [
      { title: "Manuscript Received", completed: true, date: "Jun 1" },
      { title: "Ebook Formatting", completed: true, date: "Jun 10" },
      { title: "Print Formatting", completed: false },
      { title: "Proof Review", completed: false },
    ],
    files: [
      { name: "manuscript_final.docx", date: "Jun 1", type: "requirements" },
    ],
    messages: [
      { from: "Formatter", text: "Ebook formatting complete. Starting print layout.", time: "1 day ago", unread: false },
    ],
  },
  {
    id: "p4",
    title: "Marketing Campaign – Wealth Series",
    category: "Marketing",
    assignedTeam: "Marketing Division",
    status: "in_progress",
    progress: 30,
    amount: 850,
    started: "2025-06-05",
    dueDate: "2025-07-22",
    lastUpdate: "3 hours ago",
    description: "Social media and email marketing campaign for Wealth book series.",
    milestones: [
      { title: "Strategy Plan", completed: true, date: "Jun 5" },
      { title: "Content Creation", completed: true, date: "Jun 12" },
      { title: "Campaign Launch", completed: false },
      { title: "Performance Report", completed: false },
    ],
    files: [
      { name: "campaign_strategy.pdf", date: "Jun 5", type: "requirements" },
      { name: "content_calendar.xlsx", date: "Jun 8", type: "requirements" },
    ],
    messages: [
      { from: "Marketing", text: "Campaign assets ready. Launch scheduled for next week.", time: "3 hours ago", unread: true },
    ],
  },
  {
    id: "p5",
    title: "ISBN Registration – Future Trends",
    category: "ISBN Services",
    assignedTeam: "Admin Team",
    status: "pending",
    progress: 10,
    amount: 75,
    started: "2025-06-15",
    dueDate: "2025-07-10",
    lastUpdate: "3 days ago",
    description: "ISBN assignment and barcode generation for upcoming book.",
    milestones: [
      { title: "Application Submitted", completed: true, date: "Jun 15" },
      { title: "ISBN Assigned", completed: false },
      { title: "Barcode Generated", completed: false },
    ],
    files: [],
    messages: [
      { from: "Admin", text: "Application received. Processing within 3-5 business days.", time: "3 days ago", unread: false },
    ],
  },
  {
    id: "p6",
    title: "Publishing Package – Digital Nomad Guide",
    category: "Publishing",
    assignedTeam: "Publishing Team Alpha",
    status: "completed",
    progress: 100,
    amount: 620,
    started: "2025-04-01",
    dueDate: "2025-06-01",
    lastUpdate: "2 weeks ago",
    description: "Full publishing package including formatting, distribution, and listings.",
    milestones: [
      { title: "Manuscript Review", completed: true, date: "Apr 5" },
      { title: "Formatting Complete", completed: true, date: "Apr 20" },
      { title: "Distribution Setup", completed: true, date: "May 5" },
      { title: "Live on Platforms", completed: true, date: "May 20" },
    ],
    files: [
      { name: "publishing_report.pdf", date: "May 20", type: "delivery" },
      { name: "distribution_guide.pdf", date: "May 20", type: "delivery" },
    ],
    messages: [],
  },
  {
    id: "p7",
    title: "Proofreading – Creative Writing 101",
    category: "Editing",
    assignedTeam: "Editorial Team Beta",
    status: "completed",
    progress: 100,
    amount: 195,
    started: "2025-05-01",
    dueDate: "2025-06-01",
    lastUpdate: "1 month ago",
    description: "Final proofreading pass for grammar, punctuation, and consistency.",
    milestones: [
      { title: "First Pass", completed: true, date: "May 8" },
      { title: "Second Pass", completed: true, date: "May 18" },
      { title: "Final Report", completed: true, date: "May 28" },
    ],
    files: [
      { name: "proofreading_report.pdf", date: "May 28", type: "delivery" },
    ],
    messages: [],
  },
];

const monthlySpending = [
  { month: "Jan", amount: 420 },
  { month: "Feb", amount: 560 },
  { month: "Mar", amount: 780 },
  { month: "Apr", amount: 620 },
  { month: "May", amount: 850 },
  { month: "Jun", amount: 680 },
];

const categoryBreakdown = [
  { name: "Editing", value: 35, color: "#8A6A4A" },
  { name: "Formatting", value: 20, color: "#D8B27A" },
  { name: "Cover Design", value: 25, color: "#F2D8BE" },
  { name: "Marketing", value: 15, color: "#E8DDD0" },
  { name: "Publishing", value: 5, color: "#1D1D1D" },
];

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-100" },
  in_progress: { label: "In Progress", color: "text-blue-700", bg: "bg-blue-100" },
  review: { label: "Review", color: "text-violet-700", bg: "bg-violet-100" },
  completed: { label: "Completed", color: "text-emerald-700", bg: "bg-emerald-100" },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-100" },
};

const categoryTabs = [
  { key: "all", label: "All Services", icon: Package },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "in_progress", label: "In Progress", icon: BarChart3 },
  { key: "review", label: "Review", icon: Eye },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
  { key: "cancelled", label: "Cancelled", icon: AlertTriangle },
];

const recentActivity = [
  { id: 1, icon: Edit, bg: "bg-blue-100", color: "text-blue-600", text: "Line editing phase started for Financial Freedom", time: "2 hours ago" },
  { id: 2, icon: Upload, bg: "bg-violet-100", color: "text-violet-600", text: "Cover mockup v2 uploaded for Money Mindset", time: "5 hours ago" },
  { id: 3, icon: RefreshCw, bg: "bg-amber-100", color: "text-amber-600", text: "Cover design revision requested for Money Mindset", time: "1 day ago" },
];

export default function AuthorServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [drawerProject, setDrawerProject] = useState<Project | null>(null);
  const [sortBy, setSortBy] = useState("lastUpdate");
  const [pageCounter, setPageCounter] = useState(20);
  const [showPageCounter, setShowPageCounter] = useState(false);

  const filteredProjects = useMemo(() => {
    let result = [...allProjects];
    if (activeCategory !== "all") {
      result = result.filter((p) => p.status === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.assignedTeam.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "title": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "amount": result.sort((a, b) => b.amount - a.amount); break;
      case "dueDate": result.sort((a, b) => a.dueDate.localeCompare(b.dueDate)); break;
      case "lastUpdate": default: break;
    }
    return result;
  }, [activeCategory, search, sortBy]);

  const displayedProjects = useMemo(() => {
    if (pageCounter === 999) return filteredProjects;
    return filteredProjects.slice(0, pageCounter);
  }, [filteredProjects, pageCounter]);

  const activeCount = allProjects.filter((p) => p.status === "in_progress").length;
  const pendingCount = allProjects.filter((p) => p.status === "pending").length;
  const completedCount = allProjects.filter((p) => p.status === "completed").length;
  const totalSpent = allProjects.reduce((sum, p) => sum + p.amount, 0);

  const handleCardClick = useCallback((key: string) => {
    setActiveCategory(prev => prev === key ? "all" : key);
  }, []);

  const handleViewAll = useCallback(() => {
    setActiveCategory("all");
    setSearch("");
    setSortBy("lastUpdate");
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D1D1D]">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your publishing projects and track progress</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="refresh-btn-border rounded-lg p-[2px]">
            <Button variant="outline" size="icon" className="rounded-[calc(0.5rem-2px)] bg-white hover:bg-[#F5EDE3] border-0" onClick={() => {}}>
              <RefreshCw className="h-4 w-4 text-[#8A6A4A]" />
            </Button>
          </div>
          <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg" asChild>
            <Link href="/services">
              Browse Service Marketplace
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* 2. Summary Cards (Clickable) */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { key: "all", label: "TOTAL SERVICES", value: allProjects.length, icon: Package, bg: "bg-[#F5EDE3]", color: "text-[#8A6A4A]" },
          { key: "pending", label: "PENDING SERVICES", value: pendingCount, icon: Clock, bg: "bg-amber-100", color: "text-amber-600" },
          { key: "completed", label: "COMPLETED SERVICES", value: completedCount, icon: CheckCircle2, bg: "bg-emerald-100", color: "text-emerald-600" },
          { key: "spent", label: "TOTAL SPENT", value: `$${totalSpent.toLocaleString()}`, icon: DollarSign, bg: "bg-violet-100", color: "text-violet-600" },
        ].map((s) => (
          <motion.div
            key={s.key}
            whileHover={{ y: -2 }}
            onClick={() => s.key !== "spent" && handleCardClick(s.key)}
            className={`bg-white rounded-xl p-4 flex items-center justify-between transition-all ${
              s.key === "spent"
                ? "border border-[#E8DDD0] cursor-default"
                : activeCategory === s.key
                  ? "ring-2 ring-[#8A6A4A] ring-offset-2 shadow-md cursor-pointer"
                  : "border border-[#E8DDD0] hover:shadow-md cursor-pointer"
            }`}
          >
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-[#1D1D1D] mt-1">{s.value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 3. Service Analytics Center (collapsed by default) */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-[#E8DDD0]">
          <h3 className="font-semibold text-[#1D1D1D]">Service Analytics Center</h3>
          <Button variant="ghost" size="sm" onClick={() => setAnalyticsOpen(!analyticsOpen)} className="text-muted-foreground hover:text-[#1D1D1D]">
            {analyticsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <AnimatePresence>
          {analyticsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Monthly Service Spending</h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={monthlySpending}>
                        <defs>
                          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D8B27A" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#D8B27A" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8DDD0", background: "white" }} formatter={(value) => [`$${value}`, "Spent"]} />
                        <Area type="monotone" dataKey="amount" stroke="#D8B27A" fill="url(#spendGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-[#F5EDE3]/30 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-[#1D1D1D] mb-3">Category Breakdown</h4>
                    <div className="flex items-center gap-6">
                      <ResponsiveContainer width={140} height={140}>
                        <PieChart>
                          <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                            {categoryBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 flex-1">
                        {categoryBreakdown.map((c) => (
                          <div key={c.name} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                            <span className="text-xs text-muted-foreground flex-1">{c.name}</span>
                            <span className="text-xs font-medium text-[#1D1D1D]">{c.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "THIS MONTH", value: "$850" },
                    { label: "LAST MONTH", value: "$620" },
                    { label: "AVG PROJECT", value: `$${Math.round(totalSpent / allProjects.length)}` },
                    { label: "ON-TIME RATE", value: "89%" },
                  ].map((m) => (
                    <div key={m.label} className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                      <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">{m.label}</p>
                      <p className="text-xl font-bold text-[#1D1D1D] mt-1">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 4. Search & Filter Module */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="search-bar-border relative flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-[calc(0.5rem-2px)] border-0 bg-white text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-[calc(0.5rem-2px)] bg-white hover:bg-[#F5EDE3] border-0 text-sm">
                    <ArrowUpDown className="h-4 w-4 mr-1.5" /> Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg">
                  <DropdownMenuItem onClick={() => setSortBy("lastUpdate")} className="text-sm">{sortBy === "lastUpdate" && <Check className="h-4 w-4 mr-2" />} Last Update</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("title")} className="text-sm">{sortBy === "title" && <Check className="h-4 w-4 mr-2" />} Title A-Z</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("amount")} className="text-sm">{sortBy === "amount" && <Check className="h-4 w-4 mr-2" />} Amount</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("dueDate")} className="text-sm">{sortBy === "dueDate" && <Check className="h-4 w-4 mr-2" />} Due Date</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <div className="relative">
                <Button variant="outline" size="sm" className="rounded-[calc(0.5rem-2px)] bg-white hover:bg-[#F5EDE3] border-0 text-sm" onClick={() => setShowPageCounter(!showPageCounter)}>
                  Show: {pageCounter === 999 ? "All" : pageCounter}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
                <AnimatePresence>
                  {showPageCounter && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 top-full mt-1 bg-white border border-[#E8DDD0] rounded-xl shadow-lg z-30 py-1 min-w-[100px]"
                    >
                      {[10, 20, 50, 100, 999].map((n) => (
                        <button
                          key={n}
                          onClick={() => { setPageCounter(n); setShowPageCounter(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5EDE3] transition-colors ${pageCounter === n ? "font-medium text-[#8A6A4A] bg-[#F5EDE3]/50" : "text-[#1D1D1D]"}`}
                        >
                          {n === 999 ? "All" : n}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {activeCategory !== "all" && (
              <Button variant="ghost" size="sm" className="text-[#8A6A4A] hover:text-[#6B5538] text-xs" onClick={handleViewAll}>
                View All
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === tab.key
                  ? "bg-[#D8B27A] text-[#1D1D1D]"
                  : "bg-[#F5EDE3] text-muted-foreground hover:bg-[#E8DDD0]"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 5. Services Table */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm overflow-hidden">
        {displayedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 bg-[#F5EDE3] rounded-full mb-4">
              <FolderOpen className="h-10 w-10 text-[#8A6A4A]" />
            </div>
            <p className="text-lg font-semibold text-[#1D1D1D]">No Services Found</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Try adjusting your search or filters.</p>
            <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg" asChild>
              <Link href="/services">Browse Marketplace</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8DDD0] bg-[#F5EDE3]/30">
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">SERVICE</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">CATEGORY</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">TEAM</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">STATUS</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">PROGRESS</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">AMOUNT</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">DUE DATE</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {displayedProjects.map((project) => {
                  const status = statusConfig[project.status];
                  return (
                    <tr
                      key={project.id}
                      className="border-b border-[#E8DDD0]/50 hover:bg-[#F5EDE3]/50 transition-colors cursor-pointer"
                      onClick={() => setDrawerProject(project)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2D8BE]/50">
                            <FileText className="h-5 w-5 text-[#8A6A4A]" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-[#1D1D1D]">{project.title}</p>
                            <p className="text-xs text-muted-foreground">Started {project.started}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{project.category}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{project.assignedTeam}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-[#F5EDE3] rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                project.progress === 100 ? "bg-emerald-500" : project.progress >= 60 ? "bg-[#D8B27A]" : "bg-blue-500"
                              }`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-[#1D1D1D]">${project.amount}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{project.dueDate}</td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg">
                            <DropdownMenuItem onClick={() => setDrawerProject(project)}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" /> Message Team
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" /> Download Files
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" /> Cancel Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* 6. Page Count / Pagination (Clean) */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <span>Showing {displayedProjects.length} of {filteredProjects.length} services</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-lg border-[#E8DDD0]" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-[#8A6A4A] bg-[#F5EDE3] px-3 py-1 rounded-lg">1</span>
          <Button variant="outline" size="icon" className="rounded-lg border-[#E8DDD0]" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* 7. Recent Activity (Compact) */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-[#E8DDD0]">
          <h3 className="font-semibold text-[#1D1D1D]">Recent Activity</h3>
        </div>
        <div className="divide-y divide-[#E8DDD0]/50">
          {recentActivity.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-4 hover:bg-[#F5EDE3]/30 transition-colors">
              <div className={`p-2 rounded-lg ${a.bg} shrink-0`}>
                <a.icon className={`h-4 w-4 ${a.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1D1D1D] truncate">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Project Details Drawer */}
      <AnimatePresence>
        {drawerProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setDrawerProject(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl rounded-l-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1D1D1D]">Project Details</h2>
                  <button onClick={() => setDrawerProject(null)} className="p-2 hover:bg-[#F5EDE3] rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">{drawerProject.title}</h3>
                  <p className="text-sm text-muted-foreground">{drawerProject.description}</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`text-sm font-medium ${statusConfig[drawerProject.status as keyof typeof statusConfig].color}`}>{statusConfig[drawerProject.status as keyof typeof statusConfig].label}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-bold text-[#1D1D1D]">{drawerProject.progress}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-sm font-bold text-[#1D1D1D]">${drawerProject.amount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Due Date</span>
                    <span className="text-sm font-medium text-[#1D1D1D]">{drawerProject.dueDate}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Team</span>
                    <span className="text-sm font-medium text-[#1D1D1D]">{drawerProject.assignedTeam}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-medium text-[#1D1D1D]">{drawerProject.category}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="w-full bg-[#F5EDE3] rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        drawerProject.progress === 100 ? "bg-emerald-500" : "bg-[#D8B27A]"
                      }`}
                      style={{ width: `${drawerProject.progress}%` }}
                    />
                  </div>
                </div>
                <h4 className="font-semibold text-[#1D1D1D] mb-3">Project Timeline</h4>
                <div className="space-y-0 mb-6">
                  {drawerProject.milestones.map((milestone, i) => (
                    <div key={i} className="flex gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${milestone.completed ? "bg-[#8A6A4A]" : "bg-[#E8DDD0]"} z-10 mt-1`} />
                        {i < drawerProject.milestones.length - 1 && <div className="w-px flex-1 bg-[#E8DDD0]" />}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm ${milestone.completed ? "text-muted-foreground line-through" : "text-[#1D1D1D] font-medium"}`}>
                          {milestone.title}
                        </p>
                        {milestone.date && (
                          <p className="text-xs text-muted-foreground mt-0.5">{milestone.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {drawerProject.messages.length > 0 && (
                  <>
                    <h4 className="font-semibold text-[#1D1D1D] mb-3">Messages</h4>
                    <div className="space-y-2 mb-6">
                      {drawerProject.messages.map((msg, i) => (
                        <div key={i} className={`rounded-lg border p-3 ${
                          msg.unread ? "border-[#D8B27A]/50 bg-[#F2D8BE]/10" : "border-[#E8DDD0]"
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[#1D1D1D]">{msg.from}</span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {drawerProject.files.length > 0 && (
                  <>
                    <h4 className="font-semibold text-[#1D1D1D] mb-3">Files</h4>
                    <div className="space-y-2 mb-6">
                      {drawerProject.files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border border-[#E8DDD0] p-2.5">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#8A6A4A]" />
                            <span className="text-sm text-[#1D1D1D]">{file.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg">
                    <Send className="mr-2 h-4 w-4" />
                    Message Team
                  </Button>
                  <Button variant="outline" className="rounded-lg border-[#E8DDD0]">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
