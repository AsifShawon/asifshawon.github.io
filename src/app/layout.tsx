import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Asif Bhuiyan Shawon - AI Developer & Computer Science Student",
  description: "Portfolio of Asif Bhuiyan Shawon - Computer Science student at North South University, specializing in AI, Machine Learning, and Full-Stack Development.",
  keywords: "Asif Bhuiyan Shawon, Computer Science, AI, Machine Learning, Full-Stack Developer, North South University, Portfolio",
  authors: [{ name: "Asif Bhuiyan Shawon" }],
  // viewport moved to `export const viewport` per Next.js generate-viewport API
  robots: "index, follow",
  openGraph: {
    title: "Asif Bhuiyan Shawon - AI Developer & Computer Science Student",
    description: "Portfolio showcasing AI projects, web development, and academic journey in Computer Science.",
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