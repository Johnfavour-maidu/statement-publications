"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  Feather,
  Baby,
  GraduationCap,
  Globe,
  Mic,
  PenTool,
  Drama,
  Leaf,
  Cpu,
  Utensils,
} from "lucide-react";

const categories = [
  { name: "Fiction", slug: "fiction", icon: BookOpen, count: 142, color: "from-amber-500 to-orange-600" },
  { name: "Non-Fiction", slug: "non-fiction", icon: Globe, count: 98, color: "from-blue-500 to-indigo-600" },
  { name: "Romance", slug: "romance", icon: Heart, count: 76, color: "from-pink-500 to-rose-600" },
  { name: "Poetry", slug: "poetry", icon: Feather, count: 54, color: "from-purple-500 to-violet-600" },
  { name: "Children's", slug: "children", icon: Baby, count: 63, color: "from-green-500 to-emerald-600" },
  { name: "Academic", slug: "academic", icon: GraduationCap, count: 41, color: "from-blue-600 to-blue-800" },
  { name: "Biography", slug: "biography", icon: Mic, count: 37, color: "from-teal-500 to-cyan-600" },
  { name: "Self-Help", slug: "self-help", icon: PenTool, count: 89, color: "from-yellow-500 to-amber-600" },
  { name: "Drama", slug: "drama", icon: Drama, count: 28, color: "from-red-500 to-rose-700" },
  { name: "Nature", slug: "nature", icon: Leaf, count: 33, color: "from-green-600 to-green-800" },
  { name: "Science Fiction", slug: "science-fiction", icon: Cpu, count: 45, color: "from-indigo-500 to-purple-700" },
  { name: "Cooking", slug: "cooking", icon: Utensils, count: 22, color: "from-orange-500 to-red-600" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CategoriesPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse Categories
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our curated collection of genres. Find your next favorite read
          from a wide variety of categories.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.div key={category.slug} variants={item}>
              <Link href={`/store/categories/${category.slug}`}>
                <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} books
                      </p>
                    </div>
                    <div className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
