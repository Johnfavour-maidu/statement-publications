"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Eye, Heart, MessageCircle, ArrowRight } from "lucide-react";
import { BlogPost, formatDate } from "@/lib/blog-data";

export default function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#EBC9A8]/10 transition-all duration-500 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#8A6A4A] text-xs font-semibold rounded-full">
                {post.category}
              </span>
            </div>
            {post.isEditorsPick && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-[#EBC9A8] text-charcoal text-xs font-bold rounded-full">
                  Editor's Pick
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            <h3 className="text-lg font-bold text-charcoal mb-2 line-clamp-2 group-hover:text-[#8A6A4A] transition-colors leading-snug">
              {post.title}
            </h3>
            <p className="text-sm text-dark-gray/60 line-clamp-2 mb-4 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-charcoal">{post.author.name}</p>
                  <p className="text-[11px] text-dark-gray/50">{formatDate(post.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-dark-gray/40">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}m</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.viewCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
