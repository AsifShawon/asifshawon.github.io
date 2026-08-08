import Link from "next/link";
import type { PostCardProps } from "./types";
import { postHref, primaryTag } from "./types";
import { CategoryPill, CoverImage, PostMetaRow } from "./ui";

/**
 * Smallest preview in the system — thumbnail + category + title + date.
 * Shared by the navigation mega-menu and the archive sidebar so recent-post
 * previews stay identical wherever they appear.
 */
export default function RecentPostMiniCard({
  post,
  className = "",
}: Pick<PostCardProps, "post" | "className">) {
  const tag = primaryTag(post);

  return (
    <article className={`group relative flex gap-3 ${className}`.trim()}>
      <div className="relative aspect-square w-[3.5rem] shrink-0">
        <CoverImage post={post} sizes="56px" rounded="rounded-[10px]" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {tag && <CategoryPill label={tag} className="self-start !py-[3px] !text-[0.625rem]" />}
        <h4 className="blog-clamp-2 text-[0.8125rem] font-semibold leading-snug">
          <Link href={postHref(post)} className="blog-stretch blog-link-title">
            {post.title}
          </Link>
        </h4>
        <PostMetaRow post={post} className="!text-[0.6875rem]" />
      </div>
    </article>
  );
}
