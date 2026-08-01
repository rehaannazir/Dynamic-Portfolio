import { memo } from "react";

/* Chapter 6's required animation: points settle from a random scatter into semantic clusters —
   the "closeness = meaning" intuition. Each dot gets its own generated @keyframes rule that
   animates `left`/`top` (container-relative %, so it's correct regardless of the container's
   actual rendered pixel size) from a start position to its cluster position. Left/top instead
   of transform is a deliberate exception here: this is a 9-element, one-shot, 1.3s animation
   triggered once on scroll-into-view, not a continuous loop, so the layout cost is negligible —
   using transform with percentage values would be wrong here since percentages in `transform`
   resolve against the element's own tiny box, not the parent container. */
const CLUSTERS = [
  { label: "animals", col: "#3b82f6", pts: [[18,22],[24,30],[14,32]] },
  { label: "finance", col: "#f472b6", pts: [[78,20],[84,28],[72,30]] },
  { label: "weather", col: "#10b981", pts: [[50,75],[42,68],[58,70]] },
];
const STARTS = [[55,15],[20,65],[80,55],[35,40],[65,80],[10,10],[90,10],[45,90],[75,45]];

export const EmbeddingCloudAnimation = memo(function EmbeddingCloudAnimation() {
  const dots = [];
  let si = 0;
  CLUSTERS.forEach((c) => c.pts.forEach(([ex, ey], i) => {
    const [sx, sy] = STARTS[si % STARTS.length]; si++;
    dots.push({ key: `${c.label}-${i}`, col: c.col, sx, sy, ex, ey, name: `embedSettle${si}` });
  }));

  return (
    <div className="glass rounded-2xl p-6 my-8 not-prose" role="img"
      aria-label="Nine points scattered randomly, animating into three labeled clusters: animals, finance, and weather — visualizing that embeddings trained well place similar meanings close together in vector space.">
      <style>{dots.map((d) => `@keyframes ${d.name}{from{left:${d.sx}%;top:${d.sy}%;}to{left:${d.ex}%;top:${d.ey}%;}}`).join("\n")}</style>
      <div className="relative mx-auto" style={{ width: "100%", maxWidth: 360, aspectRatio: "1.3" }}>
        {CLUSTERS.map((c) => (
          <div key={c.label} className="absolute mono text-[10px]" style={{
            left: `${c.pts[0][0]}%`, top: `${c.pts[0][1] - 12}%`, color: c.col + "cc",
            opacity: 0, animation: "slideIn 0.6s ease 1.4s forwards",
          }}>{c.label}</div>
        ))}
        {dots.map((d) => (
          <span key={d.key} className="absolute rounded-full" style={{
            width: 8, height: 8, marginLeft: -4, marginTop: -4, background: d.col,
            left: `${d.sx}%`, top: `${d.sy}%`, boxShadow: `0 0 8px ${d.col}88`,
            animation: `${d.name} 1.3s cubic-bezier(.16,1,.3,1) 0.2s forwards`,
          }} />
        ))}
      </div>
      <p className="text-xs text-center text-slate-400 mono mt-2">A well-trained embedding space does this on its own: similar meanings drift together, unrelated ones drift apart.</p>
    </div>
  );
});
