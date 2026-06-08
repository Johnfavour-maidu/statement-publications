"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <div className="w-24 h-24 bg-[#F2D8BE]/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-[#8A6A4A]" />
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-3" style={{ fontFamily: "var(--font-libre)" }}>
            Your Cart Is Empty
          </h1>
          <p className="text-dark-gray/70 mb-8 max-w-md mx-auto">
            Discover books from independent authors and add your favorites to your cart.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 bg-[#EBC9A8] text-charcoal px-8 py-4 rounded-lg font-semibold hover:bg-[#D8B27A] hover:shadow-lg transition-all"
          >
            <BookOpen className="h-5 w-5" /> Browse Books <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-libre)" }}>
                Shopping Cart
              </h1>
              <p className="text-dark-gray/60 mt-1">{totalItems} {totalItems === 1 ? "item" : "items"} in your cart</p>
            </div>
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 flex gap-4 sm:gap-6"
              >
                <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-charcoal text-base sm:text-lg truncate">{item.title}</h3>
                  <p className="text-sm text-dark-gray/60 mt-0.5">{item.author}</p>
                  {item.format && (
                    <span className="inline-block mt-2 text-xs bg-[#F2D8BE]/40 text-[#8A6A4A] px-2 py-0.5 rounded-full font-medium">
                      {item.format}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-3 sm:mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-semibold text-charcoal">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-charcoal">${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-charcoal mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-dark-gray/70">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-charcoal">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-gray/70">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-charcoal">Total</span>
                  <span className="text-xl font-bold text-charcoal">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#EBC9A8] text-charcoal px-6 py-3.5 rounded-lg font-semibold hover:bg-[#D8B27A] hover:shadow-lg transition-all"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/books"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 text-sm text-[#8A6A4A] hover:text-[#D8B27A] font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </Link>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3 text-center text-xs text-dark-gray/50">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 text-sm">&#10003;</span>
                  </div>
                  Secure Checkout
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm">&#10003;</span>
                  </div>
                  Instant Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
