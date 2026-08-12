import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Everything private or non-indexable in this app:
        //   /admin       dashboard (also gated by middleware)
        //   /api         JSON endpoints, including the contact form
        //   /hello/notes static lecture-note dumps, not portfolio content
        disallow: ["/admin", "/admin/", "/api/", "/hello/notes", "/notes/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/").replace(/\/$/, ""),
  };
}
