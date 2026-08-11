import React from 'react';
import SiteFooter from '../comps/siteFooter';
import TopMenu from '../comps/topMenu';
import PageTransition from '../components/PageTransition';

/**
 * `.blog-shell` carries the blog design tokens and the editorial surface
 * colour. It wraps the shared header too, so there is no seam between the
 * site navigation and the blog canvas.
 *
 * No CursorFollower: the custom cursor is a homepage-only flourish — internal
 * pages, including the blog, keep the native cursor.
 */
const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="blog-shell">
        <TopMenu />
        <main id="main-content">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
      </div>
    </>
  );
};

export default BlogLayout;
