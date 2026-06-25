"use client";

import { useState, useCallback } from "react";
import { SubNav, FilterPanel, type FilterState } from "@/components/layout/sub-nav";

export function MarketplaceSubNav() {
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sp-view-mode") as "grid" | "list") || "grid";
    }
    return "grid";
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});

  const handleViewChange = useCallback((v: "grid" | "list") => {
    setViewMode(v);
    localStorage.setItem("sp-view-mode", v);
  }, []);

  const activeFilterCount = Object.values(filters).reduce(
    (sum, val) => {
      if (Array.isArray(val)) return sum + val.length;
      if (typeof val === "string" && val) return sum + 1;
      return sum;
    },
    0
  );

  return (
    <>
      <SubNav
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewChange={handleViewChange}
        onOpenFilters={() => setFilterOpen(true)}
        activeFilterCount={activeFilterCount}
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
