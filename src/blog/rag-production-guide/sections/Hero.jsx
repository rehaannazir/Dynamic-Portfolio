import { ArrowLeft } from "lucide-react";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { DifficultyBadge } from "../components/DifficultyBadge";

/* Structural twin of the Python-automation article's Hero (same minHeight:88vh, same centered
   column, same bottom fade into #010104) so the swap between articles doesn't feel like a
   different template. One deliberate simplification for this first pass: the full WebGL
   "vector field" particle scene specified in the design system is deferred — this ships with a
   static gradient/grid-bg treatment instead, so Chapter 1 doesn't wait on a Three.js scene build.
   Swapping in HeroCanvas-equivalent later is a drop-in replacement of the background layer only. */
export function Hero({ back, go }) {
  return (
    <div className="relative overflow-hidden" style={{ minHeight: "88vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#3b82f6,transparent 70%)", filter: "blur(40px)", animation: "floatA 14s ease-in-out infinite" }} />
        <div className="absolute top-10 right-1/5 w-[28rem] h-[28rem] rounded-full opacity-[0.16]" style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)", filter: "blur(48px)", animation: "floatB 17s ease-in-out infinite" }} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #010104)" }} />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-5 pt-16 pb-20">
        <button onClick={back} className="inline-flex items-center gap-2 text-sm mono text-slate-400 hover:text-indigo-300 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> All blog posts
        </button>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mono text-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ animation: "vpulse 2s ease-in-out infinite" }} />
            AI Engineering · in progress
          </div>
          <div className="inline-flex items-center px-3 py-1.5 rounded-full glass">
            <DifficultyBadge level="Beginner" color="#818cf8" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] mono text-slate-400 mb-8" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          Topic: Retrieval-Augmented Generation
        </div>

        <AnimatedTitle words={["RAG", "FROM", "ZERO", "TO", "PRODUCTION"]} />

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mt-8 leading-relaxed">
          The complete engineering guide to retrieval-augmented generation — from the first vector to a production-grade, multi-tenant system. Published chapter by chapter.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>RN</div>
          <span className="text-sm text-slate-300" itemProp="author" itemScope itemType="https://schema.org/Person">
            <span itemProp="name">Rehan Nazir</span>
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-sm mono text-slate-400">Chapter 1 of 87</span>
        </div>

        <div className="flex items-center justify-center gap-3 mt-10">
          <button onClick={() => go("history-of-ir")} className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
            Start reading →
          </button>
        </div>

        <button onClick={() => go("history-of-ir")} className="mt-10 inline-flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors">
          <span className="text-xs mono">scroll to read</span>
          <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: "cardFloat 2s ease-in-out infinite" }}>
            <path d="M4,6 L10,14 L16,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
