import React from "react";
import { HERO_CHIPS } from "../mock";
import * as Icons from "lucide-react";
import { ArrowRight, ArrowUpRight, Sparkle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 pb-16 md:pb-24">
      <div className="absolute inset-0 grid-bg-dense pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-1.5 text-[10px] md:text-[11px] tracking-[0.2em] font-semibold">
              <Sparkle className="h-3.5 w-3.5" />
              AI-POWERED BUSINESS GROWTH &amp; AUTOMATION PARTNER
            </div>

            <h1 className="mt-6 font-orbitron font-black leading-[0.95] text-[32px] sm:text-[44px] md:text-[54px] lg:text-[58px] tracking-tight">
              BUILD A STRONG BRAND AND TURN TRAFFIC INTO{" "}
              <span className="relative inline-block">
                REAL SALES.
                <span className="absolute -bottom-1 left-0 h-[6px] w-full bg-black/90 -z-10" />
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm md:text-base text-black/65 leading-relaxed">
              BUGZ X designs practical growth systems for ambitious businesses. We combine strategy,
              marketing, content, automation, and conversion-first web experiences so your team grows
              with clarity.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-3 text-[11px] md:text-[13px] font-bold tracking-[0.15em] hover:bg-black/85 transition-colors">
                BOOK FREE CONSULTATION
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/partner" className="group inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-5 py-3 text-[11px] md:text-[13px] font-bold tracking-[0.15em] hover:border-black transition-colors">
                SEE CLIENT RESULTS
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[420px] sm:h-[500px] lg:h-[560px]">
            <OrbitDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}

function OrbitDiagram() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute h-[92%] aspect-square rounded-full border border-dashed border-black/20" />
      <div className="absolute h-[68%] aspect-square rounded-full border border-black/10" />
      <div className="absolute h-[40%] aspect-square rounded-full border border-black/10" />

      <div className="relative z-10 h-24 w-24 md:h-28 md:w-28 rounded-2xl border border-black/15 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex items-center justify-center">
        <span className="font-orbitron font-black text-4xl md:text-5xl">X</span>
      </div>

      {HERO_CHIPS.map((c, i) => {
        const angle = (i / HERO_CHIPS.length) * Math.PI * 2 - Math.PI / 2;
        const r = 46;
        const top = 50 + Math.sin(angle) * r;
        const left = 50 + Math.cos(angle) * r;
        const Icon = Icons[c.icon] || Icons.Circle;
        return (
          <div
            key={c.label}
            className="absolute animate-floaty z-20"
            style={{ top: `${top}%`, left: `${left}%`, transform: "translate(-50%, -50%)", animationDelay: `${i * 0.3}s` }}
          >
            <div className="flex flex-col items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 py-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.05)] min-w-[92px]">
              <Icon className="h-4 w-4" strokeWidth={2} />
              <span className="text-[9px] md:text-[10px] tracking-[0.15em] font-bold whitespace-nowrap">
                {c.label}
              </span>
            </div>
          </div>
        );
      })}

      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <div
          key={deg}
          className="absolute h-1.5 w-1.5 rounded-full bg-black/40"
          style={{
            top: `${50 + Math.sin((deg * Math.PI) / 180) * 46}%`,
            left: `${50 + Math.cos((deg * Math.PI) / 180) * 46}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
