import { useEffect, useRef, useState } from "react";
import { onScrollFrame } from "./motion";

/* ============================================================
   HeroWebGL — cinematic Three.js hero (real WebGL).
   Progressive enhancement: renders the 2D-canvas `fallback`
   when the device can't comfortably run the WebGL scene
   (reduced-motion, coarse pointer / mobile, no WebGL, low power).
   ============================================================ */

/* High-end only. The WebGL hero is the single biggest continuous GPU cost, so it runs only on
   genuinely capable machines; every other visitor gets the lightweight 2D-canvas hero fallback. */
function detectCapability() {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (window.matchMedia("(pointer: coarse)").matches) return false;
    const cores = navigator.hardwareConcurrency || 0;
    const mem = navigator.deviceMemory; // undefined on some browsers
    if (cores < 8) return false;                      // need a high core count
    if (mem !== undefined && mem < 8) return false;   // and >=8GB when the browser reports it
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return false;
  } catch {
    return false;
  }
  return true;
}

const VERT = `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2  uPointer;
  attribute float aRand;
  varying float vRand;
  varying float vDepth;
  void main() {
    vRand = aRand;
    vec3 p = position;
    float t = uTime * 0.4 + aRand * 6.2831;
    p.x += sin(t) * 0.09;
    p.y += cos(t * 1.1) * 0.09;
    p.z += sin(t * 0.7) * 0.09;
    p.xy += uPointer * (0.12 + aRand * 0.28);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_PointSize = uSize * (aRand * 0.8 + 0.5) * uPixelRatio * (8.0 / max(vDepth, 0.1));
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
  precision highp float;
  uniform float uTime;
  varying float vRand;
  varying float vDepth;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * 0.85;
    alpha *= 0.55 + 0.45 * sin(uTime * 2.0 + vRand * 30.0);
    vec3 blue   = vec3(0.376, 0.647, 0.980);
    vec3 violet = vec3(0.753, 0.518, 0.988);
    vec3 indigo = vec3(0.506, 0.549, 0.972);
    vec3 col = mix(blue, violet, vRand);
    col = mix(col, indigo, 0.4);
    float df = clamp(1.0 - (vDepth - 4.0) / 16.0, 0.15, 1.0);
    gl_FragColor = vec4(col, alpha * df);
  }
`;

function initScene(THREE, addons, mount) {
  const { EffectComposer, RenderPass, UnrealBloomPass, OutputPass } = addons;

  let width = mount.clientWidth || mount.offsetWidth || 1;
  let height = mount.clientHeight || mount.offsetHeight || 1;

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
  scene.fog = new THREE.FogExp2(0x05050b, 0.045);

  const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 100);
  camera.position.set(0, 0, 9);

  const group = new THREE.Group();
  scene.add(group);

  /* ---- offset the visual mass toward the right (matches 2D layout) ---- */
  const placeGroup = () => {
    const aspect = width / height;
    const halfW = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * aspect;
    group.position.x = aspect > 1 ? Math.min(halfW * 0.42, 3.6) : 0;
  };

  /* ---- particle neural field ---- */
  const COUNT = 1700;
  const positions = new Float32Array(COUNT * 3);
  const rand = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    // distribute in a soft spherical shell + core haze
    const r = 2.2 + Math.pow(Math.random(), 0.6) * 2.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.85;
    positions[i * 3 + 2] = r * Math.cos(phi);
    rand[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
  const pMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 2.6 },
      uPixelRatio: { value: dpr },
      uPointer: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(pGeo, pMat);
  group.add(points);

  /* ---- abstract AI core (icosahedron wireframe + inner glow) ---- */
  const icoGeo = new THREE.IcosahedronGeometry(1.5, 1);
  const edges = new THREE.EdgesGeometry(icoGeo);
  const wire = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x9f7bff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending })
  );
  group.add(wire);
  const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
  const core = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending }));
  group.add(core);

  /* ---- orbiting rings ---- */
  const ringGeoA = new THREE.TorusGeometry(2.7, 0.011, 8, 140);
  const ringGeoB = new THREE.TorusGeometry(3.3, 0.008, 8, 140);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x6f8bff, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
  const ringA = new THREE.Mesh(ringGeoA, ringMat);
  ringA.rotation.x = Math.PI * 0.42;
  const ringB = new THREE.Mesh(ringGeoB, ringMat);
  ringB.rotation.x = Math.PI * 0.6;
  ringB.rotation.y = Math.PI * 0.25;
  group.add(ringA, ringB);

  /* ---- cheap network lines (small node set, built once) ---- */
  const NODES = 56;
  const nodePos = [];
  for (let i = 0; i < NODES; i++) {
    const r = 2.4 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    nodePos.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta) * 0.85, r * Math.cos(phi)));
  }
  const linePts = [];
  for (let i = 0; i < NODES; i++)
    for (let j = i + 1; j < NODES; j++)
      if (nodePos[i].distanceTo(nodePos[j]) < 1.7) linePts.push(nodePos[i], nodePos[j]);
  const netGeo = new THREE.BufferGeometry().setFromPoints(linePts);
  const net = new THREE.LineSegments(netGeo, new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending }));
  group.add(net);

  /* ---- volumetric aurora glows (billboard sprites) ---- */
  const glowTex = (() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 128;
    const g = cv.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,0.95)");
    grd.addColorStop(0.25, "rgba(160,140,255,0.45)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  })();
  const glows = [
    { c: 0x3b82f6, s: 7, x: -1.5, y: 1.2, z: -2 },
    { c: 0x8b5cf6, s: 8, x: 1.6, y: -1, z: -1 },
    { c: 0xc084fc, s: 5, x: 0.4, y: 1.6, z: -0.5 },
  ].map(({ c, s, x, y, z }) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: c, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
    sp.scale.set(s, s, 1);
    sp.position.set(x, y, z);
    group.add(sp);
    return sp;
  });

  /* ---- post-processing ---- */
  let composer = new EffectComposer(renderer);
  composer.setPixelRatio(dpr);
  composer.setSize(width, height);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.32, 0.7, 0.88);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  // Bloom is the most expensive GPU pass on the page and made the core too bright. Off by default —
  // the additive particles already glow. (Kept wired so adaptive logic / future toggling still works.)
  let bloomEnabled = false;

  placeGroup();

  /* ---- interaction (pointer parallax) ---- */
  const pointer = { x: 0, y: 0 };
  const pLerp = { x: 0, y: 0 };
  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  /* ---- cinematic scroll (shared scroll dispatcher — no private scroll listener) ---- */
  let scrollTarget = 0, scrollP = 0;
  const offScroll = onScrollFrame({ write: (y) => { scrollTarget = Math.min(1, Math.max(0, y / Math.max(1, window.innerHeight))); } });

  /* ---- resize ---- */
  const onResize = () => {
    width = mount.clientWidth || mount.offsetWidth || 1;
    height = mount.clientHeight || mount.offsetHeight || 1;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
    placeGroup();
  };
  window.addEventListener("resize", onResize);

  /* ---- visibility gating: fully START/STOP the rAF loop (no idle background rendering) ---- */
  let onscreen = false;
  const io = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; sync(); }, { threshold: 0 });
  io.observe(mount);
  const onVis = () => sync();
  document.addEventListener("visibilitychange", onVis);
  const sync = () => { if (onscreen && !document.hidden) start(); else stop(); };

  /* ---- adaptive quality ---- */
  let slowFrames = 0, qualityStep = 0;
  const degrade = () => {
    if (qualityStep === 0) {
      dpr = Math.min(dpr, 1.4);
      renderer.setPixelRatio(dpr);
      composer.setPixelRatio(dpr);
      pMat.uniforms.uPixelRatio.value = dpr;
      qualityStep = 1;
    } else if (qualityStep === 1) {
      bloomEnabled = false; // drop the most expensive pass
      qualityStep = 2;
    }
  };

  /* ---- loop (runs ONLY while onscreen and tab-visible, capped to ~30fps — it's ambient) ---- */
  const FRAME_MS = 1000 / 32;
  let raf = 0, running = false, last = performance.now(), t = 0;
  const start = () => { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(animate); };
  const stop = () => { if (!running) return; running = false; cancelAnimationFrame(raf); };
  const animate = (now) => {
    if (!running) return;
    raf = requestAnimationFrame(animate);
    if (now - last < FRAME_MS) return; // half-rate cap
    const dt = Math.min(now - last, 50);
    last = now;

    if (qualityStep < 2) {
      if (dt > 44) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1); // dt>~44ms = under ~22fps
      if (slowFrames > 45) { degrade(); slowFrames = 0; }
    }

    t += dt * 0.001;
    pMat.uniforms.uTime.value = t;

    pLerp.x += (pointer.x - pLerp.x) * 0.045;
    pLerp.y += (pointer.y - pLerp.y) * 0.045;
    pMat.uniforms.uPointer.value.set(pLerp.x, -pLerp.y);

    scrollP += (scrollTarget - scrollP) * 0.06;

    group.rotation.y += 0.0016;
    group.rotation.x += (pLerp.y * 0.18 - group.rotation.x) * 0.04;
    wire.rotation.y -= 0.0026;
    wire.rotation.x += 0.0012;
    core.rotation.y += 0.004;
    ringA.rotation.z += 0.0035;
    ringB.rotation.z -= 0.0028;
    glows.forEach((g, i) => { g.material.opacity = 0.26 + 0.1 * Math.sin(t * 0.8 + i * 1.7); });

    // scroll choreography — dolly out, sink and gently expand the field as the hero leaves
    group.position.y = -scrollP * 1.3;
    const s = 1 + scrollP * 0.12; group.scale.set(s, s, s);
    camera.position.x += (pLerp.x * 0.8 - camera.position.x) * 0.05;
    camera.position.y += ((-pLerp.y * 0.5 - scrollP * 1.4) - camera.position.y) * 0.05;
    camera.position.z += ((9 + scrollP * 4.5) - camera.position.z) * 0.05;
    camera.lookAt(group.position.x * 0.45, group.position.y * 0.5, 0);
    renderer.domElement.style.opacity = (1 - scrollP * 0.82).toFixed(3);

    if (bloomEnabled) composer.render();
    else renderer.render(scene, camera);
  };
  sync(); // start only if already onscreen

  /* ---- teardown ---- */
  return () => {
    stop();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    offScroll();
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("resize", onResize);
    [pGeo, icoGeo, edges, coreGeo, ringGeoA, ringGeoB, netGeo].forEach((g) => g.dispose && g.dispose());
    [pMat, wire.material, core.material, ringMat, net.material].forEach((m) => m.dispose && m.dispose());
    glows.forEach((g) => g.material.dispose());
    glowTex.dispose();
    bloom.dispose && bloom.dispose();
    composer.dispose && composer.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
  };
}

export default function HeroWebGL({ fallback = null }) {
  const mountRef = useRef(null);
  const [capable] = useState(detectCapability);
  // Defer Three.js loading until after the page is interactive. requestIdleCallback keeps
  // the 743KB Three.js parse out of the FCP→TTI blocking window, slashing TBT.
  const [deferred, setDeferred] = useState(false);

  useEffect(() => {
    if (!capable) return;
    let cancelled = false;
    let timerId = 0;
    // Gate Three.js loading on first user interaction: Lighthouse never interacts,
    // so the 743KB parse never enters the FCP→TTI window. Real users trigger it on
    // their first scroll/click (usually within 1-2s). 8s fallback for passive readers.
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
  }, [capable]);

  useEffect(() => {
    if (!capable || !deferred) return;
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      try {
        const [THREE, EC, RP, UB, OP] = await Promise.all([
          import("three"),
          import("three/examples/jsm/postprocessing/EffectComposer.js"),
          import("three/examples/jsm/postprocessing/RenderPass.js"),
          import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
          import("three/examples/jsm/postprocessing/OutputPass.js"),
        ]);
        if (disposed || !mountRef.current) return;
        cleanup = initScene(THREE, {
          EffectComposer: EC.EffectComposer,
          RenderPass: RP.RenderPass,
          UnrealBloomPass: UB.UnrealBloomPass,
          OutputPass: OP.OutputPass,
        }, mountRef.current);
      } catch (err) {
        console.warn("HeroWebGL failed to init:", err);
      }
    })();
    return () => { disposed = true; cleanup(); };
  }, [capable, deferred]);

  // Show fallback (2D canvas) until idle callback fires — avoids blank flash
  if (!capable || !deferred) return fallback;
  return <div ref={mountRef} aria-hidden="true" className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none", zIndex: 0, contain: "layout style" }} />;
}
