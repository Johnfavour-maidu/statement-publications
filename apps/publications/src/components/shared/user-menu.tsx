"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  BookOpen,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { Role } from "@/types";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: Role;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(user.name || "U")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
            {user.role?.toLowerCase().replace("_", " ")}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {(user.role === "READER" || !user.role) && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/library">
                <BookOpen className="mr-2 h-4 w-4" />
                My Library
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/wishlist">
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
