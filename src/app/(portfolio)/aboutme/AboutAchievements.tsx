import { Award, Brain, Code, TrendingUp, type LucideIcon } from "lucide-react";

import type { AchievementEntry } from "@/lib/supabase/types";

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  award: Award,
  code: Code,
  brain: Brain,
  growth: TrendingUp,
};

export default function AboutAchievements({
  achievements,
}: {
  achievements: AchievementEntry[];
}) {
  if (achievements.length === 0) return null;

  return (
    <section id="about-achievements" className="about-section about-achievements">
      <p className="about-section-label">03 / Key achievements</p>

      <div className="about-section-head">
        <h2>What&apos;s actually shipped.</h2>
      </div>

      <div className="about-achievements__grid">
        {achievements.map((achievement) => {
          const Icon = ACHIEVEMENT_ICONS[achievement.icon] ?? Award;
          return (
            <article className="about-achievements__card" key={achievement.title}>
              <Icon className="about-achievements__icon" size={22} strokeWidth={1.8} aria-hidden="true" />
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
