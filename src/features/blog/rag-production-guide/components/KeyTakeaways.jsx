import { ListChecks } from "lucide-react";

/* First appearance, at the end of Part III (Chapter 20). Distinct from the per-chapter
   SummaryCard: this is a Part-level rollup, numbered (reinforcing "this Part had N ideas"),
   each item a clickable jump back to the chapter it came from — a navigational aid, not a
   comprehension check. */
export function KeyTakeaways({ items = [], go }) {
  return (
    <div className="not-prose glass rounded-2xl p-5 my-8">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-4 h-4 text-indigo-300" />
        <span className="text-sm font-medium text-white">Part III key takeaways</span>
      </div>
      <ol className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mono text-xs text-indigo-300/70 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <button onClick={() => go(item.id)} className="text-left text-sm text-slate-300 hover:text-white transition-colors">
              {item.text}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
