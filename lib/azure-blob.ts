import { BlobServiceClient, type ContainerClient } from "@azure/storage-blob";

let blobServiceClient: BlobServiceClient | null = null;

export function useAzureBlob(): boolean {
  return Boolean(process.env.AZURE_STORAGE_CONNECTION_STRING?.trim());
}

function getBlobServiceClient(): BlobServiceClient {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!.trim();
  if (!blobServiceClient) {
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }
  return blobServiceClient;
}

export async function getContainerClient(containerName: string): Promise<ContainerClient> {
  const container = getBlobServiceClient().getContainerClient(containerName);
  await container.createIfNotExists();
  return container;
}

export function dataContainerName(): string {
  return process.env.AZURE_STORAGE_DATA_CONTAINER?.trim() || "data";
}

export function uploadsContainerName(): string {
  return process.env.AZURE_STORAGE_UPLOADS_CONTAINER?.trim() || "uploads";
}
