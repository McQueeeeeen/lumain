import Link from "next/link";
import { ProductCard } from "@/components/commerce/product-card";
import { SidebarFilters } from "@/components/commerce/sidebar-filters";
import { ProductRepository } from "@/infrastructure/repositories/product-repository";
import { CatalogHeader } from "@/components/commerce/catalog-header";
import { filterProducts } from "@/domain/services/product-service";

const chips = ["Все", "Люстры", "Бра", "Подвесы", "Споты"];

export default async function CatalogPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.cat === "string" ? resolvedParams.cat : "Все";
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "new";

  // Use Repository instead of direct DB or demo data
  const productRepo = new ProductRepository();
  const products = await productRepo.getAllProducts();

  // Use Domain Service for filtering
  const filteredProducts = filterProducts(products, {
    category: category !== "Все" ? category : undefined,
    style: typeof resolvedParams.style === "string" ? resolvedParams.style : undefined,
    room: typeof resolvedParams.room === "string" ? resolvedParams.room : undefined,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-10 grid gap-6 border-b border-[rgba(166,106,63,0.18)] pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Catalog</div>
          <h1 className="mt-2 font-display text-5xl font-semibold leading-none text-[#2D251E] md:text-6xl">
            Каталог Haydi
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

          {filteredProducts.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-[2px] border border-dashed border-[rgba(166,106,63,0.18)] text-[#766A5F]">
              Пока здесь пусто. Мы скоро добавим новые товары.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="opacity-0 animate-[lumainEnter_560ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
