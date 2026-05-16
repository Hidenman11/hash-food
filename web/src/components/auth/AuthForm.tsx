"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { API_BASE_URL, type AuthResponse, type AuthUser } from "@/lib/api";
import { cn } from "@/lib/cn";
import {
  getPartnerProfile,
  isPartnerRole,
  partnerDashboardPath,
  upsertPartnerProfile,
} from "@/lib/partner-store";

type Mode = "login" | "signup";
type Role = "CUSTOMER" | "RESTAURANT_ADMIN" | "RIDER";

type AuthFormProps = {
  mode: Mode;
  initialRole?: Role;
  initialEmail?: string;
  initialFullName?: string;
  initialPhone?: string;
};

const roleOptions: Array<{ value: Role; label: string; detail: string }> = [
  { value: "CUSTOMER", label: "Customer", detail: "Order food and track delivery" },
  { value: "RESTAURANT_ADMIN", label: "Restaurant", detail: "Receive and manage orders" },
  { value: "RIDER", label: "Rider", detail: "Accept pickups and deliver" },
];

function routeForRole(role: AuthUser["role"]) {
  return partnerDashboardPath(role);
}

function FieldIcon({ name }: { name: "user" | "mail" | "lock" | "phone" }) {
  const className = "h-5 w-5 text-zinc-500";

  if (name === "user") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M7 4h10l1 16H6L7 4Z" strokeLinejoin="round" />
        <path d="M10 17h4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 6h16v12H4z" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AuthForm({ mode, initialRole = "CUSTOMER", initialEmail = "", initialFullName = "", initialPhone = "" }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const partnerInitial =
    isSignup && initialEmail && isPartnerRole(initialRole)
      ? getPartnerProfile(initialEmail)
      : null;
  const [fullName, setFullName] = useState(initialFullName || partnerInitial?.displayName || "");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone || partnerInitial?.phone || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const title = isSignup ? "Create your account" : "Welcome back";
  const subtitle = isSignup
    ? "Jisajili ili uanze ku-order, kusimamia restaurant, au kufanya delivery."
    : "Ingia kwenye HASH FOOD ili uendelee na orders zako.";

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;
    if (isSignup && password.length < 8) return false;
    return true;
  }, [email, isSignup, password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || status === "loading") return;

    setStatus("loading");
    setMessage("");

    const endpoint = isSignup ? "/v1/auth/register" : "/v1/auth/login";
    const payload = isSignup
      ? {
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
          fullName: fullName.trim() || undefined,
          role,
        }
      : { email: email.trim(), password };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as
        | AuthResponse
        | { error?: unknown }
        | null;

      if (!response.ok) {
        const error =
          data && "error" in data && typeof data.error === "string"
            ? data.error
            : "Hatukuweza kukamilisha request. Hakiki taarifa zako.";
        throw new Error(error);
      }

      const auth = data as AuthResponse;

      if (isSignup && isPartnerRole(auth.user.role)) {
        const existingPartner = getPartnerProfile(auth.user.email);
        const nextPartner = upsertPartnerProfile({
          email: auth.user.email,
          role: auth.user.role,
          displayName: auth.user.fullName || fullName.trim() || auth.user.email,
          phone: auth.user.phone || phone.trim() || undefined,
          verificationStatus: existingPartner?.verificationStatus ?? "pending",
        });

        if (nextPartner.verificationStatus === "verified") {
          localStorage.setItem("hashfood_token", auth.token);
          localStorage.setItem("hashfood_user", JSON.stringify(auth.user));
          window.dispatchEvent(new Event("hashfood-auth-updated"));
          setStatus("success");
          setMessage("Account imetengenezwa. Tunakupeleka dashboard...");
          router.push(routeForRole(auth.user.role));
          return;
        }

        localStorage.removeItem("hashfood_token");
        localStorage.removeItem("hashfood_user");
        setStatus("success");
        setMessage("Account imetengenezwa. Kamilisha verification kabla ya login.");
        router.push(`/partner/verify?email=${encodeURIComponent(auth.user.email)}`);
        return;
      }

      if (!isSignup && isPartnerRole(auth.user.role)) {
        const partner = getPartnerProfile(auth.user.email);
        if (!partner || partner.verificationStatus !== "verified") {
          upsertPartnerProfile({
            email: auth.user.email,
            role: auth.user.role,
            displayName: auth.user.fullName || auth.user.email,
            phone: auth.user.phone || undefined,
            verificationStatus: partner?.verificationStatus ?? "pending",
          });
          localStorage.removeItem("hashfood_token");
          localStorage.removeItem("hashfood_user");
          setStatus("error");
          setMessage("Partner account bado haijaverify. Kamilisha verification kwanza.");
          router.push(`/partner/verify?email=${encodeURIComponent(auth.user.email)}`);
          return;
        }
      }

      localStorage.setItem("hashfood_token", auth.token);
      localStorage.setItem("hashfood_user", JSON.stringify(auth.user));
      window.dispatchEvent(new Event("hashfood-auth-updated"));
      setStatus("success");
      setMessage(isSignup ? "Account imetengenezwa. Tunakupeleka dashboard..." : "Umeingia. Tunakupeleka dashboard...");
      router.push(routeForRole(auth.user.role));
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Kuna tatizo limetokea.");
    }
  }

  return (
    <section className="min-h-[calc(100vh-4.25rem)] bg-[#07090d]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-12">
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
              HASH FOOD AUTH
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {isSignup ? "Unganisha order yako kwenye mfumo mmoja." : "Endelea pale ulipoishia."}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">
              Mfumo huu unaunganisha customer, restaurant, rider, payment, na live tracking kupitia account moja.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["Customer", "Order chakula, lipa, track rider"],
              ["Restaurant", "Pokea order na update status"],
              ["Rider", "Chukua delivery na share location"],
            ].map(([label, detail]) => (
              <div key={label} className="rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                <p className="font-semibold text-white">{label}</p>
                <p className="mt-1 text-sm text-zinc-500">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{subtitle}</p>
            </div>
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="rounded-full border border-white/[0.1] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.06]"
            >
              {isSignup ? "Login" : "Sign up"}
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isSignup && (
              <label className="block">
                <span className="text-sm font-semibold text-zinc-200">Full name</span>
                <span className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-4 focus-within:border-orange-400/50">
                  <FieldIcon name="user" />
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="e.g. Asha Juma"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                    autoComplete="name"
                  />
                </span>
              </label>
            )}

            <label className="block">
              <span className="text-sm font-semibold text-zinc-200">Email address</span>
              <span className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-4 focus-within:border-orange-400/50">
                <FieldIcon name="mail" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                  autoComplete="email"
                />
              </span>
            </label>

            {isSignup && (
              <label className="block">
                <span className="text-sm font-semibold text-zinc-200">Phone number</span>
                <span className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-4 focus-within:border-orange-400/50">
                  <FieldIcon name="phone" />
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="e.g. 255712345678"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                    autoComplete="tel"
                  />
                </span>
              </label>
            )}

            <label className="block">
              <span className="text-sm font-semibold text-zinc-200">Password</span>
              <span className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-4 focus-within:border-orange-400/50">
                <FieldIcon name="lock" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignup ? "At least 8 characters" : "Enter password"}
                  minLength={isSignup ? 8 : undefined}
                  required
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>

            {isSignup && (
              <div>
                <p className="text-sm font-semibold text-zinc-200">Account type</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={cn(
                        "min-h-24 rounded-xl border p-3 text-left transition",
                        role === option.value
                          ? "border-orange-400/50 bg-orange-500 text-zinc-950"
                          : "border-white/[0.08] bg-black/25 text-zinc-300 hover:bg-white/[0.05]",
                      )}
                    >
                      <span className="block text-sm font-bold">{option.label}</span>
                      <span className={cn("mt-1 block text-xs leading-5", role === option.value ? "text-zinc-800" : "text-zinc-500")}>
                        {option.detail}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {message && (
              <p
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm",
                  status === "error"
                    ? "border-red-500/25 bg-red-500/10 text-red-200"
                    : "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
                )}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || status === "loading"}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {status === "loading" ? "Please wait..." : isSignup ? "Create account" : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            {isSignup ? "Already have an account?" : "New to HASH FOOD?"}{" "}
            <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-orange-300 hover:text-orange-200">
              {isSignup ? "Login here" : "Create account"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
