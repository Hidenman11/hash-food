import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "./api";

export type OrderUpdatedEvent = {
  orderId: string;
  status?: string;
  riderId?: string;
  paymentStatus?: string;
};

export type RiderLocationEvent = {
  orderId: string;
  riderId: string;
  lat: number;
  lng: number;
  heading?: number | null;
  at: string;
};

type ServerToClientEvents = {
  "order:updated": (event: OrderUpdatedEvent) => void;
  "rider:location": (event: RiderLocationEvent) => void;
};

type ClientToServerEvents = {
  "order:subscribe": (
    payload: { orderId: string },
    callback?: (response: { ok: boolean; error?: string }) => void,
  ) => void;
  "order:unsubscribe": (payload: { orderId: string }) => void;
  "rider:location": (
    payload: { lat: number; lng: number; heading?: number; orderId?: string },
    callback?: (response: { ok: boolean; error?: string }) => void,
  ) => void;
};

export type HashFoodSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createRealtimeSocket() {
  const token = typeof window === "undefined" ? null : localStorage.getItem("hashfood_token");
  if (!token) return null;

  return io(API_BASE_URL || undefined, {
    auth: { token },
    transports: ["websocket", "polling"],
  }) as HashFoodSocket;
}
