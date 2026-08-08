import type { JSONContent } from "@tiptap/core";
import type { BlogPost } from "@/lib/supabase/types";
import { formatPostDate, formatReadingTime } from "@/lib/readingTime";

/**
 * The minimum a card needs. `BlogPost` and the lighter `PostPreview` (which
 * omits `content`) both satisfy it, so the same components render in the
 * listing pages and in the navigation mega-menu.
 */
export interface CardPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  published_at: string | null;
  views?: number;
  content?: JSONContent;
}

export interface PostCardProps {
  post: CardPost;
  /** Approved comment count; rendered only when greater than zero. */
  commentCount?: number;
  /** Set on above-the-fold imagery to skip lazy loading. */
  priority?: boolean;
  className?: string;
}

export const AUTHOR_FALLBACK_AVATAR = "/assets/withshawon-logo.webp";

export function postHref(post: Pick<CardPost, "slug">): string {
  return `/blog/${post.slug}`;
}

export function primaryTag(post: Pick<CardPost, "tags">): string | null {
  return post.tags?.find((tag) => tag.trim().length > 0)?.trim() ?? null;
}

/** Reading time is only knowable when the post body came along with the row. */
export function readingLabel(post: Pick<CardPost, "content">): string | null {
  return post.content ? formatReadingTime(post.content) : null;
}

export function dateLabel(post: Pick<CardPost, "published_at">): string | null {
  return formatPostDate(post.published_at);
}

export function isoDate(post: Pick<CardPost, "published_at">): string | undefined {
  return post.published_at ?? undefined;
}

/** Turns a BlogPost row into the shape cards consume (identity at runtime). */
export function toCardPost(post: BlogPost): CardPost {
  return post;
}
