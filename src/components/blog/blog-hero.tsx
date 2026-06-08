"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/blog?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF6EE] via-white to-white py-20 sm:py-28">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBC9A8]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D8B27A]/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#EBC9A8]/30 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-sm text-[#8A6A4A] mb-6">
          <Sparkles className="h-4 w-4" />
          The Statement Blog
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-charcoal leading-[1.1]"
          style={{ fontFamily: "var(--font-libre)" }}
        >
          Insights for Authors
          <br />
          <span className="text-[#8A6A4A]">& Publishers</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg text-dark-gray/60 max-w-2xl mx-auto"
        >
          Expert advice on writing, publishing, marketing, and building your author career.
        </motion.p>

        {/* Search */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 max-w-lg mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-gray/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-28 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-[#EBC9A8] text-charcoal text-sm font-semibold rounded-xl hover:bg-[#D8B27A] transition-colors"
            >
              Search
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
