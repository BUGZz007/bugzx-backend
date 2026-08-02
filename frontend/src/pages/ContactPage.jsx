import React, { useState } from "react";
import { Mail, MapPin, Clock, Send, Phone, MessageCircle } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { SERVICE_OPTIONS } from "../mock";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    service: "",
    website: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.service || !form.details) {
      toast({ title: "Please fill required fields", description: "Full name, email, service and project details are required." });
      return;
    }
    if (form.details.length < 50) {
      toast({ title: "Add a little more detail", description: "Project details should be at least 50 characters." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Inquiry sent — we’ll be in touch", description: "We reply within 24 hours with a strategy call and action roadmap." });
      setForm({ fullName: "", company: "", email: "", phone: "", city: "", service: "", website: "", details: "" });
    }, 900);
  };

  return (
    <main className="pt-32 md:pt-40 pb-20">
      <section className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> CONTACT US
        </div>
        <h1 className="mt-4 font-orbitron font-black text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
          Tell us your growth goal &mdash;
          <br />
          <span className="italic font-normal text-black/60">we&rsquo;ll map the fastest path.</span>
        </h1>

        {/* Response info bar */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { k: "Response", v: "Typically within 24 hours" },
            { k: "Format", v: "Strategy call + Action roadmap" },
            { k: "Ideal For", v: "Founders, CMOs, Growth Teams" },
          ].map((c) => (
            <div key={c.k} className="rounded-2xl border border-black/12 p-5">
              <p className="text-[10px] tracking-[0.25em] text-black/50 font-semibold">{c.k.toUpperCase()}</p>
              <p className="mt-2 text-sm font-semibold">{c.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-2xl border border-black/12 p-6">
              <p className="font-orbitron font-bold text-lg">Before you submit</p>
              <p className="mt-2 text-[13px] text-black/60 leading-relaxed">
                Sharing these details helps us respond with a useful plan instead of a generic message.
                Please consider these questions in your project details:
              </p>
              <ul className="mt-4 space-y-2 text-[13px] text-black/75">
                {[
                  "What are your current monthly leads or sales?",
                  "Which channels are active today?",
                  "What is your 90-day business target?",
                  "What is the biggest growth bottleneck right now?",
                ].map((q) => (
                  <li key={q} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-black bg-black text-white p-6">
              <p className="font-orbitron font-bold text-lg">Need urgent support?</p>
              <p className="mt-2 text-[13px] text-white/70 leading-relaxed">
                Your website form is connected. Use Email or WhatsApp as a faster follow-up option when needed.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href="mailto:hello@bugzx.space" className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-[11px] font-bold tracking-[0.15em]">
                  <Mail className="h-4 w-4" /> EMAIL BUGZ X
                </a>
                <a href="https://wa.me/0000000000" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-[11px] font-bold tracking-[0.15em] hover:bg-white/10">
                  <MessageCircle className="h-4 w-4" /> WHATSAPP BUGZ X
                </a>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: Mail, label: "EMAIL", value: "hello@bugzx.space" },
                { icon: Clock, label: "HOURS", value: "Mon–Fri, 10:00 – 19:00" },
                { icon: MapPin, label: "LOCATION", value: "Remote-first, Global" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4 p-4 rounded-2xl border border-black/12">
                  <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.25em] text-black/50 font-semibold">{c.label}</p>
                    <p className="mt-1 font-semibold text-sm">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-7 rounded-3xl border border-black/12 p-6 md:p-8 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name *" value={form.fullName} onChange={(v) => update("fullName", v)} placeholder="Your full name" />
              <Field label="Company" value={form.company} onChange={(v) => update("company", v)} placeholder="Company name" />
              <Field label="Email *" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@company.com" />
              <Field label="Phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+1 555 123 4567" />
              <Field label="City" value={form.city} onChange={(v) => update("city", v)} placeholder="City / Country" />
              <div>
                <label className="text-[10px] tracking-[0.25em] text-black/60 font-semibold">SERVICE NEEDED *</label>
                <select value={form.service} onChange={(e) => update("service", e.target.value)} className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors appearance-none">
                  <option value="">Select service</option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <Field label="Website" value={form.website} onChange={(v) => update("website", v)} placeholder="https://" />
            </div>
            <div className="mt-4">
              <label className="text-[10px] tracking-[0.25em] text-black/60 font-semibold">PROJECT DETAILS *</label>
              <textarea rows={6} value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Tell us about your goal, monthly target and current bottleneck…" className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
              <p className="mt-2 text-[11px] text-black/50">Minimum 50 characters. Currently: {form.details.length}</p>
            </div>
            <button type="submit" disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3.5 text-[12px] font-bold tracking-[0.15em] hover:bg-black/85 transition-colors disabled:opacity-60">
              {loading ? "SENDING…" : "SEND INQUIRY"}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.25em] text-black/60 font-semibold">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
    </div>
  );
}
