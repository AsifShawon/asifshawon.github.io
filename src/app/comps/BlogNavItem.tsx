"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import {
  fetchRecentPostPreviews,
  fetchTagCounts,
  type PostPreview,
  type TagCount,
} from "@/lib/blogQueries";
import RecentPostMiniCard from "@/app/blog/_components/RecentPostMiniCard";

const RECENT_LIMIT = 3;
/** Grace period so a diagonal pointer path to the panel doesn't close it. */
const CLOSE_DELAY_MS = 160;

interface MenuData {
  posts: PostPreview[];
  tags: TagCount[];
}

/** Module-level cache: the panel's data is fetched once per page session. */
let cache: MenuData | null = null;
let inflight: Promise<MenuData> | null = null;

function loadMenuData(): Promise<MenuData> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    const supabase = createClient();
    inflight = Promise.all([
      fetchRecentPostPreviews(supabase, RECENT_LIMIT),
      fetchTagCounts(supabase),
    ])
      .then(([posts, tags]) => {
        cache = { posts, tags };
        return cache;
      })
      .catch(() => {
        inflight = null;
        return { posts: [], tags: [] };
      });
  }
  return inflight;
}

function PanelSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {Array.from({ length: RECENT_LIMIT }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div
            className="h-14 w-14 shrink-0 rounded-[10px]"
            style={{ background: "var(--blog-surface-raised)" }}
          />
          <div className="flex flex-1 flex-col justify-center gap-2">
            <div
              className="h-2.5 w-3/4 rounded-full"
              style={{ background: "var(--blog-surface-raised)" }}
            />
            <div
              className="h-2.5 w-1/2 rounded-full"
              style={{ background: "var(--blog-surface-raised)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Desktop "Blog" nav item with an editorial mega-menu. Opens on hover and on
 * keyboard focus, closes on Escape or when focus/pointer leaves. Recent posts
 * come from the same Supabase source the blog pages use — nothing is
 * hard-coded — and are fetched lazily the first time the panel is opened.
 */
export default function BlogNavItem({
  label = "Blog",
  active = false,
}: {
  label?: string;
  /** Drives the same underline indicator the plain nav links use. */
  active?: boolean;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<MenuData | null>(cache);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const pathname = usePathname();

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openPanel = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
    if (!cache) void loadMenuData().then(setData);
  }, []);

  const closePanel = useCallback((immediate = false) => {
    clearCloseTimer();
    if (immediate) {
      setOpen(false);
      return;
    }
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, []);

  // Close when the route changes (the panel outlives the click otherwise).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      wrapperRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const posts = data?.posts ?? [];
  const tags = data?.tags ?? [];

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") openPanel();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") closePanel();
      }}
      onFocusCapture={openPanel}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closePanel(true);
      }}
    >
      <Link
        href="/blog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-current={active ? "page" : undefined}
        // Shares the sibling links' hover/active treatment.
        className="site-nav__link"
        data-active={active}
      >
        {label}
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </Link>

      {open && (
        // The wrapper starts flush against the trigger and creates the visual
        // gap with padding, so the pointer never crosses dead space.
        <div
          id={panelId}
          className="absolute right-0 top-full z-50 hidden pt-4 lg:block"
          style={{ width: "min(50rem, calc(100vw - 3rem))" }}
        >
          <div className="blog-megamenu grid grid-cols-[13.5rem_1fr] gap-7 p-6">
            {/* ------------------------------------------------- links */}
            <div className="flex flex-col">
              <p
                className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.16em]"
                style={{ color: "var(--blog-text-subtle)" }}
              >
                Explore
              </p>

              <div className="-mx-3 flex flex-col">
                <Link href="/blog" className="blog-megamenu__link">
                  Blog home
                  <ArrowUpRight size={14} strokeWidth={1.9} aria-hidden="true" />
                </Link>
                <Link href="/blog/archive" className="blog-megamenu__link">
                  All writing
                  <ArrowUpRight size={14} strokeWidth={1.9} aria-hidden="true" />
                </Link>
              </div>

              {tags.length > 0 && (
                <>
                  <p
                    className="mb-3 mt-6 text-[0.6875rem] font-medium uppercase tracking-[0.16em]"
                    style={{ color: "var(--blog-text-subtle)" }}
                  >
                    Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 6).map(({ tag, count }) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="blog-chip !py-1.5 !text-[0.75rem]"
                      >
                        {tag}
                        <span className="blog-chip__count">{count}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ----------------------------------------------- previews */}
            <div
              className="flex flex-col pl-7"
              style={{ borderLeft: "1px solid var(--blog-border)" }}
            >
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <p
                  className="text-[0.6875rem] font-medium uppercase tracking-[0.16em]"
                  style={{ color: "var(--blog-text-subtle)" }}
                >
                  Latest posts
                </p>
                <Link
                  href="/blog/archive"
                  className="text-[0.75rem] font-medium"
                  style={{ color: "var(--blog-accent)" }}
                >
                  View all
                </Link>
              </div>

              {data === null ? (
                <PanelSkeleton />
              ) : posts.length === 0 ? (
                <p className="text-[0.8125rem]" style={{ color: "var(--blog-text-muted)" }}>
                  Nothing published yet — the first posts are on the way.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {posts.map((post) => (
                    <RecentPostMiniCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
