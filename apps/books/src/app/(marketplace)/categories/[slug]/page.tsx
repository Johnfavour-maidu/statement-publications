"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CategorySlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();

  useEffect(() => {
    params.then(({ slug }) => {
      router.replace(`/categories?cat=${slug}`);
    });
  }, [params, router]);

  return (
    <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#D8B27A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading category...</p>
      </div>
    </div>
  );
}
