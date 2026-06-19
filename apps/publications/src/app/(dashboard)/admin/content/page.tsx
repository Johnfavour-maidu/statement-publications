"use client";

import { useState, useCallback } from "react";
import {
  FileQuestion,
  Megaphone,
  Star,
  Activity,
  LayoutDashboard,
  MessageSquare,
  FileText,
  Globe,
  Share2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  RotateCcw,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  MousePointerClick,
  Timer,
  RefreshCw,
  Settings,
  Zap,
  Heart,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

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

interface VersionEntry {
  id: string;
  title: string;
  editor: string;
  timestamp: string;
  type: "edit" | "create" | "delete" | "restore";
}

interface ContentModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: "active" | "draft" | "scheduled";
  color: string;
  bgColor: string;
}

const mockFAQs: FAQ[] = [
  {
    id: "1",
    question: "How do I publish a book on Statement?",
    answer: "To publish a book, create an author account, upload your manuscript, fill in the book details, and submit for review. Our editorial team will review your submission within 5-7 business days.",
    category: "Publishing",
    isActive: true,
  },
  {
    id: "2",
    question: "What are the royalty rates?",
    answer: "Authors earn 80% of net sales for ebooks and 60% for print books. Royalties are calculated monthly and paid out once your balance reaches $50 or more.",
    category: "Payments",
    isActive: true,
  },
  {
    id: "3",
    question: "How do I withdraw my earnings?",
    answer: "Navigate to your wallet in the dashboard, click 'Withdraw', and enter your bank details. Withdrawals are processed within 3-5 business days.",
    category: "Payments",
    isActive: true,
  },
  {
    id: "4",
    question: "Can I publish in multiple formats?",
    answer: "Yes! Statement supports ebook (EPUB, PDF), paperback, and hardcover formats. You can publish your book in any combination of these formats.",
    category: "Publishing",
    isActive: true,
  },
  {
    id: "5",
    question: "What file formats are accepted?",
    answer: "We accept EPUB, PDF, and DOCX for ebooks. For print books, we accept PDF with bleed settings. Audiobooks should be submitted as MP3 or M4B files.",
    category: "Technical",
    isActive: false,
  },
  {
    id: "6",
    question: "How do I contact support?",
    answer: "You can reach our support team via the help center chat widget, email at support@statement.com, or through the contact form on our website.",
    category: "General",
    isActive: true,
  },
];

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Chinua Adebayo",
    role: "Bestselling Author",
    content: "Statement Publications transformed my writing career. The platform is intuitive, the royalties are fair, and the support team is incredible.",
    rating: 5,
    isActive: true,
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    role: "Indie Author",
    content: "I've published three books on Statement and the process gets easier every time. The analytics dashboard helps me understand my readers.",
    rating: 5,
    isActive: true,
  },
  {
    id: "3",
    name: "Kofi Mensah",
    role: "First-time Author",
    content: "As a first-time author, I was nervous about self-publishing. Statement made the entire process straightforward and stress-free.",
    rating: 4,
    isActive: true,
  },
  {
    id: "4",
    name: "Fatima Hassan",
    role: "Award-winning Author",
    content: "The global reach of Statement has helped me connect with readers across Africa and beyond. The platform truly understands African literature.",
    rating: 5,
    isActive: false,
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Holiday Sale - 30% Off All Ebooks",
    content: "Celebrate the holiday season with 30% off all ebooks from December 15th to January 5th. Use code HOLIDAY30 at checkout.",
    isActive: true,
    startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    priority: "high",
    type: "success",
  },
  {
    id: "2",
    title: "New Audiobook Feature Launch",
    content: "We're excited to announce that audiobook support is now live! Authors can now upload and sell audiobooks directly on the platform.",
    isActive: true,
    startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    endDate: null,
    priority: "medium",
    type: "info",
  },
  {
    id: "3",
    title: "Scheduled Maintenance",
    content: "Statement will undergo scheduled maintenance on January 10th from 2:00 AM to 6:00 AM UTC. Some features may be temporarily unavailable.",
    isActive: false,
    startDate: new Date(Date.now() - 86400000 * 20).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 18).toISOString(),
    priority: "low",
    type: "warning",
  },
];

const initialHomepage: HomepageContent = {
  heroTitle: "Discover African Literature at Its Finest",
  heroSubtitle: "Explore a curated collection of books from talented African authors. Read, publish, and connect with the literary community.",
  heroCtaText: "Start Reading",
  featuredTitle: "Featured Books",
  featuredSubtitle: "Hand-picked selections from our editorial team",
  featuredEnabled: true,
  newsletterHeading: "Stay Updated",
  newsletterDescription: "Subscribe to our newsletter for the latest book releases and author spotlights.",
  footerDescription: "Statement Publications — Empowering African authors to share their stories with the world.",
};

const mockVersions: VersionEntry[] = [
  { id: "v1", title: "Homepage hero banner updated", editor: "Admin User", timestamp: new Date(Date.now() - 3600000).toISOString(), type: "edit" },
  { id: "v2", title: "New FAQ added: Contact support", editor: "Admin User", timestamp: new Date(Date.now() - 86400000).toISOString(), type: "create" },
  { id: "v3", title: "Holiday announcement published", editor: "Admin User", timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), type: "create" },
  { id: "v4", title: "Old maintenance announcement removed", editor: "Admin User", timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), type: "delete" },
  { id: "v5", title: "Featured Books section re-enabled", editor: "Admin User", timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), type: "restore" },
];

export default function AdminContentPage() {
  const [faqs, setFAQs] = useState(mockFAQs);
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [homepage, setHomepage] = useState(initialHomepage);
  const [versions] = useState(mockVersions);

  const [faqDialogOpen, setFAQDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [announcementDeleteDialogOpen, setAnnouncementDeleteDialogOpen] = useState(false);
  const [faqDeleteDialogOpen, setFAQDeleteDialogOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("all");

  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingFAQId, setDeletingFAQId] = useState<string | null>(null);
  const [deletingAnnouncementId, setDeletingAnnouncementId] = useState<string | null>(null);

  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "", category: "General" });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    endDate: "",
    priority: "medium" as "high" | "medium" | "low",
    type: "info" as "info" | "warning" | "success",
  });

  const [faqSearch, setFAQSearch] = useState("");
  const [faqFilterCategory, setFAQFilterCategory] = useState("All");
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [homepageSections, setHomepageSections] = useState([
    { id: "hero", name: "Hero Banner", status: "Published" as const },
    { id: "featured", name: "Featured Books", status: "Published" as const },
    { id: "newsletter", name: "Newsletter Section", status: "Published" as const },
    { id: "footer", name: "Footer Content", status: "Published" as const },
    { id: "about", name: "About Preview", status: "Draft" as const },
  ]);
  const [sectionVisibility, setSectionVisibility] = useState({
    hero: true,
    featured: true,
    newsletter: true,
    footer: true,
  });
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const handleSaveFAQ = useCallback(() => {
    if (editingFAQ) {
      setFAQs((prev) =>
        prev.map((f) =>
          f.id === editingFAQ.id ? { ...f, question: newFAQ.question, answer: newFAQ.answer, category: newFAQ.category } : f
        )
      );
      showNotification("FAQ updated successfully");
    } else {
      setFAQs((prev) => [
        ...prev,
        { id: Date.now().toString(), question: newFAQ.question, answer: newFAQ.answer, category: newFAQ.category, isActive: true },
      ]);
      showNotification("FAQ created successfully");
    }
    setFAQDialogOpen(false);
    setEditingFAQ(null);
    setNewFAQ({ question: "", answer: "", category: "General" });
  }, [editingFAQ, newFAQ, showNotification]);

  const handleSaveAnnouncement = useCallback(() => {
    if (editingAnnouncement) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === editingAnnouncement.id
            ? { ...a, title: newAnnouncement.title, content: newAnnouncement.content, priority: newAnnouncement.priority, type: newAnnouncement.type, endDate: newAnnouncement.endDate ? new Date(newAnnouncement.endDate).toISOString() : a.endDate }
            : a
        )
      );
      showNotification("Announcement updated successfully");
    } else {
      setAnnouncements((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          isActive: true,
          startDate: new Date().toISOString(),
          endDate: newAnnouncement.endDate ? new Date(newAnnouncement.endDate).toISOString() : null,
          priority: newAnnouncement.priority,
          type: newAnnouncement.type,
        },
      ]);
      showNotification("Announcement published successfully");
    }
    setAnnouncementDialogOpen(false);
    setEditingAnnouncement(null);
    setNewAnnouncement({ title: "", content: "", endDate: "", priority: "medium", type: "info" });
  }, [editingAnnouncement, newAnnouncement, showNotification]);

  const toggleFAQActive = useCallback((id: string) => {
    setFAQs((prev) => prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)));
  }, []);

  const toggleAnnouncementActive = useCallback((id: string) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
  }, []);

  const deleteFAQ = useCallback((id: string) => {
    setDeletingFAQId(id);
    setFAQDeleteDialogOpen(true);
  }, []);

  const confirmDeleteFAQ = useCallback(() => {
    if (deletingFAQId) {
      setFAQs((prev) => prev.filter((f) => f.id !== deletingFAQId));
      showNotification("FAQ deleted");
    }
    setDeletingFAQId(null);
    setFAQDeleteDialogOpen(false);
  }, [deletingFAQId, showNotification]);

  const deleteAnnouncement = useCallback((id: string) => {
    setDeletingAnnouncementId(id);
    setAnnouncementDeleteDialogOpen(true);
  }, []);

  const confirmDeleteAnnouncement = useCallback(() => {
    if (deletingAnnouncementId) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== deletingAnnouncementId));
      showNotification("Announcement deleted");
    }
    setDeletingAnnouncementId(null);
    setAnnouncementDeleteDialogOpen(false);
  }, [deletingAnnouncementId, showNotification]);

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

  const filteredFAQs = faqs.filter((faq) => {
    const matchSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    const matchCategory = faqFilterCategory === "All" || faq.category === faqFilterCategory;
    return matchSearch && matchCategory;
  });

  const faqCategories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

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
  .book .cover { height: 60px; background: #D8B27A; border-radius: 4px; margin-bottom: 8px; }
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
  <div class="hero">
    <h1>${homepage.heroTitle}</h1>
    <p>${homepage.heroSubtitle}</p>
    <button class="cta">${homepage.heroCtaText || "Start Reading"}</button>
  </div>
  ${homepage.featuredEnabled ? `<div class="section">
    <h2>${homepage.featuredTitle}</h2>
    <p>${homepage.featuredSubtitle}</p>
    <div class="books">
      <div class="book"><div class="cover"></div><div class="title">Book Title One</div><div class="author">Author Name</div></div>
      <div class="book"><div class="cover"></div><div class="title">Book Title Two</div><div class="author">Author Name</div></div>
      <div class="book"><div class="cover"></div><div class="title">Book Title Three</div><div class="author">Author Name</div></div>
    </div>
  </div>` : ""}
  <div class="newsletter">
    <h3>${homepage.newsletterHeading}</h3>
    <p>${homepage.newsletterDescription}</p>
    <div class="input-row">
      <input placeholder="Your email address" />
      <button>Subscribe</button>
    </div>
  </div>
  <div class="footer">
    <p>${homepage.footerDescription}</p>
  </div>
</body>
</html>`;

  const weeklyViews = [
    { day: "Mon", views: 1820 },
    { day: "Tue", views: 2100 },
    { day: "Wed", views: 1950 },
    { day: "Thu", views: 2340 },
    { day: "Fri", views: 1780 },
    { day: "Sat", views: 2460 },
  ];
  const maxViews = Math.max(...weeklyViews.map((w) => w.views));

  const contentModules: ContentModule[] = [
    {
      id: "faq",
      name: "FAQ Management",
      icon: <FileQuestion className="h-6 w-6" />,
      description: "Manage frequently asked questions",
      status: "active",
      color: "#D97706",
      bgColor: "#FEF3C7",
    },
    {
      id: "testimonials",
      name: "Testimonials",
      icon: <Star className="h-6 w-6" />,
      description: "Manage customer testimonials",
      status: "active",
      color: "#7C3AED",
      bgColor: "#EDE9FE",
    },
    {
      id: "announcements",
      name: "Announcements",
      icon: <Megaphone className="h-6 w-6" />,
      description: "Platform-wide announcements",
      status: "active",
      color: "#2563EB",
      bgColor: "#DBEAFE",
    },
    {
      id: "blog",
      name: "Blog Content",
      icon: <FileText className="h-6 w-6" />,
      description: "Articles and blog posts",
      status: "draft",
      color: "#16A34A",
      bgColor: "#DCFCE7",
    },
    {
      id: "homepage",
      name: "Homepage Settings",
      icon: <Globe className="h-6 w-6" />,
      description: "Configure homepage sections",
      status: "active",
      color: "#4F46E5",
      bgColor: "#E0E7FF",
    },
    {
      id: "social",
      name: "Social Media",
      icon: <Share2 className="h-6 w-6" />,
      description: "Social media integration",
      status: "scheduled",
      color: "#DB2777",
      bgColor: "#FCE7F3",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5EDE3" }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5 fade-in">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg" style={{ backgroundColor: "#8A6A4A", color: "white" }}>
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">{notification}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#1D1D1D" }}>
            Content Management
          </h1>
          <p className="mt-1 text-base" style={{ color: "#6B6B6B" }}>
            Manage website content, FAQs, testimonials, and announcements.
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="inline-flex h-11 items-center gap-1 rounded-lg p-1" style={{ backgroundColor: "white", border: "1px solid #E8DDD0" }}>
            <TabsTrigger value="all" className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:text-white data-[state=active]:shadow-sm" style={{ ["--tw-data-active-bg" as string]: "#8A6A4A" }}>
              <LayoutDashboard className="mr-1.5 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="homepage" className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:text-white data-[state=active]:shadow-sm">
              <Globe className="mr-1.5 h-4 w-4" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="faqs" className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:text-white data-[state=active]:shadow-sm">
              <FileQuestion className="mr-1.5 h-4 w-4" />
              FAQs ({faqs.length})
            </TabsTrigger>
            <TabsTrigger value="announcements" className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:text-white data-[state=active]:shadow-sm">
              <Megaphone className="mr-1.5 h-4 w-4" />
              Announcements ({announcements.length})
            </TabsTrigger>
          </TabsList>

          {/* ============ DASHBOARD TAB ============ */}
          <TabsContent value="all" className="space-y-8 mt-6">

            {/* Section 1: Content Control Center */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#1D1D1D" }}>Content Control Center</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="relative overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#6B6B6B" }}>Total FAQs</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: "#1D1D1D" }}>{faqs.length}</p>
                      </div>
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "#FEF3C7" }}>
                        <FileQuestion className="h-6 w-6" style={{ color: "#D97706" }} />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs" style={{ color: "#16A34A" }}>
                      <TrendingUp className="h-3 w-3" />
                      <span>Active: {faqs.filter((f) => f.isActive).length}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#6B6B6B" }}>Active Announcements</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: "#1D1D1D" }}>{announcements.filter((a) => a.isActive).length}</p>
                      </div>
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "#DBEAFE" }}>
                        <Megaphone className="h-6 w-6" style={{ color: "#2563EB" }} />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs" style={{ color: "#6B6B6B" }}>
                      <span>Total: {announcements.length}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#6B6B6B" }}>Testimonials</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: "#1D1D1D" }}>{testimonials.length}</p>
                      </div>
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "#EDE9FE" }}>
                        <Star className="h-6 w-6" style={{ color: "#7C3AED" }} />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs" style={{ color: "#6B6B6B" }}>
                      <span>Featured: {testimonials.filter((t) => t.isActive).length}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#6B6B6B" }}>Site Uptime</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: "#1D1D1D" }}>99.9%</p>
                      </div>
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "#DCFCE7" }}>
                        <Activity className="h-6 w-6" style={{ color: "#16A34A" }} />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs" style={{ color: "#16A34A" }}>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>All systems operational</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 2: Content Navigation Hub */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#1D1D1D" }}>Content Navigation Hub</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentModules.map((mod) => (
                  <Card
                    key={mod.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    style={{ border: "1px solid #E8DDD0" }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: mod.bgColor }}>
                          <span style={{ color: mod.color }}>{mod.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold" style={{ color: "#1D1D1D" }}>{mod.name}</h3>
                            <Badge
                              variant={mod.status === "active" ? "default" : "secondary"}
                              className="text-xs"
                              style={
                                mod.status === "active"
                                  ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                                  : mod.status === "draft"
                                  ? { backgroundColor: "#FEF3C7", color: "#D97706" }
                                  : { backgroundColor: "#E0E7FF", color: "#4F46E5" }
                              }
                            >
                              {mod.status === "active" ? "Active" : mod.status === "draft" ? "Draft" : "Scheduled"}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1" style={{ color: "#6B6B6B" }}>{mod.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Section 3: Visual Content Map */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#1D1D1D" }}>Visual Content Map</h2>
              <Card style={{ border: "1px solid #E8DDD0" }}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {homepageSections.map((sec) => (
                      <div
                        key={sec.id}
                        className="rounded-lg p-4 text-center transition-all duration-200 hover:shadow-sm"
                        style={{
                          backgroundColor: sec.status === "Published" ? "#F0FDF4" : sec.status === "Draft" ? "#FFFBEB" : "#EFF6FF",
                          border: `1px solid ${sec.status === "Published" ? "#BBF7D0" : sec.status === "Draft" ? "#FDE68A" : "#BFDBFE"}`,
                        }}
                      >
                        <div className="flex justify-center mb-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: sec.status === "Published" ? "#16A34A" : sec.status === "Draft" ? "#D97706" : "#2563EB",
                            }}
                          >
                            {sec.status === "Published" ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : sec.status === "Draft" ? (
                              <Edit className="h-4 w-4 text-white" />
                            ) : (
                              <Clock className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-medium" style={{ color: "#1D1D1D" }}>{sec.name}</p>
                        <Badge
                          variant="secondary"
                          className="mt-2 text-xs"
                          style={
                            sec.status === "Published"
                              ? { backgroundColor: "#BBF7D0", color: "#16A34A" }
                              : sec.status === "Draft"
                              ? { backgroundColor: "#FDE68A", color: "#92400E" }
                              : { backgroundColor: "#BFDBFE", color: "#1E40AF" }
                          }
                        >
                          {sec.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 4: Premium Homepage Builder */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#1D1D1D" }}>Premium Homepage Builder</h2>
              <Card style={{ border: "1px solid #E8DDD0" }}>
                <CardContent className="p-6 space-y-4">
                  {/* Hero Banner */}
                  <div className="rounded-lg p-4" style={{ backgroundColor: "#FAFAFA", border: "1px solid #E8DDD0" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 cursor-grab" style={{ color: "#D8B27A" }} />
                        <div>
                          <h3 className="font-semibold" style={{ color: "#1D1D1D" }}>Hero Banner</h3>
                          <p className="text-xs" style={{ color: "#6B6B6B" }}>Main hero section with title and CTA</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={sectionVisibility.hero}
                          onCheckedChange={(val) => setSectionVisibility((prev) => ({ ...prev, hero: val }))}
                        />
                        <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    {sectionVisibility.hero && (
                      <div className="mt-4 space-y-3 pl-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Title</Label>
                            <Input value={homepage.heroTitle} onChange={(e) => setHomepage((p) => ({ ...p, heroTitle: e.target.value }))} className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs">CTA Text</Label>
                            <Input value={homepage.heroCtaText} onChange={(e) => setHomepage((p) => ({ ...p, heroCtaText: e.target.value }))} className="mt-1" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Subtitle</Label>
                          <Textarea value={homepage.heroSubtitle} onChange={(e) => setHomepage((p) => ({ ...p, heroSubtitle: e.target.value }))} rows={2} className="mt-1" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Featured Books */}
                  <div className="rounded-lg p-4" style={{ backgroundColor: "#FAFAFA", border: "1px solid #E8DDD0" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 cursor-grab" style={{ color: "#D8B27A" }} />
                        <div>
                          <h3 className="font-semibold" style={{ color: "#1D1D1D" }}>Featured Books</h3>
                          <p className="text-xs" style={{ color: "#6B6B6B" }}>Curated book selection</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={homepage.featuredEnabled}
                          onCheckedChange={(val) => setHomepage((p) => ({ ...p, featuredEnabled: val }))}
                        />
                        <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    {homepage.featuredEnabled && (
                      <div className="mt-4 space-y-3 pl-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Title</Label>
                            <Input value={homepage.featuredTitle} onChange={(e) => setHomepage((p) => ({ ...p, featuredTitle: e.target.value }))} className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs">Subtitle</Label>
                            <Input value={homepage.featuredSubtitle} onChange={(e) => setHomepage((p) => ({ ...p, featuredSubtitle: e.target.value }))} className="mt-1" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Newsletter */}
                  <div className="rounded-lg p-4" style={{ backgroundColor: "#FAFAFA", border: "1px solid #E8DDD0" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 cursor-grab" style={{ color: "#D8B27A" }} />
                        <div>
                          <h3 className="font-semibold" style={{ color: "#1D1D1D" }}>Newsletter</h3>
                          <p className="text-xs" style={{ color: "#6B6B6B" }}>Email subscription section</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3 pl-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Heading</Label>
                          <Input value={homepage.newsletterHeading} onChange={(e) => setHomepage((p) => ({ ...p, newsletterHeading: e.target.value }))} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Description</Label>
                          <Input value={homepage.newsletterDescription} onChange={(e) => setHomepage((p) => ({ ...p, newsletterDescription: e.target.value }))} className="mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="rounded-lg p-4" style={{ backgroundColor: "#FAFAFA", border: "1px solid #E8DDD0" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 cursor-grab" style={{ color: "#D8B27A" }} />
                        <div>
                          <h3 className="font-semibold" style={{ color: "#1D1D1D" }}>Footer</h3>
                          <p className="text-xs" style={{ color: "#6B6B6B" }}>Site footer content</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3 pl-8">
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Input value={homepage.footerDescription} onChange={(e) => setHomepage((p) => ({ ...p, footerDescription: e.target.value }))} className="mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 5: Live Website Preview */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#1D1D1D" }}>Live Website Preview</h2>
              <Card style={{ border: "1px solid #E8DDD0" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {[
                          { key: "desktop", icon: Monitor, label: "Desktop" },
                          { key: "tablet", icon: Tablet, label: "Tablet" },
                          { key: "mobile", icon: Smartphone, label: "Mobile" },
                        ].map(({ key, icon: Icon, label }) => (
                          <button
                            key={key}
                            onClick={() => setPreviewDevice(key as typeof previewDevice)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                            style={{
                              backgroundColor: previewDevice === key ? "#8A6A4A" : "transparent",
                              color: previewDevice === key ? "white" : "#6B6B6B",
                            }}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 inline-block" />
                        Live
                      </Badge>
                      <span className="text-xs" style={{ color: "#6B6B6B" }}>Updated 2 min ago</span>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #E8DDD0" }}>
                    <div className="p-2 flex items-center gap-1.5" style={{ backgroundColor: "#F5F5F5", borderBottom: "1px solid #E8DDD0" }}>
                      <div className="flex gap-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28C840" }} />
                      </div>
                      <div className="flex-1 mx-4 px-3 py-1 rounded text-xs" style={{ backgroundColor: "white", color: "#999" }}>
                        statementpublications.com
                      </div>
                    </div>
                    <iframe
                      srcDoc={homepagePreviewHTML}
                      className="w-full bg-white"
                      style={{
                        height: previewDevice === "desktop" ? "500px" : previewDevice === "tablet" ? "400px" : "350px",
                        maxWidth: previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? "768px" : "375px",
                        margin: "0 auto",
                        display: "block",
                      }}
                      title="Website Preview"
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 6: Content Activity Center */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#1D1D1D" }}>Content Activity Center</h2>
              <Card style={{ border: "1px solid #E8DDD0" }}>
                <CardContent className="p-6">
                  <div className="space-y-0">
                    {[
                      { title: "FAQ Updated", desc: "\"How do I publish my book?\" was edited", time: "2 hours ago", color: "#D97706" },
                      { title: "Announcement Published", desc: "\"New Submission Guidelines\" went live", time: "5 hours ago", color: "#2563EB" },
                      { title: "Testimonial Approved", desc: "\"John D.'s testimonial\" approved", time: "1 day ago", color: "#7C3AED" },
                      { title: "Blog Post Drafted", desc: "\"Writing Tips for Authors\" started", time: "2 days ago", color: "#16A34A" },
                    ].map((activity, i) => (
                      <div key={i} className="flex gap-4 py-3" style={{ borderBottom: i < 3 ? "1px solid #E8DDD0" : "none" }}>
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: activity.color }} />
                          {i < 3 && <div className="flex-1 w-px mt-1" style={{ backgroundColor: "#E8DDD0" }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm" style={{ color: "#1D1D1D" }}>{activity.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#6B6B6B" }}>{activity.desc}</p>
                        </div>
                        <span className="text-xs whitespace-nowrap" style={{ color: "#999" }}>{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 9: Content Analytics Center */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#1D1D1D" }}>Content Analytics Center</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {[
                  { label: "Page Views", value: "12,450", icon: Users, color: "#2563EB", bg: "#DBEAFE" },
                  { label: "Bounce Rate", value: "34%", icon: MousePointerClick, color: "#D97706", bg: "#FEF3C7" },
                  { label: "Avg. Session", value: "4:32", icon: Timer, color: "#16A34A", bg: "#DCFCE7" },
                  { label: "Conversion", value: "2.8%", icon: TrendingUp, color: "#7C3AED", bg: "#EDE9FE" },
                ].map((stat) => (
                  <Card key={stat.label} style={{ border: "1px solid #E8DDD0" }}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm" style={{ color: "#6B6B6B" }}>{stat.label}</p>
                          <p className="text-2xl font-bold mt-1" style={{ color: "#1D1D1D" }}>{stat.value}</p>
                        </div>
                        <div className="p-2.5 rounded-lg" style={{ backgroundColor: stat.bg }}>
                          <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card style={{ border: "1px solid #E8DDD0" }}>
                  <CardHeader>
                    <CardTitle className="text-base">Weekly Views</CardTitle>
                    <CardDescription>Page views this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-3 h-40">
                      {weeklyViews.map((w) => (
                        <div key={w.day} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-xs font-medium" style={{ color: "#1D1D1D" }}>{w.views}</span>
                          <div
                            className="w-full rounded-t-md transition-all duration-500"
                            style={{
                              height: `${(w.views / maxViews) * 100}%`,
                              backgroundColor: "#8A6A4A",
                              minHeight: "8px",
                            }}
                          />
                          <span className="text-xs" style={{ color: "#6B6B6B" }}>{w.day}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card style={{ border: "1px solid #E8DDD0" }}>
                  <CardHeader>
                    <CardTitle className="text-base">Top Performing Content</CardTitle>
                    <CardDescription>Most viewed content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "FAQs Section", views: "4,230", pct: 85 },
                        { name: "Blog Articles", views: "3,890", pct: 72 },
                        { name: "Testimonials", views: "2,640", pct: 58 },
                        { name: "Homepage", views: "1,690", pct: 38 },
                      ].map((item) => (
                        <div key={item.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium" style={{ color: "#1D1D1D" }}>{item.name}</span>
                            <span className="text-xs" style={{ color: "#6B6B6B" }}>{item.views} views</span>
                          </div>
                          <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#E8DDD0" }}>
                            <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: "#8A6A4A" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 11: Version Control */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#1D1D1D" }}>Version Control</h2>
              <Card style={{ border: "1px solid #E8DDD0" }}>
                <CardContent className="p-6">
                  <div className="space-y-0">
                    {versions.map((v, i) => (
                      <div key={v.id} className="flex items-center gap-4 py-3" style={{ borderBottom: i < versions.length - 1 ? "1px solid #E8DDD0" : "none" }}>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor:
                              v.type === "create" ? "#DCFCE7" : v.type === "edit" ? "#DBEAFE" : v.type === "delete" ? "#FEE2E2" : "#EDE9FE",
                          }}
                        >
                          {v.type === "create" && <Plus className="h-4 w-4" style={{ color: "#16A34A" }} />}
                          {v.type === "edit" && <Edit className="h-4 w-4" style={{ color: "#2563EB" }} />}
                          {v.type === "delete" && <Trash2 className="h-4 w-4" style={{ color: "#DC2626" }} />}
                          {v.type === "restore" && <RotateCcw className="h-4 w-4" style={{ color: "#7C3AED" }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm" style={{ color: "#1D1D1D" }}>{v.title}</p>
                            {i === 0 && (
                              <Badge className="text-xs" style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}>Current</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs" style={{ color: "#6B6B6B" }}>{v.editor}</span>
                            <span className="text-xs" style={{ color: "#999" }}>{formatDate(v.timestamp, "relative")}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 text-xs">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 text-xs">
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Restore
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 12: Content Health Status */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#1D1D1D" }}>Content Health Status</h2>
              <Card style={{ border: "1px solid #E8DDD0" }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <svg className="w-20 h-20" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#E8DDD0" strokeWidth="8" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#16A34A"
                          strokeWidth="8"
                          strokeDasharray={`${0.92 * 251.3} ${251.3}`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold" style={{ color: "#1D1D1D" }}>92%</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: "#1D1D1D" }}>Overall Health</h3>
                      <p className="text-sm" style={{ color: "#6B6B6B" }}>Content quality score</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "FAQs Completeness", value: 100, status: "Healthy" },
                      { label: "Announcements Active", value: 67, status: "Healthy" },
                      { label: "Testimonials Pending Review", value: 0, status: "Healthy" },
                      { label: "Homepage Updated", value: 100, status: "Healthy" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium" style={{ color: "#1D1D1D" }}>{item.label}</span>
                          <Badge
                            className="text-xs"
                            style={
                              item.status === "Healthy"
                                ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                                : { backgroundColor: "#FEF3C7", color: "#D97706" }
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#E8DDD0" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${item.value}%`,
                              backgroundColor: item.value === 100 ? "#16A34A" : item.value > 50 ? "#D97706" : "#DC2626",
                            }}
                          />
                        </div>
                        <p className="text-xs mt-1" style={{ color: "#999" }}>{item.value}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* ============ HOMEPAGE TAB ============ */}
          <TabsContent value="homepage" className="mt-6">
            <Card style={{ border: "1px solid #E8DDD0" }}>
              <CardHeader>
                <CardTitle>Homepage Content</CardTitle>
                <CardDescription>Edit the main content sections displayed on the homepage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium" style={{ color: "#1D1D1D" }}>Hero Section</h3>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={homepage.heroTitle} onChange={(e) => setHomepage((p) => ({ ...p, heroTitle: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea value={homepage.heroSubtitle} onChange={(e) => setHomepage((p) => ({ ...p, heroSubtitle: e.target.value }))} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input value={homepage.heroCtaText} onChange={(e) => setHomepage((p) => ({ ...p, heroCtaText: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium" style={{ color: "#1D1D1D" }}>Featured Section</h3>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Enabled</Label>
                      <Switch checked={homepage.featuredEnabled} onCheckedChange={(val) => setHomepage((p) => ({ ...p, featuredEnabled: val }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={homepage.featuredTitle} onChange={(e) => setHomepage((p) => ({ ...p, featuredTitle: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input value={homepage.featuredSubtitle} onChange={(e) => setHomepage((p) => ({ ...p, featuredSubtitle: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium" style={{ color: "#1D1D1D" }}>Newsletter</h3>
                  <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input value={homepage.newsletterHeading} onChange={(e) => setHomepage((p) => ({ ...p, newsletterHeading: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={homepage.newsletterDescription} onChange={(e) => setHomepage((p) => ({ ...p, newsletterDescription: e.target.value }))} rows={2} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium" style={{ color: "#1D1D1D" }}>Footer</h3>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input value={homepage.footerDescription} onChange={(e) => setHomepage((p) => ({ ...p, footerDescription: e.target.value }))} />
                  </div>
                </div>
                <Button onClick={() => showNotification("Homepage content saved!")}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ FAQS TAB ============ */}
          <TabsContent value="faqs" className="mt-6">
            <Card style={{ border: "1px solid #E8DDD0" }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>FAQ Management</CardTitle>
                  <CardDescription>Manage frequently asked questions displayed on the help page.</CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingFAQ(null);
                    setNewFAQ({ question: "", answer: "", category: "General" });
                    setFAQDialogOpen(true);
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add FAQ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#999" }} />
                    <Input
                      placeholder="Search FAQs..."
                      value={faqSearch}
                      onChange={(e) => setFAQSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {faqCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFAQFilterCategory(cat)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                        style={{
                          backgroundColor: faqFilterCategory === cat ? "#8A6A4A" : "transparent",
                          color: faqFilterCategory === cat ? "white" : "#6B6B6B",
                          border: faqFilterCategory === cat ? "none" : "1px solid #E8DDD0",
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredFAQs.map((faq, idx) => (
                    <div key={faq.id} className="rounded-lg p-4" style={{ backgroundColor: "#FAFAFA", border: "1px solid #E8DDD0" }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => toggleFAQExpand(faq.id)}
                              className="font-medium text-sm flex items-center gap-1 hover:underline"
                              style={{ color: "#1D1D1D" }}
                            >
                              {expandedFAQs.has(faq.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              {faq.question}
                            </button>
                            <Badge variant="secondary" className="text-xs" style={{ backgroundColor: "#E8DDD0", color: "#1D1D1D" }}>
                              {faq.category}
                            </Badge>
                            {!faq.isActive && (
                              <Badge variant="outline" className="text-xs">Inactive</Badge>
                            )}
                          </div>
                          {expandedFAQs.has(faq.id) && (
                            <p className="mt-2 text-sm" style={{ color: "#6B6B6B" }}>{faq.answer}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => moveFAQ(faq.id, "up")}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                            disabled={idx === 0}
                            style={{ opacity: idx === 0 ? 0.3 : 1 }}
                          >
                            <ArrowUp className="h-3.5 w-3.5" style={{ color: "#6B6B6B" }} />
                          </button>
                          <button
                            onClick={() => moveFAQ(faq.id, "down")}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                            disabled={idx === filteredFAQs.length - 1}
                            style={{ opacity: idx === filteredFAQs.length - 1 ? 0.3 : 1 }}
                          >
                            <ArrowDown className="h-3.5 w-3.5" style={{ color: "#6B6B6B" }} />
                          </button>
                          <Switch
                            checked={faq.isActive}
                            onCheckedChange={() => toggleFAQActive(faq.id)}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                            onClick={() => {
                              setEditingFAQ(faq);
                              setNewFAQ({ question: faq.question, answer: faq.answer, category: faq.category });
                              setFAQDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                            style={{ color: "#DC2626" }}
                            onClick={() => deleteFAQ(faq.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ ANNOUNCEMENTS TAB ============ */}
          <TabsContent value="announcements" className="mt-6">
            <Card style={{ border: "1px solid #E8DDD0" }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>Create and manage platform-wide announcements.</CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingAnnouncement(null);
                    setNewAnnouncement({ title: "", content: "", endDate: "", priority: "medium", type: "info" });
                    setAnnouncementDialogOpen(true);
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  New Announcement
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="rounded-lg p-4" style={{ backgroundColor: "#FAFAFA", border: "1px solid #E8DDD0" }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium" style={{ color: "#1D1D1D" }}>{announcement.title}</p>
                            {announcement.isActive ? (
                              <Badge className="text-xs" style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}>
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                <XCircle className="mr-1 h-3 w-3" />
                                Inactive
                              </Badge>
                            )}
                            <Badge
                              className="text-xs"
                              style={
                                announcement.priority === "high"
                                  ? { backgroundColor: "#FEE2E2", color: "#DC2626" }
                                  : announcement.priority === "medium"
                                  ? { backgroundColor: "#FEF3C7", color: "#D97706" }
                                  : { backgroundColor: "#DBEAFE", color: "#2563EB" }
                              }
                            >
                              {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                            </Badge>
                            <Badge
                              className="text-xs"
                              style={
                                announcement.type === "success"
                                  ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                                  : announcement.type === "warning"
                                  ? { backgroundColor: "#FEF3C7", color: "#D97706" }
                                  : { backgroundColor: "#DBEAFE", color: "#2563EB" }
                              }
                            >
                              {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm" style={{ color: "#6B6B6B" }}>{announcement.content}</p>
                          <div className="mt-2 flex items-center gap-4 text-xs" style={{ color: "#999" }}>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Started {formatDate(announcement.startDate)}
                            </span>
                            {announcement.endDate && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Ends {formatDate(announcement.endDate)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Switch
                            checked={announcement.isActive}
                            onCheckedChange={() => toggleAnnouncementActive(announcement.id)}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                            onClick={() => {
                              setEditingAnnouncement(announcement);
                              setNewAnnouncement({
                                title: announcement.title,
                                content: announcement.content,
                                endDate: "",
                                priority: announcement.priority,
                                type: announcement.type,
                              });
                              setAnnouncementDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                            style={{ color: "#DC2626" }}
                            onClick={() => deleteAnnouncement(announcement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions Panel */}
        <div className="fixed bottom-6 right-6 z-40">
          {quickActionsOpen && (
            <div
              className="mb-3 rounded-xl shadow-xl p-2 w-64 space-y-1"
              style={{ backgroundColor: "white", border: "1px solid #E8DDD0" }}
            >
              <p className="px-3 py-2 text-xs font-semibold" style={{ color: "#999" }}>Quick Actions</p>
              {[
                { label: "Compose New Announcement", icon: Megaphone, action: () => { setQuickActionsOpen(false); setEditingAnnouncement(null); setNewAnnouncement({ title: "", content: "", endDate: "", priority: "medium", type: "info" }); setAnnouncementDialogOpen(true); } },
                { label: "Create FAQ Entry", icon: FileQuestion, action: () => { setQuickActionsOpen(false); setEditingFAQ(null); setNewFAQ({ question: "", answer: "", category: "General" }); setFAQDialogOpen(true); } },
                { label: "Edit Homepage Content", icon: Globe, action: () => { setQuickActionsOpen(false); showNotification("Scroll to Homepage Builder section"); } },
                { label: "View Analytics", icon: BarChart3, action: () => { setQuickActionsOpen(false); showNotification("Scroll to Analytics section"); } },
                { label: "Export Content", icon: Download, action: () => { setQuickActionsOpen(false); showNotification("Content exported as JSON"); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-gray-50"
                  style={{ color: "#1D1D1D" }}
                >
                  <item.icon className="h-4 w-4" style={{ color: "#8A6A4A" }} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: quickActionsOpen ? "#1D1D1D" : "#8A6A4A",
              color: "white",
            }}
          >
            {quickActionsOpen ? <XCircle className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
          </button>
        </div>

        {/* FAQ Dialog */}
        <Dialog open={faqDialogOpen} onOpenChange={setFAQDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingFAQ ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
              <DialogDescription>
                {editingFAQ ? "Update the FAQ entry below." : "Create a new frequently asked question."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                  placeholder="Enter the question..."
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                  placeholder="Enter the answer..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={newFAQ.category}
                  onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                  placeholder="e.g., Publishing, Payments, Technical"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFAQDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveFAQ}
                disabled={!newFAQ.question.trim() || !newFAQ.answer.trim()}
                style={{ backgroundColor: "#8A6A4A", color: "white" }}
              >
                <Save className="mr-1 h-4 w-4" />
                {editingFAQ ? "Save Changes" : "Add FAQ"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Announcement Dialog */}
        <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
              <DialogDescription>
                {editingAnnouncement
                  ? "Update the announcement details below."
                  : "Create a new platform-wide announcement visible to all users."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Announcement title..."
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Announcement content..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="flex gap-2">
                    {(["high", "medium", "low"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewAnnouncement({ ...newAnnouncement, priority: p })}
                        className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                        style={{
                          backgroundColor:
                            newAnnouncement.priority === p
                              ? p === "high"
                                ? "#FEE2E2"
                                : p === "medium"
                                ? "#FEF3C7"
                                : "#DBEAFE"
                              : "#F5F5F5",
                          color:
                            newAnnouncement.priority === p
                              ? p === "high"
                                ? "#DC2626"
                                : p === "medium"
                                ? "#D97706"
                                : "#2563EB"
                              : "#999",
                          border: newAnnouncement.priority === p ? "none" : "1px solid #E8DDD0",
                        }}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex gap-2">
                    {(["info", "warning", "success"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setNewAnnouncement({ ...newAnnouncement, type: t })}
                        className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                        style={{
                          backgroundColor:
                            newAnnouncement.type === t
                              ? t === "success"
                                ? "#DCFCE7"
                                : t === "warning"
                                ? "#FEF3C7"
                                : "#DBEAFE"
                              : "#F5F5F5",
                          color:
                            newAnnouncement.type === t
                              ? t === "success"
                                ? "#16A34A"
                                : t === "warning"
                                ? "#D97706"
                                : "#2563EB"
                              : "#999",
                          border: newAnnouncement.type === t ? "none" : "1px solid #E8DDD0",
                        }}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Input
                  type="date"
                  value={newAnnouncement.endDate}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, endDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveAnnouncement}
                disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                style={{ backgroundColor: "#8A6A4A", color: "white" }}
              >
                <Megaphone className="mr-1 h-4 w-4" />
                {editingAnnouncement ? "Save Changes" : "Publish Announcement"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* FAQ Delete Confirmation Dialog */}
        <Dialog open={faqDeleteDialogOpen} onOpenChange={setFAQDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete FAQ</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this FAQ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFAQDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteFAQ}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Announcement Delete Confirmation Dialog */}
        <Dialog open={announcementDeleteDialogOpen} onOpenChange={setAnnouncementDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Announcement</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this announcement? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAnnouncementDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteAnnouncement}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
