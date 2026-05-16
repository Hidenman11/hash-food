"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatTzs } from "./customer-data";

type FeaturedOffer = {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  oldPrice: number;
  image: string;
  eta: string;
  rating: string;
};

const featuredOffers: FeaturedOffer[] = [
  {
    id: "truffle-chicken-burger",
    name: "Truffle chicken burger",
    restaurant: "Burger House",
    price: 7000,
    oldPrice: 14000,
    image: "/images/burger.svg",
    eta: "18-28 min",
    rating: "4.9",
  },
  {
    id: "chicken-pizza-offer",
    name: "Chicken pizza",
    restaurant: "Pizza Time",
    price: 12000,
    oldPrice: 24000,
    image: "/images/pizza.svg",
    eta: "25-35 min",
    rating: "4.8",
  },
  {
    id: "beef-pilau-combo",
    name: "Beef pilau combo",
    restaurant: "Mama's Kitchen",
    price: 9500,
    oldPrice: 13000,
    image: "/images/spice-route.svg",
    eta: "20-30 min",
    rating: "4.7",
  },
] as const;

function readCart() {
  try {
    const saved = localStorage.getItem("hashfood_cart");
    const parsed = saved ? (JSON.parse(saved) as Array<{ id: string; quantity?: number }>) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FeaturedOfferCard() {
  const [selectedId, setSelectedId] = useState(featuredOffers[0].id);
  const [addedId, setAddedId] = useState<string | null>(null);
  const selected = featuredOffers.find((offer) => offer.id === selectedId) ?? featuredOffers[0];

  function addToCart() {
    const cart = readCart();
    const existing = cart.find((item) => item.id === selected.id);
    const nextCart = existing
      ? cart.map((item) =>
          item.id === selected.id
            ? { ...item, quantity: Number(item.quantity ?? 0) + 1 }
            : item,
        )
      : [
          ...cart,
          {
            id: selected.id,
            name: selected.name,
            restaurant: selected.restaurant,
            price: selected.price,
            image: selected.image,
            quantity: 1,
          },
        ];

    localStorage.setItem("hashfood_cart", JSON.stringify(nextCart));
    window.dispatchEvent(new Event("hashfood-cart-updated"));
    setAddedId(selected.id);
  }

  return (
    <div className="relative ml-auto mt-20 w-full max-w-[330px] rounded-3xl border border-white/[0.08] bg-black/60 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:mt-24 lg:mt-32">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-300">
          Featured
        </p>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-zinc-300 ring-1 ring-white/10">
          Chef&apos;s pick
        </span>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10">
          <Image
            src={selected.image}
            alt={selected.name}
            fill
            className="object-cover"
            sizes="80px"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-semibold text-white">{selected.name}</p>
          <p className="mt-1 text-xs font-medium text-zinc-500">{selected.restaurant}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-orange-300">{formatTzs(selected.price)}</p>
            <p className="text-xs text-zinc-600 line-through">{formatTzs(selected.oldPrice)}</p>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Served in {selected.eta} · {selected.rating} ★
          </p>
        </div>
        <button
          type="button"
          onClick={addToCart}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold shadow-lg transition",
            addedId === selected.id
              ? "bg-emerald-500 text-zinc-950"
              : "bg-white text-black hover:bg-zinc-200",
          )}
          aria-label={`Add ${selected.name} to cart`}
          title={`Add ${selected.name} to cart`}
        >
          {addedId === selected.id ? "✓" : "+"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {featuredOffers.map((offer) => (
          <button
            key={offer.id}
            type="button"
            onClick={() => setSelectedId(offer.id)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-xl border transition",
              selected.id === offer.id ? "border-orange-400" : "border-white/10 opacity-80 hover:opacity-100",
            )}
            aria-label={`Choose ${offer.name}`}
          >
            <Image src={offer.image} alt={offer.name} fill className="object-cover" sizes="82px" />
            <span className="absolute inset-x-0 bottom-0 bg-black/70 px-1.5 py-1 text-left text-[10px] font-semibold leading-tight text-white">
              {offer.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
