export const LUX_STANDARDS: Record<string, number> = {
  living_room: 200,
  kitchen: 400,
  bedroom: 150,
  bathroom: 300,
  hallway: 100,
  office: 500,
};

export interface LightingCalculation {
  totalLumensRequired: number;
  distribution: Record<string, number>; // lumens per role
}

/**
 * Calculate total required lumens for a room based on area and lux standards.
 */
export function calculateRequiredLumens(roomType: string, area: number): number {
  const lux = LUX_STANDARDS[roomType] || 150;
  return area * lux;
}

/**
 * Distribute total lumens across different lighting roles based on room type.
 */
export function getLightDistribution(roomType: string, totalLumens: number): Record<string, number> {
  if (roomType === "kitchen") {
    return {
      main_light: totalLumens * 0.45,
      task_light: totalLumens * 0.40,
      decorative_light: totalLumens * 0.15,
    };
  }
  
  if (roomType === "living_room") {
    return {
      main_light: totalLumens * 0.50,
      accent_light: totalLumens * 0.30,
      technical_light: totalLumens * 0.20,
    };
  }

  // Default distribution (e.g. for bedrooms, bathrooms)
  return {
    main_light: totalLumens * 0.70,
    accent_light: totalLumens * 0.30,
  };
}

/**
 * Estimate the quantity of a product needed to fulfill a target lumen requirement for a specific role.
 */
export function calculateQuantity(productLumen: number, targetLumens: number, role: string, area?: number): number {
  if (productLumen <= 0) {
    // Fallback for decorative items or when lumen is not specified
    if (role === "wall_lamp") return 2;
    if (role === "chandelier") return 1;
    return 1;
  }
  
  const baseQty = Math.ceil(targetLumens / productLumen);
  
  // Role-based heuristics
  if (role === "spotlight" || role === "downlight") {
    if (area) return Math.ceil(area / 1.5); // Rule: one spot per 1.5m2
    return Math.max(baseQty, 4); 
  }
  
  if (role === "wall_lamp") return 2;
  if (role === "chandelier") return 1;
  
  return baseQty;
}
