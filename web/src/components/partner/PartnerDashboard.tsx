"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/lib/api";
import { getPartnerProfile, type PartnerProfile, type PartnerRole } from "@/lib/partner-store";

type PartnerDashboardProps = {
  role: PartnerRole;
};

function readUser() {
  try {
    const saved = localStorage.getItem("hashfood_user");
    return saved ? (JSON.parse(saved) as AuthUser) : null;
  } catch {
    return null;
  }
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

export function PartnerDashboard({ role }: PartnerDashboardProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof window === "undefined" ? null : readUser(),
  );
  const [profile, setProfile] = useState<PartnerProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const currentUser = readUser();
    return getPartnerProfile(currentUser?.email);
  });

  useEffect(() => {
    const syncSession = () => {
      const currentUser = readUser();
      setUser(currentUser);
      setProfile(getPartnerProfile(currentUser?.email));
    };

    window.addEventListener("storage", syncSession);
    window.addEventListener("hashfood-auth-updated", syncSession);
    window.addEventListener("hashfood-partner-updated", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("hashfood-auth-updated", syncSession);
      window.removeEventListener("hashfood-partner-updated", syncSession);
    };
  }, []);

  const isRestaurant = role === "RESTAURANT_ADMIN";
  const authorized = user?.role === role && profile?.verificationStatus === "verified";

  const orders = useMemo(
    () =>
      isRestaurant
        ? [
            ["#HF2041", "Chicken Pizza", "TSh 14,000", "New"],
            ["#HF2042", "Beef Pilau", "TSh 11,000", "Preparing"],
            ["#HF2043", "Hash Burger", "TSh 9,000", "Ready"],
          ]
        : [
            ["#HF2041", "Pizza Time", "Pickup ready", "1.2 km"],
            ["#HF2044", "Mama's Kitchen", "Assigned", "2.8 km"],
            ["#HF2050", "Sweet Corner", "Delivered", "0.6 km"],
          ],
    [isRestaurant],
  );

  function signOut() {
    localStorage.removeItem("hashfood_token");
    localStorage.removeItem("hashfood_user");
    window.dispatchEvent(new Event("hashfood-auth-updated"));
    router.push("/login");
  }

  if (!user) {
    return (
      <section className="min-h-screen bg-[#07090d] px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-[#0c1119] p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Login required</h1>
          <p className="mt-3 text-sm text-zinc-400">Tafadhali login kwanza ili kuona dashboard yako.</p>
          <Link href="/login" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950">
            Login
          </Link>
        </div>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="min-h-screen bg-[#07090d] px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-[#0c1119] p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Verification required</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Partner dashboard inafunguka baada ya account verification na login sahihi.
          </p>
          <Link
            href={`/partner/verify?email=${encodeURIComponent(user.email)}`}
            className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950"
          >
            Verify account
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#07090d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
                {isRestaurant ? "Restaurant dashboard" : "Rider dashboard"}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                {profile?.displayName}
              </h1>
              <p className="mt-3 text-sm text-zinc-400">
                {profile?.city ?? "Mwanza"} · {profile?.specialty ?? (isRestaurant ? "Food partner" : "Delivery partner")}
              </p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="min-h-12 rounded-xl border border-white/[0.1] px-5 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.06]"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {isRestaurant ? (
            <>
              <StatCard label="Today orders" value="24" tone="text-orange-300" />
              <StatCard label="Revenue" value="TSh 456k" tone="text-emerald-300" />
              <StatCard label="Pending prep" value="6" tone="text-sky-300" />
            </>
          ) : (
            <>
              <StatCard label="Trips today" value="12" tone="text-orange-300" />
              <StatCard label="Earnings" value="TSh 86k" tone="text-emerald-300" />
              <StatCard label="Online status" value="Active" tone="text-sky-300" />
            </>
          )}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_22rem]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-5">
            <h2 className="text-lg font-semibold text-white">
              {isRestaurant ? "Orders queue" : "Delivery queue"}
            </h2>
            <div className="mt-4 space-y-3">
              {orders.map(([code, title, value, status]) => (
                <div key={code} className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-semibold text-white">{code}</p>
                      <p className="mt-1 text-sm text-zinc-500">{title}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-bold text-orange-300">{value}</p>
                      <p className="mt-1 text-xs text-zinc-500">{status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-5">
            <h2 className="text-lg font-semibold text-white">Saved partner details</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Email</span>
                <span className="text-right font-semibold text-white">{profile?.email}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Phone</span>
                <span className="text-right font-semibold text-white">{profile?.phone ?? "Not set"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Verified</span>
                <span className="text-right font-semibold text-emerald-300">Yes</span>
              </div>
              {isRestaurant && (
                <>
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500">Address</span>
                    <span className="text-right font-semibold text-white">{profile?.address ?? "Not set"}</span>
                  </div>
                  {profile?.googleMapsUrl ? (
                    <a
                      href={profile.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
                    >
                      Open restaurant on Google Maps
                    </a>
                  ) : null}
                </>
              )}
            </div>
            {isRestaurant && profile?.address ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827]">
                <iframe
                  title="Restaurant location map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    [profile.address, profile.city, "Tanzania"].filter(Boolean).join(", "),
                  )}&output=embed`}
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
            <p className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              Details hizi zitaendelea kubaki hata ukisignout.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
