"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { SafeImage } from "@/components/ui/SafeImage";

type FoodItem = {
  id: string;
  menuItemId: string;
  restaurantId: string;
  name: string;
  restaurant: string;
  category: string;
  price: number;
  rating: number;
  minutes: string;
  image: string;
  description: string;
};

type CartItem = FoodItem & { quantity: number };

const categories = ["All", "Pizza", "Chicken", "Burger", "Rice", "Drinks"] as const;

const foods: FoodItem[] = [
  {
    id: "pizza",
    menuItemId: "pizza_pepperoni",
    restaurantId: "rest_pizza_time",
    name: "Chicken Pizza",
    restaurant: "Pizza Time",
    category: "Pizza",
    price: 12000,
    rating: 4.8,
    minutes: "25-35 min",
    image:
      "/images/pizza.jpg",
    description: "Crispy crust, mozzarella, chicken, sweet peppers, and house tomato sauce.",
  },
  {
    id: "pilau",
    menuItemId: "spice_pilau",
    restaurantId: "rest_spice_route",
    name: "Beef Pilau",
    restaurant: "Mama's Kitchen",
    category: "Rice",
    price: 11000,
    rating: 4.7,
    minutes: "20-30 min",
    image:
      "/images/rice.jpg",
    description: "Spiced rice with tender beef, kachumbari, and a light chilli sauce.",
  },
  {
    id: "chips",
    menuItemId: "chipsi_mayai",
    restaurantId: "rest_chipsi_point",
    name: "Chips Mayai",
    restaurant: "Chipsi Point",
    category: "Chicken",
    price: 6000,
    rating: 4.5,
    minutes: "15-25 min",
    image:
      "/images/chicken.jpg",
    description: "Golden fries folded into eggs, served with salad and tomato sauce.",
  },
  {
    id: "burger",
    menuItemId: "burger_classic",
    restaurantId: "rest_burger_house",
    name: "Hash Burger",
    restaurant: "Burger House",
    category: "Burger",
    price: 9000,
    rating: 4.9,
    minutes: "18-28 min",
    image:
      "/images/burger.jpg",
    description: "Grilled beef patty, cheese, pickles, onions, and smoky hash sauce.",
  },
  {
    id: "soda",
    menuItemId: "fresh_juice",
    restaurantId: "rest_fresh_bowl",
    name: "Cold Soda",
    restaurant: "Pizza Time",
    category: "Drinks",
    price: 2000,
    rating: 4.4,
    minutes: "10-15 min",
    image:
      "/images/drinks.jpg",
    description: "Chilled soft drink for the side of your meal.",
  },
];

const orderSteps = ["Placed", "Restaurant", "Rider", "On the way", "Delivered"] as const;
const cartStorageKey = "hashfood_cart";

function formatPrice(value: number) {
  return `TSh ${value.toLocaleString("en-US")}`;
}

function Icon({ name, className }: { name: "search" | "cart" | "map" | "plus" | "minus" | "check"; className?: string }) {
  const common = cn("h-5 w-5", className);

  if (name === "search") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.2-3.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "cart") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
        <path d="M6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "map") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="2.2" />
      </svg>
    );
  }

  if (name === "minus") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M5 12h14" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M5 12.5l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function CustomerDashboard() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selectedFood, setSelectedFood] = useState<FoodItem>(foods[0]);
  const [cart, setCart] = useState<CartItem[]>([
    { ...foods[0], quantity: 1 },
    { ...foods[4], quantity: 1 },
  ]);
  const [payment, setPayment] = useState("M-Pesa");
  const [orderStep, setOrderStep] = useState(0);
  const [orderCode, setOrderCode] = useState("#HF2041");

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory = category === "All" || food.category === category;
      const search = `${food.name} ${food.restaurant} ${food.category}`.toLowerCase();
      return matchesCategory && search.includes(query.toLowerCase());
    });
  }, [category, query]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = cart.length ? 3000 : 0;
  const total = subtotal + delivery;

  useEffect(() => {
    const savedCart = cart.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      restaurantId: item.restaurantId,
      name: item.name,
      restaurant: item.restaurant,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));
    localStorage.setItem(cartStorageKey, JSON.stringify(savedCart));
    window.dispatchEvent(new Event("hashfood-cart-updated"));
  }, [cart]);

  function addToCart(food: FoodItem) {
    setCart((items) => {
      const exists = items.find((item) => item.id === food.id);
      if (exists) {
        return items.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...items, { ...food, quantity: 1 }];
    });
    setSelectedFood(food);
  }

  function updateQuantity(id: string, change: number) {
    setCart((items) =>
      items
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + change } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  function placeOrder() {
    if (!cart.length) return;
    setOrderStep(1);
    setOrderCode(`#HF${Math.floor(2000 + Math.random() * 8000)}`);
  }

  return (
    <div className="min-h-screen bg-[#07090d] text-white">
      <section className="border-b border-white/[0.06] bg-[#0b0f16]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Customer dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Order chakula na track delivery</h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Tafuta restaurant, ongeza cart, lipa kwa mobile money, kisha fuatilia rider kwa wakati halisi.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2 text-center">
              <div className="px-3 py-2">
                <p className="text-lg font-semibold text-orange-300">18</p>
                <p className="text-[11px] text-zinc-500">Orders</p>
              </div>
              <div className="px-3 py-2">
                <p className="text-lg font-semibold text-emerald-300">4.8</p>
                <p className="text-[11px] text-zinc-500">Rating</p>
              </div>
              <div className="px-3 py-2">
                <p className="text-lg font-semibold text-sky-300">620</p>
                <p className="text-[11px] text-zinc-500">Points</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/35 px-4 text-zinc-300">
              <Icon name="search" className="text-zinc-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search food or restaurant"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
              />
            </label>
            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "min-h-12 shrink-0 rounded-2xl border px-4 text-sm font-semibold transition",
                    category === item
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
      </section>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_22rem] lg:px-8">
        <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
          <section className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Restaurants near you</h2>
                <p className="text-sm text-zinc-500">Mwanza, Tanzania</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Open now
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {filteredFoods.map((food) => (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => setSelectedFood(food)}
                  className={cn(
                    "group grid grid-cols-[6rem_1fr] gap-3 rounded-2xl border p-2 text-left transition",
                    selectedFood.id === food.id
                      ? "border-orange-400/50 bg-orange-500/10"
                      : "border-white/[0.07] bg-black/25 hover:border-white/15",
                  )}
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <SafeImage src={food.image} alt={food.name} fill className="object-cover transition group-hover:scale-105" sizes="96px" />
                  </div>
                  <div className="min-w-0 py-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{food.name}</p>
                        <p className="truncate text-sm text-zinc-500">{food.restaurant}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-amber-300">{food.rating}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-orange-300">{formatPrice(food.price)}</p>
                    <p className="mt-1 text-xs text-zinc-500">{food.minutes}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-4">
            <h2 className="text-lg font-semibold">Food details</h2>
            <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl">
              <SafeImage src={selectedFood.image} alt={selectedFood.name} fill className="object-cover" sizes="320px" />
            </div>
            <p className="mt-4 text-xl font-semibold">{selectedFood.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{selectedFood.restaurant} - {selectedFood.minutes}</p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{selectedFood.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-semibold text-orange-300">{formatPrice(selectedFood.price)}</p>
              <button
                type="button"
                onClick={() => addToCart(selectedFood)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-orange-400"
              >
                <Icon name="plus" className="h-4 w-4" />
                Add to cart
              </button>
            </div>
          </aside>

          <section className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-4 xl:col-span-2">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Live tracking</h2>
                <p className="text-sm text-zinc-500">{orderCode} - ETA 18 minutes</p>
              </div>
              <div className="flex gap-2">
                {orderSteps.map((step, index) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setOrderStep(index)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                      index <= orderStep ? "bg-emerald-500 text-zinc-950" : "bg-white/[0.06] text-zinc-500",
                    )}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-64 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827]">
                <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:34px_34px]" />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 260" fill="none" aria-hidden>
                  <path d="M48 207 C130 126 188 176 247 101 S380 88 469 42" stroke="#f97316" strokeWidth="6" strokeLinecap="round" strokeDasharray="12 14" />
                  <circle cx="48" cy="207" r="13" fill="#22c55e" />
                  <circle cx="247" cy="101" r="13" fill="#f97316" />
                  <circle cx="469" cy="42" r="13" fill="#38bdf8" />
                </svg>
                <div className="absolute bottom-4 left-4 rounded-2xl bg-black/70 p-4 backdrop-blur">
                  <p className="text-sm font-semibold">Rider: Juma Ally</p>
                  <p className="mt-1 text-xs text-zinc-400">Pickup Pizza Time - Drop off Customer Location</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
                  <Icon name="map" />
                </div>
                <h3 className="mt-4 font-semibold">{orderSteps[orderStep]}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {orderStep < 4
                    ? "Order inaendelea. Customer anaweza kuona restaurant, rider assignment, na route hapa."
                    : "Order imekamilika. Customer anaweza ku-rate restaurant na rider."}
                </p>
                <button
                  type="button"
                  onClick={() => setOrderStep((step) => Math.min(step + 1, orderSteps.length - 1))}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  <Icon name="check" className="h-4 w-4" />
                  Advance status
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-white/[0.08] bg-[#0c1119] p-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cart</h2>
            <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-zinc-950">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/[0.07] bg-black/25 p-3">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.restaurant}</p>
                  </div>
                  <p className="text-sm font-semibold text-orange-300">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-white/[0.06] p-1">
                    <button type="button" onClick={() => updateQuantity(item.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/[0.08]" aria-label={`Remove one ${item.name}`}>
                      <Icon name="minus" className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/[0.08]" aria-label={`Add one ${item.name}`}>
                      <Icon name="plus" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!cart.length && (
              <div className="rounded-2xl border border-dashed border-white/[0.12] p-5 text-center text-sm text-zinc-500">
                Cart iko empty. Chagua chakula kuanza order.
              </div>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/25 p-4">
            <p className="text-sm font-semibold">Payment method</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["M-Pesa", "Airtel", "Tigo", "Cash"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPayment(item)}
                  className={cn(
                    "min-h-10 rounded-xl border text-sm font-semibold",
                    payment === item
                      ? "border-emerald-400/50 bg-emerald-500 text-zinc-950"
                      : "border-white/[0.08] bg-white/[0.04] text-zinc-300",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Delivery</span>
              <span>{formatPrice(delivery)}</span>
            </div>
            <div className="flex justify-between border-t border-white/[0.08] pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={!cart.length}
            onClick={placeOrder}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            <Icon name="cart" className="h-4 w-4" />
            Checkout with {payment}
          </button>
        </aside>
      </main>
    </div>
  );
}
