import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Card } from "@/components/ui";
import { ProductCard } from "@/components/commerce/product-card";
import { RoleActionButton } from "@/components/commerce/role-action-button";
import { mountingLabels, roomLabels, styleLabels } from "@/lib/demo-data";
import { getProductByIdFromDb, getRelatedProductsFromDb } from "@/lib/data-fetching";
import { formatPrice } from "@/lib/utils";
import { ChevronRight, CircleCheck, LampDesk, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { id: true } });
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductByIdFromDb(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProductsFromDb(product.id);
  const currentPrice = product.discountPrice || product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#766A5F]">
        <Link href="/" className="hover:text-[#2D251E]">Главная</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/catalog" className="hover:text-[#2D251E]">Каталог</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#2D251E]">{product.name}</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden p-3">
          <div className="relative aspect-square overflow-hidden rounded-[4px] bg-[#F1ECE4]">
            {product.images?.[0] && (product.images[0].startsWith("/") || product.images[0].startsWith("http")) ? (
              <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#A66A3F]">Нет фото</div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{product.category}</Badge>
              <Badge variant="success">{product.stock > 0 ? `В наличии ${product.stock} шт` : "Под заказ"}</Badge>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">
              {product.brand} / Артикул {product.article}
            </div>
            <h1 className="font-display text-4xl font-semibold leading-none text-[#2D251E] md:text-5xl">
              {product.name}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#766A5F]">{product.description}</p>
          </div>

          <Card className="p-5">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-sm uppercase tracking-widest text-[#766A5F]">Цена</div>
                <div className="mt-1 text-4xl font-bold text-[#8E623E]">{formatPrice(currentPrice)}</div>
                {product.discountPrice ? (
                  <div className="mt-1 text-sm text-[#766A5F] line-through">{formatPrice(product.price)}</div>
                ) : null}
              </div>
              <div className="w-full rounded-[2px] bg-[#F1ECE4] px-4 py-3 text-left text-sm text-[#2D251E] sm:w-auto sm:text-right">
                <div className="font-semibold text-[#8E623E]">Статус: Актуально</div>
                <div className="text-[#766A5F]">{new Date(product.updatedAt).toLocaleDateString("ru-RU")}</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Fact icon={<Sparkles className="h-4 w-4" />} label="Световой поток" value={`${product.luminousFlux} лм`} />
              <Fact icon={<LampDesk className="h-4 w-4" />} label="Цветовая температура" value={product.lightColor} />
              <Fact icon={<Ruler className="h-4 w-4" />} label="Размеры" value={`${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} мм`} />
              <Fact icon={<ShieldCheck className="h-4 w-4" />} label="Защита и гарантия" value={`${product.protection} / ${product.warranty}`} />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <RoleActionButton product={product} />
              <Link href="/catalog">
                <Button variant="outline">Назад в каталог</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-3xl font-semibold text-[#2D251E]">Характеристики</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <SpecRow label="Артикул" value={product.article} />
              <SpecRow label="Бренд" value={product.brand} />
              <SpecRow label="Финиш / цвет" value={product.finish} />
              <SpecRow label="Материал" value={product.material} />
              <SpecRow label="Стиль" value={styleLabels[product.style]} />
              <SpecRow label="Монтаж" value={mountingLabels[product.mounting]} />
              <SpecRow label="Тип крепления" value={product.installationType} />
              <SpecRow label="Напряжение" value={product.voltage} />
              <SpecRow label="Цоколь" value={product.lampBase} />
              <SpecRow label="Мощность" value={`${product.power} Вт`} />
              <SpecRow label="CRI" value={product.cri} />
              <SpecRow label="Лампы" value={product.bulbsIncluded ? "В комплекте" : "Покупаются отдельно"} />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-3xl font-semibold text-[#2D251E]">Применение</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[2px] bg-[#F1ECE4] p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-[#8E623E]">Помещения</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.room.map((room) => (
                    <Badge key={room} variant="default">{roomLabels[room]}</Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-[2px] bg-[#F1ECE4] p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-[#8E623E]">Сценарии</div>
                <ul className="mt-2 space-y-2 text-sm text-[#2D251E]">
                  {product.application.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CircleCheck className="mt-0.5 h-4 w-4 text-[#A66A3F]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-[2px] border border-[rgba(166,106,63,0.18)] p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-[#8E623E]">Поддерживаемые лампы</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.supportedBulbs.map((bulb) => (
                  <span key={bulb} className="rounded-[2px] bg-white px-3 py-2 text-sm text-[#2D251E]">
                    {bulb}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Похожие позиции</div>
            <h2 className="font-display text-4xl font-semibold text-[#2D251E]">С этим товаром смотрят</h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-[#8E623E] hover:text-[#2D251E]">
            Вернуться в каталог
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[2px] bg-[#F1ECE4] px-4 py-3">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8E623E]">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-base font-semibold text-[#2D251E]">{value}</div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[rgba(166,106,63,0.18)] py-3 text-sm">
      <span className="text-[#766A5F]">{label}</span>
      <span className="text-right font-semibold text-[#2D251E]">{value}</span>
    </div>
  );
}
