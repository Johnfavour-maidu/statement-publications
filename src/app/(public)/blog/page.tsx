"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  User,
  Search,
  Tag,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  tags: string[];
  viewCount: number;
  likeCount: number;
  publishedAt: string | null;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

const categories = [
  "All",
  "Publishing Tips",
  "Author Resources",
  "Book Marketing",
  "Writing Craft",
  "Industry News",
  "Success Stories",
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, page]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "9",
      });
      if (activeCategory !== "All") {
        params.set("category", activeCategory);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.data.items);
        setTotalPages(data.data.totalPages);

        if (!featuredPost && data.data.items.length > 0) {
          const featured = data.data.items.find(
            (p: BlogPost) => p.coverImage
          );
          setFeaturedPost(featured || data.data.items[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await fetch("/api/blog?sortBy=viewCount&pageSize=5");
        const data = await res.json();
        if (data.success) {
          setPopularPosts(data.data.items);
        }
      } catch (error) {
        console.error("Failed to fetch popular posts:", error);
      }
    }
    fetchPopular();
  }, []);

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-b from-[#1B4332] to-[#2D6A4F] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              The Statement Blog
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Insights, tips, and stories for authors navigating the world of
              self-publishing
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPage(1);
                    fetchPosts();
                  }
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#B7E4C7] focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="bg-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow border border-border">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-full min-h-[300px]">
                    {featuredPost.coverImage ? (
                      <Image
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white/40" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#D4A373] text-[#1B4332] px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    {featuredPost.category && (
                      <span className="text-[#40916C] font-medium text-sm mb-2">
                        {featuredPost.category}
                      </span>
                    )}
                    <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-3 hover:text-[#40916C] transition-colors">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {featuredPost.author.image ? (
                            <Image
                              src={featuredPost.author.image}
                              alt=""
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>
                        <span>{featuredPost.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(featuredPost.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setPage(1);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === cat
                  ? "bg-[#1B4332] text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl border border-border overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-muted" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No articles found. Try a different search or category.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group h-full flex flex-col">
                        <div className="relative h-48">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1B4332]/10 to-[#40916C]/10 flex items-center justify-center">
                              <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                          )}
                          {post.category && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-white/90 backdrop-blur-sm text-[#1B4332] px-2.5 py-1 rounded-full text-xs font-medium">
                                {post.category}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-playfair text-lg font-bold mb-2 group-hover:text-[#40916C] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                {post.author.image ? (
                                  <Image
                                    src={post.author.image}
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <User className="h-3 w-3" />
                                )}
                              </div>
                              <span>{post.author.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                        page === pageNum
                          ? "bg-[#1B4332] text-white"
                          : "border border-border hover:bg-muted"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-playfair text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#40916C]" />
                Popular Posts
              </h3>
              <div className="space-y-4">
                {popularPosts.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="flex gap-3 group"
                  >
                    <span className="text-2xl font-bold text-muted-foreground/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium group-hover:text-[#40916C] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-playfair text-lg font-bold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#40916C]" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.slice(1).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setPage(1);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      activeCategory === cat
                        ? "bg-[#1B4332] text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-xl p-6 text-white">
              <Mail className="h-8 w-8 mb-3 text-[#B7E4C7]" />
              <h3 className="font-playfair text-lg font-bold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Get the latest publishing tips and author resources delivered to
                your inbox.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing!");
                  setNewsletterEmail("");
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7E4C7]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#D4A373] text-[#1B4332] font-semibold text-sm hover:bg-[#D4A373]/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
