import { memo } from "react";

/* Chapter 17's required diagram + animation, combined: query → embed → search → top-k,
   connectors pulsing to reinforce this as a live flow, not a static pipeline picture. */
const STEPS = [
  { label: "User query", sub: "raw text", col: "#94a3b8" },
  { label: "Embed", sub: "same model as chunks", col: "#3b82f6" },
  { label: "Search index", sub: "ANN, Ch.12", col: "#8b5cf6" },
  { label: "Top-k results", sub: "ranked chunks", col: "#10b981" },
];

export const RetrievalFlowDiagram = memo(function RetrievalFlowDiagram() {
  return (
    <div className="glass rounded-2xl p-6 my-8 relative overflow-hidden not-prose"
      role="img" aria-label="Retrieval flow: user query is embedded with the same model used for chunks, then searched against the index, returning the top-k ranked results.">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="relative flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex md:flex-1 items-center">
            <div className="flex-1 rounded-xl px-4 py-3.5" style={{
              background: `linear-gradient(135deg,${s.col}20,${s.col}08)`,
              border: `1px solid ${s.col}38`,
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
    </div>
  );
});
