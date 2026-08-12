"use client";

import { useEffect, useState } from "react";
import type { PostHeading } from "../_components/postHeadings";

/**
 * Sticky desktop contents list. Rendered only when the article has enough
 * H2s to justify it (see the caller) and hidden entirely below `xl`, where
 * the gutter it lives in does not exist.
 */
export default function TableOfContents({ headings }: { headings: PostHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Focus the "active" band near the top of the viewport so the highlight
      // tracks what is actually being read.
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="On this page">
      <p
        className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.16em]"
        style={{ color: "var(--blog-text-subtle)" }}
      >
        On this page
      </p>
      <ul className="flex flex-col">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? "true" : undefined}
              className={`blog-toc-link ${heading.level === 3 ? "blog-toc-link--sub" : ""}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
