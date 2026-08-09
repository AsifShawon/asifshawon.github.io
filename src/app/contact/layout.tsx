// Mirrors `hello/layout.tsx` so /contact sits inside the same shell — same
// header, same cursor, same page transition — rather than looking bolted on.
import React from 'react';
import TopMenu from '../comps/topMenu';
import CursorFollower from '../components/CursorFollower';
import PageTransition from '../components/PageTransition';

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CursorFollower />
      <div className="relative z-10">
        <TopMenu />
        <main id="main-content">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </>
  );
}
