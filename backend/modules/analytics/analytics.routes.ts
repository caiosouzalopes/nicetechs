import { Router } from "express";
import { analyticsController } from "../../controllers/index.js";
import { authMiddleware, requireRole, validateBody } from "../../middlewares/index.js";
import { trackAnalyticsSchema } from "../../utils/validators.js";

const router = Router();

router.get("/", authMiddleware(), requireRole("admin"), (req, res) =>
  analyticsController.getAll(req as never, res)
);
router.get("/:productId", authMiddleware(), requireRole("admin"), (req, res) =>
  analyticsController.getByProductId(req as never, res)
);

router.post("/track", validateBody(trackAnalyticsSchema), (req, res) =>
  analyticsController.track(req as never, res)
);

export default router;
