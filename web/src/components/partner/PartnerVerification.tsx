"use client";

import Link from "next/link";
import { useState } from "react";
import { getPartnerProfile, markPartnerVerified } from "@/lib/partner-store";

type PartnerVerificationProps = {
  email: string;
};

export function PartnerVerification({ email }: PartnerVerificationProps) {
  const [profile, setProfile] = useState(() => getPartnerProfile(email));
  const [verified, setVerified] = useState(profile?.verificationStatus === "verified");

  function verifyAccount() {
    const next = markPartnerVerified(email);
    localStorage.removeItem("hashfood_token");
    localStorage.removeItem("hashfood_user");
    setProfile(next);
    setVerified(true);
  }

  return (
    <section className="min-h-screen bg-[#07090d]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
            Partner verification
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            Hakiki account yako
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Partner anatakiwa ku-verify account kabla ya ku-login na kuona dashboard. Details zako
            zitabaki zimehifadhiwa hata ukisignout.
          </p>

          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/25 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-500">Email</p>
                <p className="mt-1 font-semibold text-white">{email || "No email found"}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Partner type</p>
                <p className="mt-1 font-semibold text-white">
                  {profile?.role === "RIDER" ? "Rider" : "Restaurant"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Name</p>
                <p className="mt-1 font-semibold text-white">{profile?.displayName ?? "Pending"}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Status</p>
                <p className={verified ? "mt-1 font-semibold text-emerald-300" : "mt-1 font-semibold text-orange-300"}>
                  {verified ? "Verified" : "Pending verification"}
                </p>
              </div>
            </div>
          </div>

          {!profile && (
            <p className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Hatukupata partner details kwa email hii. Rudi partner page ujaze application kwanza.
            </p>
          )}

          {verified ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5">
              <p className="font-semibold text-emerald-200">Verification imekamilika.</p>
              <p className="mt-2 text-sm text-emerald-100/80">
                Sasa tafadhali login tena ili dashboard yako ifunguke.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-500 px-5 text-sm font-bold text-zinc-950"
              >
                Login now
              </Link>
            </div>
          ) : (
            <button
              type="button"
              disabled={!profile}
              onClick={verifyAccount}
              className="mt-6 min-h-12 w-full rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              Verify account
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
