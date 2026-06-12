"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Eye } from "lucide-react";
import { BlogPost } from "@/lib/blog-data";

export default function TrendingSidebar({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
      <div className="bg-white rounded-[14px] p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-charcoal">Trending Now</h3>
        </div>
        <div className="space-y-0 divide-y divide-gray-50">
          {posts.slice(0, 5).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="py-3 first:pt-0 last:pb-0"
            >
              <Link href={`/blog/${post.slug}`} className="flex gap-3 group">
                <span className="text-lg font-bold text-orange-400/60 w-6 shrink-0 leading-none pt-0.5">{String(i + 1).padStart(2, "0")}</span>
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
    </div>
  );
}
