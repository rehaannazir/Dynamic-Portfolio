import { memo } from "react";
import { X, Check } from "lucide-react";

/* Chapter 3's required animation: the same question, answered two ways, side by side. Reuses
   the staggered-opacity reveal technique from TokenStreamAnimation/AnimatedTitle rather than
   inventing a new motion primitive. */
const QUESTION = "What's the cancellation policy for Acme's Pro plan?";
const BEFORE = "You can cancel anytime — Acme typically offers a standard 90-day grace period for Pro subscribers.";
const AFTER = "Per the current Terms of Service (updated this quarter): Pro plan cancellations take effect immediately, with no refund for the current billing period.";

export const BeforeAfterSplit = memo(function BeforeAfterSplit() {
  return (
    <div className="glass rounded-2xl p-6 my-8 not-prose" role="img"
      aria-label="The same question asked two ways: without retrieval, the model guesses a plausible but fabricated policy; with retrieval, the model answers from the actual current terms of service.">
      <p className="mono text-xs text-slate-400 mb-5">"{QUESTION}"</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.22)", opacity: 0, animation: "slideIn 0.6s ease 0.1s forwards" }}>
          <div className="flex items-center gap-2 mb-2">
            <X className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
            <span className="mono text-[11px] text-red-300/80">Without retrieval</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{BEFORE}</p>
          <p className="mono text-[10px] text-red-400/70 mt-2">confident · fabricated · no source</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.22)", opacity: 0, animation: "slideIn 0.6s ease 0.35s forwards" }}>
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
            <span className="mono text-[11px] text-emerald-300/80">With retrieval (RAG)</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{AFTER}</p>
          <p className="mono text-[10px] text-emerald-400/70 mt-2">confident · sourced · checkable</p>
        </div>
      </div>
    </div>
  );
});
