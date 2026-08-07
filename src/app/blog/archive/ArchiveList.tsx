"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/supabase/types";
import { fetchCommentCounts, POSTS_PER_PAGE } from "@/lib/blogQueries";
import BlogCard from "../BlogCard";

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
  authorAvatarUrl: string | null;
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

    const nextCounts = await fetchCommentCounts(supabase, data.map((p) => p.id));

    setPosts((prev) => [...prev, ...data]);
    setCommentCounts((prev) => ({ ...prev, ...nextCounts }));
    setLoading(false);
  }

  if (posts.length === 0) {
    return <p className="text-sm text-gray-500">No posts published yet — check back soon.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <BlogCard
            key={post.id}
            post={post}
            variant="large"
            authorName={authorName}
            authorAvatarUrl={authorAvatarUrl}
            commentCount={commentCounts[post.id] ?? 0}
            index={i % POSTS_PER_PAGE}
          />
        ))}
      </div>

      {error && <p className="mt-6 text-center text-sm text-red-400">{error}</p>}

      {hasMore && (
        <div className="mt-14 flex flex-col items-center gap-3">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#76ABAE] to-[#5a9ca0] px-7 py-3 text-sm font-semibold text-[#061317] shadow-md shadow-[#76ABAE]/10 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Loading…" : "Load More"}
          </button>
          <p className="text-xs text-gray-500">
            Showing {posts.length} of {totalCount}
          </p>
        </div>
      )}
    </div>
  );
}
