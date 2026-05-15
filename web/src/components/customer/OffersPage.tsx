"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatTzs, offers } from "./customer-data";

const offerCartItems: Record<
  string,
  { name: string; price: number; restaurant: string; image: string }
> = {
  hashfirst: {
    name: "Chicken pizza offer",
    price: 12000,
    restaurant: "Pizza Time",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=85",
  },
  freebike: {
    name: "Chips mayai delivery offer",
    price: 6000,
    restaurant: "Chipsi Point",
    image:
      "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=600&q=85",
  },
  lunch20: {
    name: "Beef pilau lunch combo",
    price: 9500,
    restaurant: "Mama's Kitchen",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=85",
  },
  sweet2: {
    name: "Dessert combo offer",
    price: 6000,
    restaurant: "Sweet Corner",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=85",
  },
};

function readCart() {
  try {
    const saved = localStorage.getItem("hashfood_cart");
    const parsed = saved ? (JSON.parse(saved) as Array<{ id: string; quantity?: number }>) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [addedOffer, setAddedOffer] = useState<string | null>(null);

  async function copyCode(code: string) {
    await navigator.clipboard?.writeText(code);
    setCopiedCode(code);
  }

  function addOfferToCart(offerId: string) {
    const item = offerCartItems[offerId];
    if (!item) return;

    const cart = readCart();
    const cartId = `offer-${offerId}`;
    const existing = cart.find((cartItem) => cartItem.id === cartId);
    const nextCart = existing
      ? cart.map((cartItem) =>
          cartItem.id === cartId
            ? { ...cartItem, quantity: Number(cartItem.quantity ?? 0) + 1 }
            : cartItem,
        )
      : [...cart, { id: cartId, ...item, quantity: 1 }];

    localStorage.setItem("hashfood_cart", JSON.stringify(nextCart));
    window.dispatchEvent(new Event("hashfood-cart-updated"));
    setAddedOffer(offerId);
  }

  return (
    <section className="min-h-screen bg-[#07090d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Offers</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Promo codes na discounts
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                Tumia offer kabla ya checkout. Codes hizi zinaweza kuunganishwa na cart kwenye customer dashboard.
              </p>
            </div>
            <Link href="/customer" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950">
              Start order
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {offers.map((offer) => (
            <article key={offer.id} className="grid overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1119] sm:grid-cols-[13rem_1fr]">
              <div className="relative min-h-56 sm:min-h-full">
                <Image src={offer.image} alt={offer.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 208px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent sm:bg-gradient-to-r" />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-zinc-950">{offer.saving}</span>
                  <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-zinc-400">{offer.expires}</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">{offer.title}</h2>
                <p className="mt-2 text-sm font-semibold text-orange-300">{offer.restaurant}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{offer.details}</p>
                <p className="mt-3 text-sm text-zinc-500">Minimum order: {formatTzs(offer.minimumOrder)}</p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <div className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-dashed border-orange-400/50 bg-orange-500/10 px-4 font-mono text-sm font-bold tracking-wider text-orange-200">
                    {offer.code}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode(offer.code)}
                    className={cn(
                      "min-h-12 rounded-xl px-5 text-sm font-bold transition",
                      copiedCode === offer.code
                        ? "bg-emerald-500 text-zinc-950"
                        : "bg-white text-zinc-950 hover:bg-zinc-200",
                    )}
                  >
                    {copiedCode === offer.code ? "Copied" : "Copy code"}
                  </button>
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => addOfferToCart(offer.id)}
                    className={cn(
                      "min-h-12 flex-1 rounded-xl px-5 text-sm font-bold transition",
                      addedOffer === offer.id
                        ? "bg-emerald-500 text-zinc-950"
                        : "bg-orange-500 text-zinc-950 hover:bg-orange-400",
                    )}
                  >
                    {addedOffer === offer.id ? "Added to cart" : "Add offer to cart"}
                  </button>
                  <Link
                    href="/cart"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/[0.1] px-5 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.06]"
                  >
                    View cart
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0c1119] p-5">
          <h2 className="text-lg font-semibold text-white">How offers work</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Choose restaurant", "Copy promo code", "Apply at checkout"].map((step, index) => (
              <div key={step} className="rounded-xl border border-white/[0.07] bg-black/25 p-4">
                <p className="text-sm font-bold text-orange-300">0{index + 1}</p>
                <p className="mt-2 font-semibold text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
