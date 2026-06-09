"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { allAuthors } from "@/lib/blog-data";

const authorGradients = [
  "from-amber-400 via-amber-500 to-amber-600",
  "from-blue-400 via-blue-500 to-blue-600",
  "from-emerald-400 via-emerald-500 to-emerald-600",
  "from-violet-400 via-violet-500 to-violet-600",
  "from-rose-400 via-rose-500 to-rose-600",
  "from-orange-400 via-orange-500 to-orange-600",
];

const authorFills = [
  "bg-amber-100",
  "bg-blue-100",
  "bg-emerald-100",
  "bg-violet-100",
  "bg-rose-100",
  "bg-orange-100",
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
          className={`p-[2px] rounded-xl bg-[length:300%_300%] animate-gradient bg-gradient-to-r ${authorGradients[i]} hover:shadow-md transition-all duration-300`}
        >
          <div className={`flex items-center gap-3 p-4 rounded-[10px] ${authorFills[i]}`}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shrink-0">
              <Image src={author.avatar} alt={author.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-charcoal truncate">{author.name}</p>
              <p className="text-[11px] text-dark-gray/60 line-clamp-1">{author.bio}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
