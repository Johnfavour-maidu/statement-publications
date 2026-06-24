"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Star, Clock, TrendingUp, Sparkles, ChevronLeft, ChevronRight, BookOpen, ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { books, categories, getFeaturedBooks, getBestsellerBooks, getNewReleases } from "@/lib/demo-data";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatCurrency, cn } from "@/lib/utils";

const featuredBooks = getFeaturedBooks();
const bestsellers = getBestsellerBooks();
const newReleases = getNewReleases();

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();
  const { addItem: addWishlist, isInWishlist } = useWishlist();

  const next = useCallback(() => setCurrent((c) => (c + 1) % featuredBooks.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + featuredBooks.length) % featuredBooks.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const book = featuredBooks[current];
  if (!book) return null;

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FDF6EE 0%, #ffffff 50%, #F5E6D3 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <Badge className="mb-4 bg-[#D8B27A]/10 text-[#8A6A4A] border-[#D8B27A]/20 px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Featured Book
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D1D1D] leading-tight mb-3">
                  {book.title}
                </h1>
                <p className="text-sm text-[#8A6A4A] font-medium mb-3">by {book.author.penName}</p>
                <p className="text-gray-600 mb-6 line-clamp-3 max-w-lg">{book.description}</p>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("h-4 w-4", i < Math.round(book.averageRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({book.totalReviews} reviews)</span>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-[#1D1D1D]">{formatCurrency(book.discountPrice || book.price)}</span>
                  {book.discountPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">{formatCurrency(book.price)}</span>
                      <Badge className="bg-red-50 text-red-600 border-0">{Math.round(((book.price - book.discountPrice) / book.price) * 100)}% OFF</Badge>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-[#1D1D1D] text-white hover:bg-[#333] px-6" onClick={() => addItem({ id: book.id, title: book.title, author: book.author.penName, price: book.discountPrice || book.price, cover: book.coverImage })}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button size="lg" variant="outline" className="border-[#E8DDD0] hover:bg-[#F5EDE3] px-6" onClick={() => addWishlist({ id: book.id, title: book.title, author: book.author.penName, price: book.price, cover: book.coverImage, slug: book.slug })}>
                    <Heart className={cn("w-4 h-4 mr-2", isInWishlist(book.id) && "fill-current")} />
                    {isInWishlist(book.id) ? "Wishlisted" : "Wishlist"}
                  </Button>
                  <Link href={`/books/${book.slug}`}>
                    <Button size="lg" variant="ghost" className="px-6">
                      <Eye className="w-4 h-4 mr-2" />
                      Read Sample
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className="flex items-center gap-3 mt-8">
              <button onClick={prev} className="p-2 rounded-full border border-gray-200 hover:border-[#D8B27A] hover:bg-[#F5EDE3] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {featuredBooks.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} className={cn("h-1.5 rounded-full transition-all", i === current ? "w-6 bg-[#D8B27A]" : "w-1.5 bg-gray-300")} />
                ))}
              </div>
              <button onClick={next} className="p-2 rounded-full border border-gray-200 hover:border-[#D8B27A] hover:bg-[#F5EDE3] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Book Cover */}
          <div className="order-1 lg:order-2 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div className="w-56 sm:w-64 lg:w-72 aspect-[3/4] rounded-2xl overflow-hidden book-shadow">
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold">{book.averageRating}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="relative p-[2px] rounded-xl" style={{ background: "linear-gradient(135deg, #EBC9A8 0%, #D8B27A 50%, #F2D8BE 100%)" }}>
            <div className="bg-white rounded-xl flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, or topics..."
                className="flex-1 px-4 py-4 text-sm bg-transparent focus:outline-none"
                onKeyDown={(e) => { if (e.key === "Enter" && searchQuery) window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`; }}
              />
              <Link href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : "/books"} className="px-6 py-4 text-sm font-semibold text-white rounded-xl m-0.5" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 100%)" }}>
                Search
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link href="/books?sort=trending" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D8B27A] transition-colors">
            <TrendingUp className="w-4 h-4" /> Trending Now
          </Link>
          <Link href="/books?sort=newest" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D8B27A] transition-colors">
            <Clock className="w-4 h-4" /> New Releases
          </Link>
          <Link href="/books?filter=bestsellers" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D8B27A] transition-colors">
            <Star className="w-4 h-4" /> Bestsellers
          </Link>
        </div>
      </div>
    </section>
  );
}

function BookCardSection({ title, subtitle, linkText, linkHref, books: sectionBooks }: { title: string; subtitle: string; linkText: string; linkHref: string; books: typeof books }) {
  const { addItem } = useCart();
  const { addItem: addWishlist, isInWishlist } = useWishlist();

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">{title}</h2>
            <p className="text-gray-500 mt-1">{subtitle}</p>
          </div>
          <Link href={linkHref} className="flex items-center gap-1 text-sm font-medium text-[#D8B27A] hover:underline">
            {linkText} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {sectionBooks.slice(0, 5).map((book) => (
            <motion.div key={book.id} whileHover={{ y: -4 }} className="group">
              <Link href={`/books/${book.slug}`} className="block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-3">
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {book.discountPrice && (
                    <Badge className="absolute top-2 left-2 bg-[#D8B27A] text-white border-0 text-[10px]">
                      -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                    </Badge>
                  )}
                  {book.isBestseller && (
                    <Badge className="absolute top-2 right-2 bg-amber-500 text-white border-0 text-[10px]">Bestseller</Badge>
                  )}
                  <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm" onClick={(e) => { e.preventDefault(); addWishlist({ id: book.id, title: book.title, author: book.author.penName, price: book.price, cover: book.coverImage, slug: book.slug }); }}>
                      <Heart className={cn("h-3.5 w-3.5", isInWishlist(book.id) && "fill-current text-red-500")} />
                    </Button>
                    <Button size="icon" className="h-8 w-8 rounded-full" onClick={(e) => { e.preventDefault(); addItem({ id: book.id, title: book.title, author: book.author.penName, price: book.discountPrice || book.price, cover: book.coverImage }); }}>
                      <ShoppingCart className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Link>
              <Link href={`/books/${book.slug}`}>
                <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">{book.title}</h3>
              </Link>
              <p className="text-xs text-gray-400 mt-0.5">{book.author.penName}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} className={cn("h-3 w-3", i < Math.round(book.averageRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />)}</div>
                <span className="text-[10px] text-gray-400">({book.totalReviews})</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold">{formatCurrency(book.discountPrice || book.price)}</span>
                {book.discountPrice && <span className="text-xs text-gray-400 line-through">{formatCurrency(book.price)}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="pt-[116px]">
      <HeroSlider />

      {/* Categories */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">Browse Categories</h2>
              <p className="text-gray-500 mt-1">Explore books by genre</p>
            </div>
            <Link href="/categories" className="flex items-center gap-1 text-sm font-medium text-[#D8B27A] hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group p-5 rounded-xl border border-gray-100 hover:border-[#EBC9A8] hover:shadow-lg transition-all text-center">
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <h3 className="font-semibold text-[#1D1D1D] text-sm group-hover:text-[#D8B27A] transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.bookCount} books</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">Bestsellers</h2>
              <p className="text-gray-500 mt-1">Most popular books this month</p>
            </div>
            <Link href="/books?filter=bestsellers" className="flex items-center gap-1 text-sm font-medium text-[#D8B27A] hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {bestsellers.slice(0, 5).map((book, i) => (
              <BestsellerCard key={book.id} book={book} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* New Releases */}
      <BookCardSection title="New Releases" subtitle="Fresh off the press" linkText="Browse All" linkHref="/books?sort=newest" books={newReleases} />

      {/* Trending */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">Trending Now</h2>
              <p className="text-gray-500 mt-1">What readers are loving right now</p>
            </div>
            <Link href="/books?sort=trending" className="flex items-center gap-1 text-sm font-medium text-[#D8B27A] hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {books.sort((a, b) => b.totalSales - a.totalSales).slice(0, 5).map((book) => (
              <TrendingCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative p-[2px] rounded-2xl" style={{ background: "linear-gradient(135deg, #EBC9A8 0%, #D8B27A 50%, #F2D8BE 100%)" }}>
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] mb-4">Are You an Author?</h2>
              <p className="text-gray-500 mb-6 max-w-lg mx-auto">Publish your book with Statement Publications and reach readers worldwide.</p>
              <Link href="https://statement-publications.vercel.app" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 100%)" }}>
                Start Publishing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BestsellerCard({ book, rank }: { book: typeof books[0]; rank: number }) {
  const { addItem } = useCart();
  return (
    <motion.div whileHover={{ y: -4 }} className="group relative">
      <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-[#1D1D1D] text-white text-xs font-bold flex items-center justify-center">{rank}</div>
      <Link href={`/books/${book.slug}`} className="block">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-3">
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
      <Link href={`/books/${book.slug}`}><h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">{book.title}</h3></Link>
      <p className="text-xs text-gray-400 mt-0.5">{book.author.penName}</p>
      <div className="flex items-center gap-1 mt-1">
        <div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} className={cn("h-3 w-3", i < Math.round(book.averageRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />)}</div>
        <span className="text-[10px] text-gray-400">({book.totalReviews})</span>
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-sm font-bold">{formatCurrency(book.discountPrice || book.price)}</span>
        {book.discountPrice && <span className="text-xs text-gray-400 line-through">{formatCurrency(book.price)}</span>}
      </div>
      <Button size="sm" className="w-full mt-2 bg-[#1D1D1D] text-white hover:bg-[#333]" onClick={() => addItem({ id: book.id, title: book.title, author: book.author.penName, price: book.discountPrice || book.price, cover: book.coverImage })}>
        <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Add to Cart
      </Button>
    </motion.div>
  );
}

function TrendingCard({ book }: { book: typeof books[0] }) {
  const { addItem } = useCart();
  return (
    <motion.div whileHover={{ y: -4 }} className="group">
      <Link href={`/books/${book.slug}`} className="block">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-3">
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {book.discountPrice && <Badge className="absolute top-2 left-2 bg-[#D8B27A] text-white border-0 text-[10px]">-{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%</Badge>}
        </div>
      </Link>
      <Link href={`/books/${book.slug}`}><h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">{book.title}</h3></Link>
      <p className="text-xs text-gray-400 mt-0.5">{book.author.penName}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-sm font-bold">{formatCurrency(book.discountPrice || book.price)}</span>
        {book.discountPrice && <span className="text-xs text-gray-400 line-through">{formatCurrency(book.price)}</span>}
      </div>
      <Button size="sm" className="w-full mt-2 bg-[#1D1D1D] text-white hover:bg-[#333]" onClick={() => addItem({ id: book.id, title: book.title, author: book.author.penName, price: book.discountPrice || book.price, cover: book.coverImage })}>
        <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Add to Cart
      </Button>
    </motion.div>
  );
}
