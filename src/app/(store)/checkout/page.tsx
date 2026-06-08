"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, CreditCard, Check, ChevronDown, Building2, Smartphone, Wallet } from "lucide-react";
import { useCart } from "@/context/cart-context";

const paymentMethods = [
  { id: "paystack", name: "Paystack", icon: "💳", description: "Pay with card, bank transfer, or USSD" },
  { id: "flutterwave", name: "Flutterwave", icon: "🌐", description: "Pay with card, bank, or mobile money" },
  { id: "stripe", name: "Stripe", icon: "💳", description: "Pay with Visa, Mastercard, or AMEX" },
  { id: "bank", name: "Bank Transfer", icon: "🏦", description: "Direct bank transfer" },
];

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [selectedPayment, setSelectedPayment] = useState("paystack");
  const [step, setStep] = useState(1);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold text-charcoal mb-3" style={{ fontFamily: "var(--font-libre)" }}>
            Your Cart Is Empty
          </h1>
          <p className="text-dark-gray/70 mb-8">Add some books before checking out.</p>
          <Link href="/books" className="inline-flex items-center gap-2 bg-[#EBC9A8] text-charcoal px-8 py-4 rounded-lg font-semibold hover:bg-[#D8B27A] transition-all">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-[#8A6A4A] hover:text-[#D8B27A] mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-libre)" }}>
            Checkout
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            {["Shipping", "Payment", "Review"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? "bg-[#D8B27A] text-charcoal" : step === i + 1 ? "bg-[#EBC9A8] text-charcoal" : "bg-gray-100 text-dark-gray/40"}`}>
                  {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium ${step === i + 1 ? "text-charcoal" : "text-dark-gray/40"}`}>{label}</span>
                {i < 2 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-charcoal mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-charcoal mb-1.5 block">First Name</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-charcoal mb-1.5 block">Last Name</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-1.5 block">Email</label>
                    <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-1.5 block">Phone</label>
                    <input type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent" />
                  </div>
                </div>

                <h2 className="text-lg font-bold text-charcoal mb-6 mt-8">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-1.5 block">Address</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-charcoal mb-1.5 block">City</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-charcoal mb-1.5 block">State</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-charcoal mb-1.5 block">ZIP Code</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent" />
                    </div>
                  </div>
                </div>

                <button onClick={() => setStep(2)} className="mt-6 w-full bg-[#EBC9A8] text-charcoal py-3.5 rounded-lg font-semibold hover:bg-[#D8B27A] transition-colors">
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-charcoal mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === method.id ? "border-[#EBC9A8] bg-[#FDF6EE]" : "border-gray-100 hover:border-gray-200"}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? "border-[#D8B27A]" : "border-gray-300"}`}>
                        {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[#D8B27A]" />}
                      </div>
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{method.name}</p>
                        <p className="text-xs text-dark-gray/50">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="px-6 py-3.5 border border-gray-200 rounded-lg font-semibold text-dark-gray/60 hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-[#EBC9A8] text-charcoal py-3.5 rounded-lg font-semibold hover:bg-[#D8B27A] transition-colors">
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-charcoal mb-6">Review Your Order</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-3 border-b border-gray-50 last:border-0">
                      <div className="relative w-14 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image src={item.cover} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-charcoal truncate">{item.title}</p>
                        <p className="text-xs text-dark-gray/50">{item.author}</p>
                        <p className="text-sm font-bold text-charcoal mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-[#FDF6EE] rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-[#8A6A4A]">
                    <Lock className="h-4 w-4" />
                    <span>Payment via <strong>{paymentMethods.find(m => m.id === selectedPayment)?.name}</strong></span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="px-6 py-3.5 border border-gray-200 rounded-lg font-semibold text-dark-gray/60 hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button className="flex-1 bg-[#D8B27A] text-charcoal py-3.5 rounded-lg font-bold hover:bg-[#EBC9A8] transition-colors flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4" /> Place Order — ${totalPrice.toFixed(2)}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-charcoal mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-10 h-14 rounded overflow-hidden bg-gray-100 shrink-0">
                      <Image src={item.cover} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-charcoal truncate">{item.title}</p>
                      <p className="text-[11px] text-dark-gray/50">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-charcoal">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-dark-gray/50">+{items.length - 3} more items</p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-dark-gray/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-gray/70">
                  <span>Shipping</span>
                  <span className="text-[#D8B27A] font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-bold text-charcoal">Total</span>
                  <span className="text-xl font-bold text-charcoal">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-dark-gray/50">
                  <Shield className="h-3.5 w-3.5 text-[#D8B27A]" /> Secure 256-bit SSL encryption
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-gray/50">
                  <Lock className="h-3.5 w-3.5 text-[#D8B27A]" /> Your payment info is safe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
