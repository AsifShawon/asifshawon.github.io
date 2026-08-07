"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/supabase/types";
import { Archive, ArchiveRestore, Eye, FilePlus2, Pencil, Trash2 } from "lucide-react";

/* ─── Types & constants ─────────────────────────────────────── */
type Filter = "all" | "published" | "draft" | "archived";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
  { key: "archived", label: "Archived" },
];

/* ─── Status Badge ──────────────────────────────────────────── */
function StatusBadge({ post }: { post: BlogPost }) {
  if (post.archived) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
        Archived
      </span>
    );
  }
  if (post.published) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Draft
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PostsListClient
═══════════════════════════════════════════════════════════════ */
export default function PostsListClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Filter ──────────────────────────────────────────────── */
  const filteredPosts = useMemo(() => {
    switch (filter) {
      case "published": return posts.filter((p) => p.published && !p.archived);
      case "draft":     return posts.filter((p) => !p.published && !p.archived);
      case "archived":  return posts.filter((p) => p.archived);
      default:          return posts;
    }
  }, [posts, filter]);

  /* ── Counts for filter pills ─────────────────────────────── */
  const counts: Record<Filter, number> = useMemo(() => ({
    all:       posts.length,
    published: posts.filter((p) => p.published && !p.archived).length,
    draft:     posts.filter((p) => !p.published && !p.archived).length,
    archived:  posts.filter((p) => p.archived).length,
  }), [posts]);

  /* ── Mutations ───────────────────────────────────────────── */
  async function setArchivedFor(ids: string[], archived: boolean) {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.from("blog_posts").update({ archived }).in("id", ids);
    setBusy(false);
    if (err) { setError(err.message); return; }
    setPosts((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, archived } : p)));
  }

  async function deleteOne(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.from("blog_posts").delete().eq("id", id);
    setBusy(false);
    if (err) { setError(err.message); return; }
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  /* ════════════════════ RENDER ═══════════════════════════════ */
  return (
    <div>
      {/* ── Filter Tabs ───────────────────────────────────────── */}
      <div className="mb-5 flex overflow-x-auto pb-1 max-w-full items-center gap-2 sm:flex-wrap scrollbar-none">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === key
                ? "border-[#76ABAE] bg-[#76ABAE]/15 text-[#76ABAE]"
                : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
            }`}
          >
            {label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                filter === key ? "bg-[#76ABAE]/20 text-[#76ABAE]" : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Error ─────────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
        {/* Table Header */}
        <div className="hidden grid-cols-[1fr_90px_120px_80px] items-center border-b border-zinc-800 px-5 py-3 md:grid">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Title</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Views</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</span>
          <span className="text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Actions</span>
        </div>

        {/* Rows */}
        {filteredPosts.length > 0 ? (
          <ul className="divide-y divide-zinc-800/60">
            {filteredPosts.map((post) => (
              <li
                key={post.id}
                className="group flex flex-col gap-3 px-4 py-3.5 sm:px-5 sm:py-4 transition-colors hover:bg-zinc-800/40 md:grid md:grid-cols-[1fr_90px_120px_80px] md:items-center md:gap-0 md:py-3.5"
              >
                {/* Title */}
                <div className="min-w-0">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="block truncate font-semibold text-white transition-colors hover:text-[#76ABAE]"
                  >
                    {post.title || "Untitled"}
                  </Link>
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    /blog/{post.slug}
                  </a>
                </div>

                {/* Mobile Meta & Actions Row */}
                <div className="flex items-center justify-between gap-2 md:contents">
                  <div className="flex items-center gap-3 md:contents">
                    {/* Views */}
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400">
                      <Eye size={13} className="shrink-0 text-zinc-600" />
                      <span>{post.views?.toLocaleString() ?? 0}</span>
                    </div>

                    {/* Status */}
                    <div>
                      <StatusBadge post={post} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      aria-label="Edit post"
                      title="Edit"
                      className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => setArchivedFor([post.id], !post.archived)}
                      disabled={busy}
                      aria-label={post.archived ? "Unarchive" : "Archive"}
                      title={post.archived ? "Unarchive" : "Archive"}
                      className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-40"
                    >
                      {post.archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                    </button>
                    <button
                      onClick={() => deleteOne(post.id, post.title ?? "Untitled")}
                      disabled={busy}
                      aria-label="Delete post"
                      title="Delete"
                      className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-500/15 hover:text-red-400 disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          /* ── Empty State ──────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-600">
              <FilePlus2 size={26} />
            </div>
            <div>
              <p className="font-semibold text-white">
                {posts.length === 0 ? "No posts yet" : "No posts match this filter"}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {posts.length === 0
                  ? "Create your first post to get started."
                  : "Try selecting a different filter above."}
              </p>
            </div>
            {posts.length === 0 && (
              <Link
                href="/admin/posts/new"
                className="inline-flex h-9 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-500"
              >
                + New Post
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── Footer count ─────────────────────────────────────────── */}
      {filteredPosts.length > 0 && (
        <p className="mt-3 text-right text-xs text-zinc-600">
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
        </p>
      )}
    </div>
  );
}
