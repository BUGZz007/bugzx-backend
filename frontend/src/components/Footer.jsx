import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Instagram, Mail, ArrowUpRight } from "lucide-react";
import { BugzLogo } from "./Navbar";

export default function Footer() {
  return (
    <footer className="relative border-t border-black/10 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
          <div className="md:col-span-6">
            <BugzLogo size="lg" />
            <p className="mt-6 max-w-md text-sm text-black/60 leading-relaxed">
              Practical AI-powered growth systems that combine strategy, marketing, automation and
              conversion-first web experiences for ambitious businesses.
            </p>

            <div className="mt-8">
              <p className="text-[11px] tracking-[0.25em] text-black/50 font-semibold">CONNECT</p>
              <div className="mt-3 flex items-center gap-2">
                {[
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Mail, href: "mailto:team@bugzx.space", label: "Email" },
                ].map((s, i) => (
                  <a key={i} href={s.href} aria-label={s.label} className="h-9 w-9 rounded-full border border-black/15 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] tracking-[0.25em] text-black/50 font-semibold">EXPLORE</p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { name: "Home", to: "/" },
                { name: "About", to: "/about" },
                { name: "Services", to: "/services" },
                { name: "Partner", to: "/partner" },
                { name: "Careers", to: "/careers" },
                { name: "Contact", to: "/contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline text-black/75 hover:text-black">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] tracking-[0.25em] text-black/50 font-semibold">CONTACT</p>
            <ul className="mt-4 space-y-2 text-sm text-black/75">
              <li>team@bugzx.space</li>
              <li>Mon–Fri, 10:00 – 19:00</li>
              <li>Remote-first, Global</li>
            </ul>
            <Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold border-b border-black pb-0.5 hover:gap-3 transition-all">
              Start a project <ArrowUpRight className="h-4 w-4" />
            </Link>

            <div className="mt-6">
              <img
                src="/cyber-beetle.png"
                alt="BUGZ X Cyber Beetle"
                className="w-full max-w-[260px] md:max-w-[320px] h-auto object-contain pointer-events-none select-none opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-black/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-black/50">© {new Date().getFullYear()} BUGZ X. All rights reserved.</p>
          <p className="text-xs text-black/50">Scale smarter with AI, systems, and execution.</p>
        </div>
      </div>
    </footer>
  );
}
