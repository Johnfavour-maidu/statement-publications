"use client";

import { motion } from "framer-motion";

export default function BlogSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-100 rounded-lg w-1/3 mb-4" />
      <div className="h-4 bg-gray-100 rounded w-2/3 mb-8" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="aspect-[16/10] bg-gray-100" />
            <div className="p-5">
              <div className="h-4 bg-gray-100 rounded w-1/4 mb-3" />
              <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full mb-4" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full" />
                <div>
                  <div className="h-3 bg-gray-100 rounded w-20 mb-1" />
                  <div className="h-2 bg-gray-100 rounded w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
