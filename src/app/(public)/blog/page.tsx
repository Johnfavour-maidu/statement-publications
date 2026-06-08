"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, TrendingUp, Sparkles, BookOpen, Filter } from "lucide-react";
import BlogHero from "@/components/blog/blog-hero";
import BlogCard from "@/components/blog/blog-card";
import FeaturedCard from "@/components/blog/featured-card";
import CategoryShowcase from "@/components/blog/category-showcase";
import AuthorSpotlight from "@/components/blog/author-spotlight";
import TrendingSidebar from "@/components/blog/trending-sidebar";
import NewsletterBanner from "@/components/blog/newsletter-banner";
import { blogPosts, categories, getFeaturedPosts, getEditorsPicks, getTrendingPosts, getRecentPosts } from "@/lib/blog-data";

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
  const featured = getFeaturedPosts();
  const editorsPicks = getEditorsPicks();
  const trending = getTrendingPosts();
  const recent = getRecentPosts(6);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return blogPosts;
    return blogPosts.filter((p) => p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen">
      <BlogHero />

      {/* Featured Article */}
      {featured.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#EBC9A8]/30 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-[#8A6A4A]" />
                </div>
                <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">Featured Article</h2>
              </div>
            </AnimatedSection>
            <FeaturedCard post={featured[0]} />
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-[#FDF6EE]">
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
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Filter Tabs */}
              <AnimatedSection className="mb-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === "all" ? "bg-[#EBC9A8] text-charcoal" : "bg-gray-100 text-dark-gray/60 hover:bg-gray-200"}`}
                  >
                    All Articles
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.slug ? "bg-[#EBC9A8] text-charcoal" : "bg-gray-100 text-dark-gray/60 hover:bg-gray-200"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </AnimatedSection>

              {/* Post Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredPosts.slice(0, 6).map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>

              {/* Load More */}
              {filteredPosts.length > 6 && (
                <AnimatedSection className="mt-10 text-center">
                  <button className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-charcoal/20 text-charcoal font-semibold hover:bg-charcoal hover:text-white transition-all">
                    Load More Articles <ArrowRight className="h-4 w-4" />
                  </button>
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AnimatedSection delay={0.1}>
                <TrendingSidebar posts={trending} />
              </AnimatedSection>

              {/* Editor's Picks */}
              <AnimatedSection delay={0.2}>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#D8B27A]/20 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-[#8A6A4A]" />
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
                          <h4 className="text-sm font-semibold text-charcoal line-clamp-2 group-hover:text-[#8A6A4A] transition-colors leading-snug">{post.title}</h4>
                          <p className="text-[11px] text-dark-gray/40 mt-1">{post.author.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Newsletter CTA */}
              <AnimatedSection delay={0.3}>
                <div className="bg-gradient-to-br from-[#EBC9A8]/20 to-[#F2D8BE]/30 rounded-2xl border border-[#EBC9A8]/20 p-5 text-center">
                  <h3 className="text-sm font-bold text-charcoal mb-2">Subscribe to Our Newsletter</h3>
                  <p className="text-xs text-dark-gray/60 mb-4">Weekly writing and publishing tips.</p>
                  <Link href="#newsletter" className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white text-xs font-semibold rounded-lg hover:bg-dark-gray transition-colors">
                    Subscribe <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
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

      {/* Newsletter */}
      <section id="newsletter" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <NewsletterBanner />
        </div>
      </section>
    </div>
  );
}
