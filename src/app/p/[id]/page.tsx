import Image from "next/image";
import { notFound } from "next/navigation";
import { Phone, Mail, Clock, ShieldCheck, CheckCircle2, LayoutGrid, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { KPItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button, Card, Badge } from "@/components/ui";

async function getProposal(id: string) {
  const proposal = await prisma.proposal.findUnique({
    where: { id },
  });
  if (!proposal) return null;
  
  return {
    ...proposal,
    items: JSON.parse(proposal.items) as KPItem[],
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
        {/* Header / Hero */}
        <header className="mb-12 text-center md:mb-20">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="font-display text-5xl font-semibold leading-tight text-[#2D251E] md:text-7xl">
            {proposal.projectName || "Предложение по освещению"}
          </h1>
          <p className="mt-4 text-lg text-[#766A5F]">
            Подготовлено для: <span className="font-semibold text-[#2D251E]">{proposal.clientName}</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#766A5F]">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Действительно до {new Date(proposal.date.getTime() + proposal.validityPeriod * 24 * 60 * 60 * 1000).toLocaleDateString("ru-RU")}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              КП №{proposal.number || proposal.id.slice(0, 8)}
            </div>
          </div>
        </header>

        {/* Manager Card */}
        <Card className="mb-16 border-[rgba(166,106,63,0.1)] bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1ECE4] font-display text-2xl font-bold text-[#A66A3F]">
                {proposal.managerName[0]}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Ваш менеджер</div>
                <div className="font-display text-3xl font-semibold text-[#2D251E]">{proposal.managerName}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" />
                Связаться
              </Button>
              <Button className="gap-2 bg-[#25D366] text-white hover:bg-[#128C7E]">
                <Mail className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </Card>

        {/* Items Showcase */}
        <div className="mb-20 space-y-16">
          <div className="flex items-center justify-between border-b border-[rgba(166,106,63,0.1)] pb-4">
            <h2 className="font-display text-4xl font-semibold text-[#2D251E]">Выбранные модели</h2>
            <Badge variant="info" className="text-base">{proposal.items.length} позиций</Badge>
          </div>

          {proposal.items.map((item, idx) => (
            <div key={idx} className="grid gap-10 md:grid-cols-2">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[4px] bg-[#F1ECE4]">
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
                  <Badge className="bg-white/90 text-[#2D251E] backdrop-blur-sm">{item.roomLabel || "Зона"}</Badge>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#A66A3F]">
                    {item.brand} / {item.article}
                  </div>
                  <h3 className="font-display text-4xl font-semibold text-[#2D251E]">{item.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
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
                  <div className="text-3xl font-bold text-[#8E623E]">{formatPrice(item.kpPrice)}</div>
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
        <Card className="overflow-hidden border-none bg-[#2D251E] p-10 text-white md:p-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-display text-5xl font-semibold">Итоговая стоимость</h2>
              <p className="text-[#B49F8B]">
                Цены действительны в течение {proposal.validityPeriod} дней. 
                Мы подготовили для вас персональное предложение с учетом всех скидок.
              </p>
              {proposal.notes && (
                <div className="text-sm text-[#766A5F]">
                  <div className="mb-2 font-bold uppercase tracking-widest text-[#A66A3F]">Примечание</div>
                  {proposal.notes}
                </div>
              )}
            </div>
            <div className="space-y-6 rounded-[4px] bg-white/5 p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between text-[#B49F8B]">
                <span>Сумма по каталогу</span>
                <span>{formatPrice(baseTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>Ваша выгода</span>
                <span>-{formatPrice(baseTotal * (1 - (1 - proposal.globalDiscount/100)) + (baseTotal - proposal.items.reduce((a,i) => a + i.subtotal, 0)))}</span>
              </div>
              <div className="border-t border-white/10 pt-6">
                <div className="text-xs uppercase tracking-widest text-[#B49F8B]">К оплате</div>
                <div className="mt-2 text-6xl font-bold text-[#D4C3B3]">{formatPrice(proposal.total)}</div>
              </div>
              <Button className="w-full bg-[#A66A3F] py-8 text-xl font-bold hover:bg-[#8E623E]">
                Оформить заказ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
