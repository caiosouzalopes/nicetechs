import { Router } from "express";
import { authMiddleware } from "../../middlewares";

const router = Router();

router.get("/me", authMiddleware(), (req, res) => {
  res.json({ user: (req as import("../../middlewares").AuthRequest).user });
});

export default router;
