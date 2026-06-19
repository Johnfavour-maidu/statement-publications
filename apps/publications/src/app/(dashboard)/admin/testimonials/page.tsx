"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Trash2, Eye, RefreshCw, Star, BarChart3,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Clock,
  MessageSquare, Download, Upload, Edit3, X,
  Eye as EyeIcon, SlidersHorizontal, Quote, CheckCircle2,
  FileText, User, FileUp, Activity, Zap, Video, Shield,
  TrendingUp, Share2, MousePointerClick, Award,
  Globe, ExternalLink, Send,
  Monitor, Smartphone, Tablet, Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { actionHistory } from "@/lib/action-history";
import { SyncedTableScroll, type SyncedTableScrollHandle } from "@/components/ui/synced-table-scroll";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

type TestimonialStatus = "published" | "pending";

interface TestimonialRecord {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  status: TestimonialStatus;
  featured: boolean;
  views: number;
  submittedAt: string;
  updatedAt: string;
  type: "text" | "image" | "video";
  videoUrl?: string;
  imageUrl?: string;
  verifiedAuthor: boolean;
  serviceCompleted: boolean;
  publishedBooks: number;
  accountAgeDays: number;
  ratingConsistency: number;
  clicks: number;
  shares: number;
  featuredAppearances: number;
  customerReputation: {
    totalTestimonialsSubmitted: number;
    averageRatingGiven: number;
    servicesPurchased: number;
    booksPublished: number;
  };
  engagementTimeline: Array<{
    event: "submitted" | "approved" | "featured" | "edited" | "viewed" | "shared";
    timestamp: string;
  }>;
  websiteUrl?: string;
  featuredStartDate?: string;
  featuredEndDate?: string;
}

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "name-az", label: "Name A-Z" },
  { value: "name-za", label: "Name Z-A" },
  { value: "rating-high", label: "Highest Rating" },
  { value: "rating-low", label: "Lowest Rating" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "video-first", label: "Video First" },
];

const MONTHLY_GROWTH = [
  { month: "Jan", testimonials: 5 }, { month: "Feb", testimonials: 7 },
  { month: "Mar", testimonials: 9 }, { month: "Apr", testimonials: 8 },
  { month: "May", testimonials: 11 }, { month: "Jun", testimonials: 8 },
];

function calculateTrustScore(t: { verifiedAuthor: boolean; serviceCompleted: boolean; publishedBooks: number; accountAgeDays: number; ratingConsistency: number; rating: number }): number {
  const verifiedScore = t.verifiedAuthor ? 25 : 0;
  const serviceScore = t.serviceCompleted ? 20 : 0;
  const booksScore = Math.min(t.publishedBooks * 5, 20);
  const ageScore = Math.min(Math.floor(t.accountAgeDays / 30) * 2, 15);
  const consistencyScore = Math.round(t.ratingConsistency * 10);
  const ratingBonus = t.rating >= 4 ? 5 : t.rating >= 3 ? 2 : 0;
  return Math.min(verifiedScore + serviceScore + booksScore + ageScore + consistencyScore + ratingBonus, 100);
}

function getTrustLevel(score: number): { label: string; color: string; bgColor: string } {
  if (score >= 95) return { label: "Highly Trusted", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" };
  if (score >= 80) return { label: "Trusted", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" };
  if (score >= 60) return { label: "Moderate", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" };
  return { label: "Review Needed", color: "text-red-700", bgColor: "bg-red-50 border-red-200" };
}

function generateDemoTestimonials(): TestimonialRecord[] {
  const names = [
    "Sarah Mitchell", "James Cooper", "Emily Watson", "Michael Brown", "Olivia Carter",
    "David Kim", "Rachel Green", "Thomas Anderson", "Jennifer Lee", "Robert Taylor",
    "Amanda Foster", "Christopher Davis", "Michelle Johnson", "Daniel Martinez", "Laura Wilson",
    "Andrew Thompson", "Stephanie Clark", "Brian Lewis", "Nicole Walker", "Kevin Hall",
    "Elizabeth Allen", "Mark Young", "Katherine King", "Steven Wright", "Diana Lopez",
    "Patrick Hill", "Sandra Scott", "Gregory Adams", "Margaret Baker", "Timothy Nelson",
    "Catherine Mitchell", "Larry Campbell", "Brenda Parker", "Frank Evans", "Janet Edwards",
    "Jeffrey Collins", "Sharon Stewart", "Russell Sanchez", "Carol Morris", "Vincent Rogers",
    "Teresa Reed", "Henry Cook", "Angela Morgan", "Philip Bell", "Louise Murphy",
    "Alexander Bailey", "Martha Rivera", "Raymond Cooper",
  ];
  const roles = [
    "Author", "Business Author", "Personal Development Author", "Entrepreneur", "Author",
    "Fiction Author", "Memoir Writer", "Self-Help Author", "Academic Author", "Poet",
    "Children's Book Author", "Science Fiction Author", "Historical Fiction Author", "Biography Author", "Essayist",
    "Travel Writer", "Food Writer", "Health & Wellness Author", "Finance Author", "Technology Author",
    "Motivational Speaker", "Journalist", "Screenwriter", "Content Creator", "Blog Author",
  ];
  const companies = [
    "Mitchell Publishing Co.", "Cooper Enterprises", "Watson Writes LLC", "Brown & Associates",
    "Carter Media Group", "Green Leaf Press", "Anderson House", "Lee Publications",
    "Taylor & Co.", "Foster Books Inc.", "Davis Digital", "Johnson Media",
    "Martinez Works", "Wilson Publishing", "Thompson Press", "Clark Creative",
    "Lewis Publishing", "Walker Books", "Allen & Associates", "Young Media",
    "King Publications", "Wright Books", "Lopez Media", "Hill Publishing",
    "Scott Press", "Adams Books", "Baker Media", "Nelson Publishing",
    "Mitchell Press", "Campbell Books", "Parker Media", "Evans Publishing",
    "Edwards Press", "Collins Books", "Stewart Media", "Sanchez Publishing",
    "Morris Press", "Rogers Books", "Reed Media", "Cook Publishing",
    "Morgan Press", "Bell Books", "Murphy Media", "Bailey Publishing",
    "Rivera Press", "Cooper Media",
  ];
  const contents = [
    "Statement Publications helped me publish my first book professionally. The process was seamless and the team was incredibly supportive.",
    "The editing team transformed my manuscript into a market-ready publication. I couldn't be happier with the results.",
    "The cover design exceeded my expectations. It perfectly captures the essence of my book.",
    "Professional publishing support from start to finish. Every detail was handled with care.",
    "Excellent communication and exceptional service. I would recommend Statement Publications to any author.",
    "From manuscript to finished book, the entire journey was smooth and well-managed.",
    "The team's attention to detail in the editing phase was remarkable. My book reads better than I ever imagined.",
    "Outstanding cover design that truly stands out in the market. Sales have been great since launch.",
    "The marketing strategy they developed for my book launch was brilliant. Best investment I've made.",
    "Professional, responsive, and incredibly talented team. They brought my vision to life.",
    "The ghostwriting service was top-notch. The final manuscript sounded exactly like me.",
    "Interior layout design was beautiful and professional. Every page looks polished.",
    "The book launch strategy generated incredible buzz. I sold 500 copies in the first week.",
    "SEO optimization brought my book to the top of search results. Visibility increased dramatically.",
    "The audio book production quality was studio-grade. Listeners love the final product.",
    "Manuscript review feedback was constructive and helped me significantly improve my draft.",
    "Author branding package gave me a professional identity that readers recognize and trust.",
    "Social media campaign reached thousands of potential readers across multiple platforms.",
    "Book trailer production was creative and engaging. It perfectly captured my story.",
    "Print management was flawless. The quality of the physical books exceeded my expectations.",
    "I've worked with several publishers and Statement Publications is by far the best.",
    "The proofreading team caught errors that three other editors missed. Impressive attention to detail.",
    "My book went from rough draft to published bestseller thanks to this amazing team.",
    "The entire publishing process was transparent and well-organized. No surprises at any stage.",
    "They handled everything from formatting to distribution. I just focused on writing.",
    "The marketing materials they created were stunning and highly effective.",
    "I was nervous about self-publishing but Statement Publications made it simple and rewarding.",
    "The book design is absolutely gorgeous. I get compliments on the cover everywhere I go.",
    "Fast turnaround without compromising quality. The editing was thorough and precise.",
    "They understood my target audience and crafted a strategy that reached them perfectly.",
    "The team was patient with my many questions and always responded promptly.",
    "My second book with them was even smoother than the first. They truly understand the craft.",
    "The royalty tracking system gives me complete visibility into my book sales.",
    "From start to finish, the experience was nothing short of exceptional.",
    "The manuscript transformation was remarkable. They preserved my voice while improving clarity.",
    "I recommend Statement Publications to every author I meet. The quality speaks for itself.",
    "The cover design process was collaborative and the final result was stunning.",
    "Marketing ROI was incredible. Every dollar spent generated measurable returns.",
    "The interior formatting made my book look like a traditional publishing house produced it.",
    "Professional, reliable, and genuinely invested in their authors' success.",
    "The book launch exceeded all my expectations. Sales were strong from day one.",
    "Audio production quality rivaled major audiobook publishers. The narrator selection was perfect.",
    "Their proofreading caught every typo and inconsistency. The final product was flawless.",
    "I've gained thousands of new readers thanks to their marketing expertise.",
    "The author website they designed is beautiful and drives consistent traffic.",
    "Editing was comprehensive and improved both structure and prose. Very pleased.",
    "Statement Publications turned my dream into reality. My book is finally published.",
  ];
  const videoTestimonials = [
    { name: "Sarah Mitchell", role: "Bestselling Author", company: "Mitchell Publishing Co.", content: "Statement Publications completely transformed my writing career. From manuscript editing to a stunning book cover, every step was handled with professionalism and care. I sold 2,000 copies in my first month!", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", imageUrl: "" },
    { name: "James Cooper", role: "Business Author", company: "Cooper Enterprises", content: "Working with Statement Publications was the best decision I made for my book. The marketing team created a launch strategy that put my book on the bestseller list within two weeks. Incredible results!", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", imageUrl: "" },
    { name: "Emily Watson", role: "Memoir Writer", company: "Watson Writes LLC", content: "The editing team at Statement Publications was phenomenal. They preserved my voice while making my manuscript shine. The final product exceeded every expectation I had. Highly recommended!", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", imageUrl: "" },
    { name: "Michael Brown", role: "Fiction Author", company: "Brown & Associates", content: "From cover design to distribution, Statement Publications handled everything flawlessly. Their attention to detail in formatting and print quality is unmatched. My readers love the final product.", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", imageUrl: "" },
    { name: "Olivia Carter", role: "Self-Help Author", company: "Carter Media Group", content: "Statement Publications gave me the professional identity I needed as an author. The branding package, website, and social media strategy they created have driven consistent sales for over a year now.", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", imageUrl: "" },
  ];
  const testimonials: TestimonialRecord[] = [];
  for (let i = 0; i < 48; i++) {
    const rating = i < 36 ? 5 : i < 42 ? 4 : i < 46 ? 3 : 5;
    const status: TestimonialStatus = i < 38 ? "published" : "pending";
    const daysAgo = Math.floor(Math.random() * 180) + 1;
    const date = new Date(Date.now() - daysAgo * 86400000);
    const verifiedAuthor = Math.random() > 0.25;
    const serviceCompleted = Math.random() > 0.2;
    const publishedBooks = Math.floor(Math.random() * 8) + 1;
    const accountAgeDays = Math.floor(Math.random() * 730) + 30;
    const ratingConsistency = 0.7 + Math.random() * 0.3;
    const views = Math.floor(Math.random() * 500) + 50;
    const clicks = Math.floor(views * (0.1 + Math.random() * 0.3));
    const shares = Math.floor(clicks * (0.05 + Math.random() * 0.15));
    const featuredAppearances = i < 12 ? Math.floor(Math.random() * 10) + 3 : Math.floor(Math.random() * 3);
    const totalTestimonialsSubmitted = Math.floor(Math.random() * 8) + 1;
    const averageRatingGiven = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
    const servicesPurchased = Math.floor(Math.random() * 6) + 1;
    const websiteUrl = i < 20 ? "https://statementpublications.com" : undefined;
    const featuredStartDate = i < 12 ? new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString() : undefined;
    const featuredEndDate = i < 12 ? new Date(Date.now() + Math.floor(Math.random() * 60 + 7) * 86400000).toISOString() : undefined;
    const timelineBase = date.getTime();
    const engagementTimeline = [
      { event: "submitted" as const, timestamp: new Date(timelineBase).toISOString() },
      ...(status === "published" ? [{ event: "approved" as const, timestamp: new Date(timelineBase + 86400000 * Math.floor(Math.random() * 3) + 1).toISOString() }] : []),
      ...(i < 12 ? [{ event: "featured" as const, timestamp: new Date(timelineBase + 86400000 * (Math.floor(Math.random() * 5) + 3)).toISOString() }] : []),
      ...(Math.random() > 0.5 ? [{ event: "edited" as const, timestamp: new Date(timelineBase + 86400000 * (Math.floor(Math.random() * 4) + 2)).toISOString() }] : []),
      ...(views > 200 ? [{ event: "viewed" as const, timestamp: new Date(timelineBase + 86400000 * (Math.floor(Math.random() * 3) + 1)).toISOString() }] : []),
      ...(shares > 20 ? [{ event: "shared" as const, timestamp: new Date(timelineBase + 86400000 * (Math.floor(Math.random() * 4) + 2)).toISOString() }] : []),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    testimonials.push({
      id: `test-${i + 1}`,
      name: names[i % names.length],
      role: roles[i % roles.length],
      company: companies[i % companies.length],
      content: contents[i % contents.length],
      rating,
      status,
      featured: i < 12,
      views,
      submittedAt: date.toISOString(),
      updatedAt: date.toISOString(),
      type: "text",
      verifiedAuthor,
      serviceCompleted,
      publishedBooks,
      accountAgeDays,
      ratingConsistency: Math.round(ratingConsistency * 100) / 100,
      clicks,
      shares,
      featuredAppearances,
      customerReputation: { totalTestimonialsSubmitted, averageRatingGiven, servicesPurchased, booksPublished: publishedBooks },
      engagementTimeline,
      websiteUrl,
      featuredStartDate,
      featuredEndDate,
    });
  }
  videoTestimonials.forEach((vt, i) => {
    const daysAgo = Math.floor(Math.random() * 60) + 1;
    const date = new Date(Date.now() - daysAgo * 86400000);
    const verifiedAuthor = true;
    const serviceCompleted = true;
    const publishedBooks = Math.floor(Math.random() * 5) + 2;
    const accountAgeDays = Math.floor(Math.random() * 500) + 100;
    const ratingConsistency = 0.85 + Math.random() * 0.15;
    const views = Math.floor(Math.random() * 800) + 200;
    const clicks = Math.floor(views * (0.2 + Math.random() * 0.3));
    const shares = Math.floor(clicks * (0.1 + Math.random() * 0.2));
    const vtTimelineBase = date.getTime();
    const vtTimeline = [
      { event: "submitted" as const, timestamp: new Date(vtTimelineBase).toISOString() },
      { event: "approved" as const, timestamp: new Date(vtTimelineBase + 86400000 * 1).toISOString() },
      { event: "featured" as const, timestamp: new Date(vtTimelineBase + 86400000 * 3).toISOString() },
      ...(Math.random() > 0.4 ? [{ event: "viewed" as const, timestamp: new Date(vtTimelineBase + 86400000 * 2).toISOString() }] : []),
      ...(Math.random() > 0.5 ? [{ event: "shared" as const, timestamp: new Date(vtTimelineBase + 86400000 * 4).toISOString() }] : []),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    testimonials.push({
      id: `test-vid-${i + 1}`,
      name: vt.name,
      role: vt.role,
      company: vt.company,
      content: vt.content,
      rating: 5,
      status: "published",
      featured: true,
      views,
      submittedAt: date.toISOString(),
      updatedAt: date.toISOString(),
      type: "video",
      videoUrl: vt.videoUrl,
      imageUrl: vt.imageUrl,
      verifiedAuthor,
      serviceCompleted,
      publishedBooks,
      accountAgeDays,
      ratingConsistency: Math.round(ratingConsistency * 100) / 100,
      clicks,
      shares,
      featuredAppearances: Math.floor(Math.random() * 8) + 5,
      customerReputation: {
        totalTestimonialsSubmitted: Math.floor(Math.random() * 5) + 2,
        averageRatingGiven: Math.round((4 + Math.random()) * 10) / 10,
        servicesPurchased: Math.floor(Math.random() * 4) + 2,
        booksPublished: publishedBooks,
      },
      engagementTimeline: vtTimeline,
      websiteUrl: "https://statementpublications.com",
      featuredStartDate: new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000).toISOString(),
      featuredEndDate: new Date(Date.now() + Math.floor(Math.random() * 30 + 7) * 86400000).toISOString(),
    });
  });
  return testimonials;
}

export default function AdminTestimonialsPage() {
  const tableScrollRef = useRef<SyncedTableScrollHandle>(null);
  const sortFilterRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const allTestimonials = useMemo(() => generateDemoTestimonials(), []);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("testimonials_data");
      if (saved) { try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed[0].customerReputation && parsed[0].engagementTimeline && "featuredStartDate" in parsed[0]) return parsed;
      } catch {} }
    }
    return allTestimonials;
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [activeSummaryCard, setActiveSummaryCard] = useState<string | null>(null);
  const [drawerTestimonial, setDrawerTestimonial] = useState<TestimonialRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [editForm, setEditForm] = useState({ name: "", role: "", company: "", content: "", rating: 5, status: "pending" as TestimonialStatus, type: "text" as "text" | "image" | "video", videoUrl: "", verifiedAuthor: true, serviceCompleted: true, publishedBooks: 1, accountAgeDays: 30 });
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFiles, setImportFiles] = useState<File[]>([]);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activityLog, setActivityLog] = useState<Array<{ id: string; type: string; message: string; time: string }>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("testimonials_activity");
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return [
      { id: "act-1", type: "publish", message: "Published testimonial from Sarah Mitchell", time: "2 hours ago" },
      { id: "act-2", type: "feature", message: "Featured testimonial from James Cooper", time: "5 hours ago" },
      { id: "act-3", type: "create", message: "Added testimonial from Emily Watson", time: "1 day ago" },
      { id: "act-4", type: "edit", message: "Edited testimonial from Michael Brown", time: "2 days ago" },
      { id: "act-5", type: "import", message: "Imported 12 testimonials from CSV", time: "3 days ago" },
    ];
  });
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTestimonial, setPreviewTestimonial] = useState<TestimonialRecord | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleTestimonial, setScheduleTestimonial] = useState<TestimonialRecord | null>(null);
  const [scheduleStartDate, setScheduleStartDate] = useState("");
  const [scheduleEndDate, setScheduleEndDate] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [drawerScheduleStart, setDrawerScheduleStart] = useState("");
  const [drawerScheduleEnd, setDrawerScheduleEnd] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortFilterRef.current && !sortFilterRef.current.contains(e.target as Node)) setSortFilterOpen(false);
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) setQuickActionsOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setCalendarOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, []);

  const addActivity = useCallback((type: string, message: string) => {
    setActivityLog((prev) => [{ id: `act-${Date.now()}`, type, message, time: "Just now" }, ...prev]);
  }, []);

  const stats = useMemo(() => {
    const published = testimonials.filter((t) => t.status === "published").length;
    const pending = testimonials.filter((t) => t.status === "pending").length;
    const featured = testimonials.filter((t) => t.featured).length;
    const avgRating = testimonials.length > 0 ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1) : "0.0";
    const trustScores = testimonials.map((t) => calculateTrustScore(t));
    const avgTrustScore = trustScores.length > 0 ? Math.round(trustScores.reduce((s, v) => s + v, 0) / trustScores.length) : 0;
    const highlyTrusted = trustScores.filter((s) => s >= 95).length;
    const trusted = trustScores.filter((s) => s >= 80 && s < 95).length;
    const moderate = trustScores.filter((s) => s >= 60 && s < 80).length;
    const reviewNeeded = trustScores.filter((s) => s < 60).length;
    const totalViews = testimonials.reduce((s, t) => s + t.views, 0);
    const totalClicks = testimonials.reduce((s, t) => s + t.clicks, 0);
    const totalShares = testimonials.reduce((s, t) => s + t.shares, 0);
    const videoCount = testimonials.filter((t) => t.type === "video").length;
    return { published, pending, featured, avgRating, avgTrustScore, highlyTrusted, trusted, moderate, reviewNeeded, totalViews, totalClicks, totalShares, videoCount };
  }, [testimonials]);

  const filteredTestimonials = useMemo(() => {
    let result = [...testimonials];
    if (activeTab === "published") result = result.filter((t) => t.status === "published");
    else if (activeTab === "pending") result = result.filter((t) => t.status === "pending");
    else if (activeTab === "featured") result = result.filter((t) => t.featured);
    else if (activeTab === "video") result = result.filter((t) => t.type === "video");
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q) || t.company.toLowerCase().includes(q) || t.content.toLowerCase().includes(q));
    }
    switch (sortOption) {
      case "name-az": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-za": result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "rating-high": result.sort((a, b) => b.rating - a.rating); break;
      case "rating-low": result.sort((a, b) => a.rating - b.rating); break;
      case "newest": result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()); break;
      case "oldest": result.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()); break;
      case "most-viewed": result.sort((a, b) => b.views - a.views); break;
      case "video-first": result.sort((a, b) => (a.type === "video" ? -1 : 1) - (b.type === "video" ? -1 : 1)); break;
      default: break;
    }
    return result;
  }, [testimonials, activeTab, search, sortOption]);

  const totalPages = Math.ceil(filteredTestimonials.length / pageSize);
  const displayedTestimonials = filteredTestimonials.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [search, activeTab, sortOption, pageSize]);

  // localStorage persistence
  useEffect(() => { localStorage.setItem("testimonials_data", JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem("testimonials_activity", JSON.stringify(activityLog)); }, [activityLog]);

  // Auto-expire featured scheduling
  useEffect(() => {
    const now = Date.now();
    setTestimonials((prev) => {
      let changed = false;
      const next = prev.map((t) => {
        if (t.featured && t.featuredEndDate) {
          const endDate = new Date(t.featuredEndDate).getTime();
          if (now > endDate) {
            changed = true;
            return { ...t, featured: false, featuredEndDate: undefined, featuredStartDate: undefined, updatedAt: new Date().toISOString() };
          }
        }
        return t;
      });
      return changed ? next : prev;
    });
  }, []);

  const openScheduleModal = useCallback((testimonial: TestimonialRecord) => {
    setScheduleTestimonial(testimonial);
    if (testimonial.featured && testimonial.featuredStartDate && testimonial.featuredEndDate) {
      setScheduleStartDate(testimonial.featuredStartDate.split("T")[0]);
      setScheduleEndDate(testimonial.featuredEndDate.split("T")[0]);
    } else {
      const today = new Date().toISOString().split("T")[0];
      const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];
      setScheduleStartDate(today);
      setScheduleEndDate(nextMonth);
    }
    setScheduleModalOpen(true);
  }, []);

  const applySchedule = useCallback(() => {
    if (!scheduleTestimonial) return;
    const newFeatured = !scheduleTestimonial.featured;
    setTestimonials((prev) => prev.map((t) => {
      if (t.id === scheduleTestimonial.id) {
        addActivity(newFeatured ? "feature" : "edit", `${newFeatured ? "Featured" : "Unfeatured"} testimonial from ${t.name}`);
        return {
          ...t,
          featured: newFeatured,
          featuredStartDate: newFeatured ? new Date(scheduleStartDate).toISOString() : undefined,
          featuredEndDate: newFeatured ? new Date(scheduleEndDate).toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    }));
    setScheduleModalOpen(false);
    setScheduleTestimonial(null);
    showToast(newFeatured ? "Testimonial featured with schedule" : "Testimonial unfeatured");
  }, [scheduleTestimonial, scheduleStartDate, scheduleEndDate, addActivity, showToast]);

  const toggleStatus = useCallback((id: string) => {
    setTestimonials((prev) => prev.map((t) => {
      if (t.id === id) {
        const newStatus = t.status === "published" ? "pending" : "published";
        addActivity(newStatus === "published" ? "publish" : "edit", `${newStatus === "published" ? "Approved" : "Unapproved"} testimonial from ${t.name}`);
        return { ...t, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return t;
    }));
    showToast("Status updated");
  }, [addActivity, showToast]);

  const deleteTestimonial = useCallback((id: string) => {
    const t = testimonials.find((t) => t.id === id);
    if (t) {
      actionHistory.pushAction({ action: "delete", entity: "other", entityName: t.name, description: `Deleted testimonial from ${t.name}`, previousState: t, newState: null });
      addActivity("delete", `Deleted testimonial from ${t.name}`);
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    showToast("Testimonial deleted");
  }, [testimonials, addActivity, showToast]);

  const openEditModal = useCallback((testimonial: TestimonialRecord) => {
    setEditMode("edit");
    setEditTargetId(testimonial.id);
    setEditForm({ name: testimonial.name, role: testimonial.role, company: testimonial.company, content: testimonial.content, rating: testimonial.rating, status: testimonial.status, type: testimonial.type, videoUrl: testimonial.videoUrl || "", verifiedAuthor: testimonial.verifiedAuthor, serviceCompleted: testimonial.serviceCompleted, publishedBooks: testimonial.publishedBooks, accountAgeDays: testimonial.accountAgeDays });
    setEditModalOpen(true);
  }, []);

  const openAddModal = useCallback(() => {
    setEditMode("add");
    setEditTargetId(null);
    setEditForm({ name: "", role: "", company: "", content: "", rating: 5, status: "pending", type: "text", videoUrl: "", verifiedAuthor: true, serviceCompleted: true, publishedBooks: 1, accountAgeDays: 30 });
    setEditModalOpen(true);
  }, []);

  const saveTestimonial = useCallback(() => {
    if (editMode === "add") {
      const newTestimonial: TestimonialRecord = {
        id: `test-${Date.now()}`, name: editForm.name, role: editForm.role, company: editForm.company, content: editForm.content, rating: editForm.rating, status: editForm.status, featured: false, views: 0, type: editForm.type, videoUrl: editForm.videoUrl || undefined, verifiedAuthor: editForm.verifiedAuthor, serviceCompleted: editForm.serviceCompleted, publishedBooks: editForm.publishedBooks, accountAgeDays: editForm.accountAgeDays, ratingConsistency: 0.85, clicks: 0, shares: 0, featuredAppearances: 0,
        submittedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        customerReputation: { totalTestimonialsSubmitted: 1, averageRatingGiven: editForm.rating, servicesPurchased: 1, booksPublished: editForm.publishedBooks },
        engagementTimeline: [
          { event: "submitted", timestamp: new Date().toISOString() },
          ...(editForm.status === "published" ? [{ event: "approved" as const, timestamp: new Date().toISOString() }] : []),
        ],
        featuredStartDate: undefined,
        featuredEndDate: undefined,
      };
      setTestimonials((prev) => [newTestimonial, ...prev]);
      addActivity("create", `Added testimonial from ${editForm.name}`);
      showToast("Testimonial added");
    } else if (editTargetId) {
      setTestimonials((prev) => prev.map((t) => t.id === editTargetId ? { ...t, name: editForm.name, role: editForm.role, company: editForm.company, content: editForm.content, rating: editForm.rating, status: editForm.status, type: editForm.type, videoUrl: editForm.videoUrl || undefined, verifiedAuthor: editForm.verifiedAuthor, serviceCompleted: editForm.serviceCompleted, publishedBooks: editForm.publishedBooks, accountAgeDays: editForm.accountAgeDays, updatedAt: new Date().toISOString() } : t));
      addActivity("edit", `Edited testimonial from ${editForm.name}`);
      showToast("Testimonial updated");
    }
    setEditModalOpen(false);
  }, [editMode, editTargetId, editForm, addActivity, showToast]);

  const exportCSV = useCallback(() => {
    const headers = ["Name", "Company", "Rating", "Status", "Featured", "Submitted"];
    const rows = filteredTestimonials.map((t) => [t.name, t.company, String(t.rating), t.status, String(t.featured), t.submittedAt]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "testimonials.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported");
  }, [filteredTestimonials, showToast]);

  const exportPDF = useCallback(() => {
    const html = `<!DOCTYPE html><html><head><title>Testimonials Report</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1D1D1D}h1{color:#8A6A4A;border-bottom:2px solid #D8B27A;padding-bottom:8px}.stat{display:inline-block;width:18%;margin:8px;padding:12px;border:1px solid #E8DDD0;border-radius:8px;background:#F5EDE3}.stat .label{font-size:12px;color:#5C4A3D}.stat .value{font-size:24px;font-weight:bold}table{width:100%;border-collapse:collapse;margin-top:8px}td,th{padding:6px 12px;border:1px solid #E8DDD0;text-align:left}th{background:#F5EDE3;font-weight:600}.stars{color:#D8B27A}</style></head><body><h1>Testimonials Report</h1><p>Generated: ${new Date().toLocaleDateString()}</p><div><div class="stat"><div class="label">Total</div><div class="value">${testimonials.length}</div></div><div class="stat"><div class="label">Approved</div><div class="value">${stats.published}</div></div><div class="stat"><div class="label">Pending</div><div class="value">${stats.pending}</div></div><div class="stat"><div class="label">Featured</div><div class="value">${stats.featured}</div></div><div class="stat"><div class="label">Avg Rating</div><div class="value">${stats.avgRating}★</div></div></div><h2>All Testimonials</h2><table><tr><th>Name</th><th>Company</th><th>Rating</th><th>Status</th><th>Date</th></tr>${testimonials.map((t) => `<tr><td>${t.name}</td><td>${t.company}</td><td class="stars">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</td><td>${t.status}</td><td>${new Date(t.submittedAt).toLocaleDateString()}</td></tr>`).join("")}</table></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "testimonials-report.html"; a.click();
    URL.revokeObjectURL(url);
    showToast("Report downloaded");
  }, [testimonials, stats, showToast]);

  const importTestimonials = useCallback(() => {
    if (importFiles.length === 0) return;
    const count = importFiles.length * 3;
    addActivity("import", `Imported ${count} testimonials from file`);
    showToast(`Imported ${count} testimonials`);
    setImportFiles([]);
    setImportModalOpen(false);
  }, [importFiles, addActivity, showToast]);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === displayedTestimonials.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(displayedTestimonials.map((t) => t.id)));
  }, [selectedIds.size, displayedTestimonials]);

  const topRated = useMemo(() => {
    return [...testimonials].sort((a, b) => b.rating - a.rating || b.views - a.views).slice(0, 5);
  }, [testimonials]);

  const topPerforming = useMemo(() => {
    return [...testimonials].sort((a, b) => (b.views + b.clicks * 2 + b.shares * 3) - (a.views + a.clicks * 2 + a.shares * 3)).slice(0, 5);
  }, [testimonials]);

  const topTrusted = useMemo(() => {
    return [...testimonials].sort((a, b) => calculateTrustScore(b) - calculateTrustScore(a)).slice(0, 5);
  }, [testimonials]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1D]">Testimonials Management</h1>
          <p className="text-sm text-[#5C4A3D]">Manage author testimonials displayed on the website.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={openAddModal} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
            <Plus className="h-4 w-4 mr-1" /> Add Testimonial
          </Button>
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" onClick={() => { setTestimonials(allTestimonials); showToast("Refreshed"); }} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { id: "total", label: "TOTAL TESTIMONIALS", value: testimonials.length, icon: Quote, iconColor: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40", tab: "all" },
          { id: "published", label: "APPROVED TESTIMONIALS", value: stats.published, icon: CheckCircle2, iconColor: "text-emerald-600", bg: "bg-emerald-50", tab: "published" },
          { id: "pending", label: "PENDING APPROVAL", value: stats.pending, icon: Clock, iconColor: "text-orange-500", bg: "bg-orange-50", tab: "pending" },
          { id: "featured", label: "FEATURED TESTIMONIALS", value: stats.featured, icon: Star, iconColor: "text-amber-500", bg: "bg-amber-50", tab: "featured" },
          { id: "rating", label: "PLATFORM AVG RATING", value: `${stats.avgRating}★`, icon: Star, iconColor: "text-rose-500", bg: "bg-rose-50", tab: "all" },
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
                    <div className={`rounded-lg ${stat.bg} p-2 ${stat.iconColor}`}><stat.icon className="h-4 w-4" /></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Testimonials Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Monthly Growth */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Monthly Testimonial Growth</h4>
                      <div className="relative h-32 pt-2">
                        <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                          <polyline points={MONTHLY_GROWTH.map((_, i) => `${(i / 5) * 300},${100 - (MONTHLY_GROWTH[i].testimonials / 15) * 100}`).join(" ")} fill="none" stroke="#8A6A4A" strokeWidth="2" />
                          {MONTHLY_GROWTH.map((v, i) => (
                            <circle key={i} cx={(i / 5) * 300} cy={100 - (v.testimonials / 15) * 100} r="3" fill="#8A6A4A" />
                          ))}
                        </svg>
                      </div>
                      <div className="flex justify-between text-[9px] text-[#5C4A3D] mt-1">
                        {MONTHLY_GROWTH.map((v) => <span key={v.month}>{v.month}</span>)}
                      </div>
                    </div>

                    {/* Top Performing Testimonials */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Top Performing Testimonials</h4>
                      <div className="space-y-2">
                        {topPerforming.map((t, i) => (
                          <div key={t.id} className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-[#8A6A4A]/10 flex items-center justify-center flex-shrink-0">
                              {t.type === "video" ? <Video className="h-3 w-3 text-[#8A6A4A]" /> : <TrendingUp className="h-3 w-3 text-[#8A6A4A]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-medium text-[#111111] truncate">{t.name}</p>
                              <div className="flex items-center gap-2 text-[9px] text-[#5C4A3D]">
                                <span className="flex items-center gap-0.5"><EyeIcon className="h-2.5 w-2.5" />{t.views}</span>
                                <span className="flex items-center gap-0.5"><MousePointerClick className="h-2.5 w-2.5" />{t.clicks}</span>
                                <span className="flex items-center gap-0.5"><Share2 className="h-2.5 w-2.5" />{t.shares}</span>
                              </div>
                            </div>
                            {i === 0 && <Badge className="bg-[#D8B27A] text-white text-[7px] h-3.5 px-1">Top</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Engagement Overview */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Engagement Overview</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Approval Rate</span><span className="font-bold text-[#111111]">{Math.round((stats.published / testimonials.length) * 100)}%</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(stats.published / testimonials.length) * 100}%` }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Average Rating</span><span className="font-bold text-[#111111]">{stats.avgRating}★</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${(parseFloat(stats.avgRating) / 5) * 100}%` }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Featured Percentage</span><span className="font-bold text-[#111111]">{Math.round((stats.featured / testimonials.length) * 100)}%</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${(stats.featured / testimonials.length) * 100}%` }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Avg Trust Score</span><span className="font-bold text-[#111111]">{stats.avgTrustScore}/100</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.avgTrustScore}%` }} /></div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Overview */}
                    <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Performance Overview</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Total Views</span><span className="font-bold text-[#111111]">{stats.totalViews.toLocaleString()}</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.min((stats.totalViews / 25000) * 100, 100)}%` }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Total Clicks</span><span className="font-bold text-[#111111]">{stats.totalClicks.toLocaleString()}</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((stats.totalClicks / 10000) * 100, 100)}%` }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Total Shares</span><span className="font-bold text-[#111111]">{stats.totalShares.toLocaleString()}</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((stats.totalShares / 3000) * 100, 100)}%` }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1"><span className="text-[#5C4A3D]">Video Testimonials</span><span className="font-bold text-[#111111]">{stats.videoCount}</span></div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min((stats.videoCount / 10) * 100, 100)}%` }} /></div>
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

      {/* Search / Filters / Quick Actions */}
      <motion.div variants={item} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md search-bar-border">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input placeholder="Search testimonials..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9" />
          </div>

          {/* Sort & Filter */}
          <div className="flex items-center gap-2" ref={sortFilterRef}>
            <div className="relative">
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button variant="outline" size="sm" onClick={() => setSortFilterOpen(!sortFilterOpen)} className={`h-9 px-3 border-0 bg-white text-sm font-medium gap-2 ${sortOption !== "default" ? "text-[#D8B27A]" : "text-[#8A6A4A] hover:bg-[#F2D8BE]"}`}>
                  <SlidersHorizontal className="h-4 w-4" /><span className="hidden sm:inline">Sort & Filter</span><ChevronRight className={`h-3.5 w-3.5 transition-transform ${sortFilterOpen ? "rotate-90" : ""}`} />
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
                        <button key={opt.value} onClick={() => { setSortOption(opt.value); setSortFilterOpen(false); }} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortOption === opt.value ? "bg-[#D8B27A]/20 text-[#111111] font-medium" : "text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Show */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Show</span>
            <Select value={pageSize >= 999 ? "all" : String(pageSize)} onValueChange={(v) => { setPageSize(v === "all" ? 999 : parseInt(v)); setPage(1); }}>
              <SelectTrigger className="w-[70px] h-9 border-[#8A6A4A]/20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calendar Schedule */}
          <div className="relative" ref={calendarRef}>
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <Button variant="outline" size="sm" onClick={() => setCalendarOpen(!calendarOpen)} className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
                <Calendar className="h-4 w-4" /><span className="hidden sm:inline">Schedule</span>
              </Button>
            </div>
            <AnimatePresence>
              {calendarOpen && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full right-0 mt-1 w-[340px] bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 overflow-hidden">
                  <div className="p-3 border-b border-[#E8DDD0] bg-[#F5EDE3]/30 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2"><Calendar className="h-4 w-4 text-[#8A6A4A]" />Featured Schedule</h4>
                    <span className="text-[10px] text-[#5C4A3D] bg-white px-2 py-0.5 rounded-full border border-[#E8DDD0]">{testimonials.filter((t) => t.featured && t.featuredStartDate && t.featuredEndDate).length} active</span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
                    {testimonials.filter((t) => t.featured && t.featuredStartDate && t.featuredEndDate).length === 0 ? (
                      <div className="py-8 text-center">
                        <Calendar className="h-8 w-8 mx-auto text-[#D8B27A]/40 mb-2" />
                        <p className="text-xs text-[#5C4A3D]">No featured testimonials with schedules</p>
                      </div>
                    ) : (
                      testimonials.filter((t) => t.featured && t.featuredStartDate && t.featuredEndDate).map((t) => {
                        const start = new Date(t.featuredStartDate!);
                        const end = new Date(t.featuredEndDate!);
                        const now = Date.now();
                        const startMs = start.getTime();
                        const endMs = end.getTime();
                        const totalDuration = endMs - startMs;
                        const elapsed = Math.max(0, now - startMs);
                        const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
                        const daysLeft = Math.max(0, Math.ceil((endMs - now) / 86400000));
                        const isActive = now >= startMs && now <= endMs;
                        const isExpired = now > endMs;
                        return (
                          <div key={t.id} className={`p-2.5 rounded-lg border transition-colors ${isExpired ? "border-red-200 bg-red-50/50" : isActive ? "border-amber-200 bg-amber-50/50" : "border-[#E8DDD0] bg-[#F5EDE3]/20"}`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="h-5 w-5 rounded bg-[#8A6A4A]/10 flex items-center justify-center flex-shrink-0">
                                  {t.type === "video" ? <Video className="h-2.5 w-2.5 text-[#8A6A4A]" /> : <Star className="h-2.5 w-2.5 text-[#8A6A4A]" />}
                                </div>
                                <p className="text-[11px] font-medium text-[#111111] truncate">{t.name}</p>
                              </div>
                              <Badge className={`text-[7px] h-3.5 px-1 flex-shrink-0 ${isExpired ? "bg-red-100 text-red-600 border border-red-200" : isActive ? "bg-amber-100 text-amber-600 border border-amber-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                                {isExpired ? "Expired" : isActive ? "Live" : "Scheduled"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] text-[#5C4A3D] mb-1.5">
                              <span>{start.toLocaleDateString()}</span>
                              <span>-</span>
                              <span>{end.toLocaleDateString()}</span>
                              {!isExpired && <span className="ml-auto font-medium text-[#8A6A4A]">{daysLeft}d left</span>}
                            </div>
                            <div className="h-1 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                              <div className={`h-full rounded-full ${isExpired ? "bg-red-400" : isActive ? "bg-amber-500" : "bg-gray-300"}`} style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Actions */}
          <div className="relative" ref={quickActionsRef}>
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <Button variant="outline" size="sm" onClick={() => setQuickActionsOpen(!quickActionsOpen)} className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
                <Zap className="h-4 w-4" /><span className="hidden sm:inline">Quick Actions</span><ChevronRight className={`h-3.5 w-3.5 transition-transform ${quickActionsOpen ? "rotate-90" : ""}`} />
              </Button>
            </div>
            {quickActionsOpen && (
              <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 p-2">
                <Button size="sm" className="w-full justify-start h-8 text-xs bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => { openAddModal(); setQuickActionsOpen(false); }}><Plus className="h-3.5 w-3.5 mr-1.5" /> Add Testimonial</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { setImportModalOpen(true); setQuickActionsOpen(false); }}><FileUp className="h-3.5 w-3.5 mr-1.5" /> Import Testimonials</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportCSV(); setQuickActionsOpen(false); }}><Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV</Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportPDF(); setQuickActionsOpen(false); }}><FileText className="h-3.5 w-3.5 mr-1.5" /> Generate Report</Button>
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { value: "all", label: "All Testimonials", color: "bg-[#8A6A4A] text-white border-[#8A6A4A]" },
            { value: "published", label: "Approved Testimonials", color: "bg-emerald-600 text-white border-emerald-600" },
            { value: "pending", label: "Pending Approval", color: "bg-orange-500 text-white border-orange-500" },
            { value: "featured", label: "Featured Testimonials", color: "bg-amber-500 text-white border-amber-500" },
            { value: "video", label: "Video Testimonials", color: "bg-violet-600 text-white border-violet-600" },
          ].map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button key={tab.value} onClick={() => { setActiveTab(tab.value); setActiveSummaryCard(null); }} className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${isActive ? tab.color + " shadow-sm" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]"}`}>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Summary Strip */}
        <div className="flex items-center gap-4 text-[11px] text-[#5C4A3D]">
          <span>Total: <strong className="text-[#111111]">{testimonials.length}</strong></span>
          <span>Approved: <strong className="text-[#111111]">{stats.published}</strong></span>
          <span>Featured: <strong className="text-[#111111]">{stats.featured}</strong></span>
          <span>Pending: <strong className="text-[#111111]">{stats.pending}</strong></span>
          <span>Avg Rating: <strong className="text-[#111111]">{stats.avgRating}★</strong></span>
        </div>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="flex items-center justify-between rounded-lg border border-[#D8B27A]/30 bg-[#F2D8BE]/20 px-4 py-2.5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#111111]">{selectedIds.size} testimonial{selectedIds.size !== 1 ? "s" : ""} selected</span>
                <div className="h-4 w-px bg-[#E8DDD0]" />
                <button onClick={toggleSelectAll} className="text-[11px] text-[#8A6A4A] hover:underline font-medium">Select All ({displayedTestimonials.length})</button>
                <button onClick={() => setSelectedIds(new Set())} className="text-[11px] text-[#5C4A3D] hover:underline">Deselect All</button>
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { setTestimonials((prev) => prev.map((t) => selectedIds.has(t.id) ? { ...t, featured: true, updatedAt: new Date().toISOString() } : t)); addActivity("feature", `Featured ${selectedIds.size} testimonials`); showToast(`${selectedIds.size} testimonials featured`); setSelectedIds(new Set()); }}>
                  <Star className="h-3 w-3 mr-1" />Feature
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { setTestimonials((prev) => prev.map((t) => selectedIds.has(t.id) ? { ...t, status: "published" as TestimonialStatus, updatedAt: new Date().toISOString() } : t)); addActivity("publish", `Approved ${selectedIds.size} testimonials`); showToast(`${selectedIds.size} testimonials approved`); setSelectedIds(new Set()); }}>
                  <CheckCircle2 className="h-3 w-3 mr-1" />Approve
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { const sel = filteredTestimonials.filter((t) => selectedIds.has(t.id)); const headers = ["Name", "Company", "Rating", "Status", "Featured", "Submitted"]; const rows = sel.map((t) => [t.name, t.company, String(t.rating), t.status, String(t.featured), t.submittedAt]); const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n"); const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `testimonials-selected-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url); showToast(`Exported ${sel.length} testimonials`); }}>
                  <Download className="h-3 w-3 mr-1" />Export
                </Button>
                <div className="h-4 w-px bg-[#E8DDD0]" />
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => { setTestimonials((prev) => { const removed = prev.filter((t) => selectedIds.has(t.id)); removed.forEach((t) => { actionHistory.pushAction({ action: "delete", entity: "other", entityName: t.name, description: `Deleted testimonial from ${t.name}`, previousState: t, newState: null }); }); return prev.filter((t) => !selectedIds.has(t.id)); }); addActivity("delete", `Deleted ${selectedIds.size} testimonials`); showToast(`${selectedIds.size} testimonials deleted`); setSelectedIds(new Set()); }}>
                  <Trash2 className="h-3 w-3 mr-1" />Delete
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-[11px] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => setSelectedIds(new Set())}>
                  <X className="h-3 w-3 mr-1" />Clear
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div variants={item}>
        <SyncedTableScroll ref={tableScrollRef} loading={false} className="rounded-xl border border-[#D8B27A]/15 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E8DDD0] bg-white">
                <TableHead className="w-10"><input type="checkbox" checked={selectedIds.size === displayedTestimonials.length && displayedTestimonials.length > 0} onChange={toggleSelectAll} className="rounded" /></TableHead>
                <TableHead className="text-[#111111] font-semibold text-sm">Author</TableHead>
                <TableHead className="text-[#111111] font-semibold text-sm">Rating</TableHead>
                <TableHead className="text-[#111111] font-semibold text-sm">Status</TableHead>
                <TableHead className="text-[#111111] font-semibold text-sm">Submitted</TableHead>
                <TableHead className="text-[#111111] font-semibold text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTestimonials.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-16 bg-white"><Quote className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-sm text-muted-foreground">No testimonials found</p></TableCell></TableRow>
              ) : (
                displayedTestimonials.map((t) => {
                  return (
                  <TableRow key={t.id} className="border-b border-[#E8DDD0] hover:bg-[#F5EDE3]/30 transition-colors">
                    <TableCell><input type="checkbox" checked={selectedIds.has(t.id)} onChange={() => { const next = new Set(selectedIds); next.has(t.id) ? next.delete(t.id) : next.add(t.id); setSelectedIds(next); }} className="rounded" /></TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-[#111111]">{t.name}</p>
                          {t.type === "video" && <Badge className="bg-violet-100 text-violet-700 border border-violet-200 text-[10px] h-4 px-1.5 flex items-center gap-0.5"><Video className="h-3 w-3" />Video</Badge>}
                          {t.verifiedAuthor && <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] h-4 px-1.5 flex items-center gap-0.5"><CheckCircle2 className="h-3 w-3" />Verified</Badge>}
                        </div>
                        <p className="text-[11px] text-[#5C4A3D]">{t.role} at {t.company}</p>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-amber-500 text-sm">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</span></TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] border ${t.status === "published" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
                        {t.status === "published" ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#5C4A3D]">{new Date(t.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setDrawerTestimonial(t); setDrawerScheduleStart(t.featuredStartDate ? t.featuredStartDate.split("T")[0] : ""); setDrawerScheduleEnd(t.featuredEndDate ? t.featuredEndDate.split("T")[0] : ""); setDrawerOpen(true); }} className="p-1.5 rounded-lg hover:bg-[#F5EDE3] text-[#5C4A3D] transition-colors" title="View"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => { setPreviewTestimonial(t); setPreviewModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-[#F5EDE3] text-[#5C4A3D] transition-colors" title="Preview on Website"><Globe className="h-4 w-4" /></button>
                        <button onClick={() => openEditModal(t)} className="p-1.5 rounded-lg hover:bg-[#F5EDE3] text-[#5C4A3D] transition-colors" title="Edit"><Edit3 className="h-4 w-4" /></button>
                        <button onClick={() => openScheduleModal(t)} className="p-1.5 rounded-lg hover:bg-[#F5EDE3] text-[#5C4A3D] transition-colors" title={t.featured ? "Unfeature" : "Feature"}><Star className={`h-4 w-4 ${t.featured ? "fill-amber-500 text-amber-500" : ""}`} /></button>
                        <button onClick={() => { setDeleteTarget(t.id); setDeleteModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </SyncedTableScroll>
      </motion.div>

      {/* Pagination */}
      <motion.div variants={item} className="flex items-center justify-between">
        <p className="text-xs text-[#5C4A3D]">Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredTestimonials.length)} of {filteredTestimonials.length}</p>
        <div className="flex items-center gap-1">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg border border-[#E8DDD0] hover:bg-[#F5EDE3] disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft className="h-4 w-4 text-[#5C4A3D]" /></button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) pageNum = i + 1;
            else if (page <= 3) pageNum = i + 1;
            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = page - 2 + i;
            return (
              <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === pageNum ? "bg-[#8A6A4A] text-white" : "border border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}>{pageNum}</button>
            );
          })}
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-[#E8DDD0] hover:bg-[#F5EDE3] disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight className="h-4 w-4 text-[#5C4A3D]" /></button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <Card className="shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> Recent Activity</h3>
              {activityLog.length > 3 && (
                <button onClick={() => setActivityExpanded(!activityExpanded)} className="text-[10px] text-[#8A6A4A] hover:underline font-medium">
                  {activityExpanded ? "Show Less" : "View All"}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {(activityExpanded ? activityLog : activityLog.slice(0, 3)).map((act) => (
                <div key={act.id} className="flex items-start gap-2 p-2 rounded-lg bg-[#F5EDE3]/30">
                  <div className="mt-0.5">
                    {act.type === "publish" || act.type === "create" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> :
                     act.type === "delete" ? <Trash2 className="h-3.5 w-3.5 text-red-500" /> :
                     act.type === "feature" ? <Star className="h-3.5 w-3.5 text-amber-500" /> :
                     act.type === "import" ? <FileUp className="h-3.5 w-3.5 text-blue-600" /> :
                     <Edit3 className="h-3.5 w-3.5 text-[#8A6A4A]" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-[#111111]">{act.message}</p>
                    <p className="text-[9px] text-[#5C4A3D] flex items-center gap-1 mt-0.5"><Clock className="h-2.5 w-2.5" />{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* View Drawer */}
      <AnimatePresence>
        {drawerOpen && drawerTestimonial && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 250 }} className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#111111]">Testimonial Details</h2>
                  <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-[#F5EDE3]"><X className="h-4 w-4" /></button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#8A6A4A]/10 flex items-center justify-center">
                      {drawerTestimonial.type === "video" ? <Video className="h-6 w-6 text-violet-600" /> : <User className="h-6 w-6 text-[#8A6A4A]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-[#111111]">{drawerTestimonial.name}</p>
                        {drawerTestimonial.type === "video" && <Badge className="bg-violet-100 text-violet-700 border border-violet-200 text-[8px] h-3.5 px-1 flex items-center gap-0.5"><Video className="h-2.5 w-2.5" />Video</Badge>}
                        {drawerTestimonial.verifiedAuthor && <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] h-3.5 px-1 flex items-center gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" />Verified</Badge>}
                      </div>
                      <p className="text-[11px] text-[#5C4A3D]">{drawerTestimonial.role} at {drawerTestimonial.company}</p>
                    </div>
                  </div>

                  {/* Video Player */}
                  {drawerTestimonial.type === "video" && drawerTestimonial.videoUrl && (
                    <div className="rounded-lg overflow-hidden border border-[#E8DDD0] bg-black">
                      <video controls className="w-full h-auto max-h-[300px]" poster={drawerTestimonial.imageUrl || undefined}>
                        <source src={drawerTestimonial.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 rounded-lg bg-[#F5EDE3]/50"><span className="text-[#5C4A3D]">Rating</span><p className="font-medium text-amber-500">{"★".repeat(drawerTestimonial.rating)}</p></div>
                    <div className="p-2 rounded-lg bg-[#F5EDE3]/50"><span className="text-[#5C4A3D]">Status</span><p className="font-medium text-[#111111]">{drawerTestimonial.status === "published" ? "Approved" : "Pending"}</p></div>
                    <div className="p-2 rounded-lg bg-[#F5EDE3]/50"><span className="text-[#5C4A3D]">Featured</span><p className="font-medium text-[#111111]">{drawerTestimonial.featured ? "Yes" : "No"}</p></div>
                    <div className="p-2 rounded-lg bg-[#F5EDE3]/50"><span className="text-[#5C4A3D]">Views</span><p className="font-medium text-[#111111]">{drawerTestimonial.views}</p></div>
                  </div>
                  {drawerTestimonial.featured && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-amber-700">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="font-medium">Featured Schedule</span>
                        </div>
                        {drawerScheduleStart && drawerScheduleEnd && (
                          <button onClick={() => {
                            setTestimonials((prev) => prev.map((t) => t.id === drawerTestimonial.id ? { ...t, featuredStartDate: new Date(drawerScheduleStart).toISOString(), featuredEndDate: new Date(drawerScheduleEnd).toISOString(), updatedAt: new Date().toISOString() } : t));
                            setDrawerTestimonial((prev) => prev ? { ...prev, featuredStartDate: new Date(drawerScheduleStart).toISOString(), featuredEndDate: new Date(drawerScheduleEnd).toISOString() } : prev);
                            showToast("Schedule updated");
                          }} className="text-[10px] font-medium text-amber-700 hover:text-amber-900 underline">Save</button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-amber-600 mb-0.5 block">Start Date</label>
                          <input type="date" value={drawerScheduleStart} onChange={(e) => setDrawerScheduleStart(e.target.value)} className="w-full text-[11px] px-2 py-1 rounded border border-amber-300 bg-white text-[#111111] focus:outline-none focus:ring-1 focus:ring-amber-400" />
                        </div>
                        <div>
                          <label className="text-[9px] text-amber-600 mb-0.5 block">End Date</label>
                          <input type="date" value={drawerScheduleEnd} onChange={(e) => setDrawerScheduleEnd(e.target.value)} className="w-full text-[11px] px-2 py-1 rounded border border-amber-300 bg-white text-[#111111] focus:outline-none focus:ring-1 focus:ring-amber-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Reputation */}
                  <div className="p-4 rounded-lg border border-[#E8DDD0] bg-[#F5EDE3]/20">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><User className="h-3.5 w-3.5" />Customer Reputation</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-lg bg-white border border-[#E8DDD0] text-center">
                        <p className="text-[10px] text-[#5C4A3D] mb-0.5">Testimonials Submitted</p>
                        <p className="text-lg font-bold text-[#111111]">{drawerTestimonial.customerReputation.totalTestimonialsSubmitted}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#E8DDD0] text-center">
                        <p className="text-[10px] text-[#5C4A3D] mb-0.5">Avg Rating Given</p>
                        <p className="text-lg font-bold text-amber-500">{drawerTestimonial.customerReputation.averageRatingGiven}★</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#E8DDD0] text-center">
                        <p className="text-[10px] text-[#5C4A3D] mb-0.5">Services Purchased</p>
                        <p className="text-lg font-bold text-[#111111]">{drawerTestimonial.customerReputation.servicesPurchased}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#E8DDD0] text-center">
                        <p className="text-[10px] text-[#5C4A3D] mb-0.5">Books Published</p>
                        <p className="text-lg font-bold text-[#111111]">{drawerTestimonial.customerReputation.booksPublished}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Score */}
                  <div className="p-4 rounded-lg border border-[#E8DDD0] bg-[#F5EDE3]/20">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" />Trust Score</h4>
                    {(() => {
                      const score = calculateTrustScore(drawerTestimonial);
                      const level = getTrustLevel(score);
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${level.color}`}>{score}</span>
                            <div>
                              <Badge variant="secondary" className={`text-[10px] border ${level.bgColor} ${level.color}`}>{level.label}</Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="flex justify-between"><span className="text-[#5C4A3D]">Verified Author</span><span className={`font-medium ${drawerTestimonial.verifiedAuthor ? "text-emerald-600" : "text-red-500"}`}>{drawerTestimonial.verifiedAuthor ? "Yes" : "No"}</span></div>
                            <div className="flex justify-between"><span className="text-[#5C4A3D]">Service Completed</span><span className={`font-medium ${drawerTestimonial.serviceCompleted ? "text-emerald-600" : "text-red-500"}`}>{drawerTestimonial.serviceCompleted ? "Yes" : "No"}</span></div>
                            <div className="flex justify-between"><span className="text-[#5C4A3D]">Published Books</span><span className="font-medium text-[#111111]">{drawerTestimonial.publishedBooks}</span></div>
                            <div className="flex justify-between"><span className="text-[#5C4A3D]">Account Age</span><span className="font-medium text-[#111111]">{drawerTestimonial.accountAgeDays}d</span></div>
                            <div className="flex justify-between"><span className="text-[#5C4A3D]">Rating Consistency</span><span className="font-medium text-[#111111]">{Math.round(drawerTestimonial.ratingConsistency * 100)}%</span></div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Performance Stats */}
                  <div className="p-4 rounded-lg border border-[#E8DDD0] bg-[#F5EDE3]/20">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Performance</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded bg-white border border-[#E8DDD0]">
                        <p className="text-[10px] text-[#5C4A3D]">Views</p>
                        <p className="text-sm font-bold text-[#111111]">{drawerTestimonial.views}</p>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#E8DDD0]">
                        <p className="text-[10px] text-[#5C4A3D]">Clicks</p>
                        <p className="text-sm font-bold text-[#111111]">{drawerTestimonial.clicks}</p>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#E8DDD0]">
                        <p className="text-[10px] text-[#5C4A3D]">Shares</p>
                        <p className="text-sm font-bold text-[#111111]">{drawerTestimonial.shares}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-[#E8DDD0] bg-[#F5EDE3]/20">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Full Testimonial</h4>
                    <p className="text-sm text-[#111111] leading-relaxed italic">&ldquo;{drawerTestimonial.content}&rdquo;</p>
                  </div>

                  {/* Website Preview */}
                  {drawerTestimonial.websiteUrl && (
                    <div className="p-4 rounded-lg border border-[#E8DDD0] bg-[#F5EDE3]/20">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />Website Preview</h4>
                      <div className="rounded-lg overflow-hidden border border-[#E8DDD0] bg-white">
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#F5EDE3]/50 border-b border-[#E8DDD0]">
                          <div className="flex gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                          </div>
                          <div className="flex-1 bg-white rounded px-2 py-0.5 text-[9px] text-[#5C4A3D] border border-[#E8DDD0] truncate">{drawerTestimonial.websiteUrl}</div>
                          <ExternalLink className="h-3 w-3 text-[#5C4A3D]" />
                        </div>
                        <div className="relative h-40 bg-gradient-to-br from-[#F5EDE3] to-[#E8DDD0] flex flex-col items-center justify-center gap-2">
                          <Globe className="h-10 w-10 text-[#8A6A4A]/30" />
                          <p className="text-xs text-[#5C4A3D]/60 font-medium">statementpublications.com</p>
                          <p className="text-[9px] text-[#5C4A3D]/40">Author Profile & Portfolio</p>
                          <a href={drawerTestimonial.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 px-3 py-1 bg-[#8A6A4A] text-white rounded text-[10px] font-medium hover:bg-[#6A4E37] transition-colors">
                            <Send className="h-2.5 w-2.5" /> Visit Site
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Engagement Timeline */}
                  <div className="p-4 rounded-lg border border-[#E8DDD0] bg-[#F5EDE3]/20">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3 flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" />Engagement Timeline</h4>
                    <div className="space-y-3 relative pl-4">
                      <div className="absolute left-0 top-1 bottom-1 w-px bg-[#E8DDD0]" />
                      {drawerTestimonial.engagementTimeline && drawerTestimonial.engagementTimeline.map((entry, idx) => {
                        const evtLabel = entry.event.charAt(0).toUpperCase() + entry.event.slice(1);
                        const ts = new Date(entry.timestamp);
                        const diffMs = Date.now() - ts.getTime();
                        const diffDays = Math.floor(diffMs / 86400000);
                        const timeAgo = diffDays === 0 ? "Today" : diffDays === 1 ? "Yesterday" : diffDays < 7 ? `${diffDays}d ago` : diffDays < 30 ? `${Math.floor(diffDays / 7)}w ago` : `${Math.floor(diffDays / 30)}mo ago`;
                        const dotColor = entry.event === "submitted" ? "bg-[#8A6A4A]" : entry.event === "approved" ? "bg-emerald-500" : entry.event === "featured" ? "bg-amber-500" : entry.event === "edited" ? "bg-blue-500" : entry.event === "viewed" ? "bg-violet-500" : "bg-rose-500";
                        const iconBg = entry.event === "submitted" ? "bg-[#8A6A4A]/10 text-[#8A6A4A]" : entry.event === "approved" ? "bg-emerald-500/10 text-emerald-500" : entry.event === "featured" ? "bg-amber-500/10 text-amber-500" : entry.event === "edited" ? "bg-blue-500/10 text-blue-500" : entry.event === "viewed" ? "bg-violet-500/10 text-violet-500" : "bg-rose-500/10 text-rose-500";
                        return (
                          <div key={idx} className="relative">
                            <div className={`absolute -left-4 top-0.5 w-2 h-2 rounded-full ${dotColor}`} />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className={`inline-flex items-center justify-center h-4 w-4 rounded ${iconBg}`}>
                                  {entry.event === "submitted" ? <FileUp className="h-2.5 w-2.5" /> : entry.event === "approved" ? <CheckCircle2 className="h-2.5 w-2.5" /> : entry.event === "featured" ? <Star className="h-2.5 w-2.5" /> : entry.event === "edited" ? <Edit3 className="h-2.5 w-2.5" /> : entry.event === "viewed" ? <Eye className="h-2.5 w-2.5" /> : <Share2 className="h-2.5 w-2.5" />}
                                </span>
                                <p className="text-[11px] font-medium text-[#111111]">{evtLabel}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-[#5C4A3D]">{timeAgo}</p>
                                <p className="text-[8px] text-[#5C4A3D]/60">{ts.toLocaleDateString()} {ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => { setDrawerOpen(false); openEditModal(drawerTestimonial); }} className="flex-1 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"><Edit3 className="h-4 w-4 mr-1" /> Edit</Button>
                    <Button onClick={() => { setDrawerOpen(false); setPreviewTestimonial(drawerTestimonial); setPreviewModalOpen(true); }} variant="outline" className="border-[#E8DDD0]"><Globe className="h-4 w-4 mr-1" /> Preview</Button>
                    <Button onClick={() => openScheduleModal(drawerTestimonial)} variant="outline" className="border-[#E8DDD0]"><Star className={`h-4 w-4 ${drawerTestimonial.featured ? "fill-amber-500 text-amber-500" : ""}`} /></Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModalOpen(false)} className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#111111]">{editMode === "add" ? "Add Testimonial" : "Edit Testimonial"}</h2>
                  <button onClick={() => setEditModalOpen(false)} className="p-2 rounded-lg hover:bg-[#F5EDE3]"><X className="h-4 w-4" /></button>
                </div>
                <div className="space-y-3">
                  <div><label className="text-xs font-medium text-[#5C4A3D] mb-1 block">Name</label><Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" className="text-sm border-[#E8DDD0]" /></div>
                  <div><label className="text-xs font-medium text-[#5C4A3D] mb-1 block">Role</label><Input value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))} placeholder="e.g. Author" className="text-sm border-[#E8DDD0]" /></div>
                  <div><label className="text-xs font-medium text-[#5C4A3D] mb-1 block">Company</label><Input value={editForm.company} onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))} placeholder="Company name" className="text-sm border-[#E8DDD0]" /></div>
                  <div><label className="text-xs font-medium text-[#5C4A3D] mb-1 block">Testimonial</label><Textarea value={editForm.content} onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))} placeholder="What they said..." rows={4} className="text-sm border-[#E8DDD0]" /></div>
                  <div><label className="text-xs font-medium text-[#5C4A3D] mb-1 block">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button key={r} type="button" onClick={() => setEditForm((f) => ({ ...f, rating: r }))}>
                          <Star className={`h-6 w-6 ${r <= editForm.rating ? "text-amber-500 fill-current" : "text-gray-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div><label className="text-xs font-medium text-[#5C4A3D] mb-1 block">Status</label>
                    <Select value={editForm.status} onValueChange={(v) => setEditForm((f) => ({ ...f, status: v as TestimonialStatus }))}>
                      <SelectTrigger className="text-sm border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="published">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-medium text-[#5C4A3D] mb-1 block">Testimonial Type</label>
                      <Select value={editForm.type} onValueChange={(v) => setEditForm((f) => ({ ...f, type: v as "text" | "image" | "video" }))}>
                        <SelectTrigger className="text-sm border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><label className="text-xs font-medium text-[#5C4A3D] mb-1 block">Published Books</label><Input type="number" min="0" value={editForm.publishedBooks} onChange={(e) => setEditForm((f) => ({ ...f, publishedBooks: parseInt(e.target.value) || 0 }))} className="text-sm border-[#E8DDD0]" /></div>
                  </div>
                  {editForm.type === "video" && (
                    <div><label className="text-xs font-medium text-[#5C4A3D] mb-1 block">Video URL</label><Input value={editForm.videoUrl} onChange={(e) => setEditForm((f) => ({ ...f, videoUrl: e.target.value }))} placeholder="https://..." className="text-sm border-[#E8DDD0]" /></div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 rounded-lg border border-[#E8DDD0] bg-[#F5EDE3]/20">
                      <input type="checkbox" checked={editForm.verifiedAuthor} onChange={(e) => setEditForm((f) => ({ ...f, verifiedAuthor: e.target.checked }))} className="rounded" />
                      <label className="text-xs text-[#5C4A3D]">Verified Author</label>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg border border-[#E8DDD0] bg-[#F5EDE3]/20">
                      <input type="checkbox" checked={editForm.serviceCompleted} onChange={(e) => setEditForm((f) => ({ ...f, serviceCompleted: e.target.checked }))} className="rounded" />
                      <label className="text-xs text-[#5C4A3D]">Service Completed</label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setEditModalOpen(false)} className="flex-1 border-[#E8DDD0]">Cancel</Button>
                  <Button onClick={saveTestimonial} className="flex-1 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">{editMode === "add" ? "Add Testimonial" : "Save Changes"}</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModalOpen(false)} className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                <h2 className="text-lg font-bold text-[#111111]">Delete Testimonial</h2>
                <p className="text-sm text-[#5C4A3D]">Are you sure you want to delete this testimonial? This action cannot be undone.</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="flex-1 border-[#E8DDD0]">Cancel</Button>
                  <Button onClick={() => deleteTarget && deleteTestimonial(deleteTarget)} className="flex-1 bg-red-500 text-white hover:bg-red-600">Delete</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {importModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setImportModalOpen(false); setImportFiles([]); }} className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#111111]">Import Testimonials</h2>
                  <button onClick={() => { setImportModalOpen(false); setImportFiles([]); }} className="p-2 rounded-lg hover:bg-[#F5EDE3]"><X className="h-4 w-4" /></button>
                </div>
                <div className="border-2 border-dashed border-[#E8DDD0] rounded-lg p-8 text-center">
                  <FileUp className="h-10 w-10 mx-auto text-[#8A6A4A]/40 mb-3" />
                  <p className="text-sm text-[#5C4A3D]">Drop files here or click to browse</p>
                  <p className="text-[10px] text-[#5C4A3D]/60 mt-1">Supports CSV, XLSX</p>
                  <input type="file" className="hidden" id="import-input" accept=".csv,.xlsx" multiple onChange={(e) => { if (e.target.files) setImportFiles(Array.from(e.target.files)); }} />
                  <label htmlFor="import-input" className="mt-3 inline-block px-4 py-2 bg-[#F5EDE3] rounded-lg text-xs font-medium text-[#5C4A3D] cursor-pointer hover:bg-[#E8DDD0] transition-colors">Choose Files</label>
                </div>
                {importFiles.length > 0 && <p className="text-xs text-[#5C4A3D]">{importFiles.length} file(s) selected</p>}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setImportModalOpen(false); setImportFiles([]); }} className="flex-1 border-[#E8DDD0]">Cancel</Button>
                  <Button onClick={importTestimonials} disabled={importFiles.length === 0} className="flex-1 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] disabled:opacity-40">Import</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {reportModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReportModalOpen(false)} className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#111111]">Testimonials Report</h2>
                  <button onClick={() => setReportModalOpen(false)} className="p-2 rounded-lg hover:bg-[#F5EDE3]"><X className="h-4 w-4" /></button>
                </div>
                <div className="space-y-2 text-xs text-[#5C4A3D]">
                  <div className="flex justify-between p-2 bg-[#F5EDE3]/50 rounded"><span>Total Testimonials</span><span className="font-bold text-[#111111]">{testimonials.length}</span></div>
                  <div className="flex justify-between p-2 bg-[#F5EDE3]/50 rounded"><span>Approved</span><span className="font-bold text-[#111111]">{stats.published}</span></div>
                  <div className="flex justify-between p-2 bg-[#F5EDE3]/50 rounded"><span>Featured</span><span className="font-bold text-[#111111]">{stats.featured}</span></div>
                  <div className="flex justify-between p-2 bg-[#F5EDE3]/50 rounded"><span>Pending</span><span className="font-bold text-[#111111]">{stats.pending}</span></div>
                  <div className="flex justify-between p-2 bg-[#F5EDE3]/50 rounded"><span>Average Rating</span><span className="font-bold text-[#111111]">{stats.avgRating}★</span></div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => { exportPDF(); setReportModalOpen(false); }} className="flex-1 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"><Download className="h-4 w-4 mr-1" /> PDF</Button>
                  <Button onClick={() => { exportCSV(); setReportModalOpen(false); }} variant="outline" className="flex-1 border-[#E8DDD0]"><Download className="h-4 w-4 mr-1" /> CSV</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Website Preview Modal */}
      <AnimatePresence>
        {previewModalOpen && previewTestimonial && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewModalOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0]">
                  <div>
                    <h2 className="text-lg font-bold text-[#111111]">Preview on Website</h2>
                    <p className="text-xs text-[#5C4A3D]">{previewTestimonial.name} — {previewTestimonial.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#F5EDE3] rounded-lg p-0.5">
                      {([
                        { key: "desktop" as const, icon: Monitor, label: "Desktop", width: "w-full" },
                        { key: "tablet" as const, icon: Tablet, label: "Tablet", width: "w-[768px]" },
                        { key: "mobile" as const, icon: Smartphone, label: "Mobile", width: "w-[375px]" },
                      ]).map((d) => (
                        <button key={d.key} onClick={() => setPreviewDevice(d.key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${previewDevice === d.key ? "bg-white shadow-sm text-[#111111]" : "text-[#5C4A3D] hover:text-[#111111]"}`}>
                          <d.icon className="h-3.5 w-3.5" />{d.label}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setPreviewModalOpen(false)} className="p-2 rounded-lg hover:bg-[#F5EDE3]"><X className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto bg-gray-100 p-6 flex justify-center">
                  <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${previewDevice === "desktop" ? "w-full" : previewDevice === "tablet" ? "w-[768px]" : "w-[375px]"}`}>
                    {/* Simulated website header */}
                    <div className="bg-[#1D1D1D] px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-[#D8B27A]" />
                        <span className="text-white text-sm font-semibold">Statement Publications</span>
                      </div>
                      <div className="hidden md:flex items-center gap-4 text-xs text-gray-400">
                        <span>Home</span><span>About</span><span>Services</span><span>Blog</span><span>Contact</span>
                      </div>
                    </div>
                    {/* Testimonial display */}
                    <div className="p-8">
                      <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-6">
                          <p className="text-xs uppercase tracking-wider text-[#8A6A4A] font-semibold mb-2">What Our Authors Say</p>
                          <h3 className="text-2xl font-bold text-[#1D1D1D]">Featured Testimonials</h3>
                        </div>
                        <div className="bg-[#FDF6EE] rounded-xl p-6 border border-[#E8DDD0]">
                          {previewTestimonial.type === "video" && previewTestimonial.videoUrl && (
                            <div className="rounded-lg overflow-hidden mb-4 bg-black">
                              <video controls className="w-full h-auto max-h-[240px]">
                                <source src={previewTestimonial.videoUrl} type="video/mp4" />
                              </video>
                            </div>
                          )}
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`h-4 w-4 ${s <= previewTestimonial.rating ? "text-[#D8B27A] fill-[#D8B27A]" : "text-gray-300"}`} />
                            ))}
                          </div>
                          <p className="text-[#1D1D1D] leading-relaxed italic mb-4">&ldquo;{previewTestimonial.content}&rdquo;</p>
                          <div className="flex items-center gap-3 pt-3 border-t border-[#E8DDD0]">
                            <div className="h-10 w-10 rounded-full bg-[#8A6A4A]/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-[#8A6A4A]" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#1D1D1D]">{previewTestimonial.name}</p>
                              <p className="text-xs text-[#5C4A3D]">{previewTestimonial.role} at {previewTestimonial.company}</p>
                            </div>
                            {previewTestimonial.verifiedAuthor && (
                              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] ml-auto flex items-center gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" />Verified Author</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Simulated footer */}
                    <div className="bg-[#1D1D1D] px-6 py-4 text-center">
                      <p className="text-xs text-gray-500">&copy; 2026 Statement Publications. All rights reserved.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Featured Schedule Modal */}
      <AnimatePresence>
        {scheduleModalOpen && scheduleTestimonial && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setScheduleModalOpen(false)} className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#111111]">{scheduleTestimonial.featured ? "Unfeature Testimonial" : "Feature Testimonial"}</h2>
                  <button onClick={() => setScheduleModalOpen(false)} className="p-2 rounded-lg hover:bg-[#F5EDE3]"><X className="h-4 w-4" /></button>
                </div>
                {scheduleTestimonial.featured ? (
                  <p className="text-sm text-[#5C4A3D]">Are you sure you want to unfeature this testimonial from {scheduleTestimonial.name}?</p>
                ) : (
                  <>
                    <p className="text-sm text-[#5C4A3D]">Set the scheduling period for featuring this testimonial from {scheduleTestimonial.name}.</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-[#5C4A3D] mb-1 block">Start Date</label>
                        <Input type="date" value={scheduleStartDate} onChange={(e) => setScheduleStartDate(e.target.value)} className="text-sm border-[#E8DDD0]" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#5C4A3D] mb-1 block">End Date</label>
                        <Input type="date" value={scheduleEndDate} onChange={(e) => setScheduleEndDate(e.target.value)} className="text-sm border-[#E8DDD0]" />
                      </div>
                      {scheduleStartDate && scheduleEndDate && (
                        <div className="p-3 rounded-lg bg-[#F5EDE3]/50 border border-[#E8DDD0]">
                          <div className="flex items-center gap-1.5 text-xs text-[#5C4A3D]">
                            <Calendar className="h-3.5 w-3.5 text-[#8A6A4A]" />
                            <span>Featured from <strong className="text-[#111111]">{new Date(scheduleStartDate).toLocaleDateString()}</strong> to <strong className="text-[#111111]">{new Date(scheduleEndDate).toLocaleDateString()}</strong></span>
                          </div>
                          <p className="text-[10px] text-[#5C4A3D]/70 mt-1 ml-5">Status will be automatically removed after the end date.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setScheduleModalOpen(false)} className="flex-1 border-[#E8DDD0]">Cancel</Button>
                  <Button onClick={applySchedule} className={`flex-1 ${scheduleTestimonial.featured ? "bg-red-500 hover:bg-red-600 text-white" : "bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]"}`}>
                    {scheduleTestimonial.featured ? "Unfeature" : "Feature with Schedule"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
