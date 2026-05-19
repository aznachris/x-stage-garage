import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DEFAULT_MERCH, normalizeMerchProduct, normalizeMerchProducts, type MerchPhoto, type MerchProduct } from "@/lib/merch";
import { genId } from "@/lib/db";

function photosFromBody(body: { photos?: MerchPhoto[]; image?: string }, fallback: MerchPhoto[]): MerchPhoto[] {
  if (body.photos !== undefined) {
    if (!Array.isArray(body.photos)) return fallback;
    return body.photos.filter((p) => p?.url).map((p) => ({
      id: p.id || genId(),
      url: p.url,
      caption: p.caption ?? "",
    }));
  }
  if (body.image !== undefined) {
    return body.image ? [{ id: genId(), url: body.image, caption: "" }] : [];
  }
  return fallback;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const raw = await readJson<MerchProduct[]>("products.json", DEFAULT_MERCH);
  const products = normalizeMerchProducts(raw);
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const current = products[idx];
  const photos = photosFromBody(body, current.photos);
  products[idx] = normalizeMerchProduct({
    ...current,
    name: body.name ?? current.name,
    price: body.price !== undefined ? Number(body.price) : current.price,
    tag: body.tag ?? current.tag,
    desc: body.desc ?? current.desc,
    stock: body.stock !== undefined ? Math.max(0, Number(body.stock)) : current.stock,
    lowStockThreshold: body.lowStockThreshold !== undefined
      ? Math.max(1, Number(body.lowStockThreshold))
      : current.lowStockThreshold,
    photos,
    active: body.active !== undefined ? Boolean(body.active) : current.active,
    id: current.id,
    createdAt: current.createdAt,
  });

  await writeJson("products.json", products);
  return NextResponse.json(products[idx]);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const products = await readJson<MerchProduct[]>("products.json", DEFAULT_MERCH);
  await writeJson("products.json", products.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
