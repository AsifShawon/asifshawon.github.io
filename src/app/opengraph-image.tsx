import { ImageResponse } from 'next/og';

import { JOB_TITLE, SITE_NAME, SITE_URL } from '@/lib/site';

// Left on the Node runtime deliberately: the edge runtime opts the route out
// of static generation, and this card never changes between requests.
export const alt = `${SITE_NAME} — ${JOB_TITLE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Default social card for every route that doesn't supply its own image
 * (blog posts fall back to their cover image). Built from the site's own
 * Mint Ledger palette — Frost White background, Ledger Green accent — so a
 * shared link looks like the site it points at.
 *
 * `next/og` renders through Satori, not the app's own stylesheet, so this
 * can't reference the `--ml-*` CSS custom properties in globals.css — the
 * hex values below are their literal equivalents, kept in sync by hand.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#F8FBF6',
          backgroundImage:
            'radial-gradient(900px 480px at 88% 8%, rgba(15,124,99,0.10), transparent 60%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: '#0F7C63',
            }}
          />
          <div
            style={{
              color: '#617168',
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Portfolio
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#13271F',
              fontSize: 84,
              fontWeight: 600,
              letterSpacing: -2.5,
              lineHeight: 1.05,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              marginTop: 22,
              color: '#617168',
              fontSize: 36,
              letterSpacing: -0.5,
            }}
          >
            {JOB_TITLE}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 28,
            borderTop: '1px solid rgba(19,39,31,0.14)',
          }}
        >
          <div style={{ color: '#0F7C63', fontSize: 26 }}>
            {SITE_URL.replace(/^https?:\/\//, '')}
          </div>
          <div style={{ color: 'rgba(97,113,104,0.85)', fontSize: 24 }}>
            Ecommerce · Web · AI
          </div>
        </div>
      </div>
    ),
    size
  );
}
