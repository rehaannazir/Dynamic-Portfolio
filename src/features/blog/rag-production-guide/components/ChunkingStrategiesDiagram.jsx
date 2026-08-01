import { memo } from "react";
import { Check, X } from "lucide-react";

/* Chapter 14's required diagram: the three dominant chunking strategies compared, distinct
   from the live ChunkingPlayground (which only demonstrates fixed-size chunking in practice). */
const STRATEGIES = [
  { name: "Fixed-size", col: "#3b82f6", desc: "Cut every N characters, with overlap. Simple, fast, structure-blind.", respects: false },
  { name: "Recursive", col: "#8b5cf6", desc: "Try paragraph breaks first, then sentences, then words — falls back only when needed.", respects: true },
  { name: "Semantic", col: "#f472b6", desc: "Split where meaning actually shifts, using embedding similarity between sentences.", respects: true },
];

export const ChunkingStrategiesDiagram = memo(function ChunkingStrategiesDiagram() {
  return (
    <div className="glass rounded-2xl p-5 my-8 not-prose" role="img"
      aria-label="Three chunking strategies compared: fixed-size (simple, ignores structure), recursive (tries to respect paragraph and sentence boundaries), and semantic (splits based on meaning shifts using embeddings).">
      <div className="grid sm:grid-cols-3 gap-3">
        {STRATEGIES.map((s) => (
          <div key={s.name} className="rounded-xl p-4" style={{ background: `linear-gradient(135deg,${s.col}18,${s.col}08)`, border: `1px solid ${s.col}38` }}>
            <div className="text-white font-semibold text-sm mb-2">{s.name}</div>
            <p className="text-xs text-slate-300 mb-3">{s.desc}</p>
            <div className="flex items-center gap-1.5 mono text-[11px]">
              {s.respects ? <Check className="w-3.5 h-3.5" style={{ color: s.col }} /> : <X className="w-3.5 h-3.5" style={{ color: s.col }} />}
              <span className="text-slate-400">respects sentence structure</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
