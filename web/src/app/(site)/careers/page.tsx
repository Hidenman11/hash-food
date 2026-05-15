export default function CareersPage() {
  return (
    <section className="min-h-screen bg-[#07090d] text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c1119] p-10 shadow-xl shadow-black/20">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Karibu kwa Careers</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Uwezekano wa kujiunga na timu ya HASH FOOD
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Tunatafuta watu wenye shauku, ubunifu, na ari ya kubadilisha namna watu wanavyopata chakula.
            Jiunge ili kushirikiana na watu wenye dhamira ya kujenga huduma bora za uwasilishaji nchini Tanzania.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { title: "Teknolojia", description: "Maendeleo ya bidhaa, UX, na mifumo ya malipo salama." },
              { title: "Uendeshaji", description: "Menejimenti wa ugavi, huduma kwa wateja, na uhasibu." },
              { title: "Usafirishaji", description: "Riders wa kipekee wa kukuletea chakula kwa haraka.", },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-orange-500/10 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">Jinsi ya kuomba</p>
            <p className="mt-3 text-sm leading-7 text-zinc-200">
              Tuma maelezo yako kwa barua pepe au kupitia fomu ya mawasiliano. Tuta wasiliana nawe ndani ya siku chache.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="mailto:careers@hashfood.co.tz" className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15">
                Tuma CV yako
              </a>
              <a href="#" className="inline-flex items-center justify-center rounded-2xl border border-white/[0.12] px-6 py-3 text-sm font-semibold text-zinc-200 hover:border-orange-400 hover:text-orange-300">
                Angalia nafasi zilizopo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
