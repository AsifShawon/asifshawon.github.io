"use client";

import { useEffect, useRef, useState } from "react";

import { ABOUT_SECTIONS } from "./aboutSections";

/** Long enough to cover this page's longest anchor-jump smooth-scroll
 *  (top to the Contact section); short enough that a real free-scroll right
 *  after a click still picks up live updates promptly. */
const CLICK_SUPPRESS_MS = 900;

/**
 * Sticky vertical rail on desktop, horizontal chip row below ~900px (see
 * `.about-index` in globals.css — same markup, CSS-only layout switch).
 * Links are plain `<a href="#id">`s, so keyboard/native anchor navigation
 * needs no JS; the IntersectionObserver below only drives which one shows
 * as active. `scroll-behavior` (including its reduced-motion override) is
 * global, in globals.css, so the jump itself already respects that setting.
 */
export default function AboutSectionIndex() {
  const [activeId, setActiveId] = useState(ABOUT_SECTIONS[0].id);
  // While a click-triggered smooth-scroll is in flight, sections it scrolls
  // *through* still cross the observer's thresholds and would otherwise
  // overwrite the just-clicked target with whatever it last passed —
  // leaving the wrong link marked active once the scroll settles. Ignoring
  // observer updates for a short window after a click avoids that race.
  const suppressUntilRef = useRef(0);

  useEffect(() => {
    const sections = ABOUT_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressUntilRef.current) return;
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        // Most-visible section wins when more than one qualifies at once.
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        setActiveId(visible[0].target.id);
      },
      // Biases toward the section sitting just below the sticky header,
      // rather than whatever merely touches the viewport edge.
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.2, 0.5] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    setActiveId(id);
    suppressUntilRef.current = Date.now() + CLICK_SUPPRESS_MS;
  };

  return (
    <nav className="about-index" aria-label="About page sections">
      <ol className="about-index__list">
        {ABOUT_SECTIONS.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="about-index__link"
                data-active={isActive || undefined}
                aria-current={isActive ? "location" : undefined}
                onClick={() => handleNavClick(section.id)}
              >
                <span className="about-index__number">{section.number}</span>
                <span className="about-index__nav-label">{section.navLabel}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
