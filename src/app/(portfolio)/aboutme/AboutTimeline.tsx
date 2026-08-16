"use client";

import { useEffect, useRef, useState } from "react";

import type { TimelineEntry } from "@/lib/supabase/types";

/**
 * The Journey timeline's reveal animation — the only client-side piece of
 * `AboutJourney`, so the rest of the About page stays server-rendered.
 *
 * Each entry fades/rises in via `IntersectionObserver` (no scroll listener,
 * no per-frame React state) as it crosses into view, staggered by a CSS
 * custom property so the entry and its dot animate together. The connecting
 * line's fill (`.about-timeline::after`) tracks the *count* of entries
 * revealed so far via `--about-timeline-progress` — a stepped value that
 * only ever grows, so scrolling back up never makes it flicker backwards.
 */
export default function AboutTimeline({ timeline }: { timeline: TimelineEntry[] }) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    const items = itemRefs.current.filter((el): el is HTMLLIElement => el !== null);
    if (items.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      items.forEach((el) => el.setAttribute("data-revealed", "true"));
      setRevealedCount(items.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLLIElement;
          const index = items.indexOf(el);
          el.setAttribute("data-revealed", "true");
          observer.unobserve(el);
          setRevealedCount((count) => Math.max(count, index + 1));
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [timeline.length]);

  const progress = timeline.length > 0 ? revealedCount / timeline.length : 0;

  return (
    <ol
      className="about-timeline"
      style={{ ["--about-timeline-progress" as string]: progress }}
    >
      {timeline.map((entry, index) => (
        <li
          className="about-timeline__item"
          key={`${entry.title}-${entry.period}`}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          style={{ ["--about-reveal-delay" as string]: `${index * 70}ms` }}
        >
          <span className="about-timeline__dot" aria-hidden="true" />
          <div className="about-timeline__body">
            <p className="about-timeline__period">{entry.period}</p>
            <h3>{entry.title}</h3>
            <p className="about-timeline__subtitle">{entry.subtitle}</p>
            {Array.isArray(entry.description) ? (
              <ul className="about-timeline__list">
                {entry.description.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="about-timeline__description">{entry.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
