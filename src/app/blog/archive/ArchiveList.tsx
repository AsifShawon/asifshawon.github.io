"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/supabase/types";
import { fetchCommentCounts, POSTS_PER_PAGE } from "@/lib/blogQueries";
import ArchivePostRow from "../_components/ArchivePostRow";

/**
 * Paginated archive list. Rows are separated by hairline rules; the "load
 * more" control only appears when there genuinely are more rows to fetch.
 */
export default function ArchiveList({
  initialPosts,
  initialCommentCounts,
  totalCount,
  authorName,
  authorAvatarUrl,
}: {
  initialPosts: BlogPost[];
  initialCommentCounts: Record<string, number>;
  totalCount: number;
  authorName: string;
  authorAvatarUrl: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [commentCounts, setCommentCounts] = useState(initialCommentCounts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = posts.length < totalCount;

  async function loadMore() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const from = posts.length;
    const { data, error: loadError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .eq("archived", false)
      .order("published_at", { ascending: false })
      .range(from, from + POSTS_PER_PAGE - 1)
      .returns<BlogPost[]>();

    if (loadError || !data) {
      setError(loadError?.message ?? "Could not load more posts.");
      setLoading(false);
      return;
    }

    const nextCounts = await fetchCommentCounts(
      supabase,
      data.map((p) => p.id)
    );

    setPosts((prev) => [...prev, ...data]);
    setCommentCounts((prev) => ({ ...prev, ...nextCounts }));
    setLoading(false);
  }

  return (
    <div>
      <ol className="list-none">
        {posts.map((post, i) => (
          <li
            key={post.id}
            style={i > 0 ? { borderTop: "1px solid var(--blog-border)" } : undefined}
          >
            <ArchivePostRow
              post={post}
              commentCount={commentCounts[post.id] ?? 0}
              priority={i < 2}
              authorName={authorName}
              authorAvatarUrl={authorAvatarUrl}
            />
          </li>
        ))}
      </ol>

      {error && (
        <p
          className="mt-6 text-center text-sm"
          style={{ color: "var(--ml-error)" }}
          role="alert"
        >
          {error}
        </p>
      )}

      {hasMore && (
        <div
          className="mt-8 flex flex-col items-center gap-3 pt-8"
          style={{ borderTop: "1px solid var(--blog-border)" }}
        >
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="blog-button blog-button--ghost"
          >
            {loading && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
            {loading ? "Loading…" : "Load more posts"}
          </button>
          <p className="text-[0.75rem]" style={{ color: "var(--blog-text-subtle)" }}>
            Showing {posts.length} of {totalCount}
          </p>
        </div>
      )}
    </div>
  );
}
