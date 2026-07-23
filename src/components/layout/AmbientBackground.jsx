/* Fixed decorative gradient/orb layer behind the whole app. `--sy` (scroll progress, written by
   Portfolio's onScrollFrame subscription) drives the two subtly parallaxing layers at the bottom. */
export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0, contain: "paint" }}>
      <div className="bg-orb absolute rounded-full" style={{ width: 500, height: 500, top: "-10%", left: "-5%", background: "radial-gradient(circle,rgba(59,130,246,0.14),transparent 70%)", filter: "blur(20px)", animation: "floatA 38s ease-in-out infinite" }} />
      <div className="bg-orb absolute rounded-full" style={{ width: 600, height: 600, bottom: "-15%", right: "-10%", background: "radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)", filter: "blur(20px)", animation: "floatB 46s ease-in-out infinite" }} />
      <div className="bg-orb absolute rounded-full" style={{ width: 300, height: 300, top: "40%", left: "60%", background: "radial-gradient(circle,rgba(192,132,252,0.07),transparent 70%)", filter: "blur(16px)", animation: "drift 55s ease-in-out infinite" }} />
      <div className="bg-orb absolute inset-0" style={{ background: "conic-gradient(from 200deg at 80% 12%, transparent 0deg, rgba(99,102,241,0.05) 60deg, transparent 130deg, rgba(139,92,246,0.04) 220deg, transparent 300deg)", animation: "aurora 60s ease-in-out infinite", opacity: 0.45 }} />
      <div className="absolute inset-x-0 bottom-0 h-[60vh]" style={{ background: "radial-gradient(60% 100% at 50% 120%, rgba(99,102,241,0.06), transparent 70%)", transform: "translateY(calc(var(--sy,0) * -0.05px))" }} />
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(165,180,252,0.10) 1px, transparent 1.4px)", backgroundSize: "46px 46px", opacity: 0.35, maskImage: "radial-gradient(80% 60% at 50% 30%, #000, transparent 75%)", WebkitMaskImage: "radial-gradient(80% 60% at 50% 30%, #000, transparent 75%)", transform: "translateY(calc(var(--sy,0) * 0.04px))" }} />
    </div>
  );
}
