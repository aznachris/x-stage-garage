import { NextResponse } from "next/server";
import { readJson, writeJson, genId } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const messages = readJson<Message[]>("messages.json", []);
  return NextResponse.json(messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: Request) {
  const body = await req.json();
  const messages = readJson<Message[]>("messages.json", []);
  const msg: Message = {
    id: genId(),
    name: body.name ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    service: body.service ?? "",
    message: body.message ?? "",
    read: false,
    createdAt: new Date().toISOString(),
  };
  writeJson("messages.json", [...messages, msg]);
  return NextResponse.json(msg, { status: 201 });
}
