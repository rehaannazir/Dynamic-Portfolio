import { useState } from "react";
import { Reveal } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

/* ===================== FAQ SECTION ===================== */
export function FAQSection() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:"How long does a project take?",              a:"Most automations take 1–3 weeks. A simple n8n workflow can be live in days. A full AI agent system with RAG and CRM integration typically takes 2–4 weeks including testing and documentation." },
    { q:"Do you work with clients outside Pakistan?", a:"Yes — almost all my clients are international. I work remotely with businesses across Europe, the US, and the Middle East. Time zones are no issue; I deliver async-first and communicate clearly throughout." },
    { q:"What's your pricing model?",                 a:"I price by the system, not the hour. You pay for a working, documented, self-running system — not my time. This aligns my incentive with yours: ship fast, ship right, hand off clean." },
    { q:"What happens after delivery?",               a:"You get full docs, all environment variables, a runbook, and a kill switch you control. I include a one-week support window post-delivery. Ongoing retainers are available separately." },
    { q:"Which LLMs do you build with?",              a:"All major ones — Claude for reasoning and long-context work, GPT-4 for broad capability, Gemini for cost-efficient pipelines. I'll recommend the right fit for your use case." },
    { q:"Can you integrate into our existing stack?", a:"Yes. I wire into whatever you're running — Notion, Airtable, HubSpot, Slack, custom APIs. If it has a webhook or an API endpoint, it can be part of the system." },
  ];
  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <Reveal><SectionLabel num="✦">FAQ</SectionLabel></Reveal>
      <Reveal delay={0.08}><h2 className="text-3xl md:text-4xl font-bold text-white mb-10">Questions, <span className="grad-text">answered</span>.</h2></Reveal>
      <div className="space-y-3 max-w-3xl">
        {faqs.map((faq,i)=>(
          <Reveal key={i} delay={i*0.06}>
            <div className="rounded-xl overflow-hidden transition-all duration-700" style={{background:"#000000",border:`1px solid ${open===i?"rgba(139,92,246,0.45)":"rgba(255,255,255,0.07)"}`}}>
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left" data-cursor aria-expanded={open===i}>
                <span className="text-white font-medium text-sm">{faq.q}</span>
                <span className="text-indigo-400 text-xl shrink-0 leading-none transition-transform duration-600" style={{transform:open===i?"rotate(45deg)":"rotate(0deg)"}}>{open===i?"×":"+"}</span>
              </button>
              <div className="faq-answer" style={{maxHeight:open===i?200:0}}>
                <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
