"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tag, Star, ShoppingCart, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDealsBooks } from "@/lib/demo-data";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatCurrency, cn } from "@/lib/utils";

export default function DealsPage() {
  const { addItem } = useCart();
  const { addItem: addWishlist, isInWishlist } = useWishlist();

  const dealBooks = useMemo(() => {
    return getDealsBooks().sort((a, b) => {
      const discountA = a.discountPrice
        ? ((a.price - a.discountPrice) / a.price) * 100
        : 0;
      const discountB = b.discountPrice
        ? ((b.price - b.discountPrice) / b.price) * 100
        : 0;
      return discountB - discountA;
    });
  }, []);

  const maxDiscount = useMemo(() => {
    if (dealBooks.length === 0) return 0;
    return Math.max(
      ...dealBooks.map((b) =>
        b.discountPrice
          ? Math.round(((b.price - b.discountPrice) / b.price) * 100)
          : 0
      )
    );
  }, [dealBooks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2D8BE] flex items-center justify-center">
            <Tag className="w-5 h-5 text-[#8A6A4A]" />
          </div>
          Deals & Special Offers
        </h1>
        <p className="text-gray-500 mt-2">Save big on popular books</p>
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl mb-8"
      >
        <div className="bg-gradient-to-r from-[#1D1D1D] via-[#2a2a2a] to-[#8A6A4A] p-8 sm:p-12">
          <div className="relative z-10">
            <Badge className="bg-[#D8B27A] text-[#1D1D1D] border-0 text-xs font-semibold mb-4 px-3 py-1">
              Limited Time Offer
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-3">
              Up to{" "}
              <span className="text-[#D8B27A]">{maxDiscount}% off</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-lg">
              Discover incredible savings on our most popular titles. Grab these
              deals before they&apos;re gone!
            </p>
            <div className="flex items-center gap-2 mt-4 text-[#D8B27A]">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Deals refreshed regularly
              </span>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D8B27A]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-[#D8B27A]/5 rounded-full translate-y-1/2" />
        </div>
      </motion.div>

      {/* Stats Strip */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-[#1D1D1D]">
            {dealBooks.length}
          </span>{" "}
          deals available
        </p>
        <div className="flex items-center gap-1.5 text-sm text-[#8A6A4A] font-medium">
          <Tag className="w-4 h-4" />
          Sorted by highest discount
        </div>
      </div>

      {/* Deals Grid */}
      {dealBooks.length === 0 ? (
        <div className="text-center py-24">
          <Tag
            className="w-16 h-16 text-gray-300 mx-auto mb-6"
            strokeWidth={1.5}
          />
          <h2 className="text-xl font-semibold text-[#1D1D1D] mb-2">
            No deals available right now
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Check back soon for new discounts and special offers.
          </p>
          <Link href="/books">
            <Button className="bg-[#D8B27A] hover:bg-[#c9a46a] text-[#1D1D1D] font-semibold px-8">
              Browse All Books
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {dealBooks.map((book, index) => {
            const discount = book.discountPrice
              ? Math.round(
                  ((book.price - book.discountPrice) / book.price) * 100
                )
              : 0;

            return (
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

                    {/* Discount Badge */}
                    <Badge className="absolute top-2 left-2 bg-[#D8B27A] text-white border-0 text-[10px] font-bold">
                      -{discount}%
                    </Badge>

                    {book.isNew && (
                      <Badge className="absolute top-2 right-2 bg-emerald-500 text-white border-0 text-[10px]">
                        New
                      </Badge>
                    )}

                    {book.isBestseller && !book.isNew && (
                      <Badge className="absolute top-2 right-2 bg-amber-500 text-white border-0 text-[10px]">
                        Bestseller
                      </Badge>
                    )}

                    {/* Hover Actions */}
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

                {/* Info */}
                <Link href={`/books/${book.slug}`}>
                  <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                  {book.author.penName}
                </p>

                {/* Rating */}
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

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-[#D8B27A]">
                    {formatCurrency(book.discountPrice || book.price)}
                  </span>
                  {book.discountPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatCurrency(book.price)}
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                <Badge className="mt-2 bg-[#F2D8BE] text-[#8A6A4A] text-[10px] border-0">
                  {book.category.name}
                </Badge>

                {/* Add to Cart Button */}
                <Button
                  size="sm"
                  className="w-full mt-3 bg-[#1D1D1D] text-white hover:bg-[#333] text-xs"
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
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  Add to Cart
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
