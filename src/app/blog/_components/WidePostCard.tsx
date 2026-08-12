import Link from "next/link";
import type { PostCardProps } from "./types";
import { dateLabel, isoDate, postHref, readingLabel } from "./types";
import { ArrowCircle, AuthorStamp, CategoryPill, CoverImage, EngagementStats } from "./ui";
import BookmarkButton from "./BookmarkButton";

interface WidePostCardProps extends PostCardProps {
  authorName: string;
  authorAvatarUrl: string;
  sizes?: string;
}

/**
 * The inverted card: tags and headline sit *above* the cover art, excerpt and
 * byline below it. Gives the mosaic a second rhythm without inventing a new
 * visual language.
 */
export default function WidePostCard({
  post,
  commentCount = 0,
  priority = false,
  className = "",
  authorName,
  authorAvatarUrl,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 560px",
}: WidePostCardProps) {
  const tags = (post.tags ?? []).filter((t) => t.trim()).slice(0, 2);
  const date = dateLabel(post);
  const reading = readingLabel(post);

  return (
    <article className={`blog-card group relative flex flex-col p-4 sm:p-5 ${className}`.trim()}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <CategoryPill key={tag} label={tag} />
          ))}
          {reading && (
            <span className="text-[0.6875rem]" style={{ color: "var(--blog-text-muted)" }}>
              {tags.length > 0 && <span aria-hidden="true" className="mr-2">•</span>}
              {reading}
            </span>
          )}
        </div>
        <BookmarkButton slug={post.slug} title={post.title} />
      </div>

      <h3 className="blog-clamp-2 mt-3.5 text-[1.2rem] font-semibold leading-snug tracking-[-0.015em] sm:text-[1.35rem]">
        <Link href={postHref(post)} className="blog-stretch blog-link-title">
          {post.title}
        </Link>
      </h3>

      <div className="relative mt-4 aspect-[16/9] w-full">
        <CoverImage post={post} sizes={sizes} priority={priority} rounded="rounded-[14px]" />
      </div>

      {post.excerpt && (
        <p
          className="blog-clamp-2 mt-4 text-[0.875rem] leading-relaxed"
          style={{ color: "var(--blog-text-muted)" }}
        >
          {post.excerpt}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <AuthorStamp name={authorName} avatarUrl={authorAvatarUrl} size={22} />
          {date && (
            <>
              <span aria-hidden="true" style={{ color: "var(--blog-text-subtle)" }}>
                •
              </span>
              <time
                dateTime={isoDate(post)}
                className="text-[0.6875rem]"
                style={{ color: "var(--blog-text-muted)" }}
              >
                {date}
              </time>
            </>
          )}
          <EngagementStats post={post} commentCount={commentCount} className="ml-1" />
        </div>
        <ArrowCircle size="sm" />
      </div>
    </article>
  );
}
