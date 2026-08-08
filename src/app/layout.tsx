import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Asif Bhuiyan Shawon | Ecommerce Executive & Full-Stack/AI Developer",
  description: "Portfolio of Asif Bhuiyan Shawon — Ecommerce Executive and freelance Full-Stack & AI Developer building web applications, ecommerce solutions, AI-powered features and automation.",
  keywords: "Asif Bhuiyan Shawon, Ecommerce Executive, Ecommerce, Full-Stack Developer, Freelance Developer, Web Developer, Next.js Developer, React Developer, AI Developer, AI Feature Development, AI Integration, LLM, RAG, Automation, Software Development, Portfolio",
  authors: [{ name: "Asif Bhuiyan Shawon" }],
  // viewport moved to `export const viewport` per Next.js generate-viewport API
  robots: "index, follow",
  openGraph: {
    title: "Asif Bhuiyan Shawon | Ecommerce Executive & Full-Stack/AI Developer",
    description: "Ecommerce Executive and freelance Full-Stack & AI Developer building ecommerce solutions, web applications, AI-powered features and automation.",
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
      <body className={`${inter.className} ${jakarta.variable} overflow-x-hidden`}>
        <div className="relative min-h-screen">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}