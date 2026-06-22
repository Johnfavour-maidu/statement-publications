"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Plus, Search, Eye, Pencil, Archive, Trash2,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle,
  FileText, X, SlidersHorizontal, Check, RefreshCw,
  ArrowUpDown, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const statusConfig = {
  published: { label: "Published", bg: "bg-emerald-100", color: "text-emerald-700" },
  draft: { label: "Draft", bg: "bg-amber-100", color: "text-amber-700" },
  pending: { label: "Pending Review", bg: "bg-blue-100", color: "text-blue-700" },
  rejected: { label: "Rejected", bg: "bg-red-100", color: "text-red-700" },
  archived: { label: "Archived", bg: "bg-gray-100", color: "text-gray-700" },
} as const;

const coverColors = [
  "bg-gradient-to-br from-[#8A6A4A] to-[#6B5538]",
  "bg-gradient-to-br from-[#D8B27A] to-[#b8966a]",
  "bg-gradient-to-br from-[#1D1D1D] to-[#3a3a3a]",
  "bg-gradient-to-br from-[#5C4033] to-[#4a3228]",
  "bg-gradient-to-br from-[#8B7355] to-[#6d5a43]",
  "bg-gradient-to-br from-[#2C5F2D] to-[#234b24]",
];

const emptyStateConfig: Record<string, { icon: any; title: string; desc: string }> = {
  published: { icon: CheckCircle2, title: "No Published Books", desc: "Publish your first book to start earning." },
  draft: { icon: FileText, title: "No Drafts", desc: "All caught up! No drafts in progress." },
  pending: { icon: Clock, title: "No Pending Books", desc: "No books awaiting approval." },
  rejected: { icon: AlertTriangle, title: "No Rejected Books", desc: "No books have been rejected." },
  archived: { icon: Archive, title: "No Archived Books", desc: "No books have been archived." },
};

const categoryTabs = [
  { key: "all", label: "All Books", icon: BookOpen },
  { key: "published", label: "Published", icon: CheckCircle2 },
  { key: "draft", label: "Drafts", icon: FileText },
  { key: "pending", label: "Pending Review", icon: Clock },
  { key: "rejected", label: "Rejected", icon: AlertTriangle },
  { key: "archived", label: "Archived", icon: Archive },
];

const initialBooks = [
  { id: "1", title: "Wealth Is A Decision", category: "Personal Finance", status: "published" as const, createdDate: "Jan 15, 2025", description: "A comprehensive guide to making smart financial decisions." },
  { id: "2", title: "The Art of Negotiation", category: "Business", status: "published" as const, createdDate: "Feb 8, 2025", description: "Master the art of negotiation in business and life." },
  { id: "3", title: "Building Your Empire", category: "Business", status: "published" as const, createdDate: "Mar 1, 2025", description: "Build a lasting business empire from the ground up." },
  { id: "4", title: "Money Mindset Mastery", category: "Self Help", status: "published" as const, createdDate: "Mar 20, 2025", description: "Transform your relationship with money." },
  { id: "5", title: "Financial Freedom Blueprint", category: "Personal Finance", status: "published" as const, createdDate: "Apr 5, 2025", description: "Your step-by-step guide to financial independence." },
  { id: "6", title: "Leadership in the Digital Age", category: "Business", status: "published" as const, createdDate: "Apr 18, 2025", description: "Leading teams and organizations in a digital world." },
  { id: "7", title: "The Entrepreneur's Playbook", category: "Business", status: "published" as const, createdDate: "May 2, 2025", description: "Essential strategies for startup founders." },
  { id: "8", title: "Investing for Beginners", category: "Personal Finance", status: "published" as const, createdDate: "May 15, 2025", description: "Start your investing journey with confidence." },
  { id: "9", title: "The Productivity System", category: "Self Help", status: "published" as const, createdDate: "Jun 1, 2025", description: "A proven system for 10x your productivity." },
  { id: "10", title: "Digital Marketing Mastery", category: "Technology", status: "published" as const, createdDate: "Jun 15, 2025", description: "Master digital marketing channels and strategies." },
  { id: "11", title: "Real Estate Investing 101", category: "Personal Finance", status: "published" as const, createdDate: "Jul 1, 2025", description: "Get started in real estate investing." },
  { id: "12", title: "The Side Hustle Bible", category: "Business", status: "published" as const, createdDate: "Jul 15, 2025", description: "50+ side hustle ideas to boost your income." },
  { id: "13", title: "Tax Strategies for Authors", category: "Personal Finance", status: "draft" as const, createdDate: "Aug 1, 2025", description: "Minimize your tax burden as a published author." },
  { id: "14", title: "The Writing Habit", category: "Self Help", status: "draft" as const, createdDate: "Aug 15, 2025", description: "Build a consistent writing habit that sticks." },
  { id: "15", title: "Passive Income Streams", category: "Personal Finance", status: "draft" as const, createdDate: "Sep 1, 2025", description: "Create multiple streams of passive income." },
  { id: "16", title: "AI for Entrepreneurs", category: "Technology", status: "pending" as const, createdDate: "Sep 15, 2025", description: "Leverage AI to grow your business." },
  { id: "17", title: "The Remote Work Revolution", category: "Business", status: "pending" as const, createdDate: "Oct 1, 2025", description: "Thriving in the new world of remote work." },
  { id: "18", title: "Crypto & Blockchain Explained", category: "Technology", status: "rejected" as const, createdDate: "Oct 15, 2025", description: "A beginner's guide to cryptocurrency." },
  { id: "19", title: "Legacy Building 101", category: "Personal Finance", status: "archived" as const, createdDate: "Nov 1, 2024", description: "Build generational wealth." },
];

export default function AuthorAllBooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [drawerBook, setDrawerBook] = useState<any>(null);
  const [deleteBook, setDeleteBook] = useState<any>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [books, setBooks] = useState(initialBooks);
  const [showFilters, setShowFilters] = useState(true);
  const [pageCounter, setPageCounter] = useState(20);
  const [showPageCounter, setShowPageCounter] = useState(false);

  const publishedCount = useMemo(() => books.filter(b => b.status === "published").length, [books]);
  const draftsCount = useMemo(() => books.filter(b => b.status === "draft").length, [books]);
  const pendingCount = useMemo(() => books.filter(b => b.status === "pending").length, [books]);
  const rejectedCount = useMemo(() => books.filter(b => b.status === "rejected").length, [books]);
  const archivedCount = useMemo(() => books.filter(b => b.status === "archived").length, [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];
    if (activeCategory !== "all") result = result.filter(b => b.status === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "title": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "created": result.sort((a, b) => b.createdDate.localeCompare(a.createdDate)); break;
      case "updated": default: result.sort((a, b) => b.createdDate.localeCompare(a.createdDate)); break;
    }
    return result;
  }, [books, activeCategory, searchQuery, sortBy]);

  const displayedBooks = useMemo(() => {
    if (pageCounter === 999) return filteredBooks;
    return filteredBooks.slice(0, pageCounter);
  }, [filteredBooks, pageCounter]);

  const toggleSelectAll = useCallback(() => {
    if (selectedBooks.size === displayedBooks.length) setSelectedBooks(new Set());
    else setSelectedBooks(new Set(displayedBooks.map(b => b.id)));
  }, [selectedBooks, displayedBooks]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedBooks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleArchive = useCallback((book: any) => {
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, status: "archived" as const } : b));
    setUndoStack(prev => [...prev, { type: "archive", book }]);
    setToastMessage(`"${book.title}" archived`);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const handleDelete = useCallback((book: any) => {
    setBooks(prev => prev.filter(b => b.id !== book.id));
    setDeleteBook(null);
    setUndoStack(prev => [...prev, { type: "delete", book }]);
    setToastMessage(`"${book.title}" deleted`);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    if (last.type === "archive") {
      setBooks(prev => prev.map(b => b.id === last.book.id ? { ...b, status: last.book.status } : b));
    } else {
      setBooks(prev => [...prev, last.book]);
    }
    setUndoStack(prev => prev.slice(0, -1));
    setToastMessage("Action undone");
    setTimeout(() => setToastMessage(null), 3000);
  }, [undoStack]);

  const handleCardClick = useCallback((key: string) => {
    setActiveCategory(prev => prev === key ? "all" : key);
  }, []);

  const handleViewAll = useCallback(() => {
    setActiveCategory("all");
    setSearchQuery("");
    setSortBy("updated");
  }, []);

  const handleEdit = useCallback((book: any) => {
    setDrawerBook(book);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* 1. Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D1D1D]">All Books</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your complete book collection</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="refresh-btn-border rounded-lg p-[2px]">
            <Button variant="outline" size="sm" className="rounded-[calc(0.5rem-2px)] bg-white hover:bg-[#F5EDE3] border-0 text-[#8A6A4A]" onClick={() => {}}>
              <RefreshCw className="h-4 w-4 mr-1.5" />Refresh
            </Button>
          </div>
          <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg" asChild>
            <Link href="/author/books/new"><Plus className="h-4 w-4 mr-2" /> Create New Book</Link>
          </Button>
        </div>
      </motion.div>

      {/* 2. Summary Cards (Clickable) */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: "all", label: "TOTAL BOOKS", value: books.length, icon: BookOpen, bg: "bg-[#F5EDE3]", color: "text-[#8A6A4A]" },
          { key: "published", label: "PUBLISHED", value: publishedCount, icon: CheckCircle2, bg: "bg-emerald-100", color: "text-emerald-600" },
          { key: "draft", label: "DRAFTS", value: draftsCount, icon: FileText, bg: "bg-amber-100", color: "text-amber-600" },
          { key: "pending", label: "PENDING REVIEW", value: pendingCount, icon: Clock, bg: "bg-blue-100", color: "text-blue-600" },
          { key: "rejected", label: "REJECTED", value: rejectedCount, icon: AlertTriangle, bg: "bg-red-100", color: "text-red-600" },
          { key: "archived", label: "ARCHIVED", value: archivedCount, icon: Archive, bg: "bg-gray-100", color: "text-gray-600" },
        ].map((s) => (
          <motion.div
            key={s.key}
            whileHover={{ y: -2 }}
            onClick={() => handleCardClick(s.key)}
            className={`bg-white rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
              activeCategory === s.key
                ? "ring-2 ring-[#8A6A4A] ring-offset-2 shadow-md"
                : "border border-[#E8DDD0] hover:shadow-md"
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

      {/* 3. Analytics Center (collapsed by default) */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-[#E8DDD0]">
          <h3 className="font-semibold text-[#1D1D1D]">Analytics Center</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(!showAnalytics)} className="text-muted-foreground hover:text-[#1D1D1D]">
            {showAnalytics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                  <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">THIS MONTH</p>
                  <p className="text-xl font-bold text-[#1D1D1D] mt-1">$1,560</p>
                </div>
                <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                  <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">LAST MONTH</p>
                  <p className="text-xl font-bold text-[#1D1D1D] mt-1">$1,200</p>
                </div>
                <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                  <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">TOTAL READERS</p>
                  <p className="text-xl font-bold text-[#1D1D1D] mt-1">4,820</p>
                </div>
                <div className="p-3 bg-[#F5EDE3]/50 rounded-lg">
                  <p className="text-[10px] font-semibold text-muted-foreground tracking-wider">AVG RATING</p>
                  <p className="text-xl font-bold text-[#1D1D1D] mt-1">4.6</p>
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
                placeholder="Search by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-[calc(0.5rem-2px)] border-0 bg-white text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <Button variant="outline" size="sm" className="rounded-[calc(0.5rem-2px)] bg-white hover:bg-[#F5EDE3] border-0 text-sm" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4 mr-1.5" /> Filters
              </Button>
            </div>
            <div className="refresh-btn-border rounded-lg p-[2px]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-[calc(0.5rem-2px)] bg-white hover:bg-[#F5EDE3] border-0 text-sm">
                    <ArrowUpDown className="h-4 w-4 mr-1.5" /> Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg">
                  <DropdownMenuItem onClick={() => setSortBy("updated")} className="text-sm">{sortBy === "updated" && <Check className="h-4 w-4 mr-2" />} Last Updated</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("created")} className="text-sm">{sortBy === "created" && <Check className="h-4 w-4 mr-2" />} Date Created</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("title")} className="text-sm">{sortBy === "title" && <Check className="h-4 w-4 mr-2" />} Title A-Z</DropdownMenuItem>
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
        {showFilters && (
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
        )}
      </motion.div>

      {/* 5. Book Table */}
      <motion.div variants={item} className="bg-white rounded-xl border border-[#E8DDD0] shadow-sm overflow-hidden">
        {displayedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            {activeCategory !== "all" && emptyStateConfig[activeCategory] ? (
              (() => {
                const cfg = emptyStateConfig[activeCategory];
                const Icon = cfg.icon;
                return (
                  <>
                    <div className="p-4 bg-[#F5EDE3] rounded-full mb-4">
                      <Icon className="h-10 w-10 text-[#8A6A4A]" />
                    </div>
                    <p className="text-lg font-semibold text-[#1D1D1D]">{cfg.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">{cfg.desc}</p>
                    <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg" asChild>
                      <Link href="/author/books/new"><Plus className="h-4 w-4 mr-2" /> Create New Book</Link>
                    </Button>
                  </>
                );
              })()
            ) : (
              <>
                <div className="p-4 bg-[#F5EDE3] rounded-full mb-4">
                  <BookOpen className="h-10 w-10 text-[#8A6A4A]" />
                </div>
                <p className="text-lg font-semibold text-[#1D1D1D]">No books found</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Try adjusting your search or filters.</p>
                <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg" asChild>
                  <Link href="/author/books/new"><Plus className="h-4 w-4 mr-2" /> Create New Book</Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8DDD0] bg-[#F5EDE3]/30">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBooks.size === displayedBooks.length && displayedBooks.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-[#E8DDD0]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">COVER</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">TITLE</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">CATEGORY</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">STATUS</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground tracking-wider">PUBLISHED</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {displayedBooks.map((book, idx) => {
                  const status = statusConfig[book.status as keyof typeof statusConfig];
                  return (
                    <tr
                      key={book.id}
                      className="border-b border-[#E8DDD0]/50 hover:bg-[#F5EDE3]/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedBooks.has(book.id)}
                          onChange={() => toggleSelect(book.id)}
                          className="rounded border-[#E8DDD0]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className={`h-12 w-9 rounded-md ${coverColors[idx % coverColors.length]} flex items-center justify-center`}>
                          <BookOpen className="h-5 w-5 text-white/70" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#1D1D1D]">{book.title}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{book.category}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{book.createdDate}</td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white rounded-xl border border-[#E8DDD0] shadow-lg">
                            <DropdownMenuItem onClick={() => setDrawerBook(book)}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(book)}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchive(book)}>
                              <Archive className="h-4 w-4 mr-2" /> Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteBook(book)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
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

      {/* 6. Pagination Summary (Clean) */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <span>Showing {displayedBooks.length} of {filteredBooks.length} books</span>
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

      {/* Book Details Drawer */}
      <AnimatePresence>
        {drawerBook && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setDrawerBook(null)}
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
                  <h2 className="text-xl font-bold text-[#1D1D1D]">Book Details</h2>
                  <button onClick={() => setDrawerBook(null)} className="p-2 hover:bg-[#F5EDE3] rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className={`h-48 rounded-xl ${coverColors[parseInt(drawerBook.id) % coverColors.length]} flex items-center justify-center mb-6`}>
                  <BookOpen className="h-16 w-16 text-white/50" />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">{drawerBook.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{drawerBook.description}</p>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`text-sm font-medium ${statusConfig[drawerBook.status as keyof typeof statusConfig]?.color}`}>{statusConfig[drawerBook.status as keyof typeof statusConfig]?.label}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8DDD0]">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-medium text-[#1D1D1D]">{drawerBook.category}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-muted-foreground">Published</span>
                    <span className="text-sm font-medium text-[#1D1D1D]">{drawerBook.createdDate}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] rounded-lg" onClick={() => setDrawerBook(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteBook && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setDeleteBook(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-red-100 rounded-full mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1D] mb-2">Delete Book</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Are you sure you want to delete &quot;{deleteBook.title}&quot;? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <Button variant="outline" className="flex-1 rounded-lg border-[#E8DDD0]" onClick={() => setDeleteBook(null)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 rounded-lg bg-red-500 text-white hover:bg-red-600" onClick={() => handleDelete(deleteBook)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedBooks.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DDD0] shadow-2xl z-40 px-6 py-4"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#1D1D1D]">{selectedBooks.size} book{selectedBooks.size > 1 ? "s" : ""} selected</span>
                <Button variant="outline" size="sm" className="rounded-lg border-[#E8DDD0]" onClick={() => setSelectedBooks(new Set())}>
                  Clear Selection
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Publish
                </Button>
                <Button size="sm" className="rounded-lg bg-gray-500 text-white hover:bg-gray-600">
                  <Archive className="h-4 w-4 mr-1" /> Archive
                </Button>
                <Button size="sm" className="rounded-lg bg-red-500 text-white hover:bg-red-600">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Undo Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1D1D1D] text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-4"
          >
            <span className="text-sm">{toastMessage}</span>
            {undoStack.length > 0 && (
              <Button size="sm" variant="ghost" className="text-[#D8B27A] hover:text-[#D8B27A] hover:bg-white/10" onClick={handleUndo}>
                Undo
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
