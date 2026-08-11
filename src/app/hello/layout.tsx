// Server component: it only composes client children, so there is no reason
// to ship this shell to the browser as well.
import React from 'react';
import SiteFooter from '../comps/siteFooter';
import TopMenu from '../comps/topMenu';
import PageTransition from '../components/PageTransition';

// No CursorFollower here: the custom cursor is a homepage-only flourish —
// internal pages keep the native cursor (see globals.css `.has-custom-cursor`).
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="relative z-10">
        <TopMenu />
        <main id="main-content">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export default Layout;