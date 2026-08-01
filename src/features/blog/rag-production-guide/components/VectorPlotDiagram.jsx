import { memo } from "react";

/* Chapter 5's required diagram: a single arrow from the origin to a point, with the "now
   imagine this in 768 dimensions" callout that sets up Chapter 11 (High-Dimensional Space)
   much later in the book. */
export const VectorPlotDiagram = memo(function VectorPlotDiagram() {
  return (
    <div className="glass rounded-2xl p-6 my-8 not-prose" role="img"
      aria-label="A single vector drawn as an arrow from the origin to the point (4,3) in a 2D plane, labeled with its two components.">
      <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto">
        <line x1="20" y1="180" x2="240" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="20" y1="180" x2="20" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <defs>
          <marker id="vecArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#8b5cf6" />
          </marker>
        </defs>
        <line x1="20" y1="180" x2="180" y2="60" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#vecArrow)"
          style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: "vdraw 1s ease forwards" }} />
        <circle cx="180" cy="60" r="3" fill="#c4b5fd" />
        <text x="188" y="58" fill="#c4b5fd" fontSize="12" fontFamily="monospace">v = [4, 3]</text>
        <text x="130" y="196" fill="#64748b" fontSize="10" fontFamily="monospace">4 units →</text>
        <text x="-10" y="100" fill="#64748b" fontSize="10" fontFamily="monospace" transform="rotate(-90 24 100)">3 units ↑</text>
      </svg>
      <p className="text-xs text-center text-slate-400 mono mt-2">Two numbers, one arrow. An embedding later in this Part is the same idea — just with 768 numbers instead of 2, which nobody can draw but the math treats identically.</p>
    </div>
  );
});
