import { cache } from "react";
import { ProductRepository } from "@/infrastructure/repositories/product-repository";
import { filterProducts } from "@/domain/services/product-service";
import { Product } from "@/domain/entities";

type ProductFilters = {
  q?: string;
  style?: string;
  room?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
};

const productRepo = new ProductRepository();

export const getProductsFromDb = cache(async (filters: ProductFilters = {}) => {
  const products = await productRepo.getAllProducts();
  
  return filterProducts(products as Product[], {
    category: filters.category,
    style: filters.style,
    room: filters.room,
  });
});

export const getProductByIdFromDb = cache(async (id: string) => {
  return await productRepo.getProductById(id);
});

export const getRelatedProductsFromDb = cache(async (currentId: string, limit = 3) => {
  const products = await productRepo.getAllProducts();
  return products.filter((product) => product.id !== currentId).slice(0, limit);
});
