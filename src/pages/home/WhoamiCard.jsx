import { memo, useEffect, useRef } from "react";

/* ===================== WHOAMI CARD ===================== */
const _HL_BASE = { display:"block", borderRadius:4, paddingLeft:6, marginLeft:-6, paddingRight:4, transition:"background 1s ease, box-shadow 1s ease" };
export const WhoamiCard = memo(function WhoamiCard() {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const spans = container.querySelectorAll("[data-hl]");
    let current = 0;
    const highlight = (idx) => {
      spans.forEach((s, i) => {
        s.style.background = i === idx ? "rgba(99,102,241,0.18)" : "transparent";
        s.style.boxShadow = i === idx ? "inset 2px 0 0 #818cf8" : "inset 2px 0 0 transparent";
      });
    };
    highlight(0);
    let timer = null;
    const start = () => { if (!timer) timer = setInterval(() => { current = (current + 1) % spans.length; highlight(current); }, 1600); };
    const stop  = () => { clearInterval(timer); timer = null; };
    const io = new IntersectionObserver(([e]) => { e.isIntersecting ? start() : stop(); }, { rootMargin: "120px" });
    io.observe(container);
    const onVis = () => { if (document.hidden) stop(); else start(); };
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => { stop(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  return (
    <div ref={containerRef} className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
        <span className="w-3 h-3 rounded-full bg-red-400/70"/><span className="w-3 h-3 rounded-full bg-yellow-400/70"/><span className="w-3 h-3 rounded-full bg-green-400/70"/>
        <span className="mono text-xs text-slate-400 ml-2">~/rehan — zsh</span>
      </div>
      <div className="p-4 mono text-xs space-y-1.5">
        <span data-hl style={_HL_BASE} className="text-slate-400">// whoami.ts</span>
        <span data-hl style={_HL_BASE}><span className="text-indigo-400">const</span> <span className="text-sky-300">engineer</span> <span className="text-slate-400">=</span> {"{"}</span>
        <span data-hl style={_HL_BASE} className="pl-4 text-slate-300">name: <span className="text-emerald-300">"Rehan Nazir"</span>,</span>
        <span data-hl style={_HL_BASE} className="pl-4 text-slate-300">role: <span className="text-emerald-300">"AI &amp; Automation Eng"</span>,</span>
        <span data-hl style={_HL_BASE} className="pl-4 text-slate-300">stack: [<span className="text-emerald-300">"FastAPI"</span>, <span className="text-emerald-300">"n8n"</span>, <span className="text-emerald-300">"LLMs"</span>],</span>
        <span data-hl style={_HL_BASE} className="pl-4 text-slate-300">shipping: <span className="text-purple-300">true</span>,</span>
        <span data-hl style={_HL_BASE}>{"}"};
        </span>
        <span data-hl style={_HL_BASE} className="text-slate-400">{"// → ready to build "}<span className="inline-block w-2 h-3.5 align-middle" style={{ background: "#a78bfa", animation: "blink 1s step-end infinite" }} /></span>
      </div>
    </div>
  );
});
