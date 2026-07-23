import { memo, useEffect, useRef, useState } from "react";

export const Counter = memo(function Counter({ to, suffix = "" }) {
  const ref = useRef(null), [n, setN] = useState(0), done = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let alive = true;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const dur = 1500, s = performance.now();
        // `alive` guard prevents setState after unmount if the rAF fires
        // after the component has been removed from the tree.
        const t = (x) => { if (!alive) return; const p = Math.min((x - s) / dur, 1); setN(Math.round((1 - Math.pow(1 - p, 3)) * to)); if (p < 1) requestAnimationFrame(t); };
        requestAnimationFrame(t);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { alive = false; io.disconnect(); };
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
});
