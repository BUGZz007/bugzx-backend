import React, { useState, useRef } from "react";
import {
  Mail, MapPin, Clock, Phone, MessageCircle,
  Send, Upload, FileText, CheckCircle, ChevronDown
} from "lucide-react";
import { toast } from "../hooks/use-toast";
import { FORM_TYPES, COUNTRIES, SERVICE_OPTIONS } from "../mock";

const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const INITIAL_FORM = {
  form_type: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  city: "",
  subject: "",
  message: "",
  consent: false,
};

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [docsFile, setDocsFile] = useState(null);
  const resumeRef = useRef();
  const docsRef = useRef();

  const isJobApp = form.form_type === "Job Application";
  const subjectLabel = isJobApp ? "Position Applying For" : "Subject";

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.form_type) {
      toast({ title: "Select a form type", description: "Please choose what this submission is about." });
      return;
    }
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Required fields missing", description: "Name, email and message are required." });
      return;
    }
    if (form.message.length < 20) {
      toast({ title: "Message too short", description: "Please write at least 20 characters." });
      return;
    }
    if (!form.consent) {
      toast({ title: "Privacy Policy required", description: "Please agree to the Privacy Policy to continue." });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (resumeFile) fd.append("resume", resumeFile);
      if (docsFile) fd.append("docs", docsFile);

      const res = await fetch(`${BACKEND}/api/submit`, { method: "POST", body: fd });
      const data = await res.json();

      if (data.ok) {
        setSuccessId(data.submission_id);
        setForm(INITIAL_FORM);
        setResumeFile(null);
        setDocsFile(null);
      } else {
        throw new Error(data.detail || "Submission failed");
      }
    } catch (err) {
      toast({ title: "Submission failed", description: err.message || "Please try again or email us directly." });
    } finally {
      setLoading(false);
    }
  };

  if (successId) {
    return (
      <main className="pt-32 md:pt-40 pb-20">
        <section className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-black text-white mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="font-orbitron font-black text-3xl md:text-5xl">Submission Received</h1>
          <p className="mt-4 text-black/60 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Thank you for reaching out. A confirmation has been sent to your email. Our team will respond within 24 hours.
          </p>
          <div className="mt-8 inline-block rounded-2xl border border-black/12 bg-white px-8 py-5 shadow-sm">
            <p className="text-[11px] tracking-[0.25em] text-black/50 font-semibold">YOUR SUBMISSION ID</p>
            <p className="mt-2 font-orbitron font-black text-2xl md:text-3xl tracking-wider">{successId}</p>
            <p className="mt-1 text-[11px] text-black/40">Keep this for your reference</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSuccessId(null)}
              className="rounded-full bg-black text-white px-6 py-3 text-[12px] font-bold tracking-[0.15em] hover:bg-black/85 transition-colors"
            >
              SUBMIT ANOTHER
            </button>
            <a
              href="mailto:team@bugzx.space"
              className="rounded-full border border-black/20 px-6 py-3 text-[12px] font-bold tracking-[0.15em] hover:bg-black/5 transition-colors"
            >
              EMAIL US DIRECTLY
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-32 md:pt-40 pb-20">
      <section className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
          <span className="h-px w-8 bg-black" /> CONTACT US
        </div>
        <h1 className="mt-4 font-orbitron font-black text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
          One form for every need —
          <br />
          <span className="italic font-normal text-black/60">inquiry, application, or partnership.</span>
        </h1>

        {/* Info cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { k: "Response", v: "Within 24 hours" },
            { k: "Format", v: "Strategy call + Action roadmap" },
            { k: "Ideal For", v: "Founders, CMOs, Candidates" },
          ].map((c) => (
            <div key={c.k} className="rounded-2xl border border-black/12 p-5">
              <p className="text-[10px] tracking-[0.25em] text-black/50 font-semibold">{c.k.toUpperCase()}</p>
              <p className="mt-2 text-sm font-semibold">{c.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Form type explainer */}
            <div className="rounded-2xl border border-black/12 p-6">
              <p className="font-orbitron font-bold text-lg">What can you submit?</p>
              <ul className="mt-4 space-y-3">
                {[
                  { type: "Inquiry", desc: "Project quotes, service questions, growth consultations" },
                  { type: "Job Application", desc: "Internship or full-time role applications with CV" },
                  { type: "Business Partnership", desc: "Agency partnerships, referrals, white-label" },
                  { type: "Support Request", desc: "Technical help for existing BUGZ X clients" },
                ].map((t) => (
                  <li key={t.type} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-black shrink-0" />
                    <div>
                      <p className="text-sm font-bold">{t.type}</p>
                      <p className="text-[12px] text-black/55">{t.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Urgent contact */}
            <div className="rounded-2xl border border-black bg-black text-white p-6">
              <p className="font-orbitron font-bold text-lg">Need urgent support?</p>
              <p className="mt-2 text-[13px] text-white/70 leading-relaxed">
                For critical issues, reach us directly via email or WhatsApp.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href="mailto:team@bugzx.space" className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-[11px] font-bold tracking-[0.15em]">
                  <Mail className="h-4 w-4" /> EMAIL BUGZ X
                </a>
                <a href="https://wa.me/+917340425065" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-[11px] font-bold tracking-[0.15em] hover:bg-white/10 transition-colors">
                  <MessageCircle className="h-4 w-4" /> WHATSAPP
                </a>
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: Mail, label: "EMAIL", value: "team@bugzx.space" },
                { icon: Clock, label: "HOURS", value: "Mon–Fri, 10:00 – 19:00 IST" },
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
          <form
            onSubmit={submit}
            className="lg:col-span-7 rounded-3xl border border-black/12 p-6 md:p-8 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)]"
          >
            {/* Form Type */}
            <div className="mb-5">
              <SelectField
                label="Form Type *"
                value={form.form_type}
                onChange={(v) => update("form_type", v)}
                options={FORM_TYPES}
                placeholder="Select type"
              />
            </div>

            {/* Personal details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name *" value={form.name} onChange={(v) => update("name", v)} placeholder="Your full name" />
              <Field label="Email Address *" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@company.com" />
              <Field label="Mobile Number" type="tel" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+91 98765 43210" />
              <Field label="Company Name" value={form.company} onChange={(v) => update("company", v)} placeholder="Optional" />
              <SelectField
                label="Country"
                value={form.country}
                onChange={(v) => update("country", v)}
                options={COUNTRIES}
                placeholder="Select country"
              />
              <Field label="City" value={form.city} onChange={(v) => update("city", v)} placeholder="Your city" />
            </div>

            {/* Subject / Position */}
            <div className="mt-4">
              <Field
                label={`${subjectLabel} *`}
                value={form.subject}
                onChange={(v) => update("subject", v)}
                placeholder={isJobApp ? "e.g. Full Stack Developer Intern" : "Brief subject of your inquiry"}
              />
            </div>

            {/* Service needed — shown for Inquiry */}
            {form.form_type === "Inquiry" && (
              <div className="mt-4">
                <SelectField
                  label="Service Needed"
                  value={form.subject}
                  onChange={(v) => update("subject", v)}
                  options={SERVICE_OPTIONS}
                  placeholder="Select service"
                />
              </div>
            )}

            {/* Message */}
            <div className="mt-4">
              <label className="text-[10px] tracking-[0.25em] text-black/60 font-semibold">
                {isJobApp ? "COVER LETTER *" : "MESSAGE / INQUIRY *"}
              </label>
              <textarea
                rows={6}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder={
                  isJobApp
                    ? "Tell us about yourself, your skills, and why you want to join BUGZ X…"
                    : "Describe your goal, current challenge, or how we can help…"
                }
                className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
              />
              <p className="mt-1 text-[11px] text-black/40">Minimum 20 characters · {form.message.length} written</p>
            </div>

            {/* File uploads */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resume — only for Job Application */}
              {isJobApp && (
                <FileDropZone
                  label="Upload Resume *"
                  hint="PDF, DOC, DOCX · max 5 MB"
                  file={resumeFile}
                  onFile={setResumeFile}
                  inputRef={resumeRef}
                  accept=".pdf,.doc,.docx"
                />
              )}
              {/* Additional docs — optional for all */}
              <FileDropZone
                label="Additional Document"
                hint="Optional · any format · max 10 MB"
                file={docsFile}
                onFile={setDocsFile}
                inputRef={docsRef}
                accept="*"
              />
            </div>

            {/* Consent */}
            <div className="mt-6 flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-black/30 accent-black shrink-0"
              />
              <label htmlFor="consent" className="text-[12px] text-black/60 leading-relaxed cursor-pointer">
                I agree to the{" "}
                <a href="/privacy" className="font-semibold text-black underline underline-offset-2">Privacy Policy</a>{" "}
                and{" "}
                <a href="/terms" className="font-semibold text-black underline underline-offset-2">Terms of Service</a>.
                I understand that BUGZ X will contact me about my submission.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-black text-white px-7 py-3.5 text-[12px] font-bold tracking-[0.15em] hover:bg-black/85 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  SUBMITTING…
                </>
              ) : (
                <>SUBMIT <Send className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

// ===== FIELD COMPONENTS =====

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.25em] text-black/60 font-semibold">{label.toUpperCase()}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <label className="text-[10px] tracking-[0.25em] text-black/60 font-semibold">{label.toUpperCase()}</label>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors appearance-none pr-10"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" />
      </div>
    </div>
  );
}

function FileDropZone({ label, hint, file, onFile, inputRef, accept }) {
  const handleChange = (e) => {
    if (e.target.files?.[0]) onFile(e.target.files[0]);
  };
  return (
    <div>
      <label className="text-[10px] tracking-[0.25em] text-black/60 font-semibold">{label.toUpperCase()}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-2 w-full rounded-xl border-2 border-dashed border-black/15 bg-white px-4 py-5 text-sm hover:border-black/40 hover:bg-black/[0.02] transition-colors flex flex-col items-center justify-center gap-2 text-center"
      >
        {file ? (
          <>
            <FileText className="h-5 w-5 text-black/60" />
            <span className="font-semibold text-[12px] text-black">{file.name}</span>
            <span className="text-[11px] text-black/40">{(file.size / 1024).toFixed(0)} KB · click to change</span>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5 text-black/30" />
            <span className="text-[12px] text-black/50">{hint}</span>
          </>
        )}
      </button>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
}
