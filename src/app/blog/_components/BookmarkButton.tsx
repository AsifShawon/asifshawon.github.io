"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

const BOOKMARKS_KEY = "blog-bookmarks";

function readBookmarks(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Local "save for later" list (localStorage only, same key as before so any
 * existing saves survive the redesign). Sits above the card's stretched link.
 */
export default function BookmarkButton({
  slug,
  title,
  tone = "default",
}: {
  slug: string;
  title: string;
  tone?: "default" | "solid";
}) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(readBookmarks().includes(slug));
  }, [slug]);

  function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const current = readBookmarks();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    setBookmarked(next.includes(slug));
  }

  const toneClass = tone === "solid" ? "blog-arrow--solid" : "";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? `Remove “${title}” from saved` : `Save “${title}” for later`}
      className={`blog-arrow blog-arrow--sm blog-arrow--isolated ${toneClass} relative z-[2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ml-indigo)]` .trim()}
    >
      <Bookmark size={14} strokeWidth={1.9} fill={bookmarked ? "currentColor" : "none"} />
    </button>
  );
}
