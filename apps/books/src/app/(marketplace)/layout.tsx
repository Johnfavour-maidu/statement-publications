"use client";

import { MarketplaceProvider } from "@/context/marketplace-context";
import { MarketplaceSubNav } from "@/components/layout/marketplace-sub-nav";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketplaceProvider>
      <div className="pt-[140px]">
        <MarketplaceSubNav />
        {children}
      </div>
    </MarketplaceProvider>
  );
}
