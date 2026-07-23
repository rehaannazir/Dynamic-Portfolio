import { useEffect, useRef } from "react";
import { LightSweep, Reveal } from "@/lib/motion";

export function ShowreelSection() {
  const iframeRef = useRef(null);
  // The reel iframe stays non-interactive (so scrolling passes straight through it). Start its
  // ambient audio on the visitor's first interaction with the page — browsers forbid audio before
  // a user gesture, so this is the earliest it can legally play. No button, then stays on.
  useEffect(() => {
    let done = false;
    const evts = ["wheel", "pointerdown", "keydown", "touchstart"];
    const remove = () => evts.forEach((e) => window.removeEventListener(e, tryStart));
    const tryStart = () => {
      if (done) return;
      try {
        const w = iframeRef.current && iframeRef.current.contentWindow;
        if (w && typeof w.nexaraStartAudio === "function" && w.nexaraStartAudio()) { done = true; remove(); }
      } catch { /* not ready yet — keep listening */ }
    };
    evts.forEach((e) => window.addEventListener(e, tryStart, { passive: true }));
    return remove;
  }, []);
  // Drive the reel's animation: it only runs while actually on-screen (paused otherwise) — so it
  // costs nothing when scrolled past and far less while scrolling through it.
  useEffect(() => {
    const el = iframeRef.current; if (!el) return;
    let visible = false;
    const apply = () => { try { el.contentWindow && el.contentWindow.nexaraSetVisible && el.contentWindow.nexaraSetVisible(visible); } catch { /* not ready */ } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; apply(); }, { rootMargin: "150px 0px", threshold: 0 });
    io.observe(el);
    el.addEventListener("load", apply);
    return () => { io.disconnect(); el.removeEventListener("load", apply); };
  }, []);
  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <Reveal variant="clip">
        <p className="mono text-[10px] text-slate-400 tracking-widest mb-4 uppercase">Agent loop · tool calling · automation &amp; more — in one breath.</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-10">Thirty seconds of <span className="grad-text">what I do</span>.</h2>
      </Reveal>
      <Reveal delay={0.15} variant="plain">
        {/* Cinematic floating frame: ambient glow + animated light ring. The frame itself is NOT
            animated — scaling/filtering an element that contains an iframe forces a full iframe
            re-rasterization every frame, which is what made scrolling here stutter. The gentle
            "breathing" now lives on the blurred glow only (cheap), never on the iframe. */}
        <div className="relative" style={{ transformOrigin: "center" }}>
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] breathe" style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(99,102,241,0.28), transparent 70%)", filter: "blur(24px)", opacity: 0.7 }} />
          <div className="relative rounded-2xl p-px overflow-hidden" style={{ boxShadow: "0 40px 90px -30px rgba(0,0,0,0.8), 0 0 50px -16px rgba(99,102,241,0.45)" }}>
            <div aria-hidden="true" className="ring-spin" style={{ position: "absolute", top: "-15%", left: "-15%", width: "130%", height: "130%", background: "conic-gradient(from 0deg, transparent 0deg, rgba(99,102,241,0.5) 60deg, rgba(139,92,246,0.5) 130deg, transparent 240deg)", animation: "spinSlow 18s linear infinite" }} />
            <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", aspectRatio: "16/9", background: "#000000" }}>
              <iframe
                ref={iframeRef}
                src="/nexara-showreel.html"
                title="Nexara Showreel"
                loading="lazy"
                tabIndex={-1}
                style={{ width: "100%", height: "100%", border: "none", display: "block", pointerEvents: "none" }}
              />
              {/* glass reflection sweep across the top */}
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/3 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06), transparent)" }} />
              {/* slow cinematic light sweep across the bezel */}
              <LightSweep duration={9} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
