import { memo } from "react";
import { BookMarked } from "lucide-react";

/* First appearance in Chapter 4. Ties a chapter's claims back to real, named sources — every
   citation is a {label, detail, href?} triple. Kept deliberately plain (no accordion, no
   animation) since its job is to be a trustworthy, scannable footnote strip, not a feature. */
export const References = memo(function References({ items = [] }) {
  return (
    <div className="not-prose glass rounded-xl p-5 my-8">
      <div className="flex items-center gap-2 mb-3">
        <BookMarked className="w-4 h-4 text-indigo-300" />
        <span className="text-sm font-medium text-white">References</span>
      </div>
      <ol className="space-y-2">
        {items.map((r, i) => (
          <li key={i} className="text-sm text-slate-400 flex gap-2">
            <span className="mono text-indigo-300/70 shrink-0">[{i + 1}]</span>
            <span>
              {r.href ? (
                <a href={r.href} target="_blank" rel="noreferrer" className="text-indigo-300 hover:text-white transition-colors underline underline-offset-2">{r.label}</a>
              ) : <span className="text-slate-300">{r.label}</span>}
              {r.detail && <span className="text-slate-500"> — {r.detail}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
});
