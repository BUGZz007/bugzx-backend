import React from "react";
import BugLogo from "./BugLogo";

export default function PageLoader({ visible }) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3">
        <div className="animate-floaty">
          <BugLogo className="h-16 w-16 md:h-20 md:w-20" />
        </div>
        <span className="font-orbitron font-black text-3xl md:text-4xl tracking-tight">BUGz X</span>
      </div>
      <div className="mt-8 h-[3px] w-40 md:w-56 rounded-full bg-black/10 overflow-hidden">
        <div className="h-full w-1/3 bg-black rounded-full animate-loader-slide" />
      </div>
      <p className="mt-5 text-[10px] tracking-[0.35em] font-semibold text-black/50">LOADING SYSTEMS</p>
    </div>
  );
}
