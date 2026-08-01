import { memo, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   THREE.JS – NEURAL BRAIN
───────────────────────────────────────────────────────── */
export const NeuralCanvas = memo(function NeuralCanvas() {
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
});
