"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatTzs } from "./customer-data";
import {
  getRestaurantDetails,
  getRestaurantMenu,
  type MenuItem,
  type RestaurantDetails,
} from "@/lib/api";
import { FALLBACK_IMAGE } from "@/lib/sample-restaurants";
import { SafeImage } from "@/components/ui/SafeImage";

type RestaurantDetailPageProps = {
  slug: string;
};

const cartStorageKey = "hashfood_cart";

type CartItem = {
  id: string;
  menuItemId: string;
  restaurantId: string;
  restaurant: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export function RestaurantDetailPage({ slug }: RestaurantDetailPageProps) {
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState("");

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
        setSelectedItem(items[0] ?? null);
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

  function addToCart(item: MenuItem) {
    if (!restaurant) return;

    const cartItem: CartItem = {
      id: item.id,
      menuItemId: item.id,
      restaurantId: restaurant.id,
      restaurant: restaurant.name,
      name: item.name,
      price: item.priceTzs,
      image: item.imageUrl ?? FALLBACK_IMAGE,
      quantity: 1,
    };

    const saved = localStorage.getItem(cartStorageKey);
    const current = saved ? (JSON.parse(saved) as CartItem[]) : [];
    const safeCurrent = Array.isArray(current) ? current : [];
    const nextCart = safeCurrent.some((cart) => cart.menuItemId === item.id)
      ? safeCurrent.map((cart) =>
          cart.menuItemId === item.id ? { ...cart, quantity: cart.quantity + 1 } : cart,
        )
      : [...safeCurrent.filter((cart) => cart.restaurantId === restaurant.id), cartItem];

    localStorage.setItem(cartStorageKey, JSON.stringify(nextCart));
    window.dispatchEvent(new Event("hashfood-cart-updated"));
    setCartMessage(`${item.name} added to cart`);
  }

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
                <SafeImage
                  src={restaurant.image ?? FALLBACK_IMAGE}
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
              <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="h-fit rounded-2xl border border-white/[0.08] bg-[#0c1119] p-4 lg:sticky lg:top-24">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
                    Food detail
                  </p>
                  <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900">
                    <SafeImage
                      src={selectedItem?.imageUrl ?? restaurant.image ?? FALLBACK_IMAGE}
                      alt={selectedItem?.name ?? restaurant.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 420px"
                    />
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-white">
                    {selectedItem?.name ?? "Choose a dish"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {selectedItem?.description ?? "Chagua chakula upande wa kulia kuona picha na taarifa zake hapa."}
                  </p>
                  {selectedItem ? (
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="text-xl font-bold text-orange-300">{formatTzs(selectedItem.priceTzs)}</p>
                      <button
                        type="button"
                        onClick={() => addToCart(selectedItem)}
                        className="min-h-11 rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400"
                      >
                        Add to cart
                      </button>
                    </div>
                  ) : null}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">Available dishes</h2>
              {cartMessage ? (
                <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {cartMessage}. <Link href="/cart" className="font-semibold text-white">Open cart</Link>
                </div>
              ) : null}
              {menu.length ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {menu.map((item) => (
                    <article
                      key={item.id}
                      className={`grid gap-4 overflow-hidden rounded-2xl border bg-[#0c1119] p-4 transition sm:grid-cols-[9rem_1fr] ${
                        selectedItem?.id === item.id
                          ? "border-orange-400/50 shadow-[0_20px_60px_-36px_rgba(249,115,22,0.9)]"
                          : "border-white/[0.08] hover:border-white/15"
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="relative min-h-36 overflow-hidden rounded-xl bg-zinc-900">
                        <SafeImage
                          src={item.imageUrl ?? FALLBACK_IMAGE}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col justify-between gap-4">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                            <span className="shrink-0 text-sm font-semibold text-orange-300">
                              {formatTzs(item.priceTzs)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-zinc-500">
                            {item.description ?? "Chef's special"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedItem(item);
                            addToCart(item);
                          }}
                          className="min-h-11 rounded-xl bg-orange-500 px-4 text-sm font-bold text-zinc-950 transition hover:bg-orange-400"
                        >
                          Add to cart
                        </button>
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
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
