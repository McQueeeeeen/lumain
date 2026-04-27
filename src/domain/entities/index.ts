export type UserRole = "admin" | "manager" | "designer";

export interface Profile {
  id: string;
  fullName: string;
  role: UserRole;
}

export interface Project {
  id: string;
  clientName: string;
  managerName: string;
  ownerId: string;
  status: "draft" | "sent" | "approved" | "completed";
  createdAt: string;
}

export interface Room {
  id: string;
  projectId: string;
  type: "kitchen" | "living_room" | "bedroom" | "bathroom" | "hallway" | "office";
  area: number;
  style: string;
  budget?: string;
}

import { Product } from "./product";
export type { Product };

export interface ProjectProduct {
  id: string;
  projectId: string;
  roomId: string;
  productId: string;
  quantity: number;
  discountPercent: number;
  role: string; // main_light, task_light, etc.
}

export interface OfferVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  data: Record<string, unknown>; // Snapshot of the project state
  publicToken: string;
  isActive: boolean;
}

export interface Comment {
  id: string;
  projectId: string;
  message: string;
  authorId: string;
  authorType: "manager" | "client";
  createdAt: string;
}
