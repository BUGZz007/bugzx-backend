import React from "react";
import { CLIENTS, TESTIMONIALS } from "../mock";
import { CtaBanner } from "../components/Sections";
import { TrendingUp, Users, Zap, LineChart, Star, MapPin, ArrowUpRight } from "lucide-react";

export default function PartnerPage() {
  const results = [
    { icon: TrendingUp, kpi: "+68%", label: "Qualified lead flow after funnel and campaign restructuring" },
    { icon: LineChart, kpi: "2.4x", label: "Pipeline visibility across CRM, retargeting, and conversion follow-up" },
    { icon: Zap, kpi: "-72%", label: "Faster first response through intake automation and routing rules" },
    { icon: Users, kpi: "150+", label: "Project deliverables across 4 global regions" },
  ];

  return (
    <main className="pt-32 md:pt-40">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-14">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> PARTNER &amp; RESULTS
        </div>
        <h1 className="mt-4 font-orbitron font-black text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
          Proof is clearer when every metric
          <br />
          <span className="not-italic font-normal text-black/60">connects to the system behind it.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm md:text-base text-black/65 leading-relaxed">
          BUGZ X brings acquisition, automation, analytics, and conversion decisions into one visible operating rhythm.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {CLIENTS.map((c) => (
            <span key={c.name} className="inline-flex items-center rounded-full border border-black/15 bg-white px-3 py-1.5 text-[11px] font-semibold">
              {c.name}
            </span>
          ))}
        </div>
      </section>

      {/* KPI stats */}
      <section className="border-y border-black/10 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((r) => (
            <div key={r.label} className="rounded-2xl bg-white border border-black/12 p-6">
              <r.icon className="h-5 w-5" />
              <p className="mt-6 font-orbitron font-black text-3xl md:text-4xl leading-none">{r.kpi}</p>
              <p className="mt-2 text-[11px] tracking-[0.12em] text-black/55 font-semibold leading-snug">{r.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard mock card */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="rounded-3xl border border-black/12 bg-white p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-center">
          <div className="md:col-span-1">
            <p className="text-[10px] tracking-[0.25em] text-black/50 font-semibold">EXECUTIVE DASHBOARD</p>
            <p className="mt-2 font-orbitron font-black text-xl md:text-2xl">Q3 Growth View</p>
          </div>
          {[
            { k: "Lead source", v: "Google" },
            { k: "Best offer", v: "Audit call" },
            { k: "Next move", v: "Retarget" },
          ].map((c) => (
            <div key={c.k} className="rounded-2xl border border-black/12 p-4">
              <p className="text-[10px] tracking-[0.25em] text-black/50 font-semibold">{c.k.toUpperCase()}</p>
              <p className="mt-2 font-orbitron font-bold text-lg">{c.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Client Portfolio */}
      <section className="bg-[#fafafa] border-y border-black/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-20">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
            <span className="h-px w-8 bg-black" /> CLIENT PORTFOLIO
          </div>
          <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-tight max-w-3xl">
            Global partnerships driving <span className="not-italic font-normal text-black/60">real execution</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLIENTS.map((c) => (
              <div key={c.name} className="rounded-2xl bg-white border border-black/12 p-6 md:p-7 hover:border-black transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-orbitron font-black text-lg md:text-xl leading-tight">{c.name}</p>
                    <p className="mt-1 text-[12px] text-black/60 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> {c.country} • {c.industry}
                    </p>
                  </div>
                  <span className="text-lg" aria-hidden>{c.flag}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-black/10">
                  <p className="text-[10px] tracking-[0.25em] text-black/45 font-semibold">SERVICES PROVIDED</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.services.map((s) => (
                      <span key={s} className="inline-flex items-center rounded-full bg-black/[0.04] border border-black/10 px-2.5 py-1 text-[11px] font-semibold text-black/75">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global footprint */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> GLOBAL FOOTPRINT
        </div>
        <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-tight max-w-3xl">
          Trusted by businesses <span className="not-italic font-normal text-black/60">worldwide</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm md:text-base text-black/65">
          Delivering innovative technology, branding, ERP, travel tech, and digital transformation solutions across India, Qatar, Guyana, and the Caribbean.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { v: "150+", l: "Project Deliverables" },
            { v: "8+", l: "Trusted Business Partners" },
            { v: "4", l: "Global Regions" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-black/12 p-6">
              <p className="font-orbitron font-black text-4xl">{s.v}</p>
              <p className="text-[11px] tracking-[0.15em] text-black/55 font-semibold mt-2">{s.l.toUpperCase()}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-[11px] tracking-[0.2em] font-semibold text-black/60">TRUSTED ACROSS:</span>
          {["India", "Qatar", "Guyana", "Caribbean Islands"].map((r) => (
            <span key={r} className="rounded-full border border-black/15 px-3 py-1 text-[12px] font-semibold">{r}</span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#fafafa] border-y border-black/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-20">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
            <span className="h-px w-8 bg-black" /> CLIENT FEEDBACK
          </div>
          <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-tight max-w-3xl">
            What our partners <span className="not-italic font-normal text-black/60">say about BUGZ X</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl bg-white border border-black/12 p-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-3.5 w-3.5 fill-black stroke-black" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-black/80 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 pt-4 border-t border-black/10">
                  <p className="font-orbitron font-bold text-sm">{t.name}</p>
                  <p className="text-[11px] tracking-[0.12em] text-black/55 mt-1 font-semibold">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Want results like these for your business?"
        text="We take on a limited number of partners each quarter — secure yours early."
        cta="START A CONVERSATION"
        to="/contact"
      />
    </main>
  );
}
