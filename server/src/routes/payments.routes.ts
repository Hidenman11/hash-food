import { PaymentProvider, PaymentStatus } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import type { Server as SocketIOServer } from "socket.io";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { initiateMobileMoneyPayment } from "../services/mobileMoney.service.js";

export function createPaymentsRouter(io: SocketIOServer) {
  const router = Router();

  const intentSchema = z.object({
    orderId: z.string(),
    provider: z.nativeEnum(PaymentProvider),
    msisdn: z.string().min(9),
  });

  router.post("/mobile-money/intent", requireAuth, async (req, res) => {
    const parsed = intentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { orderId, provider, msisdn } = parsed.data;
    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId: req.user!.id },
    });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    if (order.status !== "PENDING_PAYMENT") {
      res.status(400).json({ error: "Order is not awaiting payment" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    try {
      const gateway = await initiateMobileMoneyPayment({
        amountTzs: order.totalTzs,
        currency: "TZS",
        provider,
        msisdn,
        orderId: order.id,
        customerEmail: user?.email,
      });

      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          provider,
          amountTzs: order.totalTzs,
          currency: "TZS",
          status: gateway.status === "PROCESSING" ? "PROCESSING" : "PENDING",
          msisdn,
          externalRef: gateway.externalRef,
          providerMeta: gateway.raw ? (gateway.raw as object) : undefined,
        },
      });

      res.status(201).json({
        data: {
          paymentId: payment.id,
          externalRef: gateway.externalRef,
          status: payment.status,
          instructions: gateway.instructions,
        },
      });
    } catch (e) {
      res.status(502).json({ error: (e as Error).message });
    }
  });

  const webhookSchema = z.object({
    externalRef: z.string(),
    status: z.enum(["PAID", "FAILED"]),
  });

  router.post("/webhook/mobile-money", async (req, res) => {
    const secret = process.env.MOBILE_MONEY_WEBHOOK_SECRET;
    if (secret) {
      const sig = String(req.headers["x-webhook-secret"] ?? "");
      if (sig !== secret) {
        res.status(401).json({ error: "Invalid webhook secret" });
        return;
      }
    }

    const parsed = webhookSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const payment = await prisma.payment.findFirst({
      where: { externalRef: parsed.data.externalRef },
    });
    if (!payment) {
      res.status(404).json({ error: "Unknown reference" });
      return;
    }

    const nextPay: PaymentStatus = parsed.data.status === "PAID" ? "PAID" : "FAILED";
    const nextOrder = parsed.data.status === "PAID" ? "PAID" : "CANCELLED";

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: nextPay },
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: nextOrder },
      }),
    ]);

    io.to(`order:${payment.orderId}`).emit("order:updated", {
      orderId: payment.orderId,
      status: nextOrder,
      paymentStatus: nextPay,
    });

    res.json({ ok: true });
  });

  return router;
}
