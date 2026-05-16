"use client";

import { useEffect, useState } from "react";
import { getAdminOrders, type AdminOrder } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminOrders({ limit: 100 })
      .then((result) => setOrders(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-zinc-400">Loading live orders...</p>;
  if (error) return <p className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-red-100">{error}</p>;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Orders</h2>
        <p className="mt-1 text-sm text-zinc-500">Live order history from the backend.</p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#0c0c0c]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Restaurant</th>
              <th className="p-4">Rider</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
