import React from "react";
import * as Icons from "lucide-react";
import { STATS, SERVICES, PROCESS } from "../mock";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function StatsBar() {
  return (
    <section className="relative border-y border-black/10 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-black/10">
        {STATS.map((s) => {
          const Icon = Icons[s.icon];
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 py-6 md:py-8 px-4 md:px-6 first:border-l-0"
            >
              <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-orbitron font-black text-2xl md:text-3xl leading-none">
                  {s.value}
                </div>
                <div className="text-[10px] md:text-[11px] tracking-[0.2em] text-black/60 mt-1.5 font-semibold">
                  {s.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ServicesGrid({ limit }) {
  const list = limit ? SERVICES.slice(0, limit) : SERVICES;
  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" />
          CORE SERVICES
        </div>

        <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-4xl">
          Everything your growth engine{" "}
          <span className="italic font-normal text-black/60">needs to perform</span>
        </h2>

        <p className="mt-5 max-w-2xl text-sm md:text-base text-black/60">
          You get strategic planning, creative execution, and measurable optimization from one focused team.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {list.map((s, i) => {
            const Icon = Icons[s.icon] || Icons.Circle;
            return (
              <div
                key={s.title}
                className="group relative rounded-2xl border border-black/12 bg-white p-6 md:p-7 hover:border-black transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="h-11 w-11 rounded-xl bg-black text-white flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] tracking-[0.2em] text-black/40 font-bold">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-6 font-orbitron font-bold text-lg md:text-xl tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13px] md:text-sm text-black/60 leading-relaxed">
                  {s.desc}
                </p>

                <ul className="mt-5 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px] text-black/75">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
                  <span className="text-[11px] tracking-[0.2em] text-black/50 font-bold">EXPLORE</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="relative py-20 md:py-28 bg-[#fafafa] border-y border-black/10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" />
          HOW WE WORK
        </div>

        <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-4xl">
          Simple process,{" "}
          <span className="italic font-normal text-black/60">high-accountability delivery</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {PROCESS.map((p, i) => (
            <div
              key={p.step}
              className="relative rounded-2xl bg-white border border-black/12 p-6 md:p-8 hover:border-black transition-colors"
            >
              <div className="absolute -top-4 left-6 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-orbitron font-black text-sm">
                {i + 1}
              </div>
              <h3 className="mt-4 font-orbitron font-bold text-lg md:text-xl">{p.title}</h3>
              <p className="mt-3 text-[13px] md:text-sm text-black/60 leading-relaxed">{p.desc}</p>
              <div className="mt-6 text-[10px] tracking-[0.25em] text-black/40 font-bold">
                STEP {p.step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBanner({ title, text, cta, to }) {
  return (
    <section className="relative py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="rounded-3xl border border-black/15 bg-white p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <div className="max-w-2xl">
            <p className="font-orbitron font-bold text-xl md:text-2xl leading-tight">{title}</p>
            <p className="mt-2 text-sm text-black/60">{text}</p>
          </div>
          <Link
            to={to}
            className="group inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3.5 text-[12px] md:text-[13px] font-bold tracking-[0.15em] hover:bg-black/85 transition-colors whitespace-nowrap"
          >
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function MarqueeStrip() {
  const items = [
    "AUTOMATION",
    "STRATEGY",
    "MARKETING",
    "BRANDING",
    "WEB DEVELOPMENT",
    "CONTENT",
    "ANALYTICS",
    "CONVERSION",
  ];
  const full = [...items, ...items];
  return (
    <div className="border-y border-black/10 bg-white overflow-hidden ticker-fade">
      <div className="animate-marquee flex whitespace-nowrap py-5">
        {full.map((t, i) => (
          <div key={i} className="flex items-center gap-6 px-6">
            <span className="font-orbitron font-black text-2xl md:text-3xl tracking-tight">
              {t}
            </span>
            <span className="h-2 w-2 rotate-45 bg-black" />
          </div>
        ))}
      </div>
    </div>
  );
}
