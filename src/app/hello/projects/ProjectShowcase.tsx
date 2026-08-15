import ProjectRail from "./ProjectRail";
import type { ProjectCaseStudy } from "./transform";

/**
 * Forest Ink index slab + the scrollable card rail it partially sits behind.
 * The slab is server-rendered; only the rail (`ProjectRail`) needs client JS
 * for its scroll/prev-next state.
 */
export default function ProjectShowcase({ projects }: { projects: ProjectCaseStudy[] }) {
  return (
    <div className="project-showcase">
      <aside className="project-showcase__slab">
        <p className="project-showcase__label">01 / Selected work</p>
        <h2 className="project-showcase__heading">Five projects, shipped end to end</h2>
        <p className="project-showcase__sentence">
          Ecommerce builds, full-stack apps and AI features — each one linked to real code
          and, where it&apos;s still live, a working demo.
        </p>
        <p className="project-showcase__count">{projects.length} projects</p>
      </aside>

      <div className="project-showcase__rail-wrap">
        <ProjectRail projects={projects} />
      </div>
    </div>
  );
}
