'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { isActivePath, navigationItems } from '@/lib/navigation';
import BlogNavItem from './BlogNavItem';

/**
 * The site's link list, rendered from the shared `navigationItems` config so
 * the header and the mobile sheet can never fall out of sync.
 *
 * Two presentations, one source:
 *   `header` — compact row inside the sticky navbar
 *   `hero`   — the larger, airier list on the home page
 */
export default function NavigationLinks({
  className = '',
  variant = 'hero',
  withBlogMenu = false,
}: {
  className?: string;
  variant?: 'header' | 'hero';
  /** Header-only: replaces the plain Blog link with the editorial mega-menu. */
  withBlogMenu?: boolean;
}) {
  const pathname = usePathname() ?? '';

  return (
    <ul className={`site-nav site-nav--${variant} ${className}`}>
      {navigationItems.map((link) => {
        const active = isActivePath(pathname, link.href);

        return (
          <li key={link.href}>
            {withBlogMenu && link.hasMegaMenu ? (
              <BlogNavItem label={link.label} active={active} />
            ) : (
              <Link
                href={link.href}
                className="site-nav__link"
                data-active={active}
                aria-current={active ? 'page' : undefined}
              >
                <span>{link.label}</span>
                <span className="site-nav__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
