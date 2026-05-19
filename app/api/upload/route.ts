import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { randomUUID } from "crypto";
import { publicUploadUrl, saveUpload } from "@/lib/uploads";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  if (!["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const filename = `${randomUUID()}.${ext}`;
  await saveUpload(filename, Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: publicUploadUrl(filename) });
}
