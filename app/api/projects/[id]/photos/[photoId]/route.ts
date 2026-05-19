import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DEFAULT_PROJECTS, type Project } from "@/lib/projects";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; photoId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, photoId } = await params;
  const { caption } = await req.json();
  const projects = await readJson<Project[]>("projects.json", DEFAULT_PROJECTS);
  const updated = projects.map((p) =>
    p.id === id
      ? { ...p, photos: p.photos.map((ph) => ph.id === photoId ? { ...ph, caption } : ph) }
      : p
  );
  await writeJson("projects.json", updated);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; photoId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, photoId } = await params;
  const projects = await readJson<Project[]>("projects.json", DEFAULT_PROJECTS);
  const updated = projects.map((p) =>
    p.id === id ? { ...p, photos: p.photos.filter((ph) => ph.id !== photoId) } : p
  );
  await writeJson("projects.json", updated);
  return NextResponse.json({ ok: true });
}
