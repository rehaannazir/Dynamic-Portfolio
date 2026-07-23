import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────── */
export function Counter({ end, prefix = "", suffix = "" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const dur = 1800;
        const tick = (now) => {
          const prog = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - prog, 3);
          setN(Math.round(ease * end));
          if (prog < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return (
    <span ref={ref} className="mono font-black text-3xl lg:text-4xl"
      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      {prefix}{n.toLocaleString()}{suffix}
    </span>
  );
}
