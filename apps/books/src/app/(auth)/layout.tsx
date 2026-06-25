"use client";

import { motion } from "framer-motion";

const bubbles = [
  { size: 120, x: "10%", y: "20%", delay: 0, duration: 18 },
  { size: 80, x: "80%", y: "15%", delay: 2, duration: 22 },
  { size: 150, x: "70%", y: "70%", delay: 4, duration: 20 },
  { size: 60, x: "20%", y: "80%", delay: 1, duration: 16 },
  { size: 100, x: "50%", y: "10%", delay: 3, duration: 24 },
  { size: 90, x: "85%", y: "50%", delay: 5, duration: 19 },
  { size: 70, x: "15%", y: "55%", delay: 2.5, duration: 21 },
  { size: 110, x: "60%", y: "85%", delay: 1.5, duration: 17 },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #FDF6EE 0%, #ffffff 40%, #F5E6D3 70%, #FDF6EE 100%)" }}>
      {/* Animated Bubbles */}
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.x,
            top: bubble.y,
            background: `radial-gradient(circle, rgba(216, 178, 122, 0.08) 0%, rgba(216, 178, 122, 0.02) 70%, transparent 100%)`,
            border: `1px solid rgba(216, 178, 122, 0.06)`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.05, 0.95, 1.02, 1],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(216, 178, 122, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(235, 201, 168, 0.06) 0%, transparent 50%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
}
