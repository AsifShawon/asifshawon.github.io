// @ts-nocheck
"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calculator, BrainCircuit, ArrowRight, BarChart3, FileSpreadsheet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ToolDef {
  slug: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  soon?: boolean;
}

const tools: ToolDef[] = [
  {
    slug: 'calculate-cgpa',
    name: 'AI CGPA Calculator',
    description: 'Upload your transcript / grade sheet image or PDF and let AI extract courses & compute CGPA instantly.',
    icon: <Calculator className="h-10 w-10 text-emerald-500" />,
    badge: 'New'
  },
  {
    slug: 'gpa-insights',
    name: 'GPA Insights (Coming Soon)',
    description: 'Trend analytics & projections based on current performance.',
    icon: <BarChart3 className="h-10 w-10 text-indigo-500" />,
    soon: true
  },
  {
    slug: 'ai-study-assistant',
    name: 'AI Study Assistant (Soon)',
    description: 'Context-aware Q&A over your uploaded course notes.',
    icon: <BrainCircuit className="h-10 w-10 text-fuchsia-500" />,
    soon: true
  },
  {
    slug: 'grade-sheet-formatter',
    name: 'Grade Sheet Formatter (Soon)',
    description: 'Convert messy PDFs into clean, exportable spreadsheets.',
    icon: <FileSpreadsheet className="h-10 w-10 text-cyan-500" />,
    soon: true
  }
];

export default function ToolsLandingPage() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium tracking-wide backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Tools Hub
          </div>
          <h1 className="mt-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Academic & Productivity Tools
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            A growing collection of AI‑assisted utilities to boost your workflow. Start with the CGPA calculator—more smart tools are on the way.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tools.map((tool, idx) => (
            <motion.div
              key={tool.slug}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <Card className="group relative h-full border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm transition-colors hover:border-emerald-400/40">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 backdrop-blur group-hover:ring-emerald-400/40">
                      {tool.icon}
                    </div>
                    {tool.badge && (
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                        {tool.badge}
                      </span>
                    )}
                    {tool.soon && (
                      <span className="rounded-full bg-gray-500/15 px-3 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-400/30">
                        Soon
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    {tool.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-gray-400">
                    {tool.description}
                  </CardDescription>
                  <div className="pt-2">
                    {tool.soon ? (
                      <Button variant="outline" disabled className="pointer-events-none w-full justify-between border-white/10 bg-white/5 text-gray-400">
                        Coming Soon
                      </Button>
                    ) : (
                      <Button asChild className="w-full justify-between bg-emerald-600/90 hover:bg-emerald-600">
                        <Link href={`/hello/tools/${tool.slug}`}>
                          Open <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-1 ring-emerald-400/0 transition-all duration-500 group-hover:opacity-100 group-hover:ring-emerald-400/40" />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mx-auto mt-20 max-w-3xl text-center text-sm text-gray-500">
          More ideas? Have a tool you wish existed? <span className="text-gray-300">Reach out & contribute.</span>
        </div>
      </div>
    </div>
  );
}
