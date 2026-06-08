"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Star, ShoppingCart, Heart, X, ChevronDown,
  ArrowUpDown, BookOpen, TrendingUp, Clock, Filter, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { demoBooks, type DemoBook } from "@/lib/demo-books";

const categories = [
  { id: "all", name: "All Books", count: demoBooks.length },
  { id: "Fiction", name: "Fiction", count: 35, sub: [
    { id: "Romance", name: "Romance", count: 5 },
    { id: "Contemporary Fiction", name: "Contemporary Fiction", count: 5 },
    { id: "Historical Fiction", name: "Historical Fiction", count: 5 },
    { id: "Literary Fiction", name: "Literary Fiction", count: 5 },
    { id: "Mystery", name: "Mystery", count: 5 },
    { id: "Thriller", name: "Thriller", count: 5 },
    { id: "Crime", name: "Crime", count: 5 },
  ]},
  { id: "Business", name: "Business", count: 25, sub: [
    { id: "Entrepreneurship", name: "Entrepreneurship", count: 4 },
    { id: "Leadership", name: "Leadership", count: 8 },
    { id: "Marketing", name: "Marketing", count: 4 },
    { id: "Management", name: "Management", count: 3 },
    { id: "Personal Branding", name: "Personal Branding", count: 3 },
    { id: "Sales", name: "Sales", count: 3 },
  ]},
  { id: "Technology", name: "Technology", count: 25, sub: [
    { id: "Artificial Intelligence", name: "Artificial Intelligence", count: 5 },
    { id: "Software Development", name: "Software Development", count: 5 },
    { id: "Cybersecurity", name: "Cybersecurity", count: 4 },
    { id: "Data Science", name: "Data Science", count: 4 },
    { id: "Cloud Computing", name: "Cloud Computing", count: 3 },
    { id: "Web Development", name: "Web Development", count: 4 },
  ]},
  { id: "Education", name: "Education", count: 20, sub: [
    { id: "Mathematics", name: "Mathematics", count: 5 },
    { id: "Science", name: "Science", count: 5 },
    { id: "English", name: "English", count: 4 },
    { id: "Study Skills", name: "Study Skills", count: 3 },
    { id: "Teaching Resources", name: "Teaching Resources", count: 3 },
  ]},
  { id: "Religion", name: "Religion", count: 25, sub: [
    { id: "Christian Living", name: "Christian Living", count: 6 },
    { id: "Theology", name: "Theology", count: 5 },
    { id: "Devotional", name: "Devotional", count: 5 },
    { id: "Faith & Inspiration", name: "Faith & Inspiration", count: 5 },
    { id: "Leadership", name: "Leadership", count: 4 },
  ]},
  { id: "Children", name: "Children", count: 20, sub: [
    { id: "Early Readers", name: "Early Readers", count: 5 },
    { id: "Bedtime Stories", name: "Bedtime Stories", count: 5 },
    { id: "Educational Stories", name: "Educational Stories", count: 5 },
    { id: "Adventure Stories", name: "Adventure Stories", count: 5 },
  ]},
  { id: "Biography", name: "Biography", count: 15, sub: [
    { id: "Entrepreneurs", name: "Entrepreneurs", count: 4 },
    { id: "Historical Figures", name: "Historical Figures", count: 4 },
    { id: "Political Leaders", name: "Political Leaders", count: 4 },
    { id: "Inspirational Personalities", name: "Inspirational Personalities", count: 3 },
  ]},
  { id: "Poetry", name: "Poetry", count: 10, sub: [
    { id: "Contemporary Poetry", name: "Contemporary Poetry", count: 4 },
    { id: "Inspirational Poetry", name: "Inspirational Poetry", count: 3 },
    { id: "Love Poetry", name: "Love Poetry", count: 3 },
  ]},
  { id: "Academic", name: "Academic", count: 15, sub: [
    { id: "Research Methods", name: "Research Methods", count: 4 },
    { id: "Journals", name: "Journals", count: 4 },
    { id: "Textbooks", name: "Textbooks", count: 4 },
    { id: "Professional Development", name: "Professional Development", count: 3 },
  ]},
  { id: "Health & Wellness", name: "Health & Wellness", count: 15, sub: [
    { id: "Nutrition", name: "Nutrition", count: 4 },
    { id: "Mental Health", name: "Mental Health", count: 4 },
    { id: "Fitness", name: "Fitness", count: 4 },
    { id: "Lifestyle", name: "Lifestyle", count: 3 },
  ]},
];

const sortOptions = [
  { id: "featured", label: "Featured", icon: Star },
  { id: "newest", label: "Newest Releases", icon: Clock },
  { id: "bestselling", label: "Best Selling", icon: TrendingUp },
  { id: "rating", label: "Highest Rated", icon: Star },
  { id: "price-low", label: "Price: Low to High", icon: ArrowUpDown },
  { id: "price-high", label: "Price: High to Low", icon: ArrowUpDown },
  { id: "title-az", label: "Title: A-Z", icon: ArrowUpDown },
  { id: "reviews", label: "Most Reviewed", icon: ArrowUpDown },
];

const trendingSearches = [
  "Financial Freedom", "Creative Mind", "Leadership", "African Fiction",
  "Poetry", "Self-Help", "Entrepreneurship", "Children's Books",
];

export default function StorePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [searchCategory, setSearchCategory] = useState("all");
  const [cartNotification, setCartNotification] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const searchCategories = categories.filter((c) => c.id !== "all");
  const itemsPerPage = 12;

  const filteredBooks = useMemo(() => {
    let result = [...demoBooks];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.subcategory.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "all") {
      result = result.filter(
        (b) => b.category === selectedCategory || b.subcategory === selectedCategory
      );
    }
    result = result.filter((b) => b.price >= priceRange[0] && b.price <= priceRange[1]);
    switch (sortBy) {
      case "newest": result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case "bestselling": result.sort((a, b) => b.totalReviews - a.totalReviews); break;
      case "rating": result.sort((a, b) => b.averageRating - a.averageRating); break;
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "title-az": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "reviews": result.sort((a, b) => b.totalReviews - a.totalReviews); break;
    }
    return result;
  }, [search, selectedCategory, sortBy, priceRange]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const maxVisible = 5;
    const pages: (number | string)[] = [];
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
      if (start > 1) pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      if (end < totalPages) pages.push(totalPages);
    }
    return pages;
  };

  const handleSearch = useCallback((term: string) => {
    setSearch(term);
    setCurrentPage(1);
    if (term.trim() && !recentSearches.includes(term.trim())) {
      setRecentSearches((prev) => [term.trim(), ...prev].slice(0, 5));
    }
  }, [recentSearches]);

  const handleSearchSubmit = () => {
    if (searchCategory !== "all") {
      setSelectedCategory(searchCategory);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (cartNotification) {
      const t = setTimeout(() => setCartNotification(null), 2500);
      return () => clearTimeout(t);
    }
  }, [cartNotification]);

  const addToCart = (book: DemoBook) => {
    addItem({ id: book.id, title: book.title, author: book.author, price: book.discountPrice || book.price, cover: book.cover });
    setCartNotification(book.title);
  };

  const selectedCat = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-white pt-[116px]">
      {/* Cart Success Notification */}
      <AnimatePresence>
        {cartNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[120px] left-1/2 -translate-x-1/2 z-[100] bg-charcoal text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm"
          >
            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">&ldquo;{cartNotification}&rdquo; added to cart</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-[#FDF6EE] to-white">
        <div className="mx-auto max-w-4xl px-4 text-center pt-12 pb-8 sm:pt-16 sm:pb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal"
            style={{ fontFamily: "var(--font-libre)" }}
          >
            Discover Your Next Great Read
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-dark-gray/70"
          >
            Browse thousands of books from independent authors worldwide
          </motion.p>

          {/* Search Bar */}
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mt-8 max-w-3xl mx-auto"
          >
            <div className="flex items-stretch gap-0 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
              {/* Category Dropdown */}
              <div className="hidden sm:flex items-center px-4 py-3 bg-gray-50 border-r border-gray-200 min-w-[140px]">
                <select
                  value={searchCategory}
                  onChange={(e) => {
                    setSearchCategory(e.target.value);
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-sm font-medium text-charcoal outline-none cursor-pointer appearance-none pr-1"
                >
                  <option value="all">Categories</option>
                  {searchCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-dark-gray/50 -ml-1 pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                  placeholder="Search by title, author, ISBN, or category..."
                  className="w-full px-5 py-3.5 text-base bg-transparent outline-none placeholder:text-dark-gray/40"
                />
                {search && (
                  <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100">
                    <X className="h-4 w-4 text-dark-gray/50" />
                  </button>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearchSubmit}
                className="px-6 bg-[#EBC9A8] hover:bg-[#D8B27A] text-charcoal transition-colors flex items-center justify-center"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border shadow-xl z-50 p-4"
                >
                  {recentSearches.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-dark-gray/50 uppercase tracking-wider mb-2">Recent Searches</h4>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => { handleSearch(term); setSearchFocused(false); }}
                            className="px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-[#EBC9A8]/20 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold text-dark-gray/50 uppercase tracking-wider mb-2">Trending Searches</h4>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => { handleSearch(term); setSearchFocused(false); }}
                          className="px-3 py-1.5 text-sm rounded-full bg-[#EBC9A8]/10 hover:bg-[#EBC9A8]/30 text-charcoal transition-colors"
                        >
                          <TrendingUp className="inline h-3 w-3 mr-1" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={cn("lg:w-64 shrink-0", showFilters ? "block" : "hidden lg:block")}>
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => { setSelectedCategory(cat.id); setSearchCategory(cat.id); setCurrentPage(1); }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                          selectedCategory === cat.id
                            ? "bg-[#EBC9A8]/20 text-charcoal font-semibold"
                            : "text-dark-gray/70 hover:bg-gray-50"
                        )}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-dark-gray/40">{cat.count}</span>
                      </button>
                      {(selectedCategory === cat.id || cat.sub?.some(s => s.id === selectedCategory)) && cat.sub && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {cat.sub.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => { setSelectedCategory(sub.id); setCurrentPage(1); }}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all",
                                selectedCategory === sub.id
                                  ? "bg-[#EBC9A8]/10 text-charcoal font-medium"
                                  : "text-dark-gray/50 hover:bg-gray-50 hover:text-dark-gray/70"
                              )}
                            >
                              <span>{sub.name}</span>
                              <span className="text-dark-gray/30">{sub.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3">Price Range</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={priceRange[1]}
                    onChange={(e) => { setPriceRange([0, Number(e.target.value)]); setCurrentPage(1); }}
                    className="w-full accent-[#EBC9A8]"
                  />
                  <div className="flex justify-between text-xs text-dark-gray/50 mt-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== "all" || search || priceRange[1] < 50) && (
                <button
                  onClick={() => { setSelectedCategory("all"); setSearchCategory("all"); setSearch(""); setPriceRange([0, 50]); setCurrentPage(1); }}
                  className="w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Book Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm rounded-lg border hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                <p className="text-sm text-dark-gray/60">
                  <span className="font-semibold text-charcoal">{filteredBooks.length}</span> books found
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border bg-white outline-none focus:border-[#EBC9A8]"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== "all" || search) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-[#EBC9A8]/20 text-charcoal font-medium">
                    {selectedCat?.name}
                    <button onClick={() => { setSelectedCategory("all"); setSearchCategory("all"); }} className="ml-1 hover:text-rose-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-[#EBC9A8]/20 text-charcoal font-medium">
                    &ldquo;{search}&rdquo;
                    <button onClick={() => handleSearch("")} className="ml-1 hover:text-rose-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Books Grid */}
            {paginatedBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link href={`/books/${book.id}`}>
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {book.isNew && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#D8B27A] text-white rounded-full">
                            New
                          </span>
                        )}
                        {book.isBestseller && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#EBC9A8] text-charcoal rounded-full">
                            Bestseller
                          </span>
                        )}
                        {book.discountPrice && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white rounded-full">
                            -{Math.round((1 - book.discountPrice / book.price) * 100)}%
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="mt-3 px-1">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn("h-3 w-3", i < Math.round(book.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200")}
                          />
                        ))}
                        <span className="text-[10px] text-dark-gray/50 ml-1">({book.totalReviews})</span>
                      </div>
                      <Link href={`/books/${book.id}`}>
                        <h3 className="text-sm font-semibold text-charcoal line-clamp-2 hover:text-[#8A6A4A] transition-colors leading-snug">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-dark-gray/60 mt-0.5">{book.author}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-charcoal">
                            ${(book.discountPrice || book.price).toFixed(2)}
                          </span>
                          {book.discountPrice && (
                            <span className="text-xs text-dark-gray/40 line-through">${book.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleItem({ id: book.id, title: book.title, author: book.author, price: book.price, cover: book.cover, slug: book.id });
                            }}
                            className="p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                          >
                            <Heart className={cn("h-4 w-4", isInWishlist(book.id) ? "fill-rose-500 text-rose-500" : "text-dark-gray/40")} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(book);
                            }}
                            className="p-1.5 rounded-full hover:bg-[#EBC9A8]/20 transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4 text-dark-gray/40" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="h-16 w-16 mx-auto text-dark-gray/20 mb-4" />
                <h3 className="text-lg font-semibold text-charcoal mb-2">No books found</h3>
                <p className="text-sm text-dark-gray/50">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10" role="navigation" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    currentPage === 1
                      ? "text-dark-gray/30 cursor-not-allowed"
                      : "text-dark-gray/70 hover:bg-gray-100"
                  )}
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  Previous
                </button>
                {getPageNumbers().map((page, i) =>
                  typeof page === "string" ? (
                    <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-dark-gray/40">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "h-10 w-10 rounded-lg text-sm font-medium transition-all",
                        page === currentPage
                          ? "bg-[#EBC9A8] text-charcoal shadow-sm"
                          : "text-dark-gray/60 hover:bg-gray-100"
                      )}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    currentPage === totalPages
                      ? "text-dark-gray/30 cursor-not-allowed"
                      : "text-dark-gray/70 hover:bg-gray-100"
                  )}
                >
                  Next
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
