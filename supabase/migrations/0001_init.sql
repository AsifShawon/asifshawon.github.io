-- =========================================================================
-- Portfolio CMS schema: profiles, services, projects, blog_posts, comments,
-- likes, admin role helper, view-counter RPC, and blog-media storage bucket.
--
-- Run this once in the Supabase Dashboard -> SQL Editor.
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE
-- / ON CONFLICT so re-running won't error on objects that already exist.
-- =========================================================================

-- ---------------------------------------------------------------------
-- Admin helper function
-- Reads the `role` claim Supabase Auth puts in app_metadata (and therefore
-- in the JWT). Set via: supabase.auth.admin.updateUserById(id, { app_metadata: { role: 'admin' } })
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- ---------------------------------------------------------------------
-- Profiles (About Me) — single row edited from /admin/profile.
-- `bio` is jsonb so the existing About page's intro paragraph, achievements
-- list, and career timeline can all live here without extra tables:
--   { "intro": string, "achievements": [{title, description, icon}],
--     "timeline": [{title, subtitle, period, description: string | string[]}] }
-- `socials` jsonb holds contact + social links:
--   { "email", "phone", "location", "website", "facebook", "instagram", "linkedin", "discord" }
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  tagline text,
  bio jsonb,
  avatar_url text,
  resume_url text,
  socials jsonb,
  updated_at timestamptz default now()
);

-- Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  sort_order int default 0
);

-- Projects
-- Extended with short_description / gallery_images / background_color to
-- preserve the existing ShowcaseProjectCard + ProjectModal visuals exactly
-- (they use a short teaser line, a screenshot gallery, and a per-project
-- accent color that the original spec's columns didn't account for).
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text,
  description text,
  cover_image_url text,
  gallery_images text[],
  background_color text,
  live_link text,
  github_link text,
  tech_stack text[],
  sort_order int default 0
);

-- Blog Posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  cover_image_url text,
  content jsonb not null,
  published boolean default false,
  views bigint default 0,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Comments (Anonymous)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.blog_posts(id) on delete cascade,
  author_name text not null,
  content text not null,
  is_approved boolean default true,
  created_at timestamptz default now()
);

-- Likes (Anonymous)
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.blog_posts(id) on delete cascade,
  voter_hash text not null,
  created_at timestamptz default now(),
  unique (post_id, voter_hash)
);

-- ---------------------------------------------------------------------
-- RLS Policies
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;
drop policy if exists "public read profiles" on public.profiles;
create policy "public read profiles" on public.profiles for select using (true);
drop policy if exists "admin write profiles" on public.profiles;
create policy "admin write profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

alter table public.services enable row level security;
drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services for select using (true);
drop policy if exists "admin write services" on public.services;
create policy "admin write services" on public.services for all using (public.is_admin()) with check (public.is_admin());

alter table public.projects enable row level security;
drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select using (true);
drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());

alter table public.blog_posts enable row level security;
drop policy if exists "public read published posts" on public.blog_posts;
create policy "public read published posts" on public.blog_posts for select using (published = true or public.is_admin());
drop policy if exists "admin write posts" on public.blog_posts;
create policy "admin write posts" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());

alter table public.comments enable row level security;
drop policy if exists "public read approved comments" on public.comments;
create policy "public read approved comments" on public.comments for select using (is_approved = true or public.is_admin());
drop policy if exists "public insert comments" on public.comments;
create policy "public insert comments" on public.comments for insert with check (true);
drop policy if exists "admin moderate comments" on public.comments;
create policy "admin moderate comments" on public.comments for update using (public.is_admin());

alter table public.likes enable row level security;
drop policy if exists "public insert likes" on public.likes;
create policy "public insert likes" on public.likes for insert with check (true);
drop policy if exists "public count likes" on public.likes;
create policy "public count likes" on public.likes for select using (true);

-- ---------------------------------------------------------------------
-- Atomic View Counter RPC
-- ---------------------------------------------------------------------
create or replace function public.increment_post_views(post_slug text)
returns void
language plpgsql
security definer
as $$
begin
  update public.blog_posts set views = views + 1 where slug = post_slug and published = true;
end;
$$;

-- ---------------------------------------------------------------------
-- Storage Bucket for Blog Media
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('blog-media', 'blog-media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (bucket_id = 'blog-media');
drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert with check (bucket_id = 'blog-media' and public.is_admin());
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update using (bucket_id = 'blog-media' and public.is_admin());
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'blog-media' and public.is_admin());
