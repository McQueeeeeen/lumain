import { supabase } from "../supabase/client";

export class AuditRepository {
  async logAction(action: string, payload: unknown): Promise<void> {
    await supabase
      .from("audit_logs")
      .insert({
        action,
        payload,
      });
  }

  async getLogs(): Promise<unknown[]> {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data;
  }
}
