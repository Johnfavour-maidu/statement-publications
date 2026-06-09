"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { allAuthors } from "@/lib/blog-data";

const authorColors = [
  "border-amber-300 ring-amber-100",
  "border-blue-300 ring-blue-100",
  "border-rose-300 ring-rose-100",
  "border-violet-300 ring-violet-100",
  "border-teal-300 ring-teal-100",
  "border-orange-300 ring-orange-100",
];

export default function AuthorSpotlight() {
  const spotlight = allAuthors.slice(0, 6);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {spotlight.map((author, i) => (
        <motion.div
          key={author.name}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className={`flex items-center gap-3 p-4 rounded-xl bg-white border-2 ${authorColors[i]} hover:shadow-md transition-all duration-300`}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 shrink-0">
            <Image src={author.avatar} alt={author.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-charcoal truncate">{author.name}</p>
            <p className="text-[11px] text-dark-gray/50 line-clamp-1">{author.bio}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
