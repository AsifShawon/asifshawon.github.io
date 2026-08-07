import Link from 'next/link';
import React from 'react';

export default function NavigationLinks({ className = '' }: { className?: string }) {
  const links = [
    {
      href: "/hello/projects",
      label: "Projects",
    },
    {
      href: "/hello/aboutme",
      label: "About me",
    },
    {
      href: "/hello/tools",
      label: "Tools",
    },
    {
      href: "/blog",
      label: "Blog",
    },
    // {
    //   href: "/hello/academics",
    //   label: "Academics",
    // },
    // {
    //   href: "/hello/notes",
    //   label: "Notes",
    // },
  ];

  return (
    <div>
      <div className={`flex gap-8 pt-5 text-xl ${className}`}>
        {links.map((link, index) => (
          <Link key={index} href={link.href} className="relative group hover:text-blue-500">
            <div className="flex justify-normal gap-1 items-center">
              <span className="group-hover:pr-8 transition-all duration-300 ease-in-out sm:block hidden">
                {link.label}
              </span>
              <span className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-[-2px] transition-all duration-300 ease-in-out">
                ➜
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
