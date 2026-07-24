import { List } from "lucide-react";
import { TOC } from "../toc";

/* Groups by `part` so the sidebar scales to 87 chapters without rework — with one chapter live
   today it renders a single group, and each new chapter added to toc.js slots into its Part
   automatically. */
export function TocSidebar({ active, go }) {
  const parts = [];
  for (const s of TOC) {
    let group = parts.find((p) => p.part === s.part);
    if (!group) { group = { part: s.part, items: [] }; parts.push(group); }
    group.items.push(s);
  }
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <div className="flex items-center gap-2 mono text-xs text-slate-400 uppercase tracking-wide mb-4">
          <List className="w-4 h-4" /> On this page
        </div>
        {parts.map((group) => (
          <div key={group.part} className="mb-4">
            <div className="mono text-[10px] uppercase tracking-wider text-indigo-300/60 mb-1.5">{group.part}</div>
            <nav className="flex flex-col gap-0.5 border-l border-white/[0.07]">
              {group.items.map((s) => (
                <button key={s.id} onClick={() => go(s.id)}
                  className="text-left text-xs pl-4 py-1.5 -ml-px border-l transition-all mono"
                  style={{ borderColor: active === s.id ? "#818cf8" : "transparent", color: active === s.id ? "#e2e8f0" : "#94a3b8" }}>
                  {s.t}
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
