import { KPItem } from "@/types";

type ProposalData = {
  id: string;
  number: number | null;
  projectName: string | null;
  clientName: string;
  clientPhone: string | null;
  managerName: string;
  date: Date;
  validityPeriod: number;
  globalDiscount: number;
  items: KPItem[];
  total: number;
  notes: string | null;
};

/**
 * Premium 'WOW' PDF Export with full Cyrillic Support
 * Renders a high-end designer template into a high-resolution PDF.
 */
export async function exportProposalToPDF(proposal: ProposalData) {
  if (typeof window === "undefined") return;

  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "1000px"; // Wider for better resolution
  container.style.backgroundColor = "#FAF9F5";
  container.style.padding = "60px";
  container.style.fontFamily = "'Inter', 'Segoe UI', Roboto, sans-serif";
  container.style.color = "#2D251E";

  const baseTotal = proposal.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = baseTotal - proposal.total;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #A66A3F; padding-bottom: 30px; margin-bottom: 50px;">
      <div>
        <h1 style="font-size: 48px; margin: 0; font-weight: 700; letter-spacing: -1px;">Haydi <span style="font-weight: 300; color: #766A5F;">light</span></h1>
        <p style="font-size: 16px; color: #A66A3F; margin: 8px 0 0 0; font-weight: 700; letter-spacing: 4px; text-transform: uppercase;">Коммерческое предложение</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-weight: 700; font-size: 18px;">№ ${proposal.number || proposal.id.slice(0, 8)}</p>
        <p style="margin: 5px 0 0 0; color: #766A5F;">от ${new Date(proposal.date).toLocaleDateString("ru-RU")}</p>
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 60px;">
      <div>
        <h2 style="font-size: 32px; margin: 0 0 15px 0; font-weight: 600; line-height: 1.2;">${proposal.projectName || "Проект освещения"}</h2>
        <div style="height: 4px; width: 60px; background-color: #A66A3F; margin-bottom: 25px;"></div>
      </div>
      <div style="background-color: white; padding: 25px; border: 1px solid rgba(166,106,63,0.15); border-radius: 2px;">
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #A66A3F; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Информация</p>
        <p style="margin: 0; font-size: 18px;">Клиент: <strong>${proposal.clientName}</strong></p>
        <p style="margin: 8px 0 0 0; font-size: 16px; color: #766A5F;">Менеджер: <span style="color: #2D251E;">${proposal.managerName}</span></p>
        ${proposal.clientPhone ? `<p style="margin: 5px 0 0 0; color: #766A5F;">Тел: ${proposal.clientPhone}</p>` : ''}
      </div>
    </div>

    <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px; margin-bottom: 60px;">
      <thead>
        <tr style="text-align: left; color: #A66A3F; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
          <th style="padding: 10px 20px;">Модель</th>
          <th style="padding: 10px 20px;">Кол-во</th>
          <th style="padding: 10px 20px;">Цена</th>
          <th style="padding: 10px 20px; text-align: right;">Сумма</th>
        </tr>
      </thead>
      <tbody>
        ${proposal.items.map(item => `
          <tr style="background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <td style="padding: 20px; border-radius: 2px 0 0 2px; border-left: 3px solid #A66A3F;">
              <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">${item.article} ${item.name}</div>
              <div style="font-size: 12px; color: #766A5F;">${item.brand} | ${item.finish} | ${item.lightColor}</div>
              ${item.roomLabel ? `<div style="display: inline-block; margin-top: 8px; font-size: 10px; background: #F1ECE4; padding: 2px 8px; border-radius: 10px;">${item.roomLabel}</div>` : ''}
            </td>
            <td style="padding: 20px; font-size: 14px; font-weight: 600;">${item.quantity} ${item.unit}</td>
            <td style="padding: 20px; font-size: 14px;">
              ${item.price.toLocaleString()} ₸
              ${item.kpDiscount > 0 ? `<br/><span style="color: #059669; font-size: 11px;">Скидка ${item.kpDiscount}%</span>` : ''}
            </td>
            <td style="padding: 20px; text-align: right; font-size: 16px; font-weight: 700; color: #8E623E; border-radius: 0 2px 2px 0;">
              ${item.subtotal.toLocaleString()} ₸
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: start;">
      <div style="color: #766A5F; font-size: 14px; line-height: 1.6;">
        ${proposal.notes ? `
          <h3 style="color: #A66A3F; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 10px;">Примечание</h3>
          <p style="margin: 0;">${proposal.notes}</p>
        ` : ''}
        <div style="margin-top: 30px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          <p style="margin: 0;">Срок действия предложения: <strong>${proposal.validityPeriod} дней</strong></p>
          <p style="margin: 5px 0 0 0;">Условия поставки: 100% предоплата, самовывоз или доставка по согласованию.</p>
        </div>
      </div>
      
      <div style="background-color: #2D251E; color: white; padding: 40px; border-radius: 2px; text-align: right;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 15px; color: #D4C3B3;">
          <span>Сумма по каталогу</span>
          <span>${baseTotal.toLocaleString()} ₸</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 15px; color: #34D399;">
          <span>Ваша персональная скидка</span>
          <span>-${discountAmount.toLocaleString()} ₸</span>
        </div>
        <div style="border-top: 1px solid rgba(212,195,179,0.2); padding-top: 20px;">
          <p style="margin: 0; font-size: 12px; color: #D4C3B3; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Итого к оплате</p>
          <p style="margin: 10px 0 0 0; font-size: 42px; font-weight: 700; color: white;">${proposal.total.toLocaleString()} ₸</p>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 80px; text-align: center; color: #9CA3AF; font-size: 12px; border-top: 1px solid #E5E7EB; padding-top: 30px;">
      <p style="margin: 0; font-weight: 700; color: #766A5F;">Haydi Light - Премиальные решения в освещении</p>
      <p style="margin: 5px 0 0 0;">Алматы, пр. Аль-Фараби | www.haydi.kz | +7 (707) 000-00-00</p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#FAF9F5",
      logging: false,
      useCORS: true,
      windowWidth: 1000
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.9);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    const pdfBlob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `Haydi_KP_${proposal.projectName?.replace(/\s+/g, '_') || "lighting"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  } finally {
    document.body.removeChild(container);
  }
}
