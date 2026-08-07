"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPost } from "@/lib/supabase/types";
import BlogCard from "./BlogCard";

const AUTOPLAY_MS = 5000;

/** Cards visible at once, matched to the Tailwind breakpoints used below. */
function useVisibleCount(): number {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const md = window.matchMedia("(min-width: 768px)");
    const update = () => setCount(lg.matches ? 3 : md.matches ? 2 : 1);

    update();
    lg.addEventListener("change", update);
    md.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      md.removeEventListener("change", update);
    };
  }, []);

  return count;
}

export default function HeroSlider({
  posts,
  authorName,
  authorAvatarUrl,
  commentCounts,
}: {
  posts: BlogPost[];
  authorName: string;
  authorAvatarUrl: string | null;
  commentCounts: Record<string, number>;
}) {
  const visible = useVisibleCount();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const maxIndex = Math.max(0, posts.length - visible);

  // Clamp when the breakpoint changes and fewer slides remain.
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const next = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, next, maxIndex]);

  if (posts.length === 0) return null;

  return (
    <section
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured posts"
    >
      {/* pb/-mb: the cards' arrow badges sit ~16px outside the panel, and
          overflow-hidden clips at the padding box — so pad it out, then pull
          the following content back up. */}
      <div className="-mb-7 overflow-hidden pb-7">
        <div
          ref={trackRef}
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * (100 / visible)}%)` }}
        >
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="w-full shrink-0 px-3 md:w-1/2 lg:w-1/3"
              aria-hidden={i < index || i >= index + visible}
            >
              <BlogCard
                post={post}
                variant="slide"
                authorName={authorName}
                authorAvatarUrl={authorAvatarUrl}
                commentCount={commentCounts[post.id] ?? 0}
                index={i}
                priority={i < 3}
              />
            </div>
          ))}
        </div>
      </div>

      {maxIndex > 0 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous posts"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-gray-300 transition-colors hover:border-[#76ABAE] hover:text-[#76ABAE]"
          >
            <ChevronLeft size={17} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-[#76ABAE]" : "w-1.5 bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next posts"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-gray-300 transition-colors hover:border-[#76ABAE] hover:text-[#76ABAE]"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </section>
  );
}
