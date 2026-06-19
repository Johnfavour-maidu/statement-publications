"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const books = [
  {
    title: "The Quiet Storm",
    author: "Adwoa Serwaa",
    genre: "Fiction",
    bg: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    accent: "#e94560",
    decoration: "radial-gradient(circle at 80% 20%, rgba(233,69,96,0.3) 0%, transparent 50%)",
  },
  {
    title: "Beyond the Horizon",
    author: "Kwame Poku",
    genre: "Leadership",
    bg: "from-[#2d1b4e] via-[#1a1a2e] to-[#0d0d2b]",
    accent: "#c9a87c",
    decoration: "linear-gradient(135deg, rgba(201,168,124,0.15) 0%, transparent 60%)",
  },
  {
    title: "Roots of Gold",
    author: "Efua Mensah",
    genre: "Biography",
    bg: "from-[#3d2b1f] via-[#5c3d2e] to-[#8b6914]",
    accent: "#f0d68a",
    decoration: "radial-gradient(circle at 20% 80%, rgba(240,214,138,0.25) 0%, transparent 50%)",
  },
  {
    title: "The Leader's Blueprint",
    author: "James Okafor",
    genre: "Business",
    bg: "from-[#0a192f] via-[#112240] to-[#1d3557]",
    accent: "#64ffda",
    decoration: "linear-gradient(45deg, rgba(100,255,218,0.1) 0%, transparent 50%)",
  },
  {
    title: "Whispers in the Dark",
    author: "Ama Darko",
    genre: "Mystery",
    bg: "from-[#1a1a1a] via-[#2d2d2d] to-[#0d0d0d]",
    accent: "#ff6b35",
    decoration: "radial-gradient(circle at 70% 30%, rgba(255,107,53,0.2) 0%, transparent 40%)",
  },
  {
    title: "Heartstrings",
    author: "Nana Aba Mensah",
    genre: "Romance",
    bg: "from-[#4a1942] via-[#6b2fa0] to-[#2d1b69]",
    accent: "#f8a5c2",
    decoration: "radial-gradient(circle at 30% 70%, rgba(248,165,194,0.2) 0%, transparent 50%)",
  },
  {
    title: "Faith Over Fear",
    author: "Pastor David Asante",
    genre: "Faith & Inspiration",
    bg: "from-[#1b4332] via-[#2d6a4f] to-[#40916c]",
    accent: "#d4a373",
    decoration: "linear-gradient(180deg, rgba(212,163,115,0.15) 0%, transparent 60%)",
  },
  {
    title: "The Self Development Code",
    author: "Dr. Sarah Chen",
    genre: "Self Development",
    bg: "from-[#2b2d42] via-[#3d405b] to-[#5c6078]",
    accent: "#ef476f",
    decoration: "radial-gradient(circle at 50% 50%, rgba(239,71,111,0.15) 0%, transparent 50%)",
  },
  {
    title: "Echoes of Justice",
    author: "Michael Adeyemi",
    genre: "Fiction",
    bg: "from-[#1a1423] via-[#2c1e3f] to-[#4a2c6a]",
    accent: "#ffd166",
    decoration: "linear-gradient(135deg, rgba(255,209,102,0.12) 0%, transparent 50%)",
  },
  {
    title: "Legacy of Kings",
    author: "Oluwaseun Bankole",
    genre: "Historical Fiction",
    bg: "from-[#3c1518] via-[#69140e] to-[#a44200]",
    accent: "#f2e8cf",
    decoration: "radial-gradient(circle at 80% 80%, rgba(242,232,207,0.2) 0%, transparent 40%)",
  },
];

function BookCover({ book }: { book: (typeof books)[0] }) {
  return (
    <div
      className="relative w-[140px] sm:w-[160px] md:w-[170px] lg:w-[180px] h-[210px] sm:h-[240px] md:h-[255px] lg:h-[270px] rounded-md overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] cursor-pointer flex-shrink-0 group"
    >
      {/* Book spine effect */}
      <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-b from-white/20 via-white/5 to-white/15 z-20" />

      {/* Book cover background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${book.bg}`}>
        <div className="absolute inset-0" style={{ background: book.decoration }} />
      </div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-10"
        style={{ backgroundColor: book.accent }}
      />

      {/* Genre tag */}
      <div
        className="absolute top-4 right-3 px-2 py-0.5 rounded-sm text-[8px] sm:text-[9px] font-bold uppercase tracking-wider z-10"
        style={{ backgroundColor: book.accent, color: "#fff" }}
      >
        {book.genre}
      </div>

      {/* Book content */}
      <div className="relative z-10 flex flex-col justify-between h-full px-5 py-6 sm:px-6 sm:py-7">
        {/* Top decorative element */}
        <div className="mt-4">
          <div
            className="w-8 h-[2px] mb-3 opacity-60"
            style={{ backgroundColor: book.accent }}
          />
          <h3
            className="text-base sm:text-lg lg:text-xl font-bold leading-tight tracking-tight"
            style={{ color: "#ffffff", fontFamily: "Georgia, serif" }}
          >
            {book.title}
          </h3>
        </div>

        {/* Bottom */}
        <div>
          <div
            className="w-12 h-[1px] mb-2 opacity-40"
            style={{ backgroundColor: book.accent }}
          />
          <p
            className="text-[10px] sm:text-xs font-medium uppercase tracking-widest opacity-80"
            style={{ color: book.accent, fontFamily: "Georgia, serif" }}
          >
            {book.author}
          </p>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

      {/* Bottom edge shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent z-10" />
    </div>
  );
}

export function FeaturedBooks() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const positionRef = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const speed = 25;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isPaused) {
        positionRef.current -= speed * delta;
        const totalWidth = el.scrollWidth / 2;
        if (positionRef.current <= -totalWidth) {
          positionRef.current += totalWidth;
        }
      }

      el.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);

  return (
    <section ref={sectionRef} className="py-10 sm:py-14 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B5E34]">
            Featured Titles
          </span>
          <h2
            className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1E1E1E]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Books Published Through Statement Publications
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5C4A3D] max-w-2xl mx-auto">
            Discover inspiring books from independent authors publishing through our platform.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden"
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />

        <div
          ref={scrollRef}
          className="flex gap-5 sm:gap-6 px-8 sm:px-12 will-change-transform"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {[...books, ...books].map((book, i) => (
            <BookCover key={`${book.title}-${i}`} book={book} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
