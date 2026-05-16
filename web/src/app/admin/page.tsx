'use client';

import { useEffect, useState } from 'react';
import {
  DeliveryLineChartClient,
  OrdersAreaChartClient,
  RevenueBarChartClient,
} from "@/components/admin/charts-client";
import { StatCard } from "@/components/admin/StatCard";
import DeliveryMap from "@/components/admin/DeliveryMap";
import { getAdminStats, type AdminStats } from "@/lib/api";

const statusStyle = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25";
    case "EN_ROUTE":
    case "PICKED_UP":
      return "bg-orange-500/15 text-orange-300 ring-orange-500/25";
    case "PREPARING":
    case "READY_FOR_PICKUP":
      return "bg-amber-500/15 text-amber-300 ring-amber-500/25";
    case "CONFIRMED":
      return "bg-blue-500/15 text-blue-300 ring-blue-500/25";
    case "CANCELLED":
      return "bg-red-500/15 text-red-400 ring-red-500/25";
    default:
      return "bg-sky-500/15 text-sky-300 ring-sky-500/25";
  }
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAdminStats();
        setStats(result.data);
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
        setStats(null);
        setError(err instanceof Error ? err.message : "Unable to load live admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-zinc-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-6 text-red-100">
        <h2 className="text-lg font-semibold text-white">Live admin data unavailable</h2>
        <p className="mt-2 text-sm">{error ?? "Please login with an admin account and try again."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Overview</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Real-time snapshot of orders, revenue, and fleet health across Mwanza.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total orders"
          value={stats.overview.totalOrders.toLocaleString()}
          hint="All time"
          delta="+12.4%"
          trend="up"
        />
        <StatCard
          title="Orders this week"
          value={stats.overview.ordersThisWeek.toLocaleString()}
          hint="Last 7 days"
          delta="+8.1%"
          trend="up"
        />
        <StatCard
          title="Revenue this week"
          value={`TSh ${(stats.overview.revenueThisWeek / 1000000).toFixed(1)}M`}
          hint="Last 7 days"
          delta="+15.2%"
          trend="up"
        />
        <StatCard
          title="Active riders"
          value={stats.overview.activeRiders.toString()}
          hint="On shift now"
          delta="-3.2%"
          trend="down"
        />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-5">
        <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5 shadow-xl shadow-black/30 xl:col-span-3">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Performance
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">Order volume</h3>
            </div>
            <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-400 ring-1 ring-white/[0.06]">
              Last 7 days
            </span>
          </div>
          <div className="mt-6">
            <OrdersAreaChartClient />
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5 shadow-xl shadow-black/30 xl:col-span-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Settlement mix
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">Revenue by channel</h3>
            <p className="mt-1 text-xs text-zinc-600">Share of GMV by payment rail (mock)</p>
          </div>
          <div className="mt-6">
            <RevenueBarChartClient />
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5 shadow-xl shadow-black/30">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Fulfillment
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">Delivery SLA</h3>
              <p className="mt-1 text-xs text-zinc-600">On-time vs. late by time of day</p>
            </div>
          </div>
          <div className="mt-4">
            <DeliveryLineChartClient />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Pipeline
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">Recent orders</h3>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-orange-400 hover:text-orange-300"
            >
              View all
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-zinc-500">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Restaurant</th>
                  <th className="pb-3 font-medium">Rider</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {stats.recentOrders.map((row) => (
                  <tr key={row.id} className="text-zinc-300">
                    <td className="py-3 font-mono text-xs text-white">{row.id.slice(-6)}</td>
                    <td className="py-3">{row.customer}</td>
                    <td className="py-3 text-zinc-400">{row.restaurant}</td>
                    <td className="py-3 text-zinc-400">{row.rider || "Unassigned"}</td>
                    <td className="py-3 font-medium text-white">TSh {row.total.toLocaleString()}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusStyle(row.status)}`}
                      >
                        {row.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5 shadow-xl shadow-black/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Active Connections
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">Live Deliveries</h3>
            <p className="mt-1 text-xs text-zinc-600">Real-time customer-restaurant-rider connections</p>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-orange-400 hover:text-orange-300"
            onClick={() => setShowMap(true)}
          >
            View map
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-zinc-500">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Customer → Restaurant</th>
                <th className="pb-3 font-medium">Assigned Rider</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {stats.activeDeliveries.map((delivery) => (
                <tr key={delivery.id} className="text-zinc-300">
                  <td className="py-3 font-mono text-xs text-white">#{delivery.id.slice(-6)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">{delivery.customer.name}</span>
                      <span className="text-xs text-zinc-600">→</span>
                      <span className="text-zinc-300">{delivery.restaurant.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-orange-400 font-medium">
                    {delivery.rider?.name || "Unassigned"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusStyle(delivery.status)}`}
                    >
                      {delivery.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <div>
                <h3 className="text-lg font-semibold text-white">Live Delivery Map</h3>
                <p className="text-sm text-zinc-400">Track customers, restaurants, and riders in real-time</p>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-zinc-300">Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-zinc-300">Restaurants</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-zinc-300">Riders</span>
                </div>
              </div>
              <DeliveryMap />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
