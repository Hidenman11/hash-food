"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatTzs, restaurants } from "./customer-data";

const filters = ["All", "Pizza", "Chicken", "Rice", "Burger", "Healthy", "Dessert"] as const;

export function RestaurantsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visibleRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const haystack = `${restaurant.name} ${restaurant.cuisines} ${restaurant.tags.join(" ")}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesFilter = filter === "All" || haystack.includes(filter.toLowerCase());
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

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
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="flex min-h-12 flex-1 items-center rounded-xl border border-white/[0.08] bg-black/25 px-4">
              <span className="sr-only">Search restaurants</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search restaurant, food, or cuisine"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </label>
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

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleRestaurants.map((restaurant) => (
            <article key={restaurant.id} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1119]">
              <div className="relative aspect-[5/3]">
                <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-amber-300">{restaurant.rating} rating</span>
                  {restaurant.promo && (
                    <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-zinc-950">{restaurant.promo}</span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{restaurant.name}</h2>
                    <p className="mt-1 text-sm text-zinc-500">{restaurant.cuisines}</p>
                  </div>
                  <span className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-semibold text-zinc-300">{restaurant.distanceKm} km</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {restaurant.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-semibold text-zinc-400">{tag}</span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 text-sm">
                  <span className="font-semibold text-zinc-300">{restaurant.deliveryMins}</span>
                  <span className="font-semibold text-orange-300">{formatTzs(restaurant.deliveryFee)} fee</span>
                </div>
                <Link
                  href="/customer"
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-zinc-950 transition hover:bg-orange-400"
                >
                  Open menu
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
