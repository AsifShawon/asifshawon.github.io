import type { Metadata } from "next";

import EnhancedHome from "./components/EnhancedHome";
import CursorFollower from "./components/CursorFollower";
import { createClient } from "@/lib/supabase/server";
import type { Profile, ProjectRow } from "@/lib/supabase/types";
import { toProjectCaseStudy } from "./hello/projects/transform";
import { absoluteUrl, JOB_TITLE, PROFILE_DESCRIPTION, SITE_NAME, SOCIAL_PROFILES } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** ProfilePage + Person: this site *is* the portfolio of one person. Every
 *  field below is already present in the repository — nothing is invented. */
const personLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": absoluteUrl("/#profilepage"),
  url: absoluteUrl("/"),
  name: `${SITE_NAME} — Portfolio`,
  mainEntity: {
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: SITE_NAME,
    url: absoluteUrl("/"),
    jobTitle: JOB_TITLE,
    description: PROFILE_DESCRIPTION,
    email: "mailto:asifbhuiyanshawon@gmail.com",
    sameAs: [...SOCIAL_PROFILES],
  },
};

export default async function Page() {
  const supabase = await createClient();
  const [profileResult, projectsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .limit(1)
      .maybeSingle<Pick<Profile, "full_name">>(),
    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<ProjectRow[]>(),
  ]);

  const projects = (projectsResult.data ?? []).map((row, index) => toProjectCaseStudy(row, index));
  // Prefers the project marked featured; falls back to the first project so
  // the preview still has something to show if none is flagged yet.
  const featuredProject = projects.find((p) => p.featured) ?? projects[0] ?? null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <CursorFollower />
      <main id="main-content" className="relative py-20">
        <EnhancedHome fullName={profileResult.data?.full_name} featuredProject={featuredProject} />
      </main>
    </>
  );
}
