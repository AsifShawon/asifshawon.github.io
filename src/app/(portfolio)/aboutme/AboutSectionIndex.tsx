"use client";

import { useEffect, useRef, useState } from "react";

import { ABOUT_SECTIONS } from "./aboutSections";

/** Long enough to cover this page's longest anchor-jump smooth-scroll
 *  (top to the Journey section); short enough that a real free-scroll right
 *  after a click still picks up live updates promptly. */
const CLICK_SUPPRESS_MS = 900;

/**
 * Sticky vertical rail on desktop, horizontal scrollable tab strip below
 * `lg` (see `.about-index` in globals.css — same markup, CSS-only layout
 * switch). Links are plain `<a href="#id">`s, so keyboard/native anchor
 * navigation needs no JS; the IntersectionObserver below only drives which
 * one shows as active. `scroll-behavior` (including its reduced-motion
 * override) is global, in globals.css, so the jump itself already respects
 * that setting.
 */
export default function AboutSectionIndex() {
  const [activeId, setActiveId] = useState(ABOUT_SECTIONS[0].id);
  // While a click-triggered smooth-scroll is in flight, sections it scrolls
  // *through* still cross the observer's thresholds and would otherwise
  // overwrite the just-clicked target with whatever it last passed —
  // leaving the wrong link marked active once the scroll settles. Ignoring
  // observer updates for a short window after a click avoids that race.
  const suppressUntilRef = useRef(0);
  const listRef = useRef<HTMLOListElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const ids = ABOUT_SECTIONS.map((s) => s.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // Sections vary wildly in height (the one-line Introduction vs. the
    // whole Journey timeline), so comparing raw `intersectionRatio` biases
    // toward short sections — a short section fully on screen always beats
    // a tall one that's only partially visible, even while the reading line
    // sits squarely inside the tall one. Tracking *which* sections currently
    // cross the reading band and taking the one furthest down the page
    // (last in document order) instead gives the correct answer regardless
    // of any one section's height, in both scroll directions.
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressUntilRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        });

        if (intersecting.size === 0) return;

        const lastIndex = Math.max(
          ...Array.from(intersecting, (id) => ids.indexOf(id))
        );
        setActiveId(ids[lastIndex]);
      },
      // A thin band around the natural reading line, rather than the whole
      // viewport — biases toward the section sitting just below the sticky
      // header instead of whatever merely touches the viewport edge.
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Keeps the active tab in view on the horizontal mobile/tablet strip.
  // Runs only when `activeId` actually changes (i.e. a handful of times per
  // visit, driven by the observer above) — never on a scroll/frame cadence —
  // so it can't fight a user who's mid-swipe through the strip themselves.
  //
  // Deliberately *not* `link.scrollIntoView()`: that walks every scrolling
  // ancestor, including the document itself, and the strip isn't sticky
  // below `lg` — so once the page has scrolled past it, `scrollIntoView`
  // would yank the whole page back up just to satisfy the vertical
  // "nearest" constraint. Scrolling the strip's own `scrollLeft` directly
  // touches only that one container, never the page.
  useEffect(() => {
    const container = listRef.current;
    const link = linkRefs.current[activeId];
    if (!container || !link) return;

    const containerRect = container.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const alreadyVisible =
      linkRect.left >= containerRect.left && linkRect.right <= containerRect.right;
    if (alreadyVisible) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const targetLeft =
      container.scrollLeft +
      (linkRect.left - containerRect.left) -
      (containerRect.width - linkRect.width) / 2;

    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeId]);

  const handleNavClick = (id: string) => {
    setActiveId(id);
    suppressUntilRef.current = Date.now() + CLICK_SUPPRESS_MS;
  };

  return (
    <nav className="about-index" aria-label="About page sections">
      <ol className="about-index__list" ref={listRef}>
        {ABOUT_SECTIONS.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                ref={(el) => {
                  linkRefs.current[section.id] = el;
                }}
                href={`#${section.id}`}
                className="about-index__link"
                data-active={isActive || undefined}
                aria-current={isActive ? "location" : undefined}
                onClick={() => handleNavClick(section.id)}
              >
                <span className="about-index__number">{section.number}</span>
                <span className="about-index__nav-label about-index__nav-label--short">
                  {section.shortLabel}
                </span>
                <span className="about-index__nav-label about-index__nav-label--full">
                  {section.navLabel}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
