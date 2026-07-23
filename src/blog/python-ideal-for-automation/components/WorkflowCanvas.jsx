import { memo, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   THREE.JS – WORKFLOW NETWORK
───────────────────────────────────────────────────────── */
export const WorkflowCanvas = memo(function WorkflowCanvas() {
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
});
