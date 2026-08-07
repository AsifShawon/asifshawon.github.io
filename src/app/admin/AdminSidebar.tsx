"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "./ui";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Wrench,
  UserCircle,
  MessageSquare,
  LogOut,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeFromOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", closeFromOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeFromOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-1 rounded-2xl border border-white/[0.06] bg-[#0C161C] p-4 shadow-lg shadow-black/30">
      <div ref={menuRef} className="relative mb-6">
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/5"
        >
          <Avatar label={email || "Admin"} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{email || "Admin"}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <ChevronDown
            size={16}
            className={`shrink-0 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {menuOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-10 overflow-hidden rounded-xl border border-white/10 bg-[#0F1B23] shadow-xl shadow-black/40">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              <ExternalLink size={16} />
              View site
            </Link>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </div>

      <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
        Menu
      </p>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : (pathname ?? "").startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-[#76ABAE]/15 font-semibold text-[#76ABAE]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
