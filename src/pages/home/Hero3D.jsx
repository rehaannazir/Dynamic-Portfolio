import { useEffect, useRef } from "react";

/* ===================== HERO 3D CANVAS ===================== */
/* Lightweight 2D-canvas fallback shown while the WebGL HeroWebGL chunk loads (or in place of it
   on devices that can't run WebGL comfortably). */
export function Hero3D() {
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
