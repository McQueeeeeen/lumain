"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface CatalogHeaderProps {
  category: string;
  sort: string;
  resolvedParams: any;
  chips: string[];
}

export function CatalogHeader({ category, sort, resolvedParams, chips }: CatalogHeaderProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(resolvedParams as any);
    params.set("sort", e.target.value);
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
        {chips.map((chip) => {
          const isActive = category === chip;
          const params = new URLSearchParams(resolvedParams as any);
          params.set("cat", chip);
          
          return (
            <Link
              key={chip}
              href={`/catalog?${params.toString()}`}
              className={`whitespace-nowrap rounded-[2px] border px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                isActive
                  ? "border-[#A66A3F] bg-[#A66A3F] text-white shadow-md"
                  : "border-[rgba(166,106,63,0.18)] bg-white text-[#766A5F] hover:border-[#A66A3F] hover:text-[#2D251E]"
              }`}
            >
              {chip}
            </Link>
          );
        })}
      </div>
      <select 
        value={sort}
        onChange={handleSortChange}
        className="h-10 rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white px-3 text-sm text-[#2D251E] outline-none focus:border-[#A66A3F]"
      >
        <option value="new">Сначала новые</option>
        <option value="cheap">Сначала дешевле</option>
        <option value="expensive">Сначала дороже</option>
        <option value="discount">По размеру скидки</option>
      </select>
    </div>
  );
}
