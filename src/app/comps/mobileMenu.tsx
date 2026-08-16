"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu as MenuIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isActivePath, navigationItems, writingItems } from '@/lib/navigation'

// The dropdown panel (`.blog-megamenu`) is a light Verdant Mist surface, so
// hover/focus/active states are declared explicitly in ink/green rather than
// the shadcn defaults, which assume a dark popover.
// min-h-11 keeps every row at a 44px touch target.
const ITEM_CLASS =
  'flex min-h-11 items-center rounded-[10px] px-3 text-[0.9375rem] transition-colors hover:bg-[rgba(23,108,82,0.08)] focus:bg-[rgba(23,108,82,0.1)] focus:text-[var(--ml-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ml-indigo)] data-[active=true]:text-[var(--ml-ink)] data-[active=true]:font-medium'

/**
 * Small-screen navigation. Renders the *same* `navigationItems` the desktop
 * header uses — the two lists cannot drift apart. Radix's DropdownMenu gives
 * roving focus, Escape-to-close and focus restoration for free.
 */
const MobileMenu = () => {
  const pathname = usePathname() ?? ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="site-nav__trigger"
        aria-label="Open navigation menu"
      >
        <MenuIcon size={18} strokeWidth={1.9} aria-hidden="true" />
        <span className="hidden sm:inline">Menu</span>
      </DropdownMenuTrigger>

      {/* No mega-menu on small screens — blog links are folded into the
          off-canvas list instead. */}
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        // rounded-[20px] restates `.blog-megamenu`'s radius as a utility so
        // it beats the primitive's default `rounded-md` whatever order the
        // CSS chunks land in.
        className="blog-megamenu w-60 rounded-[20px] p-2"
        style={{ color: 'var(--blog-text-secondary)' }}
      >
        {navigationItems.map((item) => {
          const active = isActivePath(pathname, item.href)
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className={ITEM_CLASS}
                data-active={active}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuSeparator
          className="my-1.5 h-px"
          style={{ background: 'var(--blog-border)' }}
        />

        <DropdownMenuLabel
          className="px-3 pb-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em]"
          style={{ color: 'var(--blog-text-subtle)' }}
        >
          Writing
        </DropdownMenuLabel>
        {writingItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className={ITEM_CLASS}>
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MobileMenu
