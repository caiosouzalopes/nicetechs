import { Router } from "express";
import { analyticsController } from "../../controllers";
import { authMiddleware, requireRole, validateBody } from "../../middlewares";
import { trackAnalyticsSchema } from "../../utils/validators";

const router = Router();

router.get("/", authMiddleware(), requireRole("admin"), (req, res, next) =>
  analyticsController.getAll(req as never, res, next)
);
router.get("/:productId", authMiddleware(), requireRole("admin"), (req, res, next) =>
  analyticsController.getByProductId(req as never, res, next)
);

router.post("/track", validateBody(trackAnalyticsSchema), (req, res, next) =>
  analyticsController.track(req as never, res, next)
);

export default router;
