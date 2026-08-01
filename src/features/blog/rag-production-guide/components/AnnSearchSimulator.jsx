import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";

/* Chapter 12's interactive (and animation, and diagram — combined, per the pattern already
   used for Ch.1/Ch.16): a fixed cloud of points, a query point, and a "search" button that
   reveals only a small checked subset before landing on the nearest ones — versus a toggle
   that runs brute force and checks every single point. Genuinely interactive client-side state,
   no external data — the point is the CONTRAST in how much gets touched, not real ANN math. */
const TOTAL = 120;
// deterministic layout so this never shifts between renders
function seededPoints(n) {
  const pts = [];
  let s = 42;
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s / 0x7fffffff); };
  for (let i = 0; i < n; i++) pts.push({ x: rand() * 92 + 4, y: rand() * 80 + 8 });
  return pts;
}
const POINTS = seededPoints(TOTAL);
const QUERY = { x: 50, y: 46 };
// the "true" nearest neighbors, by plain distance, precomputed once
const RANKED = POINTS
  .map((p, i) => ({ i, d: Math.hypot(p.x - QUERY.x, p.y - QUERY.y) }))
  .sort((a, b) => a.d - b.d);
const NEAREST_IDS = new Set(RANKED.slice(0, 6).map((r) => r.i));
// ANN "checks" only a small candidate region near the query, not the whole cloud
const ANN_CHECKED_IDS = new Set(RANKED.slice(0, 14).map((r) => r.i));

export function AnnSearchSimulator() {
  const [mode, setMode] = useState(null); // null | "ann" | "flat"

  const checked = mode === "ann" ? ANN_CHECKED_IDS : mode === "flat" ? new Set(POINTS.map((_, i) => i)) : new Set();

  return (
    <div className="glass rounded-2xl p-5 my-8 not-prose">
      <div className="flex items-center justify-between mb-4">
        <span className="mono text-xs text-slate-300">ANN vs. flat search — {TOTAL} points</span>
        <button onClick={() => setMode(null)} className="flex items-center gap-1.5 mono text-xs text-slate-400 hover:text-white transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> reset
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden" style={{ height: 260, background: "#0a0a0f", border: "1px solid rgba(255,255,255,0.06)" }}>
        {POINTS.map((p, i) => {
          const isChecked = checked.has(i);
          const isNearest = mode && NEAREST_IDS.has(i);
          return (
            <span key={i} className="absolute rounded-full" style={{
              left: `${p.x}%`, top: `${p.y}%`, width: isNearest ? 7 : 4, height: isNearest ? 7 : 4,
              marginLeft: isNearest ? -3.5 : -2, marginTop: isNearest ? -3.5 : -2,
              background: isNearest ? "#34d399" : isChecked ? "#818cf8" : "#334155",
              boxShadow: isNearest ? "0 0 6px #34d399aa" : isChecked ? "0 0 4px #818cf8aa" : "none",
              transition: "background 0.25s, box-shadow 0.25s",
            }} />
          );
        })}
        <span className="absolute rounded-full" style={{
          left: `${QUERY.x}%`, top: `${QUERY.y}%`, width: 10, height: 10, marginLeft: -5, marginTop: -5,
          background: "#f472b6", boxShadow: "0 0 10px #f472b6cc", zIndex: 2,
        }} />
        <span className="absolute mono text-[10px] text-pink-300" style={{ left: `${QUERY.x}%`, top: `${QUERY.y}%`, marginLeft: 10, marginTop: -6 }}>query</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button onClick={() => setMode("ann")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white btn-glow"
          style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
          <Search className="w-3.5 h-3.5" /> run ANN search
        </button>
        <button onClick={() => setMode("flat")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300"
          style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
          run flat (brute-force) search
        </button>
        <span className="mono text-xs text-slate-400 ml-auto">
          {mode === "ann" && `checked ${ANN_CHECKED_IDS.size} of ${TOTAL} points`}
          {mode === "flat" && `checked ${TOTAL} of ${TOTAL} points`}
          {!mode && "pick a search mode"}
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-3">Green points are the true 6 nearest neighbors either way — ANN finds them by checking a small candidate region (indigo) instead of every point (only visible under flat search).</p>
    </div>
  );
}
