"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SyncedTableScroll, type SyncedTableScrollHandle } from "@/components/ui/synced-table-scroll";
import {
  Search, Tag, RefreshCw, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Eye, Edit, Trash2, Star, CheckSquare, Square, X, Plus, Download, Upload, BarChart3, PieChart,
  Activity, ArrowUpDown, CheckCircle2, Clock, Users, TrendingUp, DollarSign, BookOpen,
  SlidersHorizontal, EyeOff, Layers, ArrowDownRight, ArrowUpRight, Undo2, Redo2, Globe,
  Settings, FolderOpen, FileText, Power, PowerOff, Image, Sparkles, Zap, Crown, Heart,
  Shield, Target, Award, Briefcase, Rocket, Brain, Lightbulb, Flame, GraduationCap, Compass,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/lib/utils";
import { actionHistory } from "@/lib/action-history";
import { loadOverrides, onBookStoreChange } from "@/lib/book-store";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, LineChart, Line,
} from "recharts";

type FilterTab = "all" | "featured";

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  status: string;
  featured: boolean;
  bookCount: number;
  createdAt: string;
  coverImage?: string;
  icon?: string;
}

interface CategoryDetail {
  authors: number;
  revenue: number;
  avgSales: number;
  topBook: string;
  topAuthor: string;
  lastUpdated: string;
  topAuthors: string[];
  topBooks: string[];
  booksThisMonth: number;
  views: number;
  downloads: number;
  growthPercent: number;
  storeViews: number;
}

interface BookDetail {
  title: string;
  author: string;
  format: string;
  status: string;
  sales: number;
  publicationDate: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Business & Entrepreneurship": "💼",
  "Personal Finance": "💰",
  "Leadership": "👑",
  "Self Development": "🌱",
  "Productivity": "⚡",
  "Technology": "💻",
  "Marketing": "📢",
  "Health & Wellness": "🏥",
  "Religion & Inspiration": "✝️",
  "Biography": "📖",
  "African Literature": "🌍",
  "Fiction": "📚",
  "Poetry": "🖊️",
  "Education": "🎓",
  "Parenting & Family": "👨‍👩‍👧",
  "Science Fiction": "🚀",
  "History": "🏛️",
  "Romance": "❤️",
  "Mystery": "🔍",
  "Thriller": "🎯",
  "Fantasy": "🐉",
  "Children's Books": "🧸",
  "Young Adult": "🌟",
  "Cookbooks": "🍳",
  "Travel": "✈️",
  "Art & Design": "🎨",
  "Music": "🎵",
  "Sports & Fitness": "💪",
  "Philosophy": "🧠",
  "Psychology": "💭",
};

const DEMO_CATEGORIES: CategoryRecord[] = [
  { id: "cat-1", name: "Business & Entrepreneurship", slug: "business-entrepreneurship", description: "Books about starting and growing businesses", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 42, createdAt: "2026-01-05T10:00:00Z", icon: "💼" },
  { id: "cat-2", name: "Personal Finance", slug: "personal-finance", description: "Managing money, investing, and financial planning", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 28, createdAt: "2026-01-08T10:00:00Z", icon: "💰" },
  { id: "cat-3", name: "Leadership", slug: "leadership", description: "Leadership skills, management, and team building", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 20, createdAt: "2026-01-10T10:00:00Z", icon: "👑" },
  { id: "cat-4", name: "Self Development", slug: "self-development", description: "Personal growth, habits, and mindset", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 22, createdAt: "2026-01-12T10:00:00Z", icon: "🌱" },
  { id: "cat-5", name: "Productivity", slug: "productivity", description: "Time management and efficiency strategies", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 18, createdAt: "2026-01-15T10:00:00Z", icon: "⚡" },
  { id: "cat-6", name: "Technology & Innovation", slug: "technology-innovation", description: "Tech trends, digital transformation, and innovation", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 15, createdAt: "2026-01-18T10:00:00Z", icon: "💻" },
  { id: "cat-7", name: "Marketing & Sales", slug: "marketing-sales", description: "Marketing strategies and sales techniques", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 12, createdAt: "2026-01-20T10:00:00Z", icon: "📢" },
  { id: "cat-8", name: "Health & Wellness", slug: "health-wellness", description: "Physical and mental health guides", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 17, createdAt: "2026-02-01T10:00:00Z", icon: "🏥" },
  { id: "cat-9", name: "Religion & Inspiration", slug: "religion-inspiration", description: "Faith-based and inspirational literature", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 16, createdAt: "2026-02-05T10:00:00Z", icon: "✝️" },
  { id: "cat-10", name: "Biography & Memoir", slug: "biography-memoir", description: "Life stories and memoirs", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 10, createdAt: "2026-02-10T10:00:00Z", icon: "📖" },
  { id: "cat-11", name: "Career Development", slug: "career-development", description: "Career growth and professional advancement", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 14, createdAt: "2026-02-15T10:00:00Z", icon: "🚀" },
  { id: "cat-12", name: "Relationships & Marriage", slug: "relationships-marriage", description: "Relationship advice and marriage guides", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 11, createdAt: "2026-02-20T10:00:00Z", icon: "❤️" },
  { id: "cat-13", name: "Parenting & Family", slug: "parenting-family", description: "Guides for parents and family life", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 9, createdAt: "2026-03-01T10:00:00Z", icon: "👨‍👩‍👧" },
  { id: "cat-14", name: "Motivation", slug: "motivation", description: "Motivational and inspirational content", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 15, createdAt: "2026-03-05T10:00:00Z", icon: "🔥" },
  { id: "cat-15", name: "Investing", slug: "investing", description: "Investment strategies and wealth building", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 13, createdAt: "2026-03-10T10:00:00Z", icon: "📊" },
  { id: "cat-16", name: "Real Estate", slug: "real-estate", description: "Real estate investing and property management", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 12, createdAt: "2026-03-15T10:00:00Z", icon: "🏠" },
  { id: "cat-17", name: "Economics", slug: "economics", description: "Economic theory and analysis", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 10, createdAt: "2026-03-20T10:00:00Z", icon: "📈" },
  { id: "cat-18", name: "Sales", slug: "sales", description: "Sales techniques and strategies", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 11, createdAt: "2026-03-25T10:00:00Z", icon: "🤝" },
  { id: "cat-19", name: "Communication Skills", slug: "communication-skills", description: "Effective communication and public speaking", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 14, createdAt: "2026-04-01T10:00:00Z", icon: "🗣️" },
  { id: "cat-20", name: "Management", slug: "management", description: "Management principles and practices", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 18, createdAt: "2026-04-05T10:00:00Z", icon: "📋" },
  { id: "cat-21", name: "Education", slug: "education", description: "Educational resources and academic works", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 13, createdAt: "2026-04-10T10:00:00Z", icon: "🎓" },
  { id: "cat-22", name: "Politics", slug: "politics", description: "Political analysis and commentary", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 9, createdAt: "2026-04-15T10:00:00Z", icon: "🏛️" },
  { id: "cat-23", name: "History", slug: "history", description: "Historical accounts and analysis", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 8, createdAt: "2026-04-20T10:00:00Z", icon: "📚" },
  { id: "cat-24", name: "Science", slug: "science", description: "Scientific discoveries and explanations", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 7, createdAt: "2026-04-25T10:00:00Z", icon: "🔬" },
  { id: "cat-25", name: "Psychology", slug: "psychology", description: "Psychology and behavioral science", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 14, createdAt: "2026-05-01T10:00:00Z", icon: "🧠" },
  { id: "cat-26", name: "Fiction Writing", slug: "fiction-writing", description: "Creative fiction and storytelling", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 9, createdAt: "2026-05-05T10:00:00Z", icon: "✍️" },
  { id: "cat-27", name: "Publishing", slug: "publishing", description: "Publishing industry guides", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 10, createdAt: "2026-05-10T10:00:00Z", icon: "📑" },
  { id: "cat-28", name: "Business Strategy", slug: "business-strategy", description: "Strategic planning and business growth", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 16, createdAt: "2026-05-15T10:00:00Z", icon: "♟️" },
  { id: "cat-29", name: "Customer Service", slug: "customer-service", description: "Customer experience and service excellence", type: "BOOK", status: "ACTIVE", featured: false, bookCount: 8, createdAt: "2026-05-20T10:00:00Z", icon: "🎧" },
  { id: "cat-30", name: "Innovation", slug: "innovation", description: "Innovation and creative thinking", type: "BOOK", status: "ACTIVE", featured: true, bookCount: 7, createdAt: "2026-05-25T10:00:00Z", icon: "💡" },
];

const DEMO_CATEGORY_DETAILS: Record<string, CategoryDetail> = {
  "Business & Entrepreneurship": { authors: 18, revenue: 18240, avgSales: 434, topBook: "Income Is a Skill", topAuthor: "Hector Dewitt", lastUpdated: "2026-06-10T14:30:00Z", topAuthors: ["Hector Dewitt", "Janice Briggs", "Felix Oyekanmi"], topBooks: ["Income Is a Skill", "Wealth Is a Decision", "Entrepreneur Mindset"], booksThisMonth: 5, views: 12450, downloads: 3200, growthPercent: 18, storeViews: 8900 },
  "Personal Finance": { authors: 14, revenue: 14200, avgSales: 507, topBook: "Rich Dad Poor Dad", topAuthor: "Michael Torres", lastUpdated: "2026-06-08T11:20:00Z", topAuthors: ["Michael Torres", "David Chen", "Mark Thompson"], topBooks: ["Rich Dad Poor Dad", "The Total Money Makeover", "Think and Grow Rich"], booksThisMonth: 4, views: 9870, downloads: 2800, growthPercent: 14, storeViews: 7200 },
  "Leadership": { authors: 12, revenue: 12800, avgSales: 640, topBook: "Good to Great", topAuthor: "James Wilson", lastUpdated: "2026-06-12T09:15:00Z", topAuthors: ["James Wilson", "Pastor David Brown", "Sandra Lee"], topBooks: ["Good to Great", "The 21 Irrefutable Laws of Leadership", "Start with Why"], booksThisMonth: 3, views: 8340, downloads: 2100, growthPercent: 12, storeViews: 6100 },
  "Self Development": { authors: 16, revenue: 11500, avgSales: 523, topBook: "Atomic Habits", topAuthor: "Emma Davis", lastUpdated: "2026-06-11T16:45:00Z", topAuthors: ["Emma Davis", "Robert Kim", "Dr. Carol White"], topBooks: ["Atomic Habits", "The 7 Habits of Highly Effective People", "Mindset"], booksThisMonth: 4, views: 10200, downloads: 2600, growthPercent: 16, storeViews: 7400 },
  "Productivity": { authors: 10, revenue: 9800, avgSales: 544, topBook: "Deep Work", topAuthor: "Robert Kim", lastUpdated: "2026-06-09T13:10:00Z", topAuthors: ["Robert Kim", "Kevin Adams", "Tom Harris"], topBooks: ["Deep Work", "Getting Things Done", "The One Thing"], booksThisMonth: 3, views: 7600, downloads: 1900, growthPercent: 10, storeViews: 5500 },
  "Technology & Innovation": { authors: 11, revenue: 11200, avgSales: 747, topBook: "The Innovators", topAuthor: "Alex Johnson", lastUpdated: "2026-06-13T10:30:00Z", topAuthors: ["Alex Johnson", "Sarah Chen", "Dr. Neil Foster"], topBooks: ["The Innovators", "The Lean Startup", "Zero to One"], booksThisMonth: 3, views: 9100, downloads: 2400, growthPercent: 24, storeViews: 6700 },
  "Marketing & Sales": { authors: 9, revenue: 8400, avgSales: 700, topBook: "Influence", topAuthor: "Lisa Park", lastUpdated: "2026-06-07T15:20:00Z", topAuthors: ["Lisa Park", "Brian Miller", "Mark Thompson"], topBooks: ["Influence", "SPIN Selling", "The 22 Immutable Laws of Marketing"], booksThisMonth: 2, views: 6400, downloads: 1600, growthPercent: 9, storeViews: 4800 },
  "Health & Wellness": { authors: 13, revenue: 10600, avgSales: 624, topBook: "The Body Keeps the Score", topAuthor: "Dr. Nina Patel", lastUpdated: "2026-06-10T12:00:00Z", topAuthors: ["Dr. Nina Patel", "Emma Davis", "Dr. Karen Hughes"], topBooks: ["The Body Keeps the Score", "Atomic Habits", "The Power of Now"], booksThisMonth: 4, views: 8700, downloads: 2200, growthPercent: 15, storeViews: 6300 },
  "Religion & Inspiration": { authors: 11, revenue: 9200, avgSales: 575, topBook: "Purpose Driven Life", topAuthor: "Pastor David Brown", lastUpdated: "2026-06-06T14:45:00Z", topAuthors: ["Pastor David Brown", "Daniel Ross", "George Edwards"], topBooks: ["Purpose Driven Life", "The Total Money Makeover", "Mere Christianity"], booksThisMonth: 2, views: 6100, downloads: 1500, growthPercent: 8, storeViews: 4500 },
  "Biography & Memoir": { authors: 7, revenue: 6800, avgSales: 680, topBook: "Becoming", topAuthor: "Grace Okonkwo", lastUpdated: "2026-06-12T11:30:00Z", topAuthors: ["Grace Okonkwo", "Alex Johnson", "Maria Santos"], topBooks: ["Becoming", "Steve Jobs", "Educated"], booksThisMonth: 2, views: 5400, downloads: 1300, growthPercent: 11, storeViews: 3900 },
  "Career Development": { authors: 10, revenue: 7600, avgSales: 543, topBook: "So Good They Can't Ignore You", topAuthor: "Kevin Adams", lastUpdated: "2026-06-09T10:15:00Z", topAuthors: ["Kevin Adams", "Tom Harris", "Catherine Wong"], topBooks: ["So Good They Can't Ignore You", "The Career Manifesto", "Designing Your Life"], booksThisMonth: 2, views: 5800, downloads: 1400, growthPercent: 10, storeViews: 4200 },
  "Relationships & Marriage": { authors: 8, revenue: 6200, avgSales: 564, topBook: "The 5 Love Languages", topAuthor: "Dr. Rachel Green", lastUpdated: "2026-06-08T13:40:00Z", topAuthors: ["Dr. Rachel Green", "Dr. Karen Hughes", "Dr. Nina Patel"], topBooks: ["The 5 Love Languages", "Men Are from Mars, Women Are from Venus", "The Seven Principles for Making Marriage Work"], booksThisMonth: 1, views: 4800, downloads: 1100, growthPercent: 7, storeViews: 3500 },
  "Parenting & Family": { authors: 6, revenue: 5400, avgSales: 600, topBook: "Parenting with Purpose", topAuthor: "Maria Santos", lastUpdated: "2026-06-07T09:25:00Z", topAuthors: ["Maria Santos", "Dr. Nina Patel", "Sandra Lee"], topBooks: ["Parenting with Purpose", "The Whole-Brain Child", "How to Talk So Kids Will Listen"], booksThisMonth: 1, views: 4200, downloads: 1000, growthPercent: 6, storeViews: 3100 },
  "Motivation": { authors: 10, revenue: 8800, avgSales: 587, topBook: "Can't Hurt Me", topAuthor: "David Chen", lastUpdated: "2026-06-11T14:55:00Z", topAuthors: ["David Chen", "Daniel Ross", "Mark Thompson"], topBooks: ["Can't Hurt Me", "The Alchemist", "Think and Grow Rich"], booksThisMonth: 3, views: 7200, downloads: 1800, growthPercent: 13, storeViews: 5200 },
  "Investing": { authors: 9, revenue: 7200, avgSales: 554, topBook: "The Intelligent Investor", topAuthor: "Mark Thompson", lastUpdated: "2026-06-10T11:10:00Z", topAuthors: ["Mark Thompson", "Tom Harris", "Brian Miller"], topBooks: ["The Intelligent Investor", "A Random Walk Down Wall Street", "The Little Book of Common Sense Investing"], booksThisMonth: 2, views: 5600, downloads: 1400, growthPercent: 9, storeViews: 4100 },
  "Real Estate": { authors: 8, revenue: 6400, avgSales: 533, topBook: "Rich Dad's Guide to Investing", topAuthor: "Tom Harris", lastUpdated: "2026-06-09T15:30:00Z", topAuthors: ["Tom Harris", "Brian Miller", "Kevin Adams"], topBooks: ["Rich Dad's Guide to Investing", "The Book on Rental Property Investing", "The ABCs of Real Estate Investing"], booksThisMonth: 2, views: 4600, downloads: 1100, growthPercent: 8, storeViews: 3400 },
  "Economics": { authors: 7, revenue: 5200, avgSales: 520, topBook: "Freakonomics", topAuthor: "Dr. Alan Cooper", lastUpdated: "2026-06-06T10:45:00Z", topAuthors: ["Dr. Alan Cooper", "Daniel Ross", "Dr. Neil Foster"], topBooks: ["Freakonomics", "The Wealth of Nations", "Capital in the Twenty-First Century"], booksThisMonth: 1, views: 3800, downloads: 900, growthPercent: 5, storeViews: 2800 },
  "Sales": { authors: 9, revenue: 6000, avgSales: 545, topBook: "SPIN Selling", topAuthor: "Brian Miller", lastUpdated: "2026-06-08T12:20:00Z", topAuthors: ["Brian Miller", "Kevin Adams", "David Chen"], topBooks: ["SPIN Selling", "The Challenger Sale", "To Sell Is Human"], booksThisMonth: 2, views: 4400, downloads: 1100, growthPercent: 7, storeViews: 3200 },
  "Communication Skills": { authors: 11, revenue: 7800, avgSales: 557, topBook: "How to Win Friends", topAuthor: "Sandra Lee", lastUpdated: "2026-06-10T09:35:00Z", topAuthors: ["Sandra Lee", "Peter Grant", "Claire Mitchell"], topBooks: ["How to Win Friends and Influence People", "Crucial Conversations", "The Charisma Myth"], booksThisMonth: 2, views: 5900, downloads: 1500, growthPercent: 10, storeViews: 4300 },
  "Management": { authors: 14, revenue: 10200, avgSales: 567, topBook: "The Effective Executive", topAuthor: "Peter Grant", lastUpdated: "2026-06-11T11:50:00Z", topAuthors: ["Peter Grant", "Kevin Adams", "Catherine Wong"], topBooks: ["The Effective Executive", "High Output Management", "The One Minute Manager"], booksThisMonth: 3, views: 7800, downloads: 2000, growthPercent: 12, storeViews: 5700 },
  "Education": { authors: 10, revenue: 6600, avgSales: 508, topBook: "Mindset", topAuthor: "Dr. Carol White", lastUpdated: "2026-06-07T14:15:00Z", topAuthors: ["Dr. Carol White", "Maria Santos", "Sal Khan"], topBooks: ["Mindset", "How Children Succeed", "The One World Schoolhouse"], booksThisMonth: 2, views: 5000, downloads: 1200, growthPercent: 8, storeViews: 3700 },
  "Politics": { authors: 6, revenue: 4200, avgSales: 467, topBook: "The Art of War", topAuthor: "George Edwards", lastUpdated: "2026-06-05T10:30:00Z", topAuthors: ["George Edwards", "Daniel Ross", "Dr. Neil Foster"], topBooks: ["The Art of War", "The Prince", "Democracy in America"], booksThisMonth: 1, views: 3200, downloads: 800, growthPercent: 4, storeViews: 2400 },
  "History": { authors: 5, revenue: 3800, avgSales: 475, topBook: "Sapiens", topAuthor: "Dr. Anna Smith", lastUpdated: "2026-06-04T13:00:00Z", topAuthors: ["Dr. Anna Smith", "Dr. Neil Foster", "Jared Diamond"], topBooks: ["Sapiens", "A Brief History of Time", "Guns, Germs, and Steel"], booksThisMonth: 1, views: 3000, downloads: 750, growthPercent: 4, storeViews: 2200 },
  "Science": { authors: 4, revenue: 3200, avgSales: 457, topBook: "A Brief History of Time", topAuthor: "Dr. Neil Foster", lastUpdated: "2026-06-03T11:20:00Z", topAuthors: ["Dr. Neil Foster", "Dr. Karen Hughes", "Carl Sagan"], topBooks: ["A Brief History of Time", "The Selfish Gene", "Cosmos"], booksThisMonth: 1, views: 2600, downloads: 650, growthPercent: 3, storeViews: 1900 },
  "Psychology": { authors: 12, revenue: 8200, avgSales: 586, topBook: "Thinking, Fast and Slow", topAuthor: "Dr. Karen Hughes", lastUpdated: "2026-06-10T15:40:00Z", topAuthors: ["Dr. Karen Hughes", "Lisa Park", "Dr. Nina Patel"], topBooks: ["Thinking, Fast and Slow", "Influence", "The Power of Habit"], booksThisMonth: 3, views: 6800, downloads: 1700, growthPercent: 11, storeViews: 5000 },
  "Fiction Writing": { authors: 7, revenue: 4800, avgSales: 533, topBook: "On Writing", topAuthor: "Claire Mitchell", lastUpdated: "2026-06-08T10:10:00Z", topAuthors: ["Claire Mitchell", "Anne Lamott", "Natalie Goldberg"], topBooks: ["On Writing", "Bird by Bird", "The Elements of Style"], booksThisMonth: 2, views: 3600, downloads: 900, growthPercent: 6, storeViews: 2600 },
  "Publishing": { authors: 8, revenue: 5600, avgSales: 560, topBook: "The Elements of Style", topAuthor: "Daniel Ross", lastUpdated: "2026-06-07T12:35:00Z", topAuthors: ["Daniel Ross", "Robert Lee Brewer", "Ann Handley"], topBooks: ["The Elements of Style", "The Chicago Manual of Style", "The Writer's Market"], booksThisMonth: 2, views: 4000, downloads: 1000, growthPercent: 7, storeViews: 2900 },
  "Business Strategy": { authors: 13, revenue: 10800, avgSales: 675, topBook: "Blue Ocean Strategy", topAuthor: "Catherine Wong", lastUpdated: "2026-06-12T09:50:00Z", topAuthors: ["Catherine Wong", "Richard Rumelt", "Michael Porter"], topBooks: ["Blue Ocean Strategy", "Good Strategy Bad Strategy", "The Strategy Book"], booksThisMonth: 3, views: 8100, downloads: 2000, growthPercent: 14, storeViews: 5900 },
  "Customer Service": { authors: 6, revenue: 4400, avgSales: 550, topBook: "Delivering Happiness", topAuthor: "Joe Lewis", lastUpdated: "2026-06-06T14:05:00Z", topAuthors: ["Joe Lewis", "Danny Meyer", "Will Guidara"], topBooks: ["Delivering Happiness", "The Effortless Experience", "Setting the Table"], booksThisMonth: 1, views: 3400, downloads: 850, growthPercent: 5, storeViews: 2500 },
  "Innovation": { authors: 5, revenue: 3600, avgSales: 514, topBook: "Zero to One", topAuthor: "Ryan Carter", lastUpdated: "2026-06-05T11:25:00Z", topAuthors: ["Ryan Carter", "Sarah Chen", "Tom Kelley"], topBooks: ["Zero to One", "The Innovator's Dilemma", "Creative Confidence"], booksThisMonth: 1, views: 2800, downloads: 700, growthPercent: 5, storeViews: 2000 },
};

const DEMO_BOOK_DETAILS: Record<string, BookDetail[]> = {
  "Business & Entrepreneurship": [
    { title: "The Lean Startup", author: "Sarah Chen", format: "eBook", status: "Published", sales: 342, publicationDate: "2025-03-15T00:00:00Z" },
    { title: "Good to Great", author: "James Wilson", format: "Paperback", status: "Published", sales: 289, publicationDate: "2025-01-20T00:00:00Z" },
    { title: "Zero to One", author: "Ryan Carter", format: "Hardcover", status: "Published", sales: 256, publicationDate: "2025-05-10T00:00:00Z" },
    { title: "The E-Myth Revisited", author: "Michael Torres", format: "eBook", status: "Published", sales: 234, publicationDate: "2025-07-22T00:00:00Z" },
    { title: "Blue Ocean Strategy", author: "Catherine Wong", format: "Paperback", status: "Published", sales: 198, publicationDate: "2025-09-05T00:00:00Z" },
    { title: "Start with Why", author: "Emma Davis", format: "eBook", status: "Published", sales: 187, publicationDate: "2025-11-18T00:00:00Z" },
    { title: "The 4-Hour Workweek", author: "Robert Kim", format: "Audiobook", status: "Published", sales: 176, publicationDate: "2026-01-12T00:00:00Z" },
    { title: "Rework", author: "Alex Johnson", format: "eBook", status: "Draft", sales: 145, publicationDate: "2026-03-08T00:00:00Z" },
    { title: "The Hard Thing About Hard Things", author: "Lisa Park", format: "Paperback", status: "Published", sales: 132, publicationDate: "2025-04-30T00:00:00Z" },
    { title: "Built to Last", author: "Kevin Adams", format: "eBook", status: "Review", sales: 118, publicationDate: "2026-05-20T00:00:00Z" },
  ],
  "Personal Finance": [
    { title: "Rich Dad Poor Dad", author: "Michael Torres", format: "eBook", status: "Published", sales: 456, publicationDate: "2025-02-10T00:00:00Z" },
    { title: "The Total Money Makeover", author: "David Chen", format: "Paperback", status: "Published", sales: 321, publicationDate: "2025-04-15T00:00:00Z" },
    { title: "Think and Grow Rich", author: "Mark Thompson", format: "Hardcover", status: "Published", sales: 287, publicationDate: "2025-06-20T00:00:00Z" },
    { title: "The Millionaire Next Door", author: "Tom Harris", format: "eBook", status: "Published", sales: 234, publicationDate: "2025-08-05T00:00:00Z" },
    { title: "I Will Teach You to Be Rich", author: "Brian Miller", format: "Audiobook", status: "Published", sales: 198, publicationDate: "2025-10-12T00:00:00Z" },
    { title: "Your Money or Your Life", author: "Grace Okonkwo", format: "eBook", status: "Published", sales: 176, publicationDate: "2026-01-25T00:00:00Z" },
    { title: "The Richest Man in Babylon", author: "Daniel Ross", format: "Paperback", status: "Draft", sales: 145, publicationDate: "2026-04-18T00:00:00Z" },
  ],
  "Leadership": [
    { title: "Good to Great", author: "James Wilson", format: "Paperback", status: "Published", sales: 312, publicationDate: "2025-03-08T00:00:00Z" },
    { title: "The 21 Irrefutable Laws of Leadership", author: "Pastor David Brown", format: "eBook", status: "Published", sales: 267, publicationDate: "2025-05-22T00:00:00Z" },
    { title: "Start with Why", author: "Emma Davis", format: "Hardcover", status: "Published", sales: 234, publicationDate: "2025-07-15T00:00:00Z" },
    { title: "Dare to Lead", author: "Sandra Lee", format: "eBook", status: "Published", sales: 198, publicationDate: "2025-10-01T00:00:00Z" },
    { title: "Leaders Eat Last", author: "Peter Grant", format: "Paperback", status: "Published", sales: 176, publicationDate: "2026-01-14T00:00:00Z" },
    { title: "The Five Dysfunctions of a Team", author: "Catherine Wong", format: "eBook", status: "Review", sales: 145, publicationDate: "2026-04-28T00:00:00Z" },
  ],
  "Self Development": [
    { title: "Atomic Habits", author: "Emma Davis", format: "eBook", status: "Published", sales: 445, publicationDate: "2025-02-18T00:00:00Z" },
    { title: "The 7 Habits of Highly Effective People", author: "Robert Kim", format: "Paperback", status: "Published", sales: 378, publicationDate: "2025-04-25T00:00:00Z" },
    { title: "Mindset", author: "Dr. Carol White", format: "Hardcover", status: "Published", sales: 289, publicationDate: "2025-06-30T00:00:00Z" },
    { title: "The Power of Now", author: "Dr. Karen Hughes", format: "Audiobook", status: "Published", sales: 234, publicationDate: "2025-09-12T00:00:00Z" },
    { title: "Deep Work", author: "Robert Kim", format: "eBook", status: "Published", sales: 198, publicationDate: "2025-11-28T00:00:00Z" },
    { title: "The Subtle Art of Not Giving a F*ck", author: "Alex Johnson", format: "Paperback", status: "Published", sales: 176, publicationDate: "2026-02-15T00:00:00Z" },
    { title: "Grit", author: "Grace Okonkwo", format: "eBook", status: "Draft", sales: 145, publicationDate: "2026-05-10T00:00:00Z" },
  ],
  "Productivity": [
    { title: "Deep Work", author: "Robert Kim", format: "eBook", status: "Published", sales: 312, publicationDate: "2025-03-22T00:00:00Z" },
    { title: "Getting Things Done", author: "Kevin Adams", format: "Paperback", status: "Published", sales: 256, publicationDate: "2025-05-15T00:00:00Z" },
    { title: "The One Thing", author: "Tom Harris", format: "Hardcover", status: "Published", sales: 198, publicationDate: "2025-08-08T00:00:00Z" },
    { title: "Essentialism", author: "Catherine Wong", format: "eBook", status: "Published", sales: 176, publicationDate: "2025-11-02T00:00:00Z" },
    { title: "Atomic Habits", author: "Emma Davis", format: "Audiobook", status: "Published", sales: 145, publicationDate: "2026-01-20T00:00:00Z" },
    { title: "The Pomodoro Technique", author: "Brian Miller", format: "eBook", status: "Review", sales: 112, publicationDate: "2026-04-15T00:00:00Z" },
  ],
  "Technology & Innovation": [
    { title: "The Innovators", author: "Alex Johnson", format: "eBook", status: "Published", sales: 289, publicationDate: "2025-02-28T00:00:00Z" },
    { title: "The Lean Startup", author: "Sarah Chen", format: "Paperback", status: "Published", sales: 234, publicationDate: "2025-05-18T00:00:00Z" },
    { title: "Zero to One", author: "Ryan Carter", format: "Hardcover", status: "Published", sales: 198, publicationDate: "2025-08-02T00:00:00Z" },
    { title: "The Second Machine Age", author: "Dr. Neil Foster", format: "eBook", status: "Published", sales: 167, publicationDate: "2025-10-20T00:00:00Z" },
    { title: "The Age of AI", author: "Daniel Ross", format: "Audiobook", status: "Published", sales: 134, publicationDate: "2026-01-08T00:00:00Z" },
    { title: "Life 3.0", author: "Dr. Karen Hughes", format: "eBook", status: "Draft", sales: 98, publicationDate: "2026-04-22T00:00:00Z" },
  ],
  "Marketing & Sales": [
    { title: "Influence", author: "Lisa Park", format: "eBook", status: "Published", sales: 267, publicationDate: "2025-03-12T00:00:00Z" },
    { title: "SPIN Selling", author: "Brian Miller", format: "Paperback", status: "Published", sales: 198, publicationDate: "2025-06-05T00:00:00Z" },
    { title: "The 22 Immutable Laws of Marketing", author: "Mark Thompson", format: "eBook", status: "Published", sales: 176, publicationDate: "2025-08-28T00:00:00Z" },
    { title: "Building a StoryBrand", author: "Claire Mitchell", format: "Hardcover", status: "Published", sales: 145, publicationDate: "2025-11-15T00:00:00Z" },
    { title: "This Is Marketing", author: "David Chen", format: "Audiobook", status: "Published", sales: 112, publicationDate: "2026-02-10T00:00:00Z" },
    { title: "Contagious", author: "Sandra Lee", format: "eBook", status: "Review", sales: 87, publicationDate: "2026-05-05T00:00:00Z" },
  ],
  "Health & Wellness": [
    { title: "The Body Keeps the Score", author: "Dr. Nina Patel", format: "eBook", status: "Published", sales: 312, publicationDate: "2025-02-08T00:00:00Z" },
    { title: "Atomic Habits", author: "Emma Davis", format: "Paperback", status: "Published", sales: 267, publicationDate: "2025-04-22T00:00:00Z" },
    { title: "The Power of Now", author: "Dr. Karen Hughes", format: "Hardcover", status: "Published", sales: 198, publicationDate: "2025-07-10T00:00:00Z" },
    { title: "Why We Sleep", author: "Dr. Neil Foster", format: "Audiobook", status: "Published", sales: 176, publicationDate: "2025-09-25T00:00:00Z" },
    { title: "The Obesity Code", author: "Dr. Nina Patel", format: "eBook", status: "Published", sales: 145, publicationDate: "2025-12-08T00:00:00Z" },
    { title: "How Not to Die", author: "Grace Okonkwo", format: "Paperback", status: "Draft", sales: 112, publicationDate: "2026-03-18T00:00:00Z" },
    { title: "The China Study", author: "Dr. Carol White", format: "eBook", status: "Published", sales: 87, publicationDate: "2026-05-28T00:00:00Z" },
  ],
  "Religion & Inspiration": [
    { title: "Purpose Driven Life", author: "Pastor David Brown", format: "Paperback", status: "Published", sales: 345, publicationDate: "2025-01-15T00:00:00Z" },
    { title: "The Total Money Makeover", author: "David Chen", format: "eBook", status: "Published", sales: 234, publicationDate: "2025-04-05T00:00:00Z" },
    { title: "Mere Christianity", author: "Daniel Ross", format: "Hardcover", status: "Published", sales: 176, publicationDate: "2025-06-28T00:00:00Z" },
    { title: "The Case for Christ", author: "George Edwards", format: "eBook", status: "Published", sales: 145, publicationDate: "2025-09-15T00:00:00Z" },
    { title: "He Can Who Thinks He Can", author: "Ryan Carter", format: "Audiobook", status: "Published", sales: 112, publicationDate: "2025-12-02T00:00:00Z" },
    { title: "The Purpose Driven Life", author: "Pastor David Brown", format: "Paperback", status: "Review", sales: 87, publicationDate: "2026-03-22T00:00:00Z" },
  ],
  "Biography & Memoir": [
    { title: "Becoming", author: "Grace Okonkwo", format: "Paperback", status: "Published", sales: 267, publicationDate: "2025-03-02T00:00:00Z" },
    { title: "Steve Jobs", author: "Alex Johnson", format: "Hardcover", status: "Published", sales: 198, publicationDate: "2025-05-18T00:00:00Z" },
    { title: "Educated", author: "Maria Santos", format: "eBook", status: "Published", sales: 167, publicationDate: "2025-08-10T00:00:00Z" },
    { title: "The Diary of a Young Girl", author: "Claire Mitchell", format: "Paperback", status: "Published", sales: 134, publicationDate: "2025-10-25T00:00:00Z" },
    { title: "Long Walk to Freedom", author: "Grace Okonkwo", format: "eBook", status: "Published", sales: 112, publicationDate: "2026-01-18T00:00:00Z" },
    { title: "Born a Crime", author: "David Chen", format: "Audiobook", status: "Draft", sales: 87, publicationDate: "2026-04-12T00:00:00Z" },
  ],
  "Career Development": [
    { title: "So Good They Can't Ignore You", author: "Kevin Adams", format: "eBook", status: "Published", sales: 234, publicationDate: "2025-02-22T00:00:00Z" },
    { title: "The Career Manifesto", author: "Tom Harris", format: "Paperback", status: "Published", sales: 176, publicationDate: "2025-05-10T00:00:00Z" },
    { title: "Designing Your Life", author: "Catherine Wong", format: "Hardcover", status: "Published", sales: 145, publicationDate: "2025-08-02T00:00:00Z" },
    { title: "What Color Is Your Parachute?", author: "Brian Miller", format: "eBook", status: "Published", sales: 112, publicationDate: "2025-10-28T00:00:00Z" },
    { title: "The New Rules of Work", author: "Sandra Lee", format: "Audiobook", status: "Review", sales: 87, publicationDate: "2026-02-05T00:00:00Z" },
    { title: "Range", author: "Peter Grant", format: "eBook", status: "Published", sales: 67, publicationDate: "2026-05-15T00:00:00Z" },
  ],
  "Relationships & Marriage": [
    { title: "The 5 Love Languages", author: "Dr. Rachel Green", format: "Paperback", status: "Published", sales: 289, publicationDate: "2025-01-28T00:00:00Z" },
    { title: "Men Are from Mars, Women Are from Venus", author: "Dr. Karen Hughes", format: "eBook", status: "Published", sales: 212, publicationDate: "2025-04-15T00:00:00Z" },
    { title: "The Seven Principles for Making Marriage Work", author: "Dr. Nina Patel", format: "Hardcover", status: "Published", sales: 167, publicationDate: "2025-07-08T00:00:00Z" },
    { title: "Attached", author: "Grace Okonkwo", format: "eBook", status: "Published", sales: 134, publicationDate: "2025-10-02T00:00:00Z" },
    { title: "Hold Me Tight", author: "Dr. Rachel Green", format: "Audiobook", status: "Draft", sales: 98, publicationDate: "2026-01-22T00:00:00Z" },
    { title: "The Relationship Cure", author: "Claire Mitchell", format: "eBook", status: "Review", sales: 76, publicationDate: "2026-04-18T00:00:00Z" },
  ],
  "Parenting & Family": [
    { title: "Parenting with Purpose", author: "Maria Santos", format: "Paperback", status: "Published", sales: 198, publicationDate: "2025-02-15T00:00:00Z" },
    { title: "The Whole-Brain Child", author: "Dr. Nina Patel", format: "eBook", status: "Published", sales: 156, publicationDate: "2025-05-08T00:00:00Z" },
    { title: "How to Talk So Kids Will Listen", author: "Sandra Lee", format: "Hardcover", status: "Published", sales: 123, publicationDate: "2025-08-02T00:00:00Z" },
    { title: "No-Drama Discipline", author: "Dr. Rachel Green", format: "eBook", status: "Published", sales: 98, publicationDate: "2025-10-22T00:00:00Z" },
    { title: "The Explosive Child", author: "Dr. Carol White", format: "Audiobook", status: "Published", sales: 76, publicationDate: "2026-01-15T00:00:00Z" },
    { title: "Positive Discipline", author: "Maria Santos", format: "Paperback", status: "Review", sales: 54, publicationDate: "2026-04-28T00:00:00Z" },
  ],
  "Motivation": [
    { title: "Can't Hurt Me", author: "David Chen", format: "Hardcover", status: "Published", sales: 345, publicationDate: "2025-01-10T00:00:00Z" },
    { title: "The Alchemist", author: "Daniel Ross", format: "Paperback", status: "Published", sales: 289, publicationDate: "2025-03-28T00:00:00Z" },
    { title: "Think and Grow Rich", author: "Mark Thompson", format: "eBook", status: "Published", sales: 234, publicationDate: "2025-06-15T00:00:00Z" },
    { title: "The Power of Positive Thinking", author: "Pastor David Brown", format: "Audiobook", status: "Published", sales: 176, publicationDate: "2025-09-02T00:00:00Z" },
    { title: "Awaken the Giant Within", author: "Kevin Adams", format: "eBook", status: "Published", sales: 145, publicationDate: "2025-11-20T00:00:00Z" },
    { title: "You Are a Badass", author: "Claire Mitchell", format: "Paperback", status: "Draft", sales: 112, publicationDate: "2026-02-08T00:00:00Z" },
    { title: "The Motivation Myth", author: "Tom Harris", format: "eBook", status: "Published", sales: 87, publicationDate: "2026-05-02T00:00:00Z" },
  ],
  "Investing": [
    { title: "The Intelligent Investor", author: "Mark Thompson", format: "Hardcover", status: "Published", sales: 267, publicationDate: "2025-02-05T00:00:00Z" },
    { title: "A Random Walk Down Wall Street", author: "Tom Harris", format: "eBook", status: "Published", sales: 198, publicationDate: "2025-04-28T00:00:00Z" },
    { title: "The Little Book of Common Sense Investing", author: "Brian Miller", format: "Paperback", status: "Published", sales: 167, publicationDate: "2025-07-15T00:00:00Z" },
    { title: "One Up on Wall Street", author: "Michael Torres", format: "eBook", status: "Published", sales: 134, publicationDate: "2025-10-08T00:00:00Z" },
    { title: "The Bogleheads' Guide to Investing", author: "Peter Grant", format: "Audiobook", status: "Published", sales: 112, publicationDate: "2026-01-22T00:00:00Z" },
    { title: "Common Stocks and Uncommon Profits", author: "Mark Thompson", format: "eBook", status: "Review", sales: 87, publicationDate: "2026-04-15T00:00:00Z" },
    { title: "Beating the Street", author: "Kevin Adams", format: "Paperback", status: "Draft", sales: 67, publicationDate: "2026-06-01T00:00:00Z" },
  ],
  "Real Estate": [
    { title: "Rich Dad's Guide to Investing", author: "Tom Harris", format: "Hardcover", status: "Published", sales: 234, publicationDate: "2025-03-18T00:00:00Z" },
    { title: "The Book on Rental Property Investing", author: "Brian Miller", format: "eBook", status: "Published", sales: 189, publicationDate: "2025-06-05T00:00:00Z" },
    { title: "The ABCs of Real Estate Investing", author: "Kevin Adams", format: "Paperback", status: "Published", sales: 156, publicationDate: "2025-08-28T00:00:00Z" },
    { title: "The Millionaire Real Estate Investor", author: "Mark Thompson", format: "eBook", status: "Published", sales: 123, publicationDate: "2025-11-12T00:00:00Z" },
    { title: "Building Wealth One House at a Time", author: "Michael Torres", format: "Audiobook", status: "Published", sales: 98, publicationDate: "2026-02-05T00:00:00Z" },
    { title: "The Real Estate Game", author: "Peter Grant", format: "eBook", status: "Review", sales: 76, publicationDate: "2026-05-20T00:00:00Z" },
  ],
  "Economics": [
    { title: "Freakonomics", author: "Dr. Alan Cooper", format: "Paperback", status: "Published", sales: 212, publicationDate: "2025-02-12T00:00:00Z" },
    { title: "The Wealth of Nations", author: "Daniel Ross", format: "Hardcover", status: "Published", sales: 167, publicationDate: "2025-05-08T00:00:00Z" },
    { title: "Capital in the Twenty-First Century", author: "Dr. Neil Foster", format: "eBook", status: "Published", sales: 134, publicationDate: "2025-08-02T00:00:00Z" },
    { title: "The Undercover Economist", author: "Dr. Alan Cooper", format: "Paperback", status: "Published", sales: 112, publicationDate: "2025-10-25T00:00:00Z" },
    { title: "Naked Economics", author: "George Edwards", format: "eBook", status: "Draft", sales: 87, publicationDate: "2026-01-18T00:00:00Z" },
    { title: "Economics in One Lesson", author: "Dr. Neil Foster", format: "Audiobook", status: "Review", sales: 67, publicationDate: "2026-04-12T00:00:00Z" },
  ],
  "Sales": [
    { title: "SPIN Selling", author: "Brian Miller", format: "Paperback", status: "Published", sales: 267, publicationDate: "2025-01-22T00:00:00Z" },
    { title: "The Challenger Sale", author: "Kevin Adams", format: "eBook", status: "Published", sales: 212, publicationDate: "2025-04-10T00:00:00Z" },
    { title: "To Sell Is Human", author: "David Chen", format: "Hardcover", status: "Published", sales: 176, publicationDate: "2025-06-28T00:00:00Z" },
    { title: "The Psychology of Selling", author: "Mark Thompson", format: "eBook", status: "Published", sales: 145, publicationDate: "2025-09-15T00:00:00Z" },
    { title: "Secrets of Closing the Sale", author: "Tom Harris", format: "Paperback", status: "Published", sales: 112, publicationDate: "2025-12-05T00:00:00Z" },
    { title: "Influence", author: "Lisa Park", format: "Audiobook", status: "Review", sales: 87, publicationDate: "2026-03-18T00:00:00Z" },
    { title: "Fanatical Prospecting", author: "Brian Miller", format: "eBook", status: "Draft", sales: 67, publicationDate: "2026-05-28T00:00:00Z" },
  ],
  "Communication Skills": [
    { title: "How to Win Friends and Influence People", author: "Sandra Lee", format: "Paperback", status: "Published", sales: 312, publicationDate: "2025-02-02T00:00:00Z" },
    { title: "Crucial Conversations", author: "Peter Grant", format: "eBook", status: "Published", sales: 234, publicationDate: "2025-04-18T00:00:00Z" },
    { title: "The Charisma Myth", author: "Claire Mitchell", format: "Hardcover", status: "Published", sales: 176, publicationDate: "2025-07-08T00:00:00Z" },
    { title: "Never Split the Difference", author: "Chris Voss", format: "eBook", status: "Published", sales: 145, publicationDate: "2025-10-02T00:00:00Z" },
    { title: "Talk Like TED", author: "Catherine Wong", format: "Audiobook", status: "Published", sales: 112, publicationDate: "2026-01-15T00:00:00Z" },
    { title: "The Art of Communication", author: "Sandra Lee", format: "Paperback", status: "Review", sales: 87, publicationDate: "2026-04-08T00:00:00Z" },
    { title: "Presence", author: "Dr. Karen Hughes", format: "eBook", status: "Published", sales: 67, publicationDate: "2026-06-05T00:00:00Z" },
  ],
  "Management": [
    { title: "The Effective Executive", author: "Peter Grant", format: "Hardcover", status: "Published", sales: 267, publicationDate: "2025-01-18T00:00:00Z" },
    { title: "High Output Management", author: "Kevin Adams", format: "eBook", status: "Published", sales: 212, publicationDate: "2025-04-05T00:00:00Z" },
    { title: "The One Minute Manager", author: "Tom Harris", format: "Paperback", status: "Published", sales: 176, publicationDate: "2025-06-22T00:00:00Z" },
    { title: "First, Break All the Rules", author: "Catherine Wong", format: "eBook", status: "Published", sales: 145, publicationDate: "2025-09-08T00:00:00Z" },
    { title: "The Making of a Manager", author: "Julie Zhuo", format: "Paperback", status: "Published", sales: 112, publicationDate: "2025-11-28T00:00:00Z" },
    { title: "Turn the Ship Around!", author: "David Marquet", format: "Audiobook", status: "Draft", sales: 87, publicationDate: "2026-02-18T00:00:00Z" },
    { title: "Radical Candor", author: "Kim Scott", format: "eBook", status: "Review", sales: 67, publicationDate: "2026-05-12T00:00:00Z" },
    { title: "An Everyone Culture", author: "Peter Grant", format: "Paperback", status: "Published", sales: 54, publicationDate: "2026-06-10T00:00:00Z" },
  ],
  "Education": [
    { title: "Mindset", author: "Dr. Carol White", format: "eBook", status: "Published", sales: 234, publicationDate: "2025-02-28T00:00:00Z" },
    { title: "How Children Succeed", author: "Maria Santos", format: "Paperback", status: "Published", sales: 176, publicationDate: "2025-05-15T00:00:00Z" },
    { title: "The One World Schoolhouse", author: "Sal Khan", format: "Hardcover", status: "Published", sales: 145, publicationDate: "2025-08-08T00:00:00Z" },
    { title: "Creating Innovators", author: "Tony Wagner", format: "eBook", status: "Published", sales: 112, publicationDate: "2025-11-02T00:00:00Z" },
    { title: "Most Likely to Succeed", author: "Tony Wagner", format: "Paperback", status: "Draft", sales: 87, publicationDate: "2026-02-08T00:00:00Z" },
    { title: "The End of College", author: "Kevin Carey", format: "Audiobook", status: "Review", sales: 67, publicationDate: "2026-05-22T00:00:00Z" },
  ],
  "Politics": [
    { title: "The Art of War", author: "George Edwards", format: "Hardcover", status: "Published", sales: 189, publicationDate: "2025-03-05T00:00:00Z" },
    { title: "The Prince", author: "Daniel Ross", format: "Paperback", status: "Published", sales: 145, publicationDate: "2025-05-28T00:00:00Z" },
    { title: "Democracy in America", author: "George Edwards", format: "eBook", status: "Published", sales: 112, publicationDate: "2025-08-15T00:00:00Z" },
    { title: "The Federalist Papers", author: "Daniel Ross", format: "Paperback", status: "Published", sales: 87, publicationDate: "2025-11-05T00:00:00Z" },
    { title: "On Liberty", author: "Dr. Neil Foster", format: "eBook", status: "Draft", sales: 67, publicationDate: "2026-02-18T00:00:00Z" },
    { title: "The Republic", author: "Daniel Ross", format: "Hardcover", status: "Review", sales: 54, publicationDate: "2026-05-10T00:00:00Z" },
  ],
  "History": [
    { title: "Sapiens", author: "Dr. Anna Smith", format: "Paperback", status: "Published", sales: 234, publicationDate: "2025-01-25T00:00:00Z" },
    { title: "A Brief History of Time", author: "Dr. Neil Foster", format: "Hardcover", status: "Published", sales: 189, publicationDate: "2025-04-12T00:00:00Z" },
    { title: "Guns, Germs, and Steel", author: "Jared Diamond", format: "eBook", status: "Published", sales: 156, publicationDate: "2025-07-05T00:00:00Z" },
    { title: "The Lessons of History", author: "Dr. Anna Smith", format: "Paperback", status: "Published", sales: 123, publicationDate: "2025-10-02T00:00:00Z" },
    { title: "The Silk Roads", author: "Peter Frankopan", format: "eBook", status: "Published", sales: 98, publicationDate: "2026-01-15T00:00:00Z" },
    { title: "The Dawn of Everything", author: "Graeber & Wengrow", format: "Audiobook", status: "Review", sales: 76, publicationDate: "2026-04-28T00:00:00Z" },
  ],
  "Science": [
    { title: "A Brief History of Time", author: "Dr. Neil Foster", format: "Hardcover", status: "Published", sales: 267, publicationDate: "2025-02-18T00:00:00Z" },
    { title: "The Selfish Gene", author: "Dr. Neil Foster", format: "Paperback", status: "Published", sales: 189, publicationDate: "2025-05-08T00:00:00Z" },
    { title: "Cosmos", author: "Carl Sagan", format: "eBook", status: "Published", sales: 145, publicationDate: "2025-08-02T00:00:00Z" },
    { title: "The Origin of Species", author: "Charles Darwin", format: "Paperback", status: "Published", sales: 112, publicationDate: "2025-10-25T00:00:00Z" },
    { title: "Thinking, Fast and Slow", author: "Dr. Karen Hughes", format: "eBook", status: "Published", sales: 87, publicationDate: "2026-01-18T00:00:00Z" },
    { title: "The Structure of Scientific Revolutions", author: "Thomas Kuhn", format: "Audiobook", status: "Draft", sales: 67, publicationDate: "2026-04-12T00:00:00Z" },
  ],
  "Psychology": [
    { title: "Thinking, Fast and Slow", author: "Dr. Karen Hughes", format: "eBook", status: "Published", sales: 312, publicationDate: "2025-01-08T00:00:00Z" },
    { title: "Influence", author: "Lisa Park", format: "Paperback", status: "Published", sales: 256, publicationDate: "2025-03-25T00:00:00Z" },
    { title: "The Power of Habit", author: "Charles Duhigg", format: "Hardcover", status: "Published", sales: 198, publicationDate: "2025-06-12T00:00:00Z" },
    { title: "Emotional Intelligence", author: "Daniel Goleman", format: "eBook", status: "Published", sales: 167, publicationDate: "2025-08-28T00:00:00Z" },
    { title: "Flow", author: "Mihaly Csikszentmihalyi", format: "Audiobook", status: "Published", sales: 134, publicationDate: "2025-11-15T00:00:00Z" },
    { title: "Man's Search for Meaning", author: "Viktor Frankl", format: "Paperback", status: "Published", sales: 112, publicationDate: "2026-02-08T00:00:00Z" },
    { title: "The Body Keeps the Score", author: "Dr. Nina Patel", format: "eBook", status: "Review", sales: 87, publicationDate: "2026-05-22T00:00:00Z" },
  ],
  "Fiction Writing": [
    { title: "On Writing", author: "Claire Mitchell", format: "Paperback", status: "Published", sales: 198, publicationDate: "2025-02-12T00:00:00Z" },
    { title: "Bird by Bird", author: "Anne Lamott", format: "eBook", status: "Published", sales: 156, publicationDate: "2025-05-05T00:00:00Z" },
    { title: "The Elements of Style", author: "Strunk & White", format: "Hardcover", status: "Published", sales: 123, publicationDate: "2025-07-28T00:00:00Z" },
    { title: "Steering the Craft", author: "Ursula K. Le Guin", format: "eBook", status: "Published", sales: 98, publicationDate: "2025-10-15T00:00:00Z" },
    { title: "Writing Down the Bones", author: "Natalie Goldberg", format: "Paperback", status: "Draft", sales: 76, publicationDate: "2026-01-08T00:00:00Z" },
    { title: "The Writing Life", author: "Annie Dillard", format: "Audiobook", status: "Review", sales: 54, publicationDate: "2026-04-02T00:00:00Z" },
    { title: "Several Short Sentences About Writing", author: "Verlyn Klinkenborg", format: "eBook", status: "Published", sales: 43, publicationDate: "2026-06-08T00:00:00Z" },
  ],
  "Publishing": [
    { title: "The Elements of Style", author: "Strunk & White", format: "Hardcover", status: "Published", sales: 212, publicationDate: "2025-01-22T00:00:00Z" },
    { title: "The Chicago Manual of Style", author: "University of Chicago", format: "Paperback", status: "Published", sales: 167, publicationDate: "2025-04-10T00:00:00Z" },
    { title: "The Writer's Market", author: "Robert Lee Brewer", format: "eBook", status: "Published", sales: 134, publicationDate: "2025-06-28T00:00:00Z" },
    { title: "Self-Editing for Fiction Writers", author: "Renni Browne", format: "Paperback", status: "Published", sales: 112, publicationDate: "2025-09-15T00:00:00Z" },
    { title: "The First Five Pages", author: "Noah Lukeman", format: "eBook", status: "Published", sales: 87, publicationDate: "2025-12-05T00:00:00Z" },
    { title: "How to Write a Book Proposal", author: "Michael Larsen", format: "Audiobook", status: "Draft", sales: 67, publicationDate: "2026-03-18T00:00:00Z" },
    { title: "The Forest for the Trees", author: "Betsy Lerner", format: "eBook", status: "Review", sales: 54, publicationDate: "2026-05-28T00:00:00Z" },
    { title: "Everybody Writes", author: "Ann Handley", format: "Paperback", status: "Published", sales: 43, publicationDate: "2026-06-12T00:00:00Z" },
  ],
  "Business Strategy": [
    { title: "Blue Ocean Strategy", author: "Catherine Wong", format: "Hardcover", status: "Published", sales: 289, publicationDate: "2025-01-15T00:00:00Z" },
    { title: "Good Strategy Bad Strategy", author: "Richard Rumelt", format: "eBook", status: "Published", sales: 234, publicationDate: "2025-03-28T00:00:00Z" },
    { title: "The Strategy Book", author: "Max McKeown", format: "Paperback", status: "Published", sales: 189, publicationDate: "2025-06-15T00:00:00Z" },
    { title: "Playing to Win", author: "A.G. Lafley", format: "eBook", status: "Published", sales: 156, publicationDate: "2025-09-02T00:00:00Z" },
    { title: "The Art of Strategy", author: "Avinash Dixit", format: "Hardcover", status: "Published", sales: 123, publicationDate: "2025-11-20T00:00:00Z" },
    { title: "Strategy Maps", author: "Robert Kaplan", format: "Paperback", status: "Draft", sales: 98, publicationDate: "2026-02-12T00:00:00Z" },
    { title: "The Balanced Scorecard", author: "Robert Kaplan", format: "eBook", status: "Review", sales: 76, publicationDate: "2026-05-05T00:00:00Z" },
    { title: "Competitive Strategy", author: "Michael Porter", format: "Audiobook", status: "Published", sales: 67, publicationDate: "2026-06-01T00:00:00Z" },
    { title: "HBR Guide to Strategy", author: "Harvard Business Review", format: "Paperback", status: "Published", sales: 54, publicationDate: "2026-06-10T00:00:00Z" },
  ],
  "Customer Service": [
    { title: "Delivering Happiness", author: "Joe Lewis", format: "Paperback", status: "Published", sales: 198, publicationDate: "2025-02-08T00:00:00Z" },
    { title: "The Effortless Experience", author: "Dixon & Toman", format: "eBook", status: "Published", sales: 156, publicationDate: "2025-05-02T00:00:00Z" },
    { title: "Setting the Table", author: "Danny Meyer", format: "Hardcover", status: "Published", sales: 123, publicationDate: "2025-07-22T00:00:00Z" },
    { title: "The Service Profit Chain", author: "Heskett et al.", format: "eBook", status: "Published", sales: 98, publicationDate: "2025-10-08T00:00:00Z" },
    { title: "Exceptional Service, Exceptional Profit", author: "Inghilleri & Solomon", format: "Paperback", status: "Draft", sales: 76, publicationDate: "2026-01-22T00:00:00Z" },
    { title: "Unreasonable Hospitality", author: "Will Guidara", format: "Audiobook", status: "Review", sales: 54, publicationDate: "2026-05-15T00:00:00Z" },
  ],
  "Innovation": [
    { title: "Zero to One", author: "Ryan Carter", format: "Hardcover", status: "Published", sales: 267, publicationDate: "2025-01-28T00:00:00Z" },
    { title: "The Innovator's Dilemma", author: "Clayton Christensen", format: "eBook", status: "Published", sales: 198, publicationDate: "2025-04-15T00:00:00Z" },
    { title: "Creative Confidence", author: "Tom & David Kelley", format: "Paperback", status: "Published", sales: 156, publicationDate: "2025-07-05T00:00:00Z" },
    { title: "The Lean Startup", author: "Sarah Chen", format: "eBook", status: "Published", sales: 123, publicationDate: "2025-09-22T00:00:00Z" },
    { title: "Where Good Ideas Come From", author: "Steven Johnson", format: "Audiobook", status: "Published", sales: 98, publicationDate: "2025-12-10T00:00:00Z" },
    { title: "The Ten Faces of Innovation", author: "Tom Kelley", format: "Paperback", status: "Review", sales: 76, publicationDate: "2026-03-25T00:00:00Z" },
  ],
};

const CHART_COLORS = ["#D8B27A", "#8A6A4A", "#EBC9A8", "#5C4A3D", "#F2D8BE", "#1D1D1D", "#B8956A", "#A0784C", "#D4C4B0", "#6B5B4A"];

const BOOK_COVER_COLORS: Record<string, string> = {
  "Business & Entrepreneurship": "bg-[#2D5F8A]",
  "Personal Finance": "bg-[#2A7B4F]",
  "Leadership": "bg-[#8B4513]",
  "Self Development": "bg-[#6B3A8A]",
  "Productivity": "bg-[#3D7A5A]",
  "Technology & Innovation": "bg-[#1A5276]",
  "Marketing & Sales": "bg-[#C0392B]",
  "Health & Wellness": "bg-[#27AE60]",
  "Religion & Inspiration": "bg-[#8E6B3D]",
  "Biography & Memoir": "bg-[#5D4E37]",
  "Career Development": "bg-[#1565C0]",
  "Relationships & Marriage": "bg-[#C0506E]",
  "Parenting & Family": "bg-[#E67E22]",
  "Motivation": "bg-[#D35400]",
  "Investing": "bg-[#2E86C1]",
  "Real Estate": "bg-[#1ABC9C]",
  "Economics": "bg-[#34495E]",
  "Sales": "bg-[#E74C3C]",
  "Communication Skills": "bg-[#8E44AD]",
  "Management": "bg-[#2C3E50]",
  "Education": "bg-[#00695C]",
  "Politics": "bg-[#7F8C8D]",
  "History": "bg-[#5D4037]",
  "Science": "bg-[#0D47A1]",
  "Psychology": "bg-[#6A1B9A]",
  "Fiction Writing": "bg-[#4A148C]",
  "Publishing": "bg-[#37474F]",
  "Business Strategy": "bg-[#1B5E20]",
  "Customer Service": "bg-[#00838F]",
  "Innovation": "bg-[#FF6F00]",
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allCategories, setAllCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const [drawerCategory, setDrawerCategory] = useState<CategoryRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CategoryRecord | null>(null);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editIcon, setEditIcon] = useState("💼");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [editIconColor, setEditIconColor] = useState("#8A6A4A");
  const [editBgColor, setEditBgColor] = useState("#F5EDE3");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");
  const [deleteBulkMode, setDeleteBulkMode] = useState(false);

  const [booksModalOpen, setBooksModalOpen] = useState(false);
  const [booksModalCategory, setBooksModalCategory] = useState<string>("");
  const [booksModalPage, setBooksModalPage] = useState(1);

  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [sortFilter, setSortFilter] = useState({ sort: "" });
  const [filterBookCount, setFilterBookCount] = useState("");
  const [filterRevenue, setFilterRevenue] = useState("");
  const [filterCreatedDate, setFilterCreatedDate] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [filterFormat, setFilterFormat] = useState("");

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id: string; name: string; bulk: boolean } | null>(null);

  const stickyRef = useRef<HTMLDivElement>(null);
  const tableScroll = useRef<SyncedTableScrollHandle>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSortFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Global Undo/Redo listeners
  useEffect(() => {
    const handleUndo = (e: CustomEvent) => {
      const action = e.detail;
      if (action.entity === "category" && action.previousState) {
        setAllCategories(action.previousState);
      }
    };
    const handleRedo = (e: CustomEvent) => {
      const action = e.detail;
      if (action.entity === "category" && action.newState) {
        setAllCategories(action.newState);
      }
    };
    window.addEventListener("action-undo", handleUndo as EventListener);
    window.addEventListener("action-redo", handleRedo as EventListener);
    return () => {
      window.removeEventListener("action-undo", handleUndo as EventListener);
      window.removeEventListener("action-redo", handleRedo as EventListener);
    };
  }, []);

  // Data sync: listen to book-status-changed events from Book Management page
  useEffect(() => {
    return onBookStoreChange(() => {
      // When books are published/unpublished/archived, recompute stats
      setAllCategories((prev) => [...prev]);
    });
  }, []);

  const bookCategories = useMemo(() => allCategories.filter((c) => c.type === "BOOK"), [allCategories]);
  const filteredCategories = useMemo(() => {
    let cats = bookCategories;
    if (activeTab === "featured") cats = cats.filter((c) => c.featured);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      cats = cats.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    // Filter groups
    if (filterBookCount === "0-10") cats = cats.filter((c) => c.bookCount >= 0 && c.bookCount <= 10);
    else if (filterBookCount === "11-25") cats = cats.filter((c) => c.bookCount >= 11 && c.bookCount <= 25);
    else if (filterBookCount === "26-50") cats = cats.filter((c) => c.bookCount >= 26 && c.bookCount <= 50);
    else if (filterBookCount === "50+") cats = cats.filter((c) => c.bookCount > 50);
    if (filterFeatured === "featured") cats = cats.filter((c) => c.featured);
    else if (filterFeatured === "non-featured") cats = cats.filter((c) => !c.featured);
    if (filterCreatedDate) {
      const now = new Date();
      cats = cats.filter((c) => {
        const d = new Date(c.createdAt);
        if (filterCreatedDate === "week") return (now.getTime() - d.getTime()) < 7 * 86400000;
        if (filterCreatedDate === "month") return (now.getTime() - d.getTime()) < 30 * 86400000;
        if (filterCreatedDate === "year") return (now.getTime() - d.getTime()) < 365 * 86400000;
        return true;
      });
    }
    if (filterRevenue) {
      cats = cats.filter((c) => {
        const detail = DEMO_CATEGORY_DETAILS[c.name];
        const rev = detail?.revenue ?? 0;
        if (filterRevenue === "under-1k") return rev < 1000;
        if (filterRevenue === "1k-5k") return rev >= 1000 && rev < 5000;
        if (filterRevenue === "5k-10k") return rev >= 5000 && rev < 10000;
        if (filterRevenue === "10k+") return rev >= 10000;
        return true;
      });
    }
    if (filterFormat) {
      cats = cats.filter((c) => {
        const books = DEMO_BOOK_DETAILS[c.name] || [];
        if (filterFormat === "ebook") return books.some((b) => b.format === "eBook");
        if (filterFormat === "paperback") return books.some((b) => b.format === "Paperback");
        if (filterFormat === "hardcover") return books.some((b) => b.format === "Hardcover");
        if (filterFormat === "audiobook") return books.some((b) => b.format === "Audiobook");
        return true;
      });
    }
    // Sort
    if (sortFilter.sort === "name_asc") cats = [...cats].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortFilter.sort === "name_desc") cats = [...cats].sort((a, b) => b.name.localeCompare(a.name));
    else if (sortFilter.sort === "books_desc") cats = [...cats].sort((a, b) => b.bookCount - a.bookCount);
    else if (sortFilter.sort === "books_asc") cats = [...cats].sort((a, b) => a.bookCount - b.bookCount);
    else if (sortFilter.sort === "date_desc") cats = [...cats].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortFilter.sort === "date_asc") cats = [...cats].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    else if (sortFilter.sort === "featured_first") cats = [...cats].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    else if (sortFilter.sort === "non_featured_first") cats = [...cats].sort((a, b) => (a.featured ? 1 : 0) - (b.featured ? 1 : 0));
    else if (sortFilter.sort === "most_revenue") cats = [...cats].sort((a, b) => (DEMO_CATEGORY_DETAILS[b.name]?.revenue ?? 0) - (DEMO_CATEGORY_DETAILS[a.name]?.revenue ?? 0));
    else if (sortFilter.sort === "least_revenue") cats = [...cats].sort((a, b) => (DEMO_CATEGORY_DETAILS[a.name]?.revenue ?? 0) - (DEMO_CATEGORY_DETAILS[b.name]?.revenue ?? 0));
    else if (sortFilter.sort === "most_popular") cats = [...cats].sort((a, b) => (DEMO_CATEGORY_DETAILS[b.name]?.views ?? 0) - (DEMO_CATEGORY_DETAILS[a.name]?.views ?? 0));
    else if (sortFilter.sort === "least_popular") cats = [...cats].sort((a, b) => (DEMO_CATEGORY_DETAILS[a.name]?.views ?? 0) - (DEMO_CATEGORY_DETAILS[b.name]?.views ?? 0));
    else if (sortFilter.sort === "recently_updated") cats = [...cats].sort((a, b) => (DEMO_CATEGORY_DETAILS[b.name]?.lastUpdated ?? b.createdAt).localeCompare(DEMO_CATEGORY_DETAILS[a.name]?.lastUpdated ?? a.createdAt));
    else if (sortFilter.sort === "least_recently_updated") cats = [...cats].sort((a, b) => (DEMO_CATEGORY_DETAILS[a.name]?.lastUpdated ?? a.createdAt).localeCompare(DEMO_CATEGORY_DETAILS[b.name]?.lastUpdated ?? b.createdAt));
    return cats;
  }, [bookCategories, activeTab, debouncedSearch, sortFilter, filterBookCount, filterRevenue, filterCreatedDate, filterFeatured, filterFormat]);

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, page, pageSize]);

  const stats = useMemo(() => {
    const total = bookCategories.length;
    const featured = bookCategories.filter((c) => c.featured).length;
    const totalBooks = bookCategories.reduce((s, c) => s + c.bookCount, 0);
    const formats = 4;
    return { total, featured, totalBooks, formats };
  }, [bookCategories]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setAllCategories(DEMO_CATEGORIES);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { setPage(1); }, [activeTab, debouncedSearch, sortFilter, filterBookCount, filterRevenue, filterCreatedDate, filterFeatured, filterFormat]);

  useEffect(() => {
    tableScroll.current?.scrollToTop();
  }, [page]);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedCategories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedCategories.map((c) => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkFeature = () => {
    const previousState = [...allCategories];
    const selectedCats = allCategories.filter((c) => selectedIds.has(c.id));
    setAllCategories((prev) => prev.map((c) => selectedIds.has(c.id) ? { ...c, featured: true } : c));
    actionHistory.pushAction({
      action: "feature",
      entity: "category",
      entityName: `${selectedCats.length} categories`,
      description: `Featured ${selectedCats.length} categor${selectedCats.length === 1 ? "y" : "ies"}`,
      previousState,
      newState: allCategories.map((c) => selectedIds.has(c.id) ? { ...c, featured: true } : c),
    });
    setSelectedIds(new Set());
  };

  const handleBulkUnfeature = () => {
    const previousState = [...allCategories];
    const selectedCats = allCategories.filter((c) => selectedIds.has(c.id));
    setAllCategories((prev) => prev.map((c) => selectedIds.has(c.id) ? { ...c, featured: false } : c));
    actionHistory.pushAction({
      action: "unfeature",
      entity: "category",
      entityName: `${selectedCats.length} categories`,
      description: `Unfeatured ${selectedCats.length} categor${selectedCats.length === 1 ? "y" : "ies"}`,
      previousState,
      newState: allCategories.map((c) => selectedIds.has(c.id) ? { ...c, featured: false } : c),
    });
    setSelectedIds(new Set());
  };

  const handleBulkExport = () => {
    const selected = filteredCategories.filter((c) => selectedIds.has(c.id));
    const csv = ["Name,Books,Featured,Created"].concat(selected.map((c) => `"${c.name}",${c.bookCount},${c.featured},"${c.createdAt}"`)).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "categories-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkDelete = () => {
    setDeleteBulkMode(true);
    setDeleteTargetName(`${selectedIds.size} selected categories`);
    setDeleteDialogOpen(true);
  };

  const handleToggleFeatured = (cat: CategoryRecord) => {
    const previousState = [...allCategories];
    const newState = allCategories.map((c) => c.id === cat.id ? { ...c, featured: !c.featured } : c);
    setAllCategories(newState);
    actionHistory.pushAction({
      action: cat.featured ? "unfeature" : "feature",
      entity: "category",
      entityName: cat.name,
      description: `${cat.featured ? "Unfeatured" : "Featured"} "${cat.name}"`,
      previousState,
      newState,
    });
  };

  const handleDeleteCategory = () => {
    const previousState = [...allCategories];
    if (deleteBulkMode) {
      const deletedNames = allCategories.filter((c) => selectedIds.has(c.id)).map((c) => c.name);
      const newState = allCategories.filter((c) => !selectedIds.has(c.id));
      setAllCategories(newState);
      actionHistory.pushAction({
        action: "delete",
        entity: "category",
        entityName: `${deletedNames.length} categories`,
        description: `Deleted ${deletedNames.length} categor${deletedNames.length === 1 ? "y" : "ies"}`,
        previousState,
        newState,
      });
      setSelectedIds(new Set());
    } else if (deleteTarget) {
      const cat = allCategories.find((c) => c.id === deleteTarget);
      const newState = allCategories.filter((c) => c.id !== deleteTarget);
      setAllCategories(newState);
      actionHistory.pushAction({
        action: "delete",
        entity: "category",
        entityName: cat?.name || "Category",
        description: `Deleted "${cat?.name || "category"}"`,
        previousState,
        newState,
      });
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
    setDeleteTargetName("");
    setDeleteBulkMode(false);
  };

  const handleSaveCategory = () => {
    if (!editName.trim()) return;
    const previousState = [...allCategories];
    if (editMode === "edit" && editTarget) {
      const oldName = editTarget.name;
      const newState = allCategories.map((c) => c.id === editTarget.id ? { ...c, name: editName, description: editDescription, featured: editFeatured, icon: editIcon, coverImage: editCoverImage } : c);
      setAllCategories(newState);
      actionHistory.pushAction({
        action: "edit",
        entity: "category",
        entityName: editName,
        description: `Edited "${oldName}" → "${editName}"`,
        previousState,
        newState,
      });
    } else {
      const newCat: CategoryRecord = {
        id: `cat-${Date.now()}`,
        name: editName,
        slug: editName.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"),
        description: editDescription,
        type: "BOOK",
        status: "ACTIVE",
        featured: editFeatured,
        bookCount: 0,
        createdAt: new Date().toISOString(),
        icon: editIcon,
        coverImage: editCoverImage,
      };
      const newState = [newCat, ...allCategories];
      setAllCategories(newState);
      actionHistory.pushAction({
        action: "create",
        entity: "category",
        entityName: editName,
        description: `Created category "${editName}"`,
        previousState,
        newState,
      });
    }
    setEditModalOpen(false);
    setEditTarget(null);
    setEditName("");
    setEditDescription("");
    setEditFeatured(false);
    setEditIcon("💼");
    setEditCoverImage("");
  };

  const openEditModal = (cat?: CategoryRecord) => {
    if (cat) {
      setEditMode("edit");
      setEditTarget(cat);
      setEditName(cat.name);
      setEditDescription(cat.description);
      setEditFeatured(cat.featured);
      setEditIcon(cat.icon || "💼");
      setEditCoverImage(cat.coverImage || "");
      setEditIconColor("#8A6A4A");
      setEditBgColor("#F5EDE3");
    } else {
      setEditMode("add");
      setEditTarget(null);
      setEditName("");
      setEditDescription("");
      setEditFeatured(false);
      setEditIcon("💼");
      setEditCoverImage("");
      setEditIconColor("#8A6A4A");
      setEditBgColor("#F5EDE3");
    }
    setEditModalOpen(true);
  };

  const getBooksForCategory = (catName: string): BookDetail[] => {
    return DEMO_BOOK_DETAILS[catName] || [];
  };

  const booksForModal = getBooksForCategory(booksModalCategory);
  const booksModalPageSize = 10;
  const booksModalTotalPages = Math.ceil(booksForModal.length / booksModalPageSize);
  const booksModalPaginated = booksForModal.slice((booksModalPage - 1) * booksModalPageSize, booksModalPage * booksModalPageSize);

  const analyticsData = useMemo(() => {
    const byBooks = [...bookCategories].sort((a, b) => b.bookCount - a.bookCount).slice(0, 8);
    const topByRevenue = bookCategories.slice(0, 5).map((c) => ({ name: c.name.length > 15 ? c.name.slice(0, 15) + "..." : c.name, revenue: DEMO_CATEGORY_DETAILS[c.name]?.revenue || 0 }));
    const formatData = [
      { name: "eBook", value: 245, color: "#D8B27A" },
      { name: "Paperback", value: 189, color: "#8A6A4A" },
      { name: "Hardcover", value: 78, color: "#EBC9A8" },
      { name: "Audiobook", value: 45, color: "#5C4A3D" },
    ];
    const growthData = [
      { month: "Jan", categories: 18 }, { month: "Feb", categories: 22 }, { month: "Mar", categories: 25 },
      { month: "Apr", categories: 27 }, { month: "May", categories: 29 }, { month: "Jun", categories: 30 },
    ];
    return { byBooks, topByRevenue, formatData, growthData };
  }, [bookCategories]);

  const formatCurrencyLocal = (val: number) => `$${val.toLocaleString("en-US")}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#8A6A4A]" />
          <p className="text-[#5C4A3D] font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1D1D1D]">Book Categories</h1>
          <p className="text-sm text-[#5C4A3D]">Manage book categories and collections</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setAnalyticsOpen(!analyticsOpen)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics {analyticsOpen ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
          </Button>
          <Button size="sm" onClick={() => openEditModal()} className="bg-[#8A6A4A] hover:bg-[#6B5340] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Categories", value: stats.total, icon: Tag, color: "text-[#8A6A4A]", bg: "bg-[#F5EDE3]", onClick: () => { setActiveTab("all"); setSortFilter({ sort: "" }); setFilterBookCount(""); setFilterRevenue(""); setFilterCreatedDate(""); setFilterFeatured(""); setFilterFormat(""); } },
          { label: "Featured Categories", value: stats.featured, icon: Star, color: "text-[#D8B27A]", bg: "bg-[#FFF8EE]", onClick: () => { setActiveTab("featured"); setSortFilter({ sort: "featured_first" }); } },
          { label: "Categorized Books", value: stats.totalBooks, icon: BookOpen, color: "text-[#5C4A3D]", bg: "bg-[#F5EDE3]", onClick: () => { setActiveTab("all"); setSortFilter({ sort: "books_desc" }); } },
          { label: "Book Formats", value: stats.formats, icon: Layers, color: "text-[#8A6A4A]", bg: "bg-[#FFF8EE]", onClick: () => { setActiveTab("all"); setFilterFormat(filterFormat ? "" : "ebook"); } },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="border border-[#E8DDD0] bg-white cursor-pointer hover:shadow-md transition-shadow" onClick={stat.onClick}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#5C4A3D] uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#1D1D1D] mt-1">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Center */}
      <AnimatePresence>
        {analyticsOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="analytics-dropdown-border rounded-[15px] p-[2.5px]">
              <div className="bg-white rounded-[13px] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[#1D1D1D]">Category Analytics</h3>
                  <Button variant="ghost" size="sm" onClick={() => setAnalyticsOpen(false)} className="text-[#5C4A3D]">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Books by Category */}
                  <div>
                    <h4 className="text-sm font-medium text-[#5C4A3D] mb-3">Books by Category</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.byBooks} layout="vertical" margin={{ left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                          <XAxis type="number" tick={{ fontSize: 11, fill: "#5C4A3D" }} />
                          <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fill: "#5C4A3D" }} />
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          <Tooltip formatter={(value: any) => [`${value} books`, "Books"]} contentStyle={{ borderRadius: 8, border: "1px solid #E8DDD0" }} />
                          <Bar dataKey="bookCount" radius={[0, 4, 4, 0]}>
                            {analyticsData.byBooks.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Categories by Revenue */}
                  <div>
                    <h4 className="text-sm font-medium text-[#5C4A3D] mb-3">Top Categories by Revenue</h4>
                    <div className="space-y-3">
                      {analyticsData.topByRevenue.map((cat, i) => (
                        <div key={cat.name} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: CHART_COLORS[i] }}>
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-[#1D1D1D]">{cat.name}</span>
                              <span className="text-sm font-semibold text-[#8A6A4A]">{formatCurrencyLocal(cat.revenue)}</span>
                            </div>
                            <div className="mt-1 h-1.5 bg-[#F2D8BE]/30 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${(cat.revenue / 18500) * 100}%`, backgroundColor: CHART_COLORS[i] }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Most Viewed */}
                  <div>
                    <h4 className="text-sm font-medium text-[#5C4A3D] mb-3">Most Viewed Category</h4>
                    <div className="p-4 bg-[#F5EDE3] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#8A6A4A] rounded-lg">
                          <Eye className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1D1D1D]">Business & Entrepreneurship</p>
                          <p className="text-sm text-[#5C4A3D]">12,450 views this month</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fastest Growing */}
                  <div>
                    <h4 className="text-sm font-medium text-[#5C4A3D] mb-3">Fastest Growing Category</h4>
                    <div className="p-4 bg-[#F5EDE3] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#D8B27A] rounded-lg">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1D1D1D]">Technology & Innovation</p>
                          <p className="text-sm text-emerald-600 font-medium">+24% this month</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book Formats Distribution */}
                  <div>
                    <h4 className="text-sm font-medium text-[#5C4A3D] mb-3">Book Formats Distribution</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          <Pie data={analyticsData.formatData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={(props: any) => `${props.name}: ${props.value}`}>
                            {analyticsData.formatData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          <Tooltip formatter={(value: any) => [`${value} books`, "Count"]} contentStyle={{ borderRadius: 8, border: "1px solid #E8DDD0" }} />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Category Growth */}
                  <div>
                    <h4 className="text-sm font-medium text-[#5C4A3D] mb-3">Category Growth</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.growthData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5C4A3D" }} />
                          <YAxis tick={{ fontSize: 11, fill: "#5C4A3D" }} />
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          <Tooltip formatter={(value: any) => [`${value} categories`, "Categories"]} contentStyle={{ borderRadius: 8, border: "1px solid #E8DDD0" }} />
                          <Line type="monotone" dataKey="categories" stroke="#8A6A4A" strokeWidth={2} dot={{ fill: "#D8B27A", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#8A6A4A" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top 5 Categories by Books */}
                  <div>
                    <h4 className="text-sm font-medium text-[#5C4A3D] mb-3">Top 5 Categories by Books</h4>
                    <div className="space-y-3">
                      {analyticsData.byBooks.slice(0, 5).map((cat, i) => (
                        <div key={cat.name} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: CHART_COLORS[i] }}>
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-[#1D1D1D]">{cat.name}</span>
                              <span className="text-sm font-semibold text-[#8A6A4A]">{cat.bookCount} books</span>
                            </div>
                            <div className="mt-1 h-1.5 bg-[#F2D8BE]/30 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${(cat.bookCount / 42) * 100}%`, backgroundColor: CHART_COLORS[i] }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Most Featured Category */}
                  <div>
                    <h4 className="text-sm font-medium text-[#5C4A3D] mb-3">Most Featured Category</h4>
                    <div className="p-4 bg-[#F5EDE3] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#D8B27A] rounded-lg">
                          <Star className="h-5 w-5 text-white fill-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1D1D1D]">Business & Entrepreneurship</p>
                          <p className="text-sm text-[#5C4A3D]">Featured since Jan 2026</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Newest Category */}
                  <div>
                    <h4 className="text-sm font-medium text-[#5C4A3D] mb-3">Newest Category</h4>
                    <div className="p-4 bg-[#F5EDE3] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1D1D1D]">Innovation</p>
                          <p className="text-sm text-[#5C4A3D]">Created May 25, 2026</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Oldest Category */}
                  <div>
                    <h4 className="text-sm font-medium text-[#5C4A3D] mb-3">Oldest Category</h4>
                    <div className="p-4 bg-[#F5EDE3] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#8A6A4A] rounded-lg">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1D1D1D]">Business & Entrepreneurship</p>
                          <p className="text-sm text-[#5C4A3D]">Created Jan 5, 2026</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Filter Bar */}
      <div ref={stickyRef} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] -mx-6 px-6 py-3 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A6A4A]" />
              <Input placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 border-[#E8DDD0] focus:border-[#D8B27A] focus:ring-[#D8B27A]/20" />
            </div>
            {/* Sort & Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button variant="outline" size="sm" onClick={() => setSortFilterOpen(!sortFilterOpen)} className="border-[#E8DDD0] text-[#5C4A3D] hover:bg-[#F5EDE3]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {sortFilter.sort || filterBookCount || filterRevenue || filterCreatedDate || filterFeatured || filterFormat ? "Filtered" : "Sort & Filter"}
                {(sortFilter.sort || filterBookCount || filterRevenue || filterCreatedDate || filterFeatured || filterFormat) && <X className="h-3 w-3 ml-2" onClick={(e) => { e.stopPropagation(); setSortFilter({ sort: "" }); setFilterBookCount(""); setFilterRevenue(""); setFilterCreatedDate(""); setFilterFeatured(""); setFilterFormat(""); }} />}
              </Button>
              {sortFilterOpen && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-[#E8DDD0] rounded-xl shadow-lg z-50 p-2 max-h-[480px] overflow-y-auto">
                  <p className="text-xs font-semibold text-[#5C4A3D] uppercase tracking-wider px-2 py-1.5">Sort By</p>
                  {[
                    { value: "name_asc", label: "Name A-Z" },
                    { value: "name_desc", label: "Name Z-A" },
                    { value: "books_desc", label: "Most Books" },
                    { value: "books_asc", label: "Least Books" },
                    { value: "date_desc", label: "Newest First" },
                    { value: "date_asc", label: "Oldest First" },
                    { value: "featured_first", label: "Featured First" },
                    { value: "non_featured_first", label: "Non-Featured First" },
                    { value: "most_revenue", label: "Most Revenue" },
                    { value: "least_revenue", label: "Least Revenue" },
                    { value: "most_popular", label: "Most Popular" },
                    { value: "least_popular", label: "Least Popular" },
                    { value: "recently_updated", label: "Recently Updated" },
                    { value: "least_recently_updated", label: "Least Recently Updated" },
                  ].map((opt) => (
                    <button key={opt.value} onClick={() => { setSortFilter({ sort: sortFilter.sort === opt.value ? "" : opt.value }); setSortFilterOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${sortFilter.sort === opt.value ? "bg-[#8A6A4A] text-white" : "text-[#1D1D1D] hover:bg-[#F5EDE3]"}`}>
                      {opt.label}
                    </button>
                  ))}
                  <div className="border-t border-[#E8DDD0] my-2" />
                  <p className="text-xs font-semibold text-[#5C4A3D] uppercase tracking-wider px-2 py-1.5">Filter By</p>
                  <div className="px-2 pb-2 space-y-2">
                    <div>
                      <label className="text-xs text-[#8A6A4A] font-medium">Book Count</label>
                      <Select value={filterBookCount} onValueChange={setFilterBookCount}>
                        <SelectTrigger className="h-8 text-xs border-[#E8DDD0] mt-1"><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent className="bg-white border-[#E8DDD0]"><SelectItem value="0-10">0 - 10 books</SelectItem><SelectItem value="11-25">11 - 25 books</SelectItem><SelectItem value="26-50">26 - 50 books</SelectItem><SelectItem value="50+">50+ books</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-[#8A6A4A] font-medium">Revenue</label>
                      <Select value={filterRevenue} onValueChange={setFilterRevenue}>
                        <SelectTrigger className="h-8 text-xs border-[#E8DDD0] mt-1"><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent className="bg-white border-[#E8DDD0]"><SelectItem value="under-1k">Under $1K</SelectItem><SelectItem value="1k-5k">$1K - $5K</SelectItem><SelectItem value="5k-10k">$5K - $10K</SelectItem><SelectItem value="10k+">$10K+</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-[#8A6A4A] font-medium">Created Date</label>
                      <Select value={filterCreatedDate} onValueChange={setFilterCreatedDate}>
                        <SelectTrigger className="h-8 text-xs border-[#E8DDD0] mt-1"><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent className="bg-white border-[#E8DDD0]"><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem><SelectItem value="year">This Year</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-[#8A6A4A] font-medium">Featured Status</label>
                      <Select value={filterFeatured} onValueChange={setFilterFeatured}>
                        <SelectTrigger className="h-8 text-xs border-[#E8DDD0] mt-1"><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent className="bg-white border-[#E8DDD0]"><SelectItem value="featured">Featured</SelectItem><SelectItem value="non-featured">Non-Featured</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-[#8A6A4A] font-medium">Format Usage</label>
                      <Select value={filterFormat} onValueChange={setFilterFormat}>
                        <SelectTrigger className="h-8 text-xs border-[#E8DDD0] mt-1"><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent className="bg-white border-[#E8DDD0]"><SelectItem value="ebook">eBook</SelectItem><SelectItem value="paperback">Paperback</SelectItem><SelectItem value="hardcover">Hardcover</SelectItem><SelectItem value="audiobook">Audiobook</SelectItem></SelectContent>
                      </Select>
                    </div>
                    {(filterBookCount || filterRevenue || filterCreatedDate || filterFeatured || filterFormat) && (
                      <Button variant="ghost" size="sm" className="w-full text-xs text-red-500 hover:text-red-700" onClick={() => { setFilterBookCount(""); setFilterRevenue(""); setFilterCreatedDate(""); setFilterFeatured(""); setFilterFormat(""); }}>
                        <X className="h-3 w-3 mr-1" /> Clear All Filters
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <Select onValueChange={(v) => { if (v === "create") openEditModal(); else if (v === "export") handleBulkExport(); }}>
                <SelectTrigger className="w-40 border-[#E8DDD0] text-[#5C4A3D]">
                  <Zap className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Quick Actions" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E8DDD0] rounded-xl shadow-lg">
                  <SelectItem value="create">Create Category</SelectItem>
                  <SelectItem value="import">Import Categories</SelectItem>
                  <SelectItem value="export">Export Categories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList className="bg-[#F5EDE3]">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#1D1D1D]">All Categories ({stats.total})</TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-white data-[state=active]:text-[#1D1D1D]">Featured ({stats.featured})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Strip */}
      <div className="flex items-center justify-between text-sm text-[#5C4A3D]">
        <p>Showing {paginatedCategories.length} of {filteredCategories.length} categories</p>
        <div className="flex items-center gap-4">
          <span>{stats.total} Categories</span>
          <span>{stats.featured} Featured</span>
          <span>{stats.totalBooks} Books</span>
          {(filterBookCount || filterRevenue || filterCreatedDate || filterFeatured || filterFormat) && (
            <span className="text-[#8A6A4A] font-medium">Filters active</span>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-3 bg-[#F5EDE3] rounded-xl border border-[#E8DDD0]">
          <span className="text-sm font-medium text-[#5C4A3D]">{selectedIds.size} selected</span>
          <Button size="sm" variant="outline" onClick={handleBulkFeature} className="border-[#E8DDD0] text-[#5C4A3D]"><Star className="h-3 w-3 mr-1" /> Feature</Button>
          <Button size="sm" variant="outline" onClick={handleBulkUnfeature} className="border-[#E8DDD0] text-[#5C4A3D]"><EyeOff className="h-3 w-3 mr-1" /> Unfeature</Button>
          <Button size="sm" variant="outline" onClick={handleBulkExport} className="border-[#E8DDD0] text-[#5C4A3D]"><Download className="h-3 w-3 mr-1" /> Export</Button>
          <Button size="sm" variant="outline" onClick={handleBulkDelete} className="border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
        </motion.div>
      )}

      {/* Table */}
      <SyncedTableScroll ref={tableScroll} loading={loading}>
        <Table className="bg-white">
          <TableHeader>
            <TableRow className="border-b border-black/12">
              <TableHead className="w-10">
                <button onClick={toggleSelectAll} className="text-[#8A6A4A]">
                  {selectedIds.size === paginatedCategories.length && paginatedCategories.length > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>
              </TableHead>
              <TableHead className="text-[#111111] font-semibold">Category</TableHead>
              <TableHead className="text-[#111111] font-semibold text-center">Books</TableHead>
              <TableHead className="text-[#111111] font-semibold">Created</TableHead>
              <TableHead className="text-[#111111] font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Tag className="h-12 w-12 text-[#D8B27A] mx-auto mb-3" />
                  <p className="text-[#111111] font-medium">No categories found</p>
                  <p className="text-sm text-[#5C4A3D]">Try adjusting your search or filters.</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCategories.map((cat) => (
                <TableRow key={cat.id} className="border-b border-black/12 hover:bg-black/[0.02] transition-colors">
                  <TableCell>
                    <button onClick={() => toggleSelect(cat.id)} className="text-[#8A6A4A]">
                      {selectedIds.has(cat.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F5EDE3] flex items-center justify-center text-lg">
                        {CATEGORY_ICONS[cat.name] || "📁"}
                      </div>
                      <div>
                        <p className="font-medium text-[#111111]">{cat.name}</p>
                        <p className="text-xs text-[#5C4A3D] truncate max-w-[300px]">{cat.description}</p>
                      </div>
                      {cat.featured && <Star className="h-4 w-4 text-[#D8B27A] fill-[#D8B27A]" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button onClick={() => { setBooksModalCategory(cat.name); setBooksModalPage(1); setBooksModalOpen(true); }} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5EDE3] text-[#8A6A4A] font-medium text-sm hover:bg-[#E8DDD0] transition-colors cursor-pointer">
                      <BookOpen className="h-3 w-3" />
                      {cat.bookCount}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm text-[#5C4A3D]">{formatDate(cat.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setDrawerCategory(cat); setDrawerOpen(true); }} className="h-8 w-8 p-0 text-[#5C4A3D] hover:text-[#111111]"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(cat)} className="h-8 w-8 p-0 text-[#5C4A3D] hover:text-[#111111]"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleFeatured(cat)} className="h-8 w-8 p-0 text-[#D8B27A] hover:text-[#8A6A4A]"><Star className={`h-4 w-4 ${cat.featured ? "fill-[#D8B27A]" : ""}`} /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { setDeleteTarget(cat.id); setDeleteTargetName(cat.name); setDeleteDialogOpen(true); }} className="h-8 w-8 p-0 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </SyncedTableScroll>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#5C4A3D]">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="border-[#E8DDD0]"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="border-[#E8DDD0]"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {/* Category Detail Drawer */}
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
                  <h2 className="text-lg font-bold text-[#1D1D1D]">Category Details</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
                </div>

                {/* Category Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#F5EDE3] flex items-center justify-center text-3xl shadow-sm flex-shrink-0">
                    {CATEGORY_ICONS[drawerCategory.name] || "📁"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-[#1D1D1D] leading-tight">{drawerCategory.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{drawerCategory.description}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="border-[#D8B27A]/30 text-[#8A6A4A] gap-1">
                        <Tag className="h-3 w-3" />Book Category
                      </Badge>
                      {drawerCategory.featured && (
                        <Badge variant="outline" className="border-[#D8B27A] text-[#D8B27A] gap-1 bg-[#FFF8EE]">
                          <Star className="h-3 w-3 fill-[#D8B27A]" />Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category Information */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Category Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Category Name", value: drawerCategory.name, icon: Tag },
                      { label: "Description", value: drawerCategory.description.length > 30 ? drawerCategory.description.slice(0, 30) + "..." : drawerCategory.description, icon: FileText },
                      { label: "Category Icon", value: CATEGORY_ICONS[drawerCategory.name] || "📁", icon: Sparkles },
                      { label: "Total Books", value: drawerCategory.bookCount.toLocaleString(), icon: BookOpen },
                      { label: "Total Authors", value: (DEMO_CATEGORY_DETAILS[drawerCategory.name]?.authors || 0).toLocaleString(), icon: Users },
                      { label: "Featured Status", value: drawerCategory.featured ? "Yes" : "No", icon: Star },
                      { label: "Date Created", value: formatDate(drawerCategory.createdAt, "long"), icon: Clock },
                      { label: "Last Updated", value: formatDate(DEMO_CATEGORY_DETAILS[drawerCategory.name]?.lastUpdated || drawerCategory.createdAt, "long"), icon: Clock },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-0.5"><f.icon className="h-3 w-3" />{f.label}</div>
                        <p className="text-xs font-medium text-[#1D1D1D]">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Performance</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Revenue", value: formatCurrencyLocal(DEMO_CATEGORY_DETAILS[drawerCategory.name]?.revenue || 0), icon: DollarSign, color: "text-emerald-600" },
                      { label: "Avg Sales", value: (DEMO_CATEGORY_DETAILS[drawerCategory.name]?.avgSales || 0).toLocaleString(), icon: TrendingUp, color: "text-blue-600" },
                      { label: "Books", value: drawerCategory.bookCount.toLocaleString(), icon: BookOpen, color: "text-[#8A6A4A]" },
                      { label: "Authors", value: (DEMO_CATEGORY_DETAILS[drawerCategory.name]?.authors || 0).toLocaleString(), icon: Users, color: "text-violet-600" },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5 text-center">
                        <f.icon className={`h-3.5 w-3.5 mx-auto mb-0.5 ${f.color}`} />
                        <p className="text-sm font-bold text-[#1D1D1D]">{f.value}</p>
                        <p className="text-[10px] text-muted-foreground">{f.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Performers */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Top Performers</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1"><BookOpen className="h-3 w-3" />Most Popular Book</div>
                      <p className="text-xs font-bold text-[#1D1D1D]">{DEMO_CATEGORY_DETAILS[drawerCategory.name]?.topBook || "N/A"}</p>
                    </div>
                    <div className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1"><Users className="h-3 w-3" />Most Active Author</div>
                      <p className="text-xs font-bold text-[#1D1D1D]">{DEMO_CATEGORY_DETAILS[drawerCategory.name]?.topAuthor || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Top Authors */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Top Authors</h4>
                  <div className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5">
                    <ul className="space-y-1.5">
                      {(DEMO_CATEGORY_DETAILS[drawerCategory.name]?.topAuthors || []).map((author, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-[#1D1D1D]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8A6A4A] flex-shrink-0" />
                          {author}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Top Books */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Top Books</h4>
                  <div className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5">
                    <ul className="space-y-1.5">
                      {(DEMO_CATEGORY_DETAILS[drawerCategory.name]?.topBooks || []).map((book, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-[#1D1D1D]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D8B27A] flex-shrink-0" />
                          {book}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Performance Panel */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Performance Overview</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Books This Month", value: (DEMO_CATEGORY_DETAILS[drawerCategory.name]?.booksThisMonth || 0).toLocaleString(), icon: BookOpen, color: "text-[#8A6A4A]" },
                      { label: "Revenue", value: formatCurrencyLocal(DEMO_CATEGORY_DETAILS[drawerCategory.name]?.revenue || 0), icon: DollarSign, color: "text-emerald-600" },
                      { label: "Growth %", value: `+${DEMO_CATEGORY_DETAILS[drawerCategory.name]?.growthPercent || 0}%`, icon: TrendingUp, color: "text-blue-600" },
                      { label: "Store Views", value: (DEMO_CATEGORY_DETAILS[drawerCategory.name]?.storeViews || 0).toLocaleString(), icon: Eye, color: "text-violet-600" },
                      { label: "Downloads", value: (DEMO_CATEGORY_DETAILS[drawerCategory.name]?.downloads || 0).toLocaleString(), icon: Download, color: "text-amber-600" },
                      { label: "Featured", value: drawerCategory.featured ? "Yes" : "No", icon: Star, color: "text-[#D8B27A]" },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-[#D8B27A]/15 p-2.5 bg-[#F2D8BE]/5 text-center">
                        <f.icon className={`h-3.5 w-3.5 mx-auto mb-0.5 ${f.color}`} />
                        <p className="text-sm font-bold text-[#1D1D1D]">{f.value}</p>
                        <p className="text-[10px] text-muted-foreground">{f.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Sparkline - Monthly Activity */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Monthly Activity</h4>
                  <div className="rounded-lg border border-[#D8B27A]/15 p-3 bg-[#F2D8BE]/5">
                    <div className="flex items-end gap-1.5 h-16">
                      {[35, 52, 41, 68, 75, 82].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full rounded-t" style={{ height: `${h}%`, backgroundColor: i === 5 ? "#8A6A4A" : "#D8B27A" }} />
                          <span className="text-[8px] text-muted-foreground">{["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-[#D8B27A]/15 flex-wrap">
                  <Button size="sm" className="flex-1 bg-[#8A6A4A] hover:bg-[#6B5340] text-white" onClick={() => { setDrawerOpen(false); openEditModal(drawerCategory); }}>
                    <Edit className="h-3.5 w-3.5 mr-1" />Edit Category
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-[#D8B27A]/30 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => { handleToggleFeatured(drawerCategory); setDrawerCategory({ ...drawerCategory, featured: !drawerCategory.featured }); }}>
                    <Star className={`h-3.5 w-3.5 mr-1 ${drawerCategory.featured ? "fill-[#D8B27A]" : ""}`} />{drawerCategory.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-[#8A6A4A]/20 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => {
                    const details = DEMO_CATEGORY_DETAILS[drawerCategory.name];
                    const csv = ["Field", "Value"].concat([
                      ["Name", drawerCategory.name],
                      ["Description", drawerCategory.description],
                      ["Books", String(drawerCategory.bookCount)],
                      ["Authors", String(details?.authors || 0)],
                      ["Revenue", formatCurrencyLocal(details?.revenue || 0)],
                      ["Avg Sales", String(details?.avgSales || 0)],
                      ["Featured", drawerCategory.featured ? "Yes" : "No"],
                      ["Created", drawerCategory.createdAt],
                    ].map(r => r.join(","))).join("\n");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${drawerCategory.slug}-export.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}>
                    <Download className="h-3.5 w-3.5 mr-1" />Export
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-[#8A6A4A]/20 text-[#8A6A4A] hover:bg-[#F2D8BE]/50" onClick={() => setDrawerOpen(false)}>Close</Button>
                </div>

                {/* Activity Timeline */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A6A4A] mb-2">Activity Timeline</h4>
                  <div className="space-y-2.5 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-[#E8DDD0]">
                    {[
                      { date: drawerCategory.createdAt, event: "Category created", icon: Plus, color: "bg-blue-100 text-blue-600" },
                      { date: DEMO_CATEGORY_DETAILS[drawerCategory.name]?.lastUpdated || drawerCategory.createdAt, event: "Last updated", icon: RefreshCw, color: "bg-amber-100 text-amber-600" },
                      ...(drawerCategory.featured ? [{ date: DEMO_CATEGORY_DETAILS[drawerCategory.name]?.lastUpdated || drawerCategory.createdAt, event: "Marked as featured", icon: Star, color: "bg-[#FFF3E0] text-[#D8B27A]" }] : []),
                    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((ev, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div className={`absolute -left-4 top-0.5 rounded-full p-0.5 ${ev.color}`}><ev.icon className="h-2.5 w-2.5" /></div>
                        <div className="ml-1">
                          <p className="text-xs font-medium text-[#1D1D1D]">{ev.event}</p>
                          <p className="text-[10px] text-muted-foreground">{formatDate(ev.date, "long")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setEditModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#1D1D1D]">{editMode === "edit" ? "Edit Category" : "Create Category"}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setEditModalOpen(false)}><X className="h-5 w-5" /></Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#5C4A3D]">Name</label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Category name" className="mt-1 border-[#E8DDD0]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#5C4A3D]">Description</label>
                    <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" className="mt-1 border-[#E8DDD0]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#5C4A3D]">Icon</label>
                    <div className="grid grid-cols-10 gap-2 mt-2">
                      {Object.values(CATEGORY_ICONS).slice(0, 20).map((icon) => (
                        <button key={icon} onClick={() => setEditIcon(icon)} className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${editIcon === icon ? "bg-[#8A6A4A] ring-2 ring-[#D8B27A] scale-110" : "bg-[#F5EDE3] hover:bg-[#E8DDD0]"}`}>
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#5C4A3D]">Icon Color</label>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {["#8A6A4A", "#D8B27A", "#E74C3C", "#3498DB", "#2ECC71", "#9B59B6", "#F39C12", "#1ABC9C", "#E67E22", "#2C3E50"].map((color) => (
                        <button key={color} onClick={() => setEditIconColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all ${editIconColor === color ? "border-[#1D1D1D] scale-110" : "border-transparent"}`} style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#5C4A3D]">Background Color</label>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {["#F5EDE3", "#E8F5E9", "#FFF3E0", "#E3F2FD", "#FCE4EC", "#F3E5F5", "#E0F2F1", "#FFF8E1", "#EFEBE9", "#ECEFF1"].map((color) => (
                        <button key={color} onClick={() => setEditBgColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all ${editBgColor === color ? "border-[#8A6A4A] scale-110" : "border-[#E8DDD0]"}`} style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#5C4A3D]">Cover Image URL</label>
                    <Input value={editCoverImage} onChange={(e) => setEditCoverImage(e.target.value)} placeholder="https://..." className="mt-1 border-[#E8DDD0]" />
                    {editCoverImage && (
                      <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-[#F5EDE3] flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={editCoverImage} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="featured" checked={editFeatured} onChange={(e) => setEditFeatured(e.target.checked)} className="rounded border-[#E8DDD0]" />
                    <label htmlFor="featured" className="text-sm font-medium text-[#5C4A3D]">Featured Category</label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSaveCategory} className="flex-1 bg-[#8A6A4A] hover:bg-[#6B5340] text-white">{editMode === "edit" ? "Save Changes" : "Create Category"}</Button>
                  <Button variant="outline" onClick={() => setEditModalOpen(false)} className="flex-1 border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setDeleteDialogOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg"><Trash2 className="h-5 w-5 text-red-500" /></div>
                  <h2 className="text-lg font-bold text-[#1D1D1D]">{deleteBulkMode ? "Delete Categories" : "Delete Category"}</h2>
                </div>
                <p className="text-sm text-[#5C4A3D]">{deleteBulkMode ? <>Delete <strong>{selectedIds.size} selected categories</strong>? This action cannot be undone.</> : <>Are you sure you want to delete <strong>{deleteTargetName}</strong>? This action cannot be undone.</>}</p>
                <div className="flex gap-3">
                  <Button onClick={handleDeleteCategory} className="flex-1 bg-red-500 hover:bg-red-600 text-white">Delete</Button>
                  <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeleteBulkMode(false); }} className="flex-1 border-[#E8DDD0] text-[#5C4A3D]">Cancel</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Books Modal */}
      <AnimatePresence>
        {booksModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setBooksModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-[#E8DDD0]">
                  <div>
                    <h2 className="text-lg font-bold text-[#1D1D1D]">{booksModalCategory}</h2>
                    <p className="text-sm text-[#5C4A3D]">{booksForModal.length} books in this category</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setBooksModalOpen(false)}><X className="h-5 w-5" /></Button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#E8DDD0]">
                        <TableHead className="text-[#5C4A3D] font-semibold w-12">Cover</TableHead>
                        <TableHead className="text-[#5C4A3D] font-semibold">Title</TableHead>
                        <TableHead className="text-[#5C4A3D] font-semibold">Author</TableHead>
                        <TableHead className="text-[#5C4A3D] font-semibold">Format</TableHead>
                        <TableHead className="text-[#5C4A3D] font-semibold">Status</TableHead>
                        <TableHead className="text-[#5C4A3D] font-semibold text-right">Sales</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {booksModalPaginated.map((book, i) => (
                        <TableRow key={i} className="border-[#E8DDD0]">
                          <TableCell>
                            <div className={`h-10 w-7 rounded flex items-center justify-center flex-shrink-0 ${BOOK_COVER_COLORS[booksModalCategory] || "bg-[#8A6A4A]"}`}>
                              <BookOpen className="h-3 w-3 text-white" />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-[#1D1D1D]">{book.title}</TableCell>
                          <TableCell className="text-[#5C4A3D]">{book.author}</TableCell>
                          <TableCell><Badge variant="outline" className="border-[#E8DDD0] text-[#5C4A3D]">{book.format}</Badge></TableCell>
                          <TableCell>
                            <Badge variant="outline" className={book.status === "Published" ? "border-emerald-200 text-emerald-700" : book.status === "Draft" ? "border-slate-200 text-slate-600" : "border-amber-200 text-amber-700"}>
                              {book.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-[#5C4A3D]">{book.sales.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {booksModalTotalPages > 1 && (
                  <div className="flex items-center justify-between p-6 border-t border-[#E8DDD0]">
                    <p className="text-sm text-[#5C4A3D]">Page {booksModalPage} of {booksModalTotalPages}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled={booksModalPage === 1} onClick={() => setBooksModalPage(booksModalPage - 1)} className="border-[#E8DDD0]"><ChevronLeft className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" disabled={booksModalPage === booksModalTotalPages} onClick={() => setBooksModalPage(booksModalPage + 1)} className="border-[#E8DDD0]"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
