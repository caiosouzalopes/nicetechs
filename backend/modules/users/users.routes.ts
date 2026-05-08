import { Router } from "express";
import { authMiddleware } from "../../middlewares/index.js";

const router = Router();

router.get("/me", authMiddleware(), (req, res) => {
  res.json({ user: (req as import("../../middlewares/index.js").AuthRequest).user });
});

export default router;
