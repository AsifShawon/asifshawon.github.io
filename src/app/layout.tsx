import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
// Namespaced `.blog-*` design system. Loaded globally because the shared
// header's blog mega-menu uses the same primitives on non-blog routes.
import "./blog-system.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import { GoogleAnalytics } from '@next/third-parties/google'

// Mint Ledger system fonts. `--font-display`/`--font-body`/`--font-mono` are
// the semantic names every shared component reads; nothing should reference
// these `next/font` objects directly outside this file.
const syneDisplay = Syne({ subsets: ["latin"], weight: ["500"], variable: "--font-display", display: "swap" });
const jakartaBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Admin-only display face (headings/numerals in the dashboard) — kept as its
// own variable so the Mint Ledger `--font-body` swap above can't change how
// the admin area's `.font-display` class renders.
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  // Makes every relative `alternates.canonical` and OG url in the app resolve
  // to an absolute production URL.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Internal pages set only their own name: "Projects" -> "Projects | Asif…"
    template: `%s | ${SITE_NAME}`,
  },
    verification:{
    google: "hVJQC9l-c8Rc49y-CIiKBJLI4BXiMnPZq_rTNJ3LrIM",

    other: {
    "msvalidate.01": "15962D412ACF8B02ABFE3E82FB58614B",
  },
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
  themeColor: '#E7F0E6',
  colorScheme: 'light',
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
        // Font faces only declare their CSS variables here; `body`'s actual
        // `font-family` is set once in globals.css via `var(--font-body)`.
        className={`${syneDisplay.variable} ${jakartaBody.variable} ${plexMono.variable} ${jakarta.variable}`}
      >
        <div className="relative min-h-screen">
          {children}
        </div>
        <Analytics />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}