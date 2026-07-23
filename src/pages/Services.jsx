import { Helmet } from "react-helmet-async";
import { CircleCheck, Code, Cpu, ExternalLink, Layers, MessageSquare, TrendingUp, Workflow } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { SITE_URL } from "@/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ShippedSection } from "./services/ShippedSection";
import { FAQSection } from "./services/FAQSection";

/* ===================== SERVICES ===================== */
export function Services() {
  const services = [
    { icon: <MessageSquare className="w-6 h-6" />, title: "AI Chatbots & Agents", desc: "Context-aware assistants and autonomous agents trained on your data, deployed across web and messaging.", points: ["RAG over your docs", "Multi-channel deploy", "Human-in-the-loop ready"] },
    { icon: <TrendingUp className="w-6 h-6" />, title: "B2B Sales Automation", desc: "Lead enrichment, qualification and personalized outreach pipelines that run without manual lifting.", points: ["Lead enrichment", "Personalized outreach", "CRM sync"], link: "https://www.loom.com/share/68bfcd80b9de459e975966cc671d11cb" },
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
      <Helmet>
        <title>AI Automation Services — Rehan Nazir | FastAPI, n8n, AI Agents</title>
        <meta name="description" content="AI chatbots, B2B sales automation, content APIs, n8n workflows and agentic systems. Rehan Nazir builds self-running automation systems for businesses worldwide." />
        <link rel="canonical" href={SITE_URL + "/services"} />
        <meta property="og:url" content={SITE_URL + "/services"} />
        <meta property="og:title" content="AI Automation Services — Rehan Nazir" />
        <meta property="og:description" content="AI chatbots, B2B sales automation, content APIs, n8n workflows and agentic systems built to run themselves." />
      </Helmet>
      <section className="grid-bg"><div className="max-w-6xl mx-auto px-5 pt-20 pb-6">
        <Reveal><SectionLabel num="02">Services</SectionLabel></Reveal>
        <Reveal><h1 className="fade-up text-4xl md:text-5xl font-bold text-white leading-tight">Services built to <span className="grad-text">run themselves</span>.</h1></Reveal>
        <Reveal delay={0.1}><p className="max-w-2xl mt-5 text-slate-400">I don't just hand you scripts — I build and deliver automated systems your business can rely on.</p></Reveal>
      </div></section>
      <section className="max-w-6xl mx-auto px-5 py-12"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => (<Reveal key={s.title} delay={(i % 3) * 0.08}><div className="glass glass-hover rounded-2xl p-6 h-full" data-cursor onClick={() => s.link && window.open(s.link, '_blank')} style={s.link ? {cursor:'pointer'} : {}}><div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5" style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.9),rgba(139,92,246,0.9))" }}>{s.icon}</div><h3 className="text-lg font-semibold text-white flex items-center gap-2">{s.title}{s.link && <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}</h3><p className="text-sm text-slate-400 mt-2 leading-relaxed">{s.desc}</p><div className="mt-4 space-y-2">{s.points.map((pt) => (<div key={pt} className="flex items-center gap-2 text-sm text-slate-300"><CircleCheck className="w-4 h-4 text-indigo-400 shrink-0" />{pt}</div>))}</div></div></Reveal>))}
      </div></section>
      <section className="max-w-6xl mx-auto px-5 py-12"><Reveal><SectionLabel num="03">How it works</SectionLabel></Reveal><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{process.map((p, i) => (<Reveal key={p.n} delay={i * 0.08}><div className="glass rounded-2xl p-6 h-full" data-cursor><div className="text-4xl font-bold grad-text mono">{p.n}</div><h3 className="text-white font-semibold mt-3">{p.t}</h3><p className="text-sm text-slate-400 mt-2">{p.d}</p></div></Reveal>))}</div></section>
      <ShippedSection />
      <FAQSection />
    </>
  );
}
