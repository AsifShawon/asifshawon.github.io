import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/lib/supabase/types";
import ProjectsAdminClient from "./ProjectsAdminClient";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<ProjectRow[]>();

  return (
    <Suspense>
      <ProjectsAdminClient initialProjects={data ?? []} />
    </Suspense>
  );
}
