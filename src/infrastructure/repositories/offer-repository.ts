import { supabase } from "../supabase/client";
import { OfferVersion } from "../../domain/entities";

export class OfferRepository {
  async getLastVersionNumber(projectId: string): Promise<number> {
    const { data, error } = await supabase
      .from("offer_versions")
      .select("version_number")
      .eq("project_id", projectId)
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return 0;
    return data.version_number;
  }

  async createOfferVersion(offer: Omit<OfferVersion, "id">): Promise<OfferVersion | null> {
    const { data, error } = await supabase
      .from("offer_versions")
      .insert({
        project_id: offer.projectId,
        version_number: offer.versionNumber,
        data: offer.data,
        public_token: offer.publicToken,
        is_active: offer.isActive
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error creating offer version:", error);
      return null;
    }
    
    return {
      id: data.id,
      projectId: data.project_id,
      versionNumber: data.version_number,
      data: data.data,
      publicToken: data.public_token,
      isActive: data.is_active
    };
  }

  async getOfferByToken(token: string): Promise<OfferVersion | null> {
    const { data, error } = await supabase
      .from("offer_versions")
      .select("*")
      .eq("public_token", token)
      .eq("is_active", true)
      .single();

    if (error || !data) return null;
    
    return {
      id: data.id,
      projectId: data.project_id,
      versionNumber: data.version_number,
      data: data.data,
      publicToken: data.public_token,
      isActive: data.is_active
    };
  }
}
