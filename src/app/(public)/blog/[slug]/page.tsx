"use client";

import { use, useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Eye, Calendar, Tag, Share2 } from "lucide-react";
import ReadingProgress from "@/components/blog/reading-progress";
import TableOfContents from "@/components/blog/table-of-contents";
import ArticleSidebar from "@/components/blog/article-sidebar";
import CommentSection from "@/components/blog/comment-section";
import NewsletterBanner from "@/components/blog/newsletter-banner";
import { getPostBySlug, getRelatedPosts, formatDate, sampleComments, blogPosts, BlogPost } from "@/lib/blog-data";

function extractHeadings(html: string) {
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/g;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, "");
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    headings.push({ id, text, level: parseInt(match[1]) });
  }
  return headings;
}

function addIdsToHeadings(html: string) {
  return html.replace(/<h([23])[^>]*>(.*?)<\/h[23]>/g, (_, level, content) => {
    const text = content.replace(/<[^>]*>/g, "");
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-charcoal mb-4">Article Not Found</h1>
          <p className="text-dark-gray/70 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 bg-[#EBC9A8] text-charcoal px-6 py-3 rounded-lg font-semibold hover:bg-[#D8B27A] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const headings = useMemo(() => extractHeadings(post.content), [post.content]);
  const contentWithIds = useMemo(() => addIdsToHeadings(post.content), [post.content]);
  const related = getRelatedPosts(post, 3);
  const comments = sampleComments[post.id] || [];
  const postIndex = blogPosts.findIndex((p) => p.id === post.id);
  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

  return (
    <>
      <ReadingProgress />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#FDF6EE] via-white to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#8A6A4A] hover:text-[#D8B27A] mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#EBC9A8]/30 text-[#8A6A4A] text-xs font-semibold rounded-full">{post.category}</span>
              <span className="flex items-center gap-1 text-xs text-dark-gray/40"><Clock className="h-3 w-3" />{post.readTime} min read</span>
              <span className="flex items-center gap-1 text-xs text-dark-gray/40"><Eye className="h-3 w-3" />{post.viewCount.toLocaleString()} views</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal leading-tight mb-6" style={{ fontFamily: "var(--font-libre)" }}>
              {post.title}
            </h1>
            <p className="text-lg text-dark-gray/60 mb-8 leading-relaxed">{post.excerpt}</p>

            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#EBC9A8]/30">
                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-charcoal">{post.author.name}</p>
                <div className="flex items-center gap-2 text-xs text-dark-gray/50">
                  <Calendar className="h-3 w-3" />{formatDate(post.date)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12">
          <div className="relative aspect-[2/1] rounded-3xl overflow-hidden">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Article Content */}
            <article>
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-charcoal prose-p:text-dark-gray/70 prose-p:leading-relaxed prose-a:text-[#8A6A4A] prose-a:no-underline hover:prose-a:underline prose-strong:text-charcoal prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />

              {/* Tags */}
              <div className="mt-10 flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-dark-gray/40" />
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-[#F2D8BE]/30 text-[#8A6A4A] text-xs font-medium rounded-full">{tag}</span>
                ))}
              </div>

              {/* Prev/Next Navigation */}
              <div className="mt-12 grid sm:grid-cols-2 gap-4">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`} className="group p-5 rounded-2xl border border-gray-100 hover:border-[#EBC9A8] hover:shadow-lg transition-all">
                    <span className="text-[11px] text-dark-gray/40 uppercase tracking-wider">Previous</span>
                    <h4 className="text-sm font-bold text-charcoal mt-1 group-hover:text-[#8A6A4A] transition-colors line-clamp-2">{prevPost.title}</h4>
                  </Link>
                ) : <div />}
                {nextPost && (
                  <Link href={`/blog/${nextPost.slug}`} className="group p-5 rounded-2xl border border-gray-100 hover:border-[#EBC9A8] hover:shadow-lg transition-all text-right">
                    <span className="text-[11px] text-dark-gray/40 uppercase tracking-wider">Next</span>
                    <h4 className="text-sm font-bold text-charcoal mt-1 group-hover:text-[#8A6A4A] transition-colors line-clamp-2">{nextPost.title}</h4>
                  </Link>
                )}
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 rounded-2xl bg-[#FDF6EE] border border-[#EBC9A8]/20">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#EBC9A8]/30 shrink-0">
                    <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-gray/40 uppercase tracking-wider mb-1">About the Author</p>
                    <h3 className="text-lg font-bold text-charcoal mb-2">{post.author.name}</h3>
                    <p className="text-sm text-dark-gray/60 leading-relaxed">{post.author.bio}</p>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <CommentSection comments={comments} postId={post.id} />
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <TableOfContents items={headings} />
              <div className="mt-4">
                <ArticleSidebar post={post} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-16 bg-[#FDF6EE]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-charcoal mb-8" style={{ fontFamily: "var(--font-libre)" }}>
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={r.coverImage} alt={r.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-semibold text-[#8A6A4A] uppercase tracking-wider">{r.category}</span>
                    <h3 className="text-base font-bold text-charcoal mt-1 line-clamp-2 group-hover:text-[#8A6A4A] transition-colors">{r.title}</h3>
                    <p className="text-xs text-dark-gray/50 mt-2">{r.author.name} &middot; {r.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <NewsletterBanner />
        </div>
      </section>
    </>
  );
}
