import Image from "next/image";
import { Calendar, Layers, MapPin } from "lucide-react";
import { Badge } from "@/components/ui";
import { demoCollections, demoProducts } from "@/lib/demo-data";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return demoCollections.map((collection) => ({ id: collection.id }));
}

export default async function PublicCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = demoCollections.find((item) => item.id === id) || demoCollections[0];
  const products = demoProducts.filter((product) => collection.items.includes(product.id));

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-slate-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
            <Layers className="h-8 w-8" />
          </div>
          <h1 className="mx-auto mb-4 max-w-3xl text-4xl font-black tracking-tight text-slate-900">
            Подборка для проекта: {collection.name}
          </h1>
          <div className="flex flex-col items-center justify-center gap-3 text-sm font-medium text-slate-500 sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Караганда, Казахстан
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> 26 апреля 2026
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-24">
          {products.map((product, index) => (
            <div key={product.id} className={`flex flex-col items-center gap-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl shadow-slate-200 md:w-1/2">
                <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
              </div>
              <div className="w-full space-y-6 md:w-1/2">
                <Badge variant="info">{product.category}</Badge>
                <h2 className="text-3xl font-bold text-slate-900">{product.name}</h2>
                <p className="leading-relaxed text-slate-600">
                  Подходит для проекта, где важны аккуратный свет, актуальная цена и понятное наличие на складе.
                </p>
                <div className="flex items-center justify-between border-t pt-6">
                  <div className="text-sm font-bold uppercase tracking-widest text-slate-400">{product.article}</div>
                  <div className="text-2xl font-black text-slate-900">{formatPrice(product.discountPrice || product.price)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-32 max-w-4xl rounded-3xl bg-slate-900 p-10 text-center text-white">
          <h2 className="mb-4 text-3xl font-black">Понравилась подборка?</h2>
          <p className="mx-auto mb-8 max-w-lg text-slate-400">
            Менеджер может сразу перевести эти позиции в коммерческое предложение с актуальными ценами.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 font-bold text-indigo-400">AM</div>
            <div className="text-left">
              <div className="font-bold">Анна М.</div>
              <div className="text-xs font-medium text-slate-500">Интерьерный дизайнер</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
