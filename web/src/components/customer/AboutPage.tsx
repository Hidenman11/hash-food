"use client";

import Link from "next/link";

const aboutParagraphs = [
  "HASH FOOD ni jukwaa la kisasa la kuagiza chakula linalounganisha watu, migahawa, na wasafirishaji kwa njia rahisi, ya haraka, na ya kuaminika. Tunajenga mfumo unaoendana na maisha ya leo ambapo muda ni muhimu, na huduma bora siyo anasa bali ni hitaji.",
  "Tunawawezesha wateja kupata chakula wanachokipenda kutoka kwa migahawa bora iliyo karibu nao bila usumbufu wa simu nyingi au kuchelewa kwa huduma. Kupitia teknolojia yetu, unaweza kuona menu, kulinganisha bei, kufuatilia oda yako moja kwa moja, na kupokea huduma kwa uwazi na uhakika.",
  "Kwa upande wa migahawa, HASH FOOD siyo tu sehemu ya kupokea oda ni jukwaa la kukuza biashara. Tunawapa uwezo wa kufikia wateja wengi zaidi, kusimamia oda kwa ufanisi, na kuongeza mapato bila gharama kubwa za miundombinu. Kwa riders, tunaunda mfumo unaowapa kazi zilizo wazi, ratiba rahisi, na kipato kinachoeleweka.",
  "Maono yetu ni kuwa mfumo unaoongoza Tanzania katika huduma za food delivery kwa kuzingatia ubora, kasi, na uzoefu wa mtumiaji. Tunataka kubadilisha namna watu wanavyoagiza na kupokea chakula kutoka kwenye changamoto hadi kwenye urahisi wa kiwango cha juu.",
  "HASH FOOD siyo tu huduma ya delivery. Ni suluhisho linaloleta pamoja teknolojia, biashara, na maisha ya kila siku ili kufanya kila oda iwe rahisi, haraka, na yenye thamani zaidi kwa kila mtumiaji.",
];

const pillars = [
  { title: "Wateja", detail: "Menu, bei, oda, na tracking vinaonekana kwa uwazi sehemu moja." },
  { title: "Migahawa", detail: "Biashara zinapata oda zaidi na kusimamia huduma kwa ufanisi." },
  { title: "Riders", detail: "Kazi zinaonekana wazi, ratiba ni rahisi, na kipato kinaeleweka." },
];

export function AboutPage() {
  return (
    <section className="min-h-screen bg-[#07090d] text-zinc-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
              Kuhusu HASH FOOD
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Teknolojia, chakula, na huduma bora kwa maisha ya kila siku.
            </h1>
            <p className="mt-5 text-sm leading-6 text-zinc-400">
              Tunajenga mfumo wa food delivery unaowahudumia wateja, migahawa, na wasafirishaji kwa
              kasi, uwazi, na uhakika.
            </p>
            <Link
              href="/restaurants"
              className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-orange-500 px-6 text-sm font-bold text-zinc-950 transition hover:bg-orange-400"
            >
              Angalia Migahawa
            </Link>
          </div>

          <article className="rounded-2xl border border-white/[0.08] bg-[#0c1119] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-white">Kuhusu HASH FOOD</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-zinc-300">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                  <h3 className="font-semibold text-orange-300">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{pillar.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
