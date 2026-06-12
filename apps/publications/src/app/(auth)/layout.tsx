"use client";

import { FloatingBubbles } from "@/components/floating-bubbles";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F5E6D3 0%, #F2D8BE 40%, #EBC9A8 100%)",
      }}
    >
      <FloatingBubbles />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
