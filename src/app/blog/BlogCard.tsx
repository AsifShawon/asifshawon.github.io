"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Bookmark, Clock, Eye, MessageSquare } from "lucide-react";
import type { BlogPost } from "@/lib/supabase/types";
import { formatPostDate, formatReadingTime } from "@/lib/readingTime";

const BOOKMARKS_KEY = "blog-bookmarks";

export type BlogCardVariant = "large" | "medium" | "text" | "compact" | "slide";

function readBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function Dot() {
  return <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-gray-500" />;
}

function MiniAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
        <Image src={avatarUrl} alt={name} fill className="object-cover" />
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#76ABAE] to-[#3f6b6e] font-display text-[10px] font-semibold text-[#061317]">
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

function CategoryPills({ tags, max = 2 }: { tags: string[]; max?: number }) {
  if (tags.length === 0) return null;
  return (
    <>
      {tags.slice(0, max).map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
        >
          {tag}
        </span>
      ))}
    </>
  );
}

function BookmarkButton({ slug }: { slug: string }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(readBookmarks().includes(slug));
  }, [slug]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const current = readBookmarks();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    setBookmarked(next.includes(slug));
  }

  return (
    <button
      onClick={toggle}
      aria-label={bookmarked ? "Remove bookmark" : "Save for later"}
      aria-pressed={bookmarked}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
    >
      <Bookmark size={13} fill={bookmarked ? "currentColor" : "none"} />
    </button>
  );
}

function ArrowBadge({ floating = true }: { floating?: boolean }) {
  const base =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0C161C] text-white shadow-lg shadow-black/40 transition-all duration-300 group-hover:border-[#76ABAE] group-hover:bg-[#76ABAE] group-hover:text-[#061317]";
  return (
    <span className={floating ? `absolute -bottom-4 -right-3 ${base}` : base}>
      <ArrowUpRight size={17} />
    </span>
  );
}

function MetaRow({ commentCount, views }: { commentCount: number; views: number }) {
  return (
    <div className="flex items-center gap-3 text-xs text-gray-500">
      <span className="flex items-center gap-1">
        <MessageSquare size={13} /> {commentCount}
      </span>
      <span className="flex items-center gap-1">
        <Eye size={13} /> {views}
      </span>
    </div>
  );
}

export interface BlogCardProps {
  post: BlogPost;
  variant: BlogCardVariant;
  authorName: string;
  authorAvatarUrl: string | null;
  commentCount: number;
  index: number;
  priority?: boolean;
}

export default function BlogCard({
  post,
  variant,
  authorName,
  authorAvatarUrl,
  commentCount,
  index,
  priority = false,
}: BlogCardProps) {
  const tags = post.tags ?? [];
  const readLabel = formatReadingTime(post.content);
  const dateLabel = formatPostDate(post.published_at);
  const href = `/blog/${post.slug}`;

  const motionProps = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.5, delay: Math.min(index, 6) * 0.06, ease: "easeOut" as const },
  };

  // ── Slide: used inside HeroSlider. Image fills, panel floats over the bottom.
  if (variant === "slide") {
    return (
      <Link href={href} className="group flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          {post.cover_image_url && (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 -mt-20 mx-4 flex flex-1 flex-col gap-2.5 rounded-2xl border border-white/10 bg-black/70 p-5 shadow-xl shadow-black/40 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryPills tags={tags} max={1} />
              {tags.length > 0 && <Dot />}
              {dateLabel && <span className="text-[11px] text-gray-300">{dateLabel}</span>}
              <Dot />
              <span className="text-[11px] text-gray-300">{readLabel}</span>
            </div>
            <BookmarkButton slug={post.slug} />
          </div>

          <h3 className="line-clamp-2 font-display text-xl font-bold leading-snug text-white transition-colors group-hover:text-[#76ABAE]">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="line-clamp-2 text-sm text-gray-400">{post.excerpt}</p>
          )}

          <div className="mt-auto flex items-center pt-1">
            <MetaRow commentCount={commentCount} views={post.views} />
          </div>

          <ArrowBadge />
        </div>
      </Link>
    );
  }

  // ── Medium: horizontal, image left (40%) / text right (60%).
  if (variant === "medium") {
    return (
      <motion.div {...motionProps} className="group relative h-full">
        <Link
          href={href}
          className="flex h-full gap-4 rounded-2xl border border-white/[0.06] bg-[#0C161C] p-3 shadow-lg shadow-black/30 transition-colors hover:border-[#76ABAE]/30"
        >
          <div className="relative w-2/5 shrink-0 overflow-hidden rounded-xl">
            {post.cover_image_url ? (
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 40vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full min-h-[120px] w-full bg-gradient-to-br from-[#132a30] to-[#0A141A]" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-1 pr-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryPills tags={tags} max={1} />
              {tags.length > 0 && <Dot />}
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <Clock size={11} /> {readLabel}
              </span>
            </div>
            <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-white transition-colors group-hover:text-[#76ABAE]">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="line-clamp-1 text-xs text-gray-400">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-3">
              {dateLabel && <span className="text-[11px] text-gray-500">{dateLabel}</span>}
              <MetaRow commentCount={commentCount} views={post.views} />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── Text: no image, editorial list entry.
  if (variant === "text") {
    return (
      <motion.div {...motionProps} className="group relative h-full">
        <Link
          href={href}
          className="flex h-full flex-col gap-3 border-b border-white/10 pb-6 transition-colors hover:border-[#76ABAE]/40"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryPills tags={tags} />
            {tags.length > 0 && <Dot />}
            {dateLabel && <span className="text-[11px] text-gray-500">{dateLabel}</span>}
          </div>

          <h3 className="line-clamp-3 font-display text-xl font-bold leading-snug text-white transition-colors group-hover:text-[#76ABAE]">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">{post.excerpt}</p>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} /> {readLabel}
              </span>
              <MetaRow commentCount={commentCount} views={post.views} />
            </div>
            <ArrowBadge floating={false} />
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── Compact: image fills the card, text overlaid on a heavy gradient.
  if (variant === "compact") {
    return (
      <motion.div {...motionProps} className="group relative h-full">
        <Link
          href={href}
          className="relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.06] shadow-lg shadow-black/30"
        >
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#132a30] to-[#0A141A]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="absolute right-3 top-3 z-10">
            <BookmarkButton slug={post.slug} />
          </div>

          <div className="relative z-10 flex flex-col gap-2 p-5">
            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryPills tags={tags} max={1} />
              {tags.length > 0 && <Dot />}
              <span className="text-[11px] text-gray-300">{readLabel}</span>
            </div>
            <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-[#76ABAE]">
              {post.title}
            </h3>
            <div className="flex items-center gap-3">
              {dateLabel && <span className="text-[11px] text-gray-400">{dateLabel}</span>}
              <MetaRow commentCount={commentCount} views={post.views} />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── Large (default): image on top, floating detail panel below.
  return (
    <motion.div {...motionProps} className="group relative h-full pb-4">
      <Link href={href} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#132a30] to-[#0A141A]" />
          )}
        </div>

        <div className="relative z-10 -mt-14 mx-3 flex flex-1 flex-col gap-2.5 rounded-2xl border border-white/10 bg-black/70 p-5 shadow-xl shadow-black/40 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryPills tags={tags} />
              {tags.length > 0 && <Dot />}
              {dateLabel && <span className="text-[11px] text-gray-400">{dateLabel}</span>}
              <Dot />
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <Clock size={11} /> {readLabel}
              </span>
            </div>
            <BookmarkButton slug={post.slug} />
          </div>

          <h3 className="line-clamp-2 font-display text-xl font-bold leading-snug text-white transition-colors group-hover:text-[#76ABAE] md:text-2xl">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="line-clamp-2 text-sm text-gray-400">{post.excerpt}</p>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <MiniAvatar name={authorName} avatarUrl={authorAvatarUrl} />
              <span className="text-xs text-gray-300">{authorName}</span>
            </div>
            <MetaRow commentCount={commentCount} views={post.views} />
          </div>

          <ArrowBadge />
        </div>
      </Link>
    </motion.div>
  );
}
