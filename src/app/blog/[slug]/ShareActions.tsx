"use client";

import { useState } from "react";
import { Check, Link2, Linkedin, Share2 } from "lucide-react";

function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64Z" />
    </svg>
  );
}

/**
 * Share row. The canonical URL is passed in from the server so nothing has to
 * guess the deployment host, and the native share sheet is used when the
 * browser offers one.
 */
export default function ShareActions({
  url,
  title,
  className = "",
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked — the share links below still work. */
    }
  }

  async function nativeShare() {
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({ title, url });
    } catch {
      /* Dismissed by the user. */
    }
  }

  const linkClass = "blog-arrow blog-arrow--sm blog-arrow--isolated";

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <button type="button" onClick={copyLink} aria-label="Copy link to this article" className={linkClass}>
        {copied ? <Check size={15} strokeWidth={2} /> : <Link2 size={15} strokeWidth={1.9} />}
      </button>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share this article on X"
        className={linkClass}
      >
        <XIcon />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share this article on LinkedIn"
        className={linkClass}
      >
        <Linkedin size={15} strokeWidth={1.9} />
      </a>

      <button
        type="button"
        onClick={nativeShare}
        aria-label="Share this article"
        className={`${linkClass} sm:hidden`}
      >
        <Share2 size={15} strokeWidth={1.9} />
      </button>

      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
