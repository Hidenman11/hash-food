"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getRiderMe,
  updateOrderStatus,
  updateRiderMe,
  type AuthUser,
  type OrderDetails,
  type OrderStatus,
  type RiderProfile,
} from "@/lib/api";
import { createRealtimeSocket, type HashFoodSocket } from "@/lib/realtime";
import { getPartnerProfile, type PartnerProfile, type PartnerRole } from "@/lib/partner-store";

type PartnerDashboardProps = {
  role: PartnerRole;
};

function readUser() {
  try {
    const saved = localStorage.getItem("hashfood_user");
    return saved ? (JSON.parse(saved) as AuthUser) : null;
  } catch {
    return null;
  }
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function formatTzs(value: number) {
  return `TSh ${value.toLocaleString()}`;
}

function orderItems(order: OrderDetails) {
  return order.items.map((item) => `${item.quantity}x ${item.menuItem.name}`).join(", ");
}

function nextRiderStatus(status: OrderStatus): OrderStatus | null {
  if (status === "READY_FOR_PICKUP" || status === "CONFIRMED" || status === "PREPARING") {
    return "PICKED_UP";
  }
  if (status === "PICKED_UP") return "EN_ROUTE";
  if (status === "EN_ROUTE") return "DELIVERED";
  return null;
}

function statusLabel(status: OrderStatus) {
  return status.replace(/_/g, " ");
}

export function PartnerDashboard({ role }: PartnerDashboardProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof window === "undefined" ? null : readUser(),
  );
  const [profile, setProfile] = useState<PartnerProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const currentUser = readUser();
    return getPartnerProfile(currentUser?.email);
  });
  const [rider, setRider] = useState<RiderProfile | null>(null);
  const [loading, setLoading] = useState(role === "RIDER");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [realtimeState, setRealtimeState] = useState<"idle" | "connected" | "fallback">("idle");
  const socketRef = useRef<HashFoodSocket | null>(null);

  const isRestaurant = role === "RESTAURANT_ADMIN";
  const pendingLocalVerification = Boolean(profile && profile.verificationStatus !== "verified");
  const authorized = user?.role === role && !pendingLocalVerification;

  const loadRider = useCallback(async () => {
    if (role !== "RIDER" || !authorized) return;
    try {
      setLoading(true);
      setError("");
      const result = await getRiderMe();
      setRider(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rider profile.");
    } finally {
      setLoading(false);
    }
  }, [authorized, role]);

  useEffect(() => {
    const syncSession = () => {
      const currentUser = readUser();
      setUser(currentUser);
      setProfile(getPartnerProfile(currentUser?.email));
    };

    window.addEventListener("storage", syncSession);
    window.addEventListener("hashfood-auth-updated", syncSession);
    window.addEventListener("hashfood-partner-updated", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("hashfood-auth-updated", syncSession);
      window.removeEventListener("hashfood-partner-updated", syncSession);
    };
  }, []);

  useEffect(() => {
    if (role !== "RIDER" || !authorized) return;
    const first = window.setTimeout(() => {
      void loadRider();
    }, 0);
    const timer = window.setInterval(() => {
      void loadRider();
    }, 15000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [authorized, loadRider, role]);

  useEffect(() => {
    if (role !== "RIDER" || !authorized) return;
    const nextSocket = createRealtimeSocket();
    if (!nextSocket) {
      const fallback = window.setTimeout(() => setRealtimeState("fallback"), 0);
      return () => window.clearTimeout(fallback);
    }

    nextSocket.on("connect", () => setRealtimeState("connected"));
    nextSocket.on("connect_error", () => setRealtimeState("fallback"));
    socketRef.current = nextSocket;

    return () => {
      nextSocket.disconnect();
      socketRef.current = null;
      setRealtimeState("idle");
    };
  }, [authorized, role]);

  const deliveredToday = useMemo(
    () => rider?.orders.filter((order) => order.status === "DELIVERED").length ?? 0,
    [rider],
  );

  async function toggleOnline() {
    if (!rider) return;
    setMessage("");
    setError("");
    try {
      const result = await updateRiderMe({ isOnline: !rider.isOnline });
      setRider((current) => (current ? { ...current, ...result.data } : result.data));
      setMessage(result.data.isOnline ? "Uko online kupokea delivery." : "Uko offline kwa sasa.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update online status.");
    }
  }

  async function shareLocation() {
    if (!navigator.geolocation) {
      setError("Browser yako haija-support location sharing.");
      return;
    }
    setMessage("Tunachukua location yako...");
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await updateRiderMe({
            currentLat: position.coords.latitude,
            currentLng: position.coords.longitude,
            heading: position.coords.heading ?? undefined,
          });
          const activeOrderId = rider?.orders.find((order) =>
            ["READY_FOR_PICKUP", "PICKED_UP", "EN_ROUTE"].includes(order.status),
          )?.id;
          socketRef.current?.emit(
            "rider:location",
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              heading: position.coords.heading ?? undefined,
              orderId: activeOrderId,
            },
            (response) => {
              if (!response.ok) setRealtimeState("fallback");
            },
          );
          setRider((current) => (current ? { ...current, ...result.data } : result.data));
          setMessage("Location imetumwa kwa active delivery.");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to update location.");
          setMessage("");
        }
      },
      () => {
        setError("Location permission imekataliwa au haikupatikana.");
        setMessage("");
      },
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 12000 },
    );
  }

  async function advanceOrder(order: OrderDetails) {
    const next = nextRiderStatus(order.status);
    if (!next) return;
    setMessage("");
    setError("");
    try {
      await updateOrderStatus(order.id, next);
      await loadRider();
      setMessage(`Order #${order.id.slice(-6)} sasa iko ${statusLabel(next)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order status.");
    }
  }

  function signOut() {
    localStorage.removeItem("hashfood_token");
    localStorage.removeItem("hashfood_user");
    window.dispatchEvent(new Event("hashfood-auth-updated"));
    router.push("/login");
  }

  if (!user) {
    return (
      <section className="min-h-screen bg-[#07090d] px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-[#0c1119] p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Login required</h1>
          <p className="mt-3 text-sm text-zinc-400">Tafadhali login kwanza ili kuona dashboard yako.</p>
          <Link href="/login" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950">
            Login
          </Link>
        </div>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="min-h-screen bg-[#07090d] px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-[#0c1119] p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Verification required</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Partner dashboard inafunguka baada ya account verification na login sahihi.
          </p>
          <Link
            href={`/partner/verify?email=${encodeURIComponent(user.email)}`}
            className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950"
          >
            Verify account
          </Link>
        </div>
      </section>
    );
  }

  if (isRestaurant) {
    return (
      <section className="min-h-screen bg-[#07090d]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Restaurant dashboard</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                  {profile?.displayName ?? user.fullName ?? user.email}
                </h1>
                <p className="mt-3 text-sm text-zinc-400">
                  Restaurant order management bado ipo kwenye dashboard module. Rider flow sasa inaunganishwa live.
                </p>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="min-h-12 rounded-xl border border-white/[0.1] px-5 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.06]"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#07090d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Rider dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                {rider?.user.fullName ?? user.fullName ?? "Delivery partner"}
              </h1>
              <p className="mt-3 text-sm text-zinc-400">
                {rider?.vehicleType ?? "Vehicle not set"} | {rider?.user.phone ?? "No phone saved"}
              </p>
              <p className="mt-3 inline-flex rounded-full border border-white/[0.08] bg-black/25 px-3 py-1 text-xs font-semibold text-zinc-400">
                {realtimeState === "connected" ? "Live location connected" : "Location REST fallback active"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={toggleOnline}
                disabled={!rider}
                className="min-h-12 rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {rider?.isOnline ? "Go offline" : "Go online"}
              </button>
              <button
                type="button"
                onClick={shareLocation}
                disabled={!rider?.isOnline}
                className="min-h-12 rounded-xl border border-white/[0.1] px-5 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:text-zinc-600"
              >
                Share location
              </button>
              <button
                type="button"
                onClick={signOut}
                className="min-h-12 rounded-xl border border-white/[0.1] px-5 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.06]"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {message ? (
          <p className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <StatCard label="Assigned deliveries" value={`${rider?.orders.length ?? 0}`} tone="text-orange-300" />
          <StatCard label="Completed today" value={`${deliveredToday}`} tone="text-emerald-300" />
          <StatCard label="Online status" value={rider?.isOnline ? "Online" : "Offline"} tone="text-sky-300" />
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0c1119] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Delivery queue</h2>
              <p className="mt-1 text-sm text-zinc-500">Orders assigned to you by admin.</p>
            </div>
            {loading ? <span className="text-sm text-zinc-500">Loading...</span> : null}
          </div>

          <div className="mt-4 space-y-3">
            {rider?.orders.map((order) => {
              const next = nextRiderStatus(order.status);
              return (
                <article key={order.id} className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-xs font-semibold text-orange-300">#{order.id.slice(-8)}</p>
                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-zinc-300">
                          {statusLabel(order.status)}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-white">{order.restaurant.name}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{orderItems(order)}</p>
                      <p className="mt-3 text-sm text-zinc-400">
                        Pickup: {order.restaurant.address ?? "Restaurant location"} | Dropoff: {order.deliveryAddress}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        Customer: {order.customer.fullName ?? order.customer.email} {order.customer.phone ? `| ${order.customer.phone}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 lg:items-end">
                      <p className="text-base font-bold text-white">{formatTzs(order.totalTzs)}</p>
                      {next ? (
                        <button
                          type="button"
                          onClick={() => advanceOrder(order)}
                          className="min-h-11 rounded-xl bg-orange-500 px-4 text-sm font-bold text-zinc-950 transition hover:bg-orange-400"
                        >
                          Mark {statusLabel(next)}
                        </button>
                      ) : (
                        <span className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {!loading && !rider?.orders.length ? (
              <div className="rounded-2xl border border-dashed border-white/[0.12] p-8 text-center">
                <p className="text-lg font-semibold text-white">No assigned deliveries</p>
                <p className="mt-2 text-sm text-zinc-500">Ukiwa online, admin anaweza kukupa order hapa.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
