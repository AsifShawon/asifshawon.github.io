import type { JSONContent } from "@tiptap/core";

export interface AchievementEntry {
  title: string;
  description: string;
  icon: string;
}

export interface TimelineEntry {
  title: string;
  subtitle: string;
  period: string;
  description: string | string[];
}

export interface ProfileBio {
  intro?: string;
  achievements?: AchievementEntry[];
  timeline?: TimelineEntry[];
}

export interface ProfileSocials {
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  tagline: string | null;
  bio: ProfileBio | null;
  avatar_url: string | null;
  resume_url: string | null;
  socials: ProfileSocials | null;
  updated_at: string | null;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  cover_image_url: string | null;
  gallery_images: string[] | null;
  background_color: string | null;
  live_link: string | null;
  github_link: string | null;
  tech_stack: string[] | null;
  sort_order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  content: JSONContent;
  published: boolean;
  archived: boolean;
  views: number;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}

export interface Like {
  id: string;
  post_id: string;
  voter_hash: string;
  created_at: string;
}
