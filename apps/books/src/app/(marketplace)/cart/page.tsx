"use client";

import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import { Button, Badge } from "@/components/ui";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.1;
  const estimatedTax = subtotal * taxRate;
  const total = subtotal + estimatedTax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF6F1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-24 h-24 bg-[#E8DDD0] rounded-full flex items-center justify-center mb-8">
              <ShoppingBag className="w-12 h-12 text-[#8A6A4A]" />
            </div>
            <h1 className="text-3xl font-serif text-[#1D1D1D] mb-4">Your cart is empty</h1>
            <p className="text-[#8A6A4A] text-lg mb-8 max-w-md">
              Looks like you haven't added any books to your cart yet. Browse our collection to find your next great read.
            </p>
            <Link href="/books">
              <Button className="bg-[#D8B27A] hover:bg-[#c9a56d] text-[#1D1D1D] px-8 py-3 rounded-xl text-lg font-medium transition-all duration-200">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Books
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-serif text-[#1D1D1D]">Shopping Cart</h1>
              <Badge className="bg-[#D8B27A] text-[#1D1D1D] px-3 py-1 rounded-full text-sm font-medium">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Badge>
            </div>
            <button
              onClick={clearCart}
              className="text-[#8A6A4A] hover:text-[#D8B27A] text-sm font-medium transition-colors duration-200"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white border border-[#E8DDD0] rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="relative w-16 h-22 rounded-lg overflow-hidden bg-[#F2D8BE] flex-shrink-0">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-[#8A6A4A]" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-lg font-serif text-[#1D1D1D] truncate">
                            {item.title}
                          </h3>
                          <p className="text-[#8A6A4A] text-sm mt-1">
                            {item.author}
                          </p>
                        </div>
                        <p className="text-[#1D1D1D] font-semibold text-lg whitespace-nowrap">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded-lg border border-[#E8DDD0] flex items-center justify-center text-[#8A6A4A] hover:border-[#D8B27A] hover:text-[#D8B27A] transition-all duration-200"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-[#1D1D1D] font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-[#E8DDD0] flex items-center justify-center text-[#8A6A4A] hover:border-[#D8B27A] hover:text-[#D8B27A] transition-all duration-200"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-[#8A6A4A] hover:text-[#D8B27A] hover:bg-[#F2D8BE] rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-[#E8DDD0] sticky top-24"
              >
                <h2 className="text-xl font-serif text-[#1D1D1D] mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[#8A6A4A]">
                    <span>Subtotal</span>
                    <span className="text-[#1D1D1D]">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8A6A4A]">
                    <span>Estimated Tax (10%)</span>
                    <span className="text-[#1D1D1D]">{formatCurrency(estimatedTax)}</span>
                  </div>
                  <div className="border-t border-[#E8DDD0] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-serif text-[#1D1D1D]">Total</span>
                      <span className="text-xl font-bold text-[#1D1D1D]">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="block mt-6">
                  <Button className="w-full bg-[#1D1D1D] hover:bg-[#2D2D2D] text-white py-3 rounded-xl text-lg font-medium transition-all duration-200 flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link
                  href="/books"
                  className="flex items-center justify-center gap-2 mt-4 text-[#8A6A4A] hover:text-[#D8B27A] font-medium transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-6 border-t border-[#E8DDD0]">
                  <div className="flex items-center gap-3 text-[#8A6A4A] text-sm">
                    <div className="w-8 h-8 bg-[#F2D8BE] rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-[#8A6A4A]" />
                    </div>
                    <p>Free shipping on orders over $50</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
