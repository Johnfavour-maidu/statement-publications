"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  User,
  ArrowLeft,
  Tag,
  Globe,
  MessageSquare,
  AtSign,
  LinkIcon,
  BookOpen,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
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
    bio: string | null;
  };
  comments: BlogComment[];
}

interface BlogComment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
  replies?: BlogComment[];
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  async function fetchPost(slug: string) {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.data);
        fetchRelated(data.data.category, data.data.id);
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRelated(category: string | null, currentId: string) {
    try {
      const params = new URLSearchParams({ pageSize: "3" });
      if (category) params.set("category", category);
      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();
      if (data.success) {
        setRelatedPosts(
          data.data.items.filter((p: BlogPost) => p.id !== currentId).slice(0, 3)
        );
      }
    } catch (error) {
      console.error("Failed to fetch related posts:", error);
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getReadingTime(content: string) {
    const words = content.split(/\s+/).length;
    const mins = Math.ceil(words / 200);
    return `${mins} min read`;
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function submitComment() {
    if (!commentText.trim() || !post) return;
    try {
      const res = await fetch(`/api/blog/${post.slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok) {
        setCommentText("");
        fetchPost(post.slug);
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4332]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <BookOpen className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link
          href="/blog"
          className="text-[#40916C] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background">
      <div className="relative h-[400px] md:h-[500px]">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1B4332] to-[#2D6A4F]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to blog
              </Link>
              {post.category && (
                <span className="inline-block bg-[#D4A373] text-[#1B4332] px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  {post.category}
                </span>
              )}
              <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    {post.author.image ? (
                      <Image
                        src={post.author.image}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <span className="font-medium">{post.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <span className="hidden sm:inline">·</span>
                <span>{getReadingTime(post.content)}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-[1fr_250px] gap-10"
        >
          <div>
            <div
              className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-[#40916C] prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-border">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 p-6 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt=""
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Written by</p>
                  <p className="font-playfair font-bold text-lg">
                    {post.author.name}
                  </p>
                  {post.author.bio && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="font-playfair text-xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#40916C]" />
                Comments ({post.comments?.length || 0})
              </h3>

              <div className="mb-6">
                <textarea
                  placeholder="Leave a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#40916C] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={submitComment}
                    disabled={!commentText.trim()}
                    className="px-6 py-2 rounded-lg bg-[#1B4332] text-white text-sm font-medium hover:bg-[#2D6A4F] transition-colors disabled:opacity-50"
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {post.comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-4 rounded-xl bg-muted/30"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {comment.user.image ? (
                        <Image
                          src={comment.user.image}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card rounded-xl border border-border p-5">
                <h4 className="font-medium mb-3">Share this article</h4>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-muted hover:bg-[#1B4332] hover:text-white transition-colors">
                    <Globe className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-muted hover:bg-[#1DA1F2] hover:text-white transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-muted hover:bg-[#0077B5] hover:text-white transition-colors">
                    <AtSign className="h-4 w-4" />
                  </button>
                  <button
                    onClick={copyLink}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      copied
                        ? "bg-[#40916C] text-white"
                        : "bg-muted hover:bg-[#1B4332] hover:text-white"
                    )}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button
                  onClick={() => setLiked(!liked)}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    liked && "text-[#40916C]"
                  )}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {post.likeCount + (liked ? 1 : 0)}
                </button>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {post.viewCount} views
                </span>
              </div>
            </div>
          </aside>
        </motion.div>

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-border">
            <h2 className="font-playfair text-2xl font-bold mb-8">
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`}>
                  <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group">
                    <div className="relative h-40">
                      {rp.coverImage ? (
                        <Image
                          src={rp.coverImage}
                          alt={rp.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1B4332]/10 to-[#40916C]/10 flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      {rp.category && (
                        <span className="text-xs text-[#40916C] font-medium">
                          {rp.category}
                        </span>
                      )}
                      <h3 className="font-playfair font-bold mt-1 group-hover:text-[#40916C] transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        {formatDate(rp.publishedAt)}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
