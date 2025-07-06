"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'

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
        <DropdownMenuContent className="border-0">
          <DropdownMenuItem asChild>
            {/* Link for Projects */}
            <Link href="/hello/projects" className="block py-1">
              Projects
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/hello/aboutme" className="block py-1">
              About
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notes" className="block py-1">
              Notes
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem asChild>
            <Link href="/academics" className="block py-1">
              Academics
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default MobileMenu
