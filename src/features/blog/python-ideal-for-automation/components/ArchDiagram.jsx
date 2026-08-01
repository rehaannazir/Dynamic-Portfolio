import { memo } from "react";

/* ─────────────────────────────────────────────────────────
   ARCHITECTURE FLOW DIAGRAM
───────────────────────────────────────────────────────── */
export const ArchDiagram = memo(function ArchDiagram() {
  const steps = [
    { label: "Trigger",       sub: "event · schedule · webhook",     col: "#6366f1" },
    { label: "Python Logic",  sub: "your script runs here",          col: "#3b82f6" },
    { label: "Libraries",     sub: "requests · pandas · selenium",   col: "#8b5cf6" },
    { label: "Output",        sub: "file · database · API · Slack",  col: "#10b981" },
    { label: "Monitor",       sub: "logs · retries · alerts",        col: "#f59e0b" },
  ];
  return (
    <div className="glass rounded-2xl p-6 my-8 relative overflow-hidden not-prose">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-sm mx-auto">
        {steps.map((s, i) => (
          <div key={s.label}>
            <div className="rounded-xl px-5 py-3.5" style={{
              background: `linear-gradient(135deg,${s.col}20,${s.col}08)`,
              border: `1px solid ${s.col}38`,
            }}>
              <div className="text-white font-semibold text-sm">{s.label}</div>
              <div className="mono text-xs mt-0.5" style={{ color: s.col + "cc" }}>{s.sub}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <svg width="20" height="26" viewBox="0 0 20 26">
                  <line x1="10" y1="0" x2="10" y2="18" stroke={s.col} strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "vdash 0.9s linear infinite" }} />
                  <path d="M4,14 L10,22 L16,14" fill="none" stroke={s.col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-center gap-2">
            <svg width="130" height="18" viewBox="0 0 130 18">
              <defs><marker id="ar" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#818cf8" /></marker></defs>
              <path d="M8,9 Q65,2 122,9" fill="none" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#ar)" style={{ animation: "vdash 1.6s linear infinite" }} />
            </svg>
            <span className="mono text-[11px] text-indigo-400">↻ repeats on every trigger</span>
          </div>
        </div>
      </div>
    </div>
  );
});
