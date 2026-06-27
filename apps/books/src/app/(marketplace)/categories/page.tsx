"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  ChevronDown,
  ShoppingCart,
  Heart,
  Star,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  Menu,
  BookOpen,
  Home,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryGroups } from "@/lib/category-data";
import { books, categories } from "@/lib/demo-data";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatCurrency, cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best Selling" },
  { value: "highest-rated", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "title-az", label: "Title A-Z" },
];

function sortBooks(bookList: typeof books, sortBy: string) {
  const sorted = [...bookList];
  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
    case "best-selling":
      return sorted.sort((a, b) => b.totalSales - a.totalSales);
    case "highest-rated":
      return sorted.sort((a, b) => b.averageRating - a.averageRating);
    case "price-low":
      return sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    case "price-high":
      return sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    case "title-az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

function getBookFormats(book: typeof books[0]) {
  const formats: string[] = [];
  if (book.format === "EBOOK" || book.format === "eBook") formats.push("eBook");
  if (book.isAudiobook) formats.push("Audiobook");
  if (formats.length === 0) formats.push("eBook");
  return formats;
}

function FormatBadges({ book }: { book: typeof books[0] }) {
  const formats = getBookFormats(book);
  return (
    <div className="flex gap-1 mt-1.5">
      {formats.map((f) => (
        <span
          key={f}
          className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold border",
            f === "Audiobook"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-[#F2D8BE]/60 text-[#8A6A4A] border-[#E8DDD0]"
          )}
        >
          {f === "Audiobook" && <Headphones className="w-2.5 h-2.5" />}
          {f}
        </span>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { addItem } = useCart();
  const { addItem: addWishlist, isInWishlist } = useWishlist();

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoryGroups;
    const q = searchQuery.toLowerCase();
    return categoryGroups.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.subcategories.some((sub) => sub.name.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const activeCategoryData = useMemo(() => {
    if (!selectedCategory) return null;
    return categoryGroups.find((c) => c.slug === selectedCategory) || null;
  }, [selectedCategory]);

  const categoryBookCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categoryGroups) {
      counts[cat.slug] = books.filter((b) => b.category.slug === cat.slug).length;
    }
    return counts;
  }, []);

  const filteredBooks = useMemo(() => {
    if (!selectedCategory) return [];
    let result = books.filter((b) => b.category.slug === selectedCategory);
    if (selectedSubcategory) {
      const subName = activeCategoryData?.subcategories.find(
        (s) => s.slug === selectedSubcategory
      )?.name?.toLowerCase();
      if (subName) {
        result = result.filter((b) =>
          b.tags.some((t) => t.toLowerCase().includes(subName)) ||
          b.description.toLowerCase().includes(subName)
        );
      }
    }
    return sortBooks(result, sortBy);
  }, [selectedCategory, selectedSubcategory, sortBy, activeCategoryData]);

  const handleCategoryClick = useCallback((slug: string) => {
    setSelectedCategory(slug);
    setSelectedSubcategory(null);
    setExpandedCategory(expandedCategory === slug ? null : slug);
    setMobileSidebarOpen(false);
  }, [expandedCategory]);

  const handleSubcategoryClick = useCallback((subSlug: string) => {
    setSelectedSubcategory(subSlug);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {/* Mobile Categories Button */}
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setMobileSidebarOpen(true)}
            variant="outline"
            className="w-full h-11 rounded-xl border-[#E8DDD0] text-[#1D1D1D] font-medium text-sm"
          >
            <Menu className="w-4 h-4 mr-2" />
            Browse Categories
            {selectedCategory && (
              <Badge className="ml-2 bg-[#D8B27A] text-white border-0 text-[10px] px-1.5 py-0.5">
                1
              </Badge>
            )}
          </Button>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-[70] lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 left-0 bottom-0 w-[320px] bg-white z-[80] lg:hidden shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-base font-bold text-[#1D1D1D]">Categories</h2>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CategorySidebarContent
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredCategories={filteredCategories}
                    selectedCategory={selectedCategory}
                    expandedCategory={expandedCategory}
                    handleCategoryClick={handleCategoryClick}
                    selectedSubcategory={selectedSubcategory}
                    handleSubcategoryClick={handleSubcategoryClick}
                    categoryBookCounts={categoryBookCounts}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="sticky top-[160px]">
              <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden max-h-[calc(100vh-180px)] flex flex-col">
                <div className="px-4 pt-4 pb-2">
                  <h2 className="text-sm font-bold text-[#1D1D1D] mb-3">Categories</h2>
                  <div
                    className="relative p-[1.5px] rounded-xl"
                    style={{
                      background:
                        searchQuery
                          ? "linear-gradient(135deg, #EBC9A8 0%, #D8B27A 50%, #F2D8BE 100%)"
                          : "linear-gradient(135deg, #E8DDD0 0%, #d5c8b8 100%)",
                      transition: "background 0.3s ease",
                    }}
                  >
                    <div className="bg-white rounded-[10px] flex items-center">
                      <Search className="w-4 h-4 text-gray-400 ml-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search categories..."
                        className="flex-1 px-3 py-2.5 text-xs bg-transparent focus:outline-none rounded-[10px]"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="p-1 mr-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-2 pb-3">
                  <CategorySidebarContent
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredCategories={filteredCategories}
                    selectedCategory={selectedCategory}
                    expandedCategory={expandedCategory}
                    handleCategoryClick={handleCategoryClick}
                    selectedSubcategory={selectedSubcategory}
                    handleSubcategoryClick={handleSubcategoryClick}
                    categoryBookCounts={categoryBookCounts}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {!selectedCategory ? (
              /* Empty State — No Category Selected */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 lg:py-28"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: "linear-gradient(135deg, #F2D8BE 0%, #F5EDE3 100%)",
                  }}
                >
                  <BookOpen className="w-10 h-10 text-[#8A6A4A]" />
                </div>
                <h2 className="text-xl font-bold text-[#1D1D1D] mb-2">
                  Select a Category
                </h2>
                <p className="text-gray-500 text-sm text-center max-w-md mb-6">
                  Choose a category from the sidebar to browse books. You can
                  search, filter, and sort to find exactly what you&apos;re looking
                  for.
                </p>
                <Link href="/books">
                  <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#8A6A4A] hover:text-white font-semibold rounded-xl px-6">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse All Books
                  </Button>
                </Link>
              </motion.div>
            ) : filteredBooks.length === 0 ? (
              /* Empty State — No Books */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 lg:py-28"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: "linear-gradient(135deg, #F2D8BE 0%, #F5EDE3 100%)",
                  }}
                >
                  <BookOpen className="w-10 h-10 text-[#8A6A4A]" />
                </div>
                <h2 className="text-xl font-bold text-[#1D1D1D] mb-2">
                  No books available in this category
                </h2>
                <p className="text-gray-500 text-sm text-center max-w-md mb-6">
                  We&apos;re working on adding more titles. Check back soon or
                  explore another category.
                </p>
                <Link href="/books">
                  <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#8A6A4A] hover:text-white font-semibold rounded-xl px-6">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse All Books
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 flex-wrap">
                  <Link href="/" className="hover:text-[#D8B27A] transition-colors">
                    <Home className="w-3.5 h-3.5" />
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                  <Link href="/categories" className="hover:text-[#D8B27A] transition-colors">
                    Categories
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-[#1D1D1D] font-medium">
                    {activeCategoryData?.name || ""}
                  </span>
                  {selectedSubcategory && (
                    <>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-[#1D1D1D] font-medium">
                        {activeCategoryData?.subcategories.find(
                          (s) => s.slug === selectedSubcategory
                        )?.name || ""}
                      </span>
                    </>
                  )}
                </nav>

                {/* Category Header */}
                <motion.div
                  key={`${selectedCategory}-${selectedSubcategory}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                    {selectedSubcategory
                      ? activeCategoryData?.subcategories.find(
                          (s) => s.slug === selectedSubcategory
                        )?.name || ""
                      : activeCategoryData?.name || ""}
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-sm font-semibold text-[#D8B27A]">
                      {filteredBooks.length} {filteredBooks.length !== 1 ? "Books" : "Book"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2 max-w-2xl">
                    {selectedSubcategory
                      ? `Browse books in the ${activeCategoryData?.subcategories.find(
                          (s) => s.slug === selectedSubcategory
                        )?.name || ""} subcategory.`
                      : categories.find((c) => c.slug === selectedCategory)
                          ?.description || ""}
                  </p>
                </motion.div>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="h-8 px-3 rounded-lg border-gray-200 text-[13px] font-medium text-[#1D1D1D] hover:border-[#D8B27A]/40 hover:bg-[#D8B27A]/5"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                      Filters
                    </Button>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none h-8 pl-3 pr-8 rounded-lg border border-gray-200 text-[13px] font-medium text-[#1D1D1D] bg-white hover:border-[#D8B27A]/40 transition-colors cursor-pointer focus:outline-none focus:border-[#D8B27A]"
                      >
                        {sortOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2 transition-colors",
                        viewMode === "grid"
                          ? "bg-[#D8B27A]/10 text-[#8A6A4A]"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-gray-200" />
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2 transition-colors",
                        viewMode === "list"
                          ? "bg-[#D8B27A]/10 text-[#8A6A4A]"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Books Grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedCategory}-${selectedSubcategory}-${sortBy}`}
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className={cn(
                      viewMode === "grid"
                        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5"
                        : "flex flex-col gap-3"
                    )}
                  >
                    {filteredBooks.map((book) =>
                      viewMode === "grid" ? (
                        <motion.div
                          key={book.id}
                          variants={item}
                          whileHover={{ y: -4 }}
                          className="group"
                        >
                          <a href={`/books/${book.slug}`} className="block">
                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-3">
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              {book.discountPrice && (
                                <Badge className="absolute top-2 left-2 bg-[#D8B27A] text-white border-0 text-[10px]">
                                  -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                                </Badge>
                              )}
                              {book.isNew && (
                                <Badge className="absolute top-2 right-2 bg-emerald-500 text-white border-0 text-[10px]">
                                  New
                                </Badge>
                              )}
                              <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="h-8 w-8 rounded-full bg-white/90"
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
                                      isInWishlist(book.id) && "fill-current text-red-500"
                                    )}
                                  />
                                </Button>
                                <Button
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
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
                          </a>
                          <a href={`/books/${book.slug}`}>
                            <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                              {book.title}
                            </h3>
                          </a>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {book.author.penName}
                          </p>
                          <FormatBadges book={book} />
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
                            <span className="text-[10px] text-gray-400">
                              ({book.totalReviews})
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-sm font-bold">
                              {formatCurrency(book.discountPrice || book.price)}
                            </span>
                            {book.discountPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatCurrency(book.price)}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        /* List View */
                        <motion.div
                          key={book.id}
                          variants={item}
                          className="group flex gap-4 bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all"
                        >
                          <a
                            href={`/books/${book.slug}`}
                            className="flex-shrink-0"
                          >
                            <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                              {book.discountPrice && (
                                <Badge className="absolute top-1 left-1 bg-[#D8B27A] text-white border-0 text-[9px] px-1 py-0">
                                  -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                                </Badge>
                              )}
                            </div>
                          </a>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <a href={`/books/${book.slug}`}>
                                <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                                  {book.title}
                                </h3>
                              </a>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {book.author.penName}
                              </p>
                              <FormatBadges book={book} />
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
                                <span className="text-[10px] text-gray-400">
                                  ({book.totalReviews})
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-baseline gap-2">
                                <span className="text-sm font-bold">
                                  {formatCurrency(book.discountPrice || book.price)}
                                </span>
                                {book.discountPrice && (
                                  <span className="text-xs text-gray-400 line-through">
                                    {formatCurrency(book.price)}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-1.5">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7 rounded-full border-gray-200"
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
                                      "h-3 w-3",
                                      isInWishlist(book.id) && "fill-current text-red-500"
                                    )}
                                  />
                                </Button>
                                <Button
                                  size="icon"
                                  className="h-7 w-7 rounded-full"
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
                                  <ShoppingCart className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar Content (shared between desktop & mobile) ─── */

function CategorySidebarContent({
  filteredCategories,
  selectedCategory,
  expandedCategory,
  handleCategoryClick,
  selectedSubcategory,
  handleSubcategoryClick,
  categoryBookCounts,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredCategories: typeof categoryGroups;
  selectedCategory: string | null;
  expandedCategory: string | null;
  handleCategoryClick: (slug: string) => void;
  selectedSubcategory: string | null;
  handleSubcategoryClick: (slug: string) => void;
  categoryBookCounts: Record<string, number>;
}) {
  return (
    <div className="py-2">
      {filteredCategories.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400">No categories found</p>
        </div>
      ) : (
        filteredCategories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const isExpanded = expandedCategory === cat.slug;
          return (
            <div key={cat.slug}>
              <button
                onClick={() => handleCategoryClick(cat.slug)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all text-[13px] rounded-lg mx-1",
                  isSelected
                    ? "bg-[#D8B27A]/10 text-[#8A6A4A] font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#1D1D1D] font-medium"
                )}
                style={{ width: "calc(100% - 8px)" }}
              >
                <span className="flex-1 min-w-0 truncate">{cat.name}</span>
                {categoryBookCounts[cat.slug] > 0 && (
                  <span className="text-[10px] font-semibold text-[#D8B27A] bg-[#D8B27A]/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {categoryBookCounts[cat.slug]}
                  </span>
                )}
                {cat.subcategories.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 text-gray-400",
                      isExpanded && "rotate-180"
                    )}
                  />
                )}
              </button>
              <AnimatePresence>
                {isExpanded && cat.subcategories.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 pr-2 py-1">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => handleSubcategoryClick(sub.slug)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-1.5 text-left text-[12px] rounded-lg transition-all",
                            selectedSubcategory === sub.slug
                              ? "bg-[#D8B27A]/15 text-[#8A6A4A] font-semibold"
                              : "text-gray-500 hover:bg-gray-50 hover:text-[#1D1D1D]"
                          )}
                        >
                          <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-50" />
                          <span className="truncate">{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })
      )}
    </div>
  );
}
