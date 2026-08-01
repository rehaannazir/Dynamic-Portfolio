import { memo } from "react";

/* Chapter 9's required diagram: the same two vectors from Chapter 8's worked example, scored
   side by side by dot product and cosine similarity, making the "equivalent once normalized"
   claim visually concrete rather than only algebraic. */
export const DotProductDiagram = memo(function DotProductDiagram() {
  return (
    <div className="glass rounded-2xl p-5 my-8 not-prose" role="img"
      aria-label="Side by side calculation: raw dot product of a=[1,2] and b=[2,4] equals 10, while cosine similarity of the same two vectors equals 1 after dividing out magnitude.">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)" }}>
          <div className="mono text-[11px] text-violet-300/80 mb-2">dot product (raw)</div>
          <div className="mono text-sm text-slate-200 space-y-1">
            <div>a · b = (1×2) + (2×4)</div>
            <div className="text-violet-300 font-semibold">= 10</div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Grows with magnitude — scale either vector up, this number changes.</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)" }}>
          <div className="mono text-[11px] text-blue-300/80 mb-2">cosine similarity (normalized)</div>
          <div className="mono text-sm text-slate-200 space-y-1">
            <div>10 / (√5 × √20)</div>
            <div className="text-blue-300 font-semibold">= 1</div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Magnitude divided out — stays 1 no matter how either vector is scaled.</p>
        </div>
      </div>
      <p className="text-xs text-center text-slate-400 mono mt-4">Same two vectors as Chapter 8's example. Normalize first and both numbers agree.</p>
    </div>
  );
});
