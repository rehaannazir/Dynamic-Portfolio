import { memo } from "react";

/* Chapter 10's required diagram: the same two points, annotated two ways — the straight line
   Euclidean distance measures directly, and the angle cosine similarity measures instead
   (Ch.8, referenced ahead of its own publication since this chapter depends on it). */
export const EuclideanDiagram = memo(function EuclideanDiagram() {
  return (
    <div className="glass rounded-2xl p-6 my-8 not-prose" role="img"
      aria-label="Two points in a 2D plane, A at (1,2) and B at (4,6). A dashed straight line connects them labeled distance 5 — what Euclidean distance measures. A separate arc at the origin marks the angle between the two vectors — what cosine similarity measures instead.">
      <svg viewBox="0 0 280 220" className="w-full max-w-sm mx-auto">
        <line x1="20" y1="200" x2="260" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="20" y1="200" x2="20" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* vector to A = (1,2) scaled */}
        <line x1="20" y1="200" x2="60" y2="160" stroke="#3b82f6" strokeWidth="1.5" />
        <circle cx="60" cy="160" r="4" fill="#3b82f6" />
        <text x="66" y="158" fill="#93c5fd" fontSize="11" fontFamily="monospace">A (1,2)</text>
        {/* vector to B = (4,6) scaled */}
        <line x1="20" y1="200" x2="180" y2="40" stroke="#8b5cf6" strokeWidth="1.5" />
        <circle cx="180" cy="40" r="4" fill="#8b5cf6" />
        <text x="186" y="40" fill="#c4b5fd" fontSize="11" fontFamily="monospace">B (4,6)</text>
        {/* straight-line (Euclidean) distance between A and B */}
        <line x1="60" y1="160" x2="180" y2="40" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4 4" style={{ animation: "vdash 1s linear infinite" }} />
        <text x="95" y="92" fill="#f9a8d4" fontSize="11" fontFamily="monospace">distance = 5</text>
        {/* angle arc at origin, between the two vectors */}
        <path d="M 44 176 A 28 28 0 0 1 46 148" fill="none" stroke="#34d399" strokeWidth="1.5" />
        <text x="30" y="140" fill="#6ee7b7" fontSize="10" fontFamily="monospace">angle (Ch.8)</text>
      </svg>
      <p className="text-xs text-center text-slate-400 mono mt-1">Same two points. The pink dashed line is Euclidean distance. The green arc is what cosine similarity measures instead.</p>
    </div>
  );
});
