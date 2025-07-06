'use client';
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
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </>
  );
}

export default Layout;