import fs from "fs";
import path from "path";
import { getContainerClient, uploadsContainerName, useAzureBlob } from "@/lib/azure-blob";

const UPLOAD_DIRS = [
  path.join(process.cwd(), "data", "uploads"),
  path.join(process.cwd(), "public", "uploads"),
];

const SAFE_FILENAME = /^[a-f0-9-]{36}\.(jpg|jpeg|png|webp|gif|avif)$/i;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export function isSafeUploadFilename(filename: string): boolean {
  return SAFE_FILENAME.test(filename);
}

export function mimeForUpload(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  return MIME[ext] ?? "application/octet-stream";
}

export function publicUploadUrl(filename: string): string {
  return `/uploads/${filename}`;
}

function ensureLocalUploadDir(): string {
  const dir = UPLOAD_DIRS[0];
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function readLocalUpload(filename: string): Buffer | null {
  if (!isSafeUploadFilename(filename)) return null;
  for (const dir of UPLOAD_DIRS) {
    const filepath = path.join(dir, filename);
    if (fs.existsSync(filepath)) return fs.readFileSync(filepath);
  }
  return null;
}

export async function saveUpload(filename: string, data: Buffer): Promise<void> {
  if (!isSafeUploadFilename(filename)) throw new Error("Invalid upload filename");

  if (useAzureBlob()) {
    const container = await getContainerClient(uploadsContainerName());
    await container.getBlockBlobClient(filename).uploadData(data, {
      blobHTTPHeaders: { blobContentType: mimeForUpload(filename) },
    });
    return;
  }

  fs.writeFileSync(path.join(ensureLocalUploadDir(), filename), data);
}

export async function readUpload(filename: string): Promise<Buffer | null> {
  if (!isSafeUploadFilename(filename)) return null;

  if (useAzureBlob()) {
    const container = await getContainerClient(uploadsContainerName());
    const blob = container.getBlockBlobClient(filename);
    if (await blob.exists()) return blob.downloadToBuffer();
    return readLocalUpload(filename);
  }

  return readLocalUpload(filename);
}
