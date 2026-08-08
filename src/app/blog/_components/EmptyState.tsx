import Link from "next/link";
import { PenLine } from "lucide-react";

/** Deliberate, quiet empty state — used instead of placeholder cards. */
export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div
      className="flex flex-col items-center gap-4 rounded-[20px] px-6 py-16 text-center"
      style={{ border: "1px dashed var(--blog-border)" }}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          color: "var(--blog-accent)",
          border: "1px solid var(--blog-border)",
          background: "var(--blog-accent-soft)",
        }}
      >
        <PenLine size={18} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h3 className="blog-display text-[1.5rem] leading-[1.2]">{title}</h3>
      <p
        className="max-w-sm text-[0.9375rem] leading-relaxed"
        style={{ color: "var(--blog-text-muted)" }}
      >
        {description}
      </p>
      {action && (
        <Link href={action.href} className="blog-button blog-button--ghost mt-2">
          {action.label}
        </Link>
      )}
    </div>
  );
}
