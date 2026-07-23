import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/motion";

/* ===================== CUSTOM GLOWING CURSOR ===================== */
export function CustomCursor() {
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
