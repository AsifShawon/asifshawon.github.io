import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

import { absoluteUrl } from "@/lib/site";

/** Rebuilt hourly so newly published posts appear without a redeploy. */
export const revalidate = 3600;

interface SitemapPost {
  slug: string;
  updated_at: string | null;
  published_at: string | null;
}

/**
 * Published posts only. Uses the anon key through the plain client (not the
 * cookie-bound server client) so this route never becomes request-dependent —
 * and RLS still keeps drafts out of the result.
 */
async function fetchPostEntries(): Promise<SitemapPost[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .returns<SitemapPost[]>();

    return data ?? [];
  } catch {
    // A sitemap is not worth failing a build over.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Public routes only — /admin, /api and the auth pages are excluded here and
  // disallowed in robots.ts.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: absoluteUrl("/hello/projects"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/hello/aboutme"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    {
      url: absoluteUrl("/hello/tools"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/hello/tools/calculate-cgpa"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    {
      url: absoluteUrl("/blog/archive"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const posts = await fetchPostEntries();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updated_at ?? post.published_at ?? now),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
