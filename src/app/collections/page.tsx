"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, Plus, Share2, Trash2 } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { demoCollections } from "@/lib/demo-data";
import { useDesignerStore } from "@/store/designer-store";
import { useViewerStore } from "@/store/viewer-store";

const statuses = ["Активна", "Черновик", "Отправлена"];

export default function CollectionsPage() {
  const { role } = useViewerStore();
  const { items, removeItem, clear } = useDesignerStore();

  if (role !== "designer" && role !== "manager") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-semibold text-[#2D251E]">Доступ ограничен</h1>
        <p className="mt-4 text-[#766A5F]">Раздел подборок доступен только для дизайнеров и менеджеров.</p>
        <Link href="/catalog">
          <Button className="mt-8">Вернуться в каталог</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-5xl font-semibold leading-none text-[#2D251E] md:text-6xl">Подборки</h1>
        </div>
        <div className="flex gap-3">
          {items.length > 0 ? (
            <Button variant="outline" onClick={clear}>Очистить</Button>
          ) : null}
          <Link href="/catalog">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Добавить товары
            </Button>
          </Link>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-3xl font-semibold text-[#2D251E]">Текущая дизайнерская подборка</h2>
            <Badge variant="success">{items.length} позиций</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-[4/5] bg-[#F1ECE4]">
                  <Image src={item.images[0]} alt={item.name} fill sizes="(min-width: 1280px) 25vw, 100vw" className="object-cover" />
                </div>
                <div className="space-y-3 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#A66A3F]">
                    {item.brand} / {item.article}
                  </div>
                  <div className="font-display text-2xl font-semibold text-[#2D251E]">{item.name}</div>
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`/catalog/${item.id}`}>
                      <Button variant="outline" size="sm">Открыть</Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {demoCollections.map((collection, index) => (
          <Card key={collection.id} className="group flex cursor-pointer flex-col p-6 transition-all hover:border-[#A66A3F]">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#F1ECE4] text-[#A66A3F]">
                <Layers className="h-6 w-6" />
              </div>
              <Badge variant={index === 2 ? "success" : "default"}>{statuses[index]}</Badge>
            </div>

            <h3 className="mb-2 text-xl font-bold text-[#2D251E]">{collection.name}</h3>
            <div className="mb-8 flex items-center gap-4 text-sm text-[#766A5F]">
              <span>{collection.items.length} товара</span>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3 border-t border-[rgba(166,106,63,0.18)] pt-4">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <Share2 className="h-3 w-3" />
                Ссылка
              </Button>
              <Link href={`/collections/${collection.id}`} className="w-full">
                <Button size="sm" className="w-full gap-2 text-xs">
                  Открыть
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
