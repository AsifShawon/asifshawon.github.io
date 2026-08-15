"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function getVoterHash(): string {
  if (typeof window === "undefined") return "";
  const key = "voter-hash";
  let hash = localStorage.getItem(key);
  if (!hash) {
    hash = crypto.randomUUID();
    localStorage.setItem(key, hash);
  }
  return hash;
}

export default function LikeButton({ postId }: { postId: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)
      .then(({ count }) => setCount(count ?? 0));

    setLiked(!!localStorage.getItem(`liked:${postId}`));
  }, [postId]);

  async function handleLike() {
    if (liked || busy) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, voter_hash: getVoterHash() });
    setBusy(false);

    if (!error || error.code === "23505") {
      setLiked(true);
      localStorage.setItem(`liked:${postId}`, "1");
      if (!error) setCount((c) => (c ?? 0) + 1);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={handleLike}
        disabled={liked || busy}
        aria-pressed={liked}
        aria-label={liked ? "You liked this article" : "Like this article"}
        className="group inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[0.875rem] font-medium transition-colors duration-200 disabled:cursor-default"
        style={{
          color: liked ? "var(--ml-like)" : "var(--blog-text-secondary)",
          border: `1px solid ${liked ? "var(--ml-like-line)" : "var(--blog-border)"}`,
          background: liked ? "var(--ml-like-soft)" : "transparent",
        }}
      >
        <Heart
          size={16}
          strokeWidth={1.9}
          aria-hidden="true"
          fill={liked ? "currentColor" : "none"}
          className="transition-transform duration-200 group-hover:scale-110"
        />
        {liked ? "Liked" : "Like this post"}
        {count !== null && count > 0 && (
          <span className="tabular-nums" style={{ color: "var(--blog-text-subtle)" }}>
            {count}
          </span>
        )}
      </button>

      <p className="text-[0.8125rem]" style={{ color: "var(--blog-text-subtle)" }}>
        Found this useful? Let me know.
      </p>
    </div>
  );
}
