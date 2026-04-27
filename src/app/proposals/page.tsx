"use client";

import { useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import * as XLSX from "xlsx";
import { exportProposalToPDF } from "@/lib/export-pdf";
import { CheckCircle2, Download, FileSpreadsheet, FileText, Minus, Plus, Trash2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useKPStore } from "@/store/kp-store";
import { saveProposal } from "./actions";

export default function ProposalsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [isExporting, setIsExporting] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  const {
    items,
    globalDiscount,
    clientInfo,
    updateQuantity,
    updateDiscount,
    updateItemMeta,
    removeItem,
    setGlobalDiscount,
    setClientInfo,
    clearCart,
    getTotal,
  } = useKPStore();

  if (!mounted) return null;

  const handleExportExcel = () => {
    const rows = items.map((item) => ({
      Помещение: item.roomLabel,
      Наименование: `${item.article} ${item.name}`,
      Наличие: item.stock > 0 ? `${item.stock} шт.` : "Под заказ",
      "Ед. изм.": item.unit,
      "Цена за ед.": item.price,
      "Кол-во": item.quantity,
      "Скидка, %": item.kpDiscount,
      Стоимость: item.price * item.quantity,
      "Стоимость со скидкой": item.subtotal,
      Поставка: item.deliveryTime,
      Комментарий: item.managerComment,
    }));

    const worksheet = XLSX.utils.aoa_to_sheet([
      [`Проект: ${clientInfo.projectName || "-"}`],
      [`Клиент: ${clientInfo.name || "-"}`],
      [`Телефон: ${clientInfo.phone || "-"}`],
      [`Email: ${clientInfo.email || "-"}`],
      [`Менеджер: ${clientInfo.managerName || "-"}`],
      [`Общая скидка: ${globalDiscount}%`],
      [`Итого: ${formatPrice(getTotal())}`],
      [],
    ]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.sheet_add_json(worksheet, rows, { origin: "A9" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "KP");
    XLSX.writeFile(workbook, `KP_${clientInfo.projectName || "proposal"}.xlsx`);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportProposalToPDF({
        id: "draft",
        number: null,
        projectName: clientInfo.projectName,
        clientName: clientInfo.name,
        clientPhone: clientInfo.phone,
        managerName: clientInfo.managerName,
        date: new Date(),
        validityPeriod: clientInfo.validityPeriod,
        globalDiscount,
        items,
        total: getTotal(),
        notes: clientInfo.notes,
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Ошибка при создании PDF");
    }
    setIsExporting(false);
  };

  const handleSave = async () => {
    setIsExporting(true);
    const result = await saveProposal({
      projectName: clientInfo.projectName,
      clientName: clientInfo.name,
      clientPhone: clientInfo.phone,
      clientEmail: clientInfo.email,
      managerName: clientInfo.managerName,
      validityPeriod: clientInfo.validityPeriod,
      globalDiscount,
      items,
      notes: clientInfo.notes,
      total: getTotal(),
    });

    if (result.success) {
      const slug = (result.projectName || "kp")
        .toLowerCase()
        .replace(/[а-я]/g, (char) => {
          const map: any = { 'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ы':'y','э':'e','ю':'yu','я':'ya' };
          return map[char] || char;
        })
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
        
      const url = `${window.location.origin}/p/${result.id}/${slug}`;
      setSavedUrl(url);
      navigator.clipboard.writeText(url);
    } else {
      alert(result.error);
    }

    setIsExporting(false);
  };

  return (
    <div className="mx-auto max-w-[1660px] px-4 py-10">
      {savedUrl && (
        <div className="mb-8 flex animate-in fade-in slide-in-from-top-4 duration-500 items-center justify-between rounded-[4px] border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <span className="font-bold">КП успешно сохранено!</span>
              <p className="text-sm opacity-90">Ссылка скопирована в буфер обмена и готова к отправке клиенту.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={savedUrl} target="_blank" className="text-sm font-bold underline underline-offset-4 hover:text-emerald-950">
              Открыть КП
            </Link>
            <Button size="sm" variant="ghost" onClick={() => setSavedUrl(null)} className="h-8 w-8 p-0">
              <Plus className="h-4 w-4 rotate-45" />
            </Button>
          </div>
        </div>
      )}
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="font-display text-5xl font-semibold leading-none text-[#2D251E] md:text-6xl">КП</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2" onClick={clearCart} disabled={items.length === 0}>
            <Trash2 className="h-4 w-4" />
            Очистить
          </Button>
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={handleSave} disabled={isExporting || items.length === 0}>
            <CheckCircle2 className="h-4 w-4" />
            Сохранить
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportPDF} disabled={isExporting || items.length === 0}>
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel} disabled={items.length === 0}>
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Link 
            href="/catalog" 
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[2px] bg-[#A66A3F] px-5 text-sm font-semibold text-white transition-all hover:bg-[#8E623E]"
          >
            <Plus className="h-4 w-4" />
            Добавить товары
          </Link>
        </div>
      </div>

      <div className="mb-10 grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 border-[rgba(166,106,63,0.1)] p-6">
          <h2 className="mb-6 font-display text-2xl font-semibold text-[#2D251E]">Данные проекта</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <LabeledField label="Название проекта">
                <input
                  type="text"
                  value={clientInfo.projectName}
                  onChange={(event) => setClientInfo({ projectName: event.target.value })}
                  placeholder="Например: квартира в ЖК"
                  className="field-input"
                />
              </LabeledField>
              <LabeledField label="Клиент">
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={(event) => setClientInfo({ name: event.target.value })}
                  placeholder="Имя клиента"
                  className="field-input"
                />
              </LabeledField>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <LabeledField label="Телефон">
                  <input
                    type="text"
                    value={clientInfo.phone}
                    onChange={(event) => setClientInfo({ phone: event.target.value })}
                    placeholder="+7 707 000 00 00"
                    className="field-input"
                  />
                </LabeledField>
                <LabeledField label="Менеджер">
                  <input
                    type="text"
                    value={clientInfo.managerName}
                    onChange={(event) => setClientInfo({ managerName: event.target.value })}
                    className="field-input"
                  />
                </LabeledField>
              </div>
              <LabeledField label="Email">
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(event) => setClientInfo({ email: event.target.value })}
                  placeholder="client@mail.ru"
                  className="field-input"
                />
              </LabeledField>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-none bg-[#2D251E] p-6 text-white shadow-xl">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Итого к оплате</div>
            <div className="mt-2 text-4xl font-bold text-[#D4C3B3]">{formatPrice(getTotal())}</div>
            <div className="mt-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B49F8B]">Общая скидка</div>
              <InlineNumber dark value={globalDiscount} suffix="%" onChange={setGlobalDiscount} />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={handleSave} className="flex-1 bg-[#A66A3F] hover:bg-[#8E623E]">
              Сохранить
            </Button>
            <Button variant="outline" onClick={handleExportPDF} className="border-white/30 text-white hover:bg-white/10">
              PDF
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        {items.length === 0 ? (
          <Card className="flex flex-col items-center p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F1ECE4]">
              <FileText className="h-8 w-8 text-[#A66A3F]" />
            </div>
            <h3 className="font-display text-3xl font-semibold text-[#2D251E]">Пустое КП</h3>
            <Link 
              href="/catalog" 
              className="mt-6 inline-flex h-10 items-center justify-center rounded-[2px] bg-[#A66A3F] px-5 text-sm font-semibold text-white transition-all hover:bg-[#8E623E]"
            >
              Перейти в каталог
            </Link>
          </Card>
        ) : (
          <>
            <Card className="hidden overflow-hidden border-[rgba(166,106,63,0.1)] shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1360px] border-collapse">
                  <colgroup>
                    <col className="w-[132px]" />
                    <col className="w-[96px]" />
                    <col className="w-[420px]" />
                    <col className="w-[88px]" />
                    <col className="w-[68px]" />
                    <col className="w-[108px]" />
                    <col className="w-[120px]" />
                    <col className="w-[96px]" />
                    <col className="w-[118px]" />
                    <col className="w-[126px]" />
                    <col className="w-[112px]" />
                    <col className="w-[56px]" />
                  </colgroup>
                  <thead className="bg-[#F1ECE4] text-left text-[11px] font-bold uppercase tracking-widest text-[#8E623E]">
                    <tr>
                      <th className="px-4 py-3">Помещение</th>
                      <th className="px-4 py-3">Фото</th>
                      <th className="px-4 py-3">Наименование</th>
                      <th className="px-4 py-3">Наличие</th>
                      <th className="px-4 py-3">Ед.</th>
                      <th className="px-4 py-3">Цена</th>
                      <th className="px-4 py-3">Кол-во</th>
                      <th className="px-4 py-3">Скидка</th>
                      <th className="px-4 py-3">Стоимость</th>
                      <th className="px-4 py-3">Со скидкой</th>
                      <th className="px-4 py-3">Поставка</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {items.map((item) => (
                      <tr key={item.id} className="align-top transition-colors hover:bg-[rgba(166,106,63,0.02)]">
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <InlineInput
                            compact
                            soft
                            value={item.roomLabel}
                            placeholder="Комната"
                            onChange={(value) => updateItemMeta(item.id, { roomLabel: value })}
                          />
                        </td>
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <div className="relative h-24 w-20 overflow-hidden rounded-[4px] border border-[rgba(166,106,63,0.1)] bg-[#F1ECE4]">
                            {item.images?.[0] && (item.images[0].startsWith("/") || item.images[0].startsWith("http")) ? (
                              <Image src={item.images[0]} alt={item.name} fill sizes="80px" className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-[#A66A3F]">No photo</div>
                            )}
                          </div>
                        </td>
                        <td className="min-w-[420px] border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <div className="space-y-3">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A66A3F]">
                              {item.brand} / {item.article}
                            </div>
                            <div className="font-display text-lg font-semibold leading-tight text-[#2D251E]">
                              {item.article} {item.name}
                            </div>
                            <div className="text-[11px] leading-relaxed text-[#766A5F]">
                              {item.finish} • {item.luminousFlux} лм • {item.dimensions?.length || 0} x {item.dimensions?.width || 0} x {item.dimensions?.height || 0} мм
                            </div>
                            <div className="grid gap-2 rounded-[4px] bg-[#FCFAF6] p-3">
                              <InlineInput
                                compact
                                soft
                                value={item.managerLabel}
                                placeholder="Название для менеджера"
                                onChange={(value) => updateItemMeta(item.id, { managerLabel: value })}
                              />
                              <textarea
                                value={item.managerComment}
                                onChange={(event) => updateItemMeta(item.id, { managerComment: event.target.value })}
                                placeholder="Комментарий"
                                className="min-h-[64px] w-full resize-none rounded-[2px] border border-[rgba(166,106,63,0.14)] bg-white px-3 py-2 text-sm text-[#2D251E] outline-none transition-colors placeholder:text-[#b49f8b] focus:border-[#A66A3F]"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <MetricCell
                            value={item.stock > 0 ? `${item.stock} шт.` : "Под заказ"}
                            accent={item.stock > 0 ? "success" : "default"}
                          />
                        </td>
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <div className="inline-flex h-10 items-center rounded-[2px] border border-[rgba(166,106,63,0.14)] bg-[#FCFAF6] px-3">
                            <select
                              value={item.unit}
                              onChange={(event) => updateItemMeta(item.id, { unit: event.target.value })}
                              className="bg-transparent text-xs font-semibold text-[#2D251E] outline-none"
                            >
                              <option value="шт.">шт.</option>
                              <option value="м.">м.</option>
                              <option value="компл.">компл.</option>
                            </select>
                          </div>
                        </td>
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <MetricCell value={formatPrice(item.price)} />
                        </td>
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <QuantityControl
                            value={item.quantity}
                            onDecrease={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                          />
                        </td>
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <InlineNumber compact value={item.kpDiscount} suffix="%" onChange={(value) => updateDiscount(item.id, value)} />
                        </td>
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <MetricCell value={formatPrice(item.price * item.quantity)} muted />
                        </td>
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <MetricCell value={formatPrice(item.subtotal)} accent="strong" />
                        </td>
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <InlineInput
                            compact
                            soft
                            value={item.deliveryTime}
                            placeholder="Срок"
                            onChange={(value) => updateItemMeta(item.id, { deliveryTime: value })}
                          />
                        </td>
                        <td className="border-t border-[rgba(166,106,63,0.18)] px-3 py-4">
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-[#766A5F] hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="space-y-4 lg:hidden">
              {items.map((item) => (
                <Card key={item.id} className="space-y-4 p-4">
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 overflow-hidden rounded-[4px] bg-[#F1ECE4]">
                      {item.images?.[0] && (item.images[0].startsWith("/") || item.images[0].startsWith("http")) ? (
                        <Image src={item.images[0]} alt={item.name} fill sizes="80px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-[#A66A3F]">No photo</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-[#A66A3F]">
                        {item.brand} / {item.article}
                      </div>
                      <div className="font-display text-2xl font-semibold leading-none text-[#2D251E]">
                        {item.article} {item.name}
                      </div>
                      <div className="mt-1 text-sm text-[#766A5F]">{item.finish}</div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <InlineInput value={item.roomLabel} placeholder="Комната / зона" onChange={(value) => updateItemMeta(item.id, { roomLabel: value })} />
                    <InlineInput value={item.managerLabel} placeholder="Название для менеджера" onChange={(value) => updateItemMeta(item.id, { managerLabel: value })} />
                    <InlineTextarea value={item.managerComment} placeholder="Комментарий" onChange={(value) => updateItemMeta(item.id, { managerComment: value })} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <QuantityControl
                      value={item.quantity}
                      onDecrease={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                    />
                    <InlineNumber value={item.kpDiscount} suffix="%" onChange={(value) => updateDiscount(item.id, value)} />
                  </div>

                  <div className="flex items-end justify-between border-t border-[rgba(166,106,63,0.18)] pt-3">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#766A5F]">Цена</div>
                      <div className="font-semibold text-[#2D251E]">{formatPrice(item.kpPrice)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-widest text-[#766A5F]">Сумма</div>
                      <div className="font-semibold text-[#8E623E]">{formatPrice(item.subtotal)}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LabeledField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-widest text-[#766A5F]">{label}</span>
      {children}
    </label>
  );
}

function InlineInput({
  value,
  placeholder,
  onChange,
  compact = false,
  soft = false,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  compact?: boolean;
  soft?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-[2px] border px-3 text-sm text-[#2D251E] outline-none transition-colors placeholder:text-[#b49f8b] focus:border-[#A66A3F] ${compact ? "h-10" : "h-11"} ${soft ? "border-[rgba(166,106,63,0.14)] bg-[#FCFAF6]" : "border-[rgba(166,106,63,0.18)] bg-white"}`}
    />
  );
}

function InlineTextarea({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-24 w-full rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white px-3 py-2 text-sm text-[#2D251E] outline-none transition-colors placeholder:text-[#b49f8b] focus:border-[#A66A3F]"
    />
  );
}

function InlineNumber({
  value,
  suffix,
  onChange,
  dark = false,
  compact = false,
}: {
  value: number;
  suffix: string;
  onChange: (value: number) => void;
  dark?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`flex h-11 items-center rounded-[2px] border ${compact ? "px-2" : "px-3"} ${dark ? "border-white/20 bg-white/10" : "border-[rgba(166,106,63,0.14)] bg-[#FCFAF6]"}`}>
      <input
        type="number"
        value={value === 0 ? "" : String(value)}
        onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
        className={`bg-transparent text-sm font-semibold outline-none ${compact ? "w-10 text-center" : "w-full"} ${dark ? "text-white placeholder:text-white/50" : "text-[#2D251E]"}`}
      />
      <span className={`whitespace-nowrap text-xs uppercase tracking-widest ${dark ? "text-[#D4C3B3]" : "text-[#766A5F]"}`}>{suffix}</span>
    </div>
  );
}

function QuantityControl({
  value,
  onDecrease,
  onIncrease,
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="inline-flex h-11 items-center rounded-[2px] border border-[rgba(166,106,63,0.14)] bg-[#FCFAF6]">
      <button onClick={onDecrease} className="px-2.5 text-[#766A5F] transition-colors hover:text-[#2D251E]">
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 px-2 text-center text-sm font-semibold text-[#2D251E]">{value}</span>
      <button onClick={onIncrease} className="px-2.5 text-[#766A5F] transition-colors hover:text-[#2D251E]">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function MetricCell({
  value,
  muted = false,
  accent = "default",
}: {
  value: string;
  muted?: boolean;
  accent?: "default" | "success" | "strong";
}) {
  const tone =
    accent === "success"
      ? "text-emerald-600"
      : accent === "strong"
        ? "text-[#8E623E]"
        : muted
          ? "text-[#766A5F]"
          : "text-[#2D251E]";

  const weight = accent === "strong" ? "font-bold" : "font-semibold";

  return (
    <div className={`inline-flex min-h-10 items-center rounded-[2px] border border-[rgba(166,106,63,0.14)] bg-[#FCFAF6] px-3 whitespace-nowrap text-sm ${tone} ${weight}`}>
      {value}
    </div>
  );
}
