import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';

import Container from '@/components/ui/container';
import CustomBreadcrumb from '@/app/comps/breadCrumb';
import { absoluteUrl, CONTACT_EMAIL, pageMetadata, SITE_NAME } from '@/lib/site';

import ContactForm from './ContactForm';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Get in touch with Asif Bhuiyan Shawon about ecommerce work, full-stack development, AI integrations, freelance projects and collaborations.',
  path: '/contact',
});

/** Only profiles that already exist in the repository. */
const SOCIALS = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/asif-bhuiyan-shawon/' },
  { name: 'GitHub', href: 'https://github.com/AsifShawon' },
  { name: 'Facebook', href: 'https://www.facebook.com/withshawon' },
  { name: 'Instagram', href: 'https://www.instagram.com/withshawon' },
];

const TOPICS = [
  'Ecommerce opportunities',
  'Full-stack development',
  'AI integrations & features',
  'Freelance work',
  'Collaborations',
  'Professional opportunities',
];

const contactLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': absoluteUrl('/contact#contactpage'),
  url: absoluteUrl('/contact'),
  name: `Contact ${SITE_NAME}`,
  mainEntity: {
    '@type': 'Person',
    '@id': absoluteUrl('/#person'),
    name: SITE_NAME,
    email: `mailto:${CONTACT_EMAIL}`,
  },
};

function SocialLink({ name, href }: { name: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-[0.65rem] border border-[rgba(147,177,166,0.2)] bg-[rgba(118,171,174,0.05)] px-3.5 text-[0.875rem] text-[#C3D6D2] transition-colors duration-200 hover:border-[rgba(154,210,210,0.5)] hover:bg-[rgba(118,171,174,0.14)] hover:text-white"
    >
      {name}
      <ArrowUpRight size={14} strokeWidth={1.9} aria-hidden="true" />
    </a>
  );
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />

      <Container className="pb-24 pt-8 sm:pt-10">
        <div className="font-mono opacity-70">
          <CustomBreadcrumb
            pageNames={[
              { name: 'Home', href: '/' },
              { name: 'Contact', href: '/contact' },
            ]}
          />
        </div>

        {/* min-w-0 on the columns: without it the grid track is sized to the
            form's min-content, and the Turnstile widget's fixed 300px pushes
            the whole page into horizontal overflow at 320px. */}
        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
          {/* ----------------------------------------------------- intro */}
          <section className="min-w-0" aria-labelledby="contact-heading">
            <p className="type-label text-[#76ABAE]">Contact</p>

            <h1 id="contact-heading" className="type-h1 gradient-text mt-4">
              Let&apos;s Work Together
            </h1>

            <p className="type-body-lg measure mt-5 text-[#93B1A6]">
              I work across ecommerce, full-stack development and AI — building
              stores that convert, web applications that hold up, and AI features
              that do something useful. If any of that overlaps with what you need,
              I&apos;d like to hear about it.
            </p>

            <ul className="mt-8 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {TOPICS.map((topic) => (
                <li key={topic} className="type-small flex items-start gap-2.5 text-[#B0C6C0]">
                  <span
                    className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-[#76ABAE]"
                    aria-hidden="true"
                  />
                  {topic}
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-[rgba(147,177,166,0.16)] pt-8">
              <p className="type-label text-[var(--site-text-muted)]">Email</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2.5 inline-flex items-center gap-2.5 text-[1.0625rem] text-[#EEEEEE] underline decoration-[rgba(154,210,210,0.35)] underline-offset-[6px] transition-colors duration-200 hover:decoration-[#A8DDDA] sm:text-[1.125rem]"
              >
                <Mail size={18} strokeWidth={1.8} aria-hidden="true" />
                <span className="break-all">{CONTACT_EMAIL}</span>
              </a>

              <p className="type-meta mt-4 flex items-center gap-2">
                <MapPin size={14} strokeWidth={1.8} aria-hidden="true" />
                Dhaka, Bangladesh · working with clients remotely
              </p>
            </div>

            <div className="mt-8">
              <p className="type-label text-[var(--site-text-muted)]">Elsewhere</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {SOCIALS.map((social) => (
                  <SocialLink key={social.name} {...social} />
                ))}
              </div>
            </div>

            <p className="type-small mt-8 text-[var(--site-text-muted)]">
              Curious what I&apos;ve built first?{' '}
              <Link
                href="/hello/projects"
                className="text-[#A8DDDA] underline underline-offset-4"
              >
                Browse the projects
              </Link>
              .
            </p>
          </section>

          {/* ------------------------------------------------------ form */}
          <section className="min-w-0" aria-labelledby="form-heading">
            <h2 id="form-heading" className="type-h3 text-[#EEEEEE]">
              Send a message
            </h2>
            <p className="type-small measure-narrow mb-6 mt-2 text-[var(--site-text-muted)]">
              Fill this in and it goes straight to my inbox — I&apos;ll reply to the
              address you leave here.
            </p>

            <ContactForm />
          </section>
        </div>
      </Container>
    </>
  );
}
