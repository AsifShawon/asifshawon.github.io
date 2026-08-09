import type { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/site";
import type { BlogPost } from "@/lib/supabase/types";
import { collectTagCounts, fetchCommentCounts, POSTS_PER_PAGE } from "@/lib/blogQueries";
import CustomBreadcrumb from "@/app/comps/breadCrumb";

import ArchiveList from "./ArchiveList";
import EmptyState from "../_components/EmptyState";
import RecentPostMiniCard from "../_components/RecentPostMiniCard";
import { AUTHOR_FALLBACK_AVATAR } from "../_components/types";
import { Eyebrow } from "../_components/ui";

/** Below this the sidebar would just mirror the list, so it is hidden. */
const SIDEBAR_MIN_POSTS = 6;

// The root layout's title template appends "| Asif Bhuiyan Shawon".
export const metadata: Metadata = pageMetadata({
  title: "All writing",
  description:
    "Every post published on the blog, newest first — ecommerce, growth, web development and AI.",
  path: "/blog/archive",
});

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
  const totalCount = count ?? posts.length;

  const [profileResult, commentCounts] = await Promise.all([
    supabase.from("profiles").select("full_name, avatar_url").limit(1).maybeSingle(),
    fetchCommentCounts(
      supabase,
      posts.map((p) => p.id)
    ),
  ]);

  const authorName = profileResult.data?.full_name ?? "Asif Bhuiyan Shawon";
  const authorAvatarUrl = profileResult.data?.avatar_url?.trim()
    ? profileResult.data.avatar_url
    : AUTHOR_FALLBACK_AVATAR;

  const tagCounts = collectTagCounts(posts);
  const showSidebar = totalCount >= SIDEBAR_MIN_POSTS;

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-[76rem] px-6 pt-6 text-[0.8125rem] opacity-70 md:px-10">
        <CustomBreadcrumb
          pageNames={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: "Archive", href: "/blog/archive" },
          ]}
        />
      </div>

      <div className="mx-auto max-w-[76rem] px-6 pt-10 md:px-10 md:pt-16">
        <header className="max-w-2xl">
          <Eyebrow>Archive</Eyebrow>
          <h1 className="blog-display mt-5 text-[2.25rem] leading-[1.05] sm:text-[3rem] lg:text-[3.5rem]">
            All writing
          </h1>
          <p
            className="mt-4 text-[1rem] leading-[1.7]"
            style={{ color: "var(--blog-text-muted)" }}
          >
            {totalCount} published {totalCount === 1 ? "post" : "posts"}, newest first — every
            note, experiment and lesson in one place.
          </p>
        </header>

        <hr className="blog-divider my-10 md:my-12" />

        {posts.length === 0 ? (
          <EmptyState
            title="The archive is empty"
            description="No posts have been published yet. The first ones are on the way."
            action={{ label: "Back to the blog", href: "/blog" }}
          />
        ) : (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className={showSidebar ? "lg:col-span-8" : "lg:col-span-12"}>
              <ArchiveList
                initialPosts={posts}
                initialCommentCounts={commentCounts}
                totalCount={totalCount}
                authorName={authorName}
                authorAvatarUrl={authorAvatarUrl}
              />
            </div>

            {showSidebar && (
              <aside className="hidden lg:col-span-4 lg:block">
                <div className="sticky top-8 flex flex-col gap-8">
                  <section aria-labelledby="archive-recent-heading">
                    <h2
                      id="archive-recent-heading"
                      className="mb-4 text-[0.875rem] font-semibold"
                      style={{ color: "var(--blog-text)" }}
                    >
                      Recent posts
                    </h2>
                    <div className="flex flex-col gap-4">
                      {posts.slice(0, 4).map((post) => (
                        <RecentPostMiniCard key={post.id} post={post} />
                      ))}
                    </div>
                  </section>

                  {tagCounts.length >= 3 && (
                    <section aria-labelledby="archive-tags-heading">
                      <h2
                        id="archive-tags-heading"
                        className="mb-4 text-[0.875rem] font-semibold"
                        style={{ color: "var(--blog-text)" }}
                      >
                        Popular tags
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {tagCounts.slice(0, 10).map(({ tag, count }) => (
                          <Link
                            key={tag}
                            href={`/blog?tag=${encodeURIComponent(tag)}`}
                            className="blog-chip"
                          >
                            {tag}
                            <span className="blog-chip__count">{count}</span>
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
