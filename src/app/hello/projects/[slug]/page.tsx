import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ExternalLink, Github } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/site";
import type { ProjectRow } from "@/lib/supabase/types";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import CustomBreadcrumb from "@/app/comps/breadCrumb";

import { toProjectCaseStudy, type ProjectCaseStudy } from "../transform";
import { findNextProject, findRelatedProjects } from "../relatedProjects";
import ProjectFactRow from "../ProjectFactRow";
import SectionBulletList from "../SectionBulletList";
import ProjectSidebar from "../ProjectSidebar";
import NextProjectPanel from "../NextProjectPanel";

/** Every project, in display order — the one query every piece of this page
 *  (current project, related sidebar, next-project panel) is built from, so
 *  they can never disagree with the listing page's ordering. */
async function loadAllProjects(): Promise<ProjectCaseStudy[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<ProjectRow[]>();

  return (data ?? []).map((row, index) => toProjectCaseStudy(row, index));
}

/**
 * Build-time param enumeration needs its own plain anon-key client — the
 * cookie-bound one in `@/lib/supabase/server` depends on `next/headers`,
 * which has no request to read cookies from while `generateStaticParams`
 * runs. Mirrors `src/app/sitemap.ts`.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const supabase = createSupabaseClient(url, key);
    const { data } = await supabase.from("projects").select("slug").returns<{ slug: string }[]>();
    return (data ?? []).filter((row) => row.slug).map((row) => ({ slug: row.slug }));
  } catch {
    // Falls back to on-demand rendering for every slug — never fail the build.
    return [];
  }
}

// Case studies change rarely; regenerate at most once an hour so an edit in
// the admin dashboard shows up without a redeploy.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projects = await loadAllProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };

  const description = project.shortDescription.replace(/\*\*/g, "");
  const url = `/hello/projects/${project.slug}`;
  const images = project.image ? [{ url: project.image, alt: project.projectTitle }] : [OG_IMAGE];

  return {
    title: project.projectTitle,
    description,
    alternates: { canonical: url },
    authors: [{ name: SITE_NAME }],
    openGraph: {
      type: "article",
      title: project.projectTitle,
      description,
      url,
      siteName: SITE_NAME,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: project.projectTitle,
      description,
      images: [project.image || OG_IMAGE.url],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await loadAllProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const related = findRelatedProjects(project, projects, 4);
  const nextProject = findNextProject(project, projects);

  const canonicalUrl = absoluteUrl(`/hello/projects/${project.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.projectTitle,
    description: project.shortDescription.replace(/\*\*/g, ""),
    image: project.image || undefined,
    url: canonicalUrl,
    author: { "@type": "Person", name: SITE_NAME },
    keywords: project.techStack.length > 0 ? project.techStack.join(", ") : undefined,
  };

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="pt-8 sm:pt-10">
        <div className="font-mono opacity-70">
          <CustomBreadcrumb
            pageNames={[
              { name: "Home", href: "/" },
              { name: "Projects", href: "/hello/projects" },
              { name: project.projectTitle, href: `/hello/projects/${project.slug}` },
            ]}
          />
        </div>

        {/* --------------------------------------------------------- hero */}
        <header className="case-study-hero">
          <p className="case-study-hero__meta">
            <span>{String(project.number).padStart(2, "0")}</span>
            <span aria-hidden="true"> · </span>
            <span style={{ color: project.isAiRelated ? "var(--ml-indigo)" : undefined }}>
              {project.category}
            </span>
            {project.year && (
              <>
                <span aria-hidden="true"> · </span>
                <span>{project.year}</span>
              </>
            )}
          </p>

          <h1 className="case-study-hero__title">{project.projectTitle}</h1>

          {project.shortDescription && (
            <p className="case-study-hero__intro measure">
              {project.shortDescription.replace(/\*\*/g, "")}
            </p>
          )}

          <ProjectFactRow project={project} />

          {(project.links.live || project.links.github) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.live && (
                <Button asChild variant="brand" size="cta">
                  <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                    Live Demo
                    <ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
                  </a>
                </Button>
              )}
              {project.links.github && (
                <Button asChild variant="surface" size="cta">
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <Github size={16} strokeWidth={1.9} aria-hidden="true" />
                    View Code
                  </a>
                </Button>
              )}
            </div>
          )}
        </header>
      </Container>

      {/* --------------------------------------------------- hero screenshot */}
      {project.image && (
        <Container width="wide" className="mt-10 lg:mt-14">
          <div className="case-study-hero__image">
            <Image
              src={project.image}
              alt={`${project.projectTitle} interface screenshot`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1400px"
              className="object-cover"
            />
          </div>
        </Container>
      )}

      {/* --------------------------------------------------- article + sidebar */}
      <Container className="mt-14 lg:mt-16">
        <div className="case-study-grid">
          <article className="case-study-article">
            {project.overview && (
              <section className="case-study-section">
                <h2>Overview</h2>
                <p>{project.overview}</p>
              </section>
            )}

            {project.problem && (
              <section className="case-study-section">
                <h2>The problem</h2>
                <p>{project.problem}</p>
              </section>
            )}

            {project.contribution && (
              <section className="case-study-section">
                <h2>My role and contribution</h2>
                <p>{project.contribution}</p>
              </section>
            )}

            {project.features && project.features.length > 0 && (
              <section className="case-study-section">
                <h2>Key features</h2>
                <SectionBulletList
                  items={project.features}
                  accent={project.isAiRelated ? "indigo" : "green"}
                />
              </section>
            )}

            {project.technicalDecisions && project.technicalDecisions.length > 0 && (
              <section className="case-study-section">
                <h2>Technical decisions</h2>
                <SectionBulletList items={project.technicalDecisions} />
              </section>
            )}

            {project.gallery.length > 0 && (
              <section className="case-study-section">
                <h2>Gallery</h2>
                <div className="case-study-gallery">
                  {project.gallery.map((shot, i) => (
                    <figure key={shot.src}>
                      <div className="case-study-gallery__frame">
                        <Image
                          src={shot.src}
                          alt={`${project.projectTitle} additional screenshot ${i + 1}`}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      {shot.caption && <figcaption>{shot.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {project.outcome && project.outcome.length > 0 && (
              <section className="case-study-section">
                <h2>Outcome</h2>
                <SectionBulletList
                  items={project.outcome}
                  accent={project.isAiRelated ? "indigo" : "green"}
                />
              </section>
            )}

            {project.lessonsLearned && (
              <section className="case-study-section">
                <h2>Lessons learned</h2>
                <p>{project.lessonsLearned}</p>
              </section>
            )}
          </article>

          <ProjectSidebar projects={related} />
        </div>
      </Container>

      {/* --------------------------------------------------------- next project */}
      {nextProject && (
        <Container className="mt-20 lg:mt-24">
          <NextProjectPanel project={nextProject} />
        </Container>
      )}
    </div>
  );
}
