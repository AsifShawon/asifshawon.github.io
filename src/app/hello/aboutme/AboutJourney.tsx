import type { TimelineEntry } from "@/lib/supabase/types";

import AboutTimeline from "./AboutTimeline";

export default function AboutJourney({ timeline }: { timeline: TimelineEntry[] }) {
  if (timeline.length === 0) return null;

  return (
    <section id="about-journey" className="about-section about-journey">
      <div className="about-journey__intro">
        <p className="about-section-label">04 / Professional journey</p>
        <h2>Built through practice, not a straight line.</h2>
        <p>Each stage added a different way of understanding products and systems.</p>
      </div>

      <AboutTimeline timeline={timeline} />
    </section>
  );
}
