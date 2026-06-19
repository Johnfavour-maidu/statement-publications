"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function AuthorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8A6A4A]" />
      </div>
    );
  }

  if (!session) return null;

  const user = {
    name: session.user?.name,
    email: session.user?.email,
    image: session.user?.image,
    role: (session.user as { role?: string })?.role as "AUTHOR" | "ADMIN" | "SUPER_ADMIN",
  };

  return (
    <DashboardLayout user={user}>
      {children}
    </DashboardLayout>
  );
}
