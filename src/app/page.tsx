import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";
import { getProductsFromDb } from "@/lib/data-fetching";
import { formatPrice } from "@/lib/utils";

const categories = ["Люстры", "Бра", "Подвесы", "Споты", "Трековый свет"];
const brandLogos = ["FLOS", "ARTEMIDE", "VIBIA", "MASIERO", "BROKIS"];

export default async function Home() {
  const allProducts = await getProductsFromDb();
  const heroProduct = allProducts[0] || null;
  const arrivals = allProducts.slice(1, 5);

  if (!heroProduct) {
    return <div>No products found. Please seed the database.</div>;
  }

  return (
    <div className="space-y-0">
      <section className="min-h-[calc(100vh-var(--lumain-header-height))] border-b border-[rgba(166,106,63,0.18)] bg-[#FAF9F5]">
        <div className="mx-auto grid min-h-[calc(100vh-var(--lumain-header-height))] max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl opacity-0 animate-[haydiEnter_560ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#8E623E]">
              <CheckCircle2 className="h-4 w-4" />
              Каталог актуален
            </div>
            <h1 className="font-display text-5xl font-semibold leading-none tracking-tight text-[#2D251E] md:text-7xl">
              Свет, который легко выбрать и легко продать
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#766A5F]">
              Премиальная витрина для салона светотехники: понятные карточки, актуальные цены, наличие, характеристики света и быстрые КП для клиента.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link 
                href="/catalog" 
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-[#A66A3F] px-8 text-base font-semibold text-white shadow-sm shadow-[#A66A3F]/20 transition-all hover:bg-[#8E623E] sm:w-auto"
              >
                Открыть каталог <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/collections" 
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-[#8E623E]/45 bg-transparent px-8 text-base font-semibold text-[#2D251E] transition-all hover:bg-[#F1ECE4] sm:w-auto"
              >
                <Sparkles className="h-5 w-5" />
                Moodboard
              </Link>
            </div>
          </div>

          <div className="haydi-surface p-3 opacity-0 animate-[haydiEnter_560ms_cubic-bezier(0.16,1,0.3,1)_100ms_forwards]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-[#F1ECE4]">
              <Image src="https://images.unsplash.com/photo-1540634149021-397449563220?auto=format&fit=crop&q=80&w=800" alt={heroProduct.name} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover transition-transform duration-[2000ms] hover:scale-110" />
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">{heroProduct.brand}</div>
                <h2 className="font-display text-3xl font-semibold text-[#2D251E]">{heroProduct.name}</h2>
                <p className="mt-2 text-sm text-[#766A5F]">
                  {heroProduct.luminousFlux} лм / {heroProduct.recommendedArea} / {heroProduct.lampBase}
                </p>
              </div>
              <div className="text-2xl font-bold text-[#8E623E]">{formatPrice(heroProduct.discountPrice || heroProduct.price)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(166,106,63,0.18)] bg-white py-5">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4">
          {categories.map((category) => (
            <Link key={category} href="/catalog" className="whitespace-nowrap rounded-[2px] border border-[rgba(166,106,63,0.18)] px-4 py-2 text-sm font-semibold text-[#766A5F] transition-colors hover:border-[#A66A3F] hover:text-[#2D251E]">
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Новые поступления</div>
            <h2 className="font-display text-4xl font-semibold text-[#2D251E]">Ассиметричная витрина</h2>
          </div>
          <Link href="/catalog" className="hidden text-sm font-bold text-[#8E623E] sm:inline-flex">
            Все товары
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-4 md:grid-rows-2">
          {arrivals.map((product, index) => (
            <Link
              key={product.id}
              href={`/catalog/${product.id}`}
              className={`group haydi-surface overflow-hidden opacity-0 animate-[haydiEnter_560ms_cubic-bezier(0.16,1,0.3,1)_forwards] ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F1ECE4]">
                {product.images?.[0] && (product.images[0].startsWith("/") || product.images[0].startsWith("http")) ? (
                  <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 768px) 25vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#A66A3F]">No photo</div>
                )}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
              </div>
              <div className="p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A66A3F]">{product.category}</div>
                <h3 className="mt-1 font-display text-2xl font-semibold text-[#2D251E] group-hover:text-[#A66A3F] transition-colors">{product.name}</h3>
                <div className="mt-2 text-sm font-bold text-[#8E623E]">{formatPrice(product.discountPrice || product.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#F1ECE4] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Для дизайнеров и менеджеров</div>
            <h2 className="mt-2 font-display text-4xl font-semibold text-[#2D251E]">Подборка, КП и данные 1C в одном сценарии</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Актуально" text="Цены и остатки всегда соответствуют текущему складу." />
            <Feature icon={<FileText className="h-5 w-5" />} title="Быстро" text="Товар добавляется в КП без повторного ввода характеристик." />
            <Feature icon={<Sparkles className="h-5 w-5" />} title="Красиво" text="Moodboard помогает показать подборку клиенту как готовый проект." />
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(166,106,63,0.18)] bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 text-sm font-bold uppercase tracking-widest text-[#766A5F]">
          {brandLogos.map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="lumain-surface bg-white p-5">
      <div className="mb-4 text-[#A66A3F]">{icon}</div>
      <h3 className="font-display text-2xl font-semibold text-[#2D251E]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#766A5F]">{text}</p>
    </div>
  );
}
