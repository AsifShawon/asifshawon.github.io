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
    <button
      onClick={handleLike}
      disabled={liked || busy}
      aria-pressed={liked}
      aria-label={liked ? "Liked" : "Like this article"}
      className={`group relative flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
        liked
          ? "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-sm shadow-rose-950/40"
          : "border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-zinc-100"
      }`}
    >
      <Heart
        size={18}
        className={`transition-transform group-hover:scale-110 ${
          liked ? "fill-rose-500 text-rose-500" : "text-zinc-400 group-hover:text-rose-400"
        }`}
      />
      <span>{liked ? "Liked" : "Like"}</span>
      {count !== null && (
        <span
          className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
            liked ? "bg-rose-500/20 text-rose-300" : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
