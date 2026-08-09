// Server component: it only composes client children, so there is no reason
// to ship this shell to the browser as well.
import React from 'react';
import TopMenu from '../comps/topMenu';
import CursorFollower from '../components/CursorFollower';
import PageTransition from '../components/PageTransition';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CursorFollower />
      <div className="relative z-10">
        <TopMenu />
        <main id="main-content">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </>
  );
}

export default Layout;