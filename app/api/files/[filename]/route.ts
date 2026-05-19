import { NextRequest, NextResponse } from "next/server";
import { isSafeUploadFilename, mimeForUpload, readUpload } from "@/lib/uploads";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!isSafeUploadFilename(filename)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await readUpload(filename);
  if (!body) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": mimeForUpload(filename),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
