"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, X } from "lucide-react";
import { categoryGroups, type CategoryGroup } from "@/lib/category-data";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryFlyout({
  isOpen,
  onClose,
}: CategoryFlyoutProps) {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryGroup | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isOpen) {
      setHoveredCategory(null);
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredCategories = categoryGroups.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-[90]"
            onClick={onClose}
          />

          {/* Sidebar — full height, anchored left */}
          <motion.div
            ref={panelRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-[95] flex"
          >
            {/* Category List */}
            <div className="w-[310px] bg-white shadow-2xl flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-[#1D1D1D]">Browse Categories</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="px-4 pt-4 pb-3 border-b border-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Categories"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-[13px] text-[#1D1D1D] placeholder:text-gray-400 focus:outline-none focus:border-[#D8B27A] focus:ring-1 focus:ring-[#D8B27A]/30 transition-all"
                  />
                </div>
              </div>

              {/* Category List */}
              <div className="flex-1 overflow-y-auto py-1">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.slug}
                    onMouseEnter={() => setHoveredCategory(cat)}
                    onClick={() => {
                      window.location.href = `/categories?cat=${cat.slug}`;
                      onClose();
                    }}
                    className={cn(
                      "px-5 py-2.5 flex items-center gap-3 cursor-pointer transition-colors",
                      hoveredCategory?.slug === cat.slug
                        ? "bg-[#FDF6EE] text-[#8A6A4A]"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-[13px] font-medium leading-tight flex-1">
                      {cat.name}
                    </span>
                    <ChevronRight
                      className={cn(
                        "w-3.5 h-3.5 flex-shrink-0 transition-colors",
                        hoveredCategory?.slug === cat.slug
                          ? "text-[#8A6A4A]"
                          : "text-gray-300"
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Subcategory Flyout — appears to the right of the sidebar */}
            <AnimatePresence>
              {hoveredCategory && (
                <motion.div
                  key={hoveredCategory.slug}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="w-[420px] bg-white shadow-2xl h-full overflow-y-auto"
                >
                  <div className="p-6">
                    <h3 className="text-[16px] font-bold text-[#1D1D1D] mb-5">
                      {hoveredCategory.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
                      {hoveredCategory.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/categories?cat=${hoveredCategory.slug}&sub=${sub.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-[#F5EDE3] hover:text-[#8A6A4A] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link
                        href={`/categories?cat=${hoveredCategory.slug}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#8A6A4A] hover:text-[#6B5238] transition-colors"
                      >
                        Browse All {hoveredCategory.name}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
