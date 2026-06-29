"use client";

import { useState } from "react";
import { useMarketplace } from "@/context/marketplace-context";
import { SubNav, FilterPanel } from "@/components/layout/sub-nav";

export function MarketplaceSubNav() {
  const { sortBy, setSortBy, viewMode, setViewMode, filters, setFilters, filterCount } = useMarketplace();
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <SubNav
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onOpenFilters={() => setFilterOpen(true)}
        activeFilterCount={filterCount}
      />
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => {}}
        onReset={() => setFilters({})}
      />
    </>
  );
}
