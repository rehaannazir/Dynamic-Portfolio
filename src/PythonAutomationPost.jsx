import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, ArrowRight, Copy, Check, Quote, ChevronRight,
  CircleCheck, List, Mail, GitFork, Link, TriangleAlert,
} from "lucide-react";

const SITE_URL = "https://rehannazir.com";

const TOC = [
  { id: "introduction",      t: "Introduction" },
  { id: "why-python",        t: "Why Python Won" },
  { id: "architecture",      t: "Automation Architecture" },
  { id: "file-system",       t: "File System" },
  { id: "web-http",          t: "Web & HTTP" },
  { id: "browser-auto",      t: "Browser Automation" },
  { id: "data-processing",   t: "Data Processing" },
  { id: "databases",         t: "Databases" },
  { id: "async-concurrency", t: "Async & Concurrency" },
  { id: "ai-automation",     t: "AI Automation" },
  { id: "complete-pipeline", t: "Complete Pipeline" },
  { id: "faq",               t: "FAQ" },
];

/* ─────────────────────────────────────────────────────────
   FADE-IN REVEAL
───────────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>{children}</div>
  );
}

/* ─────────────────────────────────────────────────────────
   PYTHON SYNTAX HIGHLIGHTER
───────────────────────────────────────────────────────── */
const KW = new Set([
  "import","from","as","def","class","return","if","else","elif","for","while",
  "in","not","and","or","True","False","None","with","try","except","finally",
  "raise","lambda","yield","async","await","pass","break","continue","global",
  "nonlocal","del","is","self","super",
]);
const BT = new Set([
  "print","len","range","enumerate","zip","map","filter","list","dict","set",
  "tuple","str","int","float","bool","open","sorted","reversed","sum","min",
  "max","any","all","hasattr","getattr","isinstance","type","vars","input",
  "format","next","iter","abs","round","repr","id","hex",
]);

function pyTokens(code) {
  const out = [];
  let i = 0;
  while (i < code.length) {
    if (code[i] === "#") {
      let j = i; while (j < code.length && code[j] !== "\n") j++;
      out.push({ t: "comment", v: code.slice(i, j) }); i = j; continue;
    }
    const isTriple = (q) => code.slice(i, i + 3) === q.repeat(3);
    if ((code[i] === '"' || code[i] === "'") && isTriple(code[i])) {
      const q = code[i].repeat(3); let j = i + 3;
      while (j < code.length && code.slice(j, j + 3) !== q) j++;
      out.push({ t: "string", v: code.slice(i, j + 3) }); i = j + 3; continue;
    }
    if ((code[i] === "f" || code[i] === "r" || code[i] === "b") &&
        (code[i+1] === '"' || code[i+1] === "'")) {
      const q = code[i+1]; let j = i + 2;
      while (j < code.length && !(code[j] === q && code[j-1] !== "\\")) j++;
      out.push({ t: "string", v: code.slice(i, j + 1) }); i = j + 1; continue;
    }
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i]; let j = i + 1;
      while (j < code.length && !(code[j] === q && code[j-1] !== "\\")) j++;
      out.push({ t: "string", v: code.slice(i, j + 1) }); i = j + 1; continue;
    }
    if (/[0-9]/.test(code[i])) {
      let j = i; while (j < code.length && /[0-9._x]/.test(code[j])) j++;
      out.push({ t: "number", v: code.slice(i, j) }); i = j; continue;
    }
    if (code[i] === "@") {
      let j = i + 1; while (j < code.length && /[a-zA-Z0-9_.]/.test(code[j])) j++;
      out.push({ t: "decorator", v: code.slice(i, j) }); i = j; continue;
    }
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i; while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const w = code.slice(i, j), isCall = code[j] === "(";
      let t = KW.has(w) ? "kw" : BT.has(w) ? "bt" : isCall ? "fn" : "plain";
      out.push({ t, v: w }); i = j; continue;
    }
    out.push({ t: "op", v: code[i] }); i++;
  }
  return out;
}

const TC = {
  kw: "#f472b6", bt: "#38bdf8", fn: "#60a5fa",
  string: "#86efac", comment: "#4b5563", number: "#fb923c",
  decorator: "#c084fc", op: "#64748b", plain: "#e2e8f0",
};

function HLLine({ line }) {
  return <>{pyTokens(line).map((tk, i) => (
    <span key={i} style={{ color: TC[tk.t] || TC.plain }}>{tk.v}</span>
  ))}</>;
}

/* ─────────────────────────────────────────────────────────
   VS CODE BLOCK
───────────────────────────────────────────────────────── */
function CodeBlock({ code, filename, note, lang = "python" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const lines = code.split("\n");
  return (
    <div className="my-8 rounded-2xl overflow-hidden not-prose" style={{
      background: "#0d1117",
      border: "1px solid rgba(255,255,255,0.07)",
      boxShadow: "0 0 0 1px rgba(99,102,241,0.08),0 24px 64px -16px rgba(0,0,0,0.9)",
    }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{
        background: "rgba(255,255,255,0.02)",
        borderBottom: "1px solid rgba(255,255,255,0.055)",
      }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          {filename && <span className="mono text-xs text-slate-500">{filename}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="mono text-[10px] px-2 py-0.5 rounded" style={{
            background: "rgba(99,102,241,0.14)", color: "#818cf8",
            border: "1px solid rgba(99,102,241,0.2)",
          }}>{lang.toUpperCase()}</span>
          <button onClick={copy} className="flex items-center gap-1.5 mono text-xs transition-colors" style={{ color: copied ? "#34d399" : "#475569" }}>
            {copied ? <><Check className="w-3.5 h-3.5" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
          </button>
        </div>
      </div>
      {note && (
        <div className="px-4 py-1.5 mono text-[11px] italic" style={{
          color: "#374151", borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}>// {note}</div>
      )}
      <div className="overflow-x-auto">
        <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
          <colgroup><col style={{ width: "3rem" }} /><col /></colgroup>
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} style={{ transition: "background 0.12s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td className="mono text-xs text-right select-none"
                  style={{ color: "#1e2837", padding: "1px 14px 1px 16px", verticalAlign: "top", userSelect: "none" }}>
                  {idx + 1}
                </td>
                <td className="mono text-xs pr-8" style={{ padding: "1px 32px 1px 0", lineHeight: "1.75" }}>
                  {lang === "python" ? <HLLine line={line} /> : <span style={{ color: "#e2e8f0" }}>{line}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   THREE.JS – HERO PARTICLE CANVAS
───────────────────────────────────────────────────────── */
function HeroCanvas() {
  const canvasRef = useRef(null);
  const cleanRef = useRef(null);
  useEffect(() => {
    let mounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    import("three").then((THREE) => {
      if (!mounted || !canvasRef.current) return;
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || 600;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
      camera.position.z = 6;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(w, h);
      // Cap DPR at 1.5 (same ceiling as HeroWebGL) — using 2 roughly doubles
      // fill-rate cost for a barely perceptible quality delta on most screens.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);

      const count = 3500;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = 3 + Math.random() * 14;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        pos[i*3]   = r * Math.sin(p) * Math.cos(t);
        pos[i*3+1] = r * Math.sin(p) * Math.sin(t);
        pos[i*3+2] = r * Math.cos(p);
        const m = Math.random();
        col[i*3]   = 0.22 + m * 0.38;
        col[i*3+1] = 0.18 + m * 0.20;
        col[i*3+2] = 0.72 + m * 0.28;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({ size: 0.042, vertexColors: true, transparent: true, opacity: 0.88, sizeAttenuation: true });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);

      const ringGeo = new THREE.TorusGeometry(1.6, 0.004, 8, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.18 });
      scene.add(new THREE.Mesh(ringGeo, ringMat));
      const ring2Geo = new THREE.TorusGeometry(2.4, 0.003, 8, 100);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.10 });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI / 3;
      scene.add(ring2);

      let mx = 0, my = 0;
      const onMouse = (e) => { mx = (e.clientX / window.innerWidth - 0.5) * 2; my = -(e.clientY / window.innerHeight - 0.5) * 2; };
      window.addEventListener("mousemove", onMouse, { passive: true });

      // Frame-rate cap (~30 fps) + full stop when off-screen or tab hidden.
      // Without this the canvas renders at native 60+ fps at all times,
      // burning GPU continuously as the user reads the article.
      const FRAME_MS = 1000 / 30;
      let raf = 0, running = false, lastT = performance.now(), tick = 0;
      const startLoop = () => { if (running) return; running = true; lastT = performance.now(); raf = requestAnimationFrame(loop); };
      const stopLoop  = () => { if (!running) return; running = false; cancelAnimationFrame(raf); raf = 0; };
      const loop = (now) => {
        if (!running) return;
        raf = requestAnimationFrame(loop);
        if (now - lastT < FRAME_MS) return;
        const dt = Math.min(now - lastT, 50); lastT = now;
        // Scale tick by actual elapsed time so animation speed is frame-rate-independent.
        tick += 0.0004 * (dt / 16.67);
        pts.rotation.y = tick + mx * 0.08;
        pts.rotation.x = tick * 0.38 + my * 0.06;
        ring2.rotation.y = tick * 0.6;
        camera.position.x += (mx * 0.4 - camera.position.x) * 0.04;
        camera.position.y += (my * 0.25 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      };

      let onscreen = false;
      const sync = () => { if (onscreen && !document.hidden) startLoop(); else stopLoop(); };
      const io = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; sync(); }, { threshold: 0 });
      io.observe(canvas);
      const onVis = () => sync();
      document.addEventListener("visibilitychange", onVis);
      sync();

      const onResize = () => {
        if (!canvas.parentElement) return;
        const nw = canvas.parentElement.clientWidth, nh = canvas.parentElement.clientHeight;
        camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
      };
      window.addEventListener("resize", onResize, { passive: true });

      cleanRef.current = () => {
        stopLoop();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        // Dispose ALL geometry and material objects to prevent WebGL memory leaks.
        geo.dispose(); mat.dispose();
        ringGeo.dispose(); ringMat.dispose();
        ring2Geo.dispose(); ring2Mat.dispose();
        renderer.dispose();
      };
    });
    return () => { mounted = false; cleanRef.current?.(); };
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

/* ─────────────────────────────────────────────────────────
   THREE.JS – WORKFLOW NETWORK
───────────────────────────────────────────────────────── */
function WorkflowCanvas() {
  const canvasRef = useRef(null);
  const cleanRef = useRef(null);
  useEffect(() => {
    let mounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    import("three").then((THREE) => {
      if (!mounted || !canvasRef.current) return;
      const w = canvas.parentElement?.clientWidth || 700, h = 300;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
      camera.position.z = 7;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);

      const nodes = [
        { p: [-4.5, 0, 0], c: 0x6366f1 },
        { p: [-2.2,  1.1, 0], c: 0x3b82f6 },
        { p: [-2.2, -1.1, 0], c: 0x8b5cf6 },
        { p: [  0,   0,   0], c: 0x4f46e5 },
        { p: [ 2.2,  1.1, 0], c: 0x10b981 },
        { p: [ 2.2, -1.1, 0], c: 0xf59e0b },
        { p: [ 4.5,  0,   0], c: 0x34d399 },
      ];
      const edges = [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6]];

      // Track all Three.js objects for correct disposal.
      const toDispose = [];
      const nodeMeshes = nodes.map(({ p, c }) => {
        const geo = new THREE.SphereGeometry(0.24, 16, 16);
        const mat = new THREE.MeshBasicMaterial({ color: c });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...p);
        scene.add(mesh);
        toDispose.push(geo, mat);
        const hGeo = new THREE.SphereGeometry(0.38, 10, 10);
        const hMat = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.1, side: THREE.BackSide });
        const halo = new THREE.Mesh(hGeo, hMat);
        halo.position.set(...p);
        scene.add(halo);
        toDispose.push(hGeo, hMat);
        return mesh;
      });

      edges.forEach(([a, b]) => {
        const pts = [new THREE.Vector3(...nodes[a].p), new THREE.Vector3(...nodes[b].p)];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.28 });
        scene.add(new THREE.Line(geo, mat));
        toDispose.push(geo, mat);
      });

      const tGeo = new THREE.SphereGeometry(0.065, 6, 6);
      const tMat = new THREE.MeshBasicMaterial({ color: 0xddd6fe });
      toDispose.push(tGeo, tMat);
      const travelers = edges.map(([a, b]) => {
        const mesh = new THREE.Mesh(tGeo, tMat); // shared geo/mat
        scene.add(mesh);
        return { mesh, from: nodes[a].p, to: nodes[b].p, t: Math.random(), speed: 0.005 + Math.random() * 0.004 };
      });

      let mx = 0;
      const onMouse = (e) => { mx = e.clientX / window.innerWidth - 0.5; };
      window.addEventListener("mousemove", onMouse, { passive: true });

      const FRAME_MS = 1000 / 30;
      let raf = 0, running = false, lastT = performance.now(), tick = 0;
      const startLoop = () => { if (running) return; running = true; lastT = performance.now(); raf = requestAnimationFrame(loop); };
      const stopLoop  = () => { if (!running) return; running = false; cancelAnimationFrame(raf); raf = 0; };
      const loop = (now) => {
        if (!running) return;
        raf = requestAnimationFrame(loop);
        if (now - lastT < FRAME_MS) return;
        lastT = now;
        tick += 0.6; // ~0.02 per frame × 30fps
        travelers.forEach((tr) => {
          tr.t = (tr.t + tr.speed) % 1;
          const [fx,fy,fz] = tr.from, [tx,ty,tz] = tr.to;
          tr.mesh.position.set(fx+(tx-fx)*tr.t, fy+(ty-fy)*tr.t, fz+(tz-fz)*tr.t);
        });
        nodeMeshes.forEach((m, i) => { const s = 1 + 0.11 * Math.sin(tick * 0.02 + i * 0.8); m.scale.setScalar(s); });
        scene.rotation.y = mx * 0.22;
        renderer.render(scene, camera);
      };

      let onscreen = false;
      const sync = () => { if (onscreen && !document.hidden) startLoop(); else stopLoop(); };
      const io = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; sync(); }, { threshold: 0 });
      io.observe(canvas);
      const onVis = () => sync();
      document.addEventListener("visibilitychange", onVis);
      sync();

      const onResize = () => {
        if (!canvas.parentElement) return;
        const nw = canvas.parentElement.clientWidth;
        camera.aspect = nw / h; camera.updateProjectionMatrix(); renderer.setSize(nw, h);
      };
      window.addEventListener("resize", onResize, { passive: true });
      cleanRef.current = () => {
        stopLoop();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        toDispose.forEach((o) => o.dispose?.());
        renderer.dispose();
      };
    });
    return () => { mounted = false; cleanRef.current?.(); };
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />;
}

/* ─────────────────────────────────────────────────────────
   THREE.JS – NEURAL BRAIN
───────────────────────────────────────────────────────── */
function NeuralCanvas() {
  const canvasRef = useRef(null);
  const cleanRef = useRef(null);
  useEffect(() => {
    let mounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    import("three").then((THREE) => {
      if (!mounted || !canvasRef.current) return;
      const w = canvas.parentElement?.clientWidth || 600, h = 280;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
      camera.position.z = 5;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);

      const toDispose = [];
      const NC = 65;
      const nPos = Array.from({ length: NC }, () => ({
        x: (Math.random() - 0.5) * 7, y: (Math.random() - 0.5) * 4.5,
        z: (Math.random() - 0.5) * 3, ph: Math.random() * Math.PI * 2,
      }));
      const nMeshes = nPos.map((np) => {
        const geo = new THREE.SphereGeometry(0.055 + Math.random() * 0.065, 8, 8);
        const col = new THREE.Color().setHSL(0.68 + Math.random() * 0.12, 0.7, 0.52);
        const mat = new THREE.MeshBasicMaterial({ color: col });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(np.x, np.y, np.z);
        scene.add(mesh);
        toDispose.push(geo, mat);
        return mesh;
      });

      const lineGroup = new THREE.Group();
      const lineMat = new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.13 });
      toDispose.push(lineMat);
      for (let a = 0; a < NC; a++) {
        for (let b = a + 1; b < NC; b++) {
          const pa = nPos[a], pb = nPos[b];
          const d = Math.sqrt((pa.x-pb.x)**2 + (pa.y-pb.y)**2 + (pa.z-pb.z)**2);
          if (d < 2.4) {
            const geo = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(pa.x, pa.y, pa.z), new THREE.Vector3(pb.x, pb.y, pb.z),
            ]);
            lineGroup.add(new THREE.Line(geo, lineMat));
            toDispose.push(geo);
          }
        }
      }
      scene.add(lineGroup);

      const pGeo = new THREE.SphereGeometry(0.04, 6, 6);
      const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      toDispose.push(pGeo, pMat);
      const pulses = Array.from({ length: 22 }, () => {
        let a = Math.floor(Math.random() * NC), b;
        do { b = Math.floor(Math.random() * NC); } while (b === a);
        const mesh = new THREE.Mesh(pGeo, pMat); // shared geo/mat
        scene.add(mesh);
        return { mesh, from: nPos[a], to: nPos[b], t: Math.random(), speed: 0.009 + Math.random() * 0.008 };
      });

      let mx = 0, my = 0;
      const onMouse = (e) => { mx = e.clientX / window.innerWidth - 0.5; my = -(e.clientY / window.innerHeight - 0.5); };
      window.addEventListener("mousemove", onMouse, { passive: true });

      const FRAME_MS = 1000 / 30;
      let raf = 0, running = false, lastT = performance.now(), tick = 0;
      const startLoop = () => { if (running) return; running = true; lastT = performance.now(); raf = requestAnimationFrame(loop); };
      const stopLoop  = () => { if (!running) return; running = false; cancelAnimationFrame(raf); raf = 0; };
      const loop = (now) => {
        if (!running) return;
        raf = requestAnimationFrame(loop);
        if (now - lastT < FRAME_MS) return;
        lastT = now;
        tick += 0.45; // ~0.015 per frame × 30fps
        nPos.forEach((np, i) => { nMeshes[i].position.y = np.y + 0.09 * Math.sin(tick * 0.015 + np.ph); });
        pulses.forEach((p) => {
          p.t = (p.t + p.speed) % 1;
          p.mesh.position.set(
            p.from.x + (p.to.x - p.from.x) * p.t,
            p.from.y + (p.to.y - p.from.y) * p.t,
            p.from.z + (p.to.z - p.from.z) * p.t,
          );
        });
        scene.rotation.y = mx * 0.38;
        scene.rotation.x = my * 0.22;
        renderer.render(scene, camera);
      };

      let onscreen = false;
      const sync = () => { if (onscreen && !document.hidden) startLoop(); else stopLoop(); };
      const io = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; sync(); }, { threshold: 0 });
      io.observe(canvas);
      const onVis = () => sync();
      document.addEventListener("visibilitychange", onVis);
      sync();

      const onResize = () => {
        if (!canvas.parentElement) return;
        const nw = canvas.parentElement.clientWidth;
        camera.aspect = nw / h; camera.updateProjectionMatrix(); renderer.setSize(nw, h);
      };
      window.addEventListener("resize", onResize, { passive: true });
      cleanRef.current = () => {
        stopLoop();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        toDispose.forEach((o) => o.dispose?.());
        renderer.dispose();
      };
    });
    return () => { mounted = false; cleanRef.current?.(); };
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />;
}

/* ─────────────────────────────────────────────────────────
   ANIMATED TITLE
───────────────────────────────────────────────────────── */
function AnimatedTitle() {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 150); return () => clearTimeout(t); }, []);
  const words = ["WHY", "PYTHON", "FOR", "AUTOMATION"];
  let idx = 0;
  // One shimmer animation on the parent h1 instead of one per character.
  // Previously each character ran its own `shimmer` keyframe, producing 21+
  // independent CSS animations. A single animation on the ancestor is visually
  // identical but eliminates the redundant work entirely.
  return (
    <h1 className="font-black text-center leading-none select-none"
      style={{
        fontSize: "clamp(2.4rem,7.5vw,5.5rem)", letterSpacing: "-0.03em",
        background: "linear-gradient(135deg,#fff 0%,#a5b4fc 38%,#c084fc 65%,#f472b6 100%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text", backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: vis ? "shimmer 5s linear infinite" : "none",
      }}>
      {words.map((w, wi) => (
        <span key={wi} className="block">
          {w.split("").map((ch) => {
            const d = idx++ * 0.038;
            return (
              <span key={ch + d} className="inline-block" style={{
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(48px)",
                transition: `opacity 0.65s ease ${d}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${d}s`,
              }}>{ch}</span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/* ─────────────────────────────────────────────────────────
   FLOATING CODE DECORATION
───────────────────────────────────────────────────────── */
function FloatingCode() {
  const snippets = [
    { code: "import requests", top: "12%", left: "3%", delay: 0 },
    { code: "df.groupby('cat')", top: "22%", right: "4%", delay: 0.6 },
    { code: "await asyncio.gather(*tasks)", top: "72%", left: "2%", delay: 1.0 },
    { code: "schedule.every(1).hours.do(job)", top: "78%", right: "3%", delay: 0.3 },
    { code: "driver.find_element(By.ID,'btn')", top: "45%", left: "1%", delay: 0.8 },
    { code: "client.chat.completions.create()", top: "55%", right: "2%", delay: 0.4 },
  ];
  return (
    <>
      {snippets.map((s, i) => (
        <div key={i} className="absolute hidden lg:block pointer-events-none mono text-[11px] text-indigo-300/35 whitespace-nowrap rounded-lg px-3 py-1.5"
          style={{
            top: s.top, left: s.left, right: s.right,
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.12)",
            animation: `cardFloat ${4 + i * 0.5}s ease-in-out ${s.delay}s infinite`,
          }}>
          {s.code}
        </div>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────── */
function Counter({ end, prefix = "", suffix = "" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const dur = 1800;
        const tick = (now) => {
          const prog = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - prog, 3);
          setN(Math.round(ease * end));
          if (prog < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return (
    <span ref={ref} className="mono font-black text-3xl lg:text-4xl"
      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      {prefix}{n.toLocaleString()}{suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   ARCHITECTURE FLOW DIAGRAM
───────────────────────────────────────────────────────── */
function ArchDiagram() {
  const steps = [
    { label: "Trigger",       sub: "event · schedule · webhook",     col: "#6366f1" },
    { label: "Python Logic",  sub: "your script runs here",          col: "#3b82f6" },
    { label: "Libraries",     sub: "requests · pandas · selenium",   col: "#8b5cf6" },
    { label: "Output",        sub: "file · database · API · Slack",  col: "#10b981" },
    { label: "Monitor",       sub: "logs · retries · alerts",        col: "#f59e0b" },
  ];
  return (
    <div className="glass rounded-2xl p-6 my-8 relative overflow-hidden not-prose">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-sm mx-auto">
        {steps.map((s, i) => (
          <div key={s.label}>
            <div className="rounded-xl px-5 py-3.5" style={{
              background: `linear-gradient(135deg,${s.col}20,${s.col}08)`,
              border: `1px solid ${s.col}38`,
            }}>
              <div className="text-white font-semibold text-sm">{s.label}</div>
              <div className="mono text-xs mt-0.5" style={{ color: s.col + "cc" }}>{s.sub}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <svg width="20" height="26" viewBox="0 0 20 26">
                  <line x1="10" y1="0" x2="10" y2="18" stroke={s.col} strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "vdash 0.9s linear infinite" }} />
                  <path d="M4,14 L10,22 L16,14" fill="none" stroke={s.col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-center gap-2">
            <svg width="130" height="18" viewBox="0 0 130 18">
              <defs><marker id="ar" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#818cf8" /></marker></defs>
              <path d="M8,9 Q65,2 122,9" fill="none" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#ar)" style={{ animation: "vdash 1.6s linear infinite" }} />
            </svg>
            <span className="mono text-[11px] text-indigo-400">↻ repeats on every trigger</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BROWSER FLOW DIAGRAM
───────────────────────────────────────────────────────── */
function BrowserDiagram() {
  const steps = [["Open URL", "#6366f1"], ["Wait for element", "#3b82f6"], ["Click / Type", "#8b5cf6"], ["Extract data", "#10b981"], ["Save result", "#34d399"]];
  return (
    <div className="glass rounded-2xl p-5 my-6 not-prose relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="relative flex items-center gap-2 flex-wrap">
        {steps.map(([label, col], i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="rounded-lg px-3 py-2 text-xs font-medium text-white" style={{ background: `${col}22`, border: `1px solid ${col}44` }}>{label}</div>
            {i < steps.length - 1 && (
              <svg width="24" height="12" viewBox="0 0 24 12">
                <path d="M0,6 H20" stroke={col} strokeWidth="1.4" strokeDasharray="3 3" style={{ animation: "vdash 0.8s linear infinite" }} />
                <path d="M16,2 L22,6 L16,10" fill="none" stroke={col} strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mono mt-3 relative">Selenium/Playwright drives the browser step by step — exactly as a human would, but at machine speed.</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DATA PIPELINE DIAGRAM
───────────────────────────────────────────────────────── */
function DataDiagram() {
  const stages = [["CSV / Excel", "#6366f1"], ["pandas DataFrame", "#3b82f6"], ["Clean & Transform", "#8b5cf6"], ["Aggregate", "#a855f7"], ["Export / Report", "#10b981"]];
  return (
    <div className="not-prose glass rounded-2xl overflow-hidden my-6">
      <div className="px-4 py-2 mono text-xs text-slate-500" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        // pandas data pipeline
      </div>
      <div className="flex items-stretch overflow-x-auto">
        {stages.map(([label, col], i) => (
          <div key={label} className="flex items-center flex-shrink-0">
            <div className="px-4 py-5 text-center" style={{ minWidth: "110px" }}>
              <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: `${col}22`, border: `1px solid ${col}44` }}>
                <div className="w-2 h-2 rounded-full" style={{ background: col, animation: `vpulse 2s ease-in-out ${i * 0.3}s infinite` }} />
              </div>
              <div className="text-xs text-slate-300 font-medium">{label}</div>
            </div>
            {i < stages.length - 1 && (
              <svg width="20" height="20" viewBox="0 0 20 20" className="flex-shrink-0">
                <path d="M0,10 H16" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "vdash 0.8s linear infinite" }} />
                <path d="M12,5 L18,10 L12,15" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CALLOUT BOX
───────────────────────────────────────────────────────── */
function Callout({ icon: Icon = CircleCheck, color = "#6366f1", children }) {
  return (
    <div className="not-prose flex gap-3 rounded-xl p-4 my-6" style={{
      background: `${color}10`, border: `1px solid ${color}28`,
    }}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />
      <p className="text-sm text-slate-300 leading-relaxed">{children}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="not-prose border rounded-xl overflow-hidden transition-all" style={{ borderColor: open ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)", background: open ? "rgba(99,102,241,0.06)" : "transparent" }}>
      <button className="w-full flex items-center justify-between px-5 py-4 text-left" onClick={() => setOpen(!open)}>
        <span className="text-white font-medium text-sm pr-4">{q}</span>
        <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 transition-transform" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }} />
      </button>
      <div className="faq-answer" style={{ maxHeight: open ? "400px" : "0" }}>
        <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function PythonAutomationPost({ back, openArticle }) {
  const [active, setActive] = useState(TOC[0].id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    TOC.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <article itemScope itemType="https://schema.org/BlogPosting">
      <Helmet>
        <title>Why Python is Ideal for Automation | Nexara</title>
        <meta name="description" content="The complete guide to Python automation — from os and pathlib to Selenium, pandas, asyncio, and AI agents. Real code, interactive 3D visuals, 8 min read." />
        <link rel="canonical" href={`${SITE_URL}/blog/python-ideal-for-automation`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/blog/python-ideal-for-automation`} />
        <meta property="og:title" content="Why Python is Ideal for Automation | Nexara" />
        <meta property="og:description" content="The complete guide to Python automation — real code examples, key libraries, and interactive 3D visuals." />
        <meta name="keywords" content="python automation,python scripting,selenium python,pandas automation,python workflow automation,asyncio tutorial,python openai,langchain automation" />
        <meta property="article:author" content="Rehan Nazir" />
        <meta property="article:published_time" content="2026-06-27" />
        <meta property="article:section" content="Automation" />
        <meta property="article:tag" content="python" />
        <meta property="article:tag" content="automation" />
        <meta property="article:tag" content="selenium" />
        <meta property="article:tag" content="pandas" />
        <meta property="article:tag" content="ai" />
      </Helmet>

      {/* ── HERO ───────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: "88vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Three.js particle canvas */}
        <div className="absolute inset-0">
          <HeroCanvas />
        </div>
        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #010104)" }} />

        <FloatingCode />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-5 pt-16 pb-20">
          {/* Back */}
          <button onClick={back} className="inline-flex items-center gap-2 text-sm mono text-slate-400 hover:text-indigo-300 transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" /> All blog posts
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mono text-indigo-200 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ animation: "vpulse 2s ease-in-out infinite" }} />
            Automation · 8 min read
          </div>

          <AnimatedTitle />

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mt-8 leading-relaxed" style={{ opacity: 1 }}>
            Discover why Python became the world&apos;s favourite language for automation — from simple file scripts to AI-powered multi-agent workflows.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>RN</div>
            <span className="text-sm text-slate-300" itemProp="author" itemScope itemType="https://schema.org/Person">
              <span itemProp="name">Rehan Nazir</span>
            </span>
            <span className="text-slate-600">·</span>
            <time className="text-sm mono text-slate-500" itemProp="datePublished" dateTime="2026-06-27">27 Jun 2026</time>
            <span className="text-slate-600">·</span>
            <span className="text-sm mono text-slate-500">8 min read</span>
          </div>

          <button onClick={() => go("introduction")} className="mt-10 inline-flex flex-col items-center gap-1 text-slate-600 hover:text-indigo-400 transition-colors">
            <span className="text-xs mono">scroll to read</span>
            <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: "cardFloat 2s ease-in-out infinite" }}>
              <path d="M4,6 L10,14 L16,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── STATS BAR ──────────────────────────────────── */}
      <FadeIn>
        <div className="max-w-5xl mx-auto px-5 py-10">
          <div className="glass rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {[
              { end: 430000, suffix: "+", label: "PyPI packages" },
              { end: 8,      suffix: "M+", label: "Active developers" },
              { end: 5,      suffix: " yrs", label: "#1 most popular" },
              { end: 70,     suffix: "%", label: "Fortune 500 use Python" },
            ].map(({ end, suffix, label }) => (
              <div key={label} className="text-center py-7 px-4">
                <Counter end={end} suffix={suffix} />
                <div className="text-slate-500 text-xs mono mt-1.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── BODY GRID ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 pb-24">
        <div className="grid lg:grid-cols-[220px_1fr] gap-12">

          {/* TOC SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mono text-xs text-slate-500 uppercase tracking-wide mb-4">
                <List className="w-4 h-4" /> On this page
              </div>
              <nav className="flex flex-col gap-0.5 border-l border-white/[0.07]">
                {TOC.map((s) => (
                  <button key={s.id} onClick={() => go(s.id)}
                    className="text-left text-xs pl-4 py-1.5 -ml-px border-l transition-all mono"
                    style={{
                      borderColor: active === s.id ? "#818cf8" : "transparent",
                      color: active === s.id ? "#e2e8f0" : "#4b5563",
                    }}>
                    {s.t}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ARTICLE CONTENT */}
          <div className="prose-blog max-w-2xl min-w-0">

            {/* ── INTRODUCTION ─────────────────────── */}
            <h2 id="introduction">Introduction</h2>
            <p>
              Automation is the art of making software do what humans do manually — but faster, more reliably, and without ever getting tired. Python has become the dominant language for this discipline not by accident, but because every design decision in the language compounds into an advantage when you are building systems that need to run without supervision.
            </p>
            <p>
              Today, Python automation spans an enormous range: rename ten thousand files in two seconds, monitor a production API every five minutes, scrape and summarise a competitor's pricing page every morning, fill out browser forms that have no API, process quarterly sales data into a formatted Excel report, or orchestrate a chain of GPT-4o calls that research, write, and publish content. Every one of these is a Python job, and each one uses the same straightforward language you could learn in a weekend.
            </p>
            <p>
              This guide is a complete reference. It starts with <em>why Python</em> and works all the way through to a production-grade pipeline that combines web scraping, AI summarisation, a database, scheduling, and Slack notifications — in under 80 lines of code. Every section has real, runnable examples. By the end you will not just understand Python automation: you will be ready to build it.
            </p>

            <Callout color="#6366f1">
              <strong>Who this is for:</strong> beginners who want to learn automation from scratch, and intermediate developers who want a single comprehensive reference for Python's automation ecosystem.
            </Callout>

            {/* ── WHY PYTHON ───────────────────────── */}
            <h2 id="why-python">Why Python Won</h2>
            <p>
              Every major language can automate tasks. Bash can run system commands. PowerShell owns Windows administration. JavaScript runs everywhere the web does. Go compiles to tiny, fast binaries. Yet Python is the one language that engineers reach for first when the goal is automation, and for reasons that are structural rather than fashionable.
            </p>

            <h3>Syntax that reads like intent</h3>
            <p>
              Consider finding every PDF in a directory tree. In Python: <code>Path(".").rglob("*.pdf")</code>. That is not a simplification — it is the real code. Python's syntax is close enough to natural language that you can often read a script aloud and be understood by a non-programmer. This matters for automation because automation scripts are maintained by humans long after they are written. Readable code survives; clever code rots.
            </p>

            <h3>Batteries included, ecosystem unlimited</h3>
            <p>
              Python ships with a standard library that covers file I/O, HTTP, JSON, CSV, SQLite, email, threading, subprocess control, and more — all without a single <code>pip install</code>. Beyond the standard library, PyPI hosts over 430,000 packages. Whatever automation category you are working in, someone has already built and tested the hard parts.
            </p>

            <FadeIn>
              <div className="not-prose grid sm:grid-cols-2 gap-3 my-7">
                {[
                  ["Simple syntax", "Reads like English. A junior developer can maintain your automation scripts without deciphering them."],
                  ["Cross-platform", "The same Python script runs on Windows, macOS, and Linux. Write once, deploy anywhere your clients or servers operate."],
                  ["430,000+ packages", "Every automation category — web, data, AI, desktop, scheduling — has multiple mature, well-documented libraries waiting."],
                  ["8M+ developers", "The largest programming community means your error message is probably already answered on Stack Overflow."],
                  ["AI-first", "OpenAI, Anthropic, Hugging Face, and LangChain all ship Python SDKs first. Python is the language of the AI era."],
                  ["Rapid iteration", "Prototype an idea in 20 lines, test it in the REPL, ship it as a scheduled job. The feedback loop is uniquely fast."],
                ].map(([t, d]) => (
                  <div key={t} className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1.5">
                      <CircleCheck className="w-4 h-4 text-indigo-400 shrink-0" />{t}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed m-0">{d}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <h3>The companies that chose Python</h3>
            <p>
              Google used Python to automate their original web-crawling infrastructure. Instagram runs on Python at a scale of over a billion users. Dropbox's desktop client was Python. NASA scripts mission-critical data pipelines in Python. Spotify uses it for data engineering. These are not toy projects — they are proof that Python scales from a weekend script to enterprise infrastructure.
            </p>

            {/* ── ARCHITECTURE ─────────────────────── */}
            <h2 id="architecture">Automation Architecture</h2>
            <p>
              Every Python automation, no matter how simple or complex, follows the same five-stage anatomy. Understanding this pattern is the most important conceptual step in the discipline — it is what separates a script that works once from a system that runs indefinitely.
            </p>

            <FadeIn>
              <ArchDiagram />
            </FadeIn>

            <p>
              The <strong>Trigger</strong> decides when the automation runs — a file change, a time-based schedule, an incoming webhook, or a queue message. The <strong>Python Logic</strong> contains your actual business rules. The <strong>Libraries</strong> handle the heavy lifting (HTTP, parsing, data transformation). The <strong>Output</strong> is the action that creates value: writing a file, inserting a database row, sending a notification, calling an API. The <strong>Monitor</strong> layer — logs, retry logic, and alerts — is what makes the automation trustworthy enough to hand off.
            </p>
            <p>
              The feedback arrow matters: a well-built automation loops back to the trigger and keeps running without human attention. This is the architectural distinction between a one-shot script and a production system.
            </p>

            <FadeIn>
              <div className="glass rounded-2xl p-5 my-8 not-prose relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-10" />
                <p className="text-xs mono text-slate-500 mb-3 relative">// Three.js workflow graph — nodes pulse, particles travel connections in real time</p>
                <div className="relative rounded-xl overflow-hidden" style={{ height: 300 }}>
                  <WorkflowCanvas />
                </div>
                <p className="text-xs text-center text-slate-500 mono mt-2 relative">Trigger → fetch → schedule → Python core → store → notify → done. Move your mouse to rotate the graph.</p>
              </div>
            </FadeIn>

            {/* ── FILE SYSTEM ──────────────────────── */}
            <h2 id="file-system">File System Libraries</h2>
            <p>
              File manipulation is the entry point for most automation engineers. Whether you are organising downloads, cleaning up log files, or building a backup system, Python's file system libraries handle it in a few lines of idiomatic code.
            </p>

            <h3>os — Operating System Interface</h3>
            <p>
              The <code>os</code> module is Python's direct line to the operating system. It lets you walk directory trees, read and set environment variables, manage processes, check file metadata, and create or remove paths. It predates modern Python but remains indispensable for low-level operations.
            </p>
            <CodeBlock
              filename="os_example.py"
              note="Walk directory tree and report large files"
              code={`import os

# Recursively find all files larger than 100 MB
for root, dirs, files in os.walk("/home/user/data"):
    for filename in files:
        path = os.path.join(root, filename)
        size_mb = os.path.getsize(path) / (1024 * 1024)
        if size_mb > 100:
            print(f"Large file: {path} ({size_mb:.1f} MB)")

# Always read secrets from environment, never hardcode them
db_url = os.environ.get("DATABASE_URL", "sqlite:///local.db")
api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY must be set")`}
            />

            <h3>pathlib — Modern Path Handling</h3>
            <p>
              <code>pathlib</code> (Python 3.4+) replaces string-based path manipulation with an object-oriented API. Paths become <code>Path</code> objects you can join with <code>/</code>, glob with patterns, and query with <code>.stem</code>, <code>.suffix</code>, <code>.parent</code>. It is the modern way to write file automation.
            </p>
            <CodeBlock
              filename="pathlib_example.py"
              note="Bulk rename files using pathlib's clean API"
              code={`from pathlib import Path
from datetime import date

downloads = Path.home() / "Downloads"

# Rename all .jpeg files to .jpg (bulk normalise extension)
renamed = 0
for f in downloads.glob("**/*.jpeg"):
    new_name = f.with_suffix(".jpg")
    f.rename(new_name)
    renamed += 1
print(f"Renamed {renamed} files")

# Create an organised output directory tree
output = Path("output") / str(date.today()) / "reports"
output.mkdir(parents=True, exist_ok=True)
print(f"Output directory ready: {output.resolve()}")`}
            />

            <h3>shutil — High-Level File Operations</h3>
            <p>
              <code>shutil</code> handles the operations that <code>os</code> and <code>pathlib</code> do not — copying directory trees, moving files across volumes, creating archives, and deleting entire folders. Its most common automation use is building daily backup scripts.
            </p>
            <CodeBlock
              filename="backup.py"
              note="Automated daily backup with zip archive"
              code={`import shutil
from pathlib import Path
from datetime import date

def run_backup(source: str, dest_base: str) -> Path:
    source_path = Path(source)
    dated_dest = Path(dest_base) / str(date.today())

    # Copy the full directory tree
    shutil.copytree(source_path, dated_dest)

    # Compress it into a zip archive
    archive = shutil.make_archive(str(dated_dest), "zip", dated_dest)

    # Remove the uncompressed copy to save space
    shutil.rmtree(dated_dest)

    return Path(archive)

archive = run_backup("important_data", "backups")
size_kb = archive.stat().st_size // 1024
print(f"Backup complete: {archive.name} ({size_kb} KB)")`}
            />

            {/* ── WEB & HTTP ───────────────────────── */}
            <h2 id="web-http">Web & HTTP</h2>
            <p>
              Most real-world automation talks to the internet — fetching prices, calling APIs, checking uptime, posting to Slack, reading news feeds. Python's web libraries make this clean and reliable.
            </p>

            <h3>requests — Human-Friendly HTTP</h3>
            <p>
              <code>requests</code> is the most downloaded Python package of all time for a reason: it makes HTTP requests as readable as possible. <code>requests.get(url)</code> is literally the entire API for a basic fetch. Add <code>.raise_for_status()</code> to turn HTTP errors into exceptions, and wrap in a retry loop for production resilience.
            </p>
            <CodeBlock
              filename="requests_example.py"
              note="Resilient API fetch with exponential backoff retry"
              code={`import requests
from time import sleep

def get_with_retry(url: str, retries: int = 3) -> dict:
    for attempt in range(retries):
        try:
            r = requests.get(
                url, timeout=10,
                headers={"User-Agent": "AutoBot/1.0"}
            )
            r.raise_for_status()          # raise on 4xx / 5xx
            return r.json()
        except requests.RequestException as e:
            if attempt == retries - 1:
                raise                     # give up after last retry
            wait = 2 ** attempt           # 1s → 2s → 4s
            print(f"Attempt {attempt+1} failed ({e}), retrying in {wait}s")
            sleep(wait)

repo = get_with_retry("https://api.github.com/repos/python/cpython")
print(f"CPython stars: {repo['stargazers_count']:,}")`}
            />

            <h3>BeautifulSoup4 — HTML Parsing</h3>
            <p>
              Once you have the raw HTML from a page, <code>BeautifulSoup4</code> (imported as <code>bs4</code>) turns it into a navigable tree. You can find elements by tag, class, ID, or CSS selector, then extract text, attributes, or child nodes. Combined with <code>requests</code>, it is a complete lightweight scraper.
            </p>
            <CodeBlock
              filename="scraper.py"
              note="Scrape Hacker News headlines with requests + BeautifulSoup4"
              code={`import requests
from bs4 import BeautifulSoup

r = requests.get("https://news.ycombinator.com", timeout=10)
r.raise_for_status()

soup = BeautifulSoup(r.text, "html.parser")
headlines = soup.select(".titleline > a")

print(f"Top {len(headlines[:10])} Hacker News stories:\\n")
for i, tag in enumerate(headlines[:10], 1):
    title = tag.get_text(strip=True)
    href  = tag.get("href", "")
    print(f"  {i:2}. {title[:65]}")
    print(f"      → {href[:60]}")`}
            />

            {/* ── BROWSER AUTOMATION ───────────────── */}
            <h2 id="browser-auto">Browser Automation</h2>
            <p>
              Not every website has an API. Some tasks — logging into a portal, filling a multi-step form, extracting data from a JavaScript-rendered page — require a real browser. Python has two leading solutions: the battle-tested Selenium and the modern, async Playwright.
            </p>

            <BrowserDiagram />

            <h3>Selenium — Classic Browser Automation</h3>
            <p>
              Selenium has been the browser automation standard since 2004. It controls Chrome, Firefox, Edge, and Safari through the WebDriver protocol. Its <code>WebDriverWait</code> + <code>expected_conditions</code> pattern elegantly handles dynamic pages that load content asynchronously.
            </p>
            <CodeBlock
              filename="selenium_login.py"
              note="Headless Chrome login + data extraction with Selenium"
              code={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

opts = Options()
opts.add_argument("--headless=new")   # invisible Chrome
opts.add_argument("--no-sandbox")
opts.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=opts)
wait   = WebDriverWait(driver, 15)

try:
    driver.get("https://example-portal.com/login")

    wait.until(EC.presence_of_element_located((By.ID, "email"))
               ).send_keys("user@company.com")
    driver.find_element(By.ID, "password").send_keys("securepass")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(EC.url_contains("/dashboard"))
    rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
    data = [r.text for r in rows]
    print(f"Extracted {len(data)} rows from dashboard")
finally:
    driver.quit()  # always close — even if an error occurs`}
            />

            <h3>Playwright — Modern Async Automation</h3>
            <p>
              Playwright (from Microsoft) was built with modern web apps in mind. It is async-first, which means you can run multiple browser sessions concurrently. Auto-waiting is built in — you do not need explicit waits for most actions. It supports Chromium, Firefox, and WebKit from a single API.
            </p>
            <CodeBlock
              filename="playwright_screenshots.py"
              note="Screenshot five sites simultaneously using async Playwright"
              code={`import asyncio
from playwright.async_api import async_playwright
from pathlib import Path

async def screenshot_sites(urls: list[str]):
    Path("screenshots").mkdir(exist_ok=True)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch()

        async def capture(url: str):
            page = await browser.new_page(
                viewport={"width": 1280, "height": 800}
            )
            await page.goto(url, wait_until="networkidle")
            name = url.split("//")[-1].split("/")[0]
            await page.screenshot(
                path=f"screenshots/{name}.png", full_page=True
            )
            await page.close()
            print(f"  ✓ {url}")

        # All 5 sites captured in parallel — far faster than sequential
        await asyncio.gather(*[capture(u) for u in urls])
        await browser.close()

asyncio.run(screenshot_sites([
    "https://github.com",
    "https://python.org",
    "https://fastapi.tiangolo.com",
    "https://docs.python.org",
    "https://pypi.org",
]))`}
            />

            {/* ── DATA PROCESSING ──────────────────── */}
            <h2 id="data-processing">Data Processing</h2>
            <p>
              Data automation — cleaning, transforming, aggregating, and reporting — is where Python truly excels. The pandas + NumPy + openpyxl stack handles everything from a single CSV to millions of rows with the same readable API.
            </p>

            <DataDiagram />

            <h3>pandas — DataFrames for Everything</h3>
            <p>
              <code>pandas</code> turns tabular data into a <em>DataFrame</em>: a powerful in-memory structure with SQL-like operations built in. Read CSV, Excel, or SQL; clean missing values; filter rows; group by columns; merge datasets; write to any format. A task that would take 200 lines of manual Python takes 20 with pandas.
            </p>
            <CodeBlock
              filename="pandas_sales.py"
              note="Load, merge, clean and aggregate quarterly sales data"
              code={`import pandas as pd
from pathlib import Path

# Load and merge all four quarterly files
files = sorted(Path("data").glob("sales_Q*.csv"))
df = pd.concat([pd.read_csv(f) for f in files], ignore_index=True)

print(f"Loaded {len(df):,} rows from {len(files)} files")

# Clean and enrich
df["date"]    = pd.to_datetime(df["date"])
df["revenue"] = df["quantity"] * df["unit_price"]
df            = df[df["revenue"] > 0].copy()

# Aggregate: monthly revenue per product, top 10
monthly = (
    df.groupby([df["date"].dt.to_period("M"), "product"])["revenue"]
    .sum()
    .reset_index()
    .rename(columns={"date": "month"})
    .sort_values("revenue", ascending=False)
)

print("\\nTop 5 product-months by revenue:")
print(monthly.head(5).to_string(index=False))

monthly.to_csv("output/monthly_revenue.csv", index=False)
print("\\nExported to output/monthly_revenue.csv")`}
            />

            <h3>openpyxl — Excel Automation</h3>
            <p>
              When your stakeholders want a formatted Excel report — not a raw CSV — <code>openpyxl</code> lets you build it programmatically. Styled headers, conditional formatting, charts, and formula cells are all available from Python.
            </p>
            <CodeBlock
              filename="excel_report.py"
              note="Generate a formatted Excel report with openpyxl"
              code={`from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
ws = wb.active
ws.title = "Q2 Sales Report"

# Styled header row
headers = ["Product", "Units Sold", "Revenue ($)", "Growth (%)"]
fill    = PatternFill("solid", fgColor="4F46E5")
for col, text in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col, value=text)
    cell.font      = Font(bold=True, color="FFFFFF", size=11)
    cell.fill      = fill
    cell.alignment = Alignment(horizontal="center")

# Data rows
data = [
    ("Widget Pro",  1250, 87500.00, 12.4),
    ("Widget Lite",  890, 35600.00,  8.2),
    ("Widget Max",   420, 63000.00, 24.7),
]
for row in data:
    ws.append(row)

# Auto-fit column widths
for col in ws.columns:
    max_w = max(len(str(c.value or "")) for c in col) + 3
    ws.column_dimensions[col[0].column_letter].width = max_w

wb.save("sales_report.xlsx")
print("Excel report generated: sales_report.xlsx")`}
            />

            {/* ── DATABASES ────────────────────────── */}
            <h2 id="databases">Databases</h2>
            <p>
              Automation often needs to persist state between runs — track which items have been processed, accumulate results over time, or look up reference data. Python&apos;s database libraries span from the built-in SQLite to enterprise ORMs.
            </p>

            <h3>sqlite3 — Zero-Config Persistent Storage</h3>
            <p>
              <code>sqlite3</code> is in Python&apos;s standard library and requires no server. The entire database is a single file. For automation jobs that run on a single machine and need to track state, SQLite is the simplest possible persistent layer.
            </p>
            <CodeBlock
              filename="sqlite_tracker.py"
              note="Use SQLite to track which items have already been processed"
              code={`import sqlite3
from datetime import datetime

conn = sqlite3.connect("automation.db")
conn.execute("""
    CREATE TABLE IF NOT EXISTS processed_items (
        id      INTEGER PRIMARY KEY,
        item_id TEXT UNIQUE,
        status  TEXT,
        ts      TEXT
    )
""")
conn.commit()

def mark_done(item_id: str, status: str = "ok"):
    conn.execute(
        "INSERT OR REPLACE INTO processed_items (item_id, status, ts) VALUES (?,?,?)",
        (item_id, status, datetime.now().isoformat()),
    )
    conn.commit()

def already_done(item_id: str) -> bool:
    row = conn.execute(
        "SELECT 1 FROM processed_items WHERE item_id=? AND status='ok'", (item_id,)
    ).fetchone()
    return row is not None

# In your automation loop:
items = ["article_001", "article_002", "article_003"]
for item in items:
    if already_done(item):
        print(f"  Skip: {item} already processed")
        continue
    # ... do work ...
    mark_done(item)
    print(f"  Done: {item}")`}
            />

            {/* ── ASYNC ────────────────────────────── */}
            <h2 id="async-concurrency">Async & Concurrency</h2>
            <p>
              Sequential code is fine for a single task. But real automation often needs to do many things at once: fetch 50 API endpoints simultaneously, process files in parallel, or handle incoming webhook events without blocking. Python offers three concurrency models.
            </p>

            <FadeIn>
              <div className="not-prose grid sm:grid-cols-3 gap-3 my-6">
                {[
                  { title: "asyncio", sub: "I/O-bound tasks", desc: "Fetch 50 APIs in the time it would take to fetch one. Perfect for anything that waits on network or disk.", col: "#6366f1" },
                  { title: "threading", sub: "Concurrent I/O", desc: "Multiple threads share one CPU. Good for I/O-bound work when asyncio isn't an option (e.g., blocking SDKs).", col: "#3b82f6" },
                  { title: "multiprocessing", sub: "CPU-bound tasks", desc: "Parallel processes bypass Python's GIL. Use for image processing, data crunching, or heavy computation.", col: "#8b5cf6" },
                ].map(({ title, sub, desc, col }) => (
                  <div key={title} className="glass rounded-xl p-4">
                    <div className="font-semibold text-white text-sm mb-0.5">{title}</div>
                    <div className="mono text-[10px] mb-2" style={{ color: col }}>{sub}</div>
                    <p className="text-xs text-slate-400 leading-relaxed m-0">{desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <CodeBlock
              filename="async_fetch.py"
              note="Fetch 50 API endpoints simultaneously with asyncio + aiohttp"
              code={`import asyncio
import aiohttp
import time

async def fetch_user(session: aiohttp.ClientSession, uid: int) -> dict:
    url = f"https://jsonplaceholder.typicode.com/users/{uid}"
    async with session.get(url) as resp:
        return await resp.json()

async def fetch_all(uids: list[int]) -> list[dict]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_user(session, uid) for uid in uids]
        return await asyncio.gather(*tasks)  # all at once

# Sequential would take ~15s (50 × 300ms each)
# Async takes ~300ms total — all requests in flight simultaneously
t0 = time.perf_counter()
users = asyncio.run(fetch_all(range(1, 51)))
elapsed = time.perf_counter() - t0

print(f"Fetched {len(users)} users in {elapsed:.2f}s")
for u in users[:3]:
    print(f"  {u['name']:25} | {u['email']}")`}
            />

            {/* ── AI AUTOMATION ────────────────────── */}
            <h2 id="ai-automation">AI Automation</h2>
            <p>
              The most significant shift in automation over the last two years is the arrival of large language models as first-class automation components. Python is the primary language for every major AI SDK, which means AI-powered automation is now a Python-native capability.
            </p>

            <FadeIn>
              <div className="glass rounded-2xl relative overflow-hidden my-8 not-prose">
                <div className="absolute inset-0 grid-bg opacity-10" />
                <div className="relative" style={{ height: 280 }}>
                  <NeuralCanvas />
                </div>
                <p className="text-xs text-center text-slate-500 mono pb-4 px-4 relative">Neural network: pulses travel between nodes like prompts flowing through an LLM agent. Move mouse to rotate.</p>
              </div>
            </FadeIn>

            <h3>openai — Intelligent Task Processing</h3>
            <p>
              The OpenAI Python SDK gives you GPT-4o, DALL-E, Whisper, and embeddings from a clean API. For automation, the most powerful use case is <em>structured output</em>: pass a list of support tickets, emails, or invoices to a model and get back categorised, summarised, or scored JSON — tasks that would otherwise require hand-coded heuristics.
            </p>
            <CodeBlock
              filename="openai_triage.py"
              note="Auto-triage support tickets with GPT-4o structured output"
              code={`from openai import OpenAI
import json

client = OpenAI()   # reads OPENAI_API_KEY from environment

def triage_tickets(tickets: list[str]) -> list[dict]:
    prompt = f"""Triage each support ticket.

Category options: bug, feature_request, billing, question, spam
Urgency:          high, medium, low

Return JSON: {{"tickets": [{{"original": "...", "category": "...", "urgency": "...", "action": "..."}}]}}

Tickets:
{json.dumps(tickets, indent=2)}"""

    resp = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)["tickets"]

tickets = [
    "App crashes when uploading files over 10 MB",
    "Please add dark mode",
    "My invoice for June shows the wrong amount",
]
for t in triage_tickets(tickets):
    print(f"[{t['urgency'].upper():6}] {t['category']:20} → {t['action']}")`}
            />

            <h3>LangChain — AI Agents with Tools</h3>
            <p>
              LangChain goes beyond single API calls. It lets you build <em>agents</em>: AI systems that choose which tools to use, call them, observe the results, and reason about the next step. An agent can search the web, save files, query databases, and call APIs — all orchestrated by a language model in a single Python script.
            </p>
            <CodeBlock
              filename="langchain_agent.py"
              note="Research automation agent that searches and saves findings"
              code={`from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from langchain.tools import tool
import requests

@tool
def search_news(query: str) -> str:
    """Search Hacker News for the latest stories on a topic."""
    r = requests.get(
        f"https://hn.algolia.com/api/v1/search?query={query}&hitsPerPage=5"
    )
    hits = r.json()["hits"]
    return "\\n".join(f"• {h['title']} — {h.get('url','')}" for h in hits)

@tool
def save_report(filename: str, content: str) -> str:
    """Save a text report to disk."""
    with open(filename, "w") as f:
        f.write(content)
    return f"Saved {len(content):,} chars to {filename}"

llm   = ChatOpenAI(model="gpt-4o", temperature=0)
tools = [search_news, save_report]
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a research automation agent. Use tools to gather and save information."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])
executor = AgentExecutor(
    agent=create_tool_calling_agent(llm, tools, prompt),
    tools=tools, verbose=True,
)

executor.invoke({
    "input": "Research Python automation trends in 2026 and save a summary to python_trends.txt"
})`}
            />

            {/* ── COMPLETE PIPELINE ────────────────── */}
            <h2 id="complete-pipeline">Complete Pipeline</h2>
            <p>
              Everything above comes together in a production-grade automation pipeline. This example runs every six hours: it fetches the top articles from two RSS feeds concurrently, summarises each one with GPT-4o-mini, stores the results in SQLite, and posts a digest to Slack — in under 90 lines.
            </p>

            <blockquote>
              <Quote className="w-5 h-5 text-indigo-400 mb-2" />
              This is the architecture that separates a script from a system. Every component is independently testable, every failure is logged, and the whole thing runs on a timer without anyone touching it.
            </blockquote>

            <CodeBlock
              filename="pipeline.py"
              note="Full automation: RSS → AI summary → SQLite → Slack digest (runs every 6 hours)"
              code={`"""
Full automation pipeline:
  RSS feeds → AI summaries → SQLite DB → Slack digest
"""
import asyncio, sqlite3, schedule, time, json
import aiohttp
from openai import OpenAI
from bs4 import BeautifulSoup
from datetime import datetime
import requests as req

client = OpenAI()
DB = sqlite3.connect("digest.db", check_same_thread=False)
DB.execute("""CREATE TABLE IF NOT EXISTS articles
    (id INTEGER PRIMARY KEY, title TEXT, summary TEXT, url TEXT, ts TEXT)""")

FEEDS        = ["https://hnrss.org/frontpage", "https://feeds.feedburner.com/PythonInsider"]
SLACK_HOOK   = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Step 1 — Fetch articles from multiple feeds concurrently
async def fetch_feed(session, url):
    async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as r:
        soup = BeautifulSoup(await r.text(), "xml")
    return [{"title": i.title.text.strip(), "url": i.link.text.strip()}
            for i in soup.find_all("item")[:8]]

async def fetch_all():
    async with aiohttp.ClientSession() as s:
        results = await asyncio.gather(*[fetch_feed(s, u) for u in FEEDS])
    return [item for feed in results for item in feed]

# Step 2 — Summarise with AI
def summarise(title: str) -> str:
    r = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Summarise in one sentence: {title}"}],
    )
    return r.choices[0].message.content.strip()

# Step 3 — Persist to SQLite
def save(title: str, summary: str, url: str):
    DB.execute("INSERT INTO articles (title,summary,url,ts) VALUES (?,?,?,?)",
               (title, summary, url, datetime.now().isoformat()))
    DB.commit()

# Step 4 — Post Slack digest
def send_digest():
    rows = DB.execute(
        "SELECT title,summary,url FROM articles ORDER BY id DESC LIMIT 5"
    ).fetchall()
    text = "*Python Automation Digest*\\n\\n"
    for title, summary, url in rows:
        text += f"*{title}*\\n{summary}\\n<{url}|Read more>\\n\\n"
    req.post(SLACK_HOOK, json={"text": text}, timeout=5)

# Orchestrate all steps
async def run_pipeline():
    print(f"[{datetime.now():%H:%M}] Pipeline running...")
    articles = await fetch_all()
    for art in articles:
        summary = summarise(art["title"])
        save(art["title"], summary, art["url"])
        print(f"  ✓ {art['title'][:55]}...")
    send_digest()
    print(f"  Digest sent — {len(articles)} articles processed.")

schedule.every(6).hours.do(lambda: asyncio.run(run_pipeline()))
asyncio.run(run_pipeline())   # run immediately on start

while True:
    schedule.run_pending()
    time.sleep(60)`}
            />

            <Callout color="#10b981" icon={CircleCheck}>
              This pipeline uses <strong>6 libraries</strong> from this guide together: aiohttp (async HTTP), BeautifulSoup (HTML parsing), OpenAI (AI summaries), sqlite3 (persistence), requests (Slack webhook), and schedule (recurring timer). Real automation is composition.
            </Callout>

            {/* ── FAQ ──────────────────────────────── */}
            <h2 id="faq">Frequently Asked Questions</h2>
            <div className="not-prose space-y-3">
              {[
                ["Is Python fast enough for production automation?",
                 "For I/O-bound automation — web scraping, API calls, file operations, database queries — Python is fast enough. The bottleneck is almost always the network or disk, not the language. For CPU-bound tasks like image processing or number crunching, use multiprocessing or offload to a compiled library like NumPy, which runs at C speed under the hood."],
                ["Do I need to learn asyncio to automate tasks?",
                 "No. Most automation tasks work fine with synchronous code. You only need asyncio when you want to do many things at the same time — like fetching 50 API endpoints simultaneously. If you are just running one job sequentially, synchronous requests and a for loop are perfectly appropriate."],
                ["How do I run my Python automation on a schedule without leaving my laptop on?",
                 "Deploy it to a cloud VM (DigitalOcean, AWS EC2, or a free-tier VPS) and use the system cron or the schedule library to trigger it. Alternatively, use a serverless platform (AWS Lambda, Google Cloud Functions) for event-based automation that only runs when needed."],
                ["What is the difference between Selenium and Playwright?",
                 "Both automate real browsers. Selenium is older, has more tutorials and Stack Overflow answers, and works with every language. Playwright is newer, async-first, and better at handling modern JavaScript-heavy sites. If you are starting fresh, Playwright is the better choice. If you are maintaining existing Selenium code, there is no rush to migrate."],
                ["Is Python good for automating AI workflows?",
                 "Python is the primary language of the AI ecosystem. OpenAI, Anthropic, Hugging Face, LangChain, LlamaIndex, and virtually every other AI framework ships its Python SDK first. If you want to build automated pipelines that use LLMs, embeddings, or local models, Python is not just good — it is the obvious choice."],
                ["How do I handle credentials and API keys securely in automation scripts?",
                 "Never hardcode secrets in your code. Use environment variables (os.environ.get) and a .env file with a library like python-dotenv for local development. In production, use a secrets manager (AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault). Always add .env to your .gitignore."],
              ].map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}
            </div>

            {/* ── CONCLUSION ───────────────────────── */}
            <h2 id="where-next">Where to Go Next</h2>
            <p>
              You now have a complete map of Python automation: the conceptual architecture, the essential libraries from file system to AI, production code patterns, and the composition principle that turns individual scripts into reliable systems.
            </p>
            <p>
              The best next move is to pick one real problem you face today — a daily report you generate manually, a file-cleanup task you do every week, an API you check by hand — and build the simplest Python solution that solves it. Then add scheduling, logging, and error handling until it runs itself. Repeat for the next problem. That loop, applied consistently, is how automation compounds into infrastructure.
            </p>

            <FadeIn>
              <div className="not-prose grid sm:grid-cols-2 gap-3 mt-8">
                {[
                  { slug: "production-ai-content-api", cat: "Engineering", title: "Building a production AI content API" },
                  { slug: "rag-chatbots-that-help",    cat: "AI Agents",   title: "RAG chatbots that actually help" },
                  { slug: "n8n-llms-freelancer-edge",  cat: "Workflow",    title: "n8n + LLMs: the freelancer's edge" },
                  { slug: "algo-trading-meets-automation", cat: "Trading", title: "Algorithmic trading meets automation" },
                ].map((p) => (
                  <button key={p.slug} onClick={() => openArticle(p.slug)}
                    className="glass glass-hover rounded-xl p-4 text-left" data-cursor>
                    <div className="mono text-[11px] text-indigo-300/70">{p.cat}</div>
                    <div className="text-white font-medium text-sm mt-1">{p.title}</div>
                    <div className="text-indigo-300 text-xs mono mt-2 flex items-center gap-1">
                      Read article <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* ── AUTHOR ───────────────────────────── */}
            <div className="glass rounded-2xl p-6 mt-12 flex items-start gap-4 not-prose">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>RN</div>
              <div>
                <div className="text-white font-semibold">Rehan Nazir</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  AI Engineer &amp; Automation Specialist. Building intelligent, self-running systems under the Nexara brand. Python automation is the foundation of everything I build.
                </p>
                <div className="flex gap-2 mt-3">
                  {[
                    ["https://www.linkedin.com/in/rehan-nazir-530597332", Link],
                    ["https://github.com/rehaannazir", GitFork],
                    ["mailto:rehaan689nazir@gmail.com", Mail],
                  ].map(([href, Icon], i) => (
                    <a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="w-9 h-9 rounded-lg glass glass-hover flex items-center justify-center text-slate-300 hover:text-white"
                      data-cursor>
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>{/* prose-blog */}
        </div>{/* grid */}
      </div>{/* max-w-6xl */}
    </article>
  );
}
