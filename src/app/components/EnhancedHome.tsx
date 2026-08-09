'use client';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import TypingEffect from '../comps/textTyping';
import Menu from '../comps/menu';
import FloatingActions from './FloatingActions';

export default function EnhancedHome({ fullName }: { fullName?: string | null }) {
  // Framer's JS animations aren't covered by the CSS reduced-motion rules.
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: 'easeOut' as const },
        };

  return (
    <motion.div
      className="site-container relative z-10 flex flex-col gap-6 sm:gap-8"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.6 }}
    >
      <motion.h1 className="type-display gradient-text" {...rise(0.1)}>
        {fullName || 'Asif Bhuiyan Shawon'}
      </motion.h1>

      <motion.div {...rise(0.25)}>
        <TypingEffect />
      </motion.div>

      <motion.nav aria-label="Primary" {...rise(0.4)}>
        <Menu variant="hero" />
      </motion.nav>

      <FloatingActions />
    </motion.div>
  );
}
