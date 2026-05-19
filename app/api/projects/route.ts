import { NextResponse } from "next/server";
import { readJson, writeJson, genId } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DEFAULT_PROJECTS, type Project } from "@/lib/projects";

export async function GET() {
  const projects = await readJson<Project[]>("projects.json", DEFAULT_PROJECTS);
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const projects = await readJson<Project[]>("projects.json", DEFAULT_PROJECTS);

  const p: Project = {
    id: genId(),
    title: body.title ?? "",
    category: body.category ?? "German",
    specs: body.specs ?? "",
    description: body.description ?? "",
    color: body.color ?? "#1A2B3C",
    accent: body.accent ?? "#00AAFF",
    year: body.year ?? String(new Date().getFullYear()),
    photos: [],
  };

  await writeJson("projects.json", [...projects, p]);
  return NextResponse.json(p, { status: 201 });
}
