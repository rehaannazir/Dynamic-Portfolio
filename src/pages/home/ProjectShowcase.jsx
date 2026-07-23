import { ArrowUpRight } from "lucide-react";
import { useScrub } from "@/lib/motion";
import { BlogVisual } from "@/blog/BlogVisual";

/* ===================== PROJECT SHOWCASE ===================== */
/* Each project is presented as a cinematic product row: an animated architecture/pipeline
   visual (shared BlogVisual language) paired with live metrics. Reveals are scrubbed to
   scroll via GSAP when available, and simply render in place otherwise. */
export function ProjectShowcase({ p, i }) {
  const reversed = i % 2 === 1;
  const ref = useScrub((gsap, ScrollTrigger, el) => {
    const viz = el.querySelector("[data-viz]");
    const copyKids = el.querySelectorAll("[data-copy] > *");
    // One timeline + one ScrollTrigger for the whole row (batched, not per-element).
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 82%", end: "top 40%", scrub: 0.6 } });
    tl.from(viz, { autoAlpha: 0, y: 70, ease: "none" }, 0)
      .from(copyKids, { autoAlpha: 0, y: 36, stagger: 0.08, ease: "none" }, 0.1);
  });
  return (
    <article ref={ref} className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center" data-cursor
      onClick={() => p.link && window.open(p.link, "_blank")} style={p.link ? { cursor: "pointer" } : {}}>
      <div data-viz className={"relative " + (reversed ? "md:order-2" : "")}>
        <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-90 transition-opacity duration-700" style={{ background: `radial-gradient(60% 60% at 50% 45%, ${p.accent}40, transparent 70%)` }} />
        <div className="relative rounded-2xl overflow-hidden glass-hover light-sweep" style={{ aspectRatio: "16 / 10", "--accent": p.accent }}>
          <BlogVisual cat={p.viz} />
        </div>
      </div>
      <div data-copy className={reversed ? "md:order-1" : ""}>
        <div className="flex items-center gap-3 mono text-xs">
          <span className="text-5xl md:text-6xl font-bold leading-none" style={{ color: p.accent, opacity: 0.22 }}>{p.n}</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "vpulse 3s ease-in-out infinite" }} />live in production</span>
        </div>
        <div className="mono text-[11px] uppercase tracking-wider mt-4" style={{ color: p.accent }}>{p.cat}</div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mt-1 flex items-center gap-2">{p.title}{p.link && <ArrowUpRight className="w-5 h-5 shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: p.accent }} />}</h3>
        <p className="text-slate-400 mt-3 leading-relaxed max-w-lg">{p.desc}</p>
        <div className="flex flex-wrap gap-2.5 mt-6">
          {p.metrics.map(([label, val]) => (
            <div key={label} className="glass glass-hover rounded-xl px-3.5 py-2 min-w-[86px]" style={{ "--accent": p.accent }}>
              <div className="text-white font-semibold text-sm tabular-nums">{val}</div>
              <div className="mono text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-5">{p.stack.map((s) => (<span key={s} className="px-2.5 py-1 rounded-md text-[11px] mono" style={{ background: `${p.accent}1f`, color: "#dbe3ff", border: `1px solid ${p.accent}33` }}>{s}</span>))}</div>
        <div className="mono text-xs text-slate-400 mt-5">{p.role}</div>
      </div>
    </article>
  );
}
