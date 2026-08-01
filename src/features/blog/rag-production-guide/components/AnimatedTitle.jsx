import { useEffect, useState } from "react";

/* Same mechanism as the Python-automation article's AnimatedTitle (single shimmer on the
   parent + per-character opacity stagger, never per-character transforms — background-clip:
   text only paints through the ancestor's own glyphs), parametrized on `words` so it's reusable
   across articles instead of hardcoding one title's text. */
export function AnimatedTitle({ words }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 150); return () => clearTimeout(t); }, []);
  let idx = 0;
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
              <span key={ch + d} style={{ display: "inline", opacity: vis ? 1 : 0, transition: `opacity 0.65s ease ${d}s` }}>{ch}</span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
