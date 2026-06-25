"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Clock,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Eye,
  Tag,
  Award,
  Star,
  BookMarked,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  books,
  categories,
  getFeaturedBooks,
  getBestsellerBooks,
  getNewReleases,
  getPreOrderBooks,
  getDealsBooks,
  getBooksByCollection,
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
const trending = getBooksByCollection("trending");
const mostWishlisted = getBooksByCollection("most-wishlisted");
const staffPicks = getBooksByCollection("staff-picks");
const bookClub = getBooksByCollection("book-club");

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

const storeCategories = [
  "All",
  "Business",
  "Personal Finance",
  "Self Development",
  "Leadership",
  "Technology",
  "Education",
  "Religion",
  "Politics",
  "History",
  "Science",
  "Health",
  "Biography",
  "Fiction",
  "Non-Fiction",
  "Romance",
  "Mystery",
  "Fantasy",
  "African Literature",
];

const categorySlugMap: Record<string, string> = {
  All: "",
  Business: "business-entrepreneurship",
  "Personal Finance": "personal-finance",
  "Self Development": "self-development",
  Leadership: "leadership",
  Technology: "technology",
  Education: "education",
  Religion: "religion-inspiration",
  Politics: "politics",
  History: "history",
  Science: "science",
  Health: "health-wellness",
  Biography: "biography",
  Fiction: "fiction",
  "Non-Fiction": "non-fiction",
  Romance: "romance",
  Mystery: "mystery",
  Fantasy: "fantasy",
  "African Literature": "african-literature",
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
      className="flex-shrink-0 w-[150px] sm:w-[170px] lg:w-[180px] group cursor-pointer"
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
              {Math.round(
                ((book.price - book.discountPrice) / book.price) * 100
              )}
              % OFF
            </Badge>
          )}
          {book.isPreOrder && (
            <Badge className="absolute top-2 left-2 bg-[#D8B27A] text-white border-0 text-[10px] px-1.5 py-0">
              Pre-order
            </Badge>
          )}
          {book.isNew && !book.discountPrice && !book.isPreOrder && (
            <Badge className="absolute top-2 left-2 bg-emerald-500 text-white border-0 text-[10px] px-1.5 py-0">
              New
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
  icon: Icon,
}: {
  title?: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  items: DemoBook[];
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const { scrollRef, scrollLeft, scrollRight } = useCarouselScroll();
  if (items.length === 0) return null;
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
    <section className="relative overflow-hidden bg-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #FDF6EE 0%, #ffffff 40%, #F5E6D3 100%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
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
                  <Link href={`/books/${book.slug}`}>
                    <Button
                      size="lg"
                      className="bg-[#1D1D1D] text-white hover:bg-[#333] px-6"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Browse Books
                    </Button>
                  </Link>
                  <Link href={`/books/${book.slug}`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#E8DDD0] hover:bg-[#F5EDE3] px-6"
                    >
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
                <div className="w-52 sm:w-60 lg:w-72 aspect-[3/4] rounded-2xl overflow-hidden book-shadow">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// Category Pills Section
function CategoryPills() {
  const [active, setActive] = useState("All");
  const pillScroll = useCarouselScroll();

  const filteredBooks =
    active === "All"
      ? books
      : books.filter(
          (b) => b.category.slug === categorySlugMap[active]
        );

  return (
    <section className="py-6 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={pillScroll.scrollRef}
          className="flex gap-2 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {storeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                active === cat
                  ? "bg-[#1D1D1D] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="pt-[152px]">
      {/* SECTION 1: Hero Slider */}
      <HeroSlider />

      {/* Category Pills */}
      <CategoryPills />

      {/* SECTION 2: Top Books with Category Tabs */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
                Top Books
              </h2>
              <p className="text-gray-500 mt-1">
                Discover our most popular titles
              </p>
            </div>
            <Link
              href="/books"
              className="flex items-center gap-1 text-sm font-medium text-[#D8B27A] hover:underline"
            >
              See Full List <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <CarouselSection title="Top Books" items={books.slice(0, 20)} />
        </div>
      </section>

      {/* SECTION 3: New Releases */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#D8B27A]" />
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

      {/* SECTION 4: Best Sellers */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#D8B27A]" />
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
          <CarouselSection items={bestsellers} />
        </div>
      </section>

      {/* SECTION 5: Trending This Week */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#D8B27A]" />
                Trending This Week
              </h2>
              <p className="text-gray-500 mt-1">What everyone is reading</p>
            </div>
          </div>
          <CarouselSection items={trending} />
        </div>
      </section>

      {/* SECTION 6: Most Wishlisted */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-2">
                <BookMarked className="w-6 h-6 text-[#D8B27A]" />
                Most Wishlisted
              </h2>
              <p className="text-gray-500 mt-1">
                Books our readers can&apos;t wait to read
              </p>
            </div>
          </div>
          <CarouselSection items={mostWishlisted} />
        </div>
      </section>

      {/* SECTION 7: Pre-Orders */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#D8B27A]" />
                Pre-Orders
              </h2>
              <p className="text-gray-500 mt-1">Coming soon to our shelves</p>
            </div>
          </div>
          <CarouselSection items={preOrderBooks} />
        </div>
      </section>

      {/* SECTION 8: Books Under $5 */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-2">
                <Tag className="w-6 h-6 text-[#D8B27A]" />
                Books Under $5
              </h2>
              <p className="text-gray-500 mt-1">Great reads, great prices</p>
            </div>
          </div>
          <CarouselSection items={booksUnder5} />
        </div>
      </section>

      {/* SECTION 9: Books Under $10 */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-2">
                <Tag className="w-6 h-6 text-[#D8B27A]" />
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

      {/* SECTION 10: Staff Recommendations */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-2">
                <Star className="w-6 h-6 text-[#D8B27A]" />
                Staff Recommendations
              </h2>
              <p className="text-gray-500 mt-1">
                Hand-picked by our editorial team
              </p>
            </div>
          </div>
          <CarouselSection items={staffPicks} />
        </div>
      </section>

      {/* SECTION 11: Editor's Picks */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-2">
                <Award className="w-6 h-6 text-[#D8B27A]" />
                Editor&apos;s Picks
              </h2>
              <p className="text-gray-500 mt-1">
                Exceptional books you shouldn&apos;t miss
              </p>
            </div>
          </div>
          <CarouselSection items={editorsPicks} />
        </div>
      </section>

      {/* SECTION 12: Book Club Picks */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-2">
                <Users className="w-6 h-6 text-[#D8B27A]" />
                Book Club Picks
              </h2>
              <p className="text-gray-500 mt-1">
                Perfect for group discussions
              </p>
            </div>
          </div>
          <CarouselSection items={bookClub} />
        </div>
      </section>

      {/* SECTION 13: African Authors Collection */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
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

      {/* SECTION 14: Indie Authors Spotlight */}
      <section className="py-12 lg:py-16">
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

      {/* SECTION 15: BookTok Inspired Reads */}
      <section className="py-12 lg:py-16 bg-[#FDF6EE]/30">
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

      {/* SECTION 16: Recently Added */}
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
    </div>
  );
}
