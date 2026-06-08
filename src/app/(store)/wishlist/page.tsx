"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowRight, BookOpen } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const moveToCart = (item: typeof items[0]) => {
    addItem({ id: item.id, title: item.title, author: item.author, price: item.price, cover: item.cover });
    removeItem(item.id);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-rose-300" />
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-3" style={{ fontFamily: "var(--font-libre)" }}>
            Your Wishlist Is Empty
          </h1>
          <p className="text-dark-gray/70 mb-8 max-w-md mx-auto">
            Save books you love to your wishlist and come back to them anytime.
          </p>
          <Link href="/books" className="inline-flex items-center gap-2 bg-[#EBC9A8] text-charcoal px-8 py-4 rounded-lg font-semibold hover:bg-[#D8B27A] hover:shadow-lg transition-all">
            <BookOpen className="h-5 w-5" /> Browse Books <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-libre)" }}>
            My Wishlist
          </h1>
          <p className="text-dark-gray/60 mt-1">{items.length} {items.length === 1 ? "book" : "books"} saved</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Image src={item.cover} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-charcoal text-sm truncate">{item.title}</h3>
                <p className="text-xs text-dark-gray/60 mt-1">{item.author}</p>
                <p className="text-lg font-bold text-charcoal mt-2">${item.price.toFixed(2)}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => moveToCart(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#EBC9A8] text-charcoal text-xs font-semibold rounded-lg hover:bg-[#D8B27A] transition-colors"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-2 border border-gray-200 text-dark-gray/60 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
