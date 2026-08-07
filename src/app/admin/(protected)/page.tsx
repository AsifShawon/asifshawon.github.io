import { createClient } from "@/lib/supabase/server";
import { AdminCard, AdminHeading, Avatar, StatTile, StatusPill } from "../ui";
import { Eye, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import type { Comment } from "@/lib/supabase/types";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [viewsResult, likesResult, commentsResult] = await Promise.all([
    supabase.from("blog_posts").select("views"),
    supabase.from("likes").select("*", { count: "exact", head: true }),
    supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<Comment[]>(),
  ]);

  const totalViews =
    viewsResult.data?.reduce((sum, row) => sum + (row.views ?? 0), 0) ?? 0;
  const totalLikes = likesResult.count ?? 0;
  const recentComments = commentsResult.data ?? [];

  return (
    <div>
      <AdminHeading title="Dashboard" subtitle="Overview of your content and engagement" />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total Views" value={totalViews} icon={<Eye size={20} />} />
        <StatTile label="Total Likes" value={totalLikes} icon={<Heart size={20} />} />
        <StatTile
          label="Recent Comments"
          value={recentComments.length}
          icon={<MessageSquare size={20} />}
        />
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Recent Comments</h2>
          <Link href="/admin/comments" className="text-xs text-[#76ABAE] hover:underline">
            View all
          </Link>
        </div>

        {recentComments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {recentComments.map((comment) => (
              <li key={comment.id} className="flex gap-3 py-3">
                <Avatar label={comment.author_name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">
                      {comment.author_name}
                    </span>
                    <span className="shrink-0 text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-400">{comment.content}</p>
                  {!comment.is_approved && (
                    <div className="mt-1.5">
                      <StatusPill tone="warning">Unapproved</StatusPill>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
