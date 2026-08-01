import { List } from "lucide-react";
import { TOC } from "../toc";

/* TOC SIDEBAR */
export function TocSidebar({ active, go }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <div className="flex items-center gap-2 mono text-xs text-slate-400 uppercase tracking-wide mb-4">
          <List className="w-4 h-4" /> On this page
        </div>
        <nav className="flex flex-col gap-0.5 border-l border-white/[0.07]">
          {TOC.map((s) => (
            <button key={s.id} onClick={() => go(s.id)}
              className="text-left text-xs pl-4 py-1.5 -ml-px border-l transition-all mono"
              style={{
                borderColor: active === s.id ? "#818cf8" : "transparent",
                color: active === s.id ? "#e2e8f0" : "#94a3b8",
              }}>
              {s.t}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
