import { memo } from "react";

/* Chapter 8's required animation/diagram: the angle between two vectors, plus thin lines
   connecting a query point to its nearest neighbors with opacity proportional to similarity —
   making cosine similarity a visible quantity rather than only a formula. */
const NEIGHBORS = [
  { x: 200, y: 55, sim: 0.95 },
  { x: 175, y: 90, sim: 0.78 },
  { x: 215, y: 110, sim: 0.55 },
  { x: 90, y: 150, sim: 0.12 },
];

export const SimilarityLinesDiagram = memo(function SimilarityLinesDiagram() {
  return (
    <div className="glass rounded-2xl p-6 my-8 not-prose" role="img"
      aria-label="A query point with lines drawn to four other points, each line's opacity proportional to its cosine similarity to the query — the closest points in direction have the brightest, most solid lines.">
      <svg viewBox="0 0 260 200" className="w-full max-w-sm mx-auto">
        <circle cx="40" cy="170" r="5" fill="#818cf8" />
        <text x="46" y="174" fill="#a5b4fc" fontSize="10" fontFamily="monospace">query</text>
        {NEIGHBORS.map((n, i) => (
          <g key={i}>
            <line x1="40" y1="170" x2={n.x} y2={n.y} stroke="#8b5cf6" strokeWidth="1.5"
              style={{ opacity: 0, animation: `slideIn 0.5s ease ${0.15 * i}s forwards`, strokeOpacity: n.sim }} />
            <circle cx={n.x} cy={n.y} r="4" fill={n.sim > 0.5 ? "#c4b5fd" : "#475569"} />
            <text x={n.x + 7} y={n.y + 3} fill="#94a3b8" fontSize="9" fontFamily="monospace">{n.sim.toFixed(2)}</text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-center text-slate-400 mono mt-1">Brighter, more solid lines = higher cosine similarity to the query point.</p>
    </div>
  );
});
