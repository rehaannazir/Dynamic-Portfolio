import { useState } from "react";
import { FileCheck, TriangleAlert } from "lucide-react";

/* Chapter 20's interactive — first appearance of the RAG Pipeline Simulator. Minimal version:
   toggle retrieval on/off and pick a query, watch the (canned, clearly-labeled) answer change.
   The point isn't a live LLM call — it's making the retrieval-on/off contrast something the
   reader controls themselves, one final time, now that they know exactly what's happening
   inside each stage. */
const QUERIES = [
  {
    q: "What's the cancellation policy for the Pro plan?",
    grounded: "Pro plan cancellations take effect immediately. No refund is issued for the current billing period.",
    ungrounded: "You can typically cancel anytime, often with a grace period of a few weeks — exact terms vary by provider.",
  },
  {
    q: "Does the Pro plan include API access?",
    grounded: "Yes — Pro includes API access with a rate limit of 1,000 requests per day.",
    ungrounded: "Most Pro-tier plans include some form of API access, though limits vary widely.",
  },
];

export function RagPipelineSimulator() {
  const [retrieval, setRetrieval] = useState(true);
  const [qi, setQi] = useState(0);
  const current = QUERIES[qi];

  return (
    <div className="glass rounded-2xl p-5 my-8 not-prose">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="mono text-xs text-slate-300">RAG pipeline simulator</span>
        <button onClick={() => setRetrieval((r) => !r)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full mono text-xs transition-all"
          style={{
            background: retrieval ? "rgba(16,185,129,0.14)" : "rgba(239,68,68,0.12)",
            border: `1px solid ${retrieval ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.3)"}`,
            color: retrieval ? "#34d399" : "#f87171",
          }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
          retrieval: {retrieval ? "ON" : "OFF"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {QUERIES.map((item, i) => (
          <button key={i} onClick={() => setQi(i)}
            className="mono text-[11px] px-2.5 py-1.5 rounded-lg text-left"
            style={{ background: qi === i ? "rgba(99,102,241,0.16)" : "transparent", border: `1px solid ${qi === i ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.1)"}`, color: qi === i ? "#a5b4fc" : "#94a3b8" }}>
            {item.q}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-4" style={{
        background: retrieval ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
        border: `1px solid ${retrieval ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.22)"}`,
      }}>
        <div className="flex items-center gap-2 mb-2">
          {retrieval ? <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> : <TriangleAlert className="w-3.5 h-3.5 text-red-400" />}
          <span className="mono text-[11px]" style={{ color: retrieval ? "#6ee7b7" : "#fca5a5" }}>
            {retrieval ? "grounded in retrieved context" : "no context retrieved — parametric memory only"}
          </span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{retrieval ? current.grounded : current.ungrounded}</p>
      </div>
      <p className="text-xs text-slate-500 mt-3">Canned answers, not a live model call — the point is the contrast, which every earlier chapter in this Part built one stage of.</p>
    </div>
  );
}
