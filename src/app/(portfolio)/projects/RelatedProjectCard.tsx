import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ProjectCaseStudy } from "./transform";

/** Compact sidebar entry — same single-`<Link>` discipline as `ProjectCard`. */
export default function RelatedProjectCard({ project }: { project: ProjectCaseStudy }) {
  return (
    <Link href={`/projects/${project.slug}`} className="related-project-card">
      <div className="related-project-card__media">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="64px"
            loading="lazy"
            className="related-project-card__image"
          />
        ) : (
          <div className="related-project-card__media-placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="related-project-card__body">
        <p className="related-project-card__meta">
          {String(project.number).padStart(2, "0")}
          <span aria-hidden="true"> · </span>
          {project.category}
        </p>
        <p className="related-project-card__title">{project.projectTitle}</p>
      </div>

      <span className="related-project-card__arrow" aria-hidden="true">
        <ArrowUpRight size={14} strokeWidth={2} />
      </span>
    </Link>
  );
}
