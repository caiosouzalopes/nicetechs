import { Router } from "express";
import { productController } from "../../controllers/index.js";
import { authMiddleware, requireRole, validateBody, validateQuery } from "../../middlewares/index.js";
import { productCreateSchema, productUpdateSchema, listProductsQuerySchema } from "../../utils/validators.js";

const router = Router();

router.get("/", validateQuery(listProductsQuerySchema), (req, res) =>
  productController.list(req as never, res)
);
router.get("/:id", (req, res) =>
  productController.getById(req as never, res)
);

router.post(
  "/",
  authMiddleware(),
  requireRole("admin"),
  validateBody(productCreateSchema),
  (req, res) => productController.create(req as never, res)
);
router.patch(
  "/:id",
  authMiddleware(),
  requireRole("admin"),
  validateBody(productUpdateSchema),
  (req, res) => productController.update(req as never, res)
);
router.delete(
  "/:id",
  authMiddleware(),
  requireRole("admin"),
  (req, res) => productController.remove(req as never, res)
);

export default router;
