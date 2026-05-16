import Image from "next/image";
import Link from "next/link";
import { FeaturedOfferCard } from "@/components/customer/FeaturedOfferCard";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { Container } from "@/components/ui/Container";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=2200&q=90";

const categories = [
  {
    name: "Pizza",
    count: "24 items",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=90",
  },
  {
    name: "Burger",
    count: "18 items",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=90",
  },
  {
    name: "Chicken",
    count: "32 items",
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=90",
  },
  {
    name: "Rice",
    count: "15 items",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=90",
  },
  {
    name: "Drinks",
    count: "40 items",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=90",
  },
  {
    name: "Snacks",
    count: "22 items",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=500&q=90",
  },
] as const;

const restaurants = [
  {
    name: "Pizza Time",
    cuisines: "Italian · Pizza · Pasta",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=90",
    imageAlt: "Wood-fired pizza",
    rating: "4.6",
    deliveryMins: "20–30 min",
    distance: "1.2 km",
    deliveryFee: "TSh 2,000 fee",
    freeDelivery: true,
    href: "/restaurants/pizza-time",
  },
  {
    name: "Burger House",
    cuisines: "American · Burgers · Fries",
    image:
      "https://images.unsplash.com/photo-1553979459-b888fc870885?auto=format&fit=crop&w=1000&q=90",
    imageAlt: "Gourmet burger",
    rating: "4.8",
    deliveryMins: "15–25 min",
    distance: "0.8 km",
    deliveryFee: "TSh 1,500 fee",
    freeDelivery: false,
    href: "/restaurants/burger-house",
  },
  {
    name: "Spice Route",
    cuisines: "Indian · Curry · Biryani",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1000&q=90",
    imageAlt: "Curry spread",
    rating: "4.5",
    deliveryMins: "25–35 min",
    distance: "2.1 km",
    deliveryFee: "TSh 2,500 fee",
    freeDelivery: true,
    href: "/restaurants/spice-route",
  },
  {
    name: "Fresh Bowl",
    cuisines: "Healthy · Salads · Bowls",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=90",
    imageAlt: "Veggie bowl",
    rating: "4.7",
    deliveryMins: "18–28 min",
    distance: "1.5 km",
    deliveryFee: "TSh 2,000 fee",
    freeDelivery: false,
    href: "/restaurants/fresh-bowl",
  },
  {
    name: "Sushi Zen",
    cuisines: "Japanese · Sushi · Ramen",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1000&q=90",
    imageAlt: "Sushi platter",
    rating: "4.9",
    deliveryMins: "30–40 min",
    distance: "2.8 km",
    deliveryFee: "TSh 3,000 fee",
    freeDelivery: false,
    href: "/restaurants/sushi-zen",
  },
  {
    name: "Sweet Corner",
    cuisines: "Desserts · Bakery · Coffee",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=90",
    imageAlt: "Desserts",
    rating: "4.4",
    deliveryMins: "12–22 min",
    distance: "0.6 km",
    deliveryFee: "TSh 1,000 fee",
    freeDelivery: true,
    href: "/restaurants/sweet-corner",
  },
] as const;

const valueProps = [
  { title: "Fast delivery", subtitle: "Avg. 20–40 min", icon: "clock" },
  { title: "Live tracking", subtitle: "Real-time GPS", icon: "map" },
  { title: "Secure checkout", subtitle: "Mobile money + cards", icon: "shield" },
  { title: "Top restaurants", subtitle: "Curated partners", icon: "chef" },
] as const;

const featureRow = [
  {
    title: "Effortless ordering",
    body: "Crisp menus, smart search, and one-tap reorder for your go-to meals.",
    icon: "order",
  },
  {
    title: "Transparent tracking",
    body: "Live rider map, accurate ETAs, and WhatsApp updates you can trust.",
    icon: "track",
  },
  {
    title: "Payments that fit",
    body: "M-Pesa, Airtel Money, Tigo Pesa, and cards—pick what works.",
    icon: "pay",
  },
  {
    title: "Reliable delivery",
    body: "Route-aware dispatch keeps dinner hot and arrivals predictable.",
    icon: "bolt",
  },
] as const;

const howItWorks = [
  {
    step: "01",
    title: "Browse & personalize",
    body: "Filter by cuisine, prep time, offers, and dietary preferences.",
  },
  {
    step: "02",
    title: "Pay in seconds",
    body: "Checkout with biometrics-ready flows and instant confirmations.",
  },
  {
    step: "03",
    title: "Track every minute",
    body: "Watch handoff, pickup, and doorstep arrival without refreshing.",
  },
  {
    step: "04",
    title: "Enjoy & rate",
    body: "Tell partners what rocked—your feedback trains better matches.",
  },
] as const;

const stats = [
  { value: "500+", label: "Restaurants", icon: "store" },
  { value: "10K+", label: "Happy customers", icon: "users" },
  { value: "50K+", label: "Orders delivered", icon: "package" },
  { value: "20–40 min", label: "Typical arrival", icon: "clock" },
] as const;

function ValueIcon({ name }: { name: string }) {
  const common = "h-5 w-5 text-orange-400";
  switch (name) {
    case "clock":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <circle cx="12" cy="12" r="9" strokeWidth="1.75" />
          <path strokeLinecap="round" strokeWidth="1.75" d="M12 7v5l3 2" />
        </svg>
      );
    case "map":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z"
          />
          <circle cx="12" cy="11" r="2" strokeWidth="1.75" />
        </svg>
      );
    case "shield":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeWidth="1.75"
            strokeLinejoin="round"
            d="M12 3l8 4v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V7l8-4z"
          />
          <path strokeLinecap="round" strokeWidth="1.75" d="M9 12l2 2 4-4" />
        </svg>
      );
    case "chef":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 9a4 4 0 0 1 8 0v3H6V9zM6 12v9M10 12v9M14 12v9M18 10h2a2 2 0 0 1 2 2v1h-4"
          />
        </svg>
      );
    default:
      return null;
  }
}

function FeatureIcon({ name }: { name: string }) {
  const common = "h-7 w-7 text-orange-400";
  switch (name) {
    case "order":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeWidth="1.5"
            strokeLinejoin="round"
            d="M4 7h16M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M6 7v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"
          />
          <path strokeLinecap="round" strokeWidth="1.5" d="M9 12h6M9 16h6" />
        </svg>
      );
    case "track":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeWidth="1.5" strokeLinecap="round" d="M4 19h16M7 16l3-6 4 3 4-8" />
          <circle cx="7" cy="16" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="14" cy="13" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="18" cy="8" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "pay":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="1.5" />
          <path strokeWidth="1.5" d="M2 10h20" />
          <path strokeLinecap="round" strokeWidth="1.5" d="M6 15h4" />
        </svg>
      );
    case "bolt":
      return (
        <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
        </svg>
      );
    default:
      return null;
  }
}

function StatIcon({ name }: { name: string }) {
  const common = "h-6 w-6 text-orange-400";
  switch (name) {
    case "store":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeWidth="1.5"
            strokeLinejoin="round"
            d="M4 10h16M6 10v10h12V10M9 10V7h6v3M8 21h8"
          />
        </svg>
      );
    case "users":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <circle cx="9" cy="8" r="3" strokeWidth="1.5" />
          <path strokeWidth="1.5" d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <circle cx="17" cy="9" r="2.5" strokeWidth="1.5" />
          <path strokeWidth="1.5" d="M21 21v-1.5a3 3 0 0 0-3-3h-1" />
        </svg>
      );
    case "package":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeWidth="1.5"
            strokeLinejoin="round"
            d="M4 8l8-4 8 4-8 4-8-4zM4 8v8l8 4 8-4V8M12 12v8"
          />
        </svg>
      );
    default:
      return <ValueIcon name="clock" />;
  }
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">{children}</p>
  );
}

export default function Home() {
  return (
    <>
      {/* Promo strip */}
      <section className="border-b border-white/[0.04] bg-[#050505]">
        <Container className="max-w-7xl py-2.5">
          <p className="text-center text-[13px] text-zinc-400 sm:text-sm">
            <span className="font-semibold text-white">Free delivery</span> on your first order · Use{" "}
            <span className="rounded-md bg-orange-500/15 px-1.5 py-0.5 font-mono text-xs font-semibold text-orange-200 ring-1 ring-orange-500/25">
              HASHFIRST
            </span>
          </p>
        </Container>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            className="scale-105 object-cover object-[center_40%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/88 to-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        </div>

        <Container className="relative z-10 max-w-7xl py-14 sm:py-20 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <SectionEyebrow>Deliver to Mwanza</SectionEyebrow>
              <h1 className="mt-4 max-w-[18ch] text-5xl font-semibold tracking-tighter text-white sm:text-6xl lg:text-7xl lg:leading-[1.02]">
                Favorite food,{" "}
                <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  lightning-fast
                </span>{" "}
                delivery
              </h1>
              <p className="mt-6 max-w-lg text-lg font-normal leading-relaxed text-zinc-400">
                Restaurant-quality meals with Uber-level reliability—real-time tracking, transparent
                fees, and payouts your neighborhood already uses.
              </p>

              <form
                action="/restaurants"
                className="mt-10 flex flex-col gap-2 rounded-[1.35rem] bg-white/[0.97] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.55)] ring-1 ring-black/10 backdrop-blur sm:flex-row sm:items-stretch sm:rounded-full sm:p-1.5"
              >
                <div className="flex min-h-[3.5rem] flex-1 items-center gap-3 px-5 text-zinc-900">
                  <span className="text-orange-500" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" strokeLinejoin="round" />
                      <circle cx="12" cy="11" r="2.5" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Delivering to
                    </p>
                    <p className="truncate text-sm font-semibold sm:text-[0.9375rem]">Mwanza, Tanzania</p>
                  </div>
                </div>
                <div className="hidden h-10 w-px shrink-0 self-center bg-zinc-200 sm:block" aria-hidden />
                <label className="flex min-h-[3.5rem] flex-[1.35] cursor-text items-center gap-3 px-5 sm:px-3">
                  <span className="text-zinc-400" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-3-3" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    name="q"
                    type="search"
                    placeholder="Search dishes, cuisines, or restaurants"
                    className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none sm:text-[0.9375rem]"
                    autoComplete="off"
                  />
                </label>
                <button
                  type="submit"
                  className="min-h-[3.5rem] shrink-0 rounded-2xl bg-zinc-900 px-10 text-sm font-semibold text-white shadow-inner transition hover:bg-zinc-800 sm:rounded-full"
                >
                  Search
                </button>
              </form>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:hidden">
                {valueProps.map((v) => (
                  <div
                    key={v.title}
                    className="flex gap-3 rounded-2xl border border-white/[0.06] bg-black/40 p-4 backdrop-blur-xl"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                      <ValueIcon name={v.icon} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{v.title}</p>
                      <p className="text-xs text-zinc-500">{v.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 hidden divide-x divide-white/[0.08] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl sm:flex">
                {valueProps.map((v) => (
                  <div key={v.title} className="flex flex-1 gap-3 px-6 py-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/15">
                      <ValueIcon name={v.icon} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{v.title}</p>
                      <p className="text-xs text-zinc-500">{v.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <div
                className="pointer-events-none absolute -right-2 top-2 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-5 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-white shadow-[0_20px_60px_rgba(251,146,60,0.45)] sm:h-36 sm:w-36 sm:text-[11px] lg:right-4 lg:top-8"
                aria-hidden
              >
                Limited time
                <span className="my-1 text-2xl font-semibold tracking-tight sm:text-3xl">50%</span>
                off select menus
              </div>

              <FeaturedOfferCard />
            </div>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="border-b border-white/[0.04] py-16 sm:py-20">
        <Container className="max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <SectionEyebrow>Explore</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Categories crafted for cravings
              </h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-500 sm:text-base">
                Scroll horizontally on mobile—every tile opens curated menus with photography that
                actually matches the plate.
              </p>
            </div>
            <Link
              href="/restaurants"
              className="hidden text-sm font-semibold text-orange-300 transition hover:text-orange-200 sm:inline-flex sm:items-center sm:gap-1"
            >
              View all
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="scrollbar-hide mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 [-webkit-overflow-scrolling:touch]">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/restaurants?category=${c.name.toLowerCase()}`}
                className="group relative w-[42vw] max-w-[9.5rem] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0c0c0c] shadow-[0_20px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.03] transition hover:-translate-y-1 hover:border-orange-500/30 sm:w-40 sm:max-w-none"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="160px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-base font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-zinc-400">{c.count}</p>
                  </div>
                </div>
              </Link>
            ))}
            <Link
              href="/restaurants"
              className="flex w-[42vw] max-w-[9.5rem] shrink-0 snap-start flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.02] px-3 py-10 text-zinc-500 transition hover:border-orange-400/40 hover:text-orange-200 sm:w-40 sm:max-w-none"
            >
              <span className="text-3xl font-light leading-none">···</span>
              <span className="mt-3 text-sm font-semibold">See more</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Restaurants */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-7xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionEyebrow>Near you</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Popular restaurants
              </h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-500 sm:text-base">
                Handpicked based on ratings, reliability, and fastest handoff—updated hourly.
              </p>
            </div>
            <Link
              href="/restaurants"
              className="text-sm font-semibold text-orange-300 transition hover:text-orange-200"
            >
              Browse map view →
            </Link>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.name} {...r} />
            ))}
          </div>
        </Container>
      </section>

      {/* Feature strip */}
      <section className="border-y border-white/[0.04] bg-[#050505] py-14 sm:py-16">
        <Container className="max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-4 lg:gap-10">
            {featureRow.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20">
                  <FeatureIcon name={f.icon} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24">
        <Container className="max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <SectionEyebrow>Journey</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              How HASH FOOD keeps every bite on time
            </h2>
            <p className="mt-4 text-zinc-500">
              A calm experience for guests, transparent tools for partners, and realtime telemetry for
              riders.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((s) => (
              <div
                key={s.step}
                className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#111] to-[#0a0a0a] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.03]"
              >
                <span className="text-sm font-semibold text-orange-400/80">{s.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-t border-white/[0.04] bg-gradient-to-b from-[#050505] to-black py-14 sm:py-16">
        <Container className="max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-4 rounded-3xl border border-white/[0.06] bg-black/60 p-6 shadow-inner shadow-black/40 ring-1 ring-white/[0.03]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/15">
                  <StatIcon name={s.icon} />
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-white">{s.value}</p>
                  <p className="text-sm text-zinc-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
