/**
 * Same five categories and skill names previously rendered by the old
 * `SkillTreeImage` component — carried over verbatim, just restyled as
 * compact cards instead of a tree diagram.
 */
const CAPABILITIES = [
  {
    number: "01",
    title: "Commerce & Growth",
    eyebrow: "Current role",
    skills: ["Marketing", "Facebook Ads", "SEO", "Market Analysis"],
  },
  {
    number: "02",
    title: "Frontend",
    eyebrow: "Build interfaces",
    skills: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS", "TypeScript"],
  },
  {
    number: "03",
    title: "Backend",
    eyebrow: "Power products",
    skills: ["Node.js", "Express", "Python", "FastAPI", "Django", "PostgreSQL", "MongoDB"],
  },
  {
    number: "04",
    title: "AI / ML",
    eyebrow: "Active & applied",
    skills: ["Machine Learning", "TensorFlow", "Pandas", "NumPy", "Scikit-learn", "NLP"],
    accent: "indigo" as const,
  },
  {
    number: "05",
    title: "Tools",
    eyebrow: "Ship with confidence",
    skills: ["Git", "GitHub", "Docker", "AWS", "Vercel", "Linux"],
  },
];

export default function AboutCapabilities() {
  return (
    <section id="about-capabilities" className="about-section about-section--mist about-capabilities">
      <p className="about-section-label">05 / Capabilities and skills</p>

      <div className="about-section-head">
        <h2>A compact working toolkit.</h2>
        <p>Grouped by discipline — the Tools page carries the full inventory in more depth.</p>
      </div>

      <div className="about-capabilities__grid">
        {CAPABILITIES.map((capability) => (
          <article
            className="about-capabilities__card"
            data-accent={capability.accent}
            key={capability.title}
          >
            <span className="about-capabilities__label">
              {capability.number} / {capability.eyebrow}
            </span>
            <h3>{capability.title}</h3>
            <ul className="about-capabilities__skills">
              {capability.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
