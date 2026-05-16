"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatTzs } from "./customer-data";
import {
  getRestaurantDetails,
  getRestaurantMenu,
  type MenuItem,
  type RestaurantDetails,
} from "@/lib/api";

type RestaurantDetailPageProps = {
  slug: string;
};

const restaurantImages: Record<string, string> = {
  "pizza-time": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85",
  "burger-house": "https://images.unsplash.com/photo-1553979459-b888fc870885?auto=format&fit=crop&w=1200&q=85",
  "spice-route": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=85",
  "fresh-bowl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85",
};

export function RestaurantDetailPage({ slug }: RestaurantDetailPageProps) {
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.resolve()
      .then(() => {
        if (!active) return Promise.reject(new Error("Request cancelled"));
        setLoading(true);
        setError(null);
        return Promise.all([getRestaurantDetails(slug), getRestaurantMenu(slug)]);
      })
      .then(([details, items]) => {
        if (!active) return;
        setRestaurant(details);
        setMenu(items);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load restaurant");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <section className="min-h-screen bg-[#07090d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-orange-300"
        >
          Back to restaurants
        </Link>

        {loading ? (
          <div className="mt-6 space-y-6">
            <div className="h-72 animate-pulse rounded-2xl border border-white/[0.08] bg-[#0c1119]" />
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-2xl border border-white/[0.08] bg-[#0c1119]"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-100">
            <p>{error}</p>
            <Link
              href="/restaurants"
              className="mt-4 inline-flex rounded-xl bg-red-500/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500/30"
            >
              Browse restaurants
            </Link>
          </div>
        ) : restaurant ? (
          <>
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1119]">
              <div className="relative min-h-72">
                <Image
                  src={restaurantImages[restaurant.slug] ?? "/images/meal.svg"}
                  alt={restaurant.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1119] via-[#0c1119]/40 to-transparent" />
              </div>
              <div className="relative -mt-32 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Menu</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{restaurant.name}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-200">
                  {restaurant.description ?? "Fresh meals delivered to your door."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-300">
                  <span className="rounded-xl bg-black/45 px-3 py-2">{restaurant.city}</span>
                  {restaurant.address ? (
                    <span className="rounded-xl bg-black/45 px-3 py-2">{restaurant.address}</span>
                  ) : null}
                  <span className="rounded-xl bg-black/45 px-3 py-2">
                    Delivery {formatTzs(restaurant.deliveryFeeTzs)}
                  </span>
                  <span className="rounded-xl bg-black/45 px-3 py-2">{restaurant.menuCount} items</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white">Available dishes</h2>
              {menu.length ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {menu.map((item) => (
                    <article
                      key={item.id}
                      className="grid gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1119] p-4 sm:grid-cols-[9rem_1fr]"
                    >
                      <div className="relative min-h-36 overflow-hidden rounded-xl bg-zinc-900">
                        <Image
                          src={item.imageUrl ?? "/images/meal.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          <p className="mt-1 text-sm text-zinc-500">
                            {item.description ?? "Chef's special"}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-orange-300">
                          {formatTzs(item.priceTzs)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#0c1119] p-8 text-center text-zinc-400">
                  No menu items available right now. Check back soon.
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
