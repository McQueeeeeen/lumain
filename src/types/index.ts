export type Style = "modern" | "classic" | "loft" | "minimalism" | "art deco";
export type Room = "living room" | "bedroom" | "kitchen" | "hallway" | "bathroom";
export type MountingType = "ceiling" | "wall" | "track" | "recessed" | "pendant";
export type LightColor = "2700K" | "4000K" | "6000K";

export interface Product {
  id: string;
  name: string;
  article: string;
  brand: string;
  price: number;
  discountPrice?: number;
  category: string;
  style: Style;
  room: Room[];
  color: string;
  lightColor: LightColor;
  power: number;
  mounting: MountingType;
  images: string[];
  stock: number;
  updatedAt: string;
  luminousFlux: number;
  recommendedArea: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  lampBase: string;
  bulbsIncluded: boolean;
  supportedBulbs: string[];
  material: string;
  protection: string;
  warranty: string;
  description: string;
  finish: string;
  voltage: string;
  cri: string;
  installationType: string;
  application: string[];
  unit: string;
  deliveryTime: string;
}

export interface KPItem extends Product {
  quantity: number;
  kpDiscount: number;
  kpPrice: number;
  subtotal: number;
  roomLabel: string;
  managerLabel: string;
  managerComment: string;
  unit: string;
  deliveryTime: string;
}

export interface Proposal {
  id: string;
  number: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  managerName: string;
  date: string;
  validityPeriod: number;
  globalDiscount: number;
  items: KPItem[];
  notes?: string;
  status: "draft" | "sent" | "accepted" | "declined";
  total: number;
}

export interface Collection {
  id: string;
  name: string;
  designerId: string;
  items: string[];
  shareToken: string;
  createdAt?: string;
}
