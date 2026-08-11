import type { Metadata } from "next";

import EnhancedHome from "./components/EnhancedHome";
import CursorFollower from "./components/CursorFollower";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";
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
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .limit(1)
    .maybeSingle<Pick<Profile, "full_name">>();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <CursorFollower />
      <main
        id="main-content"
        className="relative flex min-h-[100svh] items-center justify-center py-20"
      >
        <EnhancedHome fullName={profile?.full_name} />
      </main>
    </>
  );
}
