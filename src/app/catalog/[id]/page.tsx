import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Card } from "@/components/ui";
import { ProductRepository } from "@/infrastructure/repositories/product-repository";
import { formatPrice } from "@/lib/utils";
import { ChevronRight, CircleCheck, LampDesk, Ruler, ShieldCheck, Sparkles } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productRepo = new ProductRepository();
  const product = await productRepo.getProductById(id);

  if (!product) {
    notFound();
  }

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
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#A66A3F]">Нет фото</div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{product.category}</Badge>
              <Badge variant="success">{product.stockStatus === "in_stock" ? "В наличии" : "Под заказ"}</Badge>
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
                <div className="mt-1 text-4xl font-bold text-[#8E623E]">{formatPrice(product.price)}</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Fact icon={<Sparkles className="h-4 w-4" />} label="Световой поток" value={`${product.luminousFlux} лм`} />
              <Fact icon={<LampDesk className="h-4 w-4" />} label="Цветовая температура" value={product.lightColor} />
              <Fact icon={<Ruler className="h-4 w-4" />} label="Размеры" value={`${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} мм`} />
              <Fact icon={<ShieldCheck className="h-4 w-4" />} label="Мощность" value={`${product.power} Вт`} />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
               <Button className="gap-2">
                  Добавить в проект
               </Button>
              <Link href="/catalog">
                <Button variant="outline">Назад в каталог</Button>
              </Link>
            </div>
          </Card>
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
