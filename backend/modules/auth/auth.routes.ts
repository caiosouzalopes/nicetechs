import { Router } from "express";
import { authController } from "../../controllers/index.js";
import { authMiddleware, validateBody } from "../../middlewares/index.js";
import { registerSchema, loginSchema, refreshSchema } from "../../utils/validators.js";

const router = Router();

router.post("/register", validateBody(registerSchema), (req, res) =>
  authController.register(req as never, res)
);
router.post("/login", validateBody(loginSchema), (req, res) =>
  authController.login(req as never, res)
);
router.post("/refresh", validateBody(refreshSchema), (req, res) =>
  authController.refresh(req as never, res)
);
router.get("/me", authMiddleware(), (req, res) =>
  authController.me(req as never, res)
);

export default router;
