import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson, genId } from "@/lib/db";
import { deductStock } from "@/lib/stock";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "new" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

export async function GET() {
  return NextResponse.json(await readJson<Order[]>("orders.json", []));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const items: OrderItem[] = (body.items ?? []).map((i: OrderItem) => ({
    productId: i.productId,
    name: i.name,
    price: i.price,
    qty: i.qty,
  }));

  if (!items.length || items.some((i) => !i.productId || i.qty < 1)) {
    return NextResponse.json({ error: "Invalid order items" }, { status: 400 });
  }

  const stockError = await deductStock(items.map((i) => ({ productId: i.productId, qty: i.qty })));
  if (stockError) {
    return NextResponse.json({ error: stockError }, { status: 400 });
  }

  const orders = await readJson<Order[]>("orders.json", []);
  const order: Order = {
    id: genId(),
    items,
    total: body.total,
    name: body.name,
    email: body.email,
    phone: body.phone,
    address: body.address,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  await writeJson("orders.json", orders);

  return NextResponse.json(order, { status: 201 });
}
