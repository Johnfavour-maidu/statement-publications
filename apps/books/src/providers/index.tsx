"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <QueryProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
