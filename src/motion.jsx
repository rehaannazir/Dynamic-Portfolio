/* eslint-disable react-refresh/only-export-components -- shared motion utilities module (hooks + presets + components by design) */
import { useEffect, useRef, useState } from "react";

/* ============================================================
   MOTION ARCHITECTURE
   A small, reusable system shared across the homepage so motion
   feels authored rather than bolted on. Every utility is
   GPU-friendly (transform/opacity only), rAF-throttled, cleans
   up after itself, and degrades for reduced-motion / touch.
   ============================================================ */

export const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isCoarse = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/* Capability tier — lets components scale effort to the device. */
export function useMotionState() {
  const [state] = useState(() => {
    if (typeof window === "undefined") return { reduced: false, coarse: false, tier: "high" };
    const cores = navigator.hardwareConcurrency || 8;
    const mem = navigator.deviceMemory || 8;
    return { reduced: prefersReduced(), coarse: isCoarse(), tier: cores <= 4 || mem <= 4 ? "low" : "high" };
  });
  return state;
}

/* ---------- Smooth scroll (Lenis singleton) ---------- */
let _lenis = null;
export function smoothTo(target, { offset = 0, duration } = {}) {
  if (_lenis) { _lenis.scrollTo(target, { offset, duration }); return; }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else if (target && target.getBoundingClientRect) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
}
export function useSmoothScroll() {
  useEffect(() => {
    if (isCoarse() || prefersReduced()) return; // native scroll on touch / reduced-motion
    let raf = 0, lenis = null, alive = true;
    import("lenis").then(({ default: Lenis }) => {
      if (!alive) return;
      lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 1 });
      _lenis = lenis;
      const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }).catch(() => {});
    return () => { alive = false; cancelAnimationFrame(raf); if (lenis) lenis.destroy(); _lenis = null; };
  }, []);
}

/* ---------- useParallax — translate an element through the viewport (depth) ---------- */
export function useParallax(speed = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el || prefersReduced() || isCoarse()) return;
    let raf = 0, ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0,${(-center * speed).toFixed(1)}px,0)`;
    };
    const onScroll = () => { if (!ticking) { ticking = true; raf = requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return ref;
}

/* ---------- useScrollDepth — expose 0..1 viewport progress as a CSS var (--p) for scroll-linked lighting ---------- */
export function useScrollDepth(varName = "--p") {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (prefersReduced()) { el.style.setProperty(varName, "0.5"); return; }
    let raf = 0, ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const p = 1 - (r.top + r.height / 2) / (window.innerHeight + r.height / 2);
      el.style.setProperty(varName, Math.max(0, Math.min(1, p)).toFixed(3));
    };
    const onScroll = () => { if (!ticking) { ticking = true; raf = requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [varName]);
  return ref;
}

/* ---------- useFloating — composable idle float (returns props for a WRAPPER node) ---------- */
export function useFloating({ amplitude = 9, duration = 7, delay = 0 } = {}) {
  if (prefersReduced()) return { className: "", style: {} };
  return { className: "floating", style: { "--amp": `${-Math.abs(amplitude)}px`, "--fdur": `${duration}s`, animationDelay: `${delay}s` } };
}

/* ---------- useMagnetic — element drifts toward the cursor, springs back ---------- */
export function useMagnetic(strength = 0.32) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (isCoarse() || prefersReduced()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px,${y}px)`;
    };
    const leave = () => { el.style.transform = "translate(0,0)"; };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [strength]);
  return ref;
}

/* ---------- useSpotlight — one delegated listener powering pointer glow + tilt on every .glass-hover ---------- */
export function useSpotlight() {
  useEffect(() => {
    if (isCoarse()) return;
    const reduce = prefersReduced();
    let current = null;
    const reset = (el) => { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); };
    const move = (e) => {
      const card = e.target.closest(".glass-hover");
      if (card !== current) { if (current) reset(current); current = card; }
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      if (!reduce) {
        card.style.setProperty("--rx", ((0.5 - py) * 5).toFixed(2) + "deg");
        card.style.setProperty("--ry", ((px - 0.5) * 5).toFixed(2) + "deg");
      }
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => { document.removeEventListener("pointermove", move); if (current) reset(current); };
  }, []);
}

/* ---------- Reveal presets — varied entrances so no two sections reveal alike ---------- */
export const REVEAL_VARIANTS = {
  up:    { hidden: { transform: "translateY(44px)",                                   filter: "blur(8px)"  } },
  blur:  { hidden: { transform: "translateY(22px)",                                   filter: "blur(16px)" } },
  scale: { hidden: { transform: "translateY(26px) scale(.93)",                        filter: "blur(7px)"  } },
  left:  { hidden: { transform: "translateX(-52px)",                                  filter: "blur(6px)"  } },
  right: { hidden: { transform: "translateX(52px)",                                   filter: "blur(6px)"  } },
  rotate:{ hidden: { transform: "perspective(1200px) rotateX(12deg) translateY(34px)", filter: "blur(5px)" } },
  depth: { hidden: { transform: "perspective(1200px) translateZ(-120px) translateY(30px)", filter: "blur(6px)" } },
  clip:  { hidden: { transform: "translateY(20px)", filter: "blur(4px)", clipPath: "inset(0 0 100% 0)" }, shown: { clipPath: "inset(0 0 0% 0)" } },
};
export function Reveal({ children, delay = 0, className = "", variant = "up", duration = 1.5, style = {} }) {
  const ref = useRef(null), [vis, setVis] = useState(false);
  const reduced = typeof window !== "undefined" && prefersReduced();
  useEffect(() => {
    if (reduced) { setVis(true); return; }
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, [reduced]);
  if (reduced) return <div ref={ref} className={className} style={style}>{children}</div>;
  const v = REVEAL_VARIANTS[variant] || REVEAL_VARIANTS.up;
  const ease = "cubic-bezier(.16,1,.3,1)";
  const props = ["opacity", "transform", "filter", "clip-path"].map((p) => `${p} ${duration}s ${ease} ${delay}s`).join(", ");
  const hidden = { opacity: 0, transform: "translateY(0)", filter: "blur(0)", ...v.hidden };
  const shown = { opacity: 1, transform: "translateY(0)", filter: "blur(0)", clipPath: "inset(0 0 0% 0)", ...(v.shown || {}) };
  return <div ref={ref} className={className} style={{ ...(vis ? shown : hidden), transition: props, willChange: "transform, opacity, filter", ...style }}>{children}</div>;
}
/* Alias — RevealPreset reads nicely at call sites that pick a named entrance. */
export const RevealPreset = Reveal;

/* ---------- FloatingCard — glass card suspended in space (float + spotlight + tilt) ---------- */
export function FloatingCard({ children, className = "", float = true, amplitude = 8, duration = 7, delay = 0, accent, style = {}, ...rest }) {
  const f = useFloating({ amplitude, duration, delay });
  const floatProps = float ? f : { className: "", style: {} };
  const accentStyle = accent ? { "--accent": accent } : {};
  return (
    <div className={"h-full " + floatProps.className} style={floatProps.style}>
      <div className={"glass glass-hover " + className} style={{ ...accentStyle, ...style }} {...rest}>{children}</div>
    </div>
  );
}

/* ---------- LightBeam / LightSweep — light as a guiding design element ---------- */
export function LightBeam({ className = "", style = {} }) {
  return <div aria-hidden="true" className={"pointer-events-none absolute left-0 right-0 " + className} style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.5),rgba(99,102,241,0.25),transparent)", maskImage: "linear-gradient(90deg,transparent,#000 30%,#000 70%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 30%,#000 70%,transparent)", ...style }} />;
}
export function LightSweep({ className = "", duration = 7, delay = 0 }) {
  return <div aria-hidden="true" className={"light-sweep pointer-events-none absolute inset-0 " + className} style={{ "--swdur": `${duration}s`, animationDelay: `${delay}s` }} />;
}

/* ---------- SectionTransition — connective handoff so sections feel continuous, not stacked ---------- */
export function SectionTransition({ duration = 10, reverse = false, glow = true }) {
  return (
    <div className="relative h-px max-w-6xl mx-auto px-5 my-2" aria-hidden="true">
      {glow && <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-10 w-[60%] h-24 blur-2xl" style={{ background: "radial-gradient(60% 100% at 50% 50%, rgba(99,102,241,0.12), transparent 70%)" }} />}
      <LightBeam style={{ top: 0, animation: `beamShift ${duration}s ease-in-out infinite ${reverse ? "alternate-reverse" : "alternate"}` }} />
    </div>
  );
}
