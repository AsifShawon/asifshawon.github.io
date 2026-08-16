import type { ProjectCaseStudy } from "./transform";

/**
 * Other projects ranked by shared tech stack, then by list position —
 * deterministic (never `Math.random()`), and the current project is always
 * excluded first so it can never appear in its own sidebar. Mirrors
 * `findRelatedPosts` in `src/lib/blogQueries.ts`, adapted to tech-stack
 * overlap instead of tags.
 */
export function findRelatedProjects(
  current: ProjectCaseStudy,
  all: ProjectCaseStudy[],
  limit = 4
): ProjectCaseStudy[] {
  const ownTech = new Set(current.techStack.map((t) => t.trim().toLowerCase()));
  const others = all.filter((p) => p.id !== current.id);

  // `sort` is stable in modern JS engines, so equally-scored candidates keep
  // their incoming (list) order — which is already `number` ascending.
  const scored = others
    .map((candidate) => ({
      candidate,
      shared: candidate.techStack.filter((t) => ownTech.has(t.trim().toLowerCase())).length,
    }))
    .sort((a, b) => b.shared - a.shared);

  return scored.slice(0, limit).map((entry) => entry.candidate);
}

/** The next project in list order, wrapping back to the first after the last. */
export function findNextProject(
  current: ProjectCaseStudy,
  all: ProjectCaseStudy[]
): ProjectCaseStudy | null {
  if (all.length <= 1) return null;
  const index = all.findIndex((p) => p.id === current.id);
  if (index === -1) return null;
  return all[(index + 1) % all.length];
}
