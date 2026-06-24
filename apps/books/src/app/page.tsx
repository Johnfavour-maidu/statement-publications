"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ShoppingCart,
  Heart,
  Eye,
  Headphones,
  Tag,
  Users,
  MessageSquare,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  books,
  categories,
  audiobooks,
  getFeaturedBooks,
  getBestsellerBooks,
  getNewReleases,
  getPreOrderBooks,
  getDealsBooks,
  getBooksByCollection,
  getBlogPosts,
  getFAQs,
} from "@/lib/demo-data";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatCurrency, cn } from "@/lib/utils";
import type { DemoBook } from "@/lib/demo-data";

const featuredBooks = getFeaturedBooks();
const bestsellers = getBestsellerBooks();
const newReleases = getNewReleases();
const preOrderBooks = getPreOrderBooks();
const dealsBooks = getDealsBooks();
const africanAuthors = getBooksByCollection("african-authors");
const indieAuthors = getBooksByCollection("indie");
const booktokReads = getBooksByCollection("booktok");
const editorsPicks = getBooksByCollection("editors-picks");
const blogPosts = getBlogPosts();
const faqs = getFAQs();

const booksUnder5 = dealsBooks.filter(
  (b) => (b.discountPrice || b.price) < 5
);
const booksUnder10 = dealsBooks.filter(
  (b) =>
    (b.discountPrice || b.price) < 10 &&
    (b.discountPrice || b.price) >= 5
);
const recentlyAdded = [...books]
  .sort(
    (a, b) =>
      new Date(b.publicationDate).getTime() -
      new Date(a.publicationDate).getTime()
  )
  .slice(0, 10);

const categoryTabs = [
  "Business",
  "Personal Finance",
  "Self Development",
  "Leadership",
  "Technology",
  "Education",
  "Religion",
  "Fiction",
  "Non-Fiction",
  "Health",
];

const categorySlugMap: Record<string, string> = {
  Business: "business-entrepreneurship",
  "Personal Finance": "personal-finance",
  "Self Development": "self-development",
  Leadership: "leadership",
  Technology: "technology",
  Education: "education",
  Religion: "religion-inspiration",
  Fiction: "fiction",
  "Non-Fiction": "non-fiction",
  Health: "health-wellness",
};

function useCarouselScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  }, []);
  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, []);
  return { scrollRef, scrollLeft, scrollRight };
}

function BookCard({ book }: { book: DemoBook }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="flex-shrink-0 w-[160px] sm:w-[180px] group cursor-pointer"
    >
      <Link href={`/books/${book.slug}`}>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-2.5">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {book.discountPrice && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 text-[10px] px-1.5 py-0">
              Sale
            </Badge>
          )}
          {book.isPreOrder && (
            <Badge className="absolute top-2 left-2 bg-[#D8B27A] text-white border-0 text-[10px] px-1.5 py-0">
              Pre-order
            </Badge>
          )}
        </div>
        <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{book.author.penName}</p>
        <div className="flex items-baseline gap-2 mt-1">
          {book.discountPrice ? (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(book.price)}
              </span>
              <span className="text-sm font-bold text-[#1D1D1D]">
                {formatCurrency(book.discountPrice)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-[#1D1D1D]">
              {formatCurrency(book.price)}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function CarouselSection({
  title,
  subtitle,
  linkText,
  linkHref,
  items,
}: {
  title?: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  items: DemoBook[];
}) {
  const { scrollRef, scrollLeft, scrollRight } = useCarouselScroll();
  return (
    <div className="relative group">
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// SECTION 1: Hero Slider
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();
  const { addItem: addWishlist, isInWishlist } = useWishlist();

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % featuredBooks.length),
    []
  );
  const prev = useCallback(
    () =>
      setCurrent(
        (c) => (c - 1 + featuredBooks.length) % featuredBooks.length
      ),
    []
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const book = featuredBooks[current];
  if (!book) return null;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #FDF6EE 0%, #ffffff 50%, #F5E6D3 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
                <p className="text-sm text-[#8A6A4A] font-medium mb-3">
                  by {book.author.penName}
                </p>
                <p className="text-gray-600 mb-6 line-clamp-3 max-w-lg">
                  {book.description}
                </p>

                <div className="flex items-center gap-3 mb-6">
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
                  <span className="text-sm text-gray-500">
                    ({book.totalReviews} reviews)
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-[#1D1D1D]">
                    {formatCurrency(book.discountPrice || book.price)}
                  </span>
                  {book.discountPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatCurrency(book.price)}
                      </span>
                      <Badge className="bg-red-50 text-red-600 border-0">
                        {Math.round(
                          ((book.price - book.discountPrice) /
                            book.price) *
                            100
                        )}
                        % OFF
                      </Badge>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="bg-[#1D1D1D] text-white hover:bg-[#333] px-6"
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
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#E8DDD0] hover:bg-[#F5EDE3] px-6"
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
                        "w-4 h-4 mr-2",
                        isInWishlist(book.id) && "fill-current"
                      )}
                    />
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

            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={prev}
                className="p-2 rounded-full border border-gray-200 hover:border-[#D8B27A] hover:bg-[#F5EDE3] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {featuredBooks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === current
                        ? "w-6 bg-[#D8B27A]"
                        : "w-1.5 bg-gray-300"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="p-2 rounded-full border border-gray-200 hover:border-[#D8B27A] hover:bg-[#F5EDE3] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

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
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold">
                    {book.averageRating}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div
            className="relative p-[2px] rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, #EBC9A8 0%, #D8B27A 50%, #F2D8BE 100%)",
            }}
          >
            <div className="bg-white rounded-xl flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, or topics..."
                className="flex-1 px-4 py-4 text-sm bg-transparent focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery)
                    window.location.href = `/search?q=${encodeURIComponent(
                      searchQuery
                    )}`;
                }}
              />
              <Link
                href={
                  searchQuery
                    ? `/search?q=${encodeURIComponent(searchQuery)}`
                    : "/books"
                }
                className="px-6 py-4 text-sm font-semibold text-white rounded-xl m-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 100%)",
                }}
              >
                Search
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link
            href="/books?sort=trending"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D8B27A] transition-colors"
          >
            <TrendingUp className="w-4 h-4" /> Trending Now
          </Link>
          <Link
            href="/books?sort=newest"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D8B27A] transition-colors"
          >
            <Clock className="w-4 h-4" /> New Releases
          </Link>
          <Link
            href="/books?filter=bestsellers"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D8B27A] transition-colors"
          >
            <Star className="w-4 h-4" /> Bestsellers
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Business");
  const tabScrollRef = useCarouselScroll();

  const tabFilteredBooks = books.filter(
    (b) => b.category.slug === categorySlugMap[activeTab]
  );

  const section2Scroll = useCarouselScroll();

  return (
    <div className="pt-[116px]">
      {/* SECTION 1: Hero Slider */}
      <HeroSlider />

      {/* SECTION 2: Top Books with Category Tabs */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                Top Books
              </h2>
            </div>
            <Link
              href="/books"
              className="flex items-center gap-1 text-sm font-medium text-[#D8B27A] hover:underline"
            >
              See Full List <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div
            ref={tabScrollRef.scrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth pb-4 mb-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === tab
                    ? "bg-[#1D1D1D] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <CarouselSection items={tabFilteredBooks} />
        </div>
      </section>

      {/* SECTION 3: Browse All Categories */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                Browse All Categories
              </h2>
              <p className="text-gray-500 mt-1">Explore books by genre</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all text-center"
              >
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <h3 className="font-semibold text-[#1D1D1D] text-sm group-hover:text-[#D8B27A] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {cat.bookCount} books
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: New Releases */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                New Releases
              </h2>
              <p className="text-gray-500 mt-1">Fresh off the press</p>
            </div>
            <Link
              href="/books?sort=newest"
              className="flex items-center gap-1 text-sm font-medium text-[#D8B27A] hover:underline"
            >
              See Full List <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <CarouselSection items={newReleases} />
        </div>
      </section>

      {/* SECTION 5: Best Sellers */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                Best Sellers
              </h2>
              <p className="text-gray-500 mt-1">Most popular this month</p>
            </div>
            <Link
              href="/books?filter=bestsellers"
              className="flex items-center gap-1 text-sm font-medium text-[#D8B27A] hover:underline"
            >
              See Full List <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative group">
            <button
              onClick={section2Scroll.scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div
              ref={section2Scroll.scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {bestsellers.map((book) => (
                <motion.div
                  key={book.id}
                  whileHover={{ y: -4 }}
                  className="flex-shrink-0 w-[160px] sm:w-[180px] group cursor-pointer"
                >
                  <Link href={`/books/${book.slug}`}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-2.5">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {book.discountPrice && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 text-[10px] px-1.5 py-0">
                          Sale
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {book.author.penName}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      {book.discountPrice ? (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(book.price)}
                          </span>
                          <span className="text-sm font-bold text-[#1D1D1D]">
                            {formatCurrency(book.discountPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-[#1D1D1D]">
                          {formatCurrency(book.price)}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <button
              onClick={section2Scroll.scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: Pre-Orders */}
      <PreOrderSection />

      {/* SECTION 7: Books Under $5 */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                Books Under $5
              </h2>
              <p className="text-gray-500 mt-1">Great reads, great prices</p>
            </div>
          </div>
          <CarouselSection items={booksUnder5} />
        </div>
      </section>

      {/* SECTION 8: Books Under $10 */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                Books Under $10
              </h2>
              <p className="text-gray-500 mt-1">
                Affordable picks under ten dollars
              </p>
            </div>
          </div>
          <CarouselSection items={booksUnder10} />
        </div>
      </section>

      {/* SECTION 9: African Authors Collection */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                African Authors Collection
              </h2>
              <p className="text-gray-500 mt-1">
                Stories from the continent
              </p>
            </div>
          </div>
          <CarouselSection items={africanAuthors} />
        </div>
      </section>

      {/* SECTION 10: Indie Authors Spotlight */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                Indie Authors Spotlight
              </h2>
              <p className="text-gray-500 mt-1">
                Discover independent voices
              </p>
            </div>
          </div>
          <CarouselSection items={indieAuthors} />
        </div>
      </section>

      {/* SECTION 11: BookTok Inspired Reads */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                BookTok Inspired Reads
              </h2>
              <p className="text-gray-500 mt-1">
                Trending on social media
              </p>
            </div>
          </div>
          <CarouselSection items={booktokReads} />
        </div>
      </section>

      {/* SECTION 12: Editor's Picks */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                Editor's Picks
              </h2>
              <p className="text-gray-500 mt-1">
                Hand-selected by our team
              </p>
            </div>
          </div>
          <CarouselSection items={editorsPicks} />
        </div>
      </section>

      {/* SECTION 13: Recently Added */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                Recently Added
              </h2>
              <p className="text-gray-500 mt-1">Just arrived in our store</p>
            </div>
          </div>
          <CarouselSection items={recentlyAdded} />
        </div>
      </section>

      {/* SECTION 14: Blog & Reading Resources */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                Blog & Reading Resources
              </h2>
              <p className="text-gray-500 mt-1">
                Tips, insights, and recommendations
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all"
              >
                <Badge className="mb-3 bg-[#D8B27A]/10 text-[#8A6A4A] border-0 text-[10px]">
                  {post.category}
                </Badge>
                <h3 className="text-sm font-semibold text-[#1D1D1D] group-hover:text-[#D8B27A] transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 15: FAQ */}
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mt-1">
              Everything you need to know
            </p>
          </div>
          <FAQSection />
        </div>
      </section>
    </div>
  );
}

function PreOrderSection() {
  const scroll = useCarouselScroll();
  return (
    <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
              Pre-Orders
            </h2>
            <p className="text-gray-500 mt-1">Coming soon to our shelves</p>
          </div>
        </div>
        <div className="relative group">
          <button
            onClick={scroll.scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            ref={scroll.scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {preOrderBooks.map((book) => (
              <motion.div
                key={book.id}
                whileHover={{ y: -4 }}
                className="flex-shrink-0 w-[160px] sm:w-[180px] group cursor-pointer"
              >
                <Link href={`/books/${book.slug}`}>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-2.5">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Badge className="absolute top-2 left-2 bg-[#D8B27A] text-white border-0 text-[10px] px-1.5 py-0">
                      Coming Soon
                    </Badge>
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-[10px] text-white bg-black/50 rounded px-1.5 py-0.5">
                        Expected: {book.publicationDate}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {book.author.penName}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-[#1D1D1D]">
                      {formatCurrency(book.price)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <button
            onClick={scroll.scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-gray-100 rounded-xl overflow-hidden"
        >
          <button
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-[#1D1D1D] pr-4">
              {faq.question}
            </span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 flex-shrink-0 transition-transform",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
