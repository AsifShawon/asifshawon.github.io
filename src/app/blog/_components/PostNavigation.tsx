import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { postHref } from "./types";

type NavPost = { id: string; title: string; slug: string };

function NavCard({
  post,
  direction,
}: {
  post: NavPost;
  direction: "previous" | "next";
}) {
  const isPrevious = direction === "previous";
  const Icon = isPrevious ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={postHref(post)}
      rel={isPrevious ? "prev" : "next"}
      className={`blog-card group flex flex-1 items-center gap-4 p-5 ${
        isPrevious ? "" : "sm:flex-row-reverse sm:text-right"
      }`}
    >
      <span aria-hidden="true" className="blog-arrow blog-arrow--sm blog-arrow--static">
        <Icon size={15} strokeWidth={1.9} />
      </span>
      <span className="min-w-0">
        <span
          className="block text-[0.6875rem] font-medium uppercase tracking-[0.16em]"
          style={{ color: "var(--blog-text-subtle)" }}
        >
          {isPrevious ? "Previous" : "Next"}
        </span>
        {/* No `block` here: `.blog-clamp-2` needs `display: -webkit-box`. */}
        <span className="blog-clamp-2 blog-link-title mt-1 text-[0.9375rem] font-semibold leading-snug">
          {post.title}
        </span>
      </span>
    </Link>
  );
}

/** Previous / next article links, rendered only for neighbours that exist. */
export default function PostNavigation({
  older,
  newer,
}: {
  older: NavPost | null;
  newer: NavPost | null;
}) {
  if (!older && !newer) return null;

  return (
    <nav aria-label="More articles" className="flex flex-col gap-4 sm:flex-row">
      {older && <NavCard post={older} direction="previous" />}
      {newer && <NavCard post={newer} direction="next" />}
    </nav>
  );
}
