"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/supabase/types";
import FeaturedPostCard from "./FeaturedPostCard";

const AUTOPLAY_MS = 6000;
const SLIDE_MS = 500;

/**
 * Cards in view per breakpoint. The fractional desktop value is deliberate:
 * it leaves the next card peeking at the edge, which both signals that the
 * rail scrolls and lets three posts already be more than one screenful.
 */
const BREAKPOINTS: { query: string; perView: number }[] = [
  { query: "(min-width: 1024px)", perView: 2.35 },
  { query: "(min-width: 640px)", perView: 1.6 },
];
const BASE_PER_VIEW = 1.08;

function usePerView(): number {
  const [perView, setPerView] = useState(BASE_PER_VIEW);

  useEffect(() => {
    const lists = BREAKPOINTS.map((b) => ({ ...b, mql: window.matchMedia(b.query) }));
    const update = () => setPerView(lists.find((l) => l.mql.matches)?.perView ?? BASE_PER_VIEW);

    update();
    lists.forEach((l) => l.mql.addEventListener("change", update));
    return () => lists.forEach((l) => l.mql.removeEventListener("change", update));
  }, []);

  return perView;
}

/**
 * React 19 supports `inert`, but @types/react is still on 18 and doesn't
 * declare it. Off-screen cards get it so their links leave the tab order and
 * the accessibility tree.
 */
const INERT = { inert: true } as unknown as React.HTMLAttributes<HTMLDivElement>;

/**
 * Featured story rail. Advances right-to-left one card at a time. Autoplay
 * pauses on hover, on keyboard focus and when the tab is hidden, and is off
 * entirely under `prefers-reduced-motion`.
 *
 * When there are fewer posts than fit, the cards simply share the row and the
 * controls are hidden — nothing is duplicated to manufacture a scroll.
 */
export default function FeaturedSlider({
  posts,
  commentCounts,
}: {
  posts: BlogPost[];
  commentCounts: Record<string, number>;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const reduceMotion = useReducedMotion();
  const breakpointPerView = usePerView();

  const count = posts.length;
  // Never show the entire rail at once: with more than one post we always keep
  // a sliver of the next card visible, so the rail reads as scrollable and
  // actually moves — even at two posts on a wide screen. A single post just
  // fills the row.
  const perView = count > 1 ? Math.min(breakpointPerView, count - 0.35) : 1;
  const maxIndex = Math.max(0, Math.ceil(count - perView));
  const canSlide = maxIndex > 0;
  const slideWidth = 100 / perView;

  const goTo = useCallback(
    (next: number) => setIndex(Math.min(Math.max(next, 0), maxIndex)),
    [maxIndex]
  );
  const next = useCallback(
    () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
    [maxIndex]
  );
  const previous = useCallback(
    () => setIndex((i) => (i <= 0 ? maxIndex : i - 1)),
    [maxIndex]
  );

  // Clamp when the breakpoint changes and fewer positions remain.
  useEffect(() => setIndex((i) => Math.min(i, maxIndex)), [maxIndex]);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!canSlide || paused || tabHidden || reduceMotion) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
      AUTOPLAY_MS
    );
    return () => window.clearInterval(timer);
  }, [canSlide, maxIndex, paused, tabHidden, reduceMotion]);

  if (count === 0) return null;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured writing"
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") setPaused(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") setPaused(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (!canSlide) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          previous();
        }
      }}
    >
      {/* Negative gutter lets the peeking card bleed to the viewport edge on
          small screens without the page scrolling sideways. */}
      <div className="-mx-6 overflow-hidden px-6 md:mx-0 md:px-0">
        <div
          className="flex"
          style={{
            transform: `translateX(-${index * slideWidth}%)`,
            transition: reduceMotion
              ? "none"
              : `transform ${SLIDE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
          }}
        >
          {posts.map((post, i) => {
            const offscreen = i < index || i >= index + Math.ceil(perView);
            return (
              <div
                key={post.id}
                className="shrink-0 pr-4 sm:pr-5"
                style={{ width: `${slideWidth}%` }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                {...(offscreen ? INERT : {})}
              >
                <FeaturedPostCard
                  post={post}
                  commentCount={commentCounts[post.id] ?? 0}
                  priority={i < 2}
                />
              </div>
            );
          })}
        </div>
      </div>

      {canSlide && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to position ${i + 1} of ${maxIndex + 1}`}
                aria-current={i === index ? "true" : undefined}
                className="blog-dot"
              />
            ))}
            <span
              className="ml-2 text-[0.75rem] tabular-nums"
              style={{ color: "var(--blog-text-subtle)" }}
            >
              {String(index + 1).padStart(2, "0")} / {String(maxIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous stories"
              className="blog-arrow blog-arrow--sm blog-arrow--isolated"
            >
              <ArrowLeft size={15} strokeWidth={1.9} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next stories"
              className="blog-arrow blog-arrow--sm blog-arrow--isolated"
            >
              <ArrowRight size={15} strokeWidth={1.9} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
