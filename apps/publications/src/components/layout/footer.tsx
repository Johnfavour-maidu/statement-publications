"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const quickLinks = [
  [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about#story" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Help Center", href: "/help" },
  ],
  [
    { label: "Statement Books", href: "https://books.statementpublications.com" },
    { label: "Blog", href: "/blog" },
    { label: "Services", href: "/services" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  [
    { label: "Contact Us", href: "/contact" },
    { label: "Support", href: "/support" },
    { label: "Site Map", href: "/sitemap.xml" },
  ],
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", color: "hover:bg-[#1877F2] hover:border-[#1877F2]", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label: "YouTube", href: "https://youtube.com", color: "hover:bg-[#FF0000] hover:border-[#FF0000]", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { label: "Instagram", href: "https://instagram.com", color: "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-[#DD2A7B]", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { label: "TikTok", href: "https://tiktok.com", color: "hover:bg-black hover:border-black", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#1D1D1D] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

        {/* Top Section — 2 columns */}
        <div className="flex flex-col lg:flex-row lg:gap-20">

          {/* Left — Mailing List */}
          <div className="lg:w-[35%]">
            <h3 className="text-lg font-bold tracking-wide uppercase mb-4">Join Our Mailing List</h3>
            <div className="border-t border-white/30 mb-6" />
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-sm">
              By clicking the &quot;submit&quot; button, you are agreeing to receive future marketing e-mail messages from Statement Publications.
            </p>

            {/* Newsletter with animated gradient border */}
            <div className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE] max-w-sm">
              <form onSubmit={handleSubscribe} className="flex gap-2 rounded-[10px] bg-[#2a2a2a] p-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 text-sm border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                  required
                />
                <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-lg bg-[#EBC9A8] hover:bg-[#D8B27A] text-[#1D1D1D]">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
            {subscribed && (
              <p className="text-xs text-green-400 mt-2">Thanks for subscribing!</p>
            )}
          </div>

          {/* Right — Quick Links */}
          <div className="flex-1 mt-12 lg:mt-0">
            <h3 className="text-lg font-bold tracking-wide uppercase mb-4">Quick Links</h3>
            <div className="border-t border-white/30 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
              {quickLinks.flat().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/30 mt-12 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Social Icons */}
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/70 transition-all duration-300 hover:text-white hover:scale-110 ${social.color}`}
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d={social.path} /></svg>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Statement Publications. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
