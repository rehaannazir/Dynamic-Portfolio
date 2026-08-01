import { CircleCheck } from "lucide-react";
import { Reveal } from "@/lib/motion";

/* Closes every chapter — deliberately uses variant="scale" (vs LearningGoalCard's "up") so the
   open/close moments of a chapter don't feel identical, per the animation-variety rule. */
export function SummaryCard({ points = [] }) {
  return (
    <Reveal variant="scale" duration={0.7}>
      <div className="not-prose glass rounded-xl p-5 my-8" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.22)" }}>
        <div className="text-sm font-medium text-white mb-3">Chapter summary</div>
        <ul className="space-y-1.5">
          {points.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <CircleCheck className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#10b981" }} />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
