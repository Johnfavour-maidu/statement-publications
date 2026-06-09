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

const categoryStyles: Record<string, { bg: string; border: string; iconBg: string; iconColor: string; hoverBorder: string; hoverShadow: string; ctaBg: string; ctaHover: string }> = {
  "writing-tips": { bg: "bg-amber-50", border: "border-amber-400", iconBg: "bg-amber-100", iconColor: "text-amber-700", hoverBorder: "hover:border-amber-500", hoverShadow: "hover:shadow-amber-100", ctaBg: "bg-amber-100 text-amber-700", ctaHover: "group-hover:bg-amber-200" },
  "self-publishing": { bg: "bg-blue-50", border: "border-blue-400", iconBg: "bg-blue-100", iconColor: "text-blue-700", hoverBorder: "hover:border-blue-500", hoverShadow: "hover:shadow-blue-100", ctaBg: "bg-blue-100 text-blue-700", ctaHover: "group-hover:bg-blue-200" },
  "book-marketing": { bg: "bg-rose-50", border: "border-rose-400", iconBg: "bg-rose-100", iconColor: "text-rose-700", hoverBorder: "hover:border-rose-500", hoverShadow: "hover:shadow-rose-100", ctaBg: "bg-rose-100 text-rose-700", ctaHover: "group-hover:bg-rose-200" },
  "author-success-stories": { bg: "bg-emerald-50", border: "border-emerald-400", iconBg: "bg-emerald-100", iconColor: "text-emerald-700", hoverBorder: "hover:border-emerald-500", hoverShadow: "hover:shadow-emerald-100", ctaBg: "bg-emerald-100 text-emerald-700", ctaHover: "group-hover:bg-emerald-200" },
  "industry-news": { bg: "bg-violet-50", border: "border-violet-400", iconBg: "bg-violet-100", iconColor: "text-violet-700", hoverBorder: "hover:border-violet-500", hoverShadow: "hover:shadow-violet-100", ctaBg: "bg-violet-100 text-violet-700", ctaHover: "group-hover:bg-violet-200" },
  "editing-proofreading": { bg: "bg-teal-50", border: "border-teal-400", iconBg: "bg-teal-100", iconColor: "text-teal-700", hoverBorder: "hover:border-teal-500", hoverShadow: "hover:shadow-teal-100", ctaBg: "bg-teal-100 text-teal-700", ctaHover: "group-hover:bg-teal-200" },
  "book-design": { bg: "bg-orange-50", border: "border-orange-400", iconBg: "bg-orange-100", iconColor: "text-orange-700", hoverBorder: "hover:border-orange-500", hoverShadow: "hover:shadow-orange-100", ctaBg: "bg-orange-100 text-orange-700", ctaHover: "group-hover:bg-orange-200" },
  "academic-publishing": { bg: "bg-indigo-50", border: "border-indigo-400", iconBg: "bg-indigo-100", iconColor: "text-indigo-700", hoverBorder: "hover:border-indigo-500", hoverShadow: "hover:shadow-indigo-100", ctaBg: "bg-indigo-100 text-indigo-700", ctaHover: "group-hover:bg-indigo-200" },
  "research-journals": { bg: "bg-cyan-50", border: "border-cyan-400", iconBg: "bg-cyan-100", iconColor: "text-cyan-700", hoverBorder: "hover:border-cyan-500", hoverShadow: "hover:shadow-cyan-100", ctaBg: "bg-cyan-100 text-cyan-700", ctaHover: "group-hover:bg-cyan-200" },
  "digital-publishing": { bg: "bg-pink-50", border: "border-pink-400", iconBg: "bg-pink-100", iconColor: "text-pink-700", hoverBorder: "hover:border-pink-500", hoverShadow: "hover:shadow-pink-100", ctaBg: "bg-pink-100 text-pink-700", ctaHover: "group-hover:bg-pink-200" },
};

export default function CategoryShowcase({ categories }: { categories: BlogCategory[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((cat, i) => {
        const Icon = iconMap[cat.icon] || BookOpen;
        const style = categoryStyles[cat.slug] || categoryStyles["writing-tips"];
        return (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/blog/topic/${cat.slug}`}>
              <div className={`group p-5 rounded-2xl border-2 ${style.border} ${style.bg} ${style.hoverBorder} hover:shadow-lg ${style.hoverShadow} transition-all duration-300 text-center h-full`}>
                <div className={`w-11 h-11 rounded-xl ${style.iconBg} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`h-5 w-5 ${style.iconColor}`} />
                </div>
                <h3 className="text-sm font-bold text-charcoal mb-1">{cat.name}</h3>
                <p className="text-[11px] text-dark-gray/50 mb-3">{cat.postCount} articles</p>
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${style.ctaBg} ${style.ctaHover} px-3 py-1 rounded-full transition-colors`}>
                  Read More <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
