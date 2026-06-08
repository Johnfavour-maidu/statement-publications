"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Share2, LinkIcon, Check, Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { BlogPost } from "@/lib/blog-data";

export default function ArticleSidebar({ post }: { post: BlogPost }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(`https://statement-publications.vercel.app/blog/${post.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 sticky top-24">
      {/* Author Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#EBC9A8]/30">
            <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-charcoal">{post.author.name}</p>
            <p className="text-[11px] text-dark-gray/50">Author</p>
          </div>
        </div>
        <p className="text-xs text-dark-gray/60 leading-relaxed">{post.author.bio}</p>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">Actions</h4>
        <div className="space-y-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${liked ? "bg-rose-50 text-rose-600" : "text-dark-gray/60 hover:bg-gray-50"}`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            {liked ? "Liked" : "Like this article"}
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${saved ? "bg-[#F2D8BE]/40 text-[#8A6A4A]" : "text-dark-gray/60 hover:bg-gray-50"}`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            {saved ? "Saved" : "Save for later"}
          </button>
        </div>
      </div>

      {/* Share */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">Share</h4>
        <div className="flex gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://statement-publications.vercel.app/blog/${post.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] text-xs font-medium hover:bg-[#1DA1F2]/20 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Twitter
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://statement-publications.vercel.app/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] text-xs font-medium hover:bg-[#0A66C2]/20 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
          <button
            onClick={copyLink}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100 text-dark-gray/60 text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <LinkIcon className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
