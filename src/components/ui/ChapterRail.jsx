import { useEffect, useState } from "react";
import { isCoarse, smoothTo } from "@/lib/motion";

/* ChapterRail — a quiet narrative spine: dots track the story (Intro → About → Stack → Work → Talk),
   the active chapter glows, and clicking glides there. The story, made navigable. */
export function ChapterRail() {
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
            <span className="mono text-[10px] uppercase tracking-wider transition-all duration-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0" style={{ color: on ? "#c7d2fe" : "#94a3b8" }}>{label}</span>
            <span className="rounded-full transition-all duration-500" style={{ width: on ? 22 : 8, height: 8, background: on ? "linear-gradient(90deg,#3b82f6,#8b5cf6)" : "rgba(255,255,255,0.22)", boxShadow: on ? "0 0 12px rgba(99,102,241,0.8)" : "none" }} />
          </button>
        );
      })}
    </nav>
  );
}
