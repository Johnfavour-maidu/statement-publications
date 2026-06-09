"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ShoppingCart,
  DollarSign,
  Globe,
  LayoutDashboard,
  Layers,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Star,
  Quote,
  Mail,
  Pen,
  Upload,
  Palette,
  Rocket,
  Banknote,
  Users,
  BookMarked,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [isInView, target, duration]);

  return { count, ref };
}

const rotatingWords = ["Story", "Vision", "Legacy", "Masterpiece", "Voice", "Dream"];

const features = [
  {
    icon: BookOpen,
    title: "Publish Books",
    description:
      "Transform your manuscript into a professionally published book available to readers worldwide.",
    bg: "bg-amber-200",
    iconColor: "text-amber-800",
    iconBg: "bg-amber-300",
    border: "border-amber-300",
  },
  {
    icon: ShoppingCart,
    title: "Sell Books",
    description:
      "Set your own prices and sell directly to readers through our built-in marketplace.",
    bg: "bg-[#F2D8BE]",
    iconColor: "text-[#8A6A4A]",
    iconBg: "bg-[#F2D8BE]",
    border: "border-[#EBC9A8]",
  },
  {
    icon: DollarSign,
    title: "Earn Royalties",
    description:
      "Earn competitive royalties on every sale with transparent, timely payouts.",
    bg: "bg-blue-200",
    iconColor: "text-blue-800",
    iconBg: "bg-blue-300",
    border: "border-blue-300",
  },
  {
    icon: Globe,
    title: "Reach Global Readers",
    description:
      "Distribute your book across multiple platforms and reach millions of readers worldwide.",
    bg: "bg-rose-200",
    iconColor: "text-rose-800",
    iconBg: "bg-rose-300",
    border: "border-rose-300",
  },
  {
    icon: LayoutDashboard,
    title: "Author Dashboard",
    description:
      "Track sales, royalties, reviews, and reader engagement from one powerful dashboard.",
    bg: "bg-violet-200",
    iconColor: "text-violet-800",
    iconBg: "bg-violet-300",
    border: "border-violet-300",
  },
  {
    icon: Layers,
    title: "Digital Distribution",
    description:
      "Publish in multiple formats — eBook, paperback, and hardcover — with automatic distribution.",
    bg: "bg-teal-200",
    iconColor: "text-teal-800",
    iconBg: "bg-teal-300",
    border: "border-teal-300",
  },
];

const steps = [
  {
    icon: Pen,
    title: "Create Account",
    description: "Create account for free and set up your author profile in minutes.",
    bg: "bg-amber-200",
    iconColor: "text-amber-800",
    number: "text-amber-700",
    border: "border-amber-300",
  },
  {
    icon: Upload,
    title: "Upload Manuscript",
    description:
      "Upload your manuscript in any standard format. We accept DOCX, PDF, and more.",
    bg: "bg-[#F2D8BE]",
    iconColor: "text-[#8A6A4A]",
    number: "text-[#8A6A4A]",
    border: "border-[#EBC9A8]",
  },
  {
    icon: Palette,
    title: "Design Your Book",
    description:
      "Choose from professional templates or upload your own cover design.",
    bg: "bg-blue-200",
    iconColor: "text-blue-800",
    number: "text-blue-700",
    border: "border-blue-300",
  },
  {
    icon: Rocket,
    title: "Publish",
    description:
      "Review, preview, and hit publish. Your book goes live within 24 hours.",
    bg: "bg-rose-200",
    iconColor: "text-rose-800",
    number: "text-rose-700",
    border: "border-rose-300",
  },
  {
    icon: Banknote,
    title: "Earn Royalties",
    description:
      "Start earning competitive royalties on every sale with weekly payouts.",
    bg: "bg-violet-200",
    iconColor: "text-violet-800",
    number: "text-violet-700",
    border: "border-violet-300",
  },
];

const mockBooks = [
  {
    id: "1",
    title: "Financial Freedom Unleashed",
    author: "Sarah Mitchell",
    rating: 4.8,
    reviews: 234,
    price: 14.99,
    cover: "/cover1.jpg",
  },
  {
    id: "2",
    title: "Explore Your Creative Mind to Positivity",
    author: "Rotyen Mercado",
    rating: 4.6,
    reviews: 189,
    price: 12.99,
    cover: "/cover2.webp",
  },
  {
    id: "3",
    title: "Made to Impress",
    author: "Andrew Cris",
    rating: 4.9,
    reviews: 312,
    price: 16.99,
    cover: "/cover3.webp",
  },
  {
    id: "4",
    title: "The Mind of a Leader",
    author: "Kevin Anderson",
    rating: 4.7,
    reviews: 156,
    price: 13.99,
    cover: "/cover4.webp",
  },
  {
    id: "5",
    title: "Rivers of Gold",
    author: "Yaw Asante",
    rating: 4.5,
    reviews: 278,
    price: 11.99,
    cover: "/cover5.webp",
  },
  {
    id: "6",
    title: "Beneath the Stars",
    author: "Esi Dankwa",
    rating: 4.8,
    reviews: 201,
    price: 15.99,
    cover: "/cover6.webp",
  },
  {
    id: "7",
    title: "Echoes of Tomorrow",
    author: "Kofi Mensah",
    rating: 4.6,
    reviews: 189,
    price: 12.99,
    cover: "/cover7.webp",
  },
];

const featuredAuthors = [
  {
    name: "Amara Osei",
    books: 5,
    bio: "Award-winning author of contemporary fiction exploring identity and belonging.",
    rating: 4.8,
    color: "from-amber-500 to-orange-600",
    border: "border-amber-300",
  },
  {
    name: "Kofi Mensah",
    books: 3,
    bio: "Sci-fi visionary crafting stories about technology and humanity.",
    rating: 4.6,
    color: "from-[#D8B27A] to-[#EBC9A8]",
    border: "border-[#EBC9A8]",
  },
  {
    name: "Nana Agyeman",
    books: 7,
    bio: "Bestselling thriller writer with a passion for suspense and mystery.",
    rating: 4.9,
    color: "from-blue-500 to-indigo-600",
    border: "border-blue-300",
  },
  {
    name: "Akosua Boateng",
    books: 4,
    bio: "Poet and storyteller weaving West African folklore into modern narratives.",
    rating: 4.7,
    color: "from-rose-500 to-pink-600",
    border: "border-rose-300",
  },
];

const stats = [
  { label: "Books Published", value: 10000, suffix: "+", icon: BookMarked },
  { label: "Active Authors", value: 5000, suffix: "+", icon: Users },
  { label: "Countries Reached", value: 50, suffix: "+", icon: Globe },
  { label: "Royalties Paid", value: 1, prefix: "$", suffix: "M+", icon: DollarSign },
];

const testimonials = [
  {
    name: "Adwoa Serwaa",
    role: "Author of *The Quiet Storm*",
    quote:
      "Statement Publications made publishing my debut novel effortless. The platform is intuitive, the support team is incredible, and I earned my first royalty within the first month.",
    rating: 5,
    color: "from-amber-500 to-orange-600",
    quoteColor: "text-amber-700",
    bg: "bg-amber-200",
    border: "border-amber-300",
  },
  {
    name: "Kwame Poku",
    role: "Bestselling Author",
    quote:
      "I've tried other platforms, but none compare. The author dashboard gives me full visibility into my sales and royalties. The design tools are top-notch.",
    rating: 5,
    color: "from-[#D8B27A] to-[#EBC9A8]",
    quoteColor: "text-[#8A6A4A]",
    bg: "bg-[#F2D8BE]",
    border: "border-[#EBC9A8]",
  },
  {
    name: "Efua Mensah",
    role: "Author of *Roots of Gold*",
    quote:
      "From manuscript upload to global distribution, everything was seamless. My book is now available in 30+ countries. I couldn't be happier with the results.",
    rating: 5,
    color: "from-blue-500 to-indigo-600",
    quoteColor: "text-blue-700",
    bg: "bg-blue-200",
    border: "border-blue-300",
  },
];

const faqs = [
  {
    question: "How much does it cost to publish on Statement?",
    answer:
      "Publishing on Statement is completely free. There are no upfront costs, hidden fees, or annual charges. We take a small percentage of each sale, so you only earn when you earn.",
  },
  {
    question: "What royalty rates do you offer?",
    answer:
      "We offer competitive royalty rates of up to 70% on eBook sales and up to 40% on print books, depending on the format and pricing. You have full control over your book's pricing.",
  },
  {
    question: "How long does it take for my book to go live?",
    answer:
      "Once you submit your book, our review process typically takes 1-2 business days. After approval, your book goes live on our platform within 24 hours and is distributed to partner networks within 5-7 business days.",
  },
  {
    question: "What file formats do you accept?",
    answer:
      "We accept manuscripts in DOCX, PDF, EPUB, and MOBI formats. For print books, we also accept PDF with proper bleed and margin settings. Our team will help ensure your book meets formatting standards.",
  },
  {
    question: "Do I retain the rights to my book?",
    answer:
      "Absolutely. You retain 100% ownership and rights to your work. Statement Publications is a publishing platform, not a publisher — your intellectual property is always yours.",
  },
  {
    question: "How do I get paid?",
    answer:
      "We process royalty payments weekly via bank transfer, PayPal, or Stripe. You can track your earnings in real-time through your author dashboard and set a minimum payout threshold that works for you.",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen w-full overflow-hidden" style={{ background: "linear-gradient(135deg, #FDF6EE 0%, #FAF8F5 50%, #F2D8BE 100%)" }}>
        {/* Centered text */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center pt-28 lg:pt-32">
          <div className="max-w-xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl sm:text-6xl md:text-7xl leading-[1.1] text-charcoal"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              <span className="italic">Welcome to</span>
              <br />
              <span className="italic font-bold">Statement Publications</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-lg sm:text-xl font-bold text-charcoal"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              Don&apos;t Just Publish, Make a Statement
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-dark-gray/80 max-w-lg leading-relaxed"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              Empowering independent authors to share their voice and connect with millions of readers across the globe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-charcoal transition-all hover:shadow-lg"
                style={{ fontFamily: "var(--font-libre)", backgroundColor: "#EBC9A8" }}
              >
                Start Publishing
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal px-6 py-3 text-base font-semibold text-charcoal transition-all hover:bg-charcoal hover:text-white"
                style={{ fontFamily: "var(--font-libre)" }}
              >
                Explore Books
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-dark-gray/70"
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#EBC9A8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Publish<br/>your book</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#EBC9A8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Reach<br/>Global Readers</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#EBC9A8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Earn<br/>Royalties</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#EBC9A8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Leave Your<br/>Legacy</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-base font-bold uppercase tracking-wider text-[#8A6A4A]">
              Everything You Need
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              A Platform Built for Authors
            </h2>
            <p className="mt-4 text-lg text-dark-gray/70">
              From manuscript to marketplace, we provide every tool you need to
              bring your book to life and share it with the world.
            </p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -6, boxShadow: "0 12px 24px -8px rgba(235,201,168,0.3)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative rounded-2xl border p-8 shadow-sm transition-all duration-300 ${feature.bg} ${feature.border}`}
              >
                <div className={`mb-5 inline-flex items-center justify-center rounded-xl ${feature.iconBg} p-3`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-charcoal">{feature.title}</h3>
                <p className="text-sm text-dark-gray/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-[#EBC9A8]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-base font-bold uppercase tracking-wider text-[#8A6A4A]">
              Simple Process
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-dark-gray/70">
              Five simple steps from manuscript to published author.
            </p>
          </AnimatedSection>

          <div className="relative">
            {/* connecting line */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-peach/20 via-gold/50 to-peach/20" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative text-center rounded-2xl border p-6 ${step.bg} ${step.border}`}
                >
                  <div className={`relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-current bg-white ${step.number} font-bold text-lg shadow-sm`}>
                    {index + 1}
                  </div>
                  <div className="mb-3 flex justify-center">
                    <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold mb-1 text-charcoal">{step.title}</h3>
                  <p className="text-sm text-dark-gray/70 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Popular Books ───────────────────────────────── */}
      <section className="py-24 sm:py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-end justify-between mb-12">
            <div>
              <span className="text-base font-bold uppercase tracking-wider text-[#8A6A4A]">
                Discover
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
                Popular Books
              </h2>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Button variant="outline" className="hidden sm:inline-flex border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white" asChild>
                <Link href="/store">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </AnimatedSection>

          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-0 sm:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {mockBooks.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="min-w-[220px] sm:min-w-[260px] snap-start"
              >
                <motion.div
                  whileHover={{ y: -10, boxShadow: "0 20px 40px -15px rgba(216,178,122,0.3)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-sm transition-colors duration-300 hover:border-gold/30"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 rounded-full bg-black/30 backdrop-blur-sm px-2 py-1">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        <span className="text-xs font-medium text-white">{book.rating}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-sm font-bold text-white line-clamp-2 drop-shadow-md">
                        {book.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <p className="text-xs text-charcoal truncate font-medium">
                      {book.author}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < Math.round(book.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-charcoal/20"
                            )}
                          />
                        ))}
                        <span className="text-[10px] text-charcoal/60 ml-1">
                          ({book.reviews})
                        </span>
                      </div>
                      <p className="text-sm font-bold text-charcoal">${book.price}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Button variant="outline" className="border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white" asChild>
                <Link href="/store">
                  View All Books
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Featured Authors ────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-peach uppercase tracking-wider">
              Meet Our Authors
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Featured Authors
            </h2>
            <p className="mt-4 text-lg text-dark-gray/70">
              Talented writers who chose Statement to bring their stories to the world.
            </p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredAuthors.map((author) => (
              <motion.div
                key={author.name}
                variants={fadeInUp}
                whileHover={{ y: -6, boxShadow: "0 12px 24px -8px rgba(235,201,168,0.3)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group rounded-2xl border bg-white p-6 text-center transition-colors duration-300 shadow-sm ${author.border}`}
              >
                <div
                  className={cn(
                    "mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl font-bold text-white",
                    author.color
                  )}
                >
                  {author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="font-semibold text-lg text-charcoal">{author.name}</h3>
                <div className="mt-1 flex items-center justify-center gap-1 text-sm text-dark-gray/70">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                  <span>{author.rating}</span>
                  <span className="text-xs">·</span>
                  <span>{author.books} books</span>
                </div>
                <p className="mt-3 text-sm text-dark-gray/70 leading-relaxed">
                  {author.bio}
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-peach hover:text-peach-dark hover:bg-peach/10"
                    asChild
                  >
                    <Link href={`/store?author=${encodeURIComponent(author.name)}`}>
                      View Books
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Statistics ──────────────────────────────────── */}
      <section className="py-24 sm:py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Trusted by Authors Worldwide
            </h2>
            <p className="mt-4 text-lg text-charcoal/60">
              Our growing community is making an impact.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const { count, ref } = useCountUp(stat.value);
              const colors = [
                { bg: "bg-amber-100", icon: "text-amber-700", box: "bg-amber-200" },
                { bg: "bg-[#F2D8BE]/40", icon: "text-[#8A6A4A]", box: "bg-[#F2D8BE]" },
                { bg: "bg-blue-100", icon: "text-blue-700", box: "bg-blue-200" },
                { bg: "bg-rose-100", icon: "text-rose-700", box: "bg-rose-200" },
              ];
              const c = colors[index % colors.length];
              return (
                <motion.div
                  key={stat.label}
                  ref={ref}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`text-center rounded-2xl p-6 shadow-sm ${c.bg}`}
                >
                  <div className={`inline-flex items-center justify-center rounded-2xl p-3 mb-4 ${c.box}`}>
                    <stat.icon className={`h-6 w-6 ${c.icon}`} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-charcoal">
                    {stat.prefix || ""}
                    {count.toLocaleString()}
                    {stat.suffix}
                  </div>
                  <p className="mt-1 text-sm text-charcoal/60">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-peach uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Loved by Authors
            </h2>
            <p className="mt-4 text-lg text-dark-gray/70">
              Hear from writers who turned their manuscripts into published books.
            </p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                whileHover={{ y: -6, boxShadow: "0 12px 24px -8px rgba(235,201,168,0.25)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative rounded-2xl border p-8 shadow-sm transition-all duration-300 ${testimonial.bg} ${testimonial.border}`}
              >
                <Quote className={`h-8 w-8 ${testimonial.quoteColor} mb-4`} />
                <p className="text-sm leading-relaxed text-dark-gray/70">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white",
                      testimonial.color
                    )}
                  >
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{testimonial.name}</p>
                    <p className="text-xs text-dark-gray/60">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-gold text-gold"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-light-gray">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-xl border border-peach/10 bg-white px-5 data-[state=open]:shadow-sm data-[state=open]:border-peach/20 transition-colors"
                >
                  <AccordionTrigger className="text-left text-sm sm:text-base font-medium py-5 hover:no-underline hover:text-peach">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-dark-gray/70 leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Newsletter ──────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-charcoal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 border border-white/10 p-8 sm:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center rounded-2xl bg-gold/15 p-3 mb-6">
                  <Mail className="h-6 w-6 text-gold" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Stay in the Loop
                </h2>
                <p className="mt-3 text-white/60">
                  Get the latest books, author stories, and platform updates
                  delivered straight to your inbox. No spam, ever.
                </p>
                <form
                  onSubmit={handleSubscribe}
                  className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:border-gold focus:ring-gold/20"
                    required
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <Button type="submit" size="lg" className="h-12 shrink-0 bg-gold text-charcoal hover:bg-peach-dark font-semibold shadow-md">
                      Subscribe
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </motion.div>
                </form>
                <AnimatePresence>
                  {subscribed && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 text-sm text-[#D8B27A] font-medium"
                    >
                      Thanks for subscribing! Check your inbox for a welcome email.
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="mt-3 text-xs text-white/40">
                  Join 5,000+ readers and authors. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="py-24 sm:py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #EBC9A8 0%, #F2D8BE 50%, #D8B27A 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-white/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal">
              Ready to Share Your Story?
            </h2>
            <p className="mt-6 text-lg text-charcoal/70 max-w-2xl mx-auto">
              Join thousands of authors who chose Statement to publish their
              books. Start your publishing journey today — it&apos;s free.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(29,29,29,0.4)" }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Button
                  size="lg"
                  className="text-base px-8 h-14 bg-charcoal text-white hover:bg-dark-gray font-semibold shadow-lg"
                  asChild
                >
                  <Link href="/register">
                    Get Started for Free
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 h-14 border-2 border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white font-semibold"
                  asChild
                >
                  <Link href="/services">
                    Learn More
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
