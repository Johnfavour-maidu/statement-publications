"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryBySlug, getBooksByCategory } from "@/lib/demo-data";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatCurrency, cn } from "@/lib/utils";

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  const category = getCategoryBySlug(slug);
  const books = category ? getBooksByCategory(slug) : [];

  const { addItem } = useCart();
  const { addItem: addWishlist, isInWishlist } = useWishlist();

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1D1D1D] mb-2">Category Not Found</h1>
          <p className="text-gray-500 mb-6">
            The category you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/categories">
            <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
              Browse All Categories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#D8B27A] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/categories" className="hover:text-[#D8B27A] transition-colors">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1D1D1D] font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{category.icon}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">{category.name}</h1>
            <p className="text-[#D8B27A] font-medium mt-1">
              {category.bookCount} books
            </p>
            <p className="text-gray-500 mt-2 max-w-2xl">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No books in this category yet.</p>
          <Link href="/books">
            <Button variant="outline" className="mt-4 border-[#E8DDD0]">
              Browse All Books
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
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
              </Link>
              <Link href={`/books/${book.slug}`}>
                <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                  {book.title}
                </h3>
              </Link>
              <p className="text-xs text-gray-400 mt-0.5">{book.author.penName}</p>
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
                <span className="text-[10px] text-gray-400">({book.totalReviews})</span>
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
    </div>
  );
}
