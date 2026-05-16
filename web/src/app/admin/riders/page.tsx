"use client";

import { useEffect, useState } from "react";
import { getAdminRiders, type AdminRider } from "@/lib/api";

export default function AdminRidersPage() {
  const [riders, setRiders] = useState<AdminRider[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminRiders({ limit: 100 })
      .then((result) => setRiders(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load riders"));
  }, []);

  if (error) return <p className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-red-100">{error}</p>;

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-semibold text-white">Riders</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {riders.map((rider) => (
          <article key={rider.id} className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{rider.user.fullName || rider.user.email}</p>
                <p className="mt-1 text-sm text-zinc-500">{rider.vehicleType || "Vehicle not set"} · {rider.user.phone || "No phone"}</p>
              </div>
              <span className={rider.isOnline ? "text-emerald-400" : "text-zinc-500"}>
                {rider.isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">Orders handled: {rider._count.orders}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
