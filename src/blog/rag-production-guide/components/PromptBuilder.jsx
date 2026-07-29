import { useState } from "react";
import { Wand2 } from "lucide-react";

/* Chapter 18's interactive: compose a grounded prompt from labeled, toggleable blocks and see
   the assembled result update live — the teaching point is that prompt structure is made of
   real, separable parts, not one wall of text. */
const BLOCKS = [
  { key: "system", label: "System instructions", col: "#3b82f6", required: true,
    text: "You are a helpful support assistant. Answer only using the context provided below." },
  { key: "context", label: "Retrieved context", col: "#8b5cf6", required: true,
    text: "[CONTEXT]\nPro plan cancellations take effect immediately. No refund is issued for the current billing period." },
  { key: "refusal", label: "Refusal instruction", col: "#f59e0b", required: false,
    text: "If the answer isn't contained in the context above, say you don't have that information — do not guess." },
  { key: "fewshot", label: "Few-shot example", col: "#10b981", required: false,
    text: "Example — Q: \"What's your uptime SLA?\" A: \"I don't have that information in the provided context.\"" },
  { key: "question", label: "User question", col: "#f472b6", required: true,
    text: "Question: What's the cancellation policy for the Pro plan?" },
];

export function PromptBuilder() {
  const [enabled, setEnabled] = useState(() => new Set(BLOCKS.filter((b) => b.required).map((b) => b.key)));

  const toggle = (key, required) => {
    if (required) return;
    setEnabled((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const assembled = BLOCKS.filter((b) => enabled.has(b.key)).map((b) => b.text).join("\n\n");

  return (
    <div className="glass rounded-2xl p-5 my-8 not-prose">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-4 h-4 text-indigo-300" />
        <span className="mono text-xs text-slate-300">Prompt builder</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {BLOCKS.map((b) => {
          const on = enabled.has(b.key);
          return (
            <button key={b.key} onClick={() => toggle(b.key, b.required)}
              disabled={b.required}
              className="mono text-[11px] px-2.5 py-1.5 rounded-lg transition-all disabled:cursor-not-allowed"
              style={{
                background: on ? `${b.col}22` : "transparent",
                border: `1px solid ${on ? b.col + "55" : "rgba(255,255,255,0.1)"}`,
                color: on ? b.col : "#64748b",
              }}>
              {b.label}{b.required && <span className="opacity-60"> · required</span>}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl p-4" style={{ background: "#0a0a0f", border: "1px solid rgba(255,255,255,0.06)" }}>
        <pre className="mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{assembled || "// toggle on at least the required blocks"}</pre>
      </div>
      <p className="text-xs text-slate-500 mt-3">Toggle the refusal instruction off and re-read the assembled prompt — nothing left tells the model what to do if the context doesn't contain the answer.</p>
    </div>
  );
}
