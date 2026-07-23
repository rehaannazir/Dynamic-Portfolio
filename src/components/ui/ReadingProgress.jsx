import { useEffect, useRef } from "react";

export function ReadingProgress() {
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
