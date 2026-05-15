'use client';

import { useState } from 'react';
import {
  DeliveryLineChartClient,
  OrdersAreaChartClient,
  RevenueBarChartClient,
} from "@/components/admin/charts-client";
import { StatCard } from "@/components/admin/StatCard";
import DeliveryMap from "@/components/admin/DeliveryMap";

const recentOrders = [
  { id: "#HF2041", customer: "Asha K.", restaurant: "Pizza Time", rider: "John D.", total: "TSh 48,200", status: "Delivered" },
  { id: "#HF2040", customer: "Juma M.", restaurant: "Burger House", rider: "Sarah M.", total: "TSh 22,500", status: "On the way" },
  { id: "#HF2039", customer: "Neema R.", restaurant: "Spice Route", rider: "Mike T.", total: "TSh 31,000", status: "Preparing" },
  { id: "#HF2038", customer: "Peter L.", restaurant: "Sushi Zen", rider: "Emma R.", total: "TSh 67,800", status: "New" },
  { id: "#HF2037", customer: "Grace T.", restaurant: "Fresh Bowl", rider: "David K.", total: "TSh 19,400", status: "Delivered" },
] as const;

function statusStyle(status: string) {
  switch (status) {
    case "Delivered":
      return "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25";
    case "On the way":
      return "bg-orange-500/15 text-orange-300 ring-orange-500/25";
    case "Preparing":
      return "bg-amber-500/15 text-amber-300 ring-amber-500/25";
    default:
      return "bg-sky-500/15 text-sky-300 ring-sky-500/25";
  }
}

export default function AdminDashboardPage() {
  const [showMap, setShowMap] = useState(false);
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
          value="12,480"
          hint="Last 7 days"
          delta="+12.4%"
          trend="up"
        />
        <StatCard
          title="Gross revenue"
          value="TSh 428M"
          hint="Incl. fees & tips"
          delta="+8.1%"
          trend="up"
        />
        <StatCard
          title="Active riders"
          value="186"
          hint="On shift now"
          delta="-3.2%"
          trend="down"
        />
        <StatCard
          title="Partner restaurants"
          value="542"
          hint="Live on platform"
          delta="+2.0%"
          trend="up"
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
                {recentOrders.map((row) => (
                  <tr key={row.id} className="text-zinc-300">
                    <td className="py-3 font-mono text-xs text-white">{row.id}</td>
                    <td className="py-3">{row.customer}</td>
                    <td className="py-3 text-zinc-400">{row.restaurant}</td>
                    <td className="py-3 text-zinc-400">{row.rider}</td>
                    <td className="py-3 font-medium text-white">{row.total}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusStyle(row.status)}`}
                      >
                        {row.status}
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
                <th className="pb-3 font-medium">ETA</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <tr className="text-zinc-300">
                <td className="py-3 font-mono text-xs text-white">#HF2040</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Juma M.</span>
                    <span className="text-xs text-zinc-600">→</span>
                    <span className="text-zinc-300">Burger House</span>
                  </div>
                </td>
                <td className="py-3 text-orange-400 font-medium">Sarah M.</td>
                <td className="py-3 text-zinc-400">12 min</td>
                <td className="py-3">
                  <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 bg-orange-500/15 text-orange-300 ring-orange-500/25">
                    On the way
                  </span>
                </td>
              </tr>
              <tr className="text-zinc-300">
                <td className="py-3 font-mono text-xs text-white">#HF2039</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Neema R.</span>
                    <span className="text-xs text-zinc-600">→</span>
                    <span className="text-zinc-300">Spice Route</span>
                  </div>
                </td>
                <td className="py-3 text-orange-400 font-medium">Mike T.</td>
                <td className="py-3 text-zinc-400">8 min</td>
                <td className="py-3">
                  <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 bg-amber-500/15 text-amber-300 ring-amber-500/25">
                    Preparing
                  </span>
                </td>
              </tr>
              <tr className="text-zinc-300">
                <td className="py-3 font-mono text-xs text-white">#HF2038</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Peter L.</span>
                    <span className="text-xs text-zinc-600">→</span>
                    <span className="text-zinc-300">Sushi Zen</span>
                  </div>
                </td>
                <td className="py-3 text-zinc-500">Unassigned</td>
                <td className="py-3 text-zinc-400">-</td>
                <td className="py-3">
                  <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 bg-sky-500/15 text-sky-300 ring-sky-500/25">
                    New
                  </span>
                </td>
              </tr>
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
