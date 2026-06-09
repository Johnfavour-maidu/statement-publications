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
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Content",
      items: [
        { label: "My Books", href: "/dashboard/books", icon: BookOpen },
        { label: "Write", href: "/dashboard/write", icon: PenTool },
        { label: "Reviews", href: "/dashboard/reviews", icon: Star },
      ],
    },
    {
      title: "Earnings",
      items: [
        { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
        { label: "Withdrawals", href: "/dashboard/withdrawals", icon: CreditCard },
        { label: "Transactions", href: "/dashboard/transactions", icon: TrendingUp },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Profile", href: "/dashboard/profile", icon: Users },
        { label: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: 3 },
        { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
        { label: "Help", href: "/dashboard/help", icon: HelpCircle },
      ],
    },
  ],
  READER: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/reader/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Library",
      items: [
        { label: "My Books", href: "/reader/library", icon: BookMarked },
        { label: "Wishlist", href: "/reader/wishlist", icon: Heart },
        { label: "Orders", href: "/reader/orders", icon: Package },
        { label: "Reviews", href: "/reader/reviews", icon: Star },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Profile", href: "/reader/profile", icon: Users },
        { label: "Notifications", href: "/reader/notifications", icon: Bell },
        { label: "Settings", href: "/reader/settings", icon: Settings },
        { label: "Help", href: "/reader/help", icon: HelpCircle },
      ],
    },
  ],
  ADMIN: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Users", href: "/dashboard/users", icon: Users },
        { label: "Books", href: "/dashboard/books", icon: BookOpen },
        { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
        { label: "Categories", href: "/dashboard/categories", icon: Tag },
      ],
    },
    {
      title: "Content",
      items: [
        { label: "Blog Posts", href: "/dashboard/blog", icon: FileText },
        { label: "Announcements", href: "/dashboard/announcements", icon: Megaphone },
        { label: "Reviews", href: "/dashboard/reviews", icon: Star },
      ],
    },
    {
      title: "Finance",
      items: [
        { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
        { label: "Withdrawals", href: "/dashboard/withdrawals", icon: Wallet },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Roles", href: "/dashboard/roles", icon: Shield },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
        { label: "Audit Log", href: "/dashboard/audit", icon: FileText },
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
        "flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <Link href="/" className={cn("flex items-center gap-2 p-4 border-b", collapsed && "justify-center")}>
        <img src="/logo.png" alt="Statement Publications" className={cn("w-auto", collapsed ? "h-[60px]" : "h-[85px]")} />
      </Link>
      <div className={cn("flex items-center gap-3 p-4", collapsed && "justify-center")}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image || undefined} alt={user.name || ""} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {getInitials(user.name || "U")}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
      </div>

      <Separator />

      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          {sections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {section.title}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
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
                          (item.href !== "/dashboard" &&
                            pathname.startsWith(item.href + "/"));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
                              collapsed && "justify-center px-2",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                            title={collapsed ? item.label : undefined}
                          >
                            <item.icon
                              className={cn(
                                "h-4 w-4 shrink-0",
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground group-hover:text-foreground"
                              )}
                            />
                            {!collapsed && (
                              <>
                                <span className="flex-1 truncate">{item.label}</span>
                                {item.badge && (
                                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                                    {item.badge}
                                  </span>
                                )}
                              </>
                            )}
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active"
                                className="absolute left-0 h-6 w-0.5 rounded-r-full bg-primary"
                                transition={{
                                  type: "spring",
                                  bounce: 0.2,
                                  duration: 0.4,
                                }}
                              />
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

      <Separator />

      <div className="p-2">
        {!collapsed ? (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            asChild
          >
            <Link href="/api/auth/signout">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="w-full" asChild>
            <Link href="/api/auth/signout">
              <LogOut className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </aside>
  );
}
