"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  Search,
  Moon,
  Sun,
  Plus,
  MessageSquare,
  Bell,
  Undo2,
  Redo2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/shared/notification-bell";
import { UserMenu } from "@/components/shared/user-menu";
import { SearchDialog } from "@/components/shared/search-dialog";
import { UndoRedoModal } from "@/components/ui/undo-redo-modal";
import { actionHistory, type ActionRecord } from "@/lib/action-history";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [, forceUpdate] = useState(0);

  const [undoModalOpen, setUndoModalOpen] = useState(false);
  const [redoModalOpen, setRedoModalOpen] = useState(false);
  const [pendingUndo, setPendingUndo] = useState<ActionRecord | null>(null);
  const [pendingRedo, setPendingRedo] = useState<ActionRecord | null>(null);

  useEffect(() => {
    return actionHistory.subscribe(() => forceUpdate((n) => n + 1));
  }, []);

  const canUndo = actionHistory.canUndo();
  const canRedo = actionHistory.canRedo();

  const handleUndoClick = useCallback(() => {
    const action = actionHistory.peekUndo();
    if (action) {
      setPendingUndo(action);
      setUndoModalOpen(true);
    }
  }, []);

  const handleRedoClick = useCallback(() => {
    const action = actionHistory.peekRedo();
    if (action) {
      setPendingRedo(action);
      setRedoModalOpen(true);
    }
  }, []);

  const confirmUndo = useCallback(() => {
    const action = actionHistory.performUndo();
    if (action) {
      window.dispatchEvent(new CustomEvent("action-undo", { detail: action }));
    }
    setUndoModalOpen(false);
    setPendingUndo(null);
  }, []);

  const confirmRedo = useCallback(() => {
    const action = actionHistory.performRedo();
    if (action) {
      window.dispatchEvent(new CustomEvent("action-redo", { detail: action }));
    }
    setRedoModalOpen(false);
    setPendingRedo(null);
  }, []);

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  return (
    <header className="flex h-14 items-center gap-4 border-b border-[#E8DDD0] bg-[#FDF6EE] px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-[#5C4A3D] hover:bg-[#EBC9A8]/50"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex text-[#5C4A3D] hover:bg-[#EBC9A8]/50"
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
        className="hidden sm:flex h-9 w-64 items-center gap-2 border-[#E8DDD0] bg-white/50 text-[#5C4A3D] hover:bg-[#EBC9A8]/30 hover:border-[#D8B27A]"
        onClick={() => setSearchOpen(true)}
      >
        <Search className="h-4 w-4 text-[#8A6A4A]" />
        <span className="text-sm">Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[#E8DDD0] bg-[#F5EDE3] px-1.5 font-mono text-[10px] font-medium text-[#8A6A4A]">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={`hover:bg-[#EBC9A8]/50 ${canUndo ? "text-[#5C4A3D]" : "text-[#5C4A3D]/30 cursor-not-allowed"}`}
          onClick={canUndo ? handleUndoClick : undefined}
          disabled={!canUndo}
          title="Undo Last Action"
        >
          <Undo2 className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`hover:bg-[#EBC9A8]/50 ${canRedo ? "text-[#5C4A3D]" : "text-[#5C4A3D]/30 cursor-not-allowed"}`}
          onClick={canRedo ? handleRedoClick : undefined}
          disabled={!canRedo}
          title="Redo Last Action"
        >
          <Redo2 className="h-5 w-5" />
        </Button>

        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#5C4A3D] hover:bg-[#EBC9A8]/50"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/admin/blog">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Blog Post
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/books">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Book
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/users">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New User
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Plus className="mr-2 h-4 w-4" />
                  New Announcement
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="text-[#5C4A3D] hover:bg-[#EBC9A8]/50"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <NotificationBell notifications={notifications} />

        <Button
          variant="ghost"
          size="icon"
          className="text-[#5C4A3D] hover:bg-[#EBC9A8]/50"
          asChild
        >
          <Link href={isAdmin ? "/admin/support" : "/author/support"}>
            <MessageSquare className="h-5 w-5" />
          </Link>
        </Button>

        <UserMenu user={user} />
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <UndoRedoModal
        open={undoModalOpen}
        type="undo"
        action={pendingUndo}
        onConfirm={confirmUndo}
        onCancel={() => { setUndoModalOpen(false); setPendingUndo(null); }}
      />
      <UndoRedoModal
        open={redoModalOpen}
        type="redo"
        action={pendingRedo}
        onConfirm={confirmRedo}
        onCancel={() => { setRedoModalOpen(false); setPendingRedo(null); }}
      />
    </header>
  );
}
