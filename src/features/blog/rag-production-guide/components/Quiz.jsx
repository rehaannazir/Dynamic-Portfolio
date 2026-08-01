import { memo, useState } from "react";
import { HelpCircle } from "lucide-react";

/* Per-chapter "quick check" — one question, instant client-side feedback, no backend. The
   heavier Part-boundary Quiz (checkpoint covering a whole Part) reuses this same shell later. */
export const Quiz = memo(function Quiz({ question, options, correct, explain }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="not-prose glass rounded-2xl p-5 my-8">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-4 h-4 text-indigo-300" />
        <span className="text-sm font-medium text-white">Quick check</span>
      </div>
      <p className="text-sm text-slate-300 mb-4">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const show = picked !== null;
          const isPicked = picked === i;
          const isCorrect = i === correct;
          const bg = show && isPicked ? (isCorrect ? "rgba(16,185,129,0.14)" : "rgba(239,68,68,0.12)") : "transparent";
          const border = show && isPicked ? (isCorrect ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.4)") : "rgba(255,255,255,0.08)";
          return (
            <button key={i} onClick={() => setPicked(i)} disabled={show}
              aria-pressed={isPicked}
              className="text-left px-4 py-2.5 rounded-lg text-sm text-slate-200 transition-all disabled:cursor-default"
              style={{ background: bg, border: `1px solid ${border}` }}>
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="text-xs mono mt-3" style={{ color: picked === correct ? "#34d399" : "#f87171" }} role="status">
          {picked === correct ? "Correct. " : "Not quite. "}{explain}
        </p>
      )}
    </div>
  );
});
