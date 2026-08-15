'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Menu from '../comps/menu';
import FloatingActions from './FloatingActions';
import ProjectCard from '../hello/projects/ProjectCard';
import type { ProjectCaseStudy } from '../hello/projects/transform';
import { JOB_TITLE, PROFILE_DESCRIPTION } from '@/lib/site';

export default function EnhancedHome({
  fullName,
  featuredProject,
}: {
  fullName?: string | null;
  featuredProject?: ProjectCaseStudy | null;
}) {
  // Framer's JS animations aren't covered by the CSS reduced-motion rules.
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: 'easeOut' as const },
        };

  return (
    <motion.div
      className="site-container relative z-10 flex flex-col gap-6 sm:gap-8"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
    >
      <motion.h1 className="type-display" {...rise(0.05)}>
        {fullName || 'Asif Bhuiyan Shawon'}
      </motion.h1>

      {/* Static — the professional identity must be legible immediately, not
          gated behind a typing animation. */}
      <motion.div {...rise(0.15)} className="flex flex-col gap-2.5">
        <p className="type-body font-mono font-medium uppercase tracking-[0.06em] text-[var(--ml-green)]">
          {JOB_TITLE}
        </p>
        <p className="type-body-lg measure text-[var(--site-text-muted)]">
          {PROFILE_DESCRIPTION}
        </p>
        <p className="font-mono text-[0.8125rem] uppercase tracking-[0.08em] text-[var(--site-text-muted)]">
          Dhaka, Bangladesh
        </p>
      </motion.div>

      <motion.nav aria-label="Primary" {...rise(0.25)}>
        <Menu variant="hero" />
      </motion.nav>

      {featuredProject && (
        <motion.section {...rise(0.35)} aria-labelledby="home-featured-heading" className="mt-4">
          <p
            id="home-featured-heading"
            className="type-label text-[var(--ml-green)]"
          >
            Featured work
          </p>

          <div className="mt-4 max-w-sm">
            <ProjectCard project={featuredProject} />
          </div>

          <Link
            href="/hello/projects"
            className="type-small mt-4 inline-flex items-center gap-1.5 text-[var(--site-text-muted)] transition-colors duration-200 hover:text-[var(--ml-green)]"
          >
            View all projects
            <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
          </Link>
        </motion.section>
      )}

      <FloatingActions />
    </motion.div>
  );
}
