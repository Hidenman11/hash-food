"use client";

import { useCallback, useEffect, useState } from "react";
import {
  assignOrderRider,
  getAdminOrders,
  getAdminRiders,
  type AdminOrder,
  type AdminRider,
} from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [riders, setRiders] = useState<AdminRider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [assigningOrderId, setAssigningOrderId] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const [ordersResult, ridersResult] = await Promise.all([
        getAdminOrders({ limit: 100 }),
        getAdminRiders({ limit: 100, isActive: true }),
      ]);
      setOrders(ordersResult.data);
      setRiders(ridersResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  async function handleAssign(orderId: string, riderId: string) {
    if (!riderId) return;
    setAssigningOrderId(orderId);
    setMessage("");
    setError("");
    try {
      await assignOrderRider(orderId, riderId);
      await loadData();
      setMessage(`Order #${orderId.slice(-8)} assigned to rider.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign rider");
    } finally {
      setAssigningOrderId("");
    }
  }

  if (loading) return <p className="text-zinc-400">Loading live orders...</p>;
  if (error) return <p className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-red-100">{error}</p>;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Orders</h2>
        <p className="mt-1 text-sm text-zinc-500">Live order history from the backend with rider assignment.</p>
      </div>
      {message ? (
        <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-100">
          {message}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#0c0c0c]">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Restaurant</th>
              <th className="p-4">Rider</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Assign</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {orders.map((order) => (
              <tr key={order.id} className="text-zinc-300">
                <td className="p-4 font-mono text-xs text-white">{order.id.slice(-8)}</td>
                <td className="p-4">{order.customer.fullName || order.customer.email}</td>
                <td className="p-4">{order.restaurant.name}</td>
                <td className="p-4">{order.rider?.user.fullName || "Unassigned"}</td>
                <td className="p-4 font-semibold text-white">TSh {order.totalTzs.toLocaleString()}</td>
                <td className="p-4">{order.status.replace(/_/g, " ")}</td>
                <td className="p-4">
                  <label className="sr-only" htmlFor={`assign-${order.id}`}>
                    Assign rider
                  </label>
                  <select
                    id={`assign-${order.id}`}
                    value={order.riderId ?? ""}
                    disabled={assigningOrderId === order.id || !riders.length}
                    onChange={(event) => void handleAssign(order.id, event.target.value)}
                    className="min-h-10 min-w-44 rounded-xl border border-white/[0.08] bg-black/30 px-3 text-sm font-semibold text-white outline-none disabled:cursor-not-allowed disabled:text-zinc-600"
                  >
                    <option value="">Choose rider</option>
                    {riders.map((rider) => (
                      <option key={rider.id} value={rider.id}>
                        {rider.user.fullName || rider.user.email}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
