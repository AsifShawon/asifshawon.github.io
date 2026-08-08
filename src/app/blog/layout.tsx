import React from 'react';
import TopMenu from '../comps/topMenu';
import CursorFollower from '../components/CursorFollower';
import PageTransition from '../components/PageTransition';

/**
 * `.blog-shell` carries the blog design tokens and the editorial surface
 * colour. It wraps the shared header too, so there is no seam between the
 * site navigation and the blog canvas.
 */
const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CursorFollower />
      <div className="blog-shell">
        <TopMenu />
        <PageTransition>{children}</PageTransition>
      </div>
    </>
  );
};

export default BlogLayout;
