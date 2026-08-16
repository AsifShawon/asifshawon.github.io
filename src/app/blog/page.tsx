import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/site";
import {
  collectTagCounts,
  fetchCommentCounts,
  fetchPublishedPosts,
  postHasTag,
} from "@/lib/blogQueries";
import CustomBreadcrumb from "@/app/comps/breadCrumb";

import BlogPageHeader from "./_components/BlogPageHeader";
import EmptyState from "./_components/EmptyState";
import FeaturedSlider from "./_components/FeaturedSlider";
import LatestMosaic from "./_components/LatestMosaic";
import SectionHeading from "./_components/SectionHeading";
import StandardPostCard from "./_components/StandardPostCard";
import TopicsStrip from "./_components/TopicsStrip";
import { AUTHOR_FALLBACK_AVATAR } from "./_components/types";

/** How many of the newest posts fill the featured rail; the rest feed the
 *  mosaic below, so no post is ever shown twice on the page. */
const FEATURED_COUNT = 3;

// The root layout's title template appends "| Asif Bhuiyan Shawon".
export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "A builder learning ecommerce — marketing, growth, technology, and everything else I pick up along the way.",
  path: "/blog",
});

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value?.trim() ? value.trim() : null;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const supabase = await createClient();
  const { tag: rawTag } = await searchParams;
  const requestedTag = firstParam(rawTag);

  const posts = await fetchPublishedPosts(supabase);

  const [profileResult, commentCounts] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, tagline, avatar_url")
      .limit(1)
      .maybeSingle(),
    fetchCommentCounts(
      supabase,
      posts.map((p) => p.id)
    ),
  ]);

  const authorName = profileResult.data?.full_name ?? "Asif Bhuiyan Shawon";
  const authorTagline = profileResult.data?.tagline ?? null;
  const authorAvatarUrl = profileResult.data?.avatar_url?.trim()
    ? profileResult.data.avatar_url
    : AUTHOR_FALLBACK_AVATAR;

  const tagCounts = collectTagCounts(posts);
  // Only honour a tag that actually exists, so a stale/typo URL falls back to
  // the full index rather than rendering an empty page.
  const activeTag =
    requestedTag && tagCounts.some((t) => t.tag.toLowerCase() === requestedTag.toLowerCase())
      ? requestedTag
      : null;

  const filtered = activeTag ? posts.filter((post) => postHasTag(post, activeTag)) : posts;
  const featured = activeTag ? [] : posts.slice(0, FEATURED_COUNT);
  const rest = activeTag ? filtered : posts.slice(featured.length);

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-[76rem] px-6 pt-6 text-[0.8125rem] opacity-70 md:px-10">
        <CustomBreadcrumb
          pageNames={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
          ]}
        />
      </div>

      <div className="mx-auto max-w-[76rem] px-6 pt-10 md:px-10 md:pt-16">
        <BlogPageHeader
          authorName={authorName}
          authorTagline={authorTagline}
          authorAvatarUrl={authorAvatarUrl}
        />

        {posts.length === 0 ? (
          <div className="mt-14">
            <EmptyState
              title="Nothing published yet"
              description="I'm writing the first few pieces now — notes on ecommerce, marketing and the things I'm learning on the job. Check back shortly."
              action={{ label: "See what I'm building", href: "/projects" }}
            />
          </div>
        ) : (
          <>
            <hr className="blog-divider my-10 md:my-12" />

            {activeTag ? (
              <section>
                <TopicsStrip
                  tags={tagCounts}
                  activeTag={activeTag}
                  totalCount={posts.length}
                  className="mb-12 md:mb-14"
                />

                <SectionHeading
                  eyebrow={`${filtered.length} ${filtered.length === 1 ? "post" : "posts"}`}
                  title={`Tagged “${activeTag}”`}
                  description="Everything I've filed under this topic, newest first."
                  action={{ label: "All writing", href: "/blog" }}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((post, i) => (
                    <StandardPostCard
                      key={post.id}
                      post={post}
                      commentCount={commentCounts[post.id] ?? 0}
                      priority={i < 3}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <>
                <section aria-labelledby="featured-heading">
                  <h2 id="featured-heading" className="sr-only">
                    Featured writing
                  </h2>
                  <FeaturedSlider posts={featured} commentCounts={commentCounts} />
                </section>

                <TopicsStrip
                  tags={tagCounts}
                  activeTag={activeTag}
                  totalCount={posts.length}
                  className="my-12 md:my-16"
                />

                {rest.length > 0 && (
                  <section className="mt-14 md:mt-16">
                    <SectionHeading
                      variant="bar"
                      title="Latest writing"
                      description="Thoughts, experiments and lessons from work and building."
                      action={{ label: "View all", href: "/blog/archive" }}
                      className="mb-6 sm:mb-8"
                    />

                    <LatestMosaic
                      posts={rest}
                      commentCounts={commentCounts}
                      authorName={authorName}
                      authorAvatarUrl={authorAvatarUrl}
                    />
                  </section>
                )}

                <Link
                  href="/blog/archive"
                  className="group mt-16 flex items-center justify-between gap-6 rounded-[20px] px-6 py-6 transition-colors md:mt-20 md:px-8"
                  style={{ border: "1px solid var(--blog-border)" }}
                >
                  <span>
                    <span
                      className="blog-display block text-[1.375rem] leading-[1.2] sm:text-[1.625rem]"
                      style={{ color: "var(--blog-text)" }}
                    >
                      Browse the full archive
                    </span>
                    <span
                      className="mt-1 block text-[0.875rem]"
                      style={{ color: "var(--blog-text-muted)" }}
                    >
                      Every published post, newest first.
                    </span>
                  </span>
                  <span aria-hidden="true" className="blog-arrow">
                    <ArrowUpRight size={17} strokeWidth={1.9} />
                  </span>
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
