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
  Pen,
  Upload,
  Palette,
  Rocket,
  Banknote,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RollingMarquee } from "@/components/rolling-marquee";
import { FeaturedBooks } from "@/components/featured-books";
import { FloatingBubbles } from "@/components/floating-bubbles";
import { AboutCTAWaveTop, HowItWorksWaveTop, HowItWorksWaveBottom } from "@/components/about-wave-separators";

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

const rotatingWords = ["Story", "Vision", "Legacy", "Masterpiece", "Voice", "Dream"];

const heroRotatingMessages = [
  "Write Your Story. Publish Your Book. Inspire The World.",
  "From Manuscript To Marketplace.",
  "Reach Readers. Build Your Legacy. Earn Royalties.",
];

const features = [
  {
    icon: BookOpen,
    title: "Publish Books",
    description:
      "Transform your manuscript into a professionally published book available to readers worldwide.",
    bg: "bg-[#E0CDB4]",
    iconColor: "text-[#6A3F26]",
    iconBg: "bg-[#A56D45]/20",
    border: "border-[#C4976F]/30",
    gradientBorder: "from-[#C4976F] via-[#D7C0A1] to-[#E0CDB4]",
    titleColor: "text-[#1E1E1E]",
    descColor: "text-[#5C4A3D]",
  },
  {
    icon: ShoppingCart,
    title: "Sell Books",
    description:
      "Set your own prices and sell directly to readers through our built-in marketplace.",
    bg: "bg-[#D7C0A1]",
    iconColor: "text-[#6A3F26]",
    iconBg: "bg-[#B88259]/20",
    border: "border-[#B88259]/30",
    gradientBorder: "from-[#B88259] via-[#CFAE8B] to-[#D7C0A1]",
    titleColor: "text-[#1E1E1E]",
    descColor: "text-[#5C4A3D]",
  },
  {
    icon: DollarSign,
    title: "Earn Royalties",
    description:
      "Earn competitive royalties on every sale with transparent, timely payouts.",
    bg: "bg-[#CFAE8B]",
    iconColor: "text-[#4A3220]",
    iconBg: "bg-[#A56D45]/20",
    border: "border-[#A56D45]/30",
    gradientBorder: "from-[#A56D45] via-[#C4976F] to-[#CFAE8B]",
    titleColor: "text-[#1E1E1E]",
    descColor: "text-[#5C4A3D]",
  },
  {
    icon: Globe,
    title: "Reach Global Readers",
    description:
      "Distribute your book across multiple platforms and reach millions of readers worldwide.",
    bg: "bg-[#C4976F]",
    iconColor: "text-[#F5EDE3]",
    iconBg: "bg-[#F5EDE3]/20",
    border: "border-[#8E5A36]/30",
    gradientBorder: "from-[#8E5A36] via-[#B88259] to-[#C4976F]",
    titleColor: "text-[#FFFFFF]",
    descColor: "text-[#F5EDE3]",
  },
  {
    icon: LayoutDashboard,
    title: "Author Dashboard",
    description:
      "Track sales, royalties, reviews, and reader engagement from one powerful dashboard.",
    bg: "bg-[#B88259]",
    iconColor: "text-[#F5EDE3]",
    iconBg: "bg-[#F5EDE3]/20",
    border: "border-[#7B4A2D]/30",
    gradientBorder: "from-[#7B4A2D] via-[#A56D45] to-[#B88259]",
    titleColor: "text-[#FFFFFF]",
    descColor: "text-[#F5EDE3]",
  },
  {
    icon: Layers,
    title: "Digital Distribution",
    description:
      "Publish in multiple formats — eBook, paperback, and hardcover — with automatic distribution.",
    bg: "bg-[#A56D45]",
    iconColor: "text-[#F5EDE3]",
    iconBg: "bg-[#F5EDE3]/20",
    border: "border-[#6A3F26]/30",
    gradientBorder: "from-[#6A3F26] via-[#8E5A36] to-[#A56D45]",
    titleColor: "text-[#FFFFFF]",
    descColor: "text-[#F5EDE3]",
  },
];

const steps = [
  {
    icon: Pen,
    title: "Create Account",
    description: "Create account for free and set up your author profile in minutes.",
    bg: "bg-[#F5EDE3]",
    iconColor: "text-[#8B5E34]",
    number: "text-[#FFFFFF]",
    numberBg: "bg-[#C79A6B]",
    border: "border-[#8B5E34]/30",
    gradientBorder: "from-[#8B5E34] via-[#C79A6B] to-[#F5EDE3]",
    titleColor: "#1E1E1E",
    descColor: "#5C4A3D",
  },
  {
    icon: Upload,
    title: "Upload Manuscript",
    description:
      "Upload your manuscript in any standard format. We accept DOCX, PDF, and more.",
    bg: "bg-[#F5EDE3]",
    iconColor: "text-[#8B5E34]",
    number: "text-[#FFFFFF]",
    numberBg: "bg-[#C79A6B]",
    border: "border-[#8B5E34]/30",
    gradientBorder: "from-[#8B5E34] via-[#C79A6B] to-[#F5EDE3]",
    titleColor: "#1E1E1E",
    descColor: "#5C4A3D",
  },
  {
    icon: Palette,
    title: "Design Your Book",
    description:
      "Choose from professional templates or upload your own cover design.",
    bg: "bg-[#F5EDE3]",
    iconColor: "text-[#8B5E34]",
    number: "text-[#FFFFFF]",
    numberBg: "bg-[#C79A6B]",
    border: "border-[#8B5E34]/30",
    gradientBorder: "from-[#8B5E34] via-[#C79A6B] to-[#F5EDE3]",
    titleColor: "#1E1E1E",
    descColor: "#5C4A3D",
  },
  {
    icon: Rocket,
    title: "Publish",
    description:
      "Review, preview, and hit publish. Your book goes live within 24 hours.",
    bg: "bg-[#F5EDE3]",
    iconColor: "text-[#8B5E34]",
    number: "text-[#FFFFFF]",
    numberBg: "bg-[#C79A6B]",
    border: "border-[#8B5E34]/30",
    gradientBorder: "from-[#8B5E34] via-[#C79A6B] to-[#F5EDE3]",
    titleColor: "#1E1E1E",
    descColor: "#5C4A3D",
  },
  {
    icon: Banknote,
    title: "Earn Royalties",
    description:
      "Start earning competitive royalties on every sale with weekly payouts.",
    bg: "bg-[#F5EDE3]",
    iconColor: "text-[#8B5E34]",
    number: "text-[#FFFFFF]",
    numberBg: "bg-[#C79A6B]",
    border: "border-[#8B5E34]/30",
    gradientBorder: "from-[#8B5E34] via-[#C79A6B] to-[#F5EDE3]",
    titleColor: "#1E1E1E",
    descColor: "#5C4A3D",
  },
];

const testimonials = [
  {
    name: "Adwoa Serwaa",
    role: "Author of *The Quiet Storm*",
    quote:
      "Statement Publications made publishing my debut novel effortless. The platform is intuitive, the support team is incredible, and I earned my first royalty within the first month.",
    rating: 5,
    color: "from-[#C79A6B] to-[#8B5E34]",
    quoteColor: "text-[#8B5E34]",
    bg: "bg-[#F5EDE3]",
    border: "border-[#C79A6B]",
    gradientBorder: "from-[#C79A6B] via-[#B67C4B] to-[#F5EDE3]",
  },
  {
    name: "Kwame Poku",
    role: "Bestselling Author",
    quote:
      "I've tried other platforms, but none compare. The author dashboard gives me full visibility into my sales and royalties. The design tools are top-notch.",
    rating: 5,
    color: "from-[#B67C4B] to-[#8B5E34]",
    quoteColor: "text-[#8B5E34]",
    bg: "bg-[#EBD8C0]",
    border: "border-[#B67C4B]",
    gradientBorder: "from-[#B67C4B] via-[#C79A6B] to-[#EBD8C0]",
  },
  {
    name: "Efua Mensah",
    role: "Author of *Roots of Gold*",
    quote:
      "From manuscript upload to global distribution, everything was seamless. My book is now available in 30+ countries. I couldn't be happier with the results.",
    rating: 5,
    color: "from-[#8B5E34] to-[#6A4E37]",
    quoteColor: "text-[#8B5E34]",
    bg: "bg-[#E0C9AE]",
    border: "border-[#8B5E34]",
    gradientBorder: "from-[#8B5E34] via-[#B67C4B] to-[#E0C9AE]",
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
  const [wordIndex, setWordIndex] = useState(0);
  const [heroMsgIndex, setHeroMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroMsgIndex((prev) => (prev + 1) % heroRotatingMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative w-full min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-[#FDF6EE] via-white to-white dark:from-[#0a0a0a] dark:via-[#111111] dark:to-[#0a0a0a]">
        <FloatingBubbles count={30} className="opacity-70" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBC9A8]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D8B27A]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 flex items-center justify-center">
          <div className="max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl leading-[1.1] text-charcoal"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              <span className="italic">Welcome to</span>
              <br />
              <span className="italic font-bold mt-2 block">Statement Publications</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 border-t border-b py-3 relative overflow-hidden"
              style={{ borderColor: "#D8B27A", minHeight: "52px" }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={heroMsgIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-lg sm:text-xl font-bold text-charcoal absolute inset-0 flex items-center justify-center"
                  style={{ fontFamily: "var(--font-libre)" }}
                >
                  {heroRotatingMessages[heroMsgIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-dark-gray/80 max-w-lg mx-auto leading-relaxed"
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
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-charcoal bg-[#D8B27A]"
                style={{ fontFamily: "var(--font-libre)" }}
              >
                Start Publishing
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="group/btn p-[2px] rounded-lg bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE] transition-all duration-200 hover:shadow-lg"
              >
                <span className="inline-flex items-center gap-2 rounded-[6px] bg-white px-6 py-3 text-base font-semibold text-charcoal transition-all duration-200 group-hover/btn:bg-[#1D1D1D] group-hover/btn:text-white"
                  style={{ fontFamily: "var(--font-libre)" }}
                >
                  Learn More
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Rolling Marquee ──────────────────────────────── */}
      <RollingMarquee />

      {/* ── Featured Books ──────────────────────────────── */}
      <FeaturedBooks />

      {/* ── Features ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#111111]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-10">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
              {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className={`p-[2.5px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${feature.gradientBorder} hover:shadow-lg transition-all duration-300`}
              >
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 12px 24px -8px rgba(139,94,52,0.3)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`group relative rounded-[14px] p-5 shadow-sm transition-all duration-300 ${feature.bg}`}
                >
                  <div className={`mb-3 inline-flex items-center justify-center rounded-xl ${feature.iconBg} p-2.5`}>
                    <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className={`text-base font-semibold mb-1.5 ${feature.titleColor}`}>{feature.title}</h3>
                  <p className={`text-sm leading-relaxed ${feature.descColor}`}>
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <section className="relative py-10 sm:py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <HowItWorksWaveTop />
        <HowItWorksWaveBottom />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-base font-bold uppercase tracking-wider" style={{ color: "#8B5E34" }}>
              Simple Process
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#1E1E1E" }}>
              How It Works
            </h2>
            <p className="mt-4 text-lg" style={{ color: "#5C4A3D" }}>
              Five simple steps from manuscript to published author.
            </p>
          </AnimatedSection>

          <div className="relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className={`p-[2.5px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${step.gradientBorder} hover:shadow-lg transition-all duration-300`}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative text-center rounded-[14px] p-4 ${step.bg}`}
                  >
                    <div className={`relative z-10 mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full ${step.numberBg} ${step.number} font-bold text-xs shadow-sm`}>
                      {index + 1}
                    </div>
                    <div className="mb-1.5 flex justify-center">
                      <step.icon className={`h-4 w-4 ${step.iconColor}`} />
                    </div>
                    <h3 className="text-sm font-semibold mb-0.5" style={{ color: step.titleColor }}>{step.title}</h3>
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: step.descColor }}>
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-base font-bold uppercase tracking-wider" style={{ color: "#8B5E34" }}>
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#1E1E1E" }}>
              Loved by Authors
            </h2>
            <p className="mt-4 text-lg" style={{ color: "#5C4A3D" }}>
              Hear from writers who turned their manuscripts into published books.
            </p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
              {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                className={`p-[2.5px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${testimonial.gradientBorder} hover:shadow-lg transition-all duration-300`}
              >
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 12px 24px -8px rgba(235,201,168,0.25)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`group relative rounded-[14px] p-4 shadow-sm transition-all duration-300 flex flex-col ${testimonial.bg}`}
                >
                  <Quote className={`h-5 w-5 ${testimonial.quoteColor} mb-2`} />
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#4B3A2F" }}>
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-3 border-t" style={{ borderColor: "#4B3A2F" }} />
                  <div className="mt-auto pt-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full bg-gradient-to-br flex items-center justify-center text-[10px] font-bold text-white",
                          testimonial.color
                        )}
                      >
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "#1E1E1E" }}>{testimonial.name}</p>
                        <p className="text-[10px]" style={{ color: "#6A4E37" }}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-2.5 w-2.5 fill-gold text-gold"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-white dark:bg-[#111111]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-6">
            <span className="text-base font-bold uppercase tracking-wider text-[#8A6A4A]">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => {
                const gradients = [
                  "from-[#C9A06A] via-[#EBC9A8] to-[#F2D8BE]",
                  "from-[#D8B27A] via-[#D4A97A] to-[#F5E6D3]",
                  "from-[#B8925E] via-[#D8B27A] to-[#EBC9A8]",
                  "from-[#D4A97A] via-[#EBC9A8] to-[#F0E0CC]",
                  "from-[#A6824E] via-[#C9A06A] to-[#F2D8BE]",
                  "from-[#EBC9A8] via-[#D8B27A] to-[#F5E6D3]",
                ];
                return (
                <div
                  key={index}
                  className={`p-[2.5px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${gradients[index % gradients.length]}`}
                >
                  <AccordionItem
                    value={`faq-${index}`}
                    className="rounded-[10px] border-0 bg-white px-4 data-[state=open]:shadow-sm transition-colors"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium py-3 hover:no-underline hover:text-[#D8B27A]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-dark-gray/70 leading-relaxed pb-3">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </div>
                );
              })}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10 overflow-hidden" style={{ background: "linear-gradient(135deg, #D8B27A 0%, #EBC9A8 50%, #F2D8BE 100%)" }}>
        <AboutCTAWaveTop />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Ready To Share Your Story?
            </h2>
            <p className="mt-3 text-lg text-charcoal/80 max-w-2xl mx-auto">
              Join thousands of authors who chose Statement to bring their stories to the world.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-charcoal px-8 py-3.5 text-base font-semibold text-white hover:bg-dark-gray shadow-lg transition-all duration-300 hover:scale-[1.05] hover:shadow-xxl">
                Create Account <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="https://books-statement-publications.vercel.app" className="inline-flex items-center gap-2 rounded-lg border-2 border-charcoal/30 px-8 py-3.5 text-base font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-[1.05]">
                Explore Books
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
