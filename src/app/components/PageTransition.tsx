'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  // Framer's JS-driven animations aren't covered by the CSS reduced-motion
  // rules, so opt out explicitly.
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}