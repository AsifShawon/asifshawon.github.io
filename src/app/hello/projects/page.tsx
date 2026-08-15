import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/site";
import type { ProjectRow } from "@/lib/supabase/types";
import ProjectsView from "./ProjectsView";
import { toProjectCaseStudy } from "./transform";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Selected work by Asif Bhuiyan Shawon — ecommerce builds, full-stack web applications and AI-powered features, with the stack behind each one.",
  path: "/hello/projects",
});

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<ProjectRow[]>();

  const projects = (data ?? []).map((row, index) => toProjectCaseStudy(row, index));

  return <ProjectsView projects={projects} />;
}
