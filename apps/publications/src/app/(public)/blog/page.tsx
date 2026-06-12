"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, ChevronDown } from "lucide-react";
import BlogHero from "@/components/blog/blog-hero";
import BlogCard from "@/components/blog/blog-card";
import CategoryShowcase from "@/components/blog/category-showcase";
import AuthorSpotlight from "@/components/blog/author-spotlight";
import TrendingSidebar from "@/components/blog/trending-sidebar";
import NewsletterBannerCompact from "@/components/blog/newsletter-banner-compact";
import { blogPosts, categories, getEditorsPicks, getTrendingPosts } from "@/lib/blog-data";
import { fuzzySearch, getSuggestion } from "@/lib/fuzzy-search";

const POSTS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 5;

const sortOptions = [
  { label: "Trending Now", value: "trending" },
  { label: "New Releases", value: "new-releases" },
  { label: "Editor's Picks", value: "editors-picks" },
  { label: "Most Viewed", value: "most-viewed" },
  { label: "Most Popular", value: "most-popular" },
  { label: "Most Commented", value: "most-commented" },
  { label: "Recently Updated", value: "recently-updated" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

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
  const [sortBy, setSortBy] = useState("trending");
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestion, setSearchSuggestion] = useState<string | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const articlesSectionRef = useRef<HTMLDivElement>(null);
  const editorsPicks = getEditorsPicks();
  const trending = getTrendingPosts();

  const allTitles = useMemo(() => blogPosts.map((p) => p.title), []);

  const filteredPosts = useMemo(() => {
    let posts = [...blogPosts];

    if (activeCategory !== "all") {
      posts = posts.filter((p) => p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") === activeCategory);
    }

    if (searchQuery.trim()) {
      const fuzzyResults = fuzzySearch(
        posts,
        searchQuery,
        (p) => [p.title, p.excerpt, p.content, p.author.name, p.category, ...p.tags],
        0.25
      );
      posts = fuzzyResults.map((r) => r.item);
      const suggestion = getSuggestion(searchQuery, allTitles);
      setSearchSuggestion(suggestion !== searchQuery ? suggestion : null);
    } else {
      setSearchSuggestion(null);
    }

    switch (sortBy) {
      case "trending":
        posts.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "new-releases":
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "editors-picks":
        posts = posts.filter((p) => p.isEditorsPick);
        break;
      case "most-viewed":
        posts.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "most-popular":
        posts.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case "most-commented":
        posts.sort((a, b) => b.commentCount - a.commentCount);
        break;
      case "recently-updated":
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "az":
        posts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        posts.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return posts;
  }, [activeCategory, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const scrollToArticles = useCallback(() => {
    if (articlesSectionRef.current) {
      articlesSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage(1);
    scrollToArticles();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToArticles();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (query.trim()) {
      const suggestion = getSuggestion(query, allTitles);
      setSearchSuggestion(suggestion !== query ? suggestion : null);
      setTimeout(() => scrollToArticles(), 100);
    } else {
      setSearchSuggestion(null);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSearchSuggestion(null);
    setCurrentPage(1);
    setTimeout(() => scrollToArticles(), 100);
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
      <BlogHero onSearch={handleSearch} searchQuery={searchQuery} />

      {/* Explore Topics — brown background */}
      <section className="py-14 sm:py-16" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 40%, #F2D8BE 100%)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
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
      <section className="py-16 sm:py-20 bg-white" ref={articlesSectionRef}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Filter Tabs */}
              <AnimatedSection className="mb-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === "all" ? "bg-[#8A6A4A] text-white shadow-md shadow-[#8A6A4A]/20" : "bg-gray-100 text-dark-gray/60 hover:bg-gray-200 hover:text-dark-gray/80"}`}
                  >
                    All Articles
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat.slug ? "bg-[#8A6A4A] text-white shadow-md shadow-[#8A6A4A]/20" : "bg-gray-100 text-dark-gray/60 hover:bg-gray-200 hover:text-dark-gray/80"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </AnimatedSection>

              {/* Post Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {paginatedPosts.length > 0 ? (
                  paginatedPosts.map((post, i) => (
                    <BlogCard key={post.id} post={post} index={i} />
                  ))
                ) : (
                  <div className="sm:col-span-2 text-center py-16">
                    <p className="text-dark-gray/50 text-lg">No articles found matching &ldquo;{searchQuery}&rdquo;</p>
                    {searchSuggestion && (
                      <p className="mt-2 text-sm text-dark-gray/40">
                        Did you mean{" "}
                        <button
                          onClick={() => handleSuggestionClick(searchSuggestion)}
                          className="text-[#8A6A4A] font-semibold hover:underline"
                        >
                          {searchSuggestion}
                        </button>
                        ?
                      </p>
                    )}
                    <button
                      onClick={() => { setActiveCategory("all"); setSortBy("trending"); setSearchQuery(""); setSearchSuggestion(null); setCurrentPage(1); }}
                      className="mt-4 px-6 py-2 bg-[#EBC9A8] text-charcoal rounded-lg font-semibold hover:bg-[#D8B27A] transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Bookstore-Style Pagination */}
              {totalPages > 1 && (
                <AnimatedSection className="mt-12">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-dark-gray/60 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
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
                          className={`min-w-[40px] h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            currentPage === page
                              ? "bg-[#8A6A4A] text-white shadow-md shadow-[#8A6A4A]/20"
                              : "border border-gray-200 text-dark-gray/60 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-dark-gray/60 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-1"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sort Dropdown — above Trending Now */}
              <AnimatedSection>
                <div className="relative p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white text-sm font-medium text-dark-gray/70 hover:bg-[#FDF6EE] transition-all w-full justify-between"
                  >
                    <span>Sort By: {sortOptions.find((o) => o.value === sortBy)?.label}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sortOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-1">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setSortOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            sortBy === option.value
                              ? "bg-[#EBC9A8]/20 text-[#8A6A4A] font-semibold"
                              : "text-dark-gray/70 hover:bg-gray-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <TrendingSidebar posts={trending} />
              </AnimatedSection>

              {/* Editor's Picks — animated gradient border */}
              <AnimatedSection delay={0.2}>
                <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                  <div className="bg-white rounded-[14px] p-5">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-white" />
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
      <section className="py-18 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
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
