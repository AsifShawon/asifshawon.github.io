import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import type { JSONContent } from "@tiptap/core";

export default function PostContent({ content }: { content: JSONContent }) {
  if (!content) return null;

  let html = "";
  try {
    html = generateHTML(content, [
      StarterKit,
      Link.configure({
        HTMLAttributes: {
          class: "text-teal-400 no-underline hover:underline font-medium",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-2xl border border-zinc-800 my-6 max-w-full h-auto mx-auto shadow-md",
        },
      }),
    ]);
  } catch (e) {
    console.error("Failed to generate HTML from Tiptap JSON:", e);
  }

  return (
    <div
      className="prose prose-invert prose-zinc max-w-none prose-headings:font-serif prose-headings:text-zinc-100 prose-headings:tracking-tight prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:text-lg prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-teal-500 prose-blockquote:text-zinc-400 prose-blockquote:italic prose-img:rounded-2xl prose-img:border prose-img:border-zinc-800 prose-img:shadow-lg prose-img:mx-auto prose-hr:border-zinc-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
