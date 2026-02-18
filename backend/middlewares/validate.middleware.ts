import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../utils/errors";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.body) as T;
      (req as Request & { body: T }).body = parsed;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        const details = e.flatten().fieldErrors;
        next(new ValidationError("Dados inválidos", details));
      } else {
        next(e);
      }
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.query) as T;
      (req as Request & { query: T }).query = parsed;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        const details = e.flatten().fieldErrors;
        next(new ValidationError("Parâmetros inválidos", details));
      } else {
        next(e);
      }
    }
  };
}
