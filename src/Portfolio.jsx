import { useState, useEffect, useRef, lazy, Suspense, Fragment, memo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Workflow, Cpu, MessageSquare, TrendingUp, Code, Zap, Star,
  ArrowRight, ArrowUpRight, ArrowLeft, GitFork, Link, Mail, MessageCircle, Menu, X,
  CircleCheck, Layers, Calendar, Clock, Camera, ExternalLink,
  GitBranch, Activity, ChevronRight, BookOpen, User, Send,
  Cloud, Rocket, Bot
} from "lucide-react";
import {
  prefersReduced, isCoarse, useMotionState, smoothTo, useSmoothScroll, useParallax, useScrollDepth,
  useMagnetic, useSpotlight, useScrub, onFrame, onScrollFrame, Reveal, FloatingCard, LightSweep, SectionTransition,
} from "./motion";

const HeroWebGL = lazy(() => import("./HeroWebGL"));
const AIArchitecture = lazy(() => import("./AIArchitecture"));
const PythonAutomationPost = lazy(() => import("./PythonAutomationPost"));

const SITE_URL = "https://rehannazir.com";

/* ===================== CUSTOM GLOWING CURSOR ===================== */
function CustomCursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, prevRx = mx, prevRy = my;
    const move = (e) => { mx = e.clientX; my = e.clientY; if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px)`; };
    const tick = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      if (ring.current && (Math.abs(rx - prevRx) > 0.1 || Math.abs(ry - prevRy) > 0.1)) {
        ring.current.style.transform = `translate(${rx}px,${ry}px)`;
        prevRx = rx; prevRy = ry;
      }
    };
    const over = (e) => { const hit = e.target.closest("a,button,[data-cursor],input,textarea,label"); ring.current?.classList.toggle("cursor-grow", !!hit); };
    addEventListener("mousemove", move); addEventListener("mouseover", over);
    const off = onFrame(tick); // shares the one central ticker; pauses when tab hidden
    return () => { removeEventListener("mousemove", move); removeEventListener("mouseover", over); off(); };
  }, []);
  return (<><div ref={ring} className="cursor-ring" /><div ref={dot} className="cursor-dot" /></>);
}

/* ===================== HELPERS ===================== */
/* ChapterRail — a quiet narrative spine: dots track the story (Intro → About → Stack → Work → Talk),
   the active chapter glows, and clicking glides there. The story, made navigable. */
function ChapterRail() {
  const chapters = [["intro", "Intro"], ["about", "About"], ["tech", "Stack"], ["work", "Work"], ["contact", "Talk"]];
  const [active, setActive] = useState("intro");
  useEffect(() => {
    if (isCoarse()) return;
    const els = chapters.map(([id]) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <nav aria-label="Section progress" className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3.5 items-end">
      {chapters.map(([id, label]) => {
        const on = active === id;
        return (
          <button key={id} onClick={() => smoothTo(document.getElementById(id), { offset: -60 })} className="group flex items-center gap-2.5" data-cursor aria-label={label} aria-current={on ? "true" : undefined}>
            <span className="mono text-[10px] uppercase tracking-wider transition-all duration-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0" style={{ color: on ? "#c7d2fe" : "#64748b" }}>{label}</span>
            <span className="rounded-full transition-all duration-500" style={{ width: on ? 22 : 8, height: 8, background: on ? "linear-gradient(90deg,#3b82f6,#8b5cf6)" : "rgba(255,255,255,0.22)", boxShadow: on ? "0 0 12px rgba(99,102,241,0.8)" : "none" }} />
          </button>
        );
      })}
    </nav>
  );
}
const Counter = memo(function Counter({ to, suffix = "" }) {
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
const SectionLabel = memo(function SectionLabel({ num, children }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-sm text-indigo-400">{num}</span><span className="font-mono text-sm text-slate-500">/</span>
      <span className="font-mono text-sm tracking-wide text-slate-400 uppercase">{children}</span>
      <span className="flex-1 h-px ml-2" style={{ background: "linear-gradient(90deg,rgba(139,92,246,0.4),transparent)" }} />
    </div>
  );
});
function ReadingProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    const h = document.documentElement;
    let max = 0;
    // scrollHeight/clientHeight are layout reads — compute them only on resize,
    // not on every scroll event (which would force layout recalculation per frame).
    const updateMax = () => { max = h.scrollHeight - h.clientHeight; };
    const update = () => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    };
    updateMax();
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", updateMax, { passive: true });
    return () => { removeEventListener("scroll", update); removeEventListener("resize", updateMax); };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
      <div ref={barRef} className="h-full origin-left" style={{ transform: "scaleX(0)", background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", boxShadow: "0 0 10px rgba(99,102,241,0.8)" }} />
    </div>
  );
}
/* ===================== APP ===================== */
function getStateFromPath(path) {
  const p = path || window.location.pathname;
  if (p.startsWith("/blog/")) return { page: "article", article: p.slice(6).replace(/\/$/, "") || null };
  if (/^\/services\/?$/.test(p)) return { page: "services", article: null };
  if (/^\/reviews\/?$/.test(p)) return { page: "reviews", article: null };
  if (/^\/blog\/?$/.test(p)) return { page: "blog", article: null };
  return { page: "home", article: null };
}

export default function Portfolio() {
  const initial = getStateFromPath();
  const [page, setPage] = useState(initial.page);
  const [article, setArticle] = useState(initial.article);
  const [menuOpen, setMenuOpen] = useState(false);
  useSmoothScroll();
  useEffect(() => { setMenuOpen(false); smoothTo(0, { duration: 0.8 }); }, [page, article]);
  // Background depth — drift the ambient layer with scroll, via the shared scroll dispatcher.
  useEffect(() => {
    if (prefersReduced()) return;
    return onScrollFrame({ write: (y) => document.documentElement.style.setProperty("--sy", String(y)) });
  }, []);
  // Pause EVERY section's animations (CSS + SVG/SMIL) while it's off-screen — nothing animates
  // unless you're actually looking at it. Big idle-CPU/GPU saving across the whole page.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const off = !e.isIntersecting;
        e.target.toggleAttribute("data-offscreen", off);
        e.target.querySelectorAll("svg").forEach((svg) => { try { off ? svg.pauseAnimations() : svg.unpauseAnimations(); } catch { /* not an animated SVG */ } });
      });
    }, { rootMargin: "200px 0px" });
    document.querySelectorAll("main section").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [page, article]);
  useEffect(() => {
    const onPop = () => { const s = getStateFromPath(); setPage(s.page); setArticle(s.article); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  // Pointer-reactive spotlight + subtle 3D tilt on every glass card (one delegated listener).
  useSpotlight();
  const hireRef = useMagnetic();
  const navigate = useCallback((newPage) => {
    const paths = { home: "/", services: "/services", reviews: "/reviews", blog: "/blog" };
    window.history.pushState({}, "", paths[newPage] || "/");
    setPage(newPage);
  }, []);
  const goArticle = useCallback((slug) => { window.history.pushState({}, "", `/blog/${slug}`); setArticle(slug); setPage("article"); }, []);

  const nav = [
    { id: "home", label: "home", num: "01" }, { id: "services", label: "services", num: "02" },
    { id: "reviews", label: "reviews", num: "03" }, { id: "blog", label: "blog", num: "04" },
  ];

  return (
    <div className="nocursor min-h-screen w-full text-slate-200 relative overflow-x-hidden"
      style={{ background: "radial-gradient(1200px 600px at 12% -10%, rgba(59,130,246,0.035), transparent 60%), radial-gradient(1000px 700px at 92% 8%, rgba(139,92,246,0.04), transparent 60%), #000000", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <CustomCursor />
      {page === "article" && <ReadingProgress />}
      {page === "home" && <ChapterRail />}

      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0, contain: "paint" }}>
        <div className="bg-orb absolute rounded-full" style={{ width: 500, height: 500, top: "-10%", left: "-5%", background: "radial-gradient(circle,rgba(59,130,246,0.14),transparent 70%)", filter: "blur(20px)", animation: "floatA 38s ease-in-out infinite" }} />
        <div className="bg-orb absolute rounded-full" style={{ width: 600, height: 600, bottom: "-15%", right: "-10%", background: "radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)", filter: "blur(20px)", animation: "floatB 46s ease-in-out infinite" }} />
        <div className="bg-orb absolute rounded-full" style={{ width: 300, height: 300, top: "40%", left: "60%", background: "radial-gradient(circle,rgba(192,132,252,0.07),transparent 70%)", filter: "blur(16px)", animation: "drift 55s ease-in-out infinite" }} />
        <div className="bg-orb absolute inset-0" style={{ background: "conic-gradient(from 200deg at 80% 12%, transparent 0deg, rgba(99,102,241,0.05) 60deg, transparent 130deg, rgba(139,92,246,0.04) 220deg, transparent 300deg)", animation: "aurora 60s ease-in-out infinite", opacity: 0.45 }} />
        <div className="absolute inset-x-0 bottom-0 h-[60vh]" style={{ background: "radial-gradient(60% 100% at 50% 120%, rgba(99,102,241,0.06), transparent 70%)", transform: "translateY(calc(var(--sy,0) * -0.05px))" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(165,180,252,0.10) 1px, transparent 1.4px)", backgroundSize: "46px 46px", opacity: 0.35, maskImage: "radial-gradient(80% 60% at 50% 30%, #000, transparent 75%)", WebkitMaskImage: "radial-gradient(80% 60% at 50% 30%, #000, transparent 75%)", transform: "translateY(calc(var(--sy,0) * 0.04px))" }} />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-50 w-full">
        <div className="glass border-b border-white/5">
          <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
            <button onClick={() => setPage("home")} className="flex items-center gap-2">
              <picture>
                <source type="image/avif" srcSet="/logo-40.avif 40w, /logo-80.avif 80w, /logo-120.avif 120w" sizes="36px" />
                <source type="image/webp" srcSet="/logo-40.webp 40w, /logo-80.webp 80w, /logo-120.webp 120w" sizes="36px" />
                <img src="/logo-40.png" alt="Nexara" width="36" height="36" className="w-9 h-9 object-contain" style={{ filter: "drop-shadow(0 0 8px rgba(99,102,241,0.6))" }} />
              </picture>
              <span className="mono text-sm text-white">rehan.nazir<span className="text-indigo-400">()</span></span>
            </button>
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {nav.map((n) => (
                <button key={n.id} onClick={() => navigate(n.id)} className={"px-3 py-2 rounded-lg text-sm mono transition-all flex items-center gap-1.5 " + ((page === n.id || (page === "article" && n.id === "blog")) ? "text-white" : "text-slate-400 hover:text-white")} style={(page === n.id || (page === "article" && n.id === "blog")) ? { background: "rgba(99,102,241,0.14)", border: "1px solid rgba(139,92,246,0.4)" } : {}}>
                  <span className="text-indigo-400 text-xs">{n.num}</span>{n.label}
                </button>
              ))}
              <button ref={hireRef} onClick={() => { navigate("home"); setTimeout(() => smoothTo(document.getElementById("contact"), { offset: -80 }), 180); }} className="btn-glow magnetic ml-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>hire me →</button>
            </nav>
            <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
          {menuOpen && (
            <div className="md:hidden glass border-t border-white/5 px-5 py-3 flex flex-col gap-1">
              {nav.map((n) => (<button key={n.id} onClick={() => navigate(n.id)} className={"px-4 py-3 rounded-lg text-sm mono text-left flex items-center gap-2 " + (page === n.id ? "text-white bg-white/5" : "text-slate-400")}><span className="text-indigo-400 text-xs">{n.num}</span>{n.label}</button>))}
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10" key={page + (article || "")}>
        {page === "home" && <Home setPage={navigate} />}
        {page === "services" && <Services />}
        {page === "reviews" && <Reviews />}
        {page === "blog" && <Blog openArticle={goArticle} />}
        {page === "article" && (<><BlogPost slug={article} back={() => navigate("blog")} openArticle={goArticle} /><div className="max-w-6xl mx-auto px-5 pb-20 flex justify-center"><button onClick={() => navigate("blog")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-200 glass glass-hover" data-cursor><ArrowLeft className="w-4 h-4" /> Back to all blogs</button></div></>)}
      </main>

      <Footer setPage={navigate} />
    </div>
  );
}

/* ===================== HERO 3D CANVAS ===================== */
function Hero3D() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf, angle = 0;

    const resize = () => {
      const p = canvas.parentElement;
      canvas.width = p.offsetWidth * dpr;
      canvas.height = p.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Fibonacci sphere particles
    const N = 70;
    const pts = Array.from({ length: N }, (_, i) => {
      const phi = Math.acos(1 - 2 * (i + 0.5) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return { x: Math.sin(phi) * Math.cos(theta), y: Math.sin(phi) * Math.sin(theta), z: Math.cos(phi) };
    });

    // Floating octahedra
    const octas = Array.from({ length: 9 }, () => ({
      x: Math.random(), y: Math.random() * 0.85 + 0.05,
      sz: 12 + Math.random() * 26,
      rx: Math.random() * Math.PI * 2, ry: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.00016, vy: (Math.random() - 0.5) * 0.00011,
      vrx: (Math.random() - 0.5) * 0.013, vry: (Math.random() - 0.5) * 0.017,
    }));

    const rotY = ({ x, y, z }, a) => ({ x: x*Math.cos(a)+z*Math.sin(a), y, z: -x*Math.sin(a)+z*Math.cos(a) });
    const rotX = ({ x, y, z }, a) => ({ x, y: y*Math.cos(a)-z*Math.sin(a), z: y*Math.sin(a)+z*Math.cos(a) });
    const proj2d = ({ x, y, z }, cx, cy, r) => { const f = 2.8/(2.8+z); return { sx: cx+x*r*f, sy: cy+y*r*f, f, z }; };

    const drawOcta = (cx, cy, sz, rx, ry) => {
      const v = [
        {x:0,y:-1,z:0},{x:0,y:1,z:0},{x:1,y:0,z:0},{x:-1,y:0,z:0},{x:0,y:0,z:1},{x:0,y:0,z:-1},
      ].map(p => { let q = rotX(p,rx); q = rotY(q,ry); const f=3/(3+q.z); return [cx+q.x*sz*f, cy+q.y*sz*f, q.z]; });
      [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]].forEach(([a,b]) => {
        const alpha = Math.max(0, ((v[a][2]+v[b][2])/2+1)/2);
        ctx.beginPath(); ctx.moveTo(v[a][0],v[a][1]); ctx.lineTo(v[b][0],v[b][1]);
        ctx.strokeStyle = `rgba(139,92,246,${alpha*0.75})`; ctx.lineWidth = 1; ctx.stroke();
      });
      // Glow vertices
      [[0,2],[1,4]].forEach(([a]) => {
        const g = ctx.createRadialGradient(v[a][0],v[a][1],0,v[a][0],v[a][1],4);
        g.addColorStop(0,"rgba(167,139,250,0.22)"); g.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(v[a][0],v[a][1],4,0,Math.PI*2); ctx.fill();
      });
    };

    const draw = () => {
      const w = canvas.width/dpr, h = canvas.height/dpr;
      ctx.clearRect(0,0,w,h);
      const mobile = w < 768;
      const cx = mobile ? w*0.5 : w*0.73, cy = h*0.5;
      const r = Math.min(w,h) * (mobile ? 0.28 : 0.23);

      // Rotate & project sphere
      const projected = pts.map(p => { let q=rotY(p,angle); q=rotX(q,angle*0.28); return proj2d(q,cx,cy,r); });

      // Outer halo rings (two concentric)
      [1.15, 1.35].forEach((scale, i) => {
        ctx.beginPath(); ctx.arc(cx, cy, r*scale, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(99,102,241,${0.06 - i*0.02})`; ctx.lineWidth = i===0 ? 1.5 : 0.8; ctx.stroke();
      });

      // Connections between nearby particles
      const maxD = r*0.54;
      for (let i=0; i<projected.length; i++) for (let j=i+1; j<projected.length; j++) {
        const a=projected[i], b=projected[j];
        const dx=a.sx-b.sx, dy=a.sy-b.sy, d=Math.sqrt(dx*dx+dy*dy);
        if (d < maxD) {
          ctx.beginPath(); ctx.moveTo(a.sx,a.sy); ctx.lineTo(b.sx,b.sy);
          ctx.strokeStyle = `rgba(139,92,246,${(1-d/maxD)*0.45*Math.min(a.f,b.f)*2.5})`; ctx.lineWidth=0.6; ctx.stroke();
        }
      }

      // Layered ambient glow
      const g1 = ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.9);
      g1.addColorStop(0,"rgba(99,102,241,0.08)"); g1.addColorStop(0.45,"rgba(59,130,246,0.04)"); g1.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=g1; ctx.beginPath(); ctx.arc(cx,cy,r*1.9,0,Math.PI*2); ctx.fill();

      // Second inner glow
      const g2 = ctx.createRadialGradient(cx,cy,0,cx,cy,r*0.8);
      g2.addColorStop(0,"rgba(139,92,246,0.06)"); g2.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(cx,cy,r*0.8,0,Math.PI*2); ctx.fill();

      // Particles
      projected.forEach(({sx,sy,f,z}) => {
        const alpha=(z+1)/2, size=Math.max(0.6,2.1*f);
        ctx.beginPath(); ctx.arc(sx,sy,size,0,Math.PI*2);
        ctx.fillStyle = z>0 ? `rgba(192,168,255,${alpha})` : `rgba(96,165,250,${alpha*0.7})`; ctx.fill();
        if (z>0.3) {
          const g=ctx.createRadialGradient(sx,sy,0,sx,sy,size*6);
          g.addColorStop(0,`rgba(167,139,250,${alpha*0.09})`); g.addColorStop(1,"rgba(0,0,0,0)");
          ctx.fillStyle=g; ctx.beginPath(); ctx.arc(sx,sy,size*6,0,Math.PI*2); ctx.fill();
        }
      });

      // Floating octahedra (skip if too close to sphere)
      octas.forEach(o => {
        o.x+=o.vx; o.y+=o.vy;
        if (o.x<0.04||o.x>0.96) o.vx*=-1;
        if (o.y<0.04||o.y>0.96) o.vy*=-1;
        o.rx+=o.vrx; o.ry+=o.vry;
        const ox=o.x*w, oy=o.y*h, dx=ox-cx, dy=oy-cy;
        if (Math.sqrt(dx*dx+dy*dy) > r*1.5) drawOcta(ox,oy,o.sz,o.rx,o.ry);
      });

    };
    // ~30fps cap + full stop when the hero is off-screen or the tab is hidden (no idle cost).
    const FRAME_MS = 1000 / 30;
    let running = false, lastT = 0, onscreen = false;
    const loop = (now) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - lastT < FRAME_MS) return;
      lastT = now;
      angle += 0.007;
      draw();
    };
    const sync = () => {
      if (onscreen && !document.hidden) { if (!running) { running = true; lastT = 0; raf = requestAnimationFrame(loop); } }
      else { running = false; cancelAnimationFrame(raf); }
    };
    const io = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; sync(); }, { threshold: 0 });
    io.observe(canvas);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);
    sync();
    return () => { running = false; cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents:"none", zIndex:0 }} />;
}

/* ===================== HOME ===================== */
const Home = memo(function Home({ setPage }) {
  const PROFILE_PIC = "/rehan.jpeg";
  const workRef = useMagnetic();
  const touchRef = useMagnetic();
  const projects = [
    { n: "01", cat: "FastAPI · Gemini", title: "AI Content Automation API", desc: "Production backend that generates, categorizes and schedules content via LLMs behind a clean REST interface.", role: "Full Stack · AI · 2026", stack: ["FastAPI", "Gemini", "SQLAlchemy"], accent: "#60a5fa", viz: "Engineering", metrics: [["p95", "120ms"], ["uptime", "99.9%"], ["routes", "12"]] },
    { n: "02", cat: "n8n · LLMs", title: "B2B Sales Automation Flow", desc: "End-to-end lead enrichment and outreach pipeline that runs hands-free and hands off cleanly to the client.", role: "Automation · 2026", stack: ["n8n", "LLMs", "APIs"], link: "https://www.loom.com/share/68bfcd80b9de459e975966cc671d11cb", accent: "#8b5cf6", viz: "Workflow", metrics: [["leads/wk", "480"], ["manual steps", "0"], ["integrations", "6"]] },
    { n: "03", cat: "Python · Gemini", title: "Finance Expense Categorizer", desc: "Turns raw CSV bank exports into categorized, analysis-ready Excel sheets automatically.", role: "AI Tooling · 2025", stack: ["Python", "Gemini", "Pandas"], accent: "#818cf8", viz: "Strategy", metrics: [["rows/run", "1.2k"], ["accuracy", "98%"], ["pipeline", "CSV→XLSX"]] },
    { n: "04", cat: "RAG · Agents", title: "Support Chatbot Agent", desc: "Context-aware support agent grounded in company docs, deployed across web and messaging channels.", role: "AI Agents · 2025", stack: ["RAG", "Agents", "React"], accent: "#c084fc", viz: "AI Agents", metrics: [["deflection", "70%"], ["grounding", "RAG"], ["channels", "2"]] },
  ];
  const stack = ["Python", "FastAPI", "n8n", "Gemini API", "AI Agents", "RAG", "SQLAlchemy", "React", "Vite", "Tailwind"];
  return (
    <>
      <Helmet>
        <title>Rehan Nazir — AI Engineer & Automation Specialist | Lahore, Pakistan</title>
        <meta name="description" content="Rehan Nazir is an AI Engineer and Automation Specialist based in Lahore, Pakistan. I build AI agents, FastAPI backends, n8n workflows and RAG chatbots. Founder of Nexara. Available worldwide." />
        <link rel="canonical" href={SITE_URL + "/"} />
        <meta property="og:url" content={SITE_URL + "/"} />
        <meta property="og:title" content="Rehan Nazir — AI Engineer & Automation Specialist" />
        <meta property="og:description" content="I design and ship intelligent automation end to end — AI agents, chatbots and workflows that quietly do the work, so businesses scale without the busywork." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "mainEntity": {
            "@type": "Person",
            "name": "Rehan Nazir",
            "jobTitle": "AI Engineer & Automation Specialist",
            "description": "Self-taught AI engineer building agentic systems and automations. Founder of Nexara.",
            "url": SITE_URL,
            "sameAs": ["https://github.com/rehaannazir","https://www.linkedin.com/in/rehan-nazir-530597332"],
            "worksFor": { "@type": "Organization", "name": "Nexara" }
          }
        })}</script>
      </Helmet>
      <section id="intro" className="grid-bg relative overflow-hidden">
        <Suspense fallback={<Hero3D />}><HeroWebGL fallback={<Hero3D />} /></Suspense>
        <div className="relative z-10 max-w-6xl mx-auto px-5 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="fade-up"><div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mono text-indigo-200"><span className="w-2 h-2 rounded-full" style={{ background: "#34d399", boxShadow: "0 0 10px #34d399" }} />Available · Open to projects worldwide</div></div>
            <h1 className="fade-up text-5xl md:text-6xl font-bold tracking-tight text-white mt-6" style={{ animationDelay: ".05s", lineHeight: 1.05 }}>I'm Rehan</h1>
            <h2 className="fade-up text-5xl md:text-6xl font-bold tracking-tight mt-1" style={{ animationDelay: ".12s", lineHeight: 1.05 }}><span className="grad-text">I build AI systems</span></h2>
            <p className="fade-up grad-text text-lg md:text-xl font-semibold mt-4 mono" style={{ animationDelay: ".18s" }}>AI Engineer &amp; Automation Specialist</p>
            <p className="fade-up max-w-lg mt-5 text-slate-400 leading-relaxed" style={{ animationDelay: ".24s" }}>I design and ship <span className="text-slate-200">intelligent automation end to end</span> — AI agents, chatbots and workflows that quietly do the work, so businesses scale without the busywork.</p>
            <div className="fade-up flex flex-wrap gap-3 mt-8" style={{ animationDelay: ".3s" }}>
              <button ref={workRef} onClick={() => setPage("services")} className="btn-glow magnetic inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>View selected work <ArrowRight className="w-4 h-4" /></button>
              <button ref={touchRef} onClick={() => smoothTo(document.getElementById("contact"), { offset: -80 })} className="magnetic inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-200 glass glass-hover">Get in touch</button>
            </div>
          </div>
          <div className="fade-up flex flex-col gap-5" style={{ animationDelay: ".2s" }}>
            <div className="glass rounded-3xl p-7 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(400px 160px at 50% 0%, rgba(139,92,246,0.25), transparent 70%)" }} />
              <div className="relative text-center flex flex-col items-center">
                <div className="block mx-auto w-36 h-36 rounded-full relative">
                  <div className="absolute -inset-1 rounded-full" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", animation: "spinSlow 22s linear infinite", opacity: 0.8 }} />
                  <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-white/10 flex items-center justify-center" style={{ background: "#0c0c16" }}>
                    {PROFILE_PIC ? (
                      <picture>
                        <source type="image/avif" srcSet="/rehan-144.avif 144w, /rehan-288.avif 288w, /rehan-432.avif 432w" sizes="144px" />
                        <source type="image/webp" srcSet="/rehan-144.webp 144w, /rehan-288.webp 288w, /rehan-432.webp 432w" sizes="144px" />
                        <img src="/rehan-144.jpg" alt="Rehan Nazir — AI Engineer and Automation Specialist, Lahore Pakistan" width="144" height="144" className="w-full h-full object-cover" fetchPriority="high" />
                      </picture>
                    ) : <div className="flex flex-col items-center text-slate-500 px-3 text-center"><Camera className="w-7 h-7 mb-1" /><span className="text-[9px] mono leading-tight">set PROFILE_PIC in code</span></div>}
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg mt-5">Rehan Nazir</h3>
                <p className="text-xs mono text-indigo-300 mt-0.5">// based in Lahore, Pakistan</p>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-xs mx-auto">Helping ideas become intelligent systems through AI engineering and automation.Design. Build. Deploy. AI.</p>
              </div>
            </div>
            <WhoamiCard />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-8">
        <div className="grid sm:grid-cols-3 gap-4">
          <Reveal variant="blur"><div className="float-soft h-full"><div className="glass glass-hover rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between"><span className="mono text-xs text-slate-500">automation activity · 7d</span><GitBranch className="w-4 h-4 text-indigo-400" /></div>
            <div className="text-2xl font-bold text-white mt-3">128 <span className="text-sm font-normal text-slate-500">flows run</span></div>
            <div className="flex gap-1 mt-3">{Array.from({ length: 14 }).map((_, i) => (<span key={i} className="flex-1 rounded" style={{ height: 4+Math.round((i % 5)*8)+"px", marginTop:"auto", background: `rgba(139,92,246,${0.18 + (i % 5) * 0.18})`, transition:"height 1s ease" }} />))}</div>
          </div></div></Reveal>
          <Reveal variant="blur" delay={0.1}><div className="float-soft-2 h-full" style={{ animationDelay: "1.2s" }}><div className="glass glass-hover rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between"><span className="mono text-xs text-slate-500">inference · live</span><Activity className="w-4 h-4 text-indigo-400" /></div>
            <div className="mt-3 space-y-1.5 mono text-xs">{[["POST","/api/generate","200"],["GET","/api/agents","200"],["POST","/api/embed","200"]].map(([m,p,s])=>(<div key={p} className="flex items-center gap-2"><span className="text-purple-300 w-9">{m}</span><span className="text-slate-400 flex-1 truncate">{p}</span><span className="text-emerald-400">{s}</span></div>))}</div>
          </div></div></Reveal>
          <Reveal variant="blur" delay={0.2}><div className="float-soft h-full" style={{ animationDelay: "2.4s" }}><div className="glass glass-hover rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between"><span className="mono text-xs text-slate-500">nexara roadmap</span><span className="mono text-xs text-indigo-300">71%</span></div>
            <div className="mt-3 text-sm text-slate-400">10 / 14 milestones shipped</div>
            <div className="h-1.5 rounded-full bg-white/5 mt-3 overflow-hidden"><div className="h-full rounded-full" style={{ width:"71%", background:"linear-gradient(90deg,#3b82f6,#8b5cf6)", transition:"width 2s cubic-bezier(.16,1,.3,1)" }} /></div>
            <div className="mt-3 flex gap-1.5 flex-wrap">{["AI Agents","RAG","n8n","Vapi","SaaS"].map(t=>(<span key={t} className="px-2 py-0.5 rounded text-[10px] mono" style={{background:"rgba(99,102,241,0.1)",color:"#a5b4fc"}}>{t}</span>))}</div>
          </div></div></Reveal>
        </div>
      </section>

      <SectionTransition duration={9} />
      {/* SHOWREEL */}
      <ShowreelSection />

      <AboutSection />

      <section id="tech" className="max-w-6xl mx-auto px-5 py-12">
        <Reveal><SectionLabel num="02">Tech stack</SectionLabel></Reveal>
        <Reveal variant="clip"><h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Tools I reach for to ship end-to-end.</h2></Reveal>
        <Reveal delay={0.08}><p className="text-slate-400 max-w-2xl mb-10">Not a pile of logos — a pipeline. This is how an idea actually flows from code to something running in production.</p></Reveal>
        <Suspense fallback={<TechEcosystem />}><AIArchitecture fallback={<TechEcosystem />} /></Suspense>
        <Reveal delay={0.1}><div className="marquee py-2 mt-10"><div className="marquee-track">{[...stack, ...stack].map((s, i) => (<span key={i} className="px-5 py-2.5 rounded-full text-sm mono glass text-slate-200 whitespace-nowrap">{s}</span>))}</div></div></Reveal>
      </section>

      <SectionTransition duration={11} reverse />
      <section id="work" className="max-w-6xl mx-auto px-5 py-16">
        <Reveal><SectionLabel num="03">Selected work</SectionLabel></Reveal>
        <Reveal variant="clip"><h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Things I've shipped.</h2></Reveal>
        <Reveal delay={0.08}><p className="text-slate-400 max-w-2xl mb-12">Each one is a system that runs itself. Here's what's happening under the hood.</p></Reveal>
        <div className="flex flex-col gap-20 md:gap-28">
          {projects.map((p, i) => (<ProjectShowcase key={p.title} p={p} i={i} />))}
        </div>
      </section>
      <ContactSection />
    </>
  );
});

/* ===================== SERVICES ===================== */
function Services() {
  const services = [
    { icon: <MessageSquare className="w-6 h-6" />, title: "AI Chatbots & Agents", desc: "Context-aware assistants and autonomous agents trained on your data, deployed across web and messaging.", points: ["RAG over your docs", "Multi-channel deploy", "Human-in-the-loop ready"] },
    { icon: <TrendingUp className="w-6 h-6" />, title: "B2B Sales Automation", desc: "Lead enrichment, qualification and personalized outreach pipelines that run without manual lifting.", points: ["Lead enrichment", "Personalized outreach", "CRM sync"], link: "https://www.loom.com/share/68bfcd80b9de459e975966cc671d11cb" },
    { icon: <Layers className="w-6 h-6" />, title: "Content Automation APIs", desc: "Production-grade FastAPI backends that generate, categorize and schedule content via LLMs.", points: ["REST API", "LLM pipelines", "Scalable backend"] },
    { icon: <Workflow className="w-6 h-6" />, title: "Custom Workflow Automation", desc: "End-to-end n8n + AI workflows that connect your tools and remove repetitive ops entirely.", points: ["n8n orchestration", "API integrations", "Hands-off handoff"] },
    { icon: <Cpu className="w-6 h-6" />, title: "Agentic Systems", desc: "Multi-step reasoning agents that plan, call tools and execute tasks autonomously.", points: ["Tool calling", "Task planning", "Reliable execution"] },
    { icon: <Code className="w-6 h-6" />, title: "SaaS MVP Builds", desc: "From idea to a polished, futuristic web product — frontend, backend and AI baked in.", points: ["React + Vite", "API backend", "Modern UI/UX"] },
  ];
  const process = [
    { n: "01", t: "Discovery", d: "We map your bottleneck and define exactly what 'done' looks like." },
    { n: "02", t: "Design", d: "I architect the automation and align on scope, stack and timeline." },
    { n: "03", t: "Build", d: "I develop, test and refine the system until it runs reliably." },
    { n: "04", t: "Handoff", d: "You get a documented, self-running system — no babysitting." },
  ];
  return (
    <>
      <Helmet>
        <title>AI Automation Services — Rehan Nazir | FastAPI, n8n, AI Agents</title>
        <meta name="description" content="AI chatbots, B2B sales automation, content APIs, n8n workflows and agentic systems. Rehan Nazir builds self-running automation systems for businesses worldwide." />
        <link rel="canonical" href={SITE_URL + "/services"} />
        <meta property="og:url" content={SITE_URL + "/services"} />
        <meta property="og:title" content="AI Automation Services — Rehan Nazir" />
        <meta property="og:description" content="AI chatbots, B2B sales automation, content APIs, n8n workflows and agentic systems built to run themselves." />
      </Helmet>
      <section className="grid-bg"><div className="max-w-6xl mx-auto px-5 pt-20 pb-6">
        <Reveal><SectionLabel num="02">Services</SectionLabel></Reveal>
        <Reveal><h1 className="fade-up text-4xl md:text-5xl font-bold text-white leading-tight">Services built to <span className="grad-text">run themselves</span>.</h1></Reveal>
        <Reveal delay={0.1}><p className="max-w-2xl mt-5 text-slate-400">I don't just hand you scripts — I build and deliver automated systems your business can rely on.</p></Reveal>
      </div></section>
      <section className="max-w-6xl mx-auto px-5 py-12"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => (<Reveal key={s.title} delay={(i % 3) * 0.08}><div className="glass glass-hover rounded-2xl p-6 h-full" data-cursor onClick={() => s.link && window.open(s.link, '_blank')} style={s.link ? {cursor:'pointer'} : {}}><div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5" style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.9),rgba(139,92,246,0.9))" }}>{s.icon}</div><h3 className="text-lg font-semibold text-white flex items-center gap-2">{s.title}{s.link && <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}</h3><p className="text-sm text-slate-400 mt-2 leading-relaxed">{s.desc}</p><div className="mt-4 space-y-2">{s.points.map((pt) => (<div key={pt} className="flex items-center gap-2 text-sm text-slate-300"><CircleCheck className="w-4 h-4 text-indigo-400 shrink-0" />{pt}</div>))}</div></div></Reveal>))}
      </div></section>
      <section className="max-w-6xl mx-auto px-5 py-12"><Reveal><SectionLabel num="03">How it works</SectionLabel></Reveal><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{process.map((p, i) => (<Reveal key={p.n} delay={i * 0.08}><div className="glass rounded-2xl p-6 h-full" data-cursor><div className="text-4xl font-bold grad-text mono">{p.n}</div><h3 className="text-white font-semibold mt-3">{p.t}</h3><p className="text-sm text-slate-400 mt-2">{p.d}</p></div></Reveal>))}</div></section>
      <ShippedSection />
      <FAQSection />
    </>
  );
}

/* ===================== REVIEWS ===================== */
function Reviews() {
  const reviews = [
    { name: "Sarah Khan", role: "Founder, BrightLeads", rating: 5, text: "Rehan rebuilt our entire lead pipeline as an automated system. What used to take hours now runs on its own. Genuinely impressive." },
    { name: "Daniel Mehta", role: "CEO, NovaCommerce", rating: 5, text: "The support chatbot he delivered handles 70% of our tickets. Clean handoff, great docs, zero headaches." },
    { name: "Aisha Raza", role: "Ops Lead, FinTrack", rating: 5, text: "Our CSV chaos is gone. The categorizer he built just works. Fast, reliable, exactly what we asked for." },
    { name: "Omar Siddiqui", role: "Director, ScaleHub", rating: 5, text: "Communicated clearly the whole way and delivered a system that runs without us touching it. Will hire again." },
    { name: "Lena Fischer", role: "Marketing Head, Vireo", rating: 4, text: "The content automation API saved us a ton of time. Solid backend work and responsive throughout." },
    { name: "Hamza Ali", role: "Owner, HN Foods", rating: 5, text: "Built our site and automated our order flow beautifully. Professional, futuristic and on time." },
  ];
  return (
    <>
      <Helmet>
        <title>Client Reviews — Rehan Nazir | AI Automation Projects</title>
        <meta name="description" content="Real client testimonials for Rehan Nazir's AI automation work. 10+ clients, 4.9 average rating, 100% on-time delivery. AI chatbots, sales automation and workflow systems." />
        <link rel="canonical" href={SITE_URL + "/reviews"} />
        <meta property="og:url" content={SITE_URL + "/reviews"} />
        <meta property="og:title" content="Client Reviews — Rehan Nazir" />
        <meta property="og:description" content="Real client testimonials. 10+ clients, 4.9 average rating, 100% on-time delivery." />
      </Helmet>
      <section className="grid-bg"><div className="max-w-6xl mx-auto px-5 pt-20 pb-6"><Reveal><SectionLabel num="03">Client trust</SectionLabel></Reveal><Reveal><h1 className="text-4xl md:text-5xl font-bold text-white">What clients <span className="grad-text">say</span>.</h1></Reveal><Reveal delay={0.1}><p className="max-w-2xl mt-5 text-slate-400">Real results, delivered as systems that keep working long after handoff.</p></Reveal></div></section>
      <section className="max-w-6xl mx-auto px-5 py-10"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[["12", "+", "Projects"], ["10", "+", "Clients"], ["4", ".9", "Avg rating"], ["100", "%", "On-time"]].map(([v, s, l]) => (<Reveal key={l}><div className="glass glass-hover rounded-2xl py-7 text-center" data-cursor><div className="text-3xl font-bold grad-text"><Counter to={parseInt(v)} suffix={s} /></div><div className="text-xs text-slate-400 mt-1">{l}</div></div></Reveal>))}</div></section>
      <section className="max-w-6xl mx-auto px-5 py-8"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{reviews.map((r, i) => (<Reveal key={r.name} delay={(i % 3) * 0.08}><div className="glass glass-hover rounded-2xl p-6 flex flex-col h-full" data-cursor><div className="flex gap-1 mb-4">{Array.from({ length: 5 }).map((_, j) => (<Star key={j} className="w-4 h-4" style={{ fill: j < r.rating ? "#a78bfa" : "transparent", color: j < r.rating ? "#a78bfa" : "#3f3f5a" }} />))}</div><p className="text-sm text-slate-300 leading-relaxed flex-1">"{r.text}"</p><div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/5"><div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>{r.name.split(" ").map((w) => w[0]).join("")}</div><div><div className="text-sm font-medium text-white">{r.name}</div><div className="text-xs text-slate-400">{r.role}</div></div></div></div></Reveal>))}</div></section>
      <ContactSection />
    </>
  );
}

/* ---- futuristic animated blog visuals ---- */
function BlogVisual({ cat }) {
  const wrap = (art) => (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#0a0a13" }}>
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 0%,rgba(99,102,241,0.14),transparent 60%)" }} />
      {art}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(150% 100% at 50% 0%,rgba(139,92,246,0.22),transparent 60%)" }} />
    </div>
  );
  if (cat === "Engineering") return wrap(
    <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-5 mono text-[10px]">
      <div className="text-slate-500">// content-api · live</div>
      {[["POST", "/v1/generate"], ["GET", "/v1/content"], ["POST", "/v1/schedule"]].map((r, i) => (<div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border" style={{ animation: `vrow 6s ease-in-out ${i * 1.2}s infinite`, borderColor: "rgba(255,255,255,0.08)" }}><span className="text-purple-300 w-9">{r[0]}</span><span className="text-slate-300 flex-1 truncate">{r[1]}</span><span className="text-emerald-400">200</span></div>))}
      <div className="text-slate-600">{"{ engine: gemini }"}<span className="inline-block w-1.5 h-3 ml-1 align-middle" style={{ background: "#a78bfa", animation: "blink 1s step-end infinite" }} /></div>
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

/* ===================== WHOAMI CARD ===================== */
const _HL_BASE = { display:"block", borderRadius:4, paddingLeft:6, marginLeft:-6, paddingRight:4, transition:"background 1s ease, box-shadow 1s ease" };
const WhoamiCard = memo(function WhoamiCard() {
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
        <span className="mono text-xs text-slate-500 ml-2">~/rehan — zsh</span>
      </div>
      <div className="p-4 mono text-xs space-y-1.5">
        <span data-hl style={_HL_BASE} className="text-slate-500">// whoami.ts</span>
        <span data-hl style={_HL_BASE}><span className="text-indigo-400">const</span> <span className="text-sky-300">engineer</span> <span className="text-slate-400">=</span> {"{"}</span>
        <span data-hl style={_HL_BASE} className="pl-4 text-slate-300">name: <span className="text-emerald-300">"Rehan Nazir"</span>,</span>
        <span data-hl style={_HL_BASE} className="pl-4 text-slate-300">role: <span className="text-emerald-300">"AI &amp; Automation Eng"</span>,</span>
        <span data-hl style={_HL_BASE} className="pl-4 text-slate-300">stack: [<span className="text-emerald-300">"FastAPI"</span>, <span className="text-emerald-300">"n8n"</span>, <span className="text-emerald-300">"LLMs"</span>],</span>
        <span data-hl style={_HL_BASE} className="pl-4 text-slate-300">shipping: <span className="text-purple-300">true</span>,</span>
        <span data-hl style={_HL_BASE}>{"}"};
        </span>
        <span data-hl style={_HL_BASE} className="text-slate-500">{"// → ready to build "}<span className="inline-block w-2 h-3.5 align-middle" style={{ background: "#a78bfa", animation: "blink 1s step-end infinite" }} /></span>
      </div>
    </div>
  );
});

/* ===================== PROJECT SHOWCASE ===================== */
/* Each project is presented as a cinematic product row: an animated architecture/pipeline
   visual (shared BlogVisual language) paired with live metrics. Reveals are scrubbed to
   scroll via GSAP when available, and simply render in place otherwise. */
function ProjectShowcase({ p, i }) {
  const reversed = i % 2 === 1;
  const ref = useScrub((gsap, ScrollTrigger, el) => {
    const viz = el.querySelector("[data-viz]");
    const copyKids = el.querySelectorAll("[data-copy] > *");
    // One timeline + one ScrollTrigger for the whole row (batched, not per-element).
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 82%", end: "top 40%", scrub: 0.6 } });
    tl.from(viz, { autoAlpha: 0, y: 70, ease: "none" }, 0)
      .from(copyKids, { autoAlpha: 0, y: 36, stagger: 0.08, ease: "none" }, 0.1);
  });
  return (
    <article ref={ref} className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center" data-cursor
      onClick={() => p.link && window.open(p.link, "_blank")} style={p.link ? { cursor: "pointer" } : {}}>
      <div data-viz className={"relative " + (reversed ? "md:order-2" : "")}>
        <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-90 transition-opacity duration-700" style={{ background: `radial-gradient(60% 60% at 50% 45%, ${p.accent}40, transparent 70%)` }} />
        <div className="relative rounded-2xl overflow-hidden glass-hover light-sweep" style={{ aspectRatio: "16 / 10", "--accent": p.accent }}>
          <BlogVisual cat={p.viz} />
        </div>
      </div>
      <div data-copy className={reversed ? "md:order-1" : ""}>
        <div className="flex items-center gap-3 mono text-xs">
          <span className="text-5xl md:text-6xl font-bold leading-none" style={{ color: p.accent, opacity: 0.22 }}>{p.n}</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "vpulse 3s ease-in-out infinite" }} />live in production</span>
        </div>
        <div className="mono text-[11px] uppercase tracking-wider mt-4" style={{ color: p.accent }}>{p.cat}</div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mt-1 flex items-center gap-2">{p.title}{p.link && <ArrowUpRight className="w-5 h-5 shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: p.accent }} />}</h3>
        <p className="text-slate-400 mt-3 leading-relaxed max-w-lg">{p.desc}</p>
        <div className="flex flex-wrap gap-2.5 mt-6">
          {p.metrics.map(([label, val]) => (
            <div key={label} className="glass glass-hover rounded-xl px-3.5 py-2 min-w-[86px]" style={{ "--accent": p.accent }}>
              <div className="text-white font-semibold text-sm tabular-nums">{val}</div>
              <div className="mono text-[9px] text-slate-500 uppercase tracking-wide mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-5">{p.stack.map((s) => (<span key={s} className="px-2.5 py-1 rounded-md text-[11px] mono" style={{ background: `${p.accent}1f`, color: "#dbe3ff", border: `1px solid ${p.accent}33` }}>{s}</span>))}</div>
        <div className="mono text-xs text-slate-500 mt-5">{p.role}</div>
      </div>
    </article>
  );
}

/* ===================== TECH ECOSYSTEM ===================== */
/* A living pipeline (code → backend → agents → automation → cloud → deploy)
   with energy flowing along the connectors. Elegant, not a network graph. */
function EcoNode({ label, sub, Icon, c, index }) {
  return (
    <FloatingCard amplitude={6 + (index % 3) * 2} duration={6.4 + index * 0.45} delay={index * 0.3}
      accent={c} data-cursor
      className="rounded-2xl px-4 py-4 h-full flex md:flex-col items-center md:items-start gap-3 group"
      style={{ cursor: "default" }}>
      <span className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${c}30, ${c}10)`, border: `1px solid ${c}55` }}>
        <Icon className="w-5 h-5" style={{ color: c }} />
        <span aria-hidden="true" className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: `0 0 24px -2px ${c}` }} />
      </span>
      <div className="min-w-0">
        <div className="text-white text-sm font-semibold leading-tight">{label}</div>
        <div className="mono text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{sub}</div>
      </div>
    </FloatingCard>
  );
}
function EcoConnector({ animate, delay }) {
  const dot = { background: "#ddd6fe", boxShadow: "0 0 10px 2px rgba(167,139,250,0.9)" };
  return (
    <div className="flex md:flex-col items-center justify-center md:px-1" aria-hidden="true">
      <div className="hidden md:block relative w-full h-px" style={{ minWidth: 26, background: "linear-gradient(90deg, rgba(129,140,248,0.12), rgba(192,132,252,0.4), rgba(129,140,248,0.12))" }}>
        {animate && <span className="absolute w-1.5 h-1.5 rounded-full" style={{ ...dot, top: "50%", marginTop: -3, animation: `flowX 2.6s linear ${delay}s infinite` }} />}
      </div>
      <div className="md:hidden relative h-5 w-px" style={{ background: "linear-gradient(180deg, rgba(129,140,248,0.12), rgba(192,132,252,0.4))" }}>
        {animate && <span className="absolute w-1.5 h-1.5 rounded-full" style={{ ...dot, left: "50%", marginLeft: -3, animation: `flowY 2.6s linear ${delay}s infinite` }} />}
      </div>
    </div>
  );
}
function TechEcosystem() {
  const reduced = prefersReduced();
  const { tier } = useMotionState();
  const animate = !reduced && tier !== "low";
  const stages = [
    { label: "Python",     sub: "foundation", Icon: Code,     c: "#60a5fa" },
    { label: "FastAPI",    sub: "the backend", Icon: Zap,      c: "#6366f1" },
    { label: "AI Agents",  sub: "the brains",  Icon: Bot,      c: "#818cf8" },
    { label: "Automation", sub: "the glue",    Icon: Workflow, c: "#8b5cf6" },
    { label: "Cloud",      sub: "the scale",   Icon: Cloud,    c: "#a855f7" },
    { label: "Deploy",     sub: "shipped",     Icon: Rocket,   c: "#c084fc" },
  ];
  return (
    <div className="relative" style={{ perspective: "1400px" }}>
      <div className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-0">
        {stages.map((s, i) => (
          <Fragment key={s.label}>
            <Reveal variant="scale" delay={i * 0.07} className="md:flex-1"><EcoNode {...s} index={i} /></Reveal>
            {i < stages.length - 1 && <EcoConnector animate={animate} delay={i * 0.3} />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function ShowreelSection() {
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
        <p className="mono text-[10px] text-slate-600 tracking-widest mb-4 uppercase">Agent loop · tool calling · automation &amp; more — in one breath.</p>
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
            <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", aspectRatio: "16/9", background: "#05050b" }}>
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

function AboutSection() {
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
                <span className="mono text-[8.5px] text-slate-500 uppercase tracking-wider">Git Activity</span>
                <span className="mono text-[8.5px] text-indigo-400">7D</span>
              </div>
              <div className="flex gap-px items-end" style={{height:34}}>
                {barH.map((h,i)=>(
                  <div key={i} style={{flex:1,height:h*2.4+"px",borderRadius:2,background:`rgba(139,92,246,${0.18+h/18})`,animation:`vpulse ${2+i*0.12}s ease-in-out ${i*0.08}s infinite`}}/>
                ))}
              </div>
              <div className="mono text-[10px] text-white font-bold mt-2">142 <span className="text-slate-500 font-normal">commits</span></div>
            </div>
            {/* DEPLOYED — top right */}
            <div className="absolute right-0 top-5 z-20 rounded-xl px-3 py-2.5" style={{width:192,background:"rgba(14,14,26,0.94)",border:"1px solid rgba(52,211,153,0.22)",boxShadow:"0 10px 36px rgba(0,0,0,0.55)"}}>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"rgba(52,211,153,0.18)"}}>
                  <span className="text-emerald-400 text-[9px] leading-none">✓</span>
                </div>
                <span className="mono text-[9.5px] text-white font-medium">Deployed to production</span>
              </div>
              <span className="mono text-[7.5px] text-slate-500 ml-6">vercel · 1m 24s · @nyvexa</span>
            </div>
            {/* Main terminal — center */}
            <div className="absolute z-10 glass rounded-2xl overflow-hidden" style={{left:24,right:24,top:36,bottom:36,boxShadow:"0 24px 64px rgba(0,0,0,0.65)"}}>
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70"/><span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70"/><span className="w-2.5 h-2.5 rounded-full bg-green-400/70"/>
                <span className="mono text-xs text-slate-500 ml-2">~/rehan — zsh</span>
              </div>
              <TerminalSequence />
            </div>
            {/* INFERENCE — bottom left */}
            <div className="absolute left-0 bottom-0 z-20 glass rounded-xl p-3" style={{width:156,boxShadow:"0 10px 36px rgba(0,0,0,0.55)"}}>
              <div className="flex items-center justify-between mb-2">
                <span className="mono text-[8.5px] text-slate-500 uppercase tracking-wider">Inference</span>
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
                <div><div className="text-white text-sm font-medium">{label}</div><div className="text-slate-500 text-xs mt-0.5">{desc}</div></div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== SHIPPED SECTION ===================== */
function ShippedSection() {
  const shipped = [
    { n:"01", title:"AI Content Automation API",   client:"Internal · Nexara",  role:"Full Stack · AI",  stack:["FastAPI","Gemini","SQLAlchemy"], year:"2026" },
    { n:"02", title:"B2B Sales Automation Flow",   client:"Confidential",        role:"Automation",        stack:["n8n","LLMs","CRM APIs"],         year:"2026", link:"https://www.loom.com/share/68bfcd80b9de459e975966cc671d11cb" },
    { n:"03", title:"Finance Expense Categorizer", client:"FinTrack",            role:"AI Tooling",        stack:["Python","Gemini","Pandas"],       year:"2025" },
    { n:"04", title:"Support Chatbot Agent",       client:"NovaCommerce",        role:"AI Agents",         stack:["RAG","React","FastAPI"],          year:"2025" },
    { n:"05", title:"Lead Enrichment Pipeline",    client:"BrightLeads",         role:"Automation",        stack:["n8n","Clay","OpenAI"],            year:"2025" },
    { n:"06", title:"Restaurant SaaS MVP",         client:"HN Foods",            role:"Full Stack",        stack:["React","FastAPI","AI"],           year:"2025" },
  ];
  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <Reveal><SectionLabel num="✦">Shipped</SectionLabel></Reveal>
      <Reveal delay={0.08}><h2 className="text-3xl md:text-4xl font-bold text-white mb-10">A few things I've <span className="grad-text">shipped</span>.</h2></Reveal>
      <Reveal delay={0.14}>
        <div className="rounded-2xl overflow-hidden" style={{border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.022)"}}>
          <div className="hidden md:grid grid-cols-[44px_1fr_160px_1fr_60px] gap-4 px-6 py-3 border-b border-white/5">
            {["#","Project","Role","Stack","Year"].map(h=>(
              <span key={h} className="mono text-[10px] text-slate-600 uppercase tracking-wider last:text-right">{h}</span>
            ))}
          </div>
          {shipped.map((p)=>(
            <div key={p.n} className="group grid grid-cols-[44px_1fr] md:grid-cols-[44px_1fr_160px_1fr_60px] gap-4 px-6 py-4 items-center border-b border-white/5 last:border-b-0 transition-all duration-700 hover:bg-white/[0.03]" data-cursor onClick={() => p.link && window.open(p.link, '_blank')} style={p.link ? {cursor:'pointer'} : {}}>
              <span className="mono text-xs text-slate-600">{p.n}</span>
              <div className="min-w-0">
                <div className="text-white font-medium text-sm group-hover:text-indigo-200 transition-colors duration-500">{p.title}</div>
                <div className="mono text-[10px] text-slate-500 mt-0.5">{p.client}</div>
              </div>
              <span className="hidden md:block mono text-xs text-slate-400">{p.role}</span>
              <div className="hidden md:flex flex-wrap gap-1.5">
                {p.stack.map(s=>(<span key={s} className="px-2 py-0.5 rounded text-[10px] mono" style={{background:"rgba(99,102,241,0.1)",color:"#a5b4fc"}}>{s}</span>))}
              </div>
              <span className="hidden md:block mono text-[11px] text-slate-500 text-right">{p.year}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ===================== FAQ SECTION ===================== */
function FAQSection() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:"How long does a project take?",              a:"Most automations take 1–3 weeks. A simple n8n workflow can be live in days. A full AI agent system with RAG and CRM integration typically takes 2–4 weeks including testing and documentation." },
    { q:"Do you work with clients outside Pakistan?", a:"Yes — almost all my clients are international. I work remotely with businesses across Europe, the US, and the Middle East. Time zones are no issue; I deliver async-first and communicate clearly throughout." },
    { q:"What's your pricing model?",                 a:"I price by the system, not the hour. You pay for a working, documented, self-running system — not my time. This aligns my incentive with yours: ship fast, ship right, hand off clean." },
    { q:"What happens after delivery?",               a:"You get full docs, all environment variables, a runbook, and a kill switch you control. I include a one-week support window post-delivery. Ongoing retainers are available separately." },
    { q:"Which LLMs do you build with?",              a:"All major ones — Claude for reasoning and long-context work, GPT-4 for broad capability, Gemini for cost-efficient pipelines. I'll recommend the right fit for your use case." },
    { q:"Can you integrate into our existing stack?", a:"Yes. I wire into whatever you're running — Notion, Airtable, HubSpot, Slack, custom APIs. If it has a webhook or an API endpoint, it can be part of the system." },
  ];
  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <Reveal><SectionLabel num="✦">FAQ</SectionLabel></Reveal>
      <Reveal delay={0.08}><h2 className="text-3xl md:text-4xl font-bold text-white mb-10">Questions, <span className="grad-text">answered</span>.</h2></Reveal>
      <div className="space-y-3 max-w-3xl">
        {faqs.map((faq,i)=>(
          <Reveal key={i} delay={i*0.06}>
            <div className="rounded-xl overflow-hidden transition-all duration-700" style={{background:"rgba(255,255,255,0.028)",border:`1px solid ${open===i?"rgba(139,92,246,0.45)":"rgba(255,255,255,0.07)"}`}}>
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left" data-cursor>
                <span className="text-white font-medium text-sm">{faq.q}</span>
                <span className="text-indigo-400 text-xl shrink-0 leading-none transition-transform duration-600" style={{transform:open===i?"rotate(45deg)":"rotate(0deg)"}}>{open===i?"×":"+"}</span>
              </button>
              <div className="faq-answer" style={{maxHeight:open===i?200:0}}>
                <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ===================== BLOG ===================== */
const POSTS = [
  { slug: "python-ideal-for-automation", title: "Why Python is Ideal for Automation", cat: "Automation", date: "27 Jun 2026", isoDate: "2026-06-27", read: "8 min", excerpt: "Discover why Python's simplicity and vast libraries make it the top choice for automation. Real code examples, key libraries, and interactive 3D visuals.", featured: true },
  { slug: "production-ai-content-api", title: "Building a production AI content API", cat: "Engineering", date: "28 May 2026", isoDate: "2026-05-28", read: "8 min", excerpt: "Architecting a FastAPI + Gemini backend that's clean, scalable and ready to hand off to a client." },
  { slug: "rag-chatbots-that-help", title: "RAG chatbots that actually help", cat: "AI Agents", date: "14 May 2026", isoDate: "2026-05-14", read: "6 min", excerpt: "Most chatbots frustrate users. The fix is grounding them in real context. A practical look at retrieval-augmented agents." },
  { slug: "n8n-llms-freelancer-edge", title: "n8n + LLMs: the freelancer's edge", cat: "Workflow", date: "30 Apr 2026", isoDate: "2026-04-30", read: "4 min", excerpt: "How combining n8n orchestration with language models lets a solo builder deliver agency-level automation." },
  { slug: "freelancing-to-ai-company", title: "From freelancing to an AI company", cat: "Strategy", date: "18 Apr 2026", isoDate: "2026-04-18", read: "7 min", excerpt: "My roadmap from done-for-you services to a productized SaaS — and the niche decisions driving it." },
  { slug: "algo-trading-meets-automation", title: "Algorithmic trading meets automation", cat: "Trading", date: "02 Apr 2026", isoDate: "2026-04-02", read: "6 min", excerpt: "Trading, ML and automation share one loop: data → pattern → test → execute. Why learning them together compounds." },
];

function Blog({ openArticle }) {
  const feat = POSTS[0];
  return (
    <>
      <Helmet>
        <title>Blog — AI Automation & Engineering | Rehan Nazir</title>
        <meta name="description" content="Practical notes on AI engineering, workflow automation, n8n, RAG chatbots and building systems that run themselves. By Rehan Nazir, AI Engineer and Founder of Nexara." />
        <link rel="canonical" href={SITE_URL + "/blog"} />
        <meta property="og:url" content={SITE_URL + "/blog"} />
        <meta property="og:title" content="Blog — AI Automation & Engineering | Rehan Nazir" />
        <meta property="og:description" content="Practical notes on AI engineering, workflow automation, n8n, RAG chatbots and building systems that run themselves." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Rehan Nazir — Notes on Building with AI",
          "url": SITE_URL + "/#blog",
          "author": { "@type": "Person", "name": "Rehan Nazir" },
          "description": "Thoughts on AI, automation, building systems and the road to a real tech company.",
          "blogPost": POSTS.map(p => ({
            "@type": "BlogPosting",
            "headline": p.title,
            "description": p.excerpt,
            "datePublished": p.isoDate,
            "url": `${SITE_URL}/blog/${p.slug}`,
            "author": { "@type": "Person", "name": "Rehan Nazir" }
          }))
        })}</script>
      </Helmet>
      <section className="grid-bg"><div className="max-w-6xl mx-auto px-5 pt-20 pb-6">
        <Reveal><SectionLabel num="04">Blog</SectionLabel></Reveal>
        <Reveal><h1 className="text-4xl md:text-5xl font-bold text-white">Notes on playing <span className="grad-text">with AI</span>.</h1></Reveal>
        <Reveal delay={0.1}><p className="max-w-2xl mt-5 text-slate-400">Field notes on AI engineering, automation systems and the road to building a real AI company.</p></Reveal>
        <Reveal delay={0.16}><div className="flex items-center gap-3 mt-6">
          {["All","Engineering","AI Agents","Workflow","Strategy"].map((t,i)=>(
            <button key={t} className={`px-3.5 py-1.5 rounded-full text-xs mono transition-all duration-500 ${i===0?"text-white":"text-slate-400 hover:text-white"}`} style={i===0?{background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}:{border:"1px solid rgba(255,255,255,0.08)"}}>{t}</button>
          ))}
        </div></Reveal>
      </div></section>
      <section className="max-w-6xl mx-auto px-5 py-10">
        <Reveal><div className="group glass glass-hover rounded-3xl overflow-hidden grid md:grid-cols-2" data-cursor>
          <div className="relative min-h-[220px] overflow-hidden"><BlogVisual cat={feat.cat} /></div>
          <div className="p-8 flex flex-col justify-center">
            <span className="text-xs mono px-3 py-1 rounded-full glass w-fit text-indigo-200 mb-4">featured</span>
            <h2 className="text-2xl font-bold text-white">{feat.title}</h2>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">{feat.excerpt}</p>
            <div className="flex items-center gap-4 mt-5 text-xs mono text-slate-500"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{feat.date}</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{feat.read}</span></div>
            <button onClick={() => openArticle(feat.slug)} className="btn-glow mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white w-fit" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Read article <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div></Reveal>
      </section>
      <section className="max-w-6xl mx-auto px-5 py-6"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {POSTS.slice(1).map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.08}>
            <article className="glass glass-hover rounded-2xl overflow-hidden group h-full flex flex-col" data-cursor>
              <div className="h-40 relative overflow-hidden"><BlogVisual cat={p.cat} /><span className="absolute top-3 left-3 z-10 text-[11px] mono px-2.5 py-1 rounded-full text-white" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}>{p.cat}</span></div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-white font-semibold leading-snug group-hover:text-indigo-200 transition-colors">{p.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed flex-1">{p.excerpt}</p>
                <div className="flex items-center gap-4 mt-4 text-xs mono text-slate-500"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{p.date}</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{p.read}</span></div>
                <button onClick={() => openArticle(p.slug)} className="mt-4 inline-flex items-center gap-1.5 text-sm mono text-indigo-300 hover:text-white transition-colors w-fit">Read article →</button>
              </div>
            </article>
          </Reveal>
        ))}
      </div></section>
    </>
  );
}

/* ===================== BLOG POST ===================== */
function BackToBlog({ back }) {
  return (
    <button onClick={back} className="inline-flex items-center gap-2 text-sm mono text-slate-400 hover:text-indigo-300 transition-colors mb-8"><ArrowLeft className="w-4 h-4" /> All blog posts</button>
  );
}
function BlogPost({ slug, back, openArticle }) {
  const meta = POSTS.find((p) => p.slug === slug) || POSTS[0];
  const isMain = slug === "python-ideal-for-automation";

  if (!isMain) {
    return (
      <div className="max-w-3xl mx-auto px-5 pt-12 pb-24">
        <Helmet>
          <title>{meta.title} — Rehan Nazir</title>
          <meta name="description" content={meta.excerpt} />
          <link rel="canonical" href={`${SITE_URL}/blog/${meta.slug}`} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`${SITE_URL}/blog/${meta.slug}`} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.excerpt} />
          <meta property="article:author" content="Rehan Nazir" />
          <meta property="article:published_time" content={meta.isoDate} />
          <meta property="article:section" content={meta.cat} />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": meta.title,
            "description": meta.excerpt,
            "datePublished": meta.isoDate,
            "url": `${SITE_URL}/blog/${meta.slug}`,
            "author": { "@type": "Person", "name": "Rehan Nazir", "url": SITE_URL },
            "publisher": { "@type": "Organization", "name": "Nexara", "url": SITE_URL },
            "articleSection": meta.cat,
            "timeRequired": meta.read
          })}</script>
        </Helmet>
        <BackToBlog back={back} />
        <span className="text-xs mono px-3 py-1 rounded-full glass text-indigo-200">{meta.cat}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mt-5 leading-tight">{meta.title}</h1>
        <p className="text-slate-400 mt-4">{meta.excerpt}</p>
        <div className="glass rounded-2xl p-10 mt-10 text-center">
          <BookOpen className="w-10 h-10 mx-auto text-indigo-300 mb-4" />
          <h2 className="text-xl font-semibold text-white">This article is coming soon.</h2>
          <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">The full write-up for this post is still in drafts. The "Why Python is Ideal for Automation" article is fully built out — open that one to see the complete layout.</p>
          <button onClick={() => openArticle("python-ideal-for-automation")} className="btn-glow mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Read the finished article <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-5 pt-12 pb-24 flex items-center justify-center" style={{ minHeight: "60vh" }}><div className="text-slate-400 mono text-sm animate-pulse">Loading article…</div></div>}>
      <PythonAutomationPost back={back} openArticle={openArticle} />
    </Suspense>
  );

}

/* ===================== CONTACT ===================== */
const API_BASE = import.meta.env.VITE_API_URL ?? "";

function ContactSection() {
  const [f, setF] = useState({ name: "", email: "", details: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingMsg, setSendingMsg] = useState("Sending");
  const [error, setError] = useState("");
  const [focus, setFocus] = useState(null);
  const anyFocus = focus !== null;
  const sendRef = useMagnetic(0.22);
  const warmRef = useScrollDepth("--warm"); // lighting warms as the section enters view

  // Wake the (likely cold-started) backend once the contact section is within reach —
  // not on every page load. Gives the server time to spin up before the user hits submit,
  // without firing a cross-origin request for every visitor who never scrolls this far.
  useEffect(() => {
    if (!API_BASE) return;
    const el = warmRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { fetch(`${API_BASE}/api/health`).catch(() => {}); io.disconnect(); }
    }, { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWithTimeout = (url, opts, ms) =>
    Promise.race([fetch(url, opts), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

  const doFetch = () => fetchWithTimeout(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(f),
  }, 12000);

  const submit = async () => {
    if (sent || sending) return;
    setError("");
    setSending(true);
    setSendingMsg("Sending");
    try {
      let res;
      try {
        res = await doFetch();
      } catch {
        setSendingMsg("Waking up server");
        const deadline = Date.now() + 90000;
        let up = false;
        while (Date.now() < deadline) {
          await new Promise(r => setTimeout(r, 5000));
          try {
            const h = await fetchWithTimeout(`${API_BASE}/api/health`, {}, 5000);
            if (h.ok) { up = true; break; }
          } catch { /* not up yet, keep polling */ }
        }
        if (!up) throw new Error("Server is taking too long to respond. Please try again in a minute.");
        setSendingMsg("Sending");
        res = await doFetch();
      }
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch { /* non-JSON body, leave data empty */ }
      if (!res.ok) {
        const detail = data.detail;
        let msg = "Something went wrong. Please try again.";
        if (typeof detail === "string") msg = detail;
        else if (Array.isArray(detail)) {
          const emailErr = detail.find(e => e.loc?.includes("email"));
          const nameErr = detail.find(e => e.loc?.includes("name"));
          const detailsErr = detail.find(e => e.loc?.includes("details"));
          if (emailErr) msg = "Please enter a valid email address.";
          else if (nameErr) msg = "Please enter your name.";
          else if (detailsErr) msg = "Please describe your project.";
        }
        throw new Error(msg);
      }
      setF({ name: "", email: "", details: "" });
      setSent(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
      setSendingMsg("Sending");
    }
  };
  return (
    <section ref={warmRef} id="contact" className="max-w-6xl mx-auto px-5 py-20 relative" style={{ scrollMarginTop: "80px" }}>
      {/* warm, inviting ambient light that strengthens as you arrive */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(70% 55% at 78% 18%, rgba(251,191,140,0.06), transparent 60%), radial-gradient(60% 50% at 22% 90%, rgba(244,114,182,0.05), transparent 60%)", opacity: "var(--warm,0.4)", transition: "opacity .4s linear" }} />
      <Reveal duration={1.9}><SectionLabel num="✦">Contact</SectionLabel></Reveal>
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Have a project <span className="grad-text">in mind?</span></h2>
          <p className="text-slate-400 mt-5 leading-relaxed">Let's build something great together. I'm available for freelance projects, agency work and collaborations — anywhere in the world.</p>
          <div className="mt-7 space-y-3">
            {[[<Mail className="w-4 h-4" />, "Email", "rehaan689nazir@gmail.com"], [<Link className="w-4 h-4" />, "LinkedIn", "linkedin.com/in/rehan-nazir-530597332"], [<GitFork className="w-4 h-4" />, "GitHub", "github.com/rehaannazir"]].map(([ic, l, v], i) => (
              <div key={i} className="flex items-center gap-3 glass glass-hover rounded-xl px-4 py-3" data-cursor><span className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>{ic}</span><div><div className="text-xs text-slate-500 mono">{l}</div><div className="text-sm text-slate-200">{v}</div></div></div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden" style={{ padding: "1.5px" }}>
            <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "130%", height: "130%", background: "conic-gradient(from 0deg, transparent 0deg, #3b82f6 70deg, #8b5cf6 150deg, transparent 260deg)", animation: "spinSlow 14s linear infinite", opacity: anyFocus ? 0.95 : 0.35, transition: "opacity 1s" }} />
            <div className="relative rounded-2xl p-6" style={{ background: "rgba(9,9,17,0.94)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" /><span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="mono text-xs text-slate-500 ml-1">new_message.tsx</span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] mono text-emerald-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "vpulse 2s ease-in-out infinite" }} />online</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs mono text-slate-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-indigo-400" /> your_name</label>
                  <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} onFocus={() => setFocus("name")} onBlur={() => setFocus(null)} placeholder="Jane Doe" className="w-full mt-1.5 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all" style={{ border: "1px solid", borderColor: focus === "name" ? "#818cf8" : "rgba(255,255,255,0.1)", boxShadow: focus === "name" ? "0 0 0 3px rgba(99,102,241,0.16), 0 0 26px -6px rgba(139,92,246,0.7)" : "none" }} />
                </div>
                <div>
                  <label className="text-xs mono text-slate-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> email</label>
                  <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} onFocus={() => setFocus("email")} onBlur={() => setFocus(null)} placeholder="jane@company.com" className="w-full mt-1.5 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all" style={{ border: "1px solid", borderColor: focus === "email" ? "#818cf8" : "rgba(255,255,255,0.1)", boxShadow: focus === "email" ? "0 0 0 3px rgba(99,102,241,0.16), 0 0 26px -6px rgba(139,92,246,0.7)" : "none" }} />
                </div>
                <div>
                  <div className="flex items-center justify-between"><label className="text-xs mono text-slate-500 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> project_details</label><span className="text-[10px] mono text-slate-600">{f.details.length}/500</span></div>
                  <textarea value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} onFocus={() => setFocus("details")} onBlur={() => setFocus(null)} rows={4} maxLength={500} placeholder="What would you like to automate?" className="w-full mt-1.5 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all resize-none" style={{ border: "1px solid", borderColor: focus === "details" ? "#818cf8" : "rgba(255,255,255,0.1)", boxShadow: focus === "details" ? "0 0 0 3px rgba(99,102,241,0.16), 0 0 26px -6px rgba(139,92,246,0.7)" : "none" }} />
                </div>
                <button ref={sendRef} onClick={submit} disabled={sent || sending} className="btn-glow magnetic w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all" style={{ background: sent ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
                  {sent ? (<><CircleCheck className="w-4 h-4" /> Message sent — I'll be in touch</>) : sending ? (<span className="inline-flex items-center gap-2">{sendingMsg} <span className="flex gap-1">{[0, 1, 2].map((i) => (<span key={i} className="w-1.5 h-1.5 rounded-full bg-white" style={{ animation: `vpulse 1s ease-in-out ${i * 0.2}s infinite` }} />))}</span></span>) : (<>Send message <Send className="w-4 h-4" /></>)}
                </button>
                {error && <p className="text-xs text-rose-400 mono mt-2">⚠ {error}</p>}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ===================== FOOTER ===================== */
const Footer = memo(function Footer({ setPage }) {
  const navLinks = [
    { id: "home", label: "Home", num: "01" },
    { id: "services", label: "Services", num: "02" },
    { id: "reviews", label: "Reviews", num: "03" },
    { id: "blog", label: "Blog", num: "04" },
  ];
  const socials = [
    { Icon: GitFork, label: "GitHub", href: "https://github.com/rehaannazir" },
    { Icon: Link, label: "LinkedIn", href: "https://www.linkedin.com/in/rehan-nazir-530597332" },
    { Icon: MessageCircle, label: "Twitter", href: "#" },
    { Icon: Mail, label: "Email", href: "mailto:rehaan689nazir@gmail.com" },
  ];
  return (
    <footer className="relative z-10 mt-6 overflow-hidden">
      {/* top glow line */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.6) 30%,rgba(139,92,246,0.6) 70%,transparent)" }} />

      {/* ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#3b82f6,transparent 70%)", filter: "blur(20px)" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)", filter: "blur(20px)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-8">

        {/* CTA strip */}
        <Reveal>
          <div className="rounded-2xl mb-14 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(139,92,246,0.15))", border: "1px solid rgba(139,92,246,0.3)" }}>
            <div>
              <p className="text-white font-semibold text-lg">Have a process worth automating?</p>
              <p className="text-slate-400 text-sm mt-1">Let's build something that runs itself.</p>
            </div>
            <button
              onClick={() => { setPage("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150); }}
              className="btn-glow shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white text-sm"
              style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}
              data-cursor>
              Start a project <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Reveal>

        {/* main grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* brand col */}
          <Reveal className="space-y-5">
            <div className="flex items-center gap-3">
              <picture>
                <source type="image/avif" srcSet="/logo-40.avif 40w, /logo-80.avif 80w, /logo-120.avif 120w" sizes="40px" />
                <source type="image/webp" srcSet="/logo-40.webp 40w, /logo-80.webp 80w, /logo-120.webp 120w" sizes="40px" />
                <img src="/logo-40.png" alt="Nexara" width="40" height="40" className="w-10 h-10 object-contain shrink-0" style={{ filter: "drop-shadow(0 0 8px rgba(99,102,241,0.6))" }} />
              </picture>
              <div>
                <span className="mono text-base text-white font-medium">rehan.nazir<span className="text-indigo-400">()</span></span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "vpulse 2s ease-in-out infinite" }} />
                  <span className="mono text-[10px] text-emerald-400">available for projects</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              AI Engineer &amp; Automation Specialist. Building intelligent, self-running systems. <span className="text-indigo-300">Design. Build. Deploy. AI.</span>
            </p>
            <div className="mono text-xs text-slate-600 flex items-center gap-2">
              <span className="text-indigo-400">//</span> Lahore, Pakistan · 2026
            </div>
          </Reveal>

          {/* navigate col */}
          <Reveal delay={0.08}>
            <div className="mono text-xs uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
              <span className="text-indigo-400">#</span> Navigate
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map(({ id, label, num }) => (
                <button
                  key={id}
                  onClick={() => setPage(id)}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 hover:bg-white/5"
                  data-cursor>
                  <span className="mono text-[11px] text-indigo-400/60 group-hover:text-indigo-400 transition-colors w-5">{num}</span>
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          </Reveal>

          {/* connect col */}
          <Reveal delay={0.16}>
            <div className="mono text-xs uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
              <span className="text-indigo-400">#</span> Connect
            </div>
            <div className="grid grid-cols-2 gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl glass transition-all duration-300 hover:border-indigo-500/50"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  data-cursor>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.25))" }}>
                    <Icon className="w-3.5 h-3.5 text-indigo-300" />
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{label}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="mono text-xs text-slate-600">© 2026 Rehan Nazir — Nexara.</span>
          <div className="flex items-center gap-2">
            {["LLMs", "FAST API", "REST APIs", "AI Agents"].map((t) => (
              <span key={t} className="mono text-[10px] px-2.5 py-1 rounded-full text-slate-500"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
});