import { NextResponse } from "next/server";
import { dataContainerName, uploadsContainerName, useAzureBlob } from "@/lib/azure-blob";

export async function GET() {
  const payload = {
    ok: true,
    storage: useAzureBlob() ? "azure-blob" : "local",
    containers: useAzureBlob()
      ? { data: dataContainerName(), uploads: uploadsContainerName() }
      : undefined,
  };

  return NextResponse.json(payload);
}
