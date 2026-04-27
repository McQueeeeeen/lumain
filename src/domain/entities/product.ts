export interface Product {
  id: string;
  name: string;
  article: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  stockStatus: string;
  imageUrl: string;
  images?: string[];
  lumen: number;
  description: string;
  dimensions: { length: number; width: number; height: number };
  finish: string;
  luminousFlux: number;
  lightColor: string;
  power: number;
  recommendedArea?: string;
  lampBase?: string;
  styleTags: string[];
  roomTags: string[];
}
