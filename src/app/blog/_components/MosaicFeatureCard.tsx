import Link from "next/link";
import type { PostCardProps } from "./types";
import { dateLabel, isoDate, postHref, primaryTag, readingLabel } from "./types";
import { ArrowCircle, AuthorStamp, CategoryPill, CoverImage } from "./ui";

interface MosaicFeatureCardProps extends PostCardProps {
  authorName: string;
  authorAvatarUrl: string;
  ratioClass?: string;
  sizes?: string;
}

/**
 * Lead card of the mosaic: full-bleed cover with a translucent panel anchored
 * to the lower-left and a circular arrow tucked into the opposite corner.
 */
export default function MosaicFeatureCard({
  post,
  priority = false,
  className = "",
  authorName,
  authorAvatarUrl,
  ratioClass = "aspect-[4/3]",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 620px",
}: MosaicFeatureCardProps) {
  const tag = primaryTag(post);
  const date = dateLabel(post);
  const reading = readingLabel(post);

  return (
    <article className={`group relative w-full ${ratioClass} ${className}`.trim()}>
      <CoverImage post={post} sizes={sizes} priority={priority} rounded="rounded-[20px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px]"
        style={{
          background:
            "linear-gradient(to top, rgba(4,9,11,0.72) 0%, rgba(4,9,11,0.14) 44%, transparent 70%)",
        }}
      />

      <div className="blog-glass absolute bottom-4 left-4 right-4 rounded-[16px] p-4 sm:bottom-5 sm:left-5 sm:right-[4.75rem] sm:p-5">
        {tag && <CategoryPill label={tag} tone="onImage" className="mb-2.5" />}

        <h3 className="blog-clamp-2 text-[1.15rem] font-semibold leading-snug tracking-[-0.015em] sm:text-[1.4rem]">
          <Link href={postHref(post)} className="blog-stretch blog-link-title">
            {post.title}
          </Link>
        </h3>

        <div
          className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem]"
          style={{ color: "var(--blog-text-secondary)" }}
        >
          <AuthorStamp name={authorName} avatarUrl={authorAvatarUrl} size={20} />
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
        </div>
      </div>

      <div className="absolute bottom-5 right-5 hidden sm:block">
        <ArrowCircle tone="solid" />
      </div>
    </article>
  );
}
