import { Router } from "express";
import { authController } from "../../controllers";
import { authMiddleware, validateBody } from "../../middlewares";
import { registerSchema, loginSchema, refreshSchema } from "../../utils/validators";

const router = Router();

router.post("/register", validateBody(registerSchema), (req, res, next) =>
  authController.register(req as never, res, next)
);
router.post("/login", validateBody(loginSchema), (req, res, next) =>
  authController.login(req as never, res, next)
);
router.post("/refresh", validateBody(refreshSchema), (req, res, next) =>
  authController.refresh(req as never, res, next)
);
router.get("/me", authMiddleware(), (req, res, next) =>
  authController.me(req as never, res, next)
);

export default router;
