"use client";

import { useState, useRef, useEffect } from "react";
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
  MapPin,
  Globe,
  HelpCircle,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { books } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

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
      {/* Layer 1: Utility Bar */}
      <div className="hidden lg:block bg-[#1D1D1D] text-white h-9">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-1.5 hover:text-[#D8B27A] transition-colors">
              <MapPin className="w-3.5 h-3.5" />
              <span>Nigeria</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#D8B27A] transition-colors">
              <Globe className="w-3.5 h-3.5" />
              <span>English | NGN</span>
            </button>
            <Link
              href="https://statement-publications.vercel.app"
              className="hover:text-[#D8B27A] transition-colors"
            >
              Publish With Us
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="https://statement-publications.vercel.app/contact"
              className="hover:text-[#D8B27A] transition-colors"
            >
              Help
            </Link>
            <Link
              href="/login"
              className="hover:text-[#D8B27A] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="hover:text-[#D8B27A] transition-colors"
            >
              Create Account
            </Link>
          </div>
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
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-white"
                style={{ background: "#D8B27A" }}
              >
                <UserPlus className="w-4 h-4" />
                Create Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
