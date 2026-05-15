"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatTzs } from "./customer-data";
import { getRestaurants, type RestaurantSummary } from "@/lib/api";

const filters = ["All", "Pizza", "Chicken", "Rice", "Burger", "Healthy", "Dessert"] as const;

export function RestaurantsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("Mwanza");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getRestaurants(query, city)
      .then((data) => {
        if (!active) return;
        setRestaurants(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load restaurants");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [city, query]);

  const visibleRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const haystack = `${restaurant.name} ${restaurant.description ?? ""}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesFilter = filter === "All" || haystack.includes(filter.toLowerCase());
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, restaurants]);

  return (
    <section className="min-h-screen bg-[#07090d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Restaurants</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Chagua restaurant karibu yako
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
              Tafuta vyakula, linganisha muda wa delivery, rating, promo, na delivery fee kabla ya ku-order.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-orange-500 to-amber-500 p-6 text-zinc-950 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em]">Today special</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">50% off pizza orders</h2>
            <p className="mt-3 text-sm font-medium text-zinc-800">Use code HASHFIRST on checkout. Minimum order TSh 12,000.</p>
            <Link href="/offers" className="mt-6 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white">
              View offers
            </Link>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0c1119] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex min-h-12 flex-1 items-center rounded-xl border border-white/[0.08] bg-black/25 px-4">
              <span className="sr-only">Search restaurants</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search restaurant, food, or cuisine"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </label>
            <div className="flex items-center gap-3">
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="min-h-12 rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-white outline-none focus:border-orange-400/50"
              >
                <option>Mwanza</option>
                <option>Dar es Salaam</option>
                <option>Arusha</option>
                <option>Dodoma</option>
              </select>
              <div className="scrollbar-hide flex gap-2 overflow-x-auto">
                {filters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={cn(
                      "min-h-12 shrink-0 rounded-xl border px-4 text-sm font-semibold transition",
                      filter === item
                        ? "border-orange-400/50 bg-orange-500 text-zinc-950"
                        : "border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0c1119] p-8 text-center text-white">
            Loading restaurants...
          </div>
        ) : error ? (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-100">
            {error}
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleRestaurants.length ? (
              visibleRestaurants.map((restaurant) => (
                <article key={restaurant.id} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1119]">
                  <div className="relative aspect-[5/3] bg-[#111]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 top-0 p-3">
                      <span className="rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-amber-300">
                        {restaurant.menuCount} items
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-white">{restaurant.name}</h2>
                        <p className="mt-1 text-sm text-zinc-500">{restaurant.description ?? "Fast, local dining"}</p>
                      </div>
                      <span className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-semibold text-zinc-300">{restaurant.city}</span>
                    </div>
                    <div className="mt-5 grid gap-2 text-sm text-zinc-400">
                      <div className="flex items-center justify-between">
                        <span>Delivery fee</span>
                        <span className="font-semibold text-orange-300">{formatTzs(restaurant.deliveryFeeTzs)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Menu items</span>
                        <span>{restaurant.menuCount}</span>
                      </div>
                    </div>
                    <Link
                      href={`/restaurants/${restaurant.slug}`}
                      className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-zinc-950 transition hover:bg-orange-400"
                    >
                      Open menu
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-8 text-center text-white">
                No restaurants found for your search. Try another cuisine or city.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
