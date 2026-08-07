"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadImageToStorage } from "@/lib/uploadImage";
import type { BlogPost } from "@/lib/supabase/types";
import { AdminButton, AdminCard, AdminInput, AdminLabel, AdminTextarea } from "../../ui";
import ImageUploadField from "../../ImageUploadField";
import EditorToolbar from "./EditorToolbar";
import ResizableImage from "@/lib/tiptap/ResizableImage";
import { Trash2 } from "lucide-react";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PostEditor({ initialPost }: { initialPost?: BlogPost }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.cover_image_url ?? "");
  const [tags, setTags] = useState((initialPost?.tags ?? []).join(", "));
  const [published, setPublished] = useState(initialPost?.published ?? false);
  const [archived, setArchived] = useState(initialPost?.archived ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Write your post… drop or paste an image anywhere." }),
      ResizableImage,
    ],
    content: initialPost?.content ?? "",
    editorProps: {
      attributes: {
        class:
          "tiptap-content prose prose-invert max-w-none focus:outline-none min-h-[350px] p-2 prose-headings:font-serif prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-p:leading-relaxed prose-a:text-[#76ABAE] prose-blockquote:border-l-[#76ABAE] prose-img:rounded-xl prose-img:border prose-img:border-zinc-800",
      },
      handleDrop(view, event, _slice, moved) {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith("image/")
        );
        if (files.length === 0) return false;
        event.preventDefault();

        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        files.forEach((file) => {
          void uploadImageToStorage(file, "posts").then((url) => {
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: url });
            const pos = coords?.pos ?? view.state.selection.from;
            view.dispatch(view.state.tr.insert(pos, node));
          });
        });
        return true;
      },
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith("image/"));
        if (!imageItem) return false;
        const file = imageItem.getAsFile();
        if (!file) return false;
        event.preventDefault();

        void uploadImageToStorage(file, "posts").then((url) => {
          const { schema } = view.state;
          const node = schema.nodes.image.create({ src: url });
          view.dispatch(view.state.tr.insert(view.state.selection.from, node));
        });
        return true;
      },
    },
  });

  async function handleSave(publishOverride?: boolean) {
    if (!editor) return;
    setSaving(true);
    setError(null);

    const nextPublished = publishOverride ?? published;
    const supabase = createClient();
    const payload = {
      title,
      slug: slug.trim() || slugify(title),
      excerpt: excerpt || null,
      cover_image_url: coverImageUrl || null,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      content: editor.getJSON(),
      published: nextPublished,
      archived,
      published_at:
        nextPublished && !initialPost?.published_at
          ? new Date().toISOString()
          : initialPost?.published_at ?? null,
    };

    const { data, error: saveError } = initialPost
      ? await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", initialPost.id)
          .select()
          .single<BlogPost>()
      : await supabase.from("blog_posts").insert(payload).select().single<BlogPost>();

    setSaving(false);

    if (saveError || !data) {
      setError(saveError?.message ?? "Failed to save post");
      return;
    }

    setPublished(nextPublished);
    if (!initialPost) {
      router.push(`/admin/posts/${data.id}`);
    } else {
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!initialPost) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", initialPost.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.push("/admin/posts");
  }

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">
            {initialPost ? "Edit Post" : "New Post"}
          </h1>
          {initialPost && (
            <p className="text-xs sm:text-sm text-gray-400">
              {initialPost.views} views · {initialPost.published ? "Published" : "Draft"}
              {archived && " · Archived"}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {initialPost && (
            <AdminButton variant="danger" onClick={handleDelete} className="flex-1 sm:flex-initial">
              <Trash2 size={16} /> Delete
            </AdminButton>
          )}
          <AdminButton variant="secondary" onClick={() => handleSave(false)} disabled={saving} className="flex-1 sm:flex-initial">
            Save Draft
          </AdminButton>
          <AdminButton onClick={() => handleSave(true)} disabled={saving} className="flex-1 sm:flex-initial">
            {saving ? "Saving…" : published ? "Update & Publish" : "Publish"}
          </AdminButton>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <AdminCard>
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </AdminCard>

        <div className="flex flex-col gap-4">
          <AdminCard>
            <AdminLabel>Title</AdminLabel>
            <AdminInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="mb-4"
            />
            <AdminLabel>Slug</AdminLabel>
            <AdminInput
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={slugify(title) || "auto-generated-from-title"}
              className="mb-4"
            />
            <AdminLabel>Excerpt</AdminLabel>
            <AdminTextarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary shown on the blog list"
              className="mb-4"
            />
            <AdminLabel>Tags (comma-separated)</AdminLabel>
            <AdminInput
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ai, engineering, notes"
            />
          </AdminCard>

          <AdminCard>
            <ImageUploadField
              label="Cover Image"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              folder="posts"
            />
          </AdminCard>

          <AdminCard className="flex flex-col gap-3">
            <label className="flex items-center gap-3 text-sm text-gray-200">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-[#76ABAE]"
              />
              Published
            </label>
            <p className="text-xs text-gray-500">
              Drafts are only visible to you while signed in.
            </p>

            <label className="flex items-center gap-3 text-sm text-gray-200">
              <input
                type="checkbox"
                checked={archived}
                onChange={(e) => setArchived(e.target.checked)}
                className="h-4 w-4 accent-amber-500"
              />
              Archived
            </label>
            <p className="text-xs text-gray-500">
              Hides this post from the public site even if Published, without
              deleting it.
            </p>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
