import "server-only";
import { put, del } from "@vercel/blob";
import crypto from "crypto";

export const MAX_IMAGES_PER_PRODUCT = 8;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const BLOB_HOSTNAME_SUFFIX = ".public.blob.vercel-storage.com";

export async function saveUploadedImages(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const uploaded: string[] = [];
  for (const file of files) {
    const ext = EXT_BY_MIME[file.type] ?? "jpg";
    const pathname = `products/${crypto.randomUUID()}.${ext}`;
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
    });
    uploaded.push(blob.url);
  }
  return uploaded;
}

export async function deleteUploadedImages(urls: string[]): Promise<void> {
  const ownUrls = urls.filter((url) => {
    try {
      return new URL(url).hostname.endsWith(BLOB_HOSTNAME_SUFFIX);
    } catch {
      return false;
    }
  });
  if (ownUrls.length === 0) return;
  await del(ownUrls).catch(() => {});
}
