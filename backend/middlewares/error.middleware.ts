import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";

export function errorMiddleware() {
  return (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof AppError) {
      logger.warn(err.message, { statusCode: err.statusCode, code: err.code });
      res.status(err.statusCode).json({
        error: err.message,
        code: err.code,
        ...(err instanceof Error && "details" in err && { details: (err as { details?: unknown }).details }),
      });
      return;
    }
    logger.error(err.message, { stack: err.stack });
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    });
  };
}
