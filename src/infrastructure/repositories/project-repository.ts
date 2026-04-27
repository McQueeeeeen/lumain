import { supabase } from "../supabase/client";
import { Project, Room, ProjectProduct } from "../../domain/entities";

export class ProjectRepository {
  async createProject(project: Omit<Project, "id" | "createdAt">): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        client_name: project.clientName,
        manager_name: project.managerName,
        owner_id: project.ownerId,
        status: project.status
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error creating project:", error);
      return null;
    }

    return {
      id: data.id,
      clientName: data.client_name,
      managerName: data.manager_name,
      ownerId: data.owner_id,
      status: data.status,
      createdAt: data.created_at,
    };
  }

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    
    return {
      id: data.id,
      clientName: data.client_name,
      managerName: data.manager_name,
      ownerId: data.owner_id,
      status: data.status,
      createdAt: data.created_at,
    };
  }

  async getRoomsByProjectId(projectId: string): Promise<Room[]> {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("project_id", projectId);

    if (error || !data) return [];
    
    return data.map(r => ({
      id: r.id,
      projectId: r.project_id,
      type: r.type,
      area: Number(r.area),
      style: r.style,
      budget: r.budget,
    }));
  }

  async getProductsByProjectId(projectId: string): Promise<(ProjectProduct & { product?: any })[]> {
    const { data, error } = await supabase
      .from("project_products")
      .select("*, products(*)")
      .eq("project_id", projectId);

    if (error || !data) return [];
    
    return data.map(p => ({
      id: p.id,
      projectId: p.project_id,
      roomId: p.room_id,
      productId: p.product_id,
      quantity: p.quantity,
      discountPercent: Number(p.discount_percent),
      role: p.role,
      product: p.products
    }));
  }

  // --- Lock Mechanism ---

  async acquireLock(projectId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("project_locks")
      .upsert({
        project_id: projectId,
        locked_by: userId,
        locked_at: new Date().toISOString()
      });

    return !error;
  }

  async getLock(projectId: string): Promise<{ lockedBy: string, lockedAt: string } | null> {
    const { data, error } = await supabase
      .from("project_locks")
      .select("*")
      .eq("project_id", projectId)
      .single();

    if (error || !data) return null;
    return {
      lockedBy: data.locked_by,
      lockedAt: data.locked_at
    };
  }

  async releaseLock(projectId: string, userId: string): Promise<void> {
    await supabase
      .from("project_locks")
      .delete()
      .eq("project_id", projectId)
      .eq("locked_by", userId);
  }
}
