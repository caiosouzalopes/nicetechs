import { Router } from "express";
import { productController } from "../../controllers";
import { authMiddleware, requireRole, validateBody, validateQuery } from "../../middlewares";
import { productCreateSchema, productUpdateSchema, listProductsQuerySchema } from "../../utils/validators";

const router = Router();

router.get("/", validateQuery(listProductsQuerySchema), (req, res, next) =>
  productController.list(req as never, res, next)
);
router.get("/:id", (req, res, next) =>
  productController.getById(req as never, res, next)
);

router.post(
  "/",
  authMiddleware(),
  requireRole("admin"),
  validateBody(productCreateSchema),
  (req, res, next) => productController.create(req as never, res, next)
);
router.patch(
  "/:id",
  authMiddleware(),
  requireRole("admin"),
  validateBody(productUpdateSchema),
  (req, res, next) => productController.update(req as never, res, next)
);
router.delete(
  "/:id",
  authMiddleware(),
  requireRole("admin"),
  (req, res, next) => productController.remove(req as never, res, next)
);

export default router;
