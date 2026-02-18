import { Response } from "express";
import { analyticsService } from "../services";
import type { AuthRequest } from "../middlewares";

export const analyticsController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    const data = await analyticsService.getAll();
    res.json(data);
  },

  async getByProductId(req: AuthRequest, res: Response): Promise<void> {
    const { productId } = req.params;
    const data = await analyticsService.getByProductId(productId);
    if (!data) {
      res.status(404).json({ error: "Métricas não encontradas" });
      return;
    }
    res.json(data);
  },

  async track(req: AuthRequest, res: Response): Promise<void> {
    const { productId, type } = req.body as { productId: string; type: "view" | "click" };
    if (type === "view") {
      await analyticsService.trackView(productId);
    } else {
      await analyticsService.trackClick(productId);
    }
    res.json({ ok: true });
  },
};
