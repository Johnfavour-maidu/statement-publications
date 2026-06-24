"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const moveToCart = (item: (typeof items)[number]) => {
    addItem({
      id: item.id,
      title: item.title,
      author: item.author,
      price: item.price,
      cover: item.cover,
    });
    removeItem(item.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] flex items-center gap-3">
          My Wishlist
          {items.length > 0 && (
            <Badge className="bg-[#D8B27A] text-white border-0 text-sm font-medium px-2.5 py-0.5">
              {items.length} {items.length === 1 ? "item" : "items"}
            </Badge>
          )}
        </h1>
        <p className="text-gray-500 mt-1">Books you love, saved for later</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-xl font-semibold text-[#1D1D1D] mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Browse our collection and save the books you love for later.
          </p>
          <Link href="/books">
            <Button className="bg-[#D8B27A] hover:bg-[#c9a46a] text-[#1D1D1D] font-semibold px-8">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Books
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-xl p-3 border border-[#E8DDD0]/60 shadow-sm hover:shadow-lg transition-shadow"
            >
              <Link href={`/books/${item.slug}`} className="block">
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
              <p className="text-xs text-gray-400 mt-0.5">{item.author}</p>
              <p className="text-sm font-bold text-[#1D1D1D] mt-1">
                {formatCurrency(item.price)}
              </p>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="flex-1 bg-[#1D1D1D] text-white hover:bg-[#333] text-xs"
                  onClick={() => moveToCart(item)}
                >
                  <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                  Add to Cart
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-[#E8DDD0] text-gray-400 hover:text-red-500 hover:border-red-300"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
