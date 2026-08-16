import Link from "next/link";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JOB_TITLE, SITE_NAME } from "@/lib/site";
import type { Profile } from "@/lib/supabase/types";

import AboutPortrait from "./AboutPortrait";

export default function AboutHero({ profile }: { profile: Profile | null }) {
  const fullName = profile?.full_name || SITE_NAME;
  const tagline = profile?.tagline || JOB_TITLE;
  const intro = profile?.bio?.intro ?? "";
  const location = profile?.socials?.location;
  const resumeUrl = profile?.resume_url;

  return (
    <section id="about-intro" className="about-section about-hero">
      <div className="about-hero__copy">
        <p className="about-section-label">01 / Introduction</p>

        <h1 className="about-hero__title">
          From <span className="about-underline-word">engineering</span> to{" "}
          <span className="about-green-word">ecommerce</span> — same habits, a different
          toolkit.
        </h1>

        {intro && <p className="about-hero__intro measure">{intro}</p>}

        <div className="about-hero__actions">
          {resumeUrl && (
            <Button asChild variant="brand" size="cta">
              <a href={resumeUrl} download>
                Download résumé
                <Download size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            </Button>
          )}
          <Button asChild variant="surface" size="cta">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>

        <div className="about-hero__meta">
          {location && <span>{location}</span>}
          <span>{tagline}</span>
        </div>
      </div>

      <AboutPortrait avatarUrl={profile?.avatar_url ?? null} fullName={fullName} />
    </section>
  );
}
