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
  Search,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

/* ─── Nav Items ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  { href: "/admin",          label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts",    label: "Posts",     icon: FileText },
  { href: "/admin/projects", label: "Projects",  icon: FolderKanban },
  { href: "/admin/services", label: "Services",  icon: Wrench },
  { href: "/admin/profile",  label: "Profile",   icon: UserCircle },
  { href: "/admin/comments", label: "Comments",  icon: MessageSquare },
];

/* ─── Search types ──────────────────────────────────────────── */
interface SearchResult { id: string; title: string; href: string; }
interface SearchGroups { posts: SearchResult[]; projects: SearchResult[]; services: SearchResult[]; }
const EMPTY_GROUPS: SearchGroups = { posts: [], projects: [], services: [] };

/* ═══════════════════════════════════════════════════════════════
   AdminTopNav
═══════════════════════════════════════════════════════════════ */
export default function AdminTopNav({ email }: { email: string }) {
  const pathname  = usePathname();
  const router    = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  /* Search state */
  const [query,      setQuery]      = useState("");
  const [groups,     setGroups]     = useState<SearchGroups>(EMPTY_GROUPS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const inputRef         = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  /* Ctrl+K */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  /* Close search outside */
  useEffect(() => {
    if (!searchOpen) return;
    const h = (e: MouseEvent) => {
      if (!searchWrapperRef.current?.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [searchOpen]);

  /* Close user dropdown outside */
  useEffect(() => {
    if (!userOpen) return;
    const click = (e: MouseEvent) => { if (!userRef.current?.contains(e.target as Node)) setUserOpen(false); };
    const esc   = (e: KeyboardEvent) => { if (e.key === "Escape") setUserOpen(false); };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown",   esc);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", esc); };
  }, [userOpen]);

  /* Debounced search */
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) { setGroups(EMPTY_GROUPS); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const supabase = createClient();
      const like = `%${trimmed}%`;
      const [posts, projects, services] = await Promise.all([
        supabase.from("blog_posts").select("id, title").ilike("title", like).limit(5),
        supabase.from("projects").select("id, title").ilike("title", like).limit(5),
        supabase.from("services").select("id, title").ilike("title", like).limit(5),
      ]);
      setGroups({
        posts:    (posts.data    ?? []).map((p) => ({ id: p.id, title: p.title, href: `/admin/posts/${p.id}` })),
        projects: (projects.data ?? []).map((p) => ({ id: p.id, title: p.title, href: `/admin/projects?edit=${p.id}` })),
        services: (services.data ?? []).map((s) => ({ id: s.id, title: s.title, href: `/admin/services?edit=${s.id}` })),
      });
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const hasResults = groups.posts.length + groups.projects.length + groups.services.length > 0;

  function goTo(href: string) { setSearchOpen(false); setQuery(""); router.push(href); }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : (pathname ?? "").startsWith(href);
  }

  /* ═══════════════════ RENDER ═══════════════════════════════ */
  return (
    <>
      {/* ══════════════════ NAVBAR SHELL ════════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0C161C]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-5 md:px-8">

          {/* ── LEFT: Logo ────────────────────────────────── */}
          <Link
            href="/admin"
            className="flex shrink-0 items-center gap-2 font-bold tracking-tight text-white"
          >
            {/* Glowing dot logo */}
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#76ABAE] opacity-20" />
              <span className="relative h-3 w-3 rounded-full bg-gradient-to-br from-[#76ABAE] to-[#3f6b6e] shadow-lg shadow-[#76ABAE]/40" />
            </span>
            <span className="text-sm font-semibold text-white/90">Admin</span>
          </Link>

          {/* ── CENTER: Pill Nav (desktop) ─────────────────── */}
          {/* Outer track — subtle dark pill container, like the reference */}
          <nav className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] p-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      group relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium
                      transition-all duration-200
                      ${active
                        ? "bg-white text-[#0C161C] shadow-md shadow-black/30"
                        : "text-zinc-400 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={13}
                      className={`shrink-0 transition-colors ${active ? "text-[#0C161C]" : "text-zinc-500 group-hover:text-white"}`}
                    />
                    {label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ── RIGHT: Controls ───────────────────────────── */}
          <div className="ml-auto flex shrink-0 items-center gap-2">

            {/* Search */}
            <div ref={searchWrapperRef} className="relative hidden sm:block">
              <Search
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search…"
                className="
                  h-8 w-36 rounded-full border border-white/[0.08] bg-white/[0.04]
                  pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-600
                  transition-all duration-200 focus:w-52 focus:border-zinc-600 focus:bg-white/[0.07]
                "
              />

              {/* Search dropdown */}
              {searchOpen && query.trim().length >= 2 && (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-72 max-h-80 overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0C161C] shadow-2xl shadow-black/70">
                  {loading  && <p className="px-4 py-3 text-xs text-zinc-500">Searching…</p>}
                  {!loading && !hasResults && <p className="px-4 py-3 text-xs text-zinc-500">No matches for &quot;{query}&quot;</p>}
                  {!loading && (
                    <>
                      <SearchGroup label="Posts"    items={groups.posts}    onSelect={goTo} />
                      <SearchGroup label="Projects" items={groups.projects} onSelect={goTo} />
                      <SearchGroup label="Services" items={groups.services} onSelect={goTo} />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* View Site */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View site"
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-zinc-500 transition-colors hover:bg-white/[0.08] hover:text-white sm:flex"
            >
              <ExternalLink size={14} />
            </Link>

            {/* Avatar + User Dropdown */}
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserOpen((o) => !o)}
                aria-expanded={userOpen}
                aria-label="User menu"
                className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-zinc-400 transition-colors hover:bg-white/[0.09] hover:text-white"
              >
                <Avatar label={email || "Admin"} size="sm" />
                <ChevronDown
                  size={12}
                  className={`mr-0.5 shrink-0 transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`}
                />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 min-w-[180px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C161C] shadow-2xl shadow-black/70">
                  <div className="border-b border-white/[0.06] px-4 py-3">
                    <p className="truncate text-sm font-semibold text-white">{email || "Admin"}</p>
                    <p className="text-[11px] text-zinc-500">Administrator</p>
                  </div>
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white sm:hidden"
                    onClick={() => setUserOpen(false)}
                  >
                    <ExternalLink size={14} /> View site
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white md:hidden"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE DRAWER ────────────────────────────────── */}
        {mobileOpen && (
          <div className="border-t border-white/[0.06] bg-[#0C161C] pb-4 md:hidden">
            {/* Mobile search */}
            <div className="px-5 pt-4 pb-3">
              <div className="relative">
                <Search size={13} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search posts, projects, services…"
                  className="h-9 w-full rounded-full border border-white/[0.08] bg-white/[0.04] pl-9 pr-4 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
                />
                {searchOpen && query.trim().length >= 2 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-64 overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0C161C] shadow-2xl shadow-black/70">
                    {loading  && <p className="px-4 py-3 text-xs text-zinc-500">Searching…</p>}
                    {!loading && !hasResults && <p className="px-4 py-3 text-xs text-zinc-500">No matches for &quot;{query}&quot;</p>}
                    {!loading && (
                      <>
                        <SearchGroup label="Posts"    items={groups.posts}    onSelect={(h) => { goTo(h); setMobileOpen(false); }} />
                        <SearchGroup label="Projects" items={groups.projects} onSelect={(h) => { goTo(h); setMobileOpen(false); }} />
                        <SearchGroup label="Services" items={groups.services} onSelect={(h) => { goTo(h); setMobileOpen(false); }} />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile nav pills */}
            <nav className="flex flex-col gap-1 px-4">
              {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-white text-[#0C161C]"
                        : "text-zinc-400 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    <Icon size={15} className="shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

/* ─── Search Group ──────────────────────────────────────────── */
function SearchGroup({ label, items, onSelect }: { label: string; items: SearchResult[]; onSelect: (href: string) => void; }) {
  if (items.length === 0) return null;
  return (
    <div className="border-b border-white/[0.06] py-1 last:border-b-0">
      <p className="px-4 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">{label}</p>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.href)}
          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <span className="truncate">{item.title}</span>
        </button>
      ))}
    </div>
  );
}
