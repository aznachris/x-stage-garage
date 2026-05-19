import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson, genId } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  DEFAULT_MERCH,
  normalizeMerchProduct,
  normalizeMerchProducts,
  type MerchPhoto,
  type MerchProduct,
} from "@/lib/merch";

function photosFromBody(body: { photos?: MerchPhoto[]; image?: string }): MerchPhoto[] {
  if (Array.isArray(body.photos) && body.photos.length) {
    return body.photos.filter((p) => p?.url).map((p) => ({
      id: p.id || genId(),
      url: p.url,
      caption: p.caption ?? "",
    }));
  }
  if (body.image) return [{ id: genId(), url: body.image, caption: "" }];
  return [];
}

export async function GET(req: NextRequest) {
  const raw = await readJson<MerchProduct[]>("products.json", DEFAULT_MERCH);
  const products = normalizeMerchProducts(raw);
  const all = req.nextUrl.searchParams.get("all") === "1";
  const session = await getServerSession(authOptions);

  if (all && session) return NextResponse.json(products);
  return NextResponse.json(products.filter((p) => p.active));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const products = normalizeMerchProducts(
    await readJson<MerchProduct[]>("products.json", DEFAULT_MERCH)
  );

  const photos = photosFromBody(body);
  const product = normalizeMerchProduct({
    id: genId(),
    name: body.name ?? "",
    price: Number(body.price) || 0,
    tag: body.tag ?? "NEW",
    desc: body.desc ?? "",
    stock: Math.max(0, Number(body.stock) || 0),
    lowStockThreshold: Math.max(1, Number(body.lowStockThreshold) || 5),
    photos,
    active: body.active !== false,
    createdAt: new Date().toISOString(),
  });

  await writeJson("products.json", [...products, product]);
  return NextResponse.json(product, { status: 201 });
}
