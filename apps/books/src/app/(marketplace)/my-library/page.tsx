"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library,
  BookOpen,
  Heart,
  Clock,
  Download,
  ChevronRight,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatCurrency, cn } from "@/lib/utils";

type TabId = "all" | "purchased" | "downloaded" | "favorites" | "collections";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "purchased", label: "Purchased", icon: ShoppingCart },
  { id: "downloaded", label: "Downloaded", icon: Download },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "collections", label: "Collections", icon: Library },
];

export default function MyLibraryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const { items: cartItems, addItem } = useCart();
  const { items: wishlistItems, removeItem: removeWishlist } = useWishlist();

  const purchasedCount = cartItems.length;
  const favoritesCount = wishlistItems.length;
  const collectionsCount = 0;
  const downloadedCount = 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2D8BE] flex items-center justify-center">
            <Library className="w-5 h-5 text-[#8A6A4A]" />
          </div>
          My Library
        </h1>
        <p className="text-gray-500 mt-2">
          Your personal collection of books and audiobooks
        </p>
      </div>

      {/* Summary Strip */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8DDD0] rounded-xl">
          <BookOpen className="w-4 h-4 text-[#8A6A4A]" />
          <span className="text-sm font-medium text-[#1D1D1D]">
            {purchasedCount} books in library
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8DDD0] rounded-xl">
          <Heart className="w-4 h-4 text-[#D8B27A]" />
          <span className="text-sm font-medium text-[#1D1D1D]">
            {favoritesCount} favorites
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8DDD0] rounded-xl">
          <Library className="w-4 h-4 text-[#8A6A4A]" />
          <span className="text-sm font-medium text-[#1D1D1D]">
            {collectionsCount} collections
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white border border-[#E8DDD0] rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                isActive
                  ? "bg-[#D8B27A] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#1D1D1D] hover:bg-gray-50"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* All Tab */}
          {activeTab === "all" && (
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 sm:p-10">
              <div className="text-center py-12">
                <BookOpen
                  className="w-20 h-20 text-gray-200 mx-auto mb-6"
                  strokeWidth={1}
                />
                <h2 className="text-2xl font-bold text-[#1D1D1D] mb-3">
                  Your library is empty
                </h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                  Start building your personal collection. Browse our catalog
                  and add books you love.
                </p>
                <Link href="/books">
                  <Button className="bg-[#D8B27A] hover:bg-[#c9a46a] text-[#1D1D1D] font-semibold px-10 py-6 text-base">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Browse Books
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Purchased Tab */}
          {activeTab === "purchased" && (
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 sm:p-10">
              {purchasedCount === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart
                    className="w-20 h-20 text-gray-200 mx-auto mb-6"
                    strokeWidth={1}
                  />
                  <h2 className="text-2xl font-bold text-[#1D1D1D] mb-3">
                    No purchased books yet
                  </h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                    When you purchase books, they&apos;ll appear here for easy
                    access.
                  </p>
                  <Link href="/books">
                    <Button className="bg-[#D8B27A] hover:bg-[#c9a46a] text-[#1D1D1D] font-semibold px-10 py-6 text-base">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Browse Books
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">
                    Your Purchased Books
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        className="group"
                      >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-3">
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.author}
                        </p>
                        <p className="text-sm font-bold mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Downloaded Tab */}
          {activeTab === "downloaded" && (
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 sm:p-10">
              <div className="text-center py-12">
                <Download
                  className="w-20 h-20 text-gray-200 mx-auto mb-6"
                  strokeWidth={1}
                />
                <h2 className="text-2xl font-bold text-[#1D1D1D] mb-3">
                  No downloaded books yet
                </h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                  Download your purchased books for offline reading. They&apos;ll
                  be available right here.
                </p>
                <Link href="/books">
                  <Button className="bg-[#D8B27A] hover:bg-[#c9a46a] text-[#1D1D1D] font-semibold px-10 py-6 text-base">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Browse Books
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 sm:p-10">
              {favoritesCount === 0 ? (
                <div className="text-center py-12">
                  <Heart
                    className="w-20 h-20 text-gray-200 mx-auto mb-6"
                    strokeWidth={1}
                  />
                  <h2 className="text-2xl font-bold text-[#1D1D1D] mb-3">
                    No favorites yet
                  </h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                    Save books to your favorites for quick access later.
                  </p>
                  <Link href="/books">
                    <Button className="bg-[#D8B27A] hover:bg-[#c9a46a] text-[#1D1D1D] font-semibold px-10 py-6 text-base">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Browse Books
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">
                    Your Favorites
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {wishlistItems.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        className="group"
                      >
                        <Link
                          href={`/books/${item.slug}`}
                          className="block"
                        >
                          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-3">
                            <img
                              src={item.cover}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>

                        <Link href={`/books/${item.slug}`}>
                          <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.author}
                        </p>
                        <p className="text-sm font-bold text-[#1D1D1D] mt-1">
                          {formatCurrency(item.price)}
                        </p>

                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="flex-1 bg-[#1D1D1D] text-white hover:bg-[#333] text-xs"
                            onClick={() =>
                              addItem({
                                id: item.id,
                                title: item.title,
                                author: item.author,
                                price: item.price,
                                cover: item.cover,
                              })
                            }
                          >
                            <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                            Add to Cart
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 border-[#E8DDD0] text-gray-400 hover:text-red-500 hover:border-red-300"
                            onClick={() => removeWishlist(item.id)}
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Collections Tab */}
          {activeTab === "collections" && (
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 sm:p-10">
              <div className="text-center py-12">
                <Library
                  className="w-20 h-20 text-gray-200 mx-auto mb-6"
                  strokeWidth={1}
                />
                <h2 className="text-2xl font-bold text-[#1D1D1D] mb-3">
                  Create your first collection
                </h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                  Organize your books into custom collections. Group by genre,
                  mood, or reading list.
                </p>
                <Button
                  className="bg-[#D8B27A] hover:bg-[#c9a46a] text-[#1D1D1D] font-semibold px-10 py-6 text-base"
                  disabled
                >
                  <Library className="w-5 h-5 mr-2" />
                  Create Collection
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <p className="text-xs text-gray-400 mt-4">
                  Coming soon
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
