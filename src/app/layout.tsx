import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CahtBot from "./comps/ChatBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asif Bhuiyan Shawon",
  description: "This is the personal website of Asif Bhuiyan Shawon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children} <CahtBot/></body>
    </html>
  );
}
