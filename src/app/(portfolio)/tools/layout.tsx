import type { Metadata } from 'next';
import React from 'react';

import { pageMetadata } from '@/lib/site';

// The tools index is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata({
  title: 'Tools',
  description:
    'Free AI-assisted utilities built by Asif Bhuiyan Shawon, starting with a CGPA calculator that reads your grade sheet automatically.',
  path: '/hello/tools',
});

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
