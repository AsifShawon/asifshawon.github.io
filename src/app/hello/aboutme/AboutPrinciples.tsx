import Link from "next/link";

/**
 * Each note restates something already published elsewhere on the site
 * (bio.intro, the blog's own description, `PROFILE_DESCRIPTION` in
 * `src/lib/site.ts`) rather than introducing new claims — see the comment
 * on each entry.
 */
const NOTES = [
  {
    title: "Currently learning",
    // Restates profile.bio.intro (Supabase): "learning marketing, Facebook
    // Ads, SEO, and market analysis, and noting what to try next as I go."
    body: "Marketing, Facebook Ads, SEO and market analysis — learned on the job, with what's working (and what isn't) tracked as I go.",
  },
  {
    title: "Writing along the way",
    // Restates the blog's own published description (src/app/blog/page.tsx):
    // "A builder learning ecommerce — marketing, growth, technology, and
    // everything else I pick up along the way."
    body: "Notes on the transition from engineering into ecommerce, and everything else picked up along the way.",
    href: "/blog",
    linkLabel: "Read the blog",
  },
  {
    title: "Still building",
    // Restates PROFILE_DESCRIPTION (src/lib/site.ts): "independently
    // building full-stack applications and practical AI-powered solutions."
    body: "Full-stack applications and practical AI-powered features, independently, alongside the ecommerce role.",
    href: "/hello/projects",
    linkLabel: "See the projects",
  },
];

export default function AboutPrinciples() {
  return (
    <section id="about-principles" className="about-section about-principles">
      <p className="about-section-label">06 / Beyond the job title</p>

      <div className="about-section-head">
        <h2>What the roles don&apos;t say.</h2>
      </div>

      <div className="about-principles__grid">
        {NOTES.map((note) => (
          <article className="about-principles__card" key={note.title}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
            {note.href && (
              <Link href={note.href} className="about-principles__link">
                {note.linkLabel}
                <span aria-hidden="true"> →</span>
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
