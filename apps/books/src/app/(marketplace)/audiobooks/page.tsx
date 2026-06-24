"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Headphones, ShoppingCart, Heart, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { audiobooks, categories } from "@/lib/demo-data";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatCurrency, cn } from "@/lib/utils";

const narratorColors: Record<string, string> = {
  "Marcus Webb": "bg-[#8A6A4A]",
  "David Okoye": "bg-[#2D5A3D]",
  "Amara Okafor": "bg-[#8A4A6A]",
  "Zainab Hassan": "bg-[#4A4A8A]",
  "Samuel Eze": "bg-[#5D3D6A]",
  "Rachel Green": "bg-[#3D5A6A]",
  "Daniel Okafor": "bg-[#6A3D5D]",
  "Fatima Al-Rashid": "bg-[#8B4513]",
  "Oscar Dube": "bg-[#2F4F4F]",
  "Michael Rivera": "bg-[#483D8B]",
  "Robert Kimani": "bg-[#556B2F]",
  "Aisha Bello": "bg-[#D8B27A]",
  "Linda Mensah": "bg-[#1D1D1D]",
  "Patrick Osei": "bg-[#4A6A8A]",
};

export default function AudiobooksPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { addItem } = useCart();
  const { addItem: addWishlist, isInWishlist } = useWishlist();

  const filteredAudiobooks = useMemo(() => {
    let result = [...audiobooks];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (ab) =>
          ab.title.toLowerCase().includes(q) ||
          ab.author.name.toLowerCase().includes(q) ||
          ab.narrator.toLowerCase().includes(q) ||
          ab.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter((ab) => ab.category.slug === selectedCategory);
    }

    return result;
  }, [search, selectedCategory]);

  const availableCategories = useMemo(() => {
    const catSlugs = new Set(audiobooks.map((ab) => ab.category.slug));
    return categories.filter((c) => catSlugs.has(c.slug));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2D8BE] flex items-center justify-center">
            <Headphones className="w-5 h-5 text-[#8A6A4A]" />
          </div>
          Audiobooks
        </h1>
        <p className="text-gray-500 mt-2">
          Listen to your favorite books anywhere
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search audiobooks, authors, narrators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-[#E8DDD0] bg-white"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0",
            !selectedCategory
              ? "bg-[#D8B27A] text-white"
              : "bg-white border border-[#E8DDD0] text-gray-600 hover:bg-gray-50"
          )}
        >
          All Audiobooks
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === cat.slug ? null : cat.slug
              )
            }
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0",
              selectedCategory === cat.slug
                ? "bg-[#D8B27A] text-white"
                : "bg-white border border-[#E8DDD0] text-gray-600 hover:bg-gray-50"
            )}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-400 mb-4">
        {filteredAudiobooks.length} audiobook
        {filteredAudiobooks.length !== 1 ? "s" : ""} found
      </p>

      {/* Audiobooks Grid */}
      {filteredAudiobooks.length === 0 ? (
        <div className="text-center py-24">
          <Headphones
            className="w-16 h-16 text-gray-300 mx-auto mb-6"
            strokeWidth={1.5}
          />
          <h2 className="text-xl font-semibold text-[#1D1D1D] mb-2">
            No audiobooks found
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Try adjusting your search or filter to find what you&apos;re looking
            for.
          </p>
          <Button
            variant="outline"
            className="border-[#E8DDD0]"
            onClick={() => {
              setSearch("");
              setSelectedCategory(null);
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredAudiobooks.map((audiobook, index) => (
            <motion.div
              key={audiobook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Link
                href={`/books/${audiobook.slug}`}
                className="block"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 book-shadow mb-3">
                  <img
                    src={audiobook.coverImage}
                    alt={audiobook.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Headphones Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-[#1D1D1D]/80 text-white border-0 text-[10px] backdrop-blur-sm gap-1">
                      <Headphones className="w-3 h-3" />
                      Audio
                    </Badge>
                  </div>

                  {audiobook.discountPrice && (
                    <Badge className="absolute top-2 right-2 bg-[#D8B27A] text-white border-0 text-[10px]">
                      -
                      {Math.round(
                        ((audiobook.price - audiobook.discountPrice) /
                          audiobook.price) *
                          100
                      )}
                      %
                    </Badge>
                  )}

                  {audiobook.isNew && (
                    <Badge className="absolute top-2 right-2 bg-emerald-500 text-white border-0 text-[10px]">
                      New
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
                          id: audiobook.id,
                          title: audiobook.title,
                          author: audiobook.author.penName,
                          price: audiobook.price,
                          cover: audiobook.coverImage,
                          slug: audiobook.slug,
                        });
                      }}
                    >
                      <Heart
                        className={cn(
                          "h-3.5 w-3.5",
                          isInWishlist(audiobook.id) &&
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
                          id: audiobook.id,
                          title: audiobook.title,
                          author: audiobook.author.penName,
                          price: audiobook.discountPrice || audiobook.price,
                          cover: audiobook.coverImage,
                        });
                      }}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Info */}
              <Link href={`/books/${audiobook.slug}`}>
                <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-[#D8B27A] transition-colors">
                  {audiobook.title}
                </h3>
              </Link>
              <p className="text-xs text-gray-400 mt-0.5">
                {audiobook.author.penName}
              </p>

              {/* Narrator */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold",
                    narratorColors[audiobook.narrator] || "bg-gray-400"
                  )}
                >
                  {audiobook.narrator[0]}
                </div>
                <span className="text-[11px] text-gray-400">
                  {audiobook.narrator}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1 mt-1">
                <Headphones className="w-3 h-3 text-[#8A6A4A]" />
                <span className="text-[11px] text-[#8A6A4A] font-medium">
                  {audiobook.duration}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < Math.round(audiobook.averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400">
                  ({audiobook.totalReviews})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold">
                  {formatCurrency(
                    audiobook.discountPrice || audiobook.price
                  )}
                </span>
                {audiobook.discountPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(audiobook.price)}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <Button
                size="sm"
                className="w-full mt-3 bg-[#1D1D1D] text-white hover:bg-[#333] text-xs"
                onClick={() =>
                  addItem({
                    id: audiobook.id,
                    title: audiobook.title,
                    author: audiobook.author.penName,
                    price: audiobook.discountPrice || audiobook.price,
                    cover: audiobook.coverImage,
                  })
                }
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                Add to Cart
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
