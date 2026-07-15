'use client';

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import { Download, ExternalLink, FileText, Share2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEvent, PointerEvent as ReactPointerEvent, SVGProps } from 'react';

type FloatingActionKind = 'cv' | 'socials';

type FloatingActionProps = {
  kind: FloatingActionKind;
  placement: 'floating' | 'navbar';
};

type DriftAnimation = {
  x: number[];
  y: number[];
  transition: {
    duration: number;
    ease: 'easeInOut';
    repeat: number;
    repeatType: 'mirror';
  };
};

type BrandIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function FacebookIcon({ size = 22, ...props }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.5 8.2V6.8c0-.7.5-1.1 1.2-1.1h1.5V3.1l-2.3-.1c-2.6 0-4.2 1.6-4.2 4.1v1.1H8v2.8h2.7v8.4h3.3V11h2.6l.4-2.8h-3.1Z" />
    </svg>
  );
}

function InstagramIcon({ size = 22, ...props }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ size = 22, ...props }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M5.2 8.2H2.1v10.1h3.1V8.2ZM3.7 3.2C2.7 3.2 2 3.9 2 4.8s.7 1.6 1.7 1.6 1.7-.7 1.7-1.6-.7-1.6-1.7-1.6ZM21.9 12.5c0-3.1-1.7-4.7-4.1-4.7-1.9 0-2.8 1.1-3.3 1.8V8.2h-3.1v10.1h3.1v-5.6c0-1.5.3-2.9 2.1-2.9 1.7 0 1.7 1.7 1.7 3v5.5h3.1l.5-5.8Z" />
    </svg>
  );
}

function DiscordIcon({ size = 22, ...props }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.5 5.1A16.4 16.4 0 0 0 15.6 4l-.5 1a14.8 14.8 0 0 0-6.2 0l-.5-1a16.5 16.5 0 0 0-3.9 1.1C2 8 1.4 12.9 1.7 17.7a15.8 15.8 0 0 0 4.8 2.4l1.2-1.6a9.2 9.2 0 0 1-1.8-.9l.4-.3c3.5 1.6 7.4 1.6 10.8 0l.5.3c-.6.4-1.2.7-1.8.9l1.2 1.6a15.7 15.7 0 0 0 4.8-2.4c.4-5.5-.7-10.3-2.3-12.6ZM8.1 15.3c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7.8 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
    </svg>
  );
}

const socials = [
  {
    name: 'Facebook',
    handle: 'withshawon',
    href: 'https://www.facebook.com/withshawon',
    icon: FacebookIcon,
  },
  {
    name: 'Instagram',
    handle: 'withshawon',
    href: 'https://www.instagram.com/withshawon',
    icon: InstagramIcon,
  },
  {
    name: 'LinkedIn',
    handle: 'asif-bhuiyan-shawon',
    href: 'https://www.linkedin.com/in/asif-bhuiyan-shawon/',
    icon: LinkedinIcon,
  },
  {
    name: 'Discord',
    handle: 'misir.ali',
    href: 'https://discord.com/users/misir.ali',
    icon: DiscordIcon,
  },
];

function createDriftAnimation(kind: FloatingActionKind): DriftAnimation {
  const compact = window.innerWidth < 640;
  const rangeX = compact ? 18 : kind === 'cv' ? 86 : 74;
  const rangeY = compact ? 20 : kind === 'cv' ? 58 : 72;
  const randomOffset = (range: number) => Math.round((Math.random() * 2 - 1) * range);

  return {
    x: [0, randomOffset(rangeX), randomOffset(rangeX), randomOffset(rangeX), 0],
    y: [0, randomOffset(rangeY), randomOffset(rangeY), randomOffset(rangeY), 0],
    transition: {
      duration: 14 + Math.random() * 7,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'mirror',
    },
  };
}

function FloatingAction({ kind, placement }: FloatingActionProps) {
  const controls = useAnimationControls();
  const reducedMotion = useReducedMotion();
  const actionRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<DriftAnimation | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const startDrift = useCallback(() => {
    if (placement === 'navbar' || reducedMotion || typeof window === 'undefined') return;
    driftRef.current ??= createDriftAnimation(kind);
    void controls.start(driftRef.current);
  }, [controls, kind, placement, reducedMotion]);

  useEffect(() => {
    if (placement === 'navbar' || reducedMotion || isOpen || isHovered || isFocused) {
      controls.stop();
    } else {
      startDrift();
    }

    return () => controls.stop();
  }, [controls, isFocused, isHovered, isOpen, placement, reducedMotion, startDrift]);

  useEffect(() => {
    if (!isOpen) return;

    const closeFromOutside = (event: PointerEvent) => {
      if (!actionRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeFromOutside);
    document.addEventListener('keydown', closeWithEscape);
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside);
      document.removeEventListener('keydown', closeWithEscape);
    };
  }, [isOpen]);

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    setIsHovered(true);
    setIsOpen(true);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    setIsHovered(false);
    if (!isFocused) setIsOpen(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setIsFocused(false);
    if (!isHovered) setIsOpen(false);
  };

  return (
    <motion.div
      ref={actionRef}
      animate={controls}
      className={`floating-action floating-action--${kind} floating-action--${placement}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      <motion.div layout className="floating-action__surface">
        <button
          type="button"
          className="floating-action__trigger"
          aria-expanded={isOpen}
          aria-controls={`${kind}-floating-panel`}
          aria-label={kind === 'cv' ? 'Open CV download' : 'Open social links'}
          onClick={() => {
            if (!isHovered && !isFocused) setIsOpen((open) => !open);
          }}
        >
          {kind === 'cv' ? <Download size={21} strokeWidth={1.8} /> : <Share2 size={21} strokeWidth={1.8} />}
        </button>

        <AnimatePresence initial={false}>
          {isOpen && kind === 'cv' && (
            <motion.div
              id="cv-floating-panel"
              key="cv-panel"
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="floating-action__expanded floating-action__expanded--cv"
            >
              <div className="floating-action__eyebrow">
                <FileText size={15} />
                <span>Available to download</span>
              </div>
              <strong>Asif Bhuiyan Shawon CV</strong>
              <a className="floating-action__download" href="/Resume_Asif_Bhuiyan.pdf" download>
                <Download size={16} />
                Download CV
              </a>
            </motion.div>
          )}

          {isOpen && kind === 'socials' && (
            <motion.div
              id="socials-floating-panel"
              key="social-panel"
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="floating-action__expanded floating-action__expanded--socials"
            >
              {socials.map(({ name, handle, href, icon: Icon }) => (
                <a
                  key={name}
                  className="floating-action__social"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${name}: ${handle}`}
                  title={`${name} · ${handle}`}
                >
                  <Icon size={21} />
                  <span>{name}</span>
                  <ExternalLink className="floating-action__external" size={12} />
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function FloatingActions({ placement = 'floating' }: { placement?: 'floating' | 'navbar' }) {
  return (
    <div className={`floating-actions floating-actions--${placement}`} aria-label="Quick links">
      <FloatingAction kind="cv" placement={placement} />
      <FloatingAction kind="socials" placement={placement} />
    </div>
  );
}
