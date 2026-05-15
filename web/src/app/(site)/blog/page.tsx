export default function BlogPage() {
  return (
    <section className="min-h-screen bg-[#07090d] text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c1119] p-10 shadow-xl shadow-black/20">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Blog</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Habari, vidokezo, na mafunzo ya HASH FOOD
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Karibu kwenye blogu yetu, ambapo tunashiriki hadithi za wateja, vidokezo vya chakula, na habari za kitaalamu za usafirishaji.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Jinsi ya kuchagua chakula chenye afya kwa haraka",
                excerpt: "Pata vidokezo vya haraka vya kubaki na lishe, hata unapokuwa unaagiza kwa dakika za mwisho.",
              },
              {
                title: "Teknolojia nyuma ya ufuatiliaji wa oda",
                excerpt: "Gundua jinsi tunavyotumia ramani za GPS na usafirishaji wa wakati halisi kufikisha chakula chako chenye moto.",
              },
            ].map((post) => (
              <article key={post.title} className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-orange-400/30">
                <h2 className="text-xl font-semibold text-white">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{post.excerpt}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-orange-500/10 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">Endelea kufuatilia</p>
            <p className="mt-3 text-sm leading-7 text-zinc-200">
              Tutachapisha makala mpya kila mara. Angalia hapa tena kwa mwongozo, matangazo, na yaliyomo kuhusu chakula na usafirishaji.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
