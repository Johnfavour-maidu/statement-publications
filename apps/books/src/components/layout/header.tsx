"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { books } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import type { DemoBook } from "@/lib/demo-data";
import CategoryMegaDropdown from "./category-mega-dropdown";

/* ─── Data ─────────────────────────────────────────────── */

const countries = [
  { code: "NG", name: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "GH", name: "Ghana", flag: "\u{1F1EC}\u{1F1ED}" },
  { code: "KE", name: "Kenya", flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "ZA", name: "South Africa", flag: "\u{1F1FF}\u{1F1E6}" },
  { code: "US", name: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "GB", name: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "CA", name: "Canada", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "DE", name: "Germany", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "FR", name: "France", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "IN", name: "India", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "JP", name: "Japan", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "BR", name: "Brazil", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "AU", name: "Australia", flag: "\u{1F1E6}\u{1F1FA}" },
  { code: "CN", name: "China", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "MX", name: "Mexico", flag: "\u{1F1F2}\u{1F1FD}" },
  { code: "AE", name: "United Arab Emirates", flag: "\u{1F1E6}\u{1F1EA}" },
  { code: "SA", name: "Saudi Arabia", flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "EG", name: "Egypt", flag: "\u{1F1EA}\u{1F1EC}" },
  { code: "TZ", name: "Tanzania", flag: "\u{1F1F9}\u{1F1FF}" },
  { code: "UG", name: "Uganda", flag: "\u{1F1FA}\u{1F1EC}" },
  { code: "ET", name: "Ethiopia", flag: "\u{1F1EA}\u{1F1F9}" },
  { code: "SN", name: "Senegal", flag: "\u{1F1F8}\u{1F1F3}" },
  { code: "CM", name: "Cameroon", flag: "\u{1F1E8}\u{1F1F2}" },
  { code: "CI", name: "Cote d'Ivoire", flag: "\u{1F1E8}\u{1F1EE}" },
  { code: "RW", name: "Rwanda", flag: "\u{1F1F7}\u{1F1FC}" },
  { code: "SG", name: "Singapore", flag: "\u{1F1F8}\u{1F1EC}" },
  { code: "KR", name: "South Korea", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "IT", name: "Italy", flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "ES", name: "Spain", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "NL", name: "Netherlands", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "SE", name: "Sweden", flag: "\u{1F1F8}\u{1F1EA}" },
  { code: "CH", name: "Switzerland", flag: "\u{1F1E8}\u{1F1ED}" },
  { code: "PT", name: "Portugal", flag: "\u{1F1F5}\u{1F1F9}" },
  { code: "PL", name: "Poland", flag: "\u{1F1F5}\u{1F1F1}" },
  { code: "RU", name: "Russia", flag: "\u{1F1F7}\u{1F1FA}" },
  { code: "TR", name: "Turkey", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "AR", name: "Argentina", flag: "\u{1F1E6}\u{1F1F7}" },
  { code: "CO", name: "Colombia", flag: "\u{1F1E8}\u{1F1F4}" },
  { code: "CL", name: "Chile", flag: "\u{1F1E8}\u{1F1F1}" },
  { code: "PH", name: "Philippines", flag: "\u{1F1F5}\u{1F1ED}" },
  { code: "ID", name: "Indonesia", flag: "\u{1F1EE}\u{1F1E9}" },
  { code: "MY", name: "Malaysia", flag: "\u{1F1F2}\u{1F1FE}" },
  { code: "TH", name: "Thailand", flag: "\u{1F1F9}\u{1F1ED}" },
  { code: "VN", name: "Vietnam", flag: "\u{1F1FB}\u{1F1F3}" },
  { code: "PK", name: "Pakistan", flag: "\u{1F1F5}\u{1F1F0}" },
  { code: "BD", name: "Bangladesh", flag: "\u{1F1E7}\u{1F1E9}" },
  { code: "NZ", name: "New Zealand", flag: "\u{1F1F3}\u{1F1FF}" },
  { code: "IE", name: "Ireland", flag: "\u{1F1EE}\u{1F1EA}" },
  { code: "IL", name: "Israel", flag: "\u{1F1EE}\u{1F1F1}" },
  { code: "NO", name: "Norway", flag: "\u{1F1F3}\u{1F1F4}" },
  { code: "DK", name: "Denmark", flag: "\u{1F1E9}\u{1F1F0}" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
  { code: "zh-Hans", name: "Chinese (Simplified)" },
  { code: "zh-Hant", name: "Chinese (Traditional)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "hi", name: "Hindi" },
  { code: "sw", name: "Swahili" },
  { code: "yo", name: "Yoruba" },
  { code: "ig", name: "Igbo" },
  { code: "ha", name: "Hausa" },
];

const ebooksMenuColumns = [
  {
    title: "Browse",
    items: [
      { label: "Business", href: "/categories/business-entrepreneurship" },
      { label: "Personal Finance", href: "/categories/personal-finance" },
      { label: "Leadership", href: "/categories/leadership" },
      { label: "Technology", href: "/categories/technology" },
      { label: "Self Development", href: "/categories/self-development" },
    ],
  },
  {
    title: "Explore",
    items: [
      { label: "Health", href: "/categories/health-wellness" },
      { label: "Education", href: "/categories/education" },
      { label: "Religion", href: "/categories/religion-inspiration" },
      { label: "Biography", href: "/categories/biography" },
      { label: "Politics", href: "/categories/politics" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "History", href: "/categories/history" },
      { label: "Science", href: "/categories/science" },
      { label: "African Literature", href: "/categories/african-literature" },
      { label: "Fiction", href: "/categories/fiction" },
      { label: "Non-Fiction", href: "/categories/non-fiction" },
    ],
  },
];

const audiobooksMenuColumns = [
  {
    title: "Browse",
    items: [
      { label: "Business", href: "/audiobooks" },
      { label: "Fiction", href: "/audiobooks" },
      { label: "Self Development", href: "/audiobooks" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Biographies", href: "/audiobooks" },
      { label: "Children", href: "/audiobooks" },
      { label: "View All Audiobooks", href: "/audiobooks", bold: true },
    ],
  },
];

const categoryNavItems = [
  { label: "Categories", hasDropdown: true, key: "categories" },
  { label: "New Releases", href: "/books?sort=newest" },
  { label: "Best Sellers", href: "/books?filter=bestsellers" },
  { label: "Deals", href: "/deals" },
  { label: "Coming Soon", href: "/books?filter=preorder" },
];

/* ─── Utility Bar Dropdowns ────────────────────────────── */

function CountryDropdown() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sp-country") || "NG";
    }
    return "NG";
  });
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedCountry = countries.find((c) => c.code === selected) || countries[0];
  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  useEffect(() => { setHighlightIndex(0); }, [search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectCountry = (code: string) => {
    setSelected(code);
    localStorage.setItem("sp-country", code);
    setOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[highlightIndex]) selectCountry(filtered[highlightIndex].code); }
    else if (e.key === "Escape") { setOpen(false); setSearch(""); }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
        <span>{selectedCountry.flag}</span>
        <span className="hidden sm:inline">Country</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }} transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100]" onKeyDown={handleKeyDown}>
            <div className="p-2.5 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input ref={searchRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search countries..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#D8B27A] focus:ring-1 focus:ring-[#D8B27A]/20" />
              </div>
            </div>
            <div className="max-h-[280px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">No countries found</div>
              ) : (
                filtered.map((country, i) => (
                  <button key={country.code} onClick={() => selectCountry(country.code)} onMouseEnter={() => setHighlightIndex(i)}
                    className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                      selected === country.code ? "bg-[#D8B27A]/10 text-[#8A6A4A] font-medium" : highlightIndex === i ? "bg-gray-50" : "text-[#1D1D1D] hover:bg-gray-50")}>
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1">{country.name}</span>
                    {selected === country.code && <span className="text-[#D8B27A] text-xs font-semibold">Selected</span>}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("sp-language") || "en";
    return "en";
  });
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedLanguage = languages.find((l) => l.code === selected) || languages[0];
  const filtered = languages.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => { if (open && searchRef.current) searchRef.current.focus(); }, [open]);
  useEffect(() => { setHighlightIndex(0); }, [search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) { setOpen(false); setSearch(""); }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectLanguage = (code: string) => { setSelected(code); localStorage.setItem("sp-language", code); setOpen(false); setSearch(""); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[highlightIndex]) selectLanguage(filtered[highlightIndex].code); }
    else if (e.key === "Escape") { setOpen(false); setSearch(""); }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Language</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }} transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100]" onKeyDown={handleKeyDown}>
            <div className="p-2.5 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input ref={searchRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search languages..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#D8B27A] focus:ring-1 focus:ring-[#D8B27A]/20" />
              </div>
            </div>
            <div className="max-h-[280px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">No languages found</div>
              ) : (
                filtered.map((lang, i) => (
                  <button key={lang.code} onClick={() => selectLanguage(lang.code)} onMouseEnter={() => setHighlightIndex(i)}
                    className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                      selected === lang.code ? "bg-[#D8B27A]/10 text-[#8A6A4A] font-medium" : highlightIndex === i ? "bg-gray-50" : "text-[#1D1D1D] hover:bg-gray-50")}>
                    <span className="flex-1">{lang.name}</span>
                    {selected === lang.code && <span className="text-[#D8B27A] text-xs font-semibold">Selected</span>}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Mega Menu ────────────────────────────────────────── */

function MegaMenu({
  columns,
  type,
  onClose,
}: {
  columns: { title: string; items: { label: string; href: string; bold?: boolean }[] }[];
  type: "ebooks" | "audiobooks";
  onClose: () => void;
}) {
  return (
    <div className="py-6 px-8">
      <div className="grid grid-cols-3 gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{col.title}</h4>
            <ul className="space-y-1">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} onClick={onClose}
                    className={cn("block py-1.5 text-sm transition-colors",
                      item.bold ? "font-semibold text-[#D8B27A] hover:text-[#8A6A4A]" : "text-[#1D1D1D] hover:text-[#D8B27A]")}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-6">
        <Link href={type === "ebooks" ? "/books" : "/audiobooks"} onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#D8B27A] hover:text-[#8A6A4A] transition-colors">
          View All {type === "ebooks" ? "eBooks" : "Audiobooks"} <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/deals" onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#D8B27A] transition-colors">
          Deals
        </Link>
      </div>
    </div>
  );
}

/* ─── Search Bar (Centralized) ─────────────────────────── */

function SearchBar({
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  handleSearch,
  totalResults,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (v: boolean) => void;
  suggestions: DemoBook[];
  handleSearch: (q?: string) => void;
  totalResults: number;
}) {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setShowSuggestions]);

  return (
    <div ref={searchRef} className="relative hidden sm:block" style={{ flex: "1 1 auto", maxWidth: "42%", margin: "0 auto" }}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          placeholder="Search books"
          className="w-full pl-4 pr-12 py-2.5 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#D8B27A] focus:ring-2 focus:ring-[#D8B27A]/15 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-md"
        />
        <button onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-[#D8B27A]/10 text-gray-400 hover:text-[#D8B27A] transition-all duration-200">
          <Search className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[60]">
            {suggestions.length > 0 ? (
              <>
                {suggestions.map((book) => (
                  <Link key={book.id} href={`/books/${book.slug}`}
                    onClick={() => { setShowSuggestions(false); setSearchQuery(""); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1D1D1D] line-clamp-1">{book.title}</p>
                      <p className="text-xs text-gray-400">{book.author.penName}</p>
                    </div>
                    <span className="text-sm font-bold text-[#1D1D1D] flex-shrink-0">
                      ${(book.discountPrice || book.price).toFixed(2)}
                    </span>
                  </Link>
                ))}
                {totalResults > 8 && (
                  <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setShowSuggestions(false); setSearchQuery(""); }}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-[#D8B27A] hover:bg-gray-50 border-t border-gray-50">
                    View all matching books
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-400 mb-3">No books found</p>
                <Link href="/books"
                  onClick={() => { setShowSuggestions(false); setSearchQuery(""); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D1D1D] text-white text-sm font-medium hover:bg-[#333] transition-colors">
                  Browse All Books
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Category Nav ─────────────────────────────────────── */

function CategoryNav({ openDropdown, setOpenDropdown }: { openDropdown: string | null; setOpenDropdown: (v: string | null) => void }) {
  return (
    <div className="hidden lg:block bg-white/80 backdrop-blur-sm border-b border-gray-100 relative">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center gap-1 h-11">
          {categoryNavItems.map((navItem) => (
            <div key={navItem.key || navItem.label} className="relative"
              onMouseEnter={() => navItem.hasDropdown && setOpenDropdown(navItem.key)}
              onMouseLeave={() => navItem.hasDropdown && setOpenDropdown(null)}>
              {navItem.hasDropdown ? (
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors",
                    openDropdown === navItem.key
                      ? "text-[#8A6A4A] bg-[#D8B27A]/10"
                      : "text-[#1D1D1D] hover:text-[#8A6A4A] hover:bg-[#D8B27A]/5"
                  )}
                  onClick={() => setOpenDropdown(openDropdown === navItem.key ? null : navItem.key)}
                  aria-expanded={openDropdown === navItem.key}
                  aria-haspopup="true"
                >
                  {navItem.label}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openDropdown === navItem.key && "rotate-180")} />
                </button>
              ) : (
                <Link href={navItem.href!}
                  className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-[#1D1D1D] hover:text-[#8A6A4A] hover:bg-[#D8B27A]/5 rounded-lg transition-colors">
                  {navItem.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {openDropdown === "categories" && (
        <CategoryMegaDropdown isOpen={true} onClose={() => setOpenDropdown(null)} />
      )}
    </div>
  );
}

/* ─── Mobile Drawer ────────────────────────────────────── */

function MobileDrawer({
  open,
  onClose,
  searchQuery,
  setSearchQuery,
  handleSearch,
  cartCount,
  wishlistCount,
}: {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  handleSearch: (q?: string) => void;
  cartCount: number;
  wishlistCount: number;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-[70] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link href="/" onClick={onClose} className="flex items-center">
                <img src="/logo.png" alt="Statement Publications" className="h-8 w-auto" />
              </Link>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { handleSearch(); onClose(); } }}
                  placeholder="Search books, authors..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D8B27A]" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Browse</p>
              {categoryNavItems.map((item) => (
                <Link key={item.label} href={item.href || (item.key === "categories" ? "/categories" : "#")}
                  onClick={onClose}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors">
                  {item.label}
                </Link>
              ))}

              <hr className="my-3 border-gray-100" />

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
              <Link href="/wishlist" onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors">
                <Heart className="w-4 h-4" /> Wishlist
                {wishlistCount > 0 && <span className="text-xs text-gray-400 ml-auto">({wishlistCount})</span>}
              </Link>
              <Link href="/cart" onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors">
                <ShoppingCart className="w-4 h-4" /> Cart
                {cartCount > 0 && <span className="text-xs text-gray-400 ml-auto">({cartCount})</span>}
              </Link>
              <Link href="/my-library" onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors">
                My Library
              </Link>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 space-y-2">
              <Link href="/login" onClick={onClose}
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-[#1D1D1D] border border-[#1D1D1D]/20 hover:bg-[#1D1D1D] hover:text-white hover:border-[#1D1D1D] transition-all duration-200">
                Sign In
              </Link>
              <Link href="/register" onClick={onClose}
                className="btn-primary flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-[#1D1D1D] bg-[#D8B27A] hover:bg-[#8A6A4A] hover:text-white transition-all duration-200">
                Create Account
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Header ───────────────────────────────────────────── */

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<DemoBook[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const router = useRouter();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setTotalResults(0);
      return;
    }

    const timer = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const results = books
        .filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.isbn.includes(q) ||
            b.description?.toLowerCase().includes(q) ||
            b.tags?.some((t) => t.toLowerCase().includes(q))
        );
      setTotalResults(results.length);
      setSuggestions(results.slice(0, 8));
      setShowSuggestions(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setShowSuggestions(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleSearch = (q?: string) => {
    const query = q || searchQuery;
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Layer 1: Utility Bar */}
      <div
        className="hidden md:block h-9"
        style={{
          background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 40%, #F2D8BE 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-end gap-5 text-xs font-medium text-[#1D1D1D]">
          <Link href="https://statement-cyan.vercel.app" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
            <span>Publish With Us</span>
          </Link>
          <div className="w-px h-3 bg-[#1D1D1D]/20" />
          <CountryDropdown />
          <div className="w-px h-3 bg-[#1D1D1D]/20" />
          <LanguageDropdown />
          <div className="w-px h-3 bg-[#1D1D1D]/20" />
          <Link href="/support" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
            <span>Support</span>
          </Link>
        </div>
      </div>

      {/* Layer 2: Main Header — Simplified Ecommerce Style */}
      <nav className={cn(
        "transition-all duration-300 border-b",
        scrolled
          ? "bg-[#FDF6EE]/95 backdrop-blur-md border-[#D8B27A]/10 shadow-sm"
          : "bg-[#FDF6EE]/95 backdrop-blur-md border-[#D8B27A]/10"
      )}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center"
          style={{ height: scrolled ? "60px" : "68px", transition: "height 0.3s" }}>
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 mr-6">
            <img src="/logo.png" alt="Statement Publications" className="h-8 lg:h-10 w-auto" />
          </Link>

          {/* Centralized Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            suggestions={suggestions}
            handleSearch={handleSearch}
            totalResults={totalResults}
          />

          {/* Right Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
            <Link href="/search" className="sm:hidden p-2.5 rounded-xl hover:bg-[#D8B27A]/10 transition-colors text-[#1D1D1D]">
              <Search className="w-5 h-5" />
            </Link>

            <Link href="/wishlist"
              className="relative p-2.5 rounded-xl hover:bg-[#D8B27A]/10 transition-colors text-[#1D1D1D] group">
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center text-white px-1"
                  style={{ background: "#D8B27A" }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart"
              className="relative p-2.5 rounded-xl hover:bg-[#D8B27A]/10 transition-colors text-[#1D1D1D] group">
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center text-white px-1"
                  style={{ background: "#D8B27A" }}>
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/login"
              className="hidden lg:inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-[#1D1D1D] border border-[#1D1D1D]/20 hover:bg-[#1D1D1D] hover:text-white hover:border-[#1D1D1D] transition-all duration-200">
              Sign In
            </Link>

            <Link href="/register"
              className="btn-primary hidden lg:inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-[#1D1D1D] bg-[#D8B27A] hover:bg-[#8A6A4A] hover:text-white transition-all duration-200">
              Create Account
            </Link>

            <button onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-[#D8B27A]/10 transition-colors text-[#1D1D1D]">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Layer 3: Category Navigation */}
      <CategoryNav openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />

      {/* Mobile Drawer */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </header>
  );
}
