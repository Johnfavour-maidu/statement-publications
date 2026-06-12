"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import BlogCard from "@/components/blog/blog-card";
import { blogPosts, categories } from "@/lib/blog-data";
import { fuzzySearch } from "@/lib/fuzzy-search";

const POSTS_PER_PAGE = 6;

const categoryColorMap: Record<string, { gradient: string; iconBg: string; iconColor: string; badgeBg: string; searchGradient: string }> = {
  "writing-tips": { gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)", iconBg: "bg-amber-200", iconColor: "text-amber-800", badgeBg: "bg-amber-200/60", searchGradient: "from-amber-400 via-amber-500 to-amber-600" },
  "self-publishing": { gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)", iconBg: "bg-blue-200", iconColor: "text-blue-800", badgeBg: "bg-blue-200/60", searchGradient: "from-blue-400 via-blue-500 to-blue-600" },
  "book-marketing": { gradient: "linear-gradient(135deg, #F43F5E 0%, #E11D48 50%, #BE123C 100%)", iconBg: "bg-rose-200", iconColor: "text-rose-800", badgeBg: "bg-rose-200/60", searchGradient: "from-rose-400 via-rose-500 to-rose-600" },
  "author-success-stories": { gradient: "linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)", iconBg: "bg-emerald-200", iconColor: "text-emerald-800", badgeBg: "bg-emerald-200/60", searchGradient: "from-emerald-400 via-emerald-500 to-emerald-600" },
  "industry-news": { gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)", iconBg: "bg-violet-200", iconColor: "text-violet-800", badgeBg: "bg-violet-200/60", searchGradient: "from-violet-400 via-violet-500 to-violet-600" },
  "editing-proofreading": { gradient: "linear-gradient(135deg, #14B8A6 0%, #0D9488 50%, #0F766E 100%)", iconBg: "bg-teal-200", iconColor: "text-teal-800", badgeBg: "bg-teal-200/60", searchGradient: "from-teal-400 via-teal-500 to-teal-600" },
  "book-design": { gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%)", iconBg: "bg-orange-200", iconColor: "text-orange-800", badgeBg: "bg-orange-200/60", searchGradient: "from-orange-400 via-orange-500 to-orange-600" },
  "academic-publishing": { gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #4338CA 100%)", iconBg: "bg-indigo-200", iconColor: "text-indigo-800", badgeBg: "bg-indigo-200/60", searchGradient: "from-indigo-400 via-indigo-500 to-indigo-600" },
  "research-journals": { gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 50%, #0E7490 100%)", iconBg: "bg-cyan-200", iconColor: "text-cyan-800", badgeBg: "bg-cyan-200/60", searchGradient: "from-cyan-400 via-cyan-500 to-cyan-600" },
  "digital-publishing": { gradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 50%, #BE185D 100%)", iconBg: "bg-pink-200", iconColor: "text-pink-800", badgeBg: "bg-pink-200/60", searchGradient: "from-pink-400 via-pink-500 to-pink-600" },
};

const defaultColors = { gradient: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 40%, #F2D8BE 100%)", iconBg: "bg-[#EBC9A8]/20", iconColor: "text-[#8A6A4A]", badgeBg: "bg-[#EBC9A8]/30", searchGradient: "from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]" };

interface TopicPageClientProps {
  slug: string;
}

export default function TopicPageClient({ slug }: TopicPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const category = categories.find((c) => c.slug === slug);
  const colors = categoryColorMap[slug] || defaultColors;

  const topicPosts = useMemo(() => {
    if (!category) return [];
    return blogPosts.filter((p) => p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") === slug);
  }, [category, slug]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return topicPosts;
    const results = fuzzySearch(
      topicPosts,
      searchQuery,
      (p) => [p.title, p.excerpt, p.content, p.author.name, ...p.tags],
      0.25
    );
    return results.map((r) => r.item);
  }, [topicPosts, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const scrollToTop = useCallback(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EBC9A8]/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-[#8A6A4A]" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-4">Topic Not Found</h1>
          <p className="text-dark-gray/60 mb-6">The topic you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-[#EBC9A8] text-charcoal rounded-xl font-semibold hover:bg-[#D8B27A] transition-all duration-300 hover:scale-[1.03]">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-24" style={{ background: colors.gradient }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[15%] w-[400px] h-[400px] bg-white/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-[15%] w-[350px] h-[350px] bg-white/15 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold mb-8 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${colors.badgeBg} backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest text-white/90 mb-4`}>
              <BookOpen className="h-3.5 w-3.5" />
              Topic
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-[1.1]"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              {category.name}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
              {category.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
              <span className="font-semibold text-white/80">{filteredPosts.length}</span>
              <span>article{filteredPosts.length !== 1 ? "s" : ""}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search + Content */}
      <section className="py-14 sm:py-18 bg-white" ref={topRef}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Search within topic */}
          <div className="mb-10">
            <div className="relative max-w-md">
              <div className={`relative p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${colors.searchGradient} transition-shadow duration-300 ${isSearchFocused ? "shadow-lg" : ""}`}>
                <div className="relative flex items-center bg-white rounded-[10px]">
                  <Search className="absolute left-4 h-4 w-4 text-dark-gray/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder={`Search in ${category.name}...`}
                    className="w-full pl-11 pr-4 py-3.5 rounded-[10px] bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))
            ) : (
              <div className="sm:col-span-2 text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-[#EBC9A8]/20 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-7 w-7 text-[#8A6A4A]/60" />
                </div>
                <p className="text-dark-gray/50 text-lg mb-2">No articles found.</p>
                <p className="text-dark-gray/40 text-sm mb-4">Try a different search term or browse all articles.</p>
                <button
                  onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                  className="px-6 py-2.5 bg-[#EBC9A8] text-charcoal rounded-xl font-semibold hover:bg-[#D8B27A] transition-all duration-300 hover:scale-[1.03]"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-dark-gray/60 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span key={`dots-${i}`} className="px-2 py-2 text-sm text-dark-gray/40">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[40px] h-10 rounded-lg text-sm font-semibold transition-all ${
                        currentPage === page
                          ? "bg-[#EBC9A8] text-charcoal shadow-md"
                          : "border border-gray-200 text-dark-gray/60 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-dark-gray/60 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-16 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE] text-charcoal rounded-xl font-bold hover:scale-[1.03] transition-all duration-300 shadow-lg shadow-[#EBC9A8]/20"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Blog
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
