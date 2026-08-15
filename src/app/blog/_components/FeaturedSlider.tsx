"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/supabase/types";
import FeaturedPostCard from "./FeaturedPostCard";

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

const INERT = { inert: true } as unknown as React.HTMLAttributes<HTMLDivElement>;

export default function FeaturedSlider({
  posts,
  commentCounts,
}: {
  posts: BlogPost[];
  commentCounts: Record<string, number>;
}) {
  const isDesktop = useIsDesktop();
  const perView = isDesktop ? 2 : 1;
  const count = posts.length;
  const totalPages = Math.ceil(count / perView);

  const [page, setPage] = useState(0);
  const reduceMotion = useReducedMotion();

  // Clamp page if resizing changes totalPages
  useEffect(() => {
    setPage((prev) => Math.min(prev, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const canSlide = totalPages > 1;

  const goTo = useCallback(
    (target: number) => {
      setPage(Math.min(Math.max(target, 0), totalPages - 1));
    },
    [totalPages]
  );

  const next = useCallback(() => {
    setPage((prev) => (prev >= totalPages - 1 ? 0 : prev + 1));
  }, [totalPages]);

  const previous = useCallback(() => {
    setPage((prev) => (prev <= 0 ? totalPages - 1 : prev - 1));
  }, [totalPages]);

  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured writing"
      tabIndex={0}
      className="focus-visible:outline-none"
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
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${page * 100}%)`,
            transitionDuration: reduceMotion ? "0ms" : "450ms",
            transitionTimingFunction: "cubic-bezier(0.22, 0.61, 0.36, 1)",
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIdx) => {
            const pagePosts = posts.slice(pageIdx * perView, pageIdx * perView + perView);
            const isOffscreen = pageIdx !== page;

            return (
              <div
                key={pageIdx}
                className="flex w-full shrink-0 items-stretch gap-5 sm:gap-6"
                role="group"
                aria-roledescription="slide"
                aria-label={`Page ${pageIdx + 1} of ${totalPages}`}
                {...(isOffscreen ? INERT : {})}
              >
                {pagePosts.map((post, postIdx) => (
                  <div
                    key={post.id}
                    className={`flex-1 ${perView === 2 && pagePosts.length === 1 ? "max-w-[calc(50%-0.75rem)]" : ""}`}
                  >
                    <FeaturedPostCard
                      post={post}
                      commentCount={commentCounts[post.id] ?? 0}
                      priority={pageIdx === 0 && postIdx < 2}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {canSlide && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1} of ${totalPages}`}
                aria-current={i === page ? "true" : undefined}
                className="blog-dot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5260DD]"
              />
            ))}
            <span
              className="ml-2 font-mono text-[0.75rem] tabular-nums"
              style={{ color: "var(--blog-text-subtle)" }}
            >
              {String(page + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous stories"
              className="blog-arrow blog-arrow--sm blog-arrow--isolated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5260DD]"
            >
              <ArrowLeft size={15} strokeWidth={1.9} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next stories"
              className="blog-arrow blog-arrow--sm blog-arrow--isolated focus-visible:ring-2 focus-visible:ring-[#5260DD]"
            >
              <ArrowRight size={15} strokeWidth={1.9} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
