import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DEFAULT_PROJECTS, type Project } from "@/lib/projects";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const projects = readJson<Project[]>("projects.json", DEFAULT_PROJECTS);
  const updated = projects.map((p) =>
    p.id === id ? { ...p, ...body, id: p.id, photos: p.photos } : p
  );
  writeJson("projects.json", updated);
  return NextResponse.json(updated.find((p) => p.id === id) ?? null);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const projects = readJson<Project[]>("projects.json", DEFAULT_PROJECTS);
  writeJson("projects.json", projects.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
