import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { dataContainerName, getContainerClient, useAzureBlob } from "@/lib/azure-blob";

const DATA_DIR = path.join(process.cwd(), "data");
const SAFE_DATA_FILE = /^[a-z0-9_-]+\.json$/i;

function ensureLocalDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function assertSafeFilename(filename: string) {
  if (!SAFE_DATA_FILE.test(filename)) {
    throw new Error(`Invalid data file: ${filename}`);
  }
}

export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  assertSafeFilename(filename);

  if (useAzureBlob()) {
    try {
      const container = await getContainerClient(dataContainerName());
      const blob = container.getBlockBlobClient(filename);
      if (!(await blob.exists())) return fallback;
      const buffer = await blob.downloadToBuffer();
      return JSON.parse(buffer.toString("utf-8")) as T;
    } catch {
      return fallback;
    }
  }

  ensureLocalDir();
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filepath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  assertSafeFilename(filename);
  const content = JSON.stringify(data, null, 2);

  if (useAzureBlob()) {
    const container = await getContainerClient(dataContainerName());
    await container.getBlockBlobClient(filename).upload(content, Buffer.byteLength(content), {
      blobHTTPHeaders: { blobContentType: "application/json" },
    });
    return;
  }

  ensureLocalDir();
  fs.writeFileSync(path.join(DATA_DIR, filename), content);
}

export function genId(): string {
  return randomUUID();
}
