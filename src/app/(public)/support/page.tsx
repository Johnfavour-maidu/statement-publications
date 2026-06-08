"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, BookOpen, User, CreditCard, DollarSign, Upload, Shield, Wrench, ShoppingCart,
  MessageCircle, Mail, Phone, HelpCircle, FileText, ArrowRight, ChevronRight,
} from "lucide-react";

const categories = [
  { icon: BookOpen, title: "Publishing Support", description: "Help with publishing your book", color: "bg-amber-50 text-amber-600" },
  { icon: User, title: "Account Support", description: "Manage your account settings", color: "bg-blue-50 text-blue-600" },
  { icon: CreditCard, title: "Payments", description: "Payment methods and billing", color: "bg-violet-50 text-violet-600" },
  { icon: DollarSign, title: "Royalties", description: "Earnings and payout information", color: "bg-emerald-50 text-emerald-600" },
  { icon: Upload, title: "Book Uploads", description: "Help uploading your manuscript", color: "bg-rose-50 text-rose-600" },
  { icon: Shield, title: "Author Verification", description: "Verify your author identity", color: "bg-indigo-50 text-indigo-600" },
  { icon: Wrench, title: "Technical Issues", description: "Report bugs or technical problems", color: "bg-orange-50 text-orange-600" },
  { icon: ShoppingCart, title: "Store Purchases", description: "Help with buying books", color: "bg-teal-50 text-teal-600" },
];

const contactOptions = [
  { icon: Mail, title: "Email Support", description: "Send us a message and we'll respond within 24 hours.", action: "Send Email", href: "mailto:support@statementpub.com" },
  { icon: MessageCircle, title: "Live Chat", description: "Chat with our support team in real-time.", action: "Start Chat", href: "#" },
  { icon: Phone, title: "Contact Form", description: "Fill out our contact form for detailed inquiries.", action: "Open Form", href: "/contact" },
  { icon: FileText, title: "Knowledge Base", description: "Browse our library of guides and tutorials.", action: "Browse Articles", href: "/blog" },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#FDF6EE] via-white to-white py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBC9A8]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D8B27A]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-charcoal leading-tight"
            style={{ fontFamily: "var(--font-libre)" }}
          >
            How Can We <span className="text-[#8A6A4A]">Help You?</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-lg text-dark-gray/60">
            Search our help center or browse categories below
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-gray/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent text-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-charcoal text-center mb-10" style={{ fontFamily: "var(--font-libre)" }}>
            Browse by Topic
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/support/${cat.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="group p-6 rounded-2xl border border-gray-100 hover:border-[#EBC9A8] hover:shadow-lg transition-all duration-300 h-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color}`}>
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-charcoal mb-1 group-hover:text-[#8A6A4A] transition-colors">{cat.title}</h3>
                    <p className="text-xs text-dark-gray/50">{cat.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#8A6A4A] opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 sm:py-20 bg-[#FDF6EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-charcoal text-center mb-10" style={{ fontFamily: "var(--font-libre)" }}>
            Get In Touch
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactOptions.map((opt, i) => (
              <motion.div
                key={opt.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-[#F2D8BE]/40 flex items-center justify-center mb-4">
                    <opt.icon className="h-6 w-6 text-[#8A6A4A]" />
                  </div>
                  <h3 className="text-sm font-bold text-charcoal mb-2">{opt.title}</h3>
                  <p className="text-xs text-dark-gray/50 mb-4 flex-1">{opt.description}</p>
                  <Link href={opt.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8A6A4A] hover:text-[#D8B27A] transition-colors">
                    {opt.action} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-charcoal text-center mb-10" style={{ fontFamily: "var(--font-libre)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: "How do I publish my book?", a: "Create an account, upload your manuscript, and follow our step-by-step publishing wizard. We'll guide you through formatting, cover design, and distribution." },
              { q: "How do royalties work?", a: "You earn royalties on every sale. Rates vary by format and distribution channel. You can track your earnings in real-time through your author dashboard." },
              { q: "Can I update my book after publishing?", a: "Yes! You can update your book's content, cover, description, and pricing at any time through your author dashboard." },
              { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards through Paystack, Flutterwave, and Stripe. Bank transfer options are also available." },
            ].map((faq, i) => (
              <details key={i} className="group border border-gray-100 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-semibold text-charcoal hover:bg-gray-50 transition-colors">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 text-dark-gray/40 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-dark-gray/70 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
