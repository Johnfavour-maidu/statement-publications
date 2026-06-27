"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Star, ShoppingCart, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { searchBooks } from "@/lib/demo-data";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatCurrency, cn } from "@/lib/utils";

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const { addItem } = useCart();
  const { addItem: addWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, router]);

  const results = debouncedQuery ? searchBooks(debouncedQuery) : [];

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setDebouncedQuery(query);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      router.push(`/search?${params.toString()}`);
    },
    [query, router]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search books, authors, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 text-base border-[#E8DDD0] bg-white rounded-xl"
            autoFocus
          />
        </form>
      </div>

      {debouncedQuery && (
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-[#1D1D1D]">
              {results.length}
            </span>{" "}
            {results.length === 1 ? "book" : "books"} found for &ldquo;
            <span className="text-[#D8B27A]">{debouncedQuery}</span>&rdquo;
          </p>
        </div>
      )}

      {debouncedQuery && results.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No books found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try searching with different keywords
          </p>
          <Button
            variant="outline"
            className="mt-4 border-[#E8DDD0]"
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
              router.replace("/search");
            }}
          >
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {results.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
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
                  {book.discountPrice && (
                    <Badge className="absolute top-2 left-2 bg-[#D8B27A] text-white border-0 text-[10px]">
                      -
                      {Math.round(
                        ((book.price - book.discountPrice) / book.price) * 100
                      )}
                      %
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
                          isInWishlist(book.id) &&
                            "fill-current text-red-500"
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
              </Link>
              <Link href={`/books/${book.slug}`}>
                <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                  {book.title}
                </h3>
              </Link>
              <p className="text-xs text-gray-400 mt-0.5">
                {book.author.penName}
              </p>
              <div className="flex gap-1 mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border bg-[#F2D8BE]/60 text-[#8A6A4A] border-[#E8DDD0]">
                  eBook
                </span>
                {book.isAudiobook && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border bg-purple-50 text-purple-700 border-purple-200">
                    Audiobook
                  </span>
                )}
              </div>
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
          ))}
        </div>
      )}

      {!debouncedQuery && (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Search for your next read</p>
          <p className="text-sm text-gray-400 mt-1">
            Find books by title, author, category, or topic
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse max-w-2xl" />
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
