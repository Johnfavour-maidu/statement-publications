"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { BlogPost, formatDate } from "@/lib/blog-data";

export default function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="group relative rounded-3xl overflow-hidden bg-white border border-gray-100 hover:shadow-2xl hover:shadow-[#EBC9A8]/15 transition-all duration-500">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[400px] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 group-hover:to-black/20 transition-all duration-500" />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-4 py-1.5 bg-[#EBC9A8] text-charcoal text-xs font-bold rounded-full uppercase tracking-wider">
                  Featured
                </span>
                {post.isEditorsPick && (
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-[#8A6A4A] text-xs font-bold rounded-full">
                    Editor's Pick
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="text-xs font-semibold text-[#8A6A4A] uppercase tracking-wider mb-3">
                {post.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4 leading-tight group-hover:text-[#8A6A4A] transition-colors" style={{ fontFamily: "var(--font-libre)" }}>
                {post.title}
              </h2>
              <p className="text-dark-gray/60 mb-6 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#EBC9A8]/30">
                  <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{post.author.name}</p>
                  <p className="text-xs text-dark-gray/50">{formatDate(post.date)}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-dark-gray/40 mb-6">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{post.readTime} min read</span>
                <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{post.viewCount.toLocaleString()} views</span>
              </div>

              {/* CTA */}
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A6A4A] group-hover:text-[#D8B27A] transition-colors">
                Read Article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
