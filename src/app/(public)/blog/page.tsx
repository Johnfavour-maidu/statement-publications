"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, Filter } from "lucide-react";
import BlogHero from "@/components/blog/blog-hero";
import BlogCard from "@/components/blog/blog-card";
import CategoryShowcase from "@/components/blog/category-showcase";
import AuthorSpotlight from "@/components/blog/author-spotlight";
import TrendingSidebar from "@/components/blog/trending-sidebar";
import NewsletterBannerCompact from "@/components/blog/newsletter-banner-compact";
import { blogPosts, categories, getEditorsPicks, getTrendingPosts } from "@/lib/blog-data";

const POSTS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 5;

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const editorsPicks = getEditorsPicks();
  const trending = getTrendingPosts();

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return blogPosts;
    return blogPosts.filter((p) => p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= MAX_VISIBLE_PAGES) {
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

  return (
    <div className="min-h-screen">
      <BlogHero />

      {/* Explore Topics — right below Hero */}
      <section className="py-12 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-libre)" }}>
              Explore Topics
            </h2>
            <p className="mt-2 text-dark-gray/60">Find articles on the topics that matter to you</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <CategoryShowcase categories={categories} />
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Filter Tabs */}
              <AnimatedSection className="mb-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === "all" ? "bg-[#EBC9A8] text-charcoal" : "bg-gray-100 text-dark-gray/60 hover:bg-gray-200"}`}
                  >
                    All Articles
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.slug ? "bg-[#EBC9A8] text-charcoal" : "bg-gray-100 text-dark-gray/60 hover:bg-gray-200"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </AnimatedSection>

              {/* Post Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {paginatedPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>

              {/* Bookstore-Style Pagination */}
              {totalPages > 1 && (
                <AnimatedSection className="mt-10">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                          onClick={() => setCurrentPage(page)}
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
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-dark-gray/60 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AnimatedSection delay={0.1}>
                <TrendingSidebar posts={trending} />
              </AnimatedSection>

              {/* Editor's Picks — blue border */}
              <AnimatedSection delay={0.2}>
                <div className="bg-white rounded-2xl border-2 border-blue-200 p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-charcoal">Editor&apos;s Picks</h3>
                  </div>
                  <div className="space-y-4">
                    {editorsPicks.slice(0, 3).map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-3 group">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-charcoal line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{post.title}</h4>
                          <p className="text-[11px] text-dark-gray/40 mt-1">{post.author.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Compact Newsletter under Editor's Picks */}
              <AnimatedSection delay={0.3}>
                <NewsletterBannerCompact />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Author Spotlight */}
      <section className="py-16 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-libre)" }}>
              Meet Our Authors
            </h2>
            <p className="mt-2 text-dark-gray/60">Expert voices in publishing and writing</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <AuthorSpotlight />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
