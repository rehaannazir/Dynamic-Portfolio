import { memo } from "react";

/* Chapter 7's required diagram: a three-way preview strip of the metrics covered in depth
   across the next three chapters — orientation before mechanism. */
const METRICS = [
  { name: "Cosine Similarity", col: "#3b82f6", measures: "angle between vectors", ignores: "magnitude", chapter: "Ch. 8" },
  { name: "Dot Product", col: "#8b5cf6", measures: "angle × magnitude combined", ignores: "nothing — raw projection", chapter: "Ch. 9" },
  { name: "Euclidean Distance", col: "#f472b6", measures: "straight-line distance", ignores: "nothing — fully magnitude-sensitive", chapter: "Ch. 10" },
];

export const MetricsTaxonomyDiagram = memo(function MetricsTaxonomyDiagram() {
  return (
    <div className="glass rounded-2xl p-5 my-8 not-prose" role="img"
      aria-label="Three-way comparison of cosine similarity, dot product, and Euclidean distance: what each measures and what each ignores.">
      <div className="grid sm:grid-cols-3 gap-3">
        {METRICS.map((m) => (
          <div key={m.name} className="rounded-xl p-4" style={{ background: `linear-gradient(135deg,${m.col}18,${m.col}08)`, border: `1px solid ${m.col}38` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-sm">{m.name}</span>
              <span className="mono text-[10px] px-1.5 py-0.5 rounded" style={{ color: m.col, background: `${m.col}22` }}>{m.chapter}</span>
            </div>
            <div className="text-xs text-slate-400 mono">measures</div>
            <div className="text-xs text-slate-300 mb-2">{m.measures}</div>
            <div className="text-xs text-slate-400 mono">ignores</div>
            <div className="text-xs text-slate-300">{m.ignores}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-slate-400 mono mt-4">Same two vectors, three different questions asked about them.</p>
    </div>
  );
});
