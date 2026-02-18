import { Request, Response, NextFunction } from "express";
import { authService } from "../modules/auth/auth.service";
import type { Role } from "../types/auth";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: Role };
}

export function authMiddleware() {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
      if (!token) {
        next(new UnauthorizedError("Token não informado"));
        return;
      }
      const user = await authService.getUserFromToken(token);
      if (!user) {
        next(new UnauthorizedError("Token inválido ou expirado"));
        return;
      }
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  };
}

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError("Não autenticado"));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError("Sem permissão para esta ação"));
      return;
    }
    next();
  };
}
