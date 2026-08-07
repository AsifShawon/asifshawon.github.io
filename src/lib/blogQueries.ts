import type { SupabaseClient } from "@supabase/supabase-js";

export const POSTS_PER_PAGE = 9;

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
