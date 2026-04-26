import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewerRole = "client" | "designer" | "manager" | "admin";

interface ViewerStore {
  role: ViewerRole;
  setRole: (role: ViewerRole) => void;
}

export const useViewerStore = create<ViewerStore>()(
  persist(
    (set) => ({
      role: "client",
      setRole: (role) => set({ role }),
    }),
    {
      name: "viewer-role-storage",
    }
  )
);
