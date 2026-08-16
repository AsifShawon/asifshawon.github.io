import Link from "next/link";
import { ArrowRight } from "lucide-react";

import RelatedProjectCard from "./RelatedProjectCard";
import type { ProjectCaseStudy } from "./transform";

/** Sticks below the header on desktop; returns to normal flow on mobile —
 *  see `.project-sidebar` in globals.css. */
export default function ProjectSidebar({ projects }: { projects: ProjectCaseStudy[] }) {
  if (projects.length === 0) return null;

  return (
    <aside className="project-sidebar" aria-labelledby="project-sidebar-heading">
      <h2 id="project-sidebar-heading" className="project-sidebar__heading">
        Other projects
      </h2>

      <div className="project-sidebar__list">
        {projects.map((project) => (
          <RelatedProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Link href="/hello/projects" className="project-sidebar__all">
        View all projects
        <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
      </Link>
    </aside>
  );
}
