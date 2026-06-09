"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingCart, User, Menu, X, BookOpen, ChevronDown } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/categories", label: "Categories" },
  { href: "/authors", label: "Authors" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Utility Bar */}
      <div className="hidden lg:block h-9 text-sm" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 40%, #F2D8BE 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4 text-charcoal">
            <span className="font-medium">🌍 United States</span>
            <span className="opacity-50">|</span>
            <span className="font-medium">English</span>
          </div>
          <div className="flex items-center gap-6 text-charcoal">
            <Link href="https://statement-publications.vercel.app" className="hover:opacity-70 transition-opacity flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Publish With Us
            </Link>
            <Link href="/support" className="hover:opacity-70 transition-opacity">Support</Link>
            <Link href="https://statement-publications.vercel.app/contact" className="hover:opacity-70 transition-opacity">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 h-16 lg:h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 100%)" }}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-charcoal block leading-tight">Statement</span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase block -mt-0.5" style={{ color: "#D8B27A" }}>Books</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-charcoal hover:text-[#D8B27A] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-charcoal">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/wishlist" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-charcoal relative">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: "#D8B27A" }}>
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-charcoal relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: "#D8B27A" }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-charcoal hover:bg-gray-100 transition-colors">
              <User className="w-4 h-4" />
              Sign In
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-charcoal"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white border-b border-gray-100 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-charcoal hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2" />
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-charcoal hover:bg-gray-50">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-white text-center" style={{ background: "#D8B27A" }}>
                Create Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
