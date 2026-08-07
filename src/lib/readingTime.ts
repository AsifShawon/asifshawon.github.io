import type { JSONContent } from "@tiptap/core";

const WORDS_PER_MINUTE = 200;

function collectText(node: JSONContent, out: string[]): void {
  if (node.text) out.push(node.text);
  node.content?.forEach((child) => collectText(child, out));
}

export function estimateReadingMinutes(content: JSONContent): number {
  const chunks: string[] = [];
  collectText(content, chunks);
  const wordCount = chunks.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

/** "6 mins read" / "1 min read" */
export function formatReadingTime(content: JSONContent): string {
  const minutes = estimateReadingMinutes(content);
  return `${minutes} ${minutes === 1 ? "min" : "mins"} read`;
}

/** "Jun 13, 2025" */
export function formatPostDate(isoDate: string | null): string | null {
  if (!isoDate) return null;
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
