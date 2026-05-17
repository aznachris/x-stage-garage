import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Message } from "@/app/api/messages/route";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const messages = readJson<Message[]>("messages.json", []);
  const updated = messages.map((m) => m.id === id ? { ...m, ...body } : m);
  writeJson("messages.json", updated);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const messages = readJson<Message[]>("messages.json", []);
  writeJson("messages.json", messages.filter((m) => m.id !== id));
  return NextResponse.json({ ok: true });
}
