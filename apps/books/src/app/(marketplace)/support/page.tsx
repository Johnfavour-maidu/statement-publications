"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Send,
  FileText,
  ChevronDown,
  Search,
  ShoppingCart,
  Download,
  Monitor,
  CreditCard,
  User,
  Heart,
  Gift,
  Pen,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle2,
  Upload,
  X,
  BookMarked,
  Settings,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const quickHelpCards = [
  { title: "Buying eBooks", description: "Learn how to browse and purchase books", icon: ShoppingCart, color: "bg-[#F2D8BE] text-[#8A6A4A]" },
  { title: "Downloading Books", description: "Access your purchased books offline", icon: Download, color: "bg-blue-50 text-blue-600" },
  { title: "Reading on Devices", description: "Read on any device, anywhere", icon: Monitor, color: "bg-emerald-50 text-emerald-600" },
  { title: "Payments & Refunds", description: "Payment methods and refund policy", icon: CreditCard, color: "bg-violet-50 text-violet-600" },
  { title: "Account Issues", description: "Password reset and account management", icon: User, color: "bg-amber-50 text-amber-600" },
  { title: "Wishlist & Library", description: "Organize your reading list", icon: Heart, color: "bg-rose-50 text-rose-600" },
  { title: "Gift Cards", description: "Send books as gifts to friends", icon: Gift, color: "bg-cyan-50 text-cyan-600" },
  { title: "Publishing With Statement", description: "Submit your manuscript for publishing", icon: Pen, color: "bg-[#F2D8BE] text-[#8A6A4A]" },
  { title: "Contact Support", description: "Get in touch with our team", icon: Headphones, color: "bg-indigo-50 text-indigo-600" },
];

const supportCategories = [
  { name: "Purchases", icon: ShoppingCart, count: 4 },
  { name: "Accounts", icon: User, count: 3 },
  { name: "Reading", icon: BookOpen, count: 3 },
  { name: "Publishing", icon: Pen, count: 3 },
  { name: "Payments", icon: CreditCard, count: 3 },
  { name: "Technical Issues", icon: Settings, count: 4 },
];

const faqs = [
  { question: "How do I buy an eBook?", answer: "Browse our catalog, select a book, and click 'Buy Now'. You can pay using credit/debit cards, bank transfer, or mobile money. After payment, the book is immediately added to your library.", category: "Purchases" },
  { question: "How do I download my purchased books?", answer: "Go to My Library, find the book you want to download, and click the download button. Books are available in EPUB and PDF formats for offline reading.", category: "Reading" },
  { question: "Can I read offline?", answer: "Yes! Once you download a book to your device, you can read it anytime without an internet connection. Our reading app supports full offline reading.", category: "Reading" },
  { question: "Can I read on multiple devices?", answer: "Absolutely. Your purchased books sync across all your devices. Read on your phone during your commute and pick up where you left off on your tablet at home.", category: "Reading" },
  { question: "How do refunds work?", answer: "We offer refunds within 14 days of purchase if you haven't downloaded the book. Contact our support team with your order number to initiate a refund.", category: "Payments" },
  { question: "How do I change my password?", answer: "Go to Account Settings > Security, click 'Change Password', enter your current password and new password, then save changes.", category: "Accounts" },
  { question: "How do I publish my own book?", answer: "Visit statement-cyan.vercel.app and create an author account. You can upload your manuscript, set pricing, and publish to our global marketplace.", category: "Publishing" },
  { question: "How do I contact support?", answer: "You can reach us via email at support@statement-publications.com, use the live chat feature (coming soon), or submit a support request using the form on this page.", category: "Accounts" },
  { question: "What payment methods are accepted?", answer: "We accept Visa, Mastercard, Verve, bank transfers, and mobile money (MTN, Airtel). All transactions are secured with industry-standard encryption.", category: "Payments" },
  { question: "How do gift cards work?", answer: "Purchase a gift card from our store, and the recipient will receive a unique code via email. They can redeem it for any book on our platform.", category: "Purchases" },
  { question: "How do I add books to my wishlist?", answer: "Click the heart icon on any book card or detail page to add it to your wishlist. Access your wishlist anytime from the header or My Library.", category: "Reading" },
  { question: "What file formats are supported?", answer: "We support EPUB, PDF, and MOBI formats. EPUB is recommended for the best reading experience across devices.", category: "Technical Issues" },
  { question: "How do I update my account information?", answer: "Go to Account Settings > Profile to update your name, email, phone number, and other personal information.", category: "Accounts" },
  { question: "Can I return a book after purchasing?", answer: "Books can be returned within 14 days of purchase if they haven't been downloaded. After download, sales are final unless there's a technical issue.", category: "Payments" },
  { question: "How do I write a review?", answer: "Navigate to the book's detail page, scroll to the Reviews section, and click 'Write a Review'. Rate the book and share your thoughts with other readers.", category: "Reading" },
  { question: "What is the reading app?", answer: "Our web-based reading app lets you read books directly in your browser. No installation required. It supports bookmarks, highlights, and adjustable font sizes.", category: "Technical Issues" },
  { question: "How do I manage notifications?", answer: "Go to Account Settings > Notifications to customize email alerts for new releases, deals, and account activity.", category: "Accounts" },
  { question: "Do you offer bulk purchasing?", answer: "Yes! We offer bulk discounts for organizations, schools, and book clubs. Contact our support team for custom pricing.", category: "Purchases" },
  { question: "How do I report an issue with a book?", answer: "If you find an error in a book (typos, formatting issues, wrong content), please contact support with the book title and a description of the issue.", category: "Technical Issues" },
  { question: "What are the system requirements?", answer: "Our platform works on any modern web browser (Chrome, Firefox, Safari, Edge) on desktop, tablet, or mobile. No app installation needed.", category: "Technical Issues" },
  { question: "How does the recommendation system work?", answer: "Our recommendations are based on your reading history, wishlist, and purchases. The more you use the platform, the better our suggestions become.", category: "Technical Issues" },
  { question: "Can I pre-order upcoming books?", answer: "Yes! Pre-order section on our homepage shows upcoming releases. You'll be charged immediately and receive the book on release day.", category: "Purchases" },
];

const contactMethods = [
  { icon: Mail, label: "Email Support", value: "support@statement-publications.com", detail: "Response within 24 hours", color: "bg-[#F2D8BE] text-[#8A6A4A]" },
  { icon: MessageSquare, label: "Live Chat", value: "Coming Soon", detail: "Instant support for urgent issues", color: "bg-blue-50 text-blue-600" },
  { icon: Phone, label: "Phone Support", value: "+234 800 123 4567", detail: "Mon-Fri, 9AM-6PM WAT", color: "bg-emerald-50 text-emerald-600" },
  { icon: Clock, label: "Support Hours", value: "Mon-Fri: 9AM-6PM WAT", detail: "Weekend: 10AM-4PM WAT", color: "bg-amber-50 text-amber-600" },
  { icon: Zap, label: "Average Response", value: "Under 4 hours", detail: "For priority requests", color: "bg-violet-50 text-violet-600" },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    description: "",
  });

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === null || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setForm({ name: "", email: "", category: "", subject: "", description: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FDF6EE 0%, #ffffff 50%, #F5E6D3 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                background:
                  "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 100%)",
              }}
            >
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D1D1D] mb-4">
              Support Centre
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
              We&apos;re here to help you with purchases, reading, accounts, and
              publishing enquiries.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div
                className="relative p-[2px] rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #EBC9A8 0%, #D8B27A 50%, #F2D8BE 100%)",
                }}
              >
                <div className="bg-white rounded-[10px] flex items-center">
                  <Search className="w-5 h-5 text-gray-400 ml-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for help..."
                    className="flex-1 px-4 py-4 text-sm bg-transparent focus:outline-none rounded-[10px]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1.5 mr-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {/* Quick Help Cards */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[#1D1D1D] mb-6">
            Quick Help
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickHelpCards.map((card) => (
              <motion.div
                key={card.title}
                variants={item}
                whileHover={{ y: -2 }}
                className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", card.color)}>
                  <card.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[#1D1D1D] text-sm group-hover:text-[#D8B27A] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Support Categories */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[#1D1D1D] mb-6">
            Support Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === null
                  ? "bg-[#1D1D1D] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              All Categories
            </button>
            {supportCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() =>
                  setActiveCategory(activeCategory === cat.name ? null : cat.name)
                }
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                  activeCategory === cat.name
                    ? "bg-[#1D1D1D] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.name}
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  activeCategory === cat.name
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-500"
                )}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1D1D1D]">
              Frequently Asked Questions
            </h2>
            <span className="text-sm text-gray-400">
              {filteredFaqs.length} question{filteredFaqs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No questions found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try a different search term or category
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <HelpCircle className="w-4 h-4 text-[#D8B27A] flex-shrink-0" />
                      <span className="text-sm font-semibold text-[#1D1D1D]">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ml-4",
                        expandedFaq === index && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pl-12">
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {faq.answer}
                          </p>
                          <div className="mt-3">
                            <Badge className="bg-[#F2D8BE]/50 text-[#8A6A4A] border-0 text-[10px]">
                              {faq.category}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#1D1D1D] mb-6">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactMethods.map((method) => (
              <div
                key={method.label}
                className="bg-white border border-gray-100 rounded-2xl p-5"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", method.color)}>
                  <method.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[#1D1D1D] text-sm">
                  {method.label}
                </h3>
                <p className="text-sm font-medium text-[#D8B27A] mt-1">
                  {method.value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{method.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ticket Form */}
        <section>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#1D1D1D] mb-2">
              Submit a Support Request
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Fill out the form below and our team will get back to you within
              24 hours.
            </p>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-semibold text-emerald-800 text-lg">
                  Request Submitted
                </h3>
                <p className="text-emerald-600 text-sm mt-1">
                  We&apos;ll get back to you within 24 hours. Check your email for
                  a confirmation.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">
                      Name
                    </label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Your full name"
                      required
                      className="rounded-xl border-gray-200 focus:border-[#D8B27A] focus:ring-[#D8B27A]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      required
                      className="rounded-xl border-gray-200 focus:border-[#D8B27A] focus:ring-[#D8B27A]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">
                      Category
                    </label>
                    <Select
                      value={form.category}
                      onValueChange={(value) =>
                        setForm({ ...form, category: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-gray-200 focus:border-[#D8B27A] focus:ring-[#D8B27A]/20">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportCategories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">
                      Subject
                    </label>
                    <Input
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      placeholder="Brief description of your issue"
                      required
                      className="rounded-xl border-gray-200 focus:border-[#D8B27A] focus:ring-[#D8B27A]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">
                    Description
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Provide as much detail as possible about your issue..."
                    rows={5}
                    required
                    className="rounded-xl border-gray-200 focus:border-[#D8B27A] focus:ring-[#D8B27A]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D1D1D] mb-1.5">
                    Attachment (optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#D8B27A] transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Drag & drop files here or{" "}
                      <span className="text-[#D8B27A] font-medium">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto rounded-xl px-8 py-3 text-sm font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 100%)",
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
