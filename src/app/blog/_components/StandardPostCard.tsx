import Link from "next/link";
import type { PostCardProps } from "./types";
import { postHref, primaryTag } from "./types";
import { ArrowCircle, CategoryPill, CoverImage, PostMetaRow } from "./ui";

interface StandardPostCardProps extends PostCardProps {
  sizes?: string;
  headingLevel?: "h3" | "h4";
}

/**
 * The workhorse grid card: 4:3 cover, category, title, excerpt, metadata and
 * an understated arrow. Used by the featured composition's secondary slot and
 * by every "Latest writing" / tag-results grid.
 */
export default function StandardPostCard({
  post,
  commentCount = 0,
  priority = false,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
  headingLevel: Heading = "h3",
}: StandardPostCardProps) {
  const tag = primaryTag(post);

  return (
    <article className={`blog-card group relative flex h-full flex-col p-2.5 ${className}`.trim()}>
      <div className="relative aspect-[4/3] w-full">
        <CoverImage post={post} sizes={sizes} priority={priority} rounded="rounded-[14px]" />
        {tag && (
          <div className="absolute left-3 top-3">
            <CategoryPill label={tag} tone="onImage" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-2.5 pb-1.5 pt-4">
        <PostMetaRow post={post} commentCount={commentCount} />

        <Heading className="blog-clamp-2 text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]">
          <Link href={postHref(post)} className="blog-stretch blog-link-title">
            {post.title}
          </Link>
        </Heading>

        {post.excerpt && (
          <p
            className="blog-clamp-2 text-[0.875rem] leading-relaxed"
            style={{ color: "var(--blog-text-muted)" }}
          >
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-end pt-3">
          <ArrowCircle size="sm" />
        </div>
      </div>
    </article>
  );
}
