import { getSupabaseAdmin } from "../config/supabase";
import type { ProfileRow } from "../types/database";

const TABLE = "profiles";

export const profileRepository = {
  async findById(id: string): Promise<ProfileRow | null> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as ProfileRow;
  },

  async findByEmail(email: string): Promise<ProfileRow | null> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("*").eq("email", email).single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as ProfileRow;
  },

  async updateRole(id: string, role: "admin" | "user"): Promise<ProfileRow> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(TABLE)
      .update({ role })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as ProfileRow;
  },
};
