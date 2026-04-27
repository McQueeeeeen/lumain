import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeProductImages } from "@/lib/product-media";
import { Product } from "@/types";

export interface CheckoutItem extends Product {
  quantity: number;
  subtotal: number;
}

interface CheckoutStore {
  items: CheckoutItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  getTotal: () => number;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const existing = get().items.find((item) => item.id === product.id);

        if (existing) {
          get().updateQuantity(product.id, existing.quantity + 1);
          return;
        }

        const price = product.discountPrice || product.price;
        set({
          items: [...get().items, { ...normalizeProductImages(product), quantity: 1, subtotal: price }],
        });
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((item) => item.id !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((item) => {
            if (item.id !== productId) {
              return item;
            }

            const price = item.discountPrice || item.price;
            return {
              ...item,
              quantity,
              subtotal: price * quantity,
            };
          }),
        }),
      clear: () => set({ items: [] }),
      getTotal: () => get().items.reduce((acc, item) => acc + item.subtotal, 0),
    }),
    {
      name: "checkout-storage",
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<CheckoutStore> | undefined;

        return {
          ...currentState,
          ...persisted,
          items: (persisted?.items ?? currentState.items).map((item) => normalizeProductImages(item)),
        };
      },
    }
  )
);
