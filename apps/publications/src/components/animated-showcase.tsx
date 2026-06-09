"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Star, BookOpen, Feather, Award, Headphones, Globe, BadgeCheck, Coins, PenTool, Quote, FileText, Sparkles } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────── */

const bestsellers = [
  { title: "The Last Horizon", author: "Amara Osei", cover: "📖", rating: 4.8, description: "A sweeping epic of love and loss across continents." },
  { title: "Midnight Frequencies", author: "Daniel Reeve", cover: "📕", rating: 4.6, description: "A technological thriller that blurs reality and code." },
  { title: "Beneath the Baobab", author: "Fatima Zahra", cover: "📗", rating: 4.9, description: "Three generations, one tree, infinite stories." },
  { title: "Quantum Leaves", author: "Liam Chen", cover: "📘", rating: 4.5, description: "Science meets spirituality in a thought-provoking journey." },
  { title: "Embers of Dawn", author: "Sofia Reyes", cover: "📙", rating: 4.7, description: "A poetic exploration of resilience and hope." },
  { title: "The Cartographer's Daughter", author: "Nia Asante", cover: "📓", rating: 4.8, description: "Mapping identity through generations of women." },
  { title: "Iron & Ivy", author: "Marcus Hale", cover: "📔", rating: 4.4, description: "Where nature reclaims a post-industrial world." },
  { title: "The Quiet Hours", author: "Elena Volkov", cover: "📒", rating: 4.9, description: "Intimate portraits of moments that define us." },
  { title: "Savannah Dreams", author: "Kofi Mensah", cover: "📕", rating: 4.6, description: "A young chef's journey from Lagos to Paris." },
  { title: "The Woven Path", author: "Aisha Ibrahim", cover: "📖", rating: 4.7, description: "Tradition and modernity collide in Lagos." },
  { title: "Crimson Tides", author: "James Wright", cover: "📗", rating: 4.5, description: "A maritime thriller spanning three centuries." },
  { title: "Whispers in Ink", author: "Yuki Tanaka", cover: "📘", rating: 4.8, description: "A calligrapher discovers messages hidden in scripts." },
];

const featuredAuthors = [
  { name: "Amara Osei", specialty: "Fiction Author", photo: "✍️", books: 7, bio: "Award-winning novelist exploring African diaspora themes." },
  { name: "Dr. James Chen", specialty: "Business Author", photo: "📊", books: 12, bio: "Bestselling author on leadership and innovation." },
  { name: "Fatima Zahra", specialty: "Poet", photo: "🖊️", books: 4, bio: "Poet laureate nominee blending Arabic and English verse." },
  { name: "Prof. Adebayo", specialty: "Research Author", photo: "🔬", books: 9, bio: "Leading voice in African economic development research." },
  { name: "Luna Martinez", specialty: "Children's Author", photo: "🌈", books: 15, bio: "Creating magical worlds for young readers everywhere." },
  { name: "Marcus Hale", specialty: "Sci-Fi Author", photo: "🚀", books: 6, bio: "Pushing the boundaries of speculative fiction." },
  { name: "Elena Volkov", specialty: "Memoir Author", photo: "📝", books: 3, bio: "Raw, honest storytelling from lived experience." },
  { name: "Kofi Mensah", specialty: "Culinary Author", photo: "👨‍🍳", books: 5, bio: "Food culture meets storytelling across continents." },
  { name: "Nia Asante", specialty: "Historical Fiction", photo: "📜", books: 8, bio: "Bringing untold African histories to life." },
  { name: "Yuki Tanaka", specialty: "Literary Fiction", photo: "🎋", books: 6, bio: "Exploring the intersection of tradition and modernity." },
];

const publishingSteps = [
  { label: "Manuscript Submitted", icon: FileText, description: "Your journey begins when you share your manuscript with us.", color: "from-[#EBC9A8] to-[#F2D8BE]" },
  { label: "Book Published", icon: BookOpen, description: "Professional editing, design, and formatting bring your book to life.", color: "from-[#D8B27A] to-[#EBC9A8]" },
  { label: "Bestseller", icon: Award, description: "Your book reaches readers and climbs the charts.", color: "from-[#F2D8BE] to-[#D8B27A]" },
  { label: "Audiobook Released", icon: Headphones, description: "Reach new audiences through immersive audio narration.", color: "from-[#EBC9A8] to-[#D8B27A]" },
  { label: "Global Distribution", icon: Globe, description: "Your book is available in bookstores worldwide.", color: "from-[#D8B27A] to-[#F2D8BE]" },
  { label: "Author Verified", icon: BadgeCheck, description: "Earn your verified author badge and build credibility.", color: "from-[#F2D8BE] to-[#EBC9A8]" },
  { label: "Royalty Earned", icon: Coins, description: "Start earning royalties from every sale, everywhere.", color: "from-[#EBC9A8] to-[#F2D8BE]" },
  { label: "Creative Legacy", icon: Feather, description: "Build a lasting legacy through your written words.", color: "from-[#D8B27A] to-[#EBC9A8]" },
];

const activityMessages = [
  "New manuscript submitted from Lagos, Nigeria",
  "Author profile completed — Dr. James Chen",
  "New book published: \"The Last Horizon\"",
  "Book reached 1,000 readers worldwide",
  "Bestseller status achieved — \"Midnight Frequencies\"",
  "New audiobook released: \"Beneath the Baobab\"",
  "Author verified: Amara Osei — Fiction Author",
  "Royalty payment processed — 12 authors",
  "New review added: ★★★★★ for \"Quantum Leaves\"",
  "Global distribution activated for 5 new titles",
  "Writing milestone: 100,000 words submitted this week",
  "New chapter preview published: \"The Woven Path\" Ch. 3",
];

const floatingElements = [
  { icon: Feather, delay: 0, x: "10%", duration: 18 },
  { icon: BookOpen, delay: 3, x: "25%", duration: 22 },
  { icon: Quote, delay: 6, x: "45%", duration: 20 },
  { icon: PenTool, delay: 2, x: "65%", duration: 24 },
  { icon: Sparkles, delay: 5, x: "80%", duration: 16 },
  { icon: FileText, delay: 8, x: "90%", duration: 21 },
  { icon: Quote, delay: 4, x: "35%", duration: 19 },
  { icon: Feather, delay: 7, x: "55%", duration: 23 },
];

/* ─── Infinite Scroll Lane ───────────────────────────────── */

function InfiniteLane({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const positionRef = useRef(0);

  const getDirection = useCallback(() => (direction === "right" ? 1 : -1), [direction]);

  useEffect(() => {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!content || !container) return;

    const totalWidth = content.scrollWidth / 2;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isPaused) {
        positionRef.current += getDirection() * speed * delta;
        if (direction === "left" && positionRef.current <= -totalWidth) {
          positionRef.current += totalWidth;
        } else if (direction === "right" && positionRef.current >= totalWidth) {
          positionRef.current -= totalWidth;
        }
      }

      content.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, speed, getDirection, direction]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div ref={contentRef} className="flex gap-5 will-change-transform">
        {children}
        {children}
      </div>
    </div>
  );
}

/* ─── Book Card ──────────────────────────────────────────── */

function BookCard({ item }: { item: (typeof bestsellers)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex-shrink-0 w-[200px] group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]">
          <div className="relative rounded-[14px] bg-white/80 backdrop-blur-xl border border-white/40 overflow-hidden">
            {/* Book Cover Area */}
            <div className="h-[180px] flex items-center justify-center bg-gradient-to-br from-[#FDF6EE] to-[#F2D8BE]/50 relative">
              <span className="text-6xl">{item.cover}</span>
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                <Star className="h-3 w-3 text-[#D8B27A] fill-[#D8B27A]" />
                <span className="text-[10px] font-semibold text-charcoal">{item.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              <h4 className="font-semibold text-sm text-charcoal line-clamp-1">{item.title}</h4>
              <p className="text-[11px] text-brown mt-0.5">{item.author}</p>
            </div>

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/95 via-[#1D1D1D]/80 to-transparent flex flex-col justify-end p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-white/90 text-xs leading-relaxed mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${s <= Math.floor(item.rating) ? "text-[#D8B27A] fill-[#D8B27A]" : "text-white/30"}`}
                    />
                  ))}
                </div>
                <span className="text-[#EBC9A8] text-[10px] font-semibold uppercase tracking-wider">Read More</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Author Card ─────────────────────────────────────────── */

function AuthorCard({ item }: { item: (typeof featuredAuthors)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex-shrink-0 w-[220px] group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#D8B27A] via-[#F2D8BE] to-[#EBC9A8]">
          <div className="relative rounded-[14px] bg-white/80 backdrop-blur-xl border border-white/40 overflow-hidden">
            {/* Author Photo Area */}
            <div className="h-[120px] flex items-center justify-center bg-gradient-to-br from-[#FDF6EE] to-[#EBC9A8]/30 relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EBC9A8] to-[#D8B27A] flex items-center justify-center">
                <span className="text-2xl">{item.photo}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 text-center">
              <h4 className="font-semibold text-sm text-charcoal line-clamp-1">{item.name}</h4>
              <p className="text-[11px] text-brown mt-0.5">{item.specialty}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <BookOpen className="h-3 w-3 text-[#D8B27A]" />
                <span className="text-[10px] text-charcoal/60">{item.books} books published</span>
              </div>
            </div>

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/95 via-[#1D1D1D]/80 to-transparent flex flex-col justify-end p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-white/90 text-xs leading-relaxed mb-3">{item.bio}</p>
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-[#EBC9A8]" />
                <span className="text-[#EBC9A8] text-[11px] font-semibold">{item.books} Published Works</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Publishing Step Card ─────────────────────────────────── */

function StepCard({ item }: { item: (typeof publishingSteps)[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      className="relative flex-shrink-0 w-[200px] group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="p-[2px] rounded-2xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r from-[#EBC9A8] via-[#D8B27A] to-[#F2D8BE]">
          <div className="relative rounded-[14px] bg-white/80 backdrop-blur-xl border border-white/40 overflow-hidden p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h4 className="font-semibold text-sm text-charcoal line-clamp-2 leading-snug">{item.label}</h4>

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/95 via-[#1D1D1D]/80 to-transparent flex flex-col justify-end p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-white/90 text-xs leading-relaxed">{item.description}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Floating Background Elements ────────────────────────── */

function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {floatingElements.map((el, i) => {
        const Icon = el.icon;
        return (
          <div
            key={i}
            className="absolute opacity-[0.04]"
            style={{ left: el.x, animation: `float ${el.duration}s ease-in-out ${el.delay}s infinite` }}
          >
            <Icon className="h-12 w-12 text-[#8A6A4A]" />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Live Activity Ticker ────────────────────────────────── */

function LiveActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activityMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
      </span>
      <span className="text-xs text-charcoal/50 font-medium">Live Activity</span>
      <motion.span
        key={currentIndex}
        className="text-xs text-charcoal/70 font-medium"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
      >
        {activityMessages[currentIndex]}
      </motion.span>
    </div>
  );
}

/* ─── Section Label ───────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base font-bold uppercase tracking-wider text-[#8A6A4A] text-center">
      {children}
    </p>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

export function AnimatedShowcase() {
  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-b from-white via-[#FDF6EE]/50 to-white overflow-hidden">
      <FloatingElements />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel>The Publishing Ecosystem</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Where Stories Come Alive
            </h2>
            <p className="mt-3 text-base text-charcoal/60 max-w-xl mx-auto">
              Discover the books, authors, and milestones that define Statement Publications.
            </p>
          </motion.div>
        </div>

        {/* Live Ticker */}
        <LiveActivityTicker />

        {/* Row 1 — Bestselling Books (scroll left, faster) */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#D8B27A]" />
              <span className="text-sm font-semibold text-charcoal uppercase tracking-wider">Featured Books</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#EBC9A8]/50 to-transparent"></div>
          </div>
          <InfiniteLane speed={35} direction="left">
            {bestsellers.map((book, i) => (
              <BookCard key={`book-${i}`} item={book} />
            ))}
          </InfiniteLane>
        </div>

        {/* Row 2 — Featured Authors (scroll right, slower) */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Feather className="h-4 w-4 text-[#D8B27A]" />
              <span className="text-sm font-semibold text-charcoal uppercase tracking-wider">Featured Authors</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#EBC9A8]/50 to-transparent"></div>
          </div>
          <InfiniteLane speed={25} direction="right">
            {featuredAuthors.map((author, i) => (
              <AuthorCard key={`author-${i}`} item={author} />
            ))}
          </InfiniteLane>
        </div>

        {/* Row 3 — Publishing Journey (scroll left, medium speed) */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[#D8B27A]" />
              <span className="text-sm font-semibold text-charcoal uppercase tracking-wider">Publishing Journey</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-[#EBC9A8]/50 to-transparent"></div>
          </div>
          <InfiniteLane speed={30} direction="left">
            {publishingSteps.map((step, i) => (
              <StepCard key={`step-${i}`} item={step} />
            ))}
          </InfiniteLane>
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    </section>
  );
}
