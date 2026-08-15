'use client';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Menu from '../comps/menu';
import FloatingActions from './FloatingActions';
import RoleRotator from './RoleRotator';
import { PROFILE_DESCRIPTION } from '@/lib/site';

export default function EnhancedHome({
  fullName,
}: {
  fullName?: string | null;
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
    <>
      <motion.div
        className="site-container relative z-10 flex flex-col gap-6 sm:gap-7"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.45 }}
      >
        <motion.h1 className="type-display leading-[1.05]" {...rise(0.05)}>
          {fullName || 'Asif Bhuiyan Shawon'}
        </motion.h1>

        <motion.div {...rise(0.15)} className="flex flex-col gap-3">
          <RoleRotator />
          <p className="type-body-lg measure text-[var(--site-text-muted)]">
            {PROFILE_DESCRIPTION}
          </p>
          <p className="font-mono text-[0.8125rem] uppercase tracking-[0.08em] text-[var(--site-text-muted)]">
            Narayanganj, Bangladesh
          </p>
        </motion.div>

        <motion.nav aria-label="Primary" {...rise(0.25)} className="pt-1 sm:pt-2">
          <Menu variant="hero" />
        </motion.nav>
      </motion.div>

      <FloatingActions />
    </>
  );
}
