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

const features = [
  {
    icon: BookOpen,
    title: "Publish Books",
    description:
      "Transform your manuscript into a professionally published book available to readers worldwide.",
  },
  {
    icon: ShoppingCart,
    title: "Sell Books",
    description:
      "Set your own prices and sell directly to readers through our built-in marketplace.",
  },
  {
    icon: DollarSign,
    title: "Earn Royalties",
    description:
      "Earn competitive royalties on every sale with transparent, timely payouts.",
  },
  {
    icon: Globe,
    title: "Reach Global Readers",
    description:
      "Distribute your book across multiple platforms and reach millions of readers worldwide.",
  },
  {
    icon: LayoutDashboard,
    title: "Author Dashboard",
    description:
      "Track sales, royalties, reviews, and reader engagement from one powerful dashboard.",
  },
  {
    icon: Layers,
    title: "Digital Distribution",
    description:
      "Publish in multiple formats — eBook, paperback, and hardcover — with automatic distribution.",
  },
];

const steps = [
  {
    icon: Pen,
    title: "Create Account",
    description: "Sign up for free and set up your author profile in minutes.",
  },
  {
    icon: Upload,
    title: "Upload Manuscript",
    description:
      "Upload your manuscript in any standard format. We accept DOCX, PDF, and more.",
  },
  {
    icon: Palette,
    title: "Design Your Book",
    description:
      "Choose from professional templates or upload your own cover design.",
  },
  {
    icon: Rocket,
    title: "Publish",
    description:
      "Review, preview, and hit publish. Your book goes live within 24 hours.",
  },
  {
    icon: Banknote,
    title: "Earn Royalties",
    description:
      "Start earning competitive royalties on every sale with weekly payouts.",
  },
];

const mockBooks = [
  {
    id: "1",
    title: "The Silent Garden",
    author: "Amara Osei",
    rating: 4.8,
    reviews: 234,
    price: 14.99,
    cover: null,
    color: "from-amber-800 to-amber-600",
  },
  {
    id: "2",
    title: "Echoes of Tomorrow",
    author: "Kofi Mensah",
    rating: 4.6,
    reviews: 189,
    price: 12.99,
    cover: null,
    color: "from-emerald-800 to-emerald-600",
  },
  {
    id: "3",
    title: "Whispers in the Dark",
    author: "Nana Agyeman",
    rating: 4.9,
    reviews: 312,
    price: 16.99,
    cover: null,
    color: "from-slate-800 to-slate-600",
  },
  {
    id: "4",
    title: "The Last Horizon",
    author: "Akosua Boateng",
    rating: 4.7,
    reviews: 156,
    price: 13.99,
    cover: null,
    color: "from-rose-800 to-rose-600",
  },
  {
    id: "5",
    title: "Rivers of Gold",
    author: "Yaw Asante",
    rating: 4.5,
    reviews: 278,
    price: 11.99,
    cover: null,
    color: "from-violet-800 to-violet-600",
  },
  {
    id: "6",
    title: "Beneath the Stars",
    author: "Esi Dankwa",
    rating: 4.8,
    reviews: 201,
    price: 15.99,
    cover: null,
    color: "from-sky-800 to-sky-600",
  },
];

const featuredAuthors = [
  {
    name: "Amara Osei",
    books: 5,
    bio: "Award-winning author of contemporary fiction exploring identity and belonging.",
    rating: 4.8,
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Kofi Mensah",
    books: 3,
    bio: "Sci-fi visionary crafting stories about technology and humanity.",
    rating: 4.6,
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Nana Agyeman",
    books: 7,
    bio: "Bestselling thriller writer with a passion for suspense and mystery.",
    rating: 4.9,
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Akosua Boateng",
    books: 4,
    bio: "Poet and storyteller weaving West African folklore into modern narratives.",
    rating: 4.7,
    color: "from-rose-500 to-pink-600",
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
  },
  {
    name: "Kwame Poku",
    role: "Bestselling Author",
    quote:
      "I've tried other platforms, but none compare. The author dashboard gives me full visibility into my sales and royalties. The design tools are top-notch.",
    rating: 5,
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Efua Mensah",
    role: "Author of *Roots of Gold*",
    quote:
      "From manuscript upload to global distribution, everything was seamless. My book is now available in 30+ countries. I couldn't be happier with the results.",
    rating: 5,
    color: "from-blue-500 to-indigo-600",
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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card/50 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Over 10,000 books published worldwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Publish Your Story
            <br />
            <span className="text-gradient">To The World</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Become a published author today. Statement gives you everything you
            need to publish, sell, and earn from your books — all in one elegant
            platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="text-base px-8 h-14" asChild>
              <Link href="/auth/signup">
                Start Publishing
                <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 h-14"
              asChild
            >
              <Link href="/store">
                Browse Books
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Free to publish
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Up to 70% royalties
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Global distribution
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Everything You Need
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              A Platform Built for Authors
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
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
                className="group relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Simple Process
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Five simple steps from manuscript to published author.
            </p>
          </AnimatedSection>

          <div className="relative">
            {/* connecting line */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

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
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-background text-primary font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-primary/10 p-2.5">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Popular Books ───────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Discover
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                Popular Books
              </h2>
            </div>
            <Button variant="outline" className="hidden sm:inline-flex" asChild>
              <Link href="/store">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
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
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="min-w-[220px] sm:min-w-[260px] snap-start"
              >
                <div className="group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                  <div
                    className={cn(
                      "aspect-[3/4] bg-gradient-to-br",
                      book.color,
                      "flex items-center justify-center"
                    )}
                  >
                    <BookOpen className="h-16 w-16 text-white/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-sm font-bold text-white line-clamp-2">
                        {book.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <p className="text-xs text-muted-foreground truncate">
                      {book.author}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{book.rating}</span>
                      <span className="text-[10px] text-muted-foreground">
                        ({book.reviews})
                      </span>
                    </div>
                    <p className="text-sm font-bold">${book.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/store">
                View All Books
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Featured Authors ────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Meet Our Authors
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Featured Authors
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
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
                whileHover={{ y: -4 }}
                className="group rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:shadow-lg hover:border-primary/20"
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
                <h3 className="font-semibold text-lg">{author.name}</h3>
                <div className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{author.rating}</span>
                  <span className="text-xs">·</span>
                  <span>{author.books} books</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {author.bio}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-primary"
                  asChild
                >
                  <Link href={`/store?author=${encodeURIComponent(author.name)}`}>
                    View Books
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Statistics ──────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-charcoal to-dark-gray text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Trusted by Authors Worldwide
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Our growing community is making an impact.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const { count, ref } = useCountUp(stat.value);
              return (
                <div
                  key={stat.label}
                  ref={ref}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center rounded-2xl bg-white/10 p-3 mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-white">
                    {stat.prefix || ""}
                    {count.toLocaleString()}
                    {stat.suffix}
                  </div>
                  <p className="mt-1 text-sm text-white/60">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Loved by Authors
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
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
                className="group relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/20"
              >
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-sm leading-relaxed text-muted-foreground">
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
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-xl border bg-card px-5 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="text-left text-sm sm:text-base font-medium py-5 hover:no-underline hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Newsletter ──────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border p-8 sm:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-3 mb-6">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Stay in the Loop
                </h2>
                <p className="mt-3 text-muted-foreground">
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
                    className="h-12 bg-background border-0 shadow-sm"
                    required
                  />
                  <Button type="submit" size="lg" className="h-12 shrink-0">
                    Subscribe
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </form>
                <AnimatePresence>
                  {subscribed && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 text-sm text-emerald-600 font-medium"
                    >
                      Thanks for subscribing! Check your inbox for a welcome email.
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="mt-3 text-xs text-muted-foreground">
                  Join 5,000+ readers and authors. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-charcoal to-dark-gray text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Ready to Share Your Story?
            </h2>
            <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
              Join thousands of authors who chose Statement to publish their
              books. Start your publishing journey today — it&apos;s free.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="text-base px-8 h-14 bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/auth/signup">
                  Get Started for Free
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 h-14 border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/services">
                  Learn More
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
