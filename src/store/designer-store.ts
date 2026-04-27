import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeProductImages } from "@/lib/product-media";
import { Product } from "@/types";

export interface DesignerItem extends Product {
  note: string;
}

interface DesignerStore {
  items: DesignerItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

export const useDesignerStore = create<DesignerStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) {
          return;
        }

        set({
          items: [...get().items, { ...normalizeProductImages(product), note: "" }],
        });
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((item) => item.id !== productId) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "designer-storage",
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<DesignerStore> | undefined;

        return {
          ...currentState,
          ...persisted,
          items: (persisted?.items ?? currentState.items).map((item) => normalizeProductImages(item)),
        };
      },
    }
  )
);
