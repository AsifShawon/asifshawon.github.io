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

interface RoadmapTool {
  name: string;
  description: string;
  status: string;
  icon: React.ReactNode;
}

const roadmap: RoadmapTool[] = [
  {
    name: 'GPA Insights',
    description: 'Trend analytics and projections based on current performance.',
    status: 'Planned',
    icon: <BarChart3 size={18} strokeWidth={1.8} aria-hidden="true" />,
  },
  {
    name: 'AI Study Assistant',
    description: 'Context-aware Q&A over your uploaded course notes.',
    status: 'Planned',
    icon: <BrainCircuit size={18} strokeWidth={1.8} aria-hidden="true" />,
  },
  {
    name: 'Grade Sheet Formatter',
    description: 'Convert messy grade sheets into clean, exportable spreadsheets.',
    status: 'Planned',
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
        <p className="type-label text-[#76ABAE]">Tools</p>
        <h1 className="type-h1 gradient-text mt-4">Academic &amp; Productivity Tools</h1>
        <p className="type-body-lg measure mt-5 text-[#93B1A6]">
          Small, AI-assisted utilities I build for myself and share here. One is live today —
          a few more are on the way.
        </p>
      </div>

      {/* ------------------------------------------------------- primary tool */}
      <section className="mt-12 lg:mt-16" aria-labelledby="primary-tool-heading">
        <div className="rounded-[1.25rem] border border-[rgba(154,210,210,0.28)] bg-[rgba(118,171,174,0.06)] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[0.85rem] border border-[rgba(154,210,210,0.32)] bg-[rgba(118,171,174,0.12)] text-[#A8DDDA]">
              <Calculator size={26} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 id="primary-tool-heading" className="type-h3 text-[#EEEEEE]">
                  AI CGPA Calculator
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(154,210,210,0.35)] bg-[rgba(118,171,174,0.14)] px-2.5 py-0.5 type-meta !text-[#A8DDDA]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#76ABAE]" aria-hidden="true" />
                  Live
                </span>
              </div>
              <p className="type-body measure mt-2.5 text-[#93B1A6]">
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.6rem] border border-[var(--site-border)] bg-[rgba(118,171,174,0.05)] text-[#93B1A6]">
                {tool.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="type-small font-medium text-[#EEEEEE]">{tool.name}</p>
                  <span className="type-meta">{tool.status}</span>
                </div>
                <p className="type-small mt-1 text-[var(--site-text-muted)]">{tool.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="type-small mt-14 text-[var(--site-text-muted)]">
        Have a tool you wish existed?{' '}
        <Link href="/contact" className="text-[#A8DDDA] underline underline-offset-4">
          Get in touch
        </Link>
        .
      </p>
    </Container>
  );
}
