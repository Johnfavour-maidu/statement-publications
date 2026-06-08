"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Heart, User, Globe, ChevronDown, LogOut, LayoutDashboard, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Store" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [user, setUser] = useState<{ name: string; email: string; image?: string; role?: string } | null>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Utility Bar — Right-aligned only */}
      <div className={cn(
        "bg-white border-b border-gray-100 text-xs text-black transition-all duration-300 hidden md:block",
        scrolled ? "h-0 opacity-0 overflow-hidden border-0" : "h-9 opacity-100"
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-9 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 hover:text-[#8A6A4A] transition-colors cursor-pointer">
                <Globe className="h-3.5 w-3.5" />
                <span>Change Country</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {countries.map((c) => (
                  <DropdownMenuItem key={c.code} className="flex items-center gap-2 cursor-pointer">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="w-px h-3 bg-gray-200" />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 hover:text-[#8A6A4A] transition-colors cursor-pointer">
                <span>English</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {languages.map((l) => (
                  <DropdownMenuItem key={l.code} className="cursor-pointer">
                    {l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="w-px h-3 bg-gray-200" />

            <Link href="/support" className="hover:text-[#8A6A4A] transition-colors">Support</Link>

            <span className="w-px h-3 bg-gray-200" />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 hover:text-[#8A6A4A] transition-colors cursor-pointer">
                  <User className="h-3.5 w-3.5" />
                  <span>My Account</span>
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/support" className="flex items-center gap-2 cursor-pointer">
                      <HelpCircle className="h-4 w-4" /> Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-500">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 hover:text-[#8A6A4A] transition-colors">
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation — Premium Gradient */}
      <div className={cn(
        "transition-all duration-300",
        scrolled ? "shadow-lg" : "shadow-sm"
      )} style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 40%, #F2D8BE 100%)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="/logo.png"
                alt="Statement Publications"
                className="h-32 lg:h-[150px] w-auto"
              />
            </Link>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200",
                    pathname === link.href
                      ? "text-charcoal"
                      : "text-charcoal/80 hover:text-charcoal hover:bg-white/20"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-white/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Side — Wishlist, Cart, Account */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Wishlist — Amazon style */}
              <Link href="/wishlist" className="flex flex-col items-center justify-center px-2 sm:px-3 py-1 rounded-lg hover:bg-white/20 transition-colors group">
                <div className="relative">
                  <Heart className="h-6 w-6 text-charcoal group-hover:text-[#8A6A4A] transition-colors" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white"
                    >
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-charcoal mt-0.5 hidden sm:block">Wishlist</span>
              </Link>

              {/* Cart — Amazon style */}
              <Link href="/cart" className="flex flex-col items-center justify-center px-2 sm:px-3 py-1 rounded-lg hover:bg-white/20 transition-colors group">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-charcoal group-hover:text-[#8A6A4A] transition-colors" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D8B27A] text-[9px] font-bold text-charcoal"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-charcoal mt-0.5 hidden sm:block">Cart</span>
              </Link>

              {/* My Account — Amazon style */}
              <Link href="/login" className="flex flex-col items-center justify-center px-2 sm:px-3 py-1 rounded-lg hover:bg-white/20 transition-colors group">
                <User className="h-6 w-6 text-charcoal group-hover:text-[#8A6A4A] transition-colors" />
                <span className="text-[10px] font-semibold text-charcoal mt-0.5 hidden sm:block">My Account</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden ml-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <span className="text-sm font-bold text-charcoal">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 overflow-y-auto p-5">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        pathname === link.href
                          ? "bg-[#F2D8BE]/40 text-charcoal"
                          : "text-dark-gray hover:bg-gray-50 hover:text-charcoal"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-1">
                  <Link href="/wishlist" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-dark-gray hover:bg-gray-50 hover:text-charcoal transition-colors">
                    <Heart className="h-4 w-4" /> Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">{wishlistCount}</span>
                    )}
                  </Link>
                  <Link href="/cart" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-dark-gray hover:bg-gray-50 hover:text-charcoal transition-colors">
                    <ShoppingCart className="h-4 w-4" /> Cart
                    {totalItems > 0 && (
                      <span className="ml-auto text-[10px] bg-[#EBC9A8] text-charcoal px-2 py-0.5 rounded-full font-bold">{totalItems}</span>
                    )}
                  </Link>
                  <Link href="/support" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-dark-gray hover:bg-gray-50 hover:text-charcoal transition-colors">
                    <HelpCircle className="h-4 w-4" /> Support
                  </Link>
                </div>
              </nav>

              {/* Mobile Footer */}
              <div className="p-5 border-t border-gray-100 space-y-3">
                <Button variant="outline" asChild className="w-full border-gray-200 text-charcoal hover:bg-gray-50">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="w-full bg-[#EBC9A8] text-charcoal hover:bg-[#D8B27A]">
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
