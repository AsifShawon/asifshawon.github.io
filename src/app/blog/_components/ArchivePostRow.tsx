import Link from "next/link";
import type { PostCardProps } from "./types";
import { postHref, primaryTag } from "./types";
import { ArrowCircle, AuthorStamp, CategoryPill, CoverImage, PostMetaRow } from "./ui";

interface ArchivePostRowProps extends PostCardProps {
  authorName: string;
  authorAvatarUrl: string;
}

/**
 * Editorial list row for the archive: image left / content right on desktop,
 * image stacked above content on mobile. Separated by hairline rules rather
 * than boxes, so a long list stays calm.
 */
export default function ArchivePostRow({
  post,
  commentCount = 0,
  priority = false,
  className = "",
  authorName,
  authorAvatarUrl,
}: ArchivePostRowProps) {
  const tag = primaryTag(post);

  return (
    <article
      className={`group relative flex flex-col gap-5 py-7 sm:flex-row sm:gap-7 ${className}`.trim()}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 sm:aspect-[4/3] sm:w-[13.5rem] lg:w-[16.5rem]">
        <CoverImage
          post={post}
          sizes="(max-width: 640px) 100vw, 264px"
          priority={priority}
          rounded="rounded-[16px]"
        />
        {tag && (
          <div className="absolute left-3 top-3 sm:hidden">
            <CategoryPill label={tag} tone="onImage" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          {(post.tags ?? []).slice(0, 2).map((t) => (
            <CategoryPill key={t} label={t} />
          ))}
        </div>

        <h3 className="blog-clamp-2 text-[1.25rem] font-semibold leading-snug tracking-[-0.015em] lg:text-[1.375rem]">
          <Link href={postHref(post)} className="blog-stretch blog-link-title">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p
            className="blog-clamp-2 text-[0.9375rem] leading-relaxed"
            style={{ color: "var(--blog-text-muted)" }}
          >
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <AuthorStamp name={authorName} avatarUrl={authorAvatarUrl} size={22} />
            <span aria-hidden="true" style={{ color: "var(--blog-border-strong)" }}>
              /
            </span>
            <PostMetaRow post={post} commentCount={commentCount} showViews />
          </div>
          <ArrowCircle size="sm" />
        </div>
      </div>
    </article>
  );
}
