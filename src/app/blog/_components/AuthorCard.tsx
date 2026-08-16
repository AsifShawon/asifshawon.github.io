import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** Compact "Written by" card built from the existing profile row. */
export default function AuthorCard({
  name,
  bio,
  avatarUrl,
  tagline,
}: {
  name: string;
  bio: string;
  avatarUrl: string;
  tagline?: string | null;
}) {
  return (
    <aside
      className="blog-card flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6"
      aria-label="About the author"
    >
      <span
        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full"
        style={{
          border: "1px solid var(--blog-border)",
          background: "var(--blog-surface-raised)",
        }}
      >
        <Image src={avatarUrl} alt="" fill sizes="56px" className="object-cover" />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className="text-[0.6875rem] font-medium uppercase tracking-[0.16em]"
          style={{ color: "var(--blog-text-subtle)" }}
        >
          Written by
        </p>
        <p
          className="mt-1.5 text-[1.0625rem] font-semibold"
          style={{ color: "var(--blog-text)" }}
        >
          {name}
        </p>
        {tagline && (
          <p className="mt-0.5 text-[0.8125rem]" style={{ color: "var(--blog-text-subtle)" }}>
            {tagline}
          </p>
        )}
        <p
          className="blog-clamp-3 mt-3 text-[0.9375rem] leading-relaxed"
          style={{ color: "var(--blog-text-muted)" }}
        >
          {bio}
        </p>
        <Link
          href="/aboutme"
          className="group mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium"
          style={{ color: "var(--blog-accent)" }}
        >
          More about me
          <ArrowUpRight
            size={14}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          />
        </Link>
      </div>
    </aside>
  );
}
