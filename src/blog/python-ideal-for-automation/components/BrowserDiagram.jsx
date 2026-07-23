import { memo } from "react";

/* ─────────────────────────────────────────────────────────
   BROWSER FLOW DIAGRAM
───────────────────────────────────────────────────────── */
export const BrowserDiagram = memo(function BrowserDiagram() {
  const steps = [["Open URL", "#6366f1"], ["Wait for element", "#3b82f6"], ["Click / Type", "#8b5cf6"], ["Extract data", "#10b981"], ["Save result", "#34d399"]];
  return (
    <div className="glass rounded-2xl p-5 my-6 not-prose relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="relative flex items-center gap-2 flex-wrap">
        {steps.map(([label, col], i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="rounded-lg px-3 py-2 text-xs font-medium text-white" style={{ background: `${col}22`, border: `1px solid ${col}44` }}>{label}</div>
            {i < steps.length - 1 && (
              <svg width="24" height="12" viewBox="0 0 24 12">
                <path d="M0,6 H20" stroke={col} strokeWidth="1.4" strokeDasharray="3 3" style={{ animation: "vdash 0.8s linear infinite" }} />
                <path d="M16,2 L22,6 L16,10" fill="none" stroke={col} strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mono mt-3 relative">Selenium/Playwright drives the browser step by step — exactly as a human would, but at machine speed.</p>
    </div>
  );
});
