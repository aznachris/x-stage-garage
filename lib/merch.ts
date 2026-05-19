export type StockStatus = "in_stock" | "low" | "out_of_stock";

export interface MerchPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface MerchProduct {
  id: string;
  name: string;
  price: number;
  tag: string;
  desc: string;
  stock: number;
  lowStockThreshold: number;
  /** @deprecated use photos — kept for legacy JSON */
  image?: string;
  photos: MerchPhoto[];
  active: boolean;
  createdAt: string;
}

export function getProductPhotos(p: Pick<MerchProduct, "photos" | "image" | "id">): MerchPhoto[] {
  if (p.photos?.length) return p.photos.filter((ph) => ph.url);
  if (p.image) return [{ id: `${p.id}-legacy`, url: p.image, caption: "" }];
  return [];
}

export function normalizeMerchProduct(p: MerchProduct): MerchProduct {
  const photos = getProductPhotos(p);
  return {
    ...p,
    photos,
    image: photos[0]?.url ?? "",
  };
}

export function normalizeMerchProducts(products: MerchProduct[]): MerchProduct[] {
  return products.map(normalizeMerchProduct);
}

export const DEFAULT_MERCH: MerchProduct[] = [
  { id: "hoodie", name: "Stage X Hoodie", price: 65, tag: "BESTSELLER", desc: "Premium heavyweight fleece, embroidered logo", stock: 24, lowStockThreshold: 5, photos: [], active: true, createdAt: "2024-01-01T00:00:00.000Z" },
  { id: "cap", name: "Stage X Cap", price: 35, tag: "NEW", desc: "Structured 6-panel, adjustable strap", stock: 18, lowStockThreshold: 5, photos: [], active: true, createdAt: "2024-01-01T00:00:00.000Z" },
  { id: "sticker", name: "Sticker Pack × 8", price: 12, tag: "POPULAR", desc: "Die-cut vinyl, weatherproof, UV resistant", stock: 50, lowStockThreshold: 10, photos: [], active: true, createdAt: "2024-01-01T00:00:00.000Z" },
  { id: "tee", name: "Stage X Tee", price: 45, tag: "CLASSIC", desc: "100% cotton, oversized fit, screen printed", stock: 30, lowStockThreshold: 5, photos: [], active: true, createdAt: "2024-01-01T00:00:00.000Z" },
  { id: "keyring", name: "Metal Keyring", price: 18, tag: "DETAIL", desc: "CNC machined aluminium, laser engraved", stock: 40, lowStockThreshold: 8, photos: [], active: true, createdAt: "2024-01-01T00:00:00.000Z" },
  { id: "decal", name: "Window Decal", price: 8, tag: "ESSENTIALS", desc: "High-quality vinyl, easy apply / remove", stock: 60, lowStockThreshold: 15, photos: [], active: true, createdAt: "2024-01-01T00:00:00.000Z" },
];

export function getStockStatus(product: Pick<MerchProduct, "stock" | "lowStockThreshold">): StockStatus {
  if (product.stock <= 0) return "out_of_stock";
  if (product.stock <= product.lowStockThreshold) return "low";
  return "in_stock";
}
