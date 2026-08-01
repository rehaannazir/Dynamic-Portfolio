import { memo } from "react";

/* Chapter 4's required diagram: Chapter 1's timeline, extended forward past the neural turn
   into the specific missing links (semantic search, open-domain QA) and the 2020 paper that
   formalized RAG — same visual grammar as IrTimelineDiagram, more nodes. */
const STEPS = [
  { label: "Boolean & BM25", sub: "1950s–2000s · lexical", col: "#64748b" },
  { label: "Semantic Search", sub: "2013+ · embeddings enter", col: "#3b82f6" },
  { label: "Open-Domain QA", sub: "2017+ · retrieve, then extract", col: "#8b5cf6" },
  { label: "RAG Paper", sub: "2020 · Lewis et al., retrieve + generate", col: "#f472b6" },
  { label: "Production RAG", sub: "2022+ · this book", col: "#10b981" },
];

export const IrToRagFullTimeline = memo(function IrToRagFullTimeline() {
  return (
    <div className="glass rounded-2xl p-6 my-8 relative overflow-hidden not-prose"
      role="img" aria-label="Extended timeline: Boolean and BM25 search, then semantic search with embeddings, then open-domain question answering, then the 2020 RAG paper, then today's production RAG systems.">
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
      <p className="text-xs text-center text-slate-400 mono mt-5 relative">The last three steps span barely a decade — the first two span most of a century.</p>
    </div>
  );
});
