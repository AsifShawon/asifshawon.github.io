import Link from 'next/link';
import React from 'react';

import Container from '@/components/ui/container';
import { navigationItems, writingItems } from '@/lib/navigation';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

/**
 * Shared site footer.
 *
 * Deliberately *not* mounted in the root layout: the home page is a single
 * full-height hero and a footer under it would break that composition. The
 * three section shells (`hello`, `contact`, `blog`) opt in instead — the same
 * way they opt into `TopMenu`.
 *
 * The oversized wordmark is drawn as SVG rather than styled text: `textLength`
 * + `lengthAdjust` make it span the full width exactly, at any viewport and
 * regardless of which font has finished loading.
 */

type FooterLink = { href: string; label: string; external?: boolean };

/** Blog lives in its own column below, so it drops out of the primary list. */
const exploreLinks: FooterLink[] = [
  ...navigationItems.filter((item) => item.href !== '/blog'),
  { href: '/Resume_Asif_Bhuiyan.pdf', label: 'Résumé', external: true },
];

const elsewhereLinks: FooterLink[] = [
  { href: 'https://github.com/AsifShawon', label: 'GitHub', external: true },
  { href: 'https://www.linkedin.com/in/asif-bhuiyan-shawon/', label: 'LinkedIn', external: true },
  { href: 'https://www.instagram.com/withshawon', label: 'Instagram', external: true },
  { href: 'https://www.facebook.com/withshawon', label: 'Facebook', external: true },
];

const columns: { title: string; links: FooterLink[] }[] = [
  { title: 'Explore', links: exploreLinks },
  { title: 'Writing', links: writingItems },
  { title: 'Elsewhere', links: elsewhereLinks },
];

function FooterLinkItem({ href, label, external }: FooterLink) {
  if (external) {
    return (
      <a className="site-footer__link" href={href} target="_blank" rel="noreferrer">
        {label}
      </a>
    );
  }

  return (
    <Link className="site-footer__link" href={href}>
      {label}
    </Link>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__lede">
            <svg
              className="site-footer__mark"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>

            <p className="site-footer__statement">
              Ecommerce, web and AI work —
              <br />
              built to actually ship.
            </p>

            <a className="site-footer__email" href={`mailto:${CONTACT_EMAIL}`}>
              <span>{CONTACT_EMAIL}</span>
              <span className="site-footer__email-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          <nav className="site-footer__columns" aria-label="Footer">
            {columns.map((column) => (
              <div className="site-footer__column" key={column.title}>
                <h2 className="site-footer__column-title">{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}`}>
                      <FooterLinkItem {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="site-footer__meta">
          <p>
            © {year} {SITE_NAME}
          </p>
          <p className="site-footer__colophon">
            Built with Next.js · Dhaka, Bangladesh
          </p>
          <a className="site-footer__top-link" href="#main-content">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </Container>

      {/* Decorative: the name is already announced by the copyright line. */}
      <div className="site-footer__wordmark" aria-hidden="true">
        <svg viewBox="0 0 1000 138" role="presentation" focusable="false">
          <text
            x="0"
            y="150"
            textLength="880"
            lengthAdjust="spacingAndGlyphs"
            className="site-footer__wordmark-text"
          >
            SHAWON
          </text>
          <circle cx="945" cy="88" r="42" className="site-footer__wordmark-ring" />
          <text x="945" y="105" textAnchor="middle" className="site-footer__wordmark-copy">
            ©
          </text>
        </svg>
      </div>
    </footer>
  );
}
