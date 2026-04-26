import { create } from "zustand";
import { persist } from "zustand/middleware";
import { KPItem, Product } from "@/types";

interface KPStore {
  items: KPItem[];
  globalDiscount: number;
  clientInfo: {
    name: string;
    phone: string;
    email: string;
    managerName: string;
    projectName: string;
    notes: string;
    validityPeriod: number;
  };
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateDiscount: (productId: string, discount: number) => void;
  updateItemMeta: (
    productId: string,
    payload: Partial<Pick<KPItem, "roomLabel" | "managerLabel" | "managerComment" | "unit" | "deliveryTime">>
  ) => void;
  setGlobalDiscount: (discount: number) => void;
  setClientInfo: (info: Partial<KPStore["clientInfo"]>) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useKPStore = create<KPStore>()(
  persist(
    (set, get) => ({
      items: [],
      globalDiscount: 0,
      clientInfo: {
        name: "",
        phone: "",
        email: "",
        managerName: "",
        projectName: "",
        notes: "",
        validityPeriod: 14,
      },
      addItem: (product) => {
        const existing = get().items.find((item) => item.id === product.id);
        if (existing) {
          get().updateQuantity(product.id, existing.quantity + 1);
          return;
        }

        const basePrice = product.discountPrice || product.price;
        const newItem: KPItem = {
          ...product,
          quantity: 1,
          kpDiscount: 0,
          kpPrice: basePrice,
          subtotal: basePrice,
          roomLabel: "",
          managerLabel: "",
          managerComment: "",
          unit: product.unit || "шт.",
          deliveryTime: product.deliveryTime || "В наличии",
        };

        set({ items: [...get().items, newItem] });
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((item) => item.id !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((item) =>
            item.id === productId
              ? { ...item, quantity, subtotal: item.kpPrice * quantity }
              : item
          ),
        }),
      updateDiscount: (productId, discount) =>
        set({
          items: get().items.map((item) => {
            if (item.id !== productId) {
              return item;
            }

            const basePrice = item.discountPrice || item.price;
            const kpPrice = basePrice * (1 - discount / 100);
            return {
              ...item,
              kpDiscount: discount,
              kpPrice,
              subtotal: kpPrice * item.quantity,
            };
          }),
        }),
      updateItemMeta: (productId, payload) =>
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, ...payload } : item
          ),
        }),
      setGlobalDiscount: (discount) => set({ globalDiscount: discount }),
      setClientInfo: (info) =>
        set({ clientInfo: { ...get().clientInfo, ...info } }),
      clearCart: () =>
        set({
          items: [],
          globalDiscount: 0,
          clientInfo: {
            name: "",
            phone: "",
            email: "",
            managerName: "",
            projectName: "",
            notes: "",
            validityPeriod: 14,
          },
        }),
      getTotal: () => {
        const itemsTotal = get().items.reduce((acc, item) => acc + item.subtotal, 0);
        return itemsTotal * (1 - get().globalDiscount / 100);
      },
    }),
    {
      name: "kp-storage",
    }
  )
);
