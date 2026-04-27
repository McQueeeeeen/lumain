import { ProjectRepository } from "../../infrastructure/repositories/project-repository";
import { Project } from "../../domain/entities";

export class CreateProjectUseCase {
  constructor(private projectRepo: ProjectRepository) {}

  async execute(clientName: string, managerName: string, ownerId: string): Promise<Project | null> {
    // 1. Validate inputs (Application logic)
    if (!clientName || !managerName) {
      throw new Error("Client name and manager name are required");
    }

    // 2. Map to Domain model & save via Repository
    const project = await this.projectRepo.createProject({
      clientName,
      managerName,
      ownerId,
      status: "draft",
    });

    // 3. Log audit (Future requirement)
    // console.log(`Project created for ${clientName}`);

    return project;
  }
}
