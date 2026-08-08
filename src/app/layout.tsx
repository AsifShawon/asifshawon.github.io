import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
// Namespaced `.blog-*` design system. Loaded globally because the shared
// header's blog mega-menu uses the same primitives on non-blog routes.
import "./blog-system.css";

const inter = Inter({ subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

// Editorial pairing used by the blog: Geist carries UI/body copy, Instrument
// Serif carries display headings. Exposed as variables so only the blog opts
// in — the rest of the portfolio keeps Inter untouched.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asif Bhuiyan Shawon - Ecommerce Executive & Former Software Engineer",
  description: "Portfolio of Asif Bhuiyan Shawon — Ecommerce Executive learning marketing, ads, and growth, with a background in AI and full-stack software engineering.",
  keywords: "Asif Bhuiyan Shawon, Ecommerce Executive, Ecommerce, Marketing, Facebook Ads, SEO, Market Analysis, Full-Stack Developer, AI, Portfolio",
  authors: [{ name: "Asif Bhuiyan Shawon" }],
  // viewport moved to `export const viewport` per Next.js generate-viewport API
  robots: "index, follow",
  openGraph: {
    title: "Asif Bhuiyan Shawon - Ecommerce Executive & Former Software Engineer",
    description: "Ecommerce Executive learning marketing, ads, and growth — backed by a Computer Science foundation and a track record of shipping software.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.className} ${jakarta.variable} ${geist.variable} ${instrumentSerif.variable} overflow-x-hidden`}
      >
        <div className="relative min-h-screen">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}