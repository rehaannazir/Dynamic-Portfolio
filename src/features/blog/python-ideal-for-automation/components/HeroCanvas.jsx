import { memo, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   THREE.JS – HERO PARTICLE CANVAS
───────────────────────────────────────────────────────── */
export const HeroCanvas = memo(function HeroCanvas() {
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
});
