"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type FilterState = Record<string, string[] | string | undefined>;

interface MarketplaceContextValue {
  sortBy: string;
  setSortBy: (v: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  filterCount: number;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used within MarketplaceProvider");
  return ctx;
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sp-view-mode") as "grid" | "list") || "grid";
    }
    return "grid";
  });
  const [filters, setFilters] = useState<FilterState>({});

  const handleSetViewMode = useCallback((v: "grid" | "list") => {
    setViewMode(v);
    localStorage.setItem("sp-view-mode", v);
  }, []);

  const filterCount = Object.values(filters).reduce(
    (sum, val) => {
      if (Array.isArray(val)) return sum + val.length;
      if (typeof val === "string" && val) return sum + 1;
      return sum;
    },
    0
  );

  return (
    <MarketplaceContext.Provider
      value={{
        sortBy,
        setSortBy,
        viewMode,
        setViewMode: handleSetViewMode,
        filters,
        setFilters,
        filterCount,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}
