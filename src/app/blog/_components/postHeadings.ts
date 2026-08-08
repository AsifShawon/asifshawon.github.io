import type { JSONContent } from "@tiptap/core";

export interface PostHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "section"
  );
}

function textOf(node: JSONContent): string {
  if (node.text) return node.text;
  return (node.content ?? []).map(textOf).join("");
}

/**
 * H2/H3 headings in document order with stable, de-duplicated ids.
 * Both the rendered article and the table of contents call this, so their
 * anchors are guaranteed to agree.
 */
export function collectHeadings(content: JSONContent | null | undefined): PostHeading[] {
  if (!content) return [];

  const headings: PostHeading[] = [];
  const seen = new Map<string, number>();

  const walk = (node: JSONContent) => {
    if (node.type === "heading") {
      const level = node.attrs?.level;
      if (level === 2 || level === 3) {
        const text = textOf(node).trim();
        if (text) {
          const base = slugifyHeading(text);
          const used = seen.get(base) ?? 0;
          seen.set(base, used + 1);
          headings.push({ id: used === 0 ? base : `${base}-${used + 1}`, text, level });
        }
      }
    }
    (node.content ?? []).forEach(walk);
  };

  walk(content);
  return headings;
}

/**
 * Adds the ids from `collectHeadings` to the generated markup. Tiptap emits
 * headings in the same order it stores them, so a sequential pass keeps the
 * two in sync without parsing the HTML.
 */
export function injectHeadingIds(html: string, headings: PostHeading[]): string {
  if (headings.length === 0) return html;

  let cursor = 0;
  return html.replace(/<h([23])((?:\s[^>]*)?)>/g, (match, level: string, attrs: string) => {
    const heading = headings[cursor];
    if (!heading || heading.level !== Number(level)) return match;
    cursor += 1;
    return `<h${level}${attrs} id="${heading.id}">`;
  });
}
