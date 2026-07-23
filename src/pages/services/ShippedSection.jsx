import { Reveal } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

/* ===================== SHIPPED SECTION ===================== */
export function ShippedSection() {
  const shipped = [
    { n:"01", title:"AI Content Automation API",   client:"Internal · Nexara",  role:"Full Stack · AI",  stack:["FastAPI","Gemini","SQLAlchemy"], year:"2026" },
    { n:"02", title:"B2B Sales Automation Flow",   client:"Confidential",        role:"Automation",        stack:["n8n","LLMs","CRM APIs"],         year:"2026", link:"https://www.loom.com/share/68bfcd80b9de459e975966cc671d11cb" },
    { n:"03", title:"Finance Expense Categorizer", client:"FinTrack",            role:"AI Tooling",        stack:["Python","Gemini","Pandas"],       year:"2025" },
    { n:"04", title:"Support Chatbot Agent",       client:"NovaCommerce",        role:"AI Agents",         stack:["RAG","React","FastAPI"],          year:"2025" },
    { n:"05", title:"Lead Enrichment Pipeline",    client:"BrightLeads",         role:"Automation",        stack:["n8n","Clay","OpenAI"],            year:"2025" },
    { n:"06", title:"Restaurant SaaS MVP",         client:"HN Foods",            role:"Full Stack",        stack:["React","FastAPI","AI"],           year:"2025" },
  ];
  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <Reveal><SectionLabel num="✦">Shipped</SectionLabel></Reveal>
      <Reveal delay={0.08}><h2 className="text-3xl md:text-4xl font-bold text-white mb-10">A few things I've <span className="grad-text">shipped</span>.</h2></Reveal>
      <Reveal delay={0.14}>
        <div className="rounded-2xl overflow-hidden" style={{border:"1px solid rgba(255,255,255,0.07)",background:"#0a0a0a"}}>
          <div className="hidden md:grid grid-cols-[44px_1fr_160px_1fr_60px] gap-4 px-6 py-3 border-b border-white/5">
            {["#","Project","Role","Stack","Year"].map(h=>(
              <span key={h} className="mono text-[10px] text-slate-400 uppercase tracking-wider last:text-right">{h}</span>
            ))}
          </div>
          {shipped.map((p)=>(
            <div key={p.n} className="group grid grid-cols-[44px_1fr] md:grid-cols-[44px_1fr_160px_1fr_60px] gap-4 px-6 py-4 items-center border-b border-white/5 last:border-b-0 transition-all duration-700 hover:bg-white/[0.03]" data-cursor onClick={() => p.link && window.open(p.link, '_blank')} style={p.link ? {cursor:'pointer'} : {}}>
              <span className="mono text-xs text-slate-400">{p.n}</span>
              <div className="min-w-0">
                <div className="text-white font-medium text-sm group-hover:text-indigo-200 transition-colors duration-500">{p.title}</div>
                <div className="mono text-[10px] text-slate-400 mt-0.5">{p.client}</div>
              </div>
              <span className="hidden md:block mono text-xs text-slate-400">{p.role}</span>
              <div className="hidden md:flex flex-wrap gap-1.5">
                {p.stack.map(s=>(<span key={s} className="px-2 py-0.5 rounded text-[10px] mono" style={{background:"rgba(99,102,241,0.1)",color:"#a5b4fc"}}>{s}</span>))}
              </div>
              <span className="hidden md:block mono text-[11px] text-slate-400 text-right">{p.year}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
