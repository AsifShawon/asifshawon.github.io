import Link from "next/link";
import { ArrowUp, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AboutContactCta({ email }: { email: string | undefined }) {
  return (
    <section id="about-contact" className="about-section about-cta">
      <p className="about-section-label about-cta__label">07 / Contact</p>

      <h2>Let&apos;s build something useful.</h2>

      <p className="measure">
        Open to selected opportunities involving ecommerce, full-stack applications,
        practical AI features and digital product collaboration.
      </p>

      <div className="about-hero__actions">
        <Button asChild variant="brand" size="cta" className="about-cta__primary">
          <Link href="/contact">Start a conversation</Link>
        </Button>

        {email && (
          <Button asChild variant="surface" size="cta" className="about-cta__secondary">
            <a href={`mailto:${email}`}>
              <Mail size={16} strokeWidth={2} aria-hidden="true" />
              Email directly
            </a>
          </Button>
        )}

        <a href="#about-intro" className="about-cta__top">
          Back to top
          <ArrowUp size={15} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
