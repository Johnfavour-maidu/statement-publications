"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";

/* ─── Publishing Elements (SVG paths) ────────────────────── */

const elements = {
  book: "M3 4a1 1 0 011-1h14a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 0v14h12V4H5zm3 2h6v2H8V6zm0 4h6v2H8v-2z",
  closedBook: "M4 2a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 3h5v14H5V5zm7 0h5v14h-5V5z",
  pen: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
  quill: "M20.71 4.04a1 1 0 00-1.42 0L7.5 15.83l-1.92 4.92 4.92-1.92L21.54 5.83a1 1 0 000-1.42l-.83-.37zM9.17 15.42l-3.75 3.75-.42-2.33 2.33.42 1.84-1.84z",
  page: "M4 4a2 2 0 012-2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm10-1v5h5M7 13h6M7 17h4",
  journal: "M4 2a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h16v16H4V4zm3 3v2h4V7H7zm0 4v2h10v-2H7zm0 4v2h8v-2H7z",
  quote: "M10 8c-1.1 0-2 .9-2 2v4h4v-4H8c0-1.1.9-2 2-2V4c-2.2 0-4 1.8-4 4v2zm8 0c-1.1 0-2 .9-2 2v4h4v-4h-4c0-1.1.9-2 2-2V4c-2.2 0-4 1.8-4 4v2z",
  bookmark: "M5 2h14a1 1 0 011 1v19l-8-4-8 4V3a1 1 0 011-1z",
  lightbulb: "M9 21h6M12 3a6 6 0 00-6 6c0 2.22 1.21 4.15 3 5.19V17h6v-2.81c1.79-1.04 3-2.97 3-5.19a6 6 0 00-6-6z",
  glasses: "M4 10a4 4 0 014-4h8a4 4 0 014 4 4 4 0 01-4 4H8a4 4 0 01-4-4zm4-2a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z",
  inkDrop: "M12 2c-4 6-7 9-7 13a7 7 0 0014 0c0-4-3-7-7-13z",
  manuscript: "M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v16h12V4H6zm2 3h8v1H8V7zm0 3h8v1H8v-3zm0 3h6v1H8v-1z",
};

/* ─── Layer Configuration ────────────────────────────────── */

interface LayerConfig {
  speed: number;
  elementSize: number;
  opacity: number;
  count: number;
  radius: number;
  elementKeys: (keyof typeof elements)[];
  floatingWords?: string[];
}

const layers: LayerConfig[] = [
  {
    speed: 0.15,
    elementSize: 28,
    opacity: 0.12,
    count: 8,
    radius: 320,
    elementKeys: ["book", "pen", "quill"],
  },
  {
    speed: 0.08,
    elementSize: 22,
    opacity: 0.08,
    count: 10,
    radius: 400,
    elementKeys: ["page", "journal", "manuscript"],
    floatingWords: ["Story", "Publish", "Create"],
  },
  {
    speed: 0.04,
    elementSize: 18,
    opacity: 0.05,
    count: 12,
    radius: 500,
    elementKeys: ["quote", "bookmark", "lightbulb", "glasses", "inkDrop"],
    floatingWords: ["Inspire", "Author", "Legacy", "Voice"],
  },
];

/* ─── Floating Element ────────────────────────────────────── */

function FloatingElement({
  path,
  size,
  opacity,
  angle,
  radius,
  speed,
  mouseX,
  mouseY,
  delay,
}: {
  path: string;
  size: number;
  opacity: number;
  angle: number;
  radius: number;
  speed: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  delay: number;
}) {
  const x = useSpring(0, { stiffness: 50, damping: 30 });
  const y = useSpring(0, { stiffness: 50, damping: 30 });
  const rotate = useSpring(0, { stiffness: 30, damping: 20 });

  useEffect(() => {
    let currentAngle = angle;
    let lastTime = performance.now();
    let animFrame: number;

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      currentAngle += speed * delta * (180 / Math.PI);

      const rad = (currentAngle * Math.PI) / 180;
      const targetX = Math.cos(rad) * radius;
      const targetY = Math.sin(rad) * radius * 0.4;

      x.set(targetX);
      y.set(targetY);
      rotate.set(currentAngle * 0.3);

      animFrame = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      animFrame = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animFrame);
    };
  }, [angle, radius, speed, delay, x, y, rotate]);

  const mouseXEffect = useTransform(mouseX, (v) => v * 0.02);
  const mouseYEffect = useTransform(mouseY, (v) => v * 0.02);

  return (
    <motion.div
      className="absolute"
      style={{
        x,
        y,
        rotate,
      }}
    >
      <motion.div
        style={{
          x: mouseXEffect,
          y: mouseYEffect,
        }}
      >
        <svg
          className="text-[#8A6A4A]"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity }}
        >
          <path d={path} />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ─── Floating Word ───────────────────────────────────────── */

function FloatingWord({
  word,
  opacity,
  radius,
  speed,
  angle,
  mouseX,
  mouseY,
  delay,
}: {
  word: string;
  opacity: number;
  radius: number;
  speed: number;
  angle: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  delay: number;
}) {
  const x = useSpring(0, { stiffness: 40, damping: 25 });
  const y = useSpring(0, { stiffness: 40, damping: 25 });
  const [currentOpacity, setCurrentOpacity] = useState(opacity);

  useEffect(() => {
    let currentAngle = angle;
    let lastTime = performance.now();
    let animFrame: number;

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      currentAngle += speed * delta * (180 / Math.PI);

      const rad = (currentAngle * Math.PI) / 180;
      x.set(Math.cos(rad) * radius);
      y.set(Math.sin(rad) * radius * 0.3);

      animFrame = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      animFrame = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animFrame);
    };
  }, [angle, radius, speed, delay, x, y]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOpacity(opacity * 0.3);
      setTimeout(() => setCurrentOpacity(opacity), 2000);
    }, 6000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [opacity]);

  const mouseXEffect = useTransform(mouseX, (v) => v * 0.015);
  const mouseYEffect = useTransform(mouseY, (v) => v * 0.015);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ x, y }}
    >
      <motion.div
        style={{
          x: mouseXEffect,
          y: mouseYEffect,
          opacity: currentOpacity,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <span
          className="text-[#8A6A4A] font-serif italic whitespace-nowrap"
          style={{ fontSize: "14px" }}
        >
          {word}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Special Effect (Page Turn / Quote Fade) ─────────────── */

function SpecialEffect({ delay }: { delay: number }) {
  const [effect, setEffect] = useState(0);
  const opacity = useSpring(0, { stiffness: 30, damping: 20 });
  const y = useSpring(0, { stiffness: 30, damping: 20 });
  const rotate = useSpring(0, { stiffness: 20, damping: 15 });

  useEffect(() => {
    const interval = setInterval(() => {
      setEffect((prev) => (prev + 1) % 3);
      opacity.set(0.08);
      y.set(-20);
      rotate.set(-5);

      setTimeout(() => {
        opacity.set(0);
        y.set(0);
        rotate.set(0);
      }, 3000);
    }, 8000 + delay * 2000);

    return () => clearInterval(interval);
  }, [delay, opacity, y, rotate]);

  const effects = [
    // Page turn
    <svg key="page" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A6A4A" strokeWidth={1} opacity={0.1}>
      <path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
      <path d="M4 4l8 8-8 8" />
    </svg>,
    // Quote
    <svg key="quote" width="24" height="24" viewBox="0 0 24 24" fill="#8A6A4A" opacity={0.1}>
      <path d="M10 8c-1.1 0-2 .9-2 2v4h4v-4H8c0-1.1.9-2 2-2V4c-2.2 0-4 1.8-4 4v2zm8 0c-1.1 0-2 .9-2 2v4h4v-4h-4c0-1.1.9-2 2-2V4c-2.2 0-4 1.8-4 4v2z" />
    </svg>,
    // Pen line
    <svg key="pen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A6A4A" strokeWidth={1} opacity={0.1}>
      <path d="M3 21l4-4m0 0l10-10 2-2-2-2-10 10-4 4z" />
    </svg>,
  ];

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ opacity, y, rotate }}
    >
      {effects[effect]}
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

export function AnimatedHeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      mouseX.set(e.clientX - rect.left - centerX);
      mouseY.set(e.clientY - rect.top - centerY);
    },
    [mouseX, mouseY]
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      onMouseMove={handleMouseMove}
      aria-hidden="true"
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/50 dark:to-[#0a0a0a]/50" />

      {/* Layers */}
      {layers.map((layer, layerIndex) => (
        <div
          key={layerIndex}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Floating elements */}
          {Array.from({ length: layer.count }).map((_, i) => {
            const elementKey = layer.elementKeys[i % layer.elementKeys.length];
            const angle = (360 / layer.count) * i;
            const delay = i * 0.3;

            return (
              <FloatingElement
                key={`${layerIndex}-${i}`}
                path={elements[elementKey]}
                size={layer.elementSize + (i % 3) * 4}
                opacity={layer.opacity}
                angle={angle}
                radius={layer.radius + (i % 3) * 30}
                speed={layer.speed * (1 + (i % 3) * 0.2)}
                mouseX={mouseX}
                mouseY={mouseY}
                delay={delay}
              />
            );
          })}

          {/* Floating words */}
          {layer.floatingWords?.map((word, i) => (
            <FloatingWord
              key={`word-${layerIndex}-${i}`}
              word={word}
              opacity={layer.opacity * 0.8}
              radius={layer.radius - 50 + i * 40}
              speed={layer.speed * 0.7}
              angle={(360 / (layer.floatingWords?.length || 1)) * i + 90}
              mouseX={mouseX}
              mouseY={mouseY}
              delay={i * 0.5 + 1}
            />
          ))}
        </div>
      ))}

      {/* Special effects */}
      <SpecialEffect delay={0} />
      <SpecialEffect delay={3} />
      <SpecialEffect delay={6} />

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(253,246,238,0.8) 100%)"
      }} />
    </div>
  );
}
