"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getMyOrders, getOrder, type OrderDetails, type OrderStatus } from "@/lib/api";
import { cn } from "@/lib/cn";
import { createRealtimeSocket, type RiderLocationEvent } from "@/lib/realtime";
import { formatTzs } from "./customer-data";

const steps: Array<{ label: string; statuses: OrderStatus[] }> = [
  { label: "Order placed", statuses: ["PENDING_PAYMENT", "PAID"] },
  { label: "Confirmed", statuses: ["CONFIRMED"] },
  { label: "Preparing", statuses: ["PREPARING"] },
  { label: "Pickup ready", statuses: ["READY_FOR_PICKUP"] },
  { label: "On the way", statuses: ["PICKED_UP", "EN_ROUTE"] },
  { label: "Delivered", statuses: ["DELIVERED"] },
];

type OrderListItem = {
  id: string;
  status: OrderStatus;
  totalTzs: number;
  restaurant?: { name: string };
  rider?: { currentLat: number | null; currentLng: number | null } | null;
};

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

function statusStep(status: OrderStatus) {
  if (status === "CANCELLED") return -1;
  const index = steps.findIndex((step) => step.statuses.includes(status));
  return index === -1 ? 0 : index;
}

function orderItems(order: OrderDetails) {
  return order.items.map((item) => `${item.quantity}x ${item.menuItem.name}`).join(", ");
}

export function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("");
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [liveLocation, setLiveLocation] = useState<RiderLocationEvent | null>(null);
  const [realtimeState, setRealtimeState] = useState<"idle" | "connected" | "fallback">("idle");
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState("");

  const loadMine = useCallback(async () => {
    try {
      const result = await getMyOrders();
      const list = result.data as OrderListItem[];
      setOrders(list);
      if (!activeId && list[0]?.id) {
        setActiveId(list[0].id);
        setQuery(list[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login first to track your orders.");
    } finally {
      setLoading(false);
    }
  }, [activeId]);

  const loadOrder = useCallback(async (id: string) => {
    if (!id.trim()) return;
    try {
      setTracking(true);
      setError("");
      const result = await getOrder(id.trim());
      setActiveOrder(result.data);
      setLiveLocation(
        result.data.rider?.currentLat != null && result.data.rider.currentLng != null
          ? {
              orderId: result.data.id,
              riderId: result.data.rider.id,
              lat: result.data.rider.currentLat,
              lng: result.data.rider.currentLng,
              heading: result.data.rider.heading,
              at: result.data.updatedAt,
            }
          : null,
      );
      setActiveId(result.data.id);
      setQuery(result.data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order haijapatikana.");
      setActiveOrder(null);
    } finally {
      setTracking(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMine();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadMine]);

  useEffect(() => {
    if (!activeId) return;
    const first = window.setTimeout(() => {
      void loadOrder(activeId);
    }, 0);
    const timer = window.setInterval(() => {
      void loadOrder(activeId);
    }, 10000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [activeId, loadOrder]);

  useEffect(() => {
    if (!activeId) return;
    const socket = createRealtimeSocket();
    if (!socket) {
      const fallback = window.setTimeout(() => setRealtimeState("fallback"), 0);
      return () => window.clearTimeout(fallback);
    }

    socket.on("connect", () => {
      setRealtimeState("connected");
      socket.emit("order:subscribe", { orderId: activeId }, (response) => {
        if (!response.ok) setRealtimeState("fallback");
      });
    });

    socket.on("connect_error", () => {
      setRealtimeState("fallback");
    });

    socket.on("order:updated", (event) => {
      if (event.orderId === activeId) void loadOrder(activeId);
    });

    socket.on("rider:location", (event) => {
      if (event.orderId === activeId) setLiveLocation(event);
    });

    return () => {
      socket.emit("order:unsubscribe", { orderId: activeId });
      socket.disconnect();
    };
  }, [activeId, loadOrder]);

  const activeIndex = useMemo(
    () => (activeOrder ? statusStep(activeOrder.status) : 0),
    [activeOrder],
  );

  function submitLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadOrder(query);
  }

  return (
    <section className="min-h-screen bg-[#07090d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Track order</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Fuatilia order yako live
            </h1>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Weka order ID kuona restaurant status, rider assignment, na delivery progress.
            </p>
            <p className="mt-3 inline-flex rounded-full border border-white/[0.08] bg-black/25 px-3 py-1 text-xs font-semibold text-zinc-400">
              {realtimeState === "connected" ? "Live updates connected" : "Polling fallback active"}
            </p>

            <form onSubmit={submitLookup} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label className="flex min-h-12 flex-1 items-center rounded-xl border border-white/[0.08] bg-black/25 px-4">
                <span className="sr-only">Order ID</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Paste order ID"
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-zinc-600"
                />
              </label>
              <button type="submit" className="min-h-12 rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950">
                {tracking ? "Tracking..." : "Track"}
              </button>
            </form>

            {error ? (
              <p className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            ) : null}

            <div className="mt-6 grid gap-3">
              {orders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => {
                    setActiveId(order.id);
                    setQuery(order.id);
                  }}
                  className={cn(
                    "rounded-xl border p-4 text-left transition",
                    activeId === order.id
                      ? "border-orange-400/50 bg-orange-500/10"
                      : "border-white/[0.08] bg-black/25 hover:bg-white/[0.04]",
                  )}
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs font-semibold text-white">#{order.id.slice(-8)}</p>
                      <p className="mt-1 text-sm text-zinc-500">{order.restaurant?.name ?? "Restaurant"}</p>
                    </div>
                    <p className="text-sm font-bold text-orange-300">{statusLabel(order.status)}</p>
                  </div>
                </button>
              ))}

              {!loading && !orders.length ? (
                <div className="rounded-2xl border border-dashed border-white/[0.12] p-6 text-center">
                  <p className="font-semibold text-white">No orders yet</p>
                  <p className="mt-2 text-sm text-zinc-500">Ukiweka order, itaonekana hapa.</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-5 sm:p-6">
            {!activeOrder ? (
              <div className="flex min-h-96 items-center justify-center rounded-2xl border border-dashed border-white/[0.12] text-center">
                <div>
                  <p className="text-lg font-semibold text-white">Select an order</p>
                  <p className="mt-2 text-sm text-zinc-500">Chagua order au paste order ID kuanza tracking.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-mono text-xs font-semibold text-zinc-500">Order #{activeOrder.id.slice(-8)}</p>
                    <h2 className="mt-1 text-2xl font-semibold text-white">{activeOrder.restaurant.name}</h2>
                    <p className="mt-2 text-sm text-zinc-400">{orderItems(activeOrder)}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Status</p>
                    <p className="text-xl font-bold text-emerald-200">{statusLabel(activeOrder.status)}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative min-h-80 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827]">
                    <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:34px_34px]" />
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 540 330" fill="none" aria-hidden>
                      <path d="M56 264 C142 168 208 220 274 130 S398 96 486 58" stroke="#f97316" strokeWidth="7" strokeLinecap="round" strokeDasharray="13 15" />
                      <circle cx="56" cy="264" r="14" fill="#22c55e" />
                      <circle cx="274" cy="130" r="14" fill="#f97316" />
                      <circle cx="486" cy="58" r="14" fill="#38bdf8" />
                    </svg>
                    <div className="absolute left-4 top-4 rounded-2xl bg-black/70 p-4 backdrop-blur">
                      <p className="text-sm font-semibold text-white">Live route</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {activeOrder.rider?.currentLat && activeOrder.rider?.currentLng
                          ? `Rider: ${(liveLocation?.lat ?? activeOrder.rider.currentLat).toFixed(4)}, ${(liveLocation?.lng ?? activeOrder.rider.currentLng).toFixed(4)}`
                          : "Rider location bado haijatumwa"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                      <p className="text-sm font-semibold text-zinc-500">Rider</p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {activeOrder.rider?.user.fullName ?? "Not assigned"}
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">{activeOrder.rider?.user.phone ?? "Waiting for admin assignment"}</p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                      <p className="text-sm font-semibold text-zinc-500">Payment</p>
                      <p className="mt-2 text-xl font-semibold text-white">{formatTzs(activeOrder.totalTzs)}</p>
                      <p className="mt-1 text-sm text-emerald-300">{statusLabel(activeOrder.status)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                  <h3 className="font-semibold text-white">Order timeline</h3>
                  <div className="mt-5 grid gap-3 md:grid-cols-6">
                    {steps.map((step, index) => (
                      <div key={step.label} className="min-w-0">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                            index <= activeIndex ? "bg-emerald-500 text-zinc-950" : "bg-white/[0.07] text-zinc-500",
                          )}
                        >
                          {index + 1}
                        </div>
                        <p className={cn("mt-2 text-xs font-semibold", index <= activeIndex ? "text-white" : "text-zinc-600")}>
                          {step.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
