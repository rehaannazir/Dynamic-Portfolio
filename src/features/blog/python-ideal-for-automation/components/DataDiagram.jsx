import { memo } from "react";

/* ─────────────────────────────────────────────────────────
   DATA PIPELINE DIAGRAM
───────────────────────────────────────────────────────── */
export const DataDiagram = memo(function DataDiagram() {
  const stages = [["CSV / Excel", "#6366f1"], ["pandas DataFrame", "#3b82f6"], ["Clean & Transform", "#8b5cf6"], ["Aggregate", "#a855f7"], ["Export / Report", "#10b981"]];
  return (
    <div className="not-prose glass rounded-2xl overflow-hidden my-6">
      <div className="px-4 py-2 mono text-xs text-slate-400" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        // pandas data pipeline
      </div>
      <div className="flex items-stretch overflow-x-auto">
        {stages.map(([label, col], i) => (
          <div key={label} className="flex items-center flex-shrink-0">
            <div className="px-4 py-5 text-center" style={{ minWidth: "110px" }}>
              <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: `${col}22`, border: `1px solid ${col}44` }}>
                <div className="w-2 h-2 rounded-full" style={{ background: col, animation: `vpulse 2s ease-in-out ${i * 0.3}s infinite` }} />
              </div>
              <div className="text-xs text-slate-300 font-medium">{label}</div>
            </div>
            {i < stages.length - 1 && (
              <svg width="20" height="20" viewBox="0 0 20 20" className="flex-shrink-0">
                <path d="M0,10 H16" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "vdash 0.8s linear infinite" }} />
                <path d="M12,5 L18,10 L12,15" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
