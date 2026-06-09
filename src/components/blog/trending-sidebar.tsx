"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, Eye, Clock } from "lucide-react";
import { BlogPost, formatDate } from "@/lib/blog-data";

export default function TrendingSidebar({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </div>
        <h3 className="text-sm font-bold text-charcoal">Trending Now</h3>
      </div>
      <div className="space-y-4">
        {posts.slice(0, 5).map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/blog/${post.slug}`} className="flex gap-3 group">
              <span className="text-2xl font-bold text-orange-400 w-7 shrink-0 leading-none pt-1">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-charcoal line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">{post.title}</h4>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-dark-gray/40">
                  <span>{post.author.name}</span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.viewCount.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
