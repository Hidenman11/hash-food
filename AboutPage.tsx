 "use client";
 
 import { cn } from "@/lib/cn";
 
 const features = [
   {
     title: "Uwasilishaji wa haraka",
     detail: "Oda yako inafika kwa wakati na uhakika wa hali ya juu ukiwa nyumbani au ofisini.",
     icon: (
       <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <path d="m13 2-2 10h9L7 22l2-10H1L13 2Z" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
     ),
   },
   {
     title: "Mfumo rafiki",
     detail: "Tumeunda teknolojia rahisi inayomfanya yeyote aweze kuagiza bila usumbufu.",
     icon: (
       <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <rect width="14" height="20" x="5" y="2" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
         <path d="M12 18h.01" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
     ),
   },
   {
     title: "Malipo salama",
     detail: "Mifumo yetu ya malipo ni salama na inakupa uhuru wa kulipia kwa njia unayopenda.",
     icon: (
       <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
     ),
   },
   {
     title: "Ushirikiano bora",
     detail: "Tunashirikiana na migahawa bora ya ndani ili kuhakikisha unapata ladha unayotaka.",
     icon: (
       <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
         <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
         <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
         <path d="M18 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
     ),
   },
 ];
 
 export function AboutPage() {
   return (
     <section className="min-h-screen bg-[#07090d] text-zinc-300">
       <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
         {/* Hero Header */}
         <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c1119] p-8 sm:p-12 lg:p-16">
           <div className="relative z-10 max-w-3xl">
             <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">
               Kuhusu HASH FOOD
             </p>
             <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
               Mapinduzi ya chakula <span className="text-orange-500">Tanzania.</span>
             </h1>
             <p className="mt-8 text-lg leading-8 text-zinc-400">
               HASH FOOD ni jukwaa la kisasa linalowaunganisha wateja, migahawa, na wasafirishaji 
               kupitia teknolojia yenye kasi, urahisi, na ufanisi wa hali ya juu.
             </p>
           </div>
           <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-[80px]" />
         </div>
 
         {/* Vision & Mission */}
         <div className="mt-12 grid gap-6 lg:grid-cols-2">
           <div className="rounded-3xl border border-white/[0.08] bg-[#0c1119] p-8 transition hover:border-white/20">
             <h2 className="text-xl font-bold text-white">Dira Yetu</h2>
             <p className="mt-4 leading-7 text-zinc-400">
               Kuwa jukwaa linaloongoza Afrika katika huduma za usambazaji wa chakula kwa kutumia 
               teknolojia ya kisasa na uzoefu bora wa mtumiaji.
             </p>
           </div>
           <div className="rounded-3xl border border-white/[0.08] bg-[#0c1119] p-8 transition hover:border-white/20">
             <h2 className="text-xl font-bold text-white">Dhima Yetu</h2>
             <ul className="mt-4 space-y-4">
               {[
                 "Wateja kupata huduma bora ya chakula kwa urahisi",
                 "Migahawa kukuza biashara zao kidigitali",
                 "Vijana kupata fursa za ajira kupitia uchumi wa kidigitali",
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm">
                   <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-zinc-950">
                     ✓
                   </span>
                   {item}
                 </li>
               ))}
             </ul>
           </div>
         </div>
 
         {/* Features Grid */}
         <div className="mt-24">
           <div className="text-center">
             <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
               Kwanini HASH FOOD?
             </h2>
             <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
               Tunaamini kuwa kuagiza chakula kunapaswa kuwa rahisi, haraka, na bila usumbufu.
             </p>
           </div>
 
           <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
             {features.map((feature, i) => (
               <div key={i} className="group relative">
                 <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-orange-500 ring-1 ring-white/10 transition group-hover:bg-orange-500 group-hover:text-zinc-950 group-hover:ring-orange-500">
                   {feature.icon}
                 </div>
                 <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                 <p className="mt-2 text-sm leading-6 text-zinc-500">{feature.detail}</p>
               </div>
             ))}
           </div>
         </div>
 
         {/* Closing Statement */}
         <div className="mt-24 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 p-8 text-zinc-950 sm:p-12 lg:p-16">
           <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
             <div className="max-w-2xl">
               <p className="text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">
                 HASH FOOD si huduma ya kawaida ya delivery—ni jukwaa linalounganisha teknolojia na maisha.
               </p>
               <p className="mt-6 font-black uppercase tracking-[0.2em]">
                 Chakula chako, kwa kasi ya kisasa.
               </p>
             </div>
             <button className="h-14 shrink-0 rounded-2xl bg-zinc-950 px-8 text-sm font-bold text-white transition hover:bg-zinc-900 active:scale-95">
               Agiza Sasa
             </button>
           </div>
         </div>
       </div>
     </section>
   );
 }