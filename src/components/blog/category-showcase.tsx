"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, PenTool, Megaphone, Trophy, Newspaper, CheckCircle, Palette, GraduationCap, Search, Monitor, ArrowRight } from "lucide-react";
import { BlogCategory } from "@/lib/blog-data";

const iconMap: Record<string, typeof BookOpen> = {
  "book-open": BookOpen, "pen-tool": PenTool, "megaphone": Megaphone,
  "trophy": Trophy, "newspaper": Newspaper, "check-circle": CheckCircle,
  "palette": Palette, "graduation-cap": GraduationCap, "search": Search,
  "monitor": Monitor,
};

export default function CategoryShowcase({ categories }: { categories: BlogCategory[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((cat, i) => {
        const Icon = iconMap[cat.icon] || BookOpen;
        return (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/blog?category=${cat.slug}`}>
              <div className="group p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#EBC9A8] hover:shadow-lg hover:shadow-[#EBC9A8]/10 transition-all duration-300 text-center h-full">
                <div className="w-11 h-11 rounded-xl bg-[#F2D8BE]/40 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#EBC9A8]/40 transition-colors">
                  <Icon className="h-5 w-5 text-[#8A6A4A]" />
                </div>
                <h3 className="text-sm font-bold text-charcoal mb-1 group-hover:text-[#8A6A4A] transition-colors">{cat.name}</h3>
                <p className="text-[11px] text-dark-gray/50">{cat.postCount} articles</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
