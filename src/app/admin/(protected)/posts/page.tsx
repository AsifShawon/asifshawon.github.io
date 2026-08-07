import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/supabase/types";
import { Plus } from "lucide-react";
import PostsListClient from "./PostsListClient";

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<BlogPost[]>();

  return (
    <div className="mx-auto max-w-5xl">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Posts</h1>
          <p className="mt-0.5 text-sm text-zinc-500">Write and manage your blog posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-500"
        >
          <Plus size={15} />
          New Post
        </Link>
      </div>

      {/* ── List ─────────────────────────────────────────────── */}
      <PostsListClient initialPosts={data ?? []} />
    </div>
  );
}
