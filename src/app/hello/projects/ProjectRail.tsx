"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProjectCard from "./ProjectCard";
import type { ProjectCaseStudy } from "./transform";

/**
 * Desktop: a horizontally scrollable, scroll-snapped rail with explicit
 * prev/next controls — never auto-rotates. Tablet/mobile fall back to a
 * static grid/list (see `.project-rail` responsive rules in globals.css),
 * at which point this component's own scroll machinery is simply unused.
 */
export default function ProjectRail({ projects }: { projects: ProjectCaseStudy[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // 1px tolerance for sub-pixel rounding at the scroll boundaries.
    setCanScrollPrev(track.scrollLeft > 1);
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".project-card");
    const amount = (card?.offsetWidth ?? 280) + 24; // 24px = the track's gap
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * amount, behavior: reduceMotion ? "auto" : "smooth" });
  }, []);

  return (
    <div className="project-rail">
      <div
        ref={trackRef}
        className="project-rail__track"
        role="region"
        aria-label="Project case studies"
        tabIndex={0}
      >
        {projects.map((project) => (
          <div className="project-rail__item" key={project.id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      <div className="project-rail__controls" aria-hidden={!canScrollPrev && !canScrollNext}>
        <button
          type="button"
          className="project-rail__control"
          onClick={() => scrollByCard(-1)}
          disabled={!canScrollPrev}
          aria-label="Previous project"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="project-rail__control"
          onClick={() => scrollByCard(1)}
          disabled={!canScrollNext}
          aria-label="Next project"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
