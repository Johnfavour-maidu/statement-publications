"use client";

import Link from "next/link";
import { Phone, HelpCircle, MapPin, User, BookOpen, PenTool } from "lucide-react";
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

export function UtilityBar() {
  return (
    <div className="bg-[#F5EDE3] border-b border-[#E8D5BE] text-xs text-[#5C4A3A] hidden md:block">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9">
          {/* Left */}
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

          {/* Center */}
          <div className="flex items-center gap-5">
            <Link href="/faq" className="flex items-center gap-1 hover:text-[#8A6A4A] transition-colors">
              <HelpCircle className="h-3 w-3" />
              <span>FAQ</span>
            </Link>
            <Link href="/help" className="hover:text-[#8A6A4A] transition-colors">Help Center</Link>
            <Link href="/support" className="hover:text-[#8A6A4A] transition-colors">Support</Link>
          </div>

          {/* Right */}
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
  );
}
