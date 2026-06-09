"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard from "@/components/blog/blog-card";
import { blogPosts, categories } from "@/lib/blog-data";

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
    const q = searchQuery.toLowerCase();
    return topicPosts.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.author.name.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
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
          <h1 className="text-2xl font-bold text-charcoal mb-4">Topic Not Found</h1>
          <Link href="/blog" className="text-charcoal/70 hover:text-charcoal font-medium underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 40%, #F2D8BE 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4"
            style={{ fontFamily: "var(--font-libre)" }}
          >
            {category.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-charcoal/70 max-w-2xl"
          >
            {category.description}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm text-charcoal/50 mt-3"
          >
            {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
          </motion.p>
        </div>
      </section>

      {/* Search + Content */}
      <section className="py-12 sm:py-16 bg-white" ref={topRef}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Search within topic */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-gray/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder={`Search in ${category.name}...`}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent"
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
                <p className="text-dark-gray/50 text-lg">No articles found.</p>
                <button
                  onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                  className="mt-4 px-6 py-2 bg-[#EBC9A8] text-charcoal rounded-lg font-semibold hover:bg-[#D8B27A] transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10">
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
