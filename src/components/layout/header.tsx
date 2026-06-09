"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Heart, Globe, ChevronDown, User, LogOut } from "lucide-react";
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
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "pt", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Store" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
];

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Utility Bar — gradient bg, right-aligned, simplified */}
      <div className="hidden md:block text-xs font-medium text-black" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 40%, #F2D8BE 100%)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-9 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 hover:opacity-70 transition-opacity cursor-pointer">
                <Globe className="h-3.5 w-3.5" />
                <span>Change Country</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 text-charcoal">
                {countries.map((c) => (
                  <DropdownMenuItem key={c.code} className="flex items-center gap-2 cursor-pointer">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="w-px h-3 bg-black/20" />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 hover:opacity-70 transition-opacity cursor-pointer">
                <Globe className="h-3.5 w-3.5" />
                <span>English</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 text-charcoal">
                {languages.map((l) => (
                  <DropdownMenuItem key={l.code} className="cursor-pointer">
                    {l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="w-px h-3 bg-black/20" />

            <Link href="/support" className="hover:opacity-70 transition-opacity">Support</Link>

            <span className="w-px h-3 bg-black/20" />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 hover:opacity-70 transition-opacity cursor-pointer">
                  <User className="h-3.5 w-3.5" />
                  <span>My Account</span>
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 text-charcoal">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-500">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-[#FDF6EE]/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="/logo.png"
                alt="Statement Publications"
                className="h-36 lg:h-[170px] w-auto"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 z-10",
                    pathname === link.href
                      ? "text-charcoal"
                      : "text-charcoal hover:text-brown hover:bg-peach/10"
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-[#D8B27A]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {/* Wishlist — Amazon style: icon + text */}
              <Link href="/wishlist" className="flex flex-col items-center px-2 py-1 rounded-lg hover:bg-peach/10 transition-colors group">
                <div className="relative">
                  <Heart className="h-6 w-6 text-charcoal group-hover:text-charcoal/70 transition-colors" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white px-1"
                    >
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-charcoal mt-0.5 hidden sm:block">Wishlist</span>
              </Link>

              {/* Cart — Amazon style: icon + text */}
              <Link href="/cart" className="flex flex-col items-center px-2 py-1 rounded-lg hover:bg-peach/10 transition-colors group">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-charcoal group-hover:text-charcoal/70 transition-colors" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gold text-[9px] font-bold text-charcoal px-1"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-charcoal mt-0.5 hidden sm:block">Cart</span>
              </Link>

              {/* My Account — Amazon style: icon + text */}
              <Link href="/login" className="flex flex-col items-center px-2 py-1 rounded-lg hover:bg-peach/10 transition-colors group">
                <User className="h-6 w-6 text-charcoal group-hover:text-charcoal/70 transition-colors" />
                <span className="text-[10px] font-semibold text-charcoal mt-0.5 hidden sm:block">My Account</span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 w-72 bg-[#FDF6EE] shadow-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex justify-end mb-8">
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200",
                        pathname === link.href
                          ? "bg-[#D8B27A] text-charcoal"
                          : "text-charcoal hover:bg-peach/10 hover:text-brown"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-4 pt-4 border-t border-peach/30 space-y-1">
                  <Link href="/wishlist" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-charcoal hover:bg-peach/10 transition-colors">
                    <Heart className="h-4 w-4" /> Wishlist
                    {wishlistCount > 0 && <span className="ml-auto text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">{wishlistCount}</span>}
                  </Link>
                  <Link href="/cart" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-charcoal hover:bg-peach/10 transition-colors">
                    <ShoppingCart className="h-4 w-4" /> Cart
                    {totalItems > 0 && <span className="ml-auto text-[10px] bg-[#EBC9A8] text-charcoal px-2 py-0.5 rounded-full font-bold">{totalItems}</span>}
                  </Link>
                  <Link href="/support" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-charcoal hover:bg-peach/10 transition-colors">
                    Support
                  </Link>
                </div>

                {!user && (
                  <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-peach/30">
                    <Button variant="outline" asChild className="w-full border-peach text-brown hover:bg-peach/10">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full bg-peach text-charcoal hover:bg-peach-dark">
                      <Link href="/register">Create Account</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
