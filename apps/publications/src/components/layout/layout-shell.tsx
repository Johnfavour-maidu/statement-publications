"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/verify-email"];
const DASHBOARD_ROUTES = ["/admin", "/author"];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isDashboard = DASHBOARD_ROUTES.some((r) => pathname.startsWith(r));
  const hideChrome = isAuth || isDashboard;

  return (
    <>
      {!hideChrome && <Header />}
      <main className={hideChrome ? "flex-1" : "flex-1"}>{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}
