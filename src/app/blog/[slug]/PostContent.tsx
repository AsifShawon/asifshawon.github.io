import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import type { JSONContent } from "@tiptap/core";

import { collectHeadings, injectHeadingIds } from "../_components/postHeadings";

/**
 * Renders the stored Tiptap document. Styling lives in `.blog-prose`
 * (blog.css) rather than inline utility soup, and H2/H3 get stable ids so the
 * table of contents can link to them.
 */
export default function PostContent({ content }: { content: JSONContent }) {
  if (!content) return null;

  let html = "";
  try {
    html = generateHTML(content, [
      StarterKit,
      Link.configure({ HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image.configure({ HTMLAttributes: { loading: "lazy", decoding: "async" } }),
    ]);
  } catch (e) {
    console.error("Failed to generate HTML from Tiptap JSON:", e);
  }

  const withAnchors = injectHeadingIds(html, collectHeadings(content));

  return <div className="blog-prose" dangerouslySetInnerHTML={{ __html: withAnchors }} />;
}
