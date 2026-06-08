"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Heart, Phone, HelpCircle, MapPin, User } from "lucide-react";
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
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
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
  cartCount?: number;
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
      {/* Utility Bar */}
      <div className="bg-[#F5EDE3] border-b border-[#E8D5BE] text-xs text-[#5C4A3A] hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 hover:text-[#8A6A4A] transition-colors cursor-pointer">
                  <MapPin className="h-3 w-3" />
                  <span>United States</span>
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
              <span className="w-px h-3 bg-[#D4C4B0]" />
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 hover:text-[#8A6A4A] transition-colors cursor-pointer">
                  <span>🌐</span>
                  <span>English</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {languages.map((l) => (
                    <DropdownMenuItem key={l.code} className="flex items-center gap-2 cursor-pointer">
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/faq" className="flex items-center gap-1 hover:text-[#8A6A4A] transition-colors">
                <HelpCircle className="h-3 w-3" />
                <span>FAQ</span>
              </Link>
              <Link href="/help" className="hover:text-[#8A6A4A] transition-colors">Help Center</Link>
              <Link href="/support" className="hover:text-[#8A6A4A] transition-colors">Support</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="flex items-center gap-1 hover:text-[#8A6A4A] transition-colors">
                <Phone className="h-3 w-3" />
                <span>Contact Us</span>
              </Link>
              <Link href="/orders" className="hover:text-[#8A6A4A] transition-colors">Track Order</Link>
              <Link href="/dashboard" className="flex items-center gap-1 hover:text-[#8A6A4A] transition-colors">
                <User className="h-3 w-3" />
                <span>My Account</span>
              </Link>
            </div>
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
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  pathname === link.href
                    ? "text-brown"
                    : "text-dark-gray hover:text-brown hover:bg-peach/10"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-peach/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/reader/wishlist">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-peach/20 hover:bg-peach/40 transition-all duration-300 cursor-pointer">
                  <Heart className="h-5 w-5 text-brown" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md"
                    >
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </motion.span>
                  )}
                </div>
              </motion.div>
            </Link>
            <Link href="/books">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-peach/20 hover:bg-peach/40 transition-all duration-300 cursor-pointer">
                  <ShoppingBag className="h-5 w-5 text-brown" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-charcoal shadow-md"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </div>
              </motion.div>
            </Link>

            {!user && (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-dark-gray hover:text-brown hover:bg-peach/10"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-peach text-charcoal hover:bg-peach-dark transition-colors duration-200"
                  asChild
                >
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
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
                        ? "bg-peach/20 text-brown"
                        : "text-dark-gray hover:bg-peach/10 hover:text-brown"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {!user && (
                <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-peach/30">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-peach text-brown hover:bg-peach/10"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-peach text-charcoal hover:bg-peach-dark"
                  >
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
