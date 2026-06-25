"use client";

import { useState } from "react";
import { MarketplaceSubNav } from "@/components/layout/marketplace-sub-nav";
import CategoryMegaSidebar from "@/components/layout/category-mega-sidebar";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);

  return (
    <div className="pt-[152px]">
      <MarketplaceSubNav onOpenCategories={() => setCategorySidebarOpen(true)} />
      {children}
      <CategoryMegaSidebar isOpen={categorySidebarOpen} onClose={() => setCategorySidebarOpen(false)} />
    </div>
  );
}
