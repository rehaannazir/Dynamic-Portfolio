import { memo } from "react";
import { FileCheck } from "lucide-react";

/* Chapter 2's required animation. Two answers to the same question reveal token-by-token
   (staggered opacity, same technique as AnimatedTitle) — one ungrounded and fabricated, one
   grounded with a citation pin popping in on the sourced fact. Same mechanism (next-token
   prediction) generates both; only one of them is checkable. */
const UNGROUNDED = ["The", "refund", "window", "is", "90", "days", "after", "purchase."];
const GROUNDED = ["The", "refund", "window", "is", "30", "days*", "after", "purchase."];

export const TokenStreamAnimation = memo(function TokenStreamAnimation() {
  return (
    <div className="glass rounded-2xl p-6 my-8 not-prose" role="img"
      aria-label="Two generated answers to the same question, revealed word by word: an ungrounded answer stating a fabricated 90-day window, and a grounded answer citing a real 30-day window with a source marker.">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
        <span className="mono text-[11px] text-slate-400">Ungrounded — no source, just prediction</span>
      </div>
      <p className="text-sm leading-relaxed mb-5">
        {UNGROUNDED.map((w, i) => (
          <span key={i} style={{ opacity: 0, animation: `slideIn 0.4s ease ${i * 0.12}s forwards`, color: "#fca5a5", marginRight: "0.35em" }}>{w}</span>
        ))}
      </p>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
        <span className="mono text-[11px] text-slate-400">Grounded — one token is traceable to a real source</span>
      </div>
      <p className="text-sm leading-relaxed">
        {GROUNDED.map((w, i) => (
          <span key={i} style={{ opacity: 0, animation: `slideIn 0.4s ease ${1.2 + i * 0.12}s forwards`, color: "#86efac", marginRight: "0.35em", position: "relative" }}>
            {w}
            {w === "30" && (
              <FileCheck className="inline-block w-3 h-3 ml-1" style={{ color: "#34d399", opacity: 0, animation: `slideIn 0.4s ease ${1.2 + 5 * 0.12 + 0.3}s forwards` }} />
            )}
          </span>
        ))}
      </p>
      <p className="text-xs mono text-slate-500 mt-4">Both sentences were produced by exactly the same mechanism, one token at a time. Nothing about *how* they were generated tells you which one is true — only the source behind the second one does.</p>
    </div>
  );
});
