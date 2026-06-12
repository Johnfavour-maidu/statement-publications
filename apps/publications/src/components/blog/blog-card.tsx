"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Eye, ArrowRight } from "lucide-react";
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
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#EBC9A8]/15 transition-all duration-500 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#8A6A4A] text-xs font-semibold rounded-lg shadow-sm">
                {post.category}
              </span>
            </div>
            {post.isEditorsPick && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 bg-[#EBC9A8] text-charcoal text-xs font-bold rounded-lg shadow-sm">
                  Editor&apos;s Pick
                </span>
              </div>
            )}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <ArrowRight className="h-4 w-4 text-charcoal" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            <h3 className="text-base font-bold text-charcoal mb-2 line-clamp-2 group-hover:text-[#8A6A4A] transition-colors leading-snug">
              {post.title}
            </h3>
            <p className="text-sm text-dark-gray/60 line-clamp-2 mb-4 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-100">
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
