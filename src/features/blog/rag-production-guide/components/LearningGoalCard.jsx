import { Target } from "lucide-react";
import { Reveal } from "@/lib/motion";

/* Opens every chapter — sets expectation before content, per the "reader psychology" rule in
   the approved storytelling philosophy: never let a beginner feel lost about where they're headed. */
export function LearningGoalCard({ goals = [] }) {
  return (
    <Reveal variant="up" duration={0.7}>
      <div className="not-prose glass rounded-xl p-5 my-6" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.22)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4" style={{ color: "#10b981" }} />
          <span className="text-sm font-medium text-white">By the end of this chapter, you&apos;ll be able to</span>
        </div>
        <ul className="space-y-1.5">
          {goals.map((g, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-[7px] w-1 h-1 rounded-full shrink-0" style={{ background: "#10b981" }} />
              {g}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
