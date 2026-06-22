"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  CalendarDays,
  ExternalLink,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  FileText,
  Upload,
  Send,
  AlertCircle,
  Star,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  X,
  Archive,
  Trash2,
  RefreshCw,
  Headphones,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
  FolderOpen,
  Bell,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const categories = [
  { label: "All Projects", value: "all", count: allProjects.length },
  { label: "Pending", value: "pending", count: allProjects.filter((p) => p.status === "pending").length },
  { label: "In Progress", value: "in_progress", count: allProjects.filter((p) => p.status === "in_progress").length },
  { label: "Review", value: "review", count: allProjects.filter((p) => p.status === "review").length },
  { label: "Completed", value: "completed", count: allProjects.filter((p) => p.status === "completed").length },
  { label: "Cancelled", value: "cancelled", count: allProjects.filter((p) => p.status === "cancelled").length },
];

const summaryCards = [
  { label: "Active Projects", value: "5", icon: Package, color: "bg-blue-100 text-blue-600", href: "#projects" },
  { label: "Pending Projects", value: "2", icon: Clock, color: "bg-amber-100 text-amber-600", href: "#projects" },
  { label: "Completed Projects", value: "18", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600", href: "#projects" },
  { label: "Total Spent", value: "$4,860", icon: DollarSign, color: "bg-violet-100 text-violet-600", href: "#spending" },
  { label: "Messages", value: "7", icon: MessageSquare, color: "bg-pink-100 text-pink-600", href: "#messages" },
  { label: "Due This Week", value: "3", icon: CalendarDays, color: "bg-orange-100 text-orange-600", href: "#deliveries" },
];

const recentActivity = [
  { title: "Editing Project Updated", desc: "Line editing phase started for Financial Freedom", time: "2 hours ago", icon: Edit, color: "text-blue-600 bg-blue-100" },
  { title: "Designer Uploaded Files", desc: "Cover mockup v2 uploaded for Money Mindset", time: "5 hours ago", icon: Upload, color: "text-violet-600 bg-violet-100" },
  { title: "Revision Requested", desc: "Cover design revision for Money Mindset", time: "1 day ago", icon: RefreshCw, color: "text-amber-600 bg-amber-100" },
  { title: "Project Completed", desc: "Publishing package for Digital Nomad Guide finished", time: "2 weeks ago", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100" },
  { title: "Invoice Generated", desc: "Invoice #INV-2025-006 for Marketing Campaign", time: "3 days ago", icon: FileText, color: "text-[#8A6A4A] bg-[#F2D8BE]" },
];

const upcomingDeliveries = [
  { project: "Cover Design – Money Mindset", due: "Jul 15, 2025", daysLeft: 2, status: "review" as const },
  { project: "Editing – Financial Freedom", due: "Jul 18, 2025", daysLeft: 5, status: "in_progress" as const },
  { project: "Marketing Campaign – Wealth Series", due: "Jul 22, 2025", daysLeft: 9, status: "in_progress" as const },
];

const spendingInsights = {
  thisMonth: 850,
  lastMonth: 620,
  mostOrdered: "Editing",
  highestCost: "Marketing Campaign",
};

export default function AuthorServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [drawerProject, setDrawerProject] = useState<Project | null>(null);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

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
    return result;
  }, [activeCategory, search]);

  const totalMessages = allProjects.reduce((sum, p) => sum + p.messages.filter((m) => m.unread).length, 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Marketplace Access CTA */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8A6A4A] via-[#D8B27A] to-[#8A6A4A] p-[1px]">
          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1D1D1D]">Browse Publishing Services</h2>
                <p className="mt-1 text-sm text-[#6A4E37]">
                  Explore editing, publishing, formatting, cover design, marketing, and author support services.
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
                  <Link href="/services">
                    Browse Service Marketplace
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="border-[#E8DDD0]">
                  <Link href="/services">View Featured Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Summary Cards */}
      <motion.div variants={item} className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((card) => (
          <a key={card.label} href={card.href}>
            <Card className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-[#E8DDD0]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2.5 ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1D1D1D]">{card.value}</p>
                    <p className="text-xs text-[#6A4E37]">{card.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </motion.div>

      {/* 3. Filter Bar */}
      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A6A4A]" />
          <Input
            placeholder="Search projects, categories, teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-[#E8DDD0] focus:border-[#D8B27A] focus:ring-[#D8B27A]/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-[#E8DDD0]">
                <Filter className="mr-2 h-4 w-4" />
                Quick Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/services">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Browse Marketplace
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="mr-2 h-4 w-4" />
                Upload Requirements
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Headphones className="mr-2 h-4 w-4" />
                Contact Support
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Request Revision
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Service History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="border-[#E8DDD0]">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* 4. Category Tabs */}
      <motion.div variants={item} className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.value
                ? "bg-[#D8B27A] text-[#1D1D1D] shadow-sm"
                : "bg-white text-[#6A4E37] border border-[#E8DDD0] hover:bg-[#F5EDE3]"
            }`}
          >
            {cat.label}
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${
              activeCategory === cat.value ? "bg-[#1D1D1D] text-white" : "bg-[#E8DDD0] text-[#6A4E37]"
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* 5. Analytics Center (collapsible) */}
      <motion.div variants={item}>
        <Card className="border border-[#E8DDD0]">
          <button
            onClick={() => setAnalyticsOpen(!analyticsOpen)}
            className="flex w-full items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-[#8A6A4A]" />
              <h3 className="font-semibold text-[#1D1D1D]">Service Analytics Center</h3>
            </div>
            <ChevronDown className={`h-5 w-5 text-[#6A4E37] transition-transform duration-200 ${analyticsOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {analyticsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid gap-4 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Monthly Spending Chart */}
                  <div className="bg-white rounded-xl border border-[#E8DDD0] p-4">
                    <h4 className="font-medium text-[#1D1D1D] mb-3 text-sm">Monthly Service Spending</h4>
                    <ResponsiveContainer width="100%" height={200}>
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
                        <Tooltip
                          contentStyle={{ borderRadius: "12px", border: "1px solid #E8DDD0" }}
                          formatter={(value) => [`$${value}`, "Spent"]}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#D8B27A" fill="url(#spendGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category Breakdown */}
                  <div className="bg-white rounded-xl border border-[#E8DDD0] p-4">
                    <h4 className="font-medium text-[#1D1D1D] mb-3 text-sm">Category Breakdown</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: "12px", border: "1px solid #E8DDD0" }}
                          formatter={(value) => [`${value}%`, "Share"]}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Key Metrics */}
                  <div className="bg-white rounded-xl border border-[#E8DDD0] p-4 space-y-4">
                    <h4 className="font-medium text-[#1D1D1D] text-sm">Key Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6A4E37]">Average Delivery</span>
                        <span className="font-semibold text-[#1D1D1D]">8 Days</span>
                      </div>
                      <div className="w-full bg-[#F5EDE3] rounded-full h-2">
                        <div className="bg-[#D8B27A] h-2 rounded-full" style={{ width: "72%" }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6A4E37]">Satisfaction Rate</span>
                        <span className="font-semibold text-[#1D1D1D]">94%</span>
                      </div>
                      <div className="w-full bg-[#F5EDE3] rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "94%" }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6A4E37]">On-Time Delivery</span>
                        <span className="font-semibold text-[#1D1D1D]">89%</span>
                      </div>
                      <div className="w-full bg-[#F5EDE3] rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "89%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* 6. Spending Insights + Upcoming Deliveries */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        {/* Spending Insights */}
        <Card className="border border-[#E8DDD0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#8A6A4A]" />
              Spending Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#F5EDE3]/50 p-3">
                <p className="text-xs text-[#6A4E37]">This Month</p>
                <p className="text-xl font-bold text-[#1D1D1D]">${spendingInsights.thisMonth}</p>
                <p className="text-xs text-emerald-600">+37% from last month</p>
              </div>
              <div className="rounded-xl bg-[#F5EDE3]/50 p-3">
                <p className="text-xs text-[#6A4E37]">Last Month</p>
                <p className="text-xl font-bold text-[#1D1D1D]">${spendingInsights.lastMonth}</p>
              </div>
              <div className="rounded-xl bg-[#F5EDE3]/50 p-3">
                <p className="text-xs text-[#6A4E37]">Most Ordered</p>
                <p className="text-lg font-bold text-[#1D1D1D]">{spendingInsights.mostOrdered}</p>
              </div>
              <div className="rounded-xl bg-[#F5EDE3]/50 p-3">
                <p className="text-xs text-[#6A4E37]">Highest Cost</p>
                <p className="text-lg font-bold text-[#1D1D1D]">{spendingInsights.highestCost}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deliveries */}
        <Card className="border border-[#E8DDD0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#8A6A4A]" />
              Upcoming Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeliveries.map((delivery, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-[#E8DDD0] p-3 hover:bg-[#F5EDE3]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${
                    delivery.daysLeft <= 3 ? "bg-red-100" : "bg-amber-100"
                  }`}>
                    <CalendarDays className={`h-4 w-4 ${
                      delivery.daysLeft <= 3 ? "text-red-600" : "text-amber-600"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1D]">{delivery.project}</p>
                    <p className="text-xs text-[#6A4E37]">Due {delivery.due}</p>
                  </div>
                </div>
                <Badge className={delivery.daysLeft <= 3 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}>
                  {delivery.daysLeft} days left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* 7. Project Table */}
      <motion.div variants={item} id="projects">
        <Card className="border border-[#E8DDD0]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8DDD0] bg-[#F5EDE3]/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6A4E37]">Project</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6A4E37]">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6A4E37]">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6A4E37]">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6A4E37]">Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6A4E37]">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6A4E37]">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6A4E37]">Last Update</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[#6A4E37]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => {
                    const status = statusConfig[project.status];
                    return (
                      <tr
                        key={project.id}
                        className="border-b border-[#E8DDD0]/50 transition-colors hover:bg-[#F5EDE3]/30 cursor-pointer"
                        onClick={() => setDrawerProject(project)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2D8BE]/50">
                              <FileText className="h-5 w-5 text-[#8A6A4A]" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-[#1D1D1D]">{project.title}</p>
                              <p className="text-xs text-[#6A4E37]">Started {project.started}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6A4E37]">{project.category}</td>
                        <td className="px-4 py-3 text-sm text-[#6A4E37]">{project.assignedTeam}</td>
                        <td className="px-4 py-3">
                          <Badge className={`${status.bg} ${status.color} border-0`}>{status.label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-24">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-[#6A4E37]">{project.progress}%</span>
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
                        <td className="px-4 py-3 text-sm font-medium text-[#1D1D1D]">${project.amount}</td>
                        <td className="px-4 py-3 text-sm text-[#6A4E37]">{project.dueDate}</td>
                        <td className="px-4 py-3 text-sm text-[#6A4E37]">{project.lastUpdate}</td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDrawerProject(project)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Message Team
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Files
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Project
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
            {filteredProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <FolderOpen className="h-12 w-12 text-[#E8DDD0] mb-4" />
                <p className="text-lg font-medium text-[#1D1D1D]">No Projects Found</p>
                <p className="text-sm text-[#6A4E37] mt-1">Try adjusting your search or filters.</p>
                <Button asChild className="mt-4 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
                  <Link href="/services">Browse Marketplace</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 8. Recent Activity + Messages Center */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border border-[#E8DDD0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#8A6A4A]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-[#E8DDD0]/50 p-3 hover:bg-[#F5EDE3]/30 transition-colors">
                <div className={`rounded-lg p-2 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1D1D1D]">{activity.title}</p>
                  <p className="text-xs text-[#6A4E37] truncate">{activity.desc}</p>
                  <p className="text-xs text-[#8A6A4A] mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Messages Center */}
        <Card className="border border-[#E8DDD0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#8A6A4A]" />
              Messages
              {totalMessages > 0 && (
                <Badge className="bg-red-500 text-white text-xs ml-1">{totalMessages}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allProjects
              .filter((p) => p.messages.length > 0)
              .slice(0, 5)
              .map((project) =>
                project.messages.slice(0, 1).map((msg, i) => (
                  <div
                    key={`${project.id}-${i}`}
                    className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
                      msg.unread ? "bg-[#F2D8BE]/20 border border-[#D8B27A]/30" : "border border-[#E8DDD0]/50 hover:bg-[#F5EDE3]/30"
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2D8BE]">
                      <Users className="h-4 w-4 text-[#8A6A4A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#1D1D1D]">{msg.from}</p>
                        {msg.unread && <div className="h-2 w-2 rounded-full bg-[#D8B27A]" />}
                      </div>
                      <p className="text-xs text-[#6A4E37] truncate">{msg.text}</p>
                      <p className="text-xs text-[#8A6A4A] mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))
              )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 9. Project Files */}
      <motion.div variants={item}>
        <Card className="border border-[#E8DDD0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-[#8A6A4A]" />
              Project Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8DDD0]">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6A4E37]">File Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6A4E37]">Project</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6A4E37]">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#6A4E37]">Date</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-[#6A4E37]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allProjects
                    .flatMap((p) =>
                      p.files.map((f) => ({ ...f, project: p.title }))
                    )
                    .slice(0, 8)
                    .map((file, i) => (
                      <tr key={i} className="border-b border-[#E8DDD0]/50 hover:bg-[#F5EDE3]/30 transition-colors">
                        <td className="px-4 py-2.5 text-sm font-medium text-[#1D1D1D]">{file.name}</td>
                        <td className="px-4 py-2.5 text-sm text-[#6A4E37]">{file.project}</td>
                        <td className="px-4 py-2.5">
                          <Badge className={`text-xs ${
                            file.type === "delivery" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {file.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-[#6A4E37]">{file.date}</td>
                        <td className="px-4 py-2.5 text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 10. Pagination Summary */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-[#F5EDE3]/30 border border-[#E8DDD0] px-4 py-3">
          <p className="text-sm text-[#6A4E37]">
            Showing <span className="font-medium text-[#1D1D1D]">{filteredProjects.length}</span> of{" "}
            <span className="font-medium text-[#1D1D1D]">{allProjects.length}</span> projects
          </p>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#6A4E37]">Active: <span className="font-medium text-[#1D1D1D]">{allProjects.filter((p) => p.status === "in_progress").length}</span></span>
            <span className="text-[#6A4E37]">Pending: <span className="font-medium text-[#1D1D1D]">{allProjects.filter((p) => p.status === "pending").length}</span></span>
            <span className="text-[#6A4E37]">Review: <span className="font-medium text-[#1D1D1D]">{allProjects.filter((p) => p.status === "review").length}</span></span>
            <span className="text-[#6A4E37]">Completed: <span className="font-medium text-[#1D1D1D]">{allProjects.filter((p) => p.status === "completed").length}</span></span>
          </div>
        </div>
      </motion.div>

      {/* 11. Project Details Drawer */}
      <AnimatePresence>
        {drawerProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setDrawerProject(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-[#E8DDD0] p-4 flex items-center justify-between z-10">
                <h3 className="font-semibold text-[#1D1D1D]">Project Details</h3>
                <Button variant="ghost" size="icon" onClick={() => setDrawerProject(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6 space-y-6">
                {/* Project Info */}
                <div>
                  <h4 className="font-semibold text-[#1D1D1D] mb-2">{drawerProject.title}</h4>
                  <p className="text-sm text-[#6A4E37]">{drawerProject.description}</p>
                </div>

                {/* Status & Progress */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F5EDE3]/50 p-3">
                    <p className="text-xs text-[#6A4E37]">Status</p>
                    <Badge className={`${statusConfig[drawerProject.status].bg} ${statusConfig[drawerProject.status].color} mt-1`}>
                      {statusConfig[drawerProject.status].label}
                    </Badge>
                  </div>
                  <div className="rounded-xl bg-[#F5EDE3]/50 p-3">
                    <p className="text-xs text-[#6A4E37]">Progress</p>
                    <p className="text-xl font-bold text-[#1D1D1D]">{drawerProject.progress}%</p>
                  </div>
                  <div className="rounded-xl bg-[#F5EDE3]/50 p-3">
                    <p className="text-xs text-[#6A4E37]">Amount</p>
                    <p className="text-xl font-bold text-[#1D1D1D]">${drawerProject.amount}</p>
                  </div>
                  <div className="rounded-xl bg-[#F5EDE3]/50 p-3">
                    <p className="text-xs text-[#6A4E37]">Due Date</p>
                    <p className="text-sm font-medium text-[#1D1D1D]">{drawerProject.dueDate}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <p className="text-sm font-medium text-[#1D1D1D] mb-2">Progress</p>
                  <div className="w-full bg-[#F5EDE3] rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        drawerProject.progress === 100 ? "bg-emerald-500" : "bg-[#D8B27A]"
                      }`}
                      style={{ width: `${drawerProject.progress}%` }}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-sm font-medium text-[#1D1D1D] mb-3">Project Timeline</p>
                  <div className="space-y-0">
                    {drawerProject.milestones.map((milestone, i) => (
                      <div key={i} className="flex items-start gap-3 pb-4 relative">
                        {i < drawerProject.milestones.length - 1 && (
                          <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[#E8DDD0]" />
                        )}
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          milestone.completed ? "bg-emerald-100" : "bg-[#F5EDE3]"
                        }`}>
                          {milestone.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <div className="h-2.5 w-2.5 rounded-full bg-[#E8DDD0]" />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm ${milestone.completed ? "text-[#6A4E37] line-through" : "text-[#1D1D1D] font-medium"}`}>
                            {milestone.title}
                          </p>
                          {milestone.date && (
                            <p className="text-xs text-[#8A6A4A]">{milestone.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Files */}
                {drawerProject.files.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1D] mb-3">Files</p>
                    <div className="space-y-2">
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
                  </div>
                )}

                {/* Messages */}
                {drawerProject.messages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1D] mb-3">Messages</p>
                    <div className="space-y-2">
                      {drawerProject.messages.map((msg, i) => (
                        <div key={i} className={`rounded-lg border p-3 ${
                          msg.unread ? "border-[#D8B27A]/50 bg-[#F2D8BE]/10" : "border-[#E8DDD0]"
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[#1D1D1D]">{msg.from}</span>
                            <span className="text-xs text-[#8A6A4A]">{msg.time}</span>
                          </div>
                          <p className="text-sm text-[#6A4E37]">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
                    <Send className="mr-2 h-4 w-4" />
                    Message Team
                  </Button>
                  <Button variant="outline" className="border-[#E8DDD0]">
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
