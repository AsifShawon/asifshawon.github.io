import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import CursorFollower from "./components/CursorFollower";
import PageTransition from "./components/PageTransition";
import TopMenu from "./comps/topMenu";
import SiteFooter from "./comps/siteFooter";
import styles from "./not-found.module.css";

/**
 * A root `not-found.tsx` renders inside the root layout only — it does not
 * automatically pick up `(portfolio)/layout.tsx` (or the equivalent shells
 * under `contact/` and `blog/`). So the shared shell (cursor, sticky header,
 * page transition, footer) is reassembled here by hand from the same pieces
 * those layouts use, rather than moving it into the root layout — which
 * would also wrap `/admin` and every API route.
 *
 * `alternates.canonical: null` cancels the root layout's default
 * `canonical: "/"` so this page never claims the homepage's canonical URL.
 * `robots: { index: false, follow: false }` reinforces (not fights) the
 * `<meta name="robots" content="noindex">` Next.js already injects for every
 * not-found render — see `HTTPAccessFallbackBoundary` in `next/dist`.
 */
export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist or may have moved. Head back home or explore projects, about, notes and tools.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <>
      <CursorFollower />
      <div className="relative z-10">
        <TopMenu />

        <main id="main-content">
          <PageTransition>
            <section className={styles.hero}>
              <div className={styles.bgGrid} aria-hidden="true" />
              <div className={styles.glowPrimary} aria-hidden="true" />
              <div className={styles.glowCorner} aria-hidden="true" />

              <div className={`site-container ${styles.layout}`}>
                <div className={styles.copy}>
                  <p className={`type-label ${styles.eyebrow}`}>Error 404</p>

                  <h1 className={`type-h1 ${styles.heading}`}>
                    This page <span className={styles.accentWord}>wandered off.</span>
                  </h1>

                  <p className={`type-body-lg measure ${styles.paragraph}`}>
                    No worries&mdash;the trail simply ends here. The link may be outdated, or the
                    page may have moved. Let&apos;s get you somewhere useful.
                  </p>

                  <div className={styles.actions}>
                    <Button asChild variant="brand" size="cta">
                      <Link href="/">
                        Back to home
                        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button asChild variant="surface" size="cta">
                      <Link href="/projects">Explore projects</Link>
                    </Button>
                  </div>

                  <p className={`type-small ${styles.moreLinks}`}>
                    Or visit{" "}
                    <Link href="/aboutme" className={styles.textLink}>
                      About me
                    </Link>
                    <span aria-hidden="true"> · </span>
                    <Link href="/notes" className={styles.textLink}>
                      Notes
                    </Link>
                    <span aria-hidden="true"> · </span>
                    <Link href="/tools" className={styles.textLink}>
                      Tools
                    </Link>
                  </p>
                </div>

                <div className={styles.artworkWrap}>
                  <span className={styles.orbit} aria-hidden="true" />
                  <span className={styles.accentDot} aria-hidden="true" />

                  <div
                    className={styles.card}
                    role="img"
                    aria-label="Illustration of a status card showing a large 404, with a small two-leaf sprout growing inside the zero and a faint ring orbiting the card."
                  >
                    <div className={styles.cardTop} aria-hidden="true">
                      <span className={styles.online}>
                        <span className={styles.onlineDot} />
                        system online
                      </span>
                      <span className={styles.route}>route_not_found</span>
                    </div>

                    <div className={styles.digits} aria-hidden="true">
                      <span className={styles.digit}>4</span>

                      <span className={styles.portal}>
                        <svg
                          viewBox="0 0 60 100"
                          className={styles.portalSvg}
                          focusable="false"
                        >
                          <ellipse cx="30" cy="50" rx="24" ry="46" className={styles.portalFill} />
                          <ellipse cx="30" cy="50" rx="24" ry="46" className={styles.portalRing} />
                        </svg>
                        <svg viewBox="0 0 32 36" className={styles.sprout} focusable="false">
                          <path d="M16 32 V16" className={styles.sproutStem} />
                          <path
                            d="M16 20c-5-1-8-5-8-10 5 0 8 3 8 8z"
                            className={styles.sproutLeaf}
                          />
                          <path
                            d="M16 18c5-1 8-5 8-10-5 0-8 3-8 8z"
                            className={styles.sproutLeaf}
                          />
                        </svg>
                      </span>

                      <span className={styles.digit}>4</span>
                    </div>

                    <p className={styles.cardCaption} aria-hidden="true">
                      A missing route, not a dead end. Choose a path and keep exploring.
                    </p>

                    <p className={styles.coords} aria-hidden="true">
                      23.8103&deg; N &middot; 90.4125&deg; E
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </PageTransition>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
