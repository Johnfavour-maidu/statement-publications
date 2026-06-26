"use client";

import { MarketplaceSubNav } from "@/components/layout/marketplace-sub-nav";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-[152px]">
      <MarketplaceSubNav />
      {children}
    </div>
  );
}
