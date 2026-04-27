"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui";
import { Room, Style } from "@/types";

const styles: { label: string; value: Style }[] = [
  { label: "Современный", value: "modern" },
  { label: "Классика", value: "classic" },
  { label: "Лофт", value: "loft" },
  { label: "Минимализм", value: "minimalism" },
  { label: "Art deco", value: "art deco" },
];

const rooms: { label: string; value: Room }[] = [
  { label: "Гостиная", value: "living room" },
  { label: "Спальня", value: "bedroom" },
  { label: "Кухня", value: "kitchen" },
  { label: "Прихожая", value: "hallway" },
  { label: "Ванная", value: "bathroom" },
];

export const colors = [
  { name: "Белый", value: "white", hex: "#FFFFFF" },
  { name: "Черный", value: "black", hex: "#000000" },
  { name: "Золото", value: "gold", hex: "#D4AF37" },
  { name: "Хром", value: "chrome", hex: "#C0C0C0" },
  { name: "Бронза", value: "bronze", hex: "#CD7F32" },
];

export function SidebarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedStyle, setSelectedStyle] = useState(searchParams.get("style") || "");
  const [selectedRooms, setSelectedRooms] = useState<string[]>(searchParams.get("room")?.split(",") || []);
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");

  const handleApply = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedStyle) params.set("style", selectedStyle);
    if (selectedRooms.length > 0) params.set("room", selectedRooms.join(","));
    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);
    
    router.push(`/catalog?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedStyle("");
    setSelectedRooms([]);
    setMinPrice("");
    setMaxPrice("");
    router.push("/catalog");
  };

  const toggleRoom = (room: string) => {
    setSelectedRooms(prev => 
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    );
  };

  return (
    <aside className="lumain-surface h-fit min-w-0 w-full p-4 lg:sticky lg:top-20 lg:w-60">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-[#2D251E]">Фильтр</h2>
        <button 
          onClick={handleReset}
          className="min-h-10 px-2 text-xs font-bold uppercase tracking-widest text-[#766A5F] hover:text-[#A66A3F]"
        >
          Reset
        </button>
      </div>

      <div className="space-y-7">
        <FilterGroup title="Поиск">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Артикул или имя..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white pl-3 pr-8 text-sm outline-none focus:border-[#A66A3F]" 
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#766A5F]">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </FilterGroup>

        <FilterGroup title="Стиль">
          <div className="grid grid-cols-2 gap-2">
            {styles.map((style) => (
              <button 
                key={style.value} 
                onClick={() => setSelectedStyle(selectedStyle === style.value ? "" : style.value)}
                className={`min-h-[44px] min-w-0 rounded-[2px] border px-2 py-2 text-xs font-semibold transition-colors ${
                  selectedStyle === style.value 
                    ? "border-[#A66A3F] bg-[#F1ECE4] text-[#2D251E]" 
                    : "border-[rgba(166,106,63,0.18)] text-[#766A5F] hover:border-[#A66A3F]"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Помещение">
          <div className="grid gap-2">
            {rooms.map((room) => (
              <label key={room.value} className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm text-[#766A5F] hover:text-[#2D251E]">
                <input 
                  type="checkbox" 
                  checked={selectedRooms.includes(room.value)}
                  onChange={() => toggleRoom(room.value)}
                  className="h-4 w-4 rounded-none border border-[rgba(166,106,63,0.45)] text-[#A66A3F] focus:ring-[#A66A3F]" 
                />
                {room.label}
              </label>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Цена">
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="number" 
              placeholder="От" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-10 rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white px-3 text-sm outline-none focus:border-[#A66A3F]" 
            />
            <input 
              type="number" 
              placeholder="До" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-10 rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white px-3 text-sm outline-none focus:border-[#A66A3F]" 
            />
          </div>
        </FilterGroup>

        <Button className="w-full min-h-[44px] gap-2" onClick={handleApply}>
          <Search className="h-4 w-4" />
          Применить
        </Button>
      </div>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#8E623E]">{title}</div>
      {children}
    </div>
  );
}
