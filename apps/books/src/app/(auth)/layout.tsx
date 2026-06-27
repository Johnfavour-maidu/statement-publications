"use client";

import { useMemo } from "react";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bubbles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const isBurst = i % 2 === 0;
      const size = 5 + seededRandom(i * 7 + 1) * 20;
      const left = seededRandom(i * 13 + 3) * 100;
      const delay = seededRandom(i * 17 + 5) * 8;
      const duration = 3 + seededRandom(i * 23 + 7) * 4;
      const opacity = 0.85 + seededRandom(i * 29 + 11) * 0.1;
      const blur = size > 15 ? 3 : 1.5;
      const colorIndex = i % 3;
      const gradients = [
        "from-[#D8B27A] to-[#EBC9A8]",
        "from-[#EBC9A8] to-[#F2D8BE]",
        "from-[#C9A06A] to-[#D8B27A]",
      ];
      return {
        size,
        left,
        delay,
        duration,
        opacity,
        blur,
        gradient: gradients[colorIndex],
        animation: isBurst ? "animate-bubble-float-burst" : "animate-bubble-float-top",
        position: isBurst ? "bottom" : "top",
      };
    });
  }, []);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #F5E6D3 0%, #F2D8BE 40%, #EBC9A8 100%)",
      }}
    >
      {/* Animated Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br ${bubble.gradient} ${bubble.animation}`}
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.left}%`,
              [bubble.position]: -30,
              opacity: bubble.opacity,
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`,
              filter: `blur(${bubble.blur}px)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
