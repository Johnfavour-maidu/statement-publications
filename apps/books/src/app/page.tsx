import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Search, ArrowRight, Star, TrendingUp, Clock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover Your Next Great Read",
  description: "Browse thousands of books across every genre. From bestsellers to hidden gems, find your perfect book.",
};

const featuredCategories = [
  { name: "Fiction", slug: "fiction", count: 245, image: "📖" },
  { name: "Non-Fiction", slug: "non-fiction", count: 189, image: "📚" },
  { name: "Academic", slug: "academic", count: 134, image: "🎓" },
  { name: "Children", slug: "children", count: 98, image: "🧒" },
  { name: "Poetry", slug: "poetry", count: 67, image: "🪶" },
  { name: "Biography", slug: "biography", count: 112, image: "👤" },
];

export default function HomePage() {
  return (
    <div className="pt-[116px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FDF6EE 0%, #ffffff 50%, #F5E6D3 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: "linear-gradient(135deg, #EBC9A8 0%, #F2D8BE 100%)", color: "#1D1D1D" }}>
              <Sparkles className="w-4 h-4" />
              Discover Amazing Books
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-tight">
              Find Your Next
              <br />
              <span className="text-gradient">Great Read</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse thousands of books from talented authors around the world. 
              From bestsellers to hidden gems, your perfect book awaits.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <div className="relative p-[2px] rounded-xl" style={{ background: "linear-gradient(135deg, #EBC9A8 0%, #D8B27A 50%, #F2D8BE 100%)" }}>
                <div className="bg-white rounded-xl flex items-center">
                  <Search className="w-5 h-5 text-gray-400 ml-4" />
                  <input
                    type="text"
                    placeholder="Search books, authors, or topics..."
                    className="flex-1 px-4 py-4 text-sm bg-transparent focus:outline-none"
                  />
                  <Link href="/books" className="px-6 py-4 text-sm font-semibold text-white rounded-xl m-0.5" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 100%)" }}>
                    Search
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/books?sort=trending" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D8B27A] transition-colors">
                <TrendingUp className="w-4 h-4" />
                Trending Now
              </Link>
              <Link href="/books?sort=newest" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D8B27A] transition-colors">
                <Clock className="w-4 h-4" />
                New Releases
              </Link>
              <Link href="/books?filter=bestsellers" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D8B27A] transition-colors">
                <Star className="w-4 h-4" />
                Bestsellers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">Browse Categories</h2>
              <p className="text-gray-500 mt-1">Explore books by genre</p>
            </div>
            <Link href="/categories" className="flex items-center gap-1 text-sm font-medium text-[#D8B27A] hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group p-6 rounded-xl border border-gray-100 hover:border-[#EBC9A8] hover:shadow-lg transition-all text-center"
              >
                <span className="text-3xl block mb-3">{cat.image}</span>
                <h3 className="font-semibold text-charcoal group-hover:text-[#D8B27A] transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.count} books</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Placeholder */}
      <section className="py-16 lg:py-20" style={{ background: "linear-gradient(180deg, #FDF6EE 0%, #ffffff 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">Featured Books</h2>
              <p className="text-gray-500 mt-1">Handpicked selections for you</p>
            </div>
            <Link href="/books" className="flex items-center gap-1 text-sm font-medium text-[#D8B27A] hover:underline">
              Browse All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group">
                <div className="aspect-[3/4] rounded-xl bg-gray-100 mb-3 book-shadow overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <BookOpen className="w-12 h-12" />
                  </div>
                </div>
                <h3 className="font-semibold text-charcoal text-sm group-hover:text-[#D8B27A] transition-colors line-clamp-1">
                  Book Title {i}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Author Name</p>
                <p className="text-sm font-bold mt-1" style={{ color: "#D8B27A" }}>$12.99</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative p-[2px] rounded-2xl" style={{ background: "linear-gradient(135deg, #EBC9A8 0%, #D8B27A 50%, #F2D8BE 100%)" }}>
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal mb-4">
                Are You an Author?
              </h2>
              <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                Publish your book with Statement Publications and reach readers worldwide.
              </p>
              <Link
                href="https://statement-publications.vercel.app"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 100%)" }}
              >
                Start Publishing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
