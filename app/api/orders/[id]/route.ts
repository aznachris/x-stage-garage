import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { readJson, writeJson } from "@/lib/db";
import { restoreStock } from "@/lib/stock";
import { Order } from "../route";

const RESTORABLE: Order["status"][] = ["new", "processing"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();
  const orders = await readJson<Order[]>("orders.json", []);
  const idx = orders.findIndex((o) => o.id === id);

  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const prev = orders[idx];
  if (status === "cancelled" && RESTORABLE.includes(prev.status)) {
    const items = prev.items
      .filter((i) => i.productId)
      .map((i) => ({ productId: i.productId, qty: i.qty }));
    if (items.length) await restoreStock(items);
  }

  orders[idx].status = status;
  await writeJson("orders.json", orders);

  return NextResponse.json(orders[idx]);
}
