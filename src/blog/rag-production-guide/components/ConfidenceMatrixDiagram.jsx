import { memo } from "react";

/* Chapter 2's required diagram: confidence vs correctness. The point of the 2x2 is that tone
   (the x-axis) carries no information about the y-axis — the dangerous quadrant looks, sounds,
   and reads exactly like the safe one. */
const CELLS = [
  { title: "What you want", sub: "Confident and correct", col: "#10b981" },
  { title: "Hallucination", sub: "Confident and wrong — sounds identical to the cell on the left", col: "#ef4444" },
  { title: "Unnecessary hedging", sub: "Uncertain but actually correct", col: "#64748b" },
  { title: "At least it's honest", sub: "Uncertain and wrong — the tone gives you a hint this time", col: "#f59e0b" },
];

export const ConfidenceMatrixDiagram = memo(function ConfidenceMatrixDiagram() {
  return (
    <div className="glass rounded-2xl p-6 my-8 relative overflow-hidden not-prose"
      role="img" aria-label="A 2 by 2 grid of confident versus uncertain tone against correct versus incorrect content. Confident and correct is what you want; confident and wrong is hallucination and sounds identical; uncertain and correct is unnecessary hedging; uncertain and wrong is at least honest.">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="relative grid grid-cols-2 gap-3">
        {CELLS.map((c) => (
          <div key={c.title} className="rounded-xl p-4" style={{ background: `linear-gradient(135deg,${c.col}18,${c.col}08)`, border: `1px solid ${c.col}38` }}>
            <div className="text-white font-semibold text-sm">{c.title}</div>
            <div className="mono text-[11px] mt-1" style={{ color: c.col + "cc" }}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div className="relative flex justify-between mt-3 px-1 mono text-[10px] text-slate-500">
        <span>← sounds uncertain</span>
        <span>sounds confident →</span>
      </div>
      <p className="text-xs text-center text-slate-400 mono mt-4 relative">Tone is generated the same way regardless of which row you're in — that's the whole problem.</p>
    </div>
  );
});
