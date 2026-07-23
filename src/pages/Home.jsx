import { lazy, memo, Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Activity, ArrowRight, Camera, GitBranch } from "lucide-react";
import { detectCapable, Reveal, SectionTransition, smoothTo, useMagnetic } from "@/lib/motion";
import { SITE_URL } from "@/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Hero3D } from "./home/Hero3D";
import { WhoamiCard } from "./home/WhoamiCard";
import { ProjectShowcase } from "./home/ProjectShowcase";
import { TechEcosystem } from "./home/TechEcosystem";
import { ShowreelSection } from "./home/ShowreelSection";
import { AboutSection } from "./home/AboutSection";
import { ContactSection } from "@/sections/ContactSection";

const HeroWebGL = lazy(() => import("./home/HeroWebGL"));
const AIArchitecture = lazy(() => import("./home/AIArchitecture"));

/* ===================== HOME ===================== */
export const Home = memo(function Home({ setPage }) {
  const PROFILE_PIC = "/rehan.jpeg";
  const workRef = useMagnetic();
  const touchRef = useMagnetic();
  const [aiCapable] = useState(detectCapable);
  const projects = [
    { n: "01", cat: "FastAPI · Gemini", title: "AI Content Automation API", desc: "Production backend that generates, categorizes and schedules content via LLMs behind a clean REST interface.", role: "Full Stack · AI · 2026", stack: ["FastAPI", "Gemini", "SQLAlchemy"], accent: "#60a5fa", viz: "Engineering", metrics: [["p95", "120ms"], ["uptime", "99.9%"], ["routes", "12"]] },
    { n: "02", cat: "n8n · LLMs", title: "B2B Sales Automation Flow", desc: "End-to-end lead enrichment and outreach pipeline that runs hands-free and hands off cleanly to the client.", role: "Automation · 2026", stack: ["n8n", "LLMs", "APIs"], link: "https://www.loom.com/share/68bfcd80b9de459e975966cc671d11cb", accent: "#8b5cf6", viz: "Workflow", metrics: [["leads/wk", "480"], ["manual steps", "0"], ["integrations", "6"]] },
    { n: "03", cat: "Python · Gemini", title: "Finance Expense Categorizer", desc: "Turns raw CSV bank exports into categorized, analysis-ready Excel sheets automatically.", role: "AI Tooling · 2025", stack: ["Python", "Gemini", "Pandas"], accent: "#818cf8", viz: "Strategy", metrics: [["rows/run", "1.2k"], ["accuracy", "98%"], ["pipeline", "CSV→XLSX"]] },
    { n: "04", cat: "RAG · Agents", title: "Support Chatbot Agent", desc: "Context-aware support agent grounded in company docs, deployed across web and messaging channels.", role: "AI Agents · 2025", stack: ["RAG", "Agents", "React"], accent: "#c084fc", viz: "AI Agents", metrics: [["deflection", "70%"], ["grounding", "RAG"], ["channels", "2"]] },
  ];
  const stack = ["Python", "FastAPI", "n8n", "Gemini API", "AI Agents", "RAG", "SQLAlchemy", "React", "Vite", "Tailwind"];
  return (
    <>
      <Helmet>
        <title>Rehan Nazir — AI Engineer & Automation Specialist | Lahore, Pakistan</title>
        <meta name="description" content="Rehan Nazir is an AI Engineer and Automation Specialist based in Lahore, Pakistan. I build AI agents, FastAPI backends, n8n workflows and RAG chatbots. Founder of Nexara. Available worldwide." />
        <link rel="canonical" href={SITE_URL + "/"} />
        <meta property="og:url" content={SITE_URL + "/"} />
        <meta property="og:title" content="Rehan Nazir — AI Engineer & Automation Specialist" />
        <meta property="og:description" content="I design and ship intelligent automation end to end — AI agents, chatbots and workflows that quietly do the work, so businesses scale without the busywork." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "mainEntity": {
            "@type": "Person",
            "name": "Rehan Nazir",
            "jobTitle": "AI Engineer & Automation Specialist",
            "description": "Self-taught AI engineer building agentic systems and automations. Founder of Nexara.",
            "url": SITE_URL,
            "sameAs": ["https://github.com/rehaannazir","https://www.linkedin.com/in/rehan-nazir-530597332"],
            "worksFor": { "@type": "Organization", "name": "Nexara" }
          }
        })}</script>
      </Helmet>
      <section id="intro" className="grid-bg relative overflow-hidden">
        <Suspense fallback={<Hero3D />}><HeroWebGL fallback={<Hero3D />} /></Suspense>
        <div className="relative z-10 max-w-6xl mx-auto px-5 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="fade-up"><div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mono text-indigo-200"><span className="w-2 h-2 rounded-full" style={{ background: "#34d399", boxShadow: "0 0 10px #34d399" }} />Available · Open to projects worldwide</div></div>
            <h1 className="fade-up text-5xl md:text-6xl font-bold tracking-tight text-white mt-6" style={{ animationDelay: ".05s", lineHeight: 1.05 }}>I'm Rehan</h1>
            <h2 className="fade-up text-5xl md:text-6xl font-bold tracking-tight mt-1" style={{ animationDelay: ".12s", lineHeight: 1.05 }}><span className="grad-text">I build AI systems</span></h2>
            <p className="fade-up grad-text text-lg md:text-xl font-semibold mt-4 mono" style={{ animationDelay: ".18s" }}>AI Engineer &amp; Automation Specialist</p>
            <p className="fade-up max-w-lg mt-5 text-slate-400 leading-relaxed" style={{ animationDelay: ".24s" }}>I design and ship <span className="text-slate-200">intelligent automation end to end</span> — AI agents, chatbots and workflows that quietly do the work, so businesses scale without the busywork.</p>
            <div className="fade-up flex flex-wrap gap-3 mt-8" style={{ animationDelay: ".3s" }}>
              <button ref={workRef} onClick={() => setPage("services")} className="btn-glow magnetic inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>View selected work <ArrowRight className="w-4 h-4" /></button>
              <button ref={touchRef} onClick={() => smoothTo(document.getElementById("contact"), { offset: -80 })} className="magnetic inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-200 glass glass-hover">Get in touch</button>
            </div>
          </div>
          <div className="fade-up flex flex-col gap-5" style={{ animationDelay: ".2s" }}>
            <div className="glass rounded-3xl p-7 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(400px 160px at 50% 0%, rgba(139,92,246,0.25), transparent 70%)" }} />
              <div className="relative text-center flex flex-col items-center">
                <div className="block mx-auto w-36 h-36 rounded-full relative">
                  <div className="absolute -inset-1 rounded-full" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", animation: "spinSlow 22s linear infinite", opacity: 0.8 }} />
                  <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-white/10 flex items-center justify-center" style={{ background: "#0c0c16" }}>
                    {PROFILE_PIC ? (
                      <picture>
                        <source type="image/avif" srcSet="/rehan-144.avif 144w, /rehan-288.avif 288w, /rehan-432.avif 432w" sizes="144px" />
                        <source type="image/webp" srcSet="/rehan-144.webp 144w, /rehan-288.webp 288w, /rehan-432.webp 432w" sizes="144px" />
                        <img src="/rehan-144.jpg" alt="Rehan Nazir — AI Engineer and Automation Specialist, Lahore Pakistan" width="144" height="144" className="w-full h-full object-cover" fetchPriority="high" />
                      </picture>
                    ) : <div className="flex flex-col items-center text-slate-400 px-3 text-center"><Camera className="w-7 h-7 mb-1" /><span className="text-[9px] mono leading-tight">set PROFILE_PIC in code</span></div>}
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg mt-5">Rehan Nazir</h3>
                <p className="text-xs mono text-indigo-300 mt-0.5">// based in Lahore, Pakistan</p>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-xs mx-auto">Helping ideas become intelligent systems through AI engineering and automation.Design. Build. Deploy. AI.</p>
              </div>
            </div>
            <WhoamiCard />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-8">
        <div className="grid sm:grid-cols-3 gap-4">
          <Reveal variant="blur"><div className="float-soft h-full"><div className="glass glass-hover rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between"><span className="mono text-xs text-slate-400">automation activity · 7d</span><GitBranch className="w-4 h-4 text-indigo-400" /></div>
            <div className="text-2xl font-bold text-white mt-3">128 <span className="text-sm font-normal text-slate-400">flows run</span></div>
            <div className="flex gap-1 mt-3">{Array.from({ length: 14 }).map((_, i) => (<span key={i} className="flex-1 rounded" style={{ height: 4+Math.round((i % 5)*8)+"px", marginTop:"auto", background: `rgba(139,92,246,${0.18 + (i % 5) * 0.18})`, transition:"height 1s ease" }} />))}</div>
          </div></div></Reveal>
          <Reveal variant="blur" delay={0.1}><div className="float-soft-2 h-full" style={{ animationDelay: "1.2s" }}><div className="glass glass-hover rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between"><span className="mono text-xs text-slate-400">inference · live</span><Activity className="w-4 h-4 text-indigo-400" /></div>
            <div className="mt-3 space-y-1.5 mono text-xs">{[["POST","/api/generate","200"],["GET","/api/agents","200"],["POST","/api/embed","200"]].map(([m,p,s])=>(<div key={p} className="flex items-center gap-2"><span className="text-purple-300 w-9">{m}</span><span className="text-slate-400 flex-1 truncate">{p}</span><span className="text-emerald-400">{s}</span></div>))}</div>
          </div></div></Reveal>
          <Reveal variant="blur" delay={0.2}><div className="float-soft h-full" style={{ animationDelay: "2.4s" }}><div className="glass glass-hover rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between"><span className="mono text-xs text-slate-400">nexara roadmap</span><span className="mono text-xs text-indigo-300">71%</span></div>
            <div className="mt-3 text-sm text-slate-400">10 / 14 milestones shipped</div>
            <div className="h-1.5 rounded-full bg-white/5 mt-3 overflow-hidden"><div className="h-full rounded-full" style={{ width:"71%", background:"linear-gradient(90deg,#3b82f6,#8b5cf6)", transition:"width 2s cubic-bezier(.16,1,.3,1)" }} /></div>
            <div className="mt-3 flex gap-1.5 flex-wrap">{["AI Agents","RAG","n8n","Vapi","SaaS"].map(t=>(<span key={t} className="px-2 py-0.5 rounded text-[10px] mono" style={{background:"rgba(99,102,241,0.1)",color:"#a5b4fc"}}>{t}</span>))}</div>
          </div></div></Reveal>
        </div>
      </section>

      <SectionTransition duration={9} />
      {/* SHOWREEL */}
      <ShowreelSection />

      <AboutSection />

      <section id="tech" className="max-w-6xl mx-auto px-5 py-12">
        <Reveal><SectionLabel num="02">Tech stack</SectionLabel></Reveal>
        <Reveal variant="clip"><h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Tools I reach for to ship end-to-end.</h2></Reveal>
        <Reveal delay={0.08}><p className="text-slate-400 max-w-2xl mb-10">Not a pile of logos — a pipeline. This is how an idea actually flows from code to something running in production.</p></Reveal>
        {/* aiCapable is known synchronously (no async work) — reserving 100vh up front for the
            small slice of visitors who'll get the WebGL scene means the page never jumps by a
            full viewport height once the lazy AIArchitecture chunk resolves and replaces the
            short TechEcosystem fallback. This was the single largest CLS contributor on the page. */}
        <div style={aiCapable ? { minHeight: "100vh" } : undefined}>
          <Suspense fallback={<TechEcosystem />}><AIArchitecture fallback={<TechEcosystem />} /></Suspense>
        </div>
        <Reveal delay={0.1}><div className="marquee py-2 mt-10"><div className="marquee-track">{[...stack, ...stack].map((s, i) => (<span key={i} className="px-5 py-2.5 rounded-full text-sm mono glass text-slate-200 whitespace-nowrap">{s}</span>))}</div></div></Reveal>
      </section>

      <SectionTransition duration={11} reverse />
      <section id="work" className="max-w-6xl mx-auto px-5 py-16">
        <Reveal><SectionLabel num="03">Selected work</SectionLabel></Reveal>
        <Reveal variant="clip"><h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Things I've shipped.</h2></Reveal>
        <Reveal delay={0.08}><p className="text-slate-400 max-w-2xl mb-12">Each one is a system that runs itself. Here's what's happening under the hood.</p></Reveal>
        <div className="flex flex-col gap-20 md:gap-28">
          {projects.map((p, i) => (<ProjectShowcase key={p.title} p={p} i={i} />))}
        </div>
      </section>
      <ContactSection />
    </>
  );
});
