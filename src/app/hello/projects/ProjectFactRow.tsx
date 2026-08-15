import type { ProjectCaseStudy } from "./transform";

/** Role/duration/status/technologies — each cell only renders when the
 *  underlying field is verified (non-null), so an unset fact (e.g. every
 *  project's `duration` today) simply doesn't appear rather than showing a
 *  placeholder. */
export default function ProjectFactRow({ project }: { project: ProjectCaseStudy }) {
  const facts: { label: string; value: React.ReactNode }[] = [];

  if (project.role) facts.push({ label: "Role", value: project.role });
  if (project.duration) facts.push({ label: "Duration", value: project.duration });
  if (project.status) facts.push({ label: "Status", value: project.status });
  if (project.techStack.length > 0) {
    facts.push({
      label: "Technologies",
      value: (
        <span className="project-fact-row__tags">
          {project.techStack.map((tech) => (
            <span key={tech} className="project-fact-row__tag">
              {tech}
            </span>
          ))}
        </span>
      ),
    });
  }

  if (facts.length === 0) return null;

  return (
    <dl className="project-fact-row">
      {facts.map((fact) => (
        <div className="project-fact-row__item" key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
