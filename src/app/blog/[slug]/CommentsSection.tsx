"use client";

import { useState, type FormEvent } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import type { Comment } from "@/lib/supabase/types";
import { MessageSquare, Send } from "lucide-react";

export default function CommentsSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("Please complete the verification challenge.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, authorName, content, token }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to post comment");

      setComments((prev) => [json.comment as Comment, ...prev]);
      setAuthorName("");
      setContent("");
      setToken(null);
      setTurnstileKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-16 pt-8 border-t border-zinc-800/80">
      <div className="flex items-center gap-2.5 mb-6">
        <MessageSquare className="w-5 h-5 text-zinc-400" />
        <h3 className="font-serif text-2xl font-bold text-zinc-100">
          Comments ({comments.length})
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 mb-10 shadow-lg backdrop-blur-sm"
      >
        <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
          Leave a response
        </h4>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            required
            maxLength={80}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your Name"
            className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
          />
          <textarea
            required
            rows={4}
            maxLength={2000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
          />
        </div>

        <div className="mb-5 overflow-hidden">
          <Turnstile
            key={turnstileKey}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
            onSuccess={setToken}
            onExpire={() => setToken(null)}
            options={{ theme: "dark" }}
          />
        </div>

        {error && (
          <p className="mb-4 text-xs font-medium text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-sm"
        >
          <Send className="w-4 h-4" />
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800/80 p-8 text-center text-sm text-zinc-500">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xs transition-colors hover:border-zinc-700/80"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-sm text-zinc-200">{c.author_name}</span>
                <span className="text-xs text-zinc-500">
                  {new Date(c.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
