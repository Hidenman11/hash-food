import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";

const company = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Blog", href: "/blog" },
  { label: "Admin", href: "/admin" },
] as const;

const customers = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Offers", href: "/offers" },
  { label: "Track order", href: "/track" },
  { label: "Help center", href: "#help-center" },
] as const;

const restaurants = [
  { label: "Partner with us", href: "/partner" },
  { label: "Restaurant dashboard", href: "/restaurant" },
  { label: "Pricing", href: "/partner#pricing" },
] as const;

function SocialIcon({ name }: { name: "fb" | "ig" | "x" | "tiktok" }) {
  const common = "h-5 w-5";
  if (name === "fb")
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M22 12a10 10 0 1 0-11.5 9.95v-7.05h-2.4V12h2.4V9.41c0-2.37 1.44-3.68 3.6-3.68 1.04 0 2.12.18 2.12.18v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48V12h2.64l-.42 2.9h-2.22v7.05A10 10 0 0 0 22 12z" />
      </svg>
    );
  if (name === "ig")
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm5.25-3.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
      </svg>
    );
  if (name === "x")
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  return (
    <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.05] bg-black">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-500">
              Order from the best restaurants near you. Live tracking, mobile money
              checkout, and WhatsApp updates—HASH FOOD delivers your city’s flavors
              fast.
            </p>
            <div className="mt-6 flex gap-3 text-zinc-400">
              {(
                [
                  ["fb", "Facebook"],
                  ["ig", "Instagram"],
                  ["x", "X"],
                  ["tiktok", "TikTok"],
                ] as const
              ).map(([id, label]) => (
                <a
                  key={id}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#141414] transition hover:border-orange-500/40 hover:text-orange-400"
                  aria-label={label}
                >
                  <SocialIcon name={id} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-500 transition hover:text-orange-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">For customers</h3>
            <ul className="mt-4 space-y-3">
              {customers.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-500 transition hover:text-orange-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">For restaurants</h3>
            <ul className="mt-4 space-y-3">
              {restaurants.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-500 transition hover:text-orange-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-10">
          <p className="text-sm font-semibold text-white">Download our app</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.1] bg-[#141414] px-5 py-2.5 text-sm font-medium text-white transition hover:border-orange-500/40"
            >
              Google Play
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.1] bg-[#141414] px-5 py-2.5 text-sm font-medium text-white transition hover:border-orange-500/40"
            >
              App Store
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-zinc-600 sm:flex-row">
          <p>© {new Date().getFullYear()} HASH FOOD. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-orange-400">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-orange-400">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-orange-400">
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
