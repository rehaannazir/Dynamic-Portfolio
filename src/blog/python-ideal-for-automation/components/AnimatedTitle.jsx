import { useEffect, useState } from "react";

export function AnimatedTitle() {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 150); return () => clearTimeout(t); }, []);
  const words = ["WHY", "PYTHON", "FOR", "AUTOMATION"];
  let idx = 0;
  // One shimmer animation on the parent h1 instead of one per character.
  // Previously each character ran its own `shimmer` keyframe, producing 21+
  // independent CSS animations. A single animation on the ancestor is visually
  // identical but eliminates the redundant work entirely.
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
              <span key={ch + d} className="inline-block" style={{
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(48px)",
                transition: `opacity 0.65s ease ${d}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${d}s`,
              }}>{ch}</span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
