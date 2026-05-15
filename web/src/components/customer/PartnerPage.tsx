"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { cn } from "@/lib/cn";
import { upsertPartnerProfile } from "@/lib/partner-store";

const partnerTypes = [
  {
    id: "restaurant",
    title: "Restaurant Partner",
    detail: "Pokea orders, simamia menu, na fuatilia mauzo yako.",
  },
  {
    id: "rider",
    title: "Rider Partner",
    detail: "Pokea delivery requests na track trips zako live.",
  },
] as const;

const benefits = [
  "Online ordering dashboard",
  "Mobile money payment support",
  "Live rider and order tracking",
  "Customer ratings and reviews",
  "Promo campaigns and offers",
  "Daily sales visibility",
];

const cuisineOptions = [
  "Pizza / Italian",
  "Local food",
  "Rice / Pilau / Biryani",
  "Chicken / Chips",
  "Burgers / Fast food",
  "Desserts / Bakery",
  "Healthy food / Juice",
  "Other",
];

const vehicleOptions = ["Motorbike", "Bicycle", "Car", "Walking", "Other"];

export function PartnerPage() {
  const router = useRouter();
  const [partnerType, setPartnerType] = useState<(typeof partnerTypes)[number]["id"]>("restaurant");
  const [submitted, setSubmitted] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Mwanza");
  const [specialty, setSpecialty] = useState("");
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [address, setAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [notes, setNotes] = useState("");
  const mapQuery = [address, city, "Tanzania"].filter(Boolean).join(", ");
  const defaultMapsQuery = "Mwanza, Tanzania";
  const generatedMapsUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultMapsQuery)}`;
  const normalizedGoogleMapsUrl = googleMapsUrl.trim();
  const mapLink = normalizedGoogleMapsUrl || generatedMapsUrl;
  const mapEmbedUrl = normalizedGoogleMapsUrl && normalizedGoogleMapsUrl.includes("google.com/maps")
    ? `${normalizedGoogleMapsUrl}${normalizedGoogleMapsUrl.includes("?") ? "&" : "?"}output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(mapQuery || defaultMapsQuery)}&output=embed`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const finalSpecialty = specialty === "Other" ? customSpecialty : specialty;
    upsertPartnerProfile({
      email,
      role: partnerType === "restaurant" ? "RESTAURANT_ADMIN" : "RIDER",
      displayName,
      phone,
      city,
      specialty: finalSpecialty,
      address: partnerType === "restaurant" ? address : undefined,
      googleMapsUrl: partnerType === "restaurant" ? mapLink : undefined,
      notes,
      verificationStatus: "pending",
    });
    setSubmitted(true);
    const queryParts = [
      `role=${partnerType}`,
      email && `email=${encodeURIComponent(email)}`,
      displayName && `fullName=${encodeURIComponent(displayName)}`,
      phone && `phone=${encodeURIComponent(phone)}`,
    ].filter(Boolean);

    router.push(`/signup?${queryParts.join("&")}`);
  }

  return (
    <section className="min-h-screen bg-[#07090d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
              Become a partner
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Jiunge na HASH FOOD
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
              Sajili restaurant yako au jiunge kama rider. Mfumo unaunganisha orders, payments,
              dashboard, na live delivery tracking sehemu moja.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {partnerTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setPartnerType(type.id)}
                  className={cn(
                    "min-h-36 rounded-2xl border p-5 text-left transition",
                    partnerType === type.id
                      ? "border-orange-400/50 bg-orange-500 text-zinc-950"
                      : "border-white/[0.08] bg-black/25 text-zinc-300 hover:bg-white/[0.05]",
                  )}
                >
                  <span className="block text-lg font-bold">{type.title}</span>
                  <span
                    className={cn(
                      "mt-3 block text-sm leading-6",
                      partnerType === type.id ? "text-zinc-800" : "text-zinc-500",
                    )}
                  >
                    {type.detail}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-black/25 p-5">
              <h2 className="text-lg font-semibold text-white">Unachopata</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 text-sm text-zinc-300">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-zinc-950">
                      ✓
                    </span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">Partner application</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Tutumie taarifa zako. Ukisha-submit, unaweza pia ku-create account ya partner.
                </p>
              </div>
              <Link
                href={`/signup?role=${partnerType}${email ? `&email=${encodeURIComponent(email)}` : ""}${displayName ? `&fullName=${encodeURIComponent(displayName)}` : ""}${phone ? `&phone=${encodeURIComponent(phone)}` : ""}`}
                className="rounded-full border border-white/[0.1] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.06]"
              >
                Create account
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <label className="block">
                <span className="text-sm font-semibold text-zinc-200">
                  {partnerType === "restaurant" ? "Restaurant name" : "Full name"}
                </span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  required
                  placeholder={partnerType === "restaurant" ? "e.g. Pizza Time" : "e.g. Juma Ally"}
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-zinc-200">Phone number</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    placeholder="255712345678"
                    className="mt-2 min-h-12 w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-zinc-200">Email address</span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 min-h-12 w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-zinc-200">City</span>
                  <select
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-white outline-none focus:border-orange-400/50"
                  >
                    <option>Mwanza</option>
                    <option>Dar es Salaam</option>
                    <option>Arusha</option>
                    <option>Dodoma</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-zinc-200">
                    {partnerType === "restaurant" ? "Cuisine type" : "Vehicle type"}
                  </span>
                  <select
                    value={specialty}
                    onChange={(event) => setSpecialty(event.target.value)}
                    required
                    className="mt-2 min-h-12 w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-white outline-none focus:border-orange-400/50"
                  >
                    <option value="">Choose one</option>
                    {(partnerType === "restaurant" ? cuisineOptions : vehicleOptions).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    {partnerType === "restaurant"
                      ? "Chagua aina kuu ya chakula unachouza. Hii inasaidia customer akupate kwa search na category."
                      : "Chagua aina ya usafiri utakayotumia kwa delivery."}
                  </p>
                </label>
              </div>

              {specialty === "Other" && (
                <label className="block">
                  <span className="text-sm font-semibold text-zinc-200">
                    {partnerType === "restaurant" ? "Describe your cuisine" : "Describe your vehicle"}
                  </span>
                  <input
                    value={customSpecialty}
                    onChange={(event) => setCustomSpecialty(event.target.value)}
                    required
                    placeholder={partnerType === "restaurant" ? "e.g. Sea food, BBQ, Swahili breakfast" : "e.g. Tricycle"}
                    className="mt-2 min-h-12 w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                  />
                </label>
              )}

              {partnerType === "restaurant" && (
                <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
                  <h3 className="text-base font-semibold text-white">Restaurant location</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    Weka area/address ya mgahawa wako. Hii itasaidia customer na rider kufungua location kwenye Google Maps.
                  </p>

                  <label className="mt-4 block">
                    <span className="text-sm font-semibold text-zinc-200">Address / area</span>
                    <input
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      required
                      placeholder="e.g. Rock City Mall, Mwanza"
                      className="mt-2 min-h-12 w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="text-sm font-semibold text-zinc-200">Google Maps link</span>
                    <input
                      value={googleMapsUrl}
                      onChange={(event) => setGoogleMapsUrl(event.target.value)}
                      type="url"
                      placeholder="Optional: paste Google Maps share link"
                      className="mt-2 min-h-12 w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                    />
                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      Ukiacha wazi, tutatengeneza Google Maps link kutoka address na city uliyochagua.
                    </p>
                  </label>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827]">
                    <div className="relative h-64">
                      <iframe
                        title="Restaurant location map"
                        src={mapEmbedUrl}
                        className="absolute inset-0 h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white px-3 py-2 text-xs font-semibold text-zinc-950 shadow-lg shadow-black/20 transition hover:bg-zinc-100"
                      >
                        Open in Maps
                      </a>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-zinc-200">Location preview</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {address ? `${address}, ${city}` : "Mwanza, Tanzania"}
                          </p>
                        </div>
                        <a
                          href={mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-9 items-center justify-center rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-orange-400"
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <label className="block">
                <span className="text-sm font-semibold text-zinc-200">Notes</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={5}
                  placeholder="Tuambie kuhusu biashara yako au availability yako."
                  className="mt-2 w-full resize-none rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                />
              </label>

              {submitted && (
                <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  Application imepokelewa. Hatua inayofuata ni ku-create account au kusubiri timu ikupigie.
                </p>
              )}

              <button
                type="submit"
                className="min-h-12 rounded-xl bg-orange-500 px-5 text-sm font-bold text-zinc-950 transition hover:bg-orange-400"
              >
                Submit application
              </button>
            </form>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            ["1", "Apply", "Tuma taarifa zako kupitia form."],
            ["2", "Verify", "Timu inahakiki biashara au rider details."],
            ["3", "Go live", "Account yako inawezeshwa kupokea orders."],
          ].map(([step, title, detail]) => (
            <div key={step} className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-5">
              <p className="text-sm font-bold text-orange-300">Step {step}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
