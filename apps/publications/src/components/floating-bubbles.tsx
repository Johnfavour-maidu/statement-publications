"use client";

import { useMemo } from "react";

interface Bubble {
  id: number;
  size: number;
  left: string;
  delay: string;
  duration: string;
  opacity: number;
}

export function FloatingBubbles({ className = "" }: { className?: string }) {
  const bubbles: Bubble[] = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 12,
      left: `${10 + Math.random() * 80}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${12 + Math.random() * 10}s`,
      opacity: 0.03 + Math.random() * 0.05,
    }));
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-[#D8B27A] to-[#EBC9A8] animate-bubble-float"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.left,
            bottom: "-20px",
            opacity: bubble.opacity,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}
