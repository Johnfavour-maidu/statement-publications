"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import BlogCard from "@/components/blog/blog-card";
import { blogPosts, categories } from "@/lib/blog-data";
import { fuzzySearch } from "@/lib/fuzzy-search";

const POSTS_PER_PAGE = 6;

interface TopicPageClientProps {
  slug: string;
}

export default function TopicPageClient({ slug }: TopicPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const category = categories.find((c) => c.slug === slug);

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
      <section className="relative overflow-hidden py-20 sm:py-24" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 40%, #F2D8BE 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[15%] w-[400px] h-[400px] bg-white/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-[15%] w-[350px] h-[350px] bg-white/15 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal text-sm font-semibold mb-8 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest text-charcoal/70 mb-4">
              <BookOpen className="h-3.5 w-3.5" />
              Topic
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-charcoal mb-5 leading-[1.1]"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              {category.name}
            </h1>
            <p className="text-lg text-charcoal/70 max-w-2xl leading-relaxed">
              {category.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-charcoal/50">
              <span className="font-semibold text-charcoal/70">{filteredPosts.length}</span>
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-gray/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder={`Search in ${category.name}...`}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
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
        </div>
      </section>
    </div>
  );
}
