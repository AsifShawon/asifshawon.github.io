'use client';
import React, { useEffect, useRef, useState } from 'react';

/**
 * The portfolio's custom cursor.
 *
 * Only runs on devices with a fine pointer and where motion is allowed — on
 * touch screens or under `prefers-reduced-motion` it renders nothing and the
 * native cursor is left alone (see `.has-custom-cursor` in globals.css).
 */
export default function MotionCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const cursorPositionRef = useRef({ x: 0, y: 0 });

  // ------------------------------------------------------------- capability
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => setEnabled(finePointer.matches && !reduceMotion.matches);
    sync();

    finePointer.addEventListener('change', sync);
    reduceMotion.addEventListener('change', sync);
    return () => {
      finePointer.removeEventListener('change', sync);
      reduceMotion.removeEventListener('change', sync);
    };
  }, []);

  // `cursor: none` is scoped to this class, so the native cursor comes back
  // the moment the custom one is not rendering.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-custom-cursor');
    return () => document.documentElement.classList.remove('has-custom-cursor');
  }, [enabled]);

  // ------------------------------------------------------------- listeners
  useEffect(() => {
    if (!enabled) return;

    const updateMousePosition = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // The dot tracks the pointer exactly; the ring eases behind it.
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 17}px, ${e.clientY - 17}px)`;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Delegated, so links and buttons rendered *after* mount (modals, the
    // mega-menu, route changes) are covered without re-scanning the DOM.
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('a, button, [role="button"], .cursor-hover')) {
        setCursorVariant('hover');
      }
    };
    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('a, button, [role="button"], .cursor-hover')) {
        setCursorVariant('default');
      }
    };

    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleOver, { passive: true });
    document.addEventListener('mouseout', handleOut, { passive: true });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [enabled]);

  // ------------------------------------------------------------ rAF easing
  useEffect(() => {
    if (!enabled) return;
    let animationId: number;

    const animate = () => {
      if (cursorRef.current) {
        const mouse = mousePositionRef.current;
        const current = cursorPositionRef.current;

        const easing = 0.25;
        const newX = current.x + (mouse.x - current.x) * easing;
        const newY = current.y + (mouse.y - current.y) * easing;

        cursorPositionRef.current = { x: newX, y: newY };
        cursorRef.current.style.transform = `translate(${newX - 32}px, ${newY - 32}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor-none" aria-hidden="true">
      {/* Custom Cursor Ring */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-50 transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '64px',
          height: '64px',
          willChange: 'transform',
        }}
      >
        <div
          className={`w-full h-full rounded-full border-2 transition-all duration-300 ease-out ${
            cursorVariant === 'hover'
              ? 'scale-125 bg-white/10 backdrop-blur-sm border-white/80'
              : 'scale-100 bg-transparent border-white/60'
          }`}
          style={{
            mixBlendMode: 'difference',
          }}
        />
      </div>

      {/* Cursor Dot - Super Responsive */}
      <div
        ref={cursorDotRef}
        className={`fixed pointer-events-none z-50 rounded-full bg-white transition-opacity duration-150 ease-out ${
          isVisible && cursorVariant !== 'hover' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: cursorVariant === 'hover' ? '48px' : '34px',
          height: cursorVariant === 'hover' ? '48px' : '34px',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
    </div>
  );
}
