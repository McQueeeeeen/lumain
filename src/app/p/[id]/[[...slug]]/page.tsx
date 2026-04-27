import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Mail, Clock, ShieldCheck, CheckCircle2, Download, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { KPItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Card, Badge } from "@/components/ui";
import { ProposalActions } from "@/components/commerce/proposal-actions";

async function getProposal(id: string) {
  const proposal = await prisma.proposal.findUnique({
    where: { id },
  });
  if (!proposal) return null;
  
  return {
    ...proposal,
    items: proposal.items as any as KPItem[],
  };
}

export default async function PublicProposalPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const proposal = await getProposal(id);
  
  if (!proposal) {
    notFound();
  }

  const baseTotal = proposal.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-20 pt-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Actions Bar - Client Side */}
        <ProposalActions proposal={proposal} />

        {/* Header / Hero */}
        <header className="mb-12 text-center md:mb-20 print:mb-10 print:text-left">
          <div className="flex items-center justify-between print:mb-8">
             <div className="hidden items-center gap-2 text-xl font-bold tracking-tight text-[#2D251E] print:flex">
                <Layers className="h-6 w-6 text-[#A66A3F]" />
                <span className="font-display">Haydi <span className="font-normal text-[#766A5F]">light</span></span>
             </div>
             <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 print:hidden">
               <ShieldCheck className="h-6 w-6" />
             </div>
          </div>
          
          <h1 className="font-display text-5xl font-semibold leading-tight text-[#2D251E] md:text-7xl print:text-4xl">
            {proposal.projectName || "Предложение по освещению"}
          </h1>
          <p className="mt-4 text-lg text-[#766A5F]">
            Подготовлено для: <span className="font-semibold text-[#2D251E]">{proposal.clientName}</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#766A5F] print:justify-start">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Действительно до {new Date(proposal.createdAt.getTime() + (proposal.validityPeriod || 30) * 24 * 60 * 60 * 1000).toLocaleDateString("ru-RU")}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              КП №{proposal.number || proposal.id.slice(0, 8)}
            </div>
          </div>
        </header>

        {/* Manager Card */}
        <Card className="mb-16 border-[rgba(166,106,63,0.1)] bg-white p-8 shadow-sm print:hidden">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1ECE4] font-display text-2xl font-bold text-[#A66A3F]">
                {(proposal.managerName || "M")[0]}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Ваш менеджер</div>
                <div className="font-display text-3xl font-semibold text-[#2D251E]">{proposal.managerName}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href={`tel:${proposal.clientPhone || ""}`} className={!proposal.clientPhone ? "pointer-events-none opacity-50" : ""}>
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-[2px] border border-[rgba(166,106,63,0.22)] bg-transparent px-6 text-sm font-bold uppercase tracking-wider text-[#2D251E] transition-all hover:bg-[#F1ECE4]">
                  <Phone className="h-4 w-4" />
                  Позвонить
                </button>
              </Link>
              <Link 
                href={`https://wa.me/?text=${encodeURIComponent(`Здравствуйте! Я по поводу КП №${proposal.number || proposal.id.slice(0, 8)} (${proposal.projectName})`)}`}
                target="_blank"
              >
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-[2px] bg-[#25D366] px-6 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-[#128C7E]">
                  <Mail className="h-4 w-4" />
                  WhatsApp
                </button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Items Showcase */}
        <div className="mb-20 space-y-16 print:space-y-8">
          <div className="flex items-center justify-between border-b border-[rgba(166,106,63,0.1)] pb-4">
            <h2 className="font-display text-4xl font-semibold text-[#2D251E] print:text-2xl">Выбранные модели</h2>
            <Badge variant="info" className="text-base">{proposal.items.length} позиций</Badge>
          </div>

          {proposal.items.map((item, idx) => (
            <div key={idx} className="grid gap-10 md:grid-cols-2 print:grid-cols-1 print:gap-4 print:break-inside-avoid">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[2px] bg-[#F1ECE4] print:aspect-[16/9]">
                {item.images && item.images[0] && (item.images[0].startsWith("/") || item.images[0].startsWith("http")) ? (
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#A66A3F]">No photo</div>
                )}
                <div className="absolute left-4 top-4">
                  <Badge className="bg-white/90 text-[#2D251E] backdrop-blur-sm shadow-sm">{item.roomLabel || "Зона"}</Badge>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-6 print:space-y-2">
                <div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#A66A3F]">
                    {item.brand} / {item.article}
                  </div>
                  <h3 className="font-display text-4xl font-semibold text-[#2D251E] print:text-xl">{item.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm print:gap-2">
                  <div className="space-y-1">
                    <div className="text-[#766A5F]">Отделка</div>
                    <div className="font-semibold text-[#2D251E]">{item.finish}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[#766A5F]">Свет</div>
                    <div className="font-semibold text-[#2D251E]">{item.luminousFlux} лм / {item.lightColor}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[#766A5F]">Размеры</div>
                    <div className="font-semibold text-[#2D251E]">
                      {item.dimensions?.length}x{item.dimensions?.width}x{item.dimensions?.height} мм
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[#766A5F]">Наличие</div>
                    <div className={`font-semibold ${item.stock > 0 ? "text-emerald-600" : "text-[#A66A3F]"}`}>
                      {item.deliveryTime || (item.stock > 0 ? "В наличии" : "Под заказ")}
                    </div>
                  </div>
                </div>

                {item.managerComment && (
                  <div className="rounded-[2px] border-l-4 border-[#A66A3F] bg-[#F1ECE4] p-4 text-sm italic text-[#766A5F]">
                    « {item.managerComment} »
                  </div>
                )}

                <div className="flex items-baseline gap-4 pt-4">
                  <div className="text-3xl font-bold text-[#8E623E] print:text-xl">{formatPrice(item.kpPrice)}</div>
                  <div className="text-sm font-semibold text-[#766A5F]">× {item.quantity} {item.unit}</div>
                  {item.kpDiscount > 0 && (
                    <Badge variant="success">Скидка {item.kpDiscount}%</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <Card className="overflow-hidden border-none bg-[#2D251E] p-10 text-white md:p-16 print:bg-white print:text-black print:border print:border-gray-200">
          <div className="grid gap-12 lg:grid-cols-2 print:grid-cols-1">
            <div className="space-y-6">
              <h2 className="font-display text-5xl font-semibold print:text-2xl">Итоговая стоимость</h2>
              <p className="text-[#B49F8B] print:text-gray-600">
                Цены действительны в течение {proposal.validityPeriod} дней. 
                Мы подготовили для вас персональное предложение с учетом всех скидок.
              </p>
              {proposal.notes && (
                <div className="text-sm">
                  <div className="mb-2 font-bold uppercase tracking-widest text-[#A66A3F]">Примечание</div>
                  <div className="text-[#766A5F] print:text-gray-600">{proposal.notes}</div>
                </div>
              )}
            </div>
            <div className="space-y-6 rounded-[4px] bg-white/5 p-8 backdrop-blur-sm print:bg-gray-50 print:backdrop-none">
              <div className="flex items-center justify-between text-[#B49F8B] print:text-gray-600">
                <span>Сумма по каталогу</span>
                <span>{formatPrice(baseTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400 print:text-emerald-700">
                <span>Ваша выгода</span>
                <span>-{formatPrice(baseTotal - Number(proposal.total))}</span>
              </div>
              <div className="border-t border-white/10 pt-6 print:border-gray-200">
                <div className="text-xs uppercase tracking-widest text-[#B49F8B] print:text-gray-600">К оплате</div>
                <div className="mt-1 font-display text-4xl font-bold text-white print:text-3xl print:text-black">{formatPrice(Number(proposal.total) || 0)}</div>
              </div>
              <button className="w-full rounded-[2px] bg-[#A66A3F] py-8 text-xl font-bold uppercase tracking-widest text-white transition-all hover:bg-[#8E623E] print:hidden">
                Оформить заказ
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
