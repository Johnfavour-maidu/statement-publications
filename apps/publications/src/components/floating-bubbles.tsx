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
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: 6 + Math.random() * 18,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${10 + Math.random() * 8}s`,
      opacity: 0.6 + Math.random() * 0.1,
    }));
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-[#D8B27A] to-[#EBC9A8] animate-bubble-float-burst"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.left,
            bottom: "-30px",
            opacity: bubble.opacity,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
            filter: "blur(2px)",
          }}
        />
      ))}
    </div>
  );
}
