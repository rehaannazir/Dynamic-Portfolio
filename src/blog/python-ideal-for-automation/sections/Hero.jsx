import { ArrowLeft } from "lucide-react";
import { HeroCanvas } from "../components/HeroCanvas";
import { FloatingCode } from "../components/FloatingCode";
import { AnimatedTitle } from "../components/AnimatedTitle";

/* ── HERO ───────────────────────────────────────── */
export function Hero({ back, go }) {
  return (
    <div className="relative overflow-hidden" style={{ minHeight: "88vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* Three.js particle canvas */}
      <div className="absolute inset-0">
        <HeroCanvas />
      </div>
      {/* Gradient overlay bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #010104)" }} />

      <FloatingCode />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-5 pt-16 pb-20">
        {/* Back */}
        <button onClick={back} className="inline-flex items-center gap-2 text-sm mono text-slate-400 hover:text-indigo-300 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> All blog posts
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mono text-indigo-200 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ animation: "vpulse 2s ease-in-out infinite" }} />
          Automation · 8 min read
        </div>

        <AnimatedTitle />

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mt-8 leading-relaxed" style={{ opacity: 1 }}>
          Discover why Python became the world&apos;s favourite language for automation — from simple file scripts to AI-powered multi-agent workflows.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>RN</div>
          <span className="text-sm text-slate-300" itemProp="author" itemScope itemType="https://schema.org/Person">
            <span itemProp="name">Rehan Nazir</span>
          </span>
          <span className="text-slate-400">·</span>
          <time className="text-sm mono text-slate-400" itemProp="datePublished" dateTime="2026-06-27">27 Jun 2026</time>
          <span className="text-slate-400">·</span>
          <span className="text-sm mono text-slate-400">8 min read</span>
        </div>

        <button onClick={() => go("introduction")} className="mt-10 inline-flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors">
          <span className="text-xs mono">scroll to read</span>
          <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: "cardFloat 2s ease-in-out infinite" }}>
            <path d="M4,6 L10,14 L16,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
