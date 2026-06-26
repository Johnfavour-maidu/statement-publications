"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { categoryGroups, type CategoryGroup } from "@/lib/category-data";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryMegaDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryMegaDropdown({
  isOpen,
  onClose,
}: CategoryMegaDropdownProps) {
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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute left-0 right-0 top-full z-[55]"
        >
          <div className="bg-white border-t border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.1)] rounded-b-2xl">
            <div className="max-w-[1100px] mx-auto flex" style={{ maxHeight: "70vh" }}>
              {/* Left Column: Categories */}
              <div className="w-[320px] flex-shrink-0 border-r border-gray-100 flex flex-col">
                {/* Search */}
                <div className="px-4 pt-4 pb-3">
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
                <div className="flex-1 overflow-y-auto pb-2">
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

              {/* Right Column: Subcategories */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {hoveredCategory ? (
                    <motion.div
                      key={hoveredCategory.slug}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="p-5"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">{hoveredCategory.icon}</span>
                        <h3 className="text-[15px] font-bold text-[#1D1D1D]">
                          {hoveredCategory.name}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
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
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <Link
                          href={`/books?category=${hoveredCategory.slug}`}
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#8A6A4A] hover:text-[#6B5238] transition-colors"
                        >
                          Browse all {hoveredCategory.name}
                          <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full px-8 text-center py-16"
                    >
                      <p className="text-[13px] text-gray-400">
                        Select a category to explore subcategories
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
