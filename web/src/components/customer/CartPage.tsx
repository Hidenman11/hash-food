"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { createOrder } from "@/lib/api";
import { formatTzs } from "./customer-data";

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

const cartStorageKey = "hashfood_cart";

const starterCart: CartItem[] = [];

const paymentMethods = ["M-Pesa", "Airtel Money", "Tigo Pesa", "Cash"] as const;

function saveCart(items: CartItem[]) {
  localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("hashfood-cart-updated"));
}

function readCart() {
  try {
    const saved = localStorage.getItem(cartStorageKey);
    if (!saved) return starterCart;
    const parsed = JSON.parse(saved) as CartItem[];
    return Array.isArray(parsed) ? parsed : starterCart;
  } catch {
    return starterCart;
  }
}

export function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() =>
    typeof window === "undefined" ? starterCart : readCart(),
  );
  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [payment, setPayment] = useState<(typeof paymentMethods)[number]>("M-Pesa");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [note, setNote] = useState("");
  const [placed, setPlaced] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const deliveryFee = cart.length ? 3000 : 0;
  const discount = appliedCode ? Math.min(Math.round(subtotal * 0.2), 8000) : 0;
  const total = Math.max(subtotal + deliveryFee - discount, 0);

  function updateQuantity(id: string, change: number) {
    setCart((items) =>
      items
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + change } : item))
        .filter((item) => item.quantity > 0),
    );
    setPlaced(false);
  }

  function removeItem(id: string) {
    setCart((items) => items.filter((item) => item.id !== id));
    setPlaced(false);
  }

  function clearCart() {
    setCart([]);
    setAppliedCode("");
    setPromoCode("");
    setPlaced(false);
  }

  function applyPromo() {
    const code = promoCode.trim().toUpperCase();
    if (["HASHFIRST", "LUNCH20", "FREEBIKE"].includes(code)) {
      setAppliedCode(code);
      setPromoCode(code);
    }
  }

  async function checkout() {
    if (!cart.length) return;
    if (!deliveryAddress.trim()) {
      setStatus("error");
      setCheckoutMessage("Please enter a delivery address before checkout.");
      return;
    }

    const restaurantId = cart[0].restaurantId;
    if (cart.some((item) => item.restaurantId !== restaurantId)) {
      setStatus("error");
      setCheckoutMessage("Please place items from one restaurant at a time.");
      return;
    }

    setStatus("saving");
    setCheckoutMessage("");

    try {
      const response = await createOrder({
        restaurantId,
        deliveryAddress: deliveryAddress.trim(),
        notes: note.trim() || undefined,
        items: cart.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
      });

      setPlaced(true);
      setStatus("success");
      setCheckoutMessage(
        `Order placed successfully${response?.data?.id ? `: ${response.data.id}` : ""}. You can track it on the Track Order page.`,
      );
      setCart([]);
      setAppliedCode("");
      setPromoCode("");
      setDeliveryAddress("");
      setNote("");
    } catch (error) {
      setStatus("error");
      setCheckoutMessage(
        error instanceof Error
          ? error.message
          : "We could not place your order. Please try again or login before checkout.",
      );
    }
  }

  return (
    <section className="min-h-screen bg-[#07090d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
                Cart
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Kagua order kabla ya kulipa
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                Badili quantity, weka promo code, chagua payment method, kisha checkout.
              </p>
            </div>
            <Link
              href="/customer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/[0.1] px-5 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.06]"
            >
              Add more food
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_24rem]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Cart items</h2>
              {cart.length ? (
                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Clear cart
                </button>
              ) : null}
            </div>

            <div className="mt-4 space-y-3">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-2xl border border-white/[0.08] bg-black/25 p-3 sm:grid-cols-[6rem_1fr_auto]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">{item.restaurant}</p>
                    <p className="mt-3 text-sm font-semibold text-orange-300">
                      {formatTzs(item.price)} each
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="text-base font-bold text-white">{formatTzs(item.price * item.quantity)}</p>
                    <div className="flex items-center gap-2 rounded-full bg-white/[0.06] p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-200 hover:bg-white/[0.08]"
                        aria-label={`Remove one ${item.name}`}
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-white">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-200 hover:bg-white/[0.08]"
                        aria-label={`Add one ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-sm font-semibold text-red-300 transition hover:text-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}

              {!cart.length && (
                <div className="rounded-2xl border border-dashed border-white/[0.12] p-8 text-center">
                  <p className="text-lg font-semibold text-white">Cart iko empty</p>
                  <p className="mt-2 text-sm text-zinc-500">Rudi customer dashboard kuchagua chakula.</p>
                  <Link
                    href="/customer"
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950"
                  >
                    Browse food
                  </Link>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-white/[0.08] bg-[#0c1119] p-5 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-white">Order summary</h2>

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="text-sm font-semibold text-zinc-300">Promo code</span>
                <div className="mt-2 flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value)}
                    placeholder="HASHFIRST"
                    className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/25 px-3 text-sm font-semibold uppercase text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="rounded-xl bg-white px-4 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
                  >
                    Apply
                  </button>
                </div>
              </label>

              {appliedCode && (
                <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  {appliedCode} applied. Discount imeongezwa.
                </p>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/25 p-4">
              <p className="text-sm font-semibold text-zinc-300">Payment method</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPayment(method)}
                    className={cn(
                      "min-h-10 rounded-xl border text-sm font-semibold transition",
                      payment === method
                        ? "border-orange-400/50 bg-orange-500 text-zinc-950"
                        : "border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]",
                    )}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-zinc-300">Delivery address</span>
              <input
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                placeholder="Enter your delivery address"
                className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/25 px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-zinc-300">Delivery note</span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="e.g. Call when you arrive"
                className="mt-2 w-full resize-none rounded-xl border border-white/[0.08] bg-black/25 px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
              />
            </label>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>{formatTzs(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Delivery</span>
                <span>{formatTzs(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Discount</span>
                <span>-{formatTzs(discount)}</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.08] pt-4 text-lg font-bold text-white">
                <span>Total</span>
                <span>{formatTzs(total)}</span>
              </div>
            </div>

            {checkoutMessage ? (
              <p
                className={cn(
                  "mt-5 rounded-xl px-4 py-3 text-sm",
                  status === "success"
                    ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                    : "border border-red-500/20 bg-red-500/10 text-red-200",
                )}
              >
                {checkoutMessage}
              </p>
            ) : null}

            {placed && status !== "error" && (
              <p className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                Order imewekwa kwa {payment}. Unaweza kuifuatilia kwenye Track Order.
              </p>
            )}

            <button
              type="button"
              disabled={!cart.length || status === "saving"}
              onClick={checkout}
              className="mt-5 min-h-12 w-full rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {status === "saving" ? "Placing order…" : `Checkout with ${payment}`}
            </button>

            <Link
              href="/track"
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/[0.1] text-sm font-bold text-zinc-200 transition hover:bg-white/[0.06]"
            >
              Track order
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
