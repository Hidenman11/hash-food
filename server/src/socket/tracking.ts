import type { Server as SocketIOServer, Socket } from "socket.io";
import { verifySocketToken } from "../services/auth.service.js";
import { prisma } from "../lib/prisma.js";

export function registerTrackingSocket(io: SocketIOServer) {
  io.use((socket, next) => {
    const token =
      (socket.handshake.auth?.token as string | undefined) ||
      (typeof socket.handshake.headers.authorization === "string" &&
      socket.handshake.headers.authorization.startsWith("Bearer ")
        ? socket.handshake.headers.authorization.slice(7)
        : undefined);
    if (!token) {
      next(new Error("Unauthorized"));
      return;
    }
    const user = verifySocketToken(token);
    if (!user) {
      next(new Error("Unauthorized"));
      return;
    }
    socket.data.user = user;
    next();
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as { id: string; role: string };

    socket.on("order:subscribe", async (payload: { orderId: string }, cb) => {
      try {
        const order = await prisma.order.findUnique({
          where: { id: payload.orderId },
          include: { restaurant: true, rider: true },
        });
        if (!order) {
          cb?.({ ok: false, error: "Not found" });
          return;
        }
        const allowed =
          user.role === "ADMIN" ||
          order.customerId === user.id ||
          order.restaurant.ownerUserId === user.id ||
          order.rider?.userId === user.id;
        if (!allowed) {
          cb?.({ ok: false, error: "Forbidden" });
          return;
        }
        await socket.join(`order:${payload.orderId}`);
        cb?.({ ok: true });
      } catch {
        cb?.({ ok: false, error: "Server error" });
      }
    });

    socket.on("order:unsubscribe", (payload: { orderId: string }) => {
      void socket.leave(`order:${payload.orderId}`);
    });

    socket.on(
      "rider:location",
      async (
        payload: { lat: number; lng: number; heading?: number; orderId?: string },
        cb,
      ) => {
        try {
          if (user.role !== "RIDER") {
            cb?.({ ok: false, error: "Forbidden" });
            return;
          }
          const rider = await prisma.rider.update({
            where: { userId: user.id },
            data: {
              currentLat: payload.lat,
              currentLng: payload.lng,
              heading: payload.heading,
              lastSeenAt: new Date(),
            },
          });

          const orderId =
            payload.orderId ??
            (
              await prisma.order.findFirst({
                where: {
                  riderId: rider.id,
                  status: { in: ["PICKED_UP", "EN_ROUTE", "READY_FOR_PICKUP"] },
                },
                orderBy: { updatedAt: "desc" },
              })
            )?.id;

          if (orderId) {
            io.to(`order:${orderId}`).emit("rider:location", {
              orderId,
              riderId: rider.id,
              lat: payload.lat,
              lng: payload.lng,
              heading: payload.heading ?? rider.heading,
              at: new Date().toISOString(),
            });
          }
          cb?.({ ok: true });
        } catch {
          cb?.({ ok: false });
        }
      },
    );
  });
}
