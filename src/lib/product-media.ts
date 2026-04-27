import { demoProducts } from "@/lib/demo-data";

const productImageMap = new Map(
  demoProducts.map((product) => [product.id, product.images])
);

export function normalizeProductImages<T extends { id: string; images: string[] }>(item: T): T {
  const images = productImageMap.get(item.id);

  if (!images?.length) {
    return item;
  }

  return {
    ...item,
    images,
  };
}
