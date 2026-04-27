import { supabase } from "../supabase/client";
import { Product } from "../../domain/entities";

export class ProductRepository {
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error || !data) return [];
    
    return data.map(this.mapToEntity);
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    
    return this.mapToEntity(data);
  }

  private mapToEntity(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      article: data.article || "",
      brand: data.brand || "",
      category: data.category,
      price: data.price,
      stockStatus: data.stock_status,
      imageUrl: data.image_url,
      lumen: data.lumen || 0,
      description: data.description || "",
      dimensions: data.dimensions || { length: 0, width: 0, height: 0 },
      finish: data.finish || "",
      luminousFlux: data.luminous_flux || 0,
      lightColor: data.light_color || "",
      power: data.power || 0,
      styleTags: data.style_tags || [],
      roomTags: data.room_tags || [],
    };
  }
}
