"use client";

import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "@/lib/api";

export default function AdminReportsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminStats()
      .then((result) => setStats(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports"));
  }, []);

  if (error) return <p className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-red-100">{error}</p>;
  if (!stats) return <p className="text-zinc-400">Loading live reports...</p>;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Reports</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5">
          <p className="text-sm text-zinc-500">Total users</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stats.overview.totalUsers}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5">
          <p className="text-sm text-zinc-500">Restaurants</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stats.overview.totalRestaurants}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5">
          <p className="text-sm text-zinc-500">Weekly revenue</p>
          <p className="mt-2 text-3xl font-semibold text-white">TSh {stats.overview.revenueThisWeek.toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
}
