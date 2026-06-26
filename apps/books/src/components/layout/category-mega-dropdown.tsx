"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
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
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
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
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute left-0 top-full z-[55]"
        >
          {/* Left Panel: Category List */}
          <div className="bg-white rounded-b-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 w-[300px] flex flex-col"
            style={{ maxHeight: "70vh" }}>
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
                    window.location.href = `/books?category=${cat.slug}`;
                    onClose();
                  }}
                  className={cn(
                    "px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors",
                    hoveredCategory?.slug === cat.slug
                      ? "bg-[#FDF6EE] text-[#8A6A4A]"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className="text-base w-6 text-center flex-shrink-0">{cat.icon}</span>
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

          {/* Right Flyout: Subcategories */}
          <AnimatePresence>
            {hoveredCategory && (
              <motion.div
                ref={flyoutRef}
                key={hoveredCategory.slug}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute left-[300px] top-0 z-[56]"
              >
                <div className="bg-white rounded-r-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 border-l-0 w-[420px]"
                  style={{ maxHeight: "70vh" }}>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-xl">{hoveredCategory.icon}</span>
                      <h3 className="text-[16px] font-bold text-[#1D1D1D]">
                        {hoveredCategory.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
                      {hoveredCategory.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/books?category=${sub.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-[#F5EDE3] hover:text-[#8A6A4A] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link
                        href={`/books?category=${hoveredCategory.slug}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#8A6A4A] hover:text-[#6B5238] transition-colors"
                      >
                        Browse All {hoveredCategory.name}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
