"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, BookOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { authors } from "@/lib/demo-data";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AuthorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">
          Our Authors
        </h1>
        <p className="text-gray-500 mt-1">
          Discover talented writers from across the continent
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {authors.map((author, index) => (
          <motion.div
            key={author.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <Link href={`/authors/${author.slug}`} className="block">
              <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 text-center h-full">
                <div className="w-16 h-16 rounded-full bg-[#F2D8BE] flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-[#8A6A4A]">
                    {getInitials(author.name)}
                  </span>
                </div>
                <h3 className="font-bold text-[#1D1D1D] line-clamp-1">
                  {author.name}
                </h3>
                {author.penName !== author.name && (
                  <p className="text-xs text-[#8A6A4A] mt-0.5">
                    {author.penName}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {author.bio}
                </p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Badge
                    variant="secondary"
                    className="bg-[#F2D8BE] text-[#8A6A4A] text-[10px] gap-1"
                  >
                    <BookOpen className="h-3 w-3" />
                    {author.bookCount} books
                  </Badge>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {author.followers.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
