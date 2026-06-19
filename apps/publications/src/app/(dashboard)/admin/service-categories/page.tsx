"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SyncedTableScroll, type SyncedTableScrollHandle } from "@/components/ui/synced-table-scroll";
import {
  Briefcase, BookOpen, Search, RefreshCw, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Eye, Edit, Trash2, CheckSquare, Square, X, Plus, Download, Upload, BarChart3,
  Activity, FileText, SlidersHorizontal, Settings, DollarSign, TrendingUp, Package, Star, Zap,
  MessageSquare, Clock, Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/lib/utils";
import { actionHistory } from "@/lib/action-history";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type FilterTab = "all" | "publishing" | "editorial" | "design" | "marketing" | "web-services";
type SortOption = "default" | "name-az" | "name-za" | "most-orders" | "least-orders" | "highest-revenue" | "lowest-revenue" | "most-popular" | "least-popular" | "featured-first" | "non-featured-first" | "recently-updated" | "oldest-updated" | "most-active" | "least-active";

interface ServiceCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  department: string;
  orderCount: number;
  revenue: number;
  createdAt: string;
  featured?: boolean;
}

interface DepartmentRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  status: "active" | "inactive";
  createdAt: string;
}

const DEPARTMENT_ICONS: Record<string, string> = {
  Publishing: "📚",
  Editorial: "✏️",
  Design: "🎨",
  Marketing: "📢",
  "Web Services": "💻",
};

const DEPARTMENT_COLORS_LIST = [
  { value: "bg-blue-50 text-blue-700 border-blue-200", label: "Blue" },
  { value: "bg-violet-50 text-violet-700 border-violet-200", label: "Violet" },
  { value: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Emerald" },
  { value: "bg-amber-50 text-amber-700 border-amber-200", label: "Amber" },
  { value: "bg-cyan-50 text-cyan-700 border-cyan-200", label: "Cyan" },
  { value: "bg-rose-50 text-rose-700 border-rose-200", label: "Rose" },
  { value: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Indigo" },
  { value: "bg-teal-50 text-teal-700 border-teal-200", label: "Teal" },
];

const DEPARTMENT_ICONS_LIST = [
  { emoji: "📚", label: "Publishing" },
  { emoji: "✏️", label: "Editorial" },
  { emoji: "🎨", label: "Design" },
  { emoji: "📢", label: "Marketing" },
  { emoji: "💻", label: "Web Services" },
  { emoji: "📈", label: "Growth" },
  { emoji: "🎬", label: "Media" },
  { emoji: "💼", label: "Consulting" },
];

const DEMO_DEPARTMENTS: DepartmentRecord[] = [
  { id: "dept-1", name: "Publishing", slug: "publishing", description: "Handles all book publishing related services.", icon: "📚", color: "bg-blue-50 text-blue-700 border-blue-200", status: "active", createdAt: "2026-01-01T10:00:00Z" },
  { id: "dept-2", name: "Editorial", slug: "editorial", description: "Editing, proofreading, and manuscript assessment services.", icon: "✏️", color: "bg-violet-50 text-violet-700 border-violet-200", status: "active", createdAt: "2026-01-01T10:00:00Z" },
  { id: "dept-3", name: "Design", slug: "design", description: "Cover design and interior layout services.", icon: "🎨", color: "bg-emerald-50 text-emerald-700 border-emerald-200", status: "active", createdAt: "2026-01-01T10:00:00Z" },
  { id: "dept-4", name: "Marketing", slug: "marketing", description: "Book promotion, Amazon marketing, and author branding.", icon: "📢", color: "bg-amber-50 text-amber-700 border-amber-200", status: "active", createdAt: "2026-01-01T10:00:00Z" },
  { id: "dept-5", name: "Web Services", slug: "web-services", description: "Author website development and landing page design.", icon: "💻", color: "bg-cyan-50 text-cyan-700 border-cyan-200", status: "active", createdAt: "2026-01-01T10:00:00Z" },
];

interface OrderHistoryRecord {
  id: string;
  customer: string;
  servicePackage: string;
  amount: number;
  status: string;
  date: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Book Publishing": "📚",
  "ISBN Registration": "🔖",
  "Book Formatting": "📄",
  "Editing": "✏️",
  "Proofreading": "🧐",
  "Manuscript Assessment": "📋",
  "Cover Design": "🎨",
  "Interior Layout Design": "📐",
  "Book Promotion": "📢",
  "Amazon Marketing": "🚀",
  "Author Branding": "🏆",
  "Author Website Development": "🌐",
};

const AVAILABLE_ICONS = [
  { emoji: "📚", label: "Publishing" },
  { emoji: "🔖", label: "ISBN" },
  { emoji: "📄", label: "Formatting" },
  { emoji: "✏️", label: "Editing" },
  { emoji: "🧐", label: "Proofreading" },
  { emoji: "📋", label: "Assessment" },
  { emoji: "🎨", label: "Design" },
  { emoji: "📐", label: "Layout" },
  { emoji: "📢", label: "Marketing" },
  { emoji: "🌐", label: "Website" },
  { emoji: "🎬", label: "Video" },
  { emoji: "📱", label: "Social Media" },
  { emoji: "💡", label: "Strategy" },
  { emoji: "🚀", label: "Promotion" },
  { emoji: "🏆", label: "Branding" },
  { emoji: "📊", label: "Analytics" },
  { emoji: "💼", label: "Consulting" },
  { emoji: "🎯", label: "Advertising" },
  { emoji: "🖥️", label: "Technology" },
  { emoji: "📈", label: "Growth" },
];

const CATEGORY_ORDER_HISTORY: Record<string, OrderHistoryRecord[]> = {
  "Book Publishing": [
    { id: "#2026-0067", customer: "Grace Okonkwo", servicePackage: "Full Publishing Package", amount: 1200, status: "Completed", date: "2026-06-18" },
    { id: "#2026-0062", customer: "Michael Torres", servicePackage: "Premium Publishing", amount: 850, status: "In Progress", date: "2026-06-15" },
    { id: "#2026-0058", customer: "Sarah Chen", servicePackage: "Complete Publishing Suite", amount: 1500, status: "Completed", date: "2026-06-12" },
    { id: "#2026-0053", customer: "James Wilson", servicePackage: "Basic Publishing", amount: 600, status: "Pending", date: "2026-06-10" },
    { id: "#2026-0048", customer: "Catherine Wong", servicePackage: "Full Publishing Package", amount: 1100, status: "Completed", date: "2026-06-08" },
    { id: "#2026-0042", customer: "David Chen", servicePackage: "Standard Publishing", amount: 750, status: "Completed", date: "2026-06-05" },
    { id: "#2026-0037", customer: "Alex Johnson", servicePackage: "Premium Publishing", amount: 950, status: "Completed", date: "2026-06-02" },
    { id: "#2026-0031", customer: "Lisa Park", servicePackage: "Basic Publishing", amount: 500, status: "Completed", date: "2026-05-28" },
    { id: "#2026-0025", customer: "Pastor David Brown", servicePackage: "Full Publishing Package", amount: 1300, status: "Completed", date: "2026-05-22" },
    { id: "#2026-0019", customer: "Emma Davis", servicePackage: "Standard Publishing", amount: 700, status: "Completed", date: "2026-05-15" },
  ],
  "ISBN Registration": [
    { id: "#2026-0065", customer: "David Chen", servicePackage: "ISBN + Barcode Bundle", amount: 100, status: "Completed", date: "2026-06-17" },
    { id: "#2026-0059", customer: "Emma Davis", servicePackage: "Single ISBN", amount: 50, status: "Completed", date: "2026-06-13" },
    { id: "#2026-0054", customer: "Robert Kim", servicePackage: "ISBN + Barcode Bundle", amount: 100, status: "In Progress", date: "2026-06-10" },
    { id: "#2026-0047", customer: "Ryan Carter", servicePackage: "Bulk ISBN (3)", amount: 250, status: "Completed", date: "2026-06-06" },
    { id: "#2026-0041", customer: "Grace Okonkwo", servicePackage: "ISBN + Barcode Bundle", amount: 100, status: "Completed", date: "2026-06-03" },
    { id: "#2026-0035", customer: "Mark Thompson", servicePackage: "Single ISBN", amount: 50, status: "Completed", date: "2026-05-30" },
    { id: "#2026-0028", customer: "Sarah Chen", servicePackage: "ISBN + Barcode Bundle", amount: 100, status: "Completed", date: "2026-05-24" },
    { id: "#2026-0021", customer: "Alex Johnson", servicePackage: "Bulk ISBN (5)", amount: 400, status: "Completed", date: "2026-05-18" },
  ],
  "Book Formatting": [
    { id: "#2026-0063", customer: "Alex Johnson", servicePackage: "Interior Layout Premium", amount: 450, status: "In Progress", date: "2026-06-16" },
    { id: "#2026-0057", customer: "Lisa Park", servicePackage: "E-book Formatting", amount: 200, status: "Completed", date: "2026-06-12" },
    { id: "#2026-0051", customer: "Catherine Wong", servicePackage: "Print Formatting", amount: 350, status: "Completed", date: "2026-06-08" },
    { id: "#2026-0045", customer: "Dr. Alan Cooper", servicePackage: "Interior Layout Premium", amount: 450, status: "Completed", date: "2026-06-04" },
    { id: "#2026-0039", customer: "Kevin Adams", servicePackage: "Full Formatting Package", amount: 600, status: "Completed", date: "2026-05-31" },
    { id: "#2026-0033", customer: "Maria Santos", servicePackage: "E-book Formatting", amount: 200, status: "Completed", date: "2026-05-26" },
    { id: "#2026-0027", customer: "Tom Harris", servicePackage: "Print Formatting", amount: 300, status: "Completed", date: "2026-05-20" },
    { id: "#2026-0020", customer: "Claire Mitchell", servicePackage: "Interior Layout Premium", amount: 400, status: "Completed", date: "2026-05-14" },
    { id: "#2026-0014", customer: "Daniel Ross", servicePackage: "Full Formatting Package", amount: 550, status: "Completed", date: "2026-05-08" },
  ],
  "Editing": [
    { id: "#2026-0064", customer: "Pastor David Brown", servicePackage: "Comprehensive Edit Package", amount: 500, status: "Completed", date: "2026-06-17" },
    { id: "#2026-0056", customer: "Sandra Lee", servicePackage: "Developmental Edit", amount: 650, status: "In Progress", date: "2026-06-11" },
    { id: "#2026-0050", customer: "Peter Grant", servicePackage: "Copy Editing", amount: 350, status: "Completed", date: "2026-06-07" },
    { id: "#2026-0044", customer: "Dr. Rachel Green", servicePackage: "Comprehensive Edit Package", amount: 500, status: "Completed", date: "2026-06-03" },
    { id: "#2026-0038", customer: "George Edwards", servicePackage: "Line Editing", amount: 400, status: "Completed", date: "2026-05-29" },
    { id: "#2026-0032", customer: "Dr. Neil Foster", servicePackage: "Comprehensive Edit Package", amount: 480, status: "Completed", date: "2026-05-23" },
    { id: "#2026-0026", customer: "Joe Lewis", servicePackage: "Copy Editing", amount: 320, status: "Completed", date: "2026-05-17" },
    { id: "#2026-0018", customer: "Dr. Carol White", servicePackage: "Developmental Edit", amount: 600, status: "Completed", date: "2026-05-11" },
  ],
  "Proofreading": [
    { id: "#2026-0061", customer: "Mark Thompson", servicePackage: "Final Proofread Standard", amount: 200, status: "Completed", date: "2026-06-14" },
    { id: "#2026-0055", customer: "Tom Harris", servicePackage: "Final Proofread Premium", amount: 350, status: "Completed", date: "2026-06-10" },
    { id: "#2026-0049", customer: "Brian Miller", servicePackage: "Final Proofread Standard", amount: 200, status: "Completed", date: "2026-06-06" },
    { id: "#2026-0043", customer: "Lisa Park", servicePackage: "Final Proofread Premium", amount: 300, status: "Completed", date: "2026-06-02" },
    { id: "#2026-0036", customer: "Catherine Wong", servicePackage: "Final Proofread Standard", amount: 200, status: "Completed", date: "2026-05-28" },
    { id: "#2026-0029", customer: "Alex Johnson", servicePackage: "Final Proofread Standard", amount: 180, status: "Completed", date: "2026-05-22" },
    { id: "#2026-0022", customer: "Grace Okonkwo", servicePackage: "Final Proofread Premium", amount: 320, status: "Completed", date: "2026-05-16" },
  ],
  "Manuscript Assessment": [
    { id: "#2026-0060", customer: "Dr. Alan Cooper", servicePackage: "Full Manuscript Review", amount: 450, status: "In Progress", date: "2026-06-13" },
    { id: "#2026-0052", customer: "George Edwards", servicePackage: "Manuscript Evaluation", amount: 350, status: "Completed", date: "2026-06-09" },
    { id: "#2026-0046", customer: "Daniel Ross", servicePackage: "Full Manuscript Review", amount: 500, status: "Completed", date: "2026-06-05" },
    { id: "#2026-0040", customer: "Dr. Karen Hughes", servicePackage: "Quick Assessment", amount: 200, status: "Completed", date: "2026-06-01" },
    { id: "#2026-0034", customer: "Dr. Nina Patel", servicePackage: "Manuscript Evaluation", amount: 380, status: "Completed", date: "2026-05-27" },
    { id: "#2026-0023", customer: "James Wilson", servicePackage: "Full Manuscript Review", amount: 420, status: "Completed", date: "2026-05-19" },
  ],
  "Cover Design": [
    { id: "#2026-0066", customer: "Grace Okonkwo", servicePackage: "Premium Cover Package", amount: 500, status: "In Progress", date: "2026-06-18" },
    { id: "#2026-0060b", customer: "Claire Mitchell", servicePackage: "Standard Cover Design", amount: 350, status: "Completed", date: "2026-06-13" },
    { id: "#2026-0054b", customer: "Maria Santos", servicePackage: "E-book Cover Only", amount: 150, status: "Completed", date: "2026-06-09" },
    { id: "#2026-0048b", customer: "Sarah Chen", servicePackage: "Premium Cover Package", amount: 500, status: "Completed", date: "2026-06-05" },
    { id: "#2026-0042b", customer: "Kevin Adams", servicePackage: "Standard Cover Design", amount: 300, status: "Completed", date: "2026-06-01" },
    { id: "#2026-0036b", customer: "Dr. Rachel Green", servicePackage: "Premium Cover Package", amount: 480, status: "Completed", date: "2026-05-27" },
    { id: "#2026-0030", customer: "Michael Torres", servicePackage: "E-book Cover Only", amount: 150, status: "Completed", date: "2026-05-21" },
    { id: "#2026-0024", customer: "Emma Davis", servicePackage: "Standard Cover Design", amount: 320, status: "Completed", date: "2026-05-15" },
  ],
  "Interior Layout Design": [
    { id: "#2026-0062b", customer: "Kevin Adams", servicePackage: "Typography & Layout Pro", amount: 400, status: "Completed", date: "2026-06-15" },
    { id: "#2026-0056b", customer: "Dr. Carol White", servicePackage: "Interior Layout Standard", amount: 300, status: "In Progress", date: "2026-06-11" },
    { id: "#2026-0050b", customer: "Dr. Nina Patel", servicePackage: "Typography & Layout Pro", amount: 420, status: "Completed", date: "2026-06-07" },
    { id: "#2026-0044b", customer: "Alex Johnson", servicePackage: "Interior Layout Standard", amount: 280, status: "Completed", date: "2026-06-03" },
    { id: "#2026-0038b", customer: "Lisa Park", servicePackage: "Typography & Layout Pro", amount: 380, status: "Completed", date: "2026-05-29" },
    { id: "#2026-0032b", customer: "Pastor David Brown", servicePackage: "Interior Layout Standard", amount: 300, status: "Completed", date: "2026-05-23" },
    { id: "#2026-0026b", customer: "Sandra Lee", servicePackage: "Typography & Layout Pro", amount: 400, status: "Completed", date: "2026-05-17" },
  ],
  "Book Promotion": [
    { id: "#2026-0064b", customer: "Ryan Carter", servicePackage: "Social Media Campaign", amount: 600, status: "In Progress", date: "2026-06-16" },
    { id: "#2026-0058b", customer: "Dr. Neil Foster", servicePackage: "Book Launch Campaign", amount: 800, status: "Completed", date: "2026-06-11" },
    { id: "#2026-0052b", customer: "Sarah Chen", servicePackage: "Social Media Campaign", amount: 550, status: "Completed", date: "2026-06-07" },
    { id: "#2026-0046b", customer: "Grace Okonkwo", servicePackage: "Promotional Package", amount: 450, status: "Completed", date: "2026-06-03" },
    { id: "#2026-0040b", customer: "David Chen", servicePackage: "Book Launch Campaign", amount: 750, status: "Completed", date: "2026-05-29" },
    { id: "#2026-0034b", customer: "James Wilson", servicePackage: "Social Media Campaign", amount: 500, status: "Completed", date: "2026-05-23" },
    { id: "#2026-0028b", customer: "Michael Torres", servicePackage: "Promotional Package", amount: 400, status: "Completed", date: "2026-05-17" },
  ],
  "Amazon Marketing": [
    { id: "#2026-0059b", customer: "Daniel Ross", servicePackage: "Amazon Listing Optimization", amount: 450, status: "Completed", date: "2026-06-12" },
    { id: "#2026-0053b", customer: "Joe Lewis", servicePackage: "Amazon Ads Management", amount: 600, status: "Completed", date: "2026-06-08" },
    { id: "#2026-0047b", customer: "Dr. Alan Cooper", servicePackage: "Amazon Listing Optimization", amount: 400, status: "Completed", date: "2026-06-04" },
    { id: "#2026-0041b", customer: "Tom Harris", servicePackage: "Amazon Ads Management", amount: 550, status: "Completed", date: "2026-05-30" },
    { id: "#2026-0035b", customer: "Emma Davis", servicePackage: "Amazon Listing Optimization", amount: 380, status: "Completed", date: "2026-05-24" },
  ],
  "Author Branding": [
    { id: "#2026-0057b", customer: "Dr. Rachel Green", servicePackage: "Brand Identity Package", amount: 500, status: "Completed", date: "2026-06-11" },
    { id: "#2026-0051b", customer: "Dr. Karen Hughes", servicePackage: "Author Bio & Branding", amount: 300, status: "Completed", date: "2026-06-07" },
    { id: "#2026-0045b", customer: "Pastor David Brown", servicePackage: "Brand Identity Package", amount: 480, status: "Completed", date: "2026-06-03" },
    { id: "#2026-0039b", customer: "Dr. Neil Foster", servicePackage: "Author Bio & Branding", amount: 280, status: "Completed", date: "2026-05-29" },
    { id: "#2026-0033b", customer: "Claire Mitchell", servicePackage: "Brand Identity Package", amount: 500, status: "Completed", date: "2026-05-23" },
  ],
  "Author Website Development": [
    { id: "#2026-0055b", customer: "Dr. Nina Patel", servicePackage: "Custom Author Website", amount: 1200, status: "In Progress", date: "2026-06-10" },
    { id: "#2026-0049b", customer: "Emma Davis", servicePackage: "Author Website Starter", amount: 600, status: "Completed", date: "2026-06-06" },
    { id: "#2026-0043b", customer: "Grace Okonkwo", servicePackage: "Custom Author Website", amount: 1100, status: "Completed", date: "2026-06-02" },
    { id: "#2026-0037b", customer: "Ryan Carter", servicePackage: "Author Website Starter", amount: 580, status: "Completed", date: "2026-05-28" },
    { id: "#2026-0031b", customer: "Sarah Chen", servicePackage: "Custom Author Website", amount: 1250, status: "Completed", date: "2026-05-22" },
  ],
};

const DEMO_SERVICE_CATEGORIES: ServiceCategoryRecord[] = [
  { id: "sc-1", name: "Book Publishing", slug: "book-publishing", description: "Full publishing services", department: "Publishing", orderCount: 67, revenue: 28400, createdAt: "2026-01-05T10:00:00Z", featured: true },
  { id: "sc-2", name: "ISBN Registration", slug: "isbn-registration", description: "ISBN assignment and barcode registration", department: "Publishing", orderCount: 45, revenue: 4500, createdAt: "2026-01-08T10:00:00Z" },
  { id: "sc-3", name: "Book Formatting", slug: "book-formatting", description: "Interior layout and formatting", department: "Publishing", orderCount: 52, revenue: 15600, createdAt: "2026-01-10T10:00:00Z" },
  { id: "sc-4", name: "Editing", slug: "editing", description: "Comprehensive editing and revision", department: "Editorial", orderCount: 48, revenue: 17400, createdAt: "2026-01-12T10:00:00Z", featured: true },
  { id: "sc-5", name: "Proofreading", slug: "proofreading", description: "Final proofreading and error correction", department: "Editorial", orderCount: 38, revenue: 7600, createdAt: "2026-01-15T10:00:00Z" },
  { id: "sc-6", name: "Manuscript Assessment", slug: "manuscript-assessment", description: "Manuscript evaluation and feedback", department: "Editorial", orderCount: 22, revenue: 8800, createdAt: "2026-01-18T10:00:00Z" },
  { id: "sc-7", name: "Cover Design", slug: "cover-design", description: "Professional book cover design", department: "Design", orderCount: 36, revenue: 12800, createdAt: "2026-01-20T10:00:00Z", featured: true },
  { id: "sc-8", name: "Interior Layout Design", slug: "interior-layout-design", description: "Interior page layout and typography", department: "Design", orderCount: 28, revenue: 9800, createdAt: "2026-02-01T10:00:00Z" },
  { id: "sc-9", name: "Book Promotion", slug: "book-promotion", description: "Marketing and promotional campaigns", department: "Marketing", orderCount: 29, revenue: 11600, createdAt: "2026-02-05T10:00:00Z" },
  { id: "sc-10", name: "Amazon Marketing", slug: "amazon-marketing", description: "Amazon listing optimization and ads", department: "Marketing", orderCount: 18, revenue: 7200, createdAt: "2026-02-10T10:00:00Z" },
  { id: "sc-11", name: "Author Branding", slug: "author-branding", description: "Personal brand development for authors", department: "Marketing", orderCount: 15, revenue: 6000, createdAt: "2026-02-15T10:00:00Z" },
  { id: "sc-12", name: "Author Website Development", slug: "author-website-development", description: "Custom website development", department: "Web Services", orderCount: 12, revenue: 9600, createdAt: "2026-02-20T10:00:00Z" },
];

const DEPARTMENT_COLORS: Record<string, string> = {
  Publishing: "bg-blue-50 text-blue-700 border-blue-200",
  Editorial: "bg-violet-50 text-violet-700 border-violet-200",
  Design: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Marketing: "bg-amber-50 text-amber-700 border-amber-200",
  "Web Services": "bg-cyan-50 text-cyan-700 border-cyan-200",
};

interface CategoryPerformance {
  topSellingService: string;
  monthlyGrowth: number;
  avgOrderValue: number;
  recentOrders: { id: string; customer: string; amount: number; date: string; status: string }[];
  topCustomers: { name: string; orders: number; spent: number }[];
}

type HealthLevel = "Excellent" | "Good" | "Average" | "Needs Attention";

function calculateHealthScore(orderCount: number, revenue: number, growth: number): { score: number; level: HealthLevel; color: string; bgColor: string } {
  const orderScore = Math.min((orderCount / 60) * 100, 100);
  const revenueScore = Math.min((revenue / 25000) * 100, 100);
  const growthScore = Math.min((growth / 15) * 100, 100);
  const demandScore = Math.min((orderCount / 50) * 100, 100);
  const score = Math.round(orderScore * 0.3 + revenueScore * 0.3 + growthScore * 0.2 + demandScore * 0.2);
  if (score >= 80) return { score, level: "Excellent", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" };
  if (score >= 60) return { score, level: "Good", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" };
  if (score >= 40) return { score, level: "Average", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" };
  return { score, level: "Needs Attention", color: "text-rose-700", bgColor: "bg-rose-50 border-rose-200" };
}

const CATEGORY_PERFORMANCE: Record<string, CategoryPerformance> = {
  "Book Publishing": {
    topSellingService: "Full Publishing Package",
    monthlyGrowth: 12.4,
    avgOrderValue: 424,
    recentOrders: [
      { id: "SO-1847", customer: "Grace Okonkwo", amount: 1200, date: "2026-06-14", status: "Completed" },
      { id: "SO-1832", customer: "Michael Torres", amount: 850, date: "2026-06-12", status: "In Progress" },
      { id: "SO-1819", customer: "Sarah Chen", amount: 1500, date: "2026-06-10", status: "Completed" },
      { id: "SO-1805", customer: "James Wilson", amount: 600, date: "2026-06-08", status: "Pending" },
    ],
    topCustomers: [
      { name: "Grace Okonkwo", orders: 8, spent: 9600 },
      { name: "Sarah Chen", orders: 6, spent: 7200 },
      { name: "Michael Torres", orders: 5, spent: 5500 },
    ],
  },
  "ISBN Registration": {
    topSellingService: "ISBN + Barcode Bundle",
    monthlyGrowth: 8.2,
    avgOrderValue: 100,
    recentOrders: [
      { id: "SO-1844", customer: "David Chen", amount: 100, date: "2026-06-13", status: "Completed" },
      { id: "SO-1830", customer: "Emma Davis", amount: 100, date: "2026-06-11", status: "Completed" },
      { id: "SO-1818", customer: "Robert Kim", amount: 150, date: "2026-06-09", status: "In Progress" },
    ],
    topCustomers: [
      { name: "David Chen", orders: 4, spent: 400 },
      { name: "Emma Davis", orders: 3, spent: 300 },
      { name: "Ryan Carter", orders: 3, spent: 350 },
    ],
  },
  "Book Formatting": {
    topSellingService: "Interior Layout Premium",
    monthlyGrowth: 15.6,
    avgOrderValue: 300,
    recentOrders: [
      { id: "SO-1841", customer: "Alex Johnson", amount: 450, date: "2026-06-14", status: "In Progress" },
      { id: "SO-1828", customer: "Lisa Park", amount: 300, date: "2026-06-12", status: "Completed" },
      { id: "SO-1815", customer: "Catherine Wong", amount: 250, date: "2026-06-09", status: "Completed" },
    ],
    topCustomers: [
      { name: "Alex Johnson", orders: 7, spent: 3150 },
      { name: "Lisa Park", orders: 5, spent: 1500 },
      { name: "Catherine Wong", orders: 4, spent: 1000 },
    ],
  },
  "Editing": {
    topSellingService: "Comprehensive Edit Package",
    monthlyGrowth: 10.8,
    avgOrderValue: 363,
    recentOrders: [
      { id: "SO-1839", customer: "Pastor David Brown", amount: 500, date: "2026-06-13", status: "Completed" },
      { id: "SO-1826", customer: "Sandra Lee", amount: 350, date: "2026-06-11", status: "In Progress" },
      { id: "SO-1813", customer: "Peter Grant", amount: 400, date: "2026-06-08", status: "Completed" },
    ],
    topCustomers: [
      { name: "Pastor David Brown", orders: 6, spent: 3000 },
      { name: "Sandra Lee", orders: 5, spent: 1750 },
      { name: "Peter Grant", orders: 4, spent: 1600 },
    ],
  },
  "Proofreading": {
    topSellingService: "Final Proofread Standard",
    monthlyGrowth: 6.3,
    avgOrderValue: 200,
    recentOrders: [
      { id: "SO-1837", customer: "Mark Thompson", amount: 200, date: "2026-06-12", status: "Completed" },
      { id: "SO-1824", customer: "Tom Harris", amount: 250, date: "2026-06-10", status: "Completed" },
    ],
    topCustomers: [
      { name: "Mark Thompson", orders: 5, spent: 1000 },
      { name: "Tom Harris", orders: 4, spent: 800 },
      { name: "Brian Miller", orders: 3, spent: 600 },
    ],
  },
  "Manuscript Assessment": {
    topSellingService: "Full Manuscript Review",
    monthlyGrowth: 9.1,
    avgOrderValue: 400,
    recentOrders: [
      { id: "SO-1835", customer: "Dr. Alan Cooper", amount: 450, date: "2026-06-11", status: "In Progress" },
      { id: "SO-1822", customer: "George Edwards", amount: 350, date: "2026-06-09", status: "Completed" },
    ],
    topCustomers: [
      { name: "Dr. Alan Cooper", orders: 3, spent: 1350 },
      { name: "George Edwards", orders: 2, spent: 700 },
      { name: "Daniel Ross", orders: 2, spent: 800 },
    ],
  },
  "Cover Design": {
    topSellingService: "Premium Cover Package",
    monthlyGrowth: 14.2,
    avgOrderValue: 356,
    recentOrders: [
      { id: "SO-1843", customer: "Grace Okonkwo", amount: 500, date: "2026-06-14", status: "In Progress" },
      { id: "SO-1829", customer: "Claire Mitchell", amount: 350, date: "2026-06-11", status: "Completed" },
      { id: "SO-1816", customer: "Maria Santos", amount: 300, date: "2026-06-09", status: "Completed" },
    ],
    topCustomers: [
      { name: "Grace Okonkwo", orders: 5, spent: 2500 },
      { name: "Claire Mitchell", orders: 4, spent: 1400 },
      { name: "Maria Santos", orders: 3, spent: 900 },
    ],
  },
  "Interior Layout Design": {
    topSellingService: "Typography & Layout Pro",
    monthlyGrowth: 7.8,
    avgOrderValue: 350,
    recentOrders: [
      { id: "SO-1840", customer: "Kevin Adams", amount: 400, date: "2026-06-13", status: "Completed" },
      { id: "SO-1827", customer: "Dr. Carol White", amount: 300, date: "2026-06-11", status: "In Progress" },
    ],
    topCustomers: [
      { name: "Kevin Adams", orders: 4, spent: 1600 },
      { name: "Dr. Carol White", orders: 3, spent: 900 },
      { name: "Dr. Nina Patel", orders: 3, spent: 1050 },
    ],
  },
  "Book Promotion": {
    topSellingService: "Social Media Campaign",
    monthlyGrowth: 11.5,
    avgOrderValue: 400,
    recentOrders: [
      { id: "SO-1842", customer: "Ryan Carter", amount: 600, date: "2026-06-14", status: "In Progress" },
      { id: "SO-1825", customer: "Dr. Neil Foster", amount: 400, date: "2026-06-11", status: "Completed" },
    ],
    topCustomers: [
      { name: "Ryan Carter", orders: 5, spent: 3000 },
      { name: "Dr. Neil Foster", orders: 4, spent: 1600 },
      { name: "Sarah Chen", orders: 3, spent: 1200 },
    ],
  },
  "Amazon Marketing": {
    topSellingService: "Amazon Listing Optimization",
    monthlyGrowth: 5.9,
    avgOrderValue: 400,
    recentOrders: [
      { id: "SO-1836", customer: "Daniel Ross", amount: 450, date: "2026-06-12", status: "Completed" },
    ],
    topCustomers: [
      { name: "Daniel Ross", orders: 3, spent: 1350 },
      { name: "Joe Lewis", orders: 2, spent: 800 },
    ],
  },
  "Author Branding": {
    topSellingService: "Brand Identity Package",
    monthlyGrowth: 4.7,
    avgOrderValue: 400,
    recentOrders: [
      { id: "SO-1834", customer: "Dr. Rachel Green", amount: 500, date: "2026-06-11", status: "Completed" },
    ],
    topCustomers: [
      { name: "Dr. Rachel Green", orders: 2, spent: 1000 },
      { name: "Dr. Karen Hughes", orders: 2, spent: 800 },
    ],
  },
  "Author Website Development": {
    topSellingService: "Custom Author Website",
    monthlyGrowth: 3.2,
    avgOrderValue: 800,
    recentOrders: [
      { id: "SO-1833", customer: "Dr. Nina Patel", amount: 1200, date: "2026-06-10", status: "In Progress" },
    ],
    topCustomers: [
      { name: "Dr. Nina Patel", orders: 2, spent: 2400 },
      { name: "Emma Davis", orders: 1, spent: 800 },
    ],
  },
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "name-az", label: "Name A-Z" },
  { value: "name-za", label: "Name Z-A" },
  { value: "most-orders", label: "Most Orders" },
  { value: "least-orders", label: "Least Orders" },
  { value: "highest-revenue", label: "Highest Revenue" },
  { value: "lowest-revenue", label: "Lowest Revenue" },
  { value: "most-popular", label: "Most Popular" },
  { value: "least-popular", label: "Least Popular" },
  { value: "featured-first", label: "Featured First" },
  { value: "non-featured-first", label: "Non-Featured First" },
  { value: "recently-updated", label: "Recently Updated" },
  { value: "oldest-updated", label: "Oldest Updated" },
  { value: "most-active", label: "Most Active Category" },
  { value: "least-active", label: "Least Active Category" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const SYNCHRONIZED_ORDERS = 217;

const STAT_CARD_MAP: Record<string, FilterTab> = {
  "Total Service Categories": "all",
  "Service Orders": "all",
  "Service Packages": "all",
  "Total Revenue": "all",
  "Avg Order Value": "all",
  "Most Popular": "all",
};

export default function AdminServiceCategoriesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allCategories, setAllCategories] = useState<ServiceCategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const [drawerCategory, setDrawerCategory] = useState<ServiceCategoryRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ServiceCategoryRecord | null>(null);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [editName, setEditName] = useState("");
  const [editDepartment, setEditDepartment] = useState("Publishing");
  const [editDescription, setEditDescription] = useState("");
  const [editIcon, setEditIcon] = useState("📚");

  // Delete confirmation state (replaces old deleteDialogOpen/deleteTarget/deleteTargetName)

  const [previewCategory, setPreviewCategory] = useState<ServiceCategoryRecord | null>(null);

  const stickyRef = useRef<HTMLDivElement>(null);
  const tableScroll = useRef<SyncedTableScrollHandle>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [sortFilter, setSortFilter] = useState({ department: "" });
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const [categoryIcons, setCategoryIcons] = useState<Record<string, string>>(() => {
    return { ...CATEGORY_ICONS };
  });

  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [orderHistoryCategory, setOrderHistoryCategory] = useState<ServiceCategoryRecord | null>(null);

  const [categoryNotes, setCategoryNotes] = useState<Record<string, { internalNotes: string; managementRemarks: string; lastUpdatedBy: string; lastUpdatedDate: string }>>({});
  const [noteEditing, setNoteEditing] = useState(false);
  const [noteDraftInternal, setNoteDraftInternal] = useState("");
  const [noteDraftRemarks, setNoteDraftRemarks] = useState("");

  // Import state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFileName, setImportFileName] = useState("");
  const [importPreview, setImportPreview] = useState<{ total: number; newCount: number; existingCount: number; records: (ServiceCategoryRecord & { isDuplicate?: boolean })[] } | null>(null);
  const [importDuplicateHandling, setImportDuplicateHandling] = useState<"skip" | "replace">("skip");
  const [importProcessing, setImportProcessing] = useState(false);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notification state
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id: string; name: string } | null>(null);

  // Department state
  const [allDepartments, setAllDepartments] = useState<DepartmentRecord[]>(DEMO_DEPARTMENTS);
  const [deptDrawerOpen, setDeptDrawerOpen] = useState(false);
  const [deptEditMode, setDeptEditMode] = useState<"add" | "edit">("add");
  const [deptEditTarget, setDeptEditTarget] = useState<DepartmentRecord | null>(null);
  const [deptEditName, setDeptEditName] = useState("");
  const [deptEditDescription, setDeptEditDescription] = useState("");
  const [deptEditIcon, setDeptEditIcon] = useState("📚");
  const [deptEditColor, setDeptEditColor] = useState("bg-blue-50 text-blue-700 border-blue-200");
  const [deptDeleteOpen, setDeptDeleteOpen] = useState(false);
  const [deptDeleteTarget, setDeptDeleteTarget] = useState<DepartmentRecord | null>(null);
  const [deptMoveTarget, setDeptMoveTarget] = useState("");
  const [deptDeleteMode, setDeptDeleteMode] = useState<"move" | "delete">("delete");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSortFilterOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) {
        setQuickActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Global Undo/Redo listeners
  useEffect(() => {
    const handleUndo = (e: CustomEvent) => {
      const action = e.detail;
      if (action.entity === "service_category" && action.previousState) {
        setAllCategories(action.previousState);
      }
      if (action.entity === "department" && action.previousState) {
        setAllDepartments(action.previousState);
      }
    };
    const handleRedo = (e: CustomEvent) => {
      const action = e.detail;
      if (action.entity === "service_category" && action.newState) {
        setAllCategories(action.newState);
      }
      if (action.entity === "department" && action.newState) {
        setAllDepartments(action.newState);
      }
    };
    window.addEventListener("action-undo", handleUndo as EventListener);
    window.addEventListener("action-redo", handleRedo as EventListener);
    return () => {
      window.removeEventListener("action-undo", handleUndo as EventListener);
      window.removeEventListener("action-redo", handleRedo as EventListener);
    };
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const hasActiveFilter = !!sortFilter.department || sortOption !== "default";

  const activeFilterLabel = useMemo(() => {
    if (sortOption !== "default") return SORT_OPTIONS.find((o) => o.value === sortOption)?.label ?? "Sort & Filter";
    if (sortFilter.department) return sortFilter.department;
    return "Sort & Filter";
  }, [sortFilter, sortOption]);

  const departmentNames = useMemo(() => allDepartments.filter((d) => d.status === "active").map((d) => d.name), [allDepartments]);

  const clearSortFilter = () => {
    setSortFilter({ department: "" });
    setSortOption("default");
    setActiveTab("all");
  };

  const getIcon = (catName: string) => categoryIcons[catName] || CATEGORY_ICONS[catName] || "💼";

  const fetchCategories = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/admin/service-categories");
      const data = await res.json();
      if (data.success && data.data) {
        setAllCategories(data.data);
      }
    } catch {
      console.error("Failed to fetch service categories");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    setAllCategories(DEMO_SERVICE_CATEGORIES);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [activeTab, debouncedSearch, pageSize, sortFilter, sortOption]);

  const stats = useMemo(() => {
    const total = allCategories.length;
    const departments = new Set(allCategories.map((c) => c.department)).size;
    const orders = SYNCHRONIZED_ORDERS;
    const totalRevenue = allCategories.reduce((sum, c) => sum + c.revenue, 0);
    const avgOrderValue = orders > 0 ? Math.round(totalRevenue / orders) : 0;
    return { total, departments, orders, avgOrderValue };
  }, [allCategories]);

  const filteredCategories = useMemo(() => {
    let result = [...allCategories];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
      );
    }

    if (sortFilter.department) {
      result = result.filter((c) => c.department === sortFilter.department);
    }

    switch (activeTab) {
      case "all": break;
      default: {
        const deptName = departmentNames.find((d) => d.toLowerCase().replace(/\s+/g, "-") === activeTab);
        if (deptName) result = result.filter((c) => c.department === deptName);
        break;
      }
    }

    switch (sortOption) {
      case "name-az": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-za": result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "most-orders": result.sort((a, b) => b.orderCount - a.orderCount); break;
      case "least-orders": result.sort((a, b) => a.orderCount - b.orderCount); break;
      case "highest-revenue": result.sort((a, b) => b.revenue - a.revenue); break;
      case "lowest-revenue": result.sort((a, b) => a.revenue - b.revenue); break;
      case "most-popular": result.sort((a, b) => b.orderCount - a.orderCount); break;
      case "least-popular": result.sort((a, b) => a.orderCount - b.orderCount); break;
      case "featured-first": result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
      case "non-featured-first": result.sort((a, b) => (a.featured ? 1 : 0) - (b.featured ? 1 : 0)); break;
      case "recently-updated": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "oldest-updated": result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "most-active": result.sort((a, b) => b.orderCount - a.orderCount); break;
      case "least-active": result.sort((a, b) => a.orderCount - b.orderCount); break;
    }

    return result;
  }, [allCategories, debouncedSearch, sortFilter, activeTab, sortOption, departmentNames]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));

  const displayedCategories = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, page, pageSize]);

  const allSelected = displayedCategories.length > 0 && displayedCategories.every((c) => selectedIds.has(c.id));
  const someSelected = displayedCategories.some((c) => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(displayedCategories.map((c) => c.id)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateCategoryLocal = (catId: string, updates: Partial<ServiceCategoryRecord>) => {
    setAllCategories((prev) => prev.map((c) => c.id === catId ? { ...c, ...updates } : c));
    setPreviewCategory((prev) => prev && prev.id === catId ? { ...prev, ...updates } : prev);
    setDrawerCategory((prev) => prev && prev.id === catId ? { ...prev, ...updates } : prev);
  };

  const openDrawer = (cat: ServiceCategoryRecord) => {
    setDrawerCategory(cat);
    setDrawerOpen(true);
    setNoteEditing(false);
  };

  const openOrderHistory = (cat: ServiceCategoryRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOrderHistoryCategory(cat);
    setOrderHistoryOpen(true);
  };

  const handleDelete = async (catId: string) => {
    const cat = allCategories.find((c) => c.id === catId);
    if (!cat) return;
    setDeleteConfirmTarget({ id: catId, name: cat.name });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmTarget) return;
    const cat = allCategories.find((c) => c.id === deleteConfirmTarget.id);
    const previousState = [...allCategories];

    actionHistory.pushAction({
      action: "delete",
      entity: "service_category",
      entityName: deleteConfirmTarget.name,
      description: `Deleted service category "${deleteConfirmTarget.name}"`,
      previousState,
      newState: allCategories.filter((c) => c.id !== deleteConfirmTarget.id),
    });

    setAllCategories((prev) => prev.filter((c) => c.id !== deleteConfirmTarget.id));
    setDeleteConfirmOpen(false);
    setDeleteConfirmTarget(null);
    showNotification("success", `Category "${deleteConfirmTarget.name}" deleted`);

    try {
      await fetch("/api/admin/service-categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: deleteConfirmTarget.id }),
      });
    } catch { console.error("Delete failed"); }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);

    if (action === "bulkDelete") {
      setAllCategories((prev) => prev.filter((c) => !ids.includes(c.id)));
    }

    setSelectedIds(new Set());
    try {
      await fetch("/api/admin/service-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, categoryIds: ids }),
      });
    } catch { console.error("Bulk action failed"); }
  };

  const openEditModal = (cat?: ServiceCategoryRecord) => {
    if (cat) {
      setEditMode("edit");
      setEditTarget(cat);
      setEditName(cat.name);
      setEditDepartment(cat.department);
      setEditDescription(cat.description);
      setEditIcon(getIcon(cat.name));
    } else {
      setEditMode("add");
      setEditTarget(null);
      setEditName("");
      setEditDepartment("Publishing");
      setEditDescription("");
      setEditIcon("💼");
    }
    setEditModalOpen(true);
  };

  const handleSaveCategory = async () => {
    const slug = editName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const previousState = [...allCategories];

    if (editMode === "add") {
      const newCat: ServiceCategoryRecord = {
        id: `sc-${Date.now()}`,
        name: editName,
        slug,
        description: editDescription,
        department: editDepartment,
        orderCount: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
      };
      setAllCategories((prev) => [newCat, ...prev]);
      setCategoryIcons((prev) => ({ ...prev, [editName]: editIcon }));

      actionHistory.pushAction({
        action: "create",
        entity: "service_category",
        entityName: editName,
        description: `Created service category "${editName}"`,
        previousState,
        newState: [newCat, ...allCategories],
      });
      showNotification("success", `Category "${editName}" created`);

      try {
        await fetch("/api/admin/service-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCat),
        });
      } catch { console.error("Create service category failed"); }
    } else if (editTarget) {
      const oldName = editTarget.name;
      updateCategoryLocal(editTarget.id, {
        name: editName,
        slug,
        description: editDescription,
        department: editDepartment,
      });
      setCategoryIcons((prev) => {
        const next = { ...prev };
        if (oldName !== editName) {
          delete next[oldName];
        }
        next[editName] = editIcon;
        return next;
      });

      actionHistory.pushAction({
        action: "edit",
        entity: "service_category",
        entityName: editName,
        description: `Edited "${oldName}" → "${editName}"`,
        previousState,
        newState: allCategories.map((c) => c.id === editTarget.id ? { ...c, name: editName, slug, description: editDescription, department: editDepartment } : c),
      });
      showNotification("success", `Category "${editName}" updated`);

      try {
        await fetch("/api/admin/service-categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editTarget, name: editName, slug, description: editDescription, department: editDepartment }),
        });
      } catch { console.error("Update service category failed"); }
    }

    setEditModalOpen(false);
    setEditTarget(null);
  };

  const exportCSV = () => {
    const headers = ["Name", "Slug", "Department", "Orders", "Revenue", "Description", "Created"];
    const rows = filteredCategories.map((c) => [c.name, c.slug, c.department, String(c.orderCount), String(c.revenue), c.description, c.createdAt.split("T")[0]]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `service-categories-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPerformanceReport = () => {
    const headers = ["Category", "Department", "Orders", "Revenue", "Average Order Value", "Growth %", "Health Score"];
    const rows = filteredCategories.map((c) => {
      const perf = CATEGORY_PERFORMANCE[c.name];
      const health = calculateHealthScore(c.orderCount, c.revenue, perf?.monthlyGrowth ?? 0);
      const avgOrderValue = c.orderCount > 0 ? Math.round(c.revenue / c.orderCount) : 0;
      return [c.name, c.department, String(c.orderCount), String(c.revenue), String(avgOrderValue), `${perf?.monthlyGrowth ?? 0}%`, `${health.level} (${health.score})`];
    });
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `service-category-performance-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getNotes = (catId: string) => categoryNotes[catId] || { internalNotes: "", managementRemarks: "", lastUpdatedBy: "", lastUpdatedDate: "" };

  const openNoteEditing = (cat: ServiceCategoryRecord) => {
    const existing = getNotes(cat.id);
    setNoteDraftInternal(existing.internalNotes);
    setNoteDraftRemarks(existing.managementRemarks);
    setNoteEditing(true);
  };

  const saveNotes = (catId: string) => {
    setCategoryNotes((prev) => ({
      ...prev,
      [catId]: {
        internalNotes: noteDraftInternal,
        managementRemarks: noteDraftRemarks,
        lastUpdatedBy: "Admin",
        lastUpdatedDate: new Date().toISOString(),
      },
    }));
    setNoteEditing(false);
  };

  const deleteNotes = (catId: string) => {
    setCategoryNotes((prev) => {
      const next = { ...prev };
      delete next[catId];
      return next;
    });
    setNoteEditing(false);
  };

  // Department management functions
  const openDeptDrawer = (dept?: DepartmentRecord) => {
    if (dept) {
      setDeptEditMode("edit");
      setDeptEditTarget(dept);
      setDeptEditName(dept.name);
      setDeptEditDescription(dept.description);
      setDeptEditIcon(dept.icon);
      setDeptEditColor(dept.color);
    } else {
      setDeptEditMode("add");
      setDeptEditTarget(null);
      setDeptEditName("");
      setDeptEditDescription("");
      setDeptEditIcon("📚");
      setDeptEditColor("bg-blue-50 text-blue-700 border-blue-200");
    }
    setDeptDrawerOpen(true);
  };

  const openDeptManage = () => {
    setDeptEditMode("add");
    setDeptEditTarget(null);
    setDeptDrawerOpen(true);
  };

  const handleSaveDepartment = () => {
    if (!deptEditName.trim()) return;
    const previousState = [...allDepartments];
    const slug = deptEditName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (deptEditMode === "add") {
      const newDept: DepartmentRecord = {
        id: `dept-${Date.now()}`,
        name: deptEditName.trim(),
        slug,
        description: deptEditDescription.trim(),
        icon: deptEditIcon,
        color: deptEditColor,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      setAllDepartments((prev) => [...prev, newDept]);
      actionHistory.pushAction({
        action: "create",
        entity: "department",
        entityName: deptEditName.trim(),
        description: `Created department "${deptEditName.trim()}"`,
        previousState,
        newState: [...previousState, newDept],
      });
      showNotification("success", `Department "${deptEditName.trim()}" created`);
    } else if (deptEditTarget) {
      const oldName = deptEditTarget.name;
      setAllDepartments((prev) => prev.map((d) => d.id === deptEditTarget.id ? { ...d, name: deptEditName.trim(), slug, description: deptEditDescription.trim(), icon: deptEditIcon, color: deptEditColor } : d));
      if (oldName !== deptEditName.trim()) {
        setAllCategories((prev) => prev.map((c) => c.department === oldName ? { ...c, department: deptEditName.trim() } : c));
      }
      actionHistory.pushAction({
        action: "edit",
        entity: "department",
        entityName: deptEditName.trim(),
        description: `Edited department "${oldName}" → "${deptEditName.trim()}"`,
        previousState,
        newState: allDepartments.map((d) => d.id === deptEditTarget.id ? { ...d, name: deptEditName.trim(), slug, description: deptEditDescription.trim(), icon: deptEditIcon, color: deptEditColor } : d),
      });
      showNotification("success", `Department "${deptEditName.trim()}" updated`);
    }

    setDeptDrawerOpen(false);
    setDeptEditTarget(null);
  };

  const openDeptDelete = (dept: DepartmentRecord) => {
    setDeptDeleteTarget(dept);
    const linkedCount = allCategories.filter((c) => c.department === dept.name).length;
    if (linkedCount > 0) {
      setDeptMoveTarget("");
      setDeptDeleteMode("move");
    } else {
      setDeptDeleteMode("delete");
    }
    setDeptDeleteOpen(true);
  };

  const confirmDeptDelete = () => {
    if (!deptDeleteTarget) return;
    const previousState = [...allDepartments];
    const previousCatState = [...allCategories];
    const linkedCats = allCategories.filter((c) => c.department === deptDeleteTarget.name);

    if (linkedCats.length > 0 && deptDeleteMode === "move" && deptMoveTarget) {
      setAllCategories((prev) => prev.map((c) => c.department === deptDeleteTarget.name ? { ...c, department: deptMoveTarget } : c));
    } else if (linkedCats.length > 0 && deptDeleteMode === "delete") {
      setAllCategories((prev) => prev.filter((c) => c.department !== deptDeleteTarget.name));
    }

    setAllDepartments((prev) => prev.filter((d) => d.id !== deptDeleteTarget.id));
    actionHistory.pushAction({
      action: "delete",
      entity: "department",
      entityName: deptDeleteTarget.name,
      description: `Deleted department "${deptDeleteTarget.name}"${linkedCats.length > 0 && deptDeleteMode === "move" ? ` (moved ${linkedCats.length} categories to ${deptMoveTarget})` : linkedCats.length > 0 ? ` (deleted ${linkedCats.length} linked categories)` : ""}`,
      previousState,
      newState: allDepartments.filter((d) => d.id !== deptDeleteTarget.id),
    });
    showNotification("success", `Department "${deptDeleteTarget.name}" deleted`);
    setDeptDeleteOpen(false);
    setDeptDeleteTarget(null);
  };

  const getCategoryCountForDept = (deptName: string) => allCategories.filter((c) => c.department === deptName).length;

  // File parsing helpers
  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""));
    return lines.slice(1).map((line) => {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; continue; }
        if (char === "," && !inQuotes) { values.push(current.trim()); current = ""; continue; }
        current += char;
      }
      values.push(current.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ""; });
      return row;
    });
  };

  const parseJSON = (text: string): Record<string, string>[] => {
    const data = JSON.parse(text);
    const arr = Array.isArray(data) ? data : data.categories || data.data || [data];
    return arr.map((item: Record<string, unknown>) => {
      const row: Record<string, string> = {};
      for (const [k, v] of Object.entries(item)) {
        row[k.toLowerCase().replace(/[^a-z0-9_]/g, "")] = String(v ?? "");
      }
      return row;
    });
  };

  const parseXLSX = async (file: File): Promise<Record<string, string>[]> => {
    // Basic XLSX: read as text and try to extract tab-separated or CSV-like data
    // For a proper implementation, a library like SheetJS would be needed
    // Here we handle the simplest case: the file is actually a CSV with .xlsx extension
    const text = await file.text();
    // Try CSV parse first
    const rows = parseCSV(text);
    if (rows.length > 0) return rows;
    // Try tab-separated
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split("\t").map((h) => h.trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const values = line.split("\t");
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i]?.trim() || ""; });
      return row;
    });
  };

  const processImportFile = async (file: File) => {
    setImportError("");
    setImportPreview(null);
    setImportFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase();

    try {
      let rows: Record<string, string>[] = [];

      if (ext === "csv") {
        const text = await file.text();
        rows = parseCSV(text);
      } else if (ext === "json") {
        const text = await file.text();
        rows = parseJSON(text);
      } else if (ext === "xlsx" || ext === "xls") {
        rows = await parseXLSX(file);
      } else {
        setImportError("Unsupported file format. Please upload CSV, JSON, or XLSX.");
        return;
      }

      if (rows.length === 0) {
        setImportError("No data found in the file. Please check the format.");
        return;
      }

      // Validate and transform
      const validDepartments = departmentNames;
      const existingNames = new Set(allCategories.map((c) => c.name.toLowerCase()));
      const records: (ServiceCategoryRecord & { isDuplicate?: boolean })[] = [];
      let newCount = 0;
      let existingCount = 0;

      for (const row of rows) {
        const name = row.name || row.category_name || row.category || "";
        const description = row.description || row.desc || "";
        const department = row.department || row.dept || "Publishing";
        const icon = row.icon || row.emoji || "";
        const featured = row.featured === "true" || row.featured === "1" || row.featured === "yes";
        const createdDate = row.created_date || row.createdat || row.created || "";

        if (!name.trim()) continue; // Skip rows without name

        const isDuplicate = existingNames.has(name.toLowerCase());
        if (isDuplicate) existingCount++;
        else { newCount++; existingNames.add(name.toLowerCase()); }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const dept = validDepartments.includes(department) ? department : "Publishing";

        records.push({
          id: `sc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: name.trim(),
          slug,
          description: description.trim(),
          department: dept,
          orderCount: 0,
          revenue: 0,
          createdAt: createdDate ? new Date(createdDate).toISOString() : new Date().toISOString(),
          featured,
          isDuplicate,
        });

        if (icon && !CATEGORY_ICONS[name.trim()]) {
          CATEGORY_ICONS[name.trim()] = icon;
        }
      }

      if (records.length === 0) {
        setImportError("No valid records found. Ensure each row has a 'name' field.");
        return;
      }

      setImportPreview({ total: records.length, newCount, existingCount, records });
    } catch {
      setImportError("Failed to parse file. Please check the format and try again.");
    }
  };

  const executeImport = () => {
    if (!importPreview) return;
    const previousState = [...allCategories];

    const recordsToImport = importPreview.records.filter((r) => {
      if (r.isDuplicate && importDuplicateHandling === "skip") return false;
      return true;
    });

    const newRecords = recordsToImport.map((r) => {
      const { isDuplicate, ...clean } = r;
      return clean;
    });

    if (importDuplicateHandling === "replace") {
      const newNames = new Set(newRecords.map((r) => r.name.toLowerCase()));
      setAllCategories((prev) => [
        ...prev.filter((c) => !newNames.has(c.name.toLowerCase())),
        ...newRecords,
      ]);
    } else {
      setAllCategories((prev) => [...prev, ...newRecords]);
    }

    const importedCount = newRecords.length;

    actionHistory.pushAction({
      action: "import",
      entity: "service_category",
      entityName: `${importedCount} categories`,
      description: `Imported ${importedCount} categor${importedCount === 1 ? "y" : "ies"} from ${importFileName}`,
      previousState,
      newState: importDuplicateHandling === "replace"
        ? [...allCategories.filter((c) => !newRecords.some((r) => r.name.toLowerCase() === c.name.toLowerCase())), ...newRecords]
        : [...allCategories, ...newRecords],
    });

    setImportModalOpen(false);
    setImportPreview(null);
    setImportFileName("");
    setImportProcessing(false);
    showNotification("success", `${importedCount} categor${importedCount === 1 ? "y" : "ies"} imported successfully`);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">Service Category Management</h1>
          <p className="text-sm text-muted-foreground">Manage all publishing, editing, design, and marketing service categories offered on the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => openEditModal()} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
            <Plus className="h-4 w-4 mr-1" />Create Service Category
          </Button>
          <div className="refresh-btn-border rounded-lg p-[2px] w-fit">
            <Button variant="outline" size="sm" onClick={() => fetchCategories()} disabled={loading} className="border-0 bg-white text-[#8A6A4A] hover:bg-[#F2D8BE] w-fit">
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Service Categories", value: stats.total, icon: Briefcase, color: "text-[#8A6A4A]", bg: "bg-[#F5EDE3]" },
          { label: "Category Departments", value: stats.departments, icon: Settings, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Service Orders", value: stats.orders, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Average Order Value", value: formatCurrency(stats.avgOrderValue), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="border border-[#E8DDD0] bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg ${stat.bg} p-2 ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
                  <div>
                    <p className="text-2xl font-bold text-[#1D1D1D]">{typeof stat.value === "string" ? stat.value : stat.value.toLocaleString()}</p>
                    <p className="text-xs text-[#5C4A3D]">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Center */}
      <motion.div variants={item}>
        <div className="analytics-dropdown-border rounded-[15px] p-[2.5px]">
          <div className="bg-white rounded-[13px]">
            <button onClick={() => setAnalyticsOpen(!analyticsOpen)} className="w-full flex items-center justify-between p-4 hover:bg-[#F5EDE3]/30 transition-colors rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#8A6A4A]" />
                <h3 className="text-sm font-semibold text-[#1D1D1D]">Service Category Analytics Center</h3>
              </div>
              {analyticsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {analyticsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Orders by Department */}
                    <div className="rounded-lg border border-[#E8DDD0] p-4 bg-[#F5EDE3]/20">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Orders by Department</h4>
                      <div className="space-y-2">
                        {departmentNames.map((dept) => {
                          const deptOrders = allCategories.filter((c) => c.department === dept).reduce((sum, c) => sum + c.orderCount, 0);
                          const maxOrders = Math.max(...departmentNames.map((d) => allCategories.filter((c) => c.department === d).reduce((sum, c) => sum + c.orderCount, 0)), 1);
                          return (
                            <div key={dept} className="flex items-center gap-2">
                              <span className="text-[11px] text-[#5C4A3D] w-24 truncate">{dept}</span>
                              <div className="flex-1 h-5 bg-white rounded overflow-hidden border border-[#E8DDD0]">
                                <div className="h-full bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A] rounded" style={{ width: `${Math.min((deptOrders / maxOrders) * 100, 100)}%` }} />
                              </div>
                              <span className="text-[11px] font-medium text-[#111111] w-8 text-right">{deptOrders}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Revenue by Department */}
                    <div className="rounded-lg border border-[#E8DDD0] p-4 bg-[#F5EDE3]/20">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Revenue by Department</h4>
                      <div className="flex items-center gap-4">
                        <div className="relative w-32 h-32">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#E8DDD0" strokeWidth="12" />
                            {(() => {
                              const totalRev = departmentNames.reduce((sum, dept) => sum + allCategories.filter((c) => c.department === dept).reduce((s, c) => s + c.revenue, 0), 0) || 1;
                              const pieColors = ["#8A6A4A", "#D8B27A", "#EBC9A8", "#6B8F71", "#C49B6A", "#a78bfa", "#f472b6", "#38bdf8"];
                              let offset = 0;
                              return departmentNames.map((dept, i) => {
                                const rev = allCategories.filter((c) => c.department === dept).reduce((s, c) => s + c.revenue, 0);
                                const pct = (rev / totalRev) * 251.33;
                                const dashoffset = -offset;
                                offset += pct;
                                return <circle key={dept} cx="50" cy="50" r="40" fill="none" stroke={pieColors[i % pieColors.length]} strokeWidth="12" strokeDasharray={`${pct} ${251.33 - pct}`} strokeDashoffset={dashoffset} />;
                              });
                            })()}
                          </svg>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {(() => {
                            const pieColors = ["bg-[#8A6A4A]", "bg-[#D8B27A]", "bg-[#EBC9A8]", "bg-[#6B8F71]", "bg-[#C49B6A]", "bg-violet-400", "bg-pink-400", "bg-sky-400"];
                            return departmentNames.map((dept, i) => {
                              const rev = allCategories.filter((c) => c.department === dept).reduce((s, c) => s + c.revenue, 0);
                              return (
                                <div key={dept} className="flex items-center gap-2 text-xs">
                                  <div className={`h-2.5 w-2.5 rounded-sm flex-shrink-0 ${pieColors[i % pieColors.length]}`} />
                                  <span className="text-[#5C4A3D] truncate flex-1">{dept}</span>
                                  <span className="font-medium text-[#111111]">${rev.toLocaleString()}</span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Department Distribution */}
                    <div className="rounded-lg border border-[#E8DDD0] p-4 bg-[#F5EDE3]/20">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Department Distribution</h4>
                      <div className="flex items-end gap-6 justify-center h-40 pt-4 overflow-x-auto">
                        {(() => {
                          const barColors = ["bg-blue-600", "bg-violet-600", "bg-emerald-600", "bg-amber-600", "bg-cyan-600", "bg-rose-600", "bg-indigo-600", "bg-teal-600"];
                          const maxCount = Math.max(...departmentNames.map((d) => allCategories.filter((c) => c.department === d).length), 1);
                          return departmentNames.map((dept, i) => {
                            const count = allCategories.filter((c) => c.department === dept).length;
                            const shortName = dept.length > 8 ? dept.slice(0, 7) + "…" : dept;
                            return (
                              <div key={dept} className="flex flex-col items-center gap-1 min-w-[48px]">
                                <div className={`w-12 ${barColors[i % barColors.length]} rounded-t`} style={{ height: `${(count / maxCount) * 120}px` }} />
                                <span className="text-[10px] font-medium text-[#111111]">{shortName}</span>
                                <span className="text-[10px] text-[#5C4A3D]">{count}</span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Service Growth */}
                    <div className="rounded-lg border border-[#E8DDD0] p-4 bg-[#F5EDE3]/20">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Service Growth</h4>
                      <div className="relative h-40 pt-2">
                        <svg viewBox="0 0 300 120" className="w-full h-full" preserveAspectRatio="none">
                          <line x1="0" y1="0" x2="300" y2="0" stroke="#E8DDD0" strokeWidth="0.5" />
                          <line x1="0" y1="30" x2="300" y2="30" stroke="#E8DDD0" strokeWidth="0.5" />
                          <line x1="0" y1="60" x2="300" y2="60" stroke="#E8DDD0" strokeWidth="0.5" />
                          <line x1="0" y1="90" x2="300" y2="90" stroke="#E8DDD0" strokeWidth="0.5" />
                          <polyline points="0,100 50,85 100,75 150,60 200,45 250,30 300,15" fill="none" stroke="#8A6A4A" strokeWidth="2" />
                          <polyline points="0,110 50,100 100,95 150,85 200,80 250,75 300,70" fill="none" stroke="#D8B27A" strokeWidth="2" strokeDasharray="4 2" />
                        </svg>
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-[#5C4A3D] px-1">
                          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 justify-center">
                        <div className="flex items-center gap-1 text-[10px]"><div className="h-2 w-4 bg-[#8A6A4A] rounded" /><span className="text-[#5C4A3D]">New Services</span></div>
                        <div className="flex items-center gap-1 text-[10px]"><div className="h-2 w-4 bg-[#D8B27A] rounded" /><span className="text-[#5C4A3D]">Total Orders</span></div>
                      </div>
                    </div>

                    {/* Category Health Scores */}
                    <div className="rounded-lg border border-[#E8DDD0] p-4 bg-[#F5EDE3]/20">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Category Health Scores</h4>
                      <div className="space-y-2">
                        {allCategories.map((cat) => {
                          const perf = CATEGORY_PERFORMANCE[cat.name];
                          const health = calculateHealthScore(cat.orderCount, cat.revenue, perf?.monthlyGrowth ?? 0);
                          return (
                            <div key={cat.id} className="flex items-center gap-2">
                              <span className="text-[11px] text-[#5C4A3D] w-36 truncate">{getIcon(cat.name)} {cat.name}</span>
                              <div className="flex-1 h-4 bg-white rounded overflow-hidden border border-[#E8DDD0]">
                                <div className="h-full rounded" style={{ width: `${health.score}%`, backgroundColor: health.score >= 80 ? "#10b981" : health.score >= 60 ? "#3b82f6" : health.score >= 40 ? "#f59e0b" : "#f43f5e" }} />
                              </div>
                              <span className={`text-[10px] font-bold w-20 text-right ${health.color}`}>{health.level}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Service Dependency Analytics */}
                    <div className="rounded-lg border border-[#E8DDD0] p-4 bg-[#F5EDE3]/20">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-3">Service Dependencies</h4>
                      <p className="text-[10px] text-[#5C4A3D] mb-3">Services commonly ordered together</p>
                      <div className="space-y-2.5">
                        {[
                          { pair: ["Book Publishing", "ISBN Registration"], orders: 89, percentage: 67 },
                          { pair: ["Editing", "Proofreading"], orders: 76, percentage: 58 },
                          { pair: ["Cover Design", "Book Formatting"], orders: 64, percentage: 51 },
                          { pair: ["Book Promotion", "Amazon Marketing"], orders: 42, percentage: 38 },
                          { pair: ["Interior Layout Design", "Cover Design"], orders: 38, percentage: 35 },
                          { pair: ["Manuscript Assessment", "Editing"], orders: 31, percentage: 29 },
                          { pair: ["Author Branding", "Author Website Development"], orders: 24, percentage: 22 },
                        ].map((dep, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 text-[10px]">
                                <span className="font-medium text-[#111111] truncate">{dep.pair[0]}</span>
                                <span className="text-[#8A6A4A]">+</span>
                                <span className="font-medium text-[#111111] truncate">{dep.pair[1]}</span>
                              </div>
                              <div className="mt-1 h-2 bg-white rounded-full overflow-hidden border border-[#E8DDD0]">
                                <div className="h-full bg-gradient-to-r from-[#8A6A4A] to-[#D8B27A] rounded-full" style={{ width: `${dep.percentage}%` }} />
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="text-[10px] font-bold text-[#111111]">{dep.orders}</span>
                              <span className="text-[10px] text-[#5C4A3D]"> orders</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Sticky Search & Filter Bar */}
      <motion.div variants={item} ref={stickyRef} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-4 -mt-2 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-md search-bar-border">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input placeholder="Search service categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 h-9" />
          </div>
          <div className="flex items-center gap-2" ref={dropdownRef}>
            <div className="relative">
              <div className="refresh-btn-border rounded-lg p-[2px]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortFilterOpen(!sortFilterOpen)}
                  className={`h-9 px-3 border-0 bg-white text-sm font-medium gap-2 ${hasActiveFilter ? "text-[#D8B27A]" : "text-[#8A6A4A] hover:bg-[#F2D8BE]"}`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[120px] truncate">{activeFilterLabel}</span>
                  <span className="sm:hidden">Filter</span>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${sortFilterOpen ? "rotate-90" : ""}`} />
                </Button>
              </div>

              <AnimatePresence>
                {sortFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-[320px] bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-[#E8DDD0] bg-[#F5EDE3]/30">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#1D1D1D] flex items-center gap-2">
                          <SlidersHorizontal className="h-4 w-4 text-[#8A6A4A]" />Sort & Filter
                        </h4>
                        {hasActiveFilter && (
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-rose-600 hover:bg-rose-50" onClick={clearSortFilter}>
                            <X className="h-3 w-3 mr-1" />Clear All
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                      <div className="p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><Briefcase className="h-3 w-3" />Department</p>
                        <div className="space-y-0.5">
                          {[
                            { value: "", label: "All Departments" },
                            ...departmentNames.map((name) => ({ value: name, label: name })),
                          ].map((d) => (
                            <button key={d.value} onClick={() => setSortFilter((p) => ({ department: d.value }))} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortFilter.department === d.value ? "bg-[#D8B27A]/20 text-[#111111] font-medium" : "text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}>
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 border-t border-[#E8DDD0]">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2 flex items-center gap-1.5"><TrendingUp className="h-3 w-3" />Sort By</p>
                        <div className="space-y-0.5">
                          {SORT_OPTIONS.map((opt) => (
                            <button key={opt.value} onClick={() => setSortOption(opt.value)} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sortOption === opt.value ? "bg-[#D8B27A]/20 text-[#111111] font-medium" : "text-[#5C4A3D] hover:bg-[#F5EDE3]"}`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
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
          {/* Quick Actions */}
          <div className="relative" ref={quickActionsRef}>
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                className="h-9 px-3 border-0 bg-white text-sm font-medium text-[#8A6A4A] hover:bg-[#F2D8BE] gap-2"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Actions</span>
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${quickActionsOpen ? "rotate-90" : ""}`} />
              </Button>
            </div>
            {quickActionsOpen && (
              <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#E8DDD0] z-50 p-2">
                <Button size="sm" className="w-full justify-start h-8 text-xs bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => { openEditModal(); setQuickActionsOpen(false); }}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />Create Service Category
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { openDeptDrawer(); setQuickActionsOpen(false); }}>
                  <Building2 className="h-3.5 w-3.5 mr-1.5" />Create Department
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { openDeptManage(); setQuickActionsOpen(false); }}>
                  <Settings className="h-3.5 w-3.5 mr-1.5" />Manage Departments
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { setImportModalOpen(true); setQuickActionsOpen(false); }}>
                  <Upload className="h-3.5 w-3.5 mr-1.5" />Import Categories
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportCSV(); setQuickActionsOpen(false); }}>
                  <Download className="h-3.5 w-3.5 mr-1.5" />Export Categories
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => { exportPerformanceReport(); setQuickActionsOpen(false); }}>
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5" />Performance Report
                </Button>
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList className="bg-[#F5EDE3] h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#1D1D1D] text-xs sm:text-sm">All<Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px] bg-[#D8B27A]/30">{stats.total}</Badge></TabsTrigger>
            {departmentNames.map((dept) => {
              const deptCount = allCategories.filter((c) => c.department === dept).length;
              const deptIcon = allDepartments.find((d) => d.name === dept)?.icon || "📁";
              const deptTabValue = dept.toLowerCase().replace(/\s+/g, "-") as FilterTab;
              return (
                <TabsTrigger key={dept} value={deptTabValue} className="data-[state=active]:bg-[#8A6A4A] data-[state=active]:text-white text-xs sm:text-sm">
                  {deptIcon}<span className="ml-1 hidden sm:inline">{dept}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Summary Strip */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5C4A3D] bg-[#F5EDE3]/30 rounded-lg px-4 py-2 border border-[#E8DDD0]/50">
        <span>Showing <span className="font-semibold text-[#111111]">{displayedCategories.length}</span> of <span className="font-semibold text-[#111111]">{filteredCategories.length}</span> service categories{hasActiveFilter ? " (filtered)" : ""}</span>
        <span className="hidden sm:inline text-[#E8DDD0]">|</span>
        <span><span className="text-blue-600 font-medium">{stats.orders}</span> Service Orders</span>
        <span><span className="text-violet-600 font-medium">{stats.departments}</span> Departments</span>
        <span><span className="text-emerald-600 font-medium">{formatCurrency(stats.avgOrderValue)}</span> Avg Order Value</span>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center gap-3 p-3 bg-[#F5EDE3]/50 rounded-lg border border-[#E8DDD0]"
          >
            <span className="text-sm font-semibold text-[#111111]">{selectedIds.size} Service Categor{selectedIds.size > 1 ? "ies" : "y"} Selected</span>
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="h-8 text-xs border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => handleBulkAction("bulkDelete")} disabled={actionLoading}>
                <Trash2 className="h-3 w-3 mr-1" />Bulk Delete
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={exportCSV}>
                <Download className="h-3 w-3 mr-1" />Export
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground" onClick={() => setSelectedIds(new Set())}>Clear</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <SyncedTableScroll ref={tableScroll} loading={loading}>
        <Table className="bg-white">
          <TableHeader>
            <TableRow className="border-b border-black/12">
              <TableHead className="w-10">
                <button onClick={toggleSelectAll} className="flex items-center justify-center">
                  {allSelected ? <CheckSquare className="h-4 w-4 text-[#8A6A4A]" /> : someSelected ? <div className="h-4 w-4 border-2 border-[#8A6A4A] rounded flex items-center justify-center"><div className="h-1.5 w-1.5 bg-[#8A6A4A] rounded-sm" /></div> : <Square className="h-4 w-4 text-muted-foreground" />}
                </button>
              </TableHead>
              <TableHead className="text-[#111111] font-semibold">Category</TableHead>
              <TableHead className="text-[#111111] font-semibold hidden sm:table-cell">Department</TableHead>
              <TableHead className="text-[#111111] font-semibold hidden md:table-cell">Orders</TableHead>
              <TableHead className="text-[#111111] font-semibold hidden md:table-cell">Revenue</TableHead>
              <TableHead className="text-[#111111] font-semibold hidden xl:table-cell">Created</TableHead>
              <TableHead className="text-[#111111] font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#8A6A4A]" />
                  <p className="mt-3 text-sm text-[#5C4A3D]">Loading service categories...</p>
                </TableCell>
              </TableRow>
            ) : displayedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <Briefcase className="mx-auto h-10 w-10 text-[#D8B27A]/50 mb-3" />
                  <p className="text-sm font-medium text-[#111111]">No service categories found</p>
                  <p className="text-xs text-[#5C4A3D] mt-1">Try adjusting your search or filters.</p>
                </TableCell>
              </TableRow>
            ) : (
              displayedCategories.map((cat) => {
                return (
                  <TableRow key={cat.id} className={`border-b border-black/12 hover:bg-black/[0.02] transition-colors duration-150 cursor-default ${selectedIds.has(cat.id) ? "bg-[#F5EDE3]/30" : ""}`}>
                    <TableCell onClick={(e) => e.stopPropagation()} className="py-2">
                      <button onClick={() => toggleSelect(cat.id)} className="flex items-center justify-center">
                        {selectedIds.has(cat.id) ? <CheckSquare className="h-4 w-4 text-[#8A6A4A]" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </TableCell>
                    <TableCell className="cursor-pointer py-2" onClick={() => openDrawer(cat)}>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-[#F5EDE3] flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">{getIcon(cat.name)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#111111] text-sm truncate">{cat.name}</p>
                          <p className="text-[11px] text-[#5C4A3D] truncate">{cat.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell cursor-pointer py-2" onClick={() => openDrawer(cat)}>
                      <Badge variant="secondary" className={`${DEPARTMENT_COLORS[cat.department] || "bg-gray-50 text-gray-700 border-gray-200"} gap-1 text-[11px] border`}>
                        {cat.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-2">
                      <button onClick={(e) => openOrderHistory(cat, e)} className="flex items-center gap-1.5 text-sm text-[#111111] hover:text-[#8A6A4A] transition-colors cursor-pointer group">
                        <FileText className="h-3.5 w-3.5 text-[#8A6A4A]" />
                        <span className="font-medium group-hover:underline">{cat.orderCount}</span>
                      </button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell cursor-pointer py-2" onClick={() => openDrawer(cat)}>
                      <div className="flex items-center gap-1.5 text-sm text-[#111111]">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="font-medium">${cat.revenue.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell cursor-pointer py-2" onClick={() => openDrawer(cat)}>
                      <span className="text-sm text-[#5C4A3D]">{formatDate(cat.createdAt)}</span>
                    </TableCell>
                    <TableCell className="text-right py-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-0.5">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#5C4A3D] hover:text-[#111111] hover:bg-[#F5EDE3]" onClick={() => openDrawer(cat)} title="Quick preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50" onClick={() => openEditModal(cat)} title="Edit service category">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(cat.id)} title="Delete service category">
                          <Trash2 className="h-4 w-4" />
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

      {/* Pagination */}
      <motion.div variants={item} className="flex items-center justify-between">
        <p className="text-sm text-[#5C4A3D]">
          Showing <span className="font-medium text-[#111111]">{filteredCategories.length === 0 ? 0 : (page - 1) * pageSize + 1}</span>
          {" "}&ndash;{" "}
          <span className="font-medium text-[#111111]">{Math.min(page * pageSize, filteredCategories.length)}</span>
          {" "}of <span className="font-medium text-[#111111]">{filteredCategories.length}</span>
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]"><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
          <span className="text-sm font-medium text-[#111111] px-2">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]">Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
      </motion.div>

      {/* Category Performance Drawer */}
      <AnimatePresence>
        {drawerOpen && drawerCategory && (
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
                  <h2 className="text-lg font-bold text-[#111111]">Category Performance</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-[#F5EDE3] flex items-center justify-center ring-2 ring-[#D8B27A]/30">
                    <span className="text-3xl">{getIcon(drawerCategory.name)}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111111]">{drawerCategory.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className={`${DEPARTMENT_COLORS[drawerCategory.department] || "bg-gray-50 text-gray-700 border-gray-200"} gap-1 text-[11px] border`}>
                        {drawerCategory.department}
                      </Badge>
                      {(() => {
                        const perf = CATEGORY_PERFORMANCE[drawerCategory.name];
                        const health = calculateHealthScore(drawerCategory.orderCount, drawerCategory.revenue, perf?.monthlyGrowth ?? 0);
                        return (
                          <Badge variant="secondary" className={`${health.bgColor} gap-1 text-[11px] border`}>
                            <Activity className="h-3 w-3" />{health.level} ({health.score})
                          </Badge>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Total Orders", value: drawerCategory.orderCount.toLocaleString(), icon: FileText, color: "text-[#8A6A4A]" },
                      { label: "Total Revenue", value: `$${drawerCategory.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600" },
                      { label: "Avg Order Value", value: `$${(CATEGORY_PERFORMANCE[drawerCategory.name]?.avgOrderValue ?? Math.round(drawerCategory.revenue / drawerCategory.orderCount)).toLocaleString()}`, icon: TrendingUp, color: "text-blue-600" },
                      { label: "Monthly Growth", value: `${CATEGORY_PERFORMANCE[drawerCategory.name]?.monthlyGrowth ?? 0}%`, icon: TrendingUp, color: "text-emerald-600" },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-[#E8DDD0] p-2.5 bg-[#F5EDE3]/30">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#5C4A3D] mb-0.5"><f.icon className={`h-3 w-3 ${f.color}`} />{f.label}</div>
                        <p className="text-sm font-bold text-[#111111]">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Top Selling Service</h4>
                  <div className="flex items-center gap-3 p-3 bg-[#F5EDE3]/40 rounded-lg border border-[#E8DDD0]">
                    <div className="h-10 w-10 rounded-lg bg-[#8A6A4A] flex items-center justify-center flex-shrink-0">
                      <Star className="h-5 w-5 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111111]">{CATEGORY_PERFORMANCE[drawerCategory.name]?.topSellingService ?? "N/A"}</p>
                      <p className="text-[11px] text-[#5C4A3D]">Best performing service in this category</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Recent Orders</h4>
                  <div className="space-y-2">
                    {(CATEGORY_PERFORMANCE[drawerCategory.name]?.recentOrders ?? []).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E8DDD0]">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-medium text-[#111111]">{order.id}</span>
                            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${order.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : order.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"} border`}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-[#5C4A3D] truncate">{order.customer}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-[#111111]">${order.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-[#5C4A3D]">{formatDate(order.date)}</p>
                        </div>
                      </div>
                    ))}
                    {(CATEGORY_PERFORMANCE[drawerCategory.name]?.recentOrders ?? []).length === 0 && (
                      <p className="text-xs text-[#5C4A3D] text-center py-3">No recent orders</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Top Customers</h4>
                  <div className="space-y-2">
                    {(CATEGORY_PERFORMANCE[drawerCategory.name]?.topCustomers ?? []).map((customer, i) => (
                      <div key={customer.name} className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#E8DDD0]">
                        <div className="h-8 w-8 rounded-full bg-[#F5EDE3] flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#8A6A4A]">{i + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#111111] truncate">{customer.name}</p>
                          <p className="text-[10px] text-[#5C4A3D]">{customer.orders} orders</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-[#111111]">${customer.spent.toLocaleString()}</p>
                          <p className="text-[10px] text-[#5C4A3D]">total spent</p>
                        </div>
                      </div>
                    ))}
                    {(CATEGORY_PERFORMANCE[drawerCategory.name]?.topCustomers ?? []).length === 0 && (
                      <p className="text-xs text-[#5C4A3D] text-center py-3">No customer data</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#E8DDD0]">
                  <Button size="sm" className="flex-1 bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => { setDrawerOpen(false); openEditModal(drawerCategory); }}>
                    <Edit className="h-3.5 w-3.5 mr-1" />Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => setDrawerOpen(false)}>Close</Button>
                </div>

                {/* Admin Notes */}
                <div className="border-t border-[#E8DDD0] pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />Admin Notes
                    </h4>
                    {!noteEditing && (
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-[#8A6A4A] hover:bg-[#F5EDE3]" onClick={() => openNoteEditing(drawerCategory)}>
                        <Edit className="h-3 w-3 mr-1" />{getNotes(drawerCategory.id).internalNotes || getNotes(drawerCategory.id).managementRemarks ? "Edit" : "Add Notes"}
                      </Button>
                    )}
                  </div>
                  {!noteEditing ? (
                    <div className="space-y-2.5">
                      {getNotes(drawerCategory.id).internalNotes && (
                        <div className="rounded-lg border border-[#E8DDD0] p-2.5 bg-[#F5EDE3]/20">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C4A3D] mb-1">Internal Notes</p>
                          <p className="text-xs text-[#111111] whitespace-pre-wrap">{getNotes(drawerCategory.id).internalNotes}</p>
                        </div>
                      )}
                      {getNotes(drawerCategory.id).managementRemarks && (
                        <div className="rounded-lg border border-[#E8DDD0] p-2.5 bg-[#F5EDE3]/20">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C4A3D] mb-1">Management Remarks</p>
                          <p className="text-xs text-[#111111] whitespace-pre-wrap">{getNotes(drawerCategory.id).managementRemarks}</p>
                        </div>
                      )}
                      {getNotes(drawerCategory.id).lastUpdatedBy && (
                        <p className="text-[10px] text-[#5C4A3D]">Last updated by {getNotes(drawerCategory.id).lastUpdatedBy} on {formatDate(getNotes(drawerCategory.id).lastUpdatedDate)}</p>
                      )}
                      {!getNotes(drawerCategory.id).internalNotes && !getNotes(drawerCategory.id).managementRemarks && (
                        <p className="text-xs text-[#5C4A3D] text-center py-3 bg-[#F5EDE3]/20 rounded-lg border border-dashed border-[#E8DDD0]">No admin notes yet. Click &quot;Add Notes&quot; to record internal notes or management remarks.</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#5C4A3D] mb-1 block">Internal Notes</label>
                        <textarea placeholder="Internal notes for admins..." value={noteDraftInternal} onChange={(e) => setNoteDraftInternal(e.target.value)} rows={3} className="w-full rounded-md border border-[#E8DDD0] bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A4A]/30 resize-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#5C4A3D] mb-1 block">Management Remarks</label>
                        <textarea placeholder="Management remarks..." value={noteDraftRemarks} onChange={(e) => setNoteDraftRemarks(e.target.value)} rows={3} className="w-full rounded-md border border-[#E8DDD0] bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A4A]/30 resize-none" />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-[#8A6A4A] hover:bg-[#6A4E37] text-white h-7 text-xs" onClick={() => saveNotes(drawerCategory.id)}>
                          <CheckSquare className="h-3 w-3 mr-1" />Save Notes
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]" onClick={() => setNoteEditing(false)}>Cancel</Button>
                        {getNotes(drawerCategory.id).internalNotes || getNotes(drawerCategory.id).managementRemarks ? (
                          <Button size="sm" variant="outline" className="h-7 text-xs border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => deleteNotes(drawerCategory.id)}>
                            <Trash2 className="h-3 w-3 mr-1" />Delete
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Category Order History Drawer */}
      <AnimatePresence>
        {orderHistoryOpen && orderHistoryCategory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setOrderHistoryOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-[#E8DDD0]"
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#111111]">Category Order History</h2>
                    <p className="text-xs text-[#5C4A3D] mt-0.5">{getIcon(orderHistoryCategory.name)} {orderHistoryCategory.name} &middot; {orderHistoryCategory.department}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOrderHistoryOpen(false)}><X className="h-4 w-4" /></Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#F5EDE3]/40 rounded-lg border border-[#E8DDD0]">
                  <div className="h-10 w-10 rounded-lg bg-[#8A6A4A] flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111111]">{orderHistoryCategory.orderCount} Total Orders</p>
                    <p className="text-[11px] text-[#5C4A3D]">Showing newest first</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {(CATEGORY_ORDER_HISTORY[orderHistoryCategory.name] ?? []).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E8DDD0] hover:bg-[#F5EDE3]/20 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-medium text-[#111111]">{order.id}</span>
                          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${order.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : order.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-200" : order.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"} border`}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-[#111111]">{order.customer}</p>
                        <p className="text-[11px] text-[#5C4A3D]">{order.servicePackage}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-sm font-bold text-[#111111]">${order.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-[#5C4A3D]">{formatDate(order.date)}</p>
                      </div>
                    </div>
                  ))}
                  {(CATEGORY_ORDER_HISTORY[orderHistoryCategory.name] ?? []).length === 0 && (
                    <p className="text-xs text-[#5C4A3D] text-center py-8">No order history available for this category.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add/Edit Service Category Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditModalOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 border border-[#E8DDD0] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {editMode === "add" ? <Plus className="h-5 w-5 text-[#8A6A4A]" /> : <Edit className="h-5 w-5 text-[#8A6A4A]" />}
                <h3 className="text-lg font-semibold text-[#111111]">{editMode === "add" ? "Create Service Category" : "Edit Service Category"}</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditModalOpen(false)}><X className="h-4 w-4" /></Button>
            </div>

            <div className="space-y-4">
              {/* Icon Picker */}
              <div>
                <label className="text-sm font-medium text-[#111111] mb-1.5 block">Category Icon</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-xl bg-[#F5EDE3] flex items-center justify-center ring-2 ring-[#D8B27A]/30">
                    <span className="text-2xl">{editIcon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#5C4A3D]">Current icon</p>
                    <p className="text-sm font-medium text-[#111111]">{AVAILABLE_ICONS.find((i) => i.emoji === editIcon)?.label ?? "Custom"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-10 gap-1.5 p-3 bg-[#F5EDE3]/30 rounded-lg border border-[#E8DDD0]">
                  {AVAILABLE_ICONS.map((icon) => (
                    <button
                      key={icon.emoji}
                      onClick={() => setEditIcon(icon.emoji)}
                      title={icon.label}
                      className={`h-9 w-9 rounded-lg flex items-center justify-center text-lg transition-all ${editIcon === icon.emoji ? "bg-[#8A6A4A]/20 ring-2 ring-[#8A6A4A] scale-110" : "bg-white hover:bg-[#F5EDE3] hover:scale-105"}`}
                    >
                      {icon.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#111111] mb-1.5 block">Category Name</label>
                <Input placeholder="Enter service category name..." value={editName} onChange={(e) => setEditName(e.target.value)} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
              </div>

              <div>
                <label className="text-sm font-medium text-[#111111] mb-1.5 block">Department</label>
                <Select value={editDepartment} onValueChange={(v) => setEditDepartment(v)}>
                  <SelectTrigger className="border-[#E8DDD0]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {departmentNames.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#111111] mb-1.5 block">Description</label>
                <textarea placeholder="Enter service category description..." value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} className="w-full rounded-md border border-[#E8DDD0] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A4A]/30 resize-none" />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-[#E8DDD0]">
              <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
              <Button size="sm" onClick={handleSaveCategory} disabled={!editName.trim()} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
                {editMode === "add" ? <><Plus className="h-3.5 w-3.5 mr-1" />Create Service Category</> : <><Edit className="h-3.5 w-3.5 mr-1" />Save Changes</>}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        open={deleteConfirmOpen}
        onCancel={() => { setDeleteConfirmOpen(false); setDeleteConfirmTarget(null); }}
        title="Delete Service Category?"
        description="This will permanently remove this service category. Orders assigned to this category will become uncategorized."
        entityName={deleteConfirmTarget?.name || ""}
        confirmLabel="Delete Service Category"
        onConfirm={confirmDelete}
      />

      {/* Import Categories Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setImportModalOpen(false); setImportPreview(null); setImportError(""); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#8A6A4A]" />
                <h3 className="text-lg font-semibold text-[#111111]">Import Categories</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setImportModalOpen(false); setImportPreview(null); setImportError(""); }}><X className="h-4 w-4" /></Button>
            </div>

            {!importPreview ? (
              <div className="space-y-4">
                <p className="text-sm text-[#5C4A3D]">Upload a CSV, JSON, or XLSX file containing service categories.</p>
                <div className="rounded-lg border-2 border-dashed border-[#E8DDD0] p-8 text-center hover:border-[#8A6A4A]/50 transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-[#8A6A4A]/50 mb-3" />
                  <p className="text-sm text-[#5C4A3D] mb-2">Drag and drop your file here, or click to browse</p>
                  <p className="text-[10px] text-[#5C4A3D] mb-3">Supported formats: CSV, JSON, XLSX</p>
                  <Button size="sm" className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5 mr-1" />Select File
                  </Button>
                </div>
                <div className="rounded-lg bg-[#F5EDE3]/30 border border-[#E8DDD0] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-1">Required fields</p>
                  <p className="text-xs text-[#5C4A3D]">name, description</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6A4A] mb-1 mt-2">Optional fields</p>
                  <p className="text-xs text-[#5C4A3D]">icon, featured, created_date, department</p>
                </div>
                {importError && (
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3">
                    <p className="text-xs text-rose-700">{importError}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-[#111111] mb-1">{importPreview.total}</div>
                  <p className="text-sm text-[#5C4A3D]">Categories Found</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                    <div className="text-xl font-bold text-emerald-700">{importPreview.newCount}</div>
                    <p className="text-xs text-emerald-600">New Categories</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                    <div className="text-xl font-bold text-amber-700">{importPreview.existingCount}</div>
                    <p className="text-xs text-amber-600">Existing Categories</p>
                  </div>
                </div>
                {importPreview.existingCount > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#111111]">Duplicate handling:</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant={importDuplicateHandling === "skip" ? "default" : "outline"} className={`h-8 text-xs ${importDuplicateHandling === "skip" ? "bg-[#8A6A4A] text-white" : "border-[#E8DDD0] text-[#5C4A3D]"}`} onClick={() => setImportDuplicateHandling("skip")}>Skip Duplicates</Button>
                      <Button size="sm" variant={importDuplicateHandling === "replace" ? "default" : "outline"} className={`h-8 text-xs ${importDuplicateHandling === "replace" ? "bg-[#8A6A4A] text-white" : "border-[#E8DDD0] text-[#5C4A3D]"}`} onClick={() => setImportDuplicateHandling("replace")}>Replace Duplicates</Button>
                    </div>
                  </div>
                )}
                <div className="max-h-40 overflow-y-auto rounded-lg border border-[#E8DDD0]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-black/12">
                        <TableHead className="text-[10px] text-[#111111] font-semibold">Name</TableHead>
                        <TableHead className="text-[10px] text-[#111111] font-semibold">Department</TableHead>
                        <TableHead className="text-[10px] text-[#111111] font-semibold text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importPreview.records.slice(0, 10).map((r, i) => (
                        <TableRow key={i} className="border-b border-black/6">
                          <TableCell className="py-1.5 text-xs text-[#111111]">{r.name}</TableCell>
                          <TableCell className="py-1.5 text-xs text-[#5C4A3D]">{r.department}</TableCell>
                          <TableCell className="py-1.5 text-xs text-right">
                            {r.isDuplicate ? <span className="text-amber-600">Existing</span> : <span className="text-emerald-600">New</span>}
                          </TableCell>
                        </TableRow>
                      ))}
                      {importPreview.records.length > 10 && (
                        <TableRow>
                          <TableCell colSpan={3} className="py-1.5 text-xs text-[#5C4A3D] text-center">...and {importPreview.records.length - 10} more</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {importError && (
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3">
                    <p className="text-xs text-rose-700">{importError}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-[#E8DDD0]">
              <Button variant="outline" size="sm" onClick={() => { setImportModalOpen(false); setImportPreview(null); setImportError(""); }} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
              {importPreview ? (
                <Button size="sm" onClick={executeImport} disabled={importProcessing} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white">
                  <Upload className="h-3.5 w-3.5 mr-1" />Import {importPreview.total} Categories
                </Button>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Department Drawer */}
      <AnimatePresence>
        {deptDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setDeptDrawerOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-[#E8DDD0]"
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#8A6A4A]" />
                    <h2 className="text-lg font-bold text-[#111111]">{deptEditMode === "add" ? "Create Department" : "Edit Department"}</h2>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeptDrawerOpen(false)}><X className="h-4 w-4" /></Button>
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="text-sm font-medium text-[#111111] mb-1.5 block">Department Icon</label>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-[#F5EDE3] flex items-center justify-center ring-2 ring-[#D8B27A]/30">
                      <span className="text-2xl">{deptEditIcon}</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#5C4A3D]">Current icon</p>
                      <p className="text-sm font-medium text-[#111111]">{DEPARTMENT_ICONS_LIST.find((i) => i.emoji === deptEditIcon)?.label ?? "Custom"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-8 gap-1.5 p-3 bg-[#F5EDE3]/30 rounded-lg border border-[#E8DDD0]">
                    {DEPARTMENT_ICONS_LIST.map((icon) => (
                      <button
                        key={icon.emoji}
                        onClick={() => setDeptEditIcon(icon.emoji)}
                        title={icon.label}
                        className={`h-9 w-9 rounded-lg flex items-center justify-center text-lg transition-all ${deptEditIcon === icon.emoji ? "bg-[#8A6A4A]/20 ring-2 ring-[#8A6A4A] scale-110" : "bg-white hover:bg-[#F5EDE3] hover:scale-105"}`}
                      >
                        {icon.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="text-sm font-medium text-[#111111] mb-1.5 block">Department Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {DEPARTMENT_COLORS_LIST.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setDeptEditColor(c.value)}
                        className={`rounded-lg border-2 p-2 text-xs font-medium transition-all ${c.value} ${deptEditColor === c.value ? "ring-2 ring-[#8A6A4A] ring-offset-1" : "border-transparent hover:border-[#E8DDD0]"}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#111111] mb-1.5 block">Department Name *</label>
                  <Input placeholder="e.g. Publishing" value={deptEditName} onChange={(e) => setDeptEditName(e.target.value)} className="border-[#E8DDD0] focus-visible:ring-[#8A6A4A]/30" />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#111111] mb-1.5 block">Department Description</label>
                  <textarea placeholder="e.g. Handles all book publishing related services." value={deptEditDescription} onChange={(e) => setDeptEditDescription(e.target.value)} rows={3} className="w-full rounded-md border border-[#E8DDD0] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A4A]/30 resize-none" />
                </div>

                <div className="rounded-lg bg-[#F5EDE3]/30 border border-[#E8DDD0] p-3">
                  <div className="flex items-center gap-2 text-xs text-[#5C4A3D]">
                    <span className="text-lg">{deptEditIcon}</span>
                    <span className="font-medium">{deptEditName || "Department Name"}</span>
                    <Badge variant="secondary" className={`${deptEditColor} gap-1 text-[10px] border ml-auto`}>Active</Badge>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-[#E8DDD0]">
                  <Button variant="outline" size="sm" onClick={() => setDeptDrawerOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D] flex-1">Cancel</Button>
                  <Button size="sm" onClick={handleSaveDepartment} disabled={!deptEditName.trim()} className="bg-[#8A6A4A] hover:bg-[#6A4E37] text-white flex-1">
                    {deptEditMode === "add" ? <><Plus className="h-3.5 w-3.5 mr-1" />Create Department</> : <><Edit className="h-3.5 w-3.5 mr-1" />Save Changes</>}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Department Confirmation */}
      <AnimatePresence>
        {deptDeleteOpen && deptDeleteTarget && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setDeptDeleteOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[61] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-[#E8DDD0]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111111]">Delete Department?</h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="rounded-lg border border-[#E8DDD0] p-3 bg-[#F5EDE3]/20">
                    <p className="text-xs text-[#5C4A3D]">Department:</p>
                    <p className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                      <span className="text-lg">{deptDeleteTarget.icon}</span>{deptDeleteTarget.name}
                    </p>
                  </div>

                  {(() => {
                    const linkedCount = getCategoryCountForDept(deptDeleteTarget.name);
                    if (linkedCount > 0) {
                      return (
                        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                          <p className="text-xs text-amber-800 font-medium mb-1">This department contains {linkedCount} service {linkedCount === 1 ? "category" : "categories"}.</p>
                          <div className="space-y-2 mt-2">
                            <p className="text-xs text-amber-700">Choose an action:</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant={deptDeleteMode === "move" ? "default" : "outline"} className={`h-8 text-xs ${deptDeleteMode === "move" ? "bg-[#8A6A4A] text-white" : "border-[#E8DDD0] text-[#5C4A3D]"}`} onClick={() => setDeptDeleteMode("move")}>
                                Move Categories
                              </Button>
                              <Button size="sm" variant={deptDeleteMode === "delete" ? "default" : "outline"} className={`h-8 text-xs ${deptDeleteMode === "delete" ? "bg-rose-600 text-white" : "border-rose-200 text-rose-700"}`} onClick={() => setDeptDeleteMode("delete")}>
                                Delete Categories
                              </Button>
                            </div>
                            {deptDeleteMode === "move" && (
                              <Select value={deptMoveTarget} onValueChange={setDeptMoveTarget}>
                                <SelectTrigger className="border-[#E8DDD0] h-8 text-xs"><SelectValue placeholder="Select target department..." /></SelectTrigger>
                                <SelectContent>
                                  {departmentNames.filter((d) => d !== deptDeleteTarget.name).map((dept) => (
                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return <p className="text-xs text-[#5C4A3D]">No service categories are linked to this department.</p>;
                  })()}
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-[#E8DDD0]">
                  <Button variant="outline" size="sm" onClick={() => setDeptDeleteOpen(false)} className="border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                  <Button size="sm" onClick={confirmDeptDelete} disabled={deptDeleteMode === "move" && getCategoryCountForDept(deptDeleteTarget.name) > 0 && !deptMoveTarget} className="bg-rose-600 hover:bg-rose-700 text-white">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />{deptDeleteMode === "move" && getCategoryCountForDept(deptDeleteTarget.name) > 0 ? "Move & Delete" : "Delete Department"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Manage Departments List Modal */}
      <AnimatePresence>
        {deptDrawerOpen && !deptEditTarget && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setDeptDrawerOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-[#E8DDD0]"
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#8A6A4A]" />
                    <h2 className="text-lg font-bold text-[#111111]">Manage Departments</h2>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeptDrawerOpen(false)}><X className="h-4 w-4" /></Button>
                </div>

                <Button size="sm" className="w-full bg-[#8A6A4A] hover:bg-[#6A4E37] text-white" onClick={() => { setDeptEditMode("add"); setDeptEditTarget(null); setDeptEditName(""); setDeptEditDescription(""); setDeptEditIcon("📚"); setDeptEditColor("bg-blue-50 text-blue-700 border-blue-200"); }}>
                  <Plus className="h-3.5 w-3.5 mr-1" />Add New Department
                </Button>

                <div className="space-y-2">
                  {allDepartments.map((dept) => {
                    const catCount = getCategoryCountForDept(dept.name);
                    const totalOrders = allCategories.filter((c) => c.department === dept.name).reduce((sum, c) => sum + c.orderCount, 0);
                    const totalRevenue = allCategories.filter((c) => c.department === dept.name).reduce((sum, c) => sum + c.revenue, 0);
                    return (
                      <div key={dept.id} className="rounded-lg border border-[#E8DDD0] p-3 bg-[#F5EDE3]/20 hover:bg-[#F5EDE3]/40 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-[#E8DDD0]">
                              <span className="text-xl">{dept.icon}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#111111]">{dept.name}</p>
                              <p className="text-[11px] text-[#5C4A3D] line-clamp-1">{dept.description || "No description"}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-[#5C4A3D]"><span className="font-medium text-[#111111]">{catCount}</span> categories</span>
                                <span className="text-[10px] text-[#5C4A3D]"><span className="font-medium text-[#111111]">{totalOrders}</span> orders</span>
                                <span className="text-[10px] text-[#5C4A3D]"><span className="font-medium text-[#111111]">${totalRevenue.toLocaleString()}</span></span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className={`${dept.color} gap-1 text-[10px] border`}>{dept.status}</Badge>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50" onClick={() => { openDeptDrawer(dept); }} title="Edit department">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50" onClick={() => openDeptDelete(dept)} title="Delete department">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 z-[100] px-5 py-3 rounded-xl shadow-xl border ${notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckSquare className="h-4 w-4 text-emerald-600" />
              ) : (
                <X className="h-4 w-4 text-rose-600" />
              )}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".csv,.json,.xlsx,.xls" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) processImportFile(file); e.target.value = ""; }} />
    </motion.div>
  );
}
