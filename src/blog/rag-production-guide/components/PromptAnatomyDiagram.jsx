import { memo } from "react";

/* Chapter 18's required diagram: a labeled anatomy of a grounded prompt, static reference
   distinct from the PromptBuilder's live-assembled version below it. */
const PARTS = [
  { label: "System instructions", col: "#3b82f6", note: "who the model is, how strictly to use context" },
  { label: "Retrieved context", col: "#8b5cf6", note: "the chunks Chapter 17 retrieved, labeled clearly" },
  { label: "Refusal instruction", col: "#f59e0b", note: "what to do when context doesn't have the answer" },
  { label: "User question", col: "#f472b6", note: "the original query, verbatim" },
];

export const PromptAnatomyDiagram = memo(function PromptAnatomyDiagram() {
  return (
    <div className="glass rounded-2xl p-5 my-8 not-prose" role="img"
      aria-label="Anatomy of a grounded prompt: system instructions, retrieved context, a refusal instruction for insufficient context, and the user question, stacked in order.">
      <div className="flex flex-col gap-2 max-w-md mx-auto">
        {PARTS.map((p) => (
          <div key={p.label} className="rounded-lg px-3 py-2.5" style={{ background: `${p.col}14`, border: `1px solid ${p.col}38` }}>
            <div className="mono text-xs font-semibold" style={{ color: p.col }}>{p.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{p.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
