"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { cn } from "@/lib/cn";

const whatsappNumber = "255615762112";
const callNumber = "+255718114331";
const email = "hashprojects26@gmail.com";

const faqs = [
  {
    category: "Orders",
    question: "Nawezaje kuagiza chakula?",
    answer:
      "Fungua Restaurants au Customer page, chagua chakula, ongeza kwenye cart, weka address, chagua payment method, kisha checkout.",
  },
  {
    category: "Payment",
    question: "Malipo yanafanyikaje?",
    answer:
      "Unaweza kuchagua M-Pesa, Airtel Money, Tigo Pesa, au Cash. Kwa mobile money utaweka namba ya simu na kupata payment reference.",
  },
  {
    category: "Tracking",
    question: "Nafuatiliaje order yangu?",
    answer:
      "Baada ya checkout, nenda Track Order. Order ID, status, rider, malipo, na timeline vitaonekana hapo.",
  },
  {
    category: "Delivery",
    question: "Nifanye nini order ikichelewa?",
    answer:
      "Angalia Track Order kwanza. Ikiwa bado haieleweki, tumia WhatsApp au Call kwenye Help Center ukiwa na order ID yako.",
  },
  {
    category: "Refunds",
    question: "Naweza kufuta order au kupata refund?",
    answer:
      "Order inaweza kufutwa kabla restaurant haijaanza kuandaa chakula. Kwa refund, tuma order ID na sababu kupitia WhatsApp au Email.",
  },
  {
    category: "Partners",
    question: "Restaurant au rider anajiungaje?",
    answer:
      "Fungua Become a Partner, chagua aina ya partner, jaza taarifa, kisha timu ya HASH FOOD itafanya verification.",
  },
];

const quickLinks = [
  { label: "Track order", href: "/track" },
  { label: "Browse restaurants", href: "/restaurants" },
  { label: "Open cart", href: "/cart" },
  { label: "Become partner", href: "/partner" },
] as const;

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 20h.01" strokeLinecap="round" />
      <path d="M9.3 9a3 3 0 1 1 5.2 2c-.9.8-1.7 1.4-2.1 2.6-.1.3-.1.7-.1 1.1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function HelpCenter() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [issue, setIssue] = useState("");
  const [orderId, setOrderId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return faqs;
    return faqs.filter((faq) =>
      `${faq.category} ${faq.question} ${faq.answer}`.toLowerCase().includes(search),
    );
  }, [query]);

  const whatsappText = encodeURIComponent(
    `Habari HASH FOOD, nahitaji msaada${orderId ? ` kwa order ${orderId}` : ""}${issue ? `: ${issue}` : "."}`,
  );

  function submitIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <button
        id="help-center"
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[80] flex min-h-14 items-center gap-3 rounded-full bg-orange-500 px-5 text-sm font-black text-zinc-950 shadow-[0_20px_60px_rgba(249,115,22,0.38)] transition hover:-translate-y-0.5 hover:bg-orange-400"
        aria-label="Open Help Center"
      >
        <HelpIcon className="h-5 w-5" />
        Help
      </button>

      <button
        type="button"
        aria-label="Close Help Center"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[81] bg-black/60 backdrop-blur-sm transition-opacity",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[82] flex w-full max-w-[28rem] flex-col border-l border-white/[0.08] bg-[#080b10] shadow-2xl shadow-black/80 transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="border-b border-white/[0.08] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">HASH FOOD</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Help Center</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">Pata msaada wa order, malipo, delivery, au partnership.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
              aria-label="Close"
            >
              x
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-500 px-3 py-3 text-center text-xs font-black text-zinc-950"
            >
              WhatsApp
            </a>
            <a href={`tel:${callNumber}`} className="rounded-xl bg-white px-3 py-3 text-center text-xs font-black text-zinc-950">
              Call
            </a>
            <a href={`mailto:${email}`} className="rounded-xl border border-white/[0.1] px-3 py-3 text-center text-xs font-black text-white">
              Email
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-orange-400/40 hover:bg-white/[0.07]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-zinc-300">Search help</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search payment, order, delivery..."
              className="mt-2 min-h-12 w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
            />
          </label>

          <div className="mt-5 space-y-3">
            {filteredFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-white/[0.08] bg-[#0c1119] p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                  <span className="mr-2 text-orange-300">{faq.category}</span>
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{faq.answer}</p>
              </details>
            ))}
            {!filteredFaqs.length ? (
              <div className="rounded-2xl border border-dashed border-white/[0.12] p-5 text-center text-sm text-zinc-500">
                Hakuna jibu lililopatikana. Tuma issue yako hapa chini.
              </div>
            ) : null}
          </div>

          <form onSubmit={submitIssue} className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0c1119] p-4">
            <h3 className="font-semibold text-white">Report issue</h3>
            <label className="mt-4 block">
              <span className="text-sm text-zinc-400">Order ID optional</span>
              <input
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="HF-12345678"
                className="mt-2 min-h-11 w-full rounded-xl border border-white/[0.08] bg-black/25 px-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm text-zinc-400">Tatizo lako</span>
              <textarea
                value={issue}
                onChange={(event) => setIssue(event.target.value)}
                rows={4}
                placeholder="Eleza unachohitaji tusaidie..."
                className="mt-2 w-full resize-none rounded-xl border border-white/[0.08] bg-black/25 px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </label>
            <button
              type="submit"
              className="mt-4 min-h-11 w-full rounded-xl bg-orange-500 px-4 text-sm font-black text-zinc-950 transition hover:bg-orange-400"
            >
              Save issue
            </button>
            {submitted ? (
              <p className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                Issue imehifadhiwa hapa. Tuma WhatsApp ili support ipokee mara moja.
              </p>
            ) : null}
          </form>
        </div>
      </aside>
    </>
  );
}
