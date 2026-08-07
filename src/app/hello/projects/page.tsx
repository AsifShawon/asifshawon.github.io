import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/lib/supabase/types";
import ProjectsPageClient from "./ProjectsPageClient";
import { toLegacyProject } from "./transform";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<ProjectRow[]>();

  const projects = (data ?? []).map(toLegacyProject);

  return <ProjectsPageClient projects={projects} />;
}
