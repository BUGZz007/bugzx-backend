import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../mock";
import BugLogo from "./BugLogo";

const BugzLogo = ({ className = "", size = "md" }) => {
  const iconSize = size === "lg" ? "h-12 w-12 md:h-16 md:w-16" : "h-6 w-6";
  const textSize = size === "lg" ? "!text-4xl md:!text-6xl" : "text-[20px] md:text-[22px]";
  return (
    <span className={`inline-flex items-center gap-2 font-orbitron font-black tracking-tight leading-none ${className}`}>
      <BugLogo className={iconSize} />
      <span className={textSize}>BUGz X</span>
    </span>
  );
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <nav className={`max-w-6xl mx-auto flex items-center justify-between rounded-2xl border border-black/10 bg-white/90 backdrop-blur-md px-4 md:px-6 py-3 transition-shadow ${scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.06)]" : "shadow-sm"}`}>
        <Link to="/" className="flex items-center gap-2" aria-label="BUGZ X home">
          <BugzLogo />
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => {
            const active = location.pathname === l.to;
            return (
              <li key={l.to}>
                <Link to={l.to} className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold tracking-wider transition-colors ${active ? "bg-black text-white" : "text-black/70 hover:text-black hover:bg-black/5"}`}>
                  {l.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <button className="md:hidden p-2 rounded-lg hover:bg-black/5" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 rounded-2xl border border-black/10 bg-white shadow-lg overflow-hidden">
          <ul className="flex flex-col p-2">
            {NAV_LINKS.map((l) => {
              const active = location.pathname === l.to;
              return (
                <li key={l.to}>
                  <Link to={l.to} className={`block px-4 py-3 rounded-xl text-sm font-semibold tracking-wider ${active ? "bg-black text-white" : "text-black/80 hover:bg-black/5"}`}>
                    {l.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export { BugzLogo };
