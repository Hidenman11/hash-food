"use client";

import { useEffect, useState } from "react";
import { getAdminAnalytics, type AdminAnalytics } from "@/lib/api";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminAnalytics("30d")
      .then(setAnalytics)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load analytics"));
  }, []);

  if (error) return <p className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-red-100">{error}</p>;
  if (!analytics) return <p className="text-zinc-400">Loading live analytics...</p>;

  const totalOrders = analytics.orderTrends.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = analytics.orderTrends.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Analytics</h2>
        <p className="mt-1 text-sm text-zinc-500">Live 30-day order and revenue analytics.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5">
          <p className="text-sm text-zinc-500">Orders</p>
          <p className="mt-2 text-3xl font-semibold text-white">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5">
          <p className="text-sm text-zinc-500">Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-white">TSh {totalRevenue.toLocaleString()}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5">
        <h3 className="font-semibold text-white">Status distribution</h3>
        <div className="mt-4 grid gap-3">
          {analytics.statusDistribution.map((item) => (
            <div key={item.status} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-sm">
              <span className="text-zinc-300">{item.status.replace(/_/g, " ")}</span>
              <span className="font-semibold text-orange-300">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
