import { ArrowLeft, ArrowRight } from "lucide-react";

/* Intra-article navigation (go() scroll-spy jump, not a route change — the whole book is one
   page). `next` is optional: chapters not yet written render an honest "coming soon" card
   instead of linking to something that doesn't exist. */
export function ChapterPrevNext({ prev, next, go }) {
  return (
    <div className="not-prose grid sm:grid-cols-2 gap-3 mt-10 mb-4">
      {prev ? (
        <button onClick={() => go(prev.id)} className="glass glass-hover rounded-xl p-4 text-left" data-cursor>
          <div className="mono text-[11px] text-indigo-300/70 flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Previous</div>
          <div className="text-white font-medium text-sm mt-1">{prev.title}</div>
        </button>
      ) : <div />}
      {next ? (
        <button onClick={() => go(next.id)} className="glass glass-hover rounded-xl p-4 text-right" data-cursor>
          <div className="mono text-[11px] text-indigo-300/70 flex items-center justify-end gap-1">Next <ArrowRight className="w-3 h-3" /></div>
          <div className="text-white font-medium text-sm mt-1">{next.title}</div>
        </button>
      ) : (
        <div className="glass rounded-xl p-4 text-right opacity-60">
          <div className="mono text-[11px] text-slate-400">Next chapter</div>
          <div className="text-slate-400 font-medium text-sm mt-1">Coming soon</div>
        </div>
      )}
    </div>
  );
}
