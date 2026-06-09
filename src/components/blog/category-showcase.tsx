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

const categoryStyles: Record<string, { fill: string; gradientFrom: string; gradientVia: string; gradientTo: string; iconBg: string; iconColor: string; ctaBg: string; ctaHover: string }> = {
  "writing-tips": { fill: "bg-amber-100", gradientFrom: "from-amber-400", gradientVia: "via-amber-500", gradientTo: "to-amber-600", iconBg: "bg-amber-200", iconColor: "text-amber-800", ctaBg: "bg-amber-200 text-amber-800", ctaHover: "group-hover:bg-amber-300" },
  "self-publishing": { fill: "bg-blue-100", gradientFrom: "from-blue-400", gradientVia: "via-blue-500", gradientTo: "to-blue-600", iconBg: "bg-blue-200", iconColor: "text-blue-800", ctaBg: "bg-blue-200 text-blue-800", ctaHover: "group-hover:bg-blue-300" },
  "book-marketing": { fill: "bg-rose-100", gradientFrom: "from-rose-400", gradientVia: "via-rose-500", gradientTo: "to-rose-600", iconBg: "bg-rose-200", iconColor: "text-rose-800", ctaBg: "bg-rose-200 text-rose-800", ctaHover: "group-hover:bg-rose-300" },
  "author-success-stories": { fill: "bg-emerald-100", gradientFrom: "from-emerald-400", gradientVia: "via-emerald-500", gradientTo: "to-emerald-600", iconBg: "bg-emerald-200", iconColor: "text-emerald-800", ctaBg: "bg-emerald-200 text-emerald-800", ctaHover: "group-hover:bg-emerald-300" },
  "industry-news": { fill: "bg-violet-100", gradientFrom: "from-violet-400", gradientVia: "via-violet-500", gradientTo: "to-violet-600", iconBg: "bg-violet-200", iconColor: "text-violet-800", ctaBg: "bg-violet-200 text-violet-800", ctaHover: "group-hover:bg-violet-300" },
  "editing-proofreading": { fill: "bg-teal-100", gradientFrom: "from-teal-400", gradientVia: "via-teal-500", gradientTo: "to-teal-600", iconBg: "bg-teal-200", iconColor: "text-teal-800", ctaBg: "bg-teal-200 text-teal-800", ctaHover: "group-hover:bg-teal-300" },
  "book-design": { fill: "bg-orange-100", gradientFrom: "from-orange-400", gradientVia: "via-orange-500", gradientTo: "to-orange-600", iconBg: "bg-orange-200", iconColor: "text-orange-800", ctaBg: "bg-orange-200 text-orange-800", ctaHover: "group-hover:bg-orange-300" },
  "academic-publishing": { fill: "bg-indigo-100", gradientFrom: "from-indigo-400", gradientVia: "via-indigo-500", gradientTo: "to-indigo-600", iconBg: "bg-indigo-200", iconColor: "text-indigo-800", ctaBg: "bg-indigo-200 text-indigo-800", ctaHover: "group-hover:bg-indigo-300" },
  "research-journals": { fill: "bg-cyan-100", gradientFrom: "from-cyan-400", gradientVia: "via-cyan-500", gradientTo: "to-cyan-600", iconBg: "bg-cyan-200", iconColor: "text-cyan-800", ctaBg: "bg-cyan-200 text-cyan-800", ctaHover: "group-hover:bg-cyan-300" },
  "digital-publishing": { fill: "bg-pink-100", gradientFrom: "from-pink-400", gradientVia: "via-pink-500", gradientTo: "to-pink-600", iconBg: "bg-pink-200", iconColor: "text-pink-800", ctaBg: "bg-pink-200 text-pink-800", ctaHover: "group-hover:bg-pink-300" },
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
              <div className={`group p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${style.gradientFrom} ${style.gradientVia} ${style.gradientTo} hover:shadow-lg transition-all duration-300 text-center h-full`}>
                <div className={`p-5 rounded-[14px] ${style.fill} h-full`}>
                  <div className={`w-11 h-11 rounded-xl ${style.iconBg} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`h-5 w-5 ${style.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-bold text-charcoal mb-1">{cat.name}</h3>
                  <p className="text-[11px] text-dark-gray/60 mb-3">{cat.postCount} articles</p>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${style.ctaBg} ${style.ctaHover} px-3 py-1 rounded-full transition-colors`}>
                    Read More <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
