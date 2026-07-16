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
/* High-end gate: only powerful machines get the smooth-scroll engine (Lenis+GSAP) and the WebGL
   scenes. Everyone else gets instant native scrolling and the lightweight visuals. */
export const isHighEnd = () => {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency || 0;
  const mem = navigator.deviceMemory; // undefined on some browsers
  if (cores < 8) return false;
  if (mem !== undefined && mem < 8) return false;
  return true;
};

/* ============================================================
   ANIMATION MANAGER
   One rAF ticker and one scroll dispatcher for the whole page,
   instead of every hook spinning its own loop/listener.
   - onFrame:        shared per-frame ticker; auto-stops when no
                     subscribers and when the tab is hidden.
   - onScrollFrame:  single passive scroll listener; batches all
                     reads, then all writes (no layout thrash); also
                     flags <html data-scrolling> so decorative CSS
                     animations can freeze while the user scrolls.
   ============================================================ */
const _frameSubs = new Set();
let _afOn = false, _afId = 0, _afLast = 0;
function _afLoop(t) {
  _afId = requestAnimationFrame(_afLoop);
  const dt = t - _afLast; _afLast = t;
  _frameSubs.forEach((fn) => fn(t, dt));
}
function _afStart() { if (!_afOn && _frameSubs.size && (typeof document === "undefined" || !document.hidden)) { _afOn = true; _afLast = performance.now(); _afId = requestAnimationFrame(_afLoop); } }
function _afStop() { if (_afOn) { _afOn = false; cancelAnimationFrame(_afId); } }
export function onFrame(fn) {
  _frameSubs.add(fn); _afStart();
  return () => { _frameSubs.delete(fn); if (!_frameSubs.size) _afStop(); };
}

const _scrollSubs = new Set();
let _scrollOn = false, _scrollQueued = false, _idleT = 0;
function _flushScroll() {
  _scrollQueued = false;
  const y = window.scrollY || window.pageYOffset || 0;
  _scrollSubs.forEach((s) => { if (s.read) s.read(y); });   // read phase
  _scrollSubs.forEach((s) => { if (s.write) s.write(y); });  // write phase
}
function _onScrollEvt() {
  if (!_scrollQueued) { _scrollQueued = true; requestAnimationFrame(_flushScroll); }
  const r = document.documentElement;
  if (!r.hasAttribute("data-scrolling")) r.setAttribute("data-scrolling", "");
  clearTimeout(_idleT);
  _idleT = setTimeout(() => r.removeAttribute("data-scrolling"), 150);
}
export function onScrollFrame(sub) {
  _scrollSubs.add(sub);
  if (!_scrollOn) { _scrollOn = true; window.addEventListener("scroll", _onScrollEvt, { passive: true }); window.addEventListener("resize", _onScrollEvt, { passive: true }); }
  _flushScroll();
  return () => {
    _scrollSubs.delete(sub);
    if (!_scrollSubs.size && _scrollOn) { _scrollOn = false; window.removeEventListener("scroll", _onScrollEvt); window.removeEventListener("resize", _onScrollEvt); }
  };
}
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => { if (document.hidden) _afStop(); else _afStart(); });
}

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

/* ---------- Cinematic scroll: Lenis momentum + GSAP/ScrollTrigger timeline engine ----------
   Lenis drives the scroll; GSAP's ticker drives Lenis; ScrollTrigger updates off Lenis.
   This is the canonical wiring that lets scrubbed timelines stay perfectly in sync with
   smooth scroll. `gsapReady` resolves once the engine is live; anything scroll-choreographed
   waits on it and otherwise renders in its natural (visible) state — so no JS = no blank page. */
let _lenis = null;
let _gsapResolve;
export const gsapReady = new Promise((res) => { _gsapResolve = res; });
export function smoothTo(target, { offset = 0, duration } = {}) {
  if (_lenis) { _lenis.scrollTo(target, { offset, duration }); return; }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else if (target && target.getBoundingClientRect) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
}
export function useSmoothScroll() {
  useEffect(() => {
    // Ordinary devices, touch, and reduced-motion all use instant native scroll (no Lenis/GSAP loop).
    if (isCoarse() || prefersReduced() || !isHighEnd()) return;
    let raf = 0, lenis = null, alive = true, ticker = null, gsap = null, ScrollTrigger = null;
    let timerId = 0;
    // Gate Lenis+GSAP loading on first user interaction — keeps 131KB vendor-anim out of
    // Lighthouse's FCP→TTI window. Real users trigger it before they start scrolling.
    const load = () => {
      if (!alive) return;
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
      window.removeEventListener("scroll", load);
      window.removeEventListener("touchstart", load);
      clearTimeout(timerId);
      Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")])
        .then(([lm, gm, sm]) => {
          if (!alive) return;
          const Lenis = lm.default;
          gsap = gm.gsap || gm.default;
          ScrollTrigger = sm.ScrollTrigger || sm.default;
          gsap.registerPlugin(ScrollTrigger);
          lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1 });
          _lenis = lenis;
          lenis.on("scroll", ScrollTrigger.update);
          ticker = (time) => lenis.raf(time * 1000);
          gsap.ticker.add(ticker);
          gsap.ticker.lagSmoothing(0);
          _gsapResolve({ gsap, ScrollTrigger });
          ScrollTrigger.refresh();
        })
        .catch(() => {
          // Fall back to a plain rAF Lenis loop if GSAP fails to load.
          import("lenis").then(({ default: Lenis }) => {
            if (!alive) return;
            lenis = new Lenis({ duration: 1.15, smoothWheel: true });
            _lenis = lenis;
            const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
            raf = requestAnimationFrame(loop);
          }).catch(() => {});
        });
    };
    window.addEventListener("pointerdown", load);
    window.addEventListener("keydown", load);
    window.addEventListener("scroll", load, { passive: true });
    window.addEventListener("touchstart", load, { passive: true });
    timerId = setTimeout(load, 6000);
    return () => {
      alive = false;
      clearTimeout(timerId);
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
      window.removeEventListener("scroll", load);
      window.removeEventListener("touchstart", load);
      cancelAnimationFrame(raf);
      if (ticker && gsap) gsap.ticker.remove(ticker);
      if (ScrollTrigger) ScrollTrigger.getAll().forEach((t) => t.kill());
      if (lenis) lenis.destroy();
      _lenis = null;
    };
  }, []);
}

/* ---------- useScrub — reusable scroll-linked timeline primitive ----------
   Pass a builder (gsap, ScrollTrigger, el) => void that creates a scrubbed timeline.
   Runs inside a gsap.context scoped to the element so every tween/trigger it makes is
   reverted cleanly on unmount. No-ops (element stays visible) for reduced-motion / touch. */
export function useScrub(build, deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el || prefersReduced() || isCoarse() || !isHighEnd()) return;
    let ctx = null, cancelled = false;
    gsapReady.then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !ref.current) return;
      ctx = gsap.context(() => build(gsap, ScrollTrigger, ref.current), ref);
    });
    return () => { cancelled = true; if (ctx) ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* ---------- useParallax — translate an element through the viewport (depth) ----------
   Shares the central scroll dispatcher; read (measure) and write (transform) run in
   separate batched phases so multiple parallax elements never thrash layout. */
export function useParallax(speed = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el || prefersReduced() || isCoarse()) return;
    let target = 0;
    return onScrollFrame({
      read: () => { const r = el.getBoundingClientRect(); target = -(r.top + r.height / 2 - window.innerHeight / 2) * speed; },
      write: () => { el.style.transform = `translate3d(0,${target.toFixed(1)}px,0)`; },
    });
  }, [speed]);
  return ref;
}

/* ---------- useScrollDepth — expose 0..1 viewport progress as a CSS var for scroll-linked lighting ---------- */
export function useScrollDepth(varName = "--p") {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (prefersReduced()) { el.style.setProperty(varName, "0.5"); return; }
    let val = 0.5;
    return onScrollFrame({
      read: () => { const r = el.getBoundingClientRect(); val = Math.max(0, Math.min(1, 1 - (r.top + r.height / 2) / (window.innerHeight + r.height / 2))); },
      write: () => { el.style.setProperty(varName, val.toFixed(3)); },
    });
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
    let raf = 0, ev = null;
    const apply = () => {
      raf = 0; if (!ev) return;
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - (r.left + r.width / 2)) * strength;
      const y = (ev.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px,${y}px)`;
    };
    const move = (e) => { ev = e; if (!raf) raf = requestAnimationFrame(apply); };
    const leave = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } ev = null; el.style.transform = "translate(0,0)"; };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); if (raf) cancelAnimationFrame(raf); };
  }, [strength]);
  return ref;
}

/* ---------- useSpotlight — one delegated listener powering pointer glow + tilt on every .glass-hover.
   rAF-throttled: at most one measure + write per frame regardless of pointer event rate. ---------- */
export function useSpotlight() {
  useEffect(() => {
    if (isCoarse()) return;
    const reduce = prefersReduced();
    let current = null, raf = 0, ev = null;
    const reset = (el) => { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); };
    const apply = () => {
      raf = 0; if (!ev) return;
      const card = ev.target.closest && ev.target.closest(".glass-hover");
      if (card !== current) { if (current) reset(current); current = card; }
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      if (!reduce) {
        card.style.setProperty("--rx", ((0.5 - py) * 5).toFixed(2) + "deg");
        card.style.setProperty("--ry", ((px - 0.5) * 5).toFixed(2) + "deg");
      }
    };
    const move = (e) => { ev = e; if (!raf) raf = requestAnimationFrame(apply); };
    document.addEventListener("pointermove", move, { passive: true });
    return () => { document.removeEventListener("pointermove", move); if (raf) cancelAnimationFrame(raf); if (current) reset(current); };
  }, []);
}

/* ---------- Reveal presets — varied entrances so no two sections reveal alike ---------- */
// filter: blur() removed from all variants — blur compositing forces a GPU paint pass per frame
// for every animating element simultaneously. Pure transform+opacity is fully compositor-only.
export const REVEAL_VARIANTS = {
  up:    { hidden: { transform: "translateY(44px)"                                    } },
  blur:  { hidden: { transform: "translateY(22px)"                                    } },
  scale: { hidden: { transform: "translateY(26px) scale(.93)"                         } },
  left:  { hidden: { transform: "translateX(-52px)"                                   } },
  right: { hidden: { transform: "translateX(52px)"                                    } },
  rotate:{ hidden: { transform: "perspective(1200px) rotateX(12deg) translateY(34px)" } },
  depth: { hidden: { transform: "perspective(1200px) translateZ(-120px) translateY(30px)" } },
  clip:  { hidden: { transform: "translateY(20px)", clipPath: "inset(0 0 100% 0)" }, shown: { clipPath: "inset(0 0 0% 0)" } },
  plain: { hidden: { transform: "translateY(30px)" } },
};
export function Reveal({ children, delay = 0, className = "", variant = "up", duration = 1.5, style = {} }) {
  const ref = useRef(null), [vis, setVis] = useState(false), [done, setDone] = useState(false);
  const reduced = typeof window !== "undefined" && prefersReduced();
  useEffect(() => {
    if (reduced) return; // reduced-motion render path below never reads `vis`
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, [reduced]);
  if (reduced) return <div ref={ref} className={className} style={style}>{children}</div>;
  const v = REVEAL_VARIANTS[variant] || REVEAL_VARIANTS.up;
  const ease = "cubic-bezier(.16,1,.3,1)";
  const props = ["opacity", "transform", "clip-path"].map((p) => `${p} ${duration}s ${ease} ${delay}s`).join(", ");
  const hidden = { opacity: 0, transform: "translateY(0)", ...v.hidden };
  const shown = { opacity: 1, transform: "translateY(0)", clipPath: "inset(0 0 0% 0)", ...(v.shown || {}) };
  // willChange removed from filter — only compositor-safe properties remain.
  return (
    <div
      ref={ref}
      className={className}
      style={{ ...(vis ? shown : hidden), transition: props, ...(done ? {} : { willChange: "transform, opacity" }), ...style }}
      onTransitionEnd={vis && !done ? () => setDone(true) : undefined}
    >
      {children}
    </div>
  );
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
