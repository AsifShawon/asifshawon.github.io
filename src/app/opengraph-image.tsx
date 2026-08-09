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
 * palette — ink background, teal accent — so a shared link looks like the
 * site it points at.
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
          background: '#040D12',
          backgroundImage:
            'radial-gradient(900px 480px at 88% 8%, rgba(118,171,174,0.20), transparent 60%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: '#76ABAE',
            }}
          />
          <div
            style={{
              color: '#8FB9B8',
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
              color: '#EEEEEE',
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
              color: '#93B1A6',
              fontSize: 36,
              letterSpacing: -0.5,
            }}
          >
            Ecommerce Executive · Full-Stack &amp; AI Developer
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 28,
            borderTop: '1px solid rgba(147,177,166,0.22)',
          }}
        >
          <div style={{ color: '#76ABAE', fontSize: 26 }}>
            {SITE_URL.replace(/^https?:\/\//, '')}
          </div>
          <div style={{ color: 'rgba(147,177,166,0.7)', fontSize: 24 }}>
            Ecommerce · Web · AI
          </div>
        </div>
      </div>
    ),
    size
  );
}
