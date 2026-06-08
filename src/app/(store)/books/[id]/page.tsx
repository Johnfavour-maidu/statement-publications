"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  BookOpen,
  ChevronRight,
  ThumbsUp,
  User,
  Calendar,
  Globe,
  Minus,
  Plus,
  Share2,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { demoBooks, type DemoBook } from "@/lib/demo-books";

const reviews = [
  {
    id: "r1",
    user: "Sarah M.",
    rating: 5,
    title: "Couldn't put it down!",
    content: "This book exceeded all my expectations. The author's writing style is captivating and the story kept me hooked from the first page to the last. Highly recommended!",
    helpfulCount: 42,
    date: "2025-04-10",
  },
  {
    id: "r2",
    user: "Michael R.",
    rating: 4,
    title: "Beautifully written",
    content: "A truly compelling read with well-developed characters and a plot that keeps you guessing. The pacing is excellent and the themes are thought-provoking.",
    helpfulCount: 28,
    date: "2025-03-22",
  },
  {
    id: "r3",
    user: "Emily K.",
    rating: 5,
    title: "A masterpiece",
    content: "One of the best books I've read this year. The depth of emotion and the quality of the prose are remarkable. I've already recommended it to all my friends.",
    helpfulCount: 35,
    date: "2025-03-15",
  },
];

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const book = useMemo(() => {
    return demoBooks.find((b) => b.id === bookId) || demoBooks[0];
  }, [bookId]);

  const relatedBooks = useMemo(() => {
    return demoBooks
      .filter((b) => b.id !== book.id && b.category === book.category)
      .slice(0, 4);
  }, [book]);

  const alsoViewed = useMemo(() => {
    return demoBooks
      .filter((b) => b.id !== book.id && b.subcategory === book.subcategory && b.category !== book.category)
      .slice(0, 4);
  }, [book]);

  const categoryBooks = useMemo(() => {
    return demoBooks
      .filter((b) => b.id !== book.id && b.category === book.category && !relatedBooks.some(r => r.id === b.id))
      .slice(0, 4);
  }, [book, relatedBooks]);

  const [quantity, setQuantity] = useState(1);
  const [cartNotification, setCartNotification] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: book.id, title: book.title, author: book.author, price: book.discountPrice || book.price, cover: book.cover });
    }
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white pt-[116px]">
      {/* Cart Notification */}
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
          <span className="font-medium">Added to cart successfully!</span>
        </motion.div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-dark-gray/60 mb-8">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/books" className="hover:text-charcoal transition-colors">Books</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/books?category=${book.category}`} className="hover:text-charcoal transition-colors">{book.category}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-charcoal font-medium truncate">{book.title}</span>
        </nav>

        {/* Book Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-10">
              {/* Cover Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative mx-auto md:mx-0 max-w-[360px]"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {book.discountPrice && (
                    <Badge className="bg-[#D8B27A] text-white border-0 shadow-lg">
                      -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                    </Badge>
                  )}
                  {book.isNew && (
                    <Badge className="bg-[#EBC9A8] text-charcoal border-0 shadow-lg">
                      New
                    </Badge>
                  )}
                  {book.isBestseller && (
                    <Badge className="bg-amber-500 text-white border-0 shadow-lg">
                      Bestseller
                    </Badge>
                  )}
                </div>
              </motion.div>

              {/* Book Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize bg-[#EBC9A8]/20 text-charcoal border-0">{book.category}</Badge>
                    <Badge variant="secondary" className="capitalize bg-[#EBC9A8]/10 text-charcoal/70 border-0">{book.subcategory}</Badge>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal" style={{ fontFamily: "var(--font-libre)" }}>
                    {book.title}
                  </h1>
                  {book.subtitle && (
                    <p className="text-lg text-dark-gray/60 mt-1">{book.subtitle}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="h-10 w-10 rounded-full bg-[#EBC9A8] flex items-center justify-center">
                      <span className="text-sm font-bold text-charcoal">
                        {book.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-dark-gray/60">by</p>
                      <p className="font-semibold text-charcoal">{book.author}</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.round(book.averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-charcoal">{book.averageRating}</span>
                  <span className="text-sm text-dark-gray/60">
                    ({book.totalReviews.toLocaleString()} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-charcoal">
                    ${(book.discountPrice || book.price).toFixed(2)}
                  </span>
                  {book.discountPrice && (
                    <span className="text-lg text-dark-gray/40 line-through">
                      ${book.price.toFixed(2)}
                    </span>
                  )}
                  {book.discountPrice && (
                    <span className="text-sm font-semibold text-green-600">
                      Save ${(book.price - book.discountPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-charcoal">Quantity</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-r-none"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium text-charcoal">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-l-none"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      className="w-full bg-[#D8B27A] hover:bg-[#C9A36B] text-white font-semibold text-base py-6 shadow-lg"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className={cn(
                        "px-4 py-6 transition-all border-2",
                        isInWishlist(book.id)
                          ? "bg-rose-50 border-rose-300 text-rose-600"
                          : "border-gray-200 hover:border-rose-200"
                      )}
                      onClick={() => toggleItem({ id: book.id, title: book.title, author: book.author, price: book.price, cover: book.cover, slug: book.id })}
                    >
                      <Heart
                        className={cn("h-5 w-5", isInWishlist(book.id) && "fill-rose-500 text-rose-500")}
                      />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="px-4 py-6 border-2 border-gray-200 hover:border-gray-300">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>

                {/* Book Meta */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2.5 text-sm text-dark-gray/70">
                    <BookOpen className="h-4 w-4 text-[#8A6A4A]" />
                    <span>{book.readingLength}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-dark-gray/70">
                    <Globe className="h-4 w-4 text-[#8A6A4A]" />
                    <span>{book.language}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-dark-gray/70">
                    <Calendar className="h-4 w-4 text-[#8A6A4A]" />
                    <span>{new Date(book.publicationDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-dark-gray/70">
                    <Clock className="h-4 w-4 text-[#8A6A4A]" />
                    <span>ISBN: {book.isbn}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* About This Book */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <h2 className="text-xl font-bold text-charcoal mb-4">About This Book</h2>
              <p className="text-dark-gray/70 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Author Information */}
            <div className="p-6 rounded-2xl border border-gray-100 bg-white">
              <h2 className="text-xl font-bold text-charcoal mb-4">About the Author</h2>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-[#EBC9A8] flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-charcoal">
                    {book.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-lg">{book.author}</p>
                  <p className="text-sm text-dark-gray/60 mt-1 leading-relaxed">
                    A distinguished author published through Statement Publications, bringing insightful content to readers worldwide.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-charcoal">Reader Reviews</h2>
                <Button variant="outline" size="sm" className="border-[#EBC9A8] text-charcoal hover:bg-[#EBC9A8]/10">
                  Write a Review
                </Button>
              </div>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="border-gray-100">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-[#EBC9A8] flex items-center justify-center">
                            <span className="text-sm font-bold text-charcoal">
                              {review.user.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-charcoal">{review.user}</p>
                            <p className="text-xs text-dark-gray/50">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5",
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-charcoal">{review.title}</p>
                        <p className="text-sm text-dark-gray/60 mt-1 leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-dark-gray/50">
                        <button className="flex items-center gap-1 hover:text-charcoal transition-colors">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Helpful ({review.helpfulCount})
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Book Details Card */}
              <div className="rounded-2xl border border-gray-100 p-6 space-y-4 bg-white shadow-sm">
                <h3 className="font-bold text-charcoal text-lg">Book Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dark-gray/60">ISBN</span>
                    <span className="font-medium text-charcoal">{book.isbn}</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between">
                    <span className="text-dark-gray/60">Category</span>
                    <span className="font-medium text-charcoal">{book.category}</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between">
                    <span className="text-dark-gray/60">Subcategory</span>
                    <span className="font-medium text-charcoal">{book.subcategory}</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between">
                    <span className="text-dark-gray/60">Language</span>
                    <span className="font-medium text-charcoal">{book.language}</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between">
                    <span className="text-dark-gray/60">Reading Length</span>
                    <span className="font-medium text-charcoal">{book.readingLength}</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between">
                    <span className="text-dark-gray/60">Published</span>
                    <span className="font-medium text-charcoal">
                      {new Date(book.publicationDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Add Card */}
              <div className="rounded-2xl border border-gray-100 p-6 space-y-4 bg-gradient-to-b from-[#FDF6EE] to-white">
                <div className="text-center">
                  <p className="text-2xl font-bold text-charcoal">${(book.discountPrice || book.price).toFixed(2)}</p>
                  {book.discountPrice && (
                    <p className="text-sm text-dark-gray/50 line-through">${book.price.toFixed(2)}</p>
                  )}
                </div>
                <Button
                  className="w-full bg-[#D8B27A] hover:bg-[#C9A36B] text-white font-semibold"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-charcoal mb-6" style={{ fontFamily: "var(--font-libre)" }}>
              More in {book.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedBooks.map((rb, i) => (
                <motion.div
                  key={rb.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/books/${rb.id}`} className="block group">
                    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 group-hover:shadow-xl group-hover:border-[#EBC9A8]/40 group-hover:scale-[1.02]">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={rb.cover}
                          alt={rb.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-3 space-y-1.5">
                        <h3 className="text-sm font-semibold text-charcoal line-clamp-1 group-hover:text-[#8A6A4A] transition-colors">
                          {rb.title}
                        </h3>
                        <p className="text-xs text-dark-gray/60">{rb.author}</p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("h-3 w-3", i < Math.round(rb.averageRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
                          ))}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-charcoal">
                            ${(rb.discountPrice || rb.price).toFixed(2)}
                          </span>
                          {rb.discountPrice && (
                            <span className="text-xs text-dark-gray/40 line-through">
                              ${rb.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Readers Also Viewed */}
        {alsoViewed.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-charcoal mb-6" style={{ fontFamily: "var(--font-libre)" }}>
              Readers Also Viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {alsoViewed.map((rb, i) => (
                <motion.div
                  key={rb.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/books/${rb.id}`} className="block group">
                    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 group-hover:shadow-xl group-hover:border-[#EBC9A8]/40 group-hover:scale-[1.02]">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={rb.cover}
                          alt={rb.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-3 space-y-1.5">
                        <h3 className="text-sm font-semibold text-charcoal line-clamp-1 group-hover:text-[#8A6A4A] transition-colors">
                          {rb.title}
                        </h3>
                        <p className="text-xs text-dark-gray/60">{rb.author}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-charcoal">
                            ${(rb.discountPrice || rb.price).toFixed(2)}
                          </span>
                          {rb.discountPrice && (
                            <span className="text-xs text-dark-gray/40 line-through">
                              ${rb.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Category Recommendations */}
        {categoryBooks.length > 0 && (
          <div className="mt-16 mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-6" style={{ fontFamily: "var(--font-libre)" }}>
              Explore {book.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categoryBooks.map((rb, i) => (
                <motion.div
                  key={rb.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/books/${rb.id}`} className="block group">
                    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 group-hover:shadow-xl group-hover:border-[#EBC9A8]/40 group-hover:scale-[1.02]">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={rb.cover}
                          alt={rb.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-3 space-y-1.5">
                        <h3 className="text-sm font-semibold text-charcoal line-clamp-1 group-hover:text-[#8A6A4A] transition-colors">
                          {rb.title}
                        </h3>
                        <p className="text-xs text-dark-gray/60">{rb.author}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-charcoal">
                            ${(rb.discountPrice || rb.price).toFixed(2)}
                          </span>
                          {rb.discountPrice && (
                            <span className="text-xs text-dark-gray/40 line-through">
                              ${rb.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
