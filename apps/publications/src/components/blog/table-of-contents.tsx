"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-bold text-charcoal mb-3"
      >
        Table of Contents
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 16}px` }}>
                  <a
                    href={`#${item.id}`}
                    className="block text-xs text-dark-gray/60 hover:text-[#8A6A4A] py-1 transition-colors leading-relaxed"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
