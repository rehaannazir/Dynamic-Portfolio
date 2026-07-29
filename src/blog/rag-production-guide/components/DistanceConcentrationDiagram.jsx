import { memo } from "react";

/* Chapter 11's required diagram + animation, combined into one asset (same pattern as Chapter
   1's timeline): simulated distance histograms at low vs high dimensionality, bars animating
   in to show the "flattening" — distances between random points become statistically similar
   as dimensionality grows. Bar heights are hand-picked to illustrate the effect, not computed
   from a real simulation running in the browser — that distinction is stated in the caption. */
const LOW_D = [10, 22, 38, 55, 70, 55, 38, 22, 10, 4];
const HIGH_D = [3, 5, 9, 16, 28, 44, 60, 44, 28, 16];

function Histogram({ bars, col, label }) {
  return (
    <div>
      <div className="mono text-[11px] text-slate-400 mb-2">{label}</div>
      <div className="flex items-end gap-1" style={{ height: 90 }}>
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t" style={{
            background: col, height: `${h}%`, opacity: 0,
            animation: `slideIn 0.5s ease ${i * 0.05}s forwards`,
          }} />
        ))}
      </div>
    </div>
  );
}

export const DistanceConcentrationDiagram = memo(function DistanceConcentrationDiagram() {
  return (
    <div className="glass rounded-2xl p-6 my-8 not-prose" role="img"
      aria-label="Two histograms of pairwise distances between random points: at low dimensionality distances spread widely, at high dimensionality they cluster tightly around one value — illustrating distance concentration.">
      <div className="grid sm:grid-cols-2 gap-6">
        <Histogram bars={LOW_D} col="#3b82f6" label="~3 dimensions — distances spread out" />
        <Histogram bars={HIGH_D} col="#8b5cf6" label="~500 dimensions — distances bunch together" />
      </div>
      <p className="text-xs text-center text-slate-400 mono mt-4">Illustrative, not a live simulation — the effect it depicts (distance concentration) is a real, well-documented property of high-dimensional spaces.</p>
    </div>
  );
});
