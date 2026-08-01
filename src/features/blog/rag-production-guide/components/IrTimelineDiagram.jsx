import { memo } from "react";

/* Chapter 1's required diagram + animation, built as one asset (matches how ArchDiagram already
   doubles as both in the Python-automation article). Nodes fade/slide in on a staggered delay
   the moment the diagram scrolls into view; connectors reuse the existing vdash keyframe. */
const STEPS = [
  { label: "Card Catalogs", sub: "1876 · manual, physical index", col: "#94a3b8" },
  { label: "Boolean Search", sub: "1950s · AND / OR / NOT queries", col: "#64748b" },
  { label: "TF-IDF & BM25", sub: "1970s–2009 · statistical relevance", col: "#3b82f6" },
  { label: "Neural Retrieval", sub: "2018+ · embeddings, semantic search", col: "#8b5cf6" },
  { label: "RAG", sub: "2020+ · retrieval + generation, joined", col: "#f472b6" },
];

export const IrTimelineDiagram = memo(function IrTimelineDiagram() {
  return (
    <div className="glass rounded-2xl p-6 my-8 relative overflow-hidden not-prose"
      role="img" aria-label="Timeline of information retrieval: card catalogs, then Boolean search, then TF-IDF and BM25, then neural retrieval, then RAG.">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex md:flex-1 items-center">
            <div className="flex-1 rounded-xl px-4 py-3.5" style={{
              background: `linear-gradient(135deg,${s.col}20,${s.col}08)`,
              border: `1px solid ${s.col}38`,
              opacity: 0,
              animation: `slideIn 0.6s cubic-bezier(.16,1,.3,1) ${i * 0.15}s forwards`,
            }}>
              <div className="text-white font-semibold text-sm">{s.label}</div>
              <div className="mono text-[11px] mt-0.5" style={{ color: s.col + "cc" }}>{s.sub}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="hidden md:flex items-center justify-center px-1 shrink-0" aria-hidden="true">
                <svg width="28" height="16" viewBox="0 0 28 16">
                  <line x1="0" y1="8" x2="20" y2="8" stroke={s.col} strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "vdash 0.9s linear infinite" }} />
                  <path d="M16,3 L22,8 L16,13" fill="none" stroke={s.col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-slate-400 mono mt-5 relative">Nearly 150 years of retrieval, converging on one architecture.</p>
    </div>
  );
});
