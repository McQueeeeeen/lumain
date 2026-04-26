"use client";

import { useViewerStore, type ViewerRole } from "@/store/viewer-store";

const roles: { id: ViewerRole; label: string }[] = [
  { id: "client", label: "Клиент" },
  { id: "designer", label: "Дизайнер" },
  { id: "manager", label: "Менеджер" },
  { id: "admin", label: "Админ" },
];

export function RoleSwitcher() {
  const { role, setRole } = useViewerStore();

  return (
    <div className="hidden items-center rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white p-1 lg:flex">
      {roles.map((item) => (
        <button
          key={item.id}
          onClick={() => setRole(item.id)}
          className={`rounded-[2px] px-3 py-1 text-xs font-semibold transition-colors ${
            role === item.id
              ? "bg-[#A66A3F] text-white"
              : "text-[#766A5F] hover:text-[#2D251E]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
