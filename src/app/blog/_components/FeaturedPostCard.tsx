import Link from "next/link";
import type { PostCardProps } from "./types";
import { dateLabel, isoDate, postHref, primaryTag, readingLabel } from "./types";
import { ArrowCircle, CategoryPill, CoverImage } from "./ui";
import BookmarkButton from "./BookmarkButton";

interface FeaturedPostCardProps extends PostCardProps {
  sizes?: string;
  headingLevel?: "h2" | "h3";
}

/**
 * Featured story card: editorial 16:10 cover image on top, clean Mint Ledger
 * body beneath with category pill, metadata, title, two-line excerpt and arrow.
 * Stretched title link makes the whole card clickable while keeping the
 * bookmark button fully independent.
 */
export default function FeaturedPostCard({
  post,
  priority = false,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 600px",
  headingLevel: Heading = "h3",
}: FeaturedPostCardProps) {
  const tag = primaryTag(post);
  const date = dateLabel(post);
  const reading = readingLabel(post);

  return (
    <article
      className={`blog-card group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--blog-border)] bg-[var(--blog-surface)] transition-all duration-300 hover:-translate-y-[3px] hover:border-[var(--site-border-strong)] hover:shadow-md ${className}`.trim()}
    >
      {/* Cover image (16:10 aspect ratio) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <CoverImage
          post={post}
          sizes={sizes}
          priority={priority}
          rounded="rounded-t-[20px]"
          className="transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
      </div>

      {/* Content body beneath the image */}
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        {/* Category & Metadata row with independent Bookmark button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {tag && <CategoryPill label={tag} />}
            <div className="flex flex-wrap items-center gap-x-2 font-mono text-[0.75rem] text-[var(--blog-text-muted)]">
              {date && <time dateTime={isoDate(post)}>{date}</time>}
              {reading && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{reading}</span>
                </>
              )}
            </div>
          </div>
          <BookmarkButton slug={post.slug} title={post.title} />
        </div>

        {/* Post title with stretched link */}
        <Heading className="blog-clamp-2 min-w-0 font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.015em] text-[var(--blog-text)] sm:text-[1.375rem]">
          <Link href={postHref(post)} className="blog-stretch blog-link-title">
            {post.title}
          </Link>
        </Heading>

        {/* Two-line excerpt */}
        {post.excerpt && (
          <p className="blog-clamp-2 text-[0.875rem] leading-relaxed text-[var(--ml-sage)] sm:text-[0.9375rem]">
            {post.excerpt}
          </p>
        )}

        {/* Read / open arrow */}
        <div className="mt-auto flex items-center justify-end pt-2">
          <ArrowCircle
            size="sm"
            className="text-[var(--ml-green)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </article>
  );
}
