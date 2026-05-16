import { OrderStatus } from "@prisma/client";
import { Router } from "express";
import type { Server as SocketIOServer } from "socket.io";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

function orderIdParam(req: { params: { id?: string | string[] } }): string {
  const raw = req.params.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  return id ?? "";
}

const createOrderSchema = z.object({
  restaurantId: z.string(),
  deliveryAddress: z.string().min(5),
  deliveryLat: z.number().optional(),
  deliveryLng: z.number().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export function createOrdersRouter(io: SocketIOServer) {
  const router = Router();

  router.post("/", requireAuth, async (req, res) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const { restaurantId, deliveryAddress, deliveryLat, deliveryLng, notes, items } =
      parsed.data;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, isActive: true },
    });
    if (!restaurant) {
      res.status(404).json({ error: "Restaurant not found" });
      return;
    }

    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: items.map((i) => i.menuItemId) },
        restaurantId,
        isAvailable: true,
      },
    });
    if (menuItems.length !== items.length) {
      res.status(400).json({ error: "Invalid or unavailable menu items" });
      return;
    }

    const priceById = new Map(menuItems.map((m) => [m.id, m.priceTzs]));
    let subtotalTzs = 0;
    const lines = items.map((i) => {
      const unit = priceById.get(i.menuItemId)!;
      subtotalTzs += unit * i.quantity;
      return { menuItemId: i.menuItemId, quantity: i.quantity, unitPriceTzs: unit };
    });

    const deliveryFeeTzs = restaurant.deliveryFeeTzs;
    const totalTzs = subtotalTzs + deliveryFeeTzs;

    const order = await prisma.order.create({
      data: {
        customerId: req.user!.id,
        restaurantId,
        deliveryAddress,
        deliveryLat,
        deliveryLng,
        notes,
        subtotalTzs,
        deliveryFeeTzs,
        totalTzs,
        status: "PENDING_PAYMENT",
        items: {
          create: lines.map((l) => ({
            menuItemId: l.menuItemId,
            quantity: l.quantity,
            unitPriceTzs: l.unitPriceTzs,
          })),
        },
      },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });

    io.to(`order:${order.id}`).emit("order:updated", {
      orderId: order.id,
      status: order.status,
    });

    res.status(201).json({ data: order });
  });

  router.get("/mine", requireAuth, async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user!.id },
      orderBy: { createdAt: "desc" },
      include: {
        restaurant: { select: { id: true, name: true, slug: true } },
        rider: { select: { id: true, currentLat: true, currentLng: true } },
        items: { include: { menuItem: { select: { name: true } } } },
      },
      take: 50,
    });
    res.json({ data: orders });
  });

  router.get("/:id", requireAuth, async (req, res) => {
    const id = orderIdParam(req);
    const user = req.user!;

    const accessWhere =
      user.role === "ADMIN"
        ? { id }
        : user.role === "CUSTOMER"
          ? { id, customerId: user.id }
          : user.role === "RESTAURANT_ADMIN"
            ? { id, restaurant: { ownerUserId: user.id } }
            : { id, rider: { userId: user.id } };

    const order = await prisma.order.findFirst({
      where: accessWhere,
      include: {
        items: { include: { menuItem: true } },
        restaurant: true,
        rider: { include: { user: { select: { fullName: true, phone: true } } } },
        payments: true,
      },
    });

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ data: order });
  });

  const statusSchema = z.object({
    status: z.nativeEnum(OrderStatus),
  });

  router.patch(
    "/:id/status",
    requireAuth,
    requireRole("ADMIN", "RESTAURANT_ADMIN", "RIDER"),
    async (req, res) => {
      const parsed = statusSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id: orderIdParam(req) },
        include: { restaurant: true, rider: true },
      });
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      if (req.user!.role === "RESTAURANT_ADMIN") {
        if (order.restaurant?.ownerUserId !== req.user!.id) {
          res.status(403).json({ error: "Forbidden" });
          return;
        }
        const allowed: OrderStatus[] = [
          "CONFIRMED",
          "PREPARING",
          "READY_FOR_PICKUP",
          "CANCELLED",
        ];
        if (!allowed.includes(parsed.data.status)) {
          res.status(400).json({ error: "Invalid status for restaurant" });
          return;
        }
      }

      if (req.user!.role === "RIDER") {
        if (order.rider?.userId !== req.user!.id) {
          res.status(403).json({ error: "Forbidden" });
          return;
        }
        const allowed: OrderStatus[] = ["PICKED_UP", "EN_ROUTE", "DELIVERED"];
        if (!allowed.includes(parsed.data.status)) {
          res.status(400).json({ error: "Invalid status for rider" });
          return;
        }
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: parsed.data.status },
      });

      io.to(`order:${order.id}`).emit("order:updated", {
        orderId: order.id,
        status: updated.status,
      });

      res.json({ data: updated });
    },
  );

  const assignSchema = z.object({
    riderId: z.string(),
  });

  router.patch(
    "/:id/assign-rider",
    requireAuth,
    requireRole("ADMIN"),
    async (req, res) => {
      const parsed = assignSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const oid = orderIdParam(req);
      const rider = await prisma.rider.findUnique({
        where: { id: parsed.data.riderId },
      });
      if (!rider) {
        res.status(404).json({ error: "Rider not found" });
        return;
      }

      const order = await prisma.order.update({
        where: { id: oid },
        data: { riderId: parsed.data.riderId, status: "CONFIRMED" },
      });

      io.to(`order:${oid}`).emit("order:updated", {
        orderId: oid,
        status: order.status,
        riderId: parsed.data.riderId,
      });

      res.json({ data: order });
    },
  );

  return router;
}
