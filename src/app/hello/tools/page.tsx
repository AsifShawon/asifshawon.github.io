import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, BrainCircuit, Calculator, FileSpreadsheet } from 'lucide-react';

import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import CustomBreadcrumb from '@/app/comps/breadCrumb';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Tools',
  description:
    'AI CGPA Calculator and other small AI-assisted productivity tools, built and shared by Asif Bhuiyan Shawon.',
  path: '/hello/tools',
});

type ToolStatus = 'Available' | 'New' | 'Coming Soon';

/** Ledger Green / Indigo / muted Mist — one consistent status vocabulary for
 *  every tool card, reused as-is if a future tool ships as "New". */
function StatusBadge({ status }: { status: ToolStatus }) {
  const modifier = status.toLowerCase().replace(' ', '-');
  return (
    <span className={`tool-status tool-status--${modifier}`}>
      <span className="tool-status__dot" aria-hidden="true" />
      {status}
    </span>
  );
}

interface RoadmapTool {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const roadmap: RoadmapTool[] = [
  {
    name: 'GPA Insights',
    description: 'Trend analytics and projections based on current performance.',
    icon: <BarChart3 size={18} strokeWidth={1.8} aria-hidden="true" />,
  },
  {
    name: 'AI Study Assistant',
    description: 'Context-aware Q&A over your uploaded course notes.',
    icon: <BrainCircuit size={18} strokeWidth={1.8} aria-hidden="true" />,
  },
  {
    name: 'Grade Sheet Formatter',
    description: 'Convert messy grade sheets into clean, exportable spreadsheets.',
    icon: <FileSpreadsheet size={18} strokeWidth={1.8} aria-hidden="true" />,
  },
];

export default function ToolsLandingPage() {
  return (
    <Container className="pb-24 pt-8 sm:pt-10">
      <div className="font-mono opacity-70">
        <CustomBreadcrumb
          pageNames={[
            { name: 'Home', href: '/' },
            { name: 'Tools', href: '/hello/tools' },
          ]}
        />
      </div>

      <div className="mt-12 max-w-2xl lg:mt-16">
        <p className="type-label text-[var(--ml-green)]">Tools</p>
        <h1 className="type-h1 mt-4 text-[var(--ml-ink)]">Academic &amp; Productivity Tools</h1>
        <p className="type-body-lg measure mt-5 text-[var(--site-text-muted)]">
          Small, AI-assisted utilities I build for myself and share here. One is live today —
          a few more are on the way.
        </p>
      </div>

      {/* ------------------------------------------------------- primary tool */}
      <section className="mt-12 lg:mt-16" aria-labelledby="primary-tool-heading">
        <div className="tool-card tool-card--primary">
          <div className="flex items-start gap-4">
            <div className="tool-card__icon">
              <Calculator size={26} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 id="primary-tool-heading" className="type-h3 text-[var(--ml-ink)]">
                  AI CGPA Calculator
                </h2>
                <StatusBadge status="Available" />
              </div>
              <p className="type-body measure mt-2.5 text-[var(--site-text-muted)]">
                Upload a transcript or grade sheet — image or PDF — and let AI extract the
                courses and compute your CGPA instantly.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button asChild variant="brand" size="cta">
              <Link href="/hello/tools/calculate-cgpa">
                Open Tool
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- coming next */}
      <section className="mt-14 lg:mt-16" aria-labelledby="coming-next-heading">
        <h2 id="coming-next-heading" className="type-label text-[var(--site-text-muted)]">
          Coming Next
        </h2>

        <ul className="mt-5 flex flex-col divide-y divide-[var(--site-border)] border-y border-[var(--site-border)]">
          {roadmap.map((tool) => (
            <li key={tool.name} className="flex items-start gap-4 py-4">
              <div className="tool-card__icon tool-card__icon--muted">{tool.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="type-small font-medium text-[var(--ml-ink)]">{tool.name}</p>
                  <StatusBadge status="Coming Soon" />
                </div>
                <p className="type-small mt-1 text-[var(--site-text-muted)]">{tool.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="type-small mt-14 text-[var(--site-text-muted)]">
        Have a tool you wish existed?{' '}
        <Link href="/contact" className="text-[var(--ml-green)] underline underline-offset-4">
          Get in touch
        </Link>
        .
      </p>
    </Container>
  );
}
