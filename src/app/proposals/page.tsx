"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Download, FileSpreadsheet, FileText, Minus, Plus, Trash2, CheckCircle2, Share2, History } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useKPStore } from "@/store/kp-store";
import { useViewerStore } from "@/store/viewer-store";
import { saveProposal } from "./actions";

type AutoTableDocument = jsPDF & {
  getLastAutoTable: () => { finalY: number } | null;
};

export default function ProposalsPage() {
  const { role } = useViewerStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

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
  const [isExporting, setIsExporting] = useState(false);

  // Prevent hydration mismatch or premature access denial
  if (!mounted) return null;

  if (role !== "manager" && role !== "admin") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-semibold text-[#2D251E]">Доступ ограничен</h1>
        <p className="mt-4 text-[#766A5F]">Раздел КП доступен только для менеджеров и администраторов.</p>
        <Link href="/catalog">
          <Button className="mt-8">Вернуться в каталог</Button>
        </Link>
      </div>
    );
  }

  const itemsTotal = items.reduce((acc, item) => acc + item.subtotal, 0);

  const handleExportExcel = () => {
    const rows = items.map((item) => ({
      "Помещение": item.roomLabel,
      "Наименование": `${item.brand} ${item.article} - ${item.name}`,
      "Наличие": item.stock > 0 ? `${item.stock} шт.` : "Под заказ",
      "Ед. изм.": item.unit,
      "Цена за ед.": item.price,
      "Кол-во": item.quantity,
      "Скидка, %": item.kpDiscount,
      "Стоимость": item.price * item.quantity,
      "Стоимость со скидкой": item.subtotal,
      "Поставка": item.deliveryTime,
      "Комментарий": item.managerComment,
    }));

    const worksheet = XLSX.utils.aoa_to_sheet([
      [`Проект: ${clientInfo.projectName || "-"}`],
      [`Клиент: ${clientInfo.name || "-"}`],
      [`Телефон: ${clientInfo.phone || "-"}`],
      [`Email: ${clientInfo.email || "-"}`],
      [`Менеджер: ${clientInfo.managerName || "-"}`],
      [`Общая скидка КП: ${globalDiscount}%`],
      [`Итог: ${getTotal()}`],
      [],
    ]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.sheet_add_json(worksheet, rows, { origin: "A9" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "KP");
    XLSX.writeFile(workbook, `KP_${clientInfo.projectName || "proposal"}.xlsx`);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(18);
    doc.text("COMMERCIAL PROPOSAL", 14, 18);
    doc.setFontSize(10);
    doc.text(`Project: ${clientInfo.projectName || "Lighting proposal"}`, 14, 27);
    doc.text(`Client: ${clientInfo.name || "Client name"}`, 14, 33);
    doc.text(`Phone: ${clientInfo.phone || "-"}`, 14, 39);
    doc.text(`Email: ${clientInfo.email || "-"}`, 14, 45);
    doc.text(`Manager: ${clientInfo.managerName || "-"}`, 14, 51);
    doc.text(`Valid for: ${clientInfo.validityPeriod} days`, 14, 57);

    autoTable(doc, {
      startY: 66,
      styles: { fontSize: 8, cellPadding: 2 },
      head: [[
        "Помещение",
        "Наименование",
        "Наличие",
        "Ед. изм.",
        "Цена за ед.",
        "Кол-во",
        "Скидка",
        "Стоимость",
        "Стоимость со скидкой",
        "Поставка"
      ]],
      body: items.map((item) => [
        item.roomLabel || "-",
        `${item.brand} ${item.article}\n${item.name}`,
        item.stock > 0 ? `${item.stock} шт.` : "Под заказ",
        item.unit,
        formatPrice(item.price),
        item.quantity,
        `${item.kpDiscount}%`,
        formatPrice(item.price * item.quantity),
        formatPrice(item.subtotal),
        item.deliveryTime
      ]),
    });

    const table = (doc as AutoTableDocument).getLastAutoTable();
    const finalY = table?.finalY || 120;

    doc.text(`Subtotal: ${formatPrice(itemsTotal)}`, 14, finalY + 10);
    doc.text(`Proposal discount: ${globalDiscount}%`, 14, finalY + 16);
    doc.text(`Final total: ${formatPrice(getTotal())}`, 14, finalY + 22);

    if (clientInfo.notes) {
      doc.text(`Notes: ${clientInfo.notes}`, 14, finalY + 30);
    }

    doc.save(`KP_${clientInfo.projectName || "proposal"}_${new Date().toISOString().split("T")[0]}.pdf`);
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
      const url = `${window.location.origin}/p/${result.id}`;
      navigator.clipboard.writeText(url);
      alert(`КП сохранено! Ссылка скопирована: ${url}`);
    } else {
      alert(result.error);
    }
    setIsExporting(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="font-display text-5xl font-semibold leading-none text-[#2D251E] md:text-6xl">
            КП
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2" onClick={clearCart} disabled={items.length === 0}>
            <Trash2 className="h-4 w-4" />
            Очистить
          </Button>
          <Button
            variant="default"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleSave}
            disabled={isExporting || items.length === 0}
          >
            <CheckCircle2 className="h-4 w-4" />
            Сохранить и ссылка
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportPDF} disabled={isExporting || items.length === 0}>
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel} disabled={items.length === 0}>
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Link href="/catalog">
            <Button className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Добавить товары
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-10 grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 p-6 border-[rgba(166,106,63,0.1)]">
          <h2 className="mb-6 font-display text-2xl font-semibold text-[#2D251E]">Информация о проекте</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <LabeledField label="Название проекта">
                <input
                  type="text"
                  value={clientInfo.projectName}
                  onChange={(event) => setClientInfo({ projectName: event.target.value })}
                  placeholder="Например: Квартира в ЖК 'Отражение'"
                  className="field-input"
                />
              </LabeledField>
              <LabeledField label="ФИО Клиента">
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={(event) => setClientInfo({ name: event.target.value })}
                  placeholder="Иванов Иван Иванович"
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
              <LabeledField label="Email (для отправки)">
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

        <Card className="flex flex-col justify-between p-6 bg-[#2D251E] text-white border-none shadow-xl">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Итого к оплате</div>
            <div className="mt-2 text-4xl font-bold text-[#D4C3B3]">{formatPrice(getTotal())}</div>
            <div className="mt-1 text-sm text-[#B49F8B]">С учетом всех скидок</div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={handleSave} className="flex-1 bg-[#A66A3F] hover:bg-[#8E623E]">Сохранить и ссылка</Button>
            <Button variant="outline" onClick={handleExportPDF} className="border-white/30 text-white hover:bg-white/10">PDF</Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-10">
        <div className="space-y-6">
          {items.length === 0 ? (
            <Card className="flex flex-col items-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F1ECE4]">
                <FileText className="h-8 w-8 text-[#A66A3F]" />
              </div>
              <h3 className="font-display text-3xl font-semibold text-[#2D251E]">Пустое КП</h3>
              <Link href="/catalog">
                <Button className="mt-6">Перейти в каталог</Button>
              </Link>
            </Card>
          ) : (
            <>
              <Card className="hidden overflow-hidden lg:block border-[rgba(166,106,63,0.1)] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-[1280px] w-full border-collapse">
                    <thead className="bg-[#F1ECE4] text-left text-[11px] font-bold uppercase tracking-widest text-[#8E623E]">
                      <tr>
                        <th className="px-4 py-3">Помещение</th>
                        <th className="px-4 py-3">Фото</th>
                        <th className="px-4 py-3">Наименование</th>
                        <th className="px-4 py-3">Наличие</th>
                        <th className="px-4 py-3">Ед. изм.</th>
                        <th className="px-4 py-3">Цена за ед.</th>
                        <th className="px-4 py-3">Кол-во</th>
                        <th className="px-4 py-3">Скидка</th>
                        <th className="px-4 py-3">Стоимость</th>
                        <th className="px-4 py-3">Стоимость со скидкой</th>
                        <th className="px-4 py-3">Поставка</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-t border-[rgba(166,106,63,0.18)] align-top hover:bg-[rgba(166,106,63,0.02)] transition-colors">
                          <td className="px-2 py-4">
                            <InlineInput
                              value={item.roomLabel}
                              placeholder="Комната"
                              onChange={(value) => updateItemMeta(item.id, { roomLabel: value })}
                            />
                          </td>
                           <td className="px-2 py-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-[4px] bg-[#F1ECE4] border border-[rgba(166,106,63,0.1)]">
                              {item.images && item.images[0] && (item.images[0].startsWith("/") || item.images[0].startsWith("http")) ? (
                                <Image src={item.images[0]} alt={item.name} fill sizes="80px" className="object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] text-[#A66A3F]">No photo</div>
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-4 min-w-[200px]">
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-[#A66A3F]">
                                {item.brand} / {item.article}
                              </div>
                              <div className="font-display text-lg font-semibold leading-tight text-[#2D251E]">{item.name}</div>
                              <div className="text-[11px] text-[#766A5F] leading-relaxed">
                                {item.finish} • {item.luminousFlux} лм • {item.dimensions?.length || 0}x{item.dimensions?.width || 0}x{item.dimensions?.height || 0}
                              </div>
                              <textarea
                                value={item.managerComment}
                                onChange={(e) => updateItemMeta(item.id, { managerComment: e.target.value })}
                                placeholder="Доп. инфо / комментарий"
                                className="mt-2 w-full bg-transparent text-[11px] text-[#766A5F] outline-none border-b border-transparent focus:border-[#A66A3F] resize-none"
                                rows={1}
                              />
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <div className={`text-xs font-bold ${item.stock > 0 ? "text-green-600" : "text-[#A66A3F]"}`}>
                              {item.stock > 0 ? `${item.stock} шт.` : "Под заказ"}
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <select
                              value={item.unit}
                              onChange={(e) => updateItemMeta(item.id, { unit: e.target.value })}
                              className="bg-transparent text-xs font-semibold text-[#2D251E] outline-none cursor-pointer"
                            >
                              <option value="шт.">шт.</option>
                              <option value="м.">м.</option>
                              <option value="компл.">компл.</option>
                            </select>
                          </td>
                          <td className="px-2 py-4">
                            <div className="text-sm font-semibold text-[#2D251E]">
                              {formatPrice(item.price)}
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <QuantityControl
                              value={item.quantity}
                              onDecrease={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                            />
                          </td>
                          <td className="px-2 py-4">
                            <InlineNumber
                              value={item.kpDiscount}
                              suffix="%"
                              onChange={(value) => updateDiscount(item.id, value)}
                            />
                          </td>
                          <td className="px-2 py-4">
                            <div className="text-sm font-semibold text-[#766A5F]">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <div className="text-base font-bold text-[#8E623E]">
                              {formatPrice(item.subtotal)}
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <input
                              type="text"
                              value={item.deliveryTime}
                              onChange={(e) => updateItemMeta(item.id, { deliveryTime: e.target.value })}
                              className="bg-transparent text-xs font-semibold text-[#2D251E] outline-none border-b border-transparent focus:border-[#A66A3F] w-20"
                            />
                          </td>
                          <td className="px-2 py-4">
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
                        {item.images && item.images[0] && (item.images[0].startsWith("/") || item.images[0].startsWith("http")) ? (
                          <Image src={item.images[0]} alt={item.name} fill sizes="80px" className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-[#A66A3F]">No photo</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-[#A66A3F]">
                          {item.brand} / {item.article}
                        </div>
                        <div className="font-display text-2xl font-semibold leading-none text-[#2D251E]">{item.name}</div>
                        <div className="mt-1 text-sm text-[#766A5F]">{item.finish}</div>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <InlineInput
                        value={item.roomLabel}
                        placeholder="Комната / зона"
                        onChange={(value) => updateItemMeta(item.id, { roomLabel: value })}
                      />
                      <InlineInput
                        value={item.managerLabel}
                        placeholder="Название"
                        onChange={(value) => updateItemMeta(item.id, { managerLabel: value })}
                      />
                      <InlineTextarea
                        value={item.managerComment}
                        placeholder="Комментарий"
                        onChange={(value) => updateItemMeta(item.id, { managerComment: value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <QuantityControl
                        value={item.quantity}
                        onDecrease={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                      />
                      <InlineNumber
                        value={item.kpDiscount}
                        suffix="%"
                        onChange={(value) => updateDiscount(item.id, value)}
                      />
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
    </div>
  );
}

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
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
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white px-3 text-sm text-[#2D251E] outline-none transition-colors placeholder:text-[#b49f8b] focus:border-[#A66A3F]"
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
}: {
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex h-11 items-center rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white px-3">
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className="w-full bg-transparent text-sm font-semibold text-[#2D251E] outline-none"
      />
      <span className="whitespace-nowrap text-xs uppercase tracking-widest text-[#766A5F]">{suffix}</span>
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
    <div className="inline-flex h-11 items-center rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white">
      <button onClick={onDecrease} className="px-3 text-[#766A5F] transition-colors hover:text-[#2D251E]">
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-10 px-2 text-center text-sm font-semibold text-[#2D251E]">{value}</span>
      <button onClick={onIncrease} className="px-3 text-[#766A5F] transition-colors hover:text-[#2D251E]">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
