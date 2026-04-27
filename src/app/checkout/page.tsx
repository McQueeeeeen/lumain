"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useCheckoutStore } from "@/store/checkout-store";

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clear, getTotal } = useCheckoutStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="font-display text-5xl font-semibold leading-none text-[#2D251E] md:text-6xl">
            Покупка
          </h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={clear} disabled={items.length === 0}>
            Очистить
          </Button>
          <Link 
            href="/catalog" 
            className="inline-flex h-10 items-center justify-center rounded-[2px] bg-[#A66A3F] px-5 text-sm font-semibold text-white shadow-sm shadow-[#A66A3F]/20 transition-all hover:bg-[#8E623E]"
          >
            Продолжить выбор
          </Link>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <Card className="flex flex-col items-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F1ECE4]">
                <ShoppingBag className="h-8 w-8 text-[#A66A3F]" />
              </div>
              <h2 className="font-display text-3xl font-semibold text-[#2D251E]">Корзина пуста</h2>
              <Link 
                href="/catalog" 
                className="mt-6 inline-flex h-10 items-center justify-center rounded-[2px] bg-[#A66A3F] px-5 text-sm font-semibold text-white transition-all hover:bg-[#8E623E]"
              >
                Перейти в каталог
              </Link>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="flex gap-4 p-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-[4px] bg-[#F1ECE4]">
                  <Image src={item.images[0]} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[#A66A3F]">
                      {item.brand} / {item.article}
                    </div>
                    <div className="font-display text-2xl font-semibold text-[#2D251E]">{item.name}</div>
                    <div className="text-sm text-[#766A5F]">{item.finish}</div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex h-10 items-center rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-3 text-[#766A5F]">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-10 px-2 text-center text-sm font-semibold text-[#2D251E]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 text-[#766A5F]">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#8E623E]">{formatPrice(item.subtotal)}</div>
                        <div className="text-xs text-[#766A5F]">{formatPrice(item.discountPrice || item.price)} за шт</div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card className="h-fit p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-[#766A5F]">
              <span>Товаров</span>
              <span>{items.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[#766A5F]">
              <span>Сумма</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
            <div className="border-t border-[rgba(166,106,63,0.18)] pt-4">
              <div className="flex items-end justify-between gap-4">
                <span className="font-semibold text-[#2D251E]">Итого</span>
                <span className="text-4xl font-bold leading-none text-[#8E623E]">{formatPrice(getTotal())}</span>
              </div>
            </div>
            <Button className="w-full">Оформить заказ</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
