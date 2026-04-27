import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { formatPrice } from "@/lib/utils";
import { Button, Card, Badge } from "@/components/ui";
import { FileText, User, Calendar, ExternalLink, Trash2 } from "lucide-react";

export default async function AdminProposalsPage() {
  const proposals = await prisma.proposal.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-5xl font-semibold text-[#2D251E]">История КП</h1>
          <p className="mt-2 text-[#766A5F]">Список всех созданных коммерческих предложений.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {proposals.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="mb-4 h-12 w-12 text-[#F1ECE4]" />
            <div className="text-xl font-semibold text-[#2D251E]">Список пуст</div>
            <p className="mt-2 text-[#766A5F]">Создайте первое КП в каталоге.</p>
            <Link href="/catalog" className="mt-6">
              <Button>Перейти в каталог</Button>
            </Link>
          </Card>
        ) : (
          proposals.map((proposal) => (
            <Card key={proposal.id} className="overflow-hidden border-[rgba(166,106,63,0.1)] transition-all hover:shadow-md">
              <div className="flex flex-col items-center justify-between gap-6 p-6 md:flex-row">
                <div className="flex items-center gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1ECE4] text-[#A66A3F]">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-2xl font-semibold text-[#2D251E]">
                        {proposal.projectName || `КП №${proposal.number}`}
                      </h3>
                      <Badge variant={proposal.status === "sent" ? "info" : "success"}>
                        {proposal.status === "sent" ? "Отправлено" : "Принято"}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#766A5F]">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {proposal.clientName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {proposal.createdAt.toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-4 border-t border-[rgba(166,106,63,0.05)] pt-6 md:w-auto md:border-none md:pt-0">
                  <div className="text-right">
                    <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Сумма</div>
                    <div className="text-xl font-bold text-[#2D251E]">{formatPrice(Number(proposal.total) || 0)}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/p/${proposal.id}`} target="_blank">
                      <Button variant="outline" size="icon" title="Открыть ссылку">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
