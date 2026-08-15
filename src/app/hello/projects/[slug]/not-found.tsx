import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-start justify-center py-24">
      <p className="type-label text-[var(--ml-green)]">404</p>
      <h1 className="type-h1 mt-4 text-[var(--ml-ink)]">Project not found</h1>
      <p className="type-body-lg measure mt-4 text-[var(--site-text-muted)]">
        That case study doesn&apos;t exist, or the link is out of date.
      </p>
      <Button asChild variant="brand" size="cta" className="mt-8">
        <Link href="/hello/projects">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to all projects
        </Link>
      </Button>
    </Container>
  );
}
