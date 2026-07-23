/* ---- futuristic animated blog/project visuals ---- */
export function BlogVisual({ cat }) {
  const wrap = (art) => (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#0a0a0a" }}>
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 0%,rgba(99,102,241,0.14),transparent 60%)" }} />
      {art}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(150% 100% at 50% 0%,rgba(139,92,246,0.22),transparent 60%)" }} />
    </div>
  );
  if (cat === "Engineering") return wrap(
    <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-5 mono text-[10px]">
      <div className="text-slate-400">// content-api · live</div>
      {[["POST", "/v1/generate"], ["GET", "/v1/content"], ["POST", "/v1/schedule"]].map((r, i) => (<div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border" style={{ animation: `vrow 6s ease-in-out ${i * 1.2}s infinite`, borderColor: "rgba(255,255,255,0.08)" }}><span className="text-purple-300 w-9">{r[0]}</span><span className="text-slate-300 flex-1 truncate">{r[1]}</span><span className="text-emerald-400">200</span></div>))}
      <div className="text-slate-400">{"{ engine: gemini }"}<span className="inline-block w-1.5 h-3 ml-1 align-middle" style={{ background: "#a78bfa", animation: "blink 1s step-end infinite" }} /></div>
    </div>
  );
  if (cat === "AI Agents") return wrap(
    <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
      <defs><filter id="gr" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <path d="M30,75 H270" fill="none" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" strokeDasharray="4 6" style={{ animation: "vdash 1.2s linear infinite" }} />
      {[[6, "query"], [66, "embed"], [126, "vDB"], [186, "LLM"], [246, "answer"]].map(([x, l], i) => (<g key={i}><rect x={x} y="60" width="48" height="30" rx="6" fill="rgba(13,12,28,0.95)" stroke="rgba(139,92,246,0.55)" />{l === "vDB" ? [0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={x + 16 + c * 8} cy={70 + r * 5} r="1.4" fill="#818cf8" style={{ animation: `vpulse 1.6s ease-in-out ${(r + c) * 0.15}s infinite` }} />)) : <text x={x + 24} y="79" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill="#c7d2fe">{l}</text>}</g>))}
      <circle r="3.5" fill="#ddd6fe" filter="url(#gr)"><animateMotion dur="2.8s" repeatCount="indefinite" path="M30,75 H270" /></circle>
    </svg>
  );
  if (cat === "Workflow") { const paths = ["M84,47 C104,47 100,80 120,80", "M84,113 C104,113 100,80 120,80", "M184,80 C200,80 208,80 224,80"]; return wrap(
    <svg viewBox="0 0 300 160" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
      <defs><filter id="gw" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter><marker id="awf" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#818cf8" /></marker></defs>
      {paths.map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" strokeDasharray="4 5" markerEnd="url(#awf)" style={{ animation: "vdash 1s linear infinite" }} />)}
      {[[20, 32, "trigger"], [20, 98, "http"], [120, 65, "AI agent"], [224, 65, "send"]].map(([x, y, l], i) => (<g key={i}><rect x={x} y={y} width={l === "send" ? 56 : 64} height="30" rx="7" fill="rgba(13,12,28,0.96)" stroke="rgba(139,92,246,0.6)" /><circle cx={x + 12} cy={y + 15} r="3" fill="#818cf8" style={{ animation: `vpulse 2s ease-in-out ${i * 0.3}s infinite` }} /><text x={x + (l === "send" ? 34 : 38)} y={y + 19} textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill="#c7d2fe">{l}</text></g>))}
      {paths.map((d, i) => <circle key={`d${i}`} r="3" fill="#ddd6fe" filter="url(#gw)"><animateMotion dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} /></circle>)}
    </svg>
  ); }
  if (cat === "Strategy") { const bars = [[55, 40, "DFY"], [140, 70, "Product"], [225, 100, "SaaS"]]; return wrap(
    <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
      <defs><filter id="gs" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter><linearGradient id="barG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#3b82f6" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
      <line x1="20" y1="130" x2="285" y2="130" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {bars.map(([x, h, l], i) => (<g key={i}><rect x={x} y={130 - h} width="42" height={h} rx="4" fill="url(#barG)" style={{ transformBox: "fill-box", transformOrigin: "bottom", animation: `vgrow 1.1s cubic-bezier(.16,1,.3,1) ${i * 0.2}s both` }} /><text x={x + 21} y="144" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#a5b4fc">{l}</text></g>))}
      <polyline points="76,90 161,60 246,30" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="260" strokeDashoffset="260" style={{ animation: "vdraw 1.4s ease 0.6s forwards" }} />
      <circle cx="246" cy="30" r="4" fill="#ddd6fe" filter="url(#gs)" style={{ animation: "vpulse 1.6s ease-in-out infinite" }} />
    </svg>
  ); }
  if (cat === "Trading") { const c = [[34, 36, 112, 56, 30, 1], [66, 50, 122, 70, 26, 0], [98, 30, 100, 48, 34, 1], [130, 46, 116, 62, 28, 0], [162, 28, 96, 44, 30, 1], [194, 42, 108, 56, 26, 0], [226, 26, 92, 40, 32, 1], [258, 38, 102, 52, 30, 1]]; return wrap(
    <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
      <defs><filter id="gt" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      {c.map((k, i) => { const col = k[5] ? "#818cf8" : "#c084fc"; return (<g key={i} style={{ transformBox: "fill-box", transformOrigin: "center", animation: `vcandle 3s ease-in-out ${i * 0.18}s infinite` }}><line x1={k[0]} y1={k[1]} x2={k[0]} y2={k[2]} stroke={col} strokeWidth="1.2" /><rect x={k[0] - 5} y={k[3]} width="10" height={k[4]} rx="1.5" fill={col} opacity="0.9" /></g>); })}
      <polyline points="34,72 66,84 98,66 130,80 162,64 194,78 226,60 258,70" fill="none" stroke="#ddd6fe" strokeWidth="1.6" strokeDasharray="320" strokeDashoffset="320" style={{ animation: "vdraw 2s ease forwards" }} filter="url(#gt)" />
      <text x="150" y="142" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#94a3b8">↻ data → pattern → test → execute</text>
    </svg>
  ); }
  return wrap(
    <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
      <defs><filter id="gauto" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter><marker id="aauto" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#818cf8" /></marker></defs>
      <path d="M50,82 H250" fill="none" stroke="rgba(139,92,246,0.45)" strokeWidth="1.5" strokeDasharray="4 6" style={{ animation: "vdash 1.2s linear infinite" }} />
      {[[35, "trigger"], [120, "AI agent"], [205, "action"]].map(([x, l], i) => (<g key={i}><rect x={x} y="66" width="60" height="32" rx="7" fill="rgba(13,12,28,0.96)" stroke="rgba(139,92,246,0.6)" /><text x={+x + 30} y="85" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#c7d2fe">{l}</text></g>))}
      <path d="M180,66 C198,26 102,26 120,66" fill="none" stroke="#818cf8" strokeWidth="1.5" markerEnd="url(#aauto)" />
      <text x="150" y="36" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#a5b4fc">↻ runs itself</text>
      <circle r="3.5" fill="#ddd6fe" filter="url(#gauto)"><animateMotion dur="2.4s" repeatCount="indefinite" path="M50,82 H250" /></circle>
    </svg>
  );
}
