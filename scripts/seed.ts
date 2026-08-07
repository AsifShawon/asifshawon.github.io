/**
 * One-time data migration: pushes the existing hardcoded About Me / Projects
 * data into Supabase (profiles, projects tables). Services starts empty —
 * there's no "services" section on the live site today, so there's nothing
 * to seed there; add rows from /admin/services once that page exists.
 *
 * Requires the DB schema in supabase/migrations/0001_init.sql to already be
 * applied. Run once with: npx tsx scripts/seed.ts
 */
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface LegacyProject {
  id: string;
  projectTitle: string;
  image: string;
  techStack: string[];
  shortDescription: string;
  description: string;
  links: { live?: string; github?: string };
  modalImages: string[];
  backgroundColor: string;
}

async function seedProjects() {
  const jsonPath = resolve(
    process.cwd(),
    "src/app/hello/projects/projectData.json"
  );
  const projects: LegacyProject[] = JSON.parse(readFileSync(jsonPath, "utf-8"));

  const rows = projects.map((p, index) => ({
    title: p.projectTitle,
    slug: slugify(p.projectTitle),
    short_description: p.shortDescription,
    description: p.description,
    cover_image_url: p.image,
    gallery_images: p.modalImages ?? [],
    background_color: p.backgroundColor,
    live_link: p.links?.live ?? null,
    github_link: p.links?.github ?? null,
    tech_stack: p.techStack ?? [],
    sort_order: index,
  }));

  const { error, count } = await supabase
    .from("projects")
    .upsert(rows, { onConflict: "slug", count: "exact" });

  if (error) throw new Error(`projects upsert failed: ${error.message}`);
  console.log(`Seeded ${count ?? rows.length} project(s).`);
}

async function seedProfile() {
  const bio = {
    intro:
      "I'm an Ecommerce Executive at London Boy, working full-time on the ground in Narayanganj, Dhaka — learning marketing, Facebook Ads, SEO, and market analysis, and noting what to try next as I go. I came into commerce from a Computer Science background: a CSE degree, freelance full-stack work, and a stint leading tech at a startup. That same habit of testing, measuring, and iterating is what I'm now applying to product listings, ad performance, and growth experiments — just with a different toolkit.",
    achievements: [
      {
        title: "Ecommerce Execution — Live",
        description:
          "Full-time on the ground at London Boy since Aug 2026, learning marketing, Facebook Ads, SEO, and market analysis by doing the work.",
        icon: "growth",
      },
      {
        title: "Builder's Track Record",
        description:
          "15+ web and AI projects shipped, plus a Technical Lead role — the habits of testing, measuring, and iterating carry straight into ecommerce.",
        icon: "code",
      },
      {
        title: "Academic Foundation",
        description:
          "CGPA 3.47/4.00, Computer Science & Engineering, North South University.",
        icon: "award",
      },
    ],
    timeline: [
      {
        title: "Ecommerce Executive",
        subtitle: "London Boy · Full-time, On-site",
        period: "Aug 2026 – Present · Narayanganj, Dhaka",
        description: [
          "Learning the fundamentals of ecommerce execution on the job: marketing strategy, Facebook Ads, SEO, and market analysis.",
          "Tracking what's working, documenting next steps, and building toward running campaigns and product positioning independently.",
        ],
      },
      {
        title: "Freelance Full-Stack Developer / AI Engineer",
        subtitle: "Self-Employed",
        period: "Jan 2023 – Aug 2026",
        description: [
          "Delivered end-to-end solutions using React, Next.js, Django, FastAPI, and Node.js.",
          "Built responsive UIs with Tailwind and ShadCN UI, integrating secure authentication, payments, and AI features.",
          "Managed the full lifecycle from database design with Supabase, MySQL, and MongoDB to deployment and maintenance.",
        ],
      },
      {
        title: "Technical Lead",
        subtitle: "EduLens (Beta) · Part-time",
        period: "Nov 2025 – Aug 2026 · Dhaka, Bangladesh · Remote",
        description: [
          "EduLens is a student operating system—a Google Map for students. As part of the startup, I led the technical work from building the system to deploying it live.",
          "Core tools: Python, Next.js, and 6+ additional skills.",
        ],
      },
      {
        title: "Full-Stack AI Engineer",
        subtitle: "Fleek Bangladesh · Intern",
        period: "April 2026 – June 2026",
        description: [
          "Built and scaled projects with AI features such as chatbots, job scraping, and summarization across frontend and backend using Next.js, Python, LangChain, Mistral/Groq APIs, Playwright, Redis, Celery, and Docker.",
          "Implemented ATNLP features, secure authentication, scalable APIs, and optimized MySQL/PostgreSQL databases for production use.",
        ],
      },
      {
        title: "Computer Science & Engineering",
        subtitle: "North South University, Dhaka",
        period: "Graduated · Oct 2021 – Dec 2025",
        description:
          "CGPA: 3.47/4.00 | Bachelor's degree with specialization in Artificial Intelligence, Machine Learning, and Full-Stack Development.",
      },
    ],
  };

  const socials = {
    email: "asifbhuiyanshawon@gmail.com",
    phone: "+88 016-43341281",
    location: "Dhaka, Bangladesh",
    website: "withshawon.vercel.app",
    facebook: "https://www.facebook.com/withshawon",
    instagram: "https://www.instagram.com/withshawon",
    linkedin: "https://www.linkedin.com/in/asif-bhuiyan-shawon/",
    discord: "https://discord.com/users/misir.ali",
  };

  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
    .limit(1)
    .maybeSingle();
  if (fetchError) throw new Error(`profiles lookup failed: ${fetchError.message}`);

  const row = {
    full_name: "Asif Bhuiyan Shawon",
    tagline:
      "Ecommerce Executive | Learning Growth, Ads & SEO | Ex-Software Engineer",
    bio,
    avatar_url: null,
    resume_url: "/Resume_Asif_Bhuiyan.pdf",
    socials,
    updated_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await supabase.from("profiles").update(row).eq("id", existing.id)
    : await supabase.from("profiles").insert(row);

  if (error) throw new Error(`profiles upsert failed: ${error.message}`);
  console.log("Seeded profile.");
}

async function main() {
  await seedProfile();
  await seedProjects();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
