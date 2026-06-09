"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence, MotionValue } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

// ── Publishing SVG Icons ──────────────────────────────────────
function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function BookClosedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function PenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function FeatherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function GlassesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="15" r="4" />
      <circle cx="18" cy="15" r="4" />
      <path d="M10 15h4" />
      <path d="M2 15V9a2 2 0 0 1 2-2h1" />
      <path d="M22 15V9a2 2 0 0 0-2-2h-1" />
    </svg>
  );
}

function ScrollIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
    </svg>
  );
}

// ── Types ──────────────────────────────────────────────────────
interface OrbitalElement {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  size: number;
  opacity: number;
  layer: 1 | 2 | 3;
  orbitRadius: number;
  orbitSpeed: number;
  startAngle: number;
  color: string;
  rotationSpeed: number;
}

interface FloatingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface SpecialEffect {
  id: number;
  type: "page-turn" | "quote-fade" | "pen-draw" | "page-drift";
  x: number;
  y: number;
  delay: number;
}

// ── Constants ──────────────────────────────────────────────────
const BRAND_COLORS = {
  peach: "#EBC9A8",
  beige: "#F2D8BE",
  charcoal: "#1D1D1D",
  gold: "#D8B27A",
  cream: "#FDF6EE",
  warmGray: "#9CA3AF",
};

const FLOATING_WORDS = ["Story", "Publish", "Inspire", "Create", "Author", "Legacy", "Voice", "Dream", "Write", "Imagine"];

const ICONS_BY_LAYER = {
  1: [BookOpenIcon, PenIcon, FeatherIcon, GlassesIcon],
  2: [BookClosedIcon, BookmarkIcon, ScrollIcon, LightbulbIcon],
  3: [QuoteIcon],
};

// ── Hook: Reduced Motion ───────────────────────────────────────
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ── Hook: Mouse Position ───────────────────────────────────────
function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2);
      y.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);
  return { x, y };
}

// ── Orbital Element Generator ──────────────────────────────────
function generateOrbitalElements(count: number, layer: 1 | 2 | 3): OrbitalElement[] {
  const icons = ICONS_BY_LAYER[layer];
  const layerSpeedMultiplier = layer === 1 ? 1.4 : layer === 2 ? 1 : 0.6;
  const layerOpacity = layer === 1 ? 0.35 : layer === 2 ? 0.25 : 0.15;
  const layerSizeRange = layer === 1 ? [28, 44] : layer === 2 ? [22, 36] : [18, 28];

  return Array.from({ length: count }, (_, i) => ({
    id: layer * 100 + i,
    icon: icons[i % icons.length],
    size: layerSizeRange[0] + Math.random() * (layerSizeRange[1] - layerSizeRange[0]),
    opacity: layerOpacity * (0.7 + Math.random() * 0.3),
    layer,
    orbitRadius: 200 + Math.random() * 250,
    orbitSpeed: (15 + Math.random() * 20) * layerSpeedMultiplier,
    startAngle: Math.random() * 360,
    color: [BRAND_COLORS.peach, BRAND_COLORS.gold, BRAND_COLORS.beige, BRAND_COLORS.warmGray][Math.floor(Math.random() * 4)],
    rotationSpeed: 20 + Math.random() * 40,
  }));
}

// ── Orbital Element Component ──────────────────────────────────
function OrbitalElementItem({
  element,
  mouseX,
  mouseY,
  reducedMotion,
  containerWidth,
  containerHeight,
}: {
  element: OrbitalElement;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  reducedMotion: boolean;
  containerWidth: number;
  containerHeight: number;
}) {
  const Icon = element.icon;
  const parallaxMultiplier = element.layer === 1 ? 15 : element.layer === 2 ? 8 : 3;

  const floatX = useTransform(mouseX, (v) => v * parallaxMultiplier);
  const floatY = useTransform(mouseY, (v) => v * parallaxMultiplier);

  const springX = useSpring(floatX, { stiffness: 50, damping: 30 });
  const springY = useSpring(floatY, { stiffness: 50, damping: 30 });

  if (reducedMotion) {
    const angle = (element.startAngle * Math.PI) / 180;
    const cx = containerWidth / 2 + Math.cos(angle) * element.orbitRadius - element.size / 2;
    const cy = containerHeight / 2 + Math.sin(angle) * element.orbitRadius - element.size / 2;
    return (
      <div
        className="absolute pointer-events-none"
        style={{ left: cx, top: cy, width: element.size, height: element.size, opacity: element.opacity * 0.5 }}
      >
        <div className="w-full h-full" style={{ color: element.color }}>
        <Icon className="w-full h-full" />
      </div>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: element.size,
        height: element.size,
        x: springX,
        y: springY,
      }}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        rotate: { duration: element.rotationSpeed, repeat: Infinity, ease: "linear" },
      }}
    >
      <motion.div
        className="w-full h-full"
        animate={{
          rotate: [element.startAngle, element.startAngle + 360],
          x: [
            Math.cos((element.startAngle * Math.PI) / 180) * element.orbitRadius,
            Math.cos(((element.startAngle + 90) * Math.PI) / 180) * element.orbitRadius,
            Math.cos(((element.startAngle + 180) * Math.PI) / 180) * element.orbitRadius,
            Math.cos(((element.startAngle + 270) * Math.PI) / 180) * element.orbitRadius,
            Math.cos(((element.startAngle + 360) * Math.PI) / 180) * element.orbitRadius,
          ],
          y: [
            Math.sin((element.startAngle * Math.PI) / 180) * element.orbitRadius,
            Math.sin(((element.startAngle + 90) * Math.PI) / 180) * element.orbitRadius,
            Math.sin(((element.startAngle + 180) * Math.PI) / 180) * element.orbitRadius,
            Math.sin(((element.startAngle + 270) * Math.PI) / 180) * element.orbitRadius,
            Math.sin(((element.startAngle + 360) * Math.PI) / 180) * element.orbitRadius,
          ],
          opacity: [element.opacity * 0.6, element.opacity, element.opacity * 0.6],
        }}
        transition={{
          duration: element.orbitSpeed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-full h-full drop-shadow-sm" style={{ color: element.color }}>
          <Icon className="w-full h-full" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Floating Word Component ────────────────────────────────────
function FloatingWordItem({
  word,
  reducedMotion,
}: {
  word: FloatingWord;
  reducedMotion: boolean;
}) {
  if (reducedMotion) {
    return (
      <div
        className="absolute pointer-events-none text-charcoal/[0.04] font-serif italic select-none"
        style={{ left: `${word.x}%`, top: `${word.y}%`, fontSize: `${14 + Math.random() * 10}px` }}
      >
        {word.word}
      </div>
    );
  }

  return (
    <motion.div
      className="absolute pointer-events-none text-charcoal/[0.04] font-serif italic select-none whitespace-nowrap"
      style={{ left: `${word.x}%`, top: `${word.y}%` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 0.06, 0.06, 0],
        scale: [0.8, 1, 1, 0.8],
        y: [0, -15, -15, -30],
      }}
      transition={{
        duration: word.duration,
        repeat: Infinity,
        delay: word.delay,
        ease: "easeInOut",
      }}
    >
      <span style={{ fontSize: `${14 + Math.random() * 10}px` }}>{word.word}</span>
    </motion.div>
  );
}

// ── Special Effect Component ───────────────────────────────────
function SpecialEffectItem({
  effect,
  reducedMotion,
}: {
  effect: SpecialEffect;
  reducedMotion: boolean;
}) {
  if (reducedMotion) return null;

  const effectContent = useMemo(() => {
    switch (effect.type) {
      case "quote-fade":
        return (
          <motion.div
            className="absolute pointer-events-none"
            style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.08, 0.08, 0], scale: [0.5, 1, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, delay: effect.delay, ease: "easeInOut" }}
          >
            <div style={{ color: BRAND_COLORS.gold }}><QuoteIcon className="w-16 h-16" /></div>
          </motion.div>
        );
      case "page-drift":
        return (
          <motion.div
            className="absolute pointer-events-none"
            style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
            initial={{ opacity: 0, y: 20, rotate: -5 }}
            animate={{
              opacity: [0, 0.06, 0.06, 0],
              y: [20, -30, -60],
              rotate: [-5, 2, 8],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: effect.delay, ease: "easeInOut" }}
          >
            <div style={{ color: BRAND_COLORS.peach }}><ScrollIcon className="w-12 h-12" /></div>
          </motion.div>
        );
      case "pen-draw":
        return (
          <motion.div
            className="absolute pointer-events-none"
            style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: [0, 0.06, 0.06, 0],
              scaleX: [0, 1, 1, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: effect.delay, ease: "easeInOut" }}
          >
            <div className="h-[1px] w-20 origin-left" style={{ background: `linear-gradient(90deg, transparent, ${BRAND_COLORS.gold}, transparent)` }} />
          </motion.div>
        );
      default:
        return null;
    }
  }, [effect, reducedMotion]);

  return effectContent;
}

// ── Main Component ─────────────────────────────────────────────
export function AnimatedHeroBackground() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  const { x: mouseX, y: mouseY } = useMousePosition();

  // Track container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Generate orbital elements based on screen size
  const layerCounts = useMemo(() => {
    if (isMobile) return { 1: 2, 2: 2, 3: 1 };
    if (isTablet) return { 1: 4, 2: 3, 3: 2 };
    return { 1: 6, 2: 5, 3: 3 };
  }, [isMobile, isTablet]);

  const elements = useMemo(() => [
    ...generateOrbitalElements(layerCounts[1], 1),
    ...generateOrbitalElements(layerCounts[2], 2),
    ...generateOrbitalElements(layerCounts[3], 3),
  ], [layerCounts]);

  // Generate floating words
  const floatingWords = useMemo<FloatingWord[]>(() => {
    const count = isMobile ? 4 : isTablet ? 6 : 8;
    return FLOATING_WORDS.slice(0, count).map((word, i) => ({
      id: i,
      word,
      x: 5 + Math.random() * 85,
      y: 10 + Math.random() * 75,
      delay: i * 1.5,
      duration: 6 + Math.random() * 4,
    }));
  }, [isMobile, isTablet]);

  // Generate special effects
  const specialEffects = useMemo<SpecialEffect[]>(() => {
    if (isMobile) return [];
    const types: SpecialEffect["type"][] = ["quote-fade", "page-drift", "pen-draw"];
    return Array.from({ length: isTablet ? 2 : 3 }, (_, i) => ({
      id: i,
      type: types[i % types.length],
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      delay: i * 3,
    }));
  }, [isMobile, isTablet]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Gradient orbs for depth */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.08]"
          style={{ background: `radial-gradient(circle, ${BRAND_COLORS.peach}, transparent)` }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.06]"
          style={{ background: `radial-gradient(circle, ${BRAND_COLORS.gold}, transparent)` }}
        />
      </div>

      {/* Layer 3 — Background (slowest) */}
      {elements.filter(e => e.layer === 3).map((el) => (
        <OrbitalElementItem
          key={el.id}
          element={el}
          mouseX={mouseX}
          mouseY={mouseY}
          reducedMotion={reducedMotion}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />
      ))}

      {/* Layer 2 — Middle */}
      {elements.filter(e => e.layer === 2).map((el) => (
        <OrbitalElementItem
          key={el.id}
          element={el}
          mouseX={mouseX}
          mouseY={mouseY}
          reducedMotion={reducedMotion}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />
      ))}

      {/* Layer 1 — Foreground (fastest) */}
      {elements.filter(e => e.layer === 1).map((el) => (
        <OrbitalElementItem
          key={el.id}
          element={el}
          mouseX={mouseX}
          mouseY={mouseY}
          reducedMotion={reducedMotion}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />
      ))}

      {/* Floating Words */}
      {floatingWords.map((word) => (
        <FloatingWordItem key={word.id} word={word} reducedMotion={reducedMotion} />
      ))}

      {/* Special Effects */}
      {specialEffects.map((effect) => (
        <SpecialEffectItem key={effect.id} effect={effect} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}
