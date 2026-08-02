import React from "react";
import Hero from "../components/Hero";
import {
  StatsBar,
  ServicesGrid,
  ProcessSection,
  CtaBanner,
  MarqueeStrip,
} from "../components/Sections";
import { TESTIMONIALS, CLIENTS } from "../mock";
import { Quote, Star } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <MarqueeStrip />
      <StatsBar />
      <ServicesGrid limit={3} />

      <CtaBanner
        title="Need a custom package?"
        text="Share your monthly target and team structure. We will recommend the right service mix."
        cta="EXPLORE SERVICES"
        to="/services"
      />

      <ProcessSection />

      <PartnersSection />
      <TestimonialsSection />

      <CtaBanner
        title="Want this growth system for your business?"
        text="Tell us your niche, current challenge, and monthly target. We will propose a practical roadmap."
        cta="GET PROPOSAL"
        to="/contact"
      />
    </main>
  );
}

function PartnersSection() {
  return (
    <section className="py-16 md:py-24 border-t border-black/10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" />
          TRUSTED PARTNERS
        </div>
        <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-3xl">
          Teams that scale with{" "}
          <span className="italic font-normal text-black/60">BUGZ X</span>
        </h2>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-black/10 border border-black/10 rounded-2xl overflow-hidden">
          {CLIENTS.map((p) => (
            <div
              key={p.name}
              className="bg-white p-6 md:p-8 flex flex-col items-start justify-between min-h-[110px] hover:bg-black hover:text-white transition-colors group"
            >
              <span className="font-orbitron font-black text-sm md:text-base leading-tight">{p.name}</span>
              <span className="text-[10px] tracking-[0.15em] text-black/50 group-hover:text-white/70 font-bold mt-3">
                {p.industry}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-[#fafafa] border-y border-black/10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" />
          CLIENT VOICES
        </div>
        <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-3xl">
          Results our clients{" "}
          <span className="italic font-normal text-black/60">feel and measure</span>
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-black/12 p-6 md:p-7 hover:border-black transition-colors"
            >
              <Quote className="h-6 w-6 text-black/80" />
              <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-black/80">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-3.5 w-3.5 fill-black stroke-black" />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-black/10">
                <p className="font-orbitron font-bold text-sm">{t.name}</p>
                <p className="text-[11px] tracking-[0.15em] text-black/50 mt-1 font-semibold">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
