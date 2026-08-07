import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "blog-media";

export async function uploadImageToStorage(
  file: File,
  folder: string = "uploads"
): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1600,
    fileType: "image/webp",
    useWebWorker: true,
  });

  const path = `${folder}/${crypto.randomUUID()}.webp`;
  const supabase = createClient();

  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: "image/webp",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatarToStorage(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 256,
    fileType: "image/webp",
    useWebWorker: true,
  });

  const supabase = createClient();
  const bucketName = "withshawon";
  const path = `profile-assets/avatar-${Date.now()}.webp`;

  let uploadResult = await supabase.storage.from(bucketName).upload(path, compressed, {
    contentType: "image/webp",
    upsert: true,
  });

  let finalBucket = bucketName;
  let finalPath = path;

  if (uploadResult.error) {
    finalBucket = "blog-media";
    finalPath = `profile-assets/avatar-${Date.now()}.webp`;
    uploadResult = await supabase.storage.from(finalBucket).upload(finalPath, compressed, {
      contentType: "image/webp",
      upsert: true,
    });
    if (uploadResult.error) throw uploadResult.error;
  }

  const { data } = supabase.storage.from(finalBucket).getPublicUrl(finalPath);
  return data.publicUrl;
}

