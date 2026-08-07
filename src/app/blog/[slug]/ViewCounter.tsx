"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed:${slug}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
    const supabase = createClient();
    void supabase.rpc("increment_post_views", { post_slug: slug });
  }, [slug]);

  return null;
}
