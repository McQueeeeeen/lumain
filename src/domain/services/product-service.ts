import { Product } from "../entities";

export interface FilterParams {
  category?: string;
  style?: string;
  room?: string;
  includeOutOfStock?: boolean;
}

/**
 * Domain-level filtering logic for products.
 */
export function filterProducts(products: Product[], params: FilterParams): Product[] {
  return products.filter((product) => {
    // 1. Category check
    if (params.category && params.category !== "Все" && product.category !== params.category) {
      return false;
    }

    // 2. Style check (if styleTags includes the requested style)
    if (params.style && !product.styleTags.includes(params.style)) {
      return false;
    }

    // 3. Room check (if roomTags includes the requested room)
    if (params.room && !product.roomTags.includes(params.room)) {
      return false;
    }

    // 4. Stock status check
    if (!params.includeOutOfStock && product.stockStatus === "out_of_stock") {
      return false;
    }

    return true;
  });
}
