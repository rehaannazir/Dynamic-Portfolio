import { memo, useEffect, useRef } from "react";
import { Reveal, useParallax } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

/* ===================== ABOUT SECTION ===================== */
/* Terminal body: DOM-mutation cycling (no React re-renders). The `phase` cycling
   that previously called setPhase every 3.8s — triggering full re-render of the
   large AboutSection tree — is now pure DOM style toggling isolated here. */
const TerminalSequence = memo(function TerminalSequence() {
  const rootRef = useRef(null);
  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let phase = 0, timer = null, visible = true;
    const show = (el) => { if (el) { el.style.display = "block"; } };
    const hide = (el) => { if (el) el.style.display = "none"; };
    const update = () => {
      phase = (phase + 1) % 3;
      if (phase === 0) { hide(phase1Ref.current); hide(phase2Ref.current); }
      else if (phase === 1) { show(phase1Ref.current); hide(phase2Ref.current); }
      else { show(phase2Ref.current); }
    };
    const tick = () => { if (visible) update(); timer = setTimeout(tick, 3800); };
    timer = setTimeout(tick, 3800);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "150px" });
    io.observe(root);
    const onVis = () => { if (document.hidden) visible = false; };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearTimeout(timer); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  return (
    <div ref={rootRef} className="p-4 mono text-xs leading-relaxed space-y-3 overflow-hidden">
      <div>
        <div><span className="text-emerald-400">$ </span><span className="text-slate-300">whoami</span></div>
        <div className="mt-1 text-white font-bold ml-4">Rehan Nazir</div>
      </div>
      <div ref={phase1Ref} style={{display:"none",animation:"slideIn 0.5s ease both"}}>
        <div><span className="text-emerald-400">$ </span><span className="text-slate-300">philosophy</span></div>
        <div className="mt-1 ml-4 space-y-0.5 text-slate-400">
          <div>Build fast. Ship clean.</div>
          <div>Build with AI. Deliver value.</div>
          <div>Own every layer.</div>
        </div>
      </div>
      <div ref={phase2Ref} style={{display:"none",animation:"slideIn 0.5s ease both"}}>
        <div><span className="text-emerald-400">$ </span><span className="text-slate-300">status</span></div>
        <div className="flex items-center gap-2 mt-1 ml-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" style={{animation:"vpulse 1.5s ease-in-out infinite"}}/>
          <span className="text-emerald-300">Available for select projects</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-emerald-400">$ </span>
        <span className="inline-block w-2 h-3.5 ml-1 align-middle" style={{background:"#a78bfa",animation:"blink 1s step-end infinite"}}/>
      </div>
    </div>
  );
});

export function AboutSection() {
  const panelRef = useParallax(0.08);
  const barH = [3,5,8,12,7,14,10,6,11,9,13,7,5,9];
  return (
    <section id="about" className="max-w-6xl mx-auto px-5 py-20">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        {/* Left: floating terminal panel — scroll parallax + idle float (separate nodes) */}
        <Reveal variant="left" duration={1.7}>
          <div ref={panelRef}>
          <div className="relative float-soft" style={{height:400}}>
            {/* GIT ACTIVITY — top left */}
            <div className="absolute left-0 top-0 z-20 glass rounded-xl p-3" style={{width:162,boxShadow:"0 10px 36px rgba(0,0,0,0.55)"}}>
              <div className="flex items-center justify-between mb-2">
                <span className="mono text-[8.5px] text-slate-400 uppercase tracking-wider">Git Activity</span>
                <span className="mono text-[8.5px] text-indigo-400">7D</span>
              </div>
              <div className="flex gap-px items-end" style={{height:34}}>
                {barH.map((h,i)=>(
                  <div key={i} style={{flex:1,height:h*2.4+"px",borderRadius:2,background:`rgba(139,92,246,${0.18+h/18})`,animation:`vpulse ${2+i*0.12}s ease-in-out ${i*0.08}s infinite`}}/>
                ))}
              </div>
              <div className="mono text-[10px] text-white font-bold mt-2">142 <span className="text-slate-400 font-normal">commits</span></div>
            </div>
            {/* DEPLOYED — top right */}
            <div className="absolute right-0 top-5 z-20 rounded-xl px-3 py-2.5" style={{width:192,background:"rgba(14,14,26,0.94)",border:"1px solid rgba(52,211,153,0.22)",boxShadow:"0 10px 36px rgba(0,0,0,0.55)"}}>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"rgba(52,211,153,0.18)"}}>
                  <span className="text-emerald-400 text-[9px] leading-none">✓</span>
                </div>
                <span className="mono text-[9.5px] text-white font-medium">Deployed to production</span>
              </div>
              <span className="mono text-[7.5px] text-slate-400 ml-6">vercel · 1m 24s · @nyvexa</span>
            </div>
            {/* Main terminal — center */}
            <div className="absolute z-10 glass rounded-2xl overflow-hidden" style={{left:24,right:24,top:36,bottom:36,boxShadow:"0 24px 64px rgba(0,0,0,0.65)"}}>
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70"/><span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70"/><span className="w-2.5 h-2.5 rounded-full bg-green-400/70"/>
                <span className="mono text-xs text-slate-400 ml-2">~/rehan — zsh</span>
              </div>
              <TerminalSequence />
            </div>
            {/* INFERENCE — bottom left */}
            <div className="absolute left-0 bottom-0 z-20 glass rounded-xl p-3" style={{width:156,boxShadow:"0 10px 36px rgba(0,0,0,0.55)"}}>
              <div className="flex items-center justify-between mb-2">
                <span className="mono text-[8.5px] text-slate-400 uppercase tracking-wider">Inference</span>
                <span className="mono text-[8.5px] text-purple-400">Claude</span>
              </div>
              <svg viewBox="0 0 120 44" className="w-full">
                {[[18,10],[60,6],[104,16],[32,34],[82,38],[50,22],[10,38]].map(([x,y],i)=>(
                  <g key={i}>
                    <circle cx={x} cy={y} r="3.5" fill={["#60a5fa","#a78bfa","#c084fc","#818cf8","#60a5fa","#a78bfa","#c084fc"][i]} style={{animation:`vpulse ${2+i*0.3}s ease-in-out ${i*0.22}s infinite`}}/>
                    {i<6&&<line x1={x} y1={y} x2={[[60,6],[104,16],[32,34],[82,38],[50,22],[10,38]][i][0]} y2={[[60,6],[104,16],[32,34],[82,38],[50,22],[10,38]][i][1]} stroke="rgba(139,92,246,0.22)" strokeWidth="0.8"/>}
                  </g>
                ))}
              </svg>
            </div>
            {/* API ROUTES — bottom right */}
            <div className="absolute right-0 bottom-2 z-20 glass rounded-xl px-3 py-2.5" style={{width:184,boxShadow:"0 10px 36px rgba(0,0,0,0.55)"}}>
              {[["POST","/api/agent"],["GET","/api/rag","200"],["POST","/api/embed"]].map(([m,p,s],i)=>(
                <div key={i} className="flex items-center gap-2 py-1 mono text-[8.5px]">
                  <span style={{color:m==="GET"?"#a78bfa":"#60a5fa",width:30,flexShrink:0}}>{m}</span>
                  <span className="text-slate-400 flex-1 truncate">{p}</span>
                  {s&&<span className="text-emerald-400">{s}</span>}
                </div>
              ))}
            </div>
          </div>
          </div>
        </Reveal>
        {/* Right: bio text — layered, staggered reveal */}
        <div>
          <Reveal variant="right" delay={0.05}><SectionLabel num="01">About</SectionLabel></Reveal>
          <Reveal variant="right" delay={0.12}><h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">I live where <span className="grad-text">product meets AI</span>.</h2></Reveal>
          <Reveal variant="right" delay={0.2}><p className="text-slate-400 mt-5 leading-relaxed">I take ideas from a blank repo to a deployed, self-running system — designing the data model, wiring the APIs and the agents, and delivering something a business can actually rely on.</p></Reveal>
          <Reveal variant="right" delay={0.28}><p className="text-slate-400 mt-4 leading-relaxed">Lately that means <span className="text-slate-200">AI content APIs, n8n automations and chatbot agents</span> built on Python, FastAPI and the Gemini API — with a focus on clean handoff, not babysitting.</p></Reveal>
          <Reveal variant="right" delay={0.34}><p className="mono text-sm text-indigo-300 mt-5">// currently — Founder @ Nexara</p></Reveal>
          <div className="mt-8 flex flex-col gap-3">
            {[
              {icon:"◈",label:"End-to-end delivery",desc:"From data model to deployed interface."},
              {icon:"◎",label:"Self-running systems",desc:"Built to run without you babysitting them."},
              {icon:"◉",label:"Clean handoff",desc:"Docs, runbooks and a kill switch you own."},
            ].map(({icon,label,desc},i)=>(
              <Reveal key={label} variant="up" delay={0.4 + i * 0.1}>
              <div className="glass-hover flex items-start gap-4 px-5 py-4 rounded-xl transition-all duration-700" style={{border:"1px solid rgba(255,255,255,0.055)"}}>
                <span className="text-indigo-400 text-lg mt-0.5 shrink-0">{icon}</span>
                <div><div className="text-white text-sm font-medium">{label}</div><div className="text-slate-400 text-xs mt-0.5">{desc}</div></div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
