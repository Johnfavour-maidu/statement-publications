"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationBell } from "@/components/shared/notification-bell";
import { UserMenu } from "@/components/shared/user-menu";
import { SearchDialog } from "@/components/shared/search-dialog";
import { useState } from "react";
import type { Role } from "@/types";

interface DashboardTopBarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: Role;
  };
  notifications?: {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }[];
  onMenuToggle?: () => void;
  onSidebarToggle?: () => void;
  sidebarCollapsed?: boolean;
}

export function DashboardTopBar({
  user,
  notifications = [],
  onMenuToggle,
  onSidebarToggle,
  sidebarCollapsed,
}: DashboardTopBarProps) {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={onSidebarToggle}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>

      <Button
        variant="outline"
        className="hidden sm:flex h-9 w-64 items-center gap-2 text-muted-foreground"
        onClick={() => setSearchOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <NotificationBell notifications={notifications} />

        <UserMenu user={user} />
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
