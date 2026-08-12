import Link from "next/link";
import type { PostCardProps } from "./types";
import { dateLabel, isoDate, postHref, primaryTag, readingLabel } from "./types";
import { ArrowCircle, CategoryPill, CoverImage, EngagementStats } from "./ui";
import BookmarkButton from "./BookmarkButton";

interface FeaturedPostCardProps extends PostCardProps {
  ratioClass?: string;
  sizes?: string;
  headingLevel?: "h2" | "h3";
}

/**
 * Slider card: cover art with a translucent panel floating over its lower
 * edge. The whole card is clickable through the stretched title link, so each
 * card contributes exactly one tab stop and one accessible name.
 */
export default function FeaturedPostCard({
  post,
  commentCount = 0,
  priority = false,
  className = "",
  ratioClass = "aspect-[5/4] sm:aspect-[4/3]",
  sizes = "(max-width: 640px) 92vw, (max-width: 1024px) 60vw, 440px",
  headingLevel: Heading = "h3",
}: FeaturedPostCardProps) {
  const tag = primaryTag(post);
  const date = dateLabel(post);
  const reading = readingLabel(post);

  return (
    <article className={`group relative flex h-full flex-col ${className}`.trim()}>
      <div className={`relative w-full ${ratioClass}`}>
        <CoverImage post={post} sizes={sizes} priority={priority} rounded="rounded-[20px]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px]"
          style={{
            background:
              "linear-gradient(to top, rgba(4,9,11,0.66) 0%, rgba(4,9,11,0.08) 46%, transparent 72%)",
          }}
        />
      </div>

      {/* Overlaps the cover's lower edge and extends past it onto the page. */}
      <div className="blog-glass relative z-[1] -mt-16 mx-4 flex flex-1 flex-col gap-2.5 rounded-[18px] p-4 sm:-mt-20 sm:mx-5 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
            {tag && <CategoryPill label={tag} tone="onImage" />}
            <span
              className="flex flex-wrap items-center gap-x-2 text-[0.6875rem]"
              style={{ color: "var(--blog-text-secondary)" }}
            >
              {date && (
                <>
                  <span aria-hidden="true">•</span>
                  <time dateTime={isoDate(post)}>{date}</time>
                </>
              )}
              {reading && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{reading}</span>
                </>
              )}
            </span>
          </div>
          <BookmarkButton slug={post.slug} title={post.title} />
        </div>

        <div className="flex items-start justify-between gap-4">
          <Heading className="blog-clamp-2 min-w-0 text-[1.15rem] font-semibold leading-snug tracking-[-0.015em] sm:text-[1.3rem]">
            <Link href={postHref(post)} className="blog-stretch blog-link-title">
              {post.title}
            </Link>
          </Heading>
          <EngagementStats
            post={post}
            commentCount={commentCount}
            className="shrink-0 flex-col !items-end gap-1"
          />
        </div>

        {post.excerpt && (
          <p
            className="blog-clamp-2 text-[0.8125rem] leading-relaxed"
            style={{ color: "var(--blog-text-muted)" }}
          >
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex justify-end pt-2">
          <ArrowCircle size="sm" />
        </div>
      </div>
    </article>
  );
}
