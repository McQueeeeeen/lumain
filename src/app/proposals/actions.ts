"use server";

import { prisma } from "@/lib/prisma";
import { KPItem } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveProposal(payload: {
  projectName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  managerName: string;
  validityPeriod: number;
  globalDiscount: number;
  items: KPItem[];
  notes: string;
  total: number;
}) {
  try {
    // Get highest proposal number for manual increment
    const lastProposal = await prisma.proposal.findFirst({
      orderBy: { number: "desc" },
    });
    const nextNumber = (lastProposal?.number || 0) + 1;

    const proposal = await prisma.proposal.create({
      data: {
        number: nextNumber,
        projectName: payload.projectName,
        clientName: payload.clientName,
        clientPhone: payload.clientPhone,
        clientEmail: payload.clientEmail,
        managerName: payload.managerName,
        validityPeriod: payload.validityPeriod,
        globalDiscount: payload.globalDiscount,
        items: JSON.stringify(payload.items),
        notes: payload.notes,
        total: payload.total,
        status: "sent",
      },
    });

    revalidatePath("/admin/proposals");
    return { success: true, id: proposal.id };
  } catch (error) {
    console.error("Failed to save proposal:", error);
    return { success: false, error: "Не удалось сохранить КП" };
  }
}
