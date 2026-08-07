"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/supabase/types";
import BlogCard, { type BlogCardVariant } from "./BlogCard";

/**
 * Repeating 7-post rhythm that keeps every desktop row summing to 12 columns:
 *   row 1  large(8) + compact(4)
 *   row 2  medium(6) + medium(6)
 *   row 3  text(4) + text(4) + text(4)
 * Partial groups degrade gracefully — the grid just ends early.
 */
const LAYOUT_RHYTHM: { variant: BlogCardVariant; span: string }[] = [
  { variant: "large", span: "lg:col-span-8" },
  { variant: "compact", span: "lg:col-span-4" },
  { variant: "medium", span: "lg:col-span-6" },
  { variant: "medium", span: "lg:col-span-6" },
  { variant: "text", span: "lg:col-span-4" },
  { variant: "text", span: "lg:col-span-4" },
  { variant: "text", span: "lg:col-span-4" },
];

export default function BlogGrid({
  posts,
  authorName,
  authorAvatarUrl,
  commentCounts,
  showArchiveLink = false,
}: {
  posts: BlogPost[];
  authorName: string;
  authorAvatarUrl: string | null;
  commentCounts: Record<string, number>;
  showArchiveLink?: boolean;
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) => {
      (post.tags ?? []).forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  const filteredPosts = activeTag
    ? posts.filter((post) => (post.tags ?? []).includes(activeTag))
    : posts;

  return (
    <div>
      {tagCounts.length > 0 && (
        <div className="relative mb-8 flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTag === null
                  ? "border-[#76ABAE] bg-[#76ABAE]/15 text-[#76ABAE]"
                  : "border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              All <span className="text-gray-500">{posts.length}</span>
            </button>
            {tagCounts.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  activeTag === tag
                    ? "border-[#76ABAE] bg-[#76ABAE]/15 text-[#76ABAE]"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {tag} <span className="text-gray-500">{count}</span>
              </button>
            ))}
          </div>
          {showArchiveLink && (
            <Link
              href="/blog/archive"
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-[#76ABAE] hover:text-[#76ABAE]"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <p className="text-sm text-gray-500">No posts in this category yet.</p>
      ) : (
        <div key={activeTag ?? "all"} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {filteredPosts.map((post, i) => {
            const { variant, span } = LAYOUT_RHYTHM[i % LAYOUT_RHYTHM.length];
            return (
              <div key={post.id} className={span}>
                <BlogCard
                  post={post}
                  variant={variant}
                  authorName={authorName}
                  authorAvatarUrl={authorAvatarUrl}
                  commentCount={commentCounts[post.id] ?? 0}
                  index={i}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
