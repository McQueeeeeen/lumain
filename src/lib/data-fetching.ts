import { prisma } from "./prisma";
import { Product } from "@/types";

export async function getProductsFromDb(filters?: {
  q?: string;
  style?: string;
  room?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}) {
  const where: any = {};

  if (filters?.q) {
    where.OR = [
      { name: { contains: filters.q } },
      { article: { contains: filters.q } },
    ];
  }

  if (filters?.style) {
    where.style = filters.style;
  }

  if (filters?.category && filters.category !== "Все") {
    // Map Russian categories back to English if needed, but the chips use Russian.
    // In DB we have: Chandeliers, Wall lights, Pendant, Recessed
    const catMap: Record<string, string> = {
      "Люстры": "Chandeliers",
      "Бра": "Wall lights",
      "Подвесы": "Pendant",
      "Споты": "Recessed",
    };
    if (catMap[filters.category]) {
      where.category = catMap[filters.category];
    }
  }

  if (filters?.room) {
    const rooms = filters.room.split(",");
    where.OR = where.OR || [];
    rooms.forEach((r) => {
      where.OR.push({ room: { contains: r } });
    });
  }

  if (filters?.minPrice || filters?.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }

  const dbProducts = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return dbProducts.map(formatProduct);
}

export async function getProductByIdFromDb(id: string) {
  const p = await prisma.product.findUnique({
    where: { id },
  });

  if (!p) return null;
  return formatProduct(p);
}

export async function getRelatedProductsFromDb(currentId: string, limit = 3) {
  const dbProducts = await prisma.product.findMany({
    where: {
      id: { not: currentId },
    },
    take: limit,
  });

  return dbProducts.map(formatProduct);
}

export function formatProduct(p: any): Product {
  return {
    ...p,
    images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
    dimensions: typeof p.dimensions === "string" ? JSON.parse(p.dimensions) : p.dimensions,
    room: typeof p.room === "string" ? p.room.split(",") : p.room,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    supportedBulbs: p.supportedBulbs && typeof p.supportedBulbs === "string" ? JSON.parse(p.supportedBulbs) : (p.supportedBulbs || []),
    application: p.application && typeof p.application === "string" ? JSON.parse(p.application) : (p.application || []),
    luminousFlux: p.luminousFlux || 0,
    recommendedArea: p.recommendedArea || "",
    lampBase: p.lampBase || "",
    bulbsIncluded: p.bulbsIncluded || false,
    material: p.material || "",
    protection: p.protection || "",
    warranty: p.warranty || "",
    description: p.description || "",
    finish: p.finish || "",
    voltage: p.voltage || "",
    cri: p.cri || "",
    installationType: p.installationType || "",
    unit: p.unit || "шт.",
    deliveryTime: p.deliveryTime || "В наличии",
  } as Product;
}
