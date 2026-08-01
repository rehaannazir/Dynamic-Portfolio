import { useEffect, useState } from "react";

export function AnimatedTitle() {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 150); return () => clearTimeout(t); }, []);
  const words = ["WHY", "PYTHON", "FOR", "AUTOMATION"];
  let idx = 0;
  // Single shimmer animation + gradient clip on the parent h1 (not one per character) to
  // avoid 21+ independent CSS animations. `background-clip: text` only paints through an
  // ancestor's OWN text glyphs, not through descendant `inline-block` boxes — so the
  // per-character wrappers below must stay `display: inline` (never `inline-block`), and
  // the per-character stagger can only animate `opacity` (CSS transforms don't apply to
  // non-replaced inline boxes), not a translateY slide.
  return (
    <h1 className="font-black text-center leading-none select-none"
      style={{
        fontSize: "clamp(2.4rem,7.5vw,5.5rem)", letterSpacing: "-0.03em",
        background: "linear-gradient(135deg,#fff 0%,#a5b4fc 38%,#c084fc 65%,#f472b6 100%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text", backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: vis ? "shimmer 5s linear infinite" : "none",
      }}>
      {words.map((w, wi) => (
        <span key={wi} className="block">
          {w.split("").map((ch) => {
            const d = idx++ * 0.038;
            return (
              <span key={ch + d} style={{
                display: "inline",
                opacity: vis ? 1 : 0,
                transition: `opacity 0.65s ease ${d}s`,
              }}>{ch}</span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
