import { useState, useEffect, useRef } from "react";
import rehanPhoto from "./assets/rehan.jpg";
import {
  Workflow, Cpu, MessageSquare, TrendingUp, Code, Zap, Star,
  ArrowRight, ArrowUpRight, ArrowLeft, GitFork, Link, Mail, MessageCircle, Menu, X,
  CircleCheck, Sparkles, Layers, Calendar, Clock, Camera, ExternalLink,
  GitBranch, Activity, List, Quote, ChevronRight, TriangleAlert, BookOpen, User, Send
} from "lucide-react";

/* ===================== CUSTOM GLOWING CURSOR ===================== */
function CustomCursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf;
    const move = (e) => { mx = e.clientX; my = e.clientY; if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px)`; };
    const loop = () => { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`; raf = requestAnimationFrame(loop); };
    const over = (e) => { const hit = e.target.closest("a,button,[data-cursor],input,textarea,label"); ring.current?.classList.toggle("cursor-grow", !!hit); };
    addEventListener("mousemove", move); addEventListener("mouseover", over); loop();
    return () => { removeEventListener("mousemove", move); removeEventListener("mouseover", over); cancelAnimationFrame(raf); };
  }, []);
  return (<><div ref={ring} className="cursor-ring" /><div ref={dot} className="cursor-dot" /></>);
}

/* ===================== HELPERS ===================== */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null), [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}s, transform .8s cubic-bezier(.16,1,.3,1) ${delay}s` }}>{children}</div>;
}
function Counter({ to, suffix = "" }) {
  const ref = useRef(null), [n, setN] = useState(0), done = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) { done.current = true; const dur = 1500, s = performance.now();
        const t = (x) => { const p = Math.min((x - s) / dur, 1); setN(Math.round((1 - Math.pow(1 - p, 3)) * to)); if (p < 1) requestAnimationFrame(t); }; requestAnimationFrame(t); }
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}
function SectionLabel({ num, children }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-sm text-indigo-400">{num}</span><span className="font-mono text-sm text-slate-500">/</span>
      <span className="font-mono text-sm tracking-wide text-slate-400 uppercase">{children}</span>
      <span className="flex-1 h-px ml-2" style={{ background: "linear-gradient(90deg,rgba(139,92,246,0.4),transparent)" }} />
    </div>
  );
}
function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => { const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; setP(max > 0 ? (h.scrollTop / max) * 100 : 0); };
    on(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);
  return <div className="fixed top-0 left-0 right-0 z-[60] h-0.5"><div className="h-full" style={{ width: p + "%", background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", boxShadow: "0 0 10px rgba(99,102,241,0.8)" }} /></div>;
}

/* ===================== APP ===================== */
export default function Portfolio() {
  const [page, setPage] = useState("home");
  const [article, setArticle] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMenuOpen(false); scrollTo({ top: 0, behavior: "smooth" }); }, [page, article]);
  const goArticle = (slug) => { setArticle(slug); setPage("article"); };

  const nav = [
    { id: "home", label: "home", num: "01" }, { id: "services", label: "services", num: "02" },
    { id: "reviews", label: "reviews", num: "03" }, { id: "blog", label: "blog", num: "04" },
  ];

  return (
    <div className="nocursor min-h-screen w-full text-slate-200 relative overflow-x-hidden"
      style={{ background: "radial-gradient(1200px 600px at 12% -10%, rgba(59,130,246,0.16), transparent 60%), radial-gradient(1000px 700px at 92% 8%, rgba(139,92,246,0.18), transparent 60%), #07070d", fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @keyframes floatA{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-30px) scale(1.1)}}
        @keyframes floatB{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-50px,40px) scale(1.05)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
        @keyframes scrollX{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes spinSlow{to{transform:rotate(360deg)}}
        @keyframes vdash{to{stroke-dashoffset:-200}}
        @keyframes vpulse{0%,100%{opacity:.35}50%{opacity:1}}
        @keyframes vrow{0%,100%{background:rgba(255,255,255,.03);border-color:rgba(255,255,255,.08)}50%{background:rgba(99,102,241,.16);border-color:rgba(139,92,246,.5)}}
        @keyframes vgrow{from{transform:scaleY(.12)}to{transform:scaleY(1)}}
        @keyframes vcandle{0%,100%{transform:scaleY(.72)}50%{transform:scaleY(1.12)}}
        @keyframes vdraw{to{stroke-dashoffset:0}}
        @keyframes xflash{0%,60%{opacity:0}70%,100%{opacity:1}}
        .fade-up{animation:fadeUp .8s cubic-bezier(.16,1,.3,1) both}
        .mono{font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace}
        .glass{background:rgba(255,255,255,0.035);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.08)}
        .glass-hover{transition:all .4s cubic-bezier(.16,1,.3,1)}
        .glass-hover:hover{transform:translateY(-6px);border-color:rgba(139,92,246,0.55);box-shadow:0 0 45px -8px rgba(99,102,241,0.45);background:rgba(255,255,255,0.055)}
        .grad-text{background:linear-gradient(110deg,#60a5fa,#818cf8,#c084fc,#60a5fa);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 6s linear infinite}
        .grid-bg{background-image:linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);background-size:56px 56px}
        .btn-glow{transition:all .3s}
        .btn-glow:hover{box-shadow:0 0 32px -2px rgba(99,102,241,0.85);transform:translateY(-2px)}
        .marquee{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
        .marquee-track{display:flex;gap:.75rem;width:max-content;animation:scrollX 30s linear infinite}
        .prose-blog p{color:#cbd5e1;line-height:1.8;margin:1rem 0}
        .prose-blog h2{color:#fff;font-size:1.6rem;font-weight:700;margin:2.5rem 0 1rem;scroll-margin-top:96px}
        .prose-blog strong{color:#e9d5ff}
        .cursor-dot{position:fixed;top:0;left:0;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;background:#ddd6fe;pointer-events:none;z-index:99999;mix-blend-mode:screen}
        .cursor-ring{position:fixed;top:0;left:0;width:42px;height:42px;margin:-21px 0 0 -21px;border-radius:50%;pointer-events:none;z-index:99998;background:radial-gradient(circle,rgba(139,92,246,0.4),rgba(59,130,246,0.18) 50%,transparent 72%);box-shadow:0 0 34px 8px rgba(99,102,241,0.32);transition:width .28s,height .28s,margin .28s;mix-blend-mode:screen}
        .cursor-grow{width:84px;height:84px;margin:-42px 0 0 -42px}
        @media (pointer:fine){.nocursor,.nocursor *{cursor:none !important}}
        @media (pointer:coarse){.cursor-dot,.cursor-ring{display:none}}
        ::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:#07070d}::-webkit-scrollbar-thumb{background:linear-gradient(#3b82f6,#8b5cf6);border-radius:8px}
      `}</style>

      <CustomCursor />
      {page === "article" && <ReadingProgress />}

      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute rounded-full blur-3xl" style={{ width: 500, height: 500, top: "-10%", left: "-5%", background: "radial-gradient(circle,rgba(59,130,246,0.2),transparent 70%)", animation: "floatA 18s ease-in-out infinite" }} />
        <div className="absolute rounded-full blur-3xl" style={{ width: 600, height: 600, bottom: "-15%", right: "-10%", background: "radial-gradient(circle,rgba(139,92,246,0.18),transparent 70%)", animation: "floatB 22s ease-in-out infinite" }} />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-50 w-full">
        <div className="glass border-b border-white/5">
          <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
            <button onClick={() => setPage("home")} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", boxShadow: "0 0 22px -3px rgba(99,102,241,0.85)" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.7))" }}>
                  <g fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 9 V5" /><path d="M12 15 V19" /><path d="M9.8 9.8 L6.6 7.2" /><path d="M14.2 14.2 L17.4 16.8" /><path d="M9.8 14.2 L6.6 16.8" /><path d="M14.2 9.8 L17.4 7.2" />
                  </g>
                  <g fill="#fff" style={{ animation: "vpulse 2.4s ease-in-out infinite" }}>
                    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="19" r="1.5" /><circle cx="6.6" cy="7.2" r="1.5" /><circle cx="17.4" cy="16.8" r="1.5" /><circle cx="6.6" cy="16.8" r="1.5" /><circle cx="17.4" cy="7.2" r="1.5" />
                  </g>
                </svg>
              </div>
              <span className="mono text-sm text-white">rehan.nazir<span className="text-indigo-400">()</span></span>
            </button>
            <nav className="hidden md:flex items-center gap-1">
              {nav.map((n) => (
                <button key={n.id} onClick={() => setPage(n.id)} className={"px-3 py-2 rounded-lg text-sm mono transition-all flex items-center gap-1.5 " + ((page === n.id || (page === "article" && n.id === "blog")) ? "text-white" : "text-slate-400 hover:text-white")} style={(page === n.id || (page === "article" && n.id === "blog")) ? { background: "rgba(99,102,241,0.14)", border: "1px solid rgba(139,92,246,0.4)" } : {}}>
                  <span className="text-indigo-400 text-xs">{n.num}</span>{n.label}
                </button>
              ))}
              <button onClick={() => { setPage("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150); }} className="btn-glow ml-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>hire me →</button>
            </nav>
            <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
          {menuOpen && (
            <div className="md:hidden glass border-t border-white/5 px-5 py-3 flex flex-col gap-1">
              {nav.map((n) => (<button key={n.id} onClick={() => setPage(n.id)} className={"px-4 py-3 rounded-lg text-sm mono text-left flex items-center gap-2 " + (page === n.id ? "text-white bg-white/5" : "text-slate-400")}><span className="text-indigo-400 text-xs">{n.num}</span>{n.label}</button>))}
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10" key={page + (article || "")}>
        {page === "home" && <Home setPage={setPage} mounted={mounted} />}
        {page === "services" && <Services setPage={setPage} />}
        {page === "reviews" && <Reviews />}
        {page === "blog" && <Blog openArticle={goArticle} />}
        {page === "article" && (<><BlogPost slug={article} back={() => setPage("blog")} openArticle={goArticle} /><div className="max-w-6xl mx-auto px-5 pb-20 flex justify-center"><button onClick={() => setPage("blog")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-200 glass glass-hover" data-cursor><ArrowLeft className="w-4 h-4" /> Back to all blogs</button></div></>)}
      </main>

      <Footer setPage={setPage} />
    </div>
  );
}

/* ===================== HOME ===================== */
function Home({ setPage, mounted }) {
  // 👇 Your profile photo. Paste a base64 data URL or an image URL here.
  const PROFILE_PIC = rehanPhoto;
  const projects = [
    { n: "01", cat: "FastAPI · Gemini", title: "AI Content Automation API", desc: "Production backend that generates, categorizes and schedules content via LLMs behind a clean REST interface.", role: "Full Stack · AI · 2026", stack: ["FastAPI", "Gemini", "SQLAlchemy"] },
    { n: "02", cat: "n8n · LLMs", title: "B2B Sales Automation Flow", desc: "End-to-end lead enrichment and outreach pipeline that runs hands-free and hands off cleanly to the client.", role: "Automation · 2026", stack: ["n8n", "LLMs", "APIs"] },
    { n: "03", cat: "Python · Gemini", title: "Finance Expense Categorizer", desc: "Turns raw CSV bank exports into categorized, analysis-ready Excel sheets automatically.", role: "AI Tooling · 2025", stack: ["Python", "Gemini", "Pandas"] },
    { n: "04", cat: "RAG · Agents", title: "Support Chatbot Agent", desc: "Context-aware support agent grounded in company docs, deployed across web and messaging channels.", role: "AI Agents · 2025", stack: ["RAG", "Agents", "React"] },
  ];
  const stack = ["Python", "FastAPI", "n8n", "Gemini API", "AI Agents", "RAG", "SQLAlchemy", "React", "Vite", "Tailwind"];
  return (
    <>
      <section className="grid-bg relative">
        <div className="max-w-6xl mx-auto px-5 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className={mounted ? "fade-up" : ""}><div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mono text-indigo-200"><span className="w-2 h-2 rounded-full" style={{ background: "#34d399", boxShadow: "0 0 10px #34d399" }} />Available · Open to projects worldwide</div></div>
            <h1 className="fade-up text-5xl md:text-6xl font-bold tracking-tight text-white mt-6" style={{ animationDelay: ".05s", lineHeight: 1.05 }}>I'm Rehan</h1>
            <h1 className="fade-up text-5xl md:text-6xl font-bold tracking-tight mt-1" style={{ animationDelay: ".12s", lineHeight: 1.05 }}><span className="grad-text">I build AI systems</span></h1>
            <p className="fade-up grad-text text-lg md:text-xl font-semibold mt-4 mono" style={{ animationDelay: ".18s" }}>AI Engineer &amp; Automation Specialist</p>
            <p className="fade-up max-w-lg mt-5 text-slate-400 leading-relaxed" style={{ animationDelay: ".24s" }}>I design and ship <span className="text-slate-200">intelligent automation end to end</span> — AI agents, chatbots and workflows that quietly do the work, so businesses scale without the busywork. Founder of <span className="text-indigo-300">Nexara</span>.</p>
            <div className="fade-up flex flex-wrap gap-3 mt-8" style={{ animationDelay: ".3s" }}>
              <button onClick={() => setPage("services")} className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>View selected work <ArrowRight className="w-4 h-4" /></button>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-200 glass glass-hover">Get in touch</button>
            </div>
          </div>
          <div className="fade-up flex flex-col gap-5" style={{ animationDelay: ".2s" }}>
            <div className="glass rounded-3xl p-7 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(400px 160px at 50% 0%, rgba(139,92,246,0.25), transparent 70%)" }} />
              <div className="relative">
                <div className="block mx-auto w-36 h-36 rounded-full relative">
                  <div className="absolute -inset-1 rounded-full" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", animation: "spinSlow 8s linear infinite", filter: "blur(2px)", opacity: 0.8 }} />
                  <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-white/10 flex items-center justify-center" style={{ background: "#0c0c16" }}>
                    {PROFILE_PIC ? <img src={PROFILE_PIC} alt="Rehan Nazir" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center text-slate-500 px-3 text-center"><Camera className="w-7 h-7 mb-1" /><span className="text-[9px] mono leading-tight">set PROFILE_PIC in code</span></div>}
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg mt-5">Rehan Nazir</h3>
                <p className="text-xs mono text-indigo-300 mt-0.5">// based in Lahore, Pakistan</p>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-xs mx-auto">Self-taught AI engineer building agentic systems and automations. On a mission to grow Nexara into a real AI company — one shipped system at a time.</p>
              </div>
            </div>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5"><span className="w-3 h-3 rounded-full bg-red-400/70" /><span className="w-3 h-3 rounded-full bg-yellow-400/70" /><span className="w-3 h-3 rounded-full bg-green-400/70" /><span className="mono text-xs text-slate-500 ml-2">~/rehan — zsh</span></div>
              <div className="p-4 mono text-xs leading-relaxed">
                <div className="text-slate-500">// whoami.ts</div>
                <div className="mt-1"><span className="text-indigo-400">const</span> <span className="text-sky-300">engineer</span> <span className="text-slate-400">=</span> {"{"}</div>
                <div className="pl-4 text-slate-300">name: <span className="text-emerald-300">"Rehan Nazir"</span>,</div>
                <div className="pl-4 text-slate-300">role: <span className="text-emerald-300">"AI &amp; Automation Eng"</span>,</div>
                <div className="pl-4 text-slate-300">stack: [<span className="text-emerald-300">"FastAPI"</span>, <span className="text-emerald-300">"n8n"</span>, <span className="text-emerald-300">"LLMs"</span>],</div>
                <div className="pl-4 text-slate-300">shipping: <span className="text-purple-300">true</span>,</div>
                <div>{"}"};</div>
                <div className="mt-2 text-slate-500">// → ready to build something great <span className="inline-block w-2 h-3.5 align-middle" style={{ background: "#a78bfa", animation: "blink 1s step-end infinite" }} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-8">
        <div className="grid sm:grid-cols-3 gap-4">
          <Reveal className="glass rounded-2xl p-5"><div className="flex items-center justify-between"><span className="mono text-xs text-slate-500">automation activity · 7d</span><GitBranch className="w-4 h-4 text-indigo-400" /></div><div className="text-2xl font-bold text-white mt-3">128 <span className="text-sm font-normal text-slate-500">flows run</span></div><div className="flex gap-1 mt-3">{Array.from({ length: 14 }).map((_, i) => (<span key={i} className="flex-1 h-7 rounded" style={{ background: `rgba(139,92,246,${0.15 + (i % 5) * 0.16})` }} />))}</div></Reveal>
          <Reveal delay={0.08} className="glass rounded-2xl p-5"><div className="flex items-center justify-between"><span className="mono text-xs text-slate-500">inference · gemini</span><Activity className="w-4 h-4 text-indigo-400" /></div><div className="mt-3 space-y-1.5 mono text-xs">{[["POST", "/api/generate", "200"], ["GET", "/api/agents", "200"], ["POST", "/api/embed", "200"]].map(([m, p, s]) => (<div key={p} className="flex items-center gap-2"><span className="text-purple-300 w-9">{m}</span><span className="text-slate-400 flex-1 truncate">{p}</span><span className="text-emerald-400">{s}</span></div>))}</div></Reveal>
          <Reveal delay={0.16} className="glass rounded-2xl p-5"><div className="flex items-center justify-between"><span className="mono text-xs text-slate-500">nexara roadmap</span><span className="mono text-xs text-indigo-300">71%</span></div><div className="mt-3 text-sm text-slate-400">10 / 14 shipped</div><div className="h-2 rounded-full bg-white/5 mt-3 overflow-hidden"><div className="h-full rounded-full" style={{ width: "71%", background: "linear-gradient(90deg,#3b82f6,#8b5cf6)" }} /></div></Reveal>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <Reveal><SectionLabel num="01">About</SectionLabel></Reveal>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">I live where <span className="grad-text">product meets AI</span>.</h2>
            <p className="text-slate-400 mt-5 leading-relaxed">I take ideas from a blank repo to a deployed, self-running system — designing the data model, wiring the APIs and the agents, and delivering something a business can actually rely on.</p>
            <p className="text-slate-400 mt-4 leading-relaxed">Lately that means <span className="text-slate-200">AI content APIs, n8n automations and chatbot agents</span> built on Python, FastAPI and the Gemini API — with a focus on clean handoff, not babysitting.</p>
            <p className="mono text-sm text-indigo-300 mt-5">// currently — Founder @ Nexara</p>
          </Reveal>
          <Reveal delay={0.1}><div className="grid grid-cols-2 gap-4">{[["12", "+", "Projects shipped"], ["8", "", "AI products built"], ["10", "+", "Happy clients"], ["100", "%", "Hands-off delivery"]].map(([v, s, l]) => (<div key={l} className="glass glass-hover rounded-2xl p-6" data-cursor><div className="text-4xl font-bold grad-text"><Counter to={parseInt(v)} suffix={s} /></div><div className="text-sm text-slate-400 mt-1">{l}</div></div>))}</div></Reveal>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <Reveal><SectionLabel num="02">Tech stack</SectionLabel></Reveal>
        <Reveal><h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Tools I reach for to ship end-to-end.</h2></Reveal>
        <div className="marquee py-2"><div className="marquee-track">{[...stack, ...stack].map((s, i) => (<span key={i} className="px-5 py-2.5 rounded-full text-sm mono glass text-slate-200 whitespace-nowrap">{s}</span>))}</div></div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <Reveal><SectionLabel num="03">Selected work</SectionLabel></Reveal>
        <Reveal><h2 className="text-3xl md:text-4xl font-bold text-white mb-10">Things I've shipped.</h2></Reveal>
        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="glass glass-hover rounded-2xl p-6 h-full group" data-cursor>
                <div className="flex items-center justify-between"><span className="mono text-xs text-slate-500">[ {p.n} / 04 ]</span><span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 mono"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />live</span></div>
                <div className="mono text-[11px] uppercase tracking-wide text-indigo-300/80 mt-5">{p.cat}</div>
                <h3 className="text-lg font-semibold text-white mt-1 flex items-center gap-2">{p.title}<ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-indigo-300 transition-colors" /></h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
                <div className="mono text-xs text-slate-500 mt-4">{p.role}</div>
                <div className="flex flex-wrap gap-1.5 mt-3">{p.stack.map((s) => (<span key={s} className="px-2.5 py-1 rounded-md text-[11px] mono" style={{ background: "rgba(99,102,241,0.12)", color: "#c7d2fe" }}>{s}</span>))}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <ContactSection />
    </>
  );
}

/* ===================== SERVICES ===================== */
function Services({ setPage }) {
  const services = [
    { icon: <MessageSquare className="w-6 h-6" />, title: "AI Chatbots & Agents", desc: "Context-aware assistants and autonomous agents trained on your data, deployed across web and messaging.", points: ["RAG over your docs", "Multi-channel deploy", "Human-in-the-loop ready"] },
    { icon: <TrendingUp className="w-6 h-6" />, title: "B2B Sales Automation", desc: "Lead enrichment, qualification and personalized outreach pipelines that run without manual lifting.", points: ["Lead enrichment", "Personalized outreach", "CRM sync"] },
    { icon: <Layers className="w-6 h-6" />, title: "Content Automation APIs", desc: "Production-grade FastAPI backends that generate, categorize and schedule content via LLMs.", points: ["REST API", "LLM pipelines", "Scalable backend"] },
    { icon: <Workflow className="w-6 h-6" />, title: "Custom Workflow Automation", desc: "End-to-end n8n + AI workflows that connect your tools and remove repetitive ops entirely.", points: ["n8n orchestration", "API integrations", "Hands-off handoff"] },
    { icon: <Cpu className="w-6 h-6" />, title: "Agentic Systems", desc: "Multi-step reasoning agents that plan, call tools and execute tasks autonomously.", points: ["Tool calling", "Task planning", "Reliable execution"] },
    { icon: <Code className="w-6 h-6" />, title: "SaaS MVP Builds", desc: "From idea to a polished, futuristic web product — frontend, backend and AI baked in.", points: ["React + Vite", "API backend", "Modern UI/UX"] },
  ];
  const process = [
    { n: "01", t: "Discovery", d: "We map your bottleneck and define exactly what 'done' looks like." },
    { n: "02", t: "Design", d: "I architect the automation and align on scope, stack and timeline." },
    { n: "03", t: "Build", d: "I develop, test and refine the system until it runs reliably." },
    { n: "04", t: "Handoff", d: "You get a documented, self-running system — no babysitting." },
  ];
  return (
    <>
      <section className="grid-bg"><div className="max-w-6xl mx-auto px-5 pt-20 pb-6">
        <Reveal><SectionLabel num="02">Services</SectionLabel></Reveal>
        <Reveal><h1 className="fade-up text-4xl md:text-5xl font-bold text-white leading-tight">Services built to <span className="grad-text">run themselves</span>.</h1></Reveal>
        <Reveal delay={0.1}><p className="max-w-2xl mt-5 text-slate-400">I don't just hand you scripts — I build and deliver automated systems your business can rely on.</p></Reveal>
      </div></section>
      <section className="max-w-6xl mx-auto px-5 py-12"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => (<Reveal key={s.title} delay={(i % 3) * 0.08}><div className="glass glass-hover rounded-2xl p-6 h-full" data-cursor><div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5" style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.9),rgba(139,92,246,0.9))" }}>{s.icon}</div><h3 className="text-lg font-semibold text-white">{s.title}</h3><p className="text-sm text-slate-400 mt-2 leading-relaxed">{s.desc}</p><div className="mt-4 space-y-2">{s.points.map((pt) => (<div key={pt} className="flex items-center gap-2 text-sm text-slate-300"><CircleCheck className="w-4 h-4 text-indigo-400 shrink-0" />{pt}</div>))}</div></div></Reveal>))}
      </div></section>
      <section className="max-w-6xl mx-auto px-5 py-12"><Reveal><SectionLabel num="03">How it works</SectionLabel></Reveal><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{process.map((p, i) => (<Reveal key={p.n} delay={i * 0.08}><div className="glass rounded-2xl p-6 h-full" data-cursor><div className="text-4xl font-bold grad-text mono">{p.n}</div><h3 className="text-white font-semibold mt-3">{p.t}</h3><p className="text-sm text-slate-400 mt-2">{p.d}</p></div></Reveal>))}</div></section>
      <section className="max-w-6xl mx-auto px-5 py-16"><Reveal><div className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(139,92,246,0.18))", border: "1px solid rgba(139,92,246,0.35)" }}><div className="absolute inset-0" style={{ background: "radial-gradient(500px 200px at 50% 0%,rgba(139,92,246,0.3),transparent 70%)" }} /><div className="relative"><Zap className="w-10 h-10 mx-auto text-indigo-300 mb-4" /><h2 className="text-3xl md:text-4xl font-bold text-white">Have a process worth automating?</h2><p className="text-slate-300 mt-3 max-w-lg mx-auto">Tell me about your bottleneck and I'll show you how AI can handle it.</p><button onClick={() => setPage("reviews")} className="btn-glow inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-white mt-7" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Start a project <ArrowRight className="w-4 h-4" /></button></div></div></Reveal></section>
    </>
  );
}

/* ===================== REVIEWS ===================== */
function Reviews() {
  const reviews = [
    { name: "Sarah Khan", role: "Founder, BrightLeads", rating: 5, text: "Rehan rebuilt our entire lead pipeline as an automated system. What used to take hours now runs on its own. Genuinely impressive." },
    { name: "Daniel Mehta", role: "CEO, NovaCommerce", rating: 5, text: "The support chatbot he delivered handles 70% of our tickets. Clean handoff, great docs, zero headaches." },
    { name: "Aisha Raza", role: "Ops Lead, FinTrack", rating: 5, text: "Our CSV chaos is gone. The categorizer he built just works. Fast, reliable, exactly what we asked for." },
    { name: "Omar Siddiqui", role: "Director, ScaleHub", rating: 5, text: "Communicated clearly the whole way and delivered a system that runs without us touching it. Will hire again." },
    { name: "Lena Fischer", role: "Marketing Head, Vireo", rating: 4, text: "The content automation API saved us a ton of time. Solid backend work and responsive throughout." },
    { name: "Hamza Ali", role: "Owner, HN Foods", rating: 5, text: "Built our site and automated our order flow beautifully. Professional, futuristic and on time." },
  ];
  return (
    <>
      <section className="grid-bg"><div className="max-w-6xl mx-auto px-5 pt-20 pb-6"><Reveal><SectionLabel num="03">Client trust</SectionLabel></Reveal><Reveal><h1 className="text-4xl md:text-5xl font-bold text-white">What clients <span className="grad-text">say</span>.</h1></Reveal><Reveal delay={0.1}><p className="max-w-2xl mt-5 text-slate-400">Real results, delivered as systems that keep working long after handoff.</p></Reveal></div></section>
      <section className="max-w-6xl mx-auto px-5 py-10"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[["12", "+", "Projects"], ["10", "+", "Clients"], ["4", ".9", "Avg rating"], ["100", "%", "On-time"]].map(([v, s, l]) => (<Reveal key={l}><div className="glass glass-hover rounded-2xl py-7 text-center" data-cursor><div className="text-3xl font-bold grad-text"><Counter to={parseInt(v)} suffix={s} /></div><div className="text-xs text-slate-400 mt-1">{l}</div></div></Reveal>))}</div></section>
      <section className="max-w-6xl mx-auto px-5 py-8"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{reviews.map((r, i) => (<Reveal key={r.name} delay={(i % 3) * 0.08}><div className="glass glass-hover rounded-2xl p-6 flex flex-col h-full" data-cursor><div className="flex gap-1 mb-4">{Array.from({ length: 5 }).map((_, j) => (<Star key={j} className="w-4 h-4" style={{ fill: j < r.rating ? "#a78bfa" : "transparent", color: j < r.rating ? "#a78bfa" : "#3f3f5a" }} />))}</div><p className="text-sm text-slate-300 leading-relaxed flex-1">"{r.text}"</p><div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/5"><div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>{r.name.split(" ").map((w) => w[0]).join("")}</div><div><div className="text-sm font-medium text-white">{r.name}</div><div className="text-xs text-slate-400">{r.role}</div></div></div></div></Reveal>))}</div></section>
      <ContactSection />
    </>
  );
}

/* ---- futuristic animated blog visuals ---- */
function BlogVisual({ cat }) {
  const wrap = (art) => (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#0a0a13" }}>
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 0%,rgba(99,102,241,0.14),transparent 60%)" }} />
      {art}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(150% 100% at 50% 0%,rgba(139,92,246,0.22),transparent 60%)" }} />
    </div>
  );
  if (cat === "Engineering") return wrap(
    <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-5 mono text-[10px]">
      <div className="text-slate-500">// content-api · live</div>
      {[["POST", "/v1/generate"], ["GET", "/v1/content"], ["POST", "/v1/schedule"]].map((r, i) => (<div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border" style={{ animation: `vrow 3s ease-in-out ${i * 0.6}s infinite`, borderColor: "rgba(255,255,255,0.08)" }}><span className="text-purple-300 w-9">{r[0]}</span><span className="text-slate-300 flex-1 truncate">{r[1]}</span><span className="text-emerald-400">200</span></div>))}
      <div className="text-slate-600">{"{ engine: gemini }"}<span className="inline-block w-1.5 h-3 ml-1 align-middle" style={{ background: "#a78bfa", animation: "blink 1s step-end infinite" }} /></div>
    </div>
  );
  if (cat === "AI Agents") return wrap(
    <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
      <defs><filter id="gr" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <path d="M30,75 H270" fill="none" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" strokeDasharray="4 6" style={{ animation: "vdash 1.2s linear infinite" }} />
      {[[6, "query"], [66, "embed"], [126, "vDB"], [186, "LLM"], [246, "answer"]].map(([x, l], i) => (<g key={i}><rect x={x} y="60" width="48" height="30" rx="6" fill="rgba(13,12,28,0.95)" stroke="rgba(139,92,246,0.55)" />{l === "vDB" ? [0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={x + 16 + c * 8} cy={70 + r * 5} r="1.4" fill="#818cf8" style={{ animation: `vpulse 1.6s ease-in-out ${(r + c) * 0.15}s infinite` }} />)) : <text x={x + 24} y="79" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill="#c7d2fe">{l}</text>}</g>))}
      <circle r="3.5" fill="#ddd6fe" filter="url(#gr)"><animateMotion dur="2.8s" repeatCount="indefinite" path="M30,75 H270" /></circle>
    </svg>
  );
  if (cat === "Workflow") { const paths = ["M84,47 C104,47 100,80 120,80", "M84,113 C104,113 100,80 120,80", "M184,80 C200,80 208,80 224,80"]; return wrap(
    <svg viewBox="0 0 300 160" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
      <defs><filter id="gw" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter><marker id="awf" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#818cf8" /></marker></defs>
      {paths.map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" strokeDasharray="4 5" markerEnd="url(#awf)" style={{ animation: "vdash 1s linear infinite" }} />)}
      {[[20, 32, "trigger"], [20, 98, "http"], [120, 65, "AI agent"], [224, 65, "send"]].map(([x, y, l], i) => (<g key={i}><rect x={x} y={y} width={l === "send" ? 56 : 64} height="30" rx="7" fill="rgba(13,12,28,0.96)" stroke="rgba(139,92,246,0.6)" /><circle cx={x + 12} cy={y + 15} r="3" fill="#818cf8" style={{ animation: `vpulse 2s ease-in-out ${i * 0.3}s infinite` }} /><text x={x + (l === "send" ? 34 : 38)} y={y + 19} textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill="#c7d2fe">{l}</text></g>))}
      {paths.map((d, i) => <circle key={`d${i}`} r="3" fill="#ddd6fe" filter="url(#gw)"><animateMotion dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} /></circle>)}
    </svg>
  ); }
  if (cat === "Strategy") { const bars = [[55, 40, "DFY"], [140, 70, "Product"], [225, 100, "SaaS"]]; return wrap(
    <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
      <defs><filter id="gs" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter><linearGradient id="barG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#3b82f6" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
      <line x1="20" y1="130" x2="285" y2="130" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {bars.map(([x, h, l], i) => (<g key={i}><rect x={x} y={130 - h} width="42" height={h} rx="4" fill="url(#barG)" style={{ transformBox: "fill-box", transformOrigin: "bottom", animation: `vgrow 1.1s cubic-bezier(.16,1,.3,1) ${i * 0.2}s both` }} /><text x={x + 21} y="144" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#a5b4fc">{l}</text></g>))}
      <polyline points="76,90 161,60 246,30" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="260" strokeDashoffset="260" style={{ animation: "vdraw 1.4s ease 0.6s forwards" }} />
      <circle cx="246" cy="30" r="4" fill="#ddd6fe" filter="url(#gs)" style={{ animation: "vpulse 1.6s ease-in-out infinite" }} />
    </svg>
  ); }
  if (cat === "Trading") { const c = [[34, 36, 112, 56, 30, 1], [66, 50, 122, 70, 26, 0], [98, 30, 100, 48, 34, 1], [130, 46, 116, 62, 28, 0], [162, 28, 96, 44, 30, 1], [194, 42, 108, 56, 26, 0], [226, 26, 92, 40, 32, 1], [258, 38, 102, 52, 30, 1]]; return wrap(
    <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
      <defs><filter id="gt" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      {c.map((k, i) => { const col = k[5] ? "#818cf8" : "#c084fc"; return (<g key={i} style={{ transformBox: "fill-box", transformOrigin: "center", animation: `vcandle 3s ease-in-out ${i * 0.18}s infinite` }}><line x1={k[0]} y1={k[1]} x2={k[0]} y2={k[2]} stroke={col} strokeWidth="1.2" /><rect x={k[0] - 5} y={k[3]} width="10" height={k[4]} rx="1.5" fill={col} opacity="0.9" /></g>); })}
      <polyline points="34,72 66,84 98,66 130,80 162,64 194,78 226,60 258,70" fill="none" stroke="#ddd6fe" strokeWidth="1.6" strokeDasharray="320" strokeDashoffset="320" style={{ animation: "vdraw 2s ease forwards" }} filter="url(#gt)" />
      <text x="150" y="142" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#94a3b8">↻ data → pattern → test → execute</text>
    </svg>
  ); }
  return wrap(
    <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
      <defs><filter id="gauto" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter><marker id="aauto" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#818cf8" /></marker></defs>
      <path d="M50,82 H250" fill="none" stroke="rgba(139,92,246,0.45)" strokeWidth="1.5" strokeDasharray="4 6" style={{ animation: "vdash 1.2s linear infinite" }} />
      {[[35, "trigger"], [120, "AI agent"], [205, "action"]].map(([x, l], i) => (<g key={i}><rect x={x} y="66" width="60" height="32" rx="7" fill="rgba(13,12,28,0.96)" stroke="rgba(139,92,246,0.6)" /><text x={+x + 30} y="85" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#c7d2fe">{l}</text></g>))}
      <path d="M180,66 C198,26 102,26 120,66" fill="none" stroke="#818cf8" strokeWidth="1.5" markerEnd="url(#aauto)" />
      <text x="150" y="36" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#a5b4fc">↻ runs itself</text>
      <circle r="3.5" fill="#ddd6fe" filter="url(#gauto)"><animateMotion dur="2.4s" repeatCount="indefinite" path="M50,82 H250" /></circle>
    </svg>
  );
}

/* ===================== BLOG ===================== */
const POSTS = [
  { slug: "systems-not-scripts", title: "Why I build systems, not scripts", cat: "Automation", date: "12 Jun 2026", read: "6 min", excerpt: "The real value of AI automation isn't a clever script — it's a system a business can rely on without you. How I think about the difference.", featured: true },
  { slug: "production-ai-content-api", title: "Building a production AI content API", cat: "Engineering", date: "28 May 2026", read: "8 min", excerpt: "Architecting a FastAPI + Gemini backend that's clean, scalable and ready to hand off to a client." },
  { slug: "rag-chatbots-that-help", title: "RAG chatbots that actually help", cat: "AI Agents", date: "14 May 2026", read: "6 min", excerpt: "Most chatbots frustrate users. The fix is grounding them in real context. A practical look at retrieval-augmented agents." },
  { slug: "n8n-llms-freelancer-edge", title: "n8n + LLMs: the freelancer's edge", cat: "Workflow", date: "30 Apr 2026", read: "4 min", excerpt: "How combining n8n orchestration with language models lets a solo builder deliver agency-level automation." },
  { slug: "freelancing-to-ai-company", title: "From freelancing to an AI company", cat: "Strategy", date: "18 Apr 2026", read: "7 min", excerpt: "My roadmap from done-for-you services to a productized SaaS — and the niche decisions driving it." },
  { slug: "algo-trading-meets-automation", title: "Algorithmic trading meets automation", cat: "Trading", date: "02 Apr 2026", read: "6 min", excerpt: "Trading, ML and automation share one loop: data → pattern → test → execute. Why learning them together compounds." },
];

function Blog({ openArticle }) {
  const feat = POSTS[0];
  return (
    <>
      <section className="grid-bg"><div className="max-w-6xl mx-auto px-5 pt-20 pb-6"><Reveal><SectionLabel num="04">Blog</SectionLabel></Reveal><Reveal><h1 className="text-4xl md:text-5xl font-bold text-white">Notes on building <span className="grad-text">with AI</span>.</h1></Reveal><Reveal delay={0.1}><p className="max-w-2xl mt-5 text-slate-400">Thoughts on AI, automation, building systems and the road to a real tech company.</p></Reveal></div></section>
      <section className="max-w-6xl mx-auto px-5 py-10">
        <Reveal><div className="group glass glass-hover rounded-3xl overflow-hidden grid md:grid-cols-2" data-cursor>
          <div className="relative min-h-[220px] overflow-hidden"><BlogVisual cat={feat.cat} /></div>
          <div className="p-8 flex flex-col justify-center">
            <span className="text-xs mono px-3 py-1 rounded-full glass w-fit text-indigo-200 mb-4">featured</span>
            <h2 className="text-2xl font-bold text-white">{feat.title}</h2>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">{feat.excerpt}</p>
            <div className="flex items-center gap-4 mt-5 text-xs mono text-slate-500"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{feat.date}</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{feat.read}</span></div>
            <button onClick={() => openArticle(feat.slug)} className="btn-glow mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white w-fit" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Read article <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div></Reveal>
      </section>
      <section className="max-w-6xl mx-auto px-5 py-6"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {POSTS.slice(1).map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.08}>
            <article className="glass glass-hover rounded-2xl overflow-hidden group h-full flex flex-col" data-cursor>
              <div className="h-40 relative overflow-hidden"><BlogVisual cat={p.cat} /><span className="absolute top-3 left-3 z-10 text-[11px] mono px-2.5 py-1 rounded-full text-white" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}>{p.cat}</span></div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-white font-semibold leading-snug group-hover:text-indigo-200 transition-colors">{p.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed flex-1">{p.excerpt}</p>
                <div className="flex items-center gap-4 mt-4 text-xs mono text-slate-500"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{p.date}</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{p.read}</span></div>
                <button onClick={() => openArticle(p.slug)} className="mt-4 inline-flex items-center gap-1.5 text-sm mono text-indigo-300 hover:text-white transition-colors w-fit">Read article →</button>
              </div>
            </article>
          </Reveal>
        ))}
      </div></section>
    </>
  );
}

/* ===================== ARTICLE DIAGRAMS ===================== */
function ArtHeroLoop() {
  const ring = "M160,42 A 80,58 0 1 1 159.9,42";
  const nodes = [[160, 42, "trigger"], [240, 100, "process"], [160, 158, "verify"], [80, 100, "deliver"]];
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <defs><filter id="gh1" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <path d={ring} fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="1.6" strokeDasharray="5 7" style={{ animation: "vdash 1.4s linear infinite" }} />
      <circle cx="160" cy="100" r="30" fill="rgba(99,102,241,0.1)" stroke="rgba(139,92,246,0.45)" />
      <text x="160" y="97" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#c7d2fe">runs</text>
      <text x="160" y="110" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#c7d2fe">itself ↻</text>
      {nodes.map(([x, y, l], i) => (<g key={i}><circle cx={x} cy={y} r="5" fill="#818cf8" style={{ animation: `vpulse 2s ease-in-out ${i * 0.4}s infinite` }} /><rect x={x - 34} y={y - 26} width="68" height="18" rx="5" fill="rgba(13,12,28,0.92)" stroke="rgba(139,92,246,0.5)" /><text x={x} y={y - 13} textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#c7d2fe">{l}</text></g>))}
      <circle r="4.5" fill="#ddd6fe" filter="url(#gh1)"><animateMotion dur="5s" repeatCount="indefinite" path={ring} /></circle>
    </svg>
  );
}
function ArtCompare() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="glass rounded-2xl p-5 relative overflow-hidden">
        <div className="mono text-xs text-rose-300 mb-3">// the script</div>
        <svg viewBox="0 0 240 90" className="w-full"><defs><marker id="m1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fb7185" /></marker></defs>
          <line x1="20" y1="45" x2="200" y2="45" stroke="rgba(244,114,182,0.4)" strokeWidth="1.5" markerEnd="url(#m1)" />
          <rect x="90" y="30" width="60" height="30" rx="6" fill="rgba(13,12,28,0.95)" stroke="rgba(244,114,182,0.5)" /><text x="120" y="49" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#fda4af">run()</text>
          <text x="10" y="49" fontFamily="monospace" fontSize="9" fill="#94a3b8">in</text>
          <text x="206" y="40" fontFamily="monospace" fontSize="14" fill="#fb7185" style={{ animation: "xflash 2.2s ease-in-out infinite" }}>✗</text>
          <circle r="3" fill="#fda4af"><animateMotion dur="2.2s" repeatCount="indefinite" path="M20,45 H200" /></circle>
        </svg>
        <p className="text-xs text-slate-400 mt-2">One shot. The moment reality drifts, it breaks — silently.</p>
      </div>
      <div className="glass rounded-2xl p-5 relative overflow-hidden">
        <div className="mono text-xs text-emerald-300 mb-3">// the system</div>
        <svg viewBox="0 0 240 90" className="w-full"><defs><filter id="gh2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          <path d="M120,68 A 50,28 0 1 1 119.9,68" fill="none" stroke="rgba(52,211,153,0.45)" strokeWidth="1.5" strokeDasharray="4 5" style={{ animation: "vdash 1.3s linear infinite" }} />
          <rect x="92" y="30" width="56" height="26" rx="6" fill="rgba(13,12,28,0.95)" stroke="rgba(52,211,153,0.5)" /><text x="120" y="47" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6ee7b7">system</text>
          <text x="120" y="16" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6ee7b7">✓ ↻</text>
          <circle r="3.5" fill="#a7f3d0" filter="url(#gh2)"><animateMotion dur="3s" repeatCount="indefinite" path="M120,68 A 50,28 0 1 1 119.9,68" /></circle>
        </svg>
        <p className="text-xs text-slate-400 mt-2">Loops, recovers, logs, keeps running while you sleep.</p>
      </div>
    </div>
  );
}
function ArtPipeline() {
  return (
    <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid meet" className="w-full">
      <defs><filter id="gp1" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter><marker id="mp1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#818cf8" /></marker></defs>
      <path d="M40,95 H280" fill="none" stroke="rgba(139,92,246,0.45)" strokeWidth="1.5" strokeDasharray="4 6" style={{ animation: "vdash 1.2s linear infinite" }} />
      {[[12, "trigger"], [92, "process"], [172, "verify"], [252, "handoff"]].map(([x, l], i) => (<g key={i}><rect x={x} y="80" width="60" height="30" rx="7" fill="rgba(13,12,28,0.96)" stroke="rgba(139,92,246,0.6)" /><text x={+x + 30} y="99" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill="#c7d2fe">{l}</text><circle cx={+x + 30} cy="70" r="3" fill="#818cf8" style={{ animation: `vpulse 2s ease-in-out ${i * 0.3}s infinite` }} /></g>))}
      <path d="M282,80 C300,30 30,30 38,80" fill="none" stroke="#818cf8" strokeWidth="1.3" strokeDasharray="4 5" markerEnd="url(#mp1)" style={{ animation: "vdash 1.4s linear infinite" }} />
      <text x="160" y="36" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#a5b4fc">↻ repeats on every event</text>
      <circle r="3.5" fill="#ddd6fe" filter="url(#gp1)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M40,95 H280" /></circle>
    </svg>
  );
}

/* ===================== BLOG POST ===================== */
function BlogPost({ slug, back, openArticle }) {
  const meta = POSTS.find((p) => p.slug === slug) || POSTS[0];
  const isMain = slug === "systems-not-scripts";
  const sections = [
    { id: "the-script-trap", t: "The script trap" },
    { id: "what-a-system-is", t: "What a system actually is" },
    { id: "four-properties", t: "The four properties of a real system" },
    { id: "worked-example", t: "From script to system: a worked example" },
    { id: "handoff-is-the-product", t: "The handoff is the product" },
    { id: "cost-of-getting-it-wrong", t: "What it costs to get wrong" },
    { id: "faq", t: "Frequently asked questions" },
    { id: "where-next", t: "Where to go next" },
  ];
  const [active, setActive] = useState(sections[0].id);
  useEffect(() => {
    if (!isMain) return;
    const obs = new IntersectionObserver((entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [isMain]);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const Back = () => (
    <button onClick={back} className="inline-flex items-center gap-2 text-sm mono text-slate-400 hover:text-indigo-300 transition-colors mb-8"><ArrowLeft className="w-4 h-4" /> All blog posts</button>
  );

  if (!isMain) {
    return (
      <div className="max-w-3xl mx-auto px-5 pt-12 pb-24">
        <Back />
        <span className="text-xs mono px-3 py-1 rounded-full glass text-indigo-200">{meta.cat}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mt-5 leading-tight">{meta.title}</h1>
        <p className="text-slate-400 mt-4">{meta.excerpt}</p>
        <div className="glass rounded-2xl p-10 mt-10 text-center">
          <BookOpen className="w-10 h-10 mx-auto text-indigo-300 mb-4" />
          <h2 className="text-xl font-semibold text-white">This article is coming soon.</h2>
          <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">The full write-up for this post is still in drafts. The "Why I build systems, not scripts" article is fully built out — open that one to see the complete layout.</p>
          <button onClick={() => openArticle("systems-not-scripts")} className="btn-glow mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Read the finished article <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-6xl mx-auto px-5 pt-12 pb-24">
      <Back />
      {/* header */}
      <Reveal>
        <span className="text-xs mono px-3 py-1 rounded-full glass text-indigo-200">{meta.cat}</span>
        <h1 className="text-3xl md:text-5xl font-bold text-white mt-5 leading-tight max-w-3xl">{meta.title}</h1>
        <p className="text-lg text-slate-400 mt-4 max-w-2xl leading-relaxed">A field note on the one shift that changed my work, my pricing, and how long my clients stick around — moving from one-shot scripts to systems that run themselves.</p>
        <div className="flex items-center gap-3 mt-6">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>RN</div>
          <span className="text-sm text-slate-300">Rehan Nazir</span><span className="text-slate-600">·</span>
          <span className="text-sm mono text-slate-500">{meta.date}</span><span className="text-slate-600">·</span><span className="text-sm mono text-slate-500">{meta.read} read</span>
        </div>
      </Reveal>
      {/* hero diagram */}
      <Reveal delay={0.1}><div className="glass rounded-3xl mt-8 p-4 h-64 relative overflow-hidden"><div className="absolute inset-0 grid-bg opacity-40" /><ArtHeroLoop /></div></Reveal>

      {/* body grid */}
      <div className="grid lg:grid-cols-[240px_1fr] gap-10 mt-12">
        {/* TOC sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mono text-xs text-slate-500 uppercase tracking-wide mb-4"><List className="w-4 h-4" /> On this page</div>
            <nav className="flex flex-col gap-1 border-l border-white/8">
              {sections.map((s) => (
                <button key={s.id} onClick={() => go(s.id)} className={"text-left text-sm pl-4 py-1.5 -ml-px border-l transition-all " + (active === s.id ? "text-white border-indigo-400" : "text-slate-500 border-transparent hover:text-slate-300")} style={active === s.id ? { borderColor: "#818cf8" } : {}}>{s.t}</button>
              ))}
            </nav>
          </div>
        </aside>

        {/* article content */}
        <div className="prose-blog max-w-2xl">
          <p>Every freelancer who learns to automate ships the same first thing: a script. It runs, it does the task, the demo gets a "wow." Then a month later the client is back doing the work by hand and quietly wondering what they paid for. I've watched this happen enough times to build my whole practice around avoiding it. The difference between a script and a system is the difference between a one-time favor and a piece of infrastructure — and it's the single most important idea in applied automation.</p>

          <h2 id="the-script-trap">The script trap</h2>
          <p>A script is a one-shot tool. It assumes a perfect world: the file is always named the way it was last Tuesday, the API never times out, and a human remembers to run it at the right moment. It's fast to write and genuinely impressive in a controlled demo. That's exactly what makes it a trap.</p>
          <p>The moment reality drifts — a renamed column, a rate limit, a forgotten run — the script fails. Usually <strong>silently</strong>. There's no log, no alert, no retry. The client doesn't find out until the numbers look wrong, and by then the trust is already spent. You didn't ship something broken; you shipped something fragile, which is worse because it looks finished.</p>
          <Reveal><div className="my-8"><ArtCompare /></div></Reveal>

          <h2 id="what-a-system-is">What a system actually is</h2>
          <p>A system is a script that grew up. It doesn't assume the happy path — it expects failure and is built to survive it. It triggers itself, recovers from errors, writes down what it did, tells someone when it can't, and keeps running while you're asleep. The logic in the middle might be nearly identical; everything around it is what makes it a system.</p>
          <blockquote className="border-l-2 pl-5 my-7 italic text-slate-300" style={{ borderColor: "#818cf8" }}><Quote className="w-5 h-5 text-indigo-400 mb-2" />A script is something you run. A system is something that runs. That one-word change is the whole job.</blockquote>

          <h2 id="four-properties">The four properties of a real system</h2>
          <p>When I'm deciding whether something is ready to hand over, I check it against four properties. If any one is missing, it's still a script wearing a system's clothes.</p>
          <div className="grid sm:grid-cols-2 gap-3 my-6 not-prose">
            {[["Autonomy", "It triggers itself — on a schedule, a webhook, or an event. No human in the loop to remember it."], ["Resilience", "It expects failure: retries, timeouts, and fallbacks so one bad API call doesn't take the whole thing down."], ["Observability", "It logs what it did and alerts a human the moment it can't, so problems surface before the client notices."], ["Handoff-ready", "It's documented and owned by the client — env vars, a runbook, and a kill switch they control."]].map(([t, d]) => (
              <div key={t} className="glass rounded-xl p-4"><div className="flex items-center gap-2 text-white font-semibold text-sm"><CircleCheck className="w-4 h-4 text-indigo-400" />{t}</div><p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{d}</p></div>
            ))}
          </div>
          <Reveal><div className="glass rounded-2xl p-4 my-8 relative overflow-hidden"><div className="absolute inset-0 grid-bg opacity-30" /><ArtPipeline /><p className="text-xs text-center text-slate-500 mt-1 relative">Trigger → process → verify → handoff, looping on every event — the shape of every system I ship.</p></div></Reveal>

          <h2 id="worked-example">From script to system: a worked example</h2>
          <p>Take a common job: enriching inbound leads. The script version is a Python file you run by hand — it reads a CSV, calls an enrichment API, and writes a new CSV. It works on Tuesday. On Wednesday the API rate-limits halfway through and you get a half-finished file with no error.</p>
          <p>The system version does the same enrichment, but it's triggered by a webhook the moment a lead arrives, validates each field, retries on failure, writes straight into the CRM, and pings a Slack channel if anything looks off. Same core logic — wrapped in autonomy, resilience, and observability.</p>
          <div className="not-prose my-6 rounded-xl overflow-hidden glass">
            <div className="px-4 py-2 border-b border-white/5 mono text-xs text-slate-500">// script → system</div>
            <pre className="p-4 mono text-xs leading-relaxed overflow-x-auto text-slate-300">{`# script: you run this, and hope
rows = read_csv("leads.csv")
for r in rows:
    r["data"] = enrich(r)      # no retry, no log
write_csv(rows)                # silent half-failures

# system: it runs itself, and tells you
@on_webhook("/lead")
def handle(lead):
    data = with_retry(enrich, lead)   # resilient
    crm.upsert(validate(data))        # verified
    log.info("enriched", lead.id)     # observable
    if not data: alert.slack("check lead", lead.id)`}</pre>
          </div>

          <h2 id="handoff-is-the-product">The handoff is the product</h2>
          <p>Here's the part most builders skip: a system the client can't operate isn't finished, no matter how well it runs on your machine. The deliverable isn't the automation — it's the automation <strong>plus</strong> the ability to own it. That means a short runbook, the environment variables documented, a clear "if this breaks, do this," and a kill switch they control without calling you.</p>
          <p>This sounds like extra work that eats your margin. It's the opposite. The handoff is what justifies the price, ends the babysitting, and turns a one-off gig into a reference client who sends you the next three.</p>
          <blockquote className="border-l-2 pl-5 my-7 italic text-slate-300" style={{ borderColor: "#818cf8" }}><Quote className="w-5 h-5 text-indigo-400 mb-2" />If the client needs you to keep it alive, you didn't sell a system. You sold yourself a part-time job.</blockquote>

          <h2 id="cost-of-getting-it-wrong">What it costs to get wrong</h2>
          <p>The gap between the two compounds over time. A script feels cheaper to deliver and costs you everything later; a system costs a little more upfront and pays you back on every axis that matters.</p>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="text-left mono text-xs text-slate-500"><th className="py-2 pr-4 font-normal"> </th><th className="py-2 pr-4 font-normal text-rose-300">Script</th><th className="py-2 font-normal text-emerald-300">System</th></tr></thead>
              <tbody className="text-slate-300">
                {[["Reliability", "Breaks on the first surprise", "Survives surprises by design"], ["Client trust", "Erodes silently on failure", "Compounds with every clean run"], ["Your time", "Endless babysitting", "Hands-off after handoff"], ["Pricing", "Hourly, race to the bottom", "Value-based, system as asset"], ["Repeat work", "One and done", "Reference client + referrals"]].map(([k, a, b]) => (
                  <tr key={k} className="border-t border-white/8"><td className="py-2.5 pr-4 text-white">{k}</td><td className="py-2.5 pr-4 text-slate-400">{a}</td><td className="py-2.5">{b}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="glass rounded-xl p-4 my-6 flex gap-3 not-prose" style={{ borderColor: "rgba(244,114,182,0.3)" }}>
            <TriangleAlert className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">The trap is that the cost of a script is invisible at delivery and obvious three weeks later. Price and build for week three, not for the demo.</p>
          </div>

          <h2 id="faq">Frequently asked questions</h2>
          <div className="space-y-5 not-prose">
            {[["Isn't a system just over-engineering?", "No — over-engineering is complexity the problem doesn't need. A system adds exactly the resilience and observability the real world demands, and nothing more. The test is whether it survives unattended, not whether it's clever."], ["Does this mean every tiny task needs a full system?", "A one-time data cleanup can absolutely be a script — run it, ship the result, done. The system mindset matters the moment something needs to run repeatedly, unattended, for someone who isn't you."], ["How do I charge for the extra work?", "You don't bill the handoff as a line item — you price the outcome. A system that runs itself is worth far more than hours of your attention, so you move from hourly to value-based pricing and the resilience pays for itself."]].map(([q, a]) => (
              <div key={q}><div className="text-white font-semibold flex items-start gap-2"><ChevronRight className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />{q}</div><p className="text-sm text-slate-400 mt-1.5 leading-relaxed pl-6">{a}</p></div>
            ))}
          </div>

          <h2 id="where-next">Where to go next</h2>
          <p>Build the boring parts first — the triggers, the retries, the logs, the runbook — and the impressive part takes care of itself. That's the whole difference between something that demos well and something a business can actually depend on.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-6 not-prose">
            {POSTS.slice(3, 5).map((p) => (
              <button key={p.slug} onClick={() => openArticle(p.slug)} className="glass glass-hover rounded-xl p-4 text-left" data-cursor>
                <div className="mono text-[11px] text-indigo-300/80">{p.cat}</div>
                <div className="text-white font-medium text-sm mt-1">{p.title}</div>
                <div className="text-indigo-300 text-xs mono mt-2">Read article →</div>
              </button>
            ))}
          </div>

          {/* author */}
          <div className="glass rounded-2xl p-6 mt-12 flex items-start gap-4 not-prose">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shrink-0" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>RN</div>
            <div>
              <div className="text-white font-semibold">Rehan Nazir</div>
              <p className="text-sm text-slate-400 mt-1">AI Engineer &amp; Automation Specialist. I build intelligent systems end to end under the Nexara brand.</p>
              <div className="flex gap-3 mt-3">{[["https://www.linkedin.com/in/rehan-nazir-530597332", Link], ["https://github.com/rehaannazir", GitFork], ["mailto:rehaan689nazir@gmail.com", Mail]].map(([href, Icon], i) => (<a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="w-9 h-9 rounded-lg glass glass-hover flex items-center justify-center text-slate-300 hover:text-white" data-cursor><Icon className="w-4 h-4" /></a>))}</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ===================== CONTACT ===================== */
const API_BASE = import.meta.env.VITE_API_URL ?? "";

function ContactSection() {
  const [f, setF] = useState({ name: "", email: "", details: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [focus, setFocus] = useState(null);
  const anyFocus = focus !== null;
  const submit = async () => {
    if (sent || sending) return;
    setError("");
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Something went wrong");
      setSent(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };
  return (
    <section id="contact" className="max-w-6xl mx-auto px-5 py-20" style={{ scrollMarginTop: "80px" }}>
      <Reveal><SectionLabel num="✦">Contact</SectionLabel></Reveal>
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Have a project <span className="grad-text">in mind?</span></h2>
          <p className="text-slate-400 mt-5 leading-relaxed">Let's build something great together. I'm available for freelance projects, agency work and collaborations — anywhere in the world.</p>
          <div className="mt-7 space-y-3">
            {[[<Mail className="w-4 h-4" />, "Email", "rehaan689nazir@gmail.com"], [<Link className="w-4 h-4" />, "LinkedIn", "linkedin.com/in/rehan-nazir-530597332"], [<GitFork className="w-4 h-4" />, "GitHub", "github.com/rehaannazir"]].map(([ic, l, v], i) => (
              <div key={i} className="flex items-center gap-3 glass glass-hover rounded-xl px-4 py-3" data-cursor><span className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>{ic}</span><div><div className="text-xs text-slate-500 mono">{l}</div><div className="text-sm text-slate-200">{v}</div></div></div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden" style={{ padding: "1.5px" }}>
            <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "conic-gradient(from 0deg, transparent 0deg, #3b82f6 70deg, #8b5cf6 150deg, transparent 260deg)", animation: "spinSlow 6s linear infinite", opacity: anyFocus ? 0.95 : 0.4, transition: "opacity .4s" }} />
            <div className="relative rounded-2xl p-6" style={{ background: "rgba(9,9,17,0.94)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" /><span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="mono text-xs text-slate-500 ml-1">new_message.tsx</span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] mono text-emerald-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "vpulse 2s ease-in-out infinite" }} />online</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs mono text-slate-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-indigo-400" /> your_name</label>
                  <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} onFocus={() => setFocus("name")} onBlur={() => setFocus(null)} placeholder="Jane Doe" className="w-full mt-1.5 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all" style={{ border: "1px solid", borderColor: focus === "name" ? "#818cf8" : "rgba(255,255,255,0.1)", boxShadow: focus === "name" ? "0 0 0 3px rgba(99,102,241,0.16), 0 0 26px -6px rgba(139,92,246,0.7)" : "none" }} />
                </div>
                <div>
                  <label className="text-xs mono text-slate-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> email</label>
                  <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} onFocus={() => setFocus("email")} onBlur={() => setFocus(null)} placeholder="jane@company.com" className="w-full mt-1.5 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all" style={{ border: "1px solid", borderColor: focus === "email" ? "#818cf8" : "rgba(255,255,255,0.1)", boxShadow: focus === "email" ? "0 0 0 3px rgba(99,102,241,0.16), 0 0 26px -6px rgba(139,92,246,0.7)" : "none" }} />
                </div>
                <div>
                  <div className="flex items-center justify-between"><label className="text-xs mono text-slate-500 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> project_details</label><span className="text-[10px] mono text-slate-600">{f.details.length}/500</span></div>
                  <textarea value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} onFocus={() => setFocus("details")} onBlur={() => setFocus(null)} rows={4} maxLength={500} placeholder="What would you like to automate?" className="w-full mt-1.5 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all resize-none" style={{ border: "1px solid", borderColor: focus === "details" ? "#818cf8" : "rgba(255,255,255,0.1)", boxShadow: focus === "details" ? "0 0 0 3px rgba(99,102,241,0.16), 0 0 26px -6px rgba(139,92,246,0.7)" : "none" }} />
                </div>
                <button onClick={submit} disabled={sent || sending} className="btn-glow w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all" style={{ background: sent ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
                  {sent ? (<><CircleCheck className="w-4 h-4" /> Message sent — I'll be in touch</>) : sending ? (<span className="inline-flex items-center gap-2">Sending <span className="flex gap-1">{[0, 1, 2].map((i) => (<span key={i} className="w-1.5 h-1.5 rounded-full bg-white" style={{ animation: `vpulse 1s ease-in-out ${i * 0.2}s infinite` }} />))}</span></span>) : (<>Send message <Send className="w-4 h-4" /></>)}
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

/* ===================== FOOTER ===================== */
function Footer({ setPage }) {
  const navLinks = [
    { id: "home", label: "Home", num: "01" },
    { id: "services", label: "Services", num: "02" },
    { id: "reviews", label: "Reviews", num: "03" },
    { id: "blog", label: "Blog", num: "04" },
  ];
  const socials = [
    { Icon: GitFork, label: "GitHub", href: "https://github.com/rehaannazir" },
    { Icon: Link, label: "LinkedIn", href: "https://www.linkedin.com/in/rehan-nazir-530597332" },
    { Icon: MessageCircle, label: "Twitter", href: "#" },
    { Icon: Mail, label: "Email", href: "mailto:rehaan689nazir@gmail.com" },
  ];
  return (
    <footer className="relative z-10 mt-6 overflow-hidden">
      {/* top glow line */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.6) 30%,rgba(139,92,246,0.6) 70%,transparent)" }} />

      {/* ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-40 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle,#3b82f6,transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-40 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-8">

        {/* CTA strip */}
        <Reveal>
          <div className="rounded-2xl mb-14 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(139,92,246,0.15))", border: "1px solid rgba(139,92,246,0.3)" }}>
            <div>
              <p className="text-white font-semibold text-lg">Have a process worth automating?</p>
              <p className="text-slate-400 text-sm mt-1">Let's build something that runs itself.</p>
            </div>
            <button
              onClick={() => { setPage("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150); }}
              className="btn-glow shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white text-sm"
              style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}
              data-cursor>
              Start a project <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Reveal>

        {/* main grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* brand col */}
          <Reveal className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", boxShadow: "0 0 24px -4px rgba(99,102,241,0.9)" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.7))" }}>
                  <g fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 9 V5" /><path d="M12 15 V19" /><path d="M9.8 9.8 L6.6 7.2" />
                    <path d="M14.2 14.2 L17.4 16.8" /><path d="M9.8 14.2 L6.6 16.8" /><path d="M14.2 9.8 L17.4 7.2" />
                  </g>
                  <g fill="#fff" style={{ animation: "vpulse 2.4s ease-in-out infinite" }}>
                    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                    <circle cx="6.6" cy="7.2" r="1.5" /><circle cx="17.4" cy="16.8" r="1.5" />
                    <circle cx="6.6" cy="16.8" r="1.5" /><circle cx="17.4" cy="7.2" r="1.5" />
                  </g>
                </svg>
              </div>
              <div>
                <span className="mono text-base text-white font-medium">rehan.nazir<span className="text-indigo-400">()</span></span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "vpulse 2s ease-in-out infinite" }} />
                  <span className="mono text-[10px] text-emerald-400">available for projects</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              AI Engineer &amp; Automation Specialist. Building intelligent, self-running systems under the <span className="text-indigo-300">Nexara</span> brand.
            </p>
            <div className="mono text-xs text-slate-600 flex items-center gap-2">
              <span className="text-indigo-400">//</span> Lahore, Pakistan · 2026
            </div>
          </Reveal>

          {/* navigate col */}
          <Reveal delay={0.08}>
            <div className="mono text-xs uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
              <span className="text-indigo-400">#</span> Navigate
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map(({ id, label, num }) => (
                <button
                  key={id}
                  onClick={() => setPage(id)}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 hover:bg-white/5"
                  data-cursor>
                  <span className="mono text-[11px] text-indigo-400/60 group-hover:text-indigo-400 transition-colors w-5">{num}</span>
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          </Reveal>

          {/* connect col */}
          <Reveal delay={0.16}>
            <div className="mono text-xs uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
              <span className="text-indigo-400">#</span> Connect
            </div>
            <div className="grid grid-cols-2 gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl glass transition-all duration-300 hover:border-indigo-500/50"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  data-cursor>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.25))" }}>
                    <Icon className="w-3.5 h-3.5 text-indigo-300" />
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{label}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="mono text-xs text-slate-600">© 2026 Rehan Nazir — Nexara.</span>
          <div className="flex items-center gap-2">
            {["React", "Vite", "Tailwind", "AI"].map((t, i) => (
              <span key={t} className="mono text-[10px] px-2.5 py-1 rounded-full text-slate-500"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}