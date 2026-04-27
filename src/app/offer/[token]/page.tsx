import { OfferRepository } from "@/infrastructure/repositories/offer-repository";
import { formatCurrency } from "@/domain/services/pricing-service";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function PublicOfferPage({ 
  params 
}: { 
  params: Promise<{ token: string }> 
}) {
  const { token } = await params;
  const offerRepo = new OfferRepository();
  const offer = await offerRepo.getOfferByToken(token);

  if (!offer) {
    return notFound();
  }

  const data = offer.data as any;
  const { project, rooms, products, totals } = data;

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-20">
      {/* Premium Header */}
      <div className="bg-[#2D251E] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-[#A66A3F]">Коммерческое предложение</div>
          <h1 className="font-display text-4xl font-semibold md:text-6xl">
            {project.clientName}
          </h1>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#D4C3B3]">
            <div className="flex items-center gap-2">
              <span className="opacity-60">Проект:</span>
              <span>№{offer.versionNumber}-{project.id.slice(0, 4)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="opacity-60">Дата:</span>
              <span>{new Date(data.generatedAt).toLocaleDateString("ru-RU")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-[-40px] max-w-5xl px-4">
        {/* Project Summary */}
        <div className="mb-12 grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="rounded-[2px] bg-white p-8 shadow-xl">
            <h2 className="mb-6 font-display text-2xl font-semibold text-[#2D251E]">Детали проекта</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {rooms.map((room: any) => (
                <div key={room.id} className="border-l-2 border-[#A66A3F] pl-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#766A5F]">{room.type}</div>
                  <div className="mt-1 text-lg font-medium text-[#2D251E]">{room.area} м² • {room.style}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[2px] bg-[#A66A3F] p-8 text-white shadow-xl">
            <div className="text-xs font-bold uppercase tracking-widest opacity-80">Итоговая стоимость</div>
            <div className="mt-2 text-4xl font-bold">{formatCurrency(totals.finalTotal)}</div>
            {totals.discountTotal > 0 && (
              <div className="mt-2 text-sm opacity-90">Экономия: {formatCurrency(totals.discountTotal)}</div>
            )}
          </div>
        </div>

        {/* Product List grouped by room */}
        <div className="space-y-16">
          {rooms.map((room: any) => {
            const roomProducts = products.filter((p: any) => p.roomId === room.id);
            if (roomProducts.length === 0) return null;

            return (
              <section key={room.id}>
                <div className="mb-6 flex items-end gap-4">
                  <h3 className="font-display text-3xl font-semibold text-[#2D251E] capitalize">{room.type}</h3>
                  <div className="mb-1.5 h-px flex-1 bg-[rgba(166,106,63,0.18)]"></div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {roomProducts.map((p: any) => (
                    <div key={p.id} className="group overflow-hidden rounded-[2px] bg-white border border-[rgba(166,106,63,0.08)] transition-all hover:shadow-lg">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1ECE4]">
                        {p.product?.image_url && (
                          <Image
                            src={p.product.image_url}
                            alt={p.product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute top-3 left-3 rounded-[2px] bg-[#2D251E]/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                          {p.role}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#A66A3F]">{p.product?.brand}</div>
                        <h4 className="mt-1 font-display text-lg font-semibold text-[#2D251E]">{p.product?.name}</h4>
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <div className="text-[10px] text-[#766A5F]">Количество: {p.quantity} шт.</div>
                            <div className="mt-1 font-bold text-[#8E623E]">
                              {formatCurrency(p.product?.price * p.quantity * (1 - p.discountPercent / 100))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-20 border-t border-[rgba(166,106,63,0.18)] pt-12 text-center">
          <p className="text-[#766A5F]">Это предложение действительно в течение 14 дней.</p>
          <div className="mt-6 flex justify-center gap-8">
             <Link href="/" className="text-sm font-bold uppercase tracking-widest text-[#A66A3F] hover:underline">
               Вернуться на сайт
             </Link>
             <button className="text-sm font-bold uppercase tracking-widest text-[#A66A3F] hover:underline">
               Связаться с менеджером
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
