import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Statement Books — Discover Your Next Great Read",
    template: "%s | Statement Books",
  },
  description: "Browse thousands of books across every genre. From bestsellers to hidden gems, Statement Books is your destination for discovering and purchasing books.",
  keywords: ["books", "bookstore", "buy books", "online books", "ebooks", "reading", "literature", "new releases", "bestsellers"],
  openGraph: {
    title: "Statement Books — Discover Your Next Great Read",
    description: "Browse thousands of books across every genre.",
    url: "https://books.statementpublications.com",
    siteName: "Statement Books",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
