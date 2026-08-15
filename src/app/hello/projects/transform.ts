import type { ProjectRow } from "@/lib/supabase/types";

/**
 * The one typed shape every project surface (listing cards, rail, detail
 * page, sidebar, next-project panel) reads from. Assembled in
 * `toProjectCaseStudy` from three inputs:
 *
 *   1. The `projects` table row — title, links, images, tech stack, etc.
 *   2. Small derived facts computed from that row (category/summary parsed
 *      from `short_description`, `status` from whether `live_link` exists).
 *   3. `PROJECT_YEAR` / `PROJECT_ROLE` / `PROJECT_CONTENT` below — hand-
 *      verified supplementary facts with no column of their own yet (see
 *      each map's comment for exactly where the value came from).
 *
 * Fields with no verified source are `null`/empty rather than guessed, so
 * the detail page can hide those sections instead of inventing content.
 */

export interface ProjectGalleryImage {
  src: string;
  /** Only set once a real caption exists somewhere — none do today. */
  caption?: string;
}

export interface ProjectCaseStudy {
  id: string;
  slug: string;
  /** 1-based position in the published list (stable via `sort_order`). */
  number: number;
  projectTitle: string;
  category: string;
  year: number | null;
  status: "Live" | "Completed" | null;
  role: string | null;
  duration: string | null;
  shortDescription: string;
  image: string;
  gallery: ProjectGalleryImage[];
  techStack: string[];
  links: { github?: string; live?: string };
  overview: string | null;
  problem: string | null;
  contribution: string | null;
  features: string[] | null;
  technicalDecisions: string[] | null;
  outcome: string[] | null;
  lessonsLearned: string | null;
  featured: boolean;
  isAiRelated: boolean;
}

/** Matches the "**Category:**" prefix every `short_description` in the
 *  `projects` table currently starts with, e.g. "**AI/ML Project:** …". */
const CATEGORY_PREFIX = /^\*\*(.+?):\*\*\s*/;

function parseShortDescription(raw: string): { category: string; summary: string } {
  const match = raw.match(CATEGORY_PREFIX);
  if (!match) return { category: "Project", summary: raw };
  return { category: match[1], summary: raw.slice(match[0].length) };
}

function isAiRelated(category: string): boolean {
  return /\bai\b|machine learning/i.test(category);
}

/** A working `live_link` is a directly verifiable fact; its absence with a
 *  real repo still on file just means the build is finished, not live. */
function statusFor(row: ProjectRow): "Live" | "Completed" | null {
  if (row.live_link) return "Live";
  if (row.github_link) return "Completed";
  return null;
}

function fallbackSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Project start year. The `projects` table has no date column, so this is
 * sourced from each repository's real GitHub `created_at` (fetched from the
 * public GitHub API against the `github_link` on each row) — not invented.
 * Keyed by slug so it stays correct if `sort_order` ever changes.
 */
const PROJECT_YEAR: Record<string, number> = {
  "dhakaiaa-jamdani-e-commerce": 2024,
  "ai-powered-physics-chatbot": 2025,
  "stock-price-prediction-system": 2024,
  "hospital-management-system": 2025,
  "cgpa-calculator": 2024,
};

/**
 * "Solo Developer" is only set where GitHub's contributors API for that
 * repo confirmed exactly one human contributor (bot commits from
 * dependabot/vercel excluded). `cgpa-calculator`'s repo is deliberately
 * absent here — the contributors endpoint was rate-limited when checked and
 * never returned a verifiable answer, so its Role fact is hidden rather
 * than assumed.
 */
const PROJECT_ROLE: Record<string, string> = {
  "dhakaiaa-jamdani-e-commerce": "Solo Developer",
  "ai-powered-physics-chatbot": "Solo Developer",
  "stock-price-prediction-system": "Solo Developer",
  "hospital-management-system": "Solo Developer",
};

interface ProjectContent {
  overview: string;
  features: string[];
  technicalDecisions: string[];
  outcome?: string[];
}

/**
 * Overview/Features/Technical decisions/Outcome, hand-transcribed verbatim
 * from each project's existing `description` markdown in the `projects`
 * table — reorganized under the case-study section names, not rewritten.
 * `outcome` is only present for the two projects whose description already
 * had a results/value section ("Key Achievements", "Educational Value");
 * the other three have no comparable content, so their Outcome section is
 * omitted rather than filled with a guess. There is no "problem",
 * "contribution" or "lessons learned" text anywhere in the source content,
 * so those fields are left unset for every project.
 */
const PROJECT_CONTENT: Record<string, ProjectContent> = {
  "dhakaiaa-jamdani-e-commerce": {
    overview:
      "A comprehensive e-commerce solution built with Next.js and modern web technologies. This platform showcases traditional Dhakaiaa Jamdani products with a seamless shopping experience.",
    features: [
      "**Modern UI/UX**: Clean, responsive design with Tailwind CSS and DaisyUI",
      "**Advanced Product Catalog**: Filtering, sorting, and search functionality",
      "**Secure Authentication**: User registration, login, and profile management",
      "**Shopping Cart & Checkout**: Full e-commerce functionality with order tracking",
      "**Admin Dashboard**: Complete product and order management system",
      "**Email Integration**: Automated order confirmations and notifications",
      "**Database Management**: PostgreSQL with Supabase for real-time data",
      "**Payment Integration**: Secure payment processing",
      "**Responsive Design**: Mobile-first approach for all devices",
    ],
    technicalDecisions: [
      "**Frontend**: Next.js 14 with TypeScript for type safety",
      "**State Management**: Redux Toolkit for efficient state handling",
      "**Backend**: Supabase for database, authentication, and storage",
      "**Styling**: Tailwind CSS with DaisyUI components",
      "**Email Services**: Resend and Nodemailer for transactional emails",
      "**Deployment**: Vercel with optimized performance",
    ],
  },
  "ai-powered-physics-chatbot": {
    overview:
      "An advanced chatbot application designed to help students with physics concepts using Retrieval-Augmented Generation (RAG) and Google's Gemini API.",
    features: [
      "**Intelligent Q&A**: Natural language processing for physics queries",
      "**RAG Architecture**: Combines retrieval and generation for accurate responses",
      "**Context-Aware**: Maintains conversation context for better understanding",
      "**Educational Focus**: Specialized knowledge base for physics concepts",
      "**Real-time Responses**: Fast and accurate answer generation",
      "**User-Friendly Interface**: Clean and intuitive chat interface",
    ],
    // "Technical Stack" and "Innovation" from the source description are
    // both about how the assistant was built, so they're combined here.
    technicalDecisions: [
      "**Backend Framework**: Flask for lightweight and efficient API",
      "**AI/ML Stack**: LangChain for workflow orchestration",
      "**Language Model**: Google Gemini API for advanced reasoning",
      "**Vector Database**: Efficient similarity search for relevant content",
      "**NLP Pipeline**: Advanced text processing and understanding",
      "**Deployment**: Scalable cloud infrastructure",
      "Custom-trained knowledge base specifically for physics education",
      "Advanced prompt engineering for educational contexts",
      "Efficient retrieval mechanisms for fast response times",
      "Continuous learning capabilities for improved accuracy",
    ],
  },
  "stock-price-prediction-system": {
    overview:
      "A sophisticated machine learning system for predicting stock prices using advanced algorithms and technical analysis indicators.",
    features: [
      "**Multiple ML Models**: LSTM, GRU, and traditional algorithms",
      "**Technical Indicators**: RSI, MACD, Moving Averages, Bollinger Bands",
      "**Data Processing**: Real-time data fetching and preprocessing",
      "**Visualization**: Interactive charts and performance metrics",
      "**Backtesting**: Historical performance validation",
      "**Risk Assessment**: Volatility and risk metrics calculation",
    ],
    technicalDecisions: [
      "**Deep Learning Models**: LSTM and GRU for time series prediction",
      "**Feature Engineering**: Technical indicators and market sentiment",
      "**Data Sources**: Multiple financial APIs for comprehensive data",
      "**Performance Metrics**: Accuracy, MSE, MAE, and Sharpe ratio",
      "**Visualization**: Matplotlib and Plotly for data representation",
      "**Model Optimization**: Hyperparameter tuning and cross-validation",
    ],
    outcome: [
      "Achieved high prediction accuracy on multiple stock indices",
      "Implemented advanced feature engineering techniques",
      "Developed comprehensive backtesting framework",
      "Created intuitive visualization dashboard",
    ],
  },
  "hospital-management-system": {
    overview:
      "A complete hospital management solution built with Django framework, featuring comprehensive patient care and administrative functionalities.",
    features: [
      "**Patient Management**: Registration, medical records, and history tracking",
      "**Appointment System**: Scheduling, reminders, and calendar integration",
      "**Staff Management**: Doctor and nurse profiles, schedules, and assignments",
      "**Medical Records**: Secure storage and retrieval of patient data",
      "**Billing System**: Invoice generation and payment tracking",
      "**Pharmacy Integration**: Medication management and inventory",
      "**Reports & Analytics**: Healthcare statistics and performance metrics",
    ],
    // "Technical Features" and "System Architecture" from the source
    // description are both implementation detail, so they're combined here.
    technicalDecisions: [
      "**Security**: Role-based access control and data encryption",
      "**Database Design**: Normalized PostgreSQL schema",
      "**API Integration**: RESTful APIs for external system connectivity",
      "**Responsive Design**: Mobile-friendly interface",
      "**Backup System**: Automated data backup and recovery",
      "**Audit Trail**: Complete activity logging for compliance",
      "**Backend**: Django with robust ORM and security features",
      "**Database**: PostgreSQL for production, SQLite for development",
      "**Frontend**: Bootstrap-based responsive UI",
      "**Authentication**: Django's built-in security with custom extensions",
      "**Deployment**: Docker containerization for scalability",
    ],
  },
  "cgpa-calculator": {
    overview:
      "A user-friendly web application for calculating Cumulative Grade Point Average (CGPA) with advanced features for academic planning.",
    features: [
      "**Grade Calculation**: Accurate CGPA and GPA calculations",
      "**Course Management**: Add, edit, and delete course entries",
      "**Credit Hours**: Support for variable credit hour courses",
      "**Data Persistence**: Local storage for saving calculations",
      "**Academic Planning**: What-if scenarios for grade improvement",
      "**Export Options**: PDF and Excel export functionality",
      "**Responsive Design**: Works seamlessly on all devices",
    ],
    technicalDecisions: [
      "**Frontend Framework**: React with modern hooks and state management",
      "**Data Storage**: Browser local storage for persistence",
      "**Calculations**: Accurate weighted average algorithms",
      "**UI/UX**: Clean, intuitive interface with real-time updates",
      "**Validation**: Input validation and error handling",
      "**Performance**: Optimized rendering and smooth interactions",
    ],
    outcome: [
      "Helps students track academic progress",
      "Enables grade planning and goal setting",
      "Provides insights into academic performance trends",
      "Supports different grading systems and scales",
    ],
  },
};

export function toProjectCaseStudy(row: ProjectRow, index: number): ProjectCaseStudy {
  const slug = row.slug || fallbackSlug(row.title);
  const { category, summary } = parseShortDescription(row.short_description ?? "");
  const content = PROJECT_CONTENT[slug];
  const gallery = (row.gallery_images ?? [])
    .filter((src) => src && src !== row.cover_image_url)
    .map((src): ProjectGalleryImage => ({ src }));

  return {
    id: row.id,
    slug,
    number: index + 1,
    projectTitle: row.title,
    category,
    year: PROJECT_YEAR[slug] ?? null,
    status: statusFor(row),
    role: PROJECT_ROLE[slug] ?? null,
    duration: null,
    shortDescription: summary,
    image: row.cover_image_url ?? "",
    gallery,
    techStack: row.tech_stack ?? [],
    links: {
      github: row.github_link ?? undefined,
      live: row.live_link ?? undefined,
    },
    overview: content?.overview ?? null,
    problem: null,
    contribution: null,
    features: content?.features ?? null,
    technicalDecisions: content?.technicalDecisions ?? null,
    outcome: content?.outcome ?? null,
    lessonsLearned: null,
    featured: category === "Featured Project",
    isAiRelated: isAiRelated(category),
  };
}
