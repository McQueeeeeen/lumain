"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/domain/entities";
import { RoleActionButton } from "@/components/commerce/role-action-button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/catalog/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F1ECE4]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#A66A3F]">Нет фото</div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant="info">{product.category}</Badge>
            {product.stockStatus === "in_stock" ? (
              <Badge variant="success">В наличии</Badge>
            ) : (
              <Badge variant="warning">Под заказ</Badge>
            )}
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#A66A3F]">
                {product.brand} / {product.article}
              </div>
              <span className="text-[#8E623E] transition-colors group-hover:text-[#2D251E]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <h3 className="font-display text-2xl font-semibold leading-tight text-[#2D251E] transition-colors group-hover:text-[#8E623E]">
              {product.name}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-[#766A5F]">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-[#766A5F]">
            <div className="rounded-[2px] bg-[#F1ECE4] px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-widest">Свет</div>
              <div className="mt-1 font-semibold text-[#2D251E]">{product.luminousFlux} лм / {product.lightColor}</div>
            </div>
            <div className="rounded-[2px] bg-[#F1ECE4] px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-widest">Мощность</div>
              <div className="mt-1 font-semibold text-[#2D251E]">{product.power} Вт</div>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex items-end justify-between gap-4 border-t border-[rgba(166,106,63,0.18)] px-4 pb-4 pt-4">
        <div>
          <div className="text-xl font-bold text-[#8E623E]">{formatPrice(product.price)}</div>
          <div className="text-xs text-[#766A5F]">{product.finish}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-[2px] bg-[#A66A3F] text-white">
          <ShoppingBag className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
