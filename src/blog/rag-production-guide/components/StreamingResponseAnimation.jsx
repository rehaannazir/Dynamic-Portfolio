import { memo } from "react";
import { FileCheck } from "lucide-react";

/* Chapter 19's required animation: a grounded answer streaming in token by token, with a
   citation marker popping in at the exact token it supports — distinct from Chapter 2's
   TokenStreamAnimation (which contrasts grounded vs ungrounded) by showing ONE grounded
   response in isolation, with a blinking cursor to sell "this is still generating." */
const TOKENS = ["Pro", "plan", "cancellations", "take", "effect", "immediately", "[1]", ",", "with", "no", "refund", "for", "the", "current", "billing", "period", "."];

export const StreamingResponseAnimation = memo(function StreamingResponseAnimation() {
  return (
    <div className="glass rounded-2xl p-6 my-8 not-prose" role="img"
      aria-label="A grounded answer streaming in word by word, with a citation marker appearing after the specific claim it supports.">
      <div className="mono text-[11px] text-slate-400 mb-3">generating…</div>
      <p className="text-sm leading-relaxed">
        {TOKENS.map((t, i) => (
          <span key={i} style={{ opacity: 0, animation: `slideIn 0.35s ease ${i * 0.14}s forwards` }}>
            {t === "[1]" ? (
              <span className="inline-flex items-center gap-1 mono text-[11px] px-1.5 py-0.5 rounded mx-0.5" style={{ background: "rgba(16,185,129,0.16)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
                <FileCheck className="w-3 h-3" /> source
              </span>
            ) : (
              <span className="text-slate-200">{t} </span>
            )}
          </span>
        ))}
        <span className="inline-block w-1.5 h-4 align-middle" style={{ background: "#a5b4fc", animation: "blink 1s step-start infinite" }} />
      </p>
      <p className="text-xs text-slate-500 mt-4">The citation marker attaches to the specific claim it supports, appearing inline as that token streams — not tacked on as a list at the end.</p>
    </div>
  );
});
