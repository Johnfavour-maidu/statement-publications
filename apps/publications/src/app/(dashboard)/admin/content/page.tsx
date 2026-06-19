"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Trash2, Eye, RefreshCw, Star, BarChart3,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Clock,
  MessageSquare, Download, Edit3, X, FileText, Globe, Share2,
  Eye as EyeIcon, SlidersHorizontal, CheckCircle2, Activity,
  Zap, Settings, ExternalLink, Monitor, Smartphone, Tablet,
  Calendar, FileQuestion, Megaphone, TrendingUp, Users,
  MousePointerClick, Timer, LayoutDashboard, GripVertical,
  ArrowUp, ArrowDown, RotateCcw, Filter, Save, Image,
  Send, Mail, Link, Hash, Tag, Type, AlignLeft, Code,
  BarChart2, PieChart, AlertTriangle, Info, Copy, Archive,
  BookOpen, PenTool, Layers, Target, Award, Globe2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  isActive: boolean;
  featured: boolean;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  priority: "high" | "medium" | "low";
  type: "info" | "warning" | "success";
  audience: string;
}

interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  featuredTitle: string;
  featuredSubtitle: string;
  featuredEnabled: boolean;
  newsletterHeading: string;
  newsletterDescription: string;
  footerDescription: string;
}

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterCard: string;
  canonicalUrl: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  status: "active" | "draft" | "scheduled";
  position: "homepage-hero" | "homepage-mid" | "sidebar" | "footer";
}

interface ContentActivity {
  id: string;
  action: string;
  section: string;
  admin: string;
  timestamp: string;
  type: "edit" | "create" | "delete" | "publish" | "archive";
}

interface HomepageBlock {
  id: string;
  name: string;
  status: "Published" | "Draft" | "Hidden";
  icon: React.ReactNode;
  description: string;
}

const mockFAQs: FAQ[] = [
  { id: "faq-1", question: "How do I publish a book on Statement?", answer: "To publish a book, create an author account, upload your manuscript in EPUB, PDF, or DOCX format, fill in your book details including title, description, and pricing, then submit for review. Our editorial team reviews submissions within 5-7 business days. Once approved, your book goes live on the Statement marketplace.", category: "Publishing", isActive: true },
  { id: "faq-2", question: "What file formats are accepted for manuscript upload?", answer: "Statement accepts EPUB, PDF, and DOCX files for ebooks. For print books, we require a print-ready PDF with proper bleed settings (0.125 inches). Audiobook submissions should be in MP3 or M4B format with a minimum bitrate of 128kbps. All files are scanned for quality and formatting compliance before approval.", category: "Publishing", isActive: true },
  { id: "faq-3", question: "Can I publish my book in multiple formats simultaneously?", answer: "Absolutely! Statement supports multi-format publishing. You can release your book as an ebook (EPUB + PDF), paperback, hardcover, and audiobook all at once. Each format has its own royalty structure, and you manage everything from a single dashboard. Bundle pricing options are also available.", category: "Publishing", isActive: true },
  { id: "faq-4", question: "How do I edit my manuscript after publishing?", answer: "You can submit updated manuscripts through your author dashboard. Navigate to Your Books, select the title, and click Update Manuscript. Minor corrections (typos, formatting) are processed within 24 hours. Major revisions may require a new review cycle of 3-5 business days. Readers who purchased the previous version will receive the updated edition automatically.", category: "Editing", isActive: true },
  { id: "faq-5", question: "What editing services does Statement offer?", answer: "Statement provides three tiers of editing: Structural Edit (story architecture, pacing, character development), Line Edit (prose refinement, clarity, flow), and Copy Edit (grammar, consistency, fact-checking). Each service includes a detailed editorial report. Pricing starts at $0.02/word for copy editing and $0.05/word for developmental editing.", category: "Editing", isActive: true },
  { id: "faq-6", question: "How do royalties and payments work?", answer: "Authors earn 70% of net sales for ebooks priced $2.99 and above, dropping to 35% for lower price points. Print book royalties are calculated after printing costs. Royalties accrue monthly and are paid via bank transfer, PayPal, or mobile money once your balance reaches $50. A comprehensive earnings dashboard tracks all transactions in real time.", category: "Payments", isActive: true },
  { id: "faq-7", question: "What are the payment withdrawal options?", answer: "Statement supports multiple payout methods: direct bank transfer (available in 40+ countries), PayPal, Payoneer, and mobile money (M-Pesa, MTN Mobile Money, Airtel Money). Withdrawals are processed within 3-5 business days. You can set up multiple payout methods and choose your preferred option for each payout cycle.", category: "Payments", isActive: true },
  { id: "faq-8", question: "How can I market my book on Statement?", answer: "Statement offers built-in marketing tools including promotional pricing, featured placement bids, newsletter promotions to 50,000+ subscribers, social media sharing tools, and an affiliate program. Authors also get access to a marketing resource center with templates, guides, and best practices for book launches and sustained visibility.", category: "Marketing", isActive: true },
  { id: "faq-9", question: "Does Statement offer book cover design services?", answer: "Yes, our in-house design studio creates custom book covers starting at $199. You can choose from three packages: Essential (pre-made templates customized with your details), Professional (custom layout with stock imagery), and Premium (fully bespoke design with original artwork). All covers are optimized for both digital thumbnails and print.", category: "Marketing", isActive: false },
  { id: "faq-10", question: "What analytics and reporting tools are available?", answer: "Authors get a comprehensive analytics dashboard with real-time sales tracking, geographic reader data, conversion funnels, marketing campaign performance, and royalty projections. You can export detailed reports in CSV and PDF formats. Advanced analytics include reader engagement metrics, category ranking tracking, and competitive positioning.", category: "General", isActive: true },
  { id: "faq-11", question: "How does the ISBN assignment process work?", answer: "Statement provides free ISBNs for all books published through the platform, assigned automatically upon submission. If you prefer to use your own ISBN, you can enter it during the book setup process. Statement ISBNs are registered with major distribution networks and include proper metadata for discoverability across all retail channels.", category: "General", isActive: true },
  { id: "faq-12", question: "Can I set different prices for different regions?", answer: "Yes, Statement supports regional pricing. You can set custom prices for up to 12 geographic regions including Africa, North America, Europe, Asia-Pacific, and more. We also support currency conversion with localized pricing that adjusts to local market conditions. promotional pricing tools let you run region-specific sales events.", category: "General", isActive: true },
];

const mockTestimonials: Testimonial[] = [
  { id: "t-1", name: "Chinua Adebayo", role: "Bestselling Author", content: "Statement Publications transformed my writing career. The platform is intuitive, the royalties are fair, and the support team is incredible. I published three books in my first year and hit the bestseller list on my second.", rating: 5, isActive: true, featured: true },
  { id: "t-2", name: "Amina Okonkwo", role: "Indie Author & Poet", content: "As a poet, I was worried about finding the right audience. Statement's recommendation engine connected my work with readers across 12 countries. The analytics help me understand exactly what my readers love.", rating: 5, isActive: true, featured: true },
  { id: "t-3", name: "Kofi Mensah", role: "First-time Author", content: "I was nervous about self-publishing as a first-time author, but Statement made the entire process straightforward. From manuscript upload to my first sale in under two weeks, every step was clear and well-supported.", rating: 4, isActive: true, featured: false },
  { id: "t-4", name: "Fatima Hassan", role: "Award-winning Novelist", content: "The global reach of Statement is unmatched. My novel reached readers in 23 countries within six months. The multi-format publishing feature let me release as ebook, audiobook, and print simultaneously.", rating: 5, isActive: true, featured: true },
  { id: "t-5", name: "Tunde Bakare", role: "Business Book Author", content: "The marketing tools on Statement are game-changing. I ran a promotional campaign that generated 3,000 sales in one week. The affiliate program has also brought consistent passive sales month after month.", rating: 4, isActive: true, featured: false },
  { id: "t-6", name: "Ngozi Eze", role: "Children's Book Author", content: "Statement's design team created the most beautiful cover for my children's book. The interior layout tools made it easy to place illustrations perfectly. My books are now in school libraries across West Africa.", rating: 5, isActive: false, featured: false },
];

const mockAnnouncements: Announcement[] = [
  { id: "a-1", title: "Summer Reading Festival — 40% Off All Ebooks", content: "Celebrate the Summer Reading Festival with 40% off all ebooks from June 20 to July 31. Use code SUMMER40 at checkout. Over 5,000 titles are included in this promotion across every genre.", isActive: true, startDate: "2026-06-15T00:00:00Z", endDate: "2026-07-31T23:59:59Z", priority: "high", type: "success", audience: "All Users" },
  { id: "a-2", title: "New Audiobook Creation Studio Launched", content: "We are thrilled to announce the launch of our native Audiobook Creation Studio. Authors can now record, edit, and publish audiobooks directly on Statement with AI-assisted mastering and noise reduction. Early adopters get 50% off processing fees.", isActive: true, startDate: "2026-06-10T00:00:00Z", endDate: null, priority: "high", type: "info", audience: "Authors" },
  { id: "a-3", title: "Scheduled Maintenance — June 25, 2026", content: "Statement will undergo scheduled infrastructure maintenance on June 25 from 2:00 AM to 5:00 AM UTC. During this window, ebook downloads may be temporarily slow. All other features will remain operational.", isActive: true, startDate: "2026-06-20T00:00:00Z", endDate: "2026-06-26T00:00:00Z", priority: "medium", type: "warning", audience: "All Users" },
  { id: "a-4", title: "Author Earnings Report — Q2 2026 Available", content: "Your Q2 2026 earnings report is now available in the dashboard. Authors earned a combined $2.4M this quarter, up 18% from Q1. Log in to view your detailed breakdown and download your tax-ready statement.", isActive: true, startDate: "2026-06-18T00:00:00Z", endDate: null, priority: "medium", type: "success", audience: "Authors" },
  { id: "a-5", title: "Reader Loyalty Program — Beta Launch", content: "We are piloting a Reader Loyalty Program that rewards frequent buyers with exclusive discounts, early access to new releases, and personalized book recommendations. Beta access is rolling out to the top 1,000 readers this month.", isActive: false, startDate: "2026-06-01T00:00:00Z", endDate: "2026-06-30T23:59:59Z", priority: "low", type: "info", audience: "Readers" },
  { id: "a-6", title: "Updated Content Guidelines — Effective July 1", content: "Statement has updated its content guidelines to align with international publishing standards. Key changes include updated cover art specifications, revised metadata requirements, and new content classification categories. Review the full guidelines in the author help center.", isActive: false, startDate: "2026-06-12T00:00:00Z", endDate: null, priority: "high", type: "warning", audience: "Authors" },
];

const initialHomepage: HomepageContent = {
  heroTitle: "Discover African Literature at Its Finest",
  heroSubtitle: "Explore a curated collection of books from talented African authors. Read, publish, and connect with the literary community.",
  heroCtaText: "Start Reading",
  featuredTitle: "Featured Books",
  featuredSubtitle: "Hand-picked selections from our editorial team",
  featuredEnabled: true,
  newsletterHeading: "Stay Updated",
  newsletterDescription: "Subscribe to our newsletter for the latest book releases, author interviews, and exclusive content delivered to your inbox.",
  footerDescription: "Statement Publications — Empowering African authors to share their stories with the world.",
};

const initialSEO: SEOData = {
  metaTitle: "Statement Publications — African Publishing Platform",
  metaDescription: "Discover, publish, and distribute African literature. Statement Publications empowers authors with professional publishing tools, global distribution, and 70% royalties.",
  keywords: "African publishing, self publishing Africa, book publishing, indie authors, ebooks, Statement Publications",
  ogTitle: "Statement Publications — Where African Stories Find the World",
  ogDescription: "The premier platform for African authors to publish, distribute, and sell their books globally. Join 10,000+ authors today.",
  twitterCard: "summary_large_image",
  canonicalUrl: "https://statementpublications.com",
};

const mockBanners: Banner[] = [
  { id: "b-1", title: "Summer Reading Festival", subtitle: "40% off all ebooks — Limited time offer", ctaText: "Shop the Sale", ctaLink: "/promotions/summer-festival", status: "active", position: "homepage-hero" },
  { id: "b-2", title: "Start Publishing Today", subtitle: "Join 10,000+ authors who chose Statement", ctaText: "Publish Your Book", ctaLink: "/publish/get-started", status: "active", position: "homepage-mid" },
  { id: "b-3", title: "Author Spotlight Program", subtitle: "Get featured on our homepage and newsletter", ctaText: "Apply Now", ctaLink: "/programs/spotlight", status: "draft", position: "sidebar" },
  { id: "b-4", title: "New Release: Untold Narratives", subtitle: "Discover this month's most anticipated titles", ctaText: "Explore Collection", ctaLink: "/collections/new-releases", status: "scheduled", position: "homepage-hero" },
];

const initialBlocks: HomepageBlock[] = [
  { id: "hero", name: "Hero Section", status: "Published", icon: <Globe className="h-4 w-4" />, description: "Main hero banner with title, subtitle, and CTA" },
  { id: "featured", name: "Featured Books", status: "Published", icon: <BookOpen className="h-4 w-4" />, description: "Curated featured books carousel" },
  { id: "categories", name: "Popular Categories", status: "Published", icon: <Layers className="h-4 w-4" />, description: "Browse by genre category tiles" },
  { id: "testimonials", name: "Testimonials", status: "Published", icon: <Star className="h-4 w-4" />, description: "Author and reader testimonials" },
  { id: "spotlight", name: "Author Spotlight", status: "Draft", icon: <Award className="h-4 w-4" />, description: "Featured author profile and works" },
  { id: "newsletter", name: "Newsletter Section", status: "Published", icon: <Mail className="h-4 w-4" />, description: "Email newsletter signup form" },
];

const mockActivityLog: ContentActivity[] = [
  { id: "cl-1", action: "Updated hero banner text and CTA", section: "Homepage", admin: "Sarah Mitchell", timestamp: new Date(Date.now() - 3600000).toISOString(), type: "edit" },
  { id: "cl-2", action: "Created announcement: Summer Reading Festival", section: "Announcements", admin: "James Cooper", timestamp: new Date(Date.now() - 7200000).toISOString(), type: "create" },
  { id: "cl-3", action: "Published 3 new FAQs in Publishing category", section: "FAQs", admin: "Admin User", timestamp: new Date(Date.now() - 18000000).toISOString(), type: "publish" },
  { id: "cl-4", action: "Archived old maintenance announcement", section: "Announcements", admin: "Sarah Mitchell", timestamp: new Date(Date.now() - 43200000).toISOString(), type: "archive" },
  { id: "cl-5", action: "Updated SEO meta tags for homepage", section: "SEO Content", admin: "James Cooper", timestamp: new Date(Date.now() - 86400000).toISOString(), type: "edit" },
  { id: "cl-6", action: "Created promotional banner: Author Campaign", section: "Banners", admin: "Admin User", timestamp: new Date(Date.now() - 172800000).toISOString(), type: "create" },
];

export default function AdminContentPage() {
  const [faqs, setFAQs] = useState<FAQ[]>(mockFAQs);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [homepage, setHomepage] = useState<HomepageContent>(initialHomepage);
  const [seo, setSEO] = useState<SEOData>(initialSEO);
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [activityLog, setActivityLog] = useState<ContentActivity[]>(mockActivityLog);
  const [homepageBlocks, setHomepageBlocks] = useState<HomepageBlock[]>(initialBlocks);

  const [faqDialogOpen, setFAQDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [faqDeleteDialogOpen, setFAQDeleteDialogOpen] = useState(false);
  const [announcementDeleteDialogOpen, setAnnouncementDeleteDialogOpen] = useState(false);
  const [bannerDeleteDialogOpen, setBannerDeleteDialogOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingFAQId, setDeletingFAQId] = useState<string | null>(null);
  const [deletingAnnouncementId, setDeletingAnnouncementId] = useState<string | null>(null);
  const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);

  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "", category: "General" });
  const [newAnnouncement, setNewAnnouncement] = useState<{ title: string; content: string; endDate: string; priority: "high" | "medium" | "low"; type: "info" | "warning" | "success"; audience: string }>({ title: "", content: "", endDate: "", priority: "medium", type: "info", audience: "All Users" });
  const [newBanner, setNewBanner] = useState<{ title: string; subtitle: string; ctaText: string; ctaLink: string; position: "homepage-hero" | "homepage-mid" | "sidebar" | "footer" }>({ title: "", subtitle: "", ctaText: "", ctaLink: "", position: "homepage-hero" });

  const [faqSearch, setFAQSearch] = useState("");
  const [faqFilterCategory, setFAQFilterCategory] = useState("All");
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [globalSearch, setGlobalSearch] = useState("");
  const [activeSummaryCard, setActiveSummaryCard] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeCMSFilter, setActiveCMSFilter] = useState<string | null>(null);

  const [blockVisibility, setBlockVisibility] = useState<Record<string, boolean>>({
    hero: true, featured: true, categories: true, testimonials: true, spotlight: true, newsletter: true
  });

  const quickActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) setQuickActionsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const addActivity = useCallback((type: ContentActivity["type"], action: string, section: string) => {
    setActivityLog((prev) => [{
      id: `cl-${Date.now()}`,
      action,
      section,
      admin: "Admin User",
      timestamp: new Date().toISOString(),
      type,
    }, ...prev].slice(0, 50));
  }, []);

  const handleSaveFAQ = useCallback(() => {
    if (editingFAQ) {
      setFAQs((prev) => prev.map((f) => f.id === editingFAQ.id ? { ...f, question: newFAQ.question, answer: newFAQ.answer, category: newFAQ.category } : f));
      addActivity("edit", `Updated FAQ: ${newFAQ.question.substring(0, 40)}...`, "FAQs");
      showNotification("success", "FAQ updated successfully");
    } else {
      setFAQs((prev) => [...prev, { id: `faq-${Date.now()}`, question: newFAQ.question, answer: newFAQ.answer, category: newFAQ.category, isActive: true }]);
      addActivity("create", `Created FAQ: ${newFAQ.question.substring(0, 40)}...`, "FAQs");
      showNotification("success", "FAQ created successfully");
    }
    setFAQDialogOpen(false);
    setEditingFAQ(null);
    setNewFAQ({ question: "", answer: "", category: "General" });
  }, [editingFAQ, newFAQ, addActivity, showNotification]);

  const handleSaveAnnouncement = useCallback(() => {
    if (editingAnnouncement) {
      setAnnouncements((prev) => prev.map((a) => a.id === editingAnnouncement.id ? { ...a, title: newAnnouncement.title, content: newAnnouncement.content, priority: newAnnouncement.priority, type: newAnnouncement.type, audience: newAnnouncement.audience, endDate: newAnnouncement.endDate ? new Date(newAnnouncement.endDate).toISOString() : a.endDate } : a));
      addActivity("edit", `Updated announcement: ${newAnnouncement.title}`, "Announcements");
      showNotification("success", "Announcement updated successfully");
    } else {
      setAnnouncements((prev) => [...prev, { id: `a-${Date.now()}`, title: newAnnouncement.title, content: newAnnouncement.content, isActive: true, startDate: new Date().toISOString(), endDate: newAnnouncement.endDate ? new Date(newAnnouncement.endDate).toISOString() : null, priority: newAnnouncement.priority, type: newAnnouncement.type, audience: newAnnouncement.audience }]);
      addActivity("create", `Created announcement: ${newAnnouncement.title}`, "Announcements");
      showNotification("success", "Announcement published successfully");
    }
    setAnnouncementDialogOpen(false);
    setEditingAnnouncement(null);
    setNewAnnouncement({ title: "", content: "", endDate: "", priority: "medium", type: "info", audience: "All Users" });
  }, [editingAnnouncement, newAnnouncement, addActivity, showNotification]);

  const handleSaveBanner = useCallback(() => {
    if (editingBanner) {
      setBanners((prev) => prev.map((b) => b.id === editingBanner.id ? { ...b, title: newBanner.title, subtitle: newBanner.subtitle, ctaText: newBanner.ctaText, ctaLink: newBanner.ctaLink, position: newBanner.position } : b));
      addActivity("edit", `Updated banner: ${newBanner.title}`, "Banners");
      showNotification("success", "Banner updated successfully");
    } else {
      setBanners((prev) => [...prev, { id: `b-${Date.now()}`, title: newBanner.title, subtitle: newBanner.subtitle, ctaText: newBanner.ctaText, ctaLink: newBanner.ctaLink, status: "draft", position: newBanner.position }]);
      addActivity("create", `Created banner: ${newBanner.title}`, "Banners");
      showNotification("success", "Banner created successfully");
    }
    setBannerDialogOpen(false);
    setEditingBanner(null);
    setNewBanner({ title: "", subtitle: "", ctaText: "", ctaLink: "", position: "homepage-hero" });
  }, [editingBanner, newBanner, addActivity, showNotification]);

  const toggleFAQActive = useCallback((id: string) => {
    setFAQs((prev) => prev.map((f) => f.id === id ? { ...f, isActive: !f.isActive } : f));
  }, []);

  const toggleAnnouncementActive = useCallback((id: string) => {
    setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a));
  }, []);

  const deleteFAQ = useCallback((id: string) => {
    setDeletingFAQId(id);
    setFAQDeleteDialogOpen(true);
  }, []);

  const confirmDeleteFAQ = useCallback(() => {
    if (deletingFAQId) {
      const faq = faqs.find((f) => f.id === deletingFAQId);
      setFAQs((prev) => prev.filter((f) => f.id !== deletingFAQId));
      addActivity("delete", `Deleted FAQ: ${faq?.question.substring(0, 40) || "Unknown"}...`, "FAQs");
      showNotification("success", "FAQ deleted");
    }
    setDeletingFAQId(null);
    setFAQDeleteDialogOpen(false);
  }, [deletingFAQId, faqs, addActivity, showNotification]);

  const deleteAnnouncement = useCallback((id: string) => {
    setDeletingAnnouncementId(id);
    setAnnouncementDeleteDialogOpen(true);
  }, []);

  const confirmDeleteAnnouncement = useCallback(() => {
    if (deletingAnnouncementId) {
      const ann = announcements.find((a) => a.id === deletingAnnouncementId);
      setAnnouncements((prev) => prev.filter((a) => a.id !== deletingAnnouncementId));
      addActivity("delete", `Deleted announcement: ${ann?.title || "Unknown"}`, "Announcements");
      showNotification("success", "Announcement deleted");
    }
    setDeletingAnnouncementId(null);
    setAnnouncementDeleteDialogOpen(false);
  }, [deletingAnnouncementId, announcements, addActivity, showNotification]);

  const deleteBanner = useCallback((id: string) => {
    setDeletingBannerId(id);
    setBannerDeleteDialogOpen(true);
  }, []);

  const confirmDeleteBanner = useCallback(() => {
    if (deletingBannerId) {
      const banner = banners.find((b) => b.id === deletingBannerId);
      setBanners((prev) => prev.filter((b) => b.id !== deletingBannerId));
      addActivity("delete", `Deleted banner: ${banner?.title || "Unknown"}`, "Banners");
      showNotification("success", "Banner deleted");
    }
    setDeletingBannerId(null);
    setBannerDeleteDialogOpen(false);
  }, [deletingBannerId, banners, addActivity, showNotification]);

  const moveFAQ = useCallback((id: string, direction: "up" | "down") => {
    setFAQs((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const updated = [...prev];
      [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
      return updated;
    });
  }, []);

  const toggleFAQExpand = useCallback((id: string) => {
    setExpandedFAQs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filteredFAQs = useMemo(() => faqs.filter((faq) => {
    const matchSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    const matchCategory = faqFilterCategory === "All" || faq.category === faqFilterCategory;
    return matchSearch && matchCategory;
  }), [faqs, faqSearch, faqFilterCategory]);

  const faqCategories = useMemo(() => ["All", ...Array.from(new Set(faqs.map((f) => f.category)))], [faqs]);

  const exportContentReport = useCallback((format: string) => {
    const data = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalFAQs: faqs.length,
        activeFAQs: faqs.filter((f) => f.isActive).length,
        totalTestimonials: testimonials.length,
        featuredTestimonials: testimonials.filter((t) => t.featured).length,
        totalAnnouncements: announcements.length,
        activeAnnouncements: announcements.filter((a) => a.isActive).length,
        totalBanners: banners.length,
        activeBanners: banners.filter((b) => b.status === "active").length,
        homepageBlocks: homepageBlocks.length,
        seoScore: 92,
        contentHealth: 87,
      },
      faqs, testimonials, announcements, banners, seo, homepage,
    };

    if (format === "csv") {
      const headers = ["Type", "ID", "Title/Question", "Status", "Category/Details", "Date"];
      const rows: string[][] = [];
      faqs.forEach((f) => rows.push(["FAQ", f.id, f.question, f.isActive ? "Active" : "Inactive", f.category, ""]));
      testimonials.forEach((t) => rows.push(["Testimonial", t.id, t.name, t.isActive ? "Active" : "Inactive", t.role, ""]));
      announcements.forEach((a) => rows.push(["Announcement", a.id, a.title, a.isActive ? "Active" : "Inactive", a.priority, a.startDate]));
      banners.forEach((b) => rows.push(["Banner", b.id, b.title, b.status, b.position, ""]));
      const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `content-report-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification("success", "CSV report downloaded");
    } else if (format === "pdf" || format === "excel") {
      const html = `<!DOCTYPE html><html><head><title>Content Report — Statement Publications</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1D1D1D}h1{color:#8A6A4A;border-bottom:2px solid #D8B27A;padding-bottom:8px}h2{color:#8A6A4A;margin-top:24px}.stat{display:inline-block;width:22%;margin:8px;padding:12px;border:1px solid #E8DDD0;border-radius:8px;background:#F5EDE3}.stat .label{font-size:11px;color:#5C4A3D}.stat .value{font-size:22px;font-weight:bold}table{width:100%;border-collapse:collapse;margin-top:8px}td,th{padding:6px 10px;border:1px solid #E8DDD0;text-align:left;font-size:12px}th{background:#F5EDE3;font-weight:600}.badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600}.active{background:#DCFCE7;color:#16A34A}.inactive{background:#FEE2E2;color:#DC2626}.draft{background:#FEF3C7;color:#D97706}</style></head><body><h1>Content Management Report</h1><p>Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p><div><div class="stat"><div class="label">Total FAQs</div><div class="value">${faqs.length}</div></div><div class="stat"><div class="label">Active Announcements</div><div class="value">${announcements.filter((a) => a.isActive).length}</div></div><div class="stat"><div class="label">Testimonials</div><div class="value">${testimonials.length}</div></div><div class="stat"><div class="label">Active Banners</div><div class="value">${banners.filter((b) => b.status === "active").length}</div></div></div><h2>Frequently Asked Questions</h2><table><tr><th>Question</th><th>Category</th><th>Status</th></tr>${faqs.map((f) => `<tr><td>${f.question}</td><td>${f.category}</td><td><span class="badge ${f.isActive ? "active" : "inactive"}">${f.isActive ? "Active" : "Inactive"}</span></td></tr>`).join("")}</table><h2>Testimonials</h2><table><tr><th>Author</th><th>Role</th><th>Rating</th><th>Status</th></tr>${testimonials.map((t) => `<tr><td>${t.name}</td><td>${t.role}</td><td>${"★".repeat(t.rating)}</td><td><span class="badge ${t.isActive ? "active" : "inactive"}">${t.isActive ? "Active" : "Inactive"}</span></td></tr>`).join("")}</table><h2>Announcements</h2><table><tr><th>Title</th><th>Priority</th><th>Audience</th><th>Status</th></tr>${announcements.map((a) => `<tr><td>${a.title}</td><td>${a.priority}</td><td>${a.audience}</td><td><span class="badge ${a.isActive ? "active" : "inactive"}">${a.isActive ? "Active" : "Inactive"}</span></td></tr>`).join("")}</table><h2>Promotional Banners</h2><table><tr><th>Title</th><th>Status</th><th>Position</th><th>CTA</th></tr>${banners.map((b) => `<tr><td>${b.title}</td><td><span class="badge ${b.status}">${b.status}</span></td><td>${b.position}</td><td>${b.ctaText}</td></tr>`).join("")}</table></body></html>`;
      const w = window.open("", "_blank");
      if (w) { w.document.write(html); w.document.close(); w.print(); }
      showNotification("success", `${format.toUpperCase()} report generated`);
    }
    setExportDialogOpen(false);
  }, [faqs, testimonials, announcements, banners, seo, homepage, homepageBlocks, showNotification]);

  const globalSearchResults = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    const results: { type: string; title: string; detail: string; id: string }[] = [];
    faqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)).forEach((f) => results.push({ type: "FAQ", title: f.question, detail: f.category, id: f.id }));
    announcements.filter((a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)).forEach((a) => results.push({ type: "Announcement", title: a.title, detail: a.audience, id: a.id }));
    testimonials.filter((t) => t.name.toLowerCase().includes(q) || t.content.toLowerCase().includes(q)).forEach((t) => results.push({ type: "Testimonial", title: `${t.name} — ${t.role}`, detail: t.content.substring(0, 60) + "...", id: t.id }));
    banners.filter((b) => b.title.toLowerCase().includes(q) || b.subtitle.toLowerCase().includes(q)).forEach((b) => results.push({ type: "Banner", title: b.title, detail: b.position, id: b.id }));
    if (homepage.heroTitle.toLowerCase().includes(q) || homepage.heroSubtitle.toLowerCase().includes(q)) results.push({ type: "Homepage", title: "Homepage Hero Section", detail: homepage.heroTitle, id: "hp-hero" });
    if (seo.metaTitle.toLowerCase().includes(q) || seo.metaDescription.toLowerCase().includes(q)) results.push({ type: "SEO", title: "SEO Configuration", detail: seo.metaTitle, id: "seo-1" });
    return results;
  }, [globalSearch, faqs, announcements, testimonials, banners, homepage, seo]);

  const contentStats = useMemo(() => ({
    totalFAQs: faqs.length,
    activeFAQs: faqs.filter((f) => f.isActive).length,
    totalTestimonials: testimonials.length,
    featuredTestimonials: testimonials.filter((t) => t.featured).length,
    activeAnnouncements: announcements.filter((a) => a.isActive).length,
    totalAnnouncements: announcements.length,
    activeBanners: banners.filter((b) => b.status === "active").length,
    publishedBlocks: homepageBlocks.filter((b) => b.status === "Published").length,
  }), [faqs, testimonials, announcements, banners, homepageBlocks]);

  const homepagePreviewHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, serif; background: #F5EDE3; color: #1D1D1D; }
  .hero { background: linear-gradient(135deg, #8A6A4A, #D8B27A); padding: 40px 24px; text-align: center; }
  .hero h1 { color: white; font-size: 22px; margin-bottom: 8px; }
  .hero p { color: rgba(255,255,255,0.9); font-size: 13px; margin-bottom: 16px; }
  .hero .cta { background: white; color: #8A6A4A; padding: 8px 20px; border: none; font-size: 12px; font-weight: bold; cursor: pointer; border-radius: 4px; }
  .section { padding: 24px; }
  .section h2 { font-size: 18px; margin-bottom: 4px; }
  .section p { color: #666; font-size: 12px; }
  .books { display: flex; gap: 12px; margin-top: 16px; }
  .book { flex: 1; background: white; border-radius: 8px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .book .cover { height: 60px; background: linear-gradient(135deg, #D8B27A, #E8DDD0); border-radius: 4px; margin-bottom: 8px; }
  .book .title { font-size: 11px; font-weight: bold; }
  .book .author { font-size: 10px; color: #666; }
  .newsletter { background: #F2D8BE; padding: 24px; text-align: center; margin: 16px 0; }
  .newsletter h3 { font-size: 16px; margin-bottom: 4px; }
  .newsletter p { font-size: 12px; color: #666; }
  .newsletter .input-row { display: flex; gap: 8px; justify-content: center; margin-top: 12px; }
  .newsletter input { padding: 6px 12px; border: 1px solid #E8DDD0; border-radius: 4px; font-size: 11px; }
  .newsletter button { background: #8A6A4A; color: white; padding: 6px 16px; border: none; border-radius: 4px; font-size: 11px; }
  .footer { background: #1D1D1D; color: #999; padding: 20px; text-align: center; font-size: 10px; }
</style>
</head>
<body>
  ${blockVisibility.hero ? `<div class="hero"><h1>${homepage.heroTitle}</h1><p>${homepage.heroSubtitle}</p><button class="cta">${homepage.heroCtaText}</button></div>` : ""}
  ${blockVisibility.featured && homepage.featuredEnabled ? `<div class="section"><h2>${homepage.featuredTitle}</h2><p>${homepage.featuredSubtitle}</p><div class="books"><div class="book"><div class="cover"></div><div class="title">Untold Narratives</div><div class="author">Chinua Adebayo</div></div><div class="book"><div class="cover"></div><div class="title">The Last Garden</div><div class="author">Amina Okonkwo</div></div><div class="book"><div class="cover"></div><div class="title">Echoes of Lagos</div><div class="author">Kofi Mensah</div></div></div></div>` : ""}
  <div class="newsletter"><h3>${homepage.newsletterHeading}</h3><p>${homepage.newsletterDescription}</p><div class="input-row"><input placeholder="Your email address" /><button>Subscribe</button></div></div>
  <div class="footer"><p>${homepage.footerDescription}</p></div>
</body>
</html>`;

  const faqCategoriesList = ["Publishing", "Editing", "Payments", "Marketing", "General"];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* SECTION 1: PAGE HEADER */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1D]">Content Management Center</h1>
            <p className="text-sm text-[#5C4A3D] mt-1 max-w-2xl">Manage website content, homepage sections, announcements, FAQs, testimonials, promotional banners and platform messaging from one location.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setExportDialogOpen(true)} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
              <Download className="h-4 w-4 mr-1" />Export Report
            </Button>
            <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
              <Button variant="outline" size="sm" onClick={() => { setFAQs(mockFAQs); setAnnouncements(mockAnnouncements); setTestimonials(mockTestimonials); setBanners(mockBanners); setHomepage(initialHomepage); setSEO(initialSEO); setHomepageBlocks(initialBlocks); setActivityLog(mockActivityLog); showNotification("success", "All content refreshed to defaults"); }} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
                <RefreshCw className="h-4 w-4 mr-1" />Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 mt-4">
          {[
            { id: "home-sections", label: "HOMEPAGE SECTIONS", value: "8", icon: LayoutDashboard, color: "text-[#8A6A4A]", bg: "bg-[#F2D8BE]/40", filter: "homepage" },
            { id: "total-faqs", label: "FAQS", value: contentStats.totalFAQs, icon: FileQuestion, color: "text-amber-600", bg: "bg-amber-50", filter: "faqs" },
            { id: "total-testimonials", label: "TESTIMONIALS", value: contentStats.totalTestimonials, icon: Star, color: "text-violet-600", bg: "bg-violet-50", filter: "testimonials" },
            { id: "total-announcements", label: "ANNOUNCEMENTS", value: contentStats.totalAnnouncements, icon: Megaphone, color: "text-blue-600", bg: "bg-blue-50", filter: "announcements" },
            { id: "active-banners", label: "ACTIVE BANNERS", value: contentStats.activeBanners, icon: Image, color: "text-rose-600", bg: "bg-rose-50", filter: "banners" },
            { id: "last-updated", label: "LAST UPDATED", value: "Today", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50", filter: null },
          ].map((stat) => {
            const isActive = activeSummaryCard === stat.id;
            return (
              <motion.div key={stat.id} variants={item} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Card onClick={() => setActiveSummaryCard(isActive ? null : stat.id)} className={`shadow-sm transition-all duration-200 bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] ${isActive ? "ring-2 ring-[#D8B27A] shadow-md" : ""}`}>
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
        </div>
      </motion.div>

      {/* SECTION 2: CONTENT ANALYTICS CENTER */}
      <motion.div variants={item}>
        <Card className="shadow-sm bg-white">
          <button onClick={() => setAnalyticsOpen(!analyticsOpen)} className="w-full flex items-center justify-between p-4 hover:bg-[#F2D8BE]/10 transition-colors rounded-lg">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#8A6A4A]" />
              <h3 className="text-sm font-semibold text-[#1D1D1D]">Content Analytics Center</h3>
            </div>
            {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {analyticsOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Content Health Score", value: "92%", progress: 92, icon: Activity, color: "#16A34A" },
                    { label: "Homepage Completion", value: "87%", progress: 87, icon: LayoutDashboard, color: "#2563EB" },
                    { label: "Active Content Blocks", value: "18", progress: 75, icon: Layers, color: "#7C3AED" },
                    { label: "Total Website Sections", value: "24", progress: 100, icon: Target, color: "#D97706" },
                    { label: "Published Content", value: "156", progress: 85, icon: CheckCircle2, color: "#16A34A" },
                    { label: "Pending Changes", value: "3", progress: 12, icon: Clock, color: "#F97316" },
                    { label: "Most Updated Section", value: "Hero Banner", progress: 68, icon: TrendingUp, color: "#8A6A4A" },
                    { label: "Recent Activity Count", value: "47", progress: 60, icon: Zap, color: "#DB2777" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                      <div className="flex items-center gap-2 mb-3">
                        <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                        <span className="text-[11px] font-semibold text-[#5C4A3D]">{stat.label}</span>
                      </div>
                      <p className="text-xl font-bold text-[#111111] mb-2">{stat.value}</p>
                      <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${stat.progress}%`, backgroundColor: stat.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* SECTION 12: GLOBAL SEARCH */}
      <motion.div variants={item}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C4A3D]" />
          <Input
            placeholder="Search across all content — FAQs, announcements, testimonials, banners, homepage, SEO..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            className="pl-10 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30 bg-white"
          />
          {globalSearch && (
            <button onClick={() => { setGlobalSearch(""); setSearchOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C4A3D] hover:text-[#1D1D1D]">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <AnimatePresence>
          {searchOpen && globalSearch && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-40 max-h-80 overflow-y-auto">
              {globalSearchResults.length === 0 ? (
                <div className="p-6 text-center">
                  <Search className="h-8 w-8 text-[#D8B27A] mx-auto mb-2" />
                  <p className="text-sm text-[#5C4A3D]">No results found for &quot;{globalSearch}&quot;</p>
                </div>
              ) : (
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-[#5C4A3D]">{globalSearchResults.length} result{globalSearchResults.length !== 1 ? "s" : ""} found</p>
                  {globalSearchResults.map((r) => (
                    <div key={`${r.type}-${r.id}`} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F5EDE3]/50 cursor-pointer transition-colors">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${r.type === "FAQ" ? "bg-amber-50 text-amber-600" : r.type === "Announcement" ? "bg-blue-50 text-blue-600" : r.type === "Testimonial" ? "bg-violet-50 text-violet-600" : r.type === "Banner" ? "bg-rose-50 text-rose-600" : r.type === "Homepage" ? "bg-[#F2D8BE] text-[#8A6A4A]" : "bg-emerald-50 text-emerald-600"}`}>
                        {r.type === "FAQ" ? <FileQuestion className="h-3.5 w-3.5" /> : r.type === "Announcement" ? <Megaphone className="h-3.5 w-3.5" /> : r.type === "Testimonial" ? <Star className="h-3.5 w-3.5" /> : r.type === "Banner" ? <Image className="h-3.5 w-3.5" /> : r.type === "Homepage" ? <Globe className="h-3.5 w-3.5" /> : <Settings className="h-3.5 w-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#111111] truncate">{r.title}</p>
                        <p className="text-[10px] text-[#5C4A3D]">{r.type} — {r.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* SECTION 3: CONTENT MODULE TABS */}
      <motion.div variants={item}>
        <Tabs defaultValue="homepage" className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E8DDD0] p-2 shadow-sm">
            <TabsList className="bg-[#F5EDE3] h-auto flex-wrap gap-1 p-1 w-full justify-start">
              {[
                { value: "homepage", label: "Homepage", icon: Globe, count: homepageBlocks.length },
                { value: "faqs", label: "FAQs", icon: FileQuestion, count: faqs.length },
                { value: "announcements", label: "Announcements", icon: Megaphone, count: announcements.length },
                { value: "testimonials", label: "Testimonials", icon: Star, count: testimonials.length },
                { value: "banners", label: "Promotional Banners", icon: Image, count: banners.length },
                { value: "seo", label: "SEO Content", icon: Search, count: 1 },
                { value: "footer", label: "Footer Content", icon: AlignLeft, count: 1 },
                { value: "contact", label: "Contact Info", icon: Mail, count: 1 },
              ].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm data-[state=active]:bg-[#8A6A4A] data-[state=active]:text-white gap-1.5">
                  <tab.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-[9px] bg-white/20">{tab.count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* SECTION 4: HOMEPAGE CONTENT BUILDER */}
          <TabsContent value="homepage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-[#1D1D1D]">Homepage Content Builder</h3>
                {homepageBlocks.map((block) => (
                  <Card key={block.id} className="shadow-sm bg-white hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-5 w-5 text-[#D8B27A] cursor-grab" />
                          <div className="rounded-lg bg-[#F2D8BE]/40 p-2 text-[#8A6A4A]">{block.icon}</div>
                          <div>
                            <h4 className="text-sm font-semibold text-[#1D1D1D]">{block.name}</h4>
                            <p className="text-xs text-[#5C4A3D]">{block.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`text-[10px] ${block.status === "Published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : block.status === "Draft" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-gray-50 text-gray-700 border border-gray-200"}`}>{block.status}</Badge>
                          <Switch checked={blockVisibility[block.id] ?? true} onCheckedChange={(val) => setBlockVisibility((prev) => ({ ...prev, [block.id]: val }))} />
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit3 className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                      {block.id === "hero" && blockVisibility.hero && (
                        <div className="mt-4 space-y-3 pl-12 border-t border-[#E8DDD0] pt-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><Label className="text-xs text-[#5C4A3D]">Hero Title</Label><Input value={homepage.heroTitle} onChange={(e) => setHomepage((p) => ({ ...p, heroTitle: e.target.value }))} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                            <div><Label className="text-xs text-[#5C4A3D]">CTA Button Text</Label><Input value={homepage.heroCtaText} onChange={(e) => setHomepage((p) => ({ ...p, heroCtaText: e.target.value }))} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                          </div>
                          <div><Label className="text-xs text-[#5C4A3D]">Hero Subtitle</Label><Textarea value={homepage.heroSubtitle} onChange={(e) => setHomepage((p) => ({ ...p, heroSubtitle: e.target.value }))} rows={2} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                        </div>
                      )}
                      {block.id === "featured" && blockVisibility.featured && (
                        <div className="mt-4 space-y-3 pl-12 border-t border-[#E8DDD0] pt-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><Label className="text-xs text-[#5C4A3D]">Section Title</Label><Input value={homepage.featuredTitle} onChange={(e) => setHomepage((p) => ({ ...p, featuredTitle: e.target.value }))} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                            <div className="flex items-center gap-3 pt-5"><Label className="text-xs text-[#5C4A3D]">Enabled</Label><Switch checked={homepage.featuredEnabled} onCheckedChange={(val) => setHomepage((p) => ({ ...p, featuredEnabled: val }))} /></div>
                          </div>
                          <div><Label className="text-xs text-[#5C4A3D]">Subtitle</Label><Input value={homepage.featuredSubtitle} onChange={(e) => setHomepage((p) => ({ ...p, featuredSubtitle: e.target.value }))} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                        </div>
                      )}
                      {block.id === "newsletter" && blockVisibility.newsletter && (
                        <div className="mt-4 space-y-3 pl-12 border-t border-[#E8DDD0] pt-4">
                          <div><Label className="text-xs text-[#5C4A3D]">Newsletter Heading</Label><Input value={homepage.newsletterHeading} onChange={(e) => setHomepage((p) => ({ ...p, newsletterHeading: e.target.value }))} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                          <div><Label className="text-xs text-[#5C4A3D]">Description</Label><Textarea value={homepage.newsletterDescription} onChange={(e) => setHomepage((p) => ({ ...p, newsletterDescription: e.target.value }))} rows={2} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* SECTION 5: LIVE WEBSITE PREVIEW PANEL */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1D1D1D]">Live Website Preview</h3>
                <Card className="shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        {[
                          { key: "desktop" as const, icon: Monitor },
                          { key: "tablet" as const, icon: Tablet },
                          { key: "mobile" as const, icon: Smartphone },
                        ].map((d) => (
                          <button key={d.key} onClick={() => setPreviewDevice(d.key)} className={`p-1.5 rounded-md transition-colors ${previewDevice === d.key ? "bg-[#8A6A4A] text-white" : "text-[#5C4A3D] hover:bg-[#F2D8BE]"}`}>
                            <d.icon className="h-4 w-4" />
                          </button>
                        ))}
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" />Live</Badge>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-[#E8DDD0]">
                      <div className="bg-gray-100 px-3 py-2 flex items-center gap-1.5 border-b border-[#E8DDD0]">
                        <div className="flex gap-1"><div className="h-2.5 w-2.5 rounded-full bg-red-400" /><div className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><div className="h-2.5 w-2.5 rounded-full bg-green-400" /></div>
                        <div className="flex-1 bg-white rounded px-2 py-0.5 mx-2"><p className="text-[9px] text-[#5C4A3D] text-center">statementpublications.com</p></div>
                      </div>
                      <div className={`mx-auto bg-white ${previewDevice === "desktop" ? "w-full" : previewDevice === "tablet" ? "w-3/4" : "w-1/2"} transition-all duration-300`}>
                        <iframe srcDoc={homepagePreviewHTML} className="w-full border-0" style={{ height: previewDevice === "desktop" ? "400px" : previewDevice === "tablet" ? "500px" : "550px" }} title="Homepage Preview" />
                      </div>
                    </div>
                    <p className="text-[10px] text-[#5C4A3D] text-center mt-2">Last updated: {formatDate(new Date().toISOString())}</p>
                  </CardContent>
                </Card>

                {/* SECTION 6: CONTENT TIMELINE */}
                <Card className="shadow-sm bg-white">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-[#1D1D1D] mb-3 flex items-center gap-1.5"><Activity className="h-4 w-4 text-[#8A6A4A]" />Content Timeline</h4>
                    <div className="space-y-0">
                      {activityLog.map((entry, i) => (
                        <div key={entry.id} className="flex gap-3 relative">
                          <div className="flex flex-col items-center">
                            <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5 z-10 ${entry.type === "edit" ? "bg-blue-500" : entry.type === "create" ? "bg-emerald-500" : entry.type === "delete" ? "bg-rose-500" : entry.type === "publish" ? "bg-amber-500" : "bg-gray-400"}`} />
                            {i < activityLog.length - 1 && <div className="w-px flex-1 bg-[#E8DDD0] min-h-[24px]" />}
                          </div>
                          <div className="pb-4 min-w-0">
                            <p className="text-xs font-medium text-[#1D1D1D]">{entry.action}</p>
                            <div className="flex items-center gap-2 text-[10px] text-[#5C4A3D] mt-0.5">
                              <span>{entry.admin}</span>
                              <span>&middot;</span>
                              <span>{formatDate(entry.timestamp, "relative")}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* SECTION 8: FAQ MANAGEMENT */}
          <TabsContent value="faqs" className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-[#1D1D1D]">FAQ Management</h3>
              <Button size="sm" onClick={() => { setEditingFAQ(null); setNewFAQ({ question: "", answer: "", category: "General" }); setFAQDialogOpen(true); }} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
                <Plus className="h-4 w-4 mr-1" />Create FAQ
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C4A3D]" />
                <Input placeholder="Search FAQs..." value={faqSearch} onChange={(e) => setFAQSearch(e.target.value)} className="pl-10 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {faqCategories.map((cat) => (
                  <button key={cat} onClick={() => setFAQFilterCategory(cat)} className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${faqFilterCategory === cat ? "bg-[#8A6A4A] text-white border-[#8A6A4A] shadow-sm" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-[#5C4A3D]">{filteredFAQs.length} FAQ{filteredFAQs.length !== 1 ? "s" : ""} found</p>
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="shadow-sm bg-white hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button onClick={() => toggleFAQExpand(faq.id)} className="mt-0.5 text-[#5C4A3D] hover:text-[#1D1D1D]">
                          {expandedFAQs.has(faq.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-[#1D1D1D]">{faq.question}</p>
                            <Badge variant="secondary" className="text-[9px] bg-[#F2D8BE]/60 text-[#8A6A4A] border border-[#D8B27A]/20">{faq.category}</Badge>
                          </div>
                          <AnimatePresence>
                            {expandedFAQs.has(faq.id) && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <p className="text-xs text-[#5C4A3D] mt-2 leading-relaxed">{faq.answer}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => moveFAQ(faq.id, "up")} className="p-1 rounded hover:bg-[#F2D8BE] text-[#5C4A3D]"><ArrowUp className="h-3.5 w-3.5" /></button>
                        <button onClick={() => moveFAQ(faq.id, "down")} className="p-1 rounded hover:bg-[#F2D8BE] text-[#5C4A3D]"><ArrowDown className="h-3.5 w-3.5" /></button>
                        <Switch checked={faq.isActive} onCheckedChange={() => toggleFAQActive(faq.id)} />
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingFAQ(faq); setNewFAQ({ question: faq.question, answer: faq.answer, category: faq.category }); setFAQDialogOpen(true); }}><Edit3 className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => deleteFAQ(faq.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredFAQs.length === 0 && (
                <div className="text-center py-12"><FileQuestion className="h-10 w-10 text-[#D8B27A] mx-auto mb-2" /><p className="text-sm text-[#5C4A3D]">No FAQs found matching your search.</p></div>
              )}
            </div>
          </TabsContent>

          {/* SECTION 9: ANNOUNCEMENT MANAGEMENT */}
          <TabsContent value="announcements" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1D1D1D]">Announcement Management</h3>
              <Button size="sm" onClick={() => { setEditingAnnouncement(null); setNewAnnouncement({ title: "", content: "", endDate: "", priority: "medium", type: "info", audience: "All Users" }); setAnnouncementDialogOpen(true); }} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
                <Plus className="h-4 w-4 mr-1" />Create Announcement
              </Button>
            </div>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <Card key={ann.id} className={`shadow-sm bg-white hover:shadow-md transition-all duration-200 ${!ann.isActive ? "opacity-60" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-sm font-semibold text-[#1D1D1D]">{ann.title}</h4>
                          <Badge className={`text-[9px] ${ann.priority === "high" ? "bg-red-50 text-red-700 border border-red-200" : ann.priority === "medium" ? "bg-orange-50 text-orange-700 border border-orange-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>{ann.priority}</Badge>
                          <Badge className={`text-[9px] ${ann.type === "info" ? "bg-blue-50 text-blue-700 border border-blue-200" : ann.type === "warning" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>{ann.type}</Badge>
                          <Badge variant="secondary" className="text-[9px] bg-gray-50 text-gray-600 border border-gray-200">{ann.audience}</Badge>
                        </div>
                        <p className="text-xs text-[#5C4A3D] mt-1 line-clamp-2">{ann.content}</p>
                        <div className="flex items-center gap-3 text-[10px] text-[#5C4A3D] mt-2">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Start: {formatDate(ann.startDate)}</span>
                          {ann.endDate && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />End: {formatDate(ann.endDate)}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Switch checked={ann.isActive} onCheckedChange={() => toggleAnnouncementActive(ann.id)} />
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingAnnouncement(ann); setNewAnnouncement({ title: ann.title, content: ann.content, endDate: ann.endDate ? new Date(ann.endDate).toISOString().split("T")[0] : "", priority: ann.priority, type: ann.type, audience: ann.audience }); setAnnouncementDialogOpen(true); }}><Edit3 className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => deleteAnnouncement(ann.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SECTION 10: TESTIMONIAL CMS */}
          <TabsContent value="testimonials" className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1D1D1D]">Testimonial Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <Card key={t.id} className={`shadow-sm bg-white hover:shadow-md transition-all duration-200 ${!t.isActive ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#8A6A4A] to-[#D8B27A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{t.name.split(" ").map((n) => n[0]).join("")}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1D1D1D] truncate">{t.name}</p>
                        <p className="text-[10px] text-[#5C4A3D]">{t.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-[#5C4A3D] line-clamp-3 mb-3">&quot;{t.content}&quot;</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge className={`text-[9px] ${t.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-50 text-gray-600 border border-gray-200"}`}>{t.isActive ? "Published" : "Draft"}</Badge>
                      {t.featured && <Badge className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200"><Star className="h-2.5 w-2.5 mr-0.5" />Featured</Badge>}
                    </div>
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-[#E8DDD0]">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#5C4A3D] hover:text-[#8A6A4A]" onClick={() => { setTestimonials((prev) => prev.map((tt) => tt.id === t.id ? { ...tt, featured: !tt.featured } : tt)); showNotification("success", t.featured ? "Removed from featured" : "Added to featured"); }}>
                        <Star className="h-3 w-3 mr-1" />{t.featured ? "Unfeature" : "Feature"}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#5C4A3D] hover:text-[#8A6A4A]" onClick={() => { setTestimonials((prev) => prev.map((tt) => tt.id === t.id ? { ...tt, isActive: !tt.isActive } : tt)); showNotification("success", t.isActive ? "Unpublished" : "Published"); }}>
                        <Eye className="h-3 w-3 mr-1" />{t.isActive ? "Unpublish" : "Publish"}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => { setTestimonials((prev) => prev.filter((tt) => tt.id !== t.id)); addActivity("archive", `Archived testimonial from ${t.name}`, "Testimonials"); showNotification("success", "Testimonial archived"); }}>
                        <Archive className="h-3 w-3 mr-1" />Archive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SECTION 11: PROMOTIONAL BANNER MANAGEMENT */}
          <TabsContent value="banners" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1D1D1D]">Promotional Banner Management</h3>
              <Button size="sm" onClick={() => { setEditingBanner(null); setNewBanner({ title: "", subtitle: "", ctaText: "", ctaLink: "", position: "homepage-hero" }); setBannerDialogOpen(true); }} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
                <Plus className="h-4 w-4 mr-1" />Create Banner
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((b) => (
                <Card key={b.id} className="shadow-sm bg-white hover:shadow-md transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-[#1D1D1D]">{b.title}</h4>
                          <Badge className={`text-[9px] ${b.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : b.status === "draft" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>{b.status}</Badge>
                        </div>
                        <p className="text-xs text-[#5C4A3D] mb-2">{b.subtitle}</p>
                        <div className="flex items-center gap-3 text-[10px] text-[#5C4A3D]">
                          <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" />CTA: {b.ctaText}</span>
                          <span className="flex items-center gap-1"><Link className="h-3 w-3" />{b.ctaLink}</span>
                        </div>
                        <Badge variant="secondary" className="text-[9px] mt-2 bg-[#F2D8BE]/40 text-[#8A6A4A] border border-[#D8B27A]/20">{b.position}</Badge>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingBanner(b); setNewBanner({ title: b.title, subtitle: b.subtitle, ctaText: b.ctaText, ctaLink: b.ctaLink, position: b.position }); setBannerDialogOpen(true); }}><Edit3 className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => deleteBanner(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SECTION 7: SEO MANAGEMENT */}
          <TabsContent value="seo" className="space-y-6">
            <h3 className="text-lg font-semibold text-[#1D1D1D]">SEO Content Management</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card className="shadow-sm bg-white">
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <Label className="text-xs text-[#5C4A3D]">Meta Title</Label>
                      <Input value={seo.metaTitle} onChange={(e) => setSEO((p) => ({ ...p, metaTitle: e.target.value }))} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                      <p className="text-[10px] text-[#5C4A3D] mt-1">{seo.metaTitle.length}/60 characters</p>
                    </div>
                    <div>
                      <Label className="text-xs text-[#5C4A3D]">Meta Description</Label>
                      <Textarea value={seo.metaDescription} onChange={(e) => setSEO((p) => ({ ...p, metaDescription: e.target.value }))} rows={3} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                      <p className="text-[10px] text-[#5C4A3D] mt-1">{seo.metaDescription.length}/160 characters</p>
                    </div>
                    <div>
                      <Label className="text-xs text-[#5C4A3D]">Keywords</Label>
                      <Input value={seo.keywords} onChange={(e) => setSEO((p) => ({ ...p, keywords: e.target.value }))} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                    <div>
                      <Label className="text-xs text-[#5C4A3D]">OG Title</Label>
                      <Input value={seo.ogTitle} onChange={(e) => setSEO((p) => ({ ...p, ogTitle: e.target.value }))} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                    <div>
                      <Label className="text-xs text-[#5C4A3D]">OG Description</Label>
                      <Textarea value={seo.ogDescription} onChange={(e) => setSEO((p) => ({ ...p, ogDescription: e.target.value }))} rows={2} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label className="text-xs text-[#5C4A3D]">Twitter Card Type</Label><Input value={seo.twitterCard} onChange={(e) => setSEO((p) => ({ ...p, twitterCard: e.target.value }))} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                      <div><Label className="text-xs text-[#5C4A3D]">Canonical URL</Label><Input value={seo.canonicalUrl} onChange={(e) => setSEO((p) => ({ ...p, canonicalUrl: e.target.value }))} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="shadow-sm bg-white">
                  <CardContent className="p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Google Search Preview</h4>
                    <div className="rounded-lg border border-[#E8DDD0] p-4 bg-[#F2D8BE]/5">
                      <p className="text-[13px] text-blue-700 truncate hover:underline cursor-pointer">{seo.metaTitle}</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">{seo.canonicalUrl}</p>
                      <p className="text-[11px] text-[#5C4A3D] mt-1 line-clamp-2">{seo.metaDescription}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm bg-white">
                  <CardContent className="p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">SEO Score</h4>
                    <div className="text-center">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-24 h-24" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#E8DDD0" strokeWidth="8" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#16A34A" strokeWidth="8" strokeDasharray={`${92 * 2.51} ${251}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                        </svg>
                        <span className="absolute text-xl font-bold text-[#1D1D1D]">92</span>
                      </div>
                      <p className="text-xs text-[#5C4A3D] mt-2">Excellent</p>
                    </div>
                    <div className="space-y-2 mt-4">
                      {[
                        { label: "Meta Title", score: 95, color: "#16A34A" },
                        { label: "Meta Description", score: 90, color: "#16A34A" },
                        { label: "Keywords", score: 88, color: "#2563EB" },
                        { label: "Open Graph", score: 92, color: "#16A34A" },
                        { label: "Canonical URL", score: 100, color: "#16A34A" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-[10px] mb-0.5"><span className="text-[#5C4A3D]">{item.label}</span><span className="font-bold text-[#111111]">{item.score}%</span></div>
                          <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#E8DDD0]"><div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} /></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* SECTION: FOOTER CONTENT */}
          <TabsContent value="footer" className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1D1D1D]">Footer Content Management</h3>
            <Card className="shadow-sm bg-white">
              <CardContent className="p-5 space-y-4">
                <div>
                  <Label className="text-xs text-[#5C4A3D]">Footer Description</Label>
                  <Textarea value={homepage.footerDescription} onChange={(e) => setHomepage((p) => ({ ...p, footerDescription: e.target.value }))} rows={3} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                    <h4 className="text-xs font-semibold text-[#5C4A3D] mb-2">Navigation Links</h4>
                    <div className="space-y-1.5 text-[11px] text-[#5C4A3D]">
                      <p>Home, Browse Books, Categories</p>
                      <p>For Authors, Publish, Dashboard</p>
                      <p>About Us, Contact, Support</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                    <h4 className="text-xs font-semibold text-[#5C4A3D] mb-2">Social Links</h4>
                    <div className="space-y-1.5 text-[11px] text-[#5C4A3D]">
                      <p>Twitter: @statementpub</p>
                      <p>Instagram: @statementpub</p>
                      <p>Facebook: Statement Publications</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                    <h4 className="text-xs font-semibold text-[#5C4A3D] mb-2">Legal Links</h4>
                    <div className="space-y-1.5 text-[11px] text-[#5C4A3D]">
                      <p>Privacy Policy</p>
                      <p>Terms of Service</p>
                      <p>Cookie Policy</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECTION: CONTACT INFORMATION */}
          <TabsContent value="contact" className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1D1D1D]">Contact Information</h3>
            <Card className="shadow-sm bg-white">
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label className="text-xs text-[#5C4A3D]">Contact Email</Label><Input defaultValue="support@statementpublications.com" className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                  <div><Label className="text-xs text-[#5C4A3D]">Phone Number</Label><Input defaultValue="+234 801 234 5678" className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                  <div><Label className="text-xs text-[#5C4A3D]">Support Hours</Label><Input defaultValue="Mon - Fri, 9:00 AM - 6:00 PM WAT" className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                  <div><Label className="text-xs text-[#5C4A3D]">Response Time</Label><Input defaultValue="Within 24 hours" className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" /></div>
                </div>
                <div>
                  <Label className="text-xs text-[#5C4A3D]">Office Address</Label>
                  <Textarea defaultValue="12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria" rows={2} className="mt-1 border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* SECTION 13: QUICK ACTIONS DROPDOWN */}
      <div className="fixed bottom-6 right-6 z-50" ref={quickActionsRef}>
        <AnimatePresence>
          {quickActionsOpen && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-xl border border-[#E8DDD0] p-2">
              <p className="px-3 py-2 text-xs font-semibold text-[#8A6A4A]">Quick Actions</p>
              <Button size="sm" className="w-full justify-start h-8 text-xs bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => { setEditingFAQ(null); setNewFAQ({ question: "", answer: "", category: "General" }); setFAQDialogOpen(true); setQuickActionsOpen(false); }}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />Create FAQ
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { setEditingAnnouncement(null); setNewAnnouncement({ title: "", content: "", endDate: "", priority: "medium", type: "info", audience: "All Users" }); setAnnouncementDialogOpen(true); setQuickActionsOpen(false); }}>
                <Megaphone className="h-3.5 w-3.5 mr-1.5" />Create Announcement
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { setEditingBanner(null); setNewBanner({ title: "", subtitle: "", ctaText: "", ctaLink: "", position: "homepage-hero" }); setBannerDialogOpen(true); setQuickActionsOpen(false); }}>
                <Image className="h-3.5 w-3.5 mr-1.5" />Create Banner
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => setQuickActionsOpen(false)}>
                <Star className="h-3.5 w-3.5 mr-1.5" />Create Testimonial
              </Button>
              <div className="h-px bg-[#E8DDD0] my-1" />
              <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => setQuickActionsOpen(false)}>
                <Globe className="h-3.5 w-3.5 mr-1.5" />Edit Homepage
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { setExportDialogOpen(true); setQuickActionsOpen(false); }}>
                <Download className="h-3.5 w-3.5 mr-1.5" />Export Content Report
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportContentReport("pdf"); setQuickActionsOpen(false); }}>
                <BarChart3 className="h-3.5 w-3.5 mr-1.5" />Generate Full Report
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="refresh-btn-border rounded-xl p-[2px]">
          <Button size="icon" onClick={() => setQuickActionsOpen(!quickActionsOpen)} className="h-14 w-14 rounded-xl shadow-lg hover:shadow-xl transition-all" style={{ backgroundColor: quickActionsOpen ? "#1D1D1D" : "#8A6A4A", color: "white" }}>
            {quickActionsOpen ? <X className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* SECTION 14: CONTENT REPORT EXPORT DIALOG */}
      <AnimatePresence>
        {exportDialogOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setExportDialogOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1D1D1D]">Export Content Report</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExportDialogOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-3 mb-4">
                <div className="rounded-lg border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5">
                  <h4 className="text-xs font-semibold text-[#5C4A3D] mb-2">Report Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <span className="text-[#5C4A3D]">Homepage Sections: <strong className="text-[#111111]">{homepageBlocks.length}</strong></span>
                    <span className="text-[#5C4A3D]">FAQ Count: <strong className="text-[#111111]">{faqs.length}</strong></span>
                    <span className="text-[#5C4A3D]">Announcements: <strong className="text-[#111111]">{announcements.length}</strong></span>
                    <span className="text-[#5C4A3D]">Testimonials: <strong className="text-[#111111]">{testimonials.length}</strong></span>
                    <span className="text-[#5C4A3D]">SEO Score: <strong className="text-[#111111]">92%</strong></span>
                    <span className="text-[#5C4A3D]">Content Health: <strong className="text-[#111111]">87%</strong></span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => exportContentReport("csv")} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#E8DDD0] hover:bg-[#F2D8BE]/20 hover:border-[#D8B27A]/40 transition-all cursor-pointer">
                  <FileText className="h-6 w-6 text-[#8A6A4A]" />
                  <span className="text-xs font-medium text-[#1D1D1D]">CSV</span>
                  <span className="text-[9px] text-[#5C4A3D]">Spreadsheet</span>
                </button>
                <button onClick={() => exportContentReport("pdf")} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#E8DDD0] hover:bg-[#F2D8BE]/20 hover:border-[#D8B27A]/40 transition-all cursor-pointer">
                  <Download className="h-6 w-6 text-[#8A6A4A]" />
                  <span className="text-xs font-medium text-[#1D1D1D]">PDF</span>
                  <span className="text-[9px] text-[#5C4A3D]">Document</span>
                </button>
                <button onClick={() => exportContentReport("excel")} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#E8DDD0] hover:bg-[#F2D8BE]/20 hover:border-[#D8B27A]/40 transition-all cursor-pointer">
                  <BarChart3 className="h-6 w-6 text-[#8A6A4A]" />
                  <span className="text-xs font-medium text-[#1D1D1D]">Excel</span>
                  <span className="text-[9px] text-[#5C4A3D]">Full Report</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAQ DIALOG */}
      <AnimatePresence>
        {faqDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setFAQDialogOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 border border-[#E8DDD0] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {editingFAQ ? <Edit3 className="h-5 w-5 text-[#8A6A4A]" /> : <Plus className="h-5 w-5 text-[#8A6A4A]" />}
                  <h3 className="text-lg font-semibold text-[#111111]">{editingFAQ ? "Edit FAQ" : "Create New FAQ"}</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFAQDialogOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Question</Label>
                  <Input placeholder="Enter the FAQ question..." value={newFAQ.question} onChange={(e) => setNewFAQ((p) => ({ ...p, question: e.target.value }))} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Answer</Label>
                  <Textarea placeholder="Enter the detailed answer..." value={newFAQ.answer} onChange={(e) => setNewFAQ((p) => ({ ...p, answer: e.target.value }))} rows={5} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {faqCategoriesList.map((cat) => (
                      <button key={cat} onClick={() => setNewFAQ((p) => ({ ...p, category: cat }))} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${newFAQ.category === cat ? "bg-[#8A6A4A] text-white border-[#8A6A4A]" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]"}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-[#E8DDD0]">
                <Button variant="outline" size="sm" onClick={() => setFAQDialogOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={handleSaveFAQ} disabled={!newFAQ.question.trim() || !newFAQ.answer.trim()} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
                  {editingFAQ ? <><Edit3 className="h-3.5 w-3.5 mr-1" />Save Changes</> : <><Plus className="h-3.5 w-3.5 mr-1" />Create FAQ</>}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ANNOUNCEMENT DIALOG */}
      <AnimatePresence>
        {announcementDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setAnnouncementDialogOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 border border-[#E8DDD0] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {editingAnnouncement ? <Edit3 className="h-5 w-5 text-[#8A6A4A]" /> : <Megaphone className="h-5 w-5 text-[#8A6A4A]" />}
                  <h3 className="text-lg font-semibold text-[#111111]">{editingAnnouncement ? "Edit Announcement" : "Create Announcement"}</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setAnnouncementDialogOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Title</Label>
                  <Input placeholder="Announcement title..." value={newAnnouncement.title} onChange={(e) => setNewAnnouncement((p) => ({ ...p, title: e.target.value }))} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Content</Label>
                  <Textarea placeholder="Announcement content..." value={newAnnouncement.content} onChange={(e) => setNewAnnouncement((p) => ({ ...p, content: e.target.value }))} rows={4} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Priority</Label>
                    <div className="flex gap-2">
                      {(["high", "medium", "low"] as const).map((p) => (
                        <button key={p} onClick={() => setNewAnnouncement((prev) => ({ ...prev, priority: p }))} className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${newAnnouncement.priority === p ? p === "high" ? "bg-red-50 text-red-700 border-red-300" : p === "medium" ? "bg-orange-50 text-orange-700 border-orange-300" : "bg-blue-50 text-blue-700 border-blue-300" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]"}`}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Type</Label>
                    <div className="flex gap-2">
                      {(["info", "warning", "success"] as const).map((t) => (
                        <button key={t} onClick={() => setNewAnnouncement((prev) => ({ ...prev, type: t }))} className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${newAnnouncement.type === t ? t === "info" ? "bg-blue-50 text-blue-700 border-blue-300" : t === "warning" ? "bg-amber-50 text-amber-700 border-amber-300" : "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]"}`}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-[#111111] mb-1.5 block">End Date (Optional)</Label>
                    <Input type="date" value={newAnnouncement.endDate} onChange={(e) => setNewAnnouncement((p) => ({ ...p, endDate: e.target.value }))} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Audience</Label>
                    <div className="flex gap-2">
                      {(["All Users", "Authors", "Readers"] as const).map((a) => (
                        <button key={a} onClick={() => setNewAnnouncement((prev) => ({ ...prev, audience: a }))} className={`flex-1 px-2 py-2 rounded-lg text-[10px] font-medium border transition-all ${newAnnouncement.audience === a ? "bg-[#8A6A4A] text-white border-[#8A6A4A]" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]"}`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-[#E8DDD0]">
                <Button variant="outline" size="sm" onClick={() => setAnnouncementDialogOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={handleSaveAnnouncement} disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
                  {editingAnnouncement ? <><Edit3 className="h-3.5 w-3.5 mr-1" />Save Changes</> : <><Megaphone className="h-3.5 w-3.5 mr-1" />Publish</>}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BANNER DIALOG */}
      <AnimatePresence>
        {bannerDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setBannerDialogOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 border border-[#E8DDD0] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {editingBanner ? <Edit3 className="h-5 w-5 text-[#8A6A4A]" /> : <Image className="h-5 w-5 text-[#8A6A4A]" />}
                  <h3 className="text-lg font-semibold text-[#111111]">{editingBanner ? "Edit Banner" : "Create Banner"}</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setBannerDialogOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Banner Title</Label>
                  <Input placeholder="Banner title..." value={newBanner.title} onChange={(e) => setNewBanner((p) => ({ ...p, title: e.target.value }))} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Subtitle</Label>
                  <Input placeholder="Banner subtitle..." value={newBanner.subtitle} onChange={(e) => setNewBanner((p) => ({ ...p, subtitle: e.target.value }))} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-[#111111] mb-1.5 block">CTA Text</Label>
                    <Input placeholder="Button text..." value={newBanner.ctaText} onChange={(e) => setNewBanner((p) => ({ ...p, ctaText: e.target.value }))} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#111111] mb-1.5 block">CTA Link</Label>
                    <Input placeholder="/path/to/page" value={newBanner.ctaLink} onChange={(e) => setNewBanner((p) => ({ ...p, ctaLink: e.target.value }))} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#111111] mb-1.5 block">Position</Label>
                  <div className="flex flex-wrap gap-2">
                    {(["homepage-hero", "homepage-mid", "sidebar", "footer"] as const).map((pos) => (
                      <button key={pos} onClick={() => setNewBanner((p) => ({ ...p, position: pos }))} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${newBanner.position === pos ? "bg-[#8A6A4A] text-white border-[#8A6A4A]" : "bg-white text-[#5C4A3D] border-[#E8DDD0] hover:bg-[#F5EDE3]"}`}>
                        {pos.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-[#E8DDD0]">
                <Button variant="outline" size="sm" onClick={() => setBannerDialogOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={handleSaveBanner} disabled={!newBanner.title.trim()} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
                  {editingBanner ? <><Edit3 className="h-3.5 w-3.5 mr-1" />Save Changes</> : <><Image className="h-3.5 w-3.5 mr-1" />Create Banner</>}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAQ DELETE CONFIRM */}
      <AnimatePresence>
        {faqDeleteDialogOpen && deletingFAQId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setFAQDeleteDialogOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center"><Trash2 className="h-5 w-5 text-rose-600" /></div>
                <h3 className="text-lg font-semibold text-[#111111]">Delete FAQ?</h3>
              </div>
              <p className="text-sm text-[#5C4A3D] mb-1">This will permanently remove this FAQ.</p>
              <p className="text-sm font-medium text-[#111111] mb-4">{faqs.find((f) => f.id === deletingFAQId)?.question}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setFAQDeleteDialogOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={confirmDeleteFAQ} className="bg-rose-600 hover:bg-rose-700 text-white"><Trash2 className="h-3.5 w-3.5 mr-1" />Delete FAQ</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ANNOUNCEMENT DELETE CONFIRM */}
      <AnimatePresence>
        {announcementDeleteDialogOpen && deletingAnnouncementId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setAnnouncementDeleteDialogOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center"><Trash2 className="h-5 w-5 text-rose-600" /></div>
                <h3 className="text-lg font-semibold text-[#111111]">Delete Announcement?</h3>
              </div>
              <p className="text-sm text-[#5C4A3D] mb-1">This will permanently remove this announcement.</p>
              <p className="text-sm font-medium text-[#111111] mb-4">{announcements.find((a) => a.id === deletingAnnouncementId)?.title}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setAnnouncementDeleteDialogOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={confirmDeleteAnnouncement} className="bg-rose-600 hover:bg-rose-700 text-white"><Trash2 className="h-3.5 w-3.5 mr-1" />Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BANNER DELETE CONFIRM */}
      <AnimatePresence>
        {bannerDeleteDialogOpen && deletingBannerId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setBannerDeleteDialogOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center"><Trash2 className="h-5 w-5 text-rose-600" /></div>
                <h3 className="text-lg font-semibold text-[#111111]">Delete Banner?</h3>
              </div>
              <p className="text-sm text-[#5C4A3D] mb-1">This will permanently remove this banner.</p>
              <p className="text-sm font-medium text-[#111111] mb-4">{banners.find((b) => b.id === deletingBannerId)?.title}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setBannerDeleteDialogOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                <Button size="sm" onClick={confirmDeleteBanner} className="bg-rose-600 hover:bg-rose-700 text-white"><Trash2 className="h-3.5 w-3.5 mr-1" />Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }} className={`fixed bottom-6 left-1/2 z-[100] px-5 py-3 rounded-xl shadow-xl border ${notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
            <div className="flex items-center gap-2">
              {notification.type === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-rose-600" />}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
