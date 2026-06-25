"use client";

import { usePathname } from "next/navigation";
import React from "react";

const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

export function AuthLayoutWrapper({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}
