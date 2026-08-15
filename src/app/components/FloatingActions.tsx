'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Download, ExternalLink, FileText, Github, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FocusEvent, PointerEvent as ReactPointerEvent, SVGProps } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ProfileSocials } from '@/lib/supabase/types';

type FloatingActionKind = 'cv' | 'socials';

type FloatingActionProps = {
  kind: FloatingActionKind;
  placement: 'floating' | 'navbar';
  resumeUrl: string;
  socialsList: SocialLink[];
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

function GithubIcon({ size = 22, ...props }: BrandIconProps) {
  return <Github width={size} height={size} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

type SocialLink = {
  name: string;
  handle: string;
  href: string;
  icon: (props: BrandIconProps) => React.JSX.Element;
};

const DEFAULT_RESUME_URL = '/Resume_Asif_Bhuiyan.pdf';

// LinkedIn and GitHub lead — the two most relevant to what this site is for.
// The rest are still one click away, just not first.
const DEFAULT_SOCIALS: SocialLink[] = [
  {
    name: 'LinkedIn',
    handle: 'asif-bhuiyan-shawon',
    href: 'https://www.linkedin.com/in/asif-bhuiyan-shawon/',
    icon: LinkedinIcon,
  },
  {
    name: 'GitHub',
    handle: 'AsifShawon',
    href: 'https://github.com/AsifShawon',
    icon: GithubIcon,
  },
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
    name: 'Discord',
    handle: 'misir.ali',
    href: 'https://discord.com/users/misir.ali',
    icon: DiscordIcon,
  },
];

function handleFromUrl(url: string, fallback: string): string {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, '');
    const last = path.split('/').filter(Boolean).pop();
    return last || fallback;
  } catch {
    return fallback;
  }
}

function socialsFromProfile(socials: ProfileSocials): SocialLink[] {
  const platforms: { key: keyof ProfileSocials; name: string; icon: SocialLink['icon']; fallbackHandle: string }[] = [
    { key: 'linkedin', name: 'LinkedIn', icon: LinkedinIcon, fallbackHandle: 'asif-bhuiyan-shawon' },
    { key: 'github', name: 'GitHub', icon: GithubIcon, fallbackHandle: 'AsifShawon' },
    { key: 'facebook', name: 'Facebook', icon: FacebookIcon, fallbackHandle: 'withshawon' },
    { key: 'instagram', name: 'Instagram', icon: InstagramIcon, fallbackHandle: 'withshawon' },
    { key: 'discord', name: 'Discord', icon: DiscordIcon, fallbackHandle: 'misir.ali' },
  ];

  return platforms
    .filter((p) => socials[p.key])
    .map((p) => ({
      name: p.name,
      href: socials[p.key] as string,
      handle: handleFromUrl(socials[p.key] as string, p.fallbackHandle),
      icon: p.icon,
    }));
}

function useProfileQuickLinks() {
  const [resumeUrl, setResumeUrl] = useState(DEFAULT_RESUME_URL);
  const [socialsList, setSocialsList] = useState<SocialLink[]>(DEFAULT_SOCIALS);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from('profiles')
      .select('resume_url, socials')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        if (data.resume_url) setResumeUrl(data.resume_url);
        if (data.socials) {
          const mapped = socialsFromProfile(data.socials as ProfileSocials);
          if (mapped.length > 0) setSocialsList(mapped);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { resumeUrl, socialsList };
}

function FloatingAction({ kind, placement, resumeUrl, socialsList }: FloatingActionProps) {
  const actionRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
    <div
      ref={actionRef}
      className={`floating-action floating-action--${kind} floating-action--${placement}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      <div className="floating-action__surface">
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
              <a className="floating-action__download" href={resumeUrl} download>
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
              {socialsList.map(({ name, handle, href, icon: Icon }) => (
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
      </div>
    </div>
  );
}

export default function FloatingActions({ placement = 'floating' }: { placement?: 'floating' | 'navbar' }) {
  const { resumeUrl, socialsList } = useProfileQuickLinks();

  return (
    <div className={`floating-actions floating-actions--${placement}`} aria-label="Quick links">
      <FloatingAction kind="cv" placement={placement} resumeUrl={resumeUrl} socialsList={socialsList} />
      <FloatingAction kind="socials" placement={placement} resumeUrl={resumeUrl} socialsList={socialsList} />
    </div>
  );
}
