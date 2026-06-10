"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
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
import { HeroRevolvingIcons } from "@/components/hero-revolving-icons";
import { AnimatedHeroBackground } from "@/components/animated-hero-background";
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
    gradientBorder: "from-amber-300 via-amber-400 to-amber-500",
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
    gradientBorder: "from-[#D8B27A] via-[#C9A06A] to-[#EBC9A8]",
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
    gradientBorder: "from-blue-300 via-blue-400 to-blue-500",
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
    gradientBorder: "from-rose-300 via-rose-400 to-rose-500",
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
    gradientBorder: "from-violet-300 via-violet-400 to-violet-500",
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
    gradientBorder: "from-teal-300 via-teal-400 to-teal-500",
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
    gradientBorder: "from-amber-300 via-amber-400 to-amber-500",
  },
  {
    icon: Upload,
    title: "Upload Manuscript",
    description:
      "Upload your manuscript in any standard format. We accept DOCX, PDF, and more.",
    bg: "bg-emerald-200",
    iconColor: "text-emerald-800",
    number: "text-emerald-700",
    border: "border-emerald-300",
    gradientBorder: "from-emerald-300 via-emerald-400 to-emerald-500",
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
    gradientBorder: "from-blue-300 via-blue-400 to-blue-500",
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
    gradientBorder: "from-rose-300 via-rose-400 to-rose-500",
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
    gradientBorder: "from-violet-300 via-violet-400 to-violet-500",
  },
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
    gradientBorder: "from-amber-300 via-amber-400 to-amber-500",
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
    gradientBorder: "from-[#D8B27A] via-[#C9A06A] to-[#EBC9A8]",
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
    gradientBorder: "from-blue-300 via-blue-400 to-blue-500",
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

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen w-full overflow-hidden dark:bg-[#0a0a0a]" style={{ background: "linear-gradient(to bottom right, #FDF6EE 0%, #FDF6EE 30%, rgba(253,246,238,0.5) 60%, white 100%)" }}>
        <AnimatedHeroBackground />

        {/* Revolving author icons */}
        <HeroRevolvingIcons />

        {/* Centered text */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center pt-8 lg:pt-12">
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
              className="mt-6 border-t border-b py-3"
              style={{ borderColor: "#D8B27A" }}
            >
              <p
                className="text-lg sm:text-xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-libre)" }}
              >
                Don&apos;t Just Publish, Make a Statement
              </p>
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
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-charcoal bg-[#D8B27A] transition-all duration-200 hover:bg-[#8A6A4A] hover:text-white hover:shadow-lg"
                style={{ fontFamily: "var(--font-libre)" }}
              >
                Start Publishing
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              {/* Learn More — animated gradient border */}
              <Link
                href="/about"
                className="group/btn p-[2px] rounded-lg bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE] transition-all duration-200 hover:shadow-lg"
              >
                <span className="inline-flex items-center gap-2 rounded-[6px] bg-white px-6 py-3 text-base font-semibold text-charcoal transition-all duration-200 group-hover/btn:bg-[#8A6A4A] group-hover/btn:text-white"
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
                className={`p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${feature.gradientBorder} hover:shadow-lg transition-all duration-300`}
              >
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 12px 24px -8px rgba(235,201,168,0.3)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`group relative rounded-[14px] p-5 shadow-sm transition-all duration-300 ${feature.bg}`}
                >
                  <div className={`mb-3 inline-flex items-center justify-center rounded-xl ${feature.iconBg} p-2.5`}>
                    <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold mb-1.5 text-charcoal">{feature.title}</h3>
                  <p className="text-sm text-dark-gray/70 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <section className="py-10 sm:py-14" style={{ background: "linear-gradient(135deg, #EBC9A8 0%, #F2D8BE 50%, #D8B27A 100%)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-base font-bold uppercase tracking-wider text-charcoal">
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
                  className={`p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${step.gradientBorder} hover:shadow-lg transition-all duration-300`}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative text-center rounded-[14px] p-4 ${step.bg}`}
                  >
                    <div className={`relative z-10 mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white ${step.number} font-bold text-xs shadow-sm`}>
                      {index + 1}
                    </div>
                    <div className="mb-1.5 flex justify-center">
                      <step.icon className={`h-4 w-4 ${step.iconColor}`} />
                    </div>
                    <h3 className="text-sm font-semibold mb-0.5 text-charcoal">{step.title}</h3>
                    <p className="text-xs text-dark-gray/70 leading-relaxed line-clamp-2">
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
      <section className="py-12 sm:py-16 bg-white dark:bg-[#111111]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-base font-bold uppercase tracking-wider text-[#8A6A4A]">
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
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                className={`p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${testimonial.gradientBorder} hover:shadow-lg transition-all duration-300`}
              >
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 12px 24px -8px rgba(235,201,168,0.25)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`group relative rounded-[14px] p-4 shadow-sm transition-all duration-300 flex flex-col ${testimonial.bg}`}
                >
                  <Quote className={`h-5 w-5 ${testimonial.quoteColor} mb-2`} />
                  <p className="text-xs leading-relaxed text-dark-gray/70 line-clamp-3">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
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
                        <p className="text-xs font-semibold text-charcoal">{testimonial.name}</p>
                        <p className="text-[10px] text-dark-gray/60">
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
      <section className="py-10 sm:py-14 bg-light-gray dark:bg-[#1a1a1a]">
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
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]"
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
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="py-8 sm:py-10 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #EBC9A8 0%, #F2D8BE 50%, #D8B27A 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-white/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal">
              Ready to Share Your Story?
            </h2>
            <p className="mt-3 text-lg text-charcoal/70 max-w-2xl mx-auto">
              Join thousands of authors who chose Statement to publish their
              books. Start your publishing journey today — it&apos;s free.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
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
