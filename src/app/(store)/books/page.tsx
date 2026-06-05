"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCard } from "@/components/shared/book-card";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All Categories", count: 12 },
  { id: "fiction", name: "Fiction", count: 4 },
  { id: "non-fiction", name: "Non-Fiction", count: 2 },
  { id: "romance", name: "Romance", count: 1 },
  { id: "poetry", name: "Poetry", count: 1 },
  { id: "children", name: "Children's", count: 1 },
  { id: "self-help", name: "Self-Help", count: 1 },
  { id: "science-fiction", name: "Science Fiction", count: 1 },
  { id: "biography", name: "Biography", count: 1 },
];

const mockBooks = [
  {
    id: "1",
    title: "The Last Sunrise",
    slug: "the-last-sunrise",
    coverImage: null,
    author: { user: { name: "Adaeze Nwosu" }, penName: "A. Nwosu" },
    price: 14.99,
    discountPrice: 9.99,
    averageRating: 4.8,
    totalReviews: 234,
    format: "EBOOK",
    isNew: true,
    isBestseller: true,
  },
  {
    id: "2",
    title: "Echoes of Tomorrow",
    slug: "echoes-of-tomorrow",
    coverImage: null,
    author: { user: { name: "Chidi Okoro" }, penName: "C. Okoro" },
    price: 12.99,
    discountPrice: null,
    averageRating: 4.5,
    totalReviews: 189,
    format: "PAPERBACK",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "3",
    title: "Whispers in the Wind",
    slug: "whispers-in-the-wind",
    coverImage: null,
    author: { user: { name: "Fatima Bello" }, penName: "F. Bello" },
    price: 19.99,
    discountPrice: 14.99,
    averageRating: 4.9,
    totalReviews: 312,
    format: "HARDCOVER",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "4",
    title: "Chasing Shadows",
    slug: "chasing-shadows",
    coverImage: null,
    author: { user: { name: "Kemi Adekunle" }, penName: "K. Adekunle" },
    price: 11.99,
    discountPrice: null,
    averageRating: 4.2,
    totalReviews: 87,
    format: "EBOOK",
    isNew: true,
    isBestseller: false,
  },
  {
    id: "5",
    title: "The Garden of Secrets",
    slug: "the-garden-of-secrets",
    coverImage: null,
    author: { user: { name: "Olumide Bankole" }, penName: "O. Bankole" },
    price: 16.99,
    discountPrice: 12.99,
    averageRating: 4.6,
    totalReviews: 156,
    format: "PAPERBACK",
    isNew: false,
    isBestseller: false,
  },
  {
    id: "6",
    title: "Beneath the Surface",
    slug: "beneath-the-surface",
    coverImage: null,
    author: { user: { name: "Ngozi Eze" }, penName: "N. Eze" },
    price: 13.99,
    discountPrice: null,
    averageRating: 4.3,
    totalReviews: 98,
    format: "EBOOK",
    isNew: false,
    isBestseller: false,
  },
  {
    id: "7",
    title: "A Dance with Destiny",
    slug: "a-dance-with-destiny",
    coverImage: null,
    author: { user: { name: "Emeka Okafor" }, penName: "E. Okafor" },
    price: 22.99,
    discountPrice: 17.99,
    averageRating: 4.7,
    totalReviews: 203,
    format: "HARDCOVER",
    isNew: true,
    isBestseller: false,
  },
  {
    id: "8",
    title: "Poems of the Heart",
    slug: "poems-of-the-heart",
    coverImage: null,
    author: { user: { name: "Aisha Mohammed" }, penName: "A. Mohammed" },
    price: 9.99,
    discountPrice: null,
    averageRating: 4.4,
    totalReviews: 67,
    format: "EBOOK",
    isNew: false,
    isBestseller: false,
  },
  {
    id: "9",
    title: "The Little Explorer",
    slug: "the-little-explorer",
    coverImage: null,
    author: { user: { name: "Tunde Ogundimu" }, penName: "T. Ogundimu" },
    price: 8.99,
    discountPrice: 6.99,
    averageRating: 4.8,
    totalReviews: 145,
    format: "PAPERBACK",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "10",
    title: "Mind Over Matter",
    slug: "mind-over-matter",
    coverImage: null,
    author: { user: { name: "Blessing Okoye" }, penName: "B. Okoye" },
    price: 15.99,
    discountPrice: null,
    averageRating: 4.1,
    totalReviews: 54,
    format: "EBOOK",
    isNew: true,
    isBestseller: false,
  },
  {
    id: "11",
    title: "Starfall Chronicles",
    slug: "starfall-chronicles",
    coverImage: null,
    author: { user: { name: "Damilola Akindele" }, penName: "D. Akindele" },
    price: 18.99,
    discountPrice: 13.99,
    averageRating: 4.6,
    totalReviews: 178,
    format: "PAPERBACK",
    isNew: false,
    isBestseller: false,
  },
  {
    id: "12",
    title: "Life in Full Color",
    slug: "life-in-full-color",
    coverImage: null,
    author: { user: { name: "Grace Obi" }, penName: "G. Obi" },
    price: 21.99,
    discountPrice: null,
    averageRating: 4.5,
    totalReviews: 132,
    format: "HARDCOVER",
    isNew: false,
    isBestseller: false,
  },
];

const ITEMS_PER_PAGE = 9;

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBooks = useMemo(() => {
    let result = [...mockBooks];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author?.user?.name?.toLowerCase().includes(q) ||
          b.author?.penName?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "price-high":
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case "rating":
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "bestselling":
        result.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [searchQuery, sortBy, selectedCategory]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse Books
        </h1>
        <p className="text-muted-foreground">
          Discover your next great read from our curated collection.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    selectedCategory === cat.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedBooks.length} of {filteredBooks.length} books
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Sort by:
              </span>
              <Select
                value={sortBy}
                onValueChange={(v) => {
                  setSortBy(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="bestselling">Bestselling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {paginatedBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No books found matching your criteria.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-9 h-9 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
