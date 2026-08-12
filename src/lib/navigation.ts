/**
 * The one place navigation destinations are declared.
 *
 * Desktop (`menu.tsx`), mobile (`mobileMenu.tsx`) and the sitemap all read
 * from here, so the two menus can never drift apart again.
 */

export interface NavItem {
  href: string;
  label: string;
}

export const navigationItems: NavItem[] = [
  { href: "/hello/projects", label: "Projects" },
  { href: "/hello/aboutme", label: "About" },
  { href: "/hello/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

/** Secondary blog destinations, surfaced in the mobile sheet and the sitemap. */
export const writingItems: NavItem[] = [
  { href: "/blog", label: "Blog home" },
  { href: "/blog/archive", label: "All writing" },
];

/**
 * Active-state matcher. `/` only matches exactly; every other route also
 * matches its sub-paths so `/blog/some-post` still highlights "Blog".
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
