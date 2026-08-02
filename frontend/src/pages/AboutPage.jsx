import React from "react";
import { VALUES, FOUNDATION, OPERATING_MODEL, TEAM } from "../mock";
import { CtaBanner } from "../components/Sections";
import { CheckCircle2, Diamond } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="pt-32 md:pt-40">
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> WHO WE ARE
        </div>
        <h1 className="mt-4 font-orbitron font-black text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
          Built for founders who need
          <br />
          <span className="italic font-normal text-black/60">growth to feel less random.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm md:text-base text-black/65 leading-relaxed">
          BUGZ X exists to turn fragmented marketing, scattered tools, and slow manual follow-up into
          connected growth systems.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { k: "Vision", v: "growth with structure" },
            { k: "Approach", v: "data + creative execution" },
            { k: "Model", v: "long-term partner mindset" },
          ].map((c) => (
            <div key={c.k} className="rounded-2xl border border-black/12 p-5">
              <p className="text-[10px] tracking-[0.25em] text-black/50 font-semibold">{c.k.toUpperCase()}</p>
              <p className="mt-2 font-orbitron font-bold">{c.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Foundation */}
      <section className="border-y border-black/10 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-20">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
            <span className="h-px w-8 bg-black" /> OUR FOUNDATION
          </div>
          <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-tight tracking-tight max-w-4xl">
            What makes BUGZ X <span className="italic font-normal text-black/60">different in practice</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FOUNDATION.map((f) => (
              <div key={f.step} className="rounded-2xl border border-black/12 bg-white p-6">
                <span className="text-[10px] tracking-[0.25em] text-black/40 font-bold">{f.step}</span>
                <p className="mt-4 font-orbitron font-bold text-lg">{f.title}</p>
                <p className="mt-3 text-[13px] text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-black/12 bg-white p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map((v) => (
                <div key={v.title} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-orbitron font-bold text-sm md:text-base">{v.title}</p>
                    <p className="text-[13px] text-black/60 mt-1">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operating model */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> OPERATING MODEL
        </div>
        <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-tight max-w-4xl">
          How we collaborate <span className="italic font-normal text-black/60">with your internal team</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm md:text-base text-black/65">
          You get direct communication, clear task ownership, and one shared execution board for speed and visibility.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {OPERATING_MODEL.map((m) => (
            <div key={m.letter} className="rounded-2xl border border-black/12 p-6 hover:border-black transition-colors">
              <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-orbitron font-black">{m.letter}</div>
              <p className="mt-5 font-orbitron font-bold text-lg">{m.title}</p>
              <p className="mt-2 text-[13px] text-black/60 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#fafafa] border-y border-black/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-20">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
            <span className="h-px w-8 bg-black" /> TEAM
          </div>
          <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-tight max-w-3xl">
            The people behind <span className="italic font-normal text-black/60">your growth system</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {TEAM.map((t) => (
              <div key={t.name} className="rounded-2xl border border-black/12 bg-white p-6 md:p-8">
                <p className="text-[10px] tracking-[0.25em] text-black/50 font-semibold">{t.role.toUpperCase()}</p>
                <p className="mt-3 font-orbitron font-black text-2xl md:text-3xl">{t.name}</p>
                <p className="mt-3 text-sm text-black/60 leading-relaxed">{t.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1 text-[11px] font-semibold">
                      <Diamond className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Need a growth partner instead of random freelancers?"
        text="Tell us your monthly target and current bottleneck. We will map the next 90-day execution path."
        cta="BOOK A CALL"
        to="/contact"
      />
    </main>
  );
}
