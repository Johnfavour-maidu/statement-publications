"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, calculateDiscount } from "@/lib/utils";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    slug: string;
    coverImage?: string | null;
    author?: {
      user?: { name?: string | null };
      penName?: string | null;
    } | null;
    price: number;
    discountPrice?: number | null;
    averageRating: number;
    totalReviews: number;
    format: string;
    isNew?: boolean;
    isBestseller?: boolean;
    isFeatured?: boolean;
  };
  onAddToCart?: (bookId: string) => void;
  onAddToWishlist?: (bookId: string) => void;
}

export function BookCard({ book, onAddToCart, onAddToWishlist }: BookCardProps) {
  const discount = calculateDiscount(book.price, book.discountPrice ?? null);
  const authorName =
    book.author?.penName || book.author?.user?.name || "Unknown Author";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-xl border bg-card transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/20">
        <Link href={`/store/books/${book.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <Badge className="bg-[#D8B27A] text-white border-0 text-[10px]">
                  -{discount}%
                </Badge>
              )}
              {book.isNew && (
                <Badge className="bg-primary text-primary-foreground border-0 text-[10px]">
                  New
                </Badge>
              )}
              {book.isBestseller && (
                <Badge className="bg-amber-500 text-white border-0 text-[10px]">
                  Bestseller
                </Badge>
              )}
            </div>

            <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 transition-all group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
              {onAddToWishlist && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToWishlist(book.id);
                  }}
                >
                  <Heart className="h-3.5 w-3.5" />
                </Button>
              )}
              {onAddToCart && (
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(book.id);
                  }}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </Link>

        <div className="p-3 space-y-1.5">
          <Link
            href={`/store/books/${book.slug}`}
            className="block"
          >
            <h3 className="text-sm font-semibold line-clamp-2 leading-snug hover:text-primary transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground truncate">{authorName}</p>

          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.round(book.averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">
              ({book.totalReviews})
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold">
              {formatCurrency(book.discountPrice || book.price)}
            </span>
            {book.discountPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(book.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
