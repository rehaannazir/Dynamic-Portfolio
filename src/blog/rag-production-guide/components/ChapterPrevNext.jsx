import { ArrowLeft, ArrowRight } from "lucide-react";

/* Intra-article navigation (go() scroll-spy jump, not a route change — the whole book is one
   page). Three states per side, since chapters publish out of numeric order:
     - null              → true edge of the guide (nothing conceptually comes before/after)
     - { id, title }     → published chapter, clickable jump
     - { title, comingSoon: true } → planned chapter, named honestly, not yet a link */
function NavCard({ item, align, go }) {
  if (!item) return null;
  if (item.comingSoon) {
    return (
      <div className={`glass rounded-xl p-4 opacity-60 ${align === "right" ? "text-right" : "text-left"}`}>
        <div className={`mono text-[11px] text-slate-400 flex items-center gap-1 ${align === "right" ? "justify-end" : ""}`}>
          {align === "left" && <ArrowLeft className="w-3 h-3" />}
          {align === "left" ? "Previous" : "Next"}
          {align === "right" && <ArrowRight className="w-3 h-3" />}
        </div>
        <div className="text-slate-400 font-medium text-sm mt-1">{item.title} <span className="text-slate-500">(not yet published)</span></div>
      </div>
    );
  }
  return (
    <button onClick={() => go(item.id)} className={`glass glass-hover rounded-xl p-4 ${align === "right" ? "text-right" : "text-left"}`} data-cursor>
      <div className={`mono text-[11px] text-indigo-300/70 flex items-center gap-1 ${align === "right" ? "justify-end" : ""}`}>
        {align === "left" && <ArrowLeft className="w-3 h-3" />}
        {align === "left" ? "Previous" : "Next"}
        {align === "right" && <ArrowRight className="w-3 h-3" />}
      </div>
      <div className="text-white font-medium text-sm mt-1">{item.title}</div>
    </button>
  );
}

export function ChapterPrevNext({ prev, next, go }) {
  return (
    <div className="not-prose grid sm:grid-cols-2 gap-3 mt-10 mb-4">
      {prev ? <NavCard item={prev} align="left" go={go} /> : <div />}
      {next ? <NavCard item={next} align="right" go={go} /> : <div />}
    </div>
  );
}
