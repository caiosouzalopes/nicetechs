import { Response } from "express";
import { authService } from "../modules/auth/auth.service";
import type { AuthRequest } from "../middlewares";

export const authController = {
  async register(req: AuthRequest, res: Response): Promise<void> {
    const { email, password, full_name } = req.body;
    const result = await authService.register({ email, password, full_name });
    res.status(201).json(result);
  },

  async login(req: AuthRequest, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  },

  async refresh(req: AuthRequest, res: Response): Promise<void> {
    const { refresh_token } = req.body;
    const result = await authService.refresh(refresh_token);
    res.json(result);
  },

  async me(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    res.json({ user: req.user });
  },
};
