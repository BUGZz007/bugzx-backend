import React from "react";
import { INTERN_ROLES } from "../mock";
import { CtaBanner } from "../components/Sections";
import { ArrowUpRight, Briefcase, MapPin, Clock, Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function CareersPage() {
  return (
    <main className="pt-32 md:pt-40">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> JOIN OUR TEAM
        </div>
        <h1 className="mt-4 font-orbitron font-black text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
          Start your career with a
          <br />
          <span className="italic font-normal text-black/60">2-month internship at BUGZ X.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm md:text-base text-black/65 leading-relaxed">
          We are hiring interns who want practical execution experience in growth, content, and product delivery.
          Every role is remote, mentorship-driven, and focused on real business outcomes.
        </p>
      </section>

      {/* Info bar */}
      <section className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: Clock, k: "Duration", v: "2 Months Internship" },
            { icon: MapPin, k: "Type", v: "Remote" },
            { icon: Briefcase, k: "Openings", v: "Lead Gen, Video, Content, Full Stack" },
          ].map((c) => (
            <div key={c.k} className="flex items-start gap-3 rounded-2xl border border-black/12 p-5">
              <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                <c.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.25em] text-black/50 font-semibold">{c.k.toUpperCase()}</p>
                <p className="mt-1 font-orbitron font-bold text-sm">{c.v}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Not hiring banner */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-10">
        <div className="rounded-2xl border border-black bg-black text-white p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <p className="font-orbitron font-black text-lg md:text-xl">We&rsquo;re not hiring yet</p>
              <p className="mt-1 text-sm text-white/70 leading-relaxed max-w-xl">
                Applications are currently closed. Roles below are the ones we open when hiring resumes —
                introduce yourself and we&rsquo;ll reach out first.
              </p>
            </div>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-3 text-[11px] font-bold tracking-[0.15em] hover:bg-white/90 transition-colors whitespace-nowrap">
            CONTACT US
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Roles */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> OPEN POSITIONS
        </div>
        <h2 className="mt-4 font-orbitron font-black text-3xl md:text-5xl leading-tight max-w-3xl">
          Choose the internship role <span className="italic font-normal text-black/60">that matches your strengths</span>
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTERN_ROLES.map((r) => (
            <div key={r.role} className="rounded-2xl border border-black/12 p-6 hover:border-black transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-orbitron font-bold text-lg md:text-xl">{r.role}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] tracking-[0.15em] text-black/55 font-semibold">
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{r.type}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{r.location}</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[13px] text-black/60 leading-relaxed">{r.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {r.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-black/75">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <button disabled className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-[11px] font-bold tracking-[0.15em] text-black/50 cursor-not-allowed">
                APPLICATIONS CLOSED
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Don&rsquo;t see a role that fits?"
        text="Reach out anyway — we value initiative. Send us your work and what you&rsquo;d like to build."
        cta="SEND A MESSAGE"
        to="/contact"
      />
    </main>
  );
}
