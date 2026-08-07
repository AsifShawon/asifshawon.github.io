"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/lib/supabase/types";
import { AdminButton, AdminCard, AdminHeading, AdminInput, AdminLabel, AdminTextarea, IconChip } from "../../ui";
import { Pencil, Plus, Trash2, Wrench, X } from "lucide-react";

type ServiceForm = Omit<Service, "id"> & { id?: string };

const EMPTY_FORM: ServiceForm = {
  title: "",
  description: "",
  icon: "",
  sort_order: 0,
};

export default function ServicesAdminClient({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [form, setForm] = useState<ServiceForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const editId = searchParams?.get("edit");
    if (!editId) return;
    const match = services.find((s) => s.id === editId);
    if (match) setForm({ ...match });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function startNew() {
    setForm({ ...EMPTY_FORM, sort_order: services.length });
    setError(null);
  }

  function startEdit(service: Service) {
    setForm({ ...service });
    setError(null);
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { ...form };
    delete (payload as { id?: string }).id;

    const { data, error: saveError } = form.id
      ? await supabase
          .from("services")
          .update(payload)
          .eq("id", form.id)
          .select()
          .single<Service>()
      : await supabase.from("services").insert(payload).select().single<Service>();

    setSaving(false);

    if (saveError || !data) {
      setError(saveError?.message ?? "Failed to save service");
      return;
    }

    setServices((prev) => {
      const exists = prev.some((s) => s.id === data.id);
      const next = exists ? prev.map((s) => (s.id === data.id ? data : s)) : [...prev, data];
      return next.sort((a, b) => a.sort_order - b.sort_order);
    });
    setForm(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("services").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <AdminHeading
        title="Services"
        subtitle="Manage the services list (not currently rendered on the public site)"
        action={
          !form && (
            <AdminButton onClick={startNew}>
              <Plus size={16} /> New Service
            </AdminButton>
          )
        }
      />

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {form && (
        <AdminCard className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {form.id ? "Edit Service" : "New Service"}
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
              <AdminLabel>Icon (lucide-react name, e.g. &quot;code&quot;)</AdminLabel>
              <AdminInput
                value={form.icon ?? ""}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <AdminLabel>Description</AdminLabel>
              <AdminTextarea
                rows={4}
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <AdminLabel>Sort Order</AdminLabel>
              <AdminInput
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <AdminButton onClick={handleSave} disabled={saving || !form.title} className="w-full sm:w-auto">
              {saving ? "Saving…" : "Save Service"}
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => setForm(null)} className="w-full sm:w-auto">
              Cancel
            </AdminButton>
          </div>
        </AdminCard>
      )}

      <div className="grid grid-cols-1 gap-3">
        {services.map((service) => (
          <AdminCard key={service.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <IconChip tone="accent">
                <Wrench size={18} />
              </IconChip>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{service.title}</p>
                <p className="truncate text-xs text-gray-500">{service.description}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-white/[0.06] pt-2 sm:border-t-0 sm:pt-0">
              <button
                onClick={() => startEdit(service)}
                className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-xl p-2 text-gray-400 hover:bg-white/5 hover:text-white"
                aria-label={`Edit ${service.title}`}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-xl p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                aria-label={`Delete ${service.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </AdminCard>
        ))}
        {services.length === 0 && !form && (
          <p className="text-sm text-gray-500">No services yet.</p>
        )}
      </div>
    </div>
  );
}
