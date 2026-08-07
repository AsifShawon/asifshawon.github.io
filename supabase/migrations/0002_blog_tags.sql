-- Adds a lightweight category/tag system to blog posts, used by the
-- /blog listing page's filter pills. Additive and idempotent.
alter table public.blog_posts
  add column if not exists tags text[] default '{}'::text[];
