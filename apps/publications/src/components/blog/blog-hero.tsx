"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, X } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { blogPosts } from "@/lib/blog-data";
import { fuzzySearch, getSuggestion } from "@/lib/fuzzy-search";
import Link from "next/link";

interface BlogHeroProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function BlogHero({ onSearch, searchQuery }: BlogHeroProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const allTitles = useMemo(() => blogPosts.map((p) => p.title), []);

  const instantResults = useMemo(() => {
    if (!inputValue.trim() || inputValue.length < 2) return [];
    const results = fuzzySearch(
      blogPosts.slice(0, 50),
      inputValue,
      (p) => [p.title, p.excerpt, p.category, ...p.tags],
      0.3
    );
    return results.slice(0, 5).map((r) => r.item);
  }, [inputValue]);

  useEffect(() => {
    if (inputValue.trim()) {
      const s = getSuggestion(inputValue, allTitles);
      setSuggestion(s !== inputValue ? s : null);
    } else {
      setSuggestion(null);
    }
  }, [inputValue, allTitles]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (q: string) => {
    setInputValue(q);
    onSearch(q);
    setIsFocused(false);
  };

  const handleResultClick = (slug: string) => {
    setIsFocused(false);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF6EE] via-white to-white py-20 sm:py-28">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBC9A8]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D8B27A]/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 max-w-lg mx-auto"
          ref={wrapperRef}
        >
          <form onSubmit={handleSearch}>
            <div className={`relative p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE] transition-shadow duration-300 ${isFocused ? "shadow-lg shadow-[#EBC9A8]/20" : ""}`}>
              <div className="relative flex items-center bg-white rounded-[14px]">
                <Search className="absolute left-4 h-5 w-5 text-dark-gray/30" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Search articles, topics, authors..."
                  className="w-full pl-12 pr-28 py-4 rounded-[14px] bg-transparent focus:outline-none text-sm"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => { setInputValue(""); onSearch(""); inputRef.current?.focus(); }}
                    className="absolute right-20 p-1 text-dark-gray/30 hover:text-dark-gray/60 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2.5 bg-[#EBC9A8] text-charcoal text-sm font-semibold rounded-xl hover:bg-[#D8B27A] transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          <AnimatePresence>
            {isFocused && (instantResults.length > 0 || suggestion) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
              >
                {suggestion && (
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-[#FDF6EE] transition-colors border-b border-gray-50 flex items-center gap-2"
                  >
                    <Search className="h-3.5 w-3.5 text-dark-gray/30" />
                    <span className="text-dark-gray/50">Did you mean</span>
                    <span className="font-semibold text-[#8A6A4A]">{suggestion}</span>
                    <span className="text-dark-gray/50">?</span>
                  </button>
                )}
                {instantResults.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    onClick={() => handleResultClick(post.slug)}
                    className="w-full px-4 py-3 text-left hover:bg-[#FDF6EE] transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EBC9A8]/20 flex items-center justify-center shrink-0">
                      <Search className="h-3.5 w-3.5 text-[#8A6A4A]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{post.title}</p>
                      <p className="text-[11px] text-dark-gray/40">{post.category}</p>
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-3 text-left text-sm text-[#8A6A4A] font-semibold hover:bg-[#FDF6EE] transition-colors"
                >
                  Search for &ldquo;{inputValue}&rdquo;
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
