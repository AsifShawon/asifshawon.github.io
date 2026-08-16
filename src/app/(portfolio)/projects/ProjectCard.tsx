import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ProjectCaseStudy } from "./transform";

const VISIBLE_TAGS = 3;

/**
 * A single project card. Deliberately one `<Link>` wrapping otherwise
 * non-interactive content (image, text, tag list) — no nested anchors or
 * buttons, so the whole card is one unambiguous tab stop that navigates to
 * the case study. External actions (GitHub, Live Demo) live on the detail
 * page instead, where they can be real, separately-focusable links.
 */
export default function ProjectCard({ project }: { project: ProjectCaseStudy }) {
  const number = String(project.number).padStart(2, "0");
  const visibleTags = project.techStack.slice(0, VISIBLE_TAGS);
  const hiddenCount = project.techStack.length - visibleTags.length;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="project-card"
      data-ai={project.isAiRelated || undefined}
    >
      <article>
        <div className="project-card__media">
          {project.image ? (
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 320px"
              className="project-card__image"
            />
          ) : (
            <div className="project-card__media-placeholder" aria-hidden="true" />
          )}
          <span className="project-card__number">{number}</span>
        </div>

        <div className="project-card__body">
          <p className="project-card__meta">
            <span className="project-card__category">{project.category}</span>
            {project.year && (
              <>
                <span aria-hidden="true"> · </span>
                <span>{project.year}</span>
              </>
            )}
          </p>

          <h3 className="project-card__title">{project.projectTitle}</h3>

          <p className="project-card__summary">
            {project.shortDescription.replace(/\*\*/g, "")}
          </p>

          {visibleTags.length > 0 && (
            <ul className="project-card__tags">
              {visibleTags.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
              {hiddenCount > 0 && <li className="project-card__tags-more">+{hiddenCount}</li>}
            </ul>
          )}

          <div className="project-card__cta">
            <span>View case study</span>
            <span className="project-card__arrow" aria-hidden="true">
              <ArrowUpRight size={16} strokeWidth={2} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
