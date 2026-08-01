import { memo } from "react";
import { Check, Minus, X } from "lucide-react";

/* Chapter 3's required diagram: the three ways to get knowledge into an LLM, compared on the
   axes that actually matter for a production decision. */
const ROWS = ["Update cost", "Freshness", "Fixes hallucination?", "Scales to a large corpus?"];
const COLS = [
  { name: "Prompt stuffing", col: "#64748b", vals: [
    { icon: Check, label: "free" },
    { icon: Check, label: "instant" },
    { icon: X, label: "no — still guessing beyond what fits" },
    { icon: X, label: "bounded by context window" },
  ]},
  { name: "Fine-tuning", col: "#f59e0b", vals: [
    { icon: X, label: "expensive, slow" },
    { icon: X, label: "stale until retrained" },
    { icon: Minus, label: "changes style, not grounding" },
    { icon: Check, label: "yes, at training time" },
  ]},
  { name: "RAG", col: "#8b5cf6", vals: [
    { icon: Check, label: "cheap — just re-index" },
    { icon: Check, label: "current as of last index" },
    { icon: Check, label: "yes — gives the model a real source" },
    { icon: Check, label: "yes — that's what retrieval is for" },
  ]},
];

export const KnowledgeMethodsDiagram = memo(function KnowledgeMethodsDiagram() {
  return (
    <div className="glass rounded-2xl p-5 my-8 overflow-x-auto not-prose"
      role="img" aria-label="Comparison of prompt stuffing, fine-tuning, and RAG across update cost, freshness, whether it fixes hallucination, and whether it scales to a large document corpus. RAG scores well on all four; prompt stuffing fails on scale; fine-tuning is slow to update and doesn't directly fix hallucination.">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr>
            <th className="text-left text-slate-400 mono text-xs font-normal pb-3 pr-4">&nbsp;</th>
            {COLS.map((c) => (
              <th key={c.name} className="text-left pb-3 px-3">
                <span className="mono text-xs font-semibold px-2 py-1 rounded" style={{ color: c.col, background: `${c.col}18` }}>{c.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, ri) => (
            <tr key={row} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <td className="text-slate-400 text-xs py-3 pr-4 whitespace-nowrap">{row}</td>
              {COLS.map((c) => {
                const v = c.vals[ri];
                const Icon = v.icon;
                return (
                  <td key={c.name} className="py-3 px-3 align-top">
                    <div className="flex items-start gap-1.5">
                      <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: c.col }} />
                      <span className="text-xs text-slate-300">{v.label}</span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
