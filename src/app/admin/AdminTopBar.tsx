"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, IconChip } from "./ui";
import { FileText, FolderKanban, Search, Wrench } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  href: string;
}

interface SearchGroups {
  posts: SearchResult[];
  projects: SearchResult[];
  services: SearchResult[];
}

const EMPTY_GROUPS: SearchGroups = { posts: [], projects: [], services: [] };

export default function AdminTopBar({ email }: { email: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<SearchGroups>(EMPTY_GROUPS);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focusShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", focusShortcut);
    return () => document.removeEventListener("keydown", focusShortcut);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeFromOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeFromOutside);
    return () => document.removeEventListener("mousedown", closeFromOutside);
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setGroups(EMPTY_GROUPS);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      const supabase = createClient();
      const like = `%${trimmed}%`;

      const [posts, projects, services] = await Promise.all([
        supabase.from("blog_posts").select("id, title").ilike("title", like).limit(5),
        supabase.from("projects").select("id, title").ilike("title", like).limit(5),
        supabase.from("services").select("id, title").ilike("title", like).limit(5),
      ]);

      setGroups({
        posts: (posts.data ?? []).map((p) => ({
          id: p.id,
          title: p.title,
          href: `/admin/posts/${p.id}`,
        })),
        projects: (projects.data ?? []).map((p) => ({
          id: p.id,
          title: p.title,
          href: `/admin/projects?edit=${p.id}`,
        })),
        services: (services.data ?? []).map((s) => ({
          id: s.id,
          title: s.title,
          href: `/admin/services?edit=${s.id}`,
        })),
      });
      setLoading(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults = groups.posts.length + groups.projects.length + groups.services.length > 0;

  function goTo(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#0C161C] px-4 py-3 shadow-lg shadow-black/30">
      <div ref={wrapperRef} className="relative flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search posts, projects, services…"
          className="w-full rounded-xl border border-white/10 bg-[#0A141A] py-2 pl-10 pr-16 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#76ABAE] focus:ring-2 focus:ring-[#76ABAE]/25"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-500">
          Ctrl K
        </kbd>

        {open && query.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#0F1B23] shadow-xl shadow-black/40">
            {loading && <p className="px-4 py-3 text-xs text-gray-500">Searching…</p>}
            {!loading && !hasResults && (
              <p className="px-4 py-3 text-xs text-gray-500">No matches for &quot;{query}&quot;</p>
            )}
            {!loading && (
              <>
                <ResultGroup
                  label="Posts"
                  icon={<FileText size={14} />}
                  items={groups.posts}
                  onSelect={goTo}
                />
                <ResultGroup
                  label="Projects"
                  icon={<FolderKanban size={14} />}
                  items={groups.projects}
                  onSelect={goTo}
                />
                <ResultGroup
                  label="Services"
                  icon={<Wrench size={14} />}
                  items={groups.services}
                  onSelect={goTo}
                />
              </>
            )}
          </div>
        )}
      </div>

      <Link
        href="/admin/profile"
        aria-label="Go to profile"
        className="shrink-0 transition-opacity hover:opacity-80"
      >
        <Avatar label={email || "Admin"} size="sm" />
      </Link>
    </div>
  );
}

function ResultGroup({
  label,
  icon,
  items,
  onSelect,
}: {
  label: string;
  icon: React.ReactNode;
  items: SearchResult[];
  onSelect: (href: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="border-b border-white/5 py-1.5 last:border-b-0">
      <p className="px-4 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
        {label}
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.href)}
          className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/5"
        >
          <IconChip size="sm" tone="neutral">
            {icon}
          </IconChip>
          <span className="truncate">{item.title}</span>
        </button>
      ))}
    </div>
  );
}
