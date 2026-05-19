import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson, genId } from "@/lib/db";

export interface OrderItem {
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
  return NextResponse.json(readJson<Order[]>("orders.json", []));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orders = readJson<Order[]>("orders.json", []);

  const order: Order = {
    id: genId(),
    items: body.items,
    total: body.total,
    name: body.name,
    email: body.email,
    phone: body.phone,
    address: body.address,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  writeJson("orders.json", orders);

  return NextResponse.json(order, { status: 201 });
}
