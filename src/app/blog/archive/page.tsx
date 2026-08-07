import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/supabase/types";
import { fetchCommentCounts, POSTS_PER_PAGE } from "@/lib/blogQueries";
import CustomBreadcrumb from "@/app/comps/breadCrumb";
import ArchiveList from "./ArchiveList";

export const metadata = {
  title: "Blog Archive — Asif Bhuiyan Shawon",
  description: "Every published post, newest first.",
};

export default async function BlogArchivePage() {
  const supabase = await createClient();

  const { data, count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .eq("archived", false)
    .order("published_at", { ascending: false })
    .range(0, POSTS_PER_PAGE - 1)
    .returns<BlogPost[]>();

  const posts = data ?? [];

  const [profileResult, commentCounts] = await Promise.all([
    supabase.from("profiles").select("full_name, avatar_url").limit(1).maybeSingle(),
    fetchCommentCounts(supabase, posts.map((p) => p.id)),
  ]);

  return (
    <div className="min-h-screen relative z-10">
      <div className="pl-6 md:pl-10 opacity-70 font-mono pt-8">
        <CustomBreadcrumb
          pageNames={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: "Archive", href: "/blog/archive" },
          ]}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-12 pb-24">
        <div className="mb-12">
          <h1 className="font-display text-3xl font-bold tracking-tight gradient-text md:text-5xl">
            Archive
          </h1>
          <p className="mt-3 text-gray-400">
            {count ?? posts.length} published {(count ?? posts.length) === 1 ? "post" : "posts"},
            newest first.
          </p>
        </div>

        <ArchiveList
          initialPosts={posts}
          initialCommentCounts={commentCounts}
          totalCount={count ?? posts.length}
          authorName={profileResult.data?.full_name ?? "Author"}
          authorAvatarUrl={profileResult.data?.avatar_url ?? null}
        />
      </div>
    </div>
  );
}
