"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

const nav = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Orders", href: "/admin/orders", icon: "orders" },
  { label: "Restaurants", href: "/admin/restaurants", icon: "store" },
  { label: "Riders", href: "/admin/riders", icon: "bike" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Analytics", href: "/admin/analytics", icon: "chart" },
  { label: "Reports", href: "/admin/reports", icon: "doc" },
  { label: "Settings", href: "/admin/settings", icon: "gear" },
] as const;

function NavIcon({ name }: { name: (typeof nav)[number]["icon"] }) {
  const c = "h-5 w-5";
  switch (name) {
    case "grid":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeWidth="1.5" d="M4 4h7v7H4V4zM13 4h7v7h-7V4zM4 13h7v7H4v-7zM13 13h7v7h-7v-7z" />
        </svg>
      );
    case "orders":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeWidth="1.5" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "store":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeWidth="1.5" strokeLinejoin="round" d="M4 10h16M6 10v10h12V10M9 10V7h6v3M8 21h8" />
        </svg>
      );
    case "bike":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <circle cx="7" cy="17" r="3" strokeWidth="1.5" />
          <circle cx="17" cy="17" r="3" strokeWidth="1.5" />
          <path strokeWidth="1.5" strokeLinejoin="round" d="M5 17H3l3-8h4l2 4h6l3 4h-2" />
        </svg>
      );
    case "users":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <circle cx="9" cy="8" r="3" strokeWidth="1.5" />
          <path strokeWidth="1.5" d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <circle cx="17" cy="9" r="2.5" strokeWidth="1.5" />
          <path strokeWidth="1.5" d="M21 21v-1.5a3 3 0 0 0-3-3h-1" />
        </svg>
      );
    case "chart":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeWidth="1.5" strokeLinecap="round" d="M4 19h16M7 16l3-5 3 2 4-6 3 4" />
        </svg>
      );
    case "doc":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeWidth="1.5" strokeLinejoin="round" d="M9 3h6l4 4v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path strokeWidth="1.5" d="M9 9h6M9 13h6M9 17h4" />
        </svg>
      );
    default:
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
          <path strokeWidth="1.5" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
  }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-[#0a0a0a] transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/[0.06] px-5">
          <Logo className="scale-90" />
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Admin">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-gradient-to-r from-orange-500/20 to-orange-600/5 text-white ring-1 ring-orange-500/25"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200",
                )}
              >
                <span className={active ? "text-orange-400" : "text-zinc-600"}>
                  <NavIcon name={item.icon} />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-white/[0.06] p-4">
          <Link
            href="/"
            className="flex items-center justify-center rounded-xl border border-white/[0.08] py-2.5 text-sm font-medium text-zinc-400 transition hover:border-orange-500/30 hover:text-white"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/[0.06] bg-[#050505]/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#111] text-zinc-200 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Operations
              </p>
              <h1 className="text-lg font-semibold text-white">Admin console</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden rounded-full border border-white/[0.08] bg-[#111] px-4 py-2 text-sm text-zinc-500 sm:block">
              Mwanza · Live
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white">
              AD
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
