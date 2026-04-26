import Link from "next/link";
import { ProductCard } from "@/components/commerce/product-card";
import { SidebarFilters } from "@/components/commerce/sidebar-filters";
import { getProductsFromDb } from "@/lib/data-fetching";
import { CatalogHeader } from "@/components/commerce/catalog-header";

const chips = ["Все", "Люстры", "Бра", "Подвесы", "Споты"];

export default async function CatalogPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const style = typeof resolvedParams.style === "string" ? resolvedParams.style : undefined;
  const room = typeof resolvedParams.room === "string" ? resolvedParams.room : undefined;
  const minPrice = typeof resolvedParams.min === "string" ? parseInt(resolvedParams.min) : undefined;
  const maxPrice = typeof resolvedParams.max === "string" ? parseInt(resolvedParams.max) : undefined;
  const category = typeof resolvedParams.cat === "string" ? resolvedParams.cat : "Все";
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "new";

  const products = await getProductsFromDb({ q, style, room, minPrice, maxPrice, category });

  // Simple sorting in JS for now to keep it flexible
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "cheap") return a.price - b.price;
    if (sort === "expensive") return b.price - a.price;
    if (sort === "discount") return (b.discountPrice ? 1 : 0) - (a.discountPrice ? 1 : 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-10 grid gap-6 border-b border-[rgba(166,106,63,0.18)] pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Catalog</div>
          <h1 className="mt-2 font-display text-5xl font-semibold leading-none text-[#2D251E] md:text-6xl">
            Каталог Lumain
          </h1>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <SidebarFilters />

        <section>
          <CatalogHeader 
            category={category} 
            sort={sort} 
            resolvedParams={resolvedParams} 
            chips={chips} 
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sortedProducts.map((product, index) => (
              <div
                key={product.id}
                className="opacity-0 animate-[haydiEnter_560ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <button className="h-9 w-9 rounded-[2px] border border-[#A66A3F] bg-[#A66A3F] text-sm font-bold text-white">1</button>
            <button className="h-9 w-9 rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white text-sm font-bold text-[#766A5F]">2</button>
            <button className="h-9 rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white px-4 text-sm font-bold text-[#766A5F]">Далее</button>
          </div>
        </section>
      </div>
    </div>
  );
}
