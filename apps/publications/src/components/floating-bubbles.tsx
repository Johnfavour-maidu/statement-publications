"use client";

import { useMemo } from "react";

interface Bubble {
  id: number;
  size: number;
  left: string;
  delay: string;
  duration: string;
  opacity: number;
  color: string;
}

const COLORS = [
  "from-[#D8B27A] to-[#EBC9A8]",
  "from-[#EBC9A8] to-[#F2D8BE]",
  "from-[#C9A06A] to-[#D8B27A]",
];

export function FloatingBubbles({ count = 18, className = "" }: { count?: number; className?: string }) {
  const bubbles: Bubble[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 22,
      left: `${2 + Math.random() * 96}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${3 + Math.random() * 3.3}s`,
      opacity: 0.85 + Math.random() * 0.05,
      color: COLORS[i % COLORS.length],
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute rounded-full bg-gradient-to-br ${bubble.color} animate-bubble-float-burst`}
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.left,
            bottom: "-30px",
            opacity: bubble.opacity,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
            filter: bubble.size > 14 ? "blur(3px)" : "blur(1.5px)",
          }}
        />
      ))}
    </div>
  );
}
