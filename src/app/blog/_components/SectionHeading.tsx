import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Eyebrow } from "./ui";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  /**
   * `bar` renders the compact bordered strip used between page sections;
   * `stacked` (default) is the taller editorial header.
   */
  variant?: "stacked" | "bar";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  variant = "stacked",
  className = "",
}: SectionHeadingProps) {
  if (variant === "bar") {
    return (
      <div className={`blog-section-bar ${className}`.trim()}>
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="flex items-center gap-2.5">
            <Sparkles
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
              style={{ color: "var(--blog-accent)" }}
            />
            <h2 className="text-[1.125rem] font-semibold tracking-[-0.01em] sm:text-[1.25rem]">
              {title}
            </h2>
          </span>
          {description && (
            <p className="text-[0.8125rem]" style={{ color: "var(--blog-text-muted)" }}>
              {description}
            </p>
          )}
        </div>

        {action && (
          <Link
            href={action.href}
            className="group inline-flex shrink-0 items-center gap-2.5 text-[0.875rem] font-medium"
            style={{ color: "var(--blog-text-secondary)" }}
          >
            <span aria-hidden="true" className="blog-arrow blog-arrow--sm">
              <ArrowUpRight size={15} strokeWidth={1.9} />
            </span>
            {action.label}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className={`mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 ${className}`.trim()}
    >
      <div className="min-w-0">
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <h2 className="blog-display text-[1.75rem] leading-[1.12] sm:text-[2.125rem]">{title}</h2>
        {description && (
          <p
            className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed"
            style={{ color: "var(--blog-text-muted)" }}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-3 text-[0.875rem] font-medium"
          style={{ color: "var(--blog-text-secondary)" }}
        >
          {action.label}
          <span aria-hidden="true" className="blog-arrow blog-arrow--sm">
            <ArrowUpRight size={15} strokeWidth={1.9} />
          </span>
        </Link>
      )}
    </div>
  );
}
