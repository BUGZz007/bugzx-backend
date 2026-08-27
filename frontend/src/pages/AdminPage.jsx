import React, { useState, useEffect, useCallback } from "react";
import {
  Shield, RefreshCw, Search, ChevronDown, ChevronUp,
  CheckCircle, Clock, XCircle, Mail, FileText, ExternalLink, Save
} from "lucide-react";
import { toast } from "../hooks/use-toast";

const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "bugzx-admin-2024";

const STATUS_OPTIONS = ["New", "In Review", "Shortlisted", "Contacted", "Closed"];
const TYPE_OPTIONS = ["All Types", "Inquiry", "Job Application", "Business Partnership", "Support Request"];
const STATUS_FILTER_OPTIONS = ["All Statuses", ...STATUS_OPTIONS];

const STATUS_COLORS = {
  "New":         "bg-blue-50   text-blue-700   border-blue-200",
  "In Review":   "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Shortlisted": "bg-purple-50 text-purple-700 border-purple-200",
  "Contacted":   "bg-green-50  text-green-700  border-green-200",
  "Closed":      "bg-gray-100  text-gray-500   border-gray-200",
};

const TYPE_COLORS = {
  "Inquiry":              "bg-black  text-white",
  "Job Application":      "bg-black/80 text-white",
  "Business Partnership": "bg-black/60 text-white",
  "Support Request":      "bg-black/40 text-white",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [expanded, setExpanded] = useState(null);
  const [editMap, setEditMap] = useState({}); // { submission_id: { status, notes } }
  const [saving, setSaving] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPwError("");
    try {
      const res = await fetch(`${BACKEND}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: pwInput }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        localStorage.setItem("admin_token", data.token);
        setAuthed(true);
      } else {
        throw new Error(data.detail || "Authentication failed");
      }
    } catch (err) {
      setPwError(err.message || "Incorrect credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/submissions`, {
        headers: { "x-admin-session": localStorage.getItem("admin_token") || "" },
      });
      if (!res.ok) throw new Error("Unauthorized or server error");
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      toast({ title: "Failed to load submissions", description: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchSubmissions();
  }, [authed, fetchSubmissions]);

  const saveChanges = async (id) => {
    const edits = editMap[id];
    if (!edits) return;
    setSaving(id);
    try {
      const res = await fetch(`${BACKEND}/api/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-session": localStorage.getItem("admin_token") || "",
        },
        body: JSON.stringify(edits),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.submission_id === id ? { ...s, ...edits } : s))
        );
        toast({ title: "Saved", description: `${id} updated successfully.` });
        setEditMap((m) => { const n = { ...m }; delete n[id]; return n; });
      } else {
        throw new Error(data.detail || "Update failed");
      }
    } catch (err) {
      toast({ title: "Save failed", description: err.message });
    } finally {
      setSaving(null);
    }
  };

  const setEdit = (id, field, val) => {
    setEditMap((m) => ({ ...m, [id]: { ...(m[id] || {}), [field]: val } }));
  };

  const filtered = submissions.filter((s) => {
    const matchType = typeFilter === "All Types" || s.form_type === typeFilter;
    const matchStatus = statusFilter === "All Statuses" || s.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.submission_id?.toLowerCase().includes(q) ||
      s.subject?.toLowerCase().includes(q);
    return matchType && matchStatus && matchSearch;
  });

  // ===== LOGIN SCREEN =====
  if (!authed) {
    return (
      <main className="pt-32 md:pt-40 pb-20 min-h-screen bg-white">
        <section className="max-w-md mx-auto px-4">
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-black text-white flex items-center justify-center mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="font-orbitron font-black text-2xl">BUGZ X Admin</h1>
            <p className="text-black/50 text-sm mt-1">Internal ERP — Authorized Access Only</p>
          </div>
          <form onSubmit={handleLogin} className="rounded-2xl border border-black/12 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col gap-4">
            <div>
              <label className="text-[10px] tracking-[0.25em] text-black/60 font-semibold">ADMIN EMAIL</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter admin email"
                className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.25em] text-black/60 font-semibold">ADMIN PASSWORD</label>
              <input
                type="password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                placeholder="Enter admin password"
                className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>
            {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-black text-white px-6 py-3 text-[12px] font-bold tracking-[0.15em] hover:bg-black/85 transition-colors disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "ENTER ADMIN PANEL"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  // ===== ADMIN PANEL =====
  return (
    <main className="pt-28 md:pt-36 pb-20 min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold">
              <span className="h-px w-8 bg-black" /> INTERNAL ERP
            </div>
            <h1 className="mt-2 font-orbitron font-black text-3xl md:text-4xl">Submissions</h1>
            <p className="mt-1 text-black/50 text-sm">{filtered.length} record{filtered.length !== 1 ? "s" : ""} shown</p>
          </div>
          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-black/20 px-5 py-2.5 text-[11px] font-bold tracking-[0.15em] hover:bg-black/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "LOADING…" : "REFRESH"}
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {STATUS_OPTIONS.map((s) => {
            const count = submissions.filter((x) => x.status === s).length;
            return (
              <div key={s} className="rounded-xl border border-black/10 p-4 text-center">
                <p className="text-xl font-black font-orbitron">{count}</p>
                <p className="text-[10px] tracking-[0.2em] text-black/50 font-semibold mt-1">{s.toUpperCase()}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, ID, subject…"
              className="w-full rounded-xl border border-black/15 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <AdminSelect value={typeFilter} onChange={setTypeFilter} options={TYPE_OPTIONS} />
          <AdminSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTER_OPTIONS} />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-black/40 text-sm">Loading submissions…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-black/40 text-sm">No submissions found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => {
              const isOpen = expanded === s.submission_id;
              const edit = editMap[s.submission_id] || {};
              const currentStatus = edit.status ?? s.status;
              const currentNotes = edit.notes ?? s.notes ?? "";
              const hasEdits = Object.keys(edit).length > 0;

              return (
                <div key={s.submission_id} className="rounded-2xl border border-black/10 bg-white overflow-hidden hover:border-black/25 transition-colors">
                  {/* Row header */}
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : s.submission_id)}
                    className="w-full text-left px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.1em] ${TYPE_COLORS[s.form_type] || "bg-black text-white"}`}>
                          {s.form_type}
                        </span>
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${STATUS_COLORS[s.status] || ""}`}>
                          {s.status}
                        </span>
                        <span className="text-[10px] text-black/40 font-mono">{s.submission_id}</span>
                      </div>
                      <p className="font-semibold text-sm truncate">{s.name}</p>
                      <p className="text-[12px] text-black/50 truncate">{s.email} {s.phone ? `· ${s.phone}` : ""}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden md:block text-right">
                        <p className="text-[11px] text-black/40">{new Date(s.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                        <p className="text-[11px] text-black/40">{new Date(s.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-black/40" /> : <ChevronDown className="h-4 w-4 text-black/40" />}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t border-black/10 px-5 py-5 space-y-5">
                      {/* Info grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        {[
                          ["Company", s.company],
                          ["Country", s.country],
                          ["City", s.city],
                          ["Subject / Position", s.subject],
                          ["Email Sent", s.email_sent ? "✅ Yes" : "❌ No"],
                          ["Email Status", s.email_status || "—"],
                        ].map(([k, v]) => v ? (
                          <div key={k}>
                            <p className="text-[10px] tracking-[0.2em] text-black/40 font-semibold">{k.toUpperCase()}</p>
                            <p className="mt-1 text-sm font-medium">{v}</p>
                          </div>
                        ) : null)}
                      </div>

                      {/* Message */}
                      <div>
                        <p className="text-[10px] tracking-[0.2em] text-black/40 font-semibold mb-2">MESSAGE / COVER LETTER</p>
                        <div className="bg-black/[0.02] rounded-xl border border-black/8 px-4 py-3 text-sm text-black/70 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                          {s.message || "—"}
                        </div>
                      </div>

                      {/* File links */}
                      {(s.resume_url || s.docs_url) && (
                        <div className="flex flex-wrap gap-3">
                          {s.resume_url && (
                            <a href={s.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-bold border border-black/15 rounded-full px-4 py-2 hover:bg-black/5 transition-colors">
                              <FileText className="h-3.5 w-3.5" /> VIEW RESUME <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {s.docs_url && (
                            <a href={s.docs_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-bold border border-black/15 rounded-full px-4 py-2 hover:bg-black/5 transition-colors">
                              <FileText className="h-3.5 w-3.5" /> VIEW ATTACHMENT <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Edit status + notes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-black/8">
                        <div>
                          <label className="text-[10px] tracking-[0.2em] text-black/40 font-semibold">STATUS</label>
                          <AdminSelect
                            value={currentStatus}
                            onChange={(v) => setEdit(s.submission_id, "status", v)}
                            options={STATUS_OPTIONS}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] tracking-[0.2em] text-black/40 font-semibold">INTERNAL NOTES</label>
                          <textarea
                            rows={3}
                            value={currentNotes}
                            onChange={(e) => setEdit(s.submission_id, "notes", e.target.value)}
                            placeholder="Add notes visible only to the team…"
                            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                          />
                        </div>
                      </div>

                      {hasEdits && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => saveChanges(s.submission_id)}
                            disabled={saving === s.submission_id}
                            className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5 text-[11px] font-bold tracking-[0.15em] hover:bg-black/85 transition-colors disabled:opacity-60"
                          >
                            {saving === s.submission_id ? (
                              <><span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> SAVING…</>
                            ) : (
                              <><Save className="h-3.5 w-3.5" /> SAVE CHANGES</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function AdminSelect({ value, onChange, options, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors appearance-none pr-10"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" />
    </div>
  );
}
