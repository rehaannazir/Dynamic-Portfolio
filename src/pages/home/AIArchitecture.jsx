import { useEffect, useRef, useState } from "react";
import { detectCapable } from "@/lib/motion";

/* ============================================================
   AIArchitecture — the signature moment.
   A scroll-pinned 3D system that assembles itself: stages
   materialize one by one, connectors draw between them, and
   data packets flow through completed links. GSAP ScrollTrigger
   pins the stage and scrubs a 0→1 progress that drives the
   whole build; Three.js renders it.

   Capable desktops get the WebGL experience; everything else
   (mobile / reduced-motion / no-WebGL / low-power) falls back
   to the existing DOM pipeline passed in as `fallback`.
   ============================================================ */

const STAGES = [
  { label: "Python",     sub: "foundation",    c: 0x60a5fa },
  { label: "FastAPI",    sub: "backend",       c: 0x6366f1 },
  { label: "Automation",   sub: "recursive tasks",     c: 0x818cf8 },
  { label: "RAG", sub: "", c: 0x8b5cf6 },
  { label: "LANGRAPH",      sub: "Multi Agents",         c: 0xa855f7 },
  { label: "LLM Integration",     sub: "brain",       c: 0xc084fc },
];

/* This is a SECOND WebGL context (the hero is the first), so it's gated to genuinely high-end
   machines only (detectCapable, shared with pages/Home.jsx via lib/motion.jsx). Mid-range /
   older devices, touch, and reduced-motion get the lightweight DOM pipeline fallback instead —
   no extra GPU context, no jank. */

const smooth = (e) => { e = Math.max(0, Math.min(1, e)); return e * e * (3 - 2 * e); };

function makeGlow(THREE) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const g = cv.getContext("2d");
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,0.95)");
  grd.addColorStop(0.25, "rgba(170,150,255,0.5)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function AIArchitecture({ fallback = null }) {
  const [ok] = useState(detectCapable);
  const stageRef = useRef(null);
  const mountRef = useRef(null);
  const labelRefs = useRef([]);
  const hudRef = useRef(null);
  // Same interaction-gate HeroWebGL uses for its own "three" import: this component shares
  // the exact same vendor-three chunk. Without this gate, mounting AIArchitecture immediately
  // fires that 743KB import regardless of user interaction, silently defeating HeroWebGL's
  // deferral for the same capable-desktop visitors and pulling the parse back into TBT.
  const [deferred, setDeferred] = useState(false);
  useEffect(() => {
    if (!ok) return;
    let cancelled = false, timerId = 0;
    const trigger = () => {
      if (cancelled) return;
      window.removeEventListener("pointerdown", trigger);
      window.removeEventListener("keydown", trigger);
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("touchstart", trigger);
      clearTimeout(timerId);
      setDeferred(true);
    };
    window.addEventListener("pointerdown", trigger);
    window.addEventListener("keydown", trigger);
    window.addEventListener("scroll", trigger, { passive: true });
    window.addEventListener("touchstart", trigger, { passive: true });
    timerId = setTimeout(trigger, 8000);
    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", trigger);
      window.removeEventListener("keydown", trigger);
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("touchstart", trigger);
      clearTimeout(timerId);
    };
  }, [ok]);

  useEffect(() => {
    if (!ok || !deferred) return;
    const stage = stageRef.current, mount = mountRef.current;
    if (!stage || !mount) return;
    let disposed = false, cleanup = () => {};
    Promise.all([import("three"), import("gsap"), import("gsap/ScrollTrigger")])
      .then(([THREE, gm, sm]) => {
        if (disposed) return;
        const gsap = gm.gsap || gm.default;
        const ScrollTrigger = sm.ScrollTrigger || sm.default;
        gsap.registerPlugin(ScrollTrigger);
        cleanup = build(THREE, gsap, ScrollTrigger);
      })
      .catch(() => {});

    function build(THREE, gsap, ScrollTrigger) {
      let width = mount.clientWidth || 1, height = mount.clientHeight || 1;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x05050b, 0.028);
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.set(0, 0.5, 9);

      const N = STAGES.length;
      const nodes = STAGES.map((s, i) => {
        const x = (i - (N - 1) / 2) * 2.05;
        const y = Math.sin(i * 0.9) * 0.5;
        const z = i % 2 ? -0.6 : 0.4;
        return { ...s, pos: new THREE.Vector3(x, y, z) };
      });

      const glowTex = makeGlow(THREE);
      const group = new THREE.Group();
      scene.add(group);

      const ambient = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x6366f1, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
      ambient.scale.set(16, 9, 1);
      ambient.position.set(0, 0, -3);
      scene.add(ambient);

      const icoGeo = new THREE.IcosahedronGeometry(0.5, 0);
      const edgeGeo = new THREE.EdgesGeometry(icoGeo);
      const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);

      const nodeObjs = nodes.map((n) => {
        const g = new THREE.Group();
        g.position.copy(n.pos);
        const col = new THREE.Color(n.c);
        const wire = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }));
        const core = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0 }));
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
        glow.scale.set(2.4, 2.4, 1);
        g.add(glow, wire, core);
        g.scale.setScalar(0.001);
        group.add(g);
        return { g, wire, core, glow };
      });

      const conns = [];
      for (let i = 0; i < N - 1; i++) {
        const geo = new THREE.BufferGeometry().setFromPoints([nodes[i].pos.clone(), nodes[i].pos.clone()]);
        const mat = new THREE.LineBasicMaterial({ color: 0x93a4ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
        const line = new THREE.Line(geo, mat);
        group.add(line);
        const packet = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xe0dbff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
        packet.scale.set(0.5, 0.5, 1);
        group.add(packet);
        conns.push({ geo, mat, line, packet, a: nodes[i].pos, b: nodes[i + 1].pos });
      }

      /* ---- scroll: pin the stage, scrub a 0→1 build progress ---- */
      let targetP = 0;
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => { targetP = self.progress; },
        });
      }, stage);

      const onResize = () => {
        width = mount.clientWidth || 1;
        height = mount.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", onResize);

      const tmp = new THREE.Vector3();
      const step = 0.86 / N;
      const FRAME_MS = 1000 / 32; // half-rate cap — ambient build animation
      let raf = 0, running = false, last = performance.now(), tsec = 0, pLerp = 0, slow = 0, qStep = 0;
      const start = () => { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); };
      const stop = () => { if (!running) return; running = false; cancelAnimationFrame(raf); };

      // fully start/stop the loop with viewport visibility + tab visibility — no idle rendering
      let onscreen = false;
      const sync = () => { if (onscreen && !document.hidden) start(); else stop(); };
      const io = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; sync(); }, { threshold: 0 });
      io.observe(stage);
      const onVis = () => sync();
      document.addEventListener("visibilitychange", onVis);

      const frame = (now) => {
        if (!running) return;
        raf = requestAnimationFrame(frame);
        if (now - last < FRAME_MS) return; // half-rate cap
        const dt = Math.min(now - last, 50);
        last = now;

        if (qStep === 0) { if (dt > 40) slow++; else slow = Math.max(0, slow - 1); if (slow > 40) { dpr = Math.min(dpr, 1.2); renderer.setPixelRatio(dpr); qStep = 1; slow = 0; } }

        tsec += dt * 0.001;
        pLerp += (targetP - pLerp) * 0.12;
        const p = pLerp;
        const done = smooth((p - 0.86) / 0.14);
        ambient.material.opacity = 0.05 + done * 0.22;

        nodeObjs.forEach((no, i) => {
          const appear = smooth((p - i * step) / (step * 0.9));
          no.g.scale.setScalar(Math.max(0.001, appear));
          no.wire.rotation.y += 0.01 * appear;
          no.wire.rotation.x += 0.004 * appear;
          no.wire.material.opacity = 0.9 * appear;
          no.core.material.opacity = appear;
          no.glow.material.opacity = appear * (0.45 + done * 0.4);
        });

        conns.forEach((c, i) => {
          const draw = smooth((p - (i + 0.6) * step) / (step * 0.8));
          tmp.copy(c.a).lerp(c.b, draw);
          const arr = c.geo.attributes.position.array;
          arr[0] = c.a.x; arr[1] = c.a.y; arr[2] = c.a.z;
          arr[3] = tmp.x; arr[4] = tmp.y; arr[5] = tmp.z;
          c.geo.attributes.position.needsUpdate = true;
          c.mat.opacity = 0.5 * draw;
          if (draw > 0.99) {
            const f = (tsec * 0.42 + i * 0.22) % 1;
            c.packet.position.copy(c.a).lerp(c.b, f);
            c.packet.material.opacity = 0.9 * Math.sin(f * Math.PI);
          } else {
            c.packet.material.opacity = 0;
          }
        });

        group.rotation.y = (p - 0.5) * 0.22;
        camera.position.z += ((9 + smooth(p) * 3.2) - camera.position.z) * 0.05;
        camera.position.y += ((0.5 - p * 0.4) - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);

        for (let i = 0; i < N; i++) {
          const el = labelRefs.current[i];
          if (!el) continue;
          tmp.copy(nodes[i].pos).applyMatrix4(group.matrixWorld).project(camera);
          const sx = (tmp.x * 0.5 + 0.5) * width;
          const sy = (-tmp.y * 0.5 + 0.5) * height;
          const appear = smooth((p - i * step) / (step * 0.9));
          el.style.transform = `translate(-50%,-50%) translate(${sx.toFixed(1)}px, ${(sy + 56).toFixed(1)}px)`;
          el.style.opacity = (tmp.z < 1 ? appear : 0).toFixed(3);
        }

        if (hudRef.current) hudRef.current.style.width = (p * 100).toFixed(1) + "%";
      };
      sync(); // start only if already onscreen

      return () => {
        stop();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("resize", onResize);
        ctx.revert(); // kills the ScrollTrigger + reverts pin spacing before React unmounts
        nodeObjs.forEach((no) => { no.wire.material.dispose(); no.core.material.dispose(); no.glow.material.dispose(); });
        conns.forEach((c) => { c.geo.dispose(); c.mat.dispose(); c.packet.material.dispose(); });
        edgeGeo.dispose(); icoGeo.dispose(); sphereGeo.dispose();
        ambient.material.dispose(); glowTex.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    }

    return () => { disposed = true; cleanup(); };
  }, [ok, deferred]);

  if (!ok) return <div>{fallback}</div>;

  return (
    <div>
      <div ref={stageRef} className="relative h-screen overflow-hidden flex items-center justify-center" style={{ contain: "layout style" }}>
        <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none">
          {STAGES.map((s, i) => (
            <div key={s.label} ref={(el) => (labelRefs.current[i] = el)} className="absolute top-0 left-0 text-center select-none" style={{ opacity: 0, willChange: "transform, opacity" }}>
              <div className="text-white text-sm font-semibold leading-none">{s.label}</div>
              <div className="mono text-[9px] uppercase tracking-wider text-slate-400 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="absolute left-0 right-0 bottom-10 flex flex-col items-center gap-3 pointer-events-none px-5">
          <p className="mono text-[10px] uppercase tracking-[0.35em] text-slate-400">loading the weapons</p>
          <div className="w-40 h-px bg-white/10 overflow-hidden rounded-full">
            <div ref={hudRef} className="h-full" style={{ width: "0%", background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", boxShadow: "0 0 10px rgba(99,102,241,0.7)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
