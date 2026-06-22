"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  FileText,
  Users,
  Star,
  Wallet,
  Heart,
  Bell,
  Shield,
  HelpCircle,
  BookMarked,
  TrendingUp,
  Package,
  CreditCard,
  Tag,
  Megaphone,
  FolderOpen,
  Eye,
  TrendingDown,
  Headphones,
  Briefcase,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getInitials } from "@/lib/utils";
import type { Role } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const dashboardNav: Record<string, NavSection[]> = {
  AUTHOR: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/author/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "My Books",
      items: [
        { label: "All Books", href: "/author/books", icon: BookOpen },
        { label: "Create New Book", href: "/author/books/new", icon: PenTool },
      ],
    },
    {
      title: "Publishing Services",
      items: [
        { label: "Services", href: "/author/services", icon: Package },
      ],
    },
    {
      title: "Royalties",
      items: [
        { label: "Earnings", href: "/author/earnings", icon: Wallet },
        { label: "Withdrawals", href: "/author/withdrawals", icon: CreditCard },
      ],
    },
    {
      title: "Insights",
      items: [
        { label: "Book Analytics", href: "/author/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Communication",
      items: [
        { label: "Messages", href: "/author/messages", icon: MessageSquare },
        { label: "Support Center", href: "/author/support", icon: Headphones },
        { label: "Notifications", href: "/author/notifications", icon: Bell },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "My Profile", href: "/author/profile", icon: Users },
        { label: "Settings", href: "/author/settings", icon: Settings },
      ],
    },
  ],
  READER: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/", icon: LayoutDashboard },
      ],
    },
    {
      title: "Library",
      items: [
        { label: "My Books", href: "/", icon: BookMarked },
        { label: "Wishlist", href: "/", icon: Heart },
        { label: "Orders", href: "/", icon: Package },
        { label: "Reviews", href: "/", icon: Star },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Profile", href: "/", icon: Users },
        { label: "Settings", href: "/", icon: Settings },
      ],
    },
  ],
  ADMIN: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Authors", href: "/admin/users", icon: Users },
        { label: "Books", href: "/admin/books", icon: BookOpen },
        { label: "Service Orders", href: "/admin/orders", icon: ShoppingCart },
        { label: "Book Categories", href: "/admin/categories", icon: Tag },
        { label: "Service Categories", href: "/admin/service-categories", icon: Briefcase },
      ],
    },
    {
      title: "Content",
      items: [
        { label: "Blog", href: "/admin/blog", icon: FileText },
        { label: "Testimonials", href: "/admin/testimonials", icon: Star },
        { label: "Content Management", href: "/admin/content", icon: Megaphone },
        { label: "Media Library", href: "/admin/media", icon: FolderOpen },
      ],
    },
    {
      title: "Finance",
      items: [
        { label: "Payouts", href: "/admin/payouts", icon: CreditCard },
        { label: "Royalties", href: "/admin/royalties", icon: TrendingUp },
      ],
    },
    {
      title: "Growth",
      items: [
        { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
        { label: "Support Requests", href: "/admin/support", icon: Headphones },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Roles", href: "/admin/roles", icon: Shield },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
};

function getSectionsForRole(role: string): NavSection[] {
  if (role === "SUPER_ADMIN" || role === "ADMIN") return dashboardNav.ADMIN;
  if (role === "AUTHOR") return dashboardNav.AUTHOR;
  return dashboardNav.READER;
}

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: Role;
  };
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ user, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const sections = getSectionsForRole(user.role || "READER");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      sections.forEach((section) => {
        const hasActive = section.items.some(
          (item) => item.href === pathname || pathname.startsWith(item.href + "/")
        );
        if (hasActive || !collapsed) {
          initial[section.title] = true;
        }
      });
      return initial;
    }
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[#E8DDD0] bg-[#FDF6EE] transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <Link
        href="/"
        className={cn(
          "flex items-center gap-2 border-b border-[#E8DDD0] py-3",
          collapsed ? "justify-center px-3" : "px-4"
        )}
      >
        {!collapsed ? (
          <img
            src="/logo.png"
            alt="Statement Publications"
            className="h-8 w-auto object-contain"
          />
        ) : (
          <img
            src="/favicon-48x48.png"
            alt="Statement Publications"
            className="h-10 w-10 rounded-full object-contain"
          />
        )}
      </Link>

      <div
        className={cn(
          "flex items-center gap-3 border-b border-[#E8DDD0] p-4",
          collapsed && "justify-center"
        )}
      >
        <Avatar className="h-10 w-10 border-2 border-black bg-[#D8B27A] transition-all duration-200 hover:scale-[1.03] hover:shadow-md cursor-pointer">
          <AvatarImage src={user.image || undefined} alt={user.name || ""} />
          <AvatarFallback className="bg-[#D8B27A] text-black text-sm font-bold border-none">
            {getInitials(user.name || "U")}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1D1D1D] truncate">
              {user.name}
            </p>
            <p className="text-xs text-[#6A4E37] truncate">{user.email}</p>
            <span className="inline-flex items-center rounded-full bg-[#D8B27A]/20 px-2 py-0.5 text-[10px] font-medium text-[#8A6A4A] mt-1 capitalize">
              {user.role?.toLowerCase().replace("_", " ")}
            </span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-1 px-2">
          {sections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-black hover:text-black/80 transition-colors"
                >
                  {section.title}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      openSections[section.title] ? "" : "-rotate-90"
                    )}
                  />
                </button>
              )}
              <AnimatePresence initial={false}>
                {(collapsed || openSections[section.title]) && (
                  <motion.div
                    initial={collapsed ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={collapsed ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0.5 py-1">
                      {section.items.map((item) => {
                        const isActive =
                          pathname === item.href ||
                          (item.href !== "/" &&
                            item.href !== "/admin/dashboard" &&
                            item.href !== "/author/dashboard" &&
                            pathname.startsWith(item.href + "/"));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                              collapsed && "justify-center px-2",
                              isActive
                                ? "bg-[#D8B27A] text-[#1D1D1D] shadow-sm"
                                : "text-[#5C4A3D] hover:bg-[#EBC9A8]/50 hover:text-[#1D1D1D]"
                            )}
                            title={collapsed ? item.label : undefined}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active"
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#1D1D1D]"
                                transition={{
                                  type: "spring",
                                  bounce: 0.2,
                                  duration: 0.4,
                                }}
                              />
                            )}
                            <item.icon
                              className={cn(
                                "h-4.5 w-4.5 shrink-0 transition-colors",
                                isActive
                                  ? "text-[#1D1D1D]"
                                  : "text-[#8A6A4A] group-hover:text-[#1D1D1D]"
                              )}
                            />
                            {!collapsed && (
                              <>
                                <span className="flex-1 truncate">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1D1D1D] px-1.5 text-[10px] font-bold text-white">
                                    {item.badge}
                                  </span>
                                )}
                              </>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-[#E8DDD0] p-3">
        {!collapsed ? (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-black hover:bg-red-50 hover:text-red-600 transition-colors"
            asChild
          >
            <Link href="/api/auth/signout">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="w-full text-[#5C4A3D] hover:bg-red-50 hover:text-red-600"
            asChild
          >
            <Link href="/api/auth/signout">
              <LogOut className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </aside>
  );
}
