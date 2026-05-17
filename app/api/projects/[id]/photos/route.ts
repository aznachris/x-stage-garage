import { NextResponse } from "next/server";
import { readJson, writeJson, genId } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DEFAULT_PROJECTS, type Project } from "@/lib/projects";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { url, caption } = await req.json();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  const projects = readJson<Project[]>("projects.json", DEFAULT_PROJECTS);
  const photo = { id: genId(), url, caption: caption ?? "" };
  const updated = projects.map((p) =>
    p.id === id ? { ...p, photos: [...(p.photos ?? []), photo] } : p
  );
  writeJson("projects.json", updated);
  return NextResponse.json(photo, { status: 201 });
}
