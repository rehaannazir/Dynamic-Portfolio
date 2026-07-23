import { memo } from "react";

export const SectionLabel = memo(function SectionLabel({ num, children }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-sm text-indigo-400">{num}</span><span className="font-mono text-sm text-slate-400">/</span>
      <span className="font-mono text-sm tracking-wide text-slate-400 uppercase">{children}</span>
      <span className="flex-1 h-px ml-2" style={{ background: "linear-gradient(90deg,rgba(139,92,246,0.4),transparent)" }} />
    </div>
  );
});
