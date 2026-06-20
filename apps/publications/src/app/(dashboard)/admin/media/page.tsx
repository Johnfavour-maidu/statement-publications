"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Trash2, Eye, RefreshCw, Upload, Download, FolderOpen, Image,
  ChevronDown, ChevronUp, ChevronRight, X, CheckCircle2, BarChart3, BarChart2, Zap,
  FileText, Calendar, Clock, ArrowUpDown, Grid, List, ExternalLink,
  Copy, Edit3, AlertTriangle, Info, Settings, Filter as FilterIcon,
  SlidersHorizontal, Layers, Tag, Star, TrendingUp, Users, Archive,
  MoreVertical, Check, Square, CheckSquare, XCircle, File, UploadCloud,
  Undo2, Redo2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type MediaCategory = "book-covers" | "author-photos" | "blog-images";
type SortOption = "newest" | "oldest" | "largest" | "smallest" | "name-az" | "name-za";
type FileType = "jpg" | "png" | "webp" | "svg" | "pdf";

interface MediaAsset {
  id: string;
  name: string;
  fileName: string;
  category: MediaCategory;
  fileType: FileType;
  fileSize: string;
  fileSizeBytes: number;
  dimensions: string;
  uploadDate: string;
  uploadedBy: string;
  downloads: number;
  usedIn: string[];
  thumbnailColor: string;
}

interface MediaActivity {
  id: string;
  action: "upload" | "delete" | "rename" | "replace" | "download";
  fileName: string;
  user: string;
  timestamp: string;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const CATEGORIES: { key: MediaCategory | "all"; label: string; color: string; activeColor: string }[] = [
  { key: "all", label: "All Files", color: "text-gray-600", activeColor: "bg-gray-600" },
  { key: "book-covers", label: "Book Covers", color: "text-violet-600", activeColor: "bg-violet-600" },
  { key: "blog-images", label: "Blog Images", color: "text-emerald-600", activeColor: "bg-emerald-600" },
  { key: "author-photos", label: "Author Photos", color: "text-blue-600", activeColor: "bg-blue-600" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "largest", label: "Largest Files" },
  { value: "smallest", label: "Smallest Files" },
  { value: "name-az", label: "Name A-Z" },
  { value: "name-za", label: "Name Z-A" },
];

const CATEGORY_COLORS: Record<MediaCategory, string> = {
  "book-covers": "#8A6A4A",
  "author-photos": "#3B82F6",
  "blog-images": "#10B981",
};

const CATEGORY_BADGE_CLASSES: Record<MediaCategory, string> = {
  "book-covers": "bg-violet-100 text-violet-700 border-violet-200",
  "author-photos": "bg-blue-100 text-blue-700 border-blue-200",
  "blog-images": "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

const mockMedia: MediaAsset[] = [
  { id: "m1", name: "Financial Clarity Book Cover", fileName: "book-cover-financial-clarity.jpg", category: "book-covers", fileType: "jpg", fileSize: "3.2 MB", fileSizeBytes: 3355443, dimensions: "1600x2400", uploadDate: daysAgo(2), uploadedBy: "Admin User", downloads: 145, usedIn: ["Homepage Hero", "Category: Finance", "Blog: Financial Tips"], thumbnailColor: "#8A6A4A" },
  { id: "m2", name: "Echoes of the Savanna", fileName: "echoes-of-the-savanna.png", category: "book-covers", fileType: "png", fileSize: "5.8 MB", fileSizeBytes: 6081740, dimensions: "1600x2400", uploadDate: daysAgo(5), uploadedBy: "Sarah Mitchell", downloads: 89, usedIn: ["Homepage Featured", "Category: Fiction"], thumbnailColor: "#D4A574" },
  { id: "m3", name: "The Lagos Diaries", fileName: "the-lagos-diaries.webp", category: "book-covers", fileType: "webp", fileSize: "2.4 MB", fileSizeBytes: 2516582, dimensions: "800x1200", uploadDate: daysAgo(8), uploadedBy: "Admin User", downloads: 203, usedIn: ["Homepage Carousel", "Category: Urban Fiction", "Blog: Lagos Stories"], thumbnailColor: "#1D1D1D" },
  { id: "m4", name: "Wisdom of Ancestors", fileName: "wisdom-of-ancestors.jpg", category: "book-covers", fileType: "jpg", fileSize: "4.1 MB", fileSizeBytes: 4299161, dimensions: "1600x2400", uploadDate: daysAgo(12), uploadedBy: "James Cooper", downloads: 67, usedIn: ["Category: Cultural", "Blog: Heritage Series"], thumbnailColor: "#5C4A3D" },
  { id: "m5", name: "Paths to Prosperity", fileName: "paths-to-prosperity.png", category: "book-covers", fileType: "png", fileSize: "3.7 MB", fileSizeBytes: 3879731, dimensions: "1600x2400", uploadDate: daysAgo(15), uploadedBy: "Admin User", downloads: 112, usedIn: ["Homepage Featured", "Category: Business"], thumbnailColor: "#D8B27A" },
  { id: "m6", name: "The Smart Author Guide", fileName: "the-smart-author-guide.webp", category: "book-covers", fileType: "webp", fileSize: "1.9 MB", fileSizeBytes: 1992294, dimensions: "800x1200", uploadDate: daysAgo(18), uploadedBy: "Sarah Mitchell", downloads: 178, usedIn: ["Blog: Author Resources", "Category: Writing"], thumbnailColor: "#8A6A4A" },
  { id: "m7", name: "African Literature Anthology", fileName: "african-literature-anthology.jpg", category: "book-covers", fileType: "jpg", fileSize: "6.3 MB", fileSizeBytes: 6606028, dimensions: "1600x2400", uploadDate: daysAgo(21), uploadedBy: "Admin User", downloads: 56, usedIn: ["Category: Anthology", "Blog: African Literature"], thumbnailColor: "#D4A574" },
  { id: "m8", name: "Beyond the Horizon", fileName: "beyond-the-horizon.png", category: "book-covers", fileType: "png", fileSize: "4.5 MB", fileSizeBytes: 4718592, dimensions: "1600x2400", uploadDate: daysAgo(24), uploadedBy: "James Cooper", downloads: 91, usedIn: ["Homepage Carousel", "Category: Adventure"], thumbnailColor: "#3B82F6" },
  { id: "m9", name: "Rhythms of Life", fileName: "rhythms-of-life.webp", category: "book-covers", fileType: "webp", fileSize: "2.8 MB", fileSizeBytes: 2936012, dimensions: "800x1200", uploadDate: daysAgo(27), uploadedBy: "Admin User", downloads: 134, usedIn: ["Category: Poetry", "Blog: Literary Arts"], thumbnailColor: "#10B981" },
  { id: "m10", name: "The Entrepreneur's Journey", fileName: "the-entrepreneurs-journey.jpg", category: "book-covers", fileType: "jpg", fileSize: "5.1 MB", fileSizeBytes: 5347737, dimensions: "1600x2400", uploadDate: daysAgo(30), uploadedBy: "Sarah Mitchell", downloads: 76, usedIn: ["Category: Business", "Blog: Entrepreneurship"], thumbnailColor: "#F59E0B" },
  { id: "m11", name: "Voices of Change", fileName: "voices-of-change.png", category: "book-covers", fileType: "png", fileSize: "3.9 MB", fileSizeBytes: 4089446, dimensions: "1600x2400", uploadDate: daysAgo(33), uploadedBy: "Admin User", downloads: 98, usedIn: ["Homepage Featured", "Category: Non-Fiction"], thumbnailColor: "#EF4444" },
  { id: "m12", name: "Shadows of Power", fileName: "shadows-of-power.webp", category: "book-covers", fileType: "webp", fileSize: "2.1 MB", fileSizeBytes: 2202009, dimensions: "800x1200", uploadDate: daysAgo(36), uploadedBy: "James Cooper", downloads: 143, usedIn: ["Category: Thriller", "Blog: Best Sellers"], thumbnailColor: "#1D1D1D" },
  { id: "m13", name: "The Writing Craft", fileName: "the-writing-craft.jpg", category: "book-covers", fileType: "jpg", fileSize: "3.4 MB", fileSizeBytes: 3565158, dimensions: "1600x2400", uploadDate: daysAgo(39), uploadedBy: "Admin User", downloads: 65, usedIn: ["Category: Writing", "Blog: Author Resources"], thumbnailColor: "#8A6A4A" },
  { id: "m14", name: "Cultural Heritage", fileName: "cultural-heritage.png", category: "book-covers", fileType: "png", fileSize: "4.8 MB", fileSizeBytes: 5033164, dimensions: "1600x2400", uploadDate: daysAgo(42), uploadedBy: "Sarah Mitchell", downloads: 87, usedIn: ["Category: Culture", "Blog: Heritage Series"], thumbnailColor: "#D4A574" },
  { id: "m15", name: "Dawn of a New Era", fileName: "dawn-of-a-new-era.webp", category: "book-covers", fileType: "webp", fileSize: "2.6 MB", fileSizeBytes: 2726297, dimensions: "800x1200", uploadDate: daysAgo(45), uploadedBy: "Admin User", downloads: 119, usedIn: ["Homepage Carousel", "Category: Contemporary"], thumbnailColor: "#F59E0B" },
  { id: "m16", name: "The Publishing Handbook", fileName: "the-publishing-handbook.jpg", category: "book-covers", fileType: "jpg", fileSize: "5.5 MB", fileSizeBytes: 5767168, dimensions: "1600x2400", uploadDate: daysAgo(48), uploadedBy: "James Cooper", downloads: 201, usedIn: ["Blog: Publishing Guide", "Category: Resources"], thumbnailColor: "#5C4A3D" },
  { id: "m17", name: "Heart of Africa", fileName: "heart-of-africa.png", category: "book-covers", fileType: "png", fileSize: "7.2 MB", fileSizeBytes: 7549747, dimensions: "1600x2400", uploadDate: daysAgo(51), uploadedBy: "Admin User", downloads: 54, usedIn: ["Homepage Featured", "Category: African Fiction"], thumbnailColor: "#10B981" },
  { id: "m18", name: "Tales from the Village", fileName: "tales-from-the-village.webp", category: "book-covers", fileType: "webp", fileSize: "1.8 MB", fileSizeBytes: 1887436, dimensions: "800x1200", uploadDate: daysAgo(54), uploadedBy: "Sarah Mitchell", downloads: 167, usedIn: ["Category: Folklore", "Blog: Village Stories"], thumbnailColor: "#D8B27A" },
  { id: "m19", name: "The Business of Books", fileName: "the-business-of-books.jpg", category: "book-covers", fileType: "jpg", fileSize: "3.6 MB", fileSizeBytes: 3774873, dimensions: "1600x2400", uploadDate: daysAgo(57), uploadedBy: "Admin User", downloads: 92, usedIn: ["Category: Business", "Blog: Publishing Business"], thumbnailColor: "#3B82F6" },
  { id: "m20", name: "Seeds of Growth", fileName: "seeds-of-growth.png", category: "book-covers", fileType: "png", fileSize: "4.3 MB", fileSizeBytes: 4508876, dimensions: "1600x2400", uploadDate: daysAgo(60), uploadedBy: "James Cooper", downloads: 73, usedIn: ["Category: Self-Help", "Blog: Personal Growth"], thumbnailColor: "#10B981" },
  { id: "m21", name: "Bridges Not Walls", fileName: "bridges-not-walls.webp", category: "book-covers", fileType: "webp", fileSize: "2.3 MB", fileSizeBytes: 2411724, dimensions: "800x1200", uploadDate: daysAgo(63), uploadedBy: "Admin User", downloads: 108, usedIn: ["Category: Social", "Blog: Community Building"], thumbnailColor: "#8A6A4A" },
  { id: "m22", name: "The Author's Blueprint", fileName: "the-authors-blueprint.jpg", category: "book-covers", fileType: "jpg", fileSize: "5.9 MB", fileSizeBytes: 6186598, dimensions: "1600x2400", uploadDate: daysAgo(66), uploadedBy: "Sarah Mitchell", downloads: 156, usedIn: ["Blog: Author Resources", "Category: Writing"], thumbnailColor: "#D4A574" },
  { id: "m23", name: "Legacy of Words", fileName: "legacy-of-words.png", category: "book-covers", fileType: "png", fileSize: "3.1 MB", fileSizeBytes: 3250585, dimensions: "1600x2400", uploadDate: daysAgo(70), uploadedBy: "Admin User", downloads: 44, usedIn: ["Category: Poetry", "Blog: Literary Legacy"], thumbnailColor: "#F59E0B" },
  { id: "m24", name: "Fire and Faith", fileName: "fire-and-faith.webp", category: "book-covers", fileType: "webp", fileSize: "2.0 MB", fileSizeBytes: 2097152, dimensions: "800x1200", uploadDate: daysAgo(75), uploadedBy: "James Cooper", downloads: 81, usedIn: ["Category: Inspirational", "Blog: Faith Series"], thumbnailColor: "#EF4444" },
  { id: "m25", name: "The Story Continues", fileName: "the-story-continues.jpg", category: "book-covers", fileType: "jpg", fileSize: "4.7 MB", fileSizeBytes: 4928307, dimensions: "1600x2400", uploadDate: daysAgo(80), uploadedBy: "Admin User", downloads: 132, usedIn: ["Homepage Carousel", "Category: Fiction"], thumbnailColor: "#5C4A3D" },

  { id: "m26", name: "Marketing Strategy Blog", fileName: "blog-marketing-strategy.webp", category: "blog-images", fileType: "webp", fileSize: "1.4 MB", fileSizeBytes: 1468006, dimensions: "1200x800", uploadDate: daysAgo(1), uploadedBy: "Sarah Mitchell", downloads: 87, usedIn: ["Blog: Marketing Strategy", "Blog: Promotion Tips"], thumbnailColor: "#10B981" },
  { id: "m27", name: "Self-Publishing Guide Blog", fileName: "blog-self-publishing-guide.jpg", category: "blog-images", fileType: "jpg", fileSize: "2.1 MB", fileSizeBytes: 2202009, dimensions: "1200x800", uploadDate: daysAgo(4), uploadedBy: "Admin User", downloads: 134, usedIn: ["Blog: Self-Publishing 101"], thumbnailColor: "#3B82F6" },
  { id: "m28", name: "Author Branding Blog", fileName: "blog-author-branding.png", category: "blog-images", fileType: "png", fileSize: "1.8 MB", fileSizeBytes: 1887436, dimensions: "1200x800", uploadDate: daysAgo(7), uploadedBy: "James Cooper", downloads: 99, usedIn: ["Blog: Build Your Author Brand", "Category: Marketing"], thumbnailColor: "#8A6A4A" },
  { id: "m29", name: "Cover Design Tips Blog", fileName: "blog-cover-design-tips.webp", category: "blog-images", fileType: "webp", fileSize: "1.2 MB", fileSizeBytes: 1258291, dimensions: "1200x800", uploadDate: daysAgo(10), uploadedBy: "Admin User", downloads: 156, usedIn: ["Blog: Cover Design Tips"], thumbnailColor: "#D8B27A" },
  { id: "m30", name: "Book Launch Checklist Blog", fileName: "blog-book-launch-checklist.jpg", category: "blog-images", fileType: "jpg", fileSize: "2.3 MB", fileSizeBytes: 2411724, dimensions: "1200x800", uploadDate: daysAgo(13), uploadedBy: "Sarah Mitchell", downloads: 78, usedIn: ["Blog: Book Launch Checklist", "Blog: Launch Strategy"], thumbnailColor: "#F59E0B" },
  { id: "m31", name: "Social Media Marketing Blog", fileName: "blog-social-media-marketing.png", category: "blog-images", fileType: "png", fileSize: "1.6 MB", fileSizeBytes: 1677721, dimensions: "1200x800", uploadDate: daysAgo(16), uploadedBy: "Admin User", downloads: 143, usedIn: ["Blog: Social Media for Authors"], thumbnailColor: "#3B82F6" },
  { id: "m32", name: "Financial Planning Blog", fileName: "blog-financial-planning.webp", category: "blog-images", fileType: "webp", fileSize: "1.3 MB", fileSizeBytes: 1363148, dimensions: "1200x800", uploadDate: daysAgo(19), uploadedBy: "James Cooper", downloads: 65, usedIn: ["Blog: Financial Planning for Authors"], thumbnailColor: "#10B981" },
  { id: "m33", name: "Writing Routine Blog", fileName: "blog-writing-routine.jpg", category: "blog-images", fileType: "jpg", fileSize: "1.9 MB", fileSizeBytes: 1992294, dimensions: "1200x800", uploadDate: daysAgo(22), uploadedBy: "Admin User", downloads: 112, usedIn: ["Blog: Daily Writing Routine"], thumbnailColor: "#8A6A4A" },
  { id: "m34", name: "Editing Process Blog", fileName: "blog-editing-process.png", category: "blog-images", fileType: "png", fileSize: "2.0 MB", fileSizeBytes: 2097152, dimensions: "1200x800", uploadDate: daysAgo(25), uploadedBy: "Sarah Mitchell", downloads: 88, usedIn: ["Blog: The Editing Process"], thumbnailColor: "#D4A574" },
  { id: "m35", name: "Reader Engagement Blog", fileName: "blog-reader-engagement.webp", category: "blog-images", fileType: "webp", fileSize: "1.5 MB", fileSizeBytes: 1572864, dimensions: "1200x800", uploadDate: daysAgo(28), uploadedBy: "Admin User", downloads: 101, usedIn: ["Blog: Engaging Your Readers"], thumbnailColor: "#EF4444" },
  { id: "m36", name: "ISBN Explained Blog", fileName: "blog-isbn-explained.jpg", category: "blog-images", fileType: "jpg", fileSize: "1.7 MB", fileSizeBytes: 1782579, dimensions: "1200x800", uploadDate: daysAgo(31), uploadedBy: "James Cooper", downloads: 167, usedIn: ["Blog: ISBN Explained", "Blog: Publishing Basics"], thumbnailColor: "#5C4A3D" },
  { id: "m37", name: "Formatting Guide Blog", fileName: "blog-formatting-guide.png", category: "blog-images", fileType: "png", fileSize: "2.2 MB", fileSizeBytes: 2306867, dimensions: "1200x800", uploadDate: daysAgo(34), uploadedBy: "Admin User", downloads: 94, usedIn: ["Blog: Manuscript Formatting Guide"], thumbnailColor: "#D8B27A" },
  { id: "m38", name: "Email Campaigns Blog", fileName: "blog-email-campaigns.webp", category: "blog-images", fileType: "webp", fileSize: "1.1 MB", fileSizeBytes: 1153433, dimensions: "1200x800", uploadDate: daysAgo(37), uploadedBy: "Sarah Mitchell", downloads: 76, usedIn: ["Blog: Email Marketing Campaigns"], thumbnailColor: "#3B82F6" },
  { id: "m39", name: "SEO for Authors Blog", fileName: "blog-seo-for-authors.jpg", category: "blog-images", fileType: "jpg", fileSize: "1.8 MB", fileSizeBytes: 1887436, dimensions: "1200x800", uploadDate: daysAgo(40), uploadedBy: "Admin User", downloads: 123, usedIn: ["Blog: SEO Tips for Authors"], thumbnailColor: "#10B981" },
  { id: "m40", name: "Content Calendar Blog", fileName: "blog-content-calendar.png", category: "blog-images", fileType: "png", fileSize: "1.4 MB", fileSizeBytes: 1468006, dimensions: "1200x800", uploadDate: daysAgo(43), uploadedBy: "James Cooper", downloads: 58, usedIn: ["Blog: Content Calendar Planning"], thumbnailColor: "#F59E0B" },

  { id: "m41", name: "Hector DeWitt Portrait", fileName: "author-hector-dewitt.png", category: "author-photos", fileType: "png", fileSize: "2.8 MB", fileSizeBytes: 2936012, dimensions: "800x800", uploadDate: daysAgo(3), uploadedBy: "Admin User", downloads: 45, usedIn: ["Author Page: Hector DeWitt", "Blog: Author Interview"], thumbnailColor: "#3B82F6" },
  { id: "m42", name: "Chinua Adebayo Portrait", fileName: "author-chinua-adebayo.jpg", category: "author-photos", fileType: "jpg", fileSize: "3.1 MB", fileSizeBytes: 3250585, dimensions: "800x800", uploadDate: daysAgo(6), uploadedBy: "Sarah Mitchell", downloads: 78, usedIn: ["Author Page: Chinua Adebayo", "Homepage: Featured Authors"], thumbnailColor: "#8A6A4A" },
  { id: "m43", name: "Sarah Mitchell Portrait", fileName: "author-sarah-mitchell.webp", category: "author-photos", fileType: "webp", fileSize: "1.9 MB", fileSizeBytes: 1992294, dimensions: "800x800", uploadDate: daysAgo(9), uploadedBy: "Admin User", downloads: 62, usedIn: ["Author Page: Sarah Mitchell", "Blog: Team Spotlight"], thumbnailColor: "#D4A574" },
  { id: "m44", name: "James Cooper Portrait", fileName: "author-james-cooper.png", category: "author-photos", fileType: "png", fileSize: "2.5 MB", fileSizeBytes: 2621440, dimensions: "800x800", uploadDate: daysAgo(14), uploadedBy: "James Cooper", downloads: 34, usedIn: ["Author Page: James Cooper"], thumbnailColor: "#5C4A3D" },
  { id: "m45", name: "Emily Watson Portrait", fileName: "author-emily-watson.jpg", category: "author-photos", fileType: "jpg", fileSize: "2.2 MB", fileSizeBytes: 2306867, dimensions: "800x800", uploadDate: daysAgo(20), uploadedBy: "Admin User", downloads: 51, usedIn: ["Author Page: Emily Watson", "Blog: Author Spotlight"], thumbnailColor: "#F59E0B" },
  { id: "m46", name: "Michael Brown Portrait", fileName: "author-michael-brown.webp", category: "author-photos", fileType: "webp", fileSize: "1.7 MB", fileSizeBytes: 1782579, dimensions: "800x800", uploadDate: daysAgo(26), uploadedBy: "Sarah Mitchell", downloads: 29, usedIn: ["Author Page: Michael Brown"], thumbnailColor: "#10B981" },
  { id: "m47", name: "Lisa Park Portrait", fileName: "author-lisa-park.png", category: "author-photos", fileType: "png", fileSize: "2.6 MB", fileSizeBytes: 2726297, dimensions: "800x800", uploadDate: daysAgo(32), uploadedBy: "Admin User", downloads: 41, usedIn: ["Author Page: Lisa Park", "Blog: New Authors"], thumbnailColor: "#EF4444" },
  { id: "m48", name: "Olivia Carter Portrait", fileName: "author-olivia-carter.jpg", category: "author-photos", fileType: "jpg", fileSize: "2.0 MB", fileSizeBytes: 2097152, dimensions: "800x800", uploadDate: daysAgo(38), uploadedBy: "James Cooper", downloads: 55, usedIn: ["Author Page: Olivia Carter"], thumbnailColor: "#D8B27A" },
  { id: "m49", name: "David Kim Portrait", fileName: "author-david-kim.webp", category: "author-photos", fileType: "webp", fileSize: "1.6 MB", fileSizeBytes: 1677721, dimensions: "800x800", uploadDate: daysAgo(44), uploadedBy: "Admin User", downloads: 37, usedIn: ["Author Page: David Kim", "Homepage: Featured Authors"], thumbnailColor: "#3B82F6" },
  { id: "m50", name: "Rachel Green Portrait", fileName: "author-rachel-green.png", category: "author-photos", fileType: "png", fileSize: "2.3 MB", fileSizeBytes: 2411724, dimensions: "800x800", uploadDate: daysAgo(50), uploadedBy: "Sarah Mitchell", downloads: 48, usedIn: ["Author Page: Rachel Green"], thumbnailColor: "#10B981" },
];

const mockActivity: MediaActivity[] = [
  { id: "a1", action: "upload", fileName: "book-cover-financial-clarity.jpg", user: "Admin User", timestamp: hoursAgo(1) },
  { id: "a2", action: "rename", fileName: "author-profile.png", user: "Sarah Mitchell", timestamp: hoursAgo(2) },
  { id: "a3", action: "delete", fileName: "marketing-old-banner.webp", user: "Admin User", timestamp: daysAgo(1) },
  { id: "a4", action: "replace", fileName: "blog-cover-main.jpg", user: "James Cooper", timestamp: daysAgo(2) },
  { id: "a5", action: "upload", fileName: "echoes-of-the-savanna.png", user: "Admin User", timestamp: daysAgo(5) },
  { id: "a6", action: "download", fileName: "author-chinua-adebayo.jpg", user: "Lisa Park", timestamp: daysAgo(4) },
  { id: "a7", action: "upload", fileName: "blog-marketing-strategy.webp", user: "Admin User", timestamp: daysAgo(5) },
  { id: "a8", action: "delete", fileName: "unused-graphic.png", user: "Admin User", timestamp: daysAgo(7) },
];

export default function MediaLibraryPage() {
  const [allMedia, setAllMedia] = useState<MediaAsset[]>(mockMedia);
  const [filter, setFilter] = useState<MediaCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [drawerAsset, setDrawerAsset] = useState<MediaAsset | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeSummaryCard, setActiveSummaryCard] = useState<string | null>(null);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activityLog, setActivityLog] = useState<MediaActivity[]>(mockActivity);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const sortFilterRef = useRef<HTMLDivElement>(null);
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [undoStack, setUndoStack] = useState<{ action: string; data: MediaAsset[] }[]>([]);
  const [redoStack, setRedoStack] = useState<{ action: string; data: MediaAsset[] }[]>([]);
  const [undoConfirmOpen, setUndoConfirmOpen] = useState(false);
  const [undoAction, setUndoAction] = useState<{ type: string; target?: MediaAsset } | null>(null);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const addActivity = useCallback((action: MediaActivity["action"], fileName: string, user: string = "Admin User") => {
    const newActivity: MediaActivity = {
      id: `a${Date.now()}`,
      action,
      fileName,
      user,
      timestamp: new Date().toISOString(),
    };
    setActivityLog((prev) => [newActivity, ...prev].slice(0, 20));
  }, []);

  const pushUndo = useCallback((action: string, previousState: MediaAsset[]) => {
    setUndoStack((prev) => [...prev, { action, data: previousState }]);
    setRedoStack([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, { action: last.action, data: allMedia }]);
    setAllMedia(last.data);
    setUndoStack((prev) => prev.slice(0, -1));
    showNotification("success", `Undid: ${last.action}`);
  }, [undoStack, allMedia, showNotification]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, { action: last.action, data: allMedia }]);
    setAllMedia(last.data);
    setRedoStack((prev) => prev.slice(0, -1));
    showNotification("success", `Redid: ${last.action}`);
  }, [redoStack, allMedia, showNotification]);

  const filteredMedia = useMemo(() => {
    let result = [...allMedia];
    if (filter !== "all") result = result.filter((m) => m.category === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.fileName.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      );
    }
    switch (sortOption) {
      case "newest": result.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()); break;
      case "oldest": result.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()); break;
      case "largest": result.sort((a, b) => b.fileSizeBytes - a.fileSizeBytes); break;
      case "smallest": result.sort((a, b) => a.fileSizeBytes - b.fileSizeBytes); break;
      case "name-az": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-za": result.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return result;
  }, [allMedia, filter, search, sortOption]);

  const stats = useMemo(
    () => ({
      total: allMedia.length,
      bookCovers: allMedia.filter((m) => m.category === "book-covers").length,
      blogImages: allMedia.filter((m) => m.category === "blog-images").length,
      authorPhotos: allMedia.filter((m) => m.category === "author-photos").length,
    }),
    [allMedia]
  );

  const topDownloaded = useMemo(
    () => [...allMedia].sort((a, b) => b.downloads - a.downloads).slice(0, 5),
    [allMedia]
  );

  const largestFiles = useMemo(
    () => [...allMedia].sort((a, b) => b.fileSizeBytes - a.fileSizeBytes).slice(0, 5),
    [allMedia]
  );

  const maxDownloads = useMemo(() => Math.max(...allMedia.map((m) => m.downloads)), [allMedia]);
  const maxSize = useMemo(() => Math.max(...allMedia.map((m) => m.fileSizeBytes)), [allMedia]);

  const monthlyUploads = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const now = new Date();
    return months.map((month, i) => {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const count = allMedia.filter((m) => {
        const d = new Date(m.uploadDate);
        return d.getMonth() === targetDate.getMonth() && d.getFullYear() === targetDate.getFullYear();
      }).length;
      return { month, count };
    });
  }, [allMedia]);

  const maxMonthly = useMemo(() => Math.max(...monthlyUploads.map((m) => m.count), 1), [monthlyUploads]);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredMedia.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMedia.map((m) => m.id)));
    }
  }, [selectedIds.size, filteredMedia]);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleBulkDelete = useCallback(() => {
    const count = selectedIds.size;
    const deletedNames = allMedia.filter((m) => selectedIds.has(m.id)).map((m) => m.fileName);
    pushUndo(`Delete ${count} file(s)`, allMedia);
    setAllMedia((prev) => prev.filter((m) => !selectedIds.has(m.id)));
    deletedNames.forEach((name) => addActivity("delete", name));
    setSelectedIds(new Set());
    showNotification("success", `${count} file(s) deleted successfully`);
  }, [selectedIds, allMedia, addActivity, showNotification, pushUndo]);

  const handleBulkMoveCategory = useCallback(() => {
    const count = selectedIds.size;
    setAllMedia((prev) =>
      prev.map((m) => (selectedIds.has(m.id) ? { ...m, category: "book-covers" as MediaCategory } : m))
    );
    setSelectedIds(new Set());
    showNotification("success", `${count} file(s) moved to Book Covers`);
  }, [selectedIds, showNotification]);

  const handleBulkDownload = useCallback(() => {
    showNotification("success", `${selectedIds.size} file(s) queued for download`);
  }, [selectedIds.size, showNotification]);

  const handleDeleteAsset = useCallback((asset: MediaAsset) => {
    setDeleteTarget(asset);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    pushUndo(`Delete "${deleteTarget.name}"`, allMedia);
    setAllMedia((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    addActivity("delete", deleteTarget.fileName);
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
    if (drawerAsset?.id === deleteTarget.id) {
      setDrawerOpen(false);
      setDrawerAsset(null);
    }
    showNotification("success", `"${deleteTarget.name}" deleted successfully`);
  }, [deleteTarget, addActivity, drawerAsset, showNotification, allMedia, pushUndo]);

  const handleCopyUrl = useCallback(
    (asset: MediaAsset) => {
      const url = `https://statementpublications.com/media/${asset.fileName}`;
      navigator.clipboard.writeText(url).then(() => {
        showNotification("success", "URL copied to clipboard");
      }).catch(() => {
        showNotification("error", "Failed to copy URL");
      });
    },
    [showNotification]
  );

  const handleDownloadAsset = useCallback(
    (asset: MediaAsset) => {
      setAllMedia((prev) =>
        prev.map((m) => (m.id === asset.id ? { ...m, downloads: m.downloads + 1 } : m))
      );
      addActivity("download", asset.fileName);
      showNotification("success", `Downloading "${asset.name}"`);
    },
    [addActivity, showNotification]
  );

  const handleRename = useCallback(
    (asset: MediaAsset) => {
      const newName = prompt("Enter new name:", asset.name);
      if (newName && newName.trim() !== asset.name) {
        pushUndo(`Rename "${asset.name}"`, allMedia);
        setAllMedia((prev) =>
          prev.map((m) => (m.id === asset.id ? { ...m, name: newName.trim() } : m))
        );
        addActivity("rename", asset.fileName);
        showNotification("success", `Renamed to "${newName.trim()}"`);
        if (drawerAsset?.id === asset.id) {
          setDrawerAsset({ ...asset, name: newName.trim() });
        }
      }
    },
    [addActivity, showNotification, drawerAsset, allMedia, pushUndo]
  );

  const handleReplace = useCallback(
    (asset: MediaAsset) => {
      pushUndo(`Replace "${asset.name}"`, allMedia);
      addActivity("replace", asset.fileName);
      showNotification("success", `Replace dialog for "${asset.name}" would open`);
    },
    [addActivity, showNotification, allMedia, pushUndo]
  );

  const handleExportReport = useCallback(() => {
    const headers = ["Name", "File Name", "Category", "Type", "Size", "Dimensions", "Upload Date", "Uploaded By", "Downloads"];
    const rows = allMedia.map((m) => [
      m.name, m.fileName, m.category, m.fileType, m.fileSize, m.dimensions,
      new Date(m.uploadDate).toLocaleDateString(), m.uploadedBy, String(m.downloads),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "media-library-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    showNotification("success", "Media report exported as CSV");
  }, [allMedia, showNotification]);

  const handleUploadSimulate = useCallback(() => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadDialogOpen(false);
          const newAsset: MediaAsset = {
            id: `m${Date.now()}`,
            name: "New Upload",
            fileName: "new-upload.jpg",
            category: filter === "all" ? "book-covers" : filter,
            fileType: "jpg",
            fileSize: "2.4 MB",
            fileSizeBytes: 2516582,
            dimensions: "1200x800",
            uploadDate: new Date().toISOString(),
            uploadedBy: "Admin User",
            downloads: 0,
            usedIn: [],
            thumbnailColor: "#8A6A4A",
          };
          pushUndo("Upload new file", allMedia);
          setAllMedia((prev) => [newAsset, ...prev]);
          addActivity("upload", newAsset.fileName);
          showNotification("success", "File uploaded successfully");
          return 0;
        }
        return prev + 8;
      });
    }, 150);
  }, [filter, addActivity, showNotification, allMedia, pushUndo]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) {
        setQuickActionsOpen(false);
      }
      if (sortFilterRef.current && !sortFilterRef.current.contains(e.target as Node)) {
        setSortFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setUploadDialogOpen(false);
        setDeleteDialogOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  const summaryCards = [
    { key: "total", label: "TOTAL FILES", value: stats.total, icon: Image, color: "text-blue-500", bg: "bg-blue-50", filterVal: "all" as const },
    { key: "book-covers", label: "BOOK COVERS", value: stats.bookCovers, icon: FolderOpen, color: "text-purple-500", bg: "bg-purple-50", filterVal: "book-covers" as const },
    { key: "blog-images", label: "BLOG IMAGES", value: stats.blogImages, icon: Image, color: "text-emerald-500", bg: "bg-emerald-50", filterVal: "blog-images" as const },
    { key: "author-photos", label: "AUTHOR PHOTOS", value: stats.authorPhotos, icon: Users, color: "text-orange-500", bg: "bg-orange-50", filterVal: "author-photos" as const },
  ];

  const formatTimestamp = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const activityIcon = (action: MediaActivity["action"]) => {
    switch (action) {
      case "upload": return <Upload className="h-3.5 w-3.5 text-emerald-500" />;
      case "delete": return <Trash2 className="h-3.5 w-3.5 text-red-500" />;
      case "rename": return <Edit3 className="h-3.5 w-3.5 text-blue-500" />;
      case "replace": return <RefreshCw className="h-3.5 w-3.5 text-amber-500" />;
      case "download": return <Download className="h-3.5 w-3.5 text-purple-500" />;
    }
  };

  const activityDot = (action: MediaActivity["action"]) => {
    switch (action) {
      case "upload": return "bg-emerald-500";
      case "delete": return "bg-red-500";
      case "rename": return "bg-blue-500";
      case "replace": return "bg-amber-500";
      case "download": return "bg-purple-500";
    }
  };

  const activityVerb = (action: MediaActivity["action"]) => {
    switch (action) {
      case "upload": return "uploaded";
      case "delete": return "deleted";
      case "rename": return "renamed";
      case "replace": return "replaced";
      case "download": return "downloaded";
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white"
            style={{ backgroundColor: notification.type === "success" ? "#8A6A4A" : "#DC2626" }}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1: PAGE HEADER */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1D]">Media Library</h1>
          <p className="text-[#5C4A3D] mt-1">Premium Digital Asset Management for Statement Publications</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => setUploadDialogOpen(true)}
            className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white"
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload Files
          </Button>
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={undoStack.length === 0} className="border-[#D8B27A]/30 text-[#5C4A3D] hover:bg-[#F2D8BE]/20 disabled:opacity-30">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRedo} disabled={redoStack.length === 0} className="border-[#D8B27A]/30 text-[#5C4A3D] hover:bg-[#F2D8BE]/20 disabled:opacity-30">
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                showNotification("success", "Media library refreshed");
              }}
              className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      {/* SECTION 2: SUMMARY CARDS */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeSummaryCard === card.key || (filter === card.filterVal && activeSummaryCard === null);
          return (
            <motion.div
              key={card.key}
              variants={item}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Card
                onClick={() => {
                  setFilter(card.filterVal);
                  setActiveSummaryCard(card.key);
                }}
                className={`shadow-sm transition-all duration-200 bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] ${
                  isActive ? "ring-2 ring-[#D8B27A] shadow-md" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#111111] mb-1">{card.label}</p>
                      <p className="text-2xl font-bold text-[#111111]">{card.value}</p>
                    </div>
                    <div className={`rounded-lg ${card.bg} p-2 ${card.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* SECTION 3: MEDIA ANALYTICS CENTER */}
      <motion.div variants={item}>
        <div className="analytics-dropdown-border">
          <Card className="shadow-sm bg-white">
            <button
              onClick={() => setAnalyticsOpen(!analyticsOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-[#F2D8BE]/10 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#8A6A4A]" />
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Media Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
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
                <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Panel 1: Upload Trend */}
                  <div className="border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5 rounded-lg md:col-span-2 lg:col-span-1">
                    <h4 className="text-sm font-semibold text-[#1D1D1D] mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#8A6A4A]" />
                      Upload Trend
                    </h4>
                    <div className="flex items-end gap-2 h-32">
                      {monthlyUploads.map((m, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t transition-all duration-500"
                            style={{
                              height: `${(m.count / maxMonthly) * 100}%`,
                              minHeight: m.count > 0 ? "8px" : "2px",
                              backgroundColor: "#8A6A4A",
                              opacity: 0.3 + (i / monthlyUploads.length) * 0.7,
                            }}
                          />
                          <span className="text-[10px] text-[#5C4A3D]">{m.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Panel 2: Most Used Assets */}
                  <div className="border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5 rounded-lg">
                    <h4 className="text-sm font-semibold text-[#1D1D1D] mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#8A6A4A]" />
                      Most Used Assets
                    </h4>
                    <div className="space-y-3">
                      {topDownloaded.map((asset) => (
                        <div key={asset.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-[#5C4A3D] truncate max-w-[140px]">{asset.name}</span>
                            <span className="text-xs font-medium text-[#8A6A4A]">{asset.downloads}</span>
                          </div>
                          <div className="w-full bg-[#F2D8BE]/30 rounded-full h-1.5">
                            <div
                              className="bg-[#8A6A4A] h-1.5 rounded-full transition-all duration-700"
                              style={{ width: `${(asset.downloads / maxDownloads) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Panel 3: Largest Files */}
                  <div className="border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5 rounded-lg">
                    <h4 className="text-sm font-semibold text-[#1D1D1D] mb-3 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#8A6A4A]" />
                      Largest Files
                    </h4>
                    <div className="space-y-3">
                      {largestFiles.map((asset) => (
                        <div key={asset.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-[#5C4A3D] truncate max-w-[140px]">{asset.name}</span>
                            <span className="text-xs font-medium text-[#8A6A4A]">{asset.fileSize}</span>
                          </div>
                          <div className="w-full bg-[#F2D8BE]/30 rounded-full h-1.5">
                            <div
                              className="bg-[#D8B27A] h-1.5 rounded-full transition-all duration-700"
                              style={{ width: `${(asset.fileSizeBytes / maxSize) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Panel 4: Category Distribution */}
                  <div className="border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5 rounded-lg">
                    <h4 className="text-sm font-semibold text-[#1D1D1D] mb-3 flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-[#8A6A4A]" />
                      Category Distribution
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: "Book Covers", count: stats.bookCovers, color: "bg-violet-500" },
                        { label: "Blog Images", count: stats.blogImages, color: "bg-emerald-500" },
                        { label: "Author Photos", count: stats.authorPhotos, color: "bg-blue-500" },
                      ].map((cat) => (
                        <div key={cat.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-[#5C4A3D]">{cat.label}</span>
                            <span className="text-xs font-medium text-[#8A6A4A]">{cat.count}</span>
                          </div>
                          <div className="w-full bg-[#F2D8BE]/30 rounded-full h-1.5">
                            <div
                              className={`${cat.color} h-1.5 rounded-full transition-all duration-700`}
                              style={{ width: `${(cat.count / stats.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Panel 5: Most Downloaded */}
                  <div className="border border-[#D8B27A]/15 p-4 bg-[#F2D8BE]/5 rounded-lg">
                    <h4 className="text-sm font-semibold text-[#1D1D1D] mb-3 flex items-center gap-2">
                      <Download className="h-4 w-4 text-[#8A6A4A]" />
                      Most Downloaded
                    </h4>
                    <div className="space-y-3">
                      {[...topDownloaded].sort((a, b) => b.downloads - a.downloads).slice(0, 5).map((asset, i) => (
                        <div key={asset.id} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#8A6A4A] w-4">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-[#5C4A3D] truncate block">{asset.name}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px] border-[#D8B27A]/30 text-[#8A6A4A]">
                            {asset.downloads}
                          </Badge>
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

      {/* SECTIONS 4 & 5: SEARCH + FILTER CONTAINER */}
      <motion.div variants={item} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        {/* First row: Search, Sort, View toggle, Page counter, Quick Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md search-bar-border">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input
              placeholder="Search media files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C4A3D] hover:text-[#1D1D1D]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={sortFilterRef}>
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button variant="outline" size="sm" onClick={() => setSortFilterOpen(!sortFilterOpen)} className={`h-9 px-3 border-0 bg-white text-sm font-medium gap-2 ${sortOption !== "newest" ? "text-[#D8B27A]" : "text-[#8A6A4A] hover:bg-[#F2D8BE]"}`}>
                  <SlidersHorizontal className="h-4 w-4" /><span className="hidden sm:inline">Sort & Filter</span><ChevronRight className={`h-3.5 w-3.5 transition-transform ${sortFilterOpen ? "rotate-90" : ""}`} />
                </Button>
              </div>
              <AnimatePresence>
                {sortFilterOpen && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 w-[260px] bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#E8DDD0] bg-[#F5EDE3]/30 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#8A6A4A]" />Sort By</h4>
                      {sortOption !== "newest" && <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={() => setSortOption("newest")}><X className="h-3 w-3 mr-1" />Clear</Button>}
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
            <div className="flex items-center border border-[#E8DDD0] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#8A6A4A] text-white" : "bg-white text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#8A6A4A] text-white" : "bg-white text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}
              >
                <Grid className="h-4 w-4" />
              </button>
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
            {selectedIds.size > 0 && (
              <Badge className="bg-[#8A6A4A] text-white">{selectedIds.size} selected</Badge>
            )}
          </div>
        </div>
        {/* Second row: Category tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = filter === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setFilter(cat.key);
                  setActiveSummaryCard(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? `${cat.activeColor} text-white shadow-md`
                    : "bg-white text-[#5C4A3D] hover:bg-gray-100 shadow-sm border border-[#E8DDD0]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* SECTION 6: BULK ACTION BAR */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-3 p-4 bg-[#8A6A4A]/5 border border-[#D8B27A]/20 rounded-xl">
              <span className="text-sm font-semibold text-[#1D1D1D]">
                {selectedIds.size} File{selectedIds.size > 1 ? "s" : ""} Selected
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={handleBulkMoveCategory} className="border-[#D8B27A]/30 text-[#5C4A3D] hover:bg-[#F2D8BE]/20">
                  <Layers className="h-3.5 w-3.5 mr-1.5" />
                  Move to Book Covers
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkDownload} className="border-[#D8B27A]/30 text-[#5C4A3D] hover:bg-[#F2D8BE]/20">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkDelete} className="border-red-200 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} className="text-[#5C4A3D] hover:text-[#1D1D1D]">
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Clear
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 7: MEDIA GRID / LIST */}
      <motion.div variants={item}>
        {filteredMedia.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[#E8DDD0]">
            <FolderOpen className="h-16 w-16 text-[#D8B27A]/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1D1D1D] mb-2">No Media Found</h3>
            <p className="text-[#5C4A3D] mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={() => { setSearch(""); setFilter("all"); setActiveSummaryCard(null); }} className="border-[#D8B27A]/30">
              Clear Filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((asset) => (
              <motion.div
                key={asset.id}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group ${
                  selectedIds.has(asset.id) ? "ring-2 ring-[#D8B27A]" : ""
                }`}
                onClick={() => {
                  setDrawerAsset(asset);
                  setDrawerOpen(true);
                }}
              >
                <div
                  className="relative aspect-[4/3] flex items-center justify-center"
                  style={{ backgroundColor: asset.thumbnailColor + "15" }}
                >
                  <Image className="h-10 w-10" style={{ color: asset.thumbnailColor }} />
                  <div
                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(asset.id);
                    }}
                  >
                    {selectedIds.has(asset.id) ? (
                      <CheckSquare className="h-5 w-5 text-[#8A6A4A]" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400 hover:text-[#8A6A4A]" />
                    )}
                  </div>
                  <Badge className={`absolute top-2 right-2 text-[10px] ${CATEGORY_BADGE_CLASSES[asset.category]}`}>
                    {asset.fileType.toUpperCase()}
                  </Badge>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-[#1D1D1D] truncate">{asset.name}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-[#5C4A3D] flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(asset.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span className="text-xs text-[#5C4A3D]">{asset.fileSize}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD0] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-10">
                    <button onClick={handleSelectAll} className="flex items-center justify-center">
                      {selectedIds.size === filteredMedia.length && filteredMedia.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-[#8A6A4A]" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedia.map((asset) => (
                  <TableRow key={asset.id} className={`cursor-pointer ${selectedIds.has(asset.id) ? "bg-[#F2D8BE]/10" : ""}`} onClick={() => { setDrawerAsset(asset); setDrawerOpen(true); }}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleSelect(asset.id)}>
                        {selectedIds.has(asset.id) ? <CheckSquare className="h-4 w-4 text-[#8A6A4A]" /> : <Square className="h-4 w-4 text-gray-400 hover:text-[#8A6A4A]" />}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: asset.thumbnailColor + "15" }}>
                          <Image className="h-5 w-5" style={{ color: asset.thumbnailColor }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#111111] truncate">{asset.name}</p>
                          <p className="text-xs text-[#5C4A3D] truncate">{asset.fileName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${CATEGORY_BADGE_CLASSES[asset.category]}`}>
                        {asset.category.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#5C4A3D]">{asset.fileSize}</TableCell>
                    <TableCell className="text-sm text-[#5C4A3D]">
                      {new Date(asset.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-[#F2D8BE]/30" onClick={() => handleDownloadAsset(asset)}>
                          <Download className="h-3.5 w-3.5 text-[#5C4A3D]" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-[#F2D8BE]/30" onClick={() => handleCopyUrl(asset)}>
                          <Copy className="h-3.5 w-3.5 text-[#5C4A3D]" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-red-50" onClick={() => handleDeleteAsset(asset)}>
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Bottom Page Counter */}
      {filteredMedia.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#E8DDD0]">
          <p className="text-sm text-[#5C4A3D]">
            Showing {((page - 1) * (pageSize >= 999 ? filteredMedia.length : pageSize)) + 1}–{Math.min(page * (pageSize >= 999 ? filteredMedia.length : pageSize), filteredMedia.length)} of {filteredMedia.length} files
          </p>
          <div className="flex items-center gap-3">
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
        </div>
      )}

      {/* Quick Actions inline */}
      {filteredMedia.length > 0 && (
        <div className="flex items-center justify-end">
          <div className="relative" ref={quickActionsRef}>
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <Button variant="outline" size="sm" onClick={() => setQuickActionsOpen(!quickActionsOpen)} className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2">
                <Zap className="h-4 w-4" /><span className="hidden sm:inline">Quick Actions</span><ChevronRight className={`h-3.5 w-3.5 transition-transform ${quickActionsOpen ? "rotate-90" : ""}`} />
              </Button>
            </div>
            {quickActionsOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 p-2">
                {[
                  { label: "Upload Files", icon: Upload, action: () => setUploadDialogOpen(true) },
                  { label: "Upload Book Cover", icon: FolderOpen, action: () => { setFilter("book-covers"); setUploadDialogOpen(true); } },
                  { label: "Upload Author Photo", icon: Users, action: () => { setFilter("author-photos"); setUploadDialogOpen(true); } },
                  { label: "Upload Blog Image", icon: FileText, action: () => { setFilter("blog-images"); setUploadDialogOpen(true); } },
                  { label: "Export Media Report", icon: Download, action: handleExportReport },
                ].map((action, i) => (
                  <button key={i} onClick={() => { action.action(); setQuickActionsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#1D1D1D] hover:bg-[#F2D8BE]/20 transition-colors text-left">
                    <action.icon className="h-4 w-4 text-[#8A6A4A]" />
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 8: MEDIA PREVIEW DRAWER */}
      <AnimatePresence>
        {drawerOpen && drawerAsset && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => { setDrawerOpen(false); setDrawerAsset(null); }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-[70] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 border-b border-[#E8DDD0] px-6 py-4 flex items-center justify-between">
                <h3 className="font-semibold text-[#1D1D1D]">Asset Details</h3>
                <button
                  onClick={() => { setDrawerOpen(false); setDrawerAsset(null); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-[#5C4A3D]" />
                </button>
              </div>

              {/* Preview */}
              <div
                className="w-full aspect-video flex items-center justify-center"
                style={{ backgroundColor: drawerAsset.thumbnailColor + "15" }}
              >
                <Image className="h-20 w-20" style={{ color: drawerAsset.thumbnailColor }} />
              </div>

              <div className="p-6 space-y-6">
                {/* File Info */}
                <div>
                  <h4 className="text-lg font-semibold text-[#1D1D1D] mb-1">{drawerAsset.name}</h4>
                  <p className="text-sm text-[#5C4A3D]">{drawerAsset.fileName}</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Type", value: drawerAsset.fileType.toUpperCase() },
                    { label: "Dimensions", value: drawerAsset.dimensions },
                    { label: "File Size", value: drawerAsset.fileSize },
                    { label: "Upload Date", value: new Date(drawerAsset.uploadDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                    { label: "Uploaded By", value: drawerAsset.uploadedBy },
                    { label: "Category", value: drawerAsset.category.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()) },
                    { label: "Downloads", value: String(drawerAsset.downloads) },
                  ].map((detail) => (
                    <div key={detail.label} className="flex items-center justify-between py-2 border-b border-[#E8DDD0] last:border-0">
                      <span className="text-sm text-[#5C4A3D]">{detail.label}</span>
                      <span className="text-sm font-medium text-[#1D1D1D]">{detail.value}</span>
                    </div>
                  ))}
                </div>

                {/* Used In */}
                {drawerAsset.usedIn.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-[#1D1D1D] mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-[#8A6A4A]" />
                      Used In ({drawerAsset.usedIn.length} places)
                    </h5>
                    <div className="space-y-1.5">
                      {drawerAsset.usedIn.map((usage, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#5C4A3D] bg-[#F2D8BE]/10 px-3 py-1.5 rounded-lg">
                          <ExternalLink className="h-3 w-3 text-[#8A6A4A]" />
                          {usage}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-[#8A6A4A] hover:bg-[#6A4E37] text-white"
                    onClick={() => handleDownloadAsset(drawerAsset)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="border-[#D8B27A]/30 text-[#5C4A3D] hover:bg-[#F2D8BE]/20"
                      onClick={() => handleReplace(drawerAsset)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Replace
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#D8B27A]/30 text-[#5C4A3D] hover:bg-[#F2D8BE]/20"
                      onClick={() => handleRename(drawerAsset)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Rename
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#D8B27A]/30 text-[#5C4A3D] hover:bg-[#F2D8BE]/20"
                      onClick={() => handleCopyUrl(drawerAsset)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setDrawerOpen(false);
                        setDrawerAsset(null);
                        handleDeleteAsset(drawerAsset);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SECTION 9: MEDIA ACTIVITY FEED */}
      <motion.div variants={item}>
        <Card className="shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#8A6A4A]" />
              Recent Media Activity
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-[#8A6A4A] hover:bg-[#F2D8BE]/20" onClick={() => setShowAllActivity(!showAllActivity)}>
              {showAllActivity ? "Show Less" : "View All"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {(showAllActivity ? activityLog : activityLog.slice(0, 3)).map((activity, i, arr) => (
                <div key={activity.id} className="flex items-start gap-4 py-3" style={{ borderBottom: i < arr.length - 1 ? "1px solid #E8DDD0" : "none" }}>
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1 ${activityDot(activity.action)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {activityIcon(activity.action)}
                      <span className="text-sm font-medium text-[#111111]">{activityVerb(activity.action)}</span>
                      <span className="text-sm font-medium text-[#8A6A4A] truncate">{activity.fileName}</span>
                    </div>
                    <p className="text-xs text-[#5C4A3D] mt-0.5">{activity.user} &middot; {formatTimestamp(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* SECTION 11: UPLOAD DIALOG */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-[#8A6A4A]" />
              Upload Media Files
            </DialogTitle>
            <DialogDescription>
              Drag and drop files or click to browse your computer
            </DialogDescription>
          </DialogHeader>
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
              dragActive ? "border-[#8A6A4A] bg-[#F2D8BE]/10" : "border-[#D8B27A]/30 hover:border-[#8A6A4A]/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleUploadSimulate(); }}
            onClick={handleUploadSimulate}
          >
            <UploadCloud className="h-12 w-12 text-[#D8B27A] mx-auto mb-4" />
            <p className="text-sm font-medium text-[#1D1D1D] mb-1">Drag files here or click to browse</p>
            <p className="text-xs text-[#5C4A3D]">Supported formats: JPG, PNG, WEBP, SVG, PDF</p>
          </div>
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-[#5C4A3D]">Uploading...</span>
                <span className="text-sm font-medium text-[#8A6A4A]">{Math.min(uploadProgress, 100)}%</span>
              </div>
              <div className="w-full bg-[#F2D8BE]/30 rounded-full h-2">
                <div
                  className="bg-[#8A6A4A] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)} className="border-[#D8B27A]/30">
              Cancel
            </Button>
            <Button
              onClick={handleUploadSimulate}
              disabled={uploading}
              className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SECTION 12: DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Media Asset
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone and the file will be permanently removed from the media library.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-[#D8B27A]/30">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
