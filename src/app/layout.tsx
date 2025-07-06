import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asif Bhuiyan Shawon - AI Developer & Computer Science Student",
  description: "Portfolio of Asif Bhuiyan Shawon - Computer Science student at North South University, specializing in AI, Machine Learning, and Full-Stack Development.",
  keywords: "Asif Bhuiyan Shawon, Computer Science, AI, Machine Learning, Full-Stack Developer, North South University, Portfolio",
  authors: [{ name: "Asif Bhuiyan Shawon" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Asif Bhuiyan Shawon - AI Developer & Computer Science Student",
    description: "Portfolio showcasing AI projects, web development, and academic journey in Computer Science.",
    type: "website",
    locale: "en_US",
  },
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
      <body className={`${inter.className} overflow-x-hidden`}>
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}