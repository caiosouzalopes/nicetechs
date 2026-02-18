import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares";
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import productsRoutes from "./modules/products/products.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Nicetech Backend",
    status: "ok",
    docs: "/health",
    api: {
      auth: "/api/auth",
      users: "/api/users",
      products: "/api/products",
      analytics: "/api/analytics",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(errorMiddleware());

app.listen(env.PORT, () => {
  logger.info(`Backend rodando em http://localhost:${env.PORT}`, {
    node_env: env.NODE_ENV,
    port: env.PORT,
  });
});
