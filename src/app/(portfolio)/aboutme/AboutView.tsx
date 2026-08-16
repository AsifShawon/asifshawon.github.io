import Container from "@/components/ui/container";
import CustomBreadcrumb from "@/app/comps/breadCrumb";
import type { Profile } from "@/lib/supabase/types";

import AboutHero from "./AboutHero";
import AboutPractice from "./AboutPractice";
import AboutAchievements from "./AboutAchievements";
import AboutJourney from "./AboutJourney";
import AboutCapabilities from "./AboutCapabilities";
import AboutPrinciples from "./AboutPrinciples";
import AboutSectionIndex from "./AboutSectionIndex";

/**
 * Server component — the only client-side piece of the whole page is the
 * section index's scroll-spy (`AboutSectionIndex`); everything else is
 * static per request, sourced from the `profiles` row passed in.
 */
export default function AboutView({ profile }: { profile: Profile | null }) {
  const timeline = profile?.bio?.timeline ?? [];
  const achievements = profile?.bio?.achievements ?? [];

  return (
    <div className="about-page">
      <Container className="pt-8 sm:pt-10">
        <div className="font-mono opacity-70">
          <CustomBreadcrumb
            pageNames={[
              { name: "Home", href: "/" },
              { name: "About", href: "/aboutme" },
            ]}
          />
        </div>
      </Container>

      <Container width="wide" className="mt-8 lg:mt-10">
        <div className="about-grid">
          {/* Rendered first so tab order and the mobile "chips on top" layout
              agree — `order` in globals.css only moves it visually to the
              right once the layout switches to the sticky two-column grid. */}
          <AboutSectionIndex />

          <div className="about-grid__content">
            <AboutHero profile={profile} />
            <AboutPractice />
            <AboutAchievements achievements={achievements} />
            <AboutJourney timeline={timeline} />
            <AboutCapabilities />
            <AboutPrinciples />
          </div>
        </div>
      </Container>
    </div>
  );
}
