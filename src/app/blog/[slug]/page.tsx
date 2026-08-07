import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, Eye, Clock } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import type { BlogPost, Comment, Profile } from "@/lib/supabase/types";
import CustomBreadcrumb from "@/app/comps/breadCrumb";
import { formatReadingTime, formatPostDate } from "@/lib/utils/readingTime";

import PostContent from "./PostContent";
import ViewCounter from "./ViewCounter";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";

export const revalidate = 60;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle<BlogPost>();

  if (!post) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, full_name, bio")
    .limit(1)
    .maybeSingle<Profile>();

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", post.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .returns<Comment[]>();

  const category = post.tags?.[0] ?? "Editorial";
  const authorName = profile?.full_name ?? "Asif Shawon";
  const authorAvatar = profile?.avatar_url?.trim() ? profile.avatar_url : "/assets/withshawon-logo.webp";
  const authorBio =
    profile?.bio?.intro ||
    "Full-stack software engineer & creator building high quality web applications and digital experiences.";
  const readingTime = formatReadingTime(post.content);
  const formattedDate = formatPostDate(post.published_at);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 relative z-10 selection:bg-zinc-800 selection:text-zinc-100">
      <ViewCounter slug={post.slug} />

      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="opacity-70 font-mono text-xs">
          <CustomBreadcrumb
            pageNames={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: post.title, href: `/blog/${post.slug}` },
            ]}
          />
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        {/* Article Header */}
        <header className="mb-10 text-left">
          {/* Category Pill */}
          <div className="mb-4">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300 shadow-xs">
              {category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-100 leading-[1.15] mb-8 max-w-4xl">
            {post.title}
          </h1>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-zinc-400 pb-8 border-b border-zinc-800/80">
            {/* Author Avatar & Name */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-700/80 bg-zinc-800 shrink-0 shadow-sm">
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <span className="font-semibold text-zinc-200">{authorName}</span>
            </div>

            {formattedDate && (
              <>
                <span className="text-zinc-700 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <CalendarDays size={15} className="text-zinc-500" />
                  {formattedDate}
                </span>
              </>
            )}

            <span className="text-zinc-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Clock size={15} className="text-zinc-500" />
              {readingTime}
            </span>

            <span className="text-zinc-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Eye size={15} className="text-zinc-500" />
              {post.views ?? 0} views
            </span>
          </div>
        </header>

        {/* Hero Cover Image */}
        {post.cover_image_url && (
          <div className="relative aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl mb-14 bg-zinc-900">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1024px"
            />
          </div>
        )}

        {/* Article Content Body (Centered narrow column max-w-3xl) */}
        <div className="max-w-3xl mx-auto">
          <PostContent content={post.content} />

          {/* Bottom Engagement Section */}
          <section className="mt-16 pt-8 border-t border-zinc-800">
            {/* Author Bio Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 backdrop-blur-sm shadow-xl">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border-2 border-zinc-700 shrink-0 bg-zinc-800 shadow-md">
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                  Written By
                </span>
                <h3 className="font-serif text-xl font-bold text-zinc-100 mb-2">
                  {authorName}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                  {authorBio}
                </p>
              </div>
            </div>

            {/* Like Button */}
            <div className="flex items-center justify-between py-2 mb-6">
              <LikeButton postId={post.id} />
            </div>

            {/* Comments Section */}
            <CommentsSection postId={post.id} initialComments={comments ?? []} />
          </section>
        </div>
      </article>
    </main>
  );
}
