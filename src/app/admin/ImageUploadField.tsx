"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadImageToStorage } from "@/lib/uploadImage";
import { AdminInput, AdminLabel } from "./ui";

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = "uploads",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImageToStorage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <AdminLabel>{label}</AdminLabel>
      <div className="flex flex-col sm:flex-row gap-2">
        <AdminInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https:// or /path/to/image.webp"
          className="flex-1"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 sm:py-2 text-xs font-medium text-gray-200 hover:bg-white/5 disabled:opacity-50 transition-colors"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-28 w-full rounded-xl object-cover border border-white/10"
        />
      )}
    </div>
  );
}
