"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ProjectRow } from "@/lib/supabase/types";
import { AdminButton, AdminCard, AdminHeading, AdminInput, AdminLabel, AdminTextarea, IconChip } from "../../ui";
import ImageUploadField from "../../ImageUploadField";
import { FolderKanban, Pencil, Plus, Trash2, X } from "lucide-react";

type ProjectForm = Omit<ProjectRow, "id"> & { id?: string };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const EMPTY_FORM: ProjectForm = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  cover_image_url: "",
  gallery_images: [],
  background_color: "#76ABAE",
  live_link: "",
  github_link: "",
  tech_stack: [],
  sort_order: 0,
};

export default function ProjectsAdminClient({
  initialProjects,
}: {
  initialProjects: ProjectRow[];
}) {
  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects);
  const [form, setForm] = useState<ProjectForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const editId = searchParams?.get("edit");
    if (!editId) return;
    const match = projects.find((p) => p.id === editId);
    if (match) setForm({ ...match });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function startNew() {
    setForm({ ...EMPTY_FORM, sort_order: projects.length });
    setError(null);
  }

  function startEdit(project: ProjectRow) {
    setForm({ ...project });
    setError(null);
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
    };
    delete (payload as { id?: string }).id;

    const { data, error: saveError } = form.id
      ? await supabase
          .from("projects")
          .update(payload)
          .eq("id", form.id)
          .select()
          .single<ProjectRow>()
      : await supabase.from("projects").insert(payload).select().single<ProjectRow>();

    setSaving(false);

    if (saveError || !data) {
      setError(saveError?.message ?? "Failed to save project");
      return;
    }

    setProjects((prev) => {
      const exists = prev.some((p) => p.id === data.id);
      const next = exists ? prev.map((p) => (p.id === data.id ? data : p)) : [...prev, data];
      return next.sort((a, b) => a.sort_order - b.sort_order);
    });
    setForm(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <AdminHeading
        title="Projects"
        subtitle="Manage the projects shown on the public Projects page"
        action={
          !form && (
            <AdminButton onClick={startNew}>
              <Plus size={16} /> New Project
            </AdminButton>
          )
        }
      />

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {form && (
        <AdminCard className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {form.id ? "Edit Project" : "New Project"}
            </h2>
            <button onClick={() => setForm(null)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <AdminLabel>Title</AdminLabel>
              <AdminInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <AdminLabel>Slug</AdminLabel>
              <AdminInput
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder={slugify(form.title) || "auto-generated-from-title"}
              />
            </div>

            <div className="md:col-span-2">
              <AdminLabel>Short Description (teaser line)</AdminLabel>
              <AdminInput
                value={form.short_description ?? ""}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <AdminLabel>Full Description (Markdown)</AdminLabel>
              <AdminTextarea
                rows={8}
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <ImageUploadField
                label="Cover Image"
                value={form.cover_image_url ?? ""}
                onChange={(url) => setForm({ ...form, cover_image_url: url })}
                folder="projects"
              />
            </div>

            <div className="md:col-span-2">
              <AdminLabel>Gallery Images (one URL per line)</AdminLabel>
              <AdminTextarea
                rows={3}
                value={(form.gallery_images ?? []).join("\n")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gallery_images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </div>

            <div>
              <AdminLabel>Accent Color</AdminLabel>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.background_color ?? "#76ABAE"}
                  onChange={(e) => setForm({ ...form, background_color: e.target.value })}
                  className="h-9 w-12 rounded border border-white/10 bg-transparent"
                />
                <AdminInput
                  value={form.background_color ?? ""}
                  onChange={(e) => setForm({ ...form, background_color: e.target.value })}
                />
              </div>
            </div>

            <div>
              <AdminLabel>Sort Order</AdminLabel>
              <AdminInput
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>

            <div>
              <AdminLabel>Live Link</AdminLabel>
              <AdminInput
                value={form.live_link ?? ""}
                onChange={(e) => setForm({ ...form, live_link: e.target.value })}
              />
            </div>
            <div>
              <AdminLabel>GitHub Link</AdminLabel>
              <AdminInput
                value={form.github_link ?? ""}
                onChange={(e) => setForm({ ...form, github_link: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <AdminLabel>Tech Stack (comma-separated)</AdminLabel>
              <AdminInput
                value={(form.tech_stack ?? []).join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tech_stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <AdminButton onClick={handleSave} disabled={saving || !form.title} className="w-full sm:w-auto">
              {saving ? "Saving…" : "Save Project"}
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => setForm(null)} className="w-full sm:w-auto">
              Cancel
            </AdminButton>
          </div>
        </AdminCard>
      )}

      <div className="grid grid-cols-1 gap-3">
        {projects.map((project) => (
          <AdminCard key={project.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <IconChip tone="accent">
                <FolderKanban size={18} />
              </IconChip>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{project.title}</p>
                <p className="truncate text-xs text-gray-500">/{project.slug}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-white/[0.06] pt-2 sm:border-t-0 sm:pt-0">
              <button
                onClick={() => startEdit(project)}
                className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-xl p-2 text-gray-400 hover:bg-white/5 hover:text-white"
                aria-label={`Edit ${project.title}`}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-xl p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                aria-label={`Delete ${project.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </AdminCard>
        ))}
        {projects.length === 0 && !form && (
          <p className="text-sm text-gray-500">No projects yet. Create one to get started.</p>
        )}
      </div>
    </div>
  );
}
