import type { TimelineEntry } from "@/lib/supabase/types";

export default function AboutJourney({ timeline }: { timeline: TimelineEntry[] }) {
  if (timeline.length === 0) return null;

  return (
    <section id="about-journey" className="about-section about-journey">
      <div className="about-journey__intro">
        <p className="about-section-label">04 / Professional journey</p>
        <h2>Built through practice, not a straight line.</h2>
        <p>Each stage added a different way of understanding products and systems.</p>
      </div>

      <ol className="about-timeline">
        {timeline.map((entry) => (
          <li className="about-timeline__item" key={`${entry.title}-${entry.period}`}>
            <span className="about-timeline__dot" aria-hidden="true" />
            <div className="about-timeline__body">
              <p className="about-timeline__period">{entry.period}</p>
              <h3>{entry.title}</h3>
              <p className="about-timeline__subtitle">{entry.subtitle}</p>
              {Array.isArray(entry.description) ? (
                <ul className="about-timeline__list">
                  {entry.description.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="about-timeline__description">{entry.description}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
