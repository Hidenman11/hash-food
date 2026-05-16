"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { AuthUser } from "@/lib/api";
import { partnerDashboardPath } from "@/lib/partner-store";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Customer", href: "/customer" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Offers", href: "/offers" },
  { label: "Track Order", href: "/track" },
  { label: "Become a Partner", href: "/partner" },
] as const;

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
      <path d="M6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const readCartCount = () => {
      try {
        const saved = localStorage.getItem("hashfood_cart");
        if (!saved) {
          setCartCount(0);
          return;
        }
        const parsed = JSON.parse(saved) as Array<{ quantity?: number }>;
        setCartCount(
          Array.isArray(parsed)
            ? parsed.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
            : 0,
        );
      } catch {
        setCartCount(0);
      }
    };

    readCartCount();
    window.addEventListener("storage", readCartCount);
    window.addEventListener("hashfood-cart-updated", readCartCount);

    return () => {
      window.removeEventListener("storage", readCartCount);
      window.removeEventListener("hashfood-cart-updated", readCartCount);
    };
  }, []);

  useEffect(() => {
    const readUser = () => {
      try {
        const saved = localStorage.getItem("hashfood_user");
        setAuthUser(saved ? (JSON.parse(saved) as AuthUser) : null);
      } catch {
        setAuthUser(null);
      }
    };

    readUser();
    window.addEventListener("storage", readUser);
    window.addEventListener("hashfood-auth-updated", readUser);
    return () => {
      window.removeEventListener("storage", readUser);
      window.removeEventListener("hashfood-auth-updated", readUser);
    };
  }, []);

  function signOut() {
    localStorage.removeItem("hashfood_token");
    localStorage.removeItem("hashfood_user");
    setAuthUser(null);
    window.dispatchEvent(new Event("hashfood-auth-updated"));
  }

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/70 backdrop-blur-3xl supports-[backdrop-filter]:bg-black/70 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.75)]">
      <Container>
        <div className="flex h-[4.75rem] items-center justify-between gap-3 lg:gap-6">
          <Logo className="min-w-0 transition-transform duration-300 hover:-translate-y-0.5" />

          <nav className="hidden items-center gap-2 lg:flex" aria-label="Main">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium transition duration-300 ease-out",
                    active
                      ? "bg-gradient-to-r from-orange-500/20 via-white/10 to-orange-500/15 text-white shadow-[0_16px_45px_-22px_rgba(255,140,0,0.8)]"
                      : "text-zinc-300 hover:text-white hover:bg-white/10",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300",
                      active ? "opacity-100 scale-x-100" : "opacity-0 group-hover:opacity-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <label className="relative hidden sm:block">
              <span className="sr-only">Delivery location</span>
              <select
                name="city"
                defaultValue="mwanza"
                className="h-10 cursor-pointer appearance-none rounded-xl border border-white/[0.08] bg-[#141414] py-2 pl-3 pr-9 text-sm font-medium text-white focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="mwanza">Mwanza</option>
                <option value="dar">Dar es Salaam</option>
                <option value="arusha">Arusha</option>
                <option value="dodoma">Dodoma</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            </label>

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#141414] text-zinc-200 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-500/30 hover:text-white hover:shadow-lg hover:shadow-orange-500/20"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <CartIcon />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-1 text-[10px] font-bold text-white shadow-md shadow-orange-500/40">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>

            {authUser ? (
              <>
                <Link
                  href={partnerDashboardPath(authUser.role)}
                  className="hidden rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-orange-500 sm:inline-flex"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="hidden rounded-full border border-white/[0.1] px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.06] xl:inline-flex"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-orange-500 sm:inline-flex"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="hidden rounded-full border border-white/[0.1] px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.06] xl:inline-flex"
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#141414] text-zinc-100 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span className="flex flex-col gap-1.5" aria-hidden>
                <span
                  className={cn(
                    "block h-0.5 w-5 rounded-full bg-current transition",
                    open && "translate-y-2 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-5 rounded-full bg-current transition",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-5 rounded-full bg-current transition",
                    open && "-translate-y-2 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </Container>

      <div
        id="mobile-nav"
        className={cn(
          "absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-4.75rem)] overflow-y-auto border-t border-white/[0.08] bg-[#08080a]/98 shadow-2xl shadow-black/70 backdrop-blur-3xl transition-all duration-300 ease-out lg:hidden",
          open ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-4",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-10 pt-4 sm:px-6 lg:px-8" aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-3xl px-4 py-4 text-base font-semibold text-zinc-200 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <span className="block text-sm text-zinc-400 group-hover:text-orange-300 transition-colors duration-300">
                {item.label}
              </span>
            </Link>
          ))}
          <div className="mt-4 border-t border-white/[0.08] pt-6">
            <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Location
            </p>
            <label className="block px-4">
              <span className="sr-only">City</span>
              <select
                name="city-mobile"
                defaultValue="mwanza"
                className="h-12 w-full cursor-pointer rounded-xl border border-white/[0.08] bg-[#141414] px-4 text-sm font-medium text-white focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="mwanza">Mwanza, Tanzania</option>
                <option value="dar">Dar es Salaam</option>
                <option value="arusha">Arusha</option>
                <option value="dodoma">Dodoma</option>
              </select>
            </label>
          </div>
          <div className="mt-6 px-4">
            {authUser ? (
              <>
                <Link
                  href={partnerDashboardPath(authUser.role)}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="mt-3 flex w-full items-center justify-center rounded-full border border-white/[0.1] py-3.5 text-sm font-semibold text-zinc-200"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex w-full items-center justify-center rounded-full border border-white/[0.1] py-3.5 text-sm font-semibold text-zinc-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
