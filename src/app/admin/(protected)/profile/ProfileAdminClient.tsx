"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import { AdminButton, AdminCard, AdminHeading, AdminInput, AdminLabel, AdminTextarea } from "../../ui";
import ImageUploadField from "../../ImageUploadField";
import { uploadImageToStorage, uploadAvatarToStorage } from "@/lib/uploadImage";
import { Plus, Trash2, Loader2, UserCircle } from "lucide-react";

interface AchievementForm {
  title: string;
  description: string;
  icon: string;
}

interface TimelineForm {
  title: string;
  subtitle: string;
  period: string;
  descriptionText: string; // one bullet per line; single line saves as a plain string
}

function toDescriptionText(description: string | string[]): string {
  return Array.isArray(description) ? description.join("\n") : description;
}

function fromDescriptionText(text: string): string | string[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.length > 1 ? lines : lines[0] ?? "";
}

function AvatarUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadAvatarToStorage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Avatar upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <AdminLabel>Admin Avatar (WebP, max 256x256, 100KB)</AdminLabel>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/20 bg-zinc-800 flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <UserCircle className="h-8 w-8 text-zinc-500" />
          )}
        </div>
        <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
          <AdminInput
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/assets/withshawon-logo.webp"
            className="flex-1"
          />
          <label className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 sm:py-2 text-xs font-medium text-gray-200 hover:bg-white/5 transition-colors">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : "Upload WebP"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}


export default function ProfileAdminClient({
  initialProfile,
}: {
  initialProfile: Profile | null;
}) {
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [tagline, setTagline] = useState(initialProfile?.tagline ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? "");
  const [resumeUrl, setResumeUrl] = useState(initialProfile?.resume_url ?? "");
  const [intro, setIntro] = useState(initialProfile?.bio?.intro ?? "");
  const [achievements, setAchievements] = useState<AchievementForm[]>(
    initialProfile?.bio?.achievements ?? []
  );
  const [timeline, setTimeline] = useState<TimelineForm[]>(
    (initialProfile?.bio?.timeline ?? []).map((t) => ({
      title: t.title,
      subtitle: t.subtitle,
      period: t.period,
      descriptionText: toDescriptionText(t.description),
    }))
  );
  const [socials, setSocials] = useState({
    email: initialProfile?.socials?.email ?? "",
    phone: initialProfile?.socials?.phone ?? "",
    location: initialProfile?.socials?.location ?? "",
    website: initialProfile?.socials?.website ?? "",
    facebook: initialProfile?.socials?.facebook ?? "",
    instagram: initialProfile?.socials?.instagram ?? "",
    linkedin: initialProfile?.socials?.linkedin ?? "",
    github: initialProfile?.socials?.github ?? "",
    discord: initialProfile?.socials?.discord ?? "",
  });

  const [resumeUploading, setResumeUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function handleResumeFile(file: File) {
    setResumeUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const path = `resumes/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("blog-media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("blog-media").getPublicUrl(path);
      setResumeUrl(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resume upload failed");
    } finally {
      setResumeUploading(false);
    }
  }

  function addAchievement() {
    setAchievements((prev) => [...prev, { title: "", description: "", icon: "award" }]);
  }

  function addTimelineEntry() {
    setTimeline((prev) => [
      ...prev,
      { title: "", subtitle: "", period: "", descriptionText: "" },
    ]);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const payload = {
      full_name: fullName,
      tagline,
      avatar_url: avatarUrl || null,
      resume_url: resumeUrl || null,
      bio: {
        intro,
        achievements: achievements.filter((a) => a.title),
        timeline: timeline
          .filter((t) => t.title)
          .map((t) => ({
            title: t.title,
            subtitle: t.subtitle,
            period: t.period,
            description: fromDescriptionText(t.descriptionText),
          })),
      },
      socials,
      updated_at: new Date().toISOString(),
    };

    const supabase = createClient();
    const { error: saveError } = initialProfile
      ? await supabase.from("profiles").update(payload).eq("id", initialProfile.id)
      : await supabase.from("profiles").insert(payload);

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSavedAt(new Date());
  }

  return (
    <div>
      <AdminHeading title="Profile" subtitle="Edit the About Me content shown on the public site" />

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {savedAt && !error && (
        <p className="mb-4 text-sm text-emerald-400">Saved at {savedAt.toLocaleTimeString()}</p>
      )}

      <div className="grid grid-cols-1 gap-6">
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-white">Basics</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <AdminLabel>Full Name</AdminLabel>
              <AdminInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <AdminLabel>Tagline</AdminLabel>
              <AdminInput value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <AdminLabel>Intro Paragraph</AdminLabel>
              <AdminTextarea rows={4} value={intro} onChange={(e) => setIntro(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <AvatarUploadField value={avatarUrl} onChange={setAvatarUrl} />
            </div>
            <div className="md:col-span-2">
              <AdminLabel>Resume / CV</AdminLabel>
              <div className="flex flex-col sm:flex-row gap-2">
                <AdminInput
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="/Resume.pdf or https://..."
                  className="flex-1"
                />
                <label className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 sm:py-2 text-xs font-medium text-gray-200 hover:bg-white/5 transition-colors">
                  {resumeUploading ? <Loader2 size={14} className="animate-spin" /> : "Upload"}
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleResumeFile(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-white">Contact & Socials</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(
              [
                ["email", "Email"],
                ["phone", "Phone"],
                ["location", "Location"],
                ["website", "Website"],
                ["facebook", "Facebook URL"],
                ["instagram", "Instagram URL"],
                ["linkedin", "LinkedIn URL"],
                ["github", "GitHub URL"],
                ["discord", "Discord URL"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <AdminLabel>{label}</AdminLabel>
                <AdminInput
                  value={socials[key]}
                  onChange={(e) => setSocials({ ...socials, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Achievements</h2>
            <AdminButton variant="secondary" onClick={addAchievement}>
              <Plus size={14} /> Add
            </AdminButton>
          </div>
          <div className="flex flex-col gap-4">
            {achievements.map((a, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-4">
                <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <AdminInput
                    placeholder="Title"
                    value={a.title}
                    onChange={(e) => {
                      const next = [...achievements];
                      next[i] = { ...a, title: e.target.value };
                      setAchievements(next);
                    }}
                  />
                  <AdminInput
                    placeholder="Icon (award / code / brain)"
                    value={a.icon}
                    onChange={(e) => {
                      const next = [...achievements];
                      next[i] = { ...a, icon: e.target.value };
                      setAchievements(next);
                    }}
                  />
                  <button
                    onClick={() => setAchievements(achievements.filter((_, idx) => idx !== i))}
                    className="flex h-10 items-center justify-center rounded-xl p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Remove achievement"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <AdminTextarea
                  rows={2}
                  placeholder="Description"
                  value={a.description}
                  onChange={(e) => {
                    const next = [...achievements];
                    next[i] = { ...a, description: e.target.value };
                    setAchievements(next);
                  }}
                />
              </div>
            ))}
            {achievements.length === 0 && (
              <p className="text-sm text-gray-500">No achievements yet.</p>
            )}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Career Timeline</h2>
            <AdminButton variant="secondary" onClick={addTimelineEntry}>
              <Plus size={14} /> Add
            </AdminButton>
          </div>
          <div className="flex flex-col gap-4">
            {timeline.map((t, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-4">
                <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <AdminInput
                    placeholder="Title"
                    value={t.title}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[i] = { ...t, title: e.target.value };
                      setTimeline(next);
                    }}
                  />
                  <AdminInput
                    placeholder="Subtitle"
                    value={t.subtitle}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[i] = { ...t, subtitle: e.target.value };
                      setTimeline(next);
                    }}
                  />
                  <AdminInput
                    placeholder="Period"
                    value={t.period}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[i] = { ...t, period: e.target.value };
                      setTimeline(next);
                    }}
                  />
                </div>
                <AdminTextarea
                  rows={3}
                  placeholder="Description — one bullet per line (a single line renders as a paragraph)"
                  value={t.descriptionText}
                  onChange={(e) => {
                    const next = [...timeline];
                    next[i] = { ...t, descriptionText: e.target.value };
                    setTimeline(next);
                  }}
                />
                <button
                  onClick={() => setTimeline(timeline.filter((_, idx) => idx !== i))}
                  className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-red-400"
                >
                  <Trash2 size={14} /> Remove entry
                </button>
              </div>
            ))}
            {timeline.length === 0 && (
              <p className="text-sm text-gray-500">No timeline entries yet.</p>
            )}
          </div>
        </AdminCard>

        <div>
          <AdminButton onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? "Saving…" : "Save Profile"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
