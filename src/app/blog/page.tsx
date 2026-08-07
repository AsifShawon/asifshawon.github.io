import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/supabase/types";
import { fetchCommentCounts } from "@/lib/blogQueries";
import CustomBreadcrumb from "@/app/comps/breadCrumb";
import BlogGrid from "./BlogGrid";
import HeroSlider from "./HeroSlider";

// More than fit on screen at once (3 on desktop), so the carousel has
// somewhere to slide to and its arrows/dots are meaningful.
const FEATURED_COUNT = 6;

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: postsData } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .eq("archived", false)
    .order("published_at", { ascending: false })
    .returns<BlogPost[]>();

  const posts = postsData ?? [];

  const [profileResult, commentCounts] = await Promise.all([
    supabase.from("profiles").select("full_name, avatar_url").limit(1).maybeSingle(),
    fetchCommentCounts(supabase, posts.map((p) => p.id)),
  ]);

  const authorName = profileResult.data?.full_name ?? "Author";
  const authorAvatarUrl = profileResult.data?.avatar_url ?? null;

  const featured = posts.slice(0, FEATURED_COUNT);
  const rest = posts.slice(FEATURED_COUNT);

  return (
    <div className="min-h-screen relative z-10">
      <div className="pl-6 md:pl-10 opacity-70 font-mono pt-8">
        <CustomBreadcrumb
          pageNames={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
          ]}
        />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden px-6 pt-16 pb-14 text-center md:px-12">
        <div
          className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full opacity-70 blur-[70px]"
          style={{
            background:
              "radial-gradient(circle, rgba(118,171,174,0.35) 0%, rgba(118,171,174,0.08) 55%, transparent 75%)",
          }}
        />
        <div
          className="pointer-events-none absolute top-10 right-1/4 h-80 w-80 rounded-full opacity-60 blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(90,156,160,0.3) 0%, rgba(90,156,160,0.06) 55%, transparent 75%)",
          }}
        />
        <div
          className="pointer-events-none absolute top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-50 blur-[70px]"
          style={{
            background: "radial-gradient(circle, rgba(118,171,174,0.22) 0%, transparent 70%)",
          }}
        />

        <div className="relative">
          <h1 className="font-display text-4xl font-bold tracking-tight gradient-text md:text-6xl">
            Blog
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Notes from a builder now learning ecommerce — marketing, growth, and the code that got me here.
          </p>
        </div>
      </div>

      {/* Featured slider */}
      {featured.length > 0 && (
        <div className="mx-auto max-w-7xl px-3 pb-16 md:px-9">
          <HeroSlider
            posts={featured}
            authorName={authorName}
            authorAvatarUrl={authorAvatarUrl}
            commentCounts={commentCounts}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts published yet — check back soon.</p>
        ) : (
          <BlogGrid
            posts={rest.length > 0 ? rest : posts}
            authorName={authorName}
            authorAvatarUrl={authorAvatarUrl}
            commentCounts={commentCounts}
            showArchiveLink
          />
        )}
      </div>
    </div>
  );
}
