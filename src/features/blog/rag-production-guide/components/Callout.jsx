import { memo } from "react";
import { CircleCheck } from "lucide-react";

/* Same contract as the Python-automation article's Callout — kept as a per-article copy
   rather than a shared import, matching this codebase's existing convention of each blog
   article owning its own components/ folder. */
export const Callout = memo(function Callout({ icon: Icon = CircleCheck, color = "#6366f1", children }) {
  return (
    <div className="not-prose flex gap-3 rounded-xl p-4 my-6" style={{
      background: `${color}10`, border: `1px solid ${color}28`,
    }}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />
      <p className="text-sm text-slate-300 leading-relaxed">{children}</p>
    </div>
  );
});
