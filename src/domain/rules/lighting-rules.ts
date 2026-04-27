export type LightingRole = "main_light" | "task_light" | "accent_light" | "technical_light" | "decorative_light";

export interface RoomRule {
  required: LightingRole[];
  optional: LightingRole[];
  descriptions: Record<string, string>;
}

export const ROOM_RULES: Record<string, RoomRule> = {
  kitchen: {
    required: ["main_light", "task_light"],
    optional: ["decorative_light"],
    descriptions: {
      main_light: "Общее освещение (накладной или трековый свет)",
      task_light: "Рабочая зона (LED-лента или подвесы над островом)",
    }
  },
  living_room: {
    required: ["main_light", "accent_light"],
    optional: ["technical_light"],
    descriptions: {
      main_light: "Центральная люстра",
      accent_light: "Бра или торшеры для настроения",
      technical_light: "Споты для подсветки картин или стен",
    }
  },
  bedroom: {
    required: ["main_light", "task_light"],
    optional: ["accent_light"],
    descriptions: {
      main_light: "Основная люстра",
      task_light: "Прикроватные бра для чтения",
    }
  },
  bathroom: {
    required: ["main_light"],
    optional: ["task_light"],
    descriptions: {
      main_light: "Влагозащищенные даунлайты",
      task_light: "Подсветка зеркала",
    }
  }
};

export function getLightingPlan(roomType: string) {
  const rule = ROOM_RULES[roomType];
  if (!rule) {
    return { required: ["main_light"], optional: [] };
  }
  return rule;
}
