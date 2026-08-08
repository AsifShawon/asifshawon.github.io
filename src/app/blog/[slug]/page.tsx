import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { getSiteOrigin } from "@/lib/siteUrl";
import type { BlogPost, Comment, Profile } from "@/lib/supabase/types";
import {
  fetchCommentCounts,
  fetchPublishedPostPreviews,
  findAdjacentPosts,
  findRelatedPosts,
} from "@/lib/blogQueries";
import { formatPostDate, formatReadingTime } from "@/lib/readingTime";
import CustomBreadcrumb from "@/app/comps/breadCrumb";

import PostContent from "./PostContent";
import ViewCounter from "./ViewCounter";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
import ShareActions from "./ShareActions";
import TableOfContents from "./TableOfContents";

import AuthorCard from "../_components/AuthorCard";
import CompactPostCard from "../_components/CompactPostCard";
import PostNavigation from "../_components/PostNavigation";
import SectionHeading from "../_components/SectionHeading";
import StandardPostCard from "../_components/StandardPostCard";
import { collectHeadings } from "../_components/postHeadings";
import { AUTHOR_FALLBACK_AVATAR } from "../_components/types";
import { CategoryPill } from "../_components/ui";

export const revalidate = 60;

/** A contents list is only worth the gutter once there is real structure.
 *  Counts H2 *and* H3 — posts here use H3 as their section level. */
const TOC_MIN_HEADINGS = 3;

async function loadPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle<BlogPost>();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return { title: "Post not found" };

  const description = post.excerpt ?? undefined;
  const url = `/blog/${post.slug}`;
  const images = post.cover_image_url ? [{ url: post.cover_image_url, alt: post.title }] : undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url,
      images,
      publishedTime: post.published_at ?? undefined,
      tags: post.tags ?? undefined,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const post = await loadPost(slug);
  if (!post) notFound();

  const [profileResult, commentsResult, allPreviews, origin] = await Promise.all([
    supabase.from("profiles").select("avatar_url, full_name, tagline, bio").limit(1).maybeSingle<Profile>(),
    supabase
      .from("comments")
      .select("*")
      .eq("post_id", post.id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .returns<Comment[]>(),
    fetchPublishedPostPreviews(supabase),
    getSiteOrigin(),
  ]);

  const profile = profileResult.data;
  const comments = commentsResult.data ?? [];

  const authorName = profile?.full_name ?? "Asif Bhuiyan Shawon";
  const authorAvatar = profile?.avatar_url?.trim() ? profile.avatar_url : AUTHOR_FALLBACK_AVATAR;
  const authorBio =
    profile?.bio?.intro ??
    "Ecommerce Executive learning marketing, ads and growth — with a background in AI and full-stack software engineering.";

  const tags = (post.tags ?? []).filter((tag) => tag.trim().length > 0);
  const category = tags[0] ?? null;
  const readingTime = formatReadingTime(post.content);
  const formattedDate = formatPostDate(post.published_at);

  const headings = collectHeadings(post.content);
  const showToc = headings.length >= TOC_MIN_HEADINGS;

  const { older, newer } = findAdjacentPosts(allPreviews, post.id);
  const related = findRelatedPosts(post, allPreviews, 3);
  const relatedCommentCounts = await fetchCommentCounts(
    supabase,
    related.map((p) => p.id)
  );

  const canonicalUrl = `${origin}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.published_at ?? post.created_at,
    keywords: tags.length > 0 ? tags.join(", ") : undefined,
    author: {
      "@type": "Person",
      name: authorName,
      url: origin ? `${origin}/hello/aboutme` : undefined,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    url: canonicalUrl,
  };

  return (
    <div className="pb-24">
      <ViewCounter slug={post.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[76rem] px-6 pt-6 text-[0.8125rem] opacity-70 md:px-10">
        <CustomBreadcrumb
          pageNames={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: post.title, href: `/blog/${post.slug}` },
          ]}
        />
      </div>

      <article className="mx-auto max-w-[76rem] px-6 pt-10 md:px-10 md:pt-14">
        {/* ------------------------------------------------------- header */}
        <header className="mx-auto max-w-[48rem]">
          {category && (
            <Link href={`/blog?tag=${encodeURIComponent(category)}`} className="inline-block">
              <CategoryPill label={category} tone="accent" />
            </Link>
          )}

          <h1 className="blog-display mt-5 text-[2.25rem] leading-[1.08] sm:text-[3rem] lg:text-[3.6rem]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              className="mt-6 text-[1.0625rem] leading-[1.7] sm:text-[1.1875rem]"
              style={{ color: "var(--blog-text-muted)" }}
            >
              {post.excerpt}
            </p>
          )}

          <div
            className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-6"
            style={{ borderTop: "1px solid var(--blog-border)" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
                style={{
                  border: "1px solid var(--blog-border)",
                  background: "var(--blog-surface-raised)",
                }}
              >
                <Image src={authorAvatar} alt="" fill sizes="40px" className="object-cover" />
              </span>
              <div>
                <p
                  className="text-[0.875rem] font-semibold"
                  style={{ color: "var(--blog-text)" }}
                >
                  {authorName}
                </p>
                <div
                  className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[0.75rem]"
                  style={{ color: "var(--blog-text-muted)" }}
                >
                  {formattedDate && (
                    <time dateTime={post.published_at ?? undefined}>{formattedDate}</time>
                  )}
                  {formattedDate && <span aria-hidden="true">·</span>}
                  <span>{readingTime}</span>
                  {post.views > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{post.views} views</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <ShareActions url={canonicalUrl} title={post.title} />
          </div>
        </header>

        {/* --------------------------------------------------------- hero */}
        {post.cover_image_url && (
          <figure className="mx-auto mt-10 max-w-[64rem] md:mt-12">
            <div
              className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px]"
              style={{ border: "1px solid var(--blog-border)" }}
            >
              <Image
                src={post.cover_image_url}
                alt={`Cover image for “${post.title}”`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </figure>
        )}

        {/* --------------------------------------------------------- body */}
        <div className="mt-12 md:mt-16">
          <div className="relative mx-auto max-w-[45rem]">
            {showToc && (
              <aside className="absolute left-full top-0 hidden h-full w-[12.5rem] pl-12 xl:block">
                <div className="sticky top-8">
                  <TableOfContents headings={headings} />
                </div>
              </aside>
            )}

            <PostContent content={post.content} />
          </div>
        </div>

        {/* ----------------------------------------------------- endmatter */}
        <div className="mx-auto mt-14 flex max-w-[45rem] flex-col gap-10 md:mt-16">
          <div
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-8"
            style={{ borderTop: "1px solid var(--blog-border)" }}
          >
            {tags.length > 0 ? (
              <ul className="flex flex-wrap items-center gap-2" aria-label="Tags">
                {tags.map((tag) => (
                  <li key={tag}>
                    <Link href={`/blog?tag=${encodeURIComponent(tag)}`} className="blog-chip">
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <span />
            )}
            <ShareActions url={canonicalUrl} title={post.title} />
          </div>

          <LikeButton postId={post.id} />

          <AuthorCard
            name={authorName}
            bio={authorBio}
            avatarUrl={authorAvatar}
            tagline={profile?.tagline ?? null}
          />

          <PostNavigation older={older} newer={newer} />
        </div>

        {/* ------------------------------------------------------ related */}
        {related.length > 0 && (
          <section className="mt-20 md:mt-24">
            <SectionHeading
              title="Continue reading"
              description="More notes from the same corner of the build."
              action={{ label: "All writing", href: "/blog/archive" }}
            />
            {/* One or two suggestions read better as full-width horizontal
                cards than as a lone card floating in a three-column grid. */}
            {related.length >= 3 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <StandardPostCard
                    key={item.id}
                    post={item}
                    commentCount={relatedCommentCounts[item.id] ?? 0}
                  />
                ))}
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 gap-4 ${
                  related.length === 2 ? "md:grid-cols-2" : ""
                }`}
              >
                {related.map((item) => (
                  <CompactPostCard
                    key={item.id}
                    post={item}
                    commentCount={relatedCommentCounts[item.id] ?? 0}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ----------------------------------------------------- comments */}
        <div className="mx-auto mt-20 max-w-[45rem] md:mt-24">
          <CommentsSection postId={post.id} initialComments={comments} />
        </div>
      </article>
    </div>
  );
}
