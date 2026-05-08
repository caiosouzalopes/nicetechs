import type { RegisterInput } from "../../types/auth.js";
import type { LoginResponse } from "../../types/auth.js";
import type { Role } from "../../types/auth.js";
import { UnauthorizedError, ValidationError } from "../../utils/errors.js";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { userRepository } from "../../repositories/index.js";

const EXPIRES_IN_SECONDS = 60 * 60;

function signAccessToken(payload: { sub: string; email: string; role: Role }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: EXPIRES_IN_SECONDS });
}

export const authService = {
  async register(input: RegisterInput): Promise<LoginResponse> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new ValidationError("Email já cadastrado");
    }
    const user = await userRepository.create({
      email: input.email,
      password: input.password,
      role: "user",
    });
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role as Role });
    return {
      access_token: accessToken,
      refresh_token: "",
      expires_in: EXPIRES_IN_SECONDS,
      user: {
        id: user.id,
        email: user.email,
        role: user.role as Role,
      },
    };
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password) {
      throw new UnauthorizedError("Email e senha são obrigatórios");
    }
    const user = await userRepository.verifyPassword(email, password);
    if (!user) {
      throw new UnauthorizedError("Email ou senha inválidos");
    }
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role as Role });
    return {
      access_token: accessToken,
      refresh_token: "",
      expires_in: EXPIRES_IN_SECONDS,
      user: {
        id: user.id,
        email: user.email,
        role: user.role as Role,
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
      const user = await userRepository.findById(decoded.sub);
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        role: user.role as Role,
      };
    } catch {
      return null;
    }
  },
};
