import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { readJson, writeJson } from "@/lib/db";
import { Order } from "../route";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();
  const orders = readJson<Order[]>("orders.json", []);
  const idx = orders.findIndex((o) => o.id === id);

  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  orders[idx].status = status;
  writeJson("orders.json", orders);

  return NextResponse.json(orders[idx]);
}
