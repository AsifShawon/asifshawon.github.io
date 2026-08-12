import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "./ui";

/**
 * Editorial masthead for /blog — eyebrow, display headline and standfirst on
 * the left, a restrained author stamp on the right at wide widths. All author
 * data comes from the existing `profiles` row.
 */
export default function BlogPageHeader({
  authorName,
  authorTagline,
  authorAvatarUrl,
}: {
  authorName: string;
  authorTagline: string | null;
  authorAvatarUrl: string;
}) {
  return (
    <header className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
      <div className="lg:col-span-8">
        <Eyebrow>Writing / Notes</Eyebrow>

        <h1 className="blog-display mt-5 text-[2.5rem] leading-[1.02] sm:text-[3.5rem] lg:text-[4.25rem]">
          Notes from the build
        </h1>

        <p
          className="mt-5 max-w-xl text-[1rem] leading-[1.7] sm:text-[1.0625rem]"
          style={{ color: "var(--blog-text-muted)" }}
        >
          A builder learning ecommerce — marketing, growth, technology, and everything else I
          pick up along the way.
        </p>
      </div>

      <aside className="hidden lg:col-span-4 lg:block" aria-label="About the author">
        <div className="blog-card p-5">
          <div className="flex items-center gap-3.5">
            <span
              className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full"
              style={{
                border: "1px solid var(--blog-border)",
                background: "var(--blog-surface-raised)",
              }}
            >
              <Image
                src={authorAvatarUrl}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            </span>
            <div className="min-w-0">
              <p
                className="truncate text-[0.9375rem] font-semibold"
                style={{ color: "var(--blog-text)" }}
              >
                {authorName}
              </p>
              {authorTagline && (
                <p
                  className="blog-clamp-1 text-[0.75rem]"
                  style={{ color: "var(--blog-text-subtle)" }}
                >
                  {authorTagline}
                </p>
              )}
            </div>
          </div>

          <hr className="blog-divider my-4" />

          <Link
            href="/hello/aboutme"
            className="group inline-flex items-center gap-1.5 text-[0.75rem] font-medium"
            style={{ color: "var(--blog-accent-strong)" }}
          >
            About me
            <ArrowUpRight
              size={13}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
            />
          </Link>
        </div>
      </aside>
    </header>
  );
}
