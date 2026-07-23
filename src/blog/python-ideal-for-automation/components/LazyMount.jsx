import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────
   LAZY MOUNT — defers creating an expensive child (a WebGL scene) until
   it's actually near the viewport. The hero canvas is needed immediately,
   but the workflow/neural diagrams sit deep in the article body; without
   this they'd each spin up a full Three.js scene + WebGLRenderer the
   instant the article mounts, well before the reader has scrolled that far.
───────────────────────────────────────────────────────── */
export function LazyMount({ children, rootMargin = "500px 0px" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect(); } }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);
  return <div ref={ref} style={{ width: "100%", height: "100%" }}>{show ? children : null}</div>;
}
