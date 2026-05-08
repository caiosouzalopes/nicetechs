import type { RegisterInput } from "../../types/auth.js";
import type { LoginResponse } from "../../types/auth.js";
import type { Role } from "../../types/auth.js";
import { UnauthorizedError, ValidationError } from "../../utils/errors.js";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

const EXPIRES_IN_SECONDS = 60 * 60;

function signAccessToken(payload: { sub: string; email: string; role: Role }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: EXPIRES_IN_SECONDS });
}

export const authService = {
  async register(input: RegisterInput): Promise<LoginResponse> {
    throw new ValidationError(
      "Registro não está habilitado. Este sistema usa autenticação simples por senha de admin."
    );
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    if (!password || password !== env.ADMIN_PASSWORD) {
      throw new UnauthorizedError("Email ou senha inválidos");
    }
    const role: Role = "admin";
    const userId = "admin";
    const accessToken = signAccessToken({ sub: userId, email: email || "admin@local", role });
    return {
      access_token: accessToken,
      refresh_token: "",
      expires_in: EXPIRES_IN_SECONDS,
      user: {
        id: userId,
        email: email || "admin@local",
        role,
      },
    };
  },

  async refresh(refreshToken: string): Promise<LoginResponse> {
    throw new UnauthorizedError("Refresh token não suportado neste modo de autenticação");
  },

  async getUserFromToken(accessToken: string): Promise<{ id: string; email: string; role: Role } | null> {
    try {
      const decoded = jwt.verify(accessToken, env.JWT_SECRET) as { sub?: string; email?: string; role?: Role };
      if (!decoded?.sub) return null;
      return {
        id: decoded.sub,
        email: decoded.email ?? "admin@local",
        role: decoded.role ?? "admin",
      };
    } catch {
      return null;
    }
  },
};
