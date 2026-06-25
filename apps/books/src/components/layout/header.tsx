"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  BookOpen,
  ChevronDown,
  Globe,
  HelpCircle,
  ExternalLink,
  Pen,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { books } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

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
  const listRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find((c) => c.code === selected) || countries[0];

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [search]);

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
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightIndex]) {
        selectCountry(filtered[highlightIndex].code);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
      >
        <span>{selectedCountry.flag}</span>
        <span className="hidden sm:inline">Country</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
            onKeyDown={handleKeyDown}
          >
            <div className="p-2.5 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#D8B27A] focus:ring-1 focus:ring-[#D8B27A]/20"
                />
              </div>
            </div>
            <div ref={listRef} className="max-h-[280px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  No countries found
                </div>
              ) : (
                filtered.map((country, i) => (
                  <button
                    key={country.code}
                    onClick={() => selectCountry(country.code)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                      selected === country.code
                        ? "bg-[#D8B27A]/10 text-[#8A6A4A] font-medium"
                        : highlightIndex === i
                        ? "bg-gray-50"
                        : "text-[#1D1D1D] hover:bg-gray-50"
                    )}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1">{country.name}</span>
                    {selected === country.code && (
                      <span className="text-[#D8B27A] text-xs font-semibold">Selected</span>
                    )}
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
    if (typeof window !== "undefined") {
      return localStorage.getItem("sp-language") || "en";
    }
    return "en";
  });
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedLanguage = languages.find((l) => l.code === selected) || languages[0];

  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [search]);

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

  const selectLanguage = (code: string) => {
    setSelected(code);
    localStorage.setItem("sp-language", code);
    setOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightIndex]) {
        selectLanguage(filtered[highlightIndex].code);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Language</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
            onKeyDown={handleKeyDown}
          >
            <div className="p-2.5 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#D8B27A] focus:ring-1 focus:ring-[#D8B27A]/20"
                />
              </div>
            </div>
            <div className="max-h-[280px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  No languages found
                </div>
              ) : (
                filtered.map((lang, i) => (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang.code)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                      selected === lang.code
                        ? "bg-[#D8B27A]/10 text-[#8A6A4A] font-medium"
                        : highlightIndex === i
                        ? "bg-gray-50"
                        : "text-[#1D1D1D] hover:bg-gray-50"
                    )}
                  >
                    <span className="flex-1">{lang.name}</span>
                    {selected === lang.code && (
                      <span className="text-[#D8B27A] text-xs font-semibold">Selected</span>
                    )}
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

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof books>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const results = books
        .filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.author.penName.toLowerCase().includes(q) ||
            b.author.name.toLowerCase().includes(q) ||
            b.category.name.toLowerCase().includes(q) ||
            b.isbn.includes(q)
        )
        .slice(0, 6);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
      {/* Layer 1: Utility Bar — Premium Gold Gradient */}
      <div
        className="hidden md:block h-9"
        style={{
          background:
            "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 40%, #F2D8BE 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-end gap-5 text-xs font-medium text-[#1D1D1D]">
          <Link
            href="https://statement-cyan.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
          >
            <Pen className="w-3.5 h-3.5" />
            <span>Publish With Us</span>
          </Link>

          <div className="w-px h-3 bg-[#1D1D1D]/20" />

          <CountryDropdown />

          <div className="w-px h-3 bg-[#1D1D1D]/20" />

          <LanguageDropdown />

          <div className="w-px h-3 bg-[#1D1D1D]/20" />

          <Link
            href="/support"
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support</span>
          </Link>
        </div>
      </div>

      {/* Layer 2: Main Header — Logo + Large Search + Actions */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 lg:h-[72px] flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 100%)",
              }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="text-lg font-bold text-[#1D1D1D] block">
                Statement
              </span>
              <span
                className="text-[10px] font-semibold tracking-[0.15em] uppercase block"
                style={{ color: "#D8B27A" }}
              >
                Books
              </span>
            </div>
          </Link>

          {/* Large Search Bar */}
          <div
            ref={searchRef}
            className="flex-1 max-w-2xl relative hidden sm:block"
          >
            <div
              className="relative p-[2px] rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, #EBC9A8 0%, #D8B27A 50%, #F2D8BE 100%)",
              }}
            >
              <div className="bg-white rounded-[10px] flex items-center">
                <Search className="w-5 h-5 text-gray-400 ml-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Search books, authors, categories, ISBN..."
                  className="flex-1 px-3.5 py-3 text-sm bg-transparent focus:outline-none rounded-[10px]"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                    className="p-1.5 mr-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleSearch()}
                  className="px-5 py-3 text-sm font-semibold text-white rounded-xl m-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 100%)",
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {suggestions.map((book) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.slug}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1D1D1D] line-clamp-1">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {book.author.penName}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#1D1D1D] flex-shrink-0">
                        ${(book.discountPrice || book.price).toFixed(2)}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery("");
                    }}
                    className="block px-4 py-3 text-sm font-medium text-[#D8B27A] hover:bg-gray-50 border-t border-gray-50"
                  >
                    View all results for &quot;{searchQuery}&quot;
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Mobile Search */}
            <Link
              href="/search"
              className="sm:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-[#1D1D1D]"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/wishlist"
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-[#1D1D1D] relative"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center text-white px-1"
                  style={{ background: "#D8B27A" }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-[#1D1D1D] relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center text-white px-1"
                  style={{ background: "#D8B27A" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1D] hover:bg-gray-100 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Account</span>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-[#1D1D1D]"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Layer 3: Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-gray-100 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                      setMobileOpen(false);
                    }
                  }}
                  placeholder="Search books, authors..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D8B27A]"
                />
              </div>

              {/* Mobile Utility Links */}
              <Link
                href="https://statement-cyan.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors"
              >
                <Pen className="w-4 h-4" />
                Publish With Us
                <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
              </Link>
              <Link
                href="/support"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Support
              </Link>

              <hr className="my-3 border-gray-100" />

              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="text-xs text-gray-400">
                    ({wishlistCount})
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart
                {cartCount > 0 && (
                  <span className="text-xs text-gray-400">
                    ({cartCount})
                  </span>
                )}
              </Link>
              <Link
                href="/my-library"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                My Library
              </Link>
              <hr className="my-3 border-gray-100" />
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#1D1D1D] hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
