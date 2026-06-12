"use client"

import { motion } from "framer-motion"

export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 500 650" xmlns="http://www.w3.org/2000/svg">
      {/* ==================== GRADIENT DEFINITIONS ==================== */}
      <defs>
        <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8B27A" />
          <stop offset="100%" stopColor="#EBC9A8" />
        </linearGradient>
        <linearGradient id="heroGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFEF9" />
          <stop offset="100%" stopColor="#F5EDE0" />
        </linearGradient>
        <linearGradient id="heroGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A6A4A" />
          <stop offset="100%" stopColor="#6B5238" />
        </linearGradient>
        <linearGradient id="heroGradBird" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A6A4A" />
          <stop offset="100%" stopColor="#D8B27A" />
        </linearGradient>
        <linearGradient id="heroGradGlobe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8B27A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#EBC9A8" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="heroGradBookCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A6A4A" />
          <stop offset="100%" stopColor="#6B5238" />
        </linearGradient>
        <linearGradient id="heroGradSpine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D8B27A" />
          <stop offset="100%" stopColor="#C9A36A" />
        </linearGradient>
        <filter id="heroShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#1D1D1D" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* ==================== LAYER 1: OPEN BOOK CENTERPIECE ==================== */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        {/* Book shadow */}
        <ellipse cx="250" cy="590" rx="150" ry="16" fill="#1D1D1D" opacity="0.08" />

        {/* Left page */}
        <path
          d="M100,490 Q100,480 110,478 L245,475 Q250,475 250,480 L250,575 Q250,580 245,580 L110,583 Q100,581 100,570 Z"
          fill="url(#heroGrad2)"
          stroke="#E5D9CA"
          strokeWidth="0.5"
        />
        {/* Left page text lines */}
        <rect x="118" y="495" width="110" height="2" rx="1" fill="#D8B27A" opacity="0.3" />
        <rect x="118" y="503" width="95" height="2" rx="1" fill="#D8B27A" opacity="0.25" />
        <rect x="118" y="511" width="105" height="2" rx="1" fill="#D8B27A" opacity="0.2" />
        <rect x="118" y="519" width="80" height="2" rx="1" fill="#D8B27A" opacity="0.25" />
        <rect x="118" y="527" width="100" height="2" rx="1" fill="#D8B27A" opacity="0.2" />
        <rect x="118" y="535" width="90" height="2" rx="1" fill="#D8B27A" opacity="0.25" />
        <rect x="118" y="543" width="70" height="2" rx="1" fill="#D8B27A" opacity="0.2" />
        <rect x="118" y="551" width="100" height="2" rx="1" fill="#D8B27A" opacity="0.25" />
        <rect x="118" y="559" width="60" height="2" rx="1" fill="#D8B27A" opacity="0.2" />

        {/* Right page */}
        <path
          d="M400,490 Q400,480 390,478 L255,475 Q250,475 250,480 L250,575 Q250,580 255,580 L390,583 Q400,581 400,570 Z"
          fill="url(#heroGrad2)"
          stroke="#E5D9CA"
          strokeWidth="0.5"
        />
        {/* Right page text lines */}
        <rect x="270" y="495" width="110" height="2" rx="1" fill="#D8B27A" opacity="0.3" />
        <rect x="270" y="503" width="100" height="2" rx="1" fill="#D8B27A" opacity="0.25" />
        <rect x="270" y="511" width="90" height="2" rx="1" fill="#D8B27A" opacity="0.2" />
        <rect x="270" y="519" width="105" height="2" rx="1" fill="#D8B27A" opacity="0.25" />
        <rect x="270" y="527" width="75" height="2" rx="1" fill="#D8B27A" opacity="0.2" />
        <rect x="270" y="535" width="110" height="2" rx="1" fill="#D8B27A" opacity="0.25" />
        <rect x="270" y="543" width="85" height="2" rx="1" fill="#D8B27A" opacity="0.2" />
        <rect x="270" y="551" width="95" height="2" rx="1" fill="#D8B27A" opacity="0.25" />
        <rect x="270" y="559" width="70" height="2" rx="1" fill="#D8B27A" opacity="0.2" />

        {/* Book spine (gold center) */}
        <rect x="247" y="475" width="6" height="105" rx="2" fill="url(#heroGradSpine)" />

        {/* Book cover edges */}
        <path
          d="M95,488 Q93,478 105,476 L247,472 L247,480 L105,484 Q98,485 95,488 Z"
          fill="url(#heroGradBookCover)"
          opacity="0.9"
        />
        <path
          d="M405,488 Q407,478 395,476 L253,472 L253,480 L395,484 Q402,485 405,488 Z"
          fill="url(#heroGradBookCover)"
          opacity="0.9"
        />
        <path
          d="M95,572 Q93,582 105,584 L247,588 L247,580 L105,576 Q98,575 95,572 Z"
          fill="url(#heroGradBookCover)"
          opacity="0.7"
        />
        <path
          d="M405,572 Q407,582 395,584 L253,588 L253,580 L395,576 Q402,575 405,572 Z"
          fill="url(#heroGradBookCover)"
          opacity="0.7"
        />

        {/* Gold decorative line on left cover */}
        <line x1="100" y1="492" x2="100" y2="568" stroke="#D8B27A" strokeWidth="0.8" opacity="0.5" />
        {/* Gold decorative line on right cover */}
        <line x1="400" y1="492" x2="400" y2="568" stroke="#D8B27A" strokeWidth="0.8" opacity="0.5" />
      </motion.g>

      {/* ==================== LAYER 2: MANUSCRIPT PAGES ==================== */}
      <motion.g
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
      >
        {/* Manuscript page 1 (left, tilted left) */}
        <g transform="translate(130, 340) rotate(-6, 55, 65)">
          <rect x="0" y="0" width="110" height="130" rx="3" fill="#FFFEF9" opacity="0.85" stroke="#E5D9CA" strokeWidth="0.5" />
          <rect x="12" y="14" width="70" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.35" />
          <rect x="12" y="21" width="80" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="12" y="28" width="65" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="12" y="35" width="85" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="12" y="42" width="60" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="12" y="49" width="75" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="12" y="56" width="50" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="12" y="63" width="80" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="12" y="70" width="65" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="12" y="77" width="70" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="12" y="84" width="55" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="12" y="91" width="80" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="12" y="98" width="45" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
        </g>

        {/* Manuscript page 2 (center-right, tilted right) */}
        <g transform="translate(280, 310) rotate(4, 50, 60)">
          <rect x="0" y="0" width="100" height="120" rx="3" fill="#FFFEF9" opacity="0.9" stroke="#E5D9CA" strokeWidth="0.5" />
          <rect x="10" y="12" width="65" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="10" y="19" width="75" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="10" y="26" width="55" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="10" y="33" width="80" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="10" y="40" width="60" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="10" y="47" width="70" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="10" y="54" width="50" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="10" y="61" width="75" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="10" y="68" width="65" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="10" y="75" width="55" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="10" y="82" width="70" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="10" y="89" width="45" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
        </g>

        {/* Manuscript page 3 (far left, smaller, tilted left more) */}
        <g transform="translate(80, 325) rotate(-8, 40, 55)">
          <rect x="0" y="0" width="80" height="100" rx="3" fill="#FFFEF9" opacity="0.75" stroke="#E5D9CA" strokeWidth="0.5" />
          <rect x="9" y="10" width="50" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="9" y="16" width="55" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="9" y="22" width="45" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="9" y="28" width="60" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="9" y="34" width="40" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="9" y="40" width="55" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="9" y="46" width="50" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="9" y="52" width="35" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="9" y="58" width="55" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="9" y="64" width="45" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="9" y="70" width="50" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
        </g>

        {/* Manuscript page 4 (right, with city skyline, smaller) */}
        <g transform="translate(360, 350) rotate(7, 35, 50)">
          <rect x="0" y="0" width="70" height="90" rx="3" fill="#FFFEF9" opacity="0.7" stroke="#E5D9CA" strokeWidth="0.5" />
          <rect x="8" y="9" width="45" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="8" y="15" width="50" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="8" y="21" width="40" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="8" y="27" width="55" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="8" y="33" width="35" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          <rect x="8" y="39" width="48" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.25" />
          <rect x="8" y="45" width="42" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.3" />
          {/* City skyline silhouette at bottom edge */}
          <g opacity="0.15" fill="#1D1D1D">
            <rect x="8" y="72" width="4" height="12" />
            <rect x="14" y="68" width="3" height="16" />
            <rect x="19" y="74" width="5" height="10" />
            <rect x="26" y="66" width="3" height="18" />
            <rect x="31" y="70" width="4" height="14" />
            <rect x="37" y="72" width="6" height="12" />
            <rect x="45" y="68" width="3" height="16" />
            <rect x="50" y="74" width="4" height="10" />
            <rect x="56" y="70" width="3" height="14" />
            <rect x="61" y="72" width="4" height="12" />
          </g>
        </g>
      </motion.g>

      {/* ==================== LAYER 3: PUBLISHED BOOKS ==================== */}
      <motion.g
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
      >
        {/* Book 1 - Brown, left side */}
        <g transform="translate(105, 240) rotate(-4, 25, 75)">
          <rect x="0" y="0" width="50" height="150" rx="3" fill="#8A6A4A" />
          <rect x="2" y="0" width="46" height="150" rx="2" fill="#7A5A3A" />
          {/* Spine highlight */}
          <rect x="0" y="0" width="4" height="150" rx="1" fill="#9A7A5A" opacity="0.6" />
          {/* Title lines on spine */}
          <rect x="10" y="30" width="30" height="2" rx="1" fill="#D8B27A" opacity="0.6" />
          <rect x="14" y="38" width="22" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.4" />
          <rect x="12" y="48" width="26" height="1.5" rx="0.75" fill="#D8B27A" opacity="0.4" />
          {/* Top edge */}
          <rect x="0" y="0" width="50" height="4" rx="2" fill="#6B5238" opacity="0.5" />
        </g>

        {/* Book 2 - Gold, center */}
        <g transform="translate(215, 230) rotate(2, 22, 80)">
          <rect x="0" y="0" width="44" height="160" rx="3" fill="#D8B27A" />
          <rect x="2" y="0" width="40" height="160" rx="2" fill="#C9A36A" />
          {/* Spine highlight */}
          <rect x="0" y="0" width="4" height="160" rx="1" fill="#E8C88A" opacity="0.6" />
          {/* Title lines */}
          <rect x="10" y="28" width="24" height="2" rx="1" fill="#FFFEF9" opacity="0.5" />
          <rect x="12" y="36" width="20" height="1.5" rx="0.75" fill="#FFFEF9" opacity="0.35" />
          <rect x="11" y="46" width="22" height="1.5" rx="0.75" fill="#FFFEF9" opacity="0.35" />
          {/* Top edge */}
          <rect x="0" y="0" width="44" height="4" rx="2" fill="#B8945A" opacity="0.5" />
        </g>

        {/* Book 3 - Peach, right side */}
        <g transform="translate(330, 248) rotate(5, 20, 70)">
          <rect x="0" y="0" width="40" height="140" rx="3" fill="#EBC9A8" />
          <rect x="2" y="0" width="36" height="140" rx="2" fill="#DDB898" />
          {/* Spine highlight */}
          <rect x="0" y="0" width="4" height="140" rx="1" fill="#F5D8BE" opacity="0.6" />
          {/* Title lines */}
          <rect x="10" y="26" width="20" height="2" rx="1" fill="#8A6A4A" opacity="0.5" />
          <rect x="12" y="33" width="16" height="1.5" rx="0.75" fill="#8A6A4A" opacity="0.35" />
          <rect x="11" y="42" width="18" height="1.5" rx="0.75" fill="#8A6A4A" opacity="0.35" />
          {/* Top edge */}
          <rect x="0" y="0" width="40" height="4" rx="2" fill="#D8B27A" opacity="0.4" />
        </g>
      </motion.g>

      {/* ==================== LAYER 4: FLYING BIRDS ==================== */}
      <motion.g
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        {/* Bird 1 - large, left */}
        <path
          d="M80,170 Q90,158 100,165 Q110,158 120,170"
          fill="none"
          stroke="url(#heroGradBird)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Bird 2 - medium, center-left */}
        <path
          d="M170,145 Q178,135 186,140 Q194,135 202,145"
          fill="none"
          stroke="url(#heroGradBird)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Bird 3 - small, center */}
        <path
          d="M260,155 Q266,147 272,151 Q278,147 284,155"
          fill="none"
          stroke="url(#heroGradBird)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Bird 4 - medium, right */}
        <path
          d="M340,140 Q350,130 360,136 Q370,130 380,140"
          fill="none"
          stroke="url(#heroGradBird)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.65"
        />
        {/* Bird 5 - tiny, far right (distant) */}
        <path
          d="M400,170 Q405,164 410,167 Q415,164 420,170"
          fill="none"
          stroke="url(#heroGradBird)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />
      </motion.g>

      {/* ==================== LAYER 5: GLOBE ==================== */}
      <motion.g
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
      >
        {/* Globe outline */}
        <circle cx="250" cy="90" r="38" fill="none" stroke="url(#heroGradGlobe)" strokeWidth="1.5" />
        {/* Latitude lines */}
        <ellipse cx="250" cy="90" rx="38" ry="12" fill="none" stroke="#D8B27A" strokeWidth="0.8" opacity="0.35" />
        <ellipse cx="250" cy="90" rx="38" ry="26" fill="none" stroke="#D8B27A" strokeWidth="0.8" opacity="0.3" />
        {/* Longitude lines */}
        <ellipse cx="250" cy="90" rx="12" ry="38" fill="none" stroke="#D8B27A" strokeWidth="0.8" opacity="0.35" />
        <ellipse cx="250" cy="90" rx="26" ry="38" fill="none" stroke="#D8B27A" strokeWidth="0.8" opacity="0.3" />
        {/* Location dots */}
        <circle cx="235" cy="78" r="2" fill="#D8B27A" opacity="0.5" />
        <circle cx="262" cy="85" r="1.8" fill="#D8B27A" opacity="0.45" />
        <circle cx="245" cy="100" r="1.5" fill="#D8B27A" opacity="0.4" />
        <circle cx="258" cy="72" r="1.2" fill="#D8B27A" opacity="0.35" />
        <circle cx="240" cy="92" r="1.6" fill="#D8B27A" opacity="0.4" />
        <circle cx="265" cy="98" r="1.3" fill="#D8B27A" opacity="0.35" />
      </motion.g>

      {/* ==================== LAYER 6: ATMOSPHERIC ELEMENTS ==================== */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      >
        {/* Large quote marks */}
        <text x="60" y="260" fontFamily="Georgia, serif" fontSize="60" fill="#D8B27A" opacity="0.12">"</text>
        <text x="395" y="380" fontFamily="Georgia, serif" fontSize="55" fill="#D8B27A" opacity="0.1">"</text>
        <text x="350" y="180" fontFamily="Georgia, serif" fontSize="40" fill="#8A6A4A" opacity="0.08">"</text>

        {/* Quill / pen icons */}
        <g transform="translate(420, 280) rotate(30)" opacity="0.15">
          <path d="M0,0 L2,25 L0,24 L-2,25 Z" fill="#8A6A4A" />
          <path d="M0,0 Q-8,-5 -4,-18 Q0,-8 4,-18 Q8,-5 0,0 Z" fill="#D8B27A" opacity="0.8" />
        </g>
        <g transform="translate(55, 420) rotate(-15)" opacity="0.12">
          <path d="M0,0 L1.5,20 L0,19 L-1.5,20 Z" fill="#8A6A4A" />
          <path d="M0,0 Q-6,-4 -3,-14 Q0,-6 3,-14 Q6,-4 0,0 Z" fill="#D8B27A" opacity="0.8" />
        </g>

        {/* Sparkle / star dots */}
        <circle cx="150" cy="200" r="1.5" fill="#D8B27A" opacity="0.3" />
        <circle cx="380" cy="230" r="1.2" fill="#D8B27A" opacity="0.25" />
        <circle cx="70" cy="350" r="1" fill="#D8B27A" opacity="0.2" />
        <circle cx="430" cy="160" r="1.3" fill="#D8B27A" opacity="0.25" />
        <circle cx="300" cy="190" r="1" fill="#D8B27A" opacity="0.2" />
        <circle cx="200" cy="130" r="1.2" fill="#D8B27A" opacity="0.22" />
        <circle cx="450" cy="350" r="1" fill="#D8B27A" opacity="0.18" />
        <circle cx="50" cy="180" r="1.1" fill="#D8B27A" opacity="0.2" />
        <circle cx="320" cy="420" r="1.3" fill="#D8B27A" opacity="0.22" />
        <circle cx="180" cy="460" r="1" fill="#D8B27A" opacity="0.18" />

        {/* Tiny sparkle crosses */}
        <g opacity="0.2" stroke="#D8B27A" strokeWidth="0.8" strokeLinecap="round">
          <line x1="130" y1="280" x2="130" y2="288" />
          <line x1="126" y1="284" x2="134" y2="284" />
        </g>
        <g opacity="0.15" stroke="#D8B27A" strokeWidth="0.7" strokeLinecap="round">
          <line x1="400" y1="300" x2="400" y2="307" />
          <line x1="396.5" y1="303.5" x2="403.5" y2="303.5" />
        </g>
        <g opacity="0.18" stroke="#8A6A4A" strokeWidth="0.6" strokeLinecap="round">
          <line x1="90" y1="150" x2="90" y2="156" />
          <line x1="87" y1="153" x2="93" y2="153" />
        </g>
      </motion.g>
    </svg>
  )
}
