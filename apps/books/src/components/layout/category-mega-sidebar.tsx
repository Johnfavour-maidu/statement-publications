"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, X, BookOpen } from "lucide-react";
import { categoryGroups, type CategoryGroup } from "@/lib/category-data";
import Link from "next/link";

interface CategoryMegaSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryMegaSidebar({
  isOpen,
  onClose,
}: CategoryMegaSidebarProps) {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryGroup | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const filteredCategories = categoryGroups.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-[60]"
            onClick={onClose}
          />

          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-[360px] max-w-[90vw] bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#1D1D1D]">Browse Categories</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-[#1D1D1D] placeholder:text-gray-400 focus:outline-none focus:border-[#D8B27A] focus:ring-1 focus:ring-[#D8B27A]/30 transition-all"
                />
              </div>
            </div>

            {/* Two-panel content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left: category list */}
              <div className="w-[180px] flex-shrink-0 overflow-y-auto border-r border-gray-100">
                <div className="py-1">
                  {filteredCategories.map((cat) => (
                    <div
                      key={cat.slug}
                      onMouseEnter={() => setHoveredCategory(cat)}
                      className={`px-5 py-2.5 flex items-center gap-2 cursor-pointer transition-colors ${
                        hoveredCategory?.slug === cat.slug
                          ? "bg-[#FDF6EE] text-[#8A6A4A]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-sm font-medium leading-tight">
                        {cat.name}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 ml-auto transition-colors ${
                          hoveredCategory?.slug === cat.slug
                            ? "text-[#8A6A4A]"
                            : "text-gray-300"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: subcategories panel */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {hoveredCategory ? (
                    <motion.div
                      key={hoveredCategory.slug}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="p-5"
                    >
                      <h3 className="text-sm font-bold text-[#1D1D1D] mb-3 flex items-center gap-2">
                        <span>{hoveredCategory.icon}</span>
                        {hoveredCategory.name}
                      </h3>
                      <div className="space-y-0.5">
                        {hoveredCategory.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/books?category=${sub.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-[#F5EDE3] hover:text-[#8A6A4A] transition-colors"
                          >
                            <ChevronRight className="w-3 h-3 text-gray-300" />
                            {sub.name}
                          </Link>
                        ))}
                      </div>

                      {/* Featured book card */}
                      <div className="mt-6 rounded-xl bg-gradient-to-br from-[#FDF6EE] to-[#F5EDE3] p-4 border border-[#E8DDD0]">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-[#8A6A4A] mb-2">
                          Featured in {hoveredCategory.name}
                        </p>
                        <Link
                          href={`/books/${hoveredCategory.featuredBook.slug}`}
                          onClick={onClose}
                          className="flex items-start gap-3 group"
                        >
                          <div className="w-12 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 shadow-sm">
                            <img
                              src={`https://picsum.photos/seed/${hoveredCategory.featuredBook.slug}/96/128`}
                              alt={hoveredCategory.featuredBook.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1D1D1D] group-hover:text-[#8A6A4A] transition-colors line-clamp-2 leading-tight">
                              {hoveredCategory.featuredBook.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {hoveredCategory.featuredBook.author}
                            </p>
                          </div>
                        </Link>
                        <Link
                          href={`/books?category=${hoveredCategory.slug}`}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[#8A6A4A] hover:text-[#6B5238] transition-colors"
                        >
                          <BookOpen className="w-3 h-3" />
                          View all {hoveredCategory.name}
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full px-6 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#FDF6EE] flex items-center justify-center mb-4">
                        <BookOpen className="w-7 h-7 text-[#D8B27A]" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        Hover a category to explore subcategories
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-[#FDF6EE]/50">
              <Link
                href="/books"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#1D1D1D] text-white text-sm font-medium hover:bg-[#333] transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                View All Books
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
