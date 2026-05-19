import { readJson, writeJson } from "@/lib/db";
import { DEFAULT_MERCH, type MerchProduct } from "@/lib/merch";

export interface StockLineItem {
  productId: string;
  qty: number;
}

async function loadProducts(): Promise<MerchProduct[]> {
  return await readJson<MerchProduct[]>("products.json", DEFAULT_MERCH);
}

export async function deductStock(items: StockLineItem[]): Promise<string | null> {
  const products = await loadProducts();
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const { productId, qty } of items) {
    const p = byId.get(productId);
    if (!p) return `Unknown product: ${productId}`;
    if (!p.active) return `${p.name} is not available`;
    if (p.stock < qty) return `Insufficient stock for ${p.name}`;
  }

  for (const { productId, qty } of items) {
    const p = byId.get(productId)!;
    p.stock -= qty;
  }

  await writeJson("products.json", products);
  return null;
}

export async function restoreStock(items: StockLineItem[]): Promise<void> {
  const products = await loadProducts();
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const { productId, qty } of items) {
    const p = byId.get(productId);
    if (p) p.stock += qty;
  }

  await writeJson("products.json", products);
}
