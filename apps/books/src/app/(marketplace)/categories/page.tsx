"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { categories } from "@/lib/demo-data";

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D]">Browse Categories</h1>
        <p className="text-gray-500 mt-1">Explore our collection by genre</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Link href={`/categories/${category.slug}`} className="block">
              <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 hover:shadow-lg hover:border-[#EBC9A8] transition-all duration-300 h-full">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-lg text-[#1D1D1D]">{category.name}</h3>
                <p className="text-sm text-[#D8B27A] font-medium mt-1">
                  {category.bookCount} books
                </p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No categories available yet.</p>
        </div>
      )}
    </div>
  );
}
