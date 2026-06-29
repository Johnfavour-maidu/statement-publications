"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  X,
  Check,
  RotateCcw,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Sort Options ─────────────────────────────────────── */

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best Selling" },
  { value: "highest-rated", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "title-az", label: "A\u2013Z" },
  { value: "title-za", label: "Z\u2013A" },
  { value: "recently-added", label: "Recently Added" },
];

/* ─── Filter Data ──────────────────────────────────────── */

const filterSections = [
  {
    key: "availability",
    label: "Availability",
    options: ["In Stock", "Pre-order", "Coming Soon"],
  },
  {
    key: "rating",
    label: "Rating",
    options: ["4+ Stars", "3+ Stars", "2+ Stars"],
  },
  {
    key: "language",
    label: "Language",
    options: [
      "English",
      "French",
      "Spanish",
      "Yoruba",
      "Igbo",
      "Hausa",
      "Swahili",
    ],
  },
  {
    key: "format",
    label: "Book Format",
    options: ["eBook", "Audiobook"],
  },
  {
    key: "publisher",
    label: "Publisher",
    options: ["Statement Publications"],
  },
];

const priceRanges = [
  { label: "Under $5", min: 0, max: 5 },
  { label: "$5 \u2013 $10", min: 5, max: 10 },
  { label: "$10 \u2013 $20", min: 10, max: 20 },
  { label: "$20 \u2013 $50", min: 20, max: 50 },
  { label: "Over $50", min: 50, max: Infinity },
];

const currentYear = new Date().getFullYear();
const publicationYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

/* ─── Filter Panel ─────────────────────────────────────── */

function FilterPanel({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [expandedSection, setExpandedSection] = useState<string | null>("availability");

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const toggleFilter = (section: string, value: string) => {
    setLocalFilters((prev) => {
      const current = Array.isArray(prev[section]) ? (prev[section] as string[]) : [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [section]: updated };
    });
  };

  const handleApply = () => {
    setFilters(localFilters);
    onApply();
    onClose();
  };

  const handleReset = () => {
    const empty: FilterState = {};
    setLocalFilters(empty);
    setFilters(empty);
    onReset();
    onClose();
  };

  const activeCount = Object.values(localFilters).reduce(
    (sum, val) => {
      if (Array.isArray(val)) return sum + val.length;
      if (typeof val === "string" && val) return sum + 1;
      return sum;
    },
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-[80]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[90] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-5 h-5 text-[#D8B27A]" />
                <h2 className="text-base font-bold text-[#1D1D1D]">Filters</h2>
                {activeCount > 0 && (
                  <span className="text-[11px] font-semibold bg-[#D8B27A] text-white px-2 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
              {filterSections.map((section) => (
                <div key={section.key} className="border-b border-gray-50 last:border-0">
                  <button
                    onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
                    className="w-full flex items-center justify-between py-3 text-left"
                  >
                    <span className="text-sm font-medium text-[#1D1D1D]">{section.label}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-gray-400 transition-transform",
                      expandedSection === section.key && "rotate-180"
                    )} />
                  </button>
                  <AnimatePresence>
                    {expandedSection === section.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-3 space-y-1">
                          {section.options.map((option) => {
                            const isSelected = (localFilters[section.key] || []).includes(option);
                            return (
                              <button
                                key={option}
                                onClick={() => toggleFilter(section.key, option)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors text-left",
                                  isSelected
                                    ? "bg-[#D8B27A]/10 text-[#8A6A4A] font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                                )}
                              >
                                <div className={cn(
                                  "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
                                  isSelected
                                    ? "bg-[#D8B27A] border-[#D8B27A]"
                                    : "border-gray-300"
                                )}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="border-b border-gray-50 last:border-0">
                <button
                  onClick={() => setExpandedSection(expandedSection === "price" ? null : "price")}
                  className="w-full flex items-center justify-between py-3 text-left"
                >
                  <span className="text-sm font-medium text-[#1D1D1D]">Price Range</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-gray-400 transition-transform",
                    expandedSection === "price" && "rotate-180"
                  )} />
                </button>
                <AnimatePresence>
                  {expandedSection === "price" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3 space-y-1">
                        {priceRanges.map((range) => {
                          const isSelected = localFilters.priceRange === range.label;
                          return (
                            <button
                              key={range.label}
                              onClick={() => setLocalFilters((prev) => ({
                                ...prev,
                                priceRange: isSelected ? undefined : range.label,
                              }))}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors text-left",
                                isSelected
                                  ? "bg-[#D8B27A]/10 text-[#8A6A4A] font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              )}
                            >
                              <div className={cn(
                                "w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors",
                                isSelected
                                  ? "border-[#D8B27A]"
                                  : "border-gray-300"
                              )}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-[#D8B27A]" />}
                              </div>
                              {range.label}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-b border-gray-50 last:border-0">
                <button
                  onClick={() => setExpandedSection(expandedSection === "year" ? null : "year")}
                  className="w-full flex items-center justify-between py-3 text-left"
                >
                  <span className="text-sm font-medium text-[#1D1D1D]">Publication Date</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-gray-400 transition-transform",
                    expandedSection === "year" && "rotate-180"
                  )} />
                </button>
                <AnimatePresence>
                  {expandedSection === "year" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3 flex flex-wrap gap-2">
                        {publicationYears.map((year) => {
                          const isSelected = (localFilters.year || []).includes(year.toString());
                          return (
                            <button
                              key={year}
                              onClick={() => toggleFilter("year", year.toString())}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border",
                                isSelected
                                  ? "bg-[#D8B27A]/10 text-[#8A6A4A] border-[#D8B27A]/30"
                                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                              )}
                            >
                              {year}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 h-11 rounded-xl border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 h-11 rounded-xl bg-[#D8B27A] hover:bg-[#8A6A4A] text-[#1D1D1D] hover:text-white font-semibold text-[13px]"
              >
                Apply Filters
                {activeCount > 0 && (
                  <span className="ml-2 text-[11px] bg-white/20 px-1.5 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Sort Dropdown ────────────────────────────────────── */

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = sortOptions.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[13px] font-medium text-[#1D1D1D] hover:border-[#D8B27A]/40 transition-colors bg-white"
      >
        <span className="text-gray-500">Sort:</span>
        <span className="max-w-[100px] truncate">{selected?.label || "Newest"}</span>
        <ChevronDown className={cn("w-3 h-3 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="py-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 text-[13px] transition-colors text-left",
                    value === option.value
                      ? "bg-[#D8B27A]/10 text-[#8A6A4A] font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {option.label}
                  {value === option.value && (
                    <Check className="w-3.5 h-3.5 text-[#D8B27A] ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── View Toggle ──────────────────────────────────────── */

function ViewToggle({
  value,
  onChange,
}: {
  value: "grid" | "list";
  onChange: (v: "grid" | "list") => void;
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => onChange("grid")}
        className={cn(
          "p-1.5 transition-colors",
          value === "grid"
            ? "bg-[#D8B27A]/10 text-[#8A6A4A]"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
        )}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-4 bg-gray-200" />
      <button
        onClick={() => onChange("list")}
        className={cn(
          "p-1.5 transition-colors",
          value === "list"
            ? "bg-[#D8B27A]/10 text-[#8A6A4A]"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
        )}
      >
        <List className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ─── Sub Navigation ───────────────────────────────────── */

export type FilterState = Record<string, string[] | string | undefined>;

const categoryNavLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categories", href: "/categories" },
  { label: "New Releases", href: "/books?sort=newest" },
  { label: "Best Sellers", href: "/books?filter=bestsellers" },
  { label: "Deals", href: "/deals" },
  { label: "Coming Soon", href: "/books?filter=preorder" },
];

export function SubNav({
  sortBy,
  onSortChange,
  viewMode,
  onViewChange,
  onOpenFilters,
  activeFilterCount = 0,
}: {
  sortBy: string;
  onSortChange: (v: string) => void;
  viewMode: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  onOpenFilters: () => void;
  activeFilterCount?: number;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-10">
          <div className="hidden lg:flex items-center gap-0.5">
            {categoryNavLinks.map((item) => (
              <Link key={item.label} href={item.href}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 text-[13px] font-medium rounded-lg transition-colors",
                  "text-[#1D1D1D] hover:text-[#8A6A4A] hover:bg-[#D8B27A]/5"
                )}>
                {"icon" in item && item.icon && <item.icon className="w-3.5 h-3.5" />}
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <Button
              onClick={onOpenFilters}
              variant="outline"
              className="h-7 px-2.5 rounded-lg border-gray-200 text-[13px] font-medium text-[#1D1D1D] hover:border-[#D8B27A]/40 hover:bg-[#D8B27A]/5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 text-[10px] font-semibold bg-[#D8B27A] text-white w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <SortDropdown value={sortBy} onChange={onSortChange} />
            <ViewToggle value={viewMode} onChange={onViewChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { FilterPanel };
