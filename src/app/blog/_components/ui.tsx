import Image from "next/image";
import { ArrowUpRight, Eye, MessageSquare } from "lucide-react";
import type { CardPost } from "./types";
import { dateLabel, isoDate, primaryTag, readingLabel } from "./types";

/* ------------------------------------------------------------------ pills */

export function CategoryPill({
  label,
  tone = "default",
  className = "",
}: {
  label: string;
  tone?: "default" | "onImage" | "accent";
  className?: string;
}) {
  const toneClass =
    tone === "onImage" ? "blog-pill--onImage" : tone === "accent" ? "blog-pill--accent" : "";
  return <span className={`blog-pill ${toneClass} ${className}`.trim()}>{label}</span>;
}

export function Eyebrow({
  children,
  bare = false,
  className = "",
}: {
  children: React.ReactNode;
  bare?: boolean;
  className?: string;
}) {
  return (
    <span className={`blog-eyebrow ${bare ? "blog-eyebrow--bare" : ""} ${className}`.trim()}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- meta */

function MetaDot() {
  return (
    <span aria-hidden="true" className="h-[3px] w-[3px] shrink-0 rounded-full bg-current opacity-50" />
  );
}

/**
 * Compact metadata strip. Engagement numbers are omitted entirely when they
 * are zero — the design never shows a fabricated or hollow count.
 */
export function PostMetaRow({
  post,
  commentCount = 0,
  showViews = false,
  className = "",
}: {
  post: CardPost;
  commentCount?: number;
  showViews?: boolean;
  className?: string;
}) {
  const date = dateLabel(post);
  const reading = readingLabel(post);
  const views = post.views ?? 0;

  const items: React.ReactNode[] = [];
  if (date) {
    items.push(
      <time key="date" dateTime={isoDate(post)}>
        {date}
      </time>
    );
  }
  if (reading) items.push(<span key="reading">{reading}</span>);
  if (showViews && views > 0) {
    items.push(
      <span key="views" className="inline-flex items-center gap-1">
        <Eye size={13} aria-hidden="true" />
        {views}
        <span className="sr-only">views</span>
      </span>
    );
  }
  if (commentCount > 0) {
    items.push(
      <span key="comments" className="inline-flex items-center gap-1">
        <MessageSquare size={13} aria-hidden="true" />
        {commentCount}
        <span className="sr-only">comments</span>
      </span>
    );
  }

  if (items.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] ${className}`.trim()}
      style={{ color: "var(--blog-text-muted)" }}
    >
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          {i > 0 && <MetaDot />}
          {item}
        </span>
      ))}
    </div>
  );
}

/**
 * Comment / view counters. Both are omitted when zero — the design never
 * shows a hollow or invented number.
 */
export function EngagementStats({
  post,
  commentCount = 0,
  className = "",
}: {
  post: CardPost;
  commentCount?: number;
  className?: string;
}) {
  const views = post.views ?? 0;
  if (commentCount === 0 && views === 0) return null;

  return (
    <div
      className={`flex items-center gap-3 text-[0.6875rem] ${className}`.trim()}
      style={{ color: "var(--blog-text-muted)" }}
    >
      {commentCount > 0 && (
        <span className="inline-flex items-center gap-1">
          <MessageSquare size={12} aria-hidden="true" />
          {commentCount}
          <span className="sr-only">comments</span>
        </span>
      )}
      {views > 0 && (
        <span className="inline-flex items-center gap-1">
          <Eye size={12} aria-hidden="true" />
          {views}
          <span className="sr-only">views</span>
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ media */

/**
 * Cover art with a reserved aspect box (no layout shift) and a typographic
 * placeholder for posts that have no image yet.
 */
export function CoverImage({
  post,
  sizes,
  priority = false,
  className = "",
  rounded = "rounded-[16px]",
}: {
  post: CardPost;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Radius utility — `.blog-media` intentionally sets none of its own. */
  rounded?: string;
}) {
  const tag = primaryTag(post);

  return (
    <div className={`blog-media h-full w-full ${rounded} ${className}`.trim()}>
      {post.cover_image_url ? (
        <Image
          src={post.cover_image_url}
          alt={`Cover image for “${post.title}”`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="blog-display absolute inset-0 flex items-center justify-center px-6 text-center text-2xl leading-none opacity-25"
        >
          {tag ?? post.title.slice(0, 1)}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ arrow */

export function ArrowCircle({
  size = "md",
  tone = "default",
  className = "",
}: {
  size?: "sm" | "md";
  tone?: "default" | "solid";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`blog-arrow ${size === "sm" ? "blog-arrow--sm" : ""} ${
        tone === "solid" ? "blog-arrow--solid" : ""
      } ${className}`.trim()}
    >
      <ArrowUpRight size={size === "sm" ? 15 : 17} strokeWidth={1.9} />
    </span>
  );
}

/* ----------------------------------------------------------------- author */

export function AuthorStamp({
  name,
  avatarUrl,
  size = 24,
  className = "",
}: {
  name: string;
  avatarUrl: string;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span
        className="relative shrink-0 overflow-hidden rounded-full"
        style={{
          width: size,
          height: size,
          border: "1px solid var(--blog-border)",
          background: "var(--blog-surface-raised)",
        }}
      >
        <Image src={avatarUrl} alt="" fill sizes={`${size}px`} className="object-cover" />
      </span>
      <span className="text-[0.8125rem]" style={{ color: "var(--blog-text-secondary)" }}>
        {name}
      </span>
    </span>
  );
}
