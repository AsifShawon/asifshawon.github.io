import type { SupabaseClient } from "@supabase/supabase-js";
import type { BlogPost } from "@/lib/supabase/types";

export const POSTS_PER_PAGE = 9;

/** Columns needed to render a nav/sidebar preview — deliberately excludes the
 *  (potentially large) `content` document. */
const PREVIEW_COLUMNS = "id, title, slug, excerpt, cover_image_url, tags, published_at";

export type PostPreview = Pick<
  BlogPost,
  "id" | "title" | "slug" | "excerpt" | "cover_image_url" | "tags" | "published_at"
>;

/**
 * Approved comment counts keyed by post id, fetched in a single round trip
 * (avoids an N+1 when rendering a page of cards).
 */
export async function fetchCommentCounts(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<Record<string, number>> {
  if (postIds.length === 0) return {};

  const { data } = await supabase
    .from("comments")
    .select("post_id")
    .in("post_id", postIds)
    .eq("is_approved", true);

  const counts: Record<string, number> = {};
  (data ?? []).forEach((row: { post_id: string }) => {
    counts[row.post_id] = (counts[row.post_id] ?? 0) + 1;
  });
  return counts;
}

/**
 * Every publicly visible post, newest first. Single source of truth for the
 * blog index — the nav, archive and related-posts widgets all derive from the
 * same `published && !archived` predicate.
 */
export async function fetchPublishedPosts(supabase: SupabaseClient): Promise<BlogPost[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .eq("archived", false)
    .order("published_at", { ascending: false })
    .returns<BlogPost[]>();

  return data ?? [];
}

/**
 * The whole published index without the (potentially large) `content`
 * documents — enough to compute neighbours and related posts on an article
 * page without pulling every article body along with it.
 */
export async function fetchPublishedPostPreviews(
  supabase: SupabaseClient
): Promise<PostPreview[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select(PREVIEW_COLUMNS)
    .eq("published", true)
    .eq("archived", false)
    .order("published_at", { ascending: false })
    .returns<PostPreview[]>();

  return data ?? [];
}

export interface TagCount {
  tag: string;
  count: number;
}

/** Tags present in the given posts, most-used first, ties broken alphabetically. */
export function collectTagCounts(posts: Pick<BlogPost, "tags">[]): TagCount[] {
  const counts = new Map<string, number>();
  posts.forEach((post) => {
    (post.tags ?? []).forEach((raw) => {
      const tag = raw.trim();
      if (tag) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Case-insensitive tag match, so `?tag=Career` and `?tag=career` behave alike. */
export function postHasTag(post: Pick<BlogPost, "tags">, tag: string): boolean {
  const needle = tag.trim().toLowerCase();
  return (post.tags ?? []).some((t) => t.trim().toLowerCase() === needle);
}

/**
 * Posts related to `post`, ranked by shared tags then recency. Returns only
 * real matches — falls back to "most recent other posts" so the section is
 * still useful for an untagged article, and never invents anything.
 */
export function findRelatedPosts<T extends Pick<BlogPost, "id" | "tags">>(
  post: Pick<BlogPost, "id" | "tags">,
  all: T[],
  limit = 3
): T[] {
  const own = new Set((post.tags ?? []).map((t) => t.trim().toLowerCase()));
  const others = all.filter((p) => p.id !== post.id);

  // `sort` is stable in modern JS engines, so equal-scoring candidates keep
  // their newest-first order from the query.
  const scored = others
    .map((candidate) => ({
      candidate,
      shared: (candidate.tags ?? []).filter((t) => own.has(t.trim().toLowerCase())).length,
    }))
    .sort((a, b) => b.shared - a.shared);

  return scored.slice(0, limit).map((entry) => entry.candidate);
}

/** Neighbours in the published timeline (newest-first array). */
export function findAdjacentPosts<T extends Pick<BlogPost, "id">>(
  posts: T[],
  currentId: string
): { newer: T | null; older: T | null } {
  const index = posts.findIndex((p) => p.id === currentId);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
  };
}
