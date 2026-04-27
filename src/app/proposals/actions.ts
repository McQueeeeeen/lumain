"use server";

import { GenerateOfferUseCase } from "@/application/use-cases/generate-offer";
import { ProjectRepository } from "@/infrastructure/repositories/project-repository";
import { OfferRepository } from "@/infrastructure/repositories/offer-repository";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

/**
 * Server action to save a standalone proposal draft.
 */
export async function saveProposal(data: any) {
  try {
    const proposal = await prisma.proposal.create({
      data: {
        projectName: data.projectName,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        managerName: data.managerName,
        validityPeriod: data.validityPeriod,
        globalDiscount: data.globalDiscount,
        items: data.items,
        notes: data.notes,
        total: data.total,
      },
    });

    return { 
      success: true, 
      id: proposal.id, 
      projectName: proposal.projectName 
    };
  } catch (error: any) {
    console.error("Error saving proposal:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server action to generate a shareable offer link.
 */
export async function createShareableOffer(projectId: string) {
  const projectRepo = new ProjectRepository();
  const offerRepo = new OfferRepository();
  const generateOffer = new GenerateOfferUseCase(projectRepo, offerRepo);

  try {
    const token = await generateOffer.execute(projectId);
    if (token) {
      revalidatePath(`/offer/${token}`);
      return { success: true, token };
    }
    return { success: false, error: "Failed to generate token" };
  } catch (error: any) {
    console.error("Error creating shareable offer:", error);
    return { success: false, error: error.message };
  }
}
