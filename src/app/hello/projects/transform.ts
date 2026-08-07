import type { ProjectRow } from "@/lib/supabase/types";

export interface LegacyProject {
  id: string;
  projectTitle: string;
  image: string;
  techStack: string[];
  shortDescription: string;
  description: string;
  links: { github?: string; live?: string };
  modalImages: string[];
  backgroundColor: string;
}

export function toLegacyProject(row: ProjectRow): LegacyProject {
  return {
    id: row.id,
    projectTitle: row.title,
    image: row.cover_image_url ?? "",
    techStack: row.tech_stack ?? [],
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    links: {
      github: row.github_link ?? undefined,
      live: row.live_link ?? undefined,
    },
    modalImages: row.gallery_images ?? [],
    backgroundColor: row.background_color ?? "#76ABAE",
  };
}
