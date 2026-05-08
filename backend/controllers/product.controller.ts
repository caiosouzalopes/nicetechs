import { Response } from "express";
import { productService } from "../services/index.js";
import type { AuthRequest } from "../middlewares/index.js";
import type { ListProductsQuery } from "../types/api.js";

export const productController = {
  async list(req: AuthRequest, res: Response): Promise<void> {
    const query = req.query as unknown as ListProductsQuery;
    const result = await productService.list(query);
    res.json(result);
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await productService.getById(id);
    res.json(product);
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await productService.update(id, req.body);
    res.json(product);
  },

  async remove(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    await productService.remove(id);
    res.status(204).send();
  },
};
