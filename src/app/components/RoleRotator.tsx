'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const ROLES = [
  'Ecommerce Executive',
  'Full-Stack Developer',
  'AI Engineer',
] as const;

const DISPLAY_DURATION_MS = 2900;

export default function RoleRotator() {
  const [index, setIndex] = useState(0);
  const [tabHidden, setTabHidden] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || tabHidden) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % ROLES.length);
    }, DISPLAY_DURATION_MS);

    return () => clearInterval(interval);
  }, [reduceMotion, tabHidden]);

  const currentRole = ROLES[index];

  return (
    <div className="font-mono text-[0.875rem] font-medium uppercase tracking-[0.06em] text-[var(--ml-green)] sm:text-[1.0625rem] md:text-[1.1875rem] lg:text-[1.25rem]">
      {/* Screen-reader accessible static description of all three roles */}
      <span className="sr-only">
        Ecommerce Executive, Full-Stack Developer, and AI Engineer
      </span>

      {reduceMotion ? (
        <span aria-hidden="true">
          {ROLES.join(' · ')}
        </span>
      ) : (
        <div aria-hidden="true" className="relative inline-grid grid-cols-1 grid-rows-1 overflow-hidden align-baseline">
          {/* Invisible anchor element reserving the longest role width & height to prevent any layout shift */}
          <span className="invisible pointer-events-none select-none col-start-1 row-start-1">
            FULL-STACK DEVELOPER
          </span>

          {/* Animated role flip */}
          <div className="col-start-1 row-start-1 flex items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={currentRole}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
                className="inline-block whitespace-nowrap"
              >
                {currentRole}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
