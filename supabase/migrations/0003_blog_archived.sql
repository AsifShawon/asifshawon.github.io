-- Adds an "archived" state to blog posts, distinct from "published"/draft.
-- Archived posts are hidden from the public site regardless of their
-- published flag (so publish history/date is preserved) but remain fully
-- visible and manageable in the admin dashboard.
alter table public.blog_posts
  add column if not exists archived boolean not null default false;

-- Public visibility now requires published AND not archived; admins still
-- see everything (drafts and archived posts alike) for management.
drop policy if exists "public read published posts" on public.blog_posts;
create policy "public read published posts" on public.blog_posts
  for select using ((published = true and archived = false) or public.is_admin());

-- The view-counter RPC is SECURITY DEFINER (bypasses RLS internally), so it
-- needs its own archived guard rather than relying on the policy above.
create or replace function public.increment_post_views(post_slug text)
returns void
language plpgsql
security definer
as $$
begin
  update public.blog_posts
  set views = views + 1
  where slug = post_slug and published = true and archived = false;
end;
$$;
