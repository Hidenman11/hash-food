export default function PressPage() {
  return (
    <section className="min-h-screen bg-[#07090d] text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c1119] p-10 shadow-xl shadow-black/20">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Habari</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Habari na taarifa za HASH FOOD
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Pata taarifa za vyombo vya habari, usajili wa kampuni, na matukio ya hivi karibuni kuhusu huduma yetu ya uwasilishaji chakula.
          </p>

          <div className="mt-12 space-y-6">
            {[
              { label: "Taarifa kwa vyombo vya habari", detail: "Wasiliana nasi kwa maswali ya vyombo vya habari na maombi ya interviews." },
              { label: "Matangazo ya kampuni", detail: "Soma kuhusu maendeleo yetu, ushirikiano na wafadhili, na mipango ya ukuaji." },
              { label: "Taarifa za usalama", detail: "Tupatie habari kuhusu athari za usalama wa ugavi, mifumo ya malipo, na huduma kwa wateja." },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-xl font-semibold text-white">{item.label}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-white/5 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">Wasiliana nasi</p>
            <p className="mt-3 text-sm leading-7 text-zinc-200">
              Kwa maombi ya habari, tafadhali tuma barua pepe kwa press@hashfood.co.tz au tupigie kwa namba yetu ya mawasiliano.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
