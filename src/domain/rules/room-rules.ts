export type LightingRole = "main_light" | "task_light" | "accent_light" | "technical_light" | "decorative_light" | "led_strip" | "pendant" | "chandelier" | "wall_lamp" | "floor_lamp" | "spotlight" | "downlight";

export interface RoomRule {
  required: LightingRole[];
  optional: LightingRole[];
  productTypes: Record<string, string[]>; // maps lighting role to allowed product categories/types
}

export const ROOM_RULES: Record<string, RoomRule> = {
  kitchen: {
    required: ["main_light", "task_light"],
    optional: ["decorative_light"],
    productTypes: {
      main_light: ["surface_light", "track_light"],
      task_light: ["led_strip", "pendant"],
      decorative_light: ["pendant", "wall_lamp"],
    },
  },
  living_room: {
    required: ["main_light"],
    optional: ["accent_light", "technical_light"],
    productTypes: {
      main_light: ["chandelier"],
      accent_light: ["wall_lamp", "floor_lamp"],
      technical_light: ["spotlight"],
    },
  },
  bedroom: {
    required: ["main_light", "task_light"],
    optional: ["accent_light"],
    productTypes: {
      main_light: ["chandelier"],
      task_light: ["wall_lamp"],
      accent_light: ["led_strip"],
    },
  },
  bathroom: {
    required: ["main_light"],
    optional: ["task_light"],
    productTypes: {
      main_light: ["downlight"],
      task_light: ["wall_lamp"],
    },
  },
};

export function getLightingPlan(roomType: string): RoomRule | null {
  return ROOM_RULES[roomType] || null;
}
