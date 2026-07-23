import { useEffect, useState } from "react";
import { CircleCheck, GitFork, Link, Mail, MessageSquare, Send, User } from "lucide-react";
import { Reveal, useMagnetic, useScrollDepth } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

/* ===================== CONTACT ===================== */
const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function ContactSection() {
  const [f, setF] = useState({ name: "", email: "", details: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingMsg, setSendingMsg] = useState("Sending");
  const [error, setError] = useState("");
  const [focus, setFocus] = useState(null);
  const anyFocus = focus !== null;
  const sendRef = useMagnetic(0.22);
  const warmRef = useScrollDepth("--warm"); // lighting warms as the section enters view

  // Wake the (likely cold-started) backend once the contact section is within reach —
  // not on every page load. Gives the server time to spin up before the user hits submit,
  // without firing a cross-origin request for every visitor who never scrolls this far.
  useEffect(() => {
    if (!API_BASE) return;
    const el = warmRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { fetch(`${API_BASE}/api/health`).catch(() => {}); io.disconnect(); }
    }, { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWithTimeout = (url, opts, ms) =>
    Promise.race([fetch(url, opts), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

  const doFetch = () => fetchWithTimeout(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(f),
  }, 12000);

  const submit = async () => {
    if (sent || sending) return;
    setError("");
    setSending(true);
    setSendingMsg("Sending");
    try {
      let res;
      try {
        res = await doFetch();
      } catch {
        setSendingMsg("Waking up server");
        const deadline = Date.now() + 90000;
        let up = false;
        while (Date.now() < deadline) {
          await new Promise(r => setTimeout(r, 5000));
          try {
            const h = await fetchWithTimeout(`${API_BASE}/api/health`, {}, 5000);
            if (h.ok) { up = true; break; }
          } catch { /* not up yet, keep polling */ }
        }
        if (!up) throw new Error("Server is taking too long to respond. Please try again in a minute.");
        setSendingMsg("Sending");
        res = await doFetch();
      }
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch { /* non-JSON body, leave data empty */ }
      if (!res.ok) {
        const detail = data.detail;
        let msg = "Something went wrong. Please try again.";
        if (typeof detail === "string") msg = detail;
        else if (Array.isArray(detail)) {
          const emailErr = detail.find(e => e.loc?.includes("email"));
          const nameErr = detail.find(e => e.loc?.includes("name"));
          const detailsErr = detail.find(e => e.loc?.includes("details"));
          if (emailErr) msg = "Please enter a valid email address.";
          else if (nameErr) msg = "Please enter your name.";
          else if (detailsErr) msg = "Please describe your project.";
        }
        throw new Error(msg);
      }
      setF({ name: "", email: "", details: "" });
      setSent(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
      setSendingMsg("Sending");
    }
  };
  return (
    <section ref={warmRef} id="contact" className="max-w-6xl mx-auto px-5 py-20 relative" style={{ scrollMarginTop: "80px" }}>
      {/* warm, inviting ambient light that strengthens as you arrive */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(70% 55% at 78% 18%, rgba(251,191,140,0.06), transparent 60%), radial-gradient(60% 50% at 22% 90%, rgba(244,114,182,0.05), transparent 60%)", opacity: "var(--warm,0.4)", transition: "opacity .4s linear" }} />
      <Reveal duration={1.9}><SectionLabel num="✦">Contact</SectionLabel></Reveal>
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Have a project <span className="grad-text">in mind?</span></h2>
          <p className="text-slate-400 mt-5 leading-relaxed">Let's build something great together. I'm available for freelance projects, agency work and collaborations — anywhere in the world.</p>
          <div className="mt-7 space-y-3">
            {[[<Mail className="w-4 h-4" />, "Email", "rehaan689nazir@gmail.com"], [<Link className="w-4 h-4" />, "LinkedIn", "linkedin.com/in/rehan-nazir-530597332"], [<GitFork className="w-4 h-4" />, "GitHub", "github.com/rehaannazir"]].map(([ic, l, v], i) => (
              <div key={i} className="flex items-center gap-3 glass glass-hover rounded-xl px-4 py-3" data-cursor><span className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>{ic}</span><div><div className="text-xs text-slate-400 mono">{l}</div><div className="text-sm text-slate-200">{v}</div></div></div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden" style={{ padding: "1.5px" }}>
            <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "130%", height: "130%", background: "conic-gradient(from 0deg, transparent 0deg, #3b82f6 70deg, #8b5cf6 150deg, transparent 260deg)", animation: "spinSlow 14s linear infinite", opacity: anyFocus ? 0.95 : 0.35, transition: "opacity 1s" }} />
            <div className="relative rounded-2xl p-6" style={{ background: "rgba(9,9,17,0.94)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" /><span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="mono text-xs text-slate-400 ml-1">new_message.tsx</span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] mono text-emerald-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "vpulse 2s ease-in-out infinite" }} />online</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs mono text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-indigo-400" /> your_name</label>
                  <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} onFocus={() => setFocus("name")} onBlur={() => setFocus(null)} placeholder="Jane Doe" className="w-full mt-1.5 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all" style={{ border: "1px solid", borderColor: focus === "name" ? "#818cf8" : "rgba(255,255,255,0.1)", boxShadow: focus === "name" ? "0 0 0 3px rgba(99,102,241,0.16), 0 0 26px -6px rgba(139,92,246,0.7)" : "none" }} />
                </div>
                <div>
                  <label className="text-xs mono text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> email</label>
                  <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} onFocus={() => setFocus("email")} onBlur={() => setFocus(null)} placeholder="jane@company.com" className="w-full mt-1.5 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all" style={{ border: "1px solid", borderColor: focus === "email" ? "#818cf8" : "rgba(255,255,255,0.1)", boxShadow: focus === "email" ? "0 0 0 3px rgba(99,102,241,0.16), 0 0 26px -6px rgba(139,92,246,0.7)" : "none" }} />
                </div>
                <div>
                  <div className="flex items-center justify-between"><label className="text-xs mono text-slate-400 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> project_details</label><span className="text-[10px] mono text-slate-400">{f.details.length}/500</span></div>
                  <textarea value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} onFocus={() => setFocus("details")} onBlur={() => setFocus(null)} rows={4} maxLength={500} placeholder="What would you like to automate?" className="w-full mt-1.5 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all resize-none" style={{ border: "1px solid", borderColor: focus === "details" ? "#818cf8" : "rgba(255,255,255,0.1)", boxShadow: focus === "details" ? "0 0 0 3px rgba(99,102,241,0.16), 0 0 26px -6px rgba(139,92,246,0.7)" : "none" }} />
                </div>
                <button ref={sendRef} onClick={submit} disabled={sent || sending} className="btn-glow magnetic w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all" style={{ background: sent ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
                  {sent ? (<><CircleCheck className="w-4 h-4" /> Message sent — I'll be in touch</>) : sending ? (<span className="inline-flex items-center gap-2">{sendingMsg} <span className="flex gap-1">{[0, 1, 2].map((i) => (<span key={i} className="w-1.5 h-1.5 rounded-full bg-white" style={{ animation: `vpulse 1s ease-in-out ${i * 0.2}s infinite` }} />))}</span></span>) : (<>Send message <Send className="w-4 h-4" /></>)}
                </button>
                {error && <p className="text-xs text-rose-400 mono mt-2">⚠ {error}</p>}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
