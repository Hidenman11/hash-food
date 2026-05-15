import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import type { Server as SocketIOServer } from "socket.io";
import { config } from "./config.js";
import authRoutes from "./routes/auth.routes.js";
import mapsRoutes from "./routes/maps.routes.js";
import { createOrdersRouter } from "./routes/orders.routes.js";
import { createPaymentsRouter } from "./routes/payments.routes.js";
import restaurantsRoutes from "./routes/restaurants.routes.js";
import { createRidersRouter } from "./routes/riders.routes.js";

export function configureApp(app: Application, io: SocketIOServer) {
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "hash-food-api" });
  });

  app.use("/v1/auth", authRoutes);
  app.use("/v1/restaurants", restaurantsRoutes);
  app.use("/v1/orders", createOrdersRouter(io));
  app.use("/v1/payments", createPaymentsRouter(io));
  app.use("/v1/riders", createRidersRouter(io));
  app.use("/v1/maps", mapsRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
}

export function createBaseApp() {
  return express();
}
