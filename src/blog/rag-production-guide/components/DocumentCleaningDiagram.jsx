import { memo } from "react";

/* Chapter 13's required diagram: raw document formats funneling through cleaning into one
   normalized text representation the rest of the pipeline can treat uniformly. */
const SOURCES = [
  { label: "PDF", col: "#ef4444", note: "layout noise, headers/footers" },
  { label: "HTML", col: "#f59e0b", note: "markup, nav/ads to strip" },
  { label: "Markdown", col: "#3b82f6", note: "closest to clean already" },
  { label: "DOCX", col: "#8b5cf6", note: "styles, embedded tables" },
];

export const DocumentCleaningDiagram = memo(function DocumentCleaningDiagram() {
  return (
    <div className="glass rounded-2xl p-6 my-8 not-prose" role="img"
      aria-label="Four source formats — PDF, HTML, Markdown, DOCX — each with different cleaning challenges, funneling into one normalized clean-text representation.">
      <div className="grid sm:grid-cols-4 gap-2">
        {SOURCES.map((s, i) => (
          <div key={s.label} className="rounded-lg p-3 text-center" style={{
            background: `${s.col}14`, border: `1px solid ${s.col}38`,
            opacity: 0, animation: `slideIn 0.5s ease ${i * 0.1}s forwards`,
          }}>
            <div className="mono text-xs font-semibold" style={{ color: s.col }}>{s.label}</div>
            <div className="text-[10px] text-slate-500 mt-1">{s.note}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center my-3" aria-hidden="true">
        <svg width="16" height="28" viewBox="0 0 16 28"><line x1="8" y1="0" x2="8" y2="20" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "vdash 0.9s linear infinite" }} /><path d="M2,16 L8,24 L14,16" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div className="rounded-lg p-3 text-center mx-auto max-w-xs" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
        <div className="mono text-xs font-semibold text-emerald-300">Normalized clean text</div>
        <div className="text-[10px] text-slate-500 mt-1">what every downstream stage assumes</div>
      </div>
    </div>
  );
});
