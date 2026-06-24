"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, BookOpen, ChevronRight, Minus, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBookBySlug, getBooksByCategory } from "@/lib/demo-data";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatCurrency, cn } from "@/lib/utils";

type Tab = "description" | "details" | "reviews";

const ratingDistribution = [
  { stars: 5, percent: 72 },
  { stars: 4, percent: 18 },
  { stars: 3, percent: 6 },
  { stars: 2, percent: 3 },
  { stars: 1, percent: 1 },
];

const sampleReviews = [
  { name: "Adeola K.", rating: 5, date: "May 12, 2026", text: "Absolutely transformative. This book gave me a clear roadmap for my finances. I've already recommended it to three friends." },
  { name: "Chidi O.", rating: 5, date: "April 28, 2026", text: "Practical, actionable, and well-written. The author really knows how to break down complex topics into simple steps." },
  { name: "Fatima M.", rating: 4, date: "March 15, 2026", text: "Great content and easy to read. I would have liked a bit more depth on the investment chapter, but overall an excellent book." },
];

export default function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const book = getBookBySlug(slug);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("description");

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#1D1D1D] mb-2">Book Not Found</h1>
        <p className="text-gray-500 mb-6">The book you are looking for does not exist or has been removed.</p>
        <Link href="/books">
          <Button className="bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a]">
            <BookOpen className="w-4 h-4 mr-2" /> Browse All Books
          </Button>
        </Link>
      </div>
    );
  }

  const relatedBooks = getBooksByCategory(book.category.slug)
    .filter((b) => b.id !== book.id)
    .slice(0, 4);

  const discountedTotal = book.discountPrice
    ? book.discountPrice * quantity
    : book.price * quantity;

  const savings = book.discountPrice ? (book.price - book.discountPrice) * quantity : 0;

  const inWishlist = isInWishlist(book.id);

  const b = book;

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: b.id,
        title: b.title,
        author: b.author.penName,
        price: b.discountPrice || b.price,
        cover: b.coverImage,
      });
    }
  }

  function handleWishlist() {
    toggleItem({
      id: b.id,
      title: b.title,
      author: b.author.penName,
      price: b.price,
      cover: b.coverImage,
      slug: b.slug,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#D8B27A] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/books" className="hover:text-[#D8B27A] transition-colors">Books</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/books?category=${book.category.slug}`} className="hover:text-[#D8B27A] transition-colors">
          {book.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1D1D1D] font-medium truncate max-w-[200px]">{book.title}</span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left Column */}
        <div className="flex-1 min-w-0">
          {/* Book Cover + Info */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-shrink-0"
            >
              <div className="w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 book-shadow">
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              <Badge className="bg-[#F2D8BE] text-[#8A6A4A] border-0 mb-3">
                {book.category.icon} {book.category.name}
              </Badge>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] mb-2 leading-tight">
                {book.title}
              </h1>

              <Link
                href={`/authors/${book.author.slug}`}
                className="text-[#8A6A4A] hover:text-[#D8B27A] font-medium text-lg transition-colors"
              >
                {book.author.penName}
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.round(book.averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-[#1D1D1D]">{book.averageRating}</span>
                <span className="text-sm text-gray-400">({book.totalReviews.toLocaleString()} reviews)</span>
              </div>

              <p className="text-sm text-gray-400 mt-1">
                {book.totalSales.toLocaleString()} copies sold
              </p>

              {/* Description */}
              <p className="text-gray-600 mt-4 leading-relaxed text-sm sm:text-base">
                {book.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {book.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-600 text-xs border-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="border border-[#E8DDD0] rounded-2xl overflow-hidden bg-white">
            <div className="flex border-b border-[#E8DDD0]">
              {(["description", "details", "reviews"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors",
                    activeTab === tab
                      ? "text-[#D8B27A] border-b-2 border-[#D8B27A] bg-[#F2D8BE]/20"
                      : "text-gray-500 hover:text-[#1D1D1D]"
                  )}
                >
                  {tab} {tab === "reviews" && `(${book.totalReviews})`}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {/* Description Tab */}
              {activeTab === "description" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4"
                >
                  <p>{book.description}</p>
                  <p>
                    This book is a must-read for anyone looking to deepen their understanding of{" "}
                    {book.tags[0] || "the subject"}. With practical insights and real-world examples,
                    {book.author.penName} delivers a comprehensive guide that is both informative and
                    engaging.
                  </p>
                  <p>
                    Whether you are a beginner or an experienced professional, this book offers valuable
                    perspectives that will change the way you think about {book.tags[0] || "the topic"}.
                    Each chapter builds on the previous one, creating a cohesive journey from foundational
                    concepts to advanced strategies.
                  </p>
                  <blockquote className="border-l-4 border-[#D8B27A] pl-4 italic text-gray-500">
                    &ldquo;A brilliant work that combines deep knowledge with practical application.
                    Highly recommended.&rdquo;
                  </blockquote>
                </motion.div>
              )}

              {/* Details Tab */}
              {activeTab === "details" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {[
                    { label: "Format", value: book.format },
                    { label: "Pages", value: book.pageCount },
                    { label: "Language", value: book.language },
                    { label: "Publisher", value: book.publisher },
                    { label: "Publication Date", value: new Date(book.publicationDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                    { label: "ISBN", value: book.isbn },
                    { label: "Category", value: book.category.name },
                    { label: "Author", value: book.author.name },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-[#E8DDD0] last:border-0">
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span className="text-sm font-medium text-[#1D1D1D]">{item.value}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Rating Distribution */}
                  <div className="flex flex-col sm:flex-row gap-6 mb-8">
                    <div className="text-center sm:text-left sm:pr-6 sm:border-r sm:border-[#E8DDD0]">
                      <div className="text-5xl font-bold text-[#1D1D1D]">{book.averageRating}</div>
                      <div className="flex items-center justify-center sm:justify-start gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.round(book.averageRating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{book.totalReviews.toLocaleString()} reviews</p>
                    </div>

                    <div className="flex-1 space-y-2">
                      {ratingDistribution.map((dist) => (
                        <div key={dist.stars} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-8">{dist.stars} star</span>
                          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${dist.percent}%` }}
                              transition={{ duration: 0.8, delay: (5 - dist.stars) * 0.1 }}
                              className="h-full bg-amber-400 rounded-full"
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{dist.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-4">
                    {sampleReviews.map((review, idx) => (
                      <div key={idx} className="p-4 bg-[#F2D8BE]/10 rounded-xl border border-[#E8DDD0]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#D8B27A] flex items-center justify-center text-white text-xs font-bold">
                              {review.name[0]}
                            </div>
                            <span className="text-sm font-medium text-[#1D1D1D]">{review.name}</span>
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sticky Purchase Card */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white border border-[#E8DDD0] rounded-2xl p-5 shadow-sm"
            >
              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#1D1D1D]">
                    {formatCurrency(book.discountPrice || book.price)}
                  </span>
                  {book.discountPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatCurrency(book.price)}
                      </span>
                      <Badge className="bg-[#D8B27A] text-white border-0 text-xs">
                        Save {formatCurrency(savings / quantity)}
                      </Badge>
                    </>
                  )}
                </div>
                {book.discountPrice && (
                  <p className="text-sm text-emerald-600 mt-1">
                    You save {formatCurrency(savings)} on {quantity} {quantity === 1 ? "copy" : "copies"}
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-5">
                <label className="text-sm font-medium text-[#1D1D1D] mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-[#E8DDD0] flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-12 text-center font-semibold text-[#1D1D1D]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border border-[#E8DDD0] flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-5">
                <Button
                  className="w-full bg-[#D8B27A] text-[#1D1D1D] hover:bg-[#c9a46a] font-semibold py-6 text-base"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart &mdash; {formatCurrency(discountedTotal)}
                </Button>

                <Button
                  className="w-full bg-[#1D1D1D] text-white hover:bg-[#333] font-semibold py-6 text-base"
                  onClick={handleAddToCart}
                >
                  Buy Now
                </Button>
              </div>

              <div className="flex gap-3 mb-5">
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 border-[#E8DDD0]",
                    inWishlist && "bg-red-50 border-red-200"
                  )}
                  onClick={handleWishlist}
                >
                  <Heart className={cn("w-4 h-4 mr-1.5", inWishlist && "fill-current text-red-500")} />
                  {inWishlist ? "Wishlisted" : "Wishlist"}
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-[#E8DDD0]"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.share) {
                      navigator.share({ title: book.title, url: window.location.href });
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-1.5" />
                  Share
                </Button>
              </div>

              {/* Book Meta */}
              <div className="border-t border-[#E8DDD0] pt-4 space-y-2.5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Book Details</h4>
                {[
                  { label: "Format", value: book.format },
                  { label: "Pages", value: book.pageCount },
                  { label: "Language", value: book.language },
                  { label: "Publisher", value: book.publisher },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-[#1D1D1D]">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1D]">
              Related Books in {book.category.name}
            </h2>
            <Link
              href={`/books?category=${book.category.slug}`}
              className="text-sm text-[#D8B27A] hover:underline font-medium"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {relatedBooks.map((relBook) => (
              <motion.div key={relBook.id} whileHover={{ y: -4 }} className="group">
                <Link href={`/books/${relBook.slug}`} className="block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-3">
                    <img
                      src={relBook.coverImage}
                      alt={relBook.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {relBook.discountPrice && (
                      <Badge className="absolute top-2 left-2 bg-[#D8B27A] text-white border-0 text-[10px]">
                        -{Math.round(((relBook.price - relBook.discountPrice) / relBook.price) * 100)}%
                      </Badge>
                    )}
                  </div>
                </Link>
                <Link href={`/books/${relBook.slug}`}>
                  <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                    {relBook.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">{relBook.author.penName}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < Math.round(relBook.averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">({relBook.totalReviews})</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold">{formatCurrency(relBook.discountPrice || relBook.price)}</span>
                  {relBook.discountPrice && (
                    <span className="text-xs text-gray-400 line-through">{formatCurrency(relBook.price)}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
