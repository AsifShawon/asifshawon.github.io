"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/lib/supabase/types";
import { AdminCard, AdminHeading, Avatar, StatusPill } from "../../ui";
import { Check, X } from "lucide-react";

export interface CommentWithPost extends Comment {
  blog_posts: { title: string; slug: string } | null;
}

export default function CommentsAdminClient({
  initialComments,
}: {
  initialComments: CommentWithPost[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [error, setError] = useState<string | null>(null);

  async function setApproved(id: string, is_approved: boolean) {
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("comments")
      .update({ is_approved })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, is_approved } : c)));
  }

  return (
    <div>
      <AdminHeading title="Comments" subtitle="Moderate anonymous comments left on blog posts" />

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-3">
        {comments.map((comment) => (
          <AdminCard key={comment.id}>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <Avatar label={comment.author_name} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{comment.author_name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                    {!comment.is_approved && <StatusPill tone="warning">Hidden</StatusPill>}
                  </div>
                  <p className="mt-1 text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                  {comment.blog_posts && (
                    <Link
                      href={`/blog/${comment.blog_posts.slug}`}
                      target="_blank"
                      className="mt-2 inline-block text-xs text-[#76ABAE] hover:underline"
                    >
                      on “{comment.blog_posts.title}”
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-end gap-2 w-full sm:w-auto pt-2 border-t border-white/[0.06] sm:border-t-0 sm:pt-0">
                {comment.is_approved ? (
                  <button
                    onClick={() => setApproved(comment.id, false)}
                    className="flex h-9 sm:h-8 items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-400 w-full sm:w-auto transition-colors"
                  >
                    <X size={14} /> Hide
                  </button>
                ) : (
                  <button
                    onClick={() => setApproved(comment.id, true)}
                    className="flex h-9 sm:h-8 items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 w-full sm:w-auto transition-colors"
                  >
                    <Check size={14} /> Approve
                  </button>
                )}
              </div>
            </div>
          </AdminCard>
        ))}
        {comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
      </div>
    </div>
  );
}
