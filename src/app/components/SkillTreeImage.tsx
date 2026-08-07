"use client";

import { motion } from "framer-motion";
import {
  Atom,
  BarChart3,
  BrainCircuit,
  Braces,
  Boxes,
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Container,
  Database,
  FileCode2,
  FlaskConical,
  Github,
  GitBranch,
  Languages,
  Layers3,
  Megaphone,
  MonitorCog,
  Palette,
  Route,
  Search,
  ServerCog,
  Sigma,
  Table2,
  Target,
  Terminal,
  Type,
  Triangle,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";

interface TechItem {
  name: string;
  icon: LucideIcon;
}

interface CategoryData {
  title: string;
  eyebrow: string;
  color: string;
  icon: LucideIcon;
  items: TechItem[];
}

const categories: CategoryData[] = [
  {
    title: "Commerce & Growth",
    eyebrow: "Learning now",
    color: "#76ABAE",
    icon: TrendingUp,
    items: [
      { name: "Marketing", icon: Megaphone },
      { name: "Facebook Ads", icon: Target },
      { name: "SEO", icon: Search },
      { name: "Market Analysis", icon: BarChart3 },
    ],
  },
  {
    title: "Frontend",
    eyebrow: "Build interfaces",
    color: "#5A9CA0",
    icon: MonitorCog,
    items: [
      { name: "HTML", icon: FileCode2 },
      { name: "CSS", icon: Palette },
      { name: "JavaScript", icon: Braces },
      { name: "React", icon: Atom },
      { name: "Next.js", icon: Layers3 },
      { name: "Tailwind CSS", icon: Palette },
      { name: "TypeScript", icon: Type },
    ],
  },
  {
    title: "Backend",
    eyebrow: "Power products",
    color: "#7AA2A2",
    icon: ServerCog,
    items: [
      { name: "Node.js", icon: Terminal },
      { name: "Express", icon: Route },
      { name: "Python", icon: Braces },
      { name: "FastAPI", icon: Route },
      { name: "Django", icon: Boxes },
      { name: "PostgreSQL", icon: Database },
      { name: "MongoDB", icon: Database },
    ],
  },
  {
    title: "AI / ML",
    eyebrow: "Academic background",
    color: "#88C0D0",
    icon: BrainCircuit,
    items: [
      { name: "Machine Learning", icon: BrainCircuit },
      { name: "TensorFlow", icon: Sigma },
      { name: "Pandas", icon: Table2 },
      { name: "NumPy", icon: ChartNoAxesCombined },
      { name: "Scikit-learn", icon: FlaskConical },
      { name: "NLP", icon: Languages },
    ],
  },
  {
    title: "Tools",
    eyebrow: "Ship with confidence",
    color: "#93B1A6",
    icon: Wrench,
    items: [
      { name: "Git", icon: GitBranch },
      { name: "GitHub", icon: Github },
      { name: "Docker", icon: Container },
      { name: "AWS", icon: Cloud },
      { name: "Vercel", icon: Triangle },
      { name: "Linux", icon: Terminal },
    ],
  },
];

function SkillNode({ item, color, index }: { item: TechItem; color: string; index: number }) {
  const Icon = item.icon;

  return (
    <motion.li
      className="skill-tree__item"
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35, delay: index * 0.045 }}
    >
      <div className="skill-tree__skill" style={{ "--category-color": color } as React.CSSProperties}>
        <span className="skill-tree__skill-icon" aria-hidden="true">
          <Icon size={15} strokeWidth={1.8} />
        </span>
        <span>{item.name}</span>
      </div>
    </motion.li>
  );
}

function CategoryBranch({ category, index }: { category: CategoryData; index: number }) {
  const Icon = category.icon;

  return (
    <motion.article
      className="skill-tree__branch"
      style={{ "--category-color": category.color } as React.CSSProperties}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className="skill-tree__category">
        <span className="skill-tree__category-icon" aria-hidden="true">
          <Icon size={21} strokeWidth={1.8} />
        </span>
        <span>
          <span className="skill-tree__eyebrow">{category.eyebrow}</span>
          <strong>{category.title}</strong>
        </span>
        <span className="skill-tree__count">{category.items.length}</span>
      </div>

      <ul className="skill-tree__skills">
        {category.items.map((item, itemIndex) => (
          <SkillNode key={item.name} item={item} color={category.color} index={itemIndex} />
        ))}
      </ul>
    </motion.article>
  );
}

const SkillTreeImage = () => {
  return (
    <div className="skill-tree" aria-label="Skills grouped by discipline">
      <motion.div
        className="skill-tree__root"
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="skill-tree__root-icon" aria-hidden="true">
          <Code2 size={22} strokeWidth={1.8} />
        </span>
        <span>
          <span className="skill-tree__eyebrow">My toolkit</span>
          <strong>Skills &amp; Focus</strong>
        </span>
      </motion.div>

      <div className="skill-tree__trunk" aria-hidden="true" />
      <div className="skill-tree__branches">
        {categories.map((category, index) => (
          <CategoryBranch key={category.title} category={category} index={index} />
        ))}
      </div>
    </div>
  );
};

export default SkillTreeImage;
