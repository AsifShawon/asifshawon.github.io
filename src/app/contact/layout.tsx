// Mirrors `hello/layout.tsx` so /contact sits inside the same shell — same
// header, same cursor, same page transition — rather than looking bolted on.
import React from 'react';
import SiteFooter from '../comps/siteFooter';
import TopMenu from '../comps/topMenu';
import PageTransition from '../components/PageTransition';

// No CursorFollower here: the custom cursor is a homepage-only flourish —
// internal pages, including forms, keep the native cursor.
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative z-10">
        <TopMenu />
        <main id="main-content">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
