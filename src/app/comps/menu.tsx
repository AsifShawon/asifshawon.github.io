import Link from 'next/link';
import React from 'react';
import { FolderCode, FileUser, FilePenLine, NotebookPenIcon } from 'lucide-react'; // import your icon components

export default function NavigationLinks() {
  const links = [
    {
      href: "/hello/projects",
      label: "Projects",
      icon: <FolderCode size={24} />,
    },
    {
      href: "/hello/aboutme",
      label: "About me",
      icon: <FileUser size={24} />,
    },
    {
      href: "/hello/academics",
      label: "Academics",
      icon: <FilePenLine size={24} />, // No icon for this one
    },
    {
      href: "/hello/notes",
      label: "Notes",
      icon: <NotebookPenIcon size={24}/>, // No icon for this one
    },
  ];

  return (
    <div>
      <div className="flex gap-8 pt-5 text-xl">
        {links.map((link, index) => (
          <Link key={index} href={link.href} className="relative group hover:text-blue-500">
            <div className="flex justify-normal gap-1 items-center">
              {link.icon}
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
