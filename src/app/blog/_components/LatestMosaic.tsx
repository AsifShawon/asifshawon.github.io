import type { BlogPost } from "@/lib/supabase/types";
import MosaicFeatureCard from "./MosaicFeatureCard";
import CompactPostCard from "./CompactPostCard";
import WidePostCard from "./WidePostCard";

/**
 * Posts consumed per mosaic cycle: one lead card, two compact cards beside it,
 * then a row of two wide cards.
 */
const CYCLE = 5;

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

/**
 * Editorial mosaic that mixes three card designs rather than repeating one
 * rectangle. The rhythm repeats every {@link CYCLE} posts and every row is
 * built only from posts that exist — a short final group simply renders fewer
 * cards, never a placeholder.
 */
export default function LatestMosaic({
  posts,
  commentCounts,
  authorName,
  authorAvatarUrl,
}: {
  posts: BlogPost[];
  commentCounts: Record<string, number>;
  authorName: string;
  authorAvatarUrl: string;
}) {
  if (posts.length === 0) return null;

  const countOf = (id: string) => commentCounts[id] ?? 0;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {chunk(posts, CYCLE).map((group, groupIndex) => {
        const [lead, ...others] = group;
        const beside = others.slice(0, 2);
        const wide = others.slice(2);
        const isFirstGroup = groupIndex === 0;
        // A lead with no companions would leave a hole in a two-column row.
        const leadSpansRow = beside.length === 0;

        return (
          <div key={lead.id} className="flex flex-col gap-5 sm:gap-6">
            <div
              className={
                leadSpansRow
                  ? ""
                  : "grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-stretch lg:gap-6"
              }
            >
              <div className={leadSpansRow ? "" : "lg:col-span-7"}>
                <MosaicFeatureCard
                  post={lead}
                  priority={isFirstGroup}
                  authorName={authorName}
                  authorAvatarUrl={authorAvatarUrl}
                  ratioClass={leadSpansRow ? "aspect-[16/9]" : "aspect-[4/3] lg:h-full lg:aspect-auto"}
                  sizes={
                    leadSpansRow
                      ? "(max-width: 1024px) 100vw, 1200px"
                      : "(max-width: 1024px) 100vw, 680px"
                  }
                />
              </div>

              {beside.length > 0 && (
                <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-6">
                  {beside.map((post) => (
                    <CompactPostCard
                      key={post.id}
                      post={post}
                      commentCount={countOf(post.id)}
                      className="lg:flex-1"
                    />
                  ))}
                </div>
              )}
            </div>

            {wide.length > 0 && (
              <div
                className={`grid grid-cols-1 gap-5 sm:gap-6 ${
                  wide.length > 1 ? "lg:grid-cols-2" : ""
                }`}
              >
                {wide.map((post) => (
                  <WidePostCard
                    key={post.id}
                    post={post}
                    commentCount={countOf(post.id)}
                    authorName={authorName}
                    authorAvatarUrl={authorAvatarUrl}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
