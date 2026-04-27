import { supabase } from "../supabase/client";
import { Comment } from "../../domain/entities";

export class CommentRepository {
  async getCommentsByProjectId(projectId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error || !data) return [];
    
    return data.map(c => ({
      id: c.id,
      projectId: c.project_id,
      message: c.message,
      authorId: c.author_id,
      authorType: c.author_type,
      createdAt: c.created_at
    }));
  }

  async addComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment | null> {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        project_id: comment.projectId,
        message: comment.message,
        author_id: comment.authorId,
        author_type: comment.authorType
      })
      .select()
      .single();

    if (error || !data) return null;
    
    return {
      id: data.id,
      projectId: data.project_id,
      message: data.message,
      authorId: data.author_id,
      authorType: data.author_type,
      createdAt: data.created_at
    };
  }
}
