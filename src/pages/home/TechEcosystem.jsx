import { Fragment } from "react";
import { Bot, Cloud, Code, Rocket, Workflow, Zap } from "lucide-react";
import { FloatingCard, prefersReduced, Reveal, useMotionState } from "@/lib/motion";

/* ===================== TECH ECOSYSTEM ===================== */
/* A living pipeline (code → backend → agents → automation → cloud → deploy)
   with energy flowing along the connectors. Elegant, not a network graph. */
function EcoNode({ label, sub, Icon, c, index }) {
  return (
    <FloatingCard amplitude={6 + (index % 3) * 2} duration={6.4 + index * 0.45} delay={index * 0.3}
      accent={c} data-cursor
      className="rounded-2xl px-4 py-4 h-full flex md:flex-col items-center md:items-start gap-3 group"
      style={{ cursor: "default" }}>
      <span className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${c}30, ${c}10)`, border: `1px solid ${c}55` }}>
        <Icon className="w-5 h-5" style={{ color: c }} />
        <span aria-hidden="true" className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: `0 0 24px -2px ${c}` }} />
      </span>
      <div className="min-w-0">
        <div className="text-white text-sm font-semibold leading-tight">{label}</div>
        <div className="mono text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{sub}</div>
      </div>
    </FloatingCard>
  );
}
function EcoConnector({ animate, delay }) {
  const dot = { background: "#ddd6fe", boxShadow: "0 0 10px 2px rgba(167,139,250,0.9)" };
  return (
    <div className="flex md:flex-col items-center justify-center md:px-1" aria-hidden="true">
      <div className="hidden md:block relative w-full h-px" style={{ minWidth: 26, background: "linear-gradient(90deg, rgba(129,140,248,0.12), rgba(192,132,252,0.4), rgba(129,140,248,0.12))" }}>
        {animate && <span className="absolute w-1.5 h-1.5 rounded-full" style={{ ...dot, top: "50%", marginTop: -3, animation: `flowX 2.6s linear ${delay}s infinite` }} />}
      </div>
      <div className="md:hidden relative h-5 w-px" style={{ background: "linear-gradient(180deg, rgba(129,140,248,0.12), rgba(192,132,252,0.4))" }}>
        {animate && <span className="absolute w-1.5 h-1.5 rounded-full" style={{ ...dot, left: "50%", marginLeft: -3, animation: `flowY 2.6s linear ${delay}s infinite` }} />}
      </div>
    </div>
  );
}
export function TechEcosystem() {
  const reduced = prefersReduced();
  const { tier } = useMotionState();
  const animate = !reduced && tier !== "low";
  const stages = [
    { label: "Python",     sub: "foundation", Icon: Code,     c: "#60a5fa" },
    { label: "FastAPI",    sub: "the backend", Icon: Zap,      c: "#6366f1" },
    { label: "AI Agents",  sub: "the brains",  Icon: Bot,      c: "#818cf8" },
    { label: "Automation", sub: "the glue",    Icon: Workflow, c: "#8b5cf6" },
    { label: "Cloud",      sub: "the scale",   Icon: Cloud,    c: "#a855f7" },
    { label: "Deploy",     sub: "shipped",     Icon: Rocket,   c: "#c084fc" },
  ];
  return (
    <div className="relative" style={{ perspective: "1400px" }}>
      <div className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-0">
        {stages.map((s, i) => (
          <Fragment key={s.label}>
            <Reveal variant="scale" delay={i * 0.07} className="md:flex-1"><EcoNode {...s} index={i} /></Reveal>
            {i < stages.length - 1 && <EcoConnector animate={animate} delay={i * 0.3} />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
