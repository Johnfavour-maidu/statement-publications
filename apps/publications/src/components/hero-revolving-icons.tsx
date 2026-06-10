"use client";

import { useEffect, useState } from "react";

const authorIcons = [
  { label: "Book Open",    path: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" },
  { label: "Pen",          path: "M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" },
  { label: "Feather",      path: "M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z M16 8l-8 8" },
  { label: "Bookmark",     path: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" },
  { label: "Quote",        path: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" },
  { label: "Scroll",       path: "M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4 M19 17V5a2 2 0 0 0-2-2H4" },
  { label: "Lightbulb",    path: "M9 18h6 M10 22h4 M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" },
  { label: "Glasses",      path: "M6 15a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4 M2 15V9a2 2 0 0 1 2-2h1 M22 15V9a2 2 0 0 0-2-2h-1" },
  { label: "Headphones",   path: "M3 18v-6a9 9 0 0 1 18 0v6 M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" },
  { label: "Globe",        path: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" },
  { label: "Star",         path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  { label: "Award",        path: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12" },
  { label: "Users",        path: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" },
  { label: "File Text",    path: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
  { label: "Edit",         path: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" },
];

export function HeroRevolvingIcons() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const iconCount = authorIcons.length;
  const angleStep = 360 / iconCount;
  const radius = 300;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient orbs for depth */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-15 blur-[140px]"
        style={{ background: "radial-gradient(circle, #EBC9A8, transparent)" }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
        style={{ background: "radial-gradient(circle, #D8B27A, transparent)" }}
      />

      {/* Orbit container */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
        <div
          className="hero-orbit relative"
          style={{ width: radius * 2, height: radius * 2 }}
        >
          {authorIcons.map((icon, i) => {
            const angle = angleStep * i;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            return (
              <div
                key={icon.label}
                className="absolute hero-icon"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -30,
                  marginTop: -30,
                  transform: `translate(${x}px, ${y}px)`,
                  animationDelay: `${-(angle / 360) * 60}s`,
                }}
              >
                <div className="w-15 h-15 rounded-full flex items-center justify-center bg-white/90 border border-[#D8B27A]/30 shadow-lg">
                  <svg
                    className="w-7 h-7 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={icon.path} />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
