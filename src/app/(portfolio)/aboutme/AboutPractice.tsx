/**
 * The two skill lists below are carried over verbatim from the previous
 * About page's "Where I'm Focused" section — not new claims, just restyled
 * into the two-column practice layout.
 */
const COMMERCE_ITEMS = [
  "Ecommerce Operations",
  "Marketing Fundamentals & Strategy",
  "Facebook Ads / Paid Social",
  "SEO & Search Visibility",
  "Market Analysis & Growth Planning",
];

const ENGINEERING_ITEMS = [
  "React, Next.js & Modern Frontend",
  "Full-Stack Application Development",
  "Python & Backend Development",
  "AI/LLM Integration & RAG",
  "Database Design & Cloud Deployment",
  "Automation & API Integration",
];

export default function AboutPractice() {
  return (
    <section id="about-practice" className="about-section about-section--mist about-practice">
      <p className="about-section-label">02 / Commerce × Engineering</p>

      <div className="about-section-head">
        <h2>Two disciplines, one practice.</h2>
        <p>
          The commercial side shows how a product behaves after launch. The engineering
          side is what built the habit of testing, measuring and iterating in the first
          place — now applied to a different toolkit.
        </p>
      </div>

      <div className="about-practice__grid">
        <article className="about-practice__column">
          <span className="about-practice__label">Commerce &amp; Growth</span>
          <h3>The customer-facing side</h3>
          <ul>
            {COMMERCE_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <div className="about-practice__bridge" aria-hidden="true">
          ×
        </div>

        <article className="about-practice__column">
          <span className="about-practice__label">Engineering &amp; AI</span>
          <h3>The systems underneath</h3>
          <ul>
            {ENGINEERING_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
