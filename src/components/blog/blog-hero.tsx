"use client";

import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

interface BlogHeroProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function BlogHero({ onSearch, searchQuery }: BlogHeroProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF6EE] via-white to-white py-20 sm:py-28">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBC9A8]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D8B27A]/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* The Statement Blog — animated gradient border */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="relative inline-flex mb-6 p-[2px] rounded-full bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm text-[#8A6A4A]">
            <Sparkles className="h-4 w-4" />
            <span>The Statement Blog</span>
          </div>
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

        {/* Search with animated gradient border */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 max-w-lg mx-auto"
        >
          <div className="relative p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]">
            <div className="relative flex items-center bg-white rounded-[14px]">
              <Search className="absolute left-4 h-5 w-5 text-dark-gray/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-28 py-4 rounded-[14px] bg-transparent focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 bg-[#EBC9A8] text-charcoal text-sm font-semibold rounded-xl hover:bg-[#D8B27A] transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
