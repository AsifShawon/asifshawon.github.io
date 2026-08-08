"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// The shared shadcn tokens (--accent, --popover) are never defined in this
// project, so item focus/hover states are declared explicitly here.
const ITEM_CLASS =
  'block rounded-[10px] px-2 py-2 text-sm transition-colors hover:bg-white/[0.05] focus:bg-white/[0.07] focus:text-white'

const MobileMenu = () => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* Remove outline and make the button minimal */}
          <Button variant="ghost" className="px-4 py-2">
            Menu
          </Button>
        </DropdownMenuTrigger>
        {/* No mega-menu on small screens — blog links are folded into the
            off-canvas list instead. */}
        <DropdownMenuContent
          align="end"
          // rounded-[20px] restates `.blog-megamenu`'s radius as a utility so
          // it beats the primitive's default `rounded-md` whatever order the
          // CSS chunks land in.
          className="blog-megamenu w-56 rounded-[20px] p-2"
          style={{ color: 'var(--blog-text-secondary)' }}
        >
          <DropdownMenuItem asChild>
            <Link href="/hello/projects" className={ITEM_CLASS}>
              Projects
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/hello/aboutme" className={ITEM_CLASS}>
              About me
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/hello/tools" className={ITEM_CLASS}>
              Tools
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notes" className={ITEM_CLASS}>
              Notes
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator
            className="my-1.5 h-px"
            style={{ background: 'var(--blog-border)' }}
          />

          <DropdownMenuLabel
            className="px-2 pb-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em]"
            style={{ color: 'var(--blog-text-subtle)' }}
          >
            Writing
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/blog" className={ITEM_CLASS}>
              Blog home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/blog/archive" className={ITEM_CLASS}>
              All writing
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default MobileMenu
