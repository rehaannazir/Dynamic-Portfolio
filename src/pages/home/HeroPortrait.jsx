import { memo, useEffect, useRef } from "react";
import { isCoarse, prefersReduced } from "@/lib/motion";

/* ===================== HERO PORTRAIT ===================== */
/* The hero's only right-side visual: a cutout of the subject floating in space —
   no card, no frame, no box. The source photo has a solid black backdrop, so a
   plain mix-blend-mode:screen composite (photo pixel black -> whatever sits behind
   shows through unchanged) reads as a true alpha cutout with zero extra processing,
   while a blurred + hue-shifted duplicate of the same photo underneath produces a
   silhouette-hugging purple rim-glow (the sharp layer on top fully re-covers its own
   footprint, so the glow only ever peeks out past the edges — it never lands on the
   face). Orbital rings / particles / ambient glow sit further back, at lower opacity,
   so nothing crosses in front of the subject. */

const PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2 + 0.3;
  const rx = 46 + (i % 3) * 10;
  const ry = 48 + (i % 4) * 9;
  return {
    left: 50 + Math.cos(angle) * rx,
    top: 18 + Math.max(0, Math.sin(angle)) * ry + (i % 3) * 6,
    size: 2.4 + (i % 3) * 1.5,
    dur: 11 + (i % 5) * 2.3,
    delay: (i * 0.85) % 7,
    op: 0.2 + (i % 4) * 0.1,
  };
});

export const HeroPortrait = memo(function HeroPortrait() {
  const sceneRef = useRef(null);
  const tiltRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current, tilt = tiltRef.current;
    if (!scene || !tilt || isCoarse() || prefersReduced()) return;
    let raf = 0, ev = null;
    const apply = () => {
      raf = 0; if (!ev) return;
      const r = scene.getBoundingClientRect();
      const cx = Math.max(-1, Math.min(1, (ev.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      const cy = Math.max(-1, Math.min(1, (ev.clientY - (r.top + r.height / 3)) / (r.height / 2)));
      tilt.style.setProperty("--try", (cx * 6).toFixed(2) + "deg");
      tilt.style.setProperty("--trx", (-cy * 5).toFixed(2) + "deg");
      tilt.style.setProperty("--tpx", (cx * 12).toFixed(1) + "px");
      tilt.style.setProperty("--tpy", (cy * 9).toFixed(1) + "px");
      scene.style.setProperty("--px", (-cx * 5).toFixed(1) + "px");
      scene.style.setProperty("--py", (-cy * 4).toFixed(1) + "px");
    };
    const move = (e) => { ev = e; if (!raf) raf = requestAnimationFrame(apply); };
    const leave = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      ev = null;
      tilt.style.setProperty("--try", "0deg");
      tilt.style.setProperty("--trx", "0deg");
      tilt.style.setProperty("--tpx", "0px");
      tilt.style.setProperty("--tpy", "0px");
      scene.style.setProperty("--px", "0px");
      scene.style.setProperty("--py", "0px");
    };
    window.addEventListener("pointermove", move, { passive: true });
    scene.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const sources = (ext) => `/rehan-portrait-480.${ext} 480w, /rehan-portrait-720.${ext} 720w, /rehan-portrait-960.${ext} 960w, /rehan-portrait-1200.${ext} 1200w`;
  const sizes = "(min-width:1024px) 34vw, 72vw";

  return (
    <div
      ref={sceneRef}
      className="relative w-full flex justify-center lg:justify-end lg:absolute lg:left-0 lg:right-0 pointer-events-none"
      style={{ perspective: 1800, height: "clamp(520px, 82vh, 760px)", top: "clamp(4px, 3vh, 40px)" }}
    >
      {/* ---- depth layer: sits behind the subject, never in front ---- */}
      <div aria-hidden="true" className="absolute inset-0 portrait-depth" style={{ transform: "translate3d(var(--px,0),var(--py,0),0)" }}>
        <div className="absolute rounded-full blur-3xl portrait-ambient" style={{ width: "58%", left: "50%", top: "58%", aspectRatio: "1/1", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(139,92,246,0.24), transparent 72%)", animation: "drift 26s ease-in-out infinite" }} />

        <svg aria-hidden="true" className="absolute" viewBox="0 0 400 400" style={{ left: "50%", top: "62%", width: "150%", height: "46%", transform: "translate(-50%,-50%)", animation: "spinSlow 48s linear infinite" }}>
          <ellipse cx="200" cy="200" rx="196" ry="196" fill="none" stroke="rgba(139,92,246,0.26)" strokeWidth="1.4" strokeDasharray="2 12" />
        </svg>
        <svg aria-hidden="true" className="absolute" viewBox="0 0 400 400" style={{ left: "50%", top: "70%", width: "122%", height: "34%", transform: "translate(-50%,-50%)", animation: "spinSlow 66s linear infinite reverse" }}>
          <ellipse cx="200" cy="200" rx="192" ry="192" fill="none" stroke="rgba(139,92,246,0.18)" strokeWidth="1" strokeDasharray="1 8" />
        </svg>

        {PARTICLES.map((p, i) => (
          <span key={i} className="absolute rounded-full" style={{ left: p.left + "%", top: p.top + "%", width: p.size, height: p.size, background: "#8B5CF6", opacity: p.op, boxShadow: "0 0 8px 1px rgba(139,92,246,0.5)", animation: `floatA ${p.dur}s ease-in-out infinite`, animationDelay: p.delay + "s" }} />
        ))}

        <div className="absolute inset-x-0 bottom-0 portrait-fog" style={{ height: "38%", background: "linear-gradient(to top, rgba(139,92,246,0.14), transparent)" }} />
      </div>

      {/* ---- the subject ---- */}
      <div className="floating relative h-full" style={{ "--amp": "-12px", "--fdur": "8.5s" }}>
        <div ref={tiltRef} className="portrait-tilt h-full relative">
          {/* rim/bloom layer — blurred + purple-shifted duplicate, painted first (behind) */}
          <img
            src="/rehan-portrait-720.jpg"
            srcSet={sources("jpg")}
            sizes={sizes}
            alt=""
            aria-hidden="true"
            width="1003"
            height="1254"
            className="portrait-cutout portrait-rim absolute top-0 left-0 h-full w-auto select-none"
          />
          {/* sharp subject — painted on top, fully re-covers the rim layer's own footprint */}
          <picture>
            <source type="image/avif" srcSet={sources("avif")} sizes={sizes} />
            <source type="image/webp" srcSet={sources("webp")} sizes={sizes} />
            <img
              src="/rehan-portrait-720.jpg"
              srcSet={sources("jpg")}
              sizes={sizes}
              alt="Rehan Nazir — AI Engineer and Automation Specialist"
              width="1003"
              height="1254"
              className="portrait-cutout portrait-sharp relative block h-full w-auto select-none"
              fetchPriority="high"
            />
          </picture>
        </div>
      </div>
    </div>
  );
});
