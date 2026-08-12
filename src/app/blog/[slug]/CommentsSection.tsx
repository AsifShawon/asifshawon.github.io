"use client";

import { useState, type FormEvent } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Send } from "lucide-react";
import type { Comment } from "@/lib/supabase/types";
import { formatPostDate } from "@/lib/readingTime";

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

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
    <section aria-labelledby="comments-heading">
      <div
        className="flex flex-wrap items-baseline justify-between gap-3 pb-6"
        style={{ borderBottom: "1px solid var(--blog-border)" }}
      >
        <h2 id="comments-heading" className="blog-display text-[1.75rem] leading-[1.15] sm:text-[2rem]">
          Responses
        </h2>
        <span className="text-[0.8125rem]" style={{ color: "var(--blog-text-muted)" }}>
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="blog-card mt-8 p-5 sm:p-6">
        <h3
          className="text-[0.6875rem] font-medium uppercase tracking-[0.16em]"
          style={{ color: "var(--blog-text-subtle)" }}
        >
          Leave a response
        </h3>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label htmlFor="comment-name" className="sr-only">
              Your name
            </label>
            <input
              id="comment-name"
              required
              maxLength={80}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              className="blog-field"
            />
          </div>
          <div>
            <label htmlFor="comment-body" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment-body"
              required
              rows={4}
              maxLength={2000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share a thought…"
              className="blog-field resize-y"
            />
          </div>
        </div>

        <div className="mt-4 overflow-hidden">
          <Turnstile
            key={turnstileKey}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
            onSuccess={setToken}
            onExpire={() => setToken(null)}
            options={{ theme: "dark" }}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-[12px] px-3.5 py-2.5 text-[0.8125rem]"
            style={{
              color: "#FCA5A5",
              border: "1px solid rgba(248, 113, 113, 0.28)",
              background: "rgba(127, 29, 29, 0.18)",
            }}
          >
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={submitting} className="blog-button">
            <Send size={15} strokeWidth={1.9} aria-hidden="true" />
            {submitting ? "Posting…" : "Post comment"}
          </button>
          <p className="text-[0.75rem]" style={{ color: "var(--blog-text-subtle)" }}>
            No account needed. Be kind.
          </p>
        </div>
      </form>

      {comments.length === 0 ? (
        <p
          className="mt-8 rounded-[16px] px-6 py-10 text-center text-[0.9375rem]"
          style={{ border: "1px dashed var(--blog-border)", color: "var(--blog-text-muted)" }}
        >
          No responses yet — yours would be the first.
        </p>
      ) : (
        <ol className="mt-8 flex flex-col">
          {comments.map((comment, i) => (
            <li
              key={comment.id}
              className="flex gap-4 py-6"
              style={i > 0 ? { borderTop: "1px solid var(--blog-border)" } : undefined}
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.8125rem] font-semibold"
                style={{
                  color: "var(--blog-accent-strong)",
                  border: "1px solid var(--blog-border)",
                  background: "var(--blog-accent-soft)",
                }}
              >
                {initialOf(comment.author_name)}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span
                    className="text-[0.875rem] font-semibold"
                    style={{ color: "var(--blog-text)" }}
                  >
                    {comment.author_name}
                  </span>
                  <span aria-hidden="true" style={{ color: "var(--blog-text-subtle)" }}>
                    ·
                  </span>
                  <time
                    dateTime={comment.created_at}
                    className="text-[0.75rem]"
                    style={{ color: "var(--blog-text-subtle)" }}
                  >
                    {formatPostDate(comment.created_at)}
                  </time>
                </div>
                <p
                  className="mt-1.5 whitespace-pre-wrap text-[0.9375rem] leading-[1.7]"
                  style={{ color: "var(--blog-text-secondary)" }}
                >
                  {comment.content}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
