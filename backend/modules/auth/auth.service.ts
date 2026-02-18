import { getSupabasePublic, getSupabaseAdmin } from "../../config/supabase";
import { profileRepository } from "../../repositories";
import type { RegisterInput } from "../../types/auth";
import type { LoginResponse } from "../../types/auth";
import type { Role } from "../../types/auth";
import { UnauthorizedError, ValidationError } from "../../utils/errors";

export const authService = {
  async register(input: RegisterInput): Promise<LoginResponse> {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: { full_name: input.full_name ?? null },
      },
    });
    if (error) throw new ValidationError(error.message);
    if (!data.session || !data.user) throw new UnauthorizedError("Falha ao criar sessão");

    const profile = await profileRepository.findById(data.user.id);
    const role: Role = (profile?.role as Role) ?? "user";

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token ?? "",
      expires_in: data.session.expires_in ?? 3600,
      user: {
        id: data.user.id,
        email: data.user.email ?? "",
        role,
      },
    };
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new UnauthorizedError("Email ou senha inválidos");
    if (!data.session || !data.user) throw new UnauthorizedError("Sessão não retornada");

    const profile = await profileRepository.findById(data.user.id);
    const role: Role = (profile?.role as Role) ?? "user";

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token ?? "",
      expires_in: data.session.expires_in ?? 3600,
      user: {
        id: data.user.id,
        email: data.user.email ?? "",
        role,
      },
    };
  },

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) throw new UnauthorizedError("Refresh token inválido ou expirado");
    if (!data.session || !data.user) throw new UnauthorizedError("Sessão não retornada");

    const profile = await profileRepository.findById(data.user.id);
    const role: Role = (profile?.role as Role) ?? "user";

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token ?? "",
      expires_in: data.session.expires_in ?? 3600,
      user: {
        id: data.user.id,
        email: data.user.email ?? "",
        role,
      },
    };
  },

  async getUserFromToken(accessToken: string): Promise<{ id: string; email: string; role: Role } | null> {
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) return null;
    const profile = await profileRepository.findById(user.id);
    const role: Role = (profile?.role as Role) ?? "user";
    return {
      id: user.id,
      email: user.email ?? "",
      role,
    };
  },
};
