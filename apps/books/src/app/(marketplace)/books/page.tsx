"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  ShoppingCart,
  Heart,
  ChevronDown,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { books, categories } from "@/lib/demo-data";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatCurrency, cn } from "@/lib/utils";

type SortOption =
  | "newest"
  | "price-low"
  | "price-high"
  | "rating"
  | "trending"
  | "bestselling";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price Low to High" },
  { value: "price-high", label: "Price High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "trending", label: "Trending" },
  { value: "bestselling", label: "Best Selling" },
];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $5", min: 0, max: 5 },
  { label: "Under $10", min: 0, max: 10 },
  { label: "Under $15", min: 0, max: 15 },
  { label: "$10 - $20", min: 10, max: 20 },
  { label: "$20+", min: 20, max: Infinity },
];

export default function BooksPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const { addItem } = useCart();
  const { addItem: addWishlist, isInWishlist } = useWishlist();

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.name.toLowerCase().includes(q) ||
          b.author.penName.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter((b) => b.category.slug === selectedCategory);
    }

    const priceRange = priceRanges[selectedPriceRange];
    if (priceRange) {
      result = result.filter((b) => {
        const price = b.discountPrice || b.price;
        return price >= priceRange.min && price < priceRange.max;
      });
    }

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
        break;
      case "price-high":
        result.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
        break;
      case "rating":
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "trending":
        result.sort((a, b) => b.totalSales - a.totalSales);
        break;
      case "bestselling":
        result.sort((a, b) => b.totalSales - a.totalSales);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.publicationDate).getTime() -
            new Date(a.publicationDate).getTime()
        );
    }

    return result;
  }, [search, sortBy, selectedCategory, selectedPriceRange]);

  const totalPages = Math.ceil(filteredBooks.length / perPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedPriceRange(0);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search || selectedCategory || selectedPriceRange > 0;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1D1D1D]">All Books</h1>
        <p className="text-sm text-gray-500 mt-1">
          {filteredBooks.length} books available
        </p>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search books, authors..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 border-[#E8DDD0] bg-white"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#E8DDD0]"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-1.5" /> Filters
            <ChevronDown
              className={cn(
                "w-3 h-3 ml-1 transition-transform",
                showFilters && "rotate-180"
              )}
            />
          </Button>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none px-3 py-2 pr-8 rounded-lg border border-[#E8DDD0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D8B27A]/20"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <div className="hidden sm:flex border border-[#E8DDD0] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2",
                viewMode === "grid"
                  ? "bg-[#D8B27A] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2",
                viewMode === "list"
                  ? "bg-[#D8B27A] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-6 p-4 bg-white border border-[#E8DDD0] rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-[#1D1D1D]">Filters</h3>
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#8A6A4A] hover:text-[#D8B27A] font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Category
              </p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setSelectedCategory(
                        selectedCategory === cat.slug ? null : cat.slug
                      );
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                      selectedCategory === cat.slug
                        ? "bg-[#D8B27A] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Price Range
              </p>
              <div className="flex flex-wrap gap-1.5">
                {priceRanges.map((range, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedPriceRange(i);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                      selectedPriceRange === i
                        ? "bg-[#D8B27A] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {search && (
            <Badge
              variant="secondary"
              className="gap-1 bg-[#F2D8BE] text-[#8A6A4A] border-0"
            >
              Search: {search}
              <button
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="ml-0.5 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge
              variant="secondary"
              className="gap-1 bg-[#F2D8BE] text-[#8A6A4A] border-0"
            >
              {categories.find((c) => c.slug === selectedCategory)?.name}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentPage(1);
                }}
                className="ml-0.5 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedPriceRange > 0 && (
            <Badge
              variant="secondary"
              className="gap-1 bg-[#F2D8BE] text-[#8A6A4A] border-0"
            >
              {priceRanges[selectedPriceRange].label}
              <button
                onClick={() => {
                  setSelectedPriceRange(0);
                  setCurrentPage(1);
                }}
                className="ml-0.5 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Books Grid / List */}
      {paginatedBooks.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            No books found matching your criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4 border-[#E8DDD0] text-[#8A6A4A] hover:bg-[#F2D8BE]"
            onClick={clearAllFilters}
          >
            Clear Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {paginatedBooks.map((book) => {
            const hasDiscount = !!book.discountPrice;
            const discountPercent = hasDiscount
              ? Math.round(
                  ((book.price - book.discountPrice!) / book.price) * 100
                )
              : 0;

            return (
              <motion.div
                key={book.id}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={`/books/${book.slug}`} className="block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-3">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {book.isNew && (
                      <Badge className="absolute top-2 left-2 bg-emerald-500 text-white border-0 text-[10px]">
                        New
                      </Badge>
                    )}
                    {hasDiscount && (
                      <Badge className="absolute top-2 right-2 bg-[#D8B27A] text-white border-0 text-[10px]">
                        {discountPercent}% Off
                      </Badge>
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          addWishlist({
                            id: book.id,
                            title: book.title,
                            author: book.author.penName,
                            price: book.price,
                            cover: book.coverImage,
                            slug: book.slug,
                          });
                        }}
                      >
                        <Heart
                          className={cn(
                            "h-3.5 w-3.5",
                            isInWishlist(book.id) &&
                              "fill-current text-red-500"
                          )}
                        />
                      </Button>
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-full bg-[#D8B27A] text-white hover:bg-[#c9a46a]"
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({
                            id: book.id,
                            title: book.title,
                            author: book.author.penName,
                            price: book.discountPrice || book.price,
                            cover: book.coverImage,
                          });
                        }}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Link>
                <Link href={`/books/${book.slug}`}>
                  <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                  {book.author.penName}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-[#1D1D1D]">
                    {formatCurrency(book.discountPrice || book.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatCurrency(book.price)}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedBooks.map((book) => {
            const hasDiscount = !!book.discountPrice;

            return (
              <motion.div
                key={book.id}
                whileHover={{ x: 2 }}
                className="flex gap-4 p-4 bg-white border border-[#E8DDD0] rounded-xl hover:shadow-md transition-shadow"
              >
                <Link href={`/books/${book.slug}`} className="flex-shrink-0">
                  <div className="w-20 h-28 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/books/${book.slug}`}>
                    <h3 className="font-semibold hover:text-[#D8B27A] transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500">{book.author.penName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < Math.round(book.averageRating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      ({book.totalReviews})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-bold text-[#1D1D1D]">
                      {formatCurrency(book.discountPrice || book.price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(book.price)}
                      </span>
                    )}
                    <Badge className="bg-[#F2D8BE] text-[#8A6A4A] text-[10px] border-0">
                      {book.category.name}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    className="bg-[#1D1D1D] text-white hover:bg-[#333]"
                    onClick={() =>
                      addItem({
                        id: book.id,
                        title: book.title,
                        author: book.author.penName,
                        price: book.discountPrice || book.price,
                        cover: book.coverImage,
                      })
                    }
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#E8DDD0]"
                    onClick={() =>
                      addWishlist({
                        id: book.id,
                        title: book.title,
                        author: book.author.penName,
                        price: book.price,
                        cover: book.coverImage,
                        slug: book.slug,
                      })
                    }
                  >
                    <Heart
                      className={cn(
                        "w-3.5 h-3.5",
                        isInWishlist(book.id) && "fill-current text-red-500"
                      )}
                    />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="border-[#E8DDD0] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
                ...
              </span>
            ) : (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "default" : "outline"}
                className={
                  page === currentPage
                    ? "bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] border-[#D8B27A]"
                    : "border-[#E8DDD0] hover:bg-[#F2D8BE]"
                }
                onClick={() => setCurrentPage(page as number)}
              >
                {page}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="border-[#E8DDD0] disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
