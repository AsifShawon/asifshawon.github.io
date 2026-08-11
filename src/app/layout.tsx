import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
// Namespaced `.blog-*` design system. Loaded globally because the shared
// header's blog mega-menu uses the same primitives on non-blog routes.
import "./blog-system.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

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
  // Makes every relative `alternates.canonical` and OG url in the app resolve
  // to an absolute production URL.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Internal pages set only their own name: "Projects" -> "Projects | Asif…"
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  // viewport moved to `export const viewport` per Next.js generate-viewport API
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@AsifShawon",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#040D12',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // Horizontal overflow is contained by `overflow-x: clip` in
        // globals.css — the Tailwind `overflow-x-hidden` utility would win on
        // specificity and break the sticky header.
        className={`${inter.className} ${jakarta.variable} ${geist.variable} ${instrumentSerif.variable}`}
      >
        <div className="relative min-h-screen">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}