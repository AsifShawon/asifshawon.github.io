/** Parses the "**Label**: rest of sentence" shape every curated bullet in
 *  `transform.ts` uses, so the label renders bold without pulling in a full
 *  markdown renderer for what is otherwise plain text. */
function BulletText({ text }: { text: string }) {
  const match = text.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
  if (!match) return <>{text}</>;
  const [, label, rest] = match;
  return (
    <>
      <strong>{label}</strong>
      {rest ? `: ${rest}` : null}
    </>
  );
}

export default function SectionBulletList({
  items,
  accent = "green",
}: {
  items: string[];
  accent?: "green" | "indigo";
}) {
  return (
    <ul className="case-study-list">
      {items.map((item) => (
        <li key={item}>
          <span
            className="case-study-list__dot"
            style={{ background: accent === "indigo" ? "var(--ml-indigo)" : "var(--ml-green)" }}
            aria-hidden="true"
          />
          <span>
            <BulletText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}
