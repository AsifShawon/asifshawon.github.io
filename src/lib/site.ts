import type { Metadata } from "next";

/**
 * Single source of truth for identity/SEO constants.
 *
 * Deliberately synchronous and header-free (unlike `getSiteOrigin()`), so it
 * can be used from `metadataBase`, `sitemap.ts` and `robots.ts` without
 * forcing those routes to become dynamic.
 */

const FALLBACK_URL = "https://withshawon.vercel.app";

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return FALLBACK_URL;
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "Asif Bhuiyan Shawon";

/**
 * Professional identity — the one place this is decided.
 *
 * Asif's ecommerce role is his primary current employment; the developer/AI
 * work is independent/freelance. Every identity string below is built from
 * these three values so the site can't describe them as three simultaneous
 * full-time jobs in one place and something else elsewhere.
 */
export const PRIMARY_ROLE = "Ecommerce Executive";
export const INDEPENDENT_ROLES = ["Full-Stack Developer", "AI Engineer"] as const;

/** "Ecommerce Executive · Full-Stack Developer · AI Engineer" */
export const JOB_TITLE = [PRIMARY_ROLE, ...INDEPENDENT_ROLES].join(" · ");

/** Longer-form identity sentence for hero subtext, About and Contact intros. */
export const PROFILE_DESCRIPTION =
  "Currently working as an Ecommerce Executive while independently building full-stack applications and practical AI-powered solutions.";

export const SITE_TITLE =
  "Asif Bhuiyan Shawon | Ecommerce Executive, Full-Stack Developer & AI Engineer";

export const SITE_DESCRIPTION =
  "Portfolio of Asif Bhuiyan Shawon, an Ecommerce Executive who also works independently as a Full-Stack Developer and AI Engineer, building ecommerce solutions, web applications and practical AI-powered features.";

export const CONTACT_EMAIL = "asifbhuiyanshawon@gmail.com";

/**
 * Verified profile URLs that already exist in the repository
 * (see `FloatingActions`' DEFAULT_SOCIALS). Used for JSON-LD `sameAs` — never
 * invent an account here.
 */
export const SOCIAL_PROFILES = [
  "https://www.linkedin.com/in/asif-bhuiyan-shawon/",
  "https://github.com/AsifShawon",
  "https://www.facebook.com/withshawon",
  "https://www.instagram.com/withshawon",
] as const;

/** Absolute URL helper for canonicals, sitemaps and JSON-LD. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The generated social card from `src/app/opengraph-image.tsx`.
 *
 * Next only auto-attaches a file-based OG image when a segment doesn't
 * declare its own `openGraph` object — every page that sets one has to name
 * the image explicitly, which is what `pageMetadata()` below does.
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${JOB_TITLE}`,
};

/**
 * Builds the title / description / canonical / Open Graph / Twitter set for a
 * public page from one description, so those five can never disagree.
 * `title` is the bare page name — the root layout's template appends the site
 * name.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
}: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article" | "profile";
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: ogType,
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
