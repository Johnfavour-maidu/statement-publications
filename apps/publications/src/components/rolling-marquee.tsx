"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen,
  Pen,
  CheckCircle,
  Hash,
  Palette,
  User,
  Megaphone,
  Headphones,
  Newspaper,
  Globe,
  Users,
  Award,
  FileText,
  Feather,
  Bookmark,
} from "lucide-react";

const marqueeItems = [
  { icon: BookOpen, label: "Book Publishing", sub: "Professional publishing" },
  { icon: Pen, label: "Book Editing", sub: "Expert editors" },
  { icon: CheckCircle, label: "Proofreading", sub: "Error-free content" },
  { icon: Hash, label: "ISBN Registration", sub: "Global identification" },
  { icon: Palette, label: "Cover Design", sub: "Stunning visuals" },
  { icon: User, label: "Author Branding", sub: "Build your identity" },
  { icon: Megaphone, label: "Marketing Services", sub: "Reach more readers" },
  { icon: Headphones, label: "Audiobook Publishing", sub: "Voice your story" },
  { icon: Newspaper, label: "Magazine Publishing", sub: "Periodical content" },
  { icon: Globe, label: "Global Distribution", sub: "Worldwide reach" },
  { icon: Users, label: "Published Authors", sub: "Join our community" },
  { icon: Award, label: "Bestselling Books", sub: "Chart-topping titles" },
  { icon: FileText, label: "Manuscript Review", sub: "Expert feedback" },
  { icon: Feather, label: "Creative Writing", sub: "Craft your words" },
  { icon: Bookmark, label: "Digital Publishing", sub: "eBook & online" },
];

function MarqueeCard({ item }: { item: (typeof marqueeItems)[0] }) {
  const Icon = item.icon;
  return (
    <div className="flex-shrink-0 mx-2.5">
      <div className="group flex items-center gap-3 rounded-xl border border-[#EBC9A8]/30 bg-white/80 backdrop-blur-sm px-5 py-3 shadow-sm hover:shadow-md hover:border-[#D8B27A]/50 transition-all duration-300 cursor-default">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#EBC9A8] to-[#F2D8BE]">
          <Icon className="h-4.5 w-4.5 text-[#8A6A4A]" />
        </div>
        <div className="whitespace-nowrap">
          <p className="text-sm font-semibold text-charcoal leading-tight">{item.label}</p>
          <p className="text-[11px] text-charcoal/50">{item.sub}</p>
        </div>
      </div>
    </div>
  );
}

export function RollingMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const positionRef = useRef(0);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const speed = 40; // pixels per second
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isPaused) {
        positionRef.current -= speed * delta;
        const totalWidth = content.scrollWidth / 2;
        if (positionRef.current <= -totalWidth) {
          positionRef.current += totalWidth;
        }
      }

      content.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);

  return (
    <section className="relative py-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #EBC9A8 0%, #F2D8BE 50%, #D8B27A 100%)" }}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none" style={{ background: "linear-gradient(to right, #EBC9A8, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none" style={{ background: "linear-gradient(to left, #D8B27A, transparent)" }} />

      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={contentRef} className="flex will-change-transform">
          {marqueeItems.map((item, i) => (
            <MarqueeCard key={`a-${i}`} item={item} />
          ))}
          {marqueeItems.map((item, i) => (
            <MarqueeCard key={`b-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
