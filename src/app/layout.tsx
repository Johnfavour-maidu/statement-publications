import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Statement Publications — Every Story Makes A Statement",
    template: "%s | Statement Publications",
  },
  description:
    "Publish your story to the world with Statement Publications. A modern self-publishing platform for authors to publish, sell, and earn royalties from their books.",
  keywords: [
    "self publishing",
    "publish a book",
    "author platform",
    "book publishing",
    "ebook publishing",
    "sell books online",
    "royalties",
    "indie authors",
  ],
  authors: [{ name: "Statement Publications" }],
  creator: "Statement Publications",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://statementpub.com",
    siteName: "Statement Publications",
    title: "Statement Publications — Every Story Makes A Statement",
    description:
      "Publish your story to the world. A modern self-publishing platform for authors to publish, sell, and earn royalties.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Statement Publications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Statement Publications — Every Story Makes A Statement",
    description:
      "Publish your story to the world. A modern self-publishing platform for authors to publish, sell, and earn royalties.",
    images: ["/og-image.png"],
    creator: "@statementpub",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
              `,
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
