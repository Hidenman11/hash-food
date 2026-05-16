import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/health", async (_req, res) => {
  const healthInfo = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: "UP" as const,
    service: "hash-food-api",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ...healthInfo, database: "CONNECTED" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database unavailable";
    console.error("Health check failed:", message);
    res.status(503).json({
      ...healthInfo,
      status: "DOWN",
      database: "DISCONNECTED",
      error: message,
    });
  }
});

export default router;
