"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatTzs } from "./customer-data";

const orders = [
  {
    code: "HF2041",
    restaurant: "Pizza Time",
    items: "Chicken Pizza, Cold Soda",
    total: 17000,
    rider: "Juma Ally",
    phone: "+255 712 345 678",
    eta: "18 min",
    statusIndex: 3,
  },
  {
    code: "HF2042",
    restaurant: "Mama's Kitchen",
    items: "Beef Pilau, Juice",
    total: 14500,
    rider: "Neema John",
    phone: "+255 713 111 222",
    eta: "8 min",
    statusIndex: 4,
  },
  {
    code: "HF2043",
    restaurant: "Burger House",
    items: "Hash Burger, Fries",
    total: 14000,
    rider: "Musa Said",
    phone: "+255 714 222 333",
    eta: "27 min",
    statusIndex: 2,
  },
];

const steps = ["Order placed", "Paid", "Preparing", "Rider pickup", "On the way", "Delivered"];

export function TrackOrderPage() {
  const [query, setQuery] = useState("HF2041");
  const [activeCode, setActiveCode] = useState("HF2041");

  const activeOrder = useMemo(() => {
    const normalized = activeCode.replace("#", "").toUpperCase();
    return orders.find((order) => order.code === normalized) ?? orders[0];
  }, [activeCode]);

  function submitLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveCode(query);
  }

  return (
    <section className="min-h-screen bg-[#07090d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Track order</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Fuatilia order yako live
            </h1>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Ingiza order number kuona restaurant status, rider assignment, ETA, na delivery progress.
            </p>

            <form onSubmit={submitLookup} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label className="flex min-h-12 flex-1 items-center rounded-xl border border-white/[0.08] bg-black/25 px-4">
                <span className="sr-only">Order number</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="e.g. HF2041"
                  className="w-full bg-transparent text-sm font-semibold uppercase text-white outline-none placeholder:text-zinc-600"
                />
              </label>
              <button type="submit" className="min-h-12 rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950">
                Track
              </button>
            </form>

            <div className="mt-6 grid gap-3">
              {orders.map((order) => (
                <button
                  key={order.code}
                  type="button"
                  onClick={() => {
                    setQuery(order.code);
                    setActiveCode(order.code);
                  }}
                  className={cn(
                    "rounded-xl border p-4 text-left transition",
                    activeOrder.code === order.code
                      ? "border-orange-400/50 bg-orange-500/10"
                      : "border-white/[0.08] bg-black/25 hover:bg-white/[0.04]",
                  )}
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">#{order.code}</p>
                      <p className="mt-1 text-sm text-zinc-500">{order.restaurant}</p>
                    </div>
                    <p className="text-sm font-bold text-orange-300">{order.eta}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-semibold text-zinc-500">Order #{activeOrder.code}</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">{activeOrder.restaurant}</h2>
                <p className="mt-2 text-sm text-zinc-400">{activeOrder.items}</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">ETA</p>
                <p className="text-xl font-bold text-emerald-200">{activeOrder.eta}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-80 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827]">
                <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:34px_34px]" />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 540 330" fill="none" aria-hidden>
                  <path d="M56 264 C142 168 208 220 274 130 S398 96 486 58" stroke="#f97316" strokeWidth="7" strokeLinecap="round" strokeDasharray="13 15" />
                  <circle cx="56" cy="264" r="14" fill="#22c55e" />
                  <circle cx="274" cy="130" r="14" fill="#f97316" />
                  <circle cx="486" cy="58" r="14" fill="#38bdf8" />
                </svg>
                <div className="absolute left-4 top-4 rounded-2xl bg-black/70 p-4 backdrop-blur">
                  <p className="text-sm font-semibold text-white">Live route</p>
                  <p className="mt-1 text-xs text-zinc-400">Restaurant to customer location</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                  <p className="text-sm font-semibold text-zinc-500">Rider</p>
                  <p className="mt-2 text-xl font-semibold text-white">{activeOrder.rider}</p>
                  <p className="mt-1 text-sm text-zinc-400">{activeOrder.phone}</p>
                  <button type="button" className="mt-4 min-h-11 w-full rounded-xl bg-white text-sm font-bold text-zinc-950">
                    Call rider
                  </button>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                  <p className="text-sm font-semibold text-zinc-500">Payment</p>
                  <p className="mt-2 text-xl font-semibold text-white">{formatTzs(activeOrder.total)}</p>
                  <p className="mt-1 text-sm text-emerald-300">Paid by M-Pesa</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/25 p-4">
              <h3 className="font-semibold text-white">Order timeline</h3>
              <div className="mt-5 grid gap-3 md:grid-cols-6">
                {steps.map((step, index) => (
                  <div key={step} className="min-w-0">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                        index <= activeOrder.statusIndex ? "bg-emerald-500 text-zinc-950" : "bg-white/[0.07] text-zinc-500",
                      )}
                    >
                      {index + 1}
                    </div>
                    <p className={cn("mt-2 text-xs font-semibold", index <= activeOrder.statusIndex ? "text-white" : "text-zinc-600")}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
