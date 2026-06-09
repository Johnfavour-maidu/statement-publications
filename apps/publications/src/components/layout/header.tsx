"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown, User, LogOut, BookOpen, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/support", label: "Support" },
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Utility Bar */}
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

            <Link href="https://books.statementpublications.com" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Statement Books</span>
            </Link>

            <span className="w-px h-3 bg-black/20" />

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity cursor-pointer"
              >
                {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                <span>{theme === "dark" ? "Light" : "Dark"}</span>
              </button>
            )}

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
                    <Link href="/author/dashboard" className="cursor-pointer">Author Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="cursor-pointer">Admin Dashboard</Link>
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
      <div className="bg-[#FDF6EE]/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="/logo.png"
                alt="Statement Publications"
                className="h-10 lg:h-12 w-auto"
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
              {user ? (
                <Link href="/author/dashboard" className="flex flex-col items-center px-2 py-1 rounded-lg hover:bg-peach/10 transition-colors group">
                  <User className="h-6 w-6 text-charcoal group-hover:text-charcoal/70 transition-colors" />
                  <span className="text-[10px] font-semibold text-charcoal mt-0.5 hidden sm:block">My Account</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-charcoal border border-charcoal/20 hover:bg-charcoal hover:text-white transition-all">
                    Sign In
                  </Link>
                  <Link href="/register" className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-charcoal" style={{ backgroundColor: "#D8B27A" }}>
                    Create Account
                  </Link>
                </div>
              )}

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
              className="fixed inset-y-0 right-0 w-72 bg-[#FDF6EE] dark:bg-[#1a1a1a] shadow-xl z-50 lg:hidden"
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
                  <Link href="https://books.statementpublications.com" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-charcoal hover:bg-peach/10 transition-colors">
                    <BookOpen className="h-4 w-4" /> Statement Books
                  </Link>
                  <Link href="/author/dashboard" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-charcoal hover:bg-peach/10 transition-colors">
                    Author Dashboard
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
