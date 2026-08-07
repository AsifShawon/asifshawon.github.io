import { createClient } from "@/lib/supabase/server";
import CommentsAdminClient, { type CommentWithPost } from "./CommentsAdminClient";

export default async function AdminCommentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("*, blog_posts(title, slug)")
    .order("created_at", { ascending: false })
    .returns<CommentWithPost[]>();

  return <CommentsAdminClient initialComments={data ?? []} />;
}
