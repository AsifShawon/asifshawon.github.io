import Link from "next/link";

import Container from "@/components/ui/container";
import CustomBreadcrumb from "@/app/comps/breadCrumb";

import ProjectShowcase from "./ProjectShowcase";
import type { ProjectCaseStudy } from "./transform";

/**
 * Server component — nothing here needs client state. The one interactive
 * island (the rail's scroll/prev-next behaviour) lives in `ProjectRail`,
 * rendered inside `ProjectShowcase`.
 */
export default function ProjectsView({ projects }: { projects: ProjectCaseStudy[] }) {
  return (
    <div className="pb-24">
      <Container className="pt-8 sm:pt-10">
        <div className="font-mono opacity-70">
          <CustomBreadcrumb
            pageNames={[
              { name: "Home", href: "/" },
              { name: "Projects", href: "/hello/projects" },
            ]}
          />
        </div>

        {/* ---------------------------------------------------------- intro */}
        <div className="mt-12 max-w-2xl lg:mt-16">
          <p className="type-label text-[var(--ml-green)]">Projects</p>
          <h1 className="type-h1 mt-4 text-[var(--ml-ink)]">
            Transforming ideas into products with measurable impact
          </h1>
          <p className="type-body-lg measure mt-5 text-[var(--site-text-muted)]">
            Ecommerce builds, full-stack applications and AI-powered features — the
            technical work that built the foundation for what I do now.
          </p>
        </div>
      </Container>

      {/* Full-bleed relative to the intro so the rail has room to run wide. */}
      <Container width="wide" className="mt-16 lg:mt-20">
        <ProjectShowcase projects={projects} />
      </Container>

      <Container className="mt-24 border-t border-[var(--site-border)] pt-16 text-center lg:mt-32">
        <p className="type-small text-[var(--site-text-muted)]">
          Interested in working together?
        </p>
        <Link
          href="/contact"
          className="type-h3 mt-3 inline-block border-b-2 border-[var(--ml-green)] pb-1 text-[var(--ml-ink)] transition-colors duration-200 hover:text-[var(--ml-green)]"
        >
          Let&apos;s Connect
        </Link>
      </Container>
    </div>
  );
}
