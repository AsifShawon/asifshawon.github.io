import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { ProjectCaseStudy } from "./transform";

export default function NextProjectPanel({ project }: { project: ProjectCaseStudy }) {
  return (
    <Link href={`/hello/projects/${project.slug}`} className="next-project">
      <div className="next-project__media">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 320px"
            loading="lazy"
            className="next-project__image"
          />
        ) : (
          <div className="next-project__media-placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="next-project__body">
        <p className="next-project__eyebrow">Next project</p>
        <p className="next-project__title">{project.projectTitle}</p>
        <p className="next-project__meta">
          {String(project.number).padStart(2, "0")}
          <span aria-hidden="true"> · </span>
          {project.category}
        </p>
      </div>

      <span className="next-project__arrow" aria-hidden="true">
        <ArrowRight size={20} strokeWidth={2} />
      </span>
    </Link>
  );
}
