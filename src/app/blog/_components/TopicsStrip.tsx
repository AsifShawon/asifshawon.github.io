import Link from "next/link";
import type { TagCount } from "@/lib/blogQueries";

/**
 * Category discovery strip. Filtering lives in the URL (`?tag=…`) rather than
 * component state, so results are server-rendered, shareable and crawlable —
 * and the chips are real links with real keyboard behaviour.
 *
 * Counts come from the live post list; nothing here is hard-coded.
 */
export default function TopicsStrip({
  tags,
  activeTag,
  totalCount,
  basePath = "/blog",
  className = "",
}: {
  tags: TagCount[];
  activeTag: string | null;
  totalCount: number;
  basePath?: string;
  className?: string;
}) {
  if (tags.length === 0) return null;

  const isActive = (tag: string) => activeTag?.toLowerCase() === tag.toLowerCase();

  return (
    <nav aria-label="Filter posts by topic" className={className}>
      {/* Negative gutter lets chips scroll edge-to-edge on small screens
          without the page itself overflowing. */}
      <div className="blog-chip-row -mx-6 px-6 py-1 md:mx-0 md:px-0">
        <Link
          href={basePath}
          className="blog-chip"
          aria-current={activeTag === null ? "true" : undefined}
        >
          All
          <span className="blog-chip__count">{totalCount}</span>
        </Link>

        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`${basePath}?tag=${encodeURIComponent(tag)}`}
            className="blog-chip"
            aria-current={isActive(tag) ? "true" : undefined}
          >
            {tag}
            <span className="blog-chip__count">{count}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
