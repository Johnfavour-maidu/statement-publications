"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Star,
  Globe,
  MessageSquare,
  AtSign,
  ExternalLink,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthorData {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  socialLinks: Record<string, string> | null;
  authorProfile: {
    penName: string | null;
    website: string | null;
    socialLinks: Record<string, string> | null;
    genre: string[];
    totalBooks: number;
    totalSales: number;
    totalEarnings: number;
    bio: string | null;
    isFeatured: boolean;
    books: Book[];
  } | null;
  _count: { followers: number; following: number; reviews: number };
}

interface Book {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  price: number;
  averageRating: number;
  totalReviews: number;
  format: string;
  category: { name: string } | null;
}

export default function AuthorProfilePage() {
  const params = useParams();
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"books" | "reviews">("books");

  useEffect(() => {
    if (!params.slug) return;
    const slug = params.slug as string;

    async function load() {
      try {
        const res = await fetch(`/api/authors/${slug}`);
        const data = await res.json();
        if (data.success) {
          setAuthor(data.data);
          const followRes = await fetch(`/api/follow?authorId=${data.data.id}`);
          const followData = await followRes.json();
          if (followData.success) setIsFollowing(followData.data.isFollowing);
        }
      } catch (error) {
        console.error("Failed to fetch author:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.slug]);

  async function toggleFollow() {
    if (!author) return;
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch("/api/follow", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: author.id }),
      });
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setAuthor((prev) =>
          prev
            ? {
                ...prev,
                _count: {
                  ...prev._count,
                  followers: prev._count.followers + (isFollowing ? -1 : 1),
                },
              }
            : null
        );
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  }

  function getSocialIcon(platform: string) {
    switch (platform.toLowerCase()) {
      case "twitter": return MessageSquare;
      case "instagram": return AtSign;
      case "youtube": return Globe;
      default: return Globe;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4332]" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <BookOpen className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Author not found</h1>
        <Link href="/" className="text-[#40916C] hover:underline flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Go home
        </Link>
      </div>
    );
  }

  const socialLinks = { ...author.socialLinks, ...author.authorProfile?.socialLinks };

  const avgRating = author.authorProfile?.books?.length
    ? (author.authorProfile.books.reduce((acc: number, b: Book) => acc + b.averageRating, 0) / author.authorProfile.books.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[250px] md:h-[350px] bg-gradient-to-r from-[#1B4332] to-[#40916C]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:items-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-36 h-36 md:w-44 md:h-44 rounded-2xl border-4 border-background overflow-hidden bg-muted shadow-xl"
          >
            {author.image ? (
              <Image src={author.image} alt={author.name || ""} width={176} height={176} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B4332] to-[#40916C]">
                <span className="text-4xl font-bold text-white">{(author.name || "A").charAt(0).toUpperCase()}</span>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-playfair text-3xl md:text-4xl font-bold">{author.authorProfile?.penName || author.name}</h1>
                  {author.authorProfile?.isFeatured && (
                    <span className="bg-[#D4A373] text-[#1B4332] px-2 py-0.5 rounded-full text-xs font-semibold">Featured</span>
                  )}
                </div>
                {author.authorProfile?.penName && author.name && (
                  <p className="text-muted-foreground mt-1">Also known as {author.name}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {socialLinks && Object.keys(socialLinks).length > 0 && (
                  <div className="flex gap-2">
                    {Object.entries(socialLinks).map(([platform, url]) => {
                      const Icon = getSocialIcon(platform);
                      return (
                        <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-[#1B4332] hover:text-white transition-colors">
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                )}
                <button
                  onClick={toggleFollow}
                  className={cn(
                    "px-6 py-2.5 rounded-lg font-medium text-sm transition-all",
                    isFollowing ? "bg-muted text-foreground hover:bg-destructive hover:text-white" : "bg-[#1B4332] text-white hover:bg-[#2D6A4F]"
                  )}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-8 grid sm:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: "Books", value: author.authorProfile?.totalBooks || 0 },
            { icon: Users, label: "Followers", value: author._count.followers },
            { icon: Star, label: "Avg Rating", value: avgRating },
            { icon: TrendingUp, label: "Total Sales", value: author.authorProfile?.totalSales || 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-4 text-center">
              <stat.icon className="h-5 w-5 mx-auto mb-1 text-[#40916C]" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-10">
          <h2 className="font-playfair text-xl font-bold mb-3">About</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {author.authorProfile?.bio || author.bio || "This author hasn't added a bio yet."}
          </p>
          {author.authorProfile?.genre && author.authorProfile.genre.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {author.authorProfile.genre.map((g) => (
                <span key={g} className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">{g}</span>
              ))}
            </div>
          )}
          {author.authorProfile?.website && (
            <a href={author.authorProfile.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-[#40916C] hover:underline text-sm">
              <ExternalLink className="h-4 w-4" /> Visit Website
            </a>
          )}
        </motion.div>

        <div className="mt-12">
          <div className="flex gap-4 border-b border-border mb-8">
            {(["books", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 px-1 text-sm font-medium border-b-2 transition-colors capitalize",
                  activeTab === tab ? "border-[#1B4332] text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === "books" ? `Published Books (${author.authorProfile?.books?.length || 0})` : `Reviews (${author._count.reviews})`}
              </button>
            ))}
          </div>

          {activeTab === "books" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {author.authorProfile?.books?.map((book, i) => (
                <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  <Link href={`/books/${book.slug}`}>
                    <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group">
                      <div className="relative h-56">
                        {book.coverImage ? (
                          <Image src={book.coverImage} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-white/40" />
                          </div>
                        )}
                        {book.category && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-white/90 backdrop-blur-sm text-[#1B4332] px-2.5 py-1 rounded-full text-xs font-medium">{book.category.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-playfair font-bold text-lg group-hover:text-[#40916C] transition-colors line-clamp-2">{book.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-[#D4A373] fill-[#D4A373]" />
                            <span className="text-sm font-medium">{book.averageRating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({book.totalReviews})</span>
                          </div>
                          <span className="font-bold text-[#1B4332]">${book.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <p className="text-muted-foreground">Author reviews will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
