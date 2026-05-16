"use client";

import { useEffect, useState } from "react";
import { getAdminRestaurants, type AdminRestaurant } from "@/lib/api";

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminRestaurants({ limit: 100 })
      .then((result) => setRestaurants(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load restaurants"));
  }, []);

  if (error) return <p className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-red-100">{error}</p>;

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-semibold text-white">Restaurants</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {restaurants.map((restaurant) => (
          <article key={restaurant.id} className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{restaurant.name}</p>
                <p className="mt-1 text-sm text-zinc-500">{restaurant.address || restaurant.slug}</p>
              </div>
              <span className={restaurant.isActive ? "text-emerald-400" : "text-red-300"}>
                {restaurant.isActive ? "Active" : "Offline"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-zinc-400">
              <p>Menu: {restaurant._count.menu}</p>
              <p>Orders: {restaurant._count.orders}</p>
              <p>Fee: TSh {restaurant.deliveryFeeTzs.toLocaleString()}</p>
              <p>Owner: {restaurant.owner?.fullName || restaurant.owner?.email || "Unassigned"}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
