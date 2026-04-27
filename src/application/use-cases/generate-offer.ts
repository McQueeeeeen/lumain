import { ProjectRepository } from "../../infrastructure/repositories/project-repository";
import { OfferRepository } from "../../infrastructure/repositories/offer-repository";
import { calculateProjectTotal } from "../../domain/services/pricing-service";

export class GenerateOfferUseCase {
  constructor(
    private projectRepo: ProjectRepository,
    private offerRepo: OfferRepository
  ) {}

  /**
   * Executes the offer generation process:
   * 1. Fetches project data (rooms, products).
   * 2. Calculates totals.
   * 3. Creates a data snapshot.
   * 4. Saves a new offer version with a public token.
   */
  async execute(projectId: string): Promise<string | null> {
    const project = await this.projectRepo.getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    const rooms = await this.projectRepo.getRoomsByProjectId(projectId);
    const products = await this.projectRepo.getProductsByProjectId(projectId);

    // Calculate totals using Domain Service
    const pricingItems = products.map(p => ({
      price: p.product?.price || 0,
      quantity: p.quantity,
      discountPercent: p.discountPercent
    }));
    
    const totals = calculateProjectTotal(pricingItems);

    // Create Snapshot DTO
    const snapshot = {
      project,
      rooms,
      products,
      totals,
      generatedAt: new Date().toISOString(),
    };

    // Determine next version number
    const lastVersion = await this.offerRepo.getLastVersionNumber(projectId);
    const nextVersion = lastVersion + 1;

    // Generate public token
    const publicToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Save Offer Version
    const offer = await this.offerRepo.createOfferVersion({
      projectId,
      versionNumber: nextVersion,
      data: snapshot,
      publicToken,
      isActive: true
    });

    return offer?.publicToken || null;
  }
}
