import { Helmet } from "react-helmet-async";
import { Star } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { SITE_URL } from "@/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Counter } from "@/components/ui/Counter";
import { ContactSection } from "@/sections/ContactSection";

/* ===================== REVIEWS ===================== */
export function Reviews() {
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
      <Helmet>
        <title>Client Reviews — Rehan Nazir | AI Automation Projects</title>
        <meta name="description" content="Real client testimonials for Rehan Nazir's AI automation work. 10+ clients, 4.9 average rating, 100% on-time delivery. AI chatbots, sales automation and workflow systems." />
        <link rel="canonical" href={SITE_URL + "/reviews"} />
        <meta property="og:url" content={SITE_URL + "/reviews"} />
        <meta property="og:title" content="Client Reviews — Rehan Nazir" />
        <meta property="og:description" content="Real client testimonials. 10+ clients, 4.9 average rating, 100% on-time delivery." />
      </Helmet>
      <section className="grid-bg"><div className="max-w-6xl mx-auto px-5 pt-20 pb-6"><Reveal><SectionLabel num="03">Client trust</SectionLabel></Reveal><Reveal><h1 className="text-4xl md:text-5xl font-bold text-white">What clients <span className="grad-text">say</span>.</h1></Reveal><Reveal delay={0.1}><p className="max-w-2xl mt-5 text-slate-400">Real results, delivered as systems that keep working long after handoff.</p></Reveal></div></section>
      <section className="max-w-6xl mx-auto px-5 py-10"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[["12", "+", "Projects"], ["10", "+", "Clients"], ["4", ".9", "Avg rating"], ["100", "%", "On-time"]].map(([v, s, l]) => (<Reveal key={l}><div className="glass glass-hover rounded-2xl py-7 text-center" data-cursor><div className="text-3xl font-bold grad-text"><Counter to={parseInt(v)} suffix={s} /></div><div className="text-xs text-slate-400 mt-1">{l}</div></div></Reveal>))}</div></section>
      <section className="max-w-6xl mx-auto px-5 py-8"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{reviews.map((r, i) => (<Reveal key={r.name} delay={(i % 3) * 0.08}><div className="glass glass-hover rounded-2xl p-6 flex flex-col h-full" data-cursor><div className="flex gap-1 mb-4">{Array.from({ length: 5 }).map((_, j) => (<Star key={j} className="w-4 h-4" style={{ fill: j < r.rating ? "#a78bfa" : "transparent", color: j < r.rating ? "#a78bfa" : "#3f3f5a" }} />))}</div><p className="text-sm text-slate-300 leading-relaxed flex-1">"{r.text}"</p><div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/5"><div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>{r.name.split(" ").map((w) => w[0]).join("")}</div><div><div className="text-sm font-medium text-white">{r.name}</div><div className="text-xs text-slate-400">{r.role}</div></div></div></div></Reveal>))}</div></section>
      <ContactSection />
    </>
  );
}
