import Link from "next/link";
import type { PostCardProps } from "./types";
import { postHref, primaryTag } from "./types";
import { ArrowCircle, CategoryPill, CoverImage, PostMetaRow } from "./ui";

/**
 * Horizontal supporting card — square thumbnail beside a tight text block.
 * Stacks well in the column next to a lead story without competing with it.
 */
export default function CompactPostCard({
  post,
  commentCount = 0,
  priority = false,
  className = "",
  headingLevel: Heading = "h3",
}: PostCardProps & { headingLevel?: "h3" | "h4" }) {
  const tag = primaryTag(post);

  return (
    <article className={`blog-card group relative flex gap-4 p-3 ${className}`.trim()}>
      <div className="relative aspect-square w-[6.25rem] shrink-0 sm:w-[7.5rem]">
        <CoverImage
          post={post}
          sizes="120px"
          priority={priority}
          rounded="rounded-[12px]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-0.5 pr-1">
        {tag && <CategoryPill label={tag} className="self-start" />}

        <Heading className="blog-clamp-2 text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em]">
          <Link href={postHref(post)} className="blog-stretch blog-link-title">
            {post.title}
          </Link>
        </Heading>

        <PostMetaRow post={post} commentCount={commentCount} />
      </div>

      <div className="hidden shrink-0 items-end sm:flex">
        <ArrowCircle size="sm" />
      </div>
    </article>
  );
}
