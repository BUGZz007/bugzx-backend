import React, { useState } from "react";
import { SERVICES, PACKAGES, PROCESS, FAQS } from "../mock";
import { CtaBanner } from "../components/Sections";
import * as Icons from "lucide-react";
import { ChevronDown, ArrowUpRight } from "lucide-react";

export default function ServicesPage() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <main className="pt-32 md:pt-40">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-14">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> SERVICE PORTFOLIO
        </div>
        <h1 className="mt-4 font-orbitron font-black text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight max-w-5xl">
          Services designed for consistent
          <br />
          <span className="italic font-normal text-black/60">lead flow and stronger conversion.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm md:text-base text-black/65 leading-relaxed">
          From strategy to execution, each service line is built to solve specific growth bottlenecks while
          fitting your current team bandwidth.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { k: "Modular", v: "choose one service or full stack support" },
            { k: "Transparent", v: "clear scope and milestone map" },
            { k: "Measurable", v: "KPI-focused reporting and optimization" },
          ].map((c) => (
            <div key={c.k} className="rounded-2xl border border-black/12 p-5">
              <p className="text-[10px] tracking-[0.25em] text-black/50 font-semibold">{c.k.toUpperCase()}</p>
              <p className="mt-2 text-sm text-black/75">{c.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services grid full */}
      <section className="relative py-16 md:py-24 border-y border-black/10 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
            <span className="h-px w-8 bg-black" /> WHAT WE DELIVER
          </div>
          <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-[1.05] max-w-4xl">
            Execution blocks you can <span className="italic font-normal text-black/60">mix and scale</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s, i) => {
              const Icon = Icons[s.icon] || Icons.Circle;
              return (
                <div key={s.title} className="group rounded-2xl border border-black/12 bg-white p-6 hover:border-black hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all">
                  <div className="flex items-start justify-between">
                    <div className="h-11 w-11 rounded-xl bg-black text-white flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] tracking-[0.2em] text-black/40 font-bold">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-5 font-orbitron font-bold text-base md:text-lg tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-[13px] text-black/60 leading-relaxed">{s.desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[12px] text-black/70">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-black shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Package guide */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> PACKAGE GUIDE
        </div>
        <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-tight max-w-4xl">
          Pick the operating model <span className="italic font-normal text-black/60">that matches your stage</span>
        </h2>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-black/12">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-black text-white text-[11px] tracking-[0.2em] font-bold">
              <tr>
                <th className="px-5 py-4">PLAN</th>
                <th className="px-5 py-4">BEST FOR</th>
                <th className="px-5 py-4">INCLUDES</th>
                <th className="px-5 py-4">TIMELINE</th>
                <th className="px-5 py-4">PRIORITY</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {PACKAGES.map((p, i) => (
                <tr key={p.name} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                  <td className="px-5 py-5 font-orbitron font-bold">{p.name}</td>
                  <td className="px-5 py-5 text-black/70">{p.best}</td>
                  <td className="px-5 py-5 text-black/70">{p.includes}</td>
                  <td className="px-5 py-5 text-black/70">{p.timeline}</td>
                  <td className="px-5 py-5">
                    <span className="inline-flex items-center rounded-full bg-black text-white text-[10px] tracking-[0.2em] font-bold px-3 py-1">
                      {p.priority.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#fafafa] border-y border-black/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-20">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
            <span className="h-px w-8 bg-black" /> PROCESS
          </div>
          <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-tight max-w-4xl">
            Three steps from scattered activity <span className="italic font-normal text-black/60">to scalable systems.</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROCESS.map((p, i) => (
              <div key={p.step} className="relative rounded-2xl bg-white border border-black/12 p-6">
                <div className="absolute -top-4 left-6 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-orbitron font-black text-sm">{i + 1}</div>
                <h3 className="mt-4 font-orbitron font-bold text-lg">{p.title}</h3>
                <p className="mt-3 text-sm text-black/60 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> QUESTIONS
        </div>
        <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-tight max-w-4xl">
          Common service &amp; <span className="italic font-normal text-black/60">execution clarifications</span>
        </h2>

        <div className="mt-8 grid gap-3">
          {FAQS.map((f, i) => {
            const open = openIdx === i;
            return (
              <button key={i} onClick={() => setOpenIdx(open ? -1 : i)} className="text-left rounded-2xl border border-black/12 p-5 md:p-6 bg-white hover:border-black transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-orbitron font-bold text-base md:text-lg">{f.q}</p>
                  <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
                </div>
                {open && <p className="mt-3 text-sm text-black/65 leading-relaxed">{f.a}</p>}
              </button>
            );
          })}
        </div>
      </section>

      <CtaBanner
        title="Ready to build your growth system?"
        text="Share your goals, monthly target, and team size. We'll map the best service mix for faster ROI."
        cta="START YOUR GROWTH SPRINT"
        to="/contact"
      />
    </main>
  );
}
