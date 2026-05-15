import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import type { Server as SocketIOServer } from "socket.io";

export function createRidersRouter(io: SocketIOServer) {
  const router = Router();

  router.get("/me", requireAuth, requireRole("RIDER"), async (req, res) => {
    const rider = await prisma.rider.findUnique({
      where: { userId: req.user!.id },
      include: { user: { select: { email: true, fullName: true, phone: true } } },
    });
    if (!rider) {
      res.status(404).json({ error: "Rider profile not found" });
      return;
    }
    res.json({ data: rider });
  });

  const updateSchema = z.object({
    isOnline: z.boolean().optional(),
    vehicleType: z.string().optional(),
    currentLat: z.number().optional(),
    currentLng: z.number().optional(),
    heading: z.number().optional(),
  });

  router.patch("/me", requireAuth, requireRole("RIDER"), async (req, res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const rider = await prisma.rider.update({
      where: { userId: req.user!.id },
      data: {
        ...parsed.data,
        lastSeenAt: new Date(),
      },
    });

    const activeOrder = await prisma.order.findFirst({
      where: {
        riderId: rider.id,
        status: { in: ["PICKED_UP", "EN_ROUTE", "READY_FOR_PICKUP"] },
      },
      orderBy: { updatedAt: "desc" },
    });
    if (
      activeOrder &&
      parsed.data.currentLat != null &&
      parsed.data.currentLng != null
    ) {
      io.to(`order:${activeOrder.id}`).emit("rider:location", {
        orderId: activeOrder.id,
        riderId: rider.id,
        lat: parsed.data.currentLat,
        lng: parsed.data.currentLng,
        heading: parsed.data.heading ?? rider.heading,
        at: new Date().toISOString(),
      });
    }

    res.json({ data: rider });
  });

  router.get("/", requireAuth, requireRole("ADMIN"), async (_req, res) => {
    const riders = await prisma.rider.findMany({
      include: { user: { select: { email: true, fullName: true, phone: true } } },
      orderBy: { updatedAt: "desc" },
    });
    res.json({ data: riders });
  });

  return router;
}
