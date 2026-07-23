import { memo, useState } from "react";
import { ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────────────────────── */
export const FaqItem = memo(function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="not-prose border rounded-xl overflow-hidden transition-all" style={{ borderColor: open ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)", background: open ? "rgba(99,102,241,0.06)" : "transparent" }}>
      <button className="w-full flex items-center justify-between px-5 py-4 text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="text-white font-medium text-sm pr-4">{q}</span>
        <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 transition-transform" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }} />
      </button>
      <div className="faq-answer" style={{ maxHeight: open ? "400px" : "0" }}>
        <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
});
